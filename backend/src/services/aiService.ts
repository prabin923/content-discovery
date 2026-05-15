interface CategorizationResult {
  category: string;
  tags: string[];
}

const keywordTaxonomy: Array<{ category: string; tags: string[]; keywords: string[] }> = [
  {
    category: 'Artificial Intelligence',
    tags: ['ai', 'machine-learning', 'llm'],
    keywords: ['ai', 'machine learning', 'llm', 'neural', 'deep learning', 'agent'],
  },
  {
    category: 'Developer Tools',
    tags: ['developer-tools', 'programming', 'software'],
    keywords: ['typescript', 'javascript', 'python', 'api', 'developer', 'code', 'framework'],
  },
  {
    category: 'Productivity',
    tags: ['productivity', 'workflow', 'automation'],
    keywords: ['productivity', 'task', 'organize', 'workflow', 'automation'],
  },
  {
    category: 'Business',
    tags: ['business', 'startup', 'growth'],
    keywords: ['business', 'startup', 'marketing', 'sales', 'saas'],
  },
  {
    category: 'Science',
    tags: ['science', 'research', 'innovation'],
    keywords: ['research', 'science', 'paper', 'experiment', 'study'],
  },
];

export function categorizeContent(title: string, description: string): CategorizationResult {
  const haystack = `${title} ${description}`.toLowerCase();

  let bestMatch = keywordTaxonomy[0];
  let bestScore = -1;
  for (const entry of keywordTaxonomy) {
    const score = entry.keywords.reduce(
      (total, keyword) => total + (haystack.includes(keyword) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestMatch = entry;
      bestScore = score;
    }
  }

  return {
    category: bestScore > 0 ? bestMatch.category : 'General',
    tags: bestScore > 0 ? bestMatch.tags : ['general'],
  };
}

export function generatePseudoEmbedding(title: string, description: string): number[] {
  const text = `${title} ${description}`.toLowerCase();
  const buckets = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < text.length; i += 1) {
    buckets[i % buckets.length] += text.charCodeAt(i);
  }
  const max = Math.max(...buckets, 1);
  return buckets.map((value) => Number((value / max).toFixed(6)));
}
