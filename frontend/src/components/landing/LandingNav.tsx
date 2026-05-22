'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/common/ThemeToggle';

interface Props {
  onOpenAuth: () => void;
  isAuthenticated: boolean;
}

const productLinks = [
  { href: '#products', label: 'Discover' },
  { href: '#products', label: 'Library' },
  { href: '#products', label: 'Collections' },
  { href: '#products', label: 'For You' },
];

const resourceLinks = [
  { href: '#case-studies', label: 'Case studies' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
];

function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        aria-expanded={open}
      >
        {label}
        <svg className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function LandingNav({ onOpenAuth, isAuthenticated }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-[#f5f5f0]/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <div className="landing-container flex items-center justify-between gap-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Discovery <span className="text-emerald-600 dark:text-emerald-400">Hub</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <NavDropdown label="Product" links={productLinks} />
          <NavDropdown label="Resources" links={resourceLinks} />
          <a href="#products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Features
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 sm:inline-block dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Sign in
            </button>
          ) : null}
          <Link href="/app" className="btn-scalora-primary hidden sm:inline-flex">
            {isAuthenticated ? 'Open app' : 'Get started free'}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-zinc-600 lg:hidden dark:text-zinc-400"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-zinc-200 px-4 py-4 lg:hidden dark:border-zinc-800">
          <div className="flex flex-col gap-3">
            <a href="#products" className="text-sm font-medium text-zinc-700 dark:text-zinc-300" onClick={() => setMobileOpen(false)}>
              Products
            </a>
            <a href="#case-studies" className="text-sm font-medium text-zinc-700 dark:text-zinc-300" onClick={() => setMobileOpen(false)}>
              Case studies
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-700 dark:text-zinc-300" onClick={() => setMobileOpen(false)}>
              How it works
            </a>
            <a href="#faq" className="text-sm font-medium text-zinc-700 dark:text-zinc-300" onClick={() => setMobileOpen(false)}>
              FAQ
            </a>
            {!isAuthenticated ? (
              <button type="button" onClick={() => { setMobileOpen(false); onOpenAuth(); }} className="text-left text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Sign in
              </button>
            ) : null}
            <Link href="/app" className="btn-scalora-primary text-center" onClick={() => setMobileOpen(false)}>
              {isAuthenticated ? 'Open app' : 'Get started free'}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
