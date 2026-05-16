'use client';

import AnimateIn from './AnimateIn';

const showcases = [
  {
    id: 'discover',
    badge: 'Live + Library',
    title: 'Search once, query everywhere',
    description:
      'Run live discovery against YouTube, Product Hunt, and arXiv—or switch to your synced Postgres library with full-text search, filters, and pagination. No more tab-hopping between platforms.',
    bullets: ['Source filters: videos, products, papers', 'Background sync every 30 minutes', 'Rate-limited API calls to protect quotas'],
    visual: (
      <div className="space-y-3 p-2">
        {['technology trends', 'AI startups', 'machine learning'].map((q, i) => (
          <div
            key={q}
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              ⌕
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{q}</p>
              <p className="text-xs text-slate-500">{12 - i * 3} results · live</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'personalize',
    badge: 'For You',
    title: 'Recommendations that learn from you',
    description:
      'Set interests on your profile, save content to your library, and let the feed combine tag overlap, interaction history, view counts, and embedding similarity from your saved items.',
    bullets: ['Interest tags drive base ranking', 'Pseudo-embeddings for similarity', 'Refresh anytime from the app'],
    visual: (
      <div className="space-y-2 p-2">
        {[
          { tag: 'ai', score: 94 },
          { tag: 'research', score: 87 },
          { tag: 'startups', score: 76 },
        ].map((row) => (
          <div key={row.tag} className="flex items-center gap-3">
            <span className="w-16 text-xs font-medium text-slate-500">#{row.tag}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full animate-landing-grow rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${row.score}%` }}
              />
            </div>
            <span className="w-8 text-xs tabular-nums text-slate-500">{row.score}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'curate',
    badge: 'Collections',
    title: 'Curate, share, and upvote lists',
    description:
      'Create public or private collections, add items from discover results, let the community upvote the best lists, and remove items when your taste evolves.',
    bullets: ['Public community browse', 'Upvote / downvote collections', 'Curator-only item management'],
    visual: (
      <div className="space-y-2 p-2">
        {['Weekend watchlist', 'Tools for builders', 'Papers to read'].map((title, i) => (
          <div
            key={title}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
          >
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{title}</span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              ↑ {42 - i * 11}
            </span>
          </div>
        ))}
      </div>
    ),
  },
];

export default function FeatureShowcase() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <AnimateIn className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Deep dive</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Built for serious discovery workflows
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
            Every feature connects—search flows into saves, saves train your feed, and collections become shareable knowledge bases.
          </p>
        </AnimateIn>

        <div className="space-y-24">
          {showcases.map((item, index) => (
            <AnimateIn key={item.id} direction={index % 2 === 1 ? 'right' : 'left'}>
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
              >
                <div>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {item.badge}
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</p>
                  <ul className="mt-6 space-y-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <span className="mt-1 text-indigo-500">✓</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-inner dark:border-slate-700 dark:bg-slate-800/50">
                  {item.visual}
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
