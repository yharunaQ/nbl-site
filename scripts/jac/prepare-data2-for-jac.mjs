#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const data2Dir = path.join(rootDir, 'references', 'data2');

const data2RawDir = path.join(data2Dir, 'raw');
const data2SanitizedDir = path.join(data2Dir, 'sanitized');

const chishikiInputCandidates = [path.join(data2RawDir, 'chishikiOut'), path.join(data2Dir, 'chishikiOut')];
const kijutsuInputCandidates = [path.join(data2RawDir, 'kijutsuOut'), path.join(data2Dir, 'kijutsuOut')];

const chishikiOutputDir = path.join(data2SanitizedDir, 'chishiki');
const kijutsuOutputDir = path.join(data2SanitizedDir, 'kijutsu');
const chishikiLegacyOutputDir = path.join(data2Dir, 'chishikiOut_jac');
const kijutsuLegacyOutputDir = path.join(data2Dir, 'kijutsuOut_jac');

const shiftJisDecoder = new TextDecoder('shift_jis', { fatal: false });

const prefNames = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

const prefStemNames = [
  '北海道',
  '青森',
  '岩手',
  '宮城',
  '秋田',
  '山形',
  '福島',
  '茨城',
  '栃木',
  '群馬',
  '埼玉',
  '千葉',
  '東京',
  '神奈川',
  '新潟',
  '富山',
  '石川',
  '福井',
  '山梨',
  '長野',
  '岐阜',
  '静岡',
  '愛知',
  '三重',
  '滋賀',
  '京都',
  '大阪',
  '兵庫',
  '奈良',
  '和歌山',
  '鳥取',
  '島根',
  '岡山',
  '広島',
  '山口',
  '徳島',
  '香川',
  '愛媛',
  '高知',
  '福岡',
  '佐賀',
  '長崎',
  '熊本',
  '大分',
  '宮崎',
  '鹿児島',
  '沖縄',
];

const institutionSuffixes = [
  '病院',
  '診療所',
  'クリニック',
  '大学',
  '学校',
  'センター',
  '福祉センター',
  'リハビリセンター',
  '職業センター',
  '支援センター',
  '支援室',
  '相談室',
  '作業所',
  '授産所',
  '寮',
  '協会',
  '役所',
  '役場',
  '県庁',
  '工房',
  '友の会',
  'ハローワーク',
];

const genericInstitutionTerms = new Set([
  '病院',
  '診療所',
  'クリニック',
  '大学',
  '学校',
  'センター',
  '福祉センター',
  'リハビリセンター',
  '職業センター',
  '支援センター',
  '支援室',
  '相談室',
  '作業所',
  '授産所',
  '寮',
  '協会',
  '役所',
  '役場',
  '県庁',
  '工房',
  '友の会',
  'ハローワーク',
  '市役所',
  '区役所',
  '保健所',
]);

const regionSkipWords = new Set(['市町村', '都道府県', '地域', '各県', '各市町村', '全国']);
const institutionSensitiveSections = new Set(['##就労相談先', '##具体的な就労支援内容']);

const knownInstitutionNames = [
  'テンプスタッフフロンティア',
  'マースエンジニアリング',
  'コロポックル',
  'ワークセラー',
  '南フレンド',
];

const genericInstitutionWords = new Set([
  'ハローワーク',
  'ジョブコーチ',
  'デイケア',
  'デイサービス',
  'グループホーム',
  'ケースワーカー',
  'ソーシャルワーカー',
  'カウンセリング',
  'リハビリ',
  'トライアル',
  'トライアル雇用',
  'サポート',
  'フォロー',
  'サービス',
  'スタッフ',
  'センター',
  'クリニック',
  'スクール',
  'スーパー',
  'コンビニ',
  'キャリア',
  'キャリアアップ',
]);

const institutionNameHintRegex = /(フロンティア|エンジニアリング|ワークセラー|フレンド|コロポックル)$/;
const standaloneLocationNames = [
  '郡山',
  '御殿場',
  '札幌',
  '仙台',
  '横浜',
  '川崎',
  '名古屋',
  '神戸',
  '広島',
  '福岡',
  '北九州',
  '熊本',
];

function normalizeText(text) {
  return text.replace(/\r\n?/g, '\n');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sortNumericByFileName(files) {
  return [...files].sort((a, b) => {
    const aNum = Number(a.match(/\d+/)?.[0] || 0);
    const bNum = Number(b.match(/\d+/)?.[0] || 0);
    return aNum - bNum;
  });
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function resolveFirstExistingDir(candidates, label) {
  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate;
    }
  }
  throw new Error(`${label} input directory not found. checked: ${candidates.join(', ')}`);
}

function readShiftJisFile(buffer) {
  return normalizeText(shiftJisDecoder.decode(buffer));
}

function extractNameFromChishikiHeader(headerLine) {
  const match = headerLine.match(/「(.+?)」で多い職業的課題/);
  return match ? match[1].trim() : '不明';
}

function canonicalSupportKey(label) {
  return label.replace(/\(要確認\)|（要確認）/g, '').replace(/\s+/g, '').trim();
}

const ISSUE_DOMAIN_RULES = [
  {
    domain: 'communication',
    keywords: ['会話', '議論', '意思を伝える', '説明', 'アピール', '説得', '連絡', '申し込み', '面接'],
  },
  {
    domain: 'reading_writing',
    keywords: ['書類', '本', '説明書', '文章', '読む', '書く', '入力', '画面'],
  },
  {
    domain: 'mobility_operation',
    keywords: ['移動', '乗り物', '操作', '通勤', '外出', '現場', '危険'],
  },
  {
    domain: 'time_stamina',
    keywords: ['フルタイム', '週20時間', '長時間', '労働', '残業', '通院', '疲労'],
  },
  {
    domain: 'interpersonal',
    keywords: ['人間関係', '同僚', '上司', 'お客', '職場内', '対人', 'ストレス'],
  },
  {
    domain: 'career_income',
    keywords: ['収入', '報酬', '賃金', '昇進', 'キャリア', '就職', '職業的課題', '仕事'],
  },
];

const DISABILITY_PROFILES = [
  {
    name: '視覚アクセス特性',
    patterns: ['全盲', '弱視', '視覚', '視野', '網膜', '黄斑', '緑内障', '白内障'],
    base:
      '視覚情報へのアクセスに追加の変換（音声化・触知化・拡大）が必要な場面では、情報取得の速度と確実性が低下しやすい。',
    environment:
      '照明・画面設計・文書形式が合わない場合に負荷が増幅しやすく、同じ業務でも環境条件で難易度が大きく変わる。',
    overlays: {
      communication:
        '非言語情報（表情・視線・資料位置）に依存するやり取りでは、確認工程が増えて意図共有に時間がかかりやすい。',
      reading_writing:
        '文書読解や画面確認は代替手段の有無により所要時間が変動し、誤読リスク管理が課題化しやすい。',
      mobility_operation: '移動・操作場面では安全確認の手順が増え、導線設計の不足が業務遂行に影響しやすい。',
    },
  },
  {
    name: '聴覚アクセス特性',
    patterns: ['ろう', 'ろうあ', '難聴', '聴覚', '中途聴覚'],
    base:
      '音声中心の情報伝達では取りこぼしが発生しやすく、確認や再質問の回数が増えると認知負荷が上がりやすい。',
    environment:
      '騒音・話者距離・話速・同時発話の影響を受けやすく、情報保障の設計次第で難易度が大きく変わる。',
    overlays: {
      communication:
        '会議・電話・口頭指示の場面では情報欠落が起こりやすく、文字化や議事録がないと合意形成が遅れやすい。',
      interpersonal: '雑談や非公式連絡にアクセスしにくいと、関係形成と心理的安全性に影響しやすい。',
    },
  },
  {
    name: '精神・情動調整特性',
    patterns: ['うつ', '双極', 'そううつ', '不安障害', 'パニック', '統合失調', '適応障害', '気分障害'],
    base: 'ストレス反応や覚醒水準の変動が課題発現に影響しやすく、負荷の急変時に遂行安定性が下がりやすい。',
    environment:
      '評価不確実性・対人緊張・納期圧が重なると症状が増幅しやすく、同じ人でも時期・職場条件で結果が変わりやすい。',
    overlays: {
      communication: '高緊張時には自己開示や配慮依頼の難易度が上がり、必要支援の調整が遅れやすい。',
      interpersonal: '関係調整の負荷が継続すると回復リソースが減り、就労継続の不安定化につながりやすい。',
      time_stamina: '長時間・高密度業務では回復時間が不足し、翌日の遂行能力にも影響しやすい。',
    },
  },
  {
    name: '発達・神経認知特性',
    patterns: ['発達障害', 'アスペルガー', '自閉', 'ADHD', '注意欠陥', '学習障害', '高次脳', 'てんかん'],
    base:
      '注意配分・情報整理・実行機能の特性差により、業務要求とのミスマッチがあるとエラーや遅延が生じやすい。',
    environment:
      'マルチタスク・曖昧指示・刺激過多の環境で負荷が上がりやすく、手順明確化の有無で安定性が変わりやすい。',
    overlays: {
      communication: '暗黙ルール中心の対話では意図解釈のズレが起きやすく、明文化がないと調整負荷が増えやすい。',
      reading_writing: '情報量が多い文書や優先順位不明の指示では処理負荷が上がり、抜け漏れが発生しやすい。',
      time_stamina: '切替頻度が高い業務では注意資源が枯渇しやすく、作業ペースの維持が難しくなりやすい。',
    },
  },
  {
    name: '肢体・動作特性',
    patterns: ['肢体', '切断', '麻痺', '車いす', '義足', '義手', '脊髄', '筋ジストロ', 'リウマチ'],
    base: '姿勢保持・移動・反復動作の負荷が蓄積しやすく、業務設計が合わないと疼痛や疲労が増えやすい。',
    environment: '動線・段差・作業台高さ・道具配置の影響を受けやすく、環境調整で遂行性が大きく変わりやすい。',
    overlays: {
      mobility_operation: '移動や機器操作を伴う業務では身体負荷が集中しやすく、代替手段の有無が成果に直結しやすい。',
      time_stamina: '連続作業が長いと負荷が累積し、休憩設計が不足するとパフォーマンス低下が起こりやすい。',
    },
  },
  {
    name: '内部・慢性疾患特性',
    patterns: [
      '内部障害',
      '人工弁',
      '心臓',
      '心不全',
      '呼吸',
      '腎',
      '透析',
      '膠原病',
      'エリテマトーデス',
      'クローン',
      '潰瘍性',
      '難病',
    ],
    base: '外見から把握しにくい症状変動や易疲労があり、負荷の配分が合わないと就労継続が不安定になりやすい。',
    environment:
      '温度変化・長時間労働・通院制約が重なると悪化しやすく、勤務設計と医療管理の連動が結果を左右しやすい。',
    overlays: {
      time_stamina: '就業時間と通院・治療スケジュールが衝突すると回復機会が不足し、継続困難が起きやすい。',
      career_income: '体調変動に合わせた就業制約により、昇進・収入機会が縮小しやすい構造が生まれやすい。',
    },
  },
  {
    name: '知的・意思疎通支援特性',
    patterns: ['知的障害', '療育手帳', 'B1', 'B2'],
    base: '抽象度の高い指示や急な変更は理解負荷が高く、支援密度が不足すると遂行が不安定になりやすい。',
    environment:
      '説明速度・手順可視化・支援者の同席有無によって理解と定着が変化し、同一課題でも成果差が出やすい。',
    overlays: {
      communication: '説明の分かりやすさと確認手順が不足すると、意思伝達の成功率が下がりやすい。',
      career_income: 'ジョブコーチ等の継続支援がないと、適職定着や賃金改善まで到達しにくい。',
    },
  },
];

function inferIssueDomains(issue) {
  const domains = [];
  for (const rule of ISSUE_DOMAIN_RULES) {
    if (rule.keywords.some((keyword) => issue.includes(keyword))) {
      domains.push(rule.domain);
    }
  }
  return domains.length > 0 ? domains : ['career_income'];
}

function inferDisabilityProfiles(disabilityName) {
  const matched = DISABILITY_PROFILES.filter((profile) =>
    profile.patterns.some((pattern) => disabilityName.includes(pattern)),
  );
  if (matched.length > 0) return matched;
  return [
    {
      name: '一般就労調整特性',
      base: '個人特性と業務要求のミスマッチがあると、課題が顕在化しやすい。',
      environment: '業務設計・職場環境・支援体制の違いで、同じ課題でも発生頻度と重さが変動しやすい。',
      overlays: {},
    },
  ];
}

function inferDisabilityHypotheses(issue, disabilityName) {
  const domains = inferIssueDomains(issue);
  const profiles = inferDisabilityProfiles(disabilityName).slice(0, 2);
  const first = profiles[0];

  const overlayText = domains.map((domain) => first.overlays?.[domain]).find(Boolean);
  const hypothesisA = `仮説A（機能面）: ${overlayText || first.base}`;
  const hypothesisB = `仮説B（環境面）: ${first.environment} そのため「${issue}」は、職務設計・環境調整・支援量で軽重が変わりやすい。`;
  return [hypothesisA, hypothesisB];
}

function inferIssueMechanism(issue) {
  const rules = [
    {
      keywords: ['収入', '報酬', '賃金', '処遇'],
      text: '賃金水準・労働時間・役割拡大の機会が不足すると、生活を支える収入の確保が難しくなりやすい。',
    },
    {
      keywords: ['フルタイム', '週20時間', '長時間', '労働'],
      text: '体調や機能と勤務条件が合わないと、必要な労働時間を安定して満たしにくくなる。',
    },
    {
      keywords: ['希望の仕事', '能力を身につける', '能力を発揮', '情報を集める', '実習', '見学', '起業'],
      text: '職務情報や準備機会が不足すると、本人特性に合う仕事とのマッチングが進みにくくなる。',
    },
    {
      keywords: ['誤解されず', '配慮等を伝える', 'アピール', '意思を伝える', '説得', '連絡・申し込み'],
      text: '障害特性を伝える手段が不足すると、必要な配慮の合意形成が難しくなりやすい。',
    },
    {
      keywords: ['ストレス', '会話', '議論', '人間関係', 'コミュニケーション'],
      text: '対人調整の負荷や誤解が蓄積すると、心理的負担が増えて就労継続が不安定になりやすい。',
    },
    {
      keywords: ['自己管理', '適切な管理', '自信', '実行する', '人生・生活の展望'],
      text: '症状変動への対応手段が不足すると、自己効力感が下がり、行動選択の幅が狭まりやすい。',
    },
    {
      keywords: ['地域で安心', '満足できる生活', '社会に役立つ', '社会参加'],
      text: '就労と生活基盤が分断されると、生活満足度や社会参加の実感が低下しやすい。',
    },
    {
      keywords: ['操作', '移動', '乗り物', '文章を書く', '判断'],
      text: '作業環境や手段が本人特性に合わないと、実作業の安全性と遂行性が下がりやすい。',
    },
  ];

  return (
    rules.find((rule) => rule.keywords.some((keyword) => issue.includes(keyword)))?.text ||
    '個人の状態と業務・環境・支援のミスマッチが重なると、この課題が表面化しやすい。'
  );
}

function inferSupportEffect(support) {
  const rules = [
    {
      keywords: [
        '通院への配慮',
        '服薬',
        '健康状態チェック',
        '健康管理',
        '産業医',
        '主治医',
        '専門医',
        'リハビリ',
        '自己管理',
      ],
      effect: '症状悪化や再発リスクの早期把握と対処を可能にし、離職リスクを下げやすくなる',
    },
    {
      keywords: [
        '就職先のあっせん',
        'ハローワーク',
        '相談窓口',
        '就労相談',
        '職業相談',
        'カウンセリング',
        '求人票',
        '面接',
        '履歴書',
        '説明会',
        '進路支援',
        '職業能力の評価',
        'テスト',
        '職場見学',
        '職場実習',
        'トライアル雇用',
      ],
      effect:
        '求人情報・応募準備・職務マッチングへのアクセスを補い、採用や配置の機会を増やしやすくなる',
    },
    {
      keywords: [
        '資格取得支援',
        '技能訓練',
        '職業スキル',
        '研修',
        'オンザジョブトレーニング',
        '作業マニュアル',
      ],
      effect: '必要スキルの獲得を促し、担当可能業務の幅を広げやすくなる',
    },
    {
      keywords: [
        '仕事の内容や仕方の個別的な調整',
        '能力的に無理のない仕事への配置',
        '業務内容を改善',
        '短時間勤務',
        '勤務時間帯の変更',
        '在宅勤務',
        '休憩をとりやすくする',
        '作業補助',
      ],
      effect: '業務負荷と体調・機能のミスマッチを減らし、就労継続の安定性を高めやすくなる',
    },
    {
      keywords: [
        '上司・同僚',
        '相談にのってくれる',
        '偏見・差別防止',
        'コミュニケーション',
        '専任の相談員',
        'ジョブコーチ',
        'ケース会議',
        '家族や親戚',
        '団体',
        '親睦活動',
      ],
      effect: '周囲の理解不足や孤立を軽減し、必要な配慮調整と心理的安全性を確保しやすくなる',
    },
    {
      keywords: [
        '機器',
        '道具',
        '環境整備',
        '施設改善',
        '手すり',
        '通路',
        'トイレ',
        'スロープ',
        'ユニバーサルデザイン',
        '手話通訳',
        '介助者',
      ],
      effect: '物理的・情報的バリアを下げ、作業遂行の実行可能性を高めやすくなる',
    },
    {
      keywords: ['手帳保有', '障害判定', '雇用率制度'],
      effect: '制度利用要件を満たし、利用できる支援や雇用枠の選択肢を広げやすくなる',
    },
    {
      keywords: ['就職後の日常生活', '地域生活の支援', '生活リズムや労働習慣'],
      effect: '就労外の生活基盤を整え、勤務継続に必要な体力・時間の余力を確保しやすくなる',
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((keyword) => support.includes(keyword))) {
      return rule.effect;
    }
  }
  return '課題の背景にある業務・環境・情報不足を補い、負荷を下げながら対応手段を増やしやすくなる';
}

function parseChishikiEntries(content) {
  const lines = content.split('\n');
  const entries = [];

  for (const line of lines) {
    if (!line.startsWith('##')) continue;
    const match = line.match(/^##「(.+?)」の問題の軽減に関係する支援や配慮：(.+)$/);
    if (!match) continue;

    const issue = match[1].trim();
    const right = match[2].trim();
    const supportMatches = [...right.matchAll(/「([^」]+)」/g)].map((m) => m[1].trim());
    const supportLabels =
      supportMatches.length > 0
        ? supportMatches
        : right
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

    const seen = new Set();
    const deduped = [];
    for (const label of supportLabels) {
      const key = canonicalSupportKey(label);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      deduped.push(label);
    }

    entries.push({ issue, supports: deduped });
  }

  return entries;
}

function buildChishikiOutput({ id, disabilityName, entries }) {
  const out = [];

  out.push('#JAC活用向け再整理（因果仮説）');
  out.push(`##障害種類番号: ${id}`);
  out.push(`##機能障害・疾病: 「${disabilityName}」`);
  out.push('');
  out.push('##位置づけ');
  out.push(
    '- 本文は、選択式回答で観測された「課題と支援の関連」を、JACで使いやすい因果仮説に言い換えたものです。',
  );
  out.push(
    '- 確定的な因果ではありません。実務では、本人の状態・業務内容・職場環境・既存支援の確認を前提にしてください。',
  );
  out.push(
    '- 差別・偏見を避けるため、障害名のみでの判断は行わず、状況要因（人・仕事・環境・支援・時間）を併せて確認してください。',
  );
  out.push('');
  out.push('##課題ごとの因果仮説');

  if (entries.length === 0) {
    out.push('- この障害種類番号では、選択式データ上の対応行が確認できませんでした。');
    out.push('- 追加データ（自由記述・面談情報）を優先して仮説を補強してください。');
    return `${out.join('\n')}\n`;
  }

  entries.forEach((entry, index) => {
    const hypotheses = inferDisabilityHypotheses(entry.issue, disabilityName);
    out.push('');
    out.push(`### ${index + 1}. 課題: ${entry.issue}`);
    out.push(`- 想定される要因: ${inferIssueMechanism(entry.issue)}`);
    out.push('- 機能障害・疾病からの補助仮説:');
    hypotheses.forEach((hypothesis) => {
      out.push(`  - ${hypothesis}`);
    });
    out.push('- 関係しやすい支援と作用仮説:');
    entry.supports.forEach((support) => {
      const effect = inferSupportEffect(support);
      out.push(
        `  - 「${support}」により、${effect}ため、「${entry.issue}」の軽減につながる可能性がある。`,
      );
    });
    out.push('- 追加確認事項:');
    out.push(
      '  - person: 症状変動・強み・希望、job: 必須業務と許容誤差、environment: 感覚/対人/物理環境を確認する。',
    );
    out.push(
      '  - support: 既に試した配慮の効果と副作用、time: 悪化/回復の周期、institution/evidence: 制度条件と根拠の鮮度を確認する。',
    );
  });

  return `${out.join('\n')}\n`;
}

function anonymizeKijutsuText(content) {
  const prefRegex = new RegExp(prefNames.join('|'), 'g');
  const prefStemRegex = new RegExp(prefStemNames.join('|'), 'g');
  const cityRegex = /[一-龥々]{2,12}(?:市|区|町|村)/g;
  const kanaCityRegex = /(?<![ぁ-んァ-ヶー])[ぁ-んァ-ヶー]{2,12}市/g;
  const personRegex =
    /[（(]?[一-龥々ぁ-んァ-ヶA-Za-z]{1,12}(?:先生|医師)(?:・[一-龥々ぁ-んァ-ヶA-Za-z]{1,12}(?:先生|医師))*[）)]?/g;
  const instRegex = new RegExp(
    `([A-Za-z0-9一-龥々ァ-ヶ・ー－]{1,30})(${institutionSuffixes.join('|')})`,
    'g',
  );
  const companyRegex = /(?:株式会社|有限会社|合同会社|（株）)[^、。\s]{1,30}/g;
  const namedInstitutionRegex =
    /[A-Za-z0-9一-龥々ァ-ヶ・ー－]{2,30}(?:医大|医科大学|歯科大学|技術専門校|テクノカレッジ|職業能力開発校)/g;
  const addressRegex =
    /[一-龥々ぁ-んァ-ヶー]{2,30}[0-9０-９]{1,4}[－-][0-9０-９]{1,4}[－-][0-9０-９]{1,4}/g;
  const buildingRegex = /[A-Za-z0-9一-龥々ァ-ヶー]{2,30}(?:ビル|マンション|ハイツ)\s*\d{0,3}F?/g;
  const standaloneLocationRegex = new RegExp(standaloneLocationNames.map(escapeRegex).join('|'), 'g');
  const genericInstitutionRegex =
    /^(盲学校|学校|大学|高校|高等学校|中学校|小学校|作業所|授産所|病院|クリニック|センター|支援センター|福祉センター|リハビリセンター|ハローワーク|保健所|市役所|区役所|県庁)$/;
  const genericInstitutionPrefixes = [
    '実際',
    '一般',
    '小規模',
    '指定',
    '地域活動',
    '生活支援',
    '就労支援',
    '職業訓練',
    '障害者福祉',
    '精神障害者',
    '身体障害者',
    '地域就労',
    '通院患者',
  ];
  const knownInstitutionRegex = new RegExp(knownInstitutionNames.map(escapeRegex).join('|'), 'g');
  const institutionContextRegex =
    /(^|[、。・\s])([A-Za-zＡ-Ｚａ-ｚ0-9０-９ァ-ヶー・]{4,40})(?=(?:（[^）]{0,30}）)?(?:の)?(?:就職先のあっせん|あっせん・紹介|職業あっせん|職業紹介|紹介|利用|相談先|窓口))/g;
  const institutionListRegex =
    /(^|[、。・\s])([A-Za-zＡ-Ｚａ-ｚ0-9０-９ァ-ヶー・]{4,40})(?=$|[、。・\s])/g;
  const institutionCueRegex = /(相談先|あっせん|紹介|窓口|支援|利用|連携)/;

  const lines = content.split('\n');
  const redactedLines = [];
  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('##')) currentSection = trimmed;
    let current = line;

    current = current.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[連絡先]');
    current = current.replace(/0\d{1,4}[-(]?\d{1,4}[-)]?\d{3,4}/g, '[連絡先]');
    current = current.replace(/〒?[0-9０-９]{3}[ -－]?[0-9０-９]{4}/g, '[住所]');
    current = current.replace(addressRegex, '[住所]');
    current = current.replace(buildingRegex, '[住所]');
    current = current.replace(/\[住所\]\s*[0-9０-９]{1,3}[FＦ]/g, '[住所]');
    current = current.replace(personRegex, '[担当者名]');
    current = current.replace(companyRegex, '[機関名]');
    current = current.replace(namedInstitutionRegex, '[機関名]');

    current = current.replace(instRegex, (match, prefix, suffix) => {
      const label = `${prefix}${suffix}`;
      if (
        genericInstitutionTerms.has(label) ||
        genericInstitutionRegex.test(label) ||
        genericInstitutionPrefixes.some((value) => prefix.startsWith(value))
      ) {
        return label;
      }
      return '[機関名]';
    });

    current = current.replace(prefRegex, '[地域名]');
    current = current.replace(prefStemRegex, '[地域名]');
    current = current.replace(standaloneLocationRegex, '[地域名]');
    current = current.replace(cityRegex, (match) => (regionSkipWords.has(match) ? match : '[地域名]'));
    current = current.replace(kanaCityRegex, (regionWord) => {
      if (regionSkipWords.has(regionWord)) return regionWord;
      return '[地域名]';
    });
    current = current.replace(knownInstitutionRegex, '[機関名]');

    if (institutionSensitiveSections.has(currentSection)) {
      current = current.replace(institutionContextRegex, (match, prefix, token) => {
        const name = token.trim();
        if (!name || genericInstitutionWords.has(name) || genericInstitutionTerms.has(name)) {
          return match;
        }
        if (institutionNameHintRegex.test(name) || /[A-Za-zＡ-Ｚａ-ｚ]/.test(name)) {
          return `${prefix}[機関名]`;
        }
        return match;
      });

      if (institutionCueRegex.test(current)) {
        current = current.replace(institutionListRegex, (match, prefix, token) => {
          const name = token.trim();
          if (!name || genericInstitutionWords.has(name) || genericInstitutionTerms.has(name)) {
            return match;
          }
          if (institutionNameHintRegex.test(name) || /[A-Za-zＡ-Ｚａ-ｚ]/.test(name)) {
            return `${prefix}[機関名]`;
          }
          return match;
        });
      }
    }

    current = current.replace(/\[機関名\](?:\s*\[機関名\])+/g, '[機関名]');

    redactedLines.push(current);
  }

  return `${redactedLines.join('\n')}\n`;
}

async function processChishikiFiles(inputDir, outputDirs) {
  const files = await fs.readdir(inputDir);
  const targetFiles = sortNumericByFileName(files.filter((f) => /^sogo\d+\.txt$/.test(f)));

  let written = 0;

  for (const file of targetFiles) {
    const filePath = path.join(inputDir, file);
    const id = Number(file.match(/\d+/)?.[0] || 0);
    const buffer = await fs.readFile(filePath);
    const text = readShiftJisFile(buffer);
    const lines = text.split('\n');
    const header = lines.find((line) => line.startsWith('#')) || '';
    const disabilityName = extractNameFromChishikiHeader(header);
    const entries = parseChishikiEntries(text);
    const output = buildChishikiOutput({ id, disabilityName, entries });

    for (const outputDir of outputDirs) {
      await fs.writeFile(path.join(outputDir, file), output, 'utf8');
    }
    written += 1;
  }

  return written;
}

async function processKijutsuFiles(inputDir, outputDirs) {
  const files = await fs.readdir(inputDir);
  const targetFiles = sortNumericByFileName(files.filter((f) => /^\d+\.txt$/.test(f)));

  let written = 0;

  for (const file of targetFiles) {
    const filePath = path.join(inputDir, file);
    const buffer = await fs.readFile(filePath);
    const text = readShiftJisFile(buffer);
    const sanitized = anonymizeKijutsuText(text);
    for (const outputDir of outputDirs) {
      await fs.writeFile(path.join(outputDir, file), sanitized, 'utf8');
    }
    written += 1;
  }

  return written;
}

async function main() {
  // If input directories don't exist (e.g. renamed to xx_data2/), skip gracefully.
  const chishikiExists = await chishikiInputCandidates.reduce(
    async (found, c) => (await found) || pathExists(c),
    Promise.resolve(false),
  );
  const kijutsuExists = await kijutsuInputCandidates.reduce(
    async (found, c) => (await found) || pathExists(c),
    Promise.resolve(false),
  );
  if (!chishikiExists && !kijutsuExists) {
    console.log(JSON.stringify({ message: 'data2 input directories not found — skipped.' }));
    return;
  }

  const chishikiInputDir = await resolveFirstExistingDir(chishikiInputCandidates, 'chishiki');
  const kijutsuInputDir = await resolveFirstExistingDir(kijutsuInputCandidates, 'kijutsu');

  const chishikiOutputDirs = [chishikiOutputDir, chishikiLegacyOutputDir];
  const kijutsuOutputDirs = [kijutsuOutputDir, kijutsuLegacyOutputDir];
  for (const dir of [...chishikiOutputDirs, ...kijutsuOutputDirs]) {
    await fs.mkdir(dir, { recursive: true });
  }

  const chishikiCount = await processChishikiFiles(chishikiInputDir, chishikiOutputDirs);
  const kijutsuCount = await processKijutsuFiles(kijutsuInputDir, kijutsuOutputDirs);

  console.log(
    JSON.stringify(
      {
        message: 'Prepared data2 files for JAC.',
        inputs: {
          chishiki: chishikiInputDir,
          kijutsu: kijutsuInputDir,
        },
        outputs: {
          canonical: {
            chishiki: chishikiOutputDir,
            kijutsu: kijutsuOutputDir,
          },
          legacyCompat: {
            chishiki: chishikiLegacyOutputDir,
            kijutsu: kijutsuLegacyOutputDir,
          },
        },
        counts: {
          chishiki: chishikiCount,
          kijutsu: kijutsuCount,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
