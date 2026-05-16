'use client';

import { useState } from 'react';
import AnimateIn from './AnimateIn';

const faqs = [
  {
    q: 'What sources does Discovery Hub search?',
    a: 'Live discover pulls from YouTube (videos), Product Hunt (products), and arXiv (research papers). Results can be ingested into your Postgres library for full-text search without hitting external APIs again.',
  },
  {
    q: 'Do I need API keys?',
    a: 'YouTube discovery requires YOUTUBE_API_KEY in backend/.env. Product Hunt and arXiv work without extra keys. The library and personalization features work once content is synced.',
  },
  {
    q: 'How does the For You feed work?',
    a: 'We rank content using your profile interests, saved-item tag overlap, interaction history, view counts, and cosine similarity between embeddings of your recent saves and candidate items.',
  },
  {
    q: 'Can I try it without signing up?',
    a: 'You can browse the landing page and run live discover as a guest. Saving, collections, For You, and profile features require a free account. Demo login: admin@demo.com / password.',
  },
  {
    q: 'Is my data stored securely?',
    a: 'Accounts use bcrypt password hashing and JWT sessions. Content and preferences live in your PostgreSQL database—you control the deployment and DATABASE_URL.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-slate-200 bg-white px-4 py-24 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-3xl">
        <AnimateIn className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Everything you need to know before diving in.</p>
        </AnimateIn>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <AnimateIn key={faq.q} delay={index * 60}>
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-slate-900 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/50"
                  >
                    {faq.q}
                    <span
                      className={`shrink-0 text-indigo-500 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
