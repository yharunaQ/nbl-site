import { AxiomNextSiteLink as Link } from './AxiomNextSiteLinks';
import type { ReactNode } from 'react';
import { employmentWorkPlanExample } from './employmentWorkPlan';
import styles from './AxiomWorkSystemGuide.module.css';

export default function AxiomEmploymentWorkPlan({ download }: { download: ReactNode }) {
  return (
    <section
      className={styles.workPlan}
      id="employment-work-plan"
      aria-labelledby="work-plan-title"
    >
      <h3 id="work-plan-title">任せる仕事と支援を、一緒に組み立てる</h3>
      <p>
        「出荷前の確認に時間を取られる」という会社の課題と、「照合の役割を学びたい」という本人の希望。その接点から、業務に役立つ仕事の組合せを考えます。既にある求人の条件だけで、本人の可能性を決めないための具体例です。
      </p>
      <figure className={styles.workPlanExample}>
        <figcaption>
          <strong>会社の課題と本人の貢献から、照合の仕事をつくる</strong>
          <span>
            架空の計画案です。採用・復職・役割の見直しに使う考え方を示し、実施結果や適合性を示すものではありません。
          </span>
        </figcaption>
        {[
          { title: '1. 仕事の可能性をつくる', rows: employmentWorkPlanExample.slice(0, 3) },
          { title: '2. 実行する条件をそろえる', rows: employmentWorkPlanExample.slice(3, 5) },
          { title: '3. 試した結果から、選び直す', rows: employmentWorkPlanExample.slice(5) },
        ].map((group) => (
          <div key={group.title}>
            <h4>{group.title}</h4>
            <dl>{group.rows.map((row) => (
              <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>
            ))}</dl>
          </div>
        ))}
      </figure>
      <p>
        支援先が受け入れられない間も、社内でできる調整と必要な専門的確認を進めます。同じ場所・時間で働くことを統合の条件にせず、別の作業環境でも、仕事の受渡し・相談・学ぶ機会をつなぎます。
      </p>
      <p>
        仕事が分かると必要支援が具体化し、使える支援が分かると新しい仕事も選べます。本人の強みと会社の未充足の需要を往復し、職務案・採用と賃金の決定・支援の実開始をつなぎます。
        <Link href="/materials/research/NBL-RK-0029">仕事と支援を一緒につくる根拠と反証へ →</Link>
      </p>
      <h4>条件が違えば、先に変えることも違う</h4>
      <p>
        業務の需要はあっても採用枠が閉じていれば、権限者と時期・別案を検討します。教える勤務や必要支援がなければ、その担当と資源を整えます。需要や本人の希望が成立しなければ、この案を止めて別の仕事も比べます。全てを本人の追加訓練で解く方法にはしません。
      </p>
      <p>
        仕事の成果を確かめることと、尊厳や必要な支援を保障することは別です。
        <Link href="/materials/textbook/7">仕事の発見と交渉を、教科書で学ぶ →</Link>
      </p>
      <p>
        AIなどで照合の作業構成が変わるなら、本人が担う役割、誤りを確認する責任と有償時間、評価・対価も組み直します。道具を使えることだけで、仕事の機会が増えたとは判断しません。
        <Link href="/materials/research/NBL-RK-0139">AIによる作業の生成・代替と役割を考える →</Link>
      </p>
      <details>
        <summary>話合いの内容を残すとき：任意の白紙メモ</summary>
        <p>必要な行だけ、既存の業務表や面談メモに足しても構いません。</p>
        {download}
      </details>
      <nav className={styles.related} aria-label="仕事づくりで判断が分かれる相談">
        <h4>この案を、そのまま当てはめないために</h4>
        <ul>
          <li>
            <Link href="/preview/axiom-next-nbl-v2/case-readings#ojt-as-teaching-work-system">
              何度教えても身につかない：教え方と仕事の条件を確かめる
            </Link>
          </li>
          <li>
            <Link href="/preview/axiom-next-nbl-v2/case-readings#role-evaluation-growth">
              任せる仕事を増やす？ 今の安定を保つ？ 本人と役割を選ぶ
            </Link>
          </li>
          <li>
            <Link href="/preview/axiom-next-nbl-v2/case-readings#support-response-with-person-control">
              外部支援につながらない：受入と、待つ間の対応を考える
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
