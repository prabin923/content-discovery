export type ContentType = 'video' | 'product' | 'paper';

export type ContentSource = 'youtube' | 'products' | 'papers';

export type DiscoverSource = ContentSource | 'all';

export interface ContentItem {
  id?: number;
  type: ContentType;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  sourceUrl: string;
  sourcePlatform: string;
  sourceId: string;
  tags: string[];
  publishedDate: string | null;
  metadata: Record<string, unknown>;
}

/** Row shape from GET /api/content or /api/recommendations/feed */
export interface DbContentRow {
  id: number;
  type: ContentType;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  source_url: string;
  source_platform: string;
  source_id: string;
  tags: string[] | null;
  metadata: Record<string, unknown> | null;
  published_date: string | null;
}

export interface FeedResponse {
  userInterests: string[];
  items: DbContentRow[];
}

/** @deprecated Use ContentItem */
export type DiscoveredContent = ContentItem;

export interface DiscoveryQuery {
  q: string;
  limit: number;
}

export interface DiscoverResponse {
  query: {
    q: string;
    source: string;
    limit: number;
  };
  total: number;
  errors: string[];
  items: ContentItem[];
}
