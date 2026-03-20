import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Noto_Sans_JP } from 'next/font/google';
import type { ReactNode } from 'react';

const display = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['900'],
  display: 'swap',
});

type ReviewTheme = 'emerald' | 'amber' | 'cyan';

type ReviewHeroShellProps = {
  theme: ReviewTheme;
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  sideEyebrow: string;
  sideTitle: ReactNode;
  sideBody: string;
  sideExtra?: ReactNode;
  sideLink?: {
    href: string;
    label: string;
  };
};

const themeClasses: Record<
  ReviewTheme,
  {
    heroBg: string;
    badgeBorder: string;
    badgeBg: string;
    badgeText: string;
    accentText: string;
    sideRing: string;
    sideBg: string;
  }
> = {
  emerald: {
    heroBg:
      'bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(8,145,178,0.14),_transparent_28%),linear-gradient(180deg,_#fbf6ee_0%,_#f7f3ec_58%,_#f5efe6_100%)]',
    badgeBorder: 'border-emerald-200',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    accentText: 'text-emerald-800',
    sideRing: 'border-emerald-200',
    sideBg: 'bg-white/92',
  },
  amber: {
    heroBg:
      'bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(8,145,178,0.14),_transparent_28%),linear-gradient(180deg,_#fbf6ee_0%,_#f7f3ec_58%,_#f5efe6_100%)]',
    badgeBorder: 'border-amber-200',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    accentText: 'text-amber-800',
    sideRing: 'border-amber-200',
    sideBg: 'bg-white/92',
  },
  cyan: {
    heroBg:
      'bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_22%),linear-gradient(180deg,_#fbf6ee_0%,_#f7f3ec_58%,_#f5efe6_100%)]',
    badgeBorder: 'border-cyan-200',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    accentText: 'text-cyan-800',
    sideRing: 'border-cyan-200',
    sideBg: 'bg-white/92',
  },
};

export function ReviewHeroShell({
  theme,
  backHref,
  backLabel,
  eyebrow,
  title,
  subtitle,
  sideEyebrow,
  sideTitle,
  sideBody,
  sideExtra,
  sideLink,
}: ReviewHeroShellProps) {
  const colors = themeClasses[theme];

  return (
    <section className={`border-b border-stone-200 ${colors.heroBg}`}>
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 md:pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-stone-400 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] ${colors.badgeBorder} ${colors.badgeBg} ${colors.badgeText}`}
          >
            Review Draft
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${colors.accentText}`}>
              {eyebrow}
            </p>
            <h1 className={`mt-4 max-w-5xl text-4xl leading-tight text-slate-950 md:text-6xl ${display.className}`}>
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">{subtitle}</p>
          </div>

          <aside
            className={`rounded-[2rem] border ${colors.sideRing} ${colors.sideBg} p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.35)]`}
          >
            <p className="text-sm font-semibold tracking-[0.16em] text-slate-600">{sideEyebrow}</p>
            <div className="mt-5 text-2xl font-black leading-tight text-slate-950">{sideTitle}</div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{sideBody}</p>
            {sideExtra ? <div className="mt-5">{sideExtra}</div> : null}
            {sideLink ? (
              <Link
                href={sideLink.href}
                className="mt-5 inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-stone-400 hover:text-slate-900"
              >
                {sideLink.label}
              </Link>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
