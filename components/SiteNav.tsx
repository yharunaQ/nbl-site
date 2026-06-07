'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: '相談する', href: '/jac' },
  { label: 'フレームを使う', href: '/guide' },
  { label: '実践知識を学ぶ', href: '/knowledge' },
  { label: 'ツールキット', href: '/partnership' },
  { label: 'イベント', href: '/events' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resources', href: '/resources' },
  { label: 'NBLについて', href: '/about' },
];

export default function SiteNav() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 text-sm font-semibold tracking-tight text-slate-900 hover:text-teal-700"
        >
          Next Being Lab
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                isActive(href)
                  ? 'bg-slate-100 font-semibold text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/jac/next"
          className="hidden rounded-full bg-slate-950 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-800 md:inline-block"
        >
          相談を始める
        </Link>

        {/* Mobile toggle */}
        <button
          className="ml-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="メニューを開く"
        >
          <span
            className={`block h-0.5 w-5 bg-current transition-all ${open ? 'translate-y-1 rotate-45' : '-translate-y-0.5'}`}
          />
          <span
            className={`mt-1 block h-0.5 w-5 bg-current transition-all ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`mt-1 block h-0.5 w-5 bg-current transition-all ${open ? '-translate-y-2 -rotate-45' : 'translate-y-0.5'}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm transition ${
                  isActive(href)
                    ? 'bg-slate-100 font-semibold text-slate-900'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/jac/next"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              相談を始める
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
