import { describe, expect, it } from 'vitest';
import { averageEmbedding, cosineSimilarity } from './embedding';

describe('embedding utils', () => {
  it('returns 1 for identical vectors', () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBe(1);
  });

  it('returns 0 for orthogonal vectors', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
  });

  it('averages embeddings', () => {
    expect(averageEmbedding([[1, 0], [0, 1]])).toEqual([0.5, 0.5]);
  });
});
