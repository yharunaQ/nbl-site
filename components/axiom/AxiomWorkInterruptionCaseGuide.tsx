import { AxiomNextSiteLink as Link } from './AxiomNextSiteLinks';
import { ArrowRight } from 'lucide-react';
import styles from './AxiomWorkInterruptionCaseGuide.module.css';

const base = '/preview/axiom-next-nbl-v2';

/** Task-specific reading options for CC2-MIG-01; not additional observed case facts. */
export default function AxiomWorkInterruptionCaseGuide() {
  return (
    <section
      className={styles.example}
      id="case-interruption"
      aria-labelledby="case-interruption-title"
    >
      <h3 id="case-interruption-title" tabIndex={-1}>
        休憩の時刻を、前もって決められないとき
      </h3>
      <Link href={`${base}/case-readings#health-time-and-morning-variation`}>
        相談全体の背景と問いを読む ↑
      </Link>
      <p>
        トイレや体調への対応は、予定した休憩まで待てないことがあります。「いつ休むか」だけでなく、
        <strong>必要になったその時、仕事をどう止め、どう戻れるか</strong>を確かめます。
      </p>
      <p>交代が必要とは限りません。近い仕事の場面を開いて考えられます。</p>
      <details className={styles.details}>
        <summary>自分で保存して、後から再開できる仕事</summary>
        <p>
          まず整えるのは、止めてよい範囲と、途中の状態・変更点を残す方法です。交代要員を増やす前に、本人が選ぶ合図などで、事情の説明を繰り返さずに中断できるか確認します。
        </p>
        <p>戻った後に、同じ締切へ残りの仕事を詰め込まないことも大切です。</p>
      </details>
      <details className={styles.details}>
        <summary>対面対応や工程を、誰かに渡す必要がある仕事</summary>
        <p>
          代わる人の名前だけでは足りません。例えば、窓口の担当者は必要な時に離席したい。でも交代候補も、締切のある処理を担当している。本人を窓口から外せば済むとも限りません。
        </p>
        <p>この場面で検討する案です。順番に全部行う手順でも、効果を確認した事例でもありません。</p>
        <dl className={styles.handoverOptions} aria-label="交代の余力がない時に比べる案">
          <div>
            <dt>交代者の仕事を動かす</dt>
            <dd>
              集計などを後へ回せるなら、業務配分の責任者が期限も変更します。時間を空けるだけでなく、必要になった時に交代へ入れるか確認します。
              <strong>同じ時刻に欠かせない仕事なら、この案だけでは余力は生まれません。</strong>
              交代側にも必要な配慮があることを忘れずに確認します。
            </dd>
          </div>
          <div>
            <dt>業務の受け方を変える</dt>
            <dd>
              予約枠・受付量・別窓口への引継ぎを変えられるなら、運営責任者が対応体制を組み直します。
              <strong>すぐに応対が必要な業務では、受付を減らすだけで代替にはなりません。</strong>
              必要時に応対を引き受ける体制と、その決裁が必要です。
            </dd>
          </div>
          <div>
            <dt>担当を組み替える</dt>
            <dd>
              <p>
                本人が相談の仕事を続けたいなら、「窓口業務」を丸ごと外す前に、どの場面で中断が難しくなるかを、本人と配置責任者で分けます。
              </p>
              <p className={styles.keyDistinction}>
                <strong>
                  一次受付を交代できても、相談中に必要な中断ができなければ、この案だけでは足りません。
                </strong>
                予約制にするだけでも、中断できるようになるとは限りません。
              </p>
              <p>
                <strong>
                  離席しやすくなっても、望む役割・収入・評価を失えば解決とは限りません。
                </strong>
                担当を変えずに続ける案だけでなく、本人が相談業務を減らす・別の仕事を選ぶ案も残します。専門性を発揮し続けることを義務にはしません。
              </p>
              <details className={styles.taskDetails}>
                <summary>仕事を分けて確かめる：受付・相談・記録</summary>
                <div
                  className={styles.taskConditions}
                  aria-label="窓口の仕事の中身と、中断するときの確認"
                >
                  <div>
                    <strong>来訪時の受付</strong>
                    <p>
                      用件を受け取るところまで交代できるか。交代者が判断せず保留することと、すぐ判断できる人へつなぐことを分けます。
                    </p>
                  </div>
                  <div>
                    <strong>相談を聞き、判断する</strong>
                    <p>
                      本人が続けたいのは、この部分か。途中で中断・再開できるか、同じ担当者が続ける必要があるか。引き継ぐなら、相手の技能・判断できる範囲・その時の余力も確かめます。
                    </p>
                  </div>
                  <div>
                    <strong>記録をまとめ、照合する</strong>
                    <p>
                      途中の位置を残して再開できるか。本人が記録を担当するなら、相談後の作業時間も確保し、同じ締切へ残務を押し込まないようにします。
                    </p>
                  </div>
                </div>
                <p>
                  相談相手への説明、同じ話を繰り返す負担、相談内容を誰まで共有できるかも、働く本人の健康情報とは別に扱います。
                </p>
                <p>
                  実施後は、残すと決めた仕事に実際に参加できたか、必要な時に中断して戻れたか、本人・交代者・相談相手に別の負担が増えなかったかを確かめ、成立しなければ組み方を見直します。
                </p>
              </details>
            </dd>
          </div>
        </dl>
        <p>
          どの案も成立しないなら、「本人が待つ」「同僚が無理をする」の二択に戻しません。人員・工程・提供体制を決める責任者に、変えられない条件と不足する資源を具体的に伝えます。支援機関の助言だけで人員や予算が増えるわけではなく、必要な専門的確認と実施の決裁は別です。
        </p>
        <p>
          引継ぎに必要なのは、まず未処理の仕事・期限・戻す先です。障害名・障害種類や詳しい事情を同僚全員へ伝える前提にはしません。健康・安全上必要な情報は、本人と共有先・範囲を別に確認します。
        </p>
        <Link href={`${base}/case-readings#coworker-burden-redesign`}>
          応援する側からの相談：「穴埋めが、いつも自分に回ってくる」 <ArrowRight size={16} />
        </Link>
        <div className={styles.foundationLink}>
          <p>
            職場で共通して用意するのは、誰かを外すためのリストではなく、仕事の中身・守る条件・変更を決める人が分かる段取りです。個別の相談では、それを使いながら必要な変更を選びます。
          </p>
          <Link href={`${base}/work-design-views-guide?system=WDG2-03#WDG2-03-common-foundation`}>
            ガイドへ：仕事の中身と、変えられる条件を整理する <ArrowRight size={16} />
          </Link>
        </div>
      </details>
      <details className={styles.details}>
        <summary>会議には戻れるが、話や決定に追いつけない</summary>
        <p>
          参加を外せば離席の説明は減っても、本人が関わりたい判断まで失うかもしれません。決定事項を短く残す、重要な確認を戻った時に行うなど、本人の意見と仕事へ戻る方法を相談します。
        </p>
        <p>
          会議を続けるか一時中断するかも、本人の希望と会議の目的によって変わります。録画や詳しい健康情報の共有を当然の条件にはしません。
        </p>
      </details>
      <p className={styles.interruptionBoundary}>
        安全な中断・交代を確保できない場合は、通常の小試行として始めません。切迫した必要への対応を、体制が完成するまで待たせないでください。
      </p>
      <p>
        中断して戻れるようになっても回復が足りないなら、仕事の総量・勤務・通勤など別の条件へ戻ります。時短や休養が必要な場合まで、中断の工夫で置き換えるものではありません。
      </p>
    </section>
  );
}
