'use client';

import AnimateIn from './AnimateIn';

const steps: Array<{ step: string; title: string; body: string }> = [
  {
    step: '01',
    title: 'Create your account',
    body: 'Register with email in under a minute. No credit card required.',
  },
  {
    step: '02',
    title: 'Discover & sync',
    body: 'Search videos, products, and papers from live APIs. Content syncs to your library on a schedule or on demand.',
  },
  {
    step: '03',
    title: 'Save & curate',
    body: 'Bookmark standouts, build collections, and upvote community lists that match your interests.',
  },
  {
    step: '04',
    title: 'Tune your feed',
    body: 'Add interests to your profile. Saves and views train smarter recommendations in For You.',
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-t border-slate-200 bg-slate-100/50 px-4 py-28 dark:border-slate-800 dark:bg-slate-900/50 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <AnimateIn className="mb-16 text-center md:mb-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Getting started
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">How it works</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            From signup to a personalized feed in four simple steps.
          </p>
        </AnimateIn>

        <ol className="grid list-none gap-8 sm:gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:gap-x-12 lg:gap-y-14">
          {steps.map((item, index) => (
            <AnimateIn key={item.step} delay={index * 80} className="h-full">
              <li className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900 md:p-9">
                  <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.body}
                  </p>
                </article>
              </li>
            </AnimateIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
