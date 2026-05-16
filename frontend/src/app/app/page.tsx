'use client';

import { useState } from 'react';
import AuthModal from '@/components/features/AuthModal';
import CollectionsView from '@/components/features/CollectionsView';
import ContentDiscovery from '@/components/features/ContentDiscovery';
import ForYouFeed from '@/components/features/ForYouFeed';
import ProfileView from '@/components/features/ProfileView';
import SavedItemsView from '@/components/features/SavedItemsView';
import Footer from '@/components/layout/Footer';
import Header, { type AppTab } from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';

const AUTH_TABS: AppTab[] = ['saved', 'foryou', 'profile'];

export default function AppPage() {
  const [tab, setTab] = useState<AppTab>('discover');
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();

  const openAuth = () => setAuthOpen(true);

  const handleTabChange = (next: AppTab) => {
    if (AUTH_TABS.includes(next) && !user) {
      openAuth();
      return;
    }
    setTab(next);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <section className="mx-auto max-w-6xl">
        <Header activeTab={tab} onTabChange={handleTabChange} onOpenAuth={openAuth} />

        {tab === 'discover' ? <ContentDiscovery onRequireAuth={openAuth} /> : null}
        {tab === 'collections' ? (
          <CollectionsView key={user?.id ?? 'guest'} onRequireAuth={openAuth} />
        ) : null}
        {tab === 'saved' ? <SavedItemsView key={user?.id ?? 'guest'} onRequireAuth={openAuth} /> : null}
        {tab === 'foryou' ? <ForYouFeed key={user?.id ?? 'guest'} onRequireAuth={openAuth} /> : null}
        {tab === 'profile' ? <ProfileView key={user?.id ?? 'guest'} onRequireAuth={openAuth} /> : null}

        <Footer />
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
}
