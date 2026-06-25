import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, FileSearch, Search, Sparkles } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import {
  axiomPublicConceptSearchKindLabel,
  axiomPublicConceptSearchSuggestions,
  searchAxiomPublicConceptIndex,
} from '@/lib/axiom/axiomPublicConceptSearch';

function queryFromRouterValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
}

export default function AxiomPublicConceptSearchPage() {
  const router = useRouter();
  const routerQuery = queryFromRouterValue(router.query.q);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(routerQuery);
  }, [routerQuery]);

  const searchResult = useMemo(() => searchAxiomPublicConceptIndex(query, { limit: 32 }), [query]);
  const hasQuery = searchResult.normalizedQuery.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search', undefined, {
      shallow: true,
    });
  }

  return (
    <>
      <PageSeo
        title="サイト内検索 | Next Being Lab"
        description="Next Being Labのページ、NBLレポート、図解、障害種類入口を、キーワードと文脈で横断検索します。"
        path="/search"
        imagePath="/images/next-nbl-home-hero-image2-v1.png"
        imageAlt="Next Being Labのサイト内検索"
      />
      <main className="min-h-screen bg-[#fbfaf5] text-slate-950">
        <header className="border-b border-slate-200 bg-white/88 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
            <Link href="/" className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold tracking-[0.12em] text-teal-800">
                Next Being Lab
              </span>
              <span className="text-sm font-semibold text-slate-950">仕事条件で読む</span>
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-950"
              href="/"
            >
              トップへ
              <ArrowRight size={14} />
            </Link>
          </div>
        </header>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <FileSearch size={14} />
                サイト内検索
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                知りたい言葉から、
                <br />
                近い仕事条件へ。
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">
                キーワードをそのまま探すだけでなく、関連する文脈へ広げて検索します。
                たとえば「難病」は、治療、通院、健康時間、症状変動、開示、評価にも広げて探します。
              </p>
            </div>
            <form
              className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur"
              onSubmit={handleSubmit}
            >
              <label className="text-sm font-semibold text-white/80" htmlFor="nbl-search-query">
                キーワード
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  className="min-h-12 flex-1 rounded-full border border-white/15 bg-white px-5 text-base font-semibold text-slate-950 outline-none ring-0 placeholder:text-slate-400 focus:border-teal-300"
                  id="nbl-search-query"
                  name="q"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="例: 難病、合理的配慮、通勤、開示"
                  type="search"
                  value={query}
                />
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-500 px-6 text-sm font-semibold text-white transition hover:bg-teal-400"
                  type="submit"
                >
                  <Search size={16} />
                  検索
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {axiomPublicConceptSearchSuggestions.map((suggestion) => (
                  <Link
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/86 transition hover:bg-white/18"
                    href={`/search?q=${encodeURIComponent(suggestion)}`}
                    key={suggestion}
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10">
          <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
            <aside className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm lg:self-start">
              <Sparkles className="text-teal-800" size={22} />
              <h2 className="mt-4 text-xl font-semibold tracking-normal">検索の読み方</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                結果は単純な文字一致だけではありません。検索語を、仕事条件、健康時間、情報形式、
                支援接続などの近い文脈へ広げて並べます。
              </p>
              {searchResult.expandedConcepts.length > 0 ? (
                <div className="mt-5">
                  <p className="text-xs font-semibold tracking-[0.16em] text-teal-800">
                    広げて見ている文脈
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {searchResult.expandedConcepts.map((concept) => (
                      <span
                        className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-950"
                        key={concept}
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>

            <div>
              <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-800">
                    Search results
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
                    {hasQuery ? `「${query}」の検索結果` : 'まず読む入口'}
                  </h2>
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {searchResult.matches.length}件
                </p>
              </div>

              {searchResult.matches.length > 0 ? (
                <div className="mt-6 grid gap-4">
                  {searchResult.matches.map((match) => (
                    <article
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md"
                      key={match.id}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {axiomPublicConceptSearchKindLabel(match.kind)}
                        </span>
                        {match.matchedConcepts.slice(0, 2).map((concept) => (
                          <span
                            className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-950"
                            key={concept}
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-normal text-slate-950">
                        <Link className="hover:text-teal-800" href={match.href}>
                          {match.title}
                        </Link>
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{match.summary}</p>
                      <p className="mt-4 rounded-lg border border-teal-100 bg-[#eef5f1] px-4 py-3 text-sm font-semibold leading-7 text-teal-950">
                        {match.reason}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {match.matchedTerms.slice(0, 8).map((term) => (
                          <span
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500"
                            key={term}
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                      <Link
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-900 hover:text-teal-700"
                        href={match.href}
                      >
                        開く
                        <ArrowRight size={14} />
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-slate-700">
                  <h3 className="text-2xl font-semibold tracking-normal text-slate-950">
                    近い結果が見つかりませんでした
                  </h3>
                  <p className="mt-3 leading-8">
                    語を短くするか、「難病」「通勤」「開示」「合理的配慮」のような入口語で試してください。
                    必要なら、今後この検索辞書に新しい言葉を追加できます。
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
