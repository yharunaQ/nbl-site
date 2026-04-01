#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';

const execFileAsync = promisify(execFile);

const projectRoot = '/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter';
const referencesRoot = path.join(projectRoot, 'references');
const sourcesConfigPath = path.join(projectRoot, 'config', 'knowledge-sources.json');
const outputDir = path.join(referencesRoot, 'index');
const recordsPath = path.join(outputDir, 'normalized-records.jsonl');
const manifestPath = path.join(outputDir, 'normalized-manifest.json');
const glmSignificantRelationsPath = path.join(
  referencesRoot,
  'GLM_resutls',
  'nanbyo-glm-significant-relations.json',
);

const allowedExtensions = new Set(['.txt', '.md', '.pdf', '.xlsm', '.sav']);
const textLikeExtensions = new Set(['.txt', '.md']);

const MODEL_SIGNAL_KEYWORDS = {
  difficulty_occurrence: {
    anchors: ['困難', '就労困難', 'difficulty', 'barrier', 'limitation', '仕事が難しい'],
    contexts: [
      '仕事内容',
      '職務',
      '業務',
      '配慮',
      '職場',
      '環境',
      'job',
      'task',
      'workplace',
      'accommodation',
    ],
  },
  difficulty_resolution: {
    anchors: [
      '解決',
      '改善',
      '軽減',
      '緩和',
      '解消',
      'solution',
      'resolve',
      'mitigation',
      'improve',
    ],
    contexts: ['配慮', '支援', '調整', '制度', 'accommodation', 'support', 'adjustment', 'policy'],
  },
  symptom_exacerbation: {
    anchors: ['症状', '悪化', '再燃', '疲労', '体調', 'flare', 'symptom', 'fatigue', 'worsen'],
    contexts: [
      '仕事内容',
      '勤務',
      '労働時間',
      '職場',
      '環境',
      '働き方',
      'job',
      'schedule',
      'work style',
      'workplace',
    ],
  },
  support_needs: {
    anchors: ['必要', 'ニーズ', '希望', '配慮希望', 'need', 'preference', 'request'],
    contexts: ['支援', '合理的配慮', '配慮', '理解', 'support', 'accommodation', 'assistive'],
  },
};

const SUPPORT_TYPE_HINTS = [
  {
    key: 'schedule_flexibility',
    keywords: [
      '時差出勤',
      '短時間勤務',
      '勤務時間',
      '休憩',
      '休暇',
      'テレワーク',
      '在宅勤務',
      'schedule',
      'remote',
      'break',
    ],
  },
  {
    key: 'task_adjustment',
    keywords: ['業務調整', '配置転換', '職務再設計', '作業手順', 'task', 'job redesign', 'duty'],
  },
  {
    key: 'environment_adjustment',
    keywords: [
      '照明',
      '騒音',
      '座席',
      '動線',
      '設備',
      'workspace',
      'noise',
      'lighting',
      'ergonomic',
    ],
  },
  {
    key: 'communication_support',
    keywords: [
      '筆談',
      '手話',
      '通訳',
      '面談',
      '相談',
      'コミュニケーション',
      'communication',
      'interpreter',
    ],
  },
  {
    key: 'assistive_technology',
    keywords: [
      '支援機器',
      'ソフトウェア',
      '入力補助',
      'screen reader',
      'assistive technology',
      'tool',
    ],
  },
];

const STEP4_CANONICAL_SOURCE_IDS = new Set([
  'askjan_website',
  'askearn_employer_guidance',
  'australia_jobaccess_guidance',
  'canada_duty_to_accommodate',
  'uk_gov_disability_employment',
  'uk_headway_brain_injury_work',
  'eu_reasonable_accommodation',
  'jeed_reference',
]);

const CANONICAL_ACTION_PATTERNS = [
  /written instructions?|task lists?|checklists?|labels?|reminders?/i,
  /flexible working(?: time| arrangements?)?|work schedules?|fewer days|fewer duties|break times?/i,
  /changes? to work tasks?|workplace adjustments?|equipment|technology|workspace/i,
  /meet with your employee|review the essential tasks|return to work plan/i,
  /monitor and review|follow-?up|reassess|ongoing communication/i,
  /ask your employee|talk about|find timely solutions|gather relevant information/i,
  /作業手順|正誤表|写真を使用|休憩時間|相談の窓口|意見箱|支援センター/i,
  /面接時に.*同席|業務指導や相談に関し.*担当者|業務指示やスケジュールを明確/i,
];

const CANONICAL_DIALOGUE_PATTERNS = [
  /meet with your employee|talk about|discuss their situation|ask your employee/i,
  /ongoing communication|gather relevant information|review for understanding/i,
  /相談|面接|話し合い|同席|窓口|連絡を取り合い/i,
];

const CANONICAL_REVIEW_PATTERNS = [
  /monitor and review|follow-?up|reassess|periodically|review the accommodation/i,
  /見直し|再評価|フォローアップ|定期/i,
];

const CANONICAL_WORK_CONTEXT_PATTERNS = [
  /employee|employer|manager|workplace|job|task|duties|accommodation|adjustments?/i,
  /従業員|職場|業務|職務|配慮|支援|上司|担当者/i,
];

const CANONICAL_SEGMENT_NOISE_PATTERNS = [
  /^listen solutions:/i,
  /^skip to /i,
  /^search /i,
  /^menu /i,
  /^home\b/i,
  /^contact us\b/i,
  /^privacy\b/i,
  /^site map\b/i,
  /^copyright\b/i,
  /^page details\b/i,
  /^about this site\b/i,
  /^using this site\b/i,
  /^languages\b/i,
  /^accessibility\b/i,
  /^subscribe\b/i,
  /^saved items?\b/i,
  /^secure login\b/i,
  /^other languages\b/i,
  /^emergency contacts\b/i,
  /^complaints or report abuse\b/i,
  /^go to saved items\b/i,
  /^would you like to talk to us\b/i,
  /^have any questions about the employment of people with disability\?/i,
  /^contact us complaints\b/i,
  /^all contacts departments and agencies\b/i,
  /^employer live chat\b/i,
  /^add page to myjan\b/i,
  /\bAccommodation and Accessibility Policy Toolkit\b/i,
  /\bOther ODEP Funded Centers\b/i,
  /\bNews & Events\b/i,
  /^vendors and products\b/i,
  /^please visit vendor site for product links and pricing\b/i,
  /^no products listed\b/i,
  /^前ページへ\b/i,
  /^アンケートのお願い\b/i,
  /^アンケートに答える\b/i,
  /^サイトポリシー\b/i,
  /^プライバシーポリシー\b/i,
  /^独立行政法人 高齢・障害・求職者雇用支援機構\b/i,
];

const CANONICAL_VENDOR_PATTERNS = [
  /\bamazon\.com\b/i,
  /\bwalmart\b/i,
  /\bstaples\b/i,
  /\bglobal industrial\b/i,
  /\bhayneedle\b/i,
  /\bhumanscale\b/i,
  /\bherman miller\b/i,
  /\bergotron\b/i,
  /\bsteelcase\b/i,
  /\bknoll\b/i,
  /\bmaxiaids\b/i,
  /\bbodybilt\b/i,
  /\balimed\b/i,
  /\bminerva beauty\b/i,
  /\bmedline\b/i,
  /\bwheelchair accessible vans\b/i,
];

const SOURCE_CANONICAL_TRIM_RULES = {
  askjan_website: {
    startMarkers: [/\bhome\s+(?:limitations|disabilities)\b/i, /\blisten\s+solutions:/i],
    endMarkers: [/\bEmployer Live Chat Show Reader\b/i, /\bAdd Page to MyJAN\b/i],
  },
  askearn_employer_guidance: {
    startMarkers: [
      /\bLearn more about disability statistics\b/i,
      /\bGetting Started \/ Resources This page discusses\b/i,
      /\bStatistics on Disability\b/i,
      /\bContact Us Contact Us\b/i,
    ],
    endMarkers: [/\bSubscribe for EARN News and Updates\b/i, /\bUser Agreement Accessibility Statement Privacy\b/i],
  },
  australia_jobaccess_guidance: {
    startMarkers: [/\bYou are here:\b/i, /\bListen\b/i],
    endMarkers: [/\bUseful Downloads\b/i, /\bWould you like to talk to us\?\b/i],
  },
  canada_duty_to_accommodate: {
    startMarkers: [/\bAccommodation Disability Management in the Federal Public Service\b/i, /\bDuty to Accommodate\b/i],
    endMarkers: [/\bPage details\b/i, /\bAbout this site\b/i],
  },
  jeed_reference: {
    startMarkers: [/\b\d{4}年度掲載\b/i, /\b就労上の課題\b/i],
    endMarkers: [/\b前ページへ\b/i, /\bアンケートのお願い\b/i],
  },
};

const PRACTICAL_FOCUS_RULES = [
  {
    key: 'schedule_pacing',
    label: '勤務時間・休憩・治療スケジュール',
    patterns: [
      /work schedules?|working time|fewer days|fewer hours|break times?|rest breaks?|treatment schedules?/i,
      /勤務時間|短時間|休憩|通院|体調|出退勤時刻/i,
    ],
  },
  {
    key: 'coordination_process',
    label: '相談・合意・見直し',
    patterns: [
      /meet with your employee|agree on a .* plan|ongoing communication|gather relevant information/i,
      /相談|合意|面接|同席|窓口|支援センター/i,
    ],
  },
  {
    key: 'cognitive_instruction',
    label: '手順・優先順位・確認方法',
    patterns: [
      /written instructions?|task lists?|checklists?|labels?|reminders?/i,
      /作業手順|図等を活用したマニュアル|正誤表|スケジュールを明確/i,
    ],
  },
  {
    key: 'physical_access',
    label: '姿勢・椅子・机・動線',
    patterns: [
      /physical changes?|work area|chair|desk|ergonomic|lifting|standing|mobility|transport/i,
      /姿勢|椅子|机|動線|物理アクセス|持ち運び|立ち仕事/i,
    ],
  },
  {
    key: 'sensory_environment',
    label: '感覚環境・設備調整',
    patterns: [
      /lighting|noise|workspace|technology|equipment/i,
      /設備|環境|workspace|adaptive equipment/i,
    ],
  },
  {
    key: 'communication_social',
    label: '会議・字幕・テキスト確認',
    patterns: [
      /communication|talk|discuss|privacy reminder|captions?|text communication|written follow-up|deaf|hard of hearing|meeting/i,
      /報・連・相|言葉による自発的な要求|紙に書いて伝える|話し合い|字幕|テキスト|会議|聞き漏らし/i,
    ],
  },
  {
    key: 'adjustment_review',
    label: '調整後の見直し',
    patterns: [
      /monitor and review|follow-?up|reassess|periodically/i,
      /見直し|再評価|定期|効果確認/i,
    ],
  },
];

const DISABILITY_HINTS = [
  {
    key: 'physical',
    keywords: ['肢体', '運動機能', 'physical disability', 'mobility', '車いす', '歩行'],
  },
  { key: 'visual', keywords: ['視覚障害', 'blind', 'low vision', '弱視'] },
  { key: 'hearing', keywords: ['聴覚障害', '難聴', 'deaf', 'hearing', '手話', 'caption'] },
  {
    key: 'mental',
    keywords: [
      '精神障害',
      'うつ',
      '不安障害',
      'mental health',
      'depression',
      '統合失調症',
      '気分障害',
      'bipolar',
      'psychosis',
    ],
  },
  { key: 'developmental', keywords: ['発達障害', 'adhd', 'autism', 'asd', '神経発達'] },
  { key: 'intellectual', keywords: ['知的障害', 'intellectual disability', '知的機能'] },
  {
    key: 'internal',
    keywords: [
      '内部障害',
      '難病',
      '慢性疾患',
      'chronic illness',
      'autoimmune',
      '透析',
      'dialysis',
      'ペースメーカー',
      'pacemaker',
    ],
  },
  {
    key: 'higher_brain',
    keywords: [
      '高次脳機能障害',
      '高次脳機能',
      '脳卒中',
      '脳血管障害',
      '脳梗塞',
      '脳出血',
      '外傷性脳損傷',
      '頭部外傷',
      '失語症',
      '注意障害',
      '注意機能障害',
      '記憶障害',
      '記憶機能障害',
      '見当識障害',
      '遂行機能障害',
      '半側空間無視',
      'brain injury',
      'traumatic brain injury',
      'tbi',
      'stroke',
      'cerebrovascular',
      'aphasia',
      'cognitive impairment',
      'neurocognitive',
      'attention impairment',
      'attention deficit',
      'memory impairment',
      'orientation disorder',
      'executive dysfunction',
      'hemispatial neglect',
    ],
  },
];

const FACET_TO_DISABILITY_LABEL = {
  physical: '肢体不自由',
  visual: '視覚障害',
  hearing: '聴覚障害',
  mental: '精神障害',
  developmental: '発達障害',
  intellectual: '知的障害',
  internal: '内部障害',
  higher_brain: '高次脳機能障害',
};

const DISABILITY_LABEL_HINTS = [
  { label: '視覚障害', keywords: ['視覚障害', 'blind', 'low vision', '弱視'] },
  { label: '聴覚障害', keywords: ['聴覚障害', '難聴', 'deaf', 'hard of hearing'] },
  { label: '肢体不自由', keywords: ['肢体不自由', 'mobility', 'wheelchair', '車いす', '歩行困難'] },
  {
    label: '精神障害',
    keywords: ['精神障害', 'mental health', 'depression', 'うつ', '双極', '統合失調'],
  },
  { label: '発達障害', keywords: ['発達障害', 'autism', 'asd', 'adhd', 'neurodivergent'] },
  { label: '知的障害', keywords: ['知的障害', 'intellectual disability'] },
  {
    label: '高次脳機能障害',
    keywords: ['高次脳機能障害', 'brain injury', 'tbi', 'stroke', '失語症'],
  },
  {
    label: '内部障害',
    keywords: ['内部障害', 'internal disability', 'chronic illness', '難病', 'dialysis', '透析'],
  },
  { label: '難病', keywords: ['難病', 'rare disease'] },
];

const DISEASE_LABEL_STOPWORDS = new Set([
  '病気',
  '疾病',
  '難病',
  '病状',
  '持病',
  '症状',
  '神経',
  '機能障害',
  '障害',
  '精神',
  '心理',
  '治療',
  '通院',
  '病院',
  '体調',
  '疾患自己管理',
]);

const INDUSTRY_HINTS = [
  { key: 'manufacturing', keywords: ['製造業', 'manufacturing', 'factory'] },
  { key: 'retail_wholesale', keywords: ['卸売', '小売', 'retail', 'wholesale', 'store'] },
  {
    key: 'healthcare_welfare',
    keywords: ['医療', '福祉', 'healthcare', 'hospital', 'welfare', 'care'],
  },
  { key: 'transport_logistics', keywords: ['運輸', '物流', 'transport', 'logistics'] },
  { key: 'construction', keywords: ['建設業', 'construction'] },
  { key: 'service', keywords: ['サービス業', 'service industry', 'hospitality'] },
  { key: 'education', keywords: ['教育', '学校', 'education', 'school'] },
  {
    key: 'public_sector',
    keywords: ['官公庁', '自治体', '公的機関', 'government agency', 'public sector'],
  },
];

const COMPANY_SIZE_HINTS = [
  { key: 'micro', keywords: ['50人以下', '50人未満', 'less than 50', 'under 50'] },
  { key: 'small', keywords: ['51人～100人', '51-100', '51 to 100', '100人以下'] },
  { key: 'medium', keywords: ['101人～300人', '101-300', '101 to 300'] },
  { key: 'large', keywords: ['301人～500人', '301-500', '301 to 500'] },
  { key: 'xlarge', keywords: ['501人～1,000人', '501-1000', '1000人以下', '501 to 1000'] },
  { key: 'enterprise', keywords: ['1,001人以上', '1001人以上', 'more than 1000', 'over 1000'] },
];

const ACCOMMODATION_ACTION_HINTS = [
  {
    key: 'schedule_flexibility',
    keywords: [
      '時差出勤',
      '短時間勤務',
      '休憩',
      '休暇',
      'flexible schedule',
      'telework',
      'work from home',
    ],
  },
  {
    key: 'task_redesign',
    keywords: ['業務調整', '配置転換', '職務再設計', 'task restructuring', 'job redesign'],
  },
  {
    key: 'environment_control',
    keywords: ['照明', '騒音', '空調', '環境調整', 'air quality', 'lighting', 'noise'],
  },
  {
    key: 'communication_support',
    keywords: [
      '筆談',
      '手話',
      '通訳',
      '面談',
      'コミュニケーション',
      'interpreter',
      'communication support',
    ],
  },
  {
    key: 'assistive_technology',
    keywords: ['支援機器', '補助具', 'assistive technology', 'screen reader', 'software'],
  },
  {
    key: 'policy_and_training',
    keywords: ['社内ルール', '方針', '研修', 'training', 'policy modification'],
  },
];

const OUTCOME_HINTS = [
  { key: 'retention', keywords: ['就業継続', '定着', '離職防止', 'retention', 'stay employed'] },
  {
    key: 'performance_improvement',
    keywords: ['生産性', '業務効率', '成果', 'performance', 'productivity'],
  },
  {
    key: 'symptom_stabilization',
    keywords: ['症状安定', '悪化防止', '体調管理', 'symptom stabilization', 'reduce flare'],
  },
  {
    key: 'barrier_reduction',
    keywords: ['困難軽減', '負担軽減', '問題解決', 'barrier reduction', 'problem solved'],
  },
  { key: 'uncertain', keywords: ['課題', '未解決', '要検討', 'uncertain', 'pending'] },
];

function looksLikeWebCacheText(filePath) {
  return filePath.includes(`${path.sep}web-cache${path.sep}`) && filePath.endsWith('.txt');
}

function parseLeadingMetadataBlock(rawText) {
  const lines = rawText.split(/\r?\n/);
  const metadata = {};
  let cursor = 0;

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line.trim() === '') break;

    const match = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!match) {
      return {
        metadata: null,
        body: rawText,
      };
    }

    metadata[match[1]] = match[2];
    cursor += 1;
  }

  if (!metadata.source_id || !metadata.url) {
    return {
      metadata: null,
      body: rawText,
    };
  }

  const body = lines.slice(Math.min(cursor + 1, lines.length)).join('\n');
  return {
    metadata,
    body,
  };
}

function normalizeHttpUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return null;
  }
}

function sidecarPathForFile(filePath) {
  if (!/\.(txt|md)$/i.test(filePath)) return null;
  return filePath.replace(/\.[^.]+$/i, '.meta.json');
}

function normalizeSidecarMetadata(sidecar) {
  if (!sidecar || typeof sidecar !== 'object') return null;

  const metadata = {
    source_id:
      typeof sidecar.sourceId === 'string'
        ? sidecar.sourceId
        : typeof sidecar.source_id === 'string'
          ? sidecar.source_id
          : null,
    url:
      typeof sidecar.url === 'string'
        ? sidecar.url
        : typeof sidecar.sourceUrl === 'string'
          ? sidecar.sourceUrl
          : null,
    final_url:
      typeof sidecar.finalUrl === 'string'
        ? sidecar.finalUrl
        : typeof sidecar.final_url === 'string'
          ? sidecar.final_url
          : null,
    title: typeof sidecar.title === 'string' ? sidecar.title : null,
    fetched_at:
      typeof sidecar.fetchedAt === 'string'
        ? sidecar.fetchedAt
        : typeof sidecar.fetched_at === 'string'
          ? sidecar.fetched_at
          : null,
    sidecarStructuredMetadata:
      sidecar.structuredMetadata && typeof sidecar.structuredMetadata === 'object'
        ? sidecar.structuredMetadata
        : null,
  };

  if (
    !metadata.source_id &&
    !metadata.url &&
    !metadata.final_url &&
    !metadata.title &&
    !metadata.fetched_at &&
    !metadata.sidecarStructuredMetadata
  ) {
    return null;
  }

  return metadata;
}

function mergeMetadata(baseMetadata, sidecarMetadata) {
  if (!baseMetadata && !sidecarMetadata) return null;

  return {
    ...(baseMetadata || {}),
    ...(sidecarMetadata || {}),
    sidecarStructuredMetadata:
      sidecarMetadata?.sidecarStructuredMetadata || baseMetadata?.sidecarStructuredMetadata || null,
  };
}

async function loadSidecarMetadata(filePath) {
  const sidecarPath = sidecarPathForFile(filePath);
  if (!sidecarPath) {
    return {
      metadata: null,
      structuredMetadata: null,
    };
  }

  try {
    const sidecarRaw = await fs.readFile(sidecarPath, 'utf8');
    const sidecar = JSON.parse(sidecarRaw);
    const metadata = normalizeSidecarMetadata(sidecar);
    return {
      metadata,
      structuredMetadata: metadata?.sidecarStructuredMetadata || null,
    };
  } catch {
    return {
      metadata: null,
      structuredMetadata: null,
    };
  }
}

function normalizeMarkdownText(content) {
  return String(content || '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function isMarkdownTableSeparator(line) {
  return /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(String(line || ''));
}

function isMarkdownTableRow(line) {
  const normalized = String(line || '');
  return /^\s*\|.*\|\s*$/.test(normalized) && !isMarkdownTableSeparator(normalized);
}

function splitMarkdownTableCells(line) {
  return String(line || '')
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => normalizeMarkdownText(cell))
    .map((cell) => cell.trim());
}

function buildMarkdownTableLead(header, value) {
  const normalizedHeader = normalizeMarkdownText(header).replace(/[：:]$/, '').trim();
  const normalizedValue = normalizeMarkdownText(value).trim();
  if (!normalizedValue) return '';
  if (!normalizedHeader) return normalizedValue;
  if (normalizedHeader === '実装フェーズ' || /(?:^|)フェーズ$/.test(normalizedHeader)) {
    return `${normalizedValue}では`;
  }
  if (
    normalizedHeader === '日本での典型機関' ||
    /(機関|主体|担当|役割|機能|支援者|支援機関|組織)$/.test(normalizedHeader)
  ) {
    return `${normalizedValue}は`;
  }
  return `${normalizedHeader}が${normalizedValue}の場合`;
}

function normalizeMarkdownTableValue(value) {
  return normalizeMarkdownText(value).replace(/[。．.!?！？\s]+$/g, '').trim();
}

function matchesMarkdownHeaders(headers, expectedHeaders) {
  if (!Array.isArray(headers) || headers.length < expectedHeaders.length) return false;
  return expectedHeaders.every(
    (expected, index) => normalizeMarkdownText(headers[index] || '') === expected,
  );
}

function buildMarkdownTableClaimText(headers, cells) {
  const normalizedHeaders = headers.map((header) =>
    normalizeMarkdownText(header).replace(/[：:]$/, '').trim(),
  );
  const normalizedCells = cells.map((cell) => normalizeMarkdownTableValue(cell));

  if (
    matchesMarkdownHeaders(normalizedHeaders, ['日本での典型機関', '普遍化した機能', 'JACでの扱い'])
  ) {
    const [institution, universalFunction, jacHandling] = normalizedCells;
    if (institution && universalFunction && jacHandling) {
      return `${institution}は、${universalFunction}の機能に相当し、JACでの扱いとしては${jacHandling}。`;
    }
  }

  if (
    matchesMarkdownHeaders(normalizedHeaders, [
      '実装フェーズ',
      'JACが持つべき中核',
      '地域専門機関・専門支援者が持つべき中核',
      '実施しやすくなる理由',
    ])
  ) {
    const [phase, jacCore, regionalCore, reason] = normalizedCells;
    if (phase && jacCore && regionalCore && reason) {
      return `${phase}では、JACは${jacCore}を持ち、地域専門機関・専門支援者は${regionalCore}を担うことで、${reason}。`;
    }
  }

  const pairs = [];
  const maxLength = Math.max(normalizedHeaders.length, normalizedCells.length);

  for (let index = 0; index < maxLength; index += 1) {
    const header = normalizedHeaders[index] || '';
    const value = normalizedCells[index] || '';
    if (!header || !value) continue;
    pairs.push({ header, value });
  }

  if (pairs.length === 0) return '';

  const [subject, ...details] = pairs;
  const lead = buildMarkdownTableLead(subject.header, subject.value);
  if (details.length === 0) return lead ? `${lead}。` : `${subject.value}。`;

  const detailText = details.map(({ header, value }) => `${header}は${value}`).join('、');
  if (!lead) return `${detailText}。`;
  return `${lead}、${detailText}。`;
}

function extractMarkdownTableBlocks(lines) {
  const rows = lines
    .map((line) => ({
      line: String(line || ''),
      isSeparator: isMarkdownTableSeparator(line),
      cells: splitMarkdownTableCells(line),
    }))
    .filter(({ isSeparator, cells }) => isSeparator || cells.some((cell) => cell));

  if (rows.length === 0) return [];

  const headerIndex = rows.findIndex((row) => !row.isSeparator);
  if (headerIndex < 0) return [];

  const separatorIndex = rows.findIndex((row, index) => index > headerIndex && row.isSeparator);
  const headerRow = rows[headerIndex];
  const dataRows =
    separatorIndex > headerIndex
      ? rows.slice(separatorIndex + 1).filter((row) => !row.isSeparator)
      : rows.slice(headerIndex + 1).filter((row) => !row.isSeparator);

  if (dataRows.length === 0) {
    const fallbackText = normalizeMarkdownText(headerRow.line);
    return fallbackText
      ? [
          {
            blockType: 'table_row',
            text: fallbackText,
            claimText: fallbackText,
          },
        ]
      : [];
  }

  return dataRows
    .map((row) => {
      const text = normalizeMarkdownText(row.line);
      const claimText = buildMarkdownTableClaimText(headerRow.cells, row.cells) || text;
      if (!text && !claimText) return null;
      return {
        blockType: 'table_row',
        text,
        claimText,
      };
    })
    .filter(Boolean);
}

function extractMarkdownSectionBlocks(lines) {
  const blocks = [];
  let current = [];

  const flushCurrent = () => {
    const text = normalizeMarkdownText(current.join(' '));
    current = [];
    if (text) {
      blocks.push({
        blockType: 'paragraph',
        text,
      });
    }
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = String(lines[index] || '');
    if (!line.trim()) {
      flushCurrent();
      continue;
    }

    const isListItem = /^\s*(?:[-*+]|\d+\.)\s+/.test(line);
    const isTableLine = isMarkdownTableRow(line) || isMarkdownTableSeparator(line);
    const cleaned = normalizeMarkdownText(line);
    if (!cleaned && !isTableLine) continue;

    if (isTableLine) {
      flushCurrent();
      const tableLines = [line];
      while (index + 1 < lines.length) {
        const nextLine = String(lines[index + 1] || '');
        if (!isMarkdownTableRow(nextLine) && !isMarkdownTableSeparator(nextLine)) break;
        tableLines.push(nextLine);
        index += 1;
      }
      blocks.push(...extractMarkdownTableBlocks(tableLines));
      continue;
    }

    if (isListItem) {
      flushCurrent();
      blocks.push({
        blockType: 'list_item',
        text: cleaned,
      });
      continue;
    }

    current.push(cleaned);
  }

  flushCurrent();
  return blocks;
}

function getStructuredMetadata(metadata) {
  const structured = metadata?.sidecarStructuredMetadata;
  return structured && typeof structured === 'object' ? structured : null;
}

function toSourceId(filePath, extractedMetadata) {
  if (extractedMetadata?.source_id) return extractedMetadata.source_id;
  if (filePath.includes('/documents/')) return 'nbl_guidelines';

  if (filePath.includes('/web-cache/')) {
    const segments = filePath.split(path.sep);
    const index = segments.lastIndexOf('web-cache');
    if (index >= 0 && segments.length > index + 2) {
      const inferred = segments[index + 1];
      if (inferred && inferred !== 'web-cache') return inferred;
    }
  }

  return 'nbl_local_research';
}

function unescapeXml(value) {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

function chunkText(text, maxChars = 700) {
  const blocks = text
    .split(/\n\s*\n/g)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const chunks = [];
  let current = '';

  for (const block of blocks) {
    if ((current + ' ' + block).trim().length > maxChars) {
      if (current.trim()) chunks.push(current.trim());
      current = block;
    } else {
      current = `${current} ${block}`.trim();
    }
  }

  if (current.trim()) chunks.push(current.trim());

  if (chunks.length === 0 && text.trim()) {
    chunks.push(text.trim().slice(0, maxChars));
  }

  return chunks;
}

function chunkMarkdownText(markdown, maxChars = 700) {
  const lines = String(markdown || '').split(/\r?\n/);
  const sections = [];
  const headingStack = [];
  let bodyLines = [];

  const flushSection = () => {
    const blocks = extractMarkdownSectionBlocks(bodyLines);
    bodyLines = [];
    if (blocks.length === 0) return;

    const headingPath = headingStack.map((item) => normalizeMarkdownText(item)).filter(Boolean);
    const headingText = headingPath.join(' / ');

    for (const block of blocks) {
      if (block.blockType === 'table_row') {
        sections.push({
          headingPath,
          headingText,
          blockType: block.blockType,
          bodyText: block.text,
          claimText: block.claimText || block.text,
          text: headingText
            ? `${headingText}\n\n${block.claimText || block.text}`
            : block.claimText || block.text,
        });
        continue;
      }

      const bodyChunks = chunkText(block.text, maxChars);
      for (const bodyText of bodyChunks) {
        sections.push({
          headingPath,
          headingText,
          blockType: block.blockType,
          bodyText,
          text: headingText ? `${headingText}\n\n${bodyText}` : bodyText,
        });
      }
    }
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushSection();
      const level = headingMatch[1].length;
      const heading = normalizeMarkdownText(headingMatch[2]);
      headingStack.splice(level - 1);
      if (heading) headingStack[level - 1] = heading;
      continue;
    }

    bodyLines.push(line);
  }

  flushSection();

  if (sections.length > 0) return sections;

  return chunkText(normalizeMarkdownText(markdown), maxChars).map((bodyText) => ({
    headingPath: [],
    headingText: '',
    blockType: 'paragraph',
    bodyText,
    text: bodyText,
  }));
}

function normalizeExtractedText(raw) {
  return unescapeXml(raw.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

async function walk(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (!allowedExtensions.has(extension)) continue;
    if (extension === '.md' && entry.name.toLowerCase() === 'readme.md') continue;
    files.push(fullPath);
  }

  return files;
}

async function commandExists(command) {
  try {
    await execFileAsync('sh', ['-lc', `command -v ${command}`]);
    return true;
  } catch {
    return false;
  }
}

async function readTextFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const extension = path.extname(filePath).toLowerCase();
  const sidecar = await loadSidecarMetadata(filePath);
  const normalizedContent = extension === '.md' ? normalizeMarkdownText(content) : content;

  if (!looksLikeWebCacheText(filePath)) {
    return {
      text: normalizedContent,
      rawText: content,
      metadata: sidecar.metadata,
      sidecarStructuredMetadata: sidecar.structuredMetadata,
    };
  }

  const parsed = parseLeadingMetadataBlock(content);
  const mergedMetadata = mergeMetadata(parsed.metadata, sidecar.metadata);
  const sourceId = toSourceId(filePath, mergedMetadata);
  const canonicalized = canonicalizeWebCacheBody({
    sourceId,
    text: parsed.body,
    metadata: mergedMetadata,
  });
  const practicalInfo = canonicalized.practicalInfo
    ? {
        ...(mergedMetadata?.sidecarStructuredMetadata || {}),
        ...canonicalized.practicalInfo,
      }
    : mergedMetadata?.sidecarStructuredMetadata || null;

  return {
    text: canonicalized.text,
    rawText: parsed.body,
    metadata: mergedMetadata,
    sidecarStructuredMetadata: practicalInfo,
  };
}

async function extractPdfText(filePath, canUsePdfToText) {
  if (!canUsePdfToText) {
    return {
      text: '',
      warning:
        'pdftotext is not available. PDF is stored as metadata only to avoid noisy extraction.',
      metadata: null,
    };
  }

  try {
    const { stdout } = await execFileAsync('pdftotext', ['-enc', 'UTF-8', '-q', filePath, '-']);
    return { text: stdout, warning: null, metadata: null };
  } catch {
    return {
      text: '',
      warning: 'pdftotext failed for this file. PDF text extraction skipped.',
      metadata: null,
    };
  }
}

async function extractXlsmText(filePath) {
  try {
    const { stdout: entriesOutput } = await execFileAsync('unzip', ['-Z1', filePath]);
    const entries = entriesOutput
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((entry) =>
        /^xl\/(sharedStrings\.xml|worksheets\/.*\.xml|tables\/.*\.xml)$/i.test(entry),
      );

    if (entries.length === 0) {
      return {
        text: '',
        warning: 'No worksheet-related xml entries found in xlsm.',
        metadata: null,
      };
    }

    const chunks = [];
    for (const entry of entries.slice(0, 80)) {
      try {
        const { stdout } = await execFileAsync('unzip', ['-p', filePath, entry]);
        const normalized = normalizeExtractedText(stdout);
        if (normalized.length > 0) {
          chunks.push(normalized);
        }
      } catch {
        // Continue with remaining entries.
      }
    }

    const text = chunks.join('\n');
    if (text.trim().length === 0) {
      return {
        text: '',
        warning: 'Worksheet XML was found but text extraction returned empty output.',
        metadata: null,
      };
    }

    return {
      text,
      warning: null,
      metadata: null,
    };
  } catch {
    return {
      text: '',
      warning: 'Could not extract worksheet XML from xlsm.',
      metadata: null,
    };
  }
}

async function extractSavText(filePath) {
  try {
    const { stdout } = await execFileAsync('strings', ['-n', '4', filePath]);
    const lines = stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length >= 4)
      .slice(0, 5000);

    if (lines.length === 0) {
      return {
        text: '',
        warning: 'strings returned no visible text from sav file.',
        metadata: null,
      };
    }

    return {
      text: lines.join('\n'),
      warning: 'Used strings fallback extraction for sav; values may include noise.',
      metadata: null,
    };
  } catch {
    return {
      text: '',
      warning: 'Could not extract text from sav with strings.',
      metadata: null,
    };
  }
}

function makeRecordId(filePath, chunkIndex) {
  return createHash('sha1').update(`${filePath}#${chunkIndex}`).digest('hex').slice(0, 16);
}

function normalizeCompactText(text) {
  return String(text || '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripPageBranding(title) {
  return normalizeCompactText(title)
    .replace(/\s+\|\s+Job Access$/i, '')
    .replace(/\s+\|\s+Canada\.ca$/i, '')
    .replace(/^AskEARN\s*\|\s*/i, '')
    .replace(/\s+\|\s+障害者雇用事例リファレンスサービス.*$/i, '')
    .trim();
}

function stripRepeatedPageTitleLead(text, title) {
  const body = String(text || '');
  const cleanTitle = stripPageBranding(title);
  if (!body || cleanTitle.length < 4) return body;

  const lowerBody = body.toLowerCase();
  const lowerTitle = cleanTitle.toLowerCase();
  const firstIndex = lowerBody.indexOf(lowerTitle);
  if (firstIndex < 0) return body;
  const secondIndex = lowerBody.indexOf(lowerTitle, firstIndex + lowerTitle.length);
  if (secondIndex < 0) return body;
  if (secondIndex > Math.floor(body.length * 0.4)) return body;
  return body.slice(secondIndex);
}

function sliceAfterMarker(text, pattern) {
  const match = pattern.exec(text);
  if (!match || typeof match.index !== 'number') return text;
  return text.slice(match.index + match[0].length);
}

function sliceBeforeMarker(text, pattern) {
  const match = pattern.exec(text);
  if (!match || typeof match.index !== 'number') return text;
  return text.slice(0, match.index);
}

function trimWebCacheTextBySource(sourceId, text, metadata) {
  let output = stripRepeatedPageTitleLead(text, metadata?.title || '');
  const rules = SOURCE_CANONICAL_TRIM_RULES[sourceId];
  if (!rules) return output;

  for (const marker of rules.startMarkers || []) {
    const next = sliceAfterMarker(output, marker);
    if (next !== output) {
      output = next;
      break;
    }
  }

  for (const marker of rules.endMarkers || []) {
    const next = sliceBeforeMarker(output, marker);
    if (next !== output) {
      output = next;
      break;
    }
  }

  return output;
}

function splitCanonicalSegments(text) {
  const normalized = String(text || '')
    .replace(/\b(Step\s+\d+:)\b/gi, '\n$1')
    .replace(
      /\b(Duty to Accommodate|Accommodation Process|Understanding the Type of Accommodation Required|What Is a Bona Fide Occupational Requirement|募集・採用時の合理的配慮|採用後の合理的配慮|その他の配慮)\b/g,
      '\n$1',
    )
    .replace(/\s+/g, ' ')
    .trim();

  return normalized
    .split(/(?<=[。.!?！？])\s+|\n+/)
    .map((segment) => normalizeCompactText(segment))
    .filter(Boolean);
}

function hasCanonicalActionSignal(text) {
  return CANONICAL_ACTION_PATTERNS.some((pattern) => pattern.test(text));
}

function hasCanonicalDialogueSignal(text) {
  return CANONICAL_DIALOGUE_PATTERNS.some((pattern) => pattern.test(text));
}

function hasCanonicalReviewSignal(text) {
  return CANONICAL_REVIEW_PATTERNS.some((pattern) => pattern.test(text));
}

function hasCanonicalWorkContext(text) {
  return CANONICAL_WORK_CONTEXT_PATTERNS.some((pattern) => pattern.test(text));
}

function isCanonicalNoiseSegment(text) {
  const normalized = normalizeCompactText(text);
  if (!normalized) return true;
  if (CANONICAL_SEGMENT_NOISE_PATTERNS.some((pattern) => pattern.test(normalized))) return true;
  if (CANONICAL_VENDOR_PATTERNS.some((pattern) => pattern.test(normalized))) return true;
  if (
    /\b(?:facebook|linkedin|youtube|postal address|email jobaccess@|monthly newsletter|webinars?)\b/i.test(
      normalized,
    )
  ) {
    return true;
  }
  if (normalized.length > 280 && !hasCanonicalActionSignal(normalized)) return true;
  return false;
}

function scoreCanonicalSegment(text, { sourceId, pageType, index }) {
  const normalized = normalizeCompactText(text);
  if (!normalized) return Number.NEGATIVE_INFINITY;
  if (isCanonicalNoiseSegment(normalized)) return -100;

  let score = 0;
  if (hasCanonicalActionSignal(normalized)) score += 18;
  if (hasCanonicalDialogueSignal(normalized)) score += 10;
  if (hasCanonicalReviewSignal(normalized)) score += 10;
  if (hasCanonicalWorkContext(normalized)) score += 6;
  if (pageType === 'case_detail' || pageType === 'case_guide') score += 6;
  if (sourceId === 'jeed_reference') score += 4;
  if (sourceId === 'askjan_website') score += 2;
  if (index === 0) score += 3;

  const length = normalized.length;
  if (length >= 40 && length <= 220) score += 4;
  else if (length >= 20 && length <= 280) score += 2;
  else score -= 2;

  return score;
}

function selectCanonicalSegments(sourceId, pageType, text) {
  const segments = splitCanonicalSegments(text);
  if (segments.length === 0) return [];

  const scored = segments.map((segment, index) => ({
    segment,
    index,
    score: scoreCanonicalSegment(segment, { sourceId, pageType, index }),
  }));
  const keepCount = pageType === 'case_detail' || pageType === 'case_guide' ? 8 : 6;
  const selectedIndexes = new Set(
    scored
      .filter((item) => item.score > -40)
      .sort((a, b) => b.score - a.score)
      .slice(0, keepCount)
      .map((item) => item.index),
  );

  if (
    (pageType === 'case_detail' || pageType === 'case_guide') &&
    segments[0] &&
    !isCanonicalNoiseSegment(segments[0])
  ) {
    selectedIndexes.add(0);
  }

  return segments.filter((_, index) => selectedIndexes.has(index));
}

function inferPracticalFocus(text) {
  const normalized = normalizeCompactText(text);
  if (!normalized) return null;
  return PRACTICAL_FOCUS_RULES.find((rule) =>
    rule.patterns.some((pattern) => pattern.test(normalized)),
  ) || null;
}

function inferPracticalUsageFocus(text) {
  const normalized = normalizeCompactText(text);
  if (!normalized) return 'trial';
  if (hasCanonicalDialogueSignal(normalized)) return 'dialogue';
  if (hasCanonicalReviewSignal(normalized)) return 'review';
  return 'trial';
}

function buildPracticalTitleJa({ sourceId, pageType, focusLabel, usageFocus }) {
  const label = focusLabel || '個別調整';
  if (pageType === 'case_detail' || pageType === 'case_guide') {
    return `${label}の類似事例`;
  }
  if (usageFocus === 'dialogue') return `${label}を整理する対話ガイド`;
  if (usageFocus === 'review') return `${label}の見直しガイド`;
  if (sourceId === 'askjan_website') return `${label}の実践ヒント`;
  return `${label}の実践ガイド`;
}

function buildPracticalSummaryJa({ focusKey, usageFocus }) {
  if (usageFocus === 'dialogue') {
    if (focusKey === 'schedule_pacing') {
      return '対話で確認: 勤務時間・休憩・通院との両立でどこに負担が出るかを、本人と職場で整理する。';
    }
    if (focusKey === 'communication_social') {
      return '対話で確認: 会議で聞き漏らしが起きる場面と、字幕・テキストで補える場面を整理する。';
    }
    return '対話で確認: 本人と職場で、障壁・できること・必要な調整を一緒に整理する。';
  }

  if (usageFocus === 'review') {
    return '見直しの観点: 導入後に負担軽減や実施しやすさを確認し、調整内容を見直す。';
  }

  if (focusKey === 'schedule_pacing') {
    return '試し方の例: 勤務時間や休憩を、疲労や治療スケジュールに合わせて調整する。';
  }
  if (focusKey === 'cognitive_instruction') {
    return '試し方の例: 手順を文書化し、タスクを分けて確認しやすくする。';
  }
  if (focusKey === 'coordination_process') {
    return '試し方の例: 面談・合意・支援連携の進め方を先に決め、調整を動かしやすくする。';
  }
  if (focusKey === 'physical_access') {
    return '試し方の例: 姿勢・椅子・机・動線を見直し、身体負荷を下げる。';
  }
  if (focusKey === 'sensory_environment') {
    return '試し方の例: 設備や環境条件を個別に見直し、負担の強い場面を減らす。';
  }
  if (focusKey === 'communication_social') {
    return '試し方の例: 会議後に字幕やテキストで確認できる導線を作り、聞き漏らしを減らす。';
  }
  return '試し方の例: 今回の状況で小さく試せる調整候補を広げる。';
}

function buildApplicabilityConditionsJa({ sourceId, pageType }) {
  if (pageType === 'case_detail' || pageType === 'case_guide') {
    return '個別事情や職務内容が近い場合の参考にとどめ、同じ調整をそのまま一般化しない。';
  }
  if (sourceId !== 'jeed_reference') {
    return '海外情報は制度や雇用慣行が異なるため、日本の制度にそのまま当てはめず、本人・業務・職場条件を確認して使う。';
  }
  return '本人の症状変動・必須業務・職場条件を確認してから、具体策を小さく試して見直す。';
}

function buildPracticalCanonicalInfo(sourceId, pageType, evidenceScope, canonicalText, segments) {
  if (!STEP4_CANONICAL_SOURCE_IDS.has(sourceId)) return null;
  const text = normalizeCompactText(canonicalText);
  if (!text) return null;
  const focus = inferPracticalFocus(text);
  const usageFocus = inferPracticalUsageFocus(text);
  const traceExcerptOriginal = normalizeCompactText(segments[0] || text).slice(0, 280);

  return {
    practicalTitleJa: buildPracticalTitleJa({
      sourceId,
      pageType,
      focusLabel: focus?.label || '',
      usageFocus,
    }),
    practicalSummaryJa: buildPracticalSummaryJa({
      focusKey: focus?.key || '',
      usageFocus,
    }),
    usageFocus,
    applicabilityConditionsJa: buildApplicabilityConditionsJa({ sourceId, pageType, evidenceScope }),
    traceExcerptOriginal,
  };
}

function canonicalizeWebCacheBody({ sourceId, text, metadata }) {
  const pageType = inferPageType(sourceId, metadata);
  const evidenceScope = resolveEvidenceScope(pageType, metadata);
  let trimmed = trimWebCacheTextBySource(sourceId, text, metadata);
  trimmed = normalizeCompactText(trimmed);
  if (!trimmed) {
    return { text: normalizeCompactText(text), practicalInfo: null };
  }

  const selectedSegments = selectCanonicalSegments(sourceId, pageType, trimmed);
  const canonicalText =
    selectedSegments.length > 0 ? selectedSegments.join(' ') : normalizeCompactText(trimmed);
  const practicalInfo = buildPracticalCanonicalInfo(
    sourceId,
    pageType,
    evidenceScope,
    canonicalText,
    selectedSegments,
  );

  return {
    text: canonicalText,
    practicalInfo,
  };
}

function normalizeLabel(value) {
  return normalizeCompactText(value)
    .replace(/[「」『』【】\[\]]/g, '')
    .trim();
}

function normalizeLabelForCompare(value) {
  return normalizeLabel(value).toLowerCase().replace(/\s+/g, '');
}

function uniqueSorted(values) {
  const out = [];
  const seen = new Set();
  for (const value of values || []) {
    const label = normalizeLabel(value);
    if (!label) continue;
    const key = normalizeLabelForCompare(label);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out.sort((a, b) => a.localeCompare(b, 'ja'));
}

function splitDelimitedLabels(value) {
  return String(value || '')
    .split(/[、,\/|]/)
    .map((item) => normalizeLabel(item))
    .filter(Boolean);
}

function isLikelyConditionLabel(value) {
  const label = normalizeLabel(value);
  if (!label || label.length < 2 || label.length > 40) return false;
  if (DISEASE_LABEL_STOPWORDS.has(label)) return false;
  if (/[0-9]{4,}/.test(label)) return false;
  if (
    /^(職場配慮|就労困難性|問題発生|機能障害等|障害認定外|性格|学歴|労働時間|年齢|都会度)$/.test(
      label,
    )
  )
    return false;
  if (/(?:病|症候群|炎|腫|潰瘍|硬化症|てんかん|片麻痺|血友|線維筋痛|リウマチ)/.test(label))
    return true;
  if (
    /^[A-Za-z][A-Za-z0-9' .-]{2,}$/.test(label) &&
    /(syndrome|disease|disorder|injury|sclerosis|arthritis)/i.test(label)
  ) {
    return true;
  }
  return false;
}

async function loadGlmConditionLabels() {
  try {
    const raw = await fs.readFile(glmSignificantRelationsPath, 'utf8');
    const parsed = JSON.parse(raw);
    const rows = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.relations)
        ? parsed.relations
        : [];
    const out = [];
    for (const row of rows) {
      const predictorGroup = normalizeLabel(row?.predictorGroup);
      if (!predictorGroup.includes('個別疾患')) continue;
      const predictor = normalizeLabel(row?.predictor);
      if (!isLikelyConditionLabel(predictor)) continue;
      out.push(predictor);
    }
    return uniqueSorted(out).sort((a, b) => b.length - a.length || a.localeCompare(b, 'ja'));
  } catch {
    return [];
  }
}

function extractAskjanConditionLabel(metadata) {
  const rawUrl = metadata?.final_url || metadata?.url || '';
  if (!rawUrl) return '';
  try {
    const parsed = new URL(rawUrl);
    const match = parsed.pathname.match(/\/disabilities\/([^/]+)\.cfm$/i);
    if (!match) return '';
    const slug = decodeURIComponent(match[1]).replace(/[-_]+/g, ' ').trim();
    if (!slug || /^(overview|index|introduction)$/i.test(slug)) return '';
    return slug;
  } catch {
    return '';
  }
}

function extractConditionLabels({ text, sourceId, metadata, glmConditionLabels }) {
  const normalizedText = normalizeCompactText(text);
  const labels = [];

  for (const disease of Array.isArray(glmConditionLabels) ? glmConditionLabels : []) {
    if (disease && normalizedText.includes(disease)) labels.push(disease);
  }

  if (sourceId === 'askjan_website') {
    const askjanLabel = extractAskjanConditionLabel(metadata);
    if (isLikelyConditionLabel(askjanLabel)) labels.push(askjanLabel);
  }

  if (sourceId === 'nbl_local_research') {
    labels.push('難病');
  }

  return uniqueSorted(labels);
}

function extractDisabilityLabels({ text, sourceId, linkedJeedCase, disabilityHints, metadata }) {
  const labels = [];
  const joinedText = normalizeCompactText(text);

  for (const [facet, label] of Object.entries(FACET_TO_DISABILITY_LABEL)) {
    if (Array.isArray(disabilityHints) && disabilityHints.includes(facet)) labels.push(label);
  }

  for (const row of DISABILITY_LABEL_HINTS) {
    if (hasAnyKeyword(joinedText, row.keywords)) labels.push(row.label);
  }

  labels.push(...splitDelimitedLabels(linkedJeedCase?.disability || ''));

  const title = normalizeLabel(metadata?.title || '');
  if (title) {
    for (const row of DISABILITY_LABEL_HINTS) {
      if (hasAnyKeyword(title, row.keywords)) labels.push(row.label);
    }
  }

  if (sourceId === 'nbl_local_research') {
    labels.push('難病');
  }

  return uniqueSorted(labels);
}

function hasAnyKeyword(text, keywords) {
  const normalized = String(text || '').toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

function detectLanguage(text) {
  const jaCount = (text.match(/[\u3040-\u30ff\u3400-\u9fff]/g) || []).length;
  const latinCount = (text.match(/[A-Za-z]/g) || []).length;

  if (jaCount === 0 && latinCount === 0) return 'unknown';
  if (jaCount >= Math.max(20, Math.floor(latinCount * 0.2))) return 'ja';
  return 'en';
}

function inferCountry(sourceId, metadata, filePath) {
  const structured = getStructuredMetadata(metadata);
  if (typeof structured?.country === 'string' && structured.country.trim()) {
    return structured.country.trim();
  }

  if (sourceId === 'askjan_website') return 'US';
  if (sourceId === 'askearn_employer_guidance') return 'US';
  if (sourceId === 'jeed_reference') return 'JP';
  if (sourceId === 'uk_gov_disability_employment') return 'UK';
  if (sourceId === 'eu_reasonable_accommodation') return 'EU';
  if (sourceId === 'germany_agg_legal') return 'DE';
  if (sourceId === 'germany_antidiscrimination_work') return 'DE';
  if (sourceId === 'australia_jobaccess_guidance') return 'AU';
  if (sourceId === 'canada_duty_to_accommodate') return 'CA';
  if (sourceId === 'ilo_workplace_adjustments') return 'INTL';

  const url = metadata?.final_url || metadata?.url || '';
  if (url.includes('.go.jp') || url.includes('.jp/')) return 'JP';
  if (url.includes('.gc.ca') || url.includes('.canada.ca') || url.includes('.ca/')) return 'CA';
  if (url.includes('.gov.au') || url.includes('.au/')) return 'AU';
  if (url.includes('.de/')) return 'DE';
  if (url.includes('europa.eu') || url.includes('.eu/')) return 'EU';
  if (url.includes('.gov') || url.includes('.us/')) return 'US';
  if (url.includes('.gov.uk') || url.includes('.uk/')) return 'UK';
  if (url.includes('.ilo.org') || url.includes('ilo.org/')) return 'INTL';
  if (filePath.includes('/documents/')) return 'JP';
  return 'unknown';
}

function inferLegalContext(country, sourceId, metadata) {
  const structured = getStructuredMetadata(metadata);
  if (typeof structured?.legalContext === 'string' && structured.legalContext.trim()) {
    return structured.legalContext.trim();
  }

  if (sourceId === 'jeed_reference' || country === 'JP')
    return 'japan_disability_employment_policy';
  if (sourceId === 'askjan_website' || country === 'US') return 'ada_title_i';
  if (sourceId === 'askearn_employer_guidance') return 'ada_title_i';
  if (sourceId === 'uk_gov_disability_employment' || country === 'UK') return 'equality_act_2010';
  if (sourceId === 'eu_reasonable_accommodation' || country === 'EU')
    return 'eu_employment_equality_framework';
  if (sourceId === 'germany_agg_legal' || country === 'DE') return 'germany_agg';
  if (sourceId === 'germany_antidiscrimination_work') return 'germany_agg';
  if (sourceId === 'australia_jobaccess_guidance' || country === 'AU')
    return 'australia_disability_discrimination_act';
  if (sourceId === 'canada_duty_to_accommodate' || country === 'CA')
    return 'canada_human_rights_duty_to_accommodate';
  if (sourceId === 'ilo_workplace_adjustments' || country === 'INTL')
    return 'ilo_disability_inclusion_guidance';
  return 'unspecified';
}

function inferPageType(sourceId, metadata) {
  const structured = getStructuredMetadata(metadata);
  if (typeof structured?.pageType === 'string' && structured.pageType.trim()) {
    return structured.pageType.trim();
  }

  const url = metadata?.final_url || metadata?.url || '';
  if (!url) return 'unknown';

  if (sourceId === 'askearn_employer_guidance') {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname.toLowerCase();

      if (pathname.startsWith('/publication/')) return 'employer_publication';
      if (pathname.startsWith('/learning-center/course/')) return 'training_course';
      if (pathname === '/publications' || pathname === '/courses' || pathname === '/mentalhealth') {
        return 'resource_hub';
      }
      if (pathname.startsWith('/page/')) {
        if (/(toolkit|framework|guide|checklist|playbook)/i.test(pathname))
          return 'employer_toolkit';
        return 'employer_guidance_page';
      }
    } catch {
      return 'document';
    }
  }

  if (sourceId === 'jeed_reference') {
    if (url.includes('/detail.php')) return 'case_detail';
    if (/\/(?:\d{4}\/)?\d{6,8}\.html$/i.test(url)) return 'case_detail';
    if (url.includes('/search_result.php')) return 'search_index';
  }

  if (sourceId === 'askjan_website') {
    if (url.includes('/disabilities/') || url.includes('/limitations/')) return 'case_guide';
    if (url.includes('/sitsol/')) return 'finder';
    if (url.includes('/a-to-z.cfm')) return 'index';
  }

  if (sourceId === 'uk_headway_brain_injury_work') {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname.toLowerCase();

      if (pathname.includes('/welfare-benefits/')) return 'policy_guide';
      if (pathname.includes('/effects-of-brain-injury/')) return 'case_guide';
      if (pathname.includes('/brain-injury-and-me/')) {
        if (
          /(making-returning-to-work-work-for-you|6-strategies-for-getting-back-to-work-after-brain-injury)/.test(
            pathname,
          )
        ) {
          return 'case_guide';
        }
        return 'case_detail';
      }
    } catch {
      return 'document';
    }
  }

  return 'document';
}

function extractAskjanCaseTitle(metadata) {
  const rawUrl = metadata?.final_url || metadata?.url || '';
  if (!rawUrl) return '';

  try {
    const parsed = new URL(rawUrl);
    const match = parsed.pathname.match(/\/(?:disabilities|limitations)\/([^/]+)\.cfm$/i);
    if (!match) return '';
    return decodeURIComponent(match[1]).replace(/[-_]+/g, ' ').trim();
  } catch {
    return '';
  }
}

function extractLeadingTitle(text) {
  const normalized = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!normalized) return '';
  const uptoCloseMenu = normalized.split(/close menu/i)[0]?.trim() || '';
  if (uptoCloseMenu.length >= 2) return uptoCloseMenu.slice(0, 120);
  return normalized.slice(0, 120);
}

function detectModelSignals(text) {
  const signals = {};

  for (const [key, rule] of Object.entries(MODEL_SIGNAL_KEYWORDS)) {
    const anchorHit = hasAnyKeyword(text, rule.anchors);
    const contextHit = hasAnyKeyword(text, rule.contexts);
    signals[key] = anchorHit && contextHit;
  }

  return signals;
}

function detectHints(text, dictionary) {
  return dictionary
    .filter((entry) => hasAnyKeyword(text, entry.keywords))
    .map((entry) => entry.key);
}

function detectTrustTier(sourceMap, sourceId) {
  const source = sourceMap.get(sourceId);
  if (!source) return 'unknown';
  if (source.trustLevel === 'primary') return 'primary';
  if (source.trustLevel === 'secondary') return 'secondary';
  return 'external';
}

function resolveTrustTier(sourceMap, sourceId, metadata) {
  const structured = getStructuredMetadata(metadata);
  if (typeof structured?.trustTier === 'string' && structured.trustTier.trim()) {
    return structured.trustTier.trim();
  }

  return detectTrustTier(sourceMap, sourceId);
}

function resolveEvidenceScope(pageType, metadata) {
  const structured = getStructuredMetadata(metadata);
  if (typeof structured?.evidenceScope === 'string' && structured.evidenceScope.trim()) {
    return structured.evidenceScope.trim();
  }

  return pageType === 'case_detail' || pageType === 'case_guide'
    ? 'specific_case'
    : pageType === 'unknown'
      ? 'unknown'
      : 'aggregated_index';
}

function buildInteractionContext({
  sourceId,
  filePath,
  text,
  metadata,
  sourceMap,
  jeedCaseMap,
  glmConditionLabels,
}) {
  const structured = getStructuredMetadata(metadata);
  const language = detectLanguage(text);
  const country = inferCountry(sourceId, metadata, filePath);
  const pageType = inferPageType(sourceId, metadata);
  const evidenceScope = resolveEvidenceScope(pageType, metadata);
  const normalizedUrl = normalizeHttpUrl(metadata?.final_url || metadata?.url || '');
  const linkedJeedCase =
    sourceId === 'jeed_reference' && pageType === 'case_detail' && normalizedUrl
      ? jeedCaseMap.get(normalizedUrl) || null
      : null;
  const enrichmentText = linkedJeedCase
    ? [
        linkedJeedCase.title,
        linkedJeedCase.year,
        linkedJeedCase.industry,
        linkedJeedCase.companySize,
        linkedJeedCase.disability,
      ]
        .filter(Boolean)
        .join(' ')
    : '';
  const signalText = enrichmentText ? `${text}\n${enrichmentText}` : text;
  const interactionModelSignals = detectModelSignals(signalText);

  const supportTypeHints = detectHints(signalText, SUPPORT_TYPE_HINTS);
  let disabilityHintText = signalText;
  if (sourceId === 'askjan_website' && pageType === 'case_guide') {
    const askjanTitle = extractAskjanCaseTitle(metadata);
    const leadTitle = extractLeadingTitle(text);
    const compact = [askjanTitle, leadTitle].filter(Boolean).join(' ');
    if (compact.length >= 2) disabilityHintText = compact;
  }
  const disabilityHintsRaw = detectHints(disabilityHintText, DISABILITY_HINTS);
  const industryFacetsRaw = detectHints(signalText, INDUSTRY_HINTS);
  const companySizeFacetsRaw = detectHints(signalText, COMPANY_SIZE_HINTS);
  const accommodationFacetsRaw = detectHints(signalText, ACCOMMODATION_ACTION_HINTS);
  const outcomeFacetsRaw = detectHints(signalText, OUTCOME_HINTS);

  const isAggregatedIndex = evidenceScope === 'aggregated_index';
  const disabilityHints = isAggregatedIndex
    ? disabilityHintsRaw.filter((hint) => hint === 'higher_brain')
    : disabilityHintsRaw;
  const industryFacets = isAggregatedIndex ? [] : industryFacetsRaw;
  const companySizeFacets = isAggregatedIndex ? [] : companySizeFacetsRaw;
  const accommodationFacets = isAggregatedIndex
    ? accommodationFacetsRaw.slice(0, 2)
    : accommodationFacetsRaw;
  const outcomeFacets = isAggregatedIndex ? outcomeFacetsRaw.slice(0, 2) : outcomeFacetsRaw;
  const labelText = [signalText, metadata?.title || '', linkedJeedCase?.disability || '']
    .filter(Boolean)
    .join('\n');
  const conditionLabels = extractConditionLabels({
    text: labelText,
    sourceId,
    metadata,
    glmConditionLabels,
  });
  const disabilityLabels = extractDisabilityLabels({
    text: labelText,
    sourceId,
    linkedJeedCase,
    disabilityHints,
    metadata,
  });

  return {
    language,
    country,
    legalContext: inferLegalContext(country, sourceId, metadata),
    trustTier: resolveTrustTier(sourceMap, sourceId, metadata),
    sourceUrl: metadata?.url || null,
    finalUrl: metadata?.final_url || null,
    fetchedAt: metadata?.fetched_at || null,
    updatedAt:
      typeof structured?.updatedAt === 'string'
        ? structured.updatedAt
        : metadata?.fetched_at || null,
    linkedCaseTitle: linkedJeedCase?.title || null,
    linkedCaseYear: linkedJeedCase?.year || null,
    pageType,
    evidenceScope,
    noteType: typeof structured?.noteType === 'string' ? structured.noteType : null,
    curationRiskLevel: typeof structured?.riskLevel === 'string' ? structured.riskLevel : null,
    mustPairWithRegionalSupport:
      typeof structured?.mustPairWithRegionalSupport === 'boolean'
        ? structured.mustPairWithRegionalSupport
        : null,
    practicalTitleJa:
      typeof structured?.practicalTitleJa === 'string' ? structured.practicalTitleJa : null,
    practicalSummaryJa:
      typeof structured?.practicalSummaryJa === 'string' ? structured.practicalSummaryJa : null,
    usageFocus: typeof structured?.usageFocus === 'string' ? structured.usageFocus : null,
    applicabilityConditionsJa:
      typeof structured?.applicabilityConditionsJa === 'string'
        ? structured.applicabilityConditionsJa
        : null,
    traceExcerptOriginal:
      typeof structured?.traceExcerptOriginal === 'string' ? structured.traceExcerptOriginal : null,
    interactionModelSignals,
    supportTypeHints,
    disabilityHints,
    disabilityFacets: disabilityHints,
    conditionLabels,
    disabilityLabels,
    industryFacets,
    companySizeFacets,
    accommodationFacets,
    outcomeFacets,
  };
}

async function buildJeedCaseMap(files) {
  const map = new Map();

  for (const filePath of files) {
    if (!looksLikeWebCacheText(filePath)) continue;
    const sidecarPath = sidecarPathForFile(filePath);
    if (!sidecarPath) continue;

    try {
      const raw = await fs.readFile(sidecarPath, 'utf8');
      const sidecar = JSON.parse(raw);
      const entries = sidecar?.structuredMetadata?.jeedSearchCases;
      if (!Array.isArray(entries)) continue;

      for (const entry of entries) {
        const normalized = normalizeHttpUrl(entry?.detailUrl || '');
        if (!normalized) continue;
        map.set(normalized, {
          detailUrl: normalized,
          title: entry?.title || '',
          year: entry?.year || '',
          industry: entry?.industry || '',
          companySize: entry?.companySize || '',
          disability: entry?.disability || '',
        });
      }
    } catch {
      // Ignore malformed sidecar files.
    }
  }

  return map;
}

async function loadSourceMap() {
  try {
    const raw = await fs.readFile(sourcesConfigPath, 'utf8');
    const rows = JSON.parse(raw);
    const map = new Map();
    for (const row of rows) {
      if (row && typeof row.id === 'string') {
        map.set(row.id, row);
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

function updateContextStats(stats, context, sourceId) {
  stats.bySourceId[sourceId] = (stats.bySourceId[sourceId] || 0) + 1;
  stats.byLanguage[context.language] = (stats.byLanguage[context.language] || 0) + 1;
  stats.byCountry[context.country] = (stats.byCountry[context.country] || 0) + 1;
  stats.byPageType[context.pageType || 'unknown'] =
    (stats.byPageType[context.pageType || 'unknown'] || 0) + 1;
  stats.byEvidenceScope[context.evidenceScope || 'unknown'] =
    (stats.byEvidenceScope[context.evidenceScope || 'unknown'] || 0) + 1;
  for (const [signalKey, isActive] of Object.entries(context.interactionModelSignals)) {
    if (isActive) {
      stats.byModelSignal[signalKey] = (stats.byModelSignal[signalKey] || 0) + 1;
    }
  }

  for (const facet of context.disabilityFacets || []) {
    stats.byDisabilityFacet[facet] = (stats.byDisabilityFacet[facet] || 0) + 1;
  }
  for (const facet of context.industryFacets || []) {
    stats.byIndustryFacet[facet] = (stats.byIndustryFacet[facet] || 0) + 1;
  }
  for (const facet of context.companySizeFacets || []) {
    stats.byCompanySizeFacet[facet] = (stats.byCompanySizeFacet[facet] || 0) + 1;
  }
  for (const facet of context.accommodationFacets || []) {
    stats.byAccommodationFacet[facet] = (stats.byAccommodationFacet[facet] || 0) + 1;
  }
  for (const facet of context.outcomeFacets || []) {
    stats.byOutcomeFacet[facet] = (stats.byOutcomeFacet[facet] || 0) + 1;
  }
}

async function main() {
  const files = await walk(referencesRoot);
  const canUsePdfToText = await commandExists('pdftotext');
  const sourceMap = await loadSourceMap();
  const jeedCaseMap = await buildJeedCaseMap(files);
  const glmConditionLabels = await loadGlmConditionLabels();

  const records = [];
  const warnings = [];
  const byExtension = {};
  const byContentType = {};
  const bySourceId = {};
  const byLanguage = {};
  const byCountry = {};
  const byPageType = {};
  const byEvidenceScope = {};
  const byModelSignal = {};
  const byDisabilityFacet = {};
  const byIndustryFacet = {};
  const byCompanySizeFacet = {};
  const byAccommodationFacet = {};
  const byOutcomeFacet = {};
  let metadataOnlyCount = 0;

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();
    byExtension[extension] = (byExtension[extension] || 0) + 1;

    let text = '';
    let rawText = '';
    let warning = null;
    let extractedMetadata = null;

    if (textLikeExtensions.has(extension)) {
      const result = await readTextFile(filePath);
      text = result.text;
      rawText = result.rawText || result.text || '';
      extractedMetadata = result.metadata;
      if (extractedMetadata && result.sidecarStructuredMetadata) {
        extractedMetadata.sidecarStructuredMetadata = result.sidecarStructuredMetadata;
      }
    } else if (extension === '.pdf') {
      const result = await extractPdfText(filePath, canUsePdfToText);
      text = result.text;
      warning = result.warning;
      extractedMetadata = result.metadata;
    } else if (extension === '.xlsm') {
      const result = await extractXlsmText(filePath);
      text = result.text;
      warning = result.warning;
      extractedMetadata = result.metadata;
    } else if (extension === '.sav') {
      const result = await extractSavText(filePath);
      text = result.text;
      warning = result.warning;
      extractedMetadata = result.metadata;
    }

    const sourceId = toSourceId(filePath, extractedMetadata);
    const baseContext = buildInteractionContext({
      sourceId,
      filePath,
      text,
      metadata: extractedMetadata,
      sourceMap,
      jeedCaseMap,
      glmConditionLabels,
    });

    if (warning) {
      warnings.push({ filePath, warning });
    }

    const chunks =
      extension === '.md'
        ? chunkMarkdownText(rawText || text)
        : chunkText(text).map((chunk) => ({
            headingPath: [],
            headingText: '',
            blockType: 'paragraph',
            bodyText: chunk,
            text: chunk,
          }));
    if (chunks.length === 0) {
      const metadataRecord = {
        id: makeRecordId(filePath, 0),
        sourceId,
        filePath,
        extension,
        contentType: 'metadata_only',
        text: `No extracted text available for ${path.basename(filePath)}.`,
        interactionContext: baseContext,
      };
      records.push(metadataRecord);
      byContentType[metadataRecord.contentType] =
        (byContentType[metadataRecord.contentType] || 0) + 1;
      updateContextStats(
        {
          bySourceId,
          byLanguage,
          byCountry,
          byModelSignal,
          byPageType,
          byEvidenceScope,
          byDisabilityFacet,
          byIndustryFacet,
          byCompanySizeFacet,
          byAccommodationFacet,
          byOutcomeFacet,
        },
        baseContext,
        sourceId,
      );
      metadataOnlyCount += 1;
      continue;
    }

    chunks.forEach((chunk, index) => {
      const context = buildInteractionContext({
        sourceId,
        filePath,
        text: chunk.text,
        metadata: extractedMetadata,
        sourceMap,
        jeedCaseMap,
        glmConditionLabels,
      });

      const isWebCache = looksLikeWebCacheText(filePath);
      const record = {
        id: makeRecordId(filePath, index),
        sourceId,
        filePath,
        extension,
        contentType: isWebCache
          ? 'web_reference'
          : extension === '.md'
            ? 'guideline'
            : extension === '.txt'
              ? 'narrative'
              : extension === '.pdf'
                ? 'guideline'
                : extension === '.sav'
                  ? 'structured_meta'
                  : 'table_like',
        text: chunk.text,
        bodyText: chunk.bodyText,
        claimText: chunk.claimText || null,
        headingText: chunk.headingText || null,
        headingPath: chunk.headingPath || [],
        blockType: chunk.blockType || 'paragraph',
        interactionContext: context,
      };
      records.push(record);
      byContentType[record.contentType] = (byContentType[record.contentType] || 0) + 1;
      updateContextStats(
        {
          bySourceId,
          byLanguage,
          byCountry,
          byModelSignal,
          byPageType,
          byEvidenceScope,
          byDisabilityFacet,
          byIndustryFacet,
          byCompanySizeFacet,
          byAccommodationFacet,
          byOutcomeFacet,
        },
        context,
        sourceId,
      );
    });
  }

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    recordsPath,
    records.map((record) => JSON.stringify(record)).join('\n') + '\n',
    'utf8',
  );

  const manifest = {
    generatedAt: new Date().toISOString(),
    root: referencesRoot,
    fileCount: files.length,
    recordCount: records.length,
    byExtension,
    byContentType,
    bySourceId,
    byLanguage,
    byCountry,
    byPageType,
    byEvidenceScope,
    byModelSignal,
    byDisabilityFacet,
    byIndustryFacet,
    byCompanySizeFacet,
    byAccommodationFacet,
    byOutcomeFacet,
    metadataOnlyCount,
    extractionCoveragePct:
      files.length === 0
        ? 0
        : Number((((files.length - metadataOnlyCount) / files.length) * 100).toFixed(1)),
    warnings,
  };

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`Normalized records: ${recordsPath}`);
  console.log(`Records generated: ${records.length}`);
  console.log(`Warnings: ${warnings.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
