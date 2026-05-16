import { describe, expect, it } from 'vitest';
import { ingestContentSchema, searchQuerySchema } from './schemas';

describe('validation schemas', () => {
  it('accepts valid search query', () => {
    const parsed = searchQuerySchema.safeParse({ q: 'machine learning', page: '2', limit: '10' });
    expect(parsed.success).toBe(true);
  });

  it('rejects empty search query', () => {
    const parsed = searchQuerySchema.safeParse({ q: '' });
    expect(parsed.success).toBe(false);
  });

  it('accepts valid ingest payload', () => {
    const parsed = ingestContentSchema.safeParse({
      type: 'video',
      title: 'Demo',
      sourceUrl: 'https://example.com',
      sourcePlatform: 'youtube',
      sourceId: 'abc123',
    });
    expect(parsed.success).toBe(true);
  });
});
