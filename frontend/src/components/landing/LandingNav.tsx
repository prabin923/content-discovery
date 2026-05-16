'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/common/ThemeToggle';
import Button from '@/components/common/Button';

interface Props {
  onOpenAuth: () => void;
  isAuthenticated: boolean;
}

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
];

export default function LandingNav({ onOpenAuth, isAuthenticated }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Discovery <span className="text-indigo-600 dark:text-indigo-400">Hub</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {!isAuthenticated ? (
            <Button variant="ghost" onClick={onOpenAuth} className="hidden sm:inline-flex dark:hover:bg-slate-800">
              Sign in
            </Button>
          ) : null}
          <Link
            href="/app"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 transition hover:scale-105 hover:bg-indigo-500 active:scale-95"
          >
            {isAuthenticated ? 'Open app' : 'Get started'}
          </Link>
        </div>
      </div>
    </header>
  );
}
