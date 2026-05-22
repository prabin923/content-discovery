'use client';

import { useState } from 'react';
import AnimateIn from './AnimateIn';

const products = [
  {
    id: 'discover',
    tab: 'Discover',
    title: 'Unified discover',
    description:
      'Query YouTube, Product Hunt, and arXiv from one search bar. Filter by source, paginate results, and ingest standouts into your library.',
    metrics: ['3 live APIs', 'Source filters', 'Rate-limited sync'],
    preview: (
      <div className="space-y-2 p-1">
        {['AI agents 2026', 'devtools launches', 'retrieval papers'].map((q) => (
          <div
            key={q}
            className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-xs text-white dark:bg-white dark:text-zinc-900">
              ⌕
            </span>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{q}</p>
              <p className="text-xs text-zinc-500">Live · 12 results</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'library',
    tab: 'Library',
    title: 'Searchable library',
    description:
      'Full-text search over synced Postgres content. Repeat queries without API quotas and paginate through your entire catalog.',
    metrics: ['Full-text search', '50+ per page', 'Background sync'],
    preview: (
      <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Library query</p>
        <p className="mt-2 font-mono text-sm text-zinc-900 dark:text-zinc-100">machine learning AND 2026</p>
        <div className="mt-4 space-y-2">
          {[89, 72, 58].map((w) => (
            <div key={w} className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'collections',
    tab: 'Collections',
    title: 'Curated collections',
    description:
      'Build public lists, upvote community collections, and manage items as curator. Share knowledge bases your team actually maintains.',
    metrics: ['Public lists', 'Upvotes', 'Curator tools'],
    preview: (
      <div className="space-y-2 p-1">
        {[
          { name: 'Weekend watchlist', votes: 42 },
          { name: 'Tools for builders', votes: 31 },
          { name: 'Papers to read', votes: 28 },
        ].map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{c.name}</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              ↑ {c.votes}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'foryou',
    tab: 'For You',
    title: 'Personalized feed',
    description:
      'Profile interests, saved-item embeddings, and interaction signals combine for a ranked feed that learns from every click.',
    metrics: ['Interest tags', 'Embeddings', 'View signals'],
    preview: (
      <div className="space-y-3 p-1">
        {[
          { tag: 'ai', score: 94 },
          { tag: 'research', score: 87 },
          { tag: 'startups', score: 76 },
        ].map((row) => (
          <div key={row.tag} className="flex items-center gap-3">
            <span className="w-14 text-xs font-medium text-zinc-500">#{row.tag}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full animate-landing-grow rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: `${row.score}%` }}
              />
            </div>
            <span className="w-8 text-xs tabular-nums text-zinc-500">{row.score}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function ProductEcosystem() {
  const [active, setActive] = useState(products[0].id);
  const current = products.find((p) => p.id === active) ?? products[0];

  return (
    <section id="products" className="py-24 md:py-28">
      <div className="landing-container">
        <AnimateIn className="text-center">
          <p className="landing-eyebrow">Our products</p>
          <h2 className="landing-heading mt-3">Meet the Discovery Hub ecosystem</h2>
        </AnimateIn>

        <AnimateIn delay={80} className="mt-10">
          <div className="flex flex-wrap justify-center gap-2">
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  active === p.id
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'
                }`}
              >
                {p.tab}
              </button>
            ))}
          </div>
        </AnimateIn>

        <AnimateIn delay={120} className="mt-12">
          <div className="landing-card overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-zinc-100 p-8 md:p-10 lg:border-b-0 lg:border-r dark:border-zinc-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {current.tab}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{current.title}</h3>
                <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">{current.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {current.metrics.map((m) => (
                    <li
                      key={m}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-50/80 p-8 md:p-10 dark:bg-zinc-800/50">{current.preview}</div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
