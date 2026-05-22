'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AnimateIn from './AnimateIn';
import { useInView } from '@/hooks/useInView';

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

const stats = [
  { label: 'Content types', value: 3, suffix: '', detail: 'Videos, products & papers' },
  { label: 'Live sources', value: 3, suffix: '+', detail: 'YouTube, PH, arXiv APIs' },
  { label: 'Library results', value: 50, suffix: '+', detail: 'Per page, paginated' },
  { label: 'Feed signals', value: 4, suffix: '', detail: 'Tags, saves, views & embeddings' },
];

export default function StatsSection() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="py-20 md:py-24">
      <div className="landing-container">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <AnimateIn>
            <p className="landing-eyebrow">By the numbers</p>
            <h2 className="landing-heading mt-3 max-w-md">Numbers that reflect real discovery</h2>
          </AnimateIn>
          <AnimateIn delay={60}>
            <Link href="/app" className="btn-scalora-primary shrink-0 self-start">
              Get started free
            </Link>
          </AnimateIn>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  index,
  active,
}: {
  stat: (typeof stats)[0];
  index: number;
  active: boolean;
}) {
  const count = useCountUp(stat.value, active);

  return (
    <AnimateIn delay={index * 100} className="h-full">
      <div className="landing-card h-full p-6 transition hover:-translate-y-1">
        <p className="text-4xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
          {count}
          {stat.suffix}
        </p>
        <p className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">{stat.label}</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{stat.detail}</p>
      </div>
    </AnimateIn>
  );
}
