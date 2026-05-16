import { Router, Request, Response } from 'express';
import pool from '../config/db';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validate';
import { preferencesSchema } from '../validation/schemas';
import { recordInteraction } from '../services/interactionService';

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

router.get('/me/saved/ids', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT content_id FROM saved_items WHERE user_id = $1`,
      [req.userId]
    );
    res.status(200).json({ contentIds: result.rows.map((row) => row.content_id as number) });
  } catch (error) {
    console.error('List saved ids error:', error);
    res.status(500).json({ error: 'Failed to load saved ids' });
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

    await recordInteraction(req.userId!, contentId, 'save');

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

async function ensurePreferences(userId: number) {
  await pool.query(
    `
    INSERT INTO user_preferences (user_id, preferred_categories, notification_enabled, email_digest, theme, updated_at)
    VALUES ($1, '{}', TRUE, TRUE, 'light', NOW())
    ON CONFLICT (user_id) DO NOTHING
    `,
    [userId]
  );
}

router.get('/me/preferences', async (req: Request, res: Response) => {
  try {
    await ensurePreferences(req.userId!);
    const result = await pool.query(
      `
      SELECT preferred_categories, notification_enabled, email_digest, theme
      FROM user_preferences
      WHERE user_id = $1
      `,
      [req.userId]
    );
    res.status(200).json({ preferences: result.rows[0] });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to load preferences' });
  }
});

router.patch('/me/preferences', validateBody(preferencesSchema), async (req: Request, res: Response) => {
  const { preferredCategories, notificationEnabled, emailDigest, theme } = req.body as {
    preferredCategories?: string[];
    notificationEnabled?: boolean;
    emailDigest?: boolean;
    theme?: 'light' | 'dark' | 'system';
  };

  try {
    await ensurePreferences(req.userId!);
    const result = await pool.query(
      `
      UPDATE user_preferences
      SET
        preferred_categories = COALESCE($1::text[], preferred_categories),
        notification_enabled = COALESCE($2, notification_enabled),
        email_digest = COALESCE($3, email_digest),
        theme = COALESCE($4, theme),
        updated_at = NOW()
      WHERE user_id = $5
      RETURNING preferred_categories, notification_enabled, email_digest, theme
      `,
      [preferredCategories ?? null, notificationEnabled ?? null, emailDigest ?? null, theme ?? null, req.userId]
    );
    res.status(200).json({ preferences: result.rows[0] });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export default router;
