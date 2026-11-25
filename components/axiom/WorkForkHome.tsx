import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { AxiomNextSiteLink as Link, useNextSiteLinkMode, useNextSitePublished } from './AxiomNextSiteLinks';
import { employmentWorkPlanHref } from './employmentWorkPlan';
import NblDiscoveryExperience from './NblDiscoveryExperience';
import styles from './WorkForkHome.module.css';
import { firstDayAssistance, nextSiteFlagships, workForkEditions } from './workForkRoutes';

const base = '/preview/axiom-next-nbl-v2';
const inspectionPath = `${base}/edition-inspection`;
const ictPath = `${base}/edition-ict`;

const books = [
  { label: '教科書', title: '働く可能性と支援を学ぶ', href: '/materials/textbook' },
  { label: '研究抄録集', title: '問いから根拠と反証を探す', href: '/materials/research' },
  { label: '総合政策案', title: '制度の分担と財源を見直す', href: '/materials/policy' },
] as const;

const editions = [
  { title: '改訂教科書', file: 'textbook' },
  { title: '改訂総合政策案', file: 'policy' },
  { title: '国への共同提言案', file: 'national' },
  { title: '地方への共同提言案', file: 'local' },
] as const;

const entryScenes = [
  { choice: '明日、職場と話す', answer: '「今日は決めずに、ほかの働き方も聞いていいですか」。伝えたいことだけを、自分の言葉で手元に残せます。', label: '相談事例で自分の案を持つ', href: nextSiteFlagships[0].href },
  { choice: '任せられる仕事を探したい', answer: 'いま部署で手が回らない工程を一つ挙げてください。誰に何を任せるか、教える時間や評価を含めた案を作れます。', label: '仕事づくりの用紙を見る', href: employmentWorkPlanHref },
  { choice: '支援に行ける人が足りない', answer: '必要な曜日と時刻に、誰が行けるでしょう。訪問・引継ぎ・代行に使える勤務と費用を会議で検討できます。', label: '地域や機関の体制を検討する', href: nextSiteFlagships[2].relatedHref },
  { choice: 'まだ、うまく言えない', answer: '在宅でも働ける。でも、できるだけ会社に行きたい。そう望んだデザイナーの実例から読めます。', label: '松江の実例を読む', href: firstDayAssistance.href },
];

export default function WorkForkHome() {
  const [selected, setSelected] = useState<number | null>(null);
  const published = useNextSitePublished();
  const linkMode = useNextSiteLinkMode();
  const showReviewEditions = published ||
    linkMode === 'isolated_root' && process.env.NBL_LOCAL_REVIEW_EDITIONS === 'true';
  return (
    <div className={styles.home}>
      <section className={styles.opening} aria-labelledby="opening-title">
        <div className={styles.masthead}>
          <div>
            <h1 id="opening-title">望む仕事を選べる<br />条件をつくる</h1>
            <p>「この仕事をしたい」と言えた。その先を、誰がどう支えられるだろう。Next Being Labは、働く本人、職場、支援する人がそれぞれの場所で使える道具と、その背景にある実例を届けます。</p>
            <details className={styles.concierge} id="start-here">
              <summary>仕事のことで、どこから見ればいいか迷ったら</summary>
              <div className={styles.sceneChoices} aria-label="いまの用事">
                {entryScenes.map((scene, index) => (
                  <button type="button" key={scene.choice} aria-pressed={selected === index} onClick={() => setSelected(index)}>{scene.choice}</button>
                ))}
              </div>
              <div aria-live="polite">
                {selected !== null && <div className={styles.sceneAnswer}><p>{entryScenes[selected].answer}</p><Link href={entryScenes[selected].href}>{entryScenes[selected].label}</Link></div>}
              </div>
            </details>
          </div>
          <div id="feature" className={styles.issuePanel}><Link href={inspectionPath} className={styles.leadArt}>
            <img src={workForkEditions['edition-inspection'].image} alt={workForkEditions['edition-inspection'].imageAlt} width={1450} height={967} />
            <div><span>連作「仕事の分かれ道」</span><h2>{workForkEditions['edition-inspection'].title}</h2></div>
          </Link><Link href={`${inspectionPath}#meeting`} className={styles.issueMeeting}>会議で上演する</Link></div>
        </div>
      </section>

      <section id="site-overview" className={styles.toolSection} aria-labelledby="site-overview-title">
        <h2 id="site-overview-title">自分の場で使う</h2>
        <div className={styles.choices}>
          {nextSiteFlagships.map((tool) => (
            <article key={tool.href}>
              <p className={styles.kicker}>{tool.audience}</p>
              <h3><Link href={tool.href}>{tool.name} <ArrowRight size={17} aria-hidden="true" /></Link></h3>
              <p>{tool.body}</p>
            </article>
          ))}
        </div>
        <p className={styles.sharedCase}>「校正の仕事をしたい」。地域にまだ求人がなく、夕方の介助者も決まっていないとき、どこから動けるでしょう。</p>
        <Link className={styles.plainLink} href={`${base}/case-readings#proofreading-example`}>同じ場面を、本人・職場・支援機関の三方から見る</Link>
      </section>

      <section id="matsue-feature" className={styles.opening} aria-labelledby="serial-title">
        <Link href={firstDayAssistance.href} className={styles.featureCard}>
          <p className={styles.kicker}>特集 · 松江のデザイン会社から</p>
          <h2 id="serial-title">{firstDayAssistance.title}</h2>
          <p>在宅勤務も使いながら、できるだけ出社したい。本人の希望に応えて、会社と市は何を変えたのか。</p>
          <span>実例と、地域で使える会議メモを読む</span>
        </Link>
      </section>

      <section className={styles.followup} aria-labelledby="followup-title">
        <div className={styles.followupInner}>
          <div>
            <p className={styles.kicker}>第2号 · 介護施設の事業所報告から</p>
            <h2 id="followup-title"><Link href={ictPath}>入力担当。けれど、操作を教わっているのは誰？ <ArrowRight size={22} aria-hidden="true" /></Link></h2>
          </div>
          <figure className={styles.followupArt}>
            <img src={workForkEditions['edition-ict'].image} alt={workForkEditions['edition-ict'].imageAlt} width={1200} height={800} loading="lazy" />
            <figcaption>同僚に聞かれた端末操作。教える時間は、勤務表のどこにあるだろう。</figcaption>
          </figure>
        </div>
      </section>

      <section id="learning-policy" className={styles.library} aria-labelledby="library-title">
        <div className={styles.section}>
          <div className={styles.sectionLead}>
            <h2 id="library-title">持ち帰って、確かめる</h2>
            <p>支援者を育てたい。地域の予算を変えたい。根拠と反例を読み、自分のAIや現場の会議で、NBLの提案とは違う案も比べられます。</p>
          </div>
          <div className={styles.bookList}>
            {books.map((book) => (
              <Link href={book.href} key={book.href}><span>{book.label}</span><strong>{book.title}</strong><ArrowUpRight size={19} aria-hidden="true" /></Link>
            ))}
          </div>
          {showReviewEditions && (
            <section className={styles.revisions} id="draft-editions" aria-labelledby="editions-title">
              <h3 id="editions-title">11月22日改訂版の資料</h3>
              <ul>
                {editions.map((edition) => <li key={edition.file}><a href={`/editions/2026-11-22/${edition.file}.pdf`}>{edition.title}（PDF）</a></li>)}
              </ul>
            </section>
          )}
          <Link className={styles.plainLink} href="/materials">資料と読み方をすべて見る <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>

      <section id="explore" className={styles.section} aria-labelledby="explore-title">
        <div className={styles.sectionLead}>
          <h2 id="explore-title">話し合いに、別の入口を</h2>
          <p>台詞、図、音楽、立場の違う人の提案から、一緒に話せる問いを探す。</p>
        </div>
        <nav className={styles.related} aria-label="話し合いの題材">
          <Link href={`${base}/toolkit-studio`}>図解・マンガ <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/resources/songs">歌詞・音楽 <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/events/work-choice-forum">フォーラム <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/events/work-condition-forum">フォーラム動画・図解 <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href={`${base}/public-collaboration`}>公開の議論・改善提案</Link>
          <Link href="/virtual-news">バーチャルニュース <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </nav>
        <details className={styles.discovery} id="discovery">
          <summary>相談窓口のマンガを読む <ArrowDown size={17} aria-hidden="true" /></summary>
          <NblDiscoveryExperience />
        </details>
      </section>

      <section id="work-with-nbl" className={styles.lab} aria-labelledby="lab-title">
        <div className={styles.section}>
          <div className={styles.sectionLead}>
            <h2 id="lab-title">Next Being Lab</h2>
            <p>障害のある人が、必要な支援を使いながら、望む仕事と生活を選べる社会へ。仕事・職場・制度・財源を、当事者や現場、研究者と見直す研究所です。</p>
          </div>
          <nav aria-label="NBLについてと協働" className={styles.related}>
            <Link href={`${base}/projects#project-inquiry`}>協働を考える <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link href={`${base}/theory-method-trust#nbl-purpose`}>研究と検証を知る <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <Link href={`${inspectionPath}#responses`}>創刊号への異議・訂正 <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
