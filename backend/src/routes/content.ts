import { Router, Request, Response } from 'express';
import pool from '../config/db';
import { authMiddleware } from '../middleware/authMiddleware';
import { discoverYouTubeContent } from '../services/youtubeService';
import { discoverProducts } from '../services/productService';
import { discoverPapers } from '../services/paperService';
import type { ContentItem } from '@discovery-hub/shared';
import { categorizeContent, generatePseudoEmbedding } from '../services/aiService';

const router = Router();

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

async function upsertContentItem(item: ContentItem): Promise<void> {
  const categorization = categorizeContent(item.title, item.description);
  const embedding = generatePseudoEmbedding(item.title, item.description);

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
  const categoryId = categoryResult.rows[0].id as number;

  const mergedTags = [...new Set([...categorization.tags, ...item.tags])];

  await pool.query(
    `
      INSERT INTO content (
        type, title, description, thumbnail_url, source_url, source_platform, source_id, category_id, tags, embeddings, metadata, published_date, synced_at, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9::text[], $10::float8[], $11::jsonb, $12, NOW(), NOW(), NOW()
      )
      ON CONFLICT (source_id)
      DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        thumbnail_url = EXCLUDED.thumbnail_url,
        source_url = EXCLUDED.source_url,
        source_platform = EXCLUDED.source_platform,
        category_id = EXCLUDED.category_id,
        tags = EXCLUDED.tags,
        embeddings = EXCLUDED.embeddings,
        metadata = EXCLUDED.metadata,
        published_date = EXCLUDED.published_date,
        synced_at = NOW(),
        updated_at = NOW()
    `,
    [
      item.type,
      item.title,
      item.description,
      item.thumbnailUrl,
      item.sourceUrl,
      item.sourcePlatform,
      item.sourceId,
      categoryId,
      mergedTags,
      embedding,
      JSON.stringify(item.metadata),
      item.publishedDate,
    ]
  );
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

router.get('/discover', async (req: Request, res: Response) => {
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
