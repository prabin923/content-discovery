'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/features/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import AnimateIn from './AnimateIn';
import CaseStudiesSection from './CaseStudiesSection';
import FaqSection from './FaqSection';
import HeroBackground from './HeroBackground';
import HeroPreview from './HeroPreview';
import HowItWorksSection from './HowItWorksSection';
import InsightsSection from './InsightsSection';
import IntegrationsSection from './IntegrationsSection';
import LandingFooter from './LandingFooter';
import LandingNav from './LandingNav';
import ProductEcosystem from './ProductEcosystem';
import RotatingHeadline from './RotatingHeadline';
import StatsSection from './StatsSection';
import TestimonialsSection from './TestimonialsSection';
import TrustSection from './TrustSection';

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f5f0] dark:bg-zinc-950">
      <LandingNav onOpenAuth={() => setAuthOpen(true)} isAuthenticated={Boolean(user)} />

      <section className="relative px-4 pb-8 pt-14 sm:pt-20 md:pt-24">
        <HeroBackground />
        <div className="landing-container text-center">
          <AnimateIn>
            <p className="landing-eyebrow">All in one ecosystem for your discovery</p>
          </AnimateIn>

          <AnimateIn delay={80}>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              <span className="block">The platform that</span>
              <span className="block">helps you</span>
              <span className="mt-2 block">
                <RotatingHeadline />
              </span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={160}>
            <p className="landing-subheading mx-auto mt-6 max-w-2xl">
              Discovery Hub is designed to help you find videos, products, and research—from live APIs to your library,
              collections, and a feed that learns from every save.
            </p>
          </AnimateIn>

          <AnimateIn delay={240}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/app" className="btn-scalora-primary">
                {user ? 'Go to dashboard' : 'Get started free'}
              </Link>
              {!user && !loading ? (
                <button type="button" onClick={() => setAuthOpen(true)} className="btn-scalora-secondary">
                  Sign in
                </button>
              ) : null}
            </div>
            <p className="mt-4 text-sm text-zinc-500">No credit card · Open source stack · Self-hostable with Docker</p>
          </AnimateIn>
        </div>

        <HeroPreview />
      </section>

      <TrustSection />
      <StatsSection />
      <ProductEcosystem />
      <CaseStudiesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <IntegrationsSection />
      <InsightsSection />
      <FaqSection />

      <section className="px-4 py-24 md:py-28">
        <AnimateIn>
          <div className="landing-container">
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-16 text-center text-white shadow-2xl dark:bg-zinc-800 md:px-16 md:py-20">
              <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />
              <div className="relative z-10">
                <p className="landing-eyebrow text-zinc-400">One platform. Unlimited potential.</p>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                  Discovery Hub gives you clarity, structure, and personalization
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                  Save items, create collections, tune recommendations—and never lose a great find in another browser tab
                  again.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    href="/app"
                    className="inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 active:scale-[0.98]"
                  >
                    Open the app
                  </Link>
                  {!user ? (
                    <button
                      type="button"
                      onClick={() => setAuthOpen(true)}
                      className="inline-flex rounded-full border border-zinc-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-800 active:scale-[0.98]"
                    >
                      Create account
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </section>

      <LandingFooter />

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
