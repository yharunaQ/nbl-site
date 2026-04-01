import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Film, ShieldCheck } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import {
  publicVideoScopeNotes,
  publicVideos,
  publicVideosHero,
} from '@/lib/content/publicVideos';

export default function PublicVideosPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_52%,#eef2ff_100%)] text-slate-900">
      <PageSeo
        title="公開動画 | Next Being Lab"
        description="Next Being Lab が現在 public-safe に案内する YouTube 動画を、短い説明付きでまとめたページ。"
        path="/videos"
      />

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Next Being Lab
            </p>
            <p className="mt-2 text-sm text-slate-600">Public videos</p>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            Resourcesへ戻る
          </Link>
        </div>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.05fr,0.95fr]">
          <div>
            <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              公開中の選抜動画
            </p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {publicVideosHero.eyebrow}
            </p>
            <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {publicVideosHero.headline}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              {publicVideosHero.subheadline}
            </p>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              <ShieldCheck size={16} />
              Scope
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {publicVideoScopeNotes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="border-t border-slate-200 py-12">
          <div className="grid gap-6 lg:grid-cols-2">
            {publicVideos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/60"
              >
                <div className="border-b border-slate-200 bg-slate-50">
                  <Image
                    src={video.thumbnailSrc}
                    alt={`${video.title} のサムネイル`}
                    width={480}
                    height={360}
                    className="h-auto w-full"
                  />
                </div>
                <div className="p-6 md:p-7">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    <Film size={14} />
                    {video.topic}
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-slate-900">{video.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{video.summary}</p>
                  <div className="mt-5 rounded-[1.5rem] border border-sky-200 bg-sky-50 px-5 py-5">
                    <p className="text-sm font-semibold text-slate-900">いまここに置く理由</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{video.whyNow}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={video.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      YouTubeで再生
                      <ExternalLink size={16} />
                    </a>
                    <Link
                      href={video.relatedResource.href}
                      className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                    >
                      {video.relatedResource.label}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
