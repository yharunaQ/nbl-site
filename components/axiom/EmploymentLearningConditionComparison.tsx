import { Fragment } from 'react';
import { employmentLearningCondition, employmentLearningConditions, jobLearningDailyWorkDecisions, jobLearningDailyWorkComparison, type EmploymentLearningConditionId } from './employmentLearningChoices';
import styles from './ResearchKnowledgeApplication.module.css';

export default function EmploymentLearningConditionComparison({ conditionId, onCondition, separateSupplyContext = false }: {
  conditionId: EmploymentLearningConditionId;
  onCondition: (id: EmploymentLearningConditionId) => void;
  separateSupplyContext?: boolean;
}) {
  const c = employmentLearningCondition(conditionId);
  return <div>
    <h4>仕事で学ぶ条件と、雇用・支援の成立を比べる</h4>
    {separateSupplyContext && <p className={styles.note}>上段は年間供給の案です。以下の個別条件は、時間計算や上段の状態から推定せず、独立に比較します。</p>}
    <label className={styles.choice}>今回比較する仕事・学習と雇用・支援の条件
      <select value={conditionId} onChange={event => onCondition(event.target.value as EmploymentLearningConditionId)}>
        {employmentLearningConditions.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select>
    </label>
    <dl aria-live="polite">
      <dt>仕事・本人の方法と職場応答</dt><dd>{c.learning}</dd>
      <dt>雇用・対価の状態</dt><dd>{c.employment}</dd>
      <dt>後続支援・勤務と支払の状態</dt><dd>{c.supply}</dd>
    </dl>
    {separateSupplyContext && <dl aria-live="polite">
      <dt>個別条件での第一候補</dt><dd>{c.first}</dd>
      <dt>個別条件が違う時の対応</dt><dd>{c.alternative}</dd>
      <dt>個別の判断を変える確認</dt><dd>{c.question}</dd>
      <dt>個別条件で選ぶ人・決める人・実施する人</dt><dd>{c.owner}</dd>
      <dt>個別条件の見直し</dt><dd>{c.review}</dd>
    </dl>}
    {conditionId === 'learning_gap' && <div>
      <h5>教え方・道具・引継ぎを分ける</h5>
      <dl>
        {jobLearningDailyWorkDecisions.map(decision => <Fragment key={decision.title}>
          <dt>{decision.title}</dt><dd>{decision.action}</dd>
        </Fragment>)}
      </dl>
      <p>{jobLearningDailyWorkComparison}</p>
      <p>必要技能の未習得には本人が望む対象学習を、既存の方法で十分なら維持を比べます。学習しない、別仕事・休養の選択と必要な資格・安全確認も保ちます。</p>
    </div>}
  </div>;
}
