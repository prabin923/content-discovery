import pool from '../config/db';
import type { ContentItem } from '@discovery-hub/shared';
import { categorizeContent, generatePseudoEmbedding } from './aiService';

export async function upsertContentItem(item: ContentItem): Promise<number> {
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

  const result = await pool.query(
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
      RETURNING id
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

  return result.rows[0].id as number;
}
