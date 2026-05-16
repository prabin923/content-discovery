'use client';

const previewCards = [
  { type: 'video', title: 'The future of AI agents in 2026', source: 'YouTube', color: 'from-red-500/20 to-orange-500/10' },
  { type: 'product', title: 'LaunchKit — ship side projects faster', source: 'Product Hunt', color: 'from-amber-500/20 to-yellow-500/10' },
  { type: 'paper', title: 'Scaling retrieval with hybrid embeddings', source: 'arXiv', color: 'from-emerald-500/20 to-teal-500/10' },
];

export default function HeroPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-4xl animate-landing-fade-up px-2" style={{ animationDelay: '400ms' }}>
      <div className="absolute -inset-1 animate-landing-glow rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 opacity-40 blur-xl" />
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xl backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/90">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-xs text-slate-400 dark:bg-slate-900">
            discovery-hub.app — discover
          </span>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {previewCards.map((card, index) => (
            <article
              key={card.title}
              className={`animate-landing-float rounded-xl border border-slate-200/80 bg-gradient-to-br p-4 dark:border-slate-700 ${card.color}`}
              style={{ animationDelay: `${index * 0.6}s` }}
            >
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-slate-900/80 dark:text-indigo-300">
                {card.type}
              </span>
              <p className="mt-3 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{card.title}</p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{card.source}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full animate-landing-shimmer rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  style={{ width: `${72 - index * 12}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
