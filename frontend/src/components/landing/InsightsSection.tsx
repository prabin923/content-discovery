import Link from 'next/link';
import AnimateIn from './AnimateIn';

const posts = [
  {
    category: 'Discovery',
    date: 'May 12, 2026',
    title: 'How unified search removes repetitive tab-hopping',
  },
  {
    category: 'Personalization',
    date: 'May 8, 2026',
    title: 'Align your For You feed with real interests and saves',
  },
  {
    category: 'Library',
    date: 'May 3, 2026',
    title: 'Why scaling discovery without a library creates bottlenecks',
  },
];

export default function InsightsSection() {
  return (
    <section className="border-t border-zinc-200/80 bg-white py-24 dark:border-zinc-800 dark:bg-zinc-900 md:py-28">
      <div className="landing-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <AnimateIn>
            <p className="landing-eyebrow">News & insight</p>
            <h2 className="landing-heading mt-3">Insights that help you discover smarter</h2>
            <p className="landing-subheading mt-4 max-w-lg">
              Practical frameworks for research, curation, and building a feed that learns from you.
            </p>
          </AnimateIn>
          <AnimateIn delay={60}>
            <Link href="/app" className="btn-scalora-secondary shrink-0 self-start">
              Start discovering
            </Link>
          </AnimateIn>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post, index) => (
            <AnimateIn key={post.title} delay={index * 80}>
              <article className="landing-card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1">
                <div className="h-36 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700" />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium text-zinc-500">
                    {post.category} · {post.date}
                  </p>
                  <h3 className="mt-3 flex-1 text-lg font-semibold leading-snug text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                    {post.title}
                  </h3>
                  <Link href="/app" className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Read more →
                  </Link>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
