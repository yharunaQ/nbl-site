import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Download, Link2, Printer } from 'lucide-react';
import PageSeo from '@/components/PageSeo';
import { AxiomNextSiteHeader, AxiomNextSiteFooter } from './AxiomNextSiteChrome';
import { AxiomNextSiteLink as Link, useNextSiteLinkMode, useNextSitePublished } from './AxiomNextSiteLinks';
import { firstDayAssistance, nextSiteFlagships, regionalMaterialProductionHref } from './workForkRoutes';
import styles from './FirstDayAssistancePage.module.css';

const editionDate = '2026年11月25日版';
const sources = [
  {
    label: '厚生労働省の好事例集 · 松江の事例（PDF）',
    href: 'https://www.mhlw.go.jp/content/12200000/001259677.pdf#page=5',
  },
  {
    label: '2025年5月23日 院内集会 · 当事者の報告',
    href: 'https://tennohatakenimihanarunoka.com/detailed-report/%E5%A0%B1%E5%91%8A%E2%91%A1%E5%BD%93%E4%BA%8B%E8%80%85%E3%81%8B%E3%82%89%E3%81%AE%E4%BA%8B%E4%BE%8B%E5%A0%B1%E5%91%8A%E3%80%8C5-23%E9%99%A2%E5%86%85%E9%9B%86%E4%BC%9A%E3%80%80%E4%BB%8B%E5%8A%A9/',
  },
] as const;

const meetingQuestions = [
  '本人が望む仕事と勤務。出社・在宅・別の仕事・保留のうち、どの案を確かめたいか。',
  '会社はどの工程と勤務で返事ができるか。往復と勤務中の介助を誰が何時に担うか。',
  '欠員時の代行と必要な費用。誰が支払いを決め、何が未確定か。',
  '何を誰に伝えるか本人に確認し、担当者がいつ本人に返事をするか。開始後、何を見て案を見直すか。',
] as const;

const objection =
  'すでに応募前に返せる地域や、早く照会しても介助を用意できない場合はありますか。人数、時間、費用、制度のどの条件で提案を変えるかを考えてください。';

const costExample =
  '架空の四半期試算では、照会・返答に追加26時間（10万4,000円）、訪問・移動・代行の枠も確保する場合は計91時間（36万4,000円）。1時間4,000円で計算した応募前の調整費です。入社後の継続介助に必要な人員・費用は別に見積もります。';

export default function FirstDayAssistancePage() {
  const published = useNextSitePublished();
  const isolated = useNextSiteLinkMode() === 'isolated_root';
  const showReviewEditions = published || isolated && process.env.NBL_LOCAL_REVIEW_EDITIONS === 'true';
  const [copyStatus, setCopyStatus] = useState('');
  const [copyFallback, setCopyFallback] = useState('');
  const ContentRoot = isolated ? 'main' : 'div';
  const pagePath = isolated ? `/${firstDayAssistance.slug}` : firstDayAssistance.href;

  function permalink() {
    return new URL(pagePath, window.location.origin).href;
  }

  async function copyPageLink() {
    const url = permalink();
    try {
      await navigator.clipboard.writeText(url);
      setCopyFallback('');
      setCopyStatus('この特集のリンクをコピーしました。');
    } catch {
      setCopyFallback(url);
      setCopyStatus('下の欄からリンクをコピーできます。');
    }
  }

  function downloadMeetingNote() {
    const content = [
      `# ${firstDayAssistance.title}`,
      `Next Being Lab · ${editionDate} · ${permalink()}`,
      '',
      '## 検討する案',
      '- 人は確保できる。返事が遅い場合は、担当者の照会・返答時間を確保する。',
      '- 必要な時間に人がいない。移動・待機・代行を含めた提供枠の費用を見積もる。',
      '- 既存の経路で間に合う場合は、その窓口と返答日を本人に伝える。',
      '',
      costExample,
      '',
      '## 会議に持ち帰る問い',
      ...meetingQuestions.flatMap((question, index) => [`${index + 1}. ${question}`, '   回答：', '']),
      '## この提案を変える条件',
      objection,
      '回答：',
      '',
      '## 原典',
      ...sources.map((source) => `- [${source.label}](${source.href})`),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'nbl-first-day-assistance.md';
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <PageSeo
        title={`${firstDayAssistance.title}｜Next Being Lab`}
        description={firstDayAssistance.summary}
        path={pagePath}
        type="article"
        noIndex={!published}
      />
      <AxiomNextSiteHeader currentPath={`/${firstDayAssistance.slug}`} />
      <ContentRoot>
        <article className={styles.topic}>
          <header className={styles.hero}>
            <div>
              <p className={styles.kicker}>松江のデザイン会社から · {editionDate}</p>
              <h1>{firstDayAssistance.title}</h1>
              <p>実習したデザイン会社に就職し、在宅勤務も使いながら、できるだけ出社したい。松江でその希望を支えるために、会社は勤務と設備を変え、市は通勤支援に職場での介助を加えました。</p>
            </div>
            <nav aria-label="特集の案内">
              <a href="#matsue">松江で変わったこと <ArrowRight size={17} aria-hidden="true" /></a>
              <a href="#proposal">応募前に返事をする提案 <ArrowRight size={17} aria-hidden="true" /></a>
              <a href="#meeting">会議に持ち帰る <ArrowRight size={17} aria-hidden="true" /></a>
            </nav>
          </header>

          <section id="matsue" className={styles.spread} aria-labelledby="matsue-title">
            <h2 id="matsue-title">デザインの仕事を選べた条件</h2>
            <div>
              <p>本人は大学時代に実習した会社で働きたいと考え、就職の見込みが立った段階で、通勤と職場での介助を相談しました。市は要綱と予算を整え、2023年4月の入社に合わせて職場介助を始めました。会社は勤務や休憩時間を調整し、横になって作業できる設備を用意しました。</p>
              <p>取材時は週4日出社し、1日は在宅勤務でした。出社日は送迎を使い、在宅日も勤務中の介助を受け、顧客の希望に合わせたデザインや3Dの図面を手がけていました。</p>
              <a href={sources[0].href}>{sources[0].label} <ArrowUpRight size={16} aria-hidden="true" /></a>
              <aside className={styles.counter}>
                <h3>介助付きで仕事を試した、その先</h3>
                <p>別の人は、大学で有償の活動を経験し、介助付きの企業実習で働く気持ちが強まりました。その後、かかわっていた大学の事業で正社員として働こうと上司に相談したものの、2025年5月の発表時点では介助の道筋がついていませんでした。その後の採否は公表資料からは分かりません。</p>
                <a href={sources[1].href}>{sources[1].label} <ArrowUpRight size={16} aria-hidden="true" /></a>
              </aside>
            </div>
          </section>

          <section id="proposal" className={styles.spread} aria-labelledby="proposal-title">
            <div>
              <p className={styles.kicker}>NBLから地域への提案</p>
              <h2 id="proposal-title">応募を決める前に、誰がいつ答えるか</h2>
            </div>
            <div>
              <p>本人が希望する仕事と勤務について、会社・自治体・提供事業者が、引き受けられること、まだ決められないこと、次に返事をする日を一枚にして本人へ返す。今ある窓口と契約で初日から手配できる地域では、その経路を使えます。</p>
              <dl className={styles.options}>
                <div>
                  <dt>人はいる。照会と返事が遅い。</dt>
                  <dd>自治体や受託機関が、担当者の勤務に照会・返答の時間を確保する。</dd>
                </div>
                <div>
                  <dt>必要な時間に動ける人がいない。</dt>
                  <dd>自治体と提供事業者が、応募前に現場を見に行く時間や、移動と代行を含めた勤務枠の費用を見積もる。初日以降の介助も、必要な曜日と時間に引き受け手がいるかを確かめる。</dd>
                </div>
              </dl>
              <p className={styles.note}>{costExample}</p>
              <p>会社は仕事と勤務の案を返し、費用を決められる担当は支払いの見通しを伝えます。応募するか、保留するか、後から勤務を変更したいかは本人が選びます。聞き合わせる相手と伝える情報も、先に本人と決めます。</p>
              {showReviewEditions && (
                <nav className={styles.proposals} aria-label="制度と予算の提言">
                  <a href="/editions/2026-11-22/local.pdf">地方への提言案と試算（PDF） <ArrowUpRight size={16} aria-hidden="true" /></a>
                  <a href="/editions/2026-11-22/national.pdf">国への提言案（PDF） <ArrowUpRight size={16} aria-hidden="true" /></a>
                </nav>
              )}
            </div>
          </section>

          <section id="meeting" className={styles.meeting} aria-labelledby="meeting-title">
            <h2 id="meeting-title">あなたの地域なら、誰から何の返事をもらえますか</h2>
            {published && <p><a href="/learning/first-day-meeting.html">校正の仕事を例に、応募前の返事を考える25分の演習を使う</a></p>}
            <ol>
              {meetingQuestions.map((question) => <li key={question}>{question}</li>)}
            </ol>
            <h3>提案が変わる条件</h3>
            <p>{objection}</p>
            <p className={styles.note}>メモは記入欄のあるファイルです。会議や自分のAIに渡す場合は、共有できる条件だけを使えます。</p>
            <div className={styles.actions}>
              <button type="button" onClick={downloadMeetingNote}><Download size={17} aria-hidden="true" /> メモを保存（Markdown）</button>
              <button type="button" onClick={() => window.print()}><Printer size={17} aria-hidden="true" /> 問いを印刷</button>
              <button type="button" onClick={copyPageLink}><Link2 size={17} aria-hidden="true" /> リンクをコピー</button>
            </div>
            {copyFallback && <input aria-label="この特集のリンク" readOnly value={copyFallback} onFocus={(event) => event.currentTarget.select()} />}
            <p role="status" className={styles.note}>{copyStatus}</p>
            <section className={styles.printSources} aria-label="元の資料">
              <p>Next Being Lab「{firstDayAssistance.title}」 {editionDate} · {pagePath}</p>
              {sources.map((source) => <p key={source.href}>{source.label}<br />{source.href}</p>)}
            </section>
          </section>

          <section className={styles.toolSection} aria-labelledby="topic-tools-title">
            <h2 id="topic-tools-title">自分の場で使う</h2>
            <div>
              {nextSiteFlagships.map((tool) => (
                <article key={tool.href}>
                  <p className={styles.kicker}>{tool.audience}</p>
                  <h3>{tool.title}</h3>
                  <p>{tool.topicAction}</p>
                  <Link href={tool.relatedHref}>{tool.name} <ArrowRight size={17} aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          </section>
          <aside className={styles.materialProduction} aria-labelledby="regional-material-title">
            <h2 id="regional-material-title">地元の進路会議や研修に合わせたい方へ</h2>
            <p>地域の学校・職場・介助事業者に確認し、次年度の担当者にも渡せる解説や会議資料をつくる共同制作案があります。</p>
            <Link href={regionalMaterialProductionHref}>納品物と費用の考え方を見る <ArrowRight size={17} aria-hidden="true" /></Link>
          </aside>
          <nav className={styles.end} aria-label="特集の続き">
            <Link href="/preview/axiom-next-nbl-v2">トップへ <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link href="/preview/axiom-next-nbl-v2/edition-inspection">連作「仕事の分かれ道」 <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link href="/preview/axiom-next-nbl-v2/public-collaboration">出典の訂正・提案への異議 <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </nav>
        </article>
      </ContentRoot>
      <AxiomNextSiteFooter />
    </>
  );
}
