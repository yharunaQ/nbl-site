import { enterpriseOrganizationCondition, enterpriseOrganizationConditions, enterpriseFinance, enterpriseFinanceScenarios,
  type EnterpriseOrganizationConditionId, type EnterpriseFinanceScenarioId } from './enterpriseOrganizationChoices';
import styles from './ResearchKnowledgeApplication.module.css';

export default function EnterpriseOrganizationComparison({ conditionId, onCondition, financeId, onFinance, separateSupplyContext = false }: {
  conditionId: EnterpriseOrganizationConditionId; onCondition: (id: EnterpriseOrganizationConditionId) => void;
  financeId: EnterpriseFinanceScenarioId; onFinance: (id: EnterpriseFinanceScenarioId) => void;
  separateSupplyContext?: boolean;
}) {
  const c = enterpriseOrganizationCondition(conditionId), f = enterpriseFinance(financeId);
  const amount = (n: number) => n.toLocaleString('ja-JP', { maximumFractionDigits: 1 });
  return <div className={styles.rolePlan} data-nbl-enterprise-comparison>
    <h4>法人を作る前に、経営機能と有償支援を組み合わせる</h4>
    <p>既存求人・企業部門・独立事業を、本人が選ぶ仕事、買い手に届く価値、雇用と支援の機能から比べます。安い組織名だけで役割や他の機会を狭めません。</p>
    {separateSupplyContext && <p className={styles.note}>上段は年間供給の案です。以下の組織条件は、時間計算や上段の状態とは独立に比較します。</p>}
    <label className={styles.choice}>今回比較する仕事・組織の仮条件
      <select value={conditionId} onChange={event => onCondition(event.target.value as EnterpriseOrganizationConditionId)}>
        {enterpriseOrganizationConditions.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select>
    </label>
    {separateSupplyContext && <dl aria-live="polite">
      <dt>組織条件での第一候補</dt><dd>{c.first}</dd>
      <dt>組織条件が違う時の対応</dt><dd>{c.alternative}</dd>
      <dt>組織の判断を変える確認</dt><dd>{c.question}</dd>
      <dt>組織条件で選ぶ人・決める人・実施する人</dt><dd>{c.owner}</dd>
      <dt>組織条件の見直し</dt><dd>{c.review}</dd>
    </dl>}
    <details className={styles.enterpriseFinance}>
      <summary>別の架空企業で、費用と導入資金を比べる</summary>
      <p>上の希望・組織条件とは別の4人チームの創作計算です。地域の40/80人・2,080時間や地域予算へ足しません。費用や黒字から本人の希望・能力、支援量又は実行可能性を認定しません。</p>
      <label className={styles.choice}>別の架空企業の計算仮定
        <select value={financeId} onChange={event => onFinance(event.target.value as EnterpriseFinanceScenarioId)}>
          {enterpriseFinanceScenarios.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label>
      {f ? <div aria-live="polite">
        <p>4人各年960時間・時給1,500円、付随人件費20％、材料{amount(f.materials)}万円、管理/営業280万円、場所100万円。材料は販売数量に比例し、数量20％減なら180万円から144万円へ変わります。賃金・勤務時間と必要支援は維持する仮定です。別担当の追加支援1,440時間×4,000円。独立管理200時間×6,000円を追加します。全て仮定で、賃金・時間の推奨や適格給付額ではありません。</p>
        <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="架空企業の費用と資金の比較表">
          <table className={styles.roleTable}>
            <caption>同じ仕事・支援を置いた組織案の比較（万円）</caption>
            <thead><tr><th scope="col">対象期間・項目</th>{f.plans.map(p => <th scope="col" key={p.id}>{p.title}</th>)}</tr></thead>
            <tbody>
              {([
                ['稼働12か月の売上', 'sales'], ['稼働12か月の通常費', 'ordinary'],
                ['稼働12か月の追加支援費', 'support'], ['追加支援財源の仮定', 'funding'],
                ['継続運営の損益', 'operatingPL'], ['導入前に支払う初期費', 'initial'],
                ['導入前＋稼働12か月の損益', 'combinedPL'], ['同期間の入金差引', 'cashDifference'],
              ] as const).map(([label, key]) => <tr key={key}><th scope="row">{label}</th>{f.plans.map(p => <td key={p.id}>{amount(p[key])}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
        <p>導入前90日の共同設計等120時間×5,000円＝60万円、独立案だけ設立・設備等80万円を追加し、稼働前に支払います。本人の無償試行やNBLの販売価格ではなく、実案では共有費・内数・重複と純増を照合します。</p>
        <p>顧客は納品翌月払い、月ごとの均等売上、開始時売掛金ゼロ、支援財源は各四半期末までに4分の1ずつ入金、費用は現金支出と仮定します。税・借入・減価償却は扱いません。稼働12か月の顧客入金{amount(f.plans[0].receipts)}万円、末の売掛金{amount(f.plans[0].receivable)}万円です。</p>
        <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="導入前と四半期末の累計入金差引">
          <table className={styles.roleTable}>
            <caption>初期費を稼働前に支払った累計差引（万円）</caption>
            <thead><tr><th scope="col">組織案</th>{['導入前', '稼働Q1末', 'Q2末', 'Q3末', 'Q4末'].map(q => <th scope="col" key={q}>{q}</th>)}</tr></thead>
            <tbody>{f.plans.map(p => <tr key={p.id}><th scope="row">{p.title}</th>{p.cumulative.map((v, i) => <td key={i}>{amount(v)}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>仮に400万円が初期支払より前に利用できれば、Q4末は部門{amount(f.plans[0].endingCashWith400)}万円、独立{amount(f.plans[1].endingCashWith400)}万円です。400万円は確保済みではありません。四半期末の残高では期中の最低残高と支払能力は確定せず、月日別に確認します。</p>
        <p>計算仮定で変わる第一手：{f.first}</p>
      </div> : <p aria-live="polite">需要・原価・適格財源や入金は未確認です。計算値をゼロや確保済みへ補いません。今回の判断を変える買い手・実費・支払日を各担当が確かめます。</p>}
      <p className={styles.note}>導入前90日＋稼働12か月は設計集計で、会計年度の損益ではありません。組織条件と数値は別々の仮定です。実際の財源・原価・本人の選択と有償供給は別に確認します。</p>
    </details>
  </div>;
}
