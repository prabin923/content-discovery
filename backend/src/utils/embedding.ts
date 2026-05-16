export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dot / denominator;
}

export function averageEmbedding(vectors: number[][]): number[] {
  if (vectors.length === 0) {
    return [];
  }

  const length = vectors[0].length;
  const sums = new Array<number>(length).fill(0);

  for (const vector of vectors) {
    for (let i = 0; i < length; i += 1) {
      sums[i] += vector[i] ?? 0;
    }
  }

  return sums.map((value) => value / vectors.length);
}
