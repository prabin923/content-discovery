export interface CollectionSummary {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  upvote_count: number;
  created_at: string;
  updated_at: string;
  curator_id: number;
  username: string;
  is_public?: boolean;
}

export interface CollectionDetail extends CollectionSummary {
  is_public: boolean;
}

export interface CollectionContentItem {
  position: number | null;
  added_at: string;
  content_id: number;
  type: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  source_url: string;
  source_platform: string;
}

export interface PublicCollectionsResponse {
  collections: CollectionSummary[];
}

export interface CollectionDetailResponse {
  collection: CollectionDetail;
  items: CollectionContentItem[];
}

export interface CreateCollectionRequest {
  title: string;
  description?: string;
  coverImageUrl?: string;
  isPublic?: boolean;
}
