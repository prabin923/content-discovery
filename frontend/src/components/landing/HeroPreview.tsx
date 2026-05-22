'use client';

const cards = [
  { label: 'Discover', title: 'Live search', sub: '3 APIs · unified', offset: 'translate-x-0', z: 'z-30' },
  { label: 'Library', title: 'Full-text index', sub: 'Postgres · synced', offset: 'translate-x-4 sm:translate-x-8', z: 'z-20' },
  { label: 'For You', title: 'Personalized', sub: 'Interests · saves', offset: 'translate-x-8 sm:translate-x-16', z: 'z-10' },
];

export default function HeroPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-3xl animate-landing-fade-up px-2" style={{ animationDelay: '400ms' }}>
      <div className="relative flex min-h-[220px] items-end justify-center sm:min-h-[260px]">
        {cards.map((card, index) => (
          <article
            key={card.label}
            className={`absolute bottom-0 w-[min(100%,16rem)] ${card.offset} ${card.z} animate-landing-float landing-card p-5 sm:w-[18rem]`}
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {card.label}
            </p>
            <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">{card.title}</p>
            <p className="mt-1 text-xs text-zinc-500">{card.sub}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                style={{ width: `${85 - index * 15}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
