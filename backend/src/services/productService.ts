import type { ContentItem, DiscoveryQuery } from '@discovery-hub/shared';

interface ProductApiResult {
  products?: Array<{
    id: number;
    title: string;
    description: string;
    thumbnail?: string;
    category?: string;
    price?: number;
    rating?: number;
    brand?: string;
  }>;
}

export async function discoverProducts(
  query: DiscoveryQuery
): Promise<ContentItem[]> {
  const params = new URLSearchParams({
    q: query.q,
    limit: String(query.limit),
  });

  const response = await fetch(`https://dummyjson.com/products/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Products API failed with status ${response.status}`);
  }

  const data = (await response.json()) as ProductApiResult;
  return (data.products ?? []).map((product) => ({
    type: 'product',
    title: product.title,
    description: product.description,
    thumbnailUrl: product.thumbnail ?? null,
    sourceUrl: `https://dummyjson.com/products/${product.id}`,
    sourcePlatform: 'dummyjson',
    sourceId: `product:${product.id}`,
    tags: [product.category ?? 'product', product.brand ?? 'unknown-brand'],
    publishedDate: null,
    metadata: {
      category: product.category ?? null,
      price: product.price ?? null,
      rating: product.rating ?? null,
      brand: product.brand ?? null,
    },
  }));
}
