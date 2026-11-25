import { useId, useState } from 'react';
import { decisionExamples, decisionExampleMemo, continuityCapacity, continuityCapacityMemo, continuityResourceExamples,
  type ResearchApplicationMode } from './researchKnowledgeApplications';
import styles from './ResearchKnowledgeApplication.module.css';
import PersonValuedRoleComparison from './PersonValuedRoleComparison';
import { personValuedRoleMemo, roleIssues, type RoleOptionId, type RoleIssueId } from './personValuedRoleChoices';
import EmploymentLearningConditionComparison from './EmploymentLearningConditionComparison';
import { employmentLearningExample, employmentLearningMemo, type EmploymentLearningConditionId } from './employmentLearningChoices';
import EnterpriseOrganizationComparison from './EnterpriseOrganizationComparison';
import { enterpriseOrganizationExample, enterpriseOrganizationMemo,
  type EnterpriseOrganizationConditionId, type EnterpriseFinanceScenarioId } from './enterpriseOrganizationChoices';
import EmploymentSharingResponseComparison from './EmploymentSharingResponseComparison';
import { employmentSharingExample, employmentSharingMemo, type EmploymentSharingConditionId } from './employmentSharingChoices';
import RoleCapacityComparison from './RoleCapacityComparison';
import { roleCapacityMemo, type RoleCapacityConditionId } from './roleCapacityChoices';

export default function ResearchKnowledgeApplication({ mode, initialExampleId }: {
  mode: ResearchApplicationMode | 'capacity'; initialExampleId?: string;
}) {
  const id = useId();
  const [selected, setSelected] = useState(() => mode === 'capacity' ? 0 :
    Math.max(0, decisionExamples[mode].findIndex((item) => item.id === initialExampleId)));
  const [counts, setCounts] = useState(['20', '12', '40']);
  const [resourceSelected, setResourceSelected] = useState(0);
  const [copiedMemo, setCopiedMemo] = useState<string | null>(null);
  const [failedMemo, setFailedMemo] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<RoleOptionId>('partial');
  const [roleIssueId, setRoleIssueId] = useState<RoleIssueId>('role');
  const [existingMentorTimeAvailable, setExistingMentorTimeAvailable] = useState(true);
  const [learningConditionId, setLearningConditionId] = useState<EmploymentLearningConditionId>('employment_gap');
  const [enterpriseConditionId, setEnterpriseConditionId] = useState<EnterpriseOrganizationConditionId>('unit');
  const [enterpriseFinanceId, setEnterpriseFinanceId] = useState<EnterpriseFinanceScenarioId>('unknown');
  const [sharingConditionId, setSharingConditionId] = useState<EmploymentSharingConditionId>('submitted_unknown');
  const [showRoleCapacity, setShowRoleCapacity] = useState(false);
  const [roleCapacityId, setRoleCapacityId] = useState<RoleCapacityConditionId>('existing');
  const isCapacity = mode === 'capacity';
  const example = isCapacity ? continuityResourceExamples[resourceSelected] : decisionExamples[mode][selected];
  const roleSupplyContext = example?.id === 'person-valued-role-supply';
  const showRoles = example?.id === 'person-valued-roles' || roleSupplyContext;
  const learningSupplyContext = example?.id === 'learning-employment-supply';
  const showLearning = example?.id === 'learning-employment-conditions' || learningSupplyContext;
  const enterpriseSupplyContext = example?.id === 'enterprise-organization-supply';
  const showEnterprise = example?.id === 'enterprise-organization' || enterpriseSupplyContext;
  const sharingSupplyContext = example?.id === 'sharing-response-supply';
  const showSharing = example?.id === 'sharing-response' || sharingSupplyContext;
  const separateSupplyContext = learningSupplyContext || enterpriseSupplyContext || sharingSupplyContext;
  const roleIssue = roleIssues.find((item) => item.id === roleIssueId)!;
  const displayedExample = example?.id === 'sharing-response' ? employmentSharingExample(sharingConditionId) :
    example?.id === 'enterprise-organization' ? enterpriseOrganizationExample(enterpriseConditionId) :
    example?.id === 'learning-employment-conditions' ? employmentLearningExample(learningConditionId) :
    example && example.id === 'person-valued-roles' ? { ...example, condition: roleIssue.title,
      priority: roleIssue.first, owner: `${roleIssue.owner} ${example.owner}` } : example;
  const inputs = counts.map((value) => value.trim() === '' ? NaN : Number(value));
  let capacity: ReturnType<typeof continuityCapacity> | null = null;
  if (isCapacity) {
    try { capacity = continuityCapacity(inputs[0], inputs[1], inputs[2]); } catch { /* Leave invalid or unanswered assumptions unknown. */ }
  }
  const baseMemo = isCapacity
    ? capacity ? continuityCapacityMemo(inputs[0], inputs[1], inputs[2], displayedExample) : null
    : displayedExample ? decisionExampleMemo(mode as ResearchApplicationMode, displayedExample) : null;
  const existingMemo = showEnterprise ? `${baseMemo ?? '年間の調整容量：未計算。未回答・範囲外の仮定をゼロへ補いません。以下の組織条件は独立に比較します。'}\n\n${enterpriseOrganizationMemo(enterpriseConditionId, enterpriseFinanceId, enterpriseSupplyContext)}` :
    showSharing ? `${baseMemo ?? '年間の調整容量：未計算。未回答・範囲外の仮定をゼロへ補いません。以下の申出・応答条件は独立に比較します。'}\n\n${employmentSharingMemo(sharingConditionId, sharingSupplyContext)}` :
    baseMemo && showLearning ? `${baseMemo}\n\n${employmentLearningMemo(learningConditionId, learningSupplyContext)}` :
    baseMemo && showRoles ? `${baseMemo}\n\n${personValuedRoleMemo(roleId, roleIssueId, existingMentorTimeAvailable, roleSupplyContext)}` : baseMemo;
  const memo = isCapacity && showRoleCapacity ? `${existingMemo ?? '年間の調整容量：未計算。未回答の仮定をゼロへ補いません。以下は独立した別計画です。'}\n\n${roleCapacityMemo(roleCapacityId)}` : existingMemo;
  const title = isCapacity ? '継続と新規を、同じ容量で比べる' :
    mode === 'job' ? '仕事への接点と対処・学習を、どう組み合わせるか' :
    mode === 'handover' ? '引継ぎと伴走、どこで止まっているか' : '変える条件を、仕事の場面から選ぶ';
  async function copyMemo() {
    if (!memo) return;
    try {
      await navigator.clipboard.writeText(memo);
      setCopiedMemo(memo);
      setFailedMemo(null);
    } catch {
      setFailedMemo(memo);
      setCopiedMemo(null);
    }
  }
  const decisionDetails = displayedExample && <div aria-live="polite"><dl>
    <dt>{separateSupplyContext ? '年間供給側の第一候補' : 'この条件での第一候補'}</dt><dd>{displayedExample.priority}</dd>
    <dt>{separateSupplyContext ? '年間供給側の条件が違う時の対応' : '条件が違う時の対応'}</dt><dd>{displayedExample.alternative}</dd>
    <dt>{separateSupplyContext ? '年間供給側の判断を変える確認' : '判断を変える確認'}</dt><dd>{displayedExample.question}</dd>
    <dt>{separateSupplyContext ? '年間供給側で選ぶ人・決める人・実施する人' : '選ぶ人・決める人・実施する人'}</dt><dd>{displayedExample.owner}</dd>
    <dt>{separateSupplyContext ? '年間供給側の見直し' : '実施後の見直し'}</dt><dd>{displayedExample.review}</dd>
  </dl></div>;
  return (
    <section className={styles.application} aria-labelledby={`${id}-title`} data-nbl-research-application={mode}>
      <p className={styles.kicker}>条件を変えて、次の対応を比べる</p>
      <h3 id={`${id}-title`}>{title}</h3>
      <p className={styles.note}>架空の条件比較です。個人情報の入力・保存・送信はありません。選択によって対応例を切り替えます。</p>
      {isCapacity ? <>
        <p>仮定の調整担当2人、年1600時間、配分65%。その他相談320時間と留保320時間を保ちます。新規重点1件の年間調整時間は36時間と仮定しています。個人の支援上限ではありません。直接介助・指導の供給と費用は別です。</p>
        <div className={styles.inputs}>
          {['翌年度へ継続する件数', '継続1件に置く年間調整時間', '翌年度の新規目標件数'].map((label, index) =>
            <label key={label}>{label}<input type="number" min="0" max={index === 1 ? '1600' : '1000'} step={index === 1 ? 'any' : '1'} value={counts[index]}
              onChange={(event) => setCounts((old) => old.map((v, i) => i === index ? event.target.value : v))} /></label>)}
        </div>
        <div aria-live="polite">
          {capacity ? <dl>
            <dt>現体制で、その他相談と留保を保つ新規計画枠</dt><dd>{capacity.newSlots}件</dd>
            <dt>入力した新規目標まで置く時の必要時間／不足</dt><dd>{capacity.totalRequiredHours}時間／{capacity.shortageHours}時間</dd>
            <dt>同じ配分で必要となる体制の目安</dt><dd>約{capacity.totalFte}人相当</dd>
          </dl> : <p>未入力又は範囲外の仮定があります。件数は0〜1000の整数、時間は0〜1600で比較してください。空欄は0と扱いません。</p>}
        </div>
        <p>これは需要予測や個人の支援上限ではありません。不足する時は、追加体制・分担、新規受付の工程、実際に受理できる別機能を比較します。継続時間が自然に減ると決めず、月別の集中、再接続、実供給と支払も確認します。</p>
        <p>年合計の調整時間と、必要な時刻に動ける人・技能・権限は別に確認します。以下は計算結果から推定した状態ではなく、独立に選ぶ架空の条件です。開拓・調整・育成・待機の費用も全て計上済みではなく、内数・重複・追加費を勤務・原価・契約で確かめます。</p>
        <label className={styles.choice}>時間計算に加えて比べる架空の条件
          <select value={resourceSelected} onChange={(event) => setResourceSelected(Number(event.target.value))}>
            {continuityResourceExamples.map((item, index) => <option key={item.id} value={index}>{item.condition}</option>)}
          </select>
        </label>
      </> : <>
        <label className={styles.choice}>比較する架空の条件
          <select value={selected} onChange={(event) => setSelected(Number(event.target.value))}>
            {decisionExamples[mode].map((item, index) => <option key={item.id} value={index}>{item.condition}</option>)}
          </select>
        </label>
      </>}
      <button className={styles.download} type="button" onClick={() => {
        if (isCapacity) setResourceSelected(continuityResourceExamples.findIndex(item => item.id === 'learning-employment-supply'));
        else setSelected(decisionExamples[mode].findIndex(item => item.id === 'learning-employment-conditions'));
      }}>仕事の学習と雇用・支援を比べる</button>
      {' '}
      <button className={styles.download} type="button" onClick={() => {
        if (isCapacity) setResourceSelected(continuityResourceExamples.findIndex(item => item.id === 'enterprise-organization-supply'));
        else setSelected(decisionExamples[mode].findIndex(item => item.id === 'enterprise-organization'));
      }}>社会的雇用の組織と有償支援を比べる</button>
      {' '}
      <button className={styles.download} type="button" onClick={() => {
        if (isCapacity) setResourceSelected(continuityResourceExamples.findIndex(item => item.id === 'sharing-response-supply'));
        else setSelected(decisionExamples[mode].findIndex(item => item.id === 'sharing-response'));
      }}>説明と職場の応答を比べる</button>
      {separateSupplyContext && decisionDetails}
      {showLearning && <EmploymentLearningConditionComparison conditionId={learningConditionId}
        separateSupplyContext={learningSupplyContext} onCondition={setLearningConditionId} />}
      {showSharing && <EmploymentSharingResponseComparison conditionId={sharingConditionId}
        separateSupplyContext={sharingSupplyContext} onCondition={setSharingConditionId} />}
      {!separateSupplyContext && !showSharing && decisionDetails}
      {showEnterprise && <EnterpriseOrganizationComparison conditionId={enterpriseConditionId} onCondition={setEnterpriseConditionId}
        financeId={enterpriseFinanceId} onFinance={setEnterpriseFinanceId} separateSupplyContext={enterpriseSupplyContext} />}
      {showRoles && <PersonValuedRoleComparison roleId={roleId} issueId={roleIssueId}
        separateSupplyContext={roleSupplyContext} existingMentorTimeAvailable={existingMentorTimeAvailable} onRole={setRoleId} onIssue={setRoleIssueId} onExisting={setExistingMentorTimeAvailable} />}
      {isCapacity && <>
        <button className={styles.download} type="button" aria-expanded={showRoleCapacity}
          onClick={() => setShowRoleCapacity(v => !v)}>担当別の時間と費用を比べる</button>
        {showRoleCapacity && <RoleCapacityComparison conditionId={roleCapacityId} onCondition={setRoleCapacityId} />}
      </>}
      {memo && <>
        <button className={styles.download} type="button" onClick={copyMemo}>比較メモをコピー</button>
        {' '}
        <a className={styles.download} href={`data:text/markdown;charset=utf-8,${encodeURIComponent(memo)}`} download={`nbl-${mode}-conditional-example.md`}>この条件の比較メモを保存</a>
        <p role="status" className={styles.note}>{copiedMemo === memo ? 'コピーしました。メモ欄などへ貼り付けられます。' :
          failedMemo === memo ? 'コピーできませんでした。表示内容を選択するか、保存リンクを使ってください。' : ''}</p>
      </>}
      {isCapacity && <>
        <p>オンラインで窓口件数が減っても、残る相談の構成と実時間は別に確認します。完了・中断・再相談、他経路や本人への負担を追い、文章生成量を支援時間の削減へ換算しません。</p>
        <p>外部の訪問が減っても、職場へ移った機能の担当・権限・勤務時間・代替と再接続を確認します。支援不要や調整時間の自然減へ読み替えません。</p>
        <p>担当時間の確保と、必要支援費の支払は別に確認します。対象費、率・上限、他財源、残額を担う主体、立替期間、実際の提供者を対応させます。費用が部署の障壁なら共通財源を比較し、簡単な変更まで中央承認待ちにしません。</p>
        <p>所属や仕事が変わる時は、必要機能、契約、支払開始、実供給をつなぎます。対象資格や計画書だけで継続を約束せず、本人の選択と別財源で既に満たす部分を保ちます。</p>
      </>}
      <p className={styles.note}>本人の選択、実施、結果はこの例では確認していません。実際の案は本人と権限を持つ担当者が検討します。</p>
    </section>
  );
}
