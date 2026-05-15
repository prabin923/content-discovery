import { Router, Request, Response } from 'express';
import pool from '../config/db';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/feed', async (req: Request, res: Response) => {
  try {
    const userResult = await pool.query(
      `
      SELECT interests
      FROM users
      WHERE id = $1
      `,
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const interests = (userResult.rows[0].interests as string[] | null) ?? [];

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
        (
          CASE
            WHEN $1::text[] IS NOT NULL AND c.tags && $1::text[] THEN 3
            ELSE 0
          END
          + COALESCE(interaction_score.score, 0)
          + COALESCE(c.like_count, 0) * 0.01
        ) AS score
      FROM content c
      LEFT JOIN (
        SELECT ui.content_id, COUNT(*)::float AS score
        FROM user_interactions ui
        WHERE ui.user_id = $2
        GROUP BY ui.content_id
      ) interaction_score ON interaction_score.content_id = c.id
      ORDER BY score DESC, COALESCE(c.published_date, c.created_at) DESC
      LIMIT 50
      `,
      [interests.length > 0 ? interests : null, req.userId]
    );

    res.status(200).json({
      userInterests: interests,
      items: recommended.rows,
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Failed to load personalized feed' });
  }
});

export default router;
