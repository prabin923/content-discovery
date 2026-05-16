export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -left-24 top-10 h-72 w-72 animate-landing-float rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-600/20" />
      <div
        className="absolute -right-16 top-32 h-80 w-80 animate-landing-float rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/15"
        style={{ animationDelay: '1.2s' }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-64 w-64 animate-landing-float rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-600/10"
        style={{ animationDelay: '2.4s' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/90 via-slate-50/50 to-transparent dark:from-indigo-950/50 dark:via-slate-950/30 dark:to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f10a_1px,transparent_1px),linear-gradient(to_bottom,#6366f10a_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] dark:bg-[linear-gradient(to_right,#818cf81a_1px,transparent_1px),linear-gradient(to_bottom,#818cf81a_1px,transparent_1px)]" />
    </div>
  );
}
