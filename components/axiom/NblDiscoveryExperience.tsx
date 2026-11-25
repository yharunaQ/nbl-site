import { AxiomNextSiteLink as Link } from './AxiomNextSiteLinks';
import { ArrowDown, ArrowRight } from 'lucide-react';
import styles from './NblDiscoveryExperience.module.css';

const base = '/preview/axiom-next-nbl-v2';
const comicImage = '/images/nbl-discovery/reception-interruption-comic-v1.webp';
const panels = [
  {
    title: '本人の希望',
    dialogue: (
      <>
        急に席を外す必要があって。
        <br />
        でも、相談の仕事は続けたい。
      </>
    ),
    alt: '青緑のカーディガンの職員が、同僚に希望を伝える。同僚は向き合って聞いている。',
    position: '0%',
  },
  {
    title: '同僚からの案',
    dialogue: (
      <>
        じゃあ、来客の受付は
        <br />
        私が担当するね。
      </>
    ),
    alt: '同僚が入口の受付を担当し、本人は奥の相談席を担当する分担案。',
    position: '50%',
  },
  {
    title: 'でも、こんな場面では？',
    dialogue: (
      <>
        相談の途中で
        <br />
        席を外したくなったら…？
      </>
    ),
    alt: '本人と相談相手が話している最中。相手の話は続き、本人はふと出口の方を気にする。',
    position: '100%',
  },
];

// Fictional editorial comic, not observed outcomes or live AI inference.
// One shared illustration is shown in three responsive, separately described panels.
export default function NblDiscoveryExperience() {
  return (
    <section className={styles.experience} aria-labelledby="discovery-title">
      <header className={styles.heading}>
        <p className={styles.eyebrow}>ひとつの相談から、仕事の条件を見直す</p>
        <h2 id="discovery-title">
          <span>受付を代わってもらえば、</span>
          <span>休めるだろうか。</span>
        </h2>
      </header>
      <figure className={styles.comic} aria-label="本人の希望、分担案、相談中に残る問いの3コマ">
        <figcaption className={styles.sceneNote}>ある相談窓口での、架空のやりとりです。</figcaption>
        <ol className={styles.panels}>
          {panels.map((panel, index) => (
            <li key={panel.title} className={index === 2 ? styles.questionPanel : undefined}>
              <h3>
                <span aria-hidden="true">{index + 1}</span>
                {panel.title}
              </h3>
              <div className={styles.panelFrame}>
                <p className={index === 2 ? styles.thought : styles.dialogue}>{panel.dialogue}</p>
                <img
                  src={comicImage}
                  alt={panel.alt}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: panel.position }}
                />
              </div>
            </li>
          ))}
        </ol>
      </figure>
      <div className={styles.nextDecision}>
        <h3>
          受付を代わることと、
          <br className={styles.mobileBreak} />
          相談を引き継ぐことは、別。
        </h3>
        <p>
          相談を引き継げる人が、その時に動けるか。「代わる人がいる」だけでなく、技能や時間の組み方まで確かめると、考えるべき仕事の分担が変わります。
        </p>
        <p className={styles.takeaway}>
          本人の希望と、仕事が実際に動く条件を、一緒に見る。これが、NBLの見方の一つです。
        </p>
        <a className={styles.continueHome} href="#site-overview">
          自分の場で決める道具を見る <ArrowDown size={18} aria-hidden="true" />
        </a>
      </div>
      <details className={styles.closeLook}>
        <summary>相談の途中で、何を確かめる？</summary>
        <div>
          <p>
            相談相手が話の途中なら、記録作業のように保存して離れるだけでは済まないことがあります。
            受付を代われる人が、相談内容を引き継げるとは限りません。
          </p>
          <dl>
            <div>
              <dt>本人が中断する必要</dt>
              <dd>相談の区切りまで待てるのか。待てない場面にも対応できるか。</dd>
            </div>
            <div>
              <dt>その場でつなぐ条件</dt>
              <dd>
                交代者に必要な技能・判断権限があり、その時間に別の仕事から離れられるか。相談相手への説明や情報の扱いも確かめる。
              </dd>
            </div>
            <div>
              <dt>本人が選びたい働き方</dt>
              <dd>
                その条件で相談業務を続けたいか。相談を減らす・別の仕事を選ぶ希望も、同じように扱う。
              </dd>
            </div>
          </dl>
          <p>
            予約制に変えても、相談中に中断できるとは限りません。安全につなぐ方法がなければ、そのまま試さず、責任者と業務の受け方や担当を見直します。
          </p>
          <p>中断できても回復が足りなければ、仕事量や休養など別の対応も検討します。</p>
        </div>
      </details>
      <nav className={styles.relatedLinks} aria-label="この相談を詳しく読む">
        <span>この相談を詳しく読むなら</span>
        <Link href={base + '/case-readings#case-interruption'}>
          対応の選択肢を読む <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <Link href={base + '/work-design-views-guide?system=WDG2-04#time-interruption'}>
          中断・再開の備えを読む <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </nav>
      <p className={styles.boundary}>
        マンガは支援効果を示す実例ではありません。必要な健康・安全上の対応を、仕組みの完成まで待たせません。
      </p>
      <p className={styles.method}>
        AIとの専門的検討から編集した例です。この画面でAIが判定しているわけではありません。
      </p>
    </section>
  );
}
