import type { KeyboardEvent, MouseEvent } from 'react';
import { ArrowRight, ChevronDown, Search } from 'lucide-react';
import { AxiomNextSiteLink as Link } from './AxiomNextSiteLinks';
import styles from './AxiomNextSiteChrome.module.css';
import { firstDayAssistance, nextSiteFlagships, workForkEditions } from './workForkRoutes';

const base = '/preview/axiom-next-nbl-v2';
const sections = [
  { label: '実務の道具', items: [
    ...nextSiteFlagships.map((tool) => ({ path: tool.href.slice(base.length), label: tool.name, note: tool.body })),
    { path: '/work-condition-window', label: '障害種類から見る', note: '名前を手がかりに、具体的な仕事条件へ' },
  ] },
  { label: '特集・連作', items: [
    { path: `/${firstDayAssistance.slug}`, label: firstDayAssistance.title, note: '松江のデザイン会社から、地域への提案' },
    { path: '/edition-inspection', label: '仕事の分かれ道 · 創刊号', note: workForkEditions['edition-inspection'].title },
    { path: '/edition-ict', label: '仕事の分かれ道 · 第2号', note: workForkEditions['edition-ict'].title },
  ] },
  { label: '資料と研究', items: [
    { path: '/materials/textbook', label: '教科書', note: '働く可能性と支援の進め方を学ぶ' },
    { path: '/materials/policy', label: '総合政策案', note: '制度・責任・人員と財源を考える' },
    { path: '/materials/research', label: '研究抄録集', note: '問い・知見・反証から根拠を確かめる' },
    { path: '/materials', label: '資料の全体像', note: '目的に合う読み始め方を選ぶ' },
  ] },
  { label: '読み物・素材', items: [
    { path: '/public-collaboration', label: '公開の議論・改善提案', note: '別の見方を届け、道具の改訂を確かめる' },
    { path: '/virtual-news', label: 'バーチャルニュース', note: 'まだない仕事と社会を、創作から考える' },
    { path: '/articles-social-questions', label: 'NBLレポート', note: '現場の違和感を、社会の問いへ' },
    { path: '/toolkit-studio', label: 'ツールキット', note: '図解・マンガ・会議で使う素材を探す' },
    { path: '/resources/songs', label: '音楽', note: '歌詞や音から、働き方を話してみる' },
    { path: '/events/work-choice-forum', label: 'フォーラム', note: '立場の異なる人の提案を聞き比べる' },
    { path: '/events/work-condition-forum', label: 'フォーラム動画・図解', note: '仕事条件デザインを動画・図解・本文から読む' },
  ] },
] as const;
const about = { label: 'NBLについて', items: [
    { path: '/theory-method-trust', label: '研究と専門性', note: '何を目指し、どう確かめているか' },
    { path: '/projects', label: 'プロジェクト・協働', note: '企業・機関・地域で取り組むテーマ' },
    { path: '/about-boundary', label: '運営者・サイト情報', note: '責任・問い合わせ・出典と権利' },
  ] } as const;

function href(path: string) {
  return path.startsWith('/materials') || path === '/virtual-news' || path.startsWith('/resources/') || path.startsWith('/events/')
    ? path : `${base}${path}`;
}
function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest('details')?.removeAttribute('open');
}
function escapeMenu(event: KeyboardEvent<HTMLDetailsElement>) {
  if (event.key !== 'Escape') return;
  event.currentTarget.open = false;
  event.currentTarget.querySelector('summary')?.focus();
}

export function AxiomNextSiteHeader({ currentPath = '/' }: { currentPath?: string }) {
  const isCurrent = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href={base} aria-current={currentPath === '/' ? 'page' : undefined}>
          <span className={styles.mark} aria-hidden="true">N</span>
          <span><strong>Next Being Lab</strong></span>
        </Link>
        <nav className={styles.navigation} aria-label="NBLサイトの案内">
          {sections.map((section) => (
            <details className={styles.menu} key={section.label} name="nbl-primary-navigation" onKeyDown={escapeMenu}>
              <summary data-current={section.items.some((item) => isCurrent(item.path)) || undefined}>
                {section.label}<ChevronDown size={14} aria-hidden="true" />
              </summary>
              <div className={styles.menuPanel}>
                {section.items.map((item) => (
                  <Link href={href(item.path)} key={item.path} onClick={closeMenu} aria-current={isCurrent(item.path) ? 'page' : undefined}>
                    <strong>{item.label}</strong><span>{item.note}</span>
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <Link className={styles.collaborate} href={`${base}/public-collaboration`}>議論に参加</Link>
          <Link className={styles.search} href={`${base}/search`} aria-label="検索"><Search size={19} aria-hidden="true" /><span>検索</span></Link>
        </div>
      </div>
    </header>
  );
}

export function AxiomNextSiteFooter({ editionNote }: { editionNote?: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerIntro}>
          <div><strong className={styles.footerBrand}>Next Being Lab</strong>
            <p className={styles.footerPurpose}>必要な支援とともに、<br />望む仕事と生活を選べる社会へ。</p>
            <p>本人への支援と、仕事・職場・制度・財源の見直しをつなぐ。</p>
          </div>
          <Link href={`${base}/projects#project-inquiry`}>NBLと取り組むテーマを見る<ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <nav className={styles.footerNavigation} aria-label="サイト全体から探す">
          {[...sections, about].map((section) => (
            <div key={section.label}><h2>{section.label}</h2>
              {section.items.map((item) => <Link key={item.path} href={href(item.path)}>{item.label}</Link>)}
            </div>
          ))}
        </nav>
        <div className={styles.footerBottom}>
          <p>{editionNote && <span>{editionNote}<br /></span>}内容は学習・検討のための資料です。個別の判断・実施は、本人と権限を持つ関係者が行います。</p>
          <p>© Next Being Lab</p>
        </div>
      </div>
    </footer>
  );
}
