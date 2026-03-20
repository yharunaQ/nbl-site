export const TARGET_CARD_IDS = [
  'p-support-service-navigation',
  'p-manager-checkin',
  'p-worktrial-transition',
  'p-disclosure-boundary',
  'p-mental-fluctuation-plan',
];

export const WORKFLOW_ORDER = [
  'triage',
  'role_split',
  'consent',
  'case_conference',
  'monitoring',
];

export const WORKFLOW_SPEC = {
  triage: {
    title: '実施可能性トリアージ',
    purpose: '企業単独で回るか、地域支援体制を添えないと止まるかを最初に見分ける。',
    jacRole: [
      '配慮案だけでなく、誰が何を担うと実施できるかを最小単位で言語化する',
      '企業単独で抱えにくい論点を、相談・制度・定着支援のどこへ接続するか示す',
    ],
    regionalRole: [
      '専門評価、制度要件確認、定着支援のどれが必要かを判断する',
      'JAC提案を地域資源の現実に合わせて実装可能な順序へ並べ替える',
    ],
    employerRole: [
      '社内で担える範囲と担えない範囲を隠さず明示する',
      '担当者、期限、再評価条件を決める',
    ],
    artifact: '役割分担付きの提案メモ 1枚',
    recheckTrigger: '担当者が決まらない、期限が引けない、制度要件が曖昧な場合',
  },
  role_split: {
    title: '役割分担の明文化',
    purpose: 'JAC / 地域支援者 / 企業 / 本人 の境界を曖昧にしない。',
    jacRole: [
      '企業内で回す項目と外部支援が必要な項目を分けて提示する',
      '戻し先を含めた責任線を固定する',
    ],
    regionalRole: [
      'ケース会議、同行支援、定着支援など外部側の実行単位を明確にする',
      '支援の過不足が出た時の再調整窓口になる',
    ],
    employerRole: [
      '現場管理者と人事の役割を分けて持つ',
      '情報共有先と評価責任を混ぜない',
    ],
    artifact: '役割分担シート',
    recheckTrigger: '「誰がやるか」が会議後に宙に浮く場合',
  },
  consent: {
    title: '同意・情報共有の最小化',
    purpose: '必要配慮の実装に必要な最小情報だけを扱い、共有過多を避ける。',
    jacRole: [
      '共有目的、共有先、見直し時点を分けて確認する',
      '共有しない情報でも支援できる代替経路を残す',
    ],
    regionalRole: [
      '本人同意に基づく情報共有設計を支える',
      'ケース会議が必要な場合の参加者と記録ルールを整理する',
    ],
    employerRole: [
      '配慮実装に不要な情報を持ち込まない',
      '共有範囲と保存責任を社内で固定する',
    ],
    artifact: '共有範囲メモ',
    recheckTrigger: '共有範囲が広がり続ける、目的が曖昧になる場合',
  },
  case_conference: {
    title: 'ケース会議の発動条件',
    purpose: '迷った時の戻し先を前もって決め、個人の抱え込みを防ぐ。',
    jacRole: [
      '再評価が必要な閾値を先に決める',
      '会議が必要か、個別相談で足りるかを判断する',
    ],
    regionalRole: [
      '専門的見立てが必要な論点に応じて参加する',
      '会議後の支援実装と経過確認を担う',
    ],
    employerRole: [
      '現場だけで抱え込まず、再評価条件に達したら戻す',
      '会議後の社内実装を引き取る担当者を置く',
    ],
    artifact: 'ケース会議トリガー一覧',
    recheckTrigger: '不調再発、連絡遅延、役割不明、制度条件不明',
  },
  monitoring: {
    title: '定着支援と戻し先',
    purpose: '一度決めた支援を固定せず、実施しやすさと再現性を継続点検する。',
    jacRole: [
      '支援の実施状況と企業負担感を確認する',
      '止まった時の再接続窓口を維持する',
    ],
    regionalRole: [
      '定着支援、再評価、必要時の職務再調整を支える',
      '地域資源の変更や新たな支援導入を提案する',
    ],
    employerRole: [
      '現場の負担と効果を定期的に共有する',
      '中断理由を曖昧にせず、戻し先へ返す',
    ],
    artifact: '月次見直しメモ',
    recheckTrigger: '想定より負担が高い、効果が見えない、連絡が途切れる場合',
  },
};

export const CARD_WORKFLOW_MAP = {
  'p-support-service-navigation': ['triage', 'role_split', 'consent', 'case_conference', 'monitoring'],
  'p-manager-checkin': ['role_split', 'case_conference', 'monitoring'],
  'p-worktrial-transition': ['triage', 'role_split', 'monitoring'],
  'p-disclosure-boundary': ['consent', 'role_split'],
  'p-mental-fluctuation-plan': ['consent', 'case_conference', 'monitoring'],
};

export const REGIONAL_ROUTING_LABEL = {
  keep_in_card: 'カード内に残す',
  move_to_shared_layer: '共通レイヤーで扱う',
  move_to_separate_guide: '別ガイドで扱う',
};
