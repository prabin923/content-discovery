import type { ContentItem, DiscoveryQuery } from '@discovery-hub/shared';

function buildYoutubeUrl(query: DiscoveryQuery): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is required for YouTube discovery');
  }

  const params = new URLSearchParams({
    part: 'snippet',
    q: query.q,
    maxResults: String(query.limit),
    type: 'video',
    order: 'relevance',
    key: apiKey,
  });

  return `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
}

export async function discoverYouTubeContent(
  query: DiscoveryQuery
): Promise<ContentItem[]> {
  const response = await fetch(buildYoutubeUrl(query));
  if (!response.ok) {
    throw new Error(`YouTube API failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        description?: string;
        publishedAt?: string;
        thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
        channelTitle?: string;
      };
    }>;
  };

  return (data.items ?? [])
    .filter((item) => item.id?.videoId && item.snippet?.title)
    .map((item) => {
      const videoId = item.id?.videoId ?? '';
      const snippet = item.snippet ?? {};

      return {
        type: 'video',
        title: snippet.title ?? 'Untitled video',
        description: snippet.description ?? '',
        thumbnailUrl:
          snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url ?? null,
        sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
        sourcePlatform: 'youtube',
        sourceId: `youtube:${videoId}`,
        tags: [snippet.channelTitle ?? 'YouTube'],
        publishedDate: snippet.publishedAt ?? null,
        metadata: {
          channelTitle: snippet.channelTitle ?? null,
          videoId,
        },
      };
    });
}
