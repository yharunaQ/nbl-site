#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const GUIDE_PATH = path.join(process.cwd(), 'pages', 'jac', 'guide.tsx');
const DATA2_INDEX_PATH = path.join(
  process.cwd(),
  'references',
  'data2',
  'index',
  'data2-knowledge-index.json',
);
const CLAIMS_JSONL_PATH = path.join(process.cwd(), 'references', 'index', 'knowledge-claims.jsonl');
const OUTPUT_PATH = path.join(process.cwd(), 'references', 'jac', 'common-work-design-copy.json');
const NOISY_STATEMENT_REGEX =
  /(close menu|toggle navigation|skip to main content|サイトマップ|検索結果|本文へ|文字サイズ変更|背景色変更|for employers|for individuals|all rights reserved|copyright|メニュー\s*閉じる)/i;
const REGION_TO_COUNTRY = {
  JP: 'JP',
  US: 'US',
  UK: 'UK',
  'EU-DE': 'DE',
  AU: 'AU',
  CA: 'CA',
  'NBL-local': 'JP',
};
const EVIDENCE_LANE_LABEL = {
  case_practice: '事例実践',
  legal_policy: '制度根拠',
  employer_guidance: '雇用主ガイダンス',
  mixed: '複合根拠',
  aggregated_general: '集約知識',
  aggregated_external_evidence: '集約外部根拠',
  case_guide: '事例ガイド',
};

const TITLE_MECE = {
  'p-meeting-overload': '会議処理容量設計',
  'p-fatigue-pacing': '体調変動マネジメント',
  'p-medical-schedule': '治療スケジュール同期',
  'p-environment-sensory': '感覚環境の調整',
  'p-commute-hybrid': '通勤負荷分散',
  'p-disclosure-boundary': '情報共有の線引き',
  'p-return-to-work-ramp': '復職の段階設計',
  'p-shift-rhythm-guard': '勤務リズム整合',
  'p-manager-checkin': '相談ルートの整備',
  'p-customer-facing-load': '対人応答の負荷調整',
  'p-visual-document-access': '資料の見やすさ設計',
  'p-hearing-meeting-access': '聞き取りやすさ設計',
  'p-physical-mobility-route': '移動動線最適化',
  'p-safety-critical-operations': '安全重視業務の運用設計',
  'p-internal-treatment-compatibility': '回復時間バッファ設計',
  'p-intellectual-task-clarity': '指示の明確化',
  'p-developmental-switch-load': 'タスク切替の負荷調整',
  'p-mental-fluctuation-plan': '悪化の予兆対応',
  'p-higher-brain-memory-support': '記憶と段取りの支援設計',
  'p-jobmatch-exploration': '職務探索の道筋',
  'p-application-contact-flow': '応募段取り設計',
  'p-interview-self-advocacy': '面接での伝え方設計',
  'p-skill-building-path': '学習から仕事への接続',
  'p-worktrial-transition': '実習から採用への橋渡し',
  'p-income-condition-stability': '契約収入の安定設計',
  'p-support-service-navigation': '支援につながる道筋',
};

const DISABILITY_FACET_LABEL = {
  visual: '視覚障害',
  hearing: '聴覚障害',
  physical: '肢体不自由',
  internal: '内部障害',
  intellectual: '知的障害',
  mental: '精神障害',
  developmental: '発達障害',
  higher_brain: '高次脳機能障害',
};

const FOCUS_PRIVACY_SENSITIVE = new Set(['disclosure', 'manager']);
const FOCUS_SYSTEM_NAVIGATION = new Set(['career', 'jobsearch', 'application']);
const FOCUS_HEALTH_EMPLOYMENT = new Set(['medical', 'return']);

const SAFETY_ACCESS_CARD_IDS = new Set([
  'p-environment-sensory',
  'p-visual-document-access',
  'p-hearing-meeting-access',
  'p-physical-mobility-route',
  'p-safety-critical-operations',
]);

const HEAVY_REGIONAL_SUPPORT_OVERRIDES = {
  'p-support-service-navigation': {
    summary: '制度名だけを並べず、窓口順序・期限・役割分担まで一緒に示すと実施が止まりにくい。',
    jacRole: [
      '止まっている手続き、期限、責任者を1枚で整理する',
      '企業や本人に示す支援接続案を、次アクション付きで提示する',
    ],
    regionalRole: [
      '制度要件の確認、申請補助、窓口間連携を支える',
      '同意に基づく情報共有とケース会議を必要時に組む',
    ],
    returnPath: '窓口間で止まったら、JACが責任者と次回接点を再固定する。',
  },
  'p-worktrial-transition': {
    summary: '実習評価だけで終えず、採用後1から4週の支援体制まで合わせて示すと移行しやすい。',
    jacRole: [
      '実習評価を採用後の運用項目と初期KPIへ翻訳する',
      '企業内担当者、不調時連絡、見直しタイミングを固定する',
    ],
    regionalRole: [
      '実習評価の補足、定着支援、職務再調整を支える',
      '不調時の再評価とケース会議の再招集を担う',
    ],
    returnPath: '採用後に負荷が跳ねたら、実習評価へ戻して再調整条件を見直す。',
  },
  'p-manager-checkin': {
    summary: '管理者面談だけに負荷を集めず、外部支援へのエスカレーション先まで同時に固定する。',
    jacRole: [
      '面談頻度、相談導線、業務変更までの責任線を可視化する',
      '企業単独で抱えにくい論点を外部支援接続込みで提示する',
    ],
    regionalRole: [
      '専門評価、定着支援、ケース会議への参加で判断を補う',
      '相談内容が医療・福祉・就労支援へまたがる場合の橋渡しを担う',
    ],
    returnPath: '面談が形骸化したら、JACと管理者と地域支援者で役割を再分解する。',
  },
  'p-disclosure-boundary': {
    summary: '開示量の判断を企業内だけで抱えず、必要最小限共有と支援接続をセットで設計する。',
    jacRole: [
      '共有目的、共有相手、見直し時点を配慮実装に必要な範囲へ絞る',
      '企業へは開示内容だけでなく、支援体制と戻し先もセットで示す',
    ],
    regionalRole: [
      '本人同意に基づく情報共有設計とケース会議運営を支える',
      '共有しない情報でも支援可能な代替手段を提案する',
    ],
    returnPath: '共有範囲で迷いが続く場合は、目的を再確認して最小共有へ戻す。',
  },
  'p-mental-fluctuation-plan': {
    summary: '悪化時対応を社内ルールだけで閉じず、外部支援者の再評価導線を持つと運用しやすい。',
    jacRole: [
      '初期サイン、段階調整、緊急時連絡の閾値を明文化する',
      '企業単独で担えない対応を地域支援体制つきで提示する',
    ],
    regionalRole: [
      '再評価、定着支援、緊急時の伴走を支える',
      '必要時に医療・福祉・就労支援との接続を調整する',
    ],
    returnPath: '兆候が再発したら、初期サイン定義と支援頻度を見直す。',
  },
};

function extractArraySource(text, marker) {
  const start = text.indexOf(marker);
  if (start < 0) return null;
  const equalIndex = text.indexOf('=', start);
  if (equalIndex < 0) return null;
  const bracketStart = text.indexOf('[', equalIndex);
  if (bracketStart < 0) return null;
  let depth = 0;
  let inString = false;
  let quote = '';
  for (let i = bracketStart; i < text.length; i += 1) {
    const ch = text[i];
    const prev = text[i - 1];
    if (inString) {
      if (ch === quote && prev !== '\\') inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '[') depth += 1;
    if (ch === ']') depth -= 1;
    if (depth === 0) return text.slice(bracketStart, i + 1);
  }
  return null;
}

function extractObjectSource(text, marker) {
  const start = text.indexOf(marker);
  if (start < 0) return null;
  const equalIndex = text.indexOf('=', start);
  if (equalIndex < 0) return null;
  const braceStart = text.indexOf('{', equalIndex);
  if (braceStart < 0) return null;
  let depth = 0;
  let inString = false;
  let quote = '';
  for (let i = braceStart; i < text.length; i += 1) {
    const ch = text[i];
    const prev = text[i - 1];
    if (inString) {
      if (ch === quote && prev !== '\\') inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') depth -= 1;
    if (depth === 0) return text.slice(braceStart, i + 1);
  }
  return null;
}

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function countKeywordMatches(text, keywords) {
  const normalized = normalizeText(text);
  return (Array.isArray(keywords) ? keywords : []).reduce((count, keyword) => {
    const token = normalizeText(keyword);
    if (!token) return count;
    return normalized.includes(token) ? count + 1 : count;
  }, 0);
}

function parseJsonl(raw) {
  return String(raw || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function cleanSupportLabel(label) {
  return String(label || '')
    .replace(/\(要確認\)/g, '')
    .trim();
}

function shortenText(value, max = 72) {
  const text = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trim()}…`;
}

function hasJapaneseText(value) {
  return /[ぁ-んァ-ヶ一-龠]/.test(String(value || ''));
}

function normalizeEvidenceLane(value) {
  const lane = String(value || '').trim();
  if (!lane) return 'unknown';
  return lane;
}

function summarizeLaneLabels(lanes) {
  return unique(
    lanes.map(
      (lane) => EVIDENCE_LANE_LABEL[String(lane || '').trim()] || String(lane || '').trim(),
    ),
  ).slice(0, 2);
}

function sourceRegionsToCountries(sourceRegions) {
  return unique(
    (Array.isArray(sourceRegions) ? sourceRegions : [])
      .map(
        (region) => REGION_TO_COUNTRY[String(region || '').trim()] || String(region || '').trim(),
      )
      .filter((country) => country && country !== 'unknown'),
  );
}

function rewriteTitle(card) {
  const id = String(card?.id || '');
  if (TITLE_MECE[id]) return TITLE_MECE[id];
  return String(card?.title || '')
    .replace('が主因: ', '')
    .replace('が主因：', '')
    .replace(/[:：].*$/, '')
    .trim();
}

function rewriteSituation(situation) {
  const source = String(situation || '').trim();
  if (!source) return source;
  let normalized = source.replace(/^主課題が「[^」]+」にある場合のカード。?\s*/, '').trim();
  if (!/[。.!！?？]$/.test(normalized)) normalized = `${normalized}。`;
  return normalized;
}

function rewriteSelectionBoundary(boundary) {
  const source = String(boundary || '').trim();
  if (!source) return source;
  return source.replace(/「([^」]+)が主因」/g, '「$1」').replace(/が主因/g, 'が中心');
}

function unique(arr) {
  return [
    ...new Set((Array.isArray(arr) ? arr : []).map((v) => String(v || '').trim()).filter(Boolean)),
  ];
}

function sortSituationLevels(levels) {
  const order = {
    stable: 0,
    moderate: 1,
    high: 2,
    critical: 3,
  };
  return [...(Array.isArray(levels) ? levels : [])].sort(
    (a, b) => (order[String(a?.tone || '')] ?? 99) - (order[String(b?.tone || '')] ?? 99),
  );
}

function hasFocus(card, focusSet) {
  return (Array.isArray(card?.focus) ? card.focus : []).some((focus) =>
    focusSet.has(String(focus || '').trim()),
  );
}

function isPrivacySensitive(card) {
  return (
    hasFocus(card, FOCUS_PRIVACY_SENSITIVE) ||
    ['p-mental-fluctuation-plan', 'p-higher-brain-memory-support'].includes(String(card?.id || ''))
  );
}

function isSystemNavigation(card) {
  return (
    hasFocus(card, FOCUS_SYSTEM_NAVIGATION) ||
    [
      'p-worktrial-transition',
      'p-income-condition-stability',
      'p-support-service-navigation',
    ].includes(String(card?.id || ''))
  );
}

function isHealthEmployment(card) {
  return (
    hasFocus(card, FOCUS_HEALTH_EMPLOYMENT) ||
    ['p-commute-hybrid', 'p-shift-rhythm-guard'].includes(String(card?.id || ''))
  );
}

function isSafetyAccess(card) {
  return SAFETY_ACCESS_CARD_IDS.has(String(card?.id || ''));
}

function buildLegalPolicyGuardrail(card, grounding = {}) {
  const id = String(card?.id || '');
  const checks = ['適用法域を JP / US / UK / EU-DE のどこで使うか先に固定する'];
  let summary =
    '26フレームは課題の型を示す。義務・禁止・接続先は法政策ガードレール層で別途確定する。';
  let escalation = '義務か推奨かが曖昧なら、人事・法務・制度窓口へ戻して確定する。';

  if (isPrivacySensitive(card)) {
    summary =
      '健康情報・個人情報の扱いは法域差が大きい。共有目的と共有範囲を先に固定してから実装する。';
    checks.push('共有情報を配慮実装に必要な最小限へ絞り、同意と見直し時点を決める');
    checks.push('共有先ごとの目的、記録責任、保存ルールを分けておく');
    escalation = '共有範囲、同意、記録要件で迷う場合は人事・法務・制度窓口へエスカレーションする。';
  } else if (isSystemNavigation(card)) {
    summary = '制度・給付・実習・支援機関の要件は法域や自治体で変わる。制度確認前提で使う。';
    checks.push('制度対象要件、期限、雇用区分、支給条件を確認する');
    checks.push('義務、推奨、任意支援を分けて書き分ける');
    escalation = '制度適用や契約条件が不明なら、制度窓口・支援機関・労務へ接続する。';
  } else if (isHealthEmployment(card)) {
    summary = '通院・復職・勤務条件の扱いは制度や雇用区分で変わる。善意運用だけで決めない。';
    checks.push('休職、短時間勤務、通院配慮、在宅などの適用条件を確認する');
    checks.push('健康情報は最小限共有にとどめ、勤務変更権限者を明確にする');
    escalation = '就業可否や勤務条件変更が絡む場合は、人事・労務・産業保健へ戻す。';
  } else if (isSafetyAccess(card)) {
    summary =
      '安全・アクセシビリティ・就業可否は現場裁量だけで決めない。最低基準を前提に調整する。';
    checks.push('安全衛生、設備、アクセシビリティの最低基準を確認する');
    checks.push('職務要件と調整可能範囲を分けて記録する');
    escalation = '安全判断が割れる場合は、安全衛生・産業保健・制度窓口へ接続する。';
  } else {
    checks.push('義務か推奨か、外部接続が必要かを分けて記録する');
    checks.push('法域差が残る論点は question-first で条件確認してから実装する');
  }

  if (String(card?.mode || '') === 'questions_first') {
    checks.push(
      'person / job / environment / support / time / institution を確認して断定運用を避ける',
    );
  }

  return {
    summary,
    checks: unique(checks).slice(0, 3),
    escalation,
    grounding,
    category: isPrivacySensitive(card)
      ? 'privacy_sensitive'
      : isSystemNavigation(card)
        ? 'system_navigation'
        : isHealthEmployment(card)
          ? 'health_employment'
          : isSafetyAccess(card)
            ? 'safety_access'
            : 'general',
    source: id,
  };
}

function buildRegionalSupportOverlay(card, grounding = {}) {
  const id = String(card?.id || '');
  const override = HEAVY_REGIONAL_SUPPORT_OVERRIDES[id];
  if (override) {
    return {
      summary: override.summary,
      jacRole: unique(override.jacRole).slice(0, 2),
      regionalRole: unique(override.regionalRole).slice(0, 2),
      returnPath: override.returnPath,
      grounding,
    };
  }

  const jacRole = [];
  const regionalRole = [];

  if (String(card?.mode || '') === 'questions_first') {
    jacRole.push(
      'person / job / environment / support / time / institution を先に確認し、適用条件を狭める',
    );
  } else {
    jacRole.push('企業内で回せる共通設計と、個別調整が必要な部分を切り分ける');
  }
  jacRole.push('企業内担当者、期限、見直し条件を明文化し、重い実装は外部支援込みで提示する');

  if (isSystemNavigation(card)) {
    regionalRole.push('制度要件の確認、申請補助、窓口間連携を支える');
  } else if (isHealthEmployment(card)) {
    regionalRole.push('通院、復職、定着支援、ケース会議で再評価を支える');
  } else if (isSafetyAccess(card)) {
    regionalRole.push('専門評価、訓練導入、安全配慮の再設計を支える');
  } else {
    regionalRole.push('必要時に専門評価、定着支援、ケース会議を支える');
  }
  regionalRole.push('企業単独で抱えにくい配慮や支援を、実施可能な体制へ翻訳する');

  return {
    summary: '企業単独で重い配慮は、JAC提案と地域支援体制をセットで示すと実施しやすい。',
    jacRole: unique(jacRole).slice(0, 2),
    regionalRole: unique(regionalRole).slice(0, 2),
    returnPath: '実施が止まったら、本人・JAC・企業・地域支援者で役割と次回判断点を再固定する。',
    grounding,
  };
}

function buildData2Grounding(profile, data2Entries) {
  const pairMap = new Map();
  for (const entry of Array.isArray(data2Entries) ? data2Entries : []) {
    const disability = String(entry?.disability || '不明').trim() || '不明';
    for (const issueRow of Array.isArray(entry?.issues) ? entry.issues : []) {
      const issue = String(issueRow?.issue || '').trim();
      if (!issue) continue;
      const issueMatches = countKeywordMatches(issue, profile?.issueKeywords || []);
      const supports = Array.isArray(issueRow?.supports) ? issueRow.supports : [];
      const hasNonIdenticalSupport = supports.some((supportRaw) => {
        const support = cleanSupportLabel(supportRaw);
        return support && normalizeText(support) !== normalizeText(issue);
      });
      for (const supportRaw of supports) {
        const support = cleanSupportLabel(supportRaw);
        if (!support) continue;
        const sameText = normalizeText(support) === normalizeText(issue);
        if (sameText && hasNonIdenticalSupport) continue;
        const supportMatches = countKeywordMatches(support, profile?.supportKeywords || []);
        if (issueMatches === 0 && supportMatches === 0) continue;
        const score =
          issueMatches * 2 + supportMatches * 3 + (issueMatches > 0 && supportMatches > 0 ? 2 : 0);
        const key = `${issue}|||${support}`;
        const prev = pairMap.get(key);
        if (!prev) {
          pairMap.set(key, {
            issue,
            support,
            score,
            count: 1,
            disabilities: new Set([disability]),
            sameText,
          });
          continue;
        }
        prev.score += score;
        prev.count += 1;
        prev.disabilities.add(disability);
      }
    }
  }

  const bestPair =
    Array.from(pairMap.values()).sort((a, b) => {
      if (a.sameText !== b.sameText) return Number(a.sameText) - Number(b.sameText);
      if (b.score !== a.score) return b.score - a.score;
      if (b.count !== a.count) return b.count - a.count;
      return b.disabilities.size - a.disabilities.size;
    })[0] || null;

  return {
    bestPair,
    pairCount: bestPair?.count || 0,
    disabilityCount: bestPair?.disabilities?.size || 0,
  };
}

function buildClaimGrounding(card, profile, claims) {
  const targetCountries = sourceRegionsToCountries(card?.evidenceTrace?.sourceRegions);
  const targetCountrySet = new Set(targetCountries);
  const anchoredClaimIds = new Set(
    (Array.isArray(card?.evidenceTrace?.claimIds) ? card.evidenceTrace.claimIds : [])
      .map((id) => String(id || '').trim())
      .filter(Boolean),
  );

  const scored = (Array.isArray(claims) ? claims : [])
    .map((claim) => {
      if (String(claim?.risk?.level || '') === 'high') return null;
      const statement = String(claim?.canonicalStatement || claim?.statement || '').trim();
      if (!statement || NOISY_STATEMENT_REGEX.test(statement)) return null;
      const issueHits = countKeywordMatches(statement, profile?.issueKeywords || []);
      const supportHits = countKeywordMatches(statement, profile?.supportKeywords || []);
      const claimHits = countKeywordMatches(statement, profile?.claimKeywords || []);
      const lane = normalizeEvidenceLane(claim?.interactionContextSummary?.evidenceLane);
      const countries = Array.isArray(claim?.interactionContextSummary?.countries)
        ? claim.interactionContextSummary.countries
            .map((country) => String(country || '').trim())
            .filter(Boolean)
        : [];
      const anchored = anchoredClaimIds.has(String(claim?.id || '').trim()) ? 1.6 : 0;
      const laneScore =
        lane === 'legal_policy'
          ? 1.2
          : lane === 'employer_guidance'
            ? 1.0
            : lane === 'case_practice'
              ? 0.9
              : lane === 'mixed'
                ? 0.8
                : lane === 'case_guide'
                  ? 0.6
                  : 0.2;
      const signalScore =
        Array.isArray(profile?.preferredSignals) &&
        profile.preferredSignals.includes(String(claim?.signal || ''))
          ? 0.5
          : 0;
      const countryScore = countries.some((country) => targetCountrySet.has(country)) ? 0.6 : 0;
      const evidenceScore = Math.min(Number(claim?.evidenceCount || 0), 30) / 15;
      const score =
        issueHits * 1.4 +
        supportHits * 1.4 +
        claimHits * 2 +
        laneScore +
        signalScore +
        countryScore +
        anchored +
        evidenceScore;
      if (score <= 1.8) return null;
      return {
        claim,
        lane,
        score: Number(score.toFixed(3)),
        countries,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Number(b.claim?.evidenceCount || 0) - Number(a.claim?.evidenceCount || 0);
    });

  const selected = scored.slice(0, 4);
  const topPolicy =
    selected.find((item) => item.lane === 'legal_policy') ||
    selected.find((item) => item.lane === 'employer_guidance') ||
    null;
  const topPractice =
    selected.find(
      (item) =>
        item.lane === 'case_practice' || item.lane === 'mixed' || item.lane === 'case_guide',
    ) ||
    selected.find((item) => item.lane === 'employer_guidance') ||
    null;

  return {
    selectedCount: selected.length,
    matchedCount: scored.length,
    practiceCount: selected.filter((item) =>
      ['case_practice', 'mixed', 'case_guide', 'employer_guidance'].includes(item.lane),
    ).length,
    countries: unique(selected.flatMap((item) => item.countries))
      .filter((country) => country && country !== 'unknown')
      .slice(0, 4),
    lanes: unique(selected.map((item) => item.lane)),
    topPolicy,
    topPractice,
  };
}

function buildLegalPolicyGrounding(card, claimGrounding) {
  const countries =
    claimGrounding.countries.length > 0
      ? claimGrounding.countries
      : sourceRegionsToCountries(card?.evidenceTrace?.sourceRegions);
  const laneLabels = summarizeLaneLabels(claimGrounding.lanes);
  const count = Number(claimGrounding.selectedCount || 0);
  const topPolicyStatement = String(
    claimGrounding.topPolicy?.claim?.canonicalStatement ||
      claimGrounding.topPractice?.claim?.canonicalStatement ||
      '',
  ).trim();
  const observationParts = [];
  if (countries.length > 0 && laneLabels.length > 0) {
    observationParts.push(
      `上位根拠は${countries.join(' / ')}由来の${laneLabels.join(' / ')}claims`,
    );
  } else if (countries.length > 0) {
    observationParts.push(`上位根拠は${countries.join(' / ')}由来で法域差を含む`);
  } else if (count > 0 && laneLabels.length > 0) {
    observationParts.push(`上位根拠は${laneLabels.join(' / ')}claims`);
  } else if (countries.length > 0) {
    observationParts.push(`sourceRegions が ${countries.join(' / ')} にまたがる`);
  }
  if (hasJapaneseText(topPolicyStatement)) {
    observationParts.push(`代表断片は「${shortenText(topPolicyStatement, 54)}」`);
  }
  const evidenceCueParts = [];
  if (count > 0) evidenceCueParts.push(`採用根拠: 上位${count}件`);
  if (countries.length > 0) evidenceCueParts.push(`参照法域: ${countries.join(' / ')}`);
  return {
    observation: observationParts.length > 0 ? `${observationParts.join('。')}。` : '',
    evidenceCue: evidenceCueParts.join(' / '),
  };
}

function buildRegionalSupportGrounding(data2Grounding, claimGrounding) {
  const bestPair = data2Grounding.bestPair;
  const observationParts = [];
  if (bestPair) {
    observationParts.push(
      `data2では「${bestPair.issue}」に対して「${bestPair.support}」が${bestPair.count}件（${bestPair.disabilities.size}障害群）で反復`,
    );
  }
  const topPracticeStatement = String(
    claimGrounding.topPractice?.claim?.canonicalStatement || '',
  ).trim();
  if (hasJapaneseText(topPracticeStatement)) {
    observationParts.push(`上位claimsでは「${shortenText(topPracticeStatement, 54)}」が参照された`);
  } else if (Number(claimGrounding.practiceCount || 0) > 0) {
    observationParts.push('上位claimsでも支援接続の事例が重なる');
  }
  const evidenceCueParts = [];
  if (bestPair) {
    evidenceCueParts.push(`反復ペア: ${bestPair.issue} × ${bestPair.support}`);
  }
  if (Number(claimGrounding.practiceCount || 0) > 0)
    evidenceCueParts.push(`採用claims: 上位${claimGrounding.practiceCount}件`);
  return {
    observation: observationParts.length > 0 ? `${observationParts.join('。')}。` : '',
    evidenceCue: evidenceCueParts.join(' / '),
  };
}

function classifyQuickBundle(bundle) {
  const lines = unique(bundle);
  const standardized = [];
  const individualized = [];
  for (const line of lines) {
    if (/本人|同意|面談|相談|ケース会議|体調チェック|適用法域|雇用区分|開示範囲|個別/.test(line)) {
      individualized.push(line);
      continue;
    }
    if (
      /標準|固定|明文化|テンプレ|ルール|設定|分割|配布|提供|統一|設計|再編|回避|制限|定義/.test(
        line,
      )
    ) {
      standardized.push(line);
      continue;
    }
    standardized.push(line);
  }
  if (standardized.length === 0 && lines.length > 0) {
    standardized.push(lines[0]);
    for (const line of lines.slice(1)) individualized.push(line);
  }
  return {
    standardized: unique(standardized),
    individualized: unique(individualized),
    principle: '標準設計で土台を整え、個別調整で最適化する',
  };
}

function buildIndividualizedFromCard(card, existingIndividualized) {
  const lines = unique(existingIndividualized);
  const followUps = unique(Array.isArray(card?.followUpQuestions) ? card.followUpQuestions : []);
  const preconditions = unique(Array.isArray(card?.preconditions) ? card.preconditions : []);
  const mode = String(card?.mode || '');

  if (lines.length === 0 && followUps.length > 0) {
    const q1 = followUps[0];
    const q2 = followUps[1];
    if (q1) lines.push(`本人条件を確認: ${q1}`);
    if (q2) lines.push(`業務・環境条件を確認: ${q2}`);
  }

  if (lines.length < 2 && preconditions.length > 0) {
    const p = preconditions[0];
    if (p) lines.push(`適用前条件を確認: ${p}`);
  }

  if (mode === 'questions_first') {
    lines.push('適用前に person/job/environment/support/time/institution/evidence を確認する');
  }

  if (lines.length === 0) {
    lines.push('本人・業務・環境の3条件を面談で確定し、適用範囲を限定する');
  }

  return unique(lines).slice(0, 3);
}

function buildDisabilityConnection(cardId, patternFacetMap) {
  const facets = Array.isArray(patternFacetMap?.[cardId]) ? patternFacetMap[cardId] : [];
  const examples = unique(
    facets.map((facet) => DISABILITY_FACET_LABEL[String(facet || '').trim()]).filter(Boolean),
  );
  return {
    note: '障害者雇用では次の類型で先に可視化されやすい（多様性の例示）。',
    examples,
  };
}

function buildAliasMap(cards) {
  const map = new Map();
  for (const card of Array.isArray(cards) ? cards : []) {
    const oldTitle = String(card?.title || '');
    const oldCause = oldTitle.split(':')[0]?.trim() || oldTitle.trim();
    const oldBase = oldCause.replace(/が主因$/, '').trim();
    const nextTitle = rewriteTitle(card);
    if (oldBase) map.set(oldBase, nextTitle);
    if (oldCause) map.set(oldCause, nextTitle);
    if (oldBase) map.set(`${oldBase}が中心`, nextTitle);
  }
  map.set('復職ランプ不足', TITLE_MECE['p-return-to-work-ramp']);
  return map;
}

function applyAliasToSelectionBoundary(text, aliasMap) {
  let out = String(text || '');
  for (const [from, to] of aliasMap.entries()) {
    if (!from || !to) continue;
    out = out.replaceAll(`「${from}」`, `「${to}」`);
  }
  return out;
}

async function main() {
  const [guideText, data2Raw, claimsRaw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(DATA2_INDEX_PATH, 'utf8').catch(() => ''),
    fs.readFile(CLAIMS_JSONL_PATH, 'utf8').catch(() => ''),
  ]);
  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  const situationLevelsSource = extractObjectSource(
    guideText,
    'const CARD_SITUATION_LEVELS: Record<string, SituationSeverityLevel[]> =',
  );
  const facetMapSource = extractObjectSource(
    guideText,
    'const PATTERN_DISABILITY_FACETS: Record<string, DisabilityFacetKey[]> =',
  );
  const profilesSource = extractObjectSource(
    guideText,
    'const CARD_MINING_PROFILES: Record<string, CardMiningProfile> =',
  );
  if (!cardsSource || !profilesSource) {
    throw new Error('PATTERN_CARDS or CARD_MINING_PROFILES not found in guide.tsx');
  }
  const cards = new Function(`return (${cardsSource});`)();
  const situationLevels = situationLevelsSource
    ? new Function(`return (${situationLevelsSource});`)()
    : {};
  const profiles = new Function(`return (${profilesSource});`)();
  const aliasMap = buildAliasMap(cards);
  const patternFacetMap = facetMapSource ? new Function(`return (${facetMapSource});`)() : {};
  const data2 = data2Raw ? JSON.parse(data2Raw) : {};
  const data2Entries = Array.isArray(data2?.entries) ? data2.entries : [];
  const claims = parseJsonl(claimsRaw);
  const rows = (Array.isArray(cards) ? cards : []).map((card) => {
    const profile = profiles?.[String(card?.id || '')] || {
      issueKeywords: [String(card?.title || '')],
      supportKeywords: [],
      claimKeywords: [String(card?.title || '')],
      preferredSignals: [],
    };
    const data2Grounding = buildData2Grounding(profile, data2Entries);
    const claimGrounding = buildClaimGrounding(card, profile, claims);
    const quickBundle = classifyQuickBundle(card?.quickBundle);
    const individualizedRaw = buildIndividualizedFromCard(card, quickBundle.individualized);
    const individualized = unique(
      individualizedRaw.filter((line) => !quickBundle.standardized.includes(line)),
    );
    if (individualized.length === 0) {
      individualized.push('本人・業務・環境の3条件を面談で確定し、適用範囲を限定する');
    }
    return {
      id: String(card?.id || ''),
      title: rewriteTitle(card),
      situation: rewriteSituation(card?.situation),
      selectionBoundary: applyAliasToSelectionBoundary(
        rewriteSelectionBoundary(card?.selectionBoundary),
        aliasMap,
      ),
      disabilityEmploymentConnection: buildDisabilityConnection(
        String(card?.id || ''),
        patternFacetMap,
      ),
      legalPolicyGuardrail: buildLegalPolicyGuardrail(
        card,
        buildLegalPolicyGrounding(card, claimGrounding),
      ),
      regionalSupportOverlay: buildRegionalSupportOverlay(
        card,
        buildRegionalSupportGrounding(data2Grounding, claimGrounding),
      ),
      quickBundle: {
        ...quickBundle,
        individualized,
      },
      quickBundleFlat: unique(card?.quickBundle),
      situationLevels: sortSituationLevels(situationLevels?.[String(card?.id || '')]),
    };
  });

  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'pages/jac/guide.tsx#PATTERN_CARDS + CARD_MINING_PROFILES + data2 + knowledge-claims',
    principle:
      '就業共通設計は、人に無理をさせないために、人を選別するのではなく、仕事の側を先に設計し直す発想。',
    cardCount: rows.length,
    cards: rows.filter((row) => row.id),
  };

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        cardCount: payload.cardCount,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
