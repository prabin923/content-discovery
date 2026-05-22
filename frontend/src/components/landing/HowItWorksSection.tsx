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
      className="border-t border-zinc-200/80 bg-white py-24 dark:border-zinc-800 dark:bg-zinc-900 md:py-28"
    >
      <div className="landing-container">
        <AnimateIn className="mb-16 text-center md:mb-20">
          <p className="landing-eyebrow">Getting started</p>
          <h2 className="landing-heading mt-3">How it works</h2>
          <p className="landing-subheading mx-auto mt-4 max-w-xl">
            From signup to a personalized feed in four simple steps.
          </p>
        </AnimateIn>

        <ol className="grid list-none gap-6 sm:grid-cols-2 lg:gap-8">
          {steps.map((item, index) => (
            <AnimateIn key={item.step} delay={index * 80} className="h-full">
              <li className="h-full">
                <article className="landing-card flex h-full flex-col p-8 transition hover:-translate-y-1">
                  <span className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
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
