import { Router, Request, Response } from 'express';
import pool from '../config/db';
import { authMiddleware } from '../middleware/authMiddleware';
import { averageEmbedding, cosineSimilarity } from '../utils/embedding';

const router = Router();

router.use(authMiddleware);

router.get('/feed', async (req: Request, res: Response) => {
  try {
    const userResult = await pool.query(
      `SELECT interests FROM users WHERE id = $1`,
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const interests = (userResult.rows[0].interests as string[] | null) ?? [];

    const savedEmbeddingsResult = await pool.query(
      `
      SELECT c.embeddings
      FROM saved_items s
      INNER JOIN content c ON c.id = s.content_id
      WHERE s.user_id = $1 AND c.embeddings IS NOT NULL
      ORDER BY s.saved_at DESC
      LIMIT 10
      `,
      [req.userId]
    );

    const savedVectors = savedEmbeddingsResult.rows
      .map((row) => row.embeddings as number[] | null)
      .filter((vector): vector is number[] => Array.isArray(vector) && vector.length > 0);

    const profileVector = averageEmbedding(savedVectors);

    const recommended = await pool.query(
      `
      SELECT
        c.id,
        c.type,
        c.title,
        c.description,
        c.thumbnail_url,
        c.source_url,
        c.source_platform,
        c.source_id,
        c.tags,
        c.metadata,
        c.published_date,
        c.embeddings,
        (
          CASE
            WHEN $1::text[] IS NOT NULL AND c.tags && $1::text[] THEN 3
            ELSE 0
          END
          + COALESCE(interaction_score.score, 0) * 2
          + COALESCE(c.view_count, 0) * 0.001
          + COALESCE(c.like_count, 0) * 0.01
        ) AS base_score
      FROM content c
      LEFT JOIN (
        SELECT ui.content_id, COUNT(*)::float AS score
        FROM user_interactions ui
        WHERE ui.user_id = $2
        GROUP BY ui.content_id
      ) interaction_score ON interaction_score.content_id = c.id
      ORDER BY base_score DESC, COALESCE(c.published_date, c.created_at) DESC
      LIMIT 80
      `,
      [interests.length > 0 ? interests : null, req.userId]
    );

    const ranked = recommended.rows
      .map((row) => {
        const embeddings = row.embeddings as number[] | null;
        const similarity =
          profileVector.length > 0 && Array.isArray(embeddings)
            ? cosineSimilarity(profileVector, embeddings)
            : 0;
        const score = Number(row.base_score) + similarity * 4;
        const { embeddings: _omit, base_score: _base, ...item } = row;
        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
      .map(({ score: _score, ...item }) => item);

    res.status(200).json({
      userInterests: interests,
      items: ranked,
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Failed to load personalized feed' });
  }
});

export default router;
