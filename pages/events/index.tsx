import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';
import { ArrowRight, CalendarDays, Music, PanelsTopLeft } from 'lucide-react';
import Link from 'next/link';

const events = [
  {
    label: 'Virtual Forum',
    title: '仕事条件デザイン・バーチャルフォーラム',
    body: '6セッション、22発表の仮想フォーラムとして、雇用率、ラベル、観察、見えない障害・難病、AI活用を仕事条件デザインの問いで読み直します。',
    href: '/events/work-condition-forum#forum-top',
    image: '/images/work-condition-forum-virtual-city-hero-v1.webp',
    icon: PanelsTopLeft,
  },
  {
    label: 'Music Festival',
    title: 'WORK UPDATE FEST 2026',
    body: '言葉だけでは届きにくい働き方の問いを、音楽、映像、短い物語から感じ取るイベント型コンテンツです。',
    href: '/resources/songs',
    image: '/songs/still/ganbari-yori-sekkei.jpg',
    icon: Music,
  },
];

export default function EventsIndexPage() {
  return (
    <>
      <PageSeo
        title="イベント | Next Being Lab"
        description="Next Being Labのイベント型コンテンツ。仕事条件デザイン・バーチャルフォーラムとWORK UPDATE FEST 2026をまとめた入口です。"
        path="/events"
      />
      <SiteNav />
      <main className="min-h-screen bg-[#f7f3ea] text-slate-950">
        <section className="border-b border-slate-200 bg-slate-950 py-16 text-white">
          <div className="mx-auto max-w-6xl px-5">
            <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-cyan-100">
              <CalendarDays size={18} aria-hidden="true" />
              EVENTS
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
              記事だけではなく、場として読む。
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/76 md:text-lg md:leading-9">
              フォーラム、音楽、映像など、同じ仕事条件の問いをイベント型の入口としてまとめます。公式提携、翻訳、認定、個別判断を示す面ではありません。
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-5 py-12 md:grid-cols-2">
          {events.map((event) => {
            const Icon = event.icon;
            return (
              <Link
                key={event.title}
                href={event.href}
                className="group overflow-hidden border border-slate-300 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-600 hover:shadow-lg"
              >
                <div className="relative h-64 bg-slate-200">
                  <img
                    src={event.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-slate-950/18" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 border border-white/40 bg-slate-950/62 px-3 py-2 text-xs font-semibold tracking-[0.14em] text-white">
                    <Icon size={16} aria-hidden="true" />
                    {event.label}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                    {event.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{event.body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 group-hover:text-cyan-950">
                    イベントを見る
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      </main>
    </>
  );
}
