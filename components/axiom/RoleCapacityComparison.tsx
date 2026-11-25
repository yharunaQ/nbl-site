import { roleCapacityConditions, roleCapacityRoleNames, roleCapacityScenario, roleCapacityAssumptions, roleCapacityAuthority, roleCapacityRevision, roleCapacityLimits, type RoleCapacityConditionId } from './roleCapacityChoices';
import styles from './ResearchKnowledgeApplication.module.css';
export default function RoleCapacityComparison({ conditionId, onCondition }: { conditionId: RoleCapacityConditionId; onCondition: (id: RoleCapacityConditionId) => void }) {
  const s = roleCapacityScenario(conditionId);
  return <div className={styles.rolePlan} data-nbl-role-capacity>
    <h4>年全体の余力と、担当別の供給を比べる</h4>
    <p>{roleCapacityAssumptions}</p>
    <p className={styles.note}>{roleCapacityLimits}</p>
    <label className={styles.choice}>比較する担当と配置開始の仮条件
      <select value={conditionId} onChange={e => onCondition(e.target.value as RoleCapacityConditionId)}>{roleCapacityConditions.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
    </label>
    <div aria-live="polite">
      <dl><dt>担当別条件での第一候補</dt><dd>{s.first}</dd></dl>
      <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="担当別の必要時間と容量">
        <table className={styles.roleTable}><caption>仮の年必要時間・担当容量・差引（時間）</caption>
          <thead><tr><th scope="col">仮の担当</th><th scope="col">必要</th><th scope="col">容量</th><th scope="col">差引</th></tr></thead>
          <tbody>{roleCapacityRoleNames.map((n, i) => <tr key={n}><th scope="row">{n}</th><td>{s.needed[i]}</td><td>{s.capacity[i]}</td><td>{s.reserve[i]}</td></tr>)}</tbody>
        </table>
      </div>
      <p>年全体の差引{s.aggregateReserve}時間／個別担当の不足{s.roleShortfall}時間。</p>
      <p>追加原価{s.addedCost}万円／元の年収入4,642.5万円を固定した差額{s.annualMargin}万円。</p>
      <dl><dt>判断を変える確認</dt><dd>{s.check}</dd></dl>
    </div>
    <p>{roleCapacityAuthority}</p><p>{roleCapacityRevision}</p>
  </div>;
}
