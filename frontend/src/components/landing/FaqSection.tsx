'use client';

import { useState } from 'react';
import AnimateIn from './AnimateIn';

const faqs = [
  {
    q: 'What is Discovery Hub exactly?',
    a: 'Discovery Hub is a unified content platform that combines live discover, a searchable library, collections, and personalization into one connected ecosystem. Instead of managing multiple tabs, you run everything from a single hub.',
  },
  {
    q: 'Who is Discovery Hub built for?',
    a: 'Researchers, indie hackers, and teams who follow videos, product launches, and papers—and need consistent discovery, saves, and recommendations without juggling tools.',
  },
  {
    q: 'What sources does it search?',
    a: 'Live discover pulls from YouTube (videos), Product Hunt (products), and arXiv (research papers). Results can be ingested into your Postgres library for full-text search without hitting external APIs again.',
  },
  {
    q: 'Do I need API keys?',
    a: 'YouTube discovery requires a YouTube API key in your server environment. Product Hunt and arXiv work without extra keys. Library and personalization work once content is synced.',
  },
  {
    q: 'How does the For You feed work?',
    a: 'We rank content using profile interests, saved-item tag overlap, interaction history, view counts, and cosine similarity between embeddings of your recent saves and candidate items.',
  },
  {
    q: 'Is my data stored securely?',
    a: 'Accounts use bcrypt password hashing and JWT sessions. Content and preferences live in your PostgreSQL database—you control the deployment and DATABASE_URL.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-zinc-200/80 bg-white py-24 dark:border-zinc-800 dark:bg-zinc-900 md:py-28">
      <div className="landing-container">
        <AnimateIn className="mb-12 text-center">
          <p className="landing-eyebrow">Questions and answers</p>
          <h2 className="landing-heading mt-3">Frequently asked questions</h2>
        </AnimateIn>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <AnimateIn key={faq.q} delay={index * 50}>
                <div className="landing-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium text-zinc-900 transition hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800/50"
                  >
                    {faq.q}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition dark:border-zinc-700 ${
                        isOpen ? 'rotate-45 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{faq.a}</p>
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
