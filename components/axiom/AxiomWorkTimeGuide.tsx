import { AxiomNextSiteLink as Link } from './AxiomNextSiteLinks';
import { useEffect, useState } from 'react';
import { ArrowRight, Download, Printer } from 'lucide-react';
import { NBL_WORK_DESIGN_GUIDE_V2_OPERATIONAL_MODULES } from '@/lib/fchma/core/nblWorkDesignGuideV2';
import styles from './AxiomWorkTimeGuide.module.css';
import ResearchKnowledgeApplication from './ResearchKnowledgeApplication';

const timeGuide = NBL_WORK_DESIGN_GUIDE_V2_OPERATIONAL_MODULES['WDG2-04'];
const base = '/preview/axiom-next-nbl-v2';

// Editorial examples, not observed cases or prescribed arrangements.
const arrangements = [
  {
    id: 'task-volume',
    title: '仕事量と締切も変えられる',
    artifact: '必須・延期・分担を分けた業務表',
    example:
      '受注確認を優先し、日次集計は翌日へ。量と期限はリーダーが変更し、本人に残務を持ち帰らせない。',
  },
  {
    id: 'schedule',
    title: '勤務を変える手続きが分かる',
    artifact: '使える勤務形態と当日の連絡先',
    example:
      '始業変更は当番リーダーへ連絡。不在なら副担当へ。始業前に返答できない場合は、事前に合意した連絡・待機手順を使う。',
  },
  {
    id: 'break-recovery',
    title: '休憩を取れる仕事の組み方にする',
    artifact: '必要時の中断方法・交代が必要な仕事・仕事量の扱い',
    example:
      '電話応対は必要時に交代できる担当と受入余力を確保。保存できる作業は状態を残して再開する。休憩分を残り時間へ詰めない。',
  },
  {
    id: 'commute-treatment-life',
    title: '勤務の前後にも余白を残す',
    artifact: '通勤・通院等と両立できる勤務の選択肢',
    example:
      '本人が希望する場合、出社時刻や勤務日を調整。私生活の詳細ではなく、仕事上必要な条件だけを合意した相手へ伝える。',
  },
  {
    id: 'handover-return',
    title: '休んだ後も、仕事に戻れるようにする',
    artifact: '進捗・決定事項の記録と代替・保留・再開の手順',
    example:
      '注文の進捗は共通の台帳へ。欠勤時は副担当が確認し、リーダーが分担・延期を決める。短い離席後も変更事項を確認でき、残務を一括で戻さない。',
  },
  {
    id: 'pay-role-growth',
    title: '収入や機会への影響を曖昧にしない',
    artifact: '賃金・評価・役割・学習機会の確認先',
    example:
      '変更前に人事が収入への影響を説明。担当や研修参加は勤務時間だけで一律に外さず、本人の希望と実行条件を別に検討する。',
  },
] as const;

export const WORK_TIME_BLANK_SHEET_MARKDOWN = [
  '# 勤務変更の段取りシート',
  'NBL 仕事設計ガイド2.0 / 2026年11月25日版',
  '',
  '個人の診断や適性を判定する用紙ではありません。特定の人の情報ではなく、職場の選択肢と運用を記入します。',
  '',
  '- 対象の仕事・職場：',
  '- 整備を決める担当：',
  '- 当日の連絡先／不在時の代行：',
  '- 返答の目安／返答できない場合の手順：',
  '- 次の点検日：',
  '',
  '| 整えること | 使える選択肢・変更時の段取り | 担当／未整備なら次にすること |',
  '| --- | --- | --- |',
  ...arrangements.map((item) => `| ${item.title} |  |  |`),
  '',
  '## 個別利用の前に確認',
  '- 本人が選ぶ条件と、保留・中止の選択を確認する。',
  '- 共有する仕事条件、共有先、共有しない情報を確認する。',
  '- 時間・量・休憩など必要な変更は組み合わせ、実施担当と資源を確保する。',
  '- 停止時の安全な代替、見直す日、実施できたかと結果の確認方法を合意する。',
  '- 健康・生活、仕事の質、収入・機会、周囲の負担を別々に確認する。',
  '',
  '記入した用紙は組織の情報管理手順で扱ってください。NBLへの提出用ではありません。',
].join('\n');

function WorkTimePlanningSheet() {
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    const clearPrintMode = () => delete document.documentElement.dataset.nblPrintMode;
    window.addEventListener('afterprint', clearPrintMode);
    return () => {
      clearPrintMode();
      window.removeEventListener('afterprint', clearPrintMode);
    };
  }, []);

  const printBlankSheet = () => {
    document.documentElement.dataset.nblPrintMode = 'work-time-sheet';
    try {
      window.print();
    } finally {
      // Also clear on browsers that return without opening a print dialog.
      delete document.documentElement.dataset.nblPrintMode;
    }
  };

  return (
    <section
      className={styles.sheetSection}
      aria-labelledby="work-time-sheet-title"
      id="work-time-sheet"
    >
      <div className={styles.screenOnly}>
        <p className={styles.eyebrow}>職場の会議で使う</p>
        <h4 id="work-time-sheet-title">勤務変更の段取りシート</h4>
        <p>
          ここまでに挙げた勤務・仕事の条件を、自分たちの職場ではどう変えられるか整理します。まだ用意できないことも、担当と次にすることを残せます。
        </p>
        <div className={styles.sheetActions}>
          <button
            type="button"
            aria-pressed={showExample}
            onClick={() => setShowExample(!showExample)}
          >
            {showExample ? '白紙に戻す' : '架空の職場の記入例を見る'}
          </button>
          <button type="button" onClick={printBlankSheet}>
            <Printer size={16} /> 白紙のシートを印刷
          </button>
          <a
            download="nbl-work-time-planning-sheet.md"
            href={`data:text/markdown;charset=utf-8,${encodeURIComponent(WORK_TIME_BLANK_SHEET_MARKDOWN)}`}
          >
            <Download size={16} /> 白紙をMarkdownで保存
          </a>
        </div>
        <p className={styles.sheetFootnote}>
          印刷画面が開かない場合は、Markdown版を保存して編集・印刷できます。
        </p>
      </div>
      <div className={styles.sheet} data-nbl-work-plan="time">
        <div className={styles.printOnly}>
          <h2>勤務変更の段取りシート</h2>
          <p>NBL 仕事設計ガイド2.0 — 2026年11月25日版 / 職場の選択肢と運用を整える用紙</p>
        </div>
        <p className={styles.sheetNotice}>
          個人の障害名・障害種類や詳しい健康情報は記入せず、仕事の選択肢・担当・手順を整理します。
        </p>
        <dl className={styles.sheetMeta}>
          {[
            '対象の仕事・職場',
            '整備を決める担当',
            '当日の連絡先／不在時の代行',
            '返答の目安／返答できない場合の手順',
            '次の点検日',
          ].map((label) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                <span aria-hidden="true">　　　　　　　　　</span>
              </dd>
            </div>
          ))}
        </dl>
        {showExample && (
          <p className={styles.exampleLabel}>
            架空の受注事務の例です。このまま適用する推奨案ではありません。担当・人員・勤務制度に合わせて検討します。
          </p>
        )}
        <div
          className={styles.sheetTableScroll}
          tabIndex={0}
          role="region"
          aria-label="勤務変更の段取りシートの表。狭い画面では横にスクロールできます"
        >
          <table>
            <caption className={styles.visuallyHidden}>職場の勤務変更を準備する記入欄</caption>
            <thead>
              <tr>
                <th scope="col">整えること</th>
                <th scope="col">使える選択肢・変更時の段取り</th>
                <th scope="col">担当／未整備なら次にすること</th>
              </tr>
            </thead>
            <tbody>
              {arrangements.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.title}</th>
                  <td>
                    {showExample ? (
                      <span className={styles.exampleText}>{item.example}</span>
                    ) : (
                      <span className={styles.blankLabel}>記入欄</span>
                    )}
                    <span className={styles.printOnly}>　</span>
                  </td>
                  <td>
                    <span className={styles.blankLabel}>記入欄</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.sheetFootnote}>
          個別に使うときは、本人の希望・情報の共有先・実施担当・停止時の安全な代替・見直す日を別途合意します。時間と仕事量など、必要な変更は組み合わせます。
        </p>
        <p className={styles.sheetFootnote}>
          記入後は組織の情報管理手順で保管。NBLへの提出用ではありません。健康・生活、仕事の質、収入・機会、周囲の負担を分けて確認します。
        </p>
      </div>
    </section>
  );
}

export default function AxiomWorkTimeGuide({
  visual,
  frameTitles,
  relatedCases,
}: {
  visual: { src: string; alt: string; caption: string };
  frameTitles: string[];
  relatedCases: Array<{ caseId: string; openingJa: string }>;
}) {
  const [implementation, setImplementation] = useState<string | null>(null);
  const implementationCheck = timeGuide.implementationChecksJa.find(
    (item) => item.id === implementation,
  );

  return (
    <div className={styles.guide}>
      <p className={styles.readingIntro}>
        早く帰れても、仕事が残る。休憩はあっても、必要な時に抜けられない。時間の長さ・中断のタイミング・戻った後の仕事は、別の問題です。困っている場面から、変える条件を選べます。
      </p>
      <nav className={styles.contents} aria-label="体調変動への備えの読み方">
        <a href="#time-prepare">仕事を変える具体策</a>
        <a href="#time-adapt">個別の相談に応じる</a>
        <a href="#time-review">うまくいったか確かめる</a>
      </nav>

      <section className={styles.chapter} id="time-prepare" aria-labelledby="time-prepare-title">
        <p className={styles.eyebrow}>時間と仕事量の、ずれをなくす</p>
        <h3 id="time-prepare-title">時間の変更を、仕事の段取りとセットにする</h3>
        <p>
          「勤務時間を短くしてよい」だけでは、同じ仕事を短い時間へ詰め込むことにもなります。何を延期・分担し、誰が判断するかまで用意して、使える選択肢にします。
        </p>
        <div className={styles.scene} aria-label="架空の職場で考える、短時間勤務の段取り">
          <p className={styles.eyebrow}>例えば、受注事務の職場なら</p>
          <div>
            <article>
              <span>この職場で起きていること</span>
              <div
                className={styles.taskSketch}
                aria-label="担当の仕事はそのまま、勤務時間だけが短くなる"
              >
                <b>受注確認</b>
                <b>電話</b>
                <b>集計</b>
                <b>引継ぎ</b>
                <small>短くなった勤務時間へ、全部が集中</small>
              </div>
              <p>早く退勤できる。でも締切も担当件数も同じ。休憩を削り、残務は本人が抱える。</p>
            </article>
            <ArrowRight aria-hidden="true" />
            <article>
              <span>そこから検討する変更</span>
              <div
                className={`${styles.taskSketch} ${styles.taskSketchPlanned}`}
                aria-label="優先する仕事、分担する仕事、延期できる仕事を分け、休憩と引継ぎの時間も確保する"
              >
                <b>優先する</b>
                <b>分担する</b>
                <b>延期する</b>
                <b>休憩・引継ぎ</b>
                <small>仕事の量・担当・締切も動かす</small>
              </div>
              <p>
                優先する仕事を決め、残りはリーダーが分担・延期。交代担当にも余力を確保し、休憩と引継ぎを勤務の中に置く。
              </p>
            </article>
          </div>
          <small>
            仕事の詰まり方と、変更の候補を示す架空例です。右側は実施後の成功例ではありません。
          </small>
        </div>
        <p>
          この見立てを確かめるには、勤務変更の前後で、担当件数・締切・休憩が実際にどう変わったかを見ます。仕事量も調整済みなのに困難が続くなら、時間帯や通勤、仕事の進め方など別の可能性も確かめます。
        </p>
        <h4>勤務を変えるとき、一緒に決めること</h4>
        <p>
          現場責任者が仕事量と担当を、人事等が勤務制度や収入への影響を確認します。小さな職場なら、決められる人とその代行を明確に。いま必要な変更から始め、次にも使える段取りを残します。
        </p>
        <ol className={styles.preparations}>
          {arrangements.map((item, index) => {
            const condition = timeGuide.conditionRowsJa.find((row) => row.id === item.id)!;
            return (
              <li key={item.id}>
                <span className={styles.number}>{index + 1}</span>
                <div>
                  <h5>{item.title}</h5>
                  <p>{condition.ordinaryOptionJa}</p>
                  <small>用意するもの：{item.artifact}</small>
                </div>
              </li>
            );
          })}
        </ol>
        <section
          className={styles.interruption}
          id="time-interruption"
          aria-labelledby="time-interruption-title"
          tabIndex={-1}
        >
          <h4 id="time-interruption-title">途中で抜けても、仕事をつなげる段取り</h4>
          <p>
            急な離席や担当の不在のたびに、その場で一から調整しなくて済むように。まず、よく引き継ぐ仕事一つから、次の段取りを用意します。
          </p>
          <ul className={styles.commonHandover}>
            <li>
              <strong>途中の仕事が分かる置き場。</strong>
              どこまで済み、何が残り、いつまでに必要かを、同じ場所へ残せるようにします。障害名・障害種類や詳しい事情を広く共有するための記録ではありません。
            </li>
            <li>
              <strong>止める仕事と、引き継ぐ仕事の区別。</strong>
              保存して再開できる仕事は、無理に交代させません。対応を続ける必要がある仕事は、必要な時に代われる担当と、代行が難しい時に判断する人を決めます。
            </li>
            <li>
              <strong>戻った時の再開方法。</strong>
              不在中の変更点を確認し、残りの仕事と締切を調整します。抜けた分を、本人や同僚の残業で埋める前提にはしません。
            </li>
          </ul>
          <p>
            安全に止められない仕事は、責任者と交代・代行の条件を確認します。いま必要な対応を進めながら、次にも使える段取りを残せます。
          </p>
          <Link href={`${base}/case-readings#health-time-and-morning-variation`}>
            交代が間に合わない・本人の役割を残したい時は、相談事例で考える <ArrowRight size={16} />
          </Link>
        </section>
        <details className={styles.details}>
          <summary>職場の会議で使う：勤務変更の段取りシート</summary>
          <WorkTimePlanningSheet />
        </details>
        <details className={styles.details}>
          <summary>仕事条件の全体を図で確かめる</summary>
          <figure>
            <img src={visual.src} alt={visual.alt} />
            <figcaption>{visual.caption}</figcaption>
          </figure>
          <ul>
            {frameTitles.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
          <p>
            勤務を続けられていても、帰宅後の回復や家族の支えだけで成り立っていないか。職場の外へ移った負担も、本人が話せる範囲で確かめます。
          </p>
        </details>
      </section>

      <ResearchKnowledgeApplication mode="work" />

      <section className={styles.chapter} id="time-adapt" aria-labelledby="time-adapt-title">
        <p className={styles.eyebrow}>この人には、どの変更が必要か</p>
        <h3 id="time-adapt-title">共通の段取りを、その人に合わせて使う</h3>
        <p>
          体調に波があるからといって、短時間勤務が答えとは限りません。仕事が重なる時間を変えるのか、必要な時に中断できるようにするのか、指示や確認の仕方を直すのか。本人が守りたい仕事・生活・収入と、実際に困る場面を先に確かめます。
        </p>
        <p>
          仕事上の困りごとから話せます。障害名・障害種類を広く共有したり、職場の全制度を整え終えたりすることを、この相談の前提にはしません。用意したメニューが合わなければ、別の方法も一緒に検討します。
        </p>

        <Link
          className={styles.caseLink}
          href={`${base}/case-readings#health-time-and-morning-variation`}
        >
          <span>同じ「体調の波」でも、対応が分かれる相談事例</span>
          <strong>時間帯を変える？ 途中で抜けて戻る方法を変える？</strong>
          <span>
            次の判断を変える問いと、答え別の対応を読む <ArrowRight size={16} />
          </span>
        </Link>
        <details className={styles.details}>
          <summary>個別の変更を始めるときの確認メモ</summary>
          <h4>{timeGuide.reversibleTrialJa.titleJa}</h4>
          <p>
            <strong>休憩を増やすなら、仕事量への影響と、交代が必要かも確認する。</strong>{' '}
            必要な変更を「一つだけ」に制限しません。何を組み合わせたかを残し、結果を一つの条件だけの効果と断定しないようにします。
          </p>
          <dl className={styles.agreements}>
            {timeGuide.reversibleTrialJa.fieldsJa.map((field) => (
              <div key={field.labelJa}>
                <dt>{field.labelJa}</dt>
                <dd>{field.promptJa}</dd>
              </div>
            ))}
          </dl>
          <aside className={styles.safety}>
            <strong>始めない・中断する選択も残す</strong>
            <p>
              本人は利用や情報共有を保留でき、始めた後も中止を求められます。健康・安全の悪化や、未合意の負担移転があれば、問題のある作業・変更を止めて安全な代替を確認します。元の勤務に戻すことが安全とは限りません。
            </p>
            <p>{timeGuide.reversibleTrialJa.boundaryJa}</p>
          </aside>
        </details>
        <details className={styles.details}>
          <summary>変動した日・再開するときの調整候補</summary>
          <p>
            次の候補を、本人の希望、現場の資源、必要な判断権限に照らして選びます。増やす・元へ戻すことをゴールにせず、維持や別案も残します。
          </p>
          <div className={styles.adjustments}>
            {timeGuide.conditionRowsJa.map((row) => (
              <article key={row.id}>
                <h5>{row.labelJa}</h5>
                <p>
                  <strong>変動した日：</strong>
                  {row.fluctuationSwitchJa}
                </p>
                <p>
                  <strong>再開・見直し：</strong>
                  {row.returnPathJa}
                </p>
              </article>
            ))}
          </div>
        </details>
        <details className={styles.details}>
          <summary>家族の負担・同僚の応援など、ほかの相談から考える</summary>
          <ul>
            {relatedCases.map((item) => (
              <li key={item.caseId}>
                <Link href={`${base}/case-readings#${item.caseId}`}>「{item.openingJa}」</Link>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className={styles.chapter} id="time-review" aria-labelledby="time-review-title">
        <p className={styles.eyebrow}>実施したあと</p>
        <h3 id="time-review-title">「続けられた」の中身を確かめる</h3>
        <p>
          予定した変更と、実際に行われた変更を分けます。時間は減っても仕事量が同じだったなら、まず直すのは職場の実施手順です。本人に合わない方法だった、と結論づけるのは早すぎます。
        </p>
        <div className={styles.implementationCheck}>
          <h4>まず、予定した変更を実施できたか</h4>
          <p>ボタンで、状況ごとの確認の進め方を読めます。個別の状況は送信・保存しません。</p>
          <div role="group" aria-label="実施状況別の確認の進め方">
            {timeGuide.implementationChecksJa.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={implementation === item.id}
                onClick={() => setImplementation(item.id)}
              >
                {item.labelJa}
              </button>
            ))}
          </div>
          <p role="status" className={styles.implementationAnswer}>
            {implementationCheck?.nextJa ??
              '未実施・一部実施・確認できた場合では、同じ「改善なし」でも次にすることが違います。'}
          </p>
        </div>
        <h4>実施内容を確かめたら、変化を分けて見る</h4>
        <p>
          本人が共有できる範囲で、当日だけでなく翌日の回復や生活、仕事の質、収入・役割・成長機会、家族・同僚・管理者の負担を確認します。どれか一つの改善で、ほかの悪化を打ち消しません。
        </p>
        <div className={styles.outcomes}>
          {timeGuide.outcomeRoutesJa.map((route) => (
            <article key={route.resultJa}>
              <h5>{route.resultJa}</h5>
              <p>{route.meaningJa}</p>
              <p>
                <strong>次に：</strong>
                {route.nextJa}
              </p>
            </article>
          ))}
        </div>
        <p className={styles.takeaway}>
          たとえば「短時間勤務は使えたが、引継ぎ先がいなかった」。まずは代替・分担が実施できる段取りを見直します。それでも困難が続く場合は、最初の見立てに戻って別の条件も確かめます。個人情報を広げず、担当や手順へ改善を戻します。
        </p>
      </section>
      <p className={styles.boundary}>
        このページは職場の準備と条件付きの検討を助ける開発候補です。診断、個人の適性、医療・法律・人事の最終判断や効果を保証するものではありません。実際の個人情報は、この画面へ入力しません。
      </p>
    </div>
  );
}
