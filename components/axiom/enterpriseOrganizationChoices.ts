// Authored internal comparisons. No restricted-source import, individual decision or runtime pack.
export type EnterpriseOrganizationConditionId = 'existing' | 'unit' | 'closed' | 'independent' | 'support' | 'unknown';
export type EnterpriseFinanceScenarioId = 'partial' | 'full' | 'lower-demand' | 'unknown';

export const enterpriseOrganizationConditions = [
  { id: 'existing', title: '既存の求人・今の職場で、望む役割と必要支援が足りる',
    first: '本人が望む既存の仕事と支援を維持し、条件変更時の再相談を残す。新法人や新しい審査を追加することを目標にしない。',
    alternative: '役割・対価、職場の応答又は必要支援が変われば、その不足へ案と担当を変える。本人が別の仕事・学習や休養を望むことも残す。',
    question: '本人は何を保ちたいか。実仕事と必要支援は足り、変更したい時の受け手が使えるか。',
    owner: '本人が維持・変更と共有を選び、雇用主と提供担当が現在の条件と再相談を保つ。',
    review: '必要な条件の変化と本人が選ぶ確認を行う。十分な既存記録で足りれば全員への追加聞取りを重ねない。' },
  { id: 'unit', title: '既存企業の受注・設備・雇用機能を使い、望む仕事と支援を組める',
    first: '既存部門の実需要、配分原価、雇用主の権限と必要な有償支援を具体化する。法人を作る前に、使える経営機能と支援を同じ事業計画へ組む。',
    alternative: '部門が役割・参加や他の機会を閉じるなら、その条件を先に改める。本人たちが独立した契約・意思決定を望み資源を用意できる場合は独立案も比較する。',
    question: '内部発注は何の需要に応え、誰が価格・品質・雇用を決めるか。共有費は配分され、本人の役割・対価、提案への返答と他機会、有償支援は成立するか。',
    owner: '本人が仕事・参加・共有を選ぶ。企業の経営/雇用担当が契約・工程・労働条件、支援の決定/提供/支払担当が受理・勤務・費用を担う。',
    review: '実受注・入金と通常費、本人の役割・賃金/学習・他機会、意見への返答と実支援を別に更新する。低費用又は部門名だけで良好な仕事と認定しない。' },
  { id: 'closed', title: '部門は低費用だが、本人の役割・提案への返答や他機会が閉じる',
    first: '本人と雇用主の権限者が仕事・役割、提案への返答と他の実機会を改め、必要な独立相談へつなぐ。受注拡大や安い組織への固定を先にしない。',
    alternative: '既存部門で望む条件を組めるならその変更へ、本人が別の職場や独立運営を望むなら具体的資源と別案へ変える。現在の所得・必要支援を保つ。',
    question: '本人の提案は誰へ届き、採用・保留・不採用の理由と実施は戻るか。本人は何を比較したいか。低い費用で失われる役割・選択はないか。',
    owner: '本人の個別選択と、事業方針への参加を分ける。雇用/経営の権限者が返答・条件変更、正当な独立相談担当が必要な権利確認、各担当が継続資源を引き受ける。',
    review: '返答だけでなく実施と本人の経験、少数・非参加者の扱い、勤務内の参加/援助時間を確認する。多数決で個人の必要支援を削らない。' },
  { id: 'independent', title: '本人たちが独立した運営を望み、経営・支援と資金を用意できる',
    first: '独立した契約・所有や意思決定の目的を保ち、経営/雇用の権限、適切な労働条件、必要支援と継続資源を具体化して独立案を比較する。',
    alternative: '独立管理・初期/運転資金、需要又は支援が不足するならその機能と資源を改める。目的を満たす部門・既存求人も比較し、本人の保留や別案を残す。',
    question: '独立すると何を実現できるか。出資と賃金、参加と雇用/支援保護、追加管理と初期支払前の資金は別に確認できるか。',
    owner: '本人たちが参加・出資等の条件を選び、事業と雇用、支援と支払の各権限者が適法な契約・勤務・資金を確かめる。説明支援に本人の票を自動付与しない。',
    review: '仕事・参加への応答と労働条件、継続採算・入金と支援供給を別に更新する。自己経営を無償労働、賃金猶予又は必要支援費の自己負担へ置き換えない。' },
  { id: 'support', title: '望む仕事と需要はあるが、必要支援の受理・有償勤務・支払が足りない',
    first: '具体的仕事に必要な本人/職場双方の機能、必要時刻の受理・有償勤務と支払/代替を各担当へ置く。支援費の決定と実際に使える供給を別に確かめる。',
    alternative: '通常の職場協力や適格な既存財源で足りるなら活かす。需要・雇用条件も不足するなら経営/雇用担当と並行し、新法人だけで不足が消えるとしない。',
    question: '実仕事の学習・対処と職場応答のどこが必要か。通常勤務の内数、共有原価、重複と純増、供給/代替と入金は対応するか。',
    owner: '本人が望む方法と共有を選び、雇用主は仕事/職場の変更を、決定・提供・支払担当は対象機能、勤務と正式財源を担う。雇用主責任と適格な公的補填は両立し得る。',
    review: '就職前後の実機能・受理・支払と本人の仕事/生活を別に更新する。支援内容は対象者と仕事で変わり、障害名・人数や財源額から一律に決めない。' },
  { id: 'unknown', title: '希望・仕事・需要・担当や資金のどこが不足か、まだ不明',
    first: '本人が選ぶ共有範囲で、今回の組織判断を変える希望、実仕事・買い手、雇用/支援の権限又は資金の条件を確かめる。不明を未準備や供給済みへ変えない。',
    alternative: '既知の不足は各担当へ並行して返す。十分な既存条件なら維持へ、独立を望む目的と資源が分かればその案へ変える。',
    question: '何を一つ確認すると組織と第一手が変わるか。本人の希望、事業の採否と支援の受理が混ざっていないか。',
    owner: '本人が話すことと共有を選び、該当する経営/雇用、提供/支払担当が回答する。切迫した保護や権利の問題は正当な経路へ並行してつなぐ。',
    review: '分かった条件と未確認、選択と実施を分ける。全資料や全財源の確認待ちで既知の必要支援を止めない。' },
] as const;

export const enterpriseFinanceScenarios = [
  { id: 'partial', title: '売上1,260万円・追加支援財源400万円という仮定' },
  { id: 'full', title: '同じ売上で、追加支援576万円全額を支払える仮定' },
  { id: 'lower-demand', title: '支援全額でも販売数量20％減、勤務・支援は維持する仮定' },
  { id: 'unknown', title: '需要・原価・適格財源や入金が未確認' },
] as const;

export function enterpriseOrganizationCondition(id: EnterpriseOrganizationConditionId) {
  return enterpriseOrganizationConditions.find(c => c.id === id) ?? enterpriseOrganizationConditions[5];
}
export function enterpriseOrganizationExample(id: EnterpriseOrganizationConditionId) {
  const c = enterpriseOrganizationCondition(id);
  return { id: 'enterprise-organization', condition: c.title, priority: c.first,
    alternative: c.alternative, question: c.question, owner: c.owner, review: c.review };
}

export function enterpriseFinance(id: EnterpriseFinanceScenarioId) {
  if (!enterpriseFinanceScenarios.some(s => s.id === id)) throw new Error('invalid_enterprise_finance_scenario');
  if (id === 'unknown') return null;
  // Tenths of 万円 keep this fictional calculation independent of binary rounding.
  const sales = id === 'lower-demand' ? 10080 : 12600;
  const materials = id === 'lower-demand' ? 1440 : 1800;
  const ordinary = 5760 + 1152 + materials + 2800 + 1000;
  const support = 5760, funding = id === 'partial' ? 4000 : 5760;
  const receipt = sales / 12 * 11;
  const money = (v: number) => v / 10;
  const quarterReceipts = [sales / 12 * 2, sales / 12 * 3, sales / 12 * 3, sales / 12 * 3];
  const plans = [
    { id: 'unit', title: '既存部門', ordinary, initial: 600 },
    { id: 'independent', title: '独立事業', ordinary: ordinary + 1200, initial: 1400 },
  ].map(p => {
    const cost = p.ordinary + support;
    let cash = -p.initial;
    const cumulative = [money(cash), ...quarterReceipts.map(r => {
      cash += r + funding / 4 - cost / 4; return money(cash);
    })];
    return { id: p.id, title: p.title, sales: money(sales), ordinary: money(p.ordinary), support: money(support),
      funding: money(funding), initial: money(p.initial), operatingPL: money(sales + funding - cost),
      combinedPL: money(sales + funding - cost - p.initial), receipts: money(receipt), receivable: money(sales - receipt),
      cashDifference: money(receipt + funding - cost - p.initial), cumulative,
      endingCashWith400: money(4000 + receipt + funding - cost - p.initial) };
  });
  const first = id === 'partial' ? '部門案は通常費を売上が8.8万円上回る一方、追加支援財源が176万円不足する。支援の責任・有償供給と財源を整え、独立案では追加管理も並行して見直す。' :
    id === 'full' ? '部門案の継続損益は＋8.8万円だが初期・入金待ち資金は残る。独立案は継続損益−111.2万円で、全額支援だけでは開始条件が揃わない。' :
    '数量が減ると、全額支援でも部門案の継続損益は−207.2万円。買い手・価格・工程・通常運営と別仕事を比較し、賃金や必要支援を自動的に削らない。';
  return { plans, first, materials: money(materials) };
}

export function enterpriseOrganizationMemo(conditionId: EnterpriseOrganizationConditionId,
  financeId: EnterpriseFinanceScenarioId, separateSupplyContext = false) {
  const c = enterpriseOrganizationCondition(conditionId), f = enterpriseFinance(financeId);
  return ['## 社会的雇用の組織と有償支援の比較案',
    '独立に選ぶ架空条件です。実人の希望、契約、供給や資金を確認した記録ではありません。',
    ...(separateSupplyContext ? ['年間の調整容量・上段の供給条件から組織や個別状態を推定しません。'] : []),
    `組織の仮条件：${c.title}`, `組織条件での第一候補：${c.first}`, `条件が違う時：${c.alternative}`,
    `判断を変える確認：${c.question}`, `各担当の仕事：${c.owner}`, `見直し：${c.review}`,
    '', '## 別の架空企業の費用・資金（万円）',
    'この4人チームの数値は上の組織条件や地域の40/80人・2,080時間から推定せず、地域予算へ足しません。',
    `選んだ計算仮定：${enterpriseFinanceScenarios.find(s => s.id === financeId)!.title}`,
    ...(f ? [`材料費${f.materials}万円。この計算では販売数量に比例し、数量20％減なら180万円から144万円へ変わります。賃金・勤務時間と必要支援は維持する仮定です。`] : []),
    ...(f ? f.plans.map(p => `${p.title}：売上${p.sales}／通常費${p.ordinary}／追加支援費${p.support}／支援財源${p.funding}／継続損益${p.operatingPL}／導入前支払${p.initial}／導入前＋稼働12か月損益${p.combinedPL}／同期間入金差引${p.cashDifference}／導入前・Q1〜Q4累計差引[${p.cumulative.join(', ')}]／仮の400万円が初期支払前に利用できる時のQ4末${p.endingCashWith400}`) : ['需要・原価・財源・入金は未確認。計算値をゼロ又は確保済みへ補いません。']),
    ...(f ? [`計算仮定で変わる第一手：${f.first}`] : []),
    '導入前90日＋稼働12か月は設計集計で、会計年度の損益ではありません。初期費は稼働前に支払い、四半期末残高だけで期中の支払能力を認定しません。',
    '売上・財源・原価・開始資金は仮定です。補填の適格性、本人の希望・対価、実供給と効果を計算から認定しません。',
    '', '## 実際の案へ進む時、各担当が確かめること',
    '本人が望む役割・参加/共有と他機会：未確認', '買い手・品質/納品・価格/量と入金、内部取引：未確認',
    '経営/雇用の権限、対価、提案への返答：未確認',
    '具体仕事での本人の対処/学習と職場側の応答、必要支援の受理/有償勤務・代替：未確認',
    '通常費・追加支援・初期費の内数/共有配分/重複/純増、適格財源と支払、初期支払前と月日別の資金：未確認',
    '継続・転換と本人の所得/支援、実施と別々の結果：未確認',
    '本人参加を無償経営や賃金猶予にせず、必要機能の不足を家族・職員・NBLの恒常的持出しへ移しません。',
  ].join('\n');
}
