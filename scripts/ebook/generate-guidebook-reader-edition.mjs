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
const GLM_RELATIONS_PATH = path.join(
  process.cwd(),
  'references',
  'GLM_resutls',
  'nanbyo-glm-significant-relations.json',
);
const OUTPUT_PATH = path.join(process.cwd(), 'docs', 'guidebook', 'manuscript-reader-edition.md');
const GLM_CARD_LANE_OUTPUT_PATH = path.join(
  process.cwd(),
  'references',
  'jac',
  'glm-individual-disease-lane-by-card.json',
);
const COMMON_COPY_PATH = path.join(
  process.cwd(),
  'references',
  'jac',
  'common-work-design-copy.json',
);
const LAYER_DISPOSITION_PATH = path.join(
  process.cwd(),
  'references',
  'jac',
  'layer-disposition.json',
);
const NOISY_STATEMENT_REGEX =
  /(close menu|toggle navigation|skip to main content|サイトマップ|検索結果|本文へ|文字サイズ変更|背景色変更|all rights reserved|copyright|メニュー\s*閉じる|table of contents|users[\\/]|synologydrive|プロセッサ時間|経過時間|モデル情報|従属変数|リンク関数|処理したケースの要約|nanbyoglm\.xlsx)/i;
const LAYER_ORDER = ['health', 'transition', 'operation'];
const LAYER_LABEL_FALLBACK = {
  health: '体調レイヤー',
  transition: '就職移行レイヤー',
  operation: '職場運用レイヤー',
};
const LAYER_NOTE = {
  health: '変動・治療・回復・リズムを運用できる形に整理',
  transition: '探索→応募→面接→合意→定着までの移行工程を整理',
  operation: '会議・指示・安全・日常業務の詰まりを運用設計として整理',
};
const LAYER_INFOGRAPHIC = {
  health: {
    relativePathFromGuidebook: '../26cards/体調レイヤー.png',
    alt: '体調レイヤー（9フレーム）カード一覧',
  },
  transition: {
    relativePathFromGuidebook: '../26cards/就職移行レイヤー.png',
    alt: '就職移行レイヤー（7フレーム）カード一覧',
  },
  operation: {
    relativePathFromGuidebook: '../26cards/職場運用レイヤー.png',
    alt: '職場運用レイヤー（10フレーム）カード一覧',
  },
};
const CHAPTER_SUBTITLE_BY_ID = {
  'p-meeting-overload': '長時間会議で理解と疲労が同時に悪化',
  'p-fatigue-pacing': '体調の波で日ごとの達成度がぶれやすい',
  'p-medical-schedule': '通院予定と業務ピークが衝突しやすい',
  'p-environment-sensory': '刺激過多で集中と持続が落ちやすい',
  'p-commute-hybrid': '通勤消耗で業務前にエネルギーが切れやすい',
  'p-disclosure-boundary': '必要共有と過剰開示の境界が曖昧になりやすい',
  'p-return-to-work-ramp': '復職初期に負荷設定を誤ると再不調しやすい',
  'p-shift-rhythm-guard': '勤務帯の乱れで睡眠・服薬リズムが崩れやすい',
  'p-manager-checkin': '相談遅延で調整が後手になりやすい',
  'p-customer-facing-load': '即時応答の連続で対人負荷が過密化',
  'p-visual-document-access': '資料形式が合わず読み取り負荷が蓄積',
  'p-hearing-meeting-access': '聞き取り欠落で判断遅延と誤解が発生',
  'p-physical-mobility-route': '移動動線の負荷で始業前疲労が高まる',
  'p-safety-critical-operations': '危険業務で事故リスクと不安が同時上昇',
  'p-internal-treatment-compatibility': '治療後の回復時間を確保できない',
  'p-intellectual-task-clarity': '指示の曖昧さでミスと手戻りが増える',
  'p-developmental-switch-load': '割込み多発で切替コストが急増',
  'p-mental-fluctuation-plan': '悪化兆候の見逃しで離脱リスクが上がる',
  'p-higher-brain-memory-support': '記憶負荷で抜け漏れと疲労が連鎖',
  'p-jobmatch-exploration': '求人要件と自己理解が噛み合わない',
  'p-application-contact-flow': '応募手順の曖昧さで機会損失が起こる',
  'p-interview-self-advocacy': '開示設計不足で配慮合意に失敗しやすい',
  'p-skill-building-path': '学習目標が広すぎ実務接続が弱い',
  'p-worktrial-transition': '実習評価と採用後運用が接続していない',
  'p-income-condition-stability': '収入・契約・体調の整合が崩れやすい',
  'p-support-service-navigation': '支援情報の分散で接続が遅れる',
};

function extractArraySource(fileText, marker) {
  const markerIndex = fileText.indexOf(marker);
  if (markerIndex < 0) return null;
  const equalIndex = fileText.indexOf('=', markerIndex);
  if (equalIndex < 0) return null;
  const start = fileText.indexOf('[', equalIndex);
  if (start < 0) return null;

  let depth = 0;
  let end = -1;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let i = start; i < fileText.length; i += 1) {
    const ch = fileText[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '[') depth += 1;
    else if (ch === ']') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  return end < 0 ? null : fileText.slice(start, end + 1);
}

function extractObjectSource(fileText, marker) {
  const markerIndex = fileText.indexOf(marker);
  if (markerIndex < 0) return null;
  const equalIndex = fileText.indexOf('=', markerIndex);
  if (equalIndex < 0) return null;
  const start = fileText.indexOf('{', equalIndex);
  if (start < 0) return null;

  let depth = 0;
  let end = -1;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let i = start; i < fileText.length; i += 1) {
    const ch = fileText[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  return end < 0 ? null : fileText.slice(start, end + 1);
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[「」『』（）()・、。.,:：!?！？\[\]【】]/g, '');
}

function countKeywordMatches(text, keywords) {
  const normalized = normalize(text);
  return (Array.isArray(keywords) ? keywords : []).reduce((count, keyword) => {
    const key = normalize(keyword);
    if (!key) return count;
    return normalized.includes(key) ? count + 1 : count;
  }, 0);
}

function pickUnique(items, max) {
  const seen = new Set();
  const out = [];
  for (const item of items || []) {
    const key = String(item || '').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= max) break;
  }
  return out;
}

function shorten(text, max = 70) {
  const cleaned = String(text || '')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/[�]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return '';
  const first = cleaned.split(/[。!?！？]/)[0].trim() || cleaned;
  if (first.length <= max) return first;
  return `${first.slice(0, max)}…`;
}

function normalizeSituationCore(situation) {
  let text = String(situation || '').trim();
  text = text.replace(/^就業共通設計では、人を選別する前に仕事の側を先に設計し、/, '');
  text = text.replace(
    /この設計要素は、特性差・体調変動・ライフイベントの違いがある誰にでも起こりうる。?$/,
    '',
  );
  text = text.trim();
  return text;
}

function buildChapterSubtitle(card) {
  const cardId = String(card?.id || '');
  if (CHAPTER_SUBTITLE_BY_ID[cardId]) return CHAPTER_SUBTITLE_BY_ID[cardId];
  const core = normalizeSituationCore(card?.situation);
  const head = core.split('、')[1] || core.split(/[。.!！?？]/)[0] || '';
  const cleaned = String(head || '')
    .replace(/[。.!！?？]$/, '')
    .trim();
  if (!cleaned) return '運用条件を再設計する';
  if (cleaned.length <= 28) return cleaned;
  return `${cleaned.slice(0, 28)}…`;
}

function toBullets(items, fallback = '（該当なし）') {
  if (!Array.isArray(items) || items.length === 0) return `- ${fallback}`;
  return items.map((item) => `- ${String(item || '').trim()}`).join('\n');
}

function normalizeDecision(detail) {
  const value = String(detail?.disposition || '').trim();
  if (
    value === 'move_to_shared_layer' ||
    value === 'move_to_separate_guide' ||
    value === 'keep_in_card'
  ) {
    return value;
  }
  return 'keep_in_card';
}

function decisionLabel(decision) {
  if (decision === 'move_to_shared_layer') return '共通レイヤーで確認';
  if (decision === 'move_to_separate_guide') return '別ガイドで確認';
  return 'カード内に残す';
}

function keepInCardLines(detail) {
  return Array.isArray(detail?.keepInCard)
    ? detail.keepInCard.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
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

async function fileExists(targetPath) {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

function isDiseaseLikeDisabilityLabel(label) {
  const text = String(label || '').trim();
  if (!text) return false;
  return /難病|病|症|透析|肝炎|免疫|血友|心臓|腎臓|後遺症|線維|尿症|血液|腹膜|機能障害|てんかん/i.test(
    text,
  );
}

function buildRepresentativeDisabilitySamples(rows, max = 6) {
  const stats = new Map();
  for (const row of rows || []) {
    const key = String(row?.disability || '不明').trim() || '不明';
    const current = stats.get(key) || {
      disability: key,
      count: 0,
      sumScore: 0,
      maxScore: 0,
      diseaseLike: isDiseaseLikeDisabilityLabel(key),
    };
    current.count += 1;
    current.sumScore += Number(row?.score || 0);
    current.maxScore = Math.max(current.maxScore, Number(row?.score || 0));
    stats.set(key, current);
  }

  const ranked = Array.from(stats.values()).sort((a, b) => {
    if (b.sumScore !== a.sumScore) return b.sumScore - a.sumScore;
    if (b.maxScore !== a.maxScore) return b.maxScore - a.maxScore;
    if (b.count !== a.count) return b.count - a.count;
    return a.disability.localeCompare(b.disability, 'ja');
  });

  const picked = ranked.slice(0, max).map((item) => item.disability);
  const hasDiseaseLike = picked.some((label) => isDiseaseLikeDisabilityLabel(label));
  if (!hasDiseaseLike) {
    const diseaseCandidate = ranked.find((item) => item.diseaseLike);
    if (diseaseCandidate) {
      if (picked.length >= max) picked[max - 1] = diseaseCandidate.disability;
      else picked.push(diseaseCandidate.disability);
    }
  }

  const uniquePicked = pickUnique(picked, max);
  const diseaseExamples = ranked
    .filter((item) => item.diseaseLike)
    .slice(0, 6)
    .map((item) => item.disability);

  return {
    representative: uniquePicked,
    diseaseExamples: pickUnique(diseaseExamples, 6),
  };
}

function detectClaimSourceGroup(claim) {
  const sourceIds = Array.isArray(claim?.sourceIds)
    ? claim.sourceIds.map((x) => String(x || ''))
    : [];
  const hasRaw = sourceIds.includes('nbl_local_research');
  const hasWeb = sourceIds.some((id) => id && id !== 'nbl_local_research');
  if (hasRaw && hasWeb) return 'mixed';
  if (hasRaw) return 'raw_data';
  if (hasWeb) return 'web_cache';
  return 'other';
}

function summarizeTopLabels(rows, field, max = 4) {
  const stats = new Map();
  for (const row of rows || []) {
    for (const label of Array.isArray(row?.[field]) ? row[field] : []) {
      const key = String(label || '').trim();
      if (!key) continue;
      const prev = stats.get(key) || 0;
      stats.set(key, prev + 1);
    }
  }
  return Array.from(stats.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ja'))
    .slice(0, max)
    .map(([label]) => label);
}

function parseGlmRelations(raw) {
  let parsed = null;
  try {
    parsed = JSON.parse(String(raw || ''));
  } catch {
    return [];
  }
  const relations = Array.isArray(parsed?.relations)
    ? parsed.relations
    : Array.isArray(parsed)
      ? parsed
      : [];
  return relations
    .map((row) => ({
      id: String(row?.id || '').trim(),
      sheetOrder: Number(row?.sheetOrder || 0),
      predictorGroup: String(row?.predictorGroup || '').trim(),
      predictor: String(row?.predictor || '').trim(),
      outcome: String(row?.outcome || '').trim(),
      summary: String(row?.summary || '').trim(),
      p: Number(row?.p),
      b: Number(row?.b),
      keywords: Array.isArray(row?.keywords) ? row.keywords.map((x) => String(x || '')) : [],
    }))
    .filter((row) => row.id && row.predictor && row.outcome);
}

function glmSignalFromSheetOrder(sheetOrder) {
  const n = Number(sheetOrder || 0);
  if (n === 1) return 'difficulty_occurrence';
  if (n === 2) return 'difficulty_resolution';
  if (n === 3) return 'symptom_exacerbation';
  if (n === 4) return 'support_needs';
  return '';
}

function formatPValue(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 'n/a';
  if (n === 0) return '0';
  if (n < 0.001) return n.toExponential(1);
  return n.toFixed(3);
}

function scoreGlmRelationForCard(relation, profile) {
  const text = [
    String(relation?.predictor || ''),
    String(relation?.outcome || ''),
    String(relation?.summary || ''),
    ...(Array.isArray(relation?.keywords) ? relation.keywords : []),
  ]
    .join(' ')
    .trim();
  const issueHits = countKeywordMatches(text, profile?.issueKeywords || []);
  const supportHits = countKeywordMatches(text, profile?.supportKeywords || []);
  const claimHits = countKeywordMatches(text, profile?.claimKeywords || []);
  const keywordHits = issueHits + supportHits + claimHits;
  const signal = glmSignalFromSheetOrder(relation?.sheetOrder);
  const signalHit =
    signal && Array.isArray(profile?.preferredSignals) && profile.preferredSignals.includes(signal)
      ? 1
      : 0;
  const score = issueHits * 1.2 + supportHits * 1.2 + claimHits * 1.8 + signalHit * 0.8;
  return {
    score,
    keywordHits,
    signalHit,
  };
}

function buildGlmIndividualDiseaseLane(profile, glmRelations) {
  const matched = (Array.isArray(glmRelations) ? glmRelations : [])
    .filter((row) => String(row?.predictorGroup || '').includes('個別疾患'))
    .map((row) => {
      const fit = scoreGlmRelationForCard(row, profile || {});
      if (fit.keywordHits <= 0 && fit.signalHit <= 0) return null;
      return {
        relation: row,
        score: Number(fit.score.toFixed(3)),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const pA = Number.isFinite(Number(a.relation?.p))
        ? Number(a.relation.p)
        : Number.POSITIVE_INFINITY;
      const pB = Number.isFinite(Number(b.relation?.p))
        ? Number(b.relation.p)
        : Number.POSITIVE_INFINITY;
      if (pA !== pB) return pA - pB;
      const bA = Math.abs(Number(a.relation?.b || 0));
      const bB = Math.abs(Number(b.relation?.b || 0));
      return bB - bA;
    });
  const topRows = matched.slice(0, 4);
  const predictorTop = pickUnique(
    topRows.map((row) => String(row.relation?.predictor || '')),
    4,
  );
  const highlightTop = topRows.map((row) => {
    const predictor = String(row.relation?.predictor || '不明');
    const outcome = shorten(String(row.relation?.outcome || ''), 36);
    const bText = Number.isFinite(Number(row.relation?.b))
      ? Number(row.relation.b).toFixed(3)
      : 'n/a';
    const pText = formatPValue(row.relation?.p);
    return `${predictor}→${outcome} (B=${bText}, p=${pText})`;
  });
  const relationIdsTop = topRows.map((row) => String(row.relation?.id || '')).filter(Boolean);
  return {
    matchCount: matched.length,
    predictorTop,
    highlightTop,
    relationIdsTop,
  };
}

function buildClaimEvidenceForCard(profile, claims) {
  const scored = (Array.isArray(claims) ? claims : [])
    .map((claim) => {
      if (String(claim?.risk?.level || '') === 'high') return null;
      const statement = String(claim?.canonicalStatement || claim?.statement || '').trim();
      if (!statement || NOISY_STATEMENT_REGEX.test(statement)) return null;
      const issueHits = countKeywordMatches(statement, profile?.issueKeywords || []);
      const supportHits = countKeywordMatches(statement, profile?.supportKeywords || []);
      const claimHits = countKeywordMatches(statement, profile?.claimKeywords || []);
      const signalHit =
        String(claim?.signal || '') &&
        Array.isArray(profile?.preferredSignals) &&
        profile.preferredSignals.includes(String(claim.signal))
          ? 1
          : 0;
      const keywordScore = issueHits * 1.5 + supportHits * 1.5 + claimHits * 2 + signalHit;
      if (keywordScore <= 0) return null;
      const evidenceBoost = Math.min(Number(claim?.evidenceCount || 0), 40) / 20;
      const score = keywordScore + evidenceBoost;
      return {
        score,
        text: statement,
        sourceGroup: detectClaimSourceGroup(claim),
        conditionLabels: Array.isArray(claim?.interactionContextSummary?.conditionLabels)
          ? claim.interactionContextSummary.conditionLabels
          : [],
        disabilityLabels: Array.isArray(claim?.interactionContextSummary?.disabilityLabels)
          ? claim.interactionContextSummary.disabilityLabels
          : [],
      };
    })
    .filter(Boolean);

  const sortFn = (a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.text.length - a.text.length;
  };

  const rawRows = scored
    .filter((row) => row.sourceGroup === 'raw_data' || row.sourceGroup === 'mixed')
    .sort(sortFn);
  const webRows = scored
    .filter((row) => row.sourceGroup === 'web_cache' || row.sourceGroup === 'mixed')
    .sort(sortFn);

  return {
    rawCount: rawRows.length,
    webCount: webRows.length,
    rawTop: pickUnique(
      rawRows.map((row) => shorten(row.text, 72)),
      2,
    ),
    webTop: pickUnique(
      webRows.map((row) => shorten(row.text, 72)),
      2,
    ),
    rawConditionTop: summarizeTopLabels(rawRows, 'conditionLabels', 4),
    rawDisabilityTop: summarizeTopLabels(rawRows, 'disabilityLabels', 4),
    webConditionTop: summarizeTopLabels(webRows, 'conditionLabels', 4),
    webDisabilityTop: summarizeTopLabels(webRows, 'disabilityLabels', 4),
  };
}

function toOperationalAction(seed, card) {
  const text = String(seed || '').trim();
  if (!text) return card.quickBundle?.[0] || '1週間の試行ルールを固定する';
  if (text.includes('勤務時間帯の変更'))
    return '勤務時間帯の可変枠を設定し、不可業務帯を先に合意する。';
  if (text.includes('通院への配慮')) return '通院日程を先に確保し、納期計画を逆算で組み直す。';
  if (text.includes('休憩') || text.includes('健康管理'))
    return '回復休憩の時刻と場所を就業ルールとして明文化する。';
  if (text.includes('支援機器')) return '支援機器を導入し、利用手順まで業務標準に組み込む。';
  if (text.includes('相談')) return '週次チェックインを固定し、未対応項目に期限を設定する。';
  if (text.includes('正しい理解') || text.includes('理解'))
    return 'チームへ配慮目的と運用ルールを短時間で共有する。';
  if (text.includes('個別的な調整')) return '高負荷業務と低負荷業務を分け、週次で再配分する。';
  return card.quickBundle?.[0] || '1週間の試行ルールを固定する';
}

function toWeekPlanTitle(action, kind) {
  let text = String(action || '').trim();
  if (!text) return kind === 'common' ? '運用ルールを固定する' : '条件適合を確認する';
  text = text
    .replace(/^(本人条件を確認|業務・環境条件を確認|適用前条件を確認)\s*:\s*/, '')
    .replace(/^適用前に\s*/, '')
    .replace(/[。]$/, '')
    .trim();
  if (!text) return kind === 'common' ? '運用ルールを固定する' : '条件適合を確認する';
  if (text.length > 36) return `${text.slice(0, 36)}…`;
  return text;
}

function buildWeekPlanAim(action, kind) {
  const text = String(action || '').trim();
  const question = text.includes(':') ? text.split(':').slice(1).join(':').trim() : '';

  if (question && /本人条件を確認|業務・環境条件を確認|適用前条件を確認/.test(text)) {
    return `「${question}」を具体場面で確かめ、個別調整の前提条件を揃える。`;
  }
  if (kind === 'individualized' && /[?？]$/.test(text)) {
    return `「${text.replace(/[?？]+$/, '')}」を具体場面で確かめ、個別調整が必要な条件を絞る。`;
  }
  if (/週単位|平準|ピーク/.test(text)) {
    return '業務負荷の偏りを減らし、体調変動があっても納期を守れる運用にする。';
  }
  if (/事前資料|前日配布|資料/.test(text)) {
    return '会議中の同時処理負荷を減らし、判断を本題に集中できるようにする。';
  }
  if (/非同期|コメント/.test(text)) {
    return '同期で抱え込む量を減らし、必要な論点だけに会議を絞る。';
  }
  if (/安定時間帯|再配置/.test(text)) {
    return '負荷の高い作業を安定しやすい時間帯へ寄せ、無理な波を作らないようにする。';
  }
  if (/休憩|回復/.test(text)) {
    return '疲労の蓄積を予防し、悪化前に回復できるリズムを作る。';
  }
  if (/通院|治療/.test(text)) {
    return '治療と業務の衝突を減らし、就業継続の不安を下げる。';
  }
  if (/在宅|出社|通勤|時差/.test(text)) {
    return '移動や環境負荷を下げ、業務遂行に使えるエネルギーを確保する。';
  }
  if (/テンプレ|手順|チェックリスト|明文化|定義|固定/.test(text)) {
    return '担当者ごとの差を減らし、再現性のある対応へ揃える。';
  }
  if (/代替|引き継ぎ|担当/.test(text)) {
    return '突発時でも業務が止まらないバックアップ導線を作る。';
  }
  if (/相談|窓口|連絡|共有/.test(text)) {
    return '相談遅延を防ぎ、調整を後手にしない運用を作る。';
  }
  if (/危険|緊急|安全|停止/.test(text)) {
    return '安全判断の迷いを減らし、事故リスクを先に下げる。';
  }
  if (/記録|見える化|日次|週次/.test(text)) {
    return '効果検証を可能にし、改善の根拠を残す。';
  }
  if (kind === 'individualized') {
    return '本人条件と業務条件のズレを特定し、適用範囲を誤らないようにする。';
  }
  return '今週の運用に実装し、効果と負荷のバランスを確認する。';
}

function buildWeekPlanProcedure(action, kind) {
  const text = String(action || '').trim();
  const question = text.includes(':') ? text.split(':').slice(1).join(':').trim() : '';

  if (question && /本人条件を確認|業務・環境条件を確認|適用前条件を確認/.test(text)) {
    return `本人と管理者で短時間の確認を行い、「${question}」が出た場面と、そのとき有効だった対処を2例ずつ記録する。`;
  }
  if (kind === 'individualized' && /[?？]$/.test(text)) {
    return `本人と管理者で短時間の確認を行い、「${text.replace(/[?？]+$/, '')}」が起きた具体場面と、そのとき有効だった対処を2例ずつ出して記録する。`;
  }
  if (/週単位|平準|ピーク/.test(text)) {
    return '今週タスクを高・中・低負荷に分類し、同日に高負荷案件を集中させないよう再配置する。';
  }
  if (/事前資料|前日配布|資料/.test(text)) {
    return '資料は前日までに配布し、当日は未決項目と判断点だけを冒頭で確認する。';
  }
  if (/非同期|コメント/.test(text)) {
    return '同期で決めることと非同期コメントで済ませることを分け、返信期限と責任者を先に決める。';
  }
  if (/安定時間帯|再配置/.test(text)) {
    return '1日の中で比較的安定しやすい時間帯を確認し、高負荷タスクだけをその枠へ移して1週間試す。';
  }
  if (/休憩|回復/.test(text)) {
    return '休憩タイミング・場所・代替連絡先を先に決め、実運用で回復できたかを当日中に確認する。';
  }
  if (/通院|治療/.test(text)) {
    return '通院・治療予定を先に確保し、その前後で納期・会議・担当を組み替える。';
  }
  if (/在宅|出社|通勤|時差/.test(text)) {
    return 'タスクを出社必須/在宅可に分け、出社日は協働業務、在宅日は集中業務へ振り分ける。';
  }
  if (/テンプレ|手順|チェックリスト|明文化|定義|固定/.test(text)) {
    return '1ページの手順書を作成し、誰が実施しても同じ流れになるよう入力項目を固定する。';
  }
  if (/代替|引き継ぎ|担当/.test(text)) {
    return '代替担当・引継ぎ条件・連絡順を事前に合意し、突発時のシミュレーションを1回行う。';
  }
  if (/相談|窓口|連絡|共有/.test(text)) {
    return '相談窓口と応答期限を決め、未対応項目は週次レビューで必ず更新する。';
  }
  if (/危険|緊急|安全|停止/.test(text)) {
    return '停止判断ラインと代替手順を先に明文化し、危険作業は条件一致時のみ実施する。';
  }
  if (kind === 'individualized') {
    return '本人・業務・環境を分けて確認し、適用条件と除外条件を短文で合意する。';
  }
  return '対象運用を1週間だけ試行し、開始条件・停止条件・評価基準を事前に定義する。';
}

function buildWeekPlanMetric(action, kind) {
  const text = String(action || '').trim();
  if (
    kind === 'individualized' &&
    /本人条件を確認|業務・環境条件を確認|適用前条件を確認|は何か\?/.test(text)
  ) {
    return '確認事項の具体度、合意できた条件数、試行後の適合度を面談で確認する。';
  }
  if (/週単位|平準|ピーク|納期|遅延/.test(text)) {
    return '遅延件数、高負荷日の偏り、手戻り件数が減ったか。';
  }
  if (/休憩|回復|疲労|体調/.test(text)) {
    return '午後の疲労度、体調悪化の発生回数、集中維持時間が改善したか。';
  }
  if (/通院|治療/.test(text)) {
    return '通院予定の遵守率、欠勤不安の申告、業務穴の発生件数が改善したか。';
  }
  if (/在宅|出社|通勤|時差/.test(text)) {
    return '通勤負荷の主観評価、開始直後の作業着手率、途中離脱の有無。';
  }
  if (/相談|窓口|連絡|共有/.test(text)) {
    return '相談から初動までの時間、未解決案件数、再相談率。';
  }
  if (/危険|緊急|安全|停止/.test(text)) {
    return 'ヒヤリハット件数、停止判断の遅れ、代替手順の実行率。';
  }
  if (kind === 'individualized') {
    return '本人納得度、遂行率、悪化兆候の有無を面談で確認する。';
  }
  return '遅延件数・手戻り件数・自己負荷の週次推移を確認する。';
}

function buildWeekPlanRisk(action, kind) {
  const text = String(action || '').trim();
  if (
    kind === 'individualized' &&
    /本人条件を確認|業務・環境条件を確認|適用前条件を確認|は何か\?/.test(text)
  ) {
    return '質問が抽象的だと回答が曖昧になる。具体場面・時間帯・業務名まで掘り下げて確認する。';
  }
  if (/明文化|手順|テンプレ|チェックリスト/.test(text)) {
    return '形式だけ整えて運用されないと効果が出ない。実施責任者と更新タイミングを固定する。';
  }
  if (/相談|窓口|連絡|共有/.test(text)) {
    return '窓口が複数で曖昧だと逆に遅れる。一次窓口を1つに絞る。';
  }
  if (/通院|治療|休憩|回復/.test(text)) {
    return '予定だけ確保して業務再配分しないと現場負荷が増える。担当再配分を同時実施する。';
  }
  if (/危険|緊急|安全|停止/.test(text)) {
    return '停止判断が個人依存だと遅れる。停止権限者を事前指定する。';
  }
  if (kind === 'individualized') {
    return '一度の面談で固定するとズレる。週末に条件を必ず更新する。';
  }
  return '適用範囲を広げすぎると運用が破綻する。まず対象部署を限定して試行する。';
}

function buildWeekPlanSection(actions, kind) {
  const lines = pickUnique(actions || [], 3);
  if (lines.length === 0) {
    return (
      '- 実践1: 1週間の試行ルールを固定する\n' +
      '  ねらい: 今週の運用に実装し、効果と負荷のバランスを確認する。\n' +
      '  具体的な進め方: 対象運用を1週間だけ試行し、開始条件・停止条件・評価基準を事前に定義する。\n' +
      '  確認の目安: 遅延件数・手戻り件数・自己負荷の週次推移を確認する。\n' +
      '  注意点: 適用範囲を広げすぎると運用が破綻する。まず対象部署を限定して試行する。'
    );
  }
  return lines
    .map((action, index) => {
      const prefix = kind === 'common' ? '実践' : '個別調整';
      const title = toWeekPlanTitle(action, kind);
      const aim = buildWeekPlanAim(action, kind);
      const procedure = buildWeekPlanProcedure(action, kind);
      const metric = buildWeekPlanMetric(action, kind);
      const risk = buildWeekPlanRisk(action, kind);
      return [
        `- ${prefix}${index + 1}: ${title}`,
        `  ねらい: ${aim}`,
        `  具体的な進め方: ${procedure}`,
        `  確認の目安: ${metric}`,
        `  注意点: ${risk}`,
      ].join('\n');
    })
    .join('\n');
}

function pickRelatedCards(cards, current, max = 3) {
  const currentFocus = new Set(current.focus || []);
  return cards
    .filter((card) => card.id !== current.id)
    .map((card) => ({
      card,
      overlap: (card.focus || []).filter((focus) => currentFocus.has(focus)).length,
    }))
    .filter((row) => row.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return String(a.card.title || '').localeCompare(String(b.card.title || ''), 'ja');
    })
    .slice(0, max)
    .map((row) => row.card);
}

function scoreData2ForCard(entry, profile) {
  const issueKeywords = profile?.issueKeywords || [];
  const supportKeywords = profile?.supportKeywords || [];
  const claimKeywords = profile?.claimKeywords || [];
  const issues = Array.isArray(entry?.issues) ? entry.issues : [];
  const narratives = Array.isArray(entry?.narrativeHighlights) ? entry.narrativeHighlights : [];

  const issueTexts = issues.map((row) => String(row?.issue || '').trim()).filter(Boolean);
  const supportTexts = issues
    .flatMap((row) => (Array.isArray(row?.supports) ? row.supports : []))
    .map((v) => String(v || '').trim())
    .filter(Boolean);
  const narrativeTexts = narratives.map((v) => String(v || '').trim()).filter(Boolean);

  const issueHit = issueTexts.reduce(
    (sum, item) => sum + countKeywordMatches(item, issueKeywords),
    0,
  );
  const supportHit = supportTexts.reduce(
    (sum, item) => sum + countKeywordMatches(item, supportKeywords),
    0,
  );
  const narrativeHit = narrativeTexts.reduce(
    (sum, item) => sum + countKeywordMatches(item, claimKeywords),
    0,
  );

  return {
    entryId: Number(entry?.id || 0),
    disability: String(entry?.disability || '不明'),
    score: issueHit * 3 + supportHit * 2 + narrativeHit,
    issueTexts: issueTexts.filter((item) => countKeywordMatches(item, issueKeywords) > 0),
    supportTexts: supportTexts.filter((item) => countKeywordMatches(item, supportKeywords) > 0),
    narrativeTexts: narrativeTexts.filter(
      (item) =>
        countKeywordMatches(item, issueKeywords) > 0 ||
        countKeywordMatches(item, supportKeywords) > 0 ||
        countKeywordMatches(item, claimKeywords) > 0,
    ),
  };
}

function toSentence(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  return /[。.!！?？]$/.test(text) ? text : `${text}。`;
}

function joinSentences(parts) {
  return parts
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .map((part) => toSentence(part))
    .join(' ');
}

function stripLeadLabel(text, label) {
  return String(text || '')
    .replace(new RegExp(`^${label}\\s*`), '')
    .trim();
}

function stripSentenceEnd(text) {
  return String(text || '')
    .trim()
    .replace(/[。.!！?？]+$/, '')
    .trim();
}

function readableJoin(items) {
  const rows = (Array.isArray(items) ? items : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean);
  if (rows.length === 0) return '';
  if (rows.length === 1) return rows[0];
  if (rows.length === 2) return `${rows[0]}と${rows[1]}`;
  return `${rows.slice(0, -1).join('、')}、${rows[rows.length - 1]}`;
}

function cleanLensText(text, kind) {
  let cleaned = stripSentenceEnd(text);
  if (!cleaned) return '';
  if (kind === 'occurrence') cleaned = cleaned.replace(/^この問題は、?\s*/, '');
  if (kind === 'resolution') cleaned = cleaned.replace(/^そのため、?\s*/, '');
  if (kind === 'symptomWork') cleaned = cleaned.replace(/^仕事の側の条件が合わないと、?\s*/, '');
  if (kind === 'supportFormation') {
    cleaned = cleaned
      .replace(/^必要な支援は、?\s*/u, '')
      .replace(/^必要支援は、?\s*/u, '')
      .replace(/^支援は、?\s*/u, '');
  }
  return cleaned.trim();
}

function extractJurisdictions(...inputs) {
  const found = new Set();
  for (const input of inputs) {
    const text = String(input || '');
    for (const match of text.matchAll(/参照法域:\s*([A-Z0-9/\-\s]+)/g)) {
      for (const token of String(match[1] || '').split('/')) {
        const value = token.trim();
        if (/^[A-Z]{2,}(?:-[A-Z]{2,})?$/.test(value)) found.add(value);
      }
    }
    for (const match of text.matchAll(/上位根拠は([A-Z0-9/\-\s]+?)由来/g)) {
      for (const token of String(match[1] || '').split('/')) {
        const value = token.trim();
        if (/^[A-Z]{2,}(?:-[A-Z]{2,})?$/.test(value)) found.add(value);
      }
    }
  }
  return [...found];
}

function summarizeLegalEvidence(observation, cue) {
  const regions = extractJurisdictions(observation, cue);
  if (regions.length > 0) {
    return `この章は、${readableJoin(regions)}の制度・実務知見を見比べながら整理している`;
  }
  return 'この章は、制度条件と実務運用の両方を見比べながら整理している';
}

function summarizeRepeatedPair(observation, cue) {
  const observationMatch = String(observation || '').match(
    /data2では「([^」]+)」に対して「([^」]+)」が(\d+)件(?:（(\d+)障害群）)?で反復/,
  );
  if (observationMatch) {
    const left = String(observationMatch[1] || '').trim();
    const right = String(observationMatch[2] || '').trim();
    const groupCount = String(observationMatch[4] || observationMatch[3] || '').trim();
    if (left && right && groupCount) {
      return `蓄積データでは、「${left}」と「${right}」の組み合わせが${groupCount}障害群で繰り返し見えている`;
    }
  }

  const cueMatch = String(cue || '').match(/反復ペア:\s*([^/]+?)\s*×\s*([^/]+?)(?:\s*\/|$)/);
  if (cueMatch) {
    const left = String(cueMatch[1] || '').trim();
    const right = String(cueMatch[2] || '').trim();
    if (left && right) {
      return `蓄積データでは、「${left}」と「${right}」の組み合わせが繰り返し現れている`;
    }
  }
  return '';
}

function buildChapterLeadMarkdown(chapterOneLiner, layerLabel, representativeDisabilityUnified) {
  const examples = pickUnique(representativeDisabilityUnified || [], 4);
  const topic = stripSentenceEnd(chapterOneLiner || '仕事と運用の詰まり方');
  const paragraph1 = joinSentences([
    `この章で扱うのは、${topic}という詰まり`,
    `本人の頑張り方ではなく、${layerLabel || '就業共通設計'}でどの条件を動かせるかを見る`,
  ]);
  const paragraph2 =
    examples.length > 0
      ? joinSentences([
          `${readableJoin(examples)}など複数の文脈で似た詰まりが繰り返し見えるため、ここでは診断名ではなく仕事・環境・支援の条件から読み解く`,
        ])
      : '';
  return [paragraph1, paragraph2].filter(Boolean);
}

function buildChapterUseMarkdown(card, disabilityConnectionExamples, disabilityConnectionNote) {
  const selectionText = stripLeadLabel(card?.selectionBoundary || '', '選ぶ目安:');
  const useParagraph = selectionText || 'この章を選ぶ条件は要整理。';
  const exampleText = readableJoin(disabilityConnectionExamples.slice(0, 5));
  const situationLevelOrder = {
    stable: 0,
    moderate: 1,
    high: 2,
    critical: 3,
  };
  const connectionParagraph = exampleText
    ? joinSentences([
        `たとえば${exampleText}で先に見えやすい課題だが、ここでは多様性の例として挙げている`,
        '診断名ではなく、困りごとの出方と運用条件で読む',
      ])
    : disabilityConnectionNote
      ? [toSentence(disabilityConnectionNote)].join(' ')
      : '';
  const situationLevels = Array.isArray(card?.situationLevels)
    ? [...card.situationLevels]
        .sort(
          (a, b) =>
            (situationLevelOrder[String(a?.tone || '')] ?? 99) -
            (situationLevelOrder[String(b?.tone || '')] ?? 99),
        )
        .map((level) => {
          const icon = String(level?.icon || '').trim();
          const label = String(level?.label || '').trim();
          const description = String(level?.description || '').trim();
          if (!icon || !label || !description) return '';
          return `- ${icon} ${label}: ${description}`;
        })
        .filter(Boolean)
    : [];
  return [
    '### 1. こんな場面で起きやすい',
    useParagraph,
    connectionParagraph,
    situationLevels.length > 0 ? '#### 状況レベル（🟢 → 💣）' : '',
    situationLevels.length > 0
      ? '診断の重さではなく、仕事がどれだけ詰まり、運用でどこまで吸収できているかで見る。'
      : '',
    situationLevels.length > 0 ? situationLevels.join('\n') : '',
  ].filter(Boolean);
}

function buildStoryProblemMarkdown(card, issueSeed, supportSeed, narrativeSamples) {
  const occurrence = cleanLensText(card?.lensLogic?.occurrence || '', 'occurrence');
  const resolution = cleanLensText(card?.lensLogic?.resolution || '', 'resolution');
  const symptomWork = cleanLensText(card?.lensLogic?.symptomWork || '', 'symptomWork');
  const supportFormation = cleanLensText(
    card?.lensLogic?.supportFormation || '',
    'supportFormation',
  );
  const issueText = String(issueSeed || '').trim();
  const supportText = String(supportSeed || '').trim();
  const narrative = String(
    (Array.isArray(narrativeSamples) ? narrativeSamples : [])[0] || '',
  ).trim();

  const lines = ['### 2. 何が起きているのか'];
  lines.push(
    joinSentences([
      occurrence ||
        `この章で扱う詰まりは、${issueText || '仕事と運用の条件のずれ'}が積み重なると表面化しやすい`,
      resolution ? `放置すると個人依存の対処になりやすいが、${resolution}` : '',
    ]),
  );
  lines.push(
    joinSentences([
      symptomWork ? `とくに、${symptomWork}` : '',
      supportFormation ? `必要な支援は${supportFormation}` : '',
    ]),
  );

  if (narrative) {
    lines.push(`現場では、「${narrative}」のように、小さな違和感が積み重なって表れやすい。`);
  } else if (issueText || supportText) {
    lines.push(
      joinSentences([
        issueText ? `集まった事例では、${issueText}に関わる場面で詰まりが見えやすい` : '',
        supportText ? `支えとして${supportText}が入ると、詰まり方が変わりやすい` : '',
      ]),
    );
  }

  return lines.filter(Boolean);
}

function buildRoleReadingMarkdown(card, chapterOneLiner) {
  const followUps = Array.isArray(card?.followUpQuestions)
    ? card.followUpQuestions.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
  const topic = stripSentenceEnd(chapterOneLiner || 'この章が扱う課題の型');
  const prompt1 = followUps[0] || '困りごとが強く出るのはどんな場面か？';
  const prompt2 = followUps[1] || '何があると少しやりやすくなるか？';

  return [
    '### 3. まず誰が何を確認するか',
    joinSentences([
      `まず職場側は、${topic}という詰まりを本人の適性ではなく仕事と運用の課題として見る`,
      'そのうえで、誰が条件を動かせるのか、どこまでが職場内で担え、どこからが外部接続を要するのかを先に整理する',
    ]),
    '',
    joinSentences([
      `支援者は、「${prompt1}」「${prompt2}」を入口に、本人・業務・環境・支援・時間の条件を混ぜずに切り分ける`,
      'このカードが主課題なのか、隣のカードを先に見るべきなのかをここで見極める',
    ]),
    '',
    joinSentences([
      `本人は、「${prompt1}」「${prompt2}」に答えられる程度でよいので、具体場面を2つほど言葉にしておく`,
      '言い切れない部分は「まだ分からない」と残してよく、その整理が次の調整や相談の材料になる',
    ]),
  ];
}

function buildLegalPolicyMarkdown(card, dispositionDetail) {
  const summary = String(card?.legalPolicyGuardrail?.summary || '').trim();
  const checks = Array.isArray(card?.legalPolicyGuardrail?.checks)
    ? card.legalPolicyGuardrail.checks.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
  const escalation = String(card?.legalPolicyGuardrail?.escalation || '').trim();
  const decision = normalizeDecision(dispositionDetail);
  const keep = keepInCardLines(dispositionDetail);
  const detailTarget = String(dispositionDetail?.detailTarget || '法政策ガードレール層').trim();

  if (!summary && checks.length === 0 && !escalation && keep.length === 0) {
    return [];
  }

  const lines = [];
  lines.push('#### 制度面で先に決めること');
  lines.push(
    joinSentences([
      summary || '制度や雇用区分で前提が変わる論点は、善意運用だけで決めず先に固定する',
    ]),
  );
  if (checks.length > 0) {
    lines.push(`- 先に確認すること: ${checks.slice(0, 3).join(' / ')}`);
  }
  if (keep.length > 0) {
    lines.push(`- この章で特に外せないこと: ${keep.join(' / ')}`);
  }
  if (decision !== 'keep_in_card') {
    lines.push(`- 制度差が残るとき: ${detailTarget}で詳細を確認する。`);
  }
  if (escalation) {
    lines.push(`- 迷ったとき: ${escalation}`);
  }
  return lines;
}

function buildRegionalSupportMarkdown(card, dispositionDetail) {
  const summary = String(card?.regionalSupportOverlay?.summary || '').trim();
  const jacRole = Array.isArray(card?.regionalSupportOverlay?.jacRole)
    ? card.regionalSupportOverlay.jacRole.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
  const regionalRole = Array.isArray(card?.regionalSupportOverlay?.regionalRole)
    ? card.regionalSupportOverlay.regionalRole
        .map((item) => String(item || '').trim())
        .filter(Boolean)
    : [];
  const returnPath = String(card?.regionalSupportOverlay?.returnPath || '').trim();
  const decision = normalizeDecision(dispositionDetail);
  const keep = keepInCardLines(dispositionDetail);
  const detailTarget = String(
    dispositionDetail?.detailTarget || '地域支援オーケストレーション共通レイヤー',
  ).trim();

  if (
    !summary &&
    jacRole.length === 0 &&
    regionalRole.length === 0 &&
    !returnPath &&
    keep.length === 0
  ) {
    return [];
  }

  const lines = [];
  lines.push('#### 支援体制で先に決めること');
  lines.push(
    joinSentences([summary || '企業だけで抱えると止まりやすい論点は、支援体制も一緒に組んでおく']),
  );
  if (decision === 'keep_in_card') {
    if (keep.length > 0) {
      lines.push(`- この章で特に外せないこと: ${keep.join(' / ')}`);
    }
    if (jacRole.length > 0) {
      lines.push(`- JACで先に決めること: ${jacRole.slice(0, 2).join(' / ')}`);
    }
    if (regionalRole.length > 0) {
      lines.push(`- 地域支援者に頼むこと: ${regionalRole.slice(0, 2).join(' / ')}`);
    }
    if (returnPath) {
      lines.push(`- 止まったとき: ${returnPath}`);
    }
  } else {
    if (keep.length > 0) {
      lines.push(`- この章で特に外せないこと: ${keep.join(' / ')}`);
    }
    lines.push(`- 接続先の細かな組み方: ${detailTarget}で確認する。`);
    if (returnPath) {
      lines.push(`- 止まったとき: ${returnPath}`);
    }
  }
  return lines;
}

function buildChapter(
  cards,
  card,
  index,
  profile,
  data2Entries,
  claims,
  glmRelations,
  layerKey,
  layerLabel,
  dispositionRow,
) {
  const chapterNo = String(index + 1).padStart(2, '0');
  const chapterSubtitle = buildChapterSubtitle(card);
  const chapterOneLiner = normalizeSituationCore(card?.situation) || '（要追記）';
  const packages = Array.isArray(card.packages) ? card.packages : [];
  const related = pickRelatedCards(cards, card);

  const rows = data2Entries
    .map((entry) => scoreData2ForCard(entry, profile || {}))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  const topRows = rows.slice(0, 8);
  const issueSamples = pickUnique(
    topRows.flatMap((row) => row.issueTexts),
    4,
  );
  const supportSamples = pickUnique(
    topRows.flatMap((row) => row.supportTexts),
    4,
  );
  const narrativeSamples = pickUnique(
    topRows.flatMap((row) => row.narrativeTexts.map((text) => shorten(text, 74))),
    5,
  );
  const disabilitySummary = buildRepresentativeDisabilitySamples(rows, 6);
  const disabilitySamples = disabilitySummary.representative;
  const claimEvidence = buildClaimEvidenceForCard(profile || {}, claims || []);
  const glmDiseaseLane = buildGlmIndividualDiseaseLane(profile || {}, glmRelations || []);
  const representativeDisabilityUnified = pickUnique(
    [...disabilitySamples, ...claimEvidence.rawDisabilityTop, ...claimEvidence.webDisabilityTop],
    7,
  );
  if (
    glmDiseaseLane.matchCount > 0 &&
    !representativeDisabilityUnified.some((label) => String(label || '').includes('難病'))
  ) {
    representativeDisabilityUnified.push('難病');
  }
  const week1 = pickUnique(card.quickBundleStandardized || card.quickBundle || [], 3);
  const individualTuning = pickUnique(card.quickBundleIndividualized || [], 3);
  const disabilityConnectionExamples = pickUnique(
    card?.disabilityEmploymentConnection?.examples || [],
    6,
  );
  const disabilityConnectionNote = String(card?.disabilityEmploymentConnection?.note || '').trim();
  const month1 = pickUnique(
    packages
      .flatMap((pkg) => pkg.operationRules || [])
      .concat(packages.flatMap((pkg) => pkg.kpi || [])),
    4,
  );
  const legalPolicyLines = buildLegalPolicyMarkdown(card, dispositionRow?.legalPolicy);
  const regionalSupportLines = buildRegionalSupportMarkdown(card, dispositionRow?.regionalSupport);
  const chapterLeadLines = buildChapterLeadMarkdown(
    chapterOneLiner,
    layerLabel || LAYER_LABEL_FALLBACK[layerKey] || '未分類',
    representativeDisabilityUnified,
  );
  const chapterUseLines = buildChapterUseMarkdown(
    card,
    disabilityConnectionExamples,
    disabilityConnectionNote,
  );

  return [
    `## 第${chapterNo}章 ${card.title}（${chapterSubtitle}）`,
    '',
    ...chapterLeadLines,
    '',
    ...chapterUseLines,
    '',
    ...buildStoryProblemMarkdown(
      card,
      issueSamples[0] || '困りごとが出る場面',
      supportSamples[0] || '必要な配慮',
      narrativeSamples,
    ),
    '',
    ...buildRoleReadingMarkdown(card, chapterOneLiner),
    '',
    '### 4. 進める前に外せない条件',
    ...legalPolicyLines,
    ...regionalSupportLines,
    '',
    '### 5. 最初の1週間で試すこと',
    '#### 共通設計（標準運用）',
    buildWeekPlanSection(week1, 'common'),
    '#### 個別調整（条件適合）',
    buildWeekPlanSection(individualTuning, 'individualized'),
    '',
    '### 6. 1か月で整えること',
    toBullets(month1, '（要追記）'),
    '',
    '### 7. つまずきやすい点と見直しの問い',
    '#### つまずきやすい点',
    toBullets(card.failureRisks, '（要追記）'),
    '',
    '#### 見直しの問い',
    toBullets(card.followUpQuestions, '（要追記）'),
    '',
    '### 8. あわせて見たい章',
    related.length > 0
      ? related.map((row) => `- ${row.title} (\`${row.id}\`)`).join('\n')
      : '- （関連フレームなし）',
    '',
    '---',
    '',
  ].join('\n');
}

async function main() {
  const [guideText, data2Raw, claimsRaw, glmRaw, commonCopyRaw, layerDispositionRaw] =
    await Promise.all([
      fs.readFile(GUIDE_PATH, 'utf8'),
      fs.readFile(DATA2_INDEX_PATH, 'utf8'),
      fs.readFile(CLAIMS_JSONL_PATH, 'utf8'),
      fs.readFile(GLM_RELATIONS_PATH, 'utf8'),
      fs.readFile(COMMON_COPY_PATH, 'utf8').catch(() => ''),
      fs.readFile(LAYER_DISPOSITION_PATH, 'utf8').catch(() => ''),
    ]);

  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  const cardDisplayOrderSource = extractArraySource(
    guideText,
    'const CARD_DISPLAY_ORDER: string[] =',
  );
  const cardLayerMapSource = extractObjectSource(
    guideText,
    'const CARD_LAYER_MAP: Record<string, CardLayerKey> =',
  );
  const cardLayerLabelSource = extractObjectSource(
    guideText,
    'const CARD_LAYER_LABEL: Record<CardLayerKey, string> =',
  );
  const profilesSource = extractObjectSource(
    guideText,
    'const CARD_MINING_PROFILES: Record<string, CardMiningProfile> =',
  );
  if (!cardsSource || !profilesSource) {
    throw new Error('PATTERN_CARDS or CARD_MINING_PROFILES not found in guide.tsx');
  }

  const rawCards = new Function(`return (${cardsSource});`)();
  const commonCopyPayload = commonCopyRaw ? JSON.parse(commonCopyRaw) : {};
  const commonCopyRows = Array.isArray(commonCopyPayload?.cards) ? commonCopyPayload.cards : [];
  const commonCopyMap = new Map(
    commonCopyRows.map((row) => [String(row?.id || ''), row]).filter((entry) => Boolean(entry[0])),
  );
  const layerDispositionPayload = layerDispositionRaw ? JSON.parse(layerDispositionRaw) : {};
  const layerDispositionRows = Array.isArray(layerDispositionPayload?.cards)
    ? layerDispositionPayload.cards
    : [];
  const layerDispositionMap = new Map(
    layerDispositionRows
      .map((row) => [String(row?.cardId || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );
  const cards = (Array.isArray(rawCards) ? rawCards : []).map((card) => {
    const rewrite = commonCopyMap.get(String(card?.id || ''));
    if (!rewrite) return card;
    const rewriteBundleRaw = rewrite?.quickBundle;
    const rewriteBundle = Array.isArray(rewriteBundleRaw)
      ? { standardized: rewriteBundleRaw, individualized: [] }
      : rewriteBundleRaw || {};
    const standardizedBundle = Array.isArray(rewriteBundle?.standardized)
      ? rewriteBundle.standardized.filter((item) => String(item || '').trim().length > 0)
      : [];
    const individualizedBundle = Array.isArray(rewriteBundle?.individualized)
      ? rewriteBundle.individualized.filter((item) => String(item || '').trim().length > 0)
      : [];
    return {
      ...card,
      title: String(rewrite?.title || card?.title || ''),
      situation: String(rewrite?.situation || card?.situation || ''),
      selectionBoundary: String(rewrite?.selectionBoundary || card?.selectionBoundary || ''),
      quickBundle: standardizedBundle.length > 0 ? standardizedBundle : card?.quickBundle,
      quickBundleStandardized: standardizedBundle,
      quickBundleIndividualized: individualizedBundle,
      disabilityEmploymentConnection: rewrite?.disabilityEmploymentConnection,
      legalPolicyGuardrail: rewrite?.legalPolicyGuardrail,
      regionalSupportOverlay: rewrite?.regionalSupportOverlay,
      situationLevels: Array.isArray(rewrite?.situationLevels) ? rewrite.situationLevels : [],
    };
  });
  const cardDisplayOrder = cardDisplayOrderSource
    ? new Function(`return (${cardDisplayOrderSource});`)()
    : cards.map((card) => String(card?.id || ''));
  const cardLayerMap = cardLayerMapSource ? new Function(`return (${cardLayerMapSource});`)() : {};
  const cardLayerLabel = cardLayerLabelSource
    ? new Function(`return (${cardLayerLabelSource});`)()
    : LAYER_LABEL_FALLBACK;
  const profiles = new Function(`return (${profilesSource});`)();
  const data2 = JSON.parse(data2Raw);
  const data2Entries = Array.isArray(data2?.entries) ? data2.entries : [];
  const claims = parseJsonl(claimsRaw);
  const glmRelations = parseGlmRelations(glmRaw);
  const cardOrderIndex = new Map(
    (Array.isArray(cardDisplayOrder) ? cardDisplayOrder : []).map((id, index) => [
      String(id || ''),
      index,
    ]),
  );
  const sortedCards = [...cards].sort((a, b) => {
    const aId = String(a?.id || '');
    const bId = String(b?.id || '');
    const aOrder = cardOrderIndex.has(aId) ? cardOrderIndex.get(aId) : Number.POSITIVE_INFINITY;
    const bOrder = cardOrderIndex.has(bId) ? cardOrderIndex.get(bId) : Number.POSITIVE_INFINITY;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return String(a?.title || '').localeCompare(String(b?.title || ''), 'ja');
  });
  const cardsByLayer = Object.fromEntries(
    LAYER_ORDER.map((layer) => [
      layer,
      sortedCards.filter((card) => String(cardLayerMap?.[card.id] || 'operation') === layer),
    ]),
  );

  const generatedAt = new Date().toISOString();
  const intro = [
    '# JAC 26フレーム 実践ガイドブック（読者別編集版）',
    '',
    `改訂版: ${generatedAt.slice(0, 10)}`,
    '',
    'この冊子は、職場で繰り返し起きる詰まりを26の型で捉え直し、企業関係者・支援者・当事者が同じ地図で話せるようにするためのものです。',
    'この版では、既存の26フレームに相談データと整理済み知識を重ね、法政策差と地域支援の条件を読み落としにくい流れへ組み替えています。',
    '',
    '## この冊子の使い方',
    '1. 困りごとに近い章を1つ選び、章タイトルと「1. こんな場面で起きやすい」で全体像を掴む。',
    '2. 次に「2. 何が起きているのか」から「4. 進める前に外せない条件」までを順に読み、何を見誤りやすいのかを確かめる。',
    '3. 実装するときは「5. 最初の1週間で試すこと」「6. 1か月で整えること」「7. つまずきやすい点と見直しの問い」を使い、必ず再評価する。',
    '',
    '## 3レイヤー構成',
    ...LAYER_ORDER.map((layer) => {
      const label = cardLayerLabel?.[layer] || LAYER_LABEL_FALLBACK[layer] || layer;
      const count = Array.isArray(cardsByLayer[layer]) ? cardsByLayer[layer].length : 0;
      const note = LAYER_NOTE[layer] || '';
      return `- ${label}（${count}フレーム）: ${note}`;
    }),
    '',
    '## 重要な前提',
    '- 診断名だけで結論を固定しない。',
    '- 推奨は、本人・仕事・環境・支援・時間・制度・根拠の条件が揃って初めて有効になる。',
    '- うまくいかない場合は、本人要因ではなく運用設計の再調整を優先する。',
    '- 法政策差は共通ガードレール層で確認し、カード本文には誤用防止の補助線だけを残す。',
    '- 地域支援の詳細運用は、カード本文に過積載せず、共通レイヤーまたは別ガイドへ振り分ける。',
    '',
    '## 26フレームと個別相談の役割分担',
    '- 26フレームは、千差万別に見える困りごとを「反復する職場課題の型」として整理するための地図。',
    '- これ以上細かく分けすぎると、導入時の判断速度と共通言語が失われやすい。',
    '- 一方で個別性は常に残るため、最終設計はJAC個別相談で条件確認して調整する。',
    '',
    '### 個別相談で対応する具体例',
    '- 同じ「体調変動」でも、通院翌日・睡眠・服薬副作用・気圧など悪化トリガーが違う。',
    '- 同じカードでも、職務要件（安全クリティカル/締切密度/対人負荷）で運用が変わる。',
    '- 複数特性の重なり（例: 聴覚 + 発達、内部障害 + メンタル）でカード横断設計が必要。',
    '- 開示範囲・復職段階・制度/契約条件の整合は個社/個人条件で最適解が変わる。',
    '',
    '---',
    '',
  ].join('\n');

  const chapterRows = [];
  let chapterIndex = 0;
  for (const layer of LAYER_ORDER) {
    const layerCards = Array.isArray(cardsByLayer[layer]) ? cardsByLayer[layer] : [];
    if (layerCards.length === 0) continue;
    const label = cardLayerLabel?.[layer] || LAYER_LABEL_FALLBACK[layer] || layer;
    const layerIllustration = LAYER_INFOGRAPHIC[layer] || null;
    let layerIllustrationMarkdown = '';
    if (layerIllustration?.relativePathFromGuidebook) {
      const abs = path.resolve(
        path.dirname(OUTPUT_PATH),
        layerIllustration.relativePathFromGuidebook,
      );
      if (await fileExists(abs)) {
        layerIllustrationMarkdown = `\n![${layerIllustration.alt}](${layerIllustration.relativePathFromGuidebook})\n`;
      }
    }
    chapterRows.push({
      chapterText: `## ${label}（${layerCards.length}フレーム）\n\n${LAYER_NOTE[layer] || ''}\n${layerIllustrationMarkdown}`,
      audit: null,
    });
    for (const card of layerCards) {
      const profile = profiles[card.id] || {};
      const chapterText = buildChapter(
        sortedCards,
        card,
        chapterIndex,
        profile,
        data2Entries,
        claims,
        glmRelations,
        layer,
        label,
        layerDispositionMap.get(String(card?.id || '')),
      );
      const glmDiseaseLane = buildGlmIndividualDiseaseLane(profile, glmRelations);
      chapterRows.push({
        chapterText,
        audit: {
          cardId: String(card.id || ''),
          title: String(card.title || ''),
          layer,
          layerLabel: label,
          glmIndividualDiseaseMatchCount: glmDiseaseLane.matchCount,
          predictorTop: glmDiseaseLane.predictorTop,
          relationIdsTop: glmDiseaseLane.relationIdsTop,
        },
      });
      chapterIndex += 1;
    }
  }
  const chapters = chapterRows.map((row) => row.chapterText).join('\n');

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${intro}${chapters}`, 'utf8');
  await fs.mkdir(path.dirname(GLM_CARD_LANE_OUTPUT_PATH), { recursive: true });
  await fs.writeFile(
    GLM_CARD_LANE_OUTPUT_PATH,
    JSON.stringify(
      {
        generatedAt,
        glmRelationsTotal: glmRelations.length,
        cards: chapterRows.map((row) => row.audit).filter(Boolean),
      },
      null,
      2,
    ),
    'utf8',
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        glmCardLanePath: GLM_CARD_LANE_OUTPUT_PATH,
        chapterCount: sortedCards.length,
        data2Entries: data2Entries.length,
        glmRelations: glmRelations.length,
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
