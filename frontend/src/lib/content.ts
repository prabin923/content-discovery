import type { ContentItem, ContentType, DbContentRow } from '@discovery-hub/shared';

export function mapDbRowToContentItem(row: DbContentRow): ContentItem {
  return {
    id: row.id,
    type: row.type as ContentType,
    title: row.title,
    description: row.description ?? '',
    thumbnailUrl: row.thumbnail_url,
    sourceUrl: row.source_url,
    sourcePlatform: row.source_platform,
    sourceId: row.source_id,
    tags: row.tags ?? [],
    publishedDate: row.published_date,
    metadata: row.metadata ?? {},
  };
}
