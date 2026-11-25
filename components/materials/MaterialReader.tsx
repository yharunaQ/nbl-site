import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Printer, Search } from 'lucide-react';
import MaterialsShell from './MaterialsShell';
import styles from './Materials.module.css';
import { materialCatalog, researchAreas, type ReadingEntry } from '@/lib/materials/catalog';
import MaterialCompleteReader from './MaterialCompleteReader';
import { supportsCompleteBook } from '@/lib/materials/complete';
import { useNextSiteCandidate } from '@/components/axiom/AxiomNextSiteCandidateContext';
import { organizationChecks } from '@/components/axiom/organizationChecklistContent';
type Props = { slug: string; contents: (Omit<ReadingEntry, 'html'> & { searchText?: string })[]; entry: ReadingEntry | null; completeEntries?: ReadingEntry[] };
export default function MaterialReader({ slug, contents, entry, completeEntries }: Props) {
  const candidate = useNextSiteCandidate();
  const m = materialCatalog.find((m) => m.slug === slug)!;
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('all');
  useEffect(() => {
    setQuery('');
    setArea('all');
  }, [slug]);
  if (completeEntries) return <MaterialCompleteReader slug={slug} entries={completeEntries} contents={contents.length ? contents : completeEntries} />;
  const isBook = supportsCompleteBook(slug);
  const hasCompanion = isBook && contents.some(item => item.id === 'technical');
  const companionLabel = slug === 'policy' ? '技術別冊' : '実践詳論';
  const queryWords = query.normalize('NFKC').toLocaleLowerCase('ja').trim().split(/\s+/).filter(Boolean);
  const filtered =
    slug !== 'research'
      ? contents
      : contents.filter(
          (e) =>
            (area === 'all' || e.area === area) &&
            queryWords.every((word) => `${e.id} ${e.title} ${e.subtitle} ${e.searchText ?? ''}`
              .normalize('NFKC').toLocaleLowerCase('ja').includes(word)),
        );
  const index = entry ? contents.findIndex((e) => e.id === entry.id) : -1;
  const sectionLinks = entry
    ? [...entry.html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map((m) => ({
        id: m[1],
        title: m[2],
      }))
    : [];
  const sectionNavigation = (
    <nav className={styles.sectionContents} aria-label="本文内の目次">
      <h2>この本文の目次</h2>
      <ol>
        {sectionLinks.map((s) => (
          <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
        ))}
      </ol>
    </nav>
  );
  const contentsLinks = (
    <ol>
      {contents.map((e) => (
        <li key={e.id}>
          <Link href={hrefFor(e.id)} aria-current={e.id === entry?.id ? 'page' : undefined}>
            {e.title}
          </Link>
        </li>
      ))}
    </ol>
  );
  function hrefFor(id: string) {
    return `/materials/${slug}/${id}`;
  }
  const adjacent = entry ? [contents[index - 1], contents[index + 1]] : [];
  const href = (id: string) => `/materials/${slug}/${id}`;
  const practiceHref = candidate && entry
    ? slug === 'work-design' && /^WDG2-(?:0[1-9]|10)$/.test(entry.id)
      ? `/work-design-views-guide?system=${entry.id}#guide-detail`
      : slug === 'support' && organizationChecks.some((check) => check.id === entry.id)
        ? `/support-organization-checklist?theme=${entry.id}&view=organization#support-workbench`
        : null
    : null;
  return (
    <MaterialsShell
      title={entry ? `${entry.title} — ${m.title}` : m.title}
      description={entry?.subtitle || m.description}
      path={entry ? href(entry.id) : `/materials/${slug}`}
    >
      <div className={styles.readerTop}>
        <nav aria-label="現在の場所">
          <Link href="/materials">資料集</Link>
          <span>/</span>
          {entry ? (
            <>
              <Link href={`/materials/${slug}`}>{m.title}</Link>
              <span>/</span>
              <span>本文</span>
            </>
          ) : (
            <span>{m.title}</span>
          )}
        </nav>
        <p>{m.edition}</p>
      </div>
      {!entry ? (
        <>
          <section className={styles.bookHero}>
            <div>
              <p className={styles.eyebrow}>
                {m.number} / {m.label}
              </p>
              <h1>{m.title}</h1>
              <p className={styles.bookLead}>{m.description}</p>
              <p className={styles.audience}>{m.audience}</p>
            </div>
            <div className={styles.bookStart}>
              <span>{m.count}</span>
              <h2>ここから読む</h2>
              <p>{m.start}</p>
              <Link className={styles.primary} href={href(m.example)}>
                {slug === 'policy' ? '政策判断の要点から読む' : slug === 'textbook' ? '第1章を読む' : slug === 'research' && m.example === 'reading-guide' ? '横断解説を読む' : '代表例を読む'} <ArrowRight size={17} />
              </Link>
            </div>
          </section>
          {isBook && <nav className={styles.bookReadingOptions} aria-label="本の読み方を選ぶ">
            {slug === 'textbook' && <Link href={href('reading-guide')}>困りごとから読む・一つの相談を追って学ぶ →</Link>}
            <Link href={href('all')}>{hasCompanion ? '本編全文を続けて読む・印刷する →' : '全冊を続けて読む・印刷する →'}</Link>
            {hasCompanion && <Link href={href('technical')}>{companionLabel}を読む →</Link>}
          </nav>}
          <aside className={styles.readerScope}>
            <strong>この資料でできること</strong>
            <p>{m.decision}</p>
            <p>{m.scope}</p>
          </aside>
          <section className={styles.contents} id="contents">
            <div className={styles.sectionHead}>
              <h2>{slug === 'research' ? '問いから探す' : '目次・全体像'}</h2>
              <p>
                {slug === 'research'
                  ? '6分野から、関連する問いをたどれます。'
                  : '各章・テーマには本文があります。途中からも読めます。'}
              </p>
            </div>
            {slug === 'research' && (
              <div className={styles.filters}>
                <label className={styles.search}>
                  <Search size={18} />
                  <span className={styles.srOnly}>抄録の題名と本文を検索</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="search"
                    placeholder="例：納付金 配分（空白で絞り込み）"
                  />
                </label>
                <label>
                  分野
                  <select value={area} onChange={(e) => setArea(e.target.value)}>
                    <option value="all">すべての分野</option>
                    {Object.entries(researchAreas).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <p role="status" aria-live="polite">
                  {filtered.filter(e => e.id !== 'reading-guide').length} / {contents.filter(e => e.id !== 'reading-guide').length}抄録
                  {contents.some(e => e.id === 'reading-guide') && ` ＋ 横断解説${filtered.some(e => e.id === 'reading-guide') ? '1' : '0'} / 1件`}
                </p>
              </div>
            )}
            <ol className={styles.contentsList}>
              {filtered.map((e, i) => (
                <li key={e.id}>
                  <Link href={href(e.id)}>
                    <span className={styles.entryNumber}>
                      {slug === 'research'
                        ? e.id === 'reading-guide' ? '横断解説' : e.id.replace('NBL-RK-', '')
                        : String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <strong>{e.title}</strong>
                      {e.subtitle && <small>{e.subtitle}</small>}
                      {e.area && e.id !== 'reading-guide' && (
                        <em>
                          {researchAreas[e.area]} ／ 原論証 v{e.version}
                        </em>
                      )}
                    </span>
                    <ArrowRight size={19} />
                  </Link>
                </li>
              ))}
            </ol>
            {filtered.length === 0 && (
              <p className={styles.empty}>
                該当する題名・論点がありません。短い言葉に変えるか、分野の選択を広げてください。検索にないことは、知見がないことを意味しません。
              </p>
            )}
          </section>
        </>
      ) : (
        <div className={styles.readingLayout}>
          <aside className={styles.side}>
            <nav className={styles.desktopContents} aria-label="資料の目次">
              <h2>この資料の目次</h2>
              {contentsLinks}
            </nav>
            <details className={styles.mobileContents}>
              <summary>この資料の目次（{contents.length}項目）</summary>
              {contentsLinks}
            </details>
            <Link href={`/materials/${slug}`} className={styles.back}>
              <ArrowLeft size={16} /> 全体像・代表例へ
            </Link>
          </aside>
          <article className={styles.readingArticle}>
            <header className={styles.articleHead}>
              <p className={styles.eyebrow}>
                {m.label}
                {slug === 'research' ? entry.id === 'reading-guide' ? ' ／ 横断解説' : ` / ${entry.id} / 論証 v${entry.version}` : ''}
              </p>
              <h1>{entry.title}</h1>
              {entry.subtitle && <p className={styles.articleLead}>{entry.subtitle}</p>}
              <p className={styles.meta}>{m.readerEdition} ／ {m.readerUpdated}　・　{m.edition}</p>
              <button type="button" onClick={() => window.print()} className={styles.print}>
                <Printer size={16} /> この本文を印刷・PDF保存
              </button>
              {isBook && <nav className={styles.bookReadingOptions} aria-label="全冊と読書案内">
                <Link href={href('all')}>{hasCompanion ? '本編全文を続けて読む・印刷する →' : '全冊を続けて読む・印刷する →'}</Link>
            {hasCompanion && <Link href={href('technical')}>{companionLabel}を読む →</Link>}
                {slug === 'textbook' && entry.id !== 'reading-guide' && <Link href={href('reading-guide')}>本書の読み方 →</Link>}
              </nav>}
            </header>
            {slug === 'research' ? (
              <details className={styles.readerContext}>
                <summary>{entry.id === 'reading-guide' ? '収録範囲・版の説明と、横断解説の目次' : '収録範囲・版の説明と、この抄録の目次'}</summary>
                <aside className={styles.scopeSmall}>{m.scope}</aside>
                {sectionNavigation}
              </details>
            ) : isBook ? (
              <>
                <p className={styles.readerStatus}>{slug === 'policy'
                  ? '制度・給付・負担率はNBLの提案です。数量例は仮定に基づきます。'
                  : '学習用の教材です。架空例と出典に基づく記述を区別して読んでください。'}</p>
                <details className={styles.readerContext}>
                  <summary>この本文の目次・資料の利用範囲</summary>
                  <aside className={styles.scopeSmall}>{m.scope}</aside>
                  {sectionNavigation}
                </details>
              </>
            ) : (
              <>
                <aside className={styles.scopeSmall}>{m.scope}</aside>
                {sectionNavigation}
              </>
            )}
            <div className={styles.prose} dangerouslySetInnerHTML={{ __html: entry.html }} />
            {practiceHref && <nav className={styles.bookReadingOptions} aria-label="実務ツールで続ける">
              <Link href={practiceHref}>同じテーマを実務ツールで使う →</Link>
              <span>この閲覧用本文とは別の、実務ツール開発版へ移ります。</span>
            </nav>}
            <nav className={styles.adjacent} aria-label="前後の本文">
              {adjacent.map((e, i) =>
                e ? (
                  <Link key={e.id} href={href(e.id)}>
                    <span>{i === 0 ? '← 前へ' : '次へ →'}</span>
                    <strong>{e.title}</strong>
                  </Link>
                ) : (
                  <span key={i} />
                ),
              )}
            </nav>
          </article>
        </div>
      )}
      <section className={styles.related}>
        <h2>同じ問いを、別の資料で考える</h2>
        <div>
          {materialCatalog
            .filter((other) => other.slug !== slug)
            .map((other) => (
              <Link key={other.slug} href={`/materials/${other.slug}`}>
                <span>{other.label}</span>
                <strong>{other.title}</strong>
                <ArrowRight size={17} />
              </Link>
            ))}
        </div>
      </section>
    </MaterialsShell>
  );
}
export type { Props as MaterialReaderProps };
