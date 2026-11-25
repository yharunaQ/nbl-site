import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ClipboardCheck,
  FileSearch,
  Landmark,
} from 'lucide-react';
import MaterialsShell from '@/components/materials/MaterialsShell';
import styles from '@/components/materials/Materials.module.css';
import { materialCatalog, MATERIALS_EDITION, MATERIALS_UPDATED, RESEARCH_ABSTRACT_COUNT } from '@/lib/materials/catalog';
const icons = [FileSearch, BriefcaseBusiness, ClipboardCheck, BookOpen, Landmark];
export default function MaterialsHome() {
  return (
    <MaterialsShell
      title="働く可能性を、支える条件から広げる"
      description={`研究抄録${RESEARCH_ABSTRACT_COUNT}件、企業向け仕事設計ガイド2.0、支援機関チェックリスト、教科書全13章、総合政策案全12章を読むNBL資料集。`}
      path="/materials"
    >
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>
            NBL READING ROOM <span>2026</span>
          </p>
          <p className={styles.conference}>第34回職業リハビリテーション研究・実践発表会 関連資料</p>
          <h1>
            働く可能性を、
            <br />
            支える条件から
            <br />
            <em>広げる。</em>
          </h1>
          <p className={styles.heroLead}>
            本人への支援とともに、仕事・職場・制度・財源をつくり直す。
            <br />
            そのために、何を確かめ、誰が何を変えるか。
          </p>
          <a href="#choose" className={styles.primary}>
            いまの問いから資料を選ぶ <ArrowRight size={18} />
          </a>
          <p className={styles.meta}>{MATERIALS_EDITION}　／　更新 {MATERIALS_UPDATED}</p>
        </div>
        <figure className={styles.map} aria-labelledby="materials-map-caption">
          <p className={styles.diagramLabel}>一つの相談から、支える仕組みへ</p>
          <div className={styles.mapCenter}>
            <span>出発点</span>
            <strong>
              本人が選ぶ
              <br />
              仕事と生活
            </strong>
            <small>望むこと・保留・選び直し</small>
          </div>
          <div className={styles.mapGrid}>
            <Link href="/materials/textbook">
              <span>学ぶ</span>
              <strong>支援の考え方</strong>
              <small>教科書 13章</small>
            </Link>
            <Link href="/materials/work-design">
              <span>変える</span>
              <strong>仕事と職場</strong>
              <small>ガイド 10テーマ</small>
            </Link>
            <Link href="/materials/support">
              <span>届ける</span>
              <strong>支援の体制</strong>
              <small>チェックリスト 8テーマ</small>
            </Link>
            <Link href="/materials/policy">
              <span>支える</span>
              <strong>制度と財源</strong>
              <small>政策案 12章</small>
            </Link>
          </div>
          <Link className={styles.mapBase} href="/materials/research">
            <FileSearch size={20} />
            <span>
              <strong>判断の根拠を確かめる</strong>
              <small>{RESEARCH_ABSTRACT_COUNT}の研究抄録・論点・反証</small>
            </span>
            <ArrowRight size={18} />
          </Link>
          <figcaption id="materials-map-caption">
            同じ問いを、実践・学習・制度と根拠の間で行き来するための5資料です。
          </figcaption>
        </figure>
      </section>
      <section id="choose" className={styles.collection}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>FIVE WAYS IN</p>
            <h2>いま、何を判断したいですか。</h2>
          </div>
          <p>
            全体像をつかむ。例で考える。
            <br />
            必要な章・論証を、詳しく読む。
          </p>
        </div>
        <div className={styles.cards}>
          {materialCatalog.map((m, i) => {
            const Icon = icons[i];
            return (
              <article key={m.slug} className={styles.card}>
                <div className={styles.cardTop}>
                  <span>
                    {m.number} / {m.label}
                  </span>
                  <Icon size={25} strokeWidth={1.5} />
                </div>
                <h3>
                  <Link href={`/materials/${m.slug}`}>{m.title}</Link>
                </h3>
                <p className={styles.count}>{m.count}</p>
                <p>{m.description}</p>
                <div className={styles.decision}>
                  <span>読んで判断できること</span>
                  <p>{m.decision}</p>
                </div>
                <Link className={styles.textLink} href={`/materials/${m.slug}`}>
                  目次と読みどころ <ArrowRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
      <section id="november-editions" className={styles.collection}>
        <div className={styles.sectionHead}>
          <div>
            <h2>11月22日の四冊と、会議で試す教材</h2>
          </div>
          <p>四冊はNBLの提案・教材です。国・地方編は関係団体が協議するための起草案です。</p>
        </div>
        <ul>
          <li><a href="/editions/2026-11-22/policy.pdf">総合政策提言『働く機会と支援の再設計』（PDF・11ページ）</a></li>
          <li><a href="/editions/2026-11-22/textbook.pdf">就労支援の教科書『働く条件をつくり直す』（PDF・39ページ）</a></li>
          <li><a href="/editions/2026-11-22/national.pdf">共同提言案・国編『働く選択が制度の境目で消えないために』（PDF・5ページ）</a></li>
          <li><a href="/editions/2026-11-22/local.pdf">共同提言案・地方編『応募・卒業・復職に間に合う地域の支援』（PDF・5ページ）</a></li>
          <li><a href="/learning/first-day-meeting.html">25分の会議教材『応募前に、初日の介助を確かめる』</a></li>
        </ul>
        <p>
          教科書に記された研究番号は<Link href="/materials/research">研究抄録集</Link>で検索できます。
          PDFとは版の異なる<Link href="/materials/textbook/technical">実践詳論</Link>も参照できます。
        </p>
      </section>
      <section className={styles.bridge}>
        <div>
          <p className={styles.eyebrow}>START WITH ONE SCENE</p>
          <h2>
            「訓練はできた。
            <br />
            でも、仕事につながらない。」
          </h2>
          <p>
            本人に必要な学習と、企業が用意する仕事、支援者が訪問する時間は、別々の条件です。一つの問いを資料の間で追うと、次に変える場所が見えてきます。
          </p>
        </div>
        <ol className={styles.readingPath}>
          <li>
            <Link href="/materials/textbook/1">
              <span>01 学ぶ</span>
              <strong>訓練以外に何を変えられるか</strong>
              <small>
                教科書 第1章 <ArrowRight size={15} />
              </small>
            </Link>
          </li>
          <li>
            <Link href="/materials/work-design/WDG2-03">
              <span>02 職場で考える</span>
              <strong>仕事を分け、教え方を組む</strong>
              <small>
                ガイド 仕事の分け方・進め方 <ArrowRight size={15} />
              </small>
            </Link>
          </li>
          <li>
            <Link href="/materials/support/work">
              <span>03 実施条件を見る</span>
              <strong>担当と訪問時間を確保できるか</strong>
              <small>
                支援機関チェックリスト <ArrowRight size={15} />
              </small>
            </Link>
          </li>
          <li>
            <Link href="/materials/policy/11">
              <span>04 制度へ返す</span>
              <strong>不足する機能と財源を誰が決めるか</strong>
              <small>
                政策案 第11章 <ArrowRight size={15} />
              </small>
            </Link>
          </li>
        </ol>
      </section>
      <section className={styles.about}>
        <div>
          <p className={styles.eyebrow}>HOW NBL READS</p>
          <h2>
            複雑さを残し、
            <br />
            読む負担を減らす。
          </h2>
        </div>
        <div>
          <p>
            ICF（国際生活機能分類）の相互作用の視点と、フロンティアAIの文脈読解を使い、本人・仕事・環境・支援・時間の関係を検討しています。AIが出した答えをそのまま採用せず、原資料の文脈、別の説明、実施する人の権限と費用へ戻ります。
          </p>
          <p>
            この資料集では、用途から入り、全体像・具体例・詳しい本文を順に読めます。読みやすさは設計上の目標であり、人間の理解や支援効果を確認した結果ではありません。
          </p>
          <Link className={styles.textLink} href="/theory-method-trust">
            NBLの専門性について <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <aside className={styles.edition}>
        <h2>この版の位置づけ</h2>
        <p>
          発表に関連する形成済みの内容を、学習・検討のための暫定閲覧版に編集しました。研究抄録の数は、独立した実証研究や査読済み論文の数ではありません。例は本文の表示に従って出典事例と架空例を読み分けてください。
        </p>
        <p>
          教科書・政策案の底本は2026年10月12日版です。制度の説明はその版の確認範囲に基づき、現在の個別適用は正式な窓口と確認します。政策案の新しい給付・財源・責任配分はNBLの提案です。
        </p>
      </aside>
    </MaterialsShell>
  );
}
