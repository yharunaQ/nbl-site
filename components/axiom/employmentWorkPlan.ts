// Editorial application of the guide/case inventory, not a new source observation
// or validated intervention. Keep example values out of the blank download.
export const employmentWorkPlanHref =
  '/preview/axiom-next-nbl-v2/work-design-views-guide?system=WDG2-03#employment-work-plan';

export const employmentWorkPlanFields = [
  '顧客・社内の次工程に必要な仕事／いま滞るところ',
  '本人が望む役割・保ちたい条件／役割を広げない・保留する選択',
  '任せる仕事と残る仕事の担当／既存業務との入替',
  '使える情報・道具／教える担当・時間／本人が望む補助',
  '外部支援の受入・対応範囲／連絡役・次の返答／交代・終了時の引継ぎ先／受入待ち・利用しない場合の社内対応',
  '業務・予算・評価の決定者／実施担当／本人と確認する共有範囲',
  '役割に即した評価基準／学習・収入への影響と確認先',
] as const;

export const employmentWorkPlanExample = [
  {
    label: '必要な仕事',
    value:
      '受注の不備が出荷直前まで残り、営業と倉庫が確認に追われている。出荷判断の前に、重複・未記入を確かめる役割を設ける案。',
  },
  {
    label: '本人と選ぶ役割',
    value:
      '本人は照合の仕事を覚えたいが、現在の勤務時間は保ちたい。今の補助業務の一部と入れ替える。担当範囲は話し合って決め、拡大を望まない選択も残す。',
  },
  {
    label: '仕事の組合せ',
    value:
      '担当者は不備の印と保留理由を残す。顧客への照会は営業、出荷の判断は責任者。急ぎの順番を変える人を一人にし、質問の返答待ちにできる作業も決める。',
  },
  {
    label: '教え方と支援',
    value:
      '実際の画面と見本で確認し、社内の教える担当に時間を確保する。本人が望み、支援機関が引き受けた範囲で、仕事分析や練習方法を一緒に検討する。機器や人的補助も選択肢にする。',
  },
  {
    label: '職場で決めること',
    value:
      '業務責任者は分担と期限、人事・権限者は育成時間・費用・評価条件を確認する。支援者の助言だけで配置を決めず、誰が何を実施するか本人と共有する。',
  },
  {
    label: '試した後に見ること',
    value:
      '合意した教える時間や情報形式が実際に使えたかを先に確認。仕事の品質・引継ぎ、本人と同僚の負担に加え、本人が望む会議・学習への参加、評価・収入の変化を分けて振り返る。件数だけで評価せず、未実施を本人の不適合としない。',
  },
] as const;

export const employmentWorkPlanCaseIds = [
  'ojt-as-teaching-work-system',
  'role-evaluation-growth',
  'support-response-with-person-control',
  'professional-advice-to-workplace',
  'workplace-owned-priority-change',
] as const;
