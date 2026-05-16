const sources = [
  'YouTube',
  'Product Hunt',
  'arXiv',
  'Full-text search',
  'Collections',
  'For You feed',
  'Saved library',
  'Dark mode',
  'PostgreSQL',
  'Smart tags',
];

export default function SourceMarquee() {
  const items = [...sources, ...sources];

  return (
    <section className="border-y border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
        Powered by your favorite sources
      </p>
      <div className="relative overflow-hidden">
        <div className="animate-landing-marquee flex w-max gap-8 whitespace-nowrap px-4">
          {items.map((label, index) => (
            <span
              key={`${label}-${index}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
