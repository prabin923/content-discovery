import Link from 'next/link';

const company = [
  { href: '/', label: 'Home' },
  { href: '#products', label: 'Products' },
  { href: '#case-studies', label: 'Case studies' },
  { href: '#faq', label: 'FAQ' },
  { href: '/app', label: 'App' },
];

const product = [
  { href: '/app', label: 'Discover' },
  { href: '/app', label: 'Library' },
  { href: '/app', label: 'Collections' },
  { href: '/app', label: 'For You' },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-900 px-4 py-16 text-zinc-300 dark:border-zinc-800">
      <div className="landing-container">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="text-xl font-bold text-white">
              Discovery <span className="text-emerald-400">Hub</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              A unified discovery platform that combines videos, products, and research papers into one connected
              ecosystem.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Company</p>
            <ul className="mt-4 space-y-2">
              {company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-zinc-300 transition hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Product</p>
            <ul className="mt-4 space-y-2">
              {product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-zinc-300 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-zinc-800 pt-8 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Discovery Hub. Videos, products, and research in one place.
        </p>
      </div>
    </footer>
  );
}
