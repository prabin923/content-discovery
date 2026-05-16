'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/features/AuthModal';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import AnimateIn from './AnimateIn';
import FaqSection from './FaqSection';
import FeatureShowcase from './FeatureShowcase';
import HeroBackground from './HeroBackground';
import HeroPreview from './HeroPreview';
import LandingNav from './LandingNav';
import SourceMarquee from './SourceMarquee';
import StatsSection from './StatsSection';
import HowItWorksSection from './HowItWorksSection';
import TestimonialsSection from './TestimonialsSection';

const featureCards = [
  {
    icon: '🔍',
    title: 'Unified discover',
    description: 'Query YouTube, Product Hunt, and arXiv from a single search bar with live filters and source-specific error handling.',
  },
  {
    icon: '📚',
    title: 'Searchable library',
    description: 'Ingest results into Postgres and run full-text library search with pagination—fast repeats without API quotas.',
  },
  {
    icon: '✨',
    title: 'Curated collections',
    description: 'Build public lists, upvote community collections, and manage items as curator with one-click remove.',
  },
  {
    icon: '🎯',
    title: 'Personalized feed',
    description: 'Profile interests, saved-item embeddings, and interaction signals combine for a ranked For You experience.',
  },
  {
    icon: '🔖',
    title: 'Saved library',
    description: 'One-click save from any card, unsave anytime, and view your full bookmarked catalog in a dedicated tab.',
  },
  {
    icon: '🌙',
    title: 'Theme & preferences',
    description: 'Light, dark, or system theme with instant toggle—synced to your account when signed in.',
  },
];

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950">
      <LandingNav onOpenAuth={() => setAuthOpen(true)} isAuthenticated={Boolean(user)} />

      {/* Hero */}
      <section className="relative px-4 pb-8 pt-12 sm:pt-20">
        <HeroBackground />
        <div className="mx-auto max-w-5xl text-center">
          <AnimateIn>
            <p className="mb-5 inline-flex animate-landing-fade-up items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1.5 text-sm font-medium text-indigo-700 backdrop-blur dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              Videos · Products · Research — one hub
            </p>
          </AnimateIn>

          <AnimateIn delay={80}>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">Discover what&apos;s</span>
              <span className="mt-1 block bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent animate-landing-gradient-text dark:from-indigo-400 dark:via-violet-400 dark:to-cyan-400">
                worth your time
              </span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Discovery Hub aggregates trending videos, new products, and research papers—syncs them to your library,
              and helps you save, curate collections, and personalize a feed that learns from every click.
            </p>
          </AnimateIn>

          <AnimateIn delay={240}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/app"
                className="group relative overflow-hidden rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 transition hover:scale-105 hover:bg-indigo-500 active:scale-95"
              >
                <span className="relative z-10">{user ? 'Go to dashboard' : 'Start discovering free'}</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-full duration-700" />
              </Link>
              {!user && !loading ? (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="rounded-xl border border-slate-300 bg-white/80 px-7 py-3.5 text-base font-semibold text-slate-800 backdrop-blur transition hover:scale-105 hover:bg-white dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 active:scale-95"
                >
                  Sign in
                </button>
              ) : null}
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
              No credit card · Open source stack · Self-hostable with Docker
            </p>
          </AnimateIn>
        </div>

        <HeroPreview />
      </section>

      <SourceMarquee />
      <StatsSection />

      {/* Feature grid */}
      <section className="border-y border-slate-200 bg-white px-4 py-24 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <AnimateIn className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Platform</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
              Six pillars of modern content discovery
            </h2>
          </AnimateIn>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card, index) => (
              <AnimateIn key={card.title} delay={index * 70}>
                <article className="group h-full rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-indigo-500">
                  <span className="inline-flex text-3xl transition group-hover:scale-110" role="img" aria-hidden>
                    {card.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{card.description}</p>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <FeatureShowcase />

      <HowItWorksSection />

      <TestimonialsSection />
      <FaqSection />

      {/* CTA */}
      <section className="px-4 py-24">
        <AnimateIn>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-8 py-16 text-center text-white shadow-2xl">
            <div className="absolute inset-0 animate-landing-gradient bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 bg-[length:200%_200%]" />
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to build your feed?</h2>
              <p className="mx-auto mt-4 max-w-xl text-indigo-100">
                Join Discovery Hub free. Save items, create collections, tune recommendations—and never lose a great
                find in another browser tab again.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/app"
                  className="rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition hover:scale-105 hover:bg-indigo-50 active:scale-95"
                >
                  Open the app
                </Link>
                {!user ? (
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className="rounded-xl border border-white/40 px-7 py-3.5 text-base font-semibold text-white transition hover:scale-105 hover:bg-white/10 active:scale-95"
                  >
                    Create account
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </AnimateIn>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-8">
        <Footer />
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
          router.push('/app');
        }}
      />
    </div>
  );
}
