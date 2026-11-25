import { useEffect, useRef, useState } from 'react';
import { AxiomNextSiteLink as Link, useNextSiteHref } from './AxiomNextSiteLinks';
import {
  organizationChecks,
  organizationAnswerLabels,
  practiceAnswerLabels,
  organizationReviewText,
  supportResearch,
  supportModeLabels,
  supportAnswerLabel,
  supportResponseNextStep,
  supportPairObservation,
  type SupportAnswers,
  supportToolHref,
  type SupportMode,
  type PracticeAnswer,
  type OrganizationAnswer,
} from './organizationChecklistContent';
import styles from './SupportOrganizationChecklist.module.css';
import { AxiomNextSiteHeader, AxiomNextSiteFooter } from './AxiomNextSiteChrome';
import ResearchKnowledgeApplication from './ResearchKnowledgeApplication';
import { workbookHref } from './practiceWorkbook';
import FlagshipDecisionNote from './FlagshipDecisionNote';
import ProofreadingFlagshipExample, { proofreadingExampleHref } from './ProofreadingFlagshipExample';

const base = '/preview/axiom-next-nbl-v2';
const emptyDraft = { owner: '', timing: '', note: '' };
const reviewKey = 'nbl:next-site:support-organization-review:v1';

function restoreReview(raw: string) {
  const review = JSON.parse(raw);
  if (!review || typeof review !== 'object') throw new Error('Invalid saved review');
  const answers: SupportAnswers = { practice: {}, organization: {} };
  const drafts: Record<string, typeof emptyDraft> = {};
  for (const item of organizationChecks) {
    const practice = review.answers?.practice?.[item.id];
    const organization = review.answers?.organization?.[item.id];
    if (typeof practice === 'string' && Object.prototype.hasOwnProperty.call(practiceAnswerLabels, practice)) {
      answers.practice[item.id] = practice as PracticeAnswer;
    }
    if (typeof organization === 'string' && Object.prototype.hasOwnProperty.call(organizationAnswerLabels, organization)) {
      answers.organization[item.id] = organization as OrganizationAnswer;
    }
    const draft = review.drafts?.[item.id];
    if (draft && typeof draft === 'object') {
      drafts[item.id] = {
        owner: typeof draft.owner === 'string' ? draft.owner.slice(0, 120) : '',
        timing: typeof draft.timing === 'string' ? draft.timing.slice(0, 120) : '',
        note: typeof draft.note === 'string' ? draft.note.slice(0, 1500) : '',
      };
    }
  }
  const selected = organizationChecks.some((item) => item.id === review.selected) ? review.selected as string : '';
  return { answers, drafts, selected };
}
export default function SupportOrganizationChecklist() {
  const nextSiteHref = useNextSiteHref();
  const [mode, setMode] = useState<SupportMode>('organization');
  const [active, setActive] = useState('work');
  const [answers, setAnswers] = useState<SupportAnswers>({ practice: {}, organization: {} });
  const [selected, setSelected] = useState('');
  const [drafts, setDrafts] = useState<Record<string, typeof emptyDraft>>({});
  const [saved, setSaved] = useState(false);
  const [reviewStored, setReviewStored] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const current = organizationChecks.find((item) => item.id === active)!;
  const focus = organizationChecks.find((item) => item.id === selected);
  const draft = drafts[selected] ?? emptyDraft;
  const otherMode: SupportMode = mode === 'organization' ? 'practice' : 'organization';
  const index = organizationChecks.indexOf(current);
  useEffect(() => {
    let previousSearch: string | undefined;
    const readLocation = () => {
      // Hash-only movement within the worksheet must not reset an in-progress view.
      if (window.location.search === previousSearch) return;
      previousSearch = window.location.search;
      const params = new URLSearchParams(window.location.search);
      const theme = params.get('theme');
      setActive(organizationChecks.some((item) => item.id === theme) ? theme! : 'work');
      setMode(params.get('view') === 'practice' ? 'practice' : 'organization');
    };
    readLocation();
    window.addEventListener('popstate', readLocation);
    return () => window.removeEventListener('popstate', readLocation);
  }, []);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(reviewKey);
      if (!raw) return;
      const review = restoreReview(raw);
      setAnswers(review.answers);
      setDrafts(review.drafts);
      setSelected(review.selected);
      setReviewStored(true);
      setReviewMessage('このブラウザに保存した全体点検を開きました。');
    } catch {
      setReviewMessage('保存を読み込めませんでした。画面の入力と書き出しは使えます。');
    }
  }, []);

  function saveReview() {
    try {
      window.localStorage.setItem(reviewKey, JSON.stringify({ answers, drafts, selected }));
      setReviewStored(true);
      setSaved(false);
      setReviewMessage('全テーマの回答と改善メモを、このブラウザに保存しました。');
    } catch {
      setReviewMessage('ブラウザに保存できませんでした。必要ならファイルに書き出せます。');
    }
  }

  function removeReview() {
    try {
      window.localStorage.removeItem(reviewKey);
      setReviewStored(false);
      setSaved(false);
      setReviewMessage('端末内の全体点検を削除しました。画面を閉じるまでは記入内容を使えます。');
    } catch {
      setReviewMessage('端末内の保存を削除できませんでした。ブラウザのサイトデータを確認してください。');
    }
  }

  function markReviewEdited() {
    setSaved(false);
    setReviewMessage(reviewStored ? '全体点検に未保存の変更があります。' : '');
  }

  function writeLocation(id: string, view: SupportMode) {
    const url = new URL(window.location.href);
    url.searchParams.set('theme', id);
    url.searchParams.set('view', view);
    window.history.replaceState(window.history.state, '', url);
  }
  function chooseTheme(id: string) {
    setActive(id);
    writeLocation(id, mode);
    requestAnimationFrame(() => titleRef.current?.focus());
  }
  function chooseMode(view: SupportMode) {
    setMode(view);
    writeLocation(active, view);
  }
  function updateDraft(field: keyof typeof emptyDraft, value: string) {
    setDrafts((previous) => ({ ...previous, [selected]: { ...draft, [field]: value } }));
    markReviewEdited();
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([organizationReviewText(answers, selected, draft.owner, draft.timing, draft.note, drafts)], {
        type: 'text/markdown;charset=utf-8',
      }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'nbl-support-practice-and-organization-review.md';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  }
  function question(kind: SupportMode) {
    const check = current[kind];
    const labels = kind === 'practice' ? practiceAnswerLabels : organizationAnswerLabels;
    return (
      <div className={styles.check} key={`question-${active}-${kind}`}>
        <fieldset>
          <legend>{check.question}</legend>
          <p className={styles.small} id={`observe-${kind}`}>
            {check.observe}
          </p>
          <div className={styles.options}>
            {Object.entries(labels).map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name={`support-${kind}-${active}`}
                  value={value}
                  checked={answers[kind][active] === value}
                  aria-describedby={`observe-${kind}`}
                  onChange={() => {
                    setAnswers((previous) =>
                      kind === 'practice'
                        ? {
                            ...previous,
                            practice: { ...previous.practice, [active]: value as PracticeAnswer },
                          }
                        : {
                            ...previous,
                            organization: {
                              ...previous.organization,
                              [active]: value as OrganizationAnswer,
                            },
                          },
                    );
                    markReviewEdited();
                  }}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {answers[kind][active] ? (
          <p className={styles.response} role="status">
            {supportResponseNextStep(kind, answers[kind][active])}
          </p>
        ) : null}
        {answers[kind][active] ? (
          <button
            className={styles.textButton}
            onClick={() => {
              setAnswers((previous) => {
                const next = { ...previous[kind] };
                delete next[active];
                return { ...previous, [kind]: next };
              });
              markReviewEdited();
            }}
          >
            この回答を未回答に戻す
          </button>
        ) : null}
        <details className={styles.evidence}>
          <summary>この問いの研究上の参照箇所</summary>
          <p>
            研究が扱う支援・組織条件をもとに、NBLが実務用に編集した問いです。原文や原調査の回答尺度ではありません。
          </p>
          <ul>
            {check.sources.map((s) => (
              <li key={`${s.report}-${s.location}`}>
                <a href={supportResearch[s.report].url} target="_blank" rel="noreferrer">
                  {supportResearch[s.report].title}（PDF・別タブ）
                </a>
                <span> — {s.location}（報告書の印刷ページ）</span>
              </li>
            ))}
          </ul>
        </details>
      </div>
    );
  }
  return (
    <div className={styles.root}>
      <AxiomNextSiteHeader currentPath="/support-organization-checklist" />
      <main className={styles.main}>
        <section className={styles.intro} aria-labelledby="support-title">
          <p className={styles.eyebrow}>支援機関の管理者・支援実務者へ</p>
          <h1 id="support-title">
            就労支援の
            <br className={styles.mobileBreak} />
            実践・体制改善ツール
          </h1>
          <p className={styles.lead}>
            「まだ働けない」で止まる前に、
            <br />
            支援側で変えられることを。
          </p>
          <p>
            本人への訓練だけでなく、仕事の選択、企業との調整、就職後の支援まで。必要な支援を実際に届けるために、機関の方針・時間・人材育成・地域連携を見直します。
          </p>
          <p>
            目標は、必要な支援とともに望む仕事と生活を選べること。仕事案への納得と、比較できる機会・必要支援があることを分けます。担当の熱意に加え、決める権限、有償時間、費用と代替を打合せへ残します。
          </p>
          <div className={styles.example}>
            <p className={styles.eyebrow}>考え方の例 · 特定の実例や効果の証明ではありません</p>
            <h2>訓練では難しい。では、どんな仕事なら？</h2>
            <div className={styles.exampleSteps}>
              <div>
                <span>見えている難しさ</span>
                <p>複数の指示が重なると、作業が止まる。</p>
              </div>
              <div>
                <span>仕事で確かめる条件</span>
                <p>指示を一覧にし、順序を明確にすれば、正確さを活かせる工程はあるか。</p>
              </div>
              <div>
                <span>支援を動かす体制</span>
                <p>本人の希望を確かめ、企業と工程を見に行く担当・時間・協力先を決める。</p>
              </div>
            </div>
            <p className={styles.small}>
              本人の能力だけでなく、仕事と支援の条件も検討する。それを担当者の熱意だけに任せないための道具です。
            </p>
          </div>
          <p>
            NIVRの一連の研究を踏まえ、援助付き就業の取組を実践と体制の両面から考えます。必要な評価・訓練を否定したり、本人の意向や健康・安全を飛ばして就職を急がせたりするものではありません。
          </p>
          <p><a href={proofreadingExampleHref}>求人前の訪問・育成と、通勤介助の担当と費用を考える →</a></p>
          <div className={styles.entrances}>
            <a href="#support-workbench" onClick={() => chooseMode('organization')}>
              <span>機関の運営・体制から</span>
              <strong>就労支援機関チェックリスト</strong>
              <p>方針、担当、資源、連携が、必要な支援を可能にしているか。</p>
              <b>体制を確かめる →</b>
            </a>
            <a href="#support-workbench" onClick={() => chooseMode('practice')}>
              <span>日々の支援内容から</span>
              <strong>支援者の支援内容チェック</strong>
              <p>自分たち又は連携で、どんな支援を実際に届けているか。</p>
              <b>実践を確かめる →</b>
            </a>
          </div>
          <p className={styles.small}>
            一人で下書きしても、会議で一緒に使っても構いません。回答は任意。全部を整えるまで、今必要な個別支援を待たせません。
          </p>
        </section>

        <ProofreadingFlagshipExample kind="support" />
        <section
          id="support-workbench"
          aria-labelledby="support-workbench-title"
          className={styles.workbench}
        >
          <h2 id="support-workbench-title">支援の全体を見渡し、今の課題から確かめる</h2>
          <a href="#decision-note">選んでいるテーマの担当・時間・費用を書く ↓</a>
          <p>
            8テーマを行き来できます。気になるテーマから始め、最後に全体を見渡してください。支援と体制は別々に回答し、不明や機会なしを低評価にしません。
          </p>
          <div className={styles.layout}>
            <nav className={styles.themes} aria-label="支援の8テーマ">
              {organizationChecks.map((item, n) => (
                <button
                  key={item.id}
                  onClick={() => chooseTheme(item.id)}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  <span className={styles.number}>{String(n + 1).padStart(2, '0')}</span>
                  <span>{item.short}</span>
                </button>
              ))}
              <a href="#support-overview">すべての回答を見渡す ↓</a>
            </nav>
            <article className={styles.area} aria-labelledby="support-theme-title">
              <p className={styles.eyebrow}>
                {index + 1} / 8 · {current.short}
              </p>
              <h3 ref={titleRef} tabIndex={-1} id="support-theme-title">
                {current.title}
              </h3>
              <p>{current.opening}</p>
              <div className={styles.modeSwitch} aria-label="先に確認する視点">
                {(['organization', 'practice'] as const).map((kind) => (
                  <button key={kind} aria-pressed={mode === kind} onClick={() => chooseMode(kind)}>
                    {kind === 'organization' ? '機関の体制' : '支援の実践'}
                  </button>
                ))}
              </div>
              {question(mode)}
              <details className={styles.counterpart} key={`counterpart-${active}-${mode}`}>
                <summary>
                  {otherMode === 'practice'
                    ? '実際の支援はどうか、一緒に確かめる'
                    : 'それを支える体制も、一緒に確かめる'}
                </summary>
                {question(otherMode)}
              </details>
              <p className={styles.small}>{current.caution}</p>
              {active === 'employer' && (
                <p className={styles.small}><Link href={`${base}/edition-ict#meeting`}>端末操作を教える時間と担当を、読み合わせで検討する →</Link></p>
              )}
              {active === 'network' && (
                <aside className={styles.small}>
                  <h3>紹介から、通常業務の共同設計へ</h3>
                  <p>医療では治療と本人の就業目標を、教育では在学中の経験と卒業後の受入れをつなぐ。連携先も、目標・担当・勤務と費用を自らの通常業務で変える必要があります。会議や紹介の回数だけで、必要な支援が始まったとは判断しません。</p>
                  <p>共同計画への合意と、正式な給付決定・必要時刻の実提供は別です。計画の後に残る権限、担当勤務と支払を、正当な各主体へ結びます。全職種に同じ役割や記録共有を求める方法にはしません。</p>
                  <Link href="/materials/research/NBL-RK-0027">通常業務を変える根拠と反条件へ →</Link>
                  <Link href="/materials/textbook/11">関係分野の業務と引継ぎを学ぶ →</Link>
                  <br />
                  <Link href="/materials/textbook/technical#textbook-technical-t40">医療・教育・福祉・産業保健の実践詳論へ →</Link>
                </aside>
              )}
              <a
                className={styles.save}
                href="#organization-action"
                onClick={() => {
                  setSelected(active);
                  markReviewEdited();
                }}
              >
                このテーマの改善案と担当を見る ↓
              </a>
              <nav className={styles.pager} aria-label="確認テーマの前後へ">
                <button
                  disabled={index === 0}
                  onClick={() => chooseTheme(organizationChecks[index - 1].id)}
                >
                  ← 前のテーマ
                </button>
                <button
                  disabled={index === organizationChecks.length - 1}
                  onClick={() => chooseTheme(organizationChecks[index + 1].id)}
                >
                  次のテーマ →
                </button>
              </nav>
            </article>
          </div>
        </section>

        <section id="decision-note" className={`${styles.action} ${styles.decisionAnchor}`} aria-label="機関と地域の判断を残す">
          <FlagshipDecisionNote
            kind="support" contextId={current.id} contextTitle={current.title}
            question={`${current.organization.question}\n${current.practice.question}`} sourceHref="#support-workbench"
            references={[
              { label: 'NBL 支援実践・体制改善ツール（問いの編集版 2026-09-15）', href: nextSiteHref(supportToolHref(current.id, mode)) },
              ...[...current.organization.sources, ...current.practice.sources].filter((source, index, all) =>
                all.findIndex((item) => item.report === source.report && item.location === source.location) === index,
              ).map((source) => ({
                label: `${supportResearch[source.report].title} ${source.location}`,
                href: supportResearch[source.report].url,
              })),
            ]}
          />
          <p>他の役割と話すときは、このメモから必要な項目を選べます。全テーマの回答と改善メモは、下の全体点検にまとめて保存できます。移動先へ入力は渡りません。</p>
          <nav className={styles.next} aria-label="機関の判断を本人と職場の条件へつなぐ">
            <Link href={`${base}/case-readings#${current.case}`}>本人の希望と別案を確かめる：{current.caseLabel} →</Link>
            <Link href={`${base}/work-design-views-guide?system=${current.guide}#guide-detail`}>職場が変える条件を確かめる：{current.guideLabel} →</Link>
            <a href="#organization-action">全回答を含む改善メモと保存へ ↓</a>
          </nav>
        </section>

        <section id="support-overview" className={styles.overview} aria-labelledby="overview-title">
          <h2 id="overview-title">支援と体制の、どこを確かめたか</h2>
          <p className={styles.small}>
            空欄を埋める競争ではありません。必要な支援が抜けていないか、関係者と見渡す一覧です。回答の違いは平均せず、別々のメモを持ち寄れます。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <caption className={styles.srOnly}>
                8テーマの自己チェック状況。未回答は未確認のまま残します。
              </caption>
              <thead>
                <tr>
                  <th scope="col">テーマ</th>
                  <th scope="col">支援の実践</th>
                  <th scope="col">機関の体制</th>
                </tr>
              </thead>
              <tbody>
                {organizationChecks.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">
                      <a href="#support-theme-title" onClick={() => chooseTheme(item.id)}>
                        {item.short}
                      </a>
                    </th>
                    <td>{supportAnswerLabel('practice', answers.practice[item.id])}</td>
                    <td>{supportAnswerLabel('organization', answers.organization[item.id])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="organization-action"
          className={styles.action}
          aria-labelledby="organization-action-heading"
        >
          <p className={styles.eyebrow}>次の打合せに持ち帰る</p>
          <h2 id="organization-action-heading">支援を届けるために、何を変えるか</h2>
          <label className={styles.field}>
            今回の改善テーマ
            <select
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                markReviewEdited();
              }}
            >
              <option value="">自分たちで選ぶ（未回答でも選べます）</option>
              {organizationChecks.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.short}
                </option>
              ))}
            </select>
          </label>
          {focus ? (
            <>
              <div className={styles.proposal}>
                <h3>{focus.title}</h3>
                <div className={styles.pair}>
                  {(['practice', 'organization'] as const).map((kind) => (
                    <div key={kind}>
                      <strong>
                        {kind === 'practice' ? '支援の実践' : '機関の体制'}：
                        {supportAnswerLabel(kind, answers[kind][selected])}
                      </strong>
                      <p>{supportResponseNextStep(kind, answers[kind][selected])}</p>
                    </div>
                  ))}
                </div>
                <p>{supportPairObservation(answers, selected)}</p>
                <h4>打合せで検討する案</h4>
                <p>{focus.action}</p>
                <dl>
                  <dt>決める役割の例</dt>
                  <dd>{focus.owner}</dd>
                  <dt>最初の一歩</dt>
                  <dd>{focus.firstStep}</dd>
                  <dt>実施後に確かめること</dt>
                  <dd>{focus.revisit}</dd>
                </dl>
                <p className={styles.small}>{focus.caution}</p>
              </div>
              <p id="organization-privacy" className={styles.small}>
                入力は送信・自動保存しません。再開する場合は下でこのブラウザに保存できます。個人名・病状・個別相談は書かず、役割名や業務の改善だけを書いてください。
              </p>
              <label className={styles.field}>
                自分たちで決めたこと・まだ確認すること
                <textarea
                  rows={3}
                  value={draft.note}
                  maxLength={1500}
                  aria-describedby="organization-privacy"
                  placeholder="比較できる仕事の条件、維持する支援、実行する権限・有償時間・費用・代替。決めたことと未確認を分けて記入。"
                  onChange={(e) => updateDraft('note', e.target.value)}
                />
              </label>
              <div className={styles.fields}>
                <label className={styles.field}>
                  決める人・一緒に確認する役割
                  <input
                    value={draft.owner}
                    maxLength={120}
                    aria-describedby="organization-privacy"
                    placeholder="例：管理者と企業支援担当"
                    onChange={(e) => updateDraft('owner', e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  次に確認する日・機会
                  <input
                    value={draft.timing}
                    maxLength={120}
                    aria-describedby="organization-privacy"
                    placeholder="例：次の会議、試行の2週間後"
                    onChange={(e) => updateDraft('timing', e.target.value)}
                  />
                </label>
              </div>
              <p className={styles.small}>
                テーマを切り替えても、そのテーマの下書きはこの画面にいる間は残ります。保存・印刷する改善メモは、いま選んでいるテーマと、記入した全テーマの下書き・全回答です。
              </p>
              <nav className={styles.next} aria-label="改善テーマに関連するガイドと相談事例">
                <Link href={`${base}/work-design-views-guide?system=${focus.guide}#guide-detail`}>
                  {focus.guideLabel} →
                </Link>
                <Link href={`${base}/case-readings#${focus.case}`}>{focus.caseLabel} →</Link>
                <Link href={focus.id === 'network' ? '/materials/textbook/11' : '/materials/textbook/13'}>実行する担当と資源を、教科書で学ぶ →</Link>
                <details>
                  <summary>話合いや結果を記録する場合（任意）</summary>
                  <Link href={workbookHref('book4')}>機能・勤務・費用を再配分する会議用様式へ →</Link>
                  <Link href={workbookHref('book3')}>実施後の結果と再判断を記録する →</Link>
                </details>
              </nav>
              {focus.id === 'continuity' && (
                <details className={styles.evidence}>
                  <summary>年間の支援容量も計画する場合（任意）</summary>
                  <p>個別の引継ぎと再相談の経路に加え、機関全体の新規・継続支援へ必要な勤務時間を比べる、別の計画例です。</p>
                  <ResearchKnowledgeApplication mode="capacity" />
                </details>
              )}
              <p className={styles.small}>
                別のページへ進む前に、全体点検をブラウザへ保存するか、ファイルに書き出してください。
              </p>
            </>
          ) : (
            <p>
              採点で優先順位を決めるのではなく、今届いていない支援や現場の行き詰まりから、打合せで扱うテーマを選びます。
            </p>
          )}
          <p className={styles.small}>ここでは全テーマの回答と改善メモを扱います。上の担当・時間・費用を選んで持ち帰るメモは、その欄で保存できます。共有端末や共有ファイルには個人を特定する情報を残さないでください。</p>
          <div className={styles.actions}>
            <button className={styles.secondary} onClick={saveReview}>全体点検をこのブラウザに保存</button>
            {reviewStored && <button className={styles.secondary} onClick={removeReview}>端末内の全体点検を削除</button>}
            <button className={styles.save} onClick={download}>
              全回答と全テーマの改善メモを保存（md）
            </button>
            <button className={styles.secondary} onClick={() => window.print()}>
              打合せ用に印刷
            </button>
          </div>
          <p role="status">
            {saved ? '書き出しを開始しました。ダウンロードしたファイルを確認してください。' : reviewMessage}
          </p>
        </section>

        <section className={styles.source} aria-labelledby="source-title">
          <h2 id="source-title">研究を、現場の改善に使うために</h2>
          <p>
            本人の準備だけでなく、仕事・職場・継続支援の条件も調整する。この支援モデルの違いを、理念への賛否ではなく実際の取組で確かめます。
          </p>
          <details>
            <summary>4報告書の役割と、NBLが編集した範囲</summary>
            {Object.values(supportResearch).map((s) => (
              <div key={s.url}>
                <h3>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.title}（PDF・別タブ）
                  </a>
                </h3>
                <p>{s.role}</p>
              </div>
            ))}
            <p>
              8テーマへの整理、問い・回答選択肢、改善案と画面の分岐はNBLの編集です。原調査を再現するものではなく、過去の得点・全国結果との比較はできません。支援者の自己報告を、本人の経験そのものとは扱いません。
            </p>
            <p>
              この回答から機関を二類型に判定したり、支援効果や因果関係を認定したりしません。改善案の実施可能性と結果は、その都度確認します。
            </p>
          </details>
          <Link href={`${base}/theory-method-trust#nbl-evidence`}>
            NBLが確かめてきたこと・まだ確かめられていないこと →
          </Link>
        </section>

        <section className={styles.printOnly} aria-hidden="true">
          <h1>就労支援の実践・体制改善メモ</h1>
          <p>NBL編集版 2026-09-15 · 自己チェックであり、原調査票・認定尺度ではありません。</p>
          <h2>{focus ? focus.title : '改善テーマ：未選択'}</h2>
          {focus ? (
            <>
              {(['practice', 'organization'] as const).map((kind) => (
                <p key={kind}>
                  <strong>
                    {supportModeLabels[kind]}：{supportAnswerLabel(kind, answers[kind][selected])}
                  </strong>
                  <br />
                  {supportResponseNextStep(kind, answers[kind][selected])}
                </p>
              ))}
              <p>{supportPairObservation(answers, selected)}</p>
              <p>
                <strong>検討する案（未決定）：</strong>
                {focus.action}
              </p>
              <p>
                <strong>役割の例：</strong>
                {focus.owner}
              </p>
              <p>
                <strong>最初の一歩：</strong>
                {focus.firstStep}
              </p>
              <p>
                <strong>実施後の確認：</strong>
                {focus.revisit}
              </p>
              <p>{focus.caution}</p>
            </>
          ) : null}
          <p>
            <strong>決めたこと・確認すること：</strong>
            {draft.note || '未記入（案を採用したという意味ではありません）'}
          </p>
          <p>
            <strong>決める役割：</strong>
            {draft.owner || '未記入'}　<strong>次の確認：</strong>
            {draft.timing || '未記入'}
          </p>
          {organizationChecks.filter(item => item.id !== selected && Object.values(drafts[item.id] ?? {}).some(value => value.trim())).map(item => (
            <div key={item.id}>
              <h2>別テーマの改善メモ：{item.title}</h2>
              <p>検討する案（未決定）：{item.action}</p>
              <p>自分たちで決めたこと・まだ確認すること：{drafts[item.id].note || '未記入'}</p>
              <p>決める人・一緒に確認する役割：{drafts[item.id].owner || '未記入'}</p>
              <p>次に確認する日・機会：{drafts[item.id].timing || '未記入'}</p>
              <p>実施後の確認：{item.revisit}</p>
            </div>
          ))}
          <table>
            <caption>
              8テーマの自己チェック状況（未回答・不明・機会なしは不足と判定しません）
            </caption>
            <thead>
              <tr>
                <th>テーマ</th>
                <th>支援の実践</th>
                <th>機関の体制</th>
              </tr>
            </thead>
            <tbody>
              {organizationChecks.map((item) => (
                <tr key={item.id}>
                  <th>{item.short}</th>
                  <td>{supportAnswerLabel('practice', answers.practice[item.id])}</td>
                  <td>{supportAnswerLabel('organization', answers.organization[item.id])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            設計参照：NIVR
            No.134・147・167・180。設問ごとの出典対応は画面と保存用mdに記載。実施は本人の意向と役割・権限を踏まえて決めます。点検完了まで今必要な支援を待たせません。個人情報は記入せず、共有範囲を確認してください。
          </p>
        </section>
      </main>
      <AxiomNextSiteFooter />
    </div>
  );
}
