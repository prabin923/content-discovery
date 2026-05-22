'use client';

import AnimateIn from './AnimateIn';

const testimonials = [
  {
    badge: 'Unified discover',
    quote:
      'Before this, our team kept seventeen tabs open for YouTube, PH, and arXiv. Now discovery launches, saves, and improves in one workspace.',
    name: 'Daniel Reed',
    role: 'Founder, BrightLayer Digital',
    stats: [
      { value: '52%', label: 'More content saved' },
      { value: '3.4x', label: 'Faster research' },
    ],
  },
  {
    badge: 'For You feed',
    quote:
      'Our reading list used to be cluttered with low-signal links. Now we know what matters before we even open another tab.',
    name: 'Mezei Ágnes',
    role: 'VP Research, CloudMetric',
    stats: [
      { value: '38%', label: 'Higher save quality' },
      { value: '31%', label: 'More list variations' },
    ],
  },
  {
    badge: 'Collections',
    quote:
      'Curating at scale felt unrealistic with our team size. Public collections and upvotes keep everyone aligned without extra docs.',
    name: 'Surány Izabella',
    role: 'Head of Content, NovaCart',
    stats: [
      { value: '47%', label: 'More engaged lists' },
      { value: '31%', label: 'Shorter curation cycles' },
    ],
  },
];

export default function TestimonialsSection() {
  return (
    <section className="border-t border-zinc-200/80 bg-[#f5f5f0] py-24 dark:border-zinc-800 dark:bg-zinc-950 md:py-28">
      <div className="landing-container">
        <AnimateIn className="text-center">
          <p className="landing-eyebrow">Testimonial</p>
          <h2 className="landing-heading mt-3">Trusted by teams that think in systems</h2>
        </AnimateIn>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <AnimateIn key={item.name} delay={index * 100}>
              <blockquote className="landing-card flex h-full flex-col p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {item.badge}
                </span>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</p>
                  <p className="text-xs text-zinc-500">{item.role}</p>
                </footer>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {item.stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{s.value}</p>
                      <p className="mt-0.5 text-[10px] text-zinc-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </blockquote>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
