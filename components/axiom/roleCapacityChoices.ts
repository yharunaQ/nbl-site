// Fictional internal-preview comparisons. Restricted evidence is not imported into the client.
export const roleCapacityBasis = { research: [
  { id: 'NBL-RK-0022', version: 2, bodySha256: '1c800a7bc0b32e2da37931aec9813b56a38805e551db9209572b7ea06b1954bb' },
  { id: 'NBL-RK-0059', version: 1, bodySha256: '27668b4e3201919bdac8c75e20328c53ff024dbac8629b178e966c6433f9bd73' },
] };
export const roleCapacityConditions = [
  { id: 'existing', title: '元の支援量を、今の配分で満たす', first: '十分な現配置を維持する。手続や増員を一律に追加しない。', check: '必要な技能・権限と月別・同時刻の実供給が足りるか。' },
  { id: 'reassign', title: '継続支援が増え、他担当の時間を適切に移せる', first: '既存業務を保ち、技能・権限・勤務が成立する分業変更を承認する。', check: '他担当の96＋108時間を本当に移せるか。個別担当の留保0で変動や必要時刻へ対応できるか。' },
  { id: 'full', title: '移せず、0.2人を満年度で配置する', first: '必要な担当の有償容量と正式財源・契約を確保するか、実行可能な代案を選ぶ。', check: '追加120万円と実技能・権限・勤務を満たせるか。元の差額を保つなら未確保財源は1,590から1,710万円へ変わる。' },
  { id: 'half', title: '移せず、0.2人の配置は後半6か月だけ', first: '開始時期又は正当な代替供給を見直す。黒字だけでは支援の不足を解消したことにしない。', check: '個別担当の年100時間不足をどう満たすか。後の余力で過去の必要時刻を埋めた扱いにしない。' },
] as const;
export type RoleCapacityConditionId = typeof roleCapacityConditions[number]['id'];
export const roleCapacityRoleNames = ['職務・職場', '個別就労・継続', '所得・調整'] as const;
export const roleCapacityAssumptions = '別の架空事業です。配置・追加配置はすべて常勤換算（FTE）です。1人年1,600時間×65％、配置1.2／0.9／0.4人。追加配置の単価は1人年600万円。継続支援が増える枝では二人を各72→240時間とし、追加336時間。役割と業務の対応も仮定で、担当名から技能・資格・権限を認定しません。元収入には未確保の基礎・転換財源1,590万円を含みます。数値は人員基準・給与・給付・自動的な公費負担や個人の支援上限ではありません。';
export const roleCapacityAuthority = '提供管理者が実技能・権限・既存業務と勤務を確認し、分業・開始・代替を承認します。雇用・予算・契約の権限者が追加配置と使途・継続財源を決めます。本人は目的・共有・継続や別案を選びます。';
export const roleCapacityRevision = '必要月・同時刻の実提供／非実施、本人の結果と負担、実原価・入金で見直します。必要支援の削減や職員の無償時間で不足を消しません。';
export const roleCapacityLimits = '上段の年間調整容量・地域予算へ足さず、その入力から担当状態を推定しません。配分・互換性・実需要・技能／権限・財源は未確認です。年量成立は必要時刻の実供給ではありません。';
export function roleCapacityScenario(id: RoleCapacityConditionId) {
  const c = roleCapacityConditions.find(c => c.id === id);
  if (!c) throw new Error('invalid_role_capacity_condition');
  const rate = 1600 * .65, capacity = [1.2 * rate, .9 * rate, .4 * rate];
  const needed = [1152, 804 + (id === 'existing' ? 0 : 336), 280];
  let addedCost = 0;
  if (id === 'reassign') { capacity[0] -= 96; capacity[1] += 204; capacity[2] -= 108; }
  if (id === 'full' || id === 'half') { const fraction = id === 'full' ? 1 : .5; capacity[1] += .2 * rate * fraction; addedCost = .2 * 600 * fraction; }
  const reserve = capacity.map((h, i) => h - needed[i]);
  return { ...c, capacity, needed, reserve, addedCost, aggregateReserve: reserve.reduce((a, b) => a + b, 0), roleShortfall: Math.max(0, -reserve[1]), annualMargin: 72.5 - addedCost };
}
export function roleCapacityMemo(id: RoleCapacityConditionId) {
  const s = roleCapacityScenario(id);
  return `別の架空事業の担当別容量：${s.title}\n担当別条件での第一候補：${s.first}\n` + roleCapacityRoleNames.map((n, i) => `${n}：必要${s.needed[i]}／容量${s.capacity[i]}／差引${s.reserve[i]}時間`).join('\n') +
    `\n年全体の差引${s.aggregateReserve}時間／個別担当の不足${s.roleShortfall}時間。\n追加原価${s.addedCost}万円／元の年収入4,642.5万円を固定した差額${s.annualMargin}万円。\n判断を変える確認：${s.check}\n${roleCapacityAuthority}\n${roleCapacityRevision}\n${roleCapacityAssumptions}\n${roleCapacityLimits}\n根拠の使用版：RK0022v2／0059v1（仮定下の比較）。`;
}
