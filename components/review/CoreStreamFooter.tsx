import Link from 'next/link';
import { ArrowRight, Waypoints } from 'lucide-react';
import { relaunchPublicStreams } from '@/lib/content/relaunchPublicHome';

type CoreStreamFooterProps = {
  currentId: 'what-we-do' | 'methods' | 'resources' | 'vision' | 'operating-model';
  title?: string;
  description?: string;
};

export function CoreStreamFooter({
  currentId,
  title = '他の stream とどうつながるか',
  description = 'このページだけで閉じず、完成版では Home を中心に各 stream が連続して読める形へそろえていく。',
}: CoreStreamFooterProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex items-start gap-3">
        <Waypoints size={18} className="mt-1 shrink-0 text-cyan-700" />
        <div>
          <p className="text-sm font-semibold tracking-[0.14em] text-slate-500">Connected Streams</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{description}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {relaunchPublicStreams.map((stream, index) => {
          const isCurrent = stream.id === currentId;

          return (
            <article
              key={stream.id}
              className={`rounded-[1.8rem] border p-6 shadow-sm shadow-stone-200/60 ${
                isCurrent
                  ? 'border-cyan-300 bg-cyan-50/80'
                  : 'border-stone-300 bg-white/92'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-black ${
                    isCurrent
                      ? 'border-cyan-400 bg-white text-cyan-900'
                      : 'border-stone-300 bg-stone-100 text-slate-700'
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`text-xs font-bold uppercase tracking-[0.18em] ${
                    isCurrent ? 'text-cyan-800' : 'text-slate-500'
                  }`}
                >
                  {isCurrent ? 'Current' : 'Stream'}
                </span>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {stream.question}
              </p>
              <h3 className="mt-3 text-xl font-black text-slate-950">{stream.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{stream.detail}</p>
              {!isCurrent ? (
                <Link
                  href={stream.href}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-stone-400 hover:bg-white hover:text-slate-950"
                >
                  この stream へ
                  <ArrowRight size={15} />
                </Link>
              ) : (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-white px-4 py-2 text-sm font-semibold text-cyan-900">
                  このページ
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
