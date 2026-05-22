import AnimateIn from './AnimateIn';

const brands = [
  'YouTube',
  'Product Hunt',
  'arXiv',
  'PostgreSQL',
  'Next.js',
  'Express',
  'Open Source',
  'Self-hosted',
];

export default function TrustSection() {
  const items = [...brands, ...brands];

  return (
    <section className="border-y border-zinc-200/80 bg-white py-10 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="landing-container">
        <AnimateIn className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="landing-eyebrow">We&apos;re working with</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Trusted by curious teams
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800">
            <span className="flex gap-0.5 text-amber-400" aria-hidden>
              {'★★★★★'.split('').map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">4.9/5 average rating</span>
          </div>
        </AnimateIn>
      </div>
      <div className="relative mt-8 overflow-hidden">
        <div className="animate-landing-marquee flex w-max gap-12 whitespace-nowrap px-4">
          {items.map((label, index) => (
            <span
              key={`${label}-${index}`}
              className="text-sm font-semibold tracking-wide text-zinc-400 dark:text-zinc-500"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
