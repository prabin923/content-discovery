import { Router, Request, Response } from 'express';
import pool from '../config/db';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/me', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT id, email, username, first_name, last_name, bio, avatar_url, interests, created_at, updated_at
      FROM users
      WHERE id = $1
      `,
      [req.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

router.patch('/me', async (req: Request, res: Response) => {
  const { firstName, lastName, bio, avatarUrl, interests } = req.body as {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatarUrl?: string;
    interests?: string[];
  };

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        bio = COALESCE($3, bio),
        avatar_url = COALESCE($4, avatar_url),
        interests = COALESCE($5::text[], interests),
        updated_at = NOW()
      WHERE id = $6
      RETURNING id, email, username, first_name, last_name, bio, avatar_url, interests, created_at, updated_at
      `,
      [firstName ?? null, lastName ?? null, bio ?? null, avatarUrl ?? null, interests ?? null, req.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/me/saved', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT
        c.id, c.type, c.title, c.description, c.thumbnail_url, c.source_url, c.source_platform, c.source_id, c.tags, c.metadata, c.published_date
      FROM saved_items s
      INNER JOIN content c ON c.id = s.content_id
      WHERE s.user_id = $1
      ORDER BY s.saved_at DESC
      `,
      [req.userId]
    );

    res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error('List saved error:', error);
    res.status(500).json({ error: 'Failed to load saved items' });
  }
});

router.post('/me/saved/:contentId', async (req: Request, res: Response) => {
  const contentId = Number(req.params.contentId);
  if (!Number.isInteger(contentId)) {
    res.status(400).json({ error: 'Invalid content ID' });
    return;
  }

  try {
    await pool.query(
      `
      INSERT INTO saved_items (user_id, content_id, saved_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, content_id) DO NOTHING
      `,
      [req.userId, contentId]
    );

    res.status(201).json({ message: 'Content saved' });
  } catch (error) {
    console.error('Save content error:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

router.delete('/me/saved/:contentId', async (req: Request, res: Response) => {
  const contentId = Number(req.params.contentId);
  if (!Number.isInteger(contentId)) {
    res.status(400).json({ error: 'Invalid content ID' });
    return;
  }

  try {
    await pool.query(
      `
      DELETE FROM saved_items
      WHERE user_id = $1 AND content_id = $2
      `,
      [req.userId, contentId]
    );
    res.status(200).json({ message: 'Content removed from saved items' });
  } catch (error) {
    console.error('Unsave content error:', error);
    res.status(500).json({ error: 'Failed to remove saved content' });
  }
});

export default router;
