'use client';

import { useEffect, useState } from 'react';
import AnimateIn from './AnimateIn';
import { useInView } from '@/hooks/useInView';

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

const stats = [
  { label: 'Content types', value: 3, suffix: '', detail: 'Videos, products & papers' },
  { label: 'Live sources', value: 3, suffix: '+', detail: 'YouTube, PH, arXiv APIs' },
  { label: 'Library search', value: 50, suffix: '+', detail: 'Results per page, paginated' },
  { label: 'Feed signals', value: 4, suffix: '', detail: 'Tags, saves, views & embeddings' },
];

export default function StatsSection() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} active={inView} />
        ))}
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
      <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
        <p className="text-4xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
          {count}
          {stat.suffix}
        </p>
        <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{stat.label}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.detail}</p>
      </div>
    </AnimateIn>
  );
}
