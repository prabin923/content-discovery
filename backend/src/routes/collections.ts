import { Router, Request, Response } from 'express';
import pool from '../config/db';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/mine', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT c.id, c.title, c.description, c.cover_image_url, c.is_public, c.upvote_count, c.created_at, c.updated_at, u.id AS curator_id, u.username
      FROM collections c
      INNER JOIN users u ON u.id = c.curator_id
      WHERE c.curator_id = $1
      ORDER BY c.updated_at DESC
      `,
      [req.userId]
    );
    res.status(200).json({ collections: result.rows });
  } catch (error) {
    console.error('List my collections error:', error);
    res.status(500).json({ error: 'Failed to load your collections' });
  }
});

router.get('/public', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT c.id, c.title, c.description, c.cover_image_url, c.upvote_count, c.created_at, c.updated_at, u.id AS curator_id, u.username
      FROM collections c
      INNER JOIN users u ON u.id = c.curator_id
      WHERE c.is_public = TRUE
      ORDER BY c.upvote_count DESC, c.created_at DESC
      LIMIT 100
      `
    );
    res.status(200).json({ collections: result.rows });
  } catch (error) {
    console.error('List collections error:', error);
    res.status(500).json({ error: 'Failed to load collections' });
  }
});

router.get('/:collectionId', async (req: Request, res: Response) => {
  const collectionId = Number(req.params.collectionId);
  if (!Number.isInteger(collectionId)) {
    res.status(400).json({ error: 'Invalid collection ID' });
    return;
  }

  try {
    const collectionResult = await pool.query(
      `
      SELECT c.id, c.title, c.description, c.cover_image_url, c.is_public, c.upvote_count, c.created_at, c.updated_at, u.id AS curator_id, u.username
      FROM collections c
      INNER JOIN users u ON u.id = c.curator_id
      WHERE c.id = $1
      `,
      [collectionId]
    );

    if (collectionResult.rows.length === 0) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    const itemsResult = await pool.query(
      `
      SELECT ci.position, ci.added_at, c.id AS content_id, c.type, c.title, c.description, c.thumbnail_url, c.source_url, c.source_platform
      FROM collection_items ci
      INNER JOIN content c ON c.id = ci.content_id
      WHERE ci.collection_id = $1
      ORDER BY ci.position ASC NULLS LAST, ci.added_at ASC
      `,
      [collectionId]
    );

    res.status(200).json({
      collection: collectionResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({ error: 'Failed to load collection' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { title, description, coverImageUrl, isPublic } = req.body as {
    title?: string;
    description?: string;
    coverImageUrl?: string;
    isPublic?: boolean;
  };

  if (!title || !title.trim()) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO collections (curator_id, title, description, cover_image_url, is_public, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, curator_id, title, description, cover_image_url, is_public, upvote_count, created_at, updated_at
      `,
      [req.userId, title.trim(), description ?? null, coverImageUrl ?? null, isPublic ?? true]
    );

    res.status(201).json({ collection: result.rows[0] });
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

router.post('/:collectionId/items', authMiddleware, async (req: Request, res: Response) => {
  const collectionId = Number(req.params.collectionId);
  const { contentId, position } = req.body as { contentId?: number; position?: number };

  if (!Number.isInteger(collectionId) || !Number.isInteger(contentId)) {
    res.status(400).json({ error: 'Valid collectionId and contentId are required' });
    return;
  }

  try {
    const ownerCheck = await pool.query(
      'SELECT curator_id FROM collections WHERE id = $1',
      [collectionId]
    );

    if (ownerCheck.rows.length === 0) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    if (ownerCheck.rows[0].curator_id !== req.userId) {
      res.status(403).json({ error: 'Only the curator can modify this collection' });
      return;
    }

    await pool.query(
      `
      INSERT INTO collection_items (collection_id, content_id, position, added_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (collection_id, content_id)
      DO UPDATE SET position = EXCLUDED.position
      `,
      [collectionId, contentId, Number.isInteger(position) ? position : null]
    );

    res.status(201).json({ message: 'Collection item saved' });
  } catch (error) {
    console.error('Add collection item error:', error);
    res.status(500).json({ error: 'Failed to update collection items' });
  }
});

router.delete('/:collectionId/items/:contentId', authMiddleware, async (req: Request, res: Response) => {
  const collectionId = Number(req.params.collectionId);
  const contentId = Number(req.params.contentId);

  if (!Number.isInteger(collectionId) || !Number.isInteger(contentId)) {
    res.status(400).json({ error: 'Valid collectionId and contentId are required' });
    return;
  }

  try {
    const ownerCheck = await pool.query('SELECT curator_id FROM collections WHERE id = $1', [collectionId]);

    if (ownerCheck.rows.length === 0) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    if (ownerCheck.rows[0].curator_id !== req.userId) {
      res.status(403).json({ error: 'Only the curator can modify this collection' });
      return;
    }

    await pool.query(
      `DELETE FROM collection_items WHERE collection_id = $1 AND content_id = $2`,
      [collectionId, contentId]
    );

    res.status(200).json({ message: 'Item removed from collection' });
  } catch (error) {
    console.error('Remove collection item error:', error);
    res.status(500).json({ error: 'Failed to remove collection item' });
  }
});

router.post('/:collectionId/vote', authMiddleware, async (req: Request, res: Response) => {
  const collectionId = Number(req.params.collectionId);
  const { voteType } = req.body as { voteType?: 'upvote' | 'downvote' };

  if (!Number.isInteger(collectionId)) {
    res.status(400).json({ error: 'Invalid collection ID' });
    return;
  }
  if (voteType !== 'upvote' && voteType !== 'downvote') {
    res.status(400).json({ error: "voteType must be 'upvote' or 'downvote'" });
    return;
  }

  const voteValue = voteType === 'upvote' ? 1 : -1;

  try {
    await pool.query('BEGIN');

    const previousVoteResult = await pool.query(
      'SELECT vote_type FROM collection_votes WHERE collection_id = $1 AND user_id = $2',
      [collectionId, req.userId]
    );

    await pool.query(
      `
      INSERT INTO collection_votes (collection_id, user_id, vote_type, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (collection_id, user_id)
      DO UPDATE SET vote_type = EXCLUDED.vote_type, created_at = NOW()
      `,
      [collectionId, req.userId, voteType]
    );

    let delta = voteValue;
    if (previousVoteResult.rows.length > 0) {
      const previousVoteType = previousVoteResult.rows[0].vote_type as 'upvote' | 'downvote';
      const previousValue = previousVoteType === 'upvote' ? 1 : -1;
      delta = voteValue - previousValue;
    }

    await pool.query(
      'UPDATE collections SET upvote_count = upvote_count + $1, updated_at = NOW() WHERE id = $2',
      [delta, collectionId]
    );

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Vote recorded' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

export default router;
