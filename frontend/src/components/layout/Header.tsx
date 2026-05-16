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
    <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div>
        <Link href="/" className="group inline-block">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 md:text-4xl">
            Discovery Hub
          </h1>
        </Link>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Videos, products, and research in one place.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ThemeToggle />
        <nav className="flex flex-wrap rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {loading ? (
          <span className="text-sm text-slate-500">Loading…</span>
        ) : user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Hi, <strong>{user.username}</strong>
            </span>
            <Button variant="ghost" onClick={logout}>
              Sign out
            </Button>
          </div>
        ) : (
          <Button onClick={onOpenAuth}>Sign in</Button>
        )}
      </div>
    </header>
  );
}
