import { Fragment } from 'react';
import { employmentSharingCondition, employmentSharingConditions, employmentSharingResponsibilities,
  type EmploymentSharingConditionId } from './employmentSharingChoices';
import styles from './ResearchKnowledgeApplication.module.css';

export default function EmploymentSharingResponseComparison({ conditionId, onCondition, separateSupplyContext = false }: {
  conditionId: EmploymentSharingConditionId;
  onCondition: (id: EmploymentSharingConditionId) => void;
  separateSupplyContext?: boolean;
}) {
  const c = employmentSharingCondition(conditionId);
  return <div className={styles.rolePlan}>
    <h4>説明と職場の応答、どこを変えるか</h4>
    {separateSupplyContext && <p className={styles.note}>上段は年間供給の案です。以下の個別条件は時間計算や上段の状態から推定せず、独立に比較します。</p>}
    <label className={styles.choice}>今回比較する申出・受理・返答と実変更の条件
      <select value={conditionId} onChange={event => onCondition(event.target.value as EmploymentSharingConditionId)}>
        {employmentSharingConditions.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select>
    </label>
    <dl aria-live="polite">
      <dt>この比較で仮定した状態</dt><dd>{c.state}</dd>
      <dt>{separateSupplyContext ? '個別条件での第一候補' : 'この条件での第一候補'}</dt><dd>{c.first}</dd>
      <dt>{separateSupplyContext ? '個別条件が違う時の対応' : '条件が違う時の対応'}</dt><dd>{c.alternative}</dd>
      <dt>{separateSupplyContext ? '個別の判断を変える確認' : '判断を変える確認'}</dt><dd>{c.question}</dd>
      <dt>{separateSupplyContext ? '個別条件で選ぶ人・決める人・実施する人' : '選ぶ人・決める人・実施する人'}</dt><dd>{c.owner}</dd>
      <dt>{separateSupplyContext ? '個別条件の見直し' : '実施後の見直し'}</dt><dd>{c.review}</dd>
    </dl>
    <dl>
      {employmentSharingResponsibilities.map(r => <Fragment key={r.title}><dt>{r.title}</dt><dd>{r.text}</dd></Fragment>)}
    </dl>
    <p className={styles.note}>本人への説明援助と職場側への働きかけは、就職前後とも同じ実仕事で必要に応じ並行できます。画面での条件選択は、本人の同意や実施承認ではありません。</p>
  </div>;
}
