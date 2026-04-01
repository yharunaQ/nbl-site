export type TagGroupKey = 'situation' | 'task' | 'symptom' | 'environment' | 'preference';

export type TagGroupDefinition = {
  key: TagGroupKey;
  label: string;
  description: string;
  tags: string[];
};

// Tags are a consultation-entry taxonomy, not a diagnosis catalog.
// Each tag should represent a condition that changes follow-up questions,
// accommodation design, or support linkage.
export const TAG_GROUP_DEFINITIONS: TagGroupDefinition[] = [
  {
    key: 'situation',
    label: '今の状況',
    description: '現在どの段階にあるか',
    tags: [
      '就職活動中（求人探し・応募・面接）',
      '就職準備中（支援機関利用・手帳取得中）',
      '在職中（現職での困りごと）',
      '休職中・復職を検討している',
      '離職後・次のステップを考えている',
    ],
  },
  {
    key: 'task',
    label: 'タスク条件（活動・参加）',
    description: '職業場面での困難が出やすいタスク・勤務条件・安全条件',
    tags: [
      '集中作業・思考作業',
      '会議・対話',
      '文章作成・読解',
      'マルチタスク・切替',
      '対人調整・感情労働',
      '移動・外出・現場',
      '身体操作・実作業負荷（立位・運搬・手作業）',
      '安全・危険業務・緊急対応',
      '時間制約・納期',
      '勤務時間・勤務日数（フルタイム/短時間）',
      'シフト・夜勤・勤務時刻',
      '残業・連続勤務',
      '画面作業（視認性/長時間PC）',
      '反復手順作業（工程順守・確認）',
      '接客・電話・窓口対応',
      '記憶保持が必要な作業（抜け漏れリスク）',
    ],
  },
  {
    key: 'symptom',
    label: '症状像（心身機能）',
    description: '体調・認知・感覚などの影響が出る領域',
    tags: [
      '疲労・倦怠（慢性疲労含む）',
      '痛み・体調変動（波がある）',
      '注意集中の波・認知負荷',
      '不安・緊張・メンタル負荷',
      '感覚過敏（音・光・温度）',
      '視覚負荷（見えづらさ/眼精疲労）',
      '聴覚負荷（聞き取り困難/雑音）',
      '睡眠リズム・通院/治療スケジュール',
      '精神症状の波（気分・幻覚妄想・陰性症状等）',
      '発達特性（切替・実行機能・段取り）',
      '知的特性（理解速度・手順保持）',
      '高次脳機能（記憶・注意・遂行）',
      '内部障害（透析・循環器・呼吸器等）',
      '難病・慢性疾患（指定難病・免疫疾患等）',
      '発作・急変リスク（てんかん等）',
    ],
  },
  {
    key: 'environment',
    label: '環境条件（環境因子）',
    description: '働く環境や設備・制度・情報運用に関する条件',
    tags: [
      '騒音・音環境',
      '光・画面の明るさ/反射',
      '温度・空調',
      '姿勢・椅子・机（エルゴノミクス）',
      '作業スペース/動線',
      '同席人数・密度',
      '指示・連絡の明確さ（手順書/見本/確認）',
      'リモート/出社',
      '休憩の取りやすさ・休養導線',
      '通勤負荷（時間/混雑/距離）',
      '段差・エレベータ・トイレ等の物理アクセス',
      '字幕・文字起こし・テキスト連絡導線',
      '機器/ソフトのアクセシビリティ（読み上げ・拡大等）',
    ],
  },
  {
    key: 'preference',
    label: '本人の希望（個人要因）',
    description: '守りたいこと・受け入れやすい配慮',
    tags: [
      '役割・専門性を維持したい',
      '成長機会・挑戦を続けたい',
      '生活リズムを守りたい',
      '収入・雇用条件を守りたい',
      '対人関係の安定を重視',
      '裁量・自己決定を重視',
    ],
  },
];

export const TAG_GROUPS = Object.fromEntries(
  TAG_GROUP_DEFINITIONS.map((group) => [group.key, group.tags]),
) as Record<TagGroupKey, string[]>;

export const TAG_TAXONOMY_PRINCIPLES = [
  'タグは診断名の列挙ではなく、支援設計が変わる条件を優先する。',
  '候補タグは ICF の相互作用を意識して、situation / task / symptom / environment / preference の5面で持つ。',
  '新しいタグは、26フレーム・guidebook・data2・web/web-cache・support catalog の複数層で再帰的に現れる論点を優先する。',
  '代表性は「頻度」だけでなく、「追加質問・個別調整・支援連携を変えるか」で判定する。',
  '勤務時間・勤務日数・シフト・残業は、就労成立条件を変えるため独立タグとして扱う。',
  '安全条件・身体負荷・指示の明確さのように、就業可否や実行方法を変える論点は他タグへ埋もれさせない。',
  'Step 2 のタグは粗い入口にとどめ、細かな運用条件や制度詳細は Step 3 以降で確認する。',
];
