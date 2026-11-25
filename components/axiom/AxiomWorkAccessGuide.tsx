import { AxiomNextSiteLink as Link } from './AxiomNextSiteLinks';
import { Download } from 'lucide-react';
import { NBL_WORK_DESIGN_GUIDE_V2_SYSTEMS } from '@/lib/fchma/core/nblWorkDesignGuideV2';
import styles from './AxiomWorkAccessGuide.module.css';
import ResearchKnowledgeApplication from './ResearchKnowledgeApplication';

const accessGuide = NBL_WORK_DESIGN_GUIDE_V2_SYSTEMS.find((item) => item.systemId === 'WDG2-05')!;
const base = '/preview/axiom-next-nbl-v2';

export const WORK_ACCESS_BLANK_MEMO_MARKDOWN = [
  '# 情報・環境を変えてみる作業メモ',
  'NBL 仕事設計ガイド2.0 / 2026年11月25日版',
  '',
  '必要な行だけ使ってください。全項目の記入や診断名の開示は必要ありません。',
  '個人情報は記入せず、仕事の条件・選択肢・役割を整理します。NBLへの提出用ではありません。',
  '',
  '- 困難が起きる仕事・場面／起きない場面：',
  '- 本人が使いやすい受け取り方・返答方法：',
  '- 変えてみる情報形式・確認機会・環境：',
  '- 機器を使う仕事では：受取・入力・確認・修正・引渡しのどこで止まるか：',
  '- 本番システムとの適合／利用承認／習得時間／更新時の確認担当：',
  '- 承認・整備までの方法／本人が望む補助／本人と協力者の負担：',
  '- 本人と合意した共有範囲／共有しないこと：',
  '- 実施を決める担当／準備・運用を担う役割：',
  '- 安全条件を確かめる担当／使える連絡・警報の経路：',
  '- 試す期間・場面／見直す機会：',
  '- 中止する条件／安全な代替：',
  '',
  '## 試したあと（必要な観点だけ）',
  '- 予定した変更／実際にできた変更・できなかったこと：',
  '- 情報到達・手戻り／疲労・安全／参加機会／周囲の負担：',
  '- 変わらなかったこと・悪化・不明な点：',
  '- 別の説明として確かめること／本人と見直す次の対応：',
  '',
  '効果の実証や個別の安全判断を行う用紙ではありません。記入後は職場の情報管理手順で扱います。',
].join('\n');

export default function AxiomWorkAccessGuide({
  visual,
  frameTitles,
  relatedCases,
  compareEquipmentConditions = false,
}: {
  visual: { src: string; alt: string; caption: string };
  frameTitles: string[];
  relatedCases: Array<{ caseId: string; openingJa: string }>;
  compareEquipmentConditions?: boolean;
}) {
  return (
    <div className={styles.guide}>
      <section aria-labelledby="access-start-title">
        <h3 id="access-start-title">会議では異論がない。でも、あとで仕事が戻ってくる。</h3>
        <p>
          指示を聞き漏らす、騒音のある席では集中が続かない。「能力ややる気が足りない」と決める前に、情報の形式、確認できる機会、感覚環境を見直せます。発言がないことだけで、理解や同意を判断しません。
        </p>
        <p>
          「口頭と文字ではどう違う？」「静かな場面でも同じ？」と本人に聞き、使いやすい方法を一緒に選びます。個別の相談から始めても構いません。全職場の設備整備や診断名の開示は前提にしません。
        </p>
        <figure className={styles.flow} aria-labelledby="access-flow-caption">
          <figcaption id="access-flow-caption">伝えた情報を、戻って確かめられる情報に</figcaption>
          <ol>
            <li>
              <span>いま</span>
              <p>
                会議で口頭だけの指示
                <br />
                その場で返答を求められる
              </p>
            </li>
            <li>
              <span>変えてみる</span>
              <p>
                目的・担当・期限・完了基準を残す
                <br />
                文字で返す時間も設ける
              </p>
            </li>
            <li>
              <span>仕事に入る前に</span>
              <p>
                分からない点を確認
                <br />
                依頼側も認識の違いを直す
              </p>
            </li>
          </ol>
          <p className={styles.caption}>
            架空の会議の例です。実際の改善結果や効果を示す図ではありません。
          </p>
        </figure>
      </section>

      {compareEquipmentConditions && <ResearchKnowledgeApplication mode="work" initialExampleId="equipment-use" />}

      <section className={styles.chapter} aria-labelledby="access-options-title">
        <h3 id="access-options-title">いまの仕事で変えられる、三つのこと</h3>
        <div className={styles.options}>
          <article>
            <h4>読める・聞ける・戻れる方法を選ぶ</h4>
            <p>
              会議・業務の責任者が、要点の記録、口頭説明、図、字幕、後からの返答を組み合わせます。文字や図だけが万能ではありません。復唱やメモ取りを本人だけの仕事にせず、依頼側が曖昧な指示を直します。
            </p>
          </article>
          <article>
            <h4>集中できる場所と、届く連絡を両立する</h4>
            <p>
              現場責任者と施設・IT担当が、座席、照明、静かな作業場所、連絡時間を調整します。小さな職場でも、集中作業の時間帯や話しかける合図から検討できます。緊急連絡は、本人が受け取れる別経路を確保します。
            </p>
          </article>
          <article>
            <h4>作業ごとの安全を、本人と確かめる</h4>
            <p>
              耳栓やイヤホンは警報・連絡を遮る可能性があります。使用を先に決めず、安全衛生責任者が本人と現場の工程・設備を確認し、必要な専門判断につなぎます。複数の伝達経路も、実際に届くかを確認します。
            </p>
          </article>
        </div>
        <p className={styles.safety}>
          安全条件が確かめられない方法は導入を止め、安全な代替を検討します。「安全のため」と本人を職務全体から一律に除外せず、どの作業の何を変更できるかを本人と確認します。
        </p>
      </section>

      <section className={styles.chapter} id="access-real-work" aria-labelledby="access-work-title">
        <h3 id="access-work-title">機器は使えるのに、仕事では止まるとき</h3>
        <p>
          たとえば、読み上げで資料は読めるのに、社内システムの修正画面では必要な操作ボタンが読み上げられない。これなら、練習を増やすだけでは先へ進めません。機器を単独で試すのでなく、本人と業務担当・IT担当が、実際の仕事のどこで止まるかを確かめます。
        </p>
        <div className={styles.options}>
          <article>
            <h4>一つの仕事を、受け取りから引渡しまで</h4>
            <p>
              資料を受け取る → 入力する → 確認・修正する →
              次の人へ渡す。困る箇所と、補助を使いたい箇所を本人と分けます。画面や資料形式に障壁があるのか、使い方を覚える時間・教材が必要なのかで、次の対応は変わります。
            </p>
          </article>
          <article>
            <h4>導入する人と、使い続けられるようにする人</h4>
            <p>
              業務・ITの決定担当が、利用承認、費用、習得時間、システム更新時の確認を受け持ちます。無断のソフト導入や外部へのデータ送信、本人の自費購入を前提にしません。整備を待つ間も、承認できる形式や手順、人的補助を本人と選びます。
            </p>
          </article>
        </div>
        <p>
          本人が望み、協力する人にも無理のない補助は、機器と併用できます。「一人で全部できること」を合格条件にせず、本人が続けたい仕事・変えたい役割と、双方の負担を確かめます。
        </p>
        <p className={styles.caption}>
          上の場面は仕組みを考える架空例です。特定製品の性能や導入可否を示すものではありません。
        </p>
      </section>

      <section className={styles.chapter} aria-labelledby="access-review-title">
        <h3 id="access-review-title">変化がなければ、何を確かめ直す？</h3>
        <p>
          試す場面・担当・見直す機会と、共有してよい仕事条件を本人と合意します。まず変更を実施できたかを確認。実施しても手戻りが変わらなければ、情報形式だけでなく、指示の矛盾、仕事量、習熟の機会も見直します。
        </p>
        <p>
          手戻りが減っても、疲労や孤立、参加機会の減少、周囲への負担が増えたなら、そのまま続けません。本人の希望を聞き直し、方法や役割を変えます。
        </p>
        <a
          className={styles.download}
          download="nbl-work-access-memo.md"
          href={`data:text/markdown;charset=utf-8,${encodeURIComponent(WORK_ACCESS_BLANK_MEMO_MARKDOWN)}`}
        >
          <Download size={17} aria-hidden="true" /> 必要な行だけ使える白紙メモを保存
        </a>
        <p className={styles.caption}>
          任意のMarkdownメモです。この画面で個人情報を入力・保存・外部送信する機能はありません。
        </p>
      </section>

      <details className={styles.details}>
        <summary>この項目の仕事条件と、もとになった図を見る</summary>
        <p>{accessGuide.currentGuideDeltaJa}</p>
        <figure className={styles.reference}>
          <img src={visual.src} alt={visual.alt} loading="lazy" />
          <figcaption>{visual.caption}</figcaption>
        </figure>
        <ul>
          {frameTitles.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
        <p className={styles.caption}>
          既存の仕事設計フレームをもとにした条件付きの対応候補です。個別の適合性や効果の実証を意味しません。
        </p>
      </details>
      {relatedCases.length > 0 && (
        <nav className={styles.related} aria-label="情報・環境・安全に関係する相談事例">
          <h4>相談の一言から、対応を考える</h4>
          <ul>
            {relatedCases.map((item) => (
              <li key={item.caseId}>
                <Link href={`${base}/case-readings#${encodeURIComponent(item.caseId)}`}>
                  「{item.openingJa}」
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
