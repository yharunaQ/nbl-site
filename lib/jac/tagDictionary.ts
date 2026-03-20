export type TagGroupKey = 'task' | 'symptom' | 'environment' | 'preference';

export type TagSuggestion = {
  tag: string;
  reason: string;
  score: number;
};

export const TAG_GROUPS: Record<TagGroupKey, string[]> = {
  task: [
    '集中作業・思考作業',
    '会議・対話',
    '文章作成・読解',
    'マルチタスク・切替',
    '対人調整・感情労働',
    '移動・外出・現場',
    '時間制約・納期',
    '画面作業（視認性/長時間PC）',
  ],
  symptom: [
    '疲労・倦怠（慢性疲労含む）',
    '痛み・体調変動（波がある）',
    '注意集中の波・認知負荷',
    '不安・緊張・メンタル負荷',
    '感覚過敏（音・光・温度）',
    '視覚負荷（見えづらさ/眼精疲労）',
    '聴覚負荷（聞き取り困難/雑音）',
    '睡眠リズム・通院/治療スケジュール',
  ],
  environment: [
    '騒音・音環境',
    '光・画面の明るさ/反射',
    '温度・空調',
    '姿勢・椅子・机（エルゴノミクス）',
    '作業スペース/動線',
    '同席人数・密度',
    'リモート/出社',
    '休憩の取りやすさ・休養導線',
    '通勤負荷（時間/混雑/距離）',
  ],
  preference: [
    '役割・専門性を維持したい',
    '成長機会・挑戦を続けたい',
    '生活リズムを守りたい',
    '収入・雇用条件を守りたい',
    '対人関係の安定を重視',
    '裁量・自己決定を重視',
  ],
};

export const FALLBACK_HINTS: Array<{
  keyword: string;
  group: TagGroupKey;
  tag: string;
  reason: string;
}> = [
  { keyword: '会議', group: 'task', tag: '会議・対話', reason: '会議場面の負荷が直接言及されているため' },
  { keyword: '集中', group: 'task', tag: '集中作業・思考作業', reason: '集中力の維持困難が示唆されるため' },
  { keyword: '締切', group: 'task', tag: '時間制約・納期', reason: '時間制約が困難要因として想定されるため' },
  {
    keyword: '疲労',
    group: 'symptom',
    tag: '疲労・倦怠（慢性疲労含む）',
    reason: '疲労症状が明示されているため',
  },
  {
    keyword: '痛み',
    group: 'symptom',
    tag: '痛み・体調変動（波がある）',
    reason: '身体症状の変動が示唆されるため',
  },
  {
    keyword: '腰痛',
    group: 'symptom',
    tag: '痛み・体調変動（波がある）',
    reason: '局所痛の言及があるため',
  },
  {
    keyword: 'ろうあ',
    group: 'symptom',
    tag: '聴覚負荷（聞き取り困難/雑音）',
    reason: '聴覚情報アクセスの困難が示唆されるため',
  },
  {
    keyword: '聞こえ',
    group: 'symptom',
    tag: '聴覚負荷（聞き取り困難/雑音）',
    reason: '聞き取り困難が示唆されるため',
  },
  {
    keyword: '注意欠陥',
    group: 'symptom',
    tag: '注意集中の波・認知負荷',
    reason: '注意制御の困難が示唆されるため',
  },
  {
    keyword: '多動',
    group: 'symptom',
    tag: '注意集中の波・認知負荷',
    reason: '認知負荷と切替困難が示唆されるため',
  },
  { keyword: '不安', group: 'symptom', tag: '不安・緊張・メンタル負荷', reason: '心理的負荷が記載されているため' },
  { keyword: '音', group: 'environment', tag: '騒音・音環境', reason: '音環境の調整ニーズがあるため' },
  {
    keyword: '光',
    group: 'environment',
    tag: '光・画面の明るさ/反射',
    reason: '視覚刺激調整の必要性があるため',
  },
  {
    keyword: '通院',
    group: 'symptom',
    tag: '睡眠リズム・通院/治療スケジュール',
    reason: '通院と就労調整が必要なため',
  },
  { keyword: 'リモート', group: 'environment', tag: 'リモート/出社', reason: '勤務形態調整の示唆があるため' },
  { keyword: '在宅', group: 'environment', tag: 'リモート/出社', reason: '勤務場所調整の示唆があるため' },
  { keyword: '休憩', group: 'environment', tag: '休憩の取りやすさ・休養導線', reason: '休養導線が重要なため' },
  { keyword: '休み', group: 'environment', tag: '休憩の取りやすさ・休養導線', reason: '休養確保ニーズが示唆されるため' },
  {
    keyword: '成長',
    group: 'preference',
    tag: '成長機会・挑戦を続けたい',
    reason: 'キャリア志向が示されているため',
  },
  {
    keyword: '収入',
    group: 'preference',
    tag: '収入・雇用条件を守りたい',
    reason: '雇用条件維持が重視されているため',
  },
  {
    keyword: '裁量',
    group: 'preference',
    tag: '裁量・自己決定を重視',
    reason: '自己決定性を重視しているため',
  },
  {
    keyword: '対人調整',
    group: 'preference',
    tag: '対人関係の安定を重視',
    reason: '対人面の安定化ニーズが示唆されるため',
  },
];

export const TAG_SIGNAL_RULES: Array<{
  group: TagGroupKey;
  tag: string;
  patterns: string[];
  boost?: number;
}> = [
  { group: 'task', tag: '会議・対話', patterns: ['会議', '打合せ', '面談', 'コミュニケーション', '会話', '議論'] },
  { group: 'task', tag: '集中作業・思考作業', patterns: ['集中', '考える', '思考', '頭が回ら', '判断'] },
  { group: 'task', tag: '文章作成・読解', patterns: ['文章', '資料', '読解', 'メール', '文書'] },
  { group: 'task', tag: 'マルチタスク・切替', patterns: ['同時', '切替', '並行', '複数業務'] },
  { group: 'task', tag: '時間制約・納期', patterns: ['納期', '締切', '急ぎ', '期限', '応募', '求人'] },
  { group: 'task', tag: '移動・外出・現場', patterns: ['移動', '外出', '出張', '現場'] },
  { group: 'task', tag: '画面作業（視認性/長時間PC）', patterns: ['pc', '画面', 'モニタ', '目が疲れ'] },
  { group: 'task', tag: '対人調整・感情労働', patterns: ['調整', '対人', '気を遣', '感情', '言い方'] },
  { group: 'symptom', tag: '疲労・倦怠（慢性疲労含む）', patterns: ['疲労', '倦怠', 'だる', 'しんど', '消耗'] },
  {
    group: 'symptom',
    tag: '痛み・体調変動（波がある）',
    patterns: ['体調の波', '波が大き', '体調変動', '波がある', '体調が不安定', '痛み', '腰痛', '疼痛', 'しびれ', '痛む'],
    boost: 0.08,
  },
  {
    group: 'symptom',
    tag: '注意集中の波・認知負荷',
    patterns: ['集中が落ち', '認知負荷', '頭がぼんやり', '注意散漫', '注意欠陥', '多動性', '不注意', 'ミスが増え'],
  },
  { group: 'symptom', tag: '不安・緊張・メンタル負荷', patterns: ['不安', '緊張', 'ストレス', 'メンタル'] },
  { group: 'symptom', tag: '睡眠リズム・通院/治療スケジュール', patterns: ['睡眠', '通院', '治療', '服薬'] },
  { group: 'symptom', tag: '感覚過敏（音・光・温度）', patterns: ['過敏', '刺激に弱', '感覚'] },
  { group: 'symptom', tag: '視覚負荷（見えづらさ/眼精疲労）', patterns: ['見えづら', '眼精疲労', 'まぶし'] },
  {
    group: 'symptom',
    tag: '聴覚負荷（聞き取り困難/雑音）',
    patterns: ['聞き取り', '雑音', '騒がし', 'ろうあ', 'ろう', '聞こえない', '聴こえない', '電話対応が難し', '電話が難し'],
  },
  {
    group: 'environment',
    tag: 'リモート/出社',
    patterns: ['リモート', '在宅', '出社', '完全在宅', 'フルリモート'],
    boost: 0.05,
  },
  {
    group: 'environment',
    tag: '休憩の取りやすさ・休養導線',
    patterns: ['休憩', '短時間', '時短', '休みながら', '休みの取りやす', '休みを取りやす', '休養', '休息'],
  },
  { group: 'environment', tag: '騒音・音環境', patterns: ['音', '騒音', 'うるさい'] },
  { group: 'environment', tag: '光・画面の明るさ/反射', patterns: ['光', '明るさ', '反射', 'まぶしい'] },
  { group: 'environment', tag: '温度・空調', patterns: ['温度', '空調', '暑い', '寒い'] },
  { group: 'environment', tag: '姿勢・椅子・机（エルゴノミクス）', patterns: ['椅子', '姿勢', '机', '腰痛'] },
  { group: 'environment', tag: '作業スペース/動線', patterns: ['スペース', '動線', '座席配置'] },
  { group: 'environment', tag: '同席人数・密度', patterns: ['人数', '密度', '人が多い'] },
  { group: 'environment', tag: '通勤負荷（時間/混雑/距離）', patterns: ['通勤', '混雑', '距離', '満員電車'] },
  { group: 'preference', tag: '生活リズムを守りたい', patterns: ['生活リズム', '無理なく', '安定して働きたい'] },
  { group: 'preference', tag: '収入・雇用条件を守りたい', patterns: ['収入', '雇用条件', '給与', '契約'] },
  { group: 'preference', tag: '成長機会・挑戦を続けたい', patterns: ['成長', '挑戦', 'キャリア'] },
  { group: 'preference', tag: '裁量・自己決定を重視', patterns: ['自己決定', '裁量', '自分で決めたい'] },
  {
    group: 'preference',
    tag: '対人関係の安定を重視',
    patterns: ['対人関係', '人間関係', '言い方', '伝え方', '対人調整', '会話が難し', '伝わりにく', '議論が難し'],
  },
  { group: 'preference', tag: '役割・専門性を維持したい', patterns: ['役割', '専門性', '強みを活かす'] },
];

export const STRONG_SIGNAL_RULES: Array<{
  patterns: string[];
  group: TagGroupKey;
  tag: string;
  reason: string;
  score: number;
}> = [
  {
    patterns: ['体調の波', '波が大き', '体調変動', '波がある'],
    group: 'symptom',
    tag: '痛み・体調変動（波がある）',
    reason: '体調の波に関する明示表現があるため',
    score: 0.96,
  },
  {
    patterns: ['腰痛', '疼痛', 'しびれ', '痛みが強い'],
    group: 'symptom',
    tag: '痛み・体調変動（波がある）',
    reason: '痛みの持続や増悪が明示されているため',
    score: 0.92,
  },
  {
    patterns: ['ろうあ', '聞こえない', '聴こえない', '電話対応が難し'],
    group: 'symptom',
    tag: '聴覚負荷（聞き取り困難/雑音）',
    reason: '聴覚アクセスの困難が就労条件に直結しているため',
    score: 0.95,
  },
  {
    patterns: ['注意欠陥', '多動性', '不注意', 'ミスが増え'],
    group: 'symptom',
    tag: '注意集中の波・認知負荷',
    reason: '注意制御の困難が直接記述されているため',
    score: 0.9,
  },
  {
    patterns: ['完全在宅', 'フルリモート', '在宅じゃないと', '在宅でないと'],
    group: 'environment',
    tag: 'リモート/出社',
    reason: '勤務場所条件（在宅）が就労成立条件として示されているため',
    score: 0.95,
  },
  {
    patterns: ['短時間', '時短', '短い時間', '短時間勤務'],
    group: 'environment',
    tag: '休憩の取りやすさ・休養導線',
    reason: '就業時間調整ニーズが明確なため',
    score: 0.9,
  },
  {
    patterns: ['休みの取りやすさ', '休みを取りやす', '休養が必要', '休息が必要'],
    group: 'environment',
    tag: '休憩の取りやすさ・休養導線',
    reason: '休養確保が就労継続の前提として示されているため',
    score: 0.88,
  },
  {
    patterns: ['求人', '探し方', '就職活動', '応募'],
    group: 'task',
    tag: '時間制約・納期',
    reason: '就職活動の段取り・進行管理ニーズがあるため',
    score: 0.78,
  },
  {
    patterns: ['一緒に整理', '相談したい', '言い方', '伝え方'],
    group: 'preference',
    tag: '対人関係の安定を重視',
    reason: 'コミュニケーションの安定化を重視しているため',
    score: 0.75,
  },
  {
    patterns: ['伝わりにくい', '対人調整', '会話や議論で意図が伝わりにくい'],
    group: 'preference',
    tag: '対人関係の安定を重視',
    reason: '対人相互理解の安定化ニーズが明示されているため',
    score: 0.82,
  },
];
