import { Router, Request, Response } from 'express';
import pool from '../config/db';
import { authMiddleware } from '../middleware/authMiddleware';
import { optionalAuthMiddleware } from '../middleware/optionalAuthMiddleware';
import { validateBody, validateQuery } from '../middleware/validate';
import { ingestContentSchema, searchQuerySchema } from '../validation/schemas';
import { discoverYouTubeContent } from '../services/youtubeService';
import { discoverProducts } from '../services/productService';
import { discoverPapers } from '../services/paperService';
import type { ContentItem } from '@discovery-hub/shared';
import { categorizeContent, generatePseudoEmbedding } from '../services/aiService';
import { upsertContentItem } from '../services/contentRepository';
import { searchContent } from '../services/contentSearch';
import { recordView } from '../services/interactionService';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();
const discoverRateLimit = rateLimit({ windowMs: 60 * 1000, max: 40 });

function parseLimit(raw: unknown): number {
  const numeric = Number(raw);
  if (Number.isNaN(numeric)) {
    return 10;
  }
  return Math.max(1, Math.min(50, Math.trunc(numeric)));
}

function parseQuery(req: Request): { q: string; limit: number; source: string } {
  const q = typeof req.query.q === 'string' && req.query.q.trim() ? req.query.q.trim() : 'technology';
  const source =
    typeof req.query.source === 'string' && req.query.source.trim()
      ? req.query.source.trim().toLowerCase()
      : 'all';
  return { q, limit: parseLimit(req.query.limit), source };
}

async function fetchSources(
  source: string,
  q: string,
  limit: number
): Promise<{ items: ContentItem[]; errors: string[] }> {
  const jobs: Array<Promise<ContentItem[]>> = [];
  const errors: string[] = [];

  if (source === 'all' || source === 'youtube') {
    jobs.push(
      discoverYouTubeContent({ q, limit }).catch((error: unknown) => {
        errors.push(`youtube: ${(error as Error).message}`);
        return [];
      })
    );
  }
  if (source === 'all' || source === 'products') {
    jobs.push(
      discoverProducts({ q, limit }).catch((error: unknown) => {
        errors.push(`products: ${(error as Error).message}`);
        return [];
      })
    );
  }
  if (source === 'all' || source === 'papers') {
    jobs.push(
      discoverPapers({ q, limit }).catch((error: unknown) => {
        errors.push(`papers: ${(error as Error).message}`);
        return [];
      })
    );
  }

  const resultSets = await Promise.all(jobs);
  return { items: resultSets.flat(), errors };
}

router.get('/search', validateQuery(searchQuerySchema), async (req: Request, res: Response) => {
  const query = (req as Request & { validatedQuery: { q: string; type?: string; page?: number; limit?: number } })
    .validatedQuery;

  try {
    const { items, meta } = await searchContent({
      q: query.q,
      type: query.type ?? null,
      page: query.page,
      limit: query.limit,
    });

    res.status(200).json({
      query: { q: query.q, type: query.type ?? null, page: meta.page, limit: meta.limit },
      total: meta.total,
      page: meta.page,
      limit: meta.limit,
      totalPages: meta.totalPages,
      items,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search content library' });
  }
});

router.post('/ingest', authMiddleware, validateBody(ingestContentSchema), async (req: Request, res: Response) => {
  const body = req.body as {
    type: ContentItem['type'];
    title: string;
    description?: string;
    thumbnailUrl?: string | null;
    sourceUrl: string;
    sourcePlatform: string;
    sourceId: string;
    tags?: string[];
    publishedDate?: string | null;
    metadata?: Record<string, unknown>;
  };

  try {
    const id = await upsertContentItem({
      type: body.type,
      title: body.title,
      description: body.description ?? '',
      thumbnailUrl: body.thumbnailUrl ?? null,
      sourceUrl: body.sourceUrl,
      sourcePlatform: body.sourcePlatform,
      sourceId: body.sourceId,
      tags: body.tags ?? [],
      publishedDate: body.publishedDate ?? null,
      metadata: body.metadata ?? {},
    });

    res.status(201).json({ id, message: 'Content saved to library' });
  } catch (error) {
    console.error('Ingest error:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

router.post('/:contentId/view', optionalAuthMiddleware, async (req: Request, res: Response) => {
  const contentId = Number(req.params.contentId);
  if (!Number.isInteger(contentId)) {
    res.status(400).json({ error: 'Invalid content ID' });
    return;
  }

  try {
    const exists = await pool.query('SELECT id FROM content WHERE id = $1', [contentId]);
    if (exists.rows.length === 0) {
      res.status(404).json({ error: 'Content not found' });
      return;
    }

    await recordView(contentId, req.userId);
    res.status(200).json({ message: 'View recorded' });
  } catch (error) {
    console.error('View error:', error);
    res.status(500).json({ error: 'Failed to record view' });
  }
});

router.get('/discover', discoverRateLimit, async (req: Request, res: Response) => {
  try {
    const { q, limit, source } = parseQuery(req);
    const { items, errors } = await fetchSources(source, q, limit);

    res.status(200).json({
      query: { q, source, limit },
      total: items.length,
      errors,
      items,
    });
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ error: 'Failed to discover content' });
  }
});

router.post('/sync', authMiddleware, async (req: Request, res: Response) => {
  const startedAt = Date.now();
  const { q, limit, source } = parseQuery(req);

  try {
    const { items, errors } = await fetchSources(source, q, limit);
    for (const item of items) {
      await upsertContentItem(item);
    }

    await pool.query(
      `
      INSERT INTO sync_logs (source_platform, items_synced, items_added, items_updated, sync_duration_ms, status, synced_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `,
      [source, items.length, items.length, 0, Date.now() - startedAt, errors.length ? 'partial' : 'success']
    );

    res.status(200).json({
      message: 'Sync completed',
      query: { q, source, limit },
      syncedItems: items.length,
      errors,
    });
  } catch (error) {
    const message = (error as Error).message;
    await pool.query(
      `
      INSERT INTO sync_logs (source_platform, items_synced, items_added, items_updated, sync_duration_ms, status, error_message, synced_at)
      VALUES ($1, 0, 0, 0, $2, 'failed', $3, NOW())
      `,
      [source, Date.now() - startedAt, message]
    );
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync content' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT id, type, title, description, thumbnail_url, source_url, source_platform, source_id, tags, metadata, published_date, view_count, like_count, created_at, updated_at
      FROM content
      ORDER BY COALESCE(published_date, created_at) DESC
      LIMIT 100
      `
    );
    res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error('List content error:', error);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

router.post('/categorize', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT id, title, description, tags
      FROM content
      ORDER BY updated_at DESC
      LIMIT 200
      `
    );

    for (const row of result.rows) {
      const categorization = categorizeContent(row.title as string, (row.description as string) ?? '');
      const embedding = generatePseudoEmbedding(row.title as string, (row.description as string) ?? '');
      const currentTags = Array.isArray(row.tags) ? (row.tags as string[]) : [];

      const categoryResult = await pool.query(
        `
        INSERT INTO categories (name, slug, description, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
        `,
        [
          categorization.category,
          categorization.category.toLowerCase().replace(/\s+/g, '-'),
          `Auto-generated category for ${categorization.category}`,
        ]
      );

      await pool.query(
        `
        UPDATE content
        SET category_id = $1,
            tags = $2::text[],
            embeddings = $3::float8[],
            updated_at = NOW()
        WHERE id = $4
        `,
        [categoryResult.rows[0].id as number, [...new Set([...currentTags, ...categorization.tags])], embedding, row.id as number]
      );
    }

    res.status(200).json({ message: 'Categorization completed', processed: result.rows.length });
  } catch (error) {
    console.error('Categorization error:', error);
    res.status(500).json({ error: 'Failed to categorize content' });
  }
});

export default router;
