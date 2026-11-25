import { roleOptions, roleIssues, roleTrialCosts, type RoleOptionId, type RoleIssueId } from './personValuedRoleChoices';
import styles from './ResearchKnowledgeApplication.module.css';

export default function PersonValuedRoleComparison({ roleId, issueId, separateSupplyContext = false, existingMentorTimeAvailable, onRole, onIssue, onExisting }: {
  roleId: RoleOptionId; issueId: RoleIssueId; existingMentorTimeAvailable: boolean;
  separateSupplyContext?: boolean;
  onRole: (value: RoleOptionId) => void; onIssue: (value: RoleIssueId) => void; onExisting: (value: boolean) => void;
}) {
  const role = roleOptions.find((item) => item.id === roleId)!;
  const issue = roleIssues.find((item) => item.id === issueId)!;
  const costs = roleTrialCosts(existingMentorTimeAvailable);
  const rows = [
    ['担う工程', 'work'], ['本人にとっての違い', 'value'], ['情報・学習', 'access'],
    ['勤務と健康', 'time'], ['賃金・評価', 'pay'], ['決める人・実供給', 'owner'], ['停止・再選択', 'return'],
  ] as const;
  return <div className={styles.rolePlan} data-nbl-person-valued-roles>
    <h4>得たいことを、具体的な役割と条件で比べる</h4>
    <p>架空例：文章で人に情報を伝える役割に関心がある人が、有給週20時間の現職を続けながら担当内容を比べます。元の希望を残し、候補が同じ価値を得られるかは本人が判断します。</p>
    {separateSupplyContext && <p>上の未承認の供給条件とは別に、本人と仕事の状況を比べます。ここで状況を変えても、供給担当の受理・有償時間・支払を確認する仕事は完了しません。</p>}
    <label className={styles.choice}>今回比較する状況
      <select value={issueId} onChange={(event) => onIssue(event.target.value as RoleIssueId)}>
        {roleIssues.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select>
    </label>
    <div aria-live="polite"><p><strong>この状況で先に動くこと</strong><br />{issue.first}</p><p>担当：{issue.owner}</p></div>
    <p className={styles.note}>次の候補は役割の違いを比べる材料です。所得の不足や本人の希望が未確認の時は、上の第一手を役割変更の開始で代用しません。</p>
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="三つの役割案の比較表（横へスクロールできます）">
      <table className={styles.roleTable}>
        <caption>候補の役割・勤務・対価を同じ項目で比較する</caption>
        <thead><tr><th scope="col">比較する条件</th>{roleOptions.map((item) => <th key={item.id} scope="col">{item.title}</th>)}</tr></thead>
        <tbody>{rows.map(([label, field]) => <tr key={field}><th scope="row">{label}</th>{roleOptions.map((item) => <td key={item.id}>{item[field]}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <label className={styles.choice}>受渡しメモで検討する案
      <select value={roleId} onChange={(event) => onRole(event.target.value as RoleOptionId)}>
        {roleOptions.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select>
    </label>
    <div aria-live="polite">
      <p><strong>この案の次の確認</strong><br />{role.next}</p>
      <p><strong>有償の実施合意を作る</strong><br />{role.agreement}</p>
      {roleId === 'partial' && issueId === 'role' ? <>
        <h4>A案が選ばれ、承認される場合の4週間の仮試算</h4>
        <p>企業初期2時間×6,000円、専門初期3時間×5,000円、指導週0.5時間×4週×6,000円、専門振返り週0.5時間×4週×5,000円。仮単価です。</p>
        <label className={styles.check}><input type="checkbox" checked={existingMentorTimeAvailable} onChange={(event) => onExisting(event.target.checked)} />同じ指導活動に、週0.25時間×4週の既存有償時間を使える仮定</label>
        <dl>
          <dt>4週間の総額／既存分／純増</dt><dd>{costs.gross.toLocaleString('ja-JP')}円／{costs.existing.toLocaleString('ja-JP')}円／{costs.incremental.toLocaleString('ja-JP')}円</dd>
          <dt>開始前必要／仮の承認済み資金／時点不足</dt><dd>27,000円／20,000円／7,000円</dd>
        </dl>
        <p className={styles.note}>本人の週2時間は有給20時間内の置換です。通常賃金・全通常業務・税等を網羅した予算ではありません。既存分は同じ活動に使え、重複しない時だけ控除します。支払主体・日と実受理は別に確認します。</p>
      </> : <p>この案・状況の費用は未積算です。A案の43,000円を流用しません。追加変更なしの維持だけなら、新しい試算を必須にしません。</p>}
      <p><strong>本人の選択・共有範囲、企業の承認、提供者の受理・有償時間、支払日、実施はすべて未確認です。</strong>画面で案を選ぶ操作は、これらの合意を成立させません。</p>
      <p>就職前後とも本人が選ぶ対象学習と職場の応答を組みます。必要支援を保ち、維持・休養、今は話さない選択も残します。見直す時は、役割の実施と本人評価、健康、所得、他者負担を別に確かめます。</p>
    </div>
  </div>;
}
