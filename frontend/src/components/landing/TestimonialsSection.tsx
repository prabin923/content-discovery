'use client';

import AnimateIn from './AnimateIn';

const testimonials = [
  {
    quote:
      'I used to keep seventeen tabs open for YouTube, PH, and arXiv. Discovery Hub cut that to one search bar and a library I can actually query again.',
    name: 'Jordan Lee',
    role: 'Indie hacker',
  },
  {
    quote:
      'The collections + upvote flow turned our team reading list into something people actually maintain. Public lists beat another Notion doc.',
    name: 'Samira Patel',
    role: 'Engineering lead',
  },
  {
    quote:
      'Setting interests and watching the For You feed shift after saves feels like the product is paying attention—without a black-box algorithm.',
    name: 'Alex Chen',
    role: 'ML researcher',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <AnimateIn className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Loved by curious builders</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">How teams and individuals use Discovery Hub day to day.</p>
        </AnimateIn>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <AnimateIn key={item.name} delay={index * 120}>
              <blockquote className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                <p className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </footer>
              </blockquote>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
