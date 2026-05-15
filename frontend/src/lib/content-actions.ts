import type { ContentItem } from '@discovery-hub/shared';
import { apiRequest } from './api';

export async function ensureContentId(item: ContentItem): Promise<number> {
  if (item.id) {
    return item.id;
  }

  const result = await apiRequest<{ id: number }>('/api/content/ingest', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(item),
  });

  return result.id;
}
