import type { ContentItem, DiscoveryQuery } from '@discovery-hub/shared';

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractTag(entry: string, tag: string): string | null {
  const match = entry.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match?.[1]?.trim() ?? null;
}

function extractAll(entry: string, tag: string): string[] {
  return [...entry.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'g'))]
    .map((match) => match[1]?.trim() ?? '')
    .filter(Boolean);
}

export async function discoverPapers(
  query: DiscoveryQuery
): Promise<ContentItem[]> {
  const params = new URLSearchParams({
    search_query: `all:${query.q}`,
    start: '0',
    max_results: String(query.limit),
    sortBy: 'relevance',
    sortOrder: 'descending',
  });

  const response = await fetch(`http://export.arxiv.org/api/query?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`arXiv API failed with status ${response.status}`);
  }

  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);

  return entries.map((entry) => {
    const rawTitle = extractTag(entry, 'title') ?? 'Untitled paper';
    const rawSummary = extractTag(entry, 'summary') ?? '';
    const published = extractTag(entry, 'published');
    const id = extractTag(entry, 'id') ?? '';
    const authors = extractAll(entry, 'name').map((name) => decodeXml(name));
    const primaryCategory = entry.match(/<arxiv:primary_category[^>]*term="([^"]+)"/)?.[1] ?? null;

    return {
      type: 'paper',
      title: decodeXml(rawTitle.replace(/\s+/g, ' ').trim()),
      description: decodeXml(rawSummary.replace(/\s+/g, ' ').trim()),
      thumbnailUrl: null,
      sourceUrl: id,
      sourcePlatform: 'arxiv',
      sourceId: `paper:${id}`,
      tags: primaryCategory ? [primaryCategory] : ['research'],
      publishedDate: published,
      metadata: {
        authors,
        primaryCategory,
      },
    };
  });
}
