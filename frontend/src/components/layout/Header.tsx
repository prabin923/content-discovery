'use client';

import Link from 'next/link';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export type AppTab = 'discover' | 'collections' | 'saved' | 'foryou' | 'profile';

interface Props {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenAuth: () => void;
}

const tabs: { id: AppTab; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'collections', label: 'Collections' },
  { id: 'saved', label: 'Saved' },
  { id: 'foryou', label: 'For you' },
  { id: 'profile', label: 'Profile' },
];

export default function Header({ activeTab, onTabChange, onOpenAuth }: Props) {
  const { user, logout, loading } = useAuth();

  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
      <div>
        <Link href="/" className="group inline-block">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400 md:text-3xl">
            Discovery <span className="text-emerald-600 dark:text-emerald-400">Hub</span>
          </h1>
        </Link>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Videos, products, and research in one place.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ThemeToggle />
        <nav className="flex flex-wrap rounded-full border border-zinc-200 bg-zinc-100/80 p-1 dark:border-zinc-700 dark:bg-zinc-800/80">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {loading ? (
          <span className="text-sm text-zinc-500">Loading…</span>
        ) : user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Hi, <strong>{user.username}</strong>
            </span>
            <Button variant="ghost" onClick={logout} className="rounded-full dark:hover:bg-zinc-800">
              Sign out
            </Button>
          </div>
        ) : (
          <Button onClick={onOpenAuth} className="rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
