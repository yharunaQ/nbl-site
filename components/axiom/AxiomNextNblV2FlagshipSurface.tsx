import {
  AxiomNextSiteLink as Link,
  useNextSiteHref,
  useNextSiteLinkMode,
  useNextSitePublished,
  NEXT_SITE_SAVED_GUIDE_HREF,
} from './AxiomNextSiteLinks';
import Router from 'next/router';
import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  MessageCircleQuestion,
  Printer,
  RefreshCw,
  Search,
} from 'lucide-react';
import { NBL_CONSULTATION_CASE_V2_READER_PRODUCTION } from '@/lib/fchma/core/nblConsultationCaseV2ReaderProduction';
import { NBL_WORK_DESIGN_GUIDE_V2, NBL_WORK_DESIGN_GUIDE_V2_CURRENT_FRAMES } from '@/lib/fchma/core/nblWorkDesignGuideV2';
import styles from './AxiomNextNblV2FlagshipSurface.module.css';
import { AxiomNextSiteHeader, AxiomNextSiteFooter } from './AxiomNextSiteChrome';
import { materialCatalog } from '@/lib/materials/catalog';
import AxiomWorkTimeGuide from './AxiomWorkTimeGuide';
import ResearchKnowledgeApplication from './ResearchKnowledgeApplication';
import AxiomWorkInterruptionCaseGuide from './AxiomWorkInterruptionCaseGuide';
import AxiomWorkAccessGuide from './AxiomWorkAccessGuide';
import AxiomWorkSystemGuide from './AxiomWorkSystemGuide';
import { workSystemPracticalExamples } from './workSystemPracticalExamples';
import { employmentWorkPlanHref, employmentWorkPlanCaseIds } from './employmentWorkPlan';
import {
  workDesignEntry,
  workDesignEntryPoints,
  workDesignReadingOrder,
} from './workDesignEntryPoints';
import { organizationChecks, supportToolHref } from './organizationChecklistContent';
import { workbookHref } from './practiceWorkbook';
import SupportPracticeConnection, { supportGuideConnections } from './SupportPracticeConnection';
import FlagshipDecisionNote from './FlagshipDecisionNote';
import ProofreadingFlagshipExample, { proofreadingExampleHref } from './ProofreadingFlagshipExample';
import WorkForkHome from './WorkForkHome';
import { firstDayAssistance, nextSiteHome, workForkEditions } from './workForkRoutes';
import {
  consultationCaseEntry,
  consultationEntrySearchText,
  matchesConsultationEntry,
} from './consultationCaseEntryViews';

type FlagshipSurface = 'home' | 'case-readings' | 'work-design-views-guide' | 'search';

type AxiomNextNblV2FlagshipSurfaceProps = {
  surface: FlagshipSurface;
  initialGuideSystemId?: string;
};

const base = '/preview/axiom-next-nbl-v2';

function guideCompanions(systemId: string) {
  if (systemId === 'WDG2-04') {
    return {
      toolkitHref: `${base}/toolkit-studio#toolkit-use-package-health-time`,
      toolkitLabel: '時間・仕事量を話す素材へ',
      reportHref: `${base}/articles-social-questions?article=health-time-work-condition#full-article-reader`,
      reportLabel: '「疲れやすい」で止めない読み方へ',
    };
  }
  return {
    toolkitHref: `${base}/toolkit-studio`,
    toolkitLabel: 'チームで使える素材へ',
    reportHref: `${base}/articles-social-questions`,
    reportLabel: '背景をNBLレポートで読む',
  };
}

const guideSystemVisuals: Record<string, { src: string; alt: string; caption: string }> = {
  'WDG2-01': {
    src: '/images/axiom-work-design-guide/support-continuity-items-board-v1.png',
    alt: '相談と支援を、担当、役割境界、職場で動く仕事条件へつなぐ具体項目の図解',
    caption: '相談を一人の調整力に預けず、誰へ届き、何を仕事条件へ戻すかを見る。',
  },
  'WDG2-02': {
    src: '/images/axiom-work-design-guide/disclosure-evaluation-items-board-v1.png',
    alt: '目的を限定した情報共有、同意範囲、評価や過剰管理のリスクを示す図解',
    caption: '話す量ではなく、目的、共有先、同意範囲、評価との境界を見る。',
  },
  'WDG2-03': {
    src: '/images/axiom-work-design-guide/procedure-switching-items-board-v1.png',
    alt: '指示、手順、切替、確認、ミスからの戻り方を仕事の仕組みとして示す図解',
    caption: '本人の注意力だけでなく、開始、切替、確認、戻り方を仕事手順として見る。',
  },
  'WDG2-04': {
    src: '/images/axiom-work-design-guide/health-time-items-board-v1.png',
    alt: '体調変動、回復、通勤、仕事量、収入や評価を健康時間の設計項目として示す図解',
    caption: '体調の波を、勤務、移動、回復、仕事密度、評価の時間設計として見る。',
  },
  'WDG2-05': {
    src: '/images/axiom-work-design-guide/worksite-contact-items-board-v1.png',
    alt: '作業、道具、設備、動線、安全、人員、顧客接点を職場アクセスとして示す図解',
    caption: '情報、動線、道具、安全、人員を、仕事に参加する接点として見る。',
  },
  'WDG2-06': {
    src: '/images/axiom-work-design-guide/pre-entry-transition-items-board-v1.png',
    alt: '応募前の条件、仕事体験、訓練、採用後への引継ぎを示す図解',
    caption: '就職前の仕事像と体験を、採用後にも残る条件へつなぐ。',
  },
  'WDG2-07': {
    src: '/images/axiom-work-design-guide/support-continuity-items-board-v1.png',
    alt: '医療、生活、支援の言葉を職場で実行できる仕事条件へ翻訳する図解',
    caption: '仕事の分析、教え方、助言の活用を、現場の担当と一緒に考える。',
  },
  'WDG2-08': {
    src: '/images/nbl-virtual-news/team-fairness-work-allocation-redesign-hero-v1.png',
    alt: 'チームが仕事量と担当を可視化し、支援負担を配分し直す職場の場面',
    caption: '誰かの無償の穴埋めで支援を成立させず、仕事量、要員、時間、費用を配分する。',
  },
  'WDG2-09': {
    src: '/images/axiom-work-design-guide/growth-quality-items-board-v1.png',
    alt: '就職後の役割、評価、処遇、収入、学習、キャリア、選び直しを示す図解',
    caption: '働き続けるだけでなく、役割、評価、収入、学び、選び直しまで見る。',
  },
  'WDG2-10': {
    src: '/images/axiom-article-image2-infographics/sustainable-employment-outcomes-v1.png',
    alt: '定着期間だけでなく、本人便益、役割成長、支援継続、組織学習、無理のなさを確かめる図解',
    caption: '継続だけを成功にせず、本人、仕事、支援、組織の変化を分けて見直す。',
  },
};

function SiteHeader({ surface }: { surface: FlagshipSurface }) {
  return <AxiomNextSiteHeader currentPath={surface === 'home' ? '/' : `/${surface}`} />;
}

function SiteFooter() {
  return <AxiomNextSiteFooter />;
}

function CaseSurface() {
  const nextSiteHref = useNextSiteHref();
  const model = NBL_CONSULTATION_CASE_V2_READER_PRODUCTION;
  const [query, setQuery] = useState('');
  const [reader, setReader] = useState('all');
  const [showAllCases, setShowAllCases] = useState(false);
  const [selectedId, setSelectedId] = useState(model.cases[0].caseId);
  const readers = useMemo(
    () => [...new Set(model.cases.map((item) => item.readerJa))],
    [model.cases],
  );
  const visibleCases = useMemo(() => {
    const normalized = normalizeSearchText(query).trim();
    const terms = normalized.split(/\s+/);
    return model.cases.filter((item) => {
      if (reader !== 'all' && item.readerJa !== reader) return false;
      if (!normalized) return true;
      const text = normalizeSearchText(consultationEntrySearchText(item));
      return terms.every((term) => text.includes(term));
    });
  }, [model.cases, query, reader]);
  const selectedBase =
    visibleCases.find((item) => matchesConsultationEntry(item, selectedId)) ??
    visibleCases[0] ??
    model.cases[0];
  const selected = consultationCaseEntry(selectedBase, selectedId, normalizeSearchText(query));
  // Related infrastructure is a many-to-many inventory, not a ranked next action.
  // Keep the conditional guide choices already explained in this consultation.
  const nextGuides = [...new Set(selected.branches.map((branch) => branch.guideSystemId))]
    .map((systemId) => model.guides.find((guide) => guide.systemId === systemId))
    .filter((guide): guide is (typeof model.guides)[number] => Boolean(guide));
  const companions = guideCompanions(nextGuides.length === 1 ? nextGuides[0].systemId : '');

  useEffect(() => setShowAllCases(false), [query, reader]);

  useEffect(() => {
    const selectLinkedCase = () => {
      const anchor = window.location.hash.replace(/^#/, '');
      const interruptionEntry = anchor === 'case-interruption';
      const linkedCase = model.cases.some((item) => matchesConsultationEntry(item, anchor));
      const requested = interruptionEntry
        ? 'health-time-and-morning-variation'
        : linkedCase ? anchor : new URLSearchParams(window.location.search).get('case');
      if (!requested || !model.cases.some((item) => matchesConsultationEntry(item, requested)))
        return;
      setQuery('');
      setReader('all');
      setSelectedId(requested);
      if (!interruptionEntry && !linkedCase) return;
      window.requestAnimationFrame(() => {
        document
          .getElementById(interruptionEntry ? 'case-interruption-title' : 'case-detail-title')
          ?.focus({ preventScroll: true });
        document
          .getElementById(interruptionEntry ? 'case-interruption' : 'case-detail')
          ?.scrollIntoView?.({ block: 'start' });
      });
    };
    selectLinkedCase();
    window.addEventListener('hashchange', selectLinkedCase);
    return () => window.removeEventListener('hashchange', selectLinkedCase);
  }, [model.cases]);

  const selectCase = (caseId: string) => {
    setSelectedId(caseId);
    void Router.replace(
      `${window.location.pathname}${window.location.search}#${caseId}`,
      undefined,
      { shallow: true, scroll: false },
    );
    window.requestAnimationFrame(() => {
      document.getElementById('case-detail-title')?.focus({ preventScroll: true });
      document.getElementById('case-detail')?.scrollIntoView?.({ block: 'start' });
    });
  };

  const selectRelatedCase = (event: MouseEvent<HTMLAnchorElement>, caseId: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    // A search can change the displayed entry without changing the URL. A link
    // back to that same hash must still clear the filter and select the entry.
    event.preventDefault();
    setQuery('');
    setReader('all');
    selectCase(caseId);
  };

  const noteHref = `?case=${encodeURIComponent(selected.entryId)}#decision-note`;
  function openDecisionNote(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    void Router.replace(`${window.location.pathname}${noteHref}`, undefined, {
      shallow: true, scroll: false,
    });
    const note = document.getElementById('decision-note');
    note?.focus({ preventScroll: true });
    note?.scrollIntoView?.({ block: 'start' });
  }

  return (
    <>
      <section className={`${styles.productHero} ${styles.caseHero}`}>
        <div>
          <p className={styles.kicker}>CONSULTATION CASE 2.0</p>
          <h1>
            <span className={styles.headlineLine}>この相談に、</span>{' '}
            <span className={styles.headlineLine}>どう応じよう。</span>
          </h1>
          <p>
            同じ職場の仕組みも、その人の状況で使い方は変わります。何を聞き、どの方法を本人と選び、誰と実施するか。さまざまな相談場面から、個別の対応を考えるガイドです。仕組みがまだなくても、いまの相談から始められます。
          </p>
          <a href="#case-browser" className={styles.primaryAction}>
            相談の一言を探す <ArrowRight size={18} />
          </a>
          <nav className={styles.quickLinks} aria-label="本人・企業・支援者の相談">
            <a href={proofreadingExampleHref}>求人がないときの別案・保留を考える</a>
            {visibleCases.length > 0 && (
              <a href={noteHref} onClick={openDecisionNote}>選んでいる事例から、自分の別案を書く</a>
            )}
            <Link
              href={`${base}/case-readings#ojt-as-teaching-work-system`}
              onClick={(event) => selectRelatedCase(event, 'ojt-as-teaching-work-system')}
            >
              教え方と仕事の条件
            </Link>
            <Link
              href={`${base}/case-readings#role-evaluation-growth`}
              onClick={(event) => selectRelatedCase(event, 'role-evaluation-growth')}
            >
              任せる役割・育成・評価
            </Link>
            <Link
              href={`${base}/case-readings#support-response-with-person-control`}
              onClick={(event) => selectRelatedCase(event, 'support-response-with-person-control')}
            >
              支援機関との分担
            </Link>
          </nav>
        </div>
        <figure>
          <img
            alt="相談の一言から複数の可能性、確認する問い、仕事設計へ進む循環図"
            src="/images/next-nbl-consultation-assessment-loop-hero-v1.png"
          />
        </figure>
      </section>

      <section className={styles.casePrinciple} aria-label="相談事例で確認できること">
        <div>
          <MessageCircleQuestion size={22} aria-hidden="true" />
          <strong>背景を確かめる</strong>
          <p>同じ「難しい」でも、仕事量、伝え方、本人の希望で対応は変わります。</p>
        </div>
        <div>
          <BriefcaseBusiness size={22} aria-hidden="true" />
          <strong>具体的な対応を選ぶ</strong>
          <p>本人と何を相談し、職場や支援機関の誰が、何を変えられるか。</p>
        </div>
        <div>
          <RefreshCw size={22} aria-hidden="true" />
          <strong>実施したあとも支える</strong>
          <p>改善しない、別の負担が増えた。そんな時に見直す点も扱います。</p>
        </div>
      </section>

      <ProofreadingFlagshipExample kind="case" />
      <section className={styles.caseWorkspace} id="case-browser">
        <aside className={styles.caseBrowser} aria-label="相談事例を探す">
          <div className={styles.browserHeading}>
            <p className={styles.kicker}>30 CONSULTATION ENTRIES</p>
            <h2>いま聞こえている言葉から。</h2>
          </div>
          <label className={styles.searchBox}>
            <Search size={18} />
            <span className="sr-only">相談事例を検索</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例：復職、同僚、通院、評価"
              type="search"
              value={query}
            />
          </label>
          <div className={styles.filterChips} aria-label="相談者で絞り込む">
            <button aria-pressed={reader === 'all'} onClick={() => setReader('all')} type="button">
              すべて
            </button>
            {readers.map((item) => (
              <button
                aria-pressed={reader === item}
                key={item}
                onClick={() => setReader(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <p className={styles.resultCount}>{visibleCases.length}件</p>
          <div className={styles.caseList}>
            {(showAllCases ? visibleCases : visibleCases.slice(0, 6)).map((baseItem) => {
              const item = consultationCaseEntry(baseItem, selectedId, normalizeSearchText(query));
              return (
                <button
                  aria-pressed={selected.caseId === item.caseId}
                  key={item.caseId}
                  onClick={() => selectCase(item.entryId)}
                  type="button"
                >
                  <span>
                    {item.readerJa} · {item.phaseJa}
                  </span>
                  <strong>「{item.openingJa}」</strong>
                </button>
              );
            })}
          </div>
          {!showAllCases && visibleCases.length > 6 && (
            <button
              className={styles.showAllCases}
              type="button"
              onClick={() => setShowAllCases(true)}
            >
              ほかの相談を見る（あと{visibleCases.length - 6}件）
            </button>
          )}
        </aside>

        {visibleCases.length === 0 ? (
          <section className={styles.noSearchResults} aria-live="polite">
            <h2>この条件に合う事例は、見つかりませんでした。</h2>
            <p>
              近い事例がなくても、相談できないという意味ではありません。「通院」「情報共有」など仕事の場面で探すか、一覧の条件を外せます。
            </p>
            <button
              className={styles.secondaryAction}
              type="button"
              onClick={() => {
                setQuery('');
                setReader('all');
              }}
            >
              絞り込みを解除する
            </button>
          </section>
        ) : (
          <article className={styles.caseReading} aria-live="polite" id="case-detail">
            <a className={styles.returnToCases} href="#case-browser">
              別の相談を探す ↑
            </a>
            <div className={styles.detailTopline}>
              <div className={styles.caseMeta}>
                <span>{selected.readerJa}</span>
                <span>{selected.phaseJa}</span>
              </div>
              <button className={styles.printButton} onClick={() => window.print()} type="button">
                <Printer size={15} /> この事例を印刷
              </button>
            </div>
            <p className={styles.kicker}>相談を考えるための架空の場面</p>
            <h2 id="case-detail-title" tabIndex={-1}>
              「{selected.openingJa}」
            </h2>
            <p className={styles.caseExampleNote}>
              相談で起こりうる場面を組み合わせた架空の事例です。条件を変えながら、本人が望む案を考えるために使えます。
            </p>
            <div className={styles.notConclusion}>
              <strong>この言葉だけでは決めない</strong>
              <p>{selected.doNotConcludeJa}</p>
            </div>

            <section className={styles.turningQuestion}>
              <MessageCircleQuestion size={26} />
              <div>
                <span>次の判断のために、本人と確かめること</span>
                <h3>{selected.turningQuestionJa}</h3>
              </div>
            </section>

            <section className={styles.branchSection}>
              <h3>答えが違えば、次にすることも変える</h3>
              <div>
                {selected.branches.map((branch, index) => (
                  <article key={`${branch.conditionJa}-${index}`}>
                    <span>もし {branch.conditionJa}</span>
                    <p>{branch.nextMoveJa}</p>
                    <Link
                      href={`${base}/work-design-views-guide?system=${branch.guideSystemId}#${branch.readinessSectionId ?? 'guide-detail'}`}
                    >
                      {branch.guideTitleJa}へ <ArrowRight size={15} />
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.possibilitySection} aria-labelledby="possibilities-title">
              <h3 id="possibilities-title">同じ困りごとでも、背景は一つではない</h3>
              <p className={styles.hypothesisNote}>
                このように対応を分けるのは、次のような背景が考えられるためです。いずれも確定した説明ではありません。状況に合わなければ、見立てと対応を選び直します。
              </p>
              <div className={styles.possibilityGrid}>
                {selected.possibilities.map((possibility, index) => (
                  <article key={`${possibility.kind}-${index}`}>
                    <span>
                      {possibility.kind === 'counter'
                        ? '逆の可能性'
                        : `可能性 ${String.fromCharCode(65 + index)}`}
                    </span>
                    <p>{possibility.statementJa}</p>
                  </article>
                ))}
              </div>
            </section>

            {selected.sourceBriefId === 'CC2-MIG-01' &&
              (selected.entryId === 'commute-fatigue' ? (
                <p>
                  <Link
                    href={`${base}/case-readings#health-time-and-morning-variation`}
                    onClick={(event) =>
                      selectRelatedCase(event, 'health-time-and-morning-variation')
                    }
                  >
                    仕事中の体調の波や、休憩・中断について考える →
                  </Link>
                </p>
              ) : (
                <>
                  <p>
                    <Link
                      href={`${base}/case-readings#commute-fatigue`}
                      onClick={(event) => selectRelatedCase(event, 'commute-fatigue')}
                    >
                      通勤の相談へ：交通手段と、一日の負担を分けて考える →
                    </Link>
                  </p>
                  <AxiomWorkInterruptionCaseGuide />
                </>
              ))}

            <section
              className={styles.caseImplementation}
              aria-labelledby="case-implementation-title"
            >
              <h3 id="case-implementation-title">本人と決めること・実施後に確かめること</h3>
              <dl>
                <div>
                  <dt>本人の選択</dt>
                  <dd>{selected.personControlJa}</dd>
                </div>
                <div>
                  <dt>誰が決めるか</dt>
                  <dd>{selected.authorityBoundaryJa}</dd>
                </div>
                <div>
                  <dt>止める条件</dt>
                  <dd>{selected.stopConditionsJa}</dd>
                </div>
                <div>
                  <dt>結果からの見直し</dt>
                  <dd>{selected.outcomeRevisionJa}</dd>
                </div>
              </dl>
              <p className={styles.hypothesisNote}>
                予定した対応が実施できたかと、その結果を分けて確かめます。改善しない・別の負担が生じた場合も、見立てを見直す手がかりです。
              </p>
              <p>
                この相談も、人と仕事・支援の組合せ、実行する権限と資源、変化時の継続と選び直しから考えます。本人が望む学習、既に十分な支援、別の仕事や休養も比較し、一つの原理だけで対応を決めません。
                <Link href="/materials/research/reading-guide">三原理から個別の論証・反証へ戻る →</Link>
              </p>
            </section>

            <section id="decision-note" className={styles.decisionAnchor} tabIndex={-1} aria-label="相談から自分の判断を残す">
              <FlagshipDecisionNote
                kind="case" contextId={selected.entryId} contextTitle={selected.titleJa}
                question={selected.turningQuestionJa} sourceHref={`?case=${encodeURIComponent(selected.entryId)}#case-detail`}
                references={[
                  { label: `NBL相談事例 ${selected.sourceBriefId}（${model.version}）`, href: nextSiteHref(`${base}/case-readings?case=${encodeURIComponent(selected.entryId)}#case-detail`) },
                  { label: '研究の根拠と反例のたどり方', href: '/materials/research/reading-guide' },
                ]}
              />
              <p>他の役割へ相談する前に、渡す内容を自分で選び、判断メモを保存または持ち帰ってください。移動先へ入力は自動で渡りません。</p>
              <nav className={styles.nextProductActions} aria-label="相談の別案を実施条件へつなぐ">
                {nextGuides.map((guide) => (
                  <Link key={guide.systemId} href={`${base}/work-design-views-guide?system=${guide.systemId}#guide-detail`}>
                    職場と変える条件を考える：{guide.readerTitleJa} →
                  </Link>
                ))}
                <Link href={supportToolHref(organizationChecks.find((check) => matchesConsultationEntry(selected, check.case))?.id ?? 'work')}>
                  支援機関と担当・時間・費用を確かめる →
                </Link>
              </nav>
            </section>

            {organizationChecks
              .filter((check) => matchesConsultationEntry(selected, check.case))
              .map((check) => (
                <SupportPracticeConnection key={check.id} theme={check.id} />
              ))}

            {['CC2-PROD-08', 'CC2-PROD-05'].includes(selected.sourceBriefId) && (
              <details className={styles.optionalComparison} key={selected.sourceBriefId}>
                <summary>別の条件で、対応を比べる（任意）</summary>
                <ResearchKnowledgeApplication mode="handover"
                  initialExampleId={selected.sourceBriefId === 'CC2-PROD-08' ? 'decline' : 'person-valued-roles'} />
              </details>
            )}

            <nav className={styles.nextProductActions} aria-label="相談を会議用様式へつなぐ">
              <p>話し合った内容を残す時に使える、任意の様式です。</p>
              <Link href={workbookHref('book1')}>判断を変える一枚に記入する →</Link>
              <Link href={workbookHref('book3')}>結果と再判断へ →</Link>
            </nav>

            <nav aria-label="この事例から次に進む" className={styles.nextProductActions}>
              {matchesConsultationEntry(selected, 'role-evaluation-growth') && (
                <Link href={`${base}/edition-inspection#scene`}>創刊号の検品場面で、別の役割を考える <ArrowRight size={15} aria-hidden="true" /></Link>
              )}
              {selected.sourceBriefId === 'CC2-MIG-03' && (
                <Link href="/materials/textbook/3#textbook-section-3-3">
                  評価で支援を始める場合と、工程を保留する場合を読む <ArrowRight size={15} />
                </Link>
              )}
              {employmentWorkPlanCaseIds.some((id) => matchesConsultationEntry(selected, id)) && (
                <Link href={employmentWorkPlanHref}>
                  仕事づくりの例：会社の課題と本人の貢献を結ぶ <ArrowRight size={15} />
                </Link>
              )}
              {nextGuides.length ? (
                nextGuides.map((guide) => (
                  <Link
                    href={`${base}/work-design-views-guide?system=${guide.systemId}#guide-detail`}
                    key={guide.systemId}
                    data-case-guide-link
                  >
                    具体策：{guide.readerTitleJa} <ArrowRight size={15} />
                  </Link>
                ))
              ) : (
                <Link href={`${base}/work-design-views-guide`}>仕事の困りごとから具体策を探す</Link>
              )}
              <Link href={companions.toolkitHref}>{companions.toolkitLabel}</Link>
              <Link href={companions.reportHref}>{companions.reportLabel}</Link>
            </nav>
          </article>
        )}
      </section>
    </>
  );
}

function GuideSurface({ initialSystemId }: { initialSystemId?: string }) {
  const nextSiteHref = useNextSiteHref();
  const nextSiteLinkMode = useNextSiteLinkMode();
  const model = NBL_CONSULTATION_CASE_V2_READER_PRODUCTION;
  const [selectedId, setSelectedId] = useState(
    model.guides.find((guide) => guide.systemId === initialSystemId)?.systemId ?? 'WDG2-04',
  );
  const selected = model.guides.find((guide) => guide.systemId === selectedId) ?? model.guides[0];
  const concreteConditions = selected.currentGuideFrameIds
    .map((frameId) =>
      NBL_WORK_DESIGN_GUIDE_V2_CURRENT_FRAMES.find((frame) => frame.frameId === frameId),
    )
    .filter((frame): frame is (typeof NBL_WORK_DESIGN_GUIDE_V2_CURRENT_FRAMES)[number] =>
      Boolean(frame),
    );
  const selectedVisual = guideSystemVisuals[selected.systemId];
  const readingGuides = workDesignReadingOrder.map(
    (id) => model.guides.find((guide) => guide.systemId === id)!,
  );
  const readingIndex = readingGuides.findIndex((guide) => guide.systemId === selected.systemId);
  const previousGuide = readingGuides[readingIndex - 1];
  const nextGuide = readingGuides[readingIndex + 1];

  useEffect(() => {
    const requested = initialSystemId ?? new URLSearchParams(window.location.search).get('system');
    if (requested && model.guides.some((guide) => guide.systemId === requested))
      setSelectedId(requested);

    const selectRequestedGuide = (url: string) => {
      const systemId = new URL(url, window.location.origin).searchParams.get('system');
      if (systemId && model.guides.some((guide) => guide.systemId === systemId))
        setSelectedId(systemId);
    };
    const events = Router.events;
    events?.on('routeChangeComplete', selectRequestedGuide);
    return () => events?.off('routeChangeComplete', selectRequestedGuide);
  }, [model.guides, initialSystemId]);

  const selectGuide = (systemId: string) => {
    setSelectedId(systemId);
    void Router.replace(`${window.location.pathname}?system=${systemId}#guide-detail`, undefined, {
      shallow: true,
      scroll: false,
    });
    window.requestAnimationFrame(() => {
      const heading = document.getElementById('guide-detail-title');
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView?.({ block: 'start', behavior: 'auto' });
    });
  };

  return (
    <>
      <section className={`${styles.productHero} ${styles.guideHero}`}>
        <div>
          <p className={styles.kicker}>WORK DESIGN GUIDE 2.0</p>
          <h1>
            その働きづらさ、
            <br />
            仕事の仕組みから。
          </h1>
          <p>
            休めても仕事が減らない。伝えたつもりが、伝わらない。そんな困りごとから、職場で共通して使える段取りを整えるガイドです。引継ぎや仕事量の調整など、まず一つから。日々の仕事にも、障害や病気に応じた個別の対応にも使える基盤にします。
          </p>
          <div className={styles.guideHeroActions}>
            <a href="#guide-browser" className={styles.primaryAction}>
              気になる場面から具体策へ <ArrowRight size={18} />
            </a>
            <a href="#guide-all-topics" className={styles.outlineAction}>
              全10テーマを見渡す <ArrowRight size={18} />
            </a>
            <a href="#decision-note" className={styles.outlineAction}>選んでいるテーマの変更案を書く</a>
            <a href={proofreadingExampleHref} className={styles.outlineAction}>求人を出す前に仕事を組む</a>
          </div>
          <p className={styles.guideWorkPlanLink}>
            採用・復職や担当の見直しには、
            <Link href={employmentWorkPlanHref}>任せる仕事が生まれる接点を読む</Link>
            からも始められます。
          </p>
        </div>
        <figure>
          <img
            alt="仕事の分担を相談する人、静かな席で集中する人、帰宅する人。同じ職場で異なる働き方を選べる架空の場面"
            src="/images/next-nbl-work-design/workplace-options-v1.webp"
          />
          <figcaption>一人ひとりが頑張り直す前に、変えられる仕事の条件がある。</figcaption>
        </figure>
      </section>

      <ProofreadingFlagshipExample kind="work" />
      <section className={styles.guideWorkspace} id="guide-browser">
        <nav className={styles.problemNavigation} aria-label="仕事の困りごとから探す">
          <div className={styles.sectionHeadingCompact}>
            <p className={styles.kicker}>仕事設計ガイド 2.0</p>
            <h2>こんな場面、ありませんか。</h2>
            <p>
              今の困りごとから始める入口です。障害や病気についての説明や、相談の申し出を前提にせず、仕事の仕組みから見直せます。
            </p>
          </div>
          <div className={styles.problemCards}>
            {workDesignEntryPoints.slice(0, 3).map((entry) => (
              <button
                key={entry.systemId}
                type="button"
                aria-pressed={selectedId === entry.systemId}
                onClick={() => selectGuide(entry.systemId)}
              >
                <span>
                  {entry.systemId === 'WDG2-04'
                    ? '時間と仕事量'
                    : entry.systemId === 'WDG2-05'
                      ? '情報と環境'
                      : 'チームの分担'}
                </span>
                <strong>{entry.problem}</strong>
                <span>
                  {entry.change} <ArrowRight size={16} aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
          <section
            className={styles.allTopics}
            id="guide-all-topics"
            aria-labelledby="guide-all-topics-title"
          >
            <h3 id="guide-all-topics-title">全10テーマを見渡す</h3>
            <p>
              目立つ困りごとがなくても、全テーマを一巡し、職場で使える備えと足りないところを確かめられます。読む順に迷ったら、仕事の中身から始め、相談・調整、働き続ける仕組みへ進んでください。
            </p>
            <p>
              すべての施策を同じ形で一度に実施するのではなく、各テーマを職場に合う形で整えていきます。読む順番と着手の順番は別です。全体の整備が終わるまで、必要な個別対応を待たせません。
            </p>
            <ol className={styles.topicList}>
              {readingGuides.map((guide, index) => {
                const entry = workDesignEntry(guide.systemId)!;
                return (
                  <li key={guide.systemId}>
                    <button
                      type="button"
                      aria-label={guide.readerTitleJa}
                      aria-pressed={selectedId === entry.systemId}
                      onClick={() => selectGuide(entry.systemId)}
                    >
                      <strong>
                        <span className={styles.topicNumber} aria-hidden="true">
                          {index + 1}
                        </span>{' '}
                        {entry.problem}
                      </strong>
                      <span>{guide.readerTitleJa}</span>
                      <span>{entry.change}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
          <p className={styles.commonEntryNote}>
            相談が表に出ていなくても、困っていないとは限りません。選べる仕事の条件や相談先が見えることも、言い出しやすさにつながります。
            <Link href={`${base}/case-readings#no-consultation-low-signal`}>
              相談が少ない職場を考える <ArrowRight size={14} />
            </Link>
          </p>
        </nav>

        <article className={styles.guideDetail} id="guide-detail">
          <div className={styles.detailTopline}>
            <p className={styles.kicker}>{workDesignEntry(selected.systemId)?.problem}</p>
            <button className={styles.printButton} onClick={() => window.print()} type="button">
              <Printer size={15} /> この項目を印刷
            </button>
          </div>
          <h2 id="guide-detail-title" tabIndex={-1}>
            {selected.readerTitleJa}
          </h2>
          <p className={styles.guidePurpose}>
            {workSystemPracticalExamples[selected.systemId]?.readerPurpose ?? selected.purposeJa}
          </p>

          {selected.systemId === 'WDG2-04' ? (
            <AxiomWorkTimeGuide
              visual={selectedVisual}
              frameTitles={concreteConditions.map((frame) => frame.titleJa)}
              relatedCases={selected.linkedCaseBriefIds
                .map((id) => model.cases.find((item) => item.sourceBriefId === id))
                .filter((item): item is (typeof model.cases)[number] => Boolean(item))}
            />
          ) : selected.systemId === 'WDG2-05' ? (
            <AxiomWorkAccessGuide
              compareEquipmentConditions
              visual={selectedVisual}
              frameTitles={concreteConditions.map((frame) => frame.titleJa)}
              relatedCases={selected.linkedCaseBriefIds
                .map((id) => model.cases.find((item) => item.sourceBriefId === id))
                .filter((item): item is (typeof model.cases)[number] => Boolean(item))}
            />
          ) : (
            <AxiomWorkSystemGuide
              guide={selected}
              compareJobConditions
              entry={workDesignEntry(selected.systemId)!}
              visual={selectedVisual}
              frameTitles={concreteConditions.map((frame) => frame.titleJa)}
              relatedCases={selected.linkedCaseBriefIds
                .map((id) => model.cases.find((item) => item.sourceBriefId === id))
                .filter((item): item is (typeof model.cases)[number] => Boolean(item))}
            />
          )}
          {supportGuideConnections[selected.systemId] && (
            <SupportPracticeConnection theme={supportGuideConnections[selected.systemId]} />
          )}
          <nav aria-label="ガイドを順に読む" className={styles.readingNavigation}>
            <p>
              目次の {readingIndex + 1} / {readingGuides.length} · {selected.readerTitleJa}
            </p>
            <div>
              {previousGuide && (
                <button type="button" onClick={() => selectGuide(previousGuide.systemId)}>
                  ← 前へ：{previousGuide.readerTitleJa}
                </button>
              )}
              <a href="#guide-all-topics">全テーマの目次へ</a>
              {nextGuide && (
                <button type="button" onClick={() => selectGuide(nextGuide.systemId)}>
                  次へ：{nextGuide.readerTitleJa} →
                </button>
              )}
            </div>
            {!nextGuide && (
              <p>
                一巡したら、足りない備えを目次から選び直せます。読んだことと、実際に職場で使えるようになったことは分けて確かめましょう。
              </p>
            )}
          </nav>
          <nav aria-label="この準備システムから次に進む" className={styles.nextProductActions}>
            {selected.systemId === 'WDG2-09' && (
              <Link href={`${base}/edition-inspection#meeting`}>検品で見つけた貢献を、会議で考える <ArrowRight size={15} aria-hidden="true" /></Link>
            )}
            <Link href={workbookHref('book2')}>実施と受渡しの会議用様式へ →</Link>
            <Link href={workbookHref('book3')}>結果と再判断へ →</Link>
            <Link href={`${base}/case-readings`}>
              相談の一言から確かめる <ArrowRight size={15} />
            </Link>
            <Link href={guideCompanions(selected.systemId).toolkitHref}>
              {guideCompanions(selected.systemId).toolkitLabel}
            </Link>
            <Link href={guideCompanions(selected.systemId).reportHref}>
              {guideCompanions(selected.systemId).reportLabel}
            </Link>
          </nav>
          <p className={styles.legacyGuideLink}>
            <a href={nextSiteHref(`${base}/references/work-design-guide-jeed-2026.html`)}>
              JEED 2026参照用の保存版（2026年9月10日）
            </a>
            <br />
            <Link
              href={
                nextSiteLinkMode === 'isolated_root'
                  ? NEXT_SITE_SAVED_GUIDE_HREF
                  : '/work-design-views-guide'
              }
            >
              {nextSiteLinkMode === 'isolated_root'
                ? '保存版「未来の仕事・社会参加設計ガイド」を別版として見る'
                : '現行公開版「未来の仕事・社会参加設計ガイド」を別版として見る'}
            </Link>
          </p>
        </article>
        <section id="decision-note" className={styles.decisionAnchor} aria-label="仕事の変更案を残す">
          <FlagshipDecisionNote
            kind="work" contextId={selected.systemId} contextTitle={selected.readerTitleJa}
            question={selected.readinessQuestionJa}
            sourceHref="#guide-detail"
            references={[
              { label: `NBL仕事設計ガイド ${selected.systemId}（${NBL_WORK_DESIGN_GUIDE_V2.version}）`, href: nextSiteHref(`${base}/work-design-views-guide?system=${selected.systemId}#guide-detail`) },
              { label: 'JEED資料の参照箇所を収めた保存版（2026-09-10）', href: nextSiteHref(`${base}/references/work-design-guide-jeed-2026.html`) },
            ]}
          />
          <p>本人や支援機関と話す前に、渡す条件を自分で選んで保存してください。</p>
          <nav className={styles.nextProductActions} aria-label="仕事の変更案を本人と支援機関へつなぐ">
            {selected.linkedCaseBriefIds
              .map((id) => model.cases.find((item) => item.sourceBriefId === id))
              .filter((item): item is (typeof model.cases)[number] => Boolean(item))
              .map((item) => (
                <Link key={item.caseId} href={`${base}/case-readings#${item.caseId}`}>本人の希望と別案を確かめる　{item.titleJa}</Link>
              ))}
            <Link href={supportToolHref(supportGuideConnections[selected.systemId] ?? organizationChecks.find((check) => check.guide === selected.systemId)?.id ?? 'work')}>機関の人員・時間・費用・分担を確かめる</Link>
          </nav>
        </section>
      </section>
    </>
  );
}

type NextSiteSearchResult = {
  id: string;
  kind: '相談事例' | '仕事設計' | '支援の実践・体制' | 'サイト';
  title: string;
  summary: string;
  href: string;
  searchable: string;
};

function normalizeSearchText(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('ja');
}

function SearchSurface() {
  const model = NBL_CONSULTATION_CASE_V2_READER_PRODUCTION;
  const published = useNextSitePublished();
  const linkMode = useNextSiteLinkMode();
  const showReviewEditions = published || linkMode === 'isolated_root' && process.env.NBL_LOCAL_REVIEW_EDITIONS === 'true';
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get('q') ?? '');
  }, []);

  const results = useMemo<NextSiteSearchResult[]>(() => {
    const siteEntries: NextSiteSearchResult[] = [
      {
        id: firstDayAssistance.slug,
        kind: 'サイト',
        title: firstDayAssistance.title,
        summary: firstDayAssistance.summary,
        href: firstDayAssistance.href,
        searchable: firstDayAssistance.searchable,
      },
      ...materialCatalog.filter((item) => ['textbook', 'policy', 'research'].includes(item.slug)).map((item): NextSiteSearchResult => ({
        id: `material-${item.slug}`,
        kind: 'サイト',
        title: item.slug === 'research' ? item.title : `${item.slug === 'textbook' ? '教科書' : '総合政策案'}：${item.title}`,
        summary: `${item.audience}。${item.decision}`,
        href: `/materials/${item.slug}`,
        searchable: `${item.label} ${item.description} ${item.count} ${item.slug === 'research' ? '抄録 論文 反証 根拠 研究' : item.slug === 'textbook' ? '教材 研修 学習 教える 章' : '政策 制度 財源 人員 予算 所得 移行'}`,
      })),
      ...Object.entries(workForkEditions).map(([slug, edition]): NextSiteSearchResult => ({
        id: slug,
        kind: 'サイト',
        title: edition.title,
        summary: edition.summary,
        href: `${base}/${slug}`,
        searchable: edition.searchable,
      })),
      ...(showReviewEditions ? [{
        id: 'draft-editions',
        kind: 'サイト' as const,
        title: '国と地方の共同提言案・11月22日改訂の教科書と総合政策提言',
        summary: '国の予算・立法と、地方の協定・勤務・本人への返答を検討する資料。',
        href: `${base}#draft-editions`,
        searchable: '国 地方 自治体 共同提言 予算 政策 教科書 11月22日',
      }] : []),
      {
        id: 'support-practice-tool',
        kind: 'サイト',
        title: '就労支援の実践・体制改善ツール',
        summary:
          '支援者が行うことと、方針・担当・勤務時間・連携を並べ、支援を届けるために変えられる条件を探します。',
        href: supportToolHref(),
        searchable:
          '支援機関 支援者 チェックリスト 管理者 地域連携 援助付き就業 職業準備性 NIVR JEED 134 147 167 180',
      },
      {
        id: 'employment-work-plan',
        kind: '仕事設計',
        title: '会社の課題と本人の貢献から、仕事をつくる',
        summary:
          '会社に必要な仕事と本人の希望から、仕事の組合せ・教え方・専門支援・評価をつなぎます。',
        href: employmentWorkPlanHref,
        searchable:
          '障害者雇用 難病 就労支援 企業 人事 現場 本業 経営 仕事づくり 職務 採用 復職 役割 育成 評価 OJT 支援機関 メモ 白紙',
      },
      {
        id: 'home',
        kind: 'サイト',
        title: nextSiteHome.title,
        summary: nextSiteHome.summary,
        href: base,
        searchable: 'トップ 入口 相談 職場 仕事設計 人の多様性',
      },
      {
        id: 'virtual-news',
        kind: 'サイト',
        title: 'バーチャルニュース',
        summary: 'まだない企業・地域・制度の実装を、ニュースの場面として先に見ます。',
        href: '/virtual-news',
        searchable: '未来 社会 企業 地域 制度 ニュース 課題',
      },
      {
        id: 'reports',
        kind: 'サイト',
        title: 'NBLレポート',
        summary: '現場の違和感を、社会の問いと仕事条件の構造へ深めます。',
        href: `${base}/articles-social-questions`,
        searchable: '記事 レポート 社会 問い 背景 政策',
      },
      {
        id: 'toolkit',
        kind: 'サイト',
        title: 'ツールキット',
        summary: '図解、4コマ、音楽、会議素材から、言葉以外の入口を選べます。',
        href: `${base}/toolkit-studio`,
        searchable: '図解 4コマ 音楽 会議 研修 素材 アプリ',
      },
      {
        id: 'music',
        kind: 'サイト',
        title: '働き方を話す音楽',
        summary: '歌詞と音から、仕事・支援・暮らしを話し合うきっかけを選べます。',
        href: '/resources/songs',
        searchable: '音楽 歌 歌詞 曲 ソング 聴く',
      },
      {
        id: 'condition-window',
        kind: 'サイト',
        title: '障害種類から見る',
        summary: '障害名を答えにせず、健康状態と仕事条件がぶつかる場面から確認します。',
        href: `${base}/work-condition-window`,
        searchable: '障害 疾病 難病 がん 精神 発達 身体 健康 仕事条件',
      },
      {
        id: 'projects',
        kind: 'サイト',
        title: 'プロジェクト',
        summary: '研究会、地域連携、人材育成を通じて、知識を共同実装へつなげます。',
        href: `${base}/projects`,
        searchable: 'プロジェクト 協働 相談 共同実装 地域 研究 人材育成',
      },
      {
        id: 'method',
        kind: 'サイト',
        title: 'NBLの専門性：複雑な現実を、AIと探究する',
        summary:
          '仕事・健康・生活の関係を読み合わせ、確かめられる仮説へ。研究の蓄積を受け継ぐ方法と、まだ検証が必要なことを説明します。',
        href: `${base}/theory-method-trust`,
        searchable: '専門性 科学 研究 方法 根拠 AI ICF IPS 仮説 人間 権限',
      },
      {
        id: 'boundary',
        kind: 'サイト',
        title: 'サイト情報と利用境界',
        summary: 'このサイトができること、できないこと、人間が決めることを確認します。',
        href: `${base}/about-boundary`,
        searchable: '利用 境界 判断 個別相談 医療 法律 人事',
      },
    ];

    const caseEntries: NextSiteSearchResult[] = model.cases.map((baseItem) => {
      const item = consultationCaseEntry(baseItem, '', normalizeSearchText(query));
      return {
        id: `case-${item.caseId}`,
        kind: '相談事例',
        title: `「${item.openingJa}」`,
        summary: `確かめたいこと：${item.turningQuestionJa}`,
        href: `${base}/case-readings#${item.entryId}`,
        searchable: [
          item.openingJa,
          item.titleJa,
          item.readerJa,
          item.phaseJa,
          item.doNotConcludeJa,
          item.turningQuestionJa,
          consultationEntrySearchText(baseItem),
          ...item.possibilities.map((possibility) => possibility.statementJa),
          ...item.branches.flatMap((branch) => [branch.conditionJa, branch.nextMoveJa]),
          item.personControlJa,
          item.authorityBoundaryJa,
          item.outcomeRevisionJa,
        ].join(' '),
      };
    });

    const guideEntries: NextSiteSearchResult[] = model.guides.map((item) => {
      const practical = workSystemPracticalExamples[item.systemId];
      const scenario = practical?.scenario;
      return {
        id: `guide-${item.systemId}`,
        kind: '仕事設計',
        title: item.readerTitleJa,
        summary: `${workDesignEntry(item.systemId)?.problem ?? ''}。${workDesignEntry(item.systemId)?.change ?? item.purposeJa}。`,
        href: `${base}/work-design-views-guide?system=${item.systemId}#guide-detail`,
        searchable: [
          workDesignEntry(item.systemId)?.problem,
          workDesignEntry(item.systemId)?.change,
          workDesignEntry(item.systemId)?.cue,
          item.readerTitleJa,
          item.purposeJa,
          item.readinessQuestionJa,
          ...item.installBeforeCaseJa,
          ...item.individualizationQuestionsJa,
          ...item.burdenAndEquityChecksJa,
          practical?.readerPurpose,
          scenario?.title,
          scenario?.scene,
          scenario?.exampleTitle,
          scenario?.exampleIntro,
          scenario?.takeaway,
          ...(scenario?.cues?.flatMap((cue) => [cue.label, cue.value]) ?? []),
          ...(scenario?.comparison?.rows.flatMap((row) => [row.label, row.before, row.after]) ??
            []),
          ...(practical?.actionDetails.flatMap((action) => [
            action.readerTitle,
            action.explanation,
          ]) ?? []),
          ...(practical?.adaptationDetails?.map((detail) => detail.readerText) ?? []),
          practical?.memoTitle,
          ...(practical?.memoFields ?? []),
          ...item.currentGuideFrameIds.map(
            (frameId) =>
              NBL_WORK_DESIGN_GUIDE_V2_CURRENT_FRAMES.find((frame) => frame.frameId === frameId)
                ?.titleJa ?? '',
          ),
        ].join(' '),
      };
    });

    const supportKeywords: Record<string, string> = {
      choice: '本人 希望 意思決定 選び直し 家族',
      work: '職業準備性 訓練 実習 援助付き就業 就職活動 評価',
      employer: '求人開拓 企業訪問 職務開発 企業支援 仕事づくり 採用',
      adjustment: 'ジョブコーチ 合理的配慮 職場調整 支援計画 実装',
      continuity: '定着支援 就職後 離職 復職 キャリア 再就職',
      life: '医療 生活 福祉 医療連携 就労 両立',
      network: '地域連携 ネットワーク ケースマネジメント 紹介 受入れ 連絡役',
      learning: '研修 OJT 人材育成 振り返り 管理者 学習 支援者育成',
    };
    const supportEntries: NextSiteSearchResult[] = organizationChecks.map((item) => ({
      id: `support-${item.id}`,
      kind: '支援の実践・体制',
      title: item.short,
      summary: item.practice.question,
      href: supportToolHref(item.id, 'practice'),
      searchable: `支援機関 支援者 チェックリスト ${item.title} ${item.opening} ${item.organization.question} ${supportKeywords[item.id] ?? ''}`,
    }));
    return [...caseEntries, ...guideEntries, ...supportEntries, ...siteEntries];
  }, [model.cases, model.guides, query, showReviewEditions]);

  const normalized = normalizeSearchText(query).trim();
  const terms = normalized.split(/\s+/);
  const visible = normalized
    ? results.filter((item) => {
        const text = normalizeSearchText(`${item.title} ${item.summary} ${item.searchable}`);
        return terms.every((term) => text.includes(term));
      })
    : results.filter((item) => item.kind === 'サイト');

  const updateQuery = (value: string) => {
    setQuery(value);
    const next = value.trim()
      ? `${window.location.pathname}?q=${encodeURIComponent(value)}`
      : window.location.pathname;
    void Router.replace(next, undefined, { shallow: true, scroll: false });
  };

  return (
    <>
      <section className={`${styles.productHero} ${styles.searchHero}`}>
        <div>
          <p className={styles.kicker}>FIND THE NEXT USEFUL STEP</p>
          <h1>
            障害名や制度名だけでなく、
            <br />
            いまの困りごとから探す。
          </h1>
          <p>
            相談事例、仕事を変える具体策、支援の実践を探せます。教科書・政策案・抄録集、図解・記事・音楽の入口もここから。資料の章や抄録は、それぞれの資料内で探せます。
          </p>
        </div>
        <label className={styles.siteSearchBox}>
          <Search size={22} aria-hidden="true" />
          <span className="sr-only">次期NBLサイトを検索</span>
          <input
            aria-label="次期NBLサイトを検索"
            aria-describedby="site-search-privacy"
            autoFocus
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="例：復職、情報共有、企業訪問、地域連携"
            type="search"
            value={query}
          />
        </label>
        <p id="site-search-privacy" className={styles.searchPrivacyNote}>
          氏名・勤務先名・個別の病状は入力せず、一般的な言葉で探してください。検索語はURLに含まれ、履歴やアクセス記録に残る場合があります。
        </p>
      </section>

      <section className={styles.siteSearchResults} aria-live="polite">
        <div className={styles.sectionHeadingCompact}>
          <p className={styles.kicker}>
            {normalized ? `${visible.length} RESULTS` : 'STARTING POINTS'}
          </p>
          <h2>{normalized ? `「${query.trim()}」に近い入口` : 'まずは、サイトの入口から。'}</h2>
          <p>
            {normalized
              ? '検索結果は答えではなく、次に読む相談事例や仕事条件への入口です。'
              : '具体的な困りごとは上の欄から検索できます。'}
          </p>
        </div>
        {visible.length ? (
          <div className={styles.siteResultGrid}>
            {visible.map((item) => (
              <Link href={item.href} key={item.id}>
                <span>{item.kind}</span>
                <strong>{item.title}</strong>
                <p>{item.summary}</p>
                <em>
                  開く <ArrowRight size={14} />
                </em>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.noSearchResults}>
            <MessageCircleQuestion size={28} />
            <h3>一致する入口はありませんでした。</h3>
            <p>
              言葉を短くするか、「復職」「通院」「情報共有」「評価」など仕事の場面で探してください。
            </p>
            <Link href={`${base}/case-readings`}>相談事例を一覧で見る</Link>
            <Link href={`${base}/work-design-views-guide`}>仕事設計の全テーマを見る</Link>
            <Link href={supportToolHref()}>支援の実践・体制から探す</Link>
          </div>
        )}
      </section>
    </>
  );
}

export default function AxiomNextNblV2FlagshipSurface({
  surface,
  initialGuideSystemId,
}: AxiomNextNblV2FlagshipSurfaceProps) {
  const ContentRoot = useNextSiteLinkMode() === 'isolated_root' ? 'main' : 'div';
  return (
    <div className={styles.root}>
      <SiteHeader surface={surface} />
      <ContentRoot className={styles.content}>
        {surface === 'home' ? <WorkForkHome /> : null}
        {surface === 'case-readings' ? <CaseSurface /> : null}
        {surface === 'work-design-views-guide' ? (
          <GuideSurface initialSystemId={initialGuideSystemId} />
        ) : null}
        {surface === 'search' ? <SearchSurface /> : null}
      </ContentRoot>
      <SiteFooter />
    </div>
  );
}
