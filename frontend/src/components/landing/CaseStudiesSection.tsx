'use client';

import Link from 'next/link';
import AnimateIn from './AnimateIn';

const cases = [
  {
    title: 'How a research team cut tab overload by 60% with one search bar',
    author: 'Sarah Mitchell',
    products: 'Discover + Library',
    stats: [
      { value: '60%', label: 'Fewer browser tabs' },
      { value: '3x', label: 'Faster literature review' },
      { value: '28%', label: 'More papers saved' },
    ],
  },
  {
    title: 'Our agency tracks twice the launches with the same team size',
    author: 'Daniel Kim',
    products: 'Collections + Saved',
    stats: [
      { value: '2x', label: 'Client capacity' },
      { value: '45%', label: 'Faster curation' },
      { value: '31%', label: 'Higher list engagement' },
    ],
  },
  {
    title: 'Lead quality improved almost immediately after tuning interests',
    author: 'Anita Rao',
    products: 'For You + Profile',
    stats: [
      { value: '47%', label: 'More relevant saves' },
      { value: '31%', label: 'Shorter research cycles' },
      { value: '4x', label: 'Feed refreshes / week' },
    ],
  },
  {
    title: 'We launched more experiments in one quarter than all of last year',
    author: 'Michael Torres',
    products: 'Discover + For You',
    stats: [
      { value: '52%', label: 'More experiments' },
      { value: '3.4x', label: 'Faster discovery' },
      { value: '38%', label: 'Better source mix' },
    ],
  },
];

export default function CaseStudiesSection() {
  return (
    <section id="case-studies" className="border-t border-zinc-200/80 bg-white py-24 dark:border-zinc-800 dark:bg-zinc-900 md:py-28">
      <div className="landing-container mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <AnimateIn>
          <p className="landing-eyebrow">Case study</p>
          <h2 className="landing-heading mt-3 max-w-xl">Built on systems. Proven by results.</h2>
          <p className="landing-subheading mt-4 max-w-lg">
            See how teams replaced scattered bookmarks with a scalable discovery workflow.
          </p>
        </AnimateIn>
        <AnimateIn delay={60}>
          <Link href="/app" className="btn-scalora-secondary shrink-0 self-start">
            Open the app
          </Link>
        </AnimateIn>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 pl-4 sm:pl-6 md:pl-[max(1rem,calc((100vw-72rem)/2+1rem))]">
        {cases.map((item, index) => (
          <AnimateIn key={item.title} delay={index * 80} className="w-[min(100%,22rem)] shrink-0 sm:w-[24rem]">
            <article className="landing-card flex h-full flex-col p-6 transition hover:-translate-y-1">
              <h3 className="text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-50">{item.title}</h3>
              <p className="mt-4 text-sm text-zinc-500">
                {item.author} · {item.products}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                {item.stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{s.value}</p>
                    <p className="mt-1 text-[10px] leading-tight text-zinc-500">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/app" className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                Explore features →
              </Link>
            </article>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
