import AnimateIn from './AnimateIn';

const integrations = [
  { name: 'YouTube', desc: 'Video discovery' },
  { name: 'Product Hunt', desc: 'Product launches' },
  { name: 'arXiv', desc: 'Research papers' },
  { name: 'PostgreSQL', desc: 'Library storage' },
  { name: 'JWT Auth', desc: 'Secure sessions' },
  { name: 'Docker', desc: 'Self-host ready' },
];

export default function IntegrationsSection() {
  return (
    <section className="py-24 md:py-28">
      <div className="landing-container text-center">
        <AnimateIn>
          <p className="landing-eyebrow">Integration</p>
          <h2 className="landing-heading mt-3">One hub. Fully connected.</h2>
          <p className="landing-subheading mx-auto mt-4 max-w-2xl">
            Discovery Hub connects live APIs, your Postgres library, and personalization signals into one intelligent
            discovery system.
          </p>
        </AnimateIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item, index) => (
            <AnimateIn key={item.name} delay={index * 60}>
              <div className="landing-card flex items-center gap-4 p-5 text-left transition hover:-translate-y-0.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-lg font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {item.name.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</p>
                  <p className="text-sm text-zinc-500">{item.desc}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
