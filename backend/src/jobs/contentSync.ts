import cron from 'node-cron';
import pool from '../config/db';
import { discoverProducts } from '../services/productService';
import { discoverPapers } from '../services/paperService';
import { discoverYouTubeContent } from '../services/youtubeService';
import type { ContentItem } from '@discovery-hub/shared';
import { categorizeContent, generatePseudoEmbedding } from '../services/aiService';

async function upsertContent(item: ContentItem): Promise<void> {
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

async function runScheduledSync(): Promise<void> {
  const startedAt = Date.now();
  const errors: string[] = [];

  try {
    const [products, papers, videos] = await Promise.all([
      discoverProducts({ q: 'innovation', limit: 20 }).catch((error: unknown) => {
        errors.push(`products: ${(error as Error).message}`);
        return [];
      }),
      discoverPapers({ q: 'machine learning', limit: 20 }).catch((error: unknown) => {
        errors.push(`papers: ${(error as Error).message}`);
        return [];
      }),
      discoverYouTubeContent({ q: 'technology trends', limit: 20 }).catch((error: unknown) => {
        errors.push(`youtube: ${(error as Error).message}`);
        return [];
      }),
    ]);

    const merged = [...products, ...papers, ...videos];
    for (const item of merged) {
      await upsertContent(item);
    }

    await pool.query(
      `
      INSERT INTO sync_logs (source_platform, items_synced, items_added, items_updated, sync_duration_ms, status, error_message, synced_at)
      VALUES ('all', $1, $1, 0, $2, $3, $4, NOW())
      `,
      [merged.length, Date.now() - startedAt, errors.length ? 'partial' : 'success', errors.join('; ') || null]
    );
  } catch (error) {
    await pool.query(
      `
      INSERT INTO sync_logs (source_platform, items_synced, items_added, items_updated, sync_duration_ms, status, error_message, synced_at)
      VALUES ('all', 0, 0, 0, $1, 'failed', $2, NOW())
      `,
      [Date.now() - startedAt, (error as Error).message]
    );
    console.error('Scheduled sync failure:', error);
  }
}

export function startContentSyncJob(): void {
  const schedule = process.env.CONTENT_SYNC_CRON ?? '*/30 * * * *';
  cron.schedule(schedule, () => {
    void runScheduledSync();
  });
  console.log(`✓ Content sync job started (${schedule})`);
}
