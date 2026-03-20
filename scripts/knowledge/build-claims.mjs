#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const projectRoot = '/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter';
const indexRoot = path.join(projectRoot, 'references', 'index');
const inputPath = path.join(indexRoot, 'normalized-records.jsonl');
const outputPath = path.join(indexRoot, 'knowledge-claims.jsonl');
const manifestPath = path.join(indexRoot, 'knowledge-claims-manifest.json');

const CONTEXT_DOMAINS = [
  'person',
  'job',
  'environment',
  'support',
  'time',
  'institution',
  'evidence',
];

const SIGNAL_KEYWORDS = {
  difficulty_occurrence: [
    '困難',
    '就労困難',
    'barrier',
    'limitation',
    'problem',
    '発生',
    'difficult',
    '難しい',
  ],
  difficulty_resolution: [
    '解決',
    '改善',
    '軽減',
    '緩和',
    'mitigation',
    'resolve',
    'solution',
    'adjustment',
  ],
  symptom_exacerbation: ['症状', '悪化', '疲労', 'flare', 'symptom', 'worsen', '体調'],
  support_needs: ['必要', 'ニーズ', '支援', '配慮', 'accommodation', 'support', 'need', 'request'],
};

const ACCOMMODATION_KEYWORDS = {
  schedule_flexibility: [
    '時差',
    '短時間',
    '勤務時間',
    '休憩',
    '休暇',
    'telework',
    'flexible schedule',
  ],
  task_redesign: ['業務調整', '配置転換', '再設計', 'task', 'job redesign'],
  environment_control: ['環境', '騒音', '照明', 'air', 'noise', 'lighting'],
  communication_support: ['手話', '筆談', '通訳', '面談', 'communication', 'interpreter'],
  assistive_technology: ['支援機器', '補助具', 'assistive', 'screen reader', 'software'],
  policy_and_training: ['方針', '研修', 'training', 'policy', '制度'],
};

const OUTCOME_KEYWORDS = {
  retention: ['定着', '継続', '離職', 'retention', 'stay employed'],
  performance_improvement: ['生産性', '成果', '業務効率', 'performance', 'productivity'],
  symptom_stabilization: ['症状安定', '悪化防止', '体調管理', 'stabilization'],
  barrier_reduction: ['困難軽減', '負担軽減', '問題解決', 'barrier reduction'],
  uncertain: ['課題', '未解決', '要検討', 'uncertain', 'pending'],
};

const BOILERPLATE_PATTERNS = [
  /検索結果｜障害者雇用事例リファレンスサービス/i,
  /toggle navigation/i,
  /site map|サイトマップ/i,
  /ウェブアクセシビリティ/i,
  /cookies on /i,
  /copyright/i,
  /all rights reserved/i,
  /アンケートのお願い/i,
  /前へ\s+\d+/i,
  /メニュー\s+閉じる/i,
  /skip to main content/i,
  /skip to footer/i,
  /language selection/i,
  /main menu/i,
  /close menu/i,
  /help us improve\s+\d+\s*characters remaining/i,
  /available languages close menu/i,
  /search canada\.ca search menu/i,
  /springe direkt zu:\s*inhalt/i,
];

const SOURCE_PAGE_BOILERPLATE_RULES = [
  {
    sourceId: 'askjan_website',
    patterns: [
      /close menu close for employers for individuals for others toolkit/i,
      /ada library a to z lists situations & solutions finder/i,
      /publications & articles training events newsletter consultants/i,
      /myjan about us contact us/i,
    ],
  },
  {
    sourceId: 'askearn_employer_guidance',
    patterns: [
      /skip to main content menu search search close about earn/i,
      /the employer assistance and resource network on disability .* offers information and resources to help employers recruit hire retain and advance people with disabilities/i,
      /phases of employment recruit build a pipeline of talent that includes people with disabilities/i,
      /earn makes it easy to stay up-to-date on disability employment news and information/i,
      /job seeker resources service provider resources learning center dinah cohen learning center/i,
      /who we are earn partners earn staff faqs user information user agreement accessibility statement privacy getting started/i,
      /contact us about us about earn earn partners earn staff faqs user agreement accessibility statement privacy/i,
      /earn news newsletters read our recent newsletters/i,
      /disability@work lead the way supportive business culture build the pipeline outreach & recruitment hire/i,
      /what[^\s]{0,10}s new on askearn/i,
      /additional resources resource library a listing of earn resources by topic/i,
      /recruit build a pipeline of talent that includes people with disabilities/i,
      /hire identify people who have the skills and attributes for the job/i,
      /retain keep talented employees with disabilities/i,
      /advance ensure that employees with disabilities have equal opportunities for advancement/i,
    ],
  },
  {
    sourceId: 'jeed_reference',
    patterns: [
      /検索結果：\s*\d+\s*件/i,
      /検索条件：/i,
      /年度\s+事業所名\s+テーマ\s+事業内容\s+規模\s+障害\s+所在地/i,
      /前へ\s+\d+/i,
    ],
  },
  {
    sourceId: 'uk_gov_disability_employment',
    patterns: [
      /accept additional cookies reject additional cookies/i,
      /view cookies hide cookie message skip to main content/i,
      /navigation menu menu menu services and information/i,
    ],
  },
  {
    sourceId: 'australia_jobaccess_guidance',
    patterns: [
      /job access skip to main content/i,
      /skip to footer beta you are on a new version of this website/i,
    ],
  },
  {
    sourceId: 'canada_duty_to_accommodate',
    patterns: [
      /canada\.ca skip to main content/i,
      /skip to \"about government\" language selection/i,
      /search canada\.ca search menu main menu jobs and the workplace/i,
    ],
  },
  {
    sourceId: 'germany_antidiscrimination_work',
    patterns: [
      /springe direkt zu:\s*inhalt hauptmenü suche navigation und service servicemenü/i,
      /servicemenü kontakt presse english عربي leichte sprache gebärdensprache/i,
      /unternavigationspunkte öffnen schließen menü hauptmenü/i,
    ],
  },
  {
    sourceId: 'eu_reasonable_accommodation',
    patterns: [
      /your europe .* available languages close menu/i,
      /help us improve\s+\d+\s*characters remaining/i,
    ],
  },
  {
    sourceId: 'uk_headway_brain_injury_work',
    patterns: [
      /follow us:\s*improving life after brain injury/i,
      /need to talk\?\s*0808\s*800\s*2244/i,
      /donate\s+join/i,
      /visit our page on linkedin|visit our page on youtube/i,
      /accessibility disclaimer privacy/i,
    ],
  },
  {
    sourceId: 'australia_jobaccess_guidance',
    patterns: [
      /accessibility disclaimer privacy/i,
      /visit our page on linkedin|visit our page on youtube/i,
    ],
  },
];

const SOURCE_STATEMENT_NOISE_RULES = [
  {
    sourceId: 'askearn_employer_guidance',
    patterns: [
      /^askearn\s*\|\s*section\s+[ivxlcdm]+\.?$/i,
      /^back to top\b/i,
      /^publications a listing of earn publications available in pdf format\.?$/i,
      /^courses a listing of earn learning center offerings\.?$/i,
      /^learning center\s*\//i,
      /^additional resources\b/i,
      /\bjan webcast\b/i,
      /\bearn newsletter\b/i,
      /\bwhat(?:['’]|&rsquo;)?s new on askearn\b/i,
    ],
  },
  {
    sourceId: 'uk_headway_brain_injury_work',
    patterns: [
      /^find out more\b/i,
      /^your gift will help ensure brain injury survivors\b/i,
      /^summary of standards to be assessed\b/i,
      /^how to get self-directed support making a support plan\b/i,
      /^friends of headway\b/i,
      /^headway annual awards\b/i,
      /^share your story with us\b/i,
      /^find your local event charity runs\b/i,
      /^about brain injury for individuals types of brain injury\b/i,
      /^making returning to work, work for you \| headway follow us:/i,
      /^alison winterburn \| headway follow us:/i,
      /^cognitive effects of brain injury \| headway follow us:/i,
    ],
  },
];

const SOURCE_RECORD_SKIP_RULES = [
  {
    sourceId: 'askearn_employer_guidance',
    pageTypes: ['resource_hub'],
    urlPatterns: [
      /\/page\/(?:about-earn|contact-us|earn-partners|earn-staff|news-and-events|subscribe|privacy|user-agreement|job-seekers-resources|service-provider-resources|getting-started|accessibility-statement|recruit|hire|retain|advance|dinah-cohen-learning-center)(?:$|[?#])/i,
      /\/page\/earn-newsletter-[^/?#]+/i,
      /\/page\/[^/?#]*roundtable(?:$|[?#])/i,
    ],
  },
];

const LEGAL_POLICY_SOURCE_IDS = new Set([
  'uk_gov_disability_employment',
  'eu_reasonable_accommodation',
  'germany_agg_legal',
  'germany_antidiscrimination_work',
  'canada_duty_to_accommodate',
  'australia_jobaccess_guidance',
]);

const EMPLOYER_GUIDANCE_SOURCE_IDS = new Set(['askearn_employer_guidance']);

const NAVIGATION_TERMS = [
  'menu',
  'navigation',
  'site map',
  'サイトマップ',
  'cookie',
  'privacy',
  'copyright',
  'all rights reserved',
  '検索結果',
  '検索条件',
  '前へ',
  '次へ',
  'toggle',
  'breadcrumb',
  'skip to main content',
  'contact us',
  'myjan',
];

function uniqueSorted(values) {
  return Array.from(
    new Set(
      values.filter(
        (value) => value !== null && value !== undefined && String(value).trim() !== '',
      ),
    ),
  ).sort();
}

function splitSentences(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[。.!?！？])\s+|\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function hasAny(text, keywords) {
  const normalized = String(text || '').toLowerCase();
  return keywords.some((keyword) => normalized.includes(String(keyword).toLowerCase()));
}

function normalizeWhitespace(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripLeadingMachineLabel(text) {
  return String(text || '').replace(/^[a-z][a-z0-9]*(?:_[a-z0-9]+)+\s*:\s*/i, '');
}

function normalizeClaimInput(text) {
  return normalizeWhitespace(stripLeadingMachineLabel(text));
}

function isQuestionLikeStatement(text) {
  const normalized = normalizeClaimInput(text);
  if (!normalized) return false;
  if (/[?？]\s*$/.test(normalized)) return true;
  return (
    /か[。.]?$/.test(normalized) &&
    /(誰|何|どこ|どの|いつ|なぜ|どう|どこまで|切る|揃っている|中心)/.test(normalized)
  );
}

function getClaimText(record) {
  return normalizeClaimInput(record?.claimText || record?.bodyText || record?.text || '');
}

function buildClaimExcerpt(record) {
  const body = getClaimText(record).slice(0, 220);
  const heading = normalizeWhitespace(record?.headingText || '');
  if (heading && body) return `${heading} | ${body}`.slice(0, 220);
  return body;
}

function toWordLikeTokens(text) {
  return normalizeWhitespace(text)
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter(Boolean);
}

function countNavigationHits(text) {
  const normalized = normalizeWhitespace(text).toLowerCase();
  return NAVIGATION_TERMS.reduce((count, term) => count + (normalized.includes(term) ? 1 : 0), 0);
}

function matchesSourcePageBoilerplate(text, record) {
  const sourceId = record.sourceId || 'unknown';
  const pageType = record.interactionContext?.pageType || 'unknown';

  for (const rule of SOURCE_PAGE_BOILERPLATE_RULES) {
    if (rule.sourceId !== sourceId) continue;
    if (
      Array.isArray(rule.pageTypes) &&
      rule.pageTypes.length > 0 &&
      !rule.pageTypes.includes(pageType)
    )
      continue;
    if (rule.patterns.some((pattern) => pattern.test(text))) return true;
  }
  return false;
}

function matchesSourceStatementNoise(text, record) {
  const sourceId = record.sourceId || 'unknown';
  const pageType = record.interactionContext?.pageType || 'unknown';

  for (const rule of SOURCE_STATEMENT_NOISE_RULES) {
    if (rule.sourceId !== sourceId) continue;
    if (
      Array.isArray(rule.pageTypes) &&
      rule.pageTypes.length > 0 &&
      !rule.pageTypes.includes(pageType)
    )
      continue;
    if (rule.patterns.some((pattern) => pattern.test(text))) return true;
  }

  return false;
}

function normalizeRecordUrl(record) {
  return String(record?.interactionContext?.finalUrl || record?.interactionContext?.sourceUrl || '')
    .trim()
    .toLowerCase();
}

function recordSkipReason(record) {
  const sourceId = record.sourceId || 'unknown';
  const pageType = record.interactionContext?.pageType || 'unknown';
  const url = normalizeRecordUrl(record);

  for (const rule of SOURCE_RECORD_SKIP_RULES) {
    if (rule.sourceId !== sourceId) continue;
    if (Array.isArray(rule.pageTypes) && rule.pageTypes.includes(pageType)) {
      return 'source_record_page_type_skip';
    }
    if (rule.urlPatterns?.some((pattern) => pattern.test(url))) {
      return 'source_record_url_skip';
    }
  }

  return null;
}

function hasCoreContextSignal(text) {
  return /(本人|当事者|従業員|employee|worker|individual|person|job|task|業務|職務|支援|配慮|合理的配慮|accommodation|support|law|legal|act|regulation|制度)/i.test(
    text,
  );
}

function shouldRescueSoftRejection(record, statement) {
  const scope = record.interactionContext?.evidenceScope || 'unknown';
  return scope === 'specific_case' && hasCoreContextSignal(statement);
}

function rejectStatement(record, statement, reason, { soft = false } = {}) {
  if (soft && shouldRescueSoftRejection(record, statement)) {
    return { isAccepted: true, reason: null };
  }
  return { isAccepted: false, reason };
}

function evaluateStatementQuality(text, record) {
  const normalized = normalizeClaimInput(text);
  if (!normalized) return rejectStatement(record, normalized, 'empty_statement');
  if (normalized.length < 14) return rejectStatement(record, normalized, 'too_short');
  if (/^\|.*\|\s*$/.test(normalized) || /^\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(normalized)) {
    return rejectStatement(record, normalized, 'markdown_table_row');
  }
  if (isQuestionLikeStatement(normalized)) {
    return rejectStatement(record, normalized, 'question_like_statement');
  }
  if (BOILERPLATE_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return rejectStatement(record, normalized, 'global_boilerplate_pattern');
  }
  if (matchesSourcePageBoilerplate(normalized, record)) {
    return rejectStatement(record, normalized, 'source_page_boilerplate_pattern');
  }
  if (matchesSourceStatementNoise(normalized, record)) {
    return rejectStatement(record, normalized, 'source_statement_noise_pattern');
  }

  const navHits = countNavigationHits(normalized);
  if (navHits >= 3) {
    return rejectStatement(record, normalized, 'navigation_density_high', { soft: true });
  }

  const tokens = toWordLikeTokens(normalized);
  if (tokens.length >= 8) {
    const uniqueRatio = new Set(tokens).size / tokens.length;
    if (uniqueRatio < 0.45) {
      return rejectStatement(record, normalized, 'low_lexical_diversity', { soft: true });
    }

    const contentTokens = tokens.filter(
      (token) =>
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(token) || token.length >= 3,
    );
    const contentRatio = contentTokens.length / tokens.length;
    if (contentRatio < 0.5) {
      return rejectStatement(record, normalized, 'low_content_token_ratio', { soft: true });
    }

    const tokenFreq = {};
    for (const token of tokens) tokenFreq[token] = (tokenFreq[token] || 0) + 1;
    const maxFreq = Math.max(...Object.values(tokenFreq));
    if (maxFreq >= 4 && maxFreq / tokens.length >= 0.25) {
      return rejectStatement(record, normalized, 'repeated_token_dominance', { soft: true });
    }
  }

  return { isAccepted: true, reason: null };
}

function scoreSentenceCandidate(sentence, keywords, record) {
  const normalized = normalizeWhitespace(sentence);
  let score = 0;

  if (hasAny(normalized, keywords)) score += 6;
  if (hasCoreContextSignal(normalized)) score += 2;

  const length = normalized.length;
  if (length >= 40 && length <= 220) score += 2;
  else if (length >= 24 && length <= 260) score += 1;
  else if (length > 260) score -= 1;
  else score -= 1;

  if (record.sourceId === 'askearn_employer_guidance') {
    if (/\ba listing of\b/i.test(normalized)) score -= 2;
    if (/\blearn about\b/i.test(normalized)) score -= 1;
    if (/\bfind out\b/i.test(normalized)) score -= 1;
    if (/\bwebcast\b|\bnewsletter\b/i.test(normalized)) score -= 4;
  }

  return score;
}

function pickSentence(text, keywords, record) {
  const sentences = splitSentences(text);
  if (sentences.length === 0) {
    return {
      statement: String(text || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 260),
      skippedReasons: [],
    };
  }

  const meaningfulSentences = [];
  const skippedReasons = [];
  for (const sentence of sentences) {
    const quality = evaluateStatementQuality(sentence, record);
    if (quality.isAccepted) {
      meaningfulSentences.push(sentence);
      continue;
    }
    skippedReasons.push(quality.reason || 'quality_rejected');
  }

  if (meaningfulSentences.length > 0) {
    const scored = meaningfulSentences
      .map((sentence) => ({
        sentence,
        score: scoreSentenceCandidate(sentence, keywords, record),
        keywordHit: hasAny(sentence, keywords),
      }))
      .sort((a, b) => {
        if (b.keywordHit !== a.keywordHit) return Number(b.keywordHit) - Number(a.keywordHit);
        if (b.score !== a.score) return b.score - a.score;
        return b.sentence.length - a.sentence.length;
      });

    return {
      statement: scored[0].sentence.slice(0, 260),
      skippedReasons,
    };
  }

  return {
    statement: sentences[0].slice(0, 260),
    skippedReasons,
  };
}

function normalizeForKey(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[0-9０-９]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
}

function mapTrustTierScore(trustTier) {
  if (trustTier === 'primary') return 0.78;
  if (trustTier === 'secondary') return 0.68;
  if (trustTier === 'external') return 0.55;
  return 0.45;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function inferContextCoverage(record) {
  const ctx = record.interactionContext || {};
  const text = getClaimText(record);
  const disabilityFacets = ctx.disabilityFacets || ctx.disabilityHints || [];
  const industryFacets = ctx.industryFacets || [];
  const supportHints = ctx.supportTypeHints || [];
  const accommodationFacets = ctx.accommodationFacets || [];

  const hasTimeSignal =
    Boolean(ctx.linkedCaseYear) ||
    /\b(19|20)\d{2}\b/.test(text) ||
    /(年度|年次|year|years|monthly|weekly|daily)/i.test(text);

  const coverage = {
    person:
      disabilityFacets.length > 0 || /(本人|当事者|employee|worker|user|individual)/i.test(text),
    job: industryFacets.length > 0 || /(業務|職務|仕事|task|job|role|workload)/i.test(text),
    environment:
      accommodationFacets.includes('environment_control') ||
      /(職場環境|騒音|照明|workspace|environment|noise|lighting)/i.test(text),
    support:
      supportHints.length > 0 ||
      accommodationFacets.length > 0 ||
      /(支援|配慮|合理的配慮|support|accommodation|adjustment)/i.test(text),
    time: hasTimeSignal,
    institution:
      (ctx.country && ctx.country !== 'unknown') ||
      (ctx.legalContext && ctx.legalContext !== 'unspecified') ||
      /(法律|法令|policy|act|regulation)/i.test(text),
    evidence:
      (ctx.trustTier && ctx.trustTier !== 'unknown') ||
      record.contentType === 'guideline' ||
      record.contentType === 'web_reference',
  };

  const missingContexts = CONTEXT_DOMAINS.filter((domain) => !coverage[domain]);
  return {
    coverage,
    missingContexts,
    isPartial: missingContexts.length > 0,
  };
}

function inferEvidenceLane({ sourceIds, evidenceScopes, pageTypes }) {
  const ids = Array.isArray(sourceIds) ? sourceIds : [];
  const scopes = Array.isArray(evidenceScopes) ? evidenceScopes : [];
  const pages = Array.isArray(pageTypes) ? pageTypes : [];

  const hasSpecificCase = scopes.includes('specific_case');
  const hasAggregatedIndex = scopes.includes('aggregated_index');
  const allSourcesLegalPolicy =
    ids.length > 0 && ids.every((sourceId) => LEGAL_POLICY_SOURCE_IDS.has(sourceId));
  const allSourcesEmployerGuidance =
    ids.length > 0 && ids.every((sourceId) => EMPLOYER_GUIDANCE_SOURCE_IDS.has(sourceId));
  const hasLegalPageHints = pages.some((pageType) => {
    const normalized = String(pageType || '').toLowerCase();
    if (!normalized) return false;
    if (
      normalized.startsWith('employer_') ||
      normalized === 'training_course' ||
      normalized === 'resource_hub'
    ) {
      return false;
    }
    return /(^|_)legal|gov/.test(normalized) || /^policy(?:_|$)/.test(normalized);
  });
  const hasEmployerGuidancePageHints = pages.some((pageType) =>
    /employer_toolkit|employer_publication|employer_guidance_page|training_course|resource_hub/i.test(
      String(pageType || ''),
    ),
  );

  if ((allSourcesLegalPolicy || hasLegalPageHints) && hasAggregatedIndex && !hasSpecificCase) {
    return 'legal_policy';
  }
  if (
    (allSourcesEmployerGuidance || hasEmployerGuidancePageHints) &&
    hasAggregatedIndex &&
    !hasSpecificCase
  ) {
    return 'employer_guidance';
  }
  if (hasSpecificCase && !hasAggregatedIndex) {
    return 'case_practice';
  }
  if (hasSpecificCase && hasAggregatedIndex) {
    return 'mixed';
  }
  if (hasAggregatedIndex) {
    return 'aggregated_general';
  }
  return allSourcesLegalPolicy || hasLegalPageHints ? 'legal_policy' : 'mixed';
}

function evaluateRisk({ evidenceScope, trustTier, missingContexts, evidenceCount, evidenceLane }) {
  const missingCore = missingContexts.filter((domain) =>
    ['person', 'job', 'support', 'institution'].includes(domain),
  ).length;
  const isLegalPolicyLane = evidenceLane === 'legal_policy';
  const isEmployerGuidanceLane = evidenceLane === 'employer_guidance';

  if (evidenceScope === 'aggregated_index' && trustTier === 'external') {
    if (isLegalPolicyLane) {
      if (missingCore >= 2) {
        return {
          level: 'high',
          reasons: ['legal_policy_aggregated_missing_core_contexts'],
        };
      }
      return {
        level: 'medium',
        reasons: ['legal_policy_aggregated_evidence'],
      };
    }
    if (isEmployerGuidanceLane) {
      if (missingCore >= 2) {
        return {
          level: 'high',
          reasons: ['employer_guidance_aggregated_missing_core_contexts'],
        };
      }
      return {
        level: 'medium',
        reasons: ['employer_guidance_aggregated_evidence'],
      };
    }
    return {
      level: 'high',
      reasons: ['aggregated_external_evidence'],
    };
  }

  if (evidenceScope === 'aggregated_index' && missingCore >= 1) {
    if (isLegalPolicyLane && missingCore === 1) {
      return {
        level: 'medium',
        reasons: ['legal_policy_partial_context'],
      };
    }
    if (isEmployerGuidanceLane && missingCore === 1) {
      return {
        level: 'medium',
        reasons: ['employer_guidance_partial_context'],
      };
    }
    return {
      level: 'high',
      reasons: ['aggregated_index_evidence', 'missing_core_contexts'],
    };
  }

  if (trustTier === 'external' && evidenceCount <= 2 && missingCore >= 2) {
    if (isLegalPolicyLane) {
      return {
        level: 'medium',
        reasons: ['legal_policy_low_corroboration'],
      };
    }
    if (isEmployerGuidanceLane) {
      return {
        level: 'medium',
        reasons: ['employer_guidance_low_corroboration'],
      };
    }
    return {
      level: 'high',
      reasons: ['external_source_low_corroboration', 'missing_core_contexts'],
    };
  }

  if (missingCore > 0 || missingContexts.length >= 3) {
    return {
      level: 'medium',
      reasons: ['partial_context'],
    };
  }

  if (trustTier === 'external') {
    return {
      level: 'medium',
      reasons: ['external_source'],
    };
  }

  return {
    level: 'low',
    reasons: ['context_coverage_ok'],
  };
}

function evaluateConfidence({
  trustTier,
  evidenceScope,
  pageTypes,
  missingContexts,
  evidenceCount,
}) {
  let score = mapTrustTierScore(trustTier);

  if (evidenceScope === 'specific_case') score += 0.1;
  if (evidenceScope === 'aggregated_index') score -= 0.05;
  if (pageTypes.includes('case_detail') || pageTypes.includes('case_guide')) score += 0.05;
  if (
    pageTypes.some((pageType) =>
      /employer_toolkit|employer_publication|training_course/i.test(String(pageType || '')),
    )
  ) {
    score += 0.03;
  }
  score -= Math.min(0.3, missingContexts.length * 0.04);
  score += Math.min(0.18, Math.max(0, evidenceCount - 1) * 0.03);
  score = Number(clamp(score, 0.05, 0.95).toFixed(3));

  const level = score >= 0.75 ? 'high' : score >= 0.55 ? 'medium' : 'low';
  return { score, level };
}

function makeCandidate(record, { claimType, signal = null, keywords = [] }) {
  const ctx = record.interactionContext || {};
  const picked = pickSentence(getClaimText(record), keywords, record);
  const statement = picked.statement;
  const canonicalStatement = normalizeForKey(statement);
  if (!canonicalStatement) {
    return {
      candidate: null,
      rejectionReason: 'empty_canonical_statement',
      skippedReasons: picked.skippedReasons || [],
    };
  }

  const quality = evaluateStatementQuality(statement, record);
  if (!quality.isAccepted) {
    return {
      candidate: null,
      rejectionReason: quality.reason || 'quality_rejected',
      skippedReasons: picked.skippedReasons || [],
    };
  }

  const coverage = inferContextCoverage(record);

  return {
    candidate: {
      claimType,
      signal,
      statement,
      canonicalStatement,
      sourceId: record.sourceId,
      recordId: record.id,
      filePath: record.filePath,
      excerpt: buildClaimExcerpt(record),
      sourceUrl: ctx.finalUrl || ctx.sourceUrl || null,
      country: ctx.country || 'unknown',
      legalContext: ctx.legalContext || 'unspecified',
      language: ctx.language || 'unknown',
      trustTier: ctx.trustTier || 'unknown',
      pageType: ctx.pageType || 'unknown',
      evidenceScope: ctx.evidenceScope || 'unknown',
      disabilityFacets: uniqueSorted(ctx.disabilityFacets || ctx.disabilityHints || []),
      conditionLabels: uniqueSorted(ctx.conditionLabels || []),
      disabilityLabels: uniqueSorted(ctx.disabilityLabels || []),
      industryFacets: uniqueSorted(ctx.industryFacets || []),
      companySizeFacets: uniqueSorted(ctx.companySizeFacets || []),
      accommodationFacets: uniqueSorted(ctx.accommodationFacets || ctx.supportTypeHints || []),
      outcomeFacets: uniqueSorted(ctx.outcomeFacets || []),
      missingContexts: coverage.missingContexts,
      presentContexts: CONTEXT_DOMAINS.filter(
        (domain) => !coverage.missingContexts.includes(domain),
      ),
    },
    rejectionReason: null,
    skippedReasons: picked.skippedReasons || [],
  };
}

function buildCandidates(record) {
  if (record.contentType === 'metadata_only')
    return { candidates: [], rejections: [], attemptedCount: 0 };
  if (!getClaimText(record) || getClaimText(record).trim().length < 20)
    return { candidates: [], rejections: [], attemptedCount: 0 };

  const ctx = record.interactionContext || {};
  const recordSkip = recordSkipReason(record);
  if (recordSkip) {
    return {
      candidates: [],
      rejections: [
        {
          reason: recordSkip,
          sourceId: record.sourceId || 'unknown',
          pageType: ctx.pageType || 'unknown',
          evidenceScope: ctx.evidenceScope || 'unknown',
          stage: 'record_gate',
        },
      ],
      attemptedCount: 0,
    };
  }
  const signals = ctx.interactionModelSignals || {};
  const candidates = [];
  const rejections = [];
  let attemptedCount = 0;

  const registerAttempt = (attempt) => {
    if (!attempt) return;
    attemptedCount += 1;
    const skippedReasons = Array.isArray(attempt.skippedReasons) ? attempt.skippedReasons : [];
    for (const reason of skippedReasons) {
      rejections.push({
        reason: reason || 'quality_rejected',
        sourceId: record.sourceId || 'unknown',
        pageType: ctx.pageType || 'unknown',
        evidenceScope: ctx.evidenceScope || 'unknown',
        stage: 'sentence_selection',
      });
    }
    if (attempt.candidate) {
      candidates.push(attempt.candidate);
      return;
    }
    rejections.push({
      reason: attempt.rejectionReason || 'unknown_rejection',
      sourceId: record.sourceId || 'unknown',
      pageType: ctx.pageType || 'unknown',
      evidenceScope: ctx.evidenceScope || 'unknown',
      stage: 'candidate_emission',
    });
  };

  for (const [signal, isActive] of Object.entries(signals)) {
    if (!isActive) continue;
    registerAttempt(
      makeCandidate(record, {
        claimType: 'interaction_signal',
        signal,
        keywords: SIGNAL_KEYWORDS[signal] || [],
      }),
    );
  }

  const accommodationFacets = uniqueSorted([
    ...(ctx.accommodationFacets || []),
    ...(ctx.supportTypeHints || []),
  ]);
  if (accommodationFacets.length > 0) {
    const keywords = uniqueSorted(
      accommodationFacets
        .flatMap((facet) => ACCOMMODATION_KEYWORDS[facet] || [])
        .concat(['配慮', 'adjustment', 'support']),
    );
    registerAttempt(
      makeCandidate(record, {
        claimType: 'accommodation_action',
        signal: null,
        keywords,
      }),
    );
  }

  const outcomeFacets = uniqueSorted(ctx.outcomeFacets || []);
  if (outcomeFacets.length > 0) {
    const keywords = uniqueSorted(
      outcomeFacets.flatMap((facet) => OUTCOME_KEYWORDS[facet] || []).concat(['結果', 'outcome']),
    );
    registerAttempt(
      makeCandidate(record, {
        claimType: 'outcome_signal',
        signal: null,
        keywords,
      }),
    );
  }

  return {
    candidates,
    rejections,
    attemptedCount,
  };
}

function mergeCandidate(aggregate, candidate) {
  aggregate.evidenceCount += 1;
  aggregate.sourceIds.add(candidate.sourceId);
  aggregate.recordIds.add(candidate.recordId);
  aggregate.filePaths.add(candidate.filePath);
  if (candidate.sourceUrl) aggregate.sourceUrls.add(candidate.sourceUrl);
  aggregate.countries.add(candidate.country);
  aggregate.legalContexts.add(candidate.legalContext);
  aggregate.languages.add(candidate.language);
  aggregate.trustTiers.add(candidate.trustTier);
  aggregate.pageTypes.add(candidate.pageType);
  aggregate.evidenceScopes.add(candidate.evidenceScope);
  candidate.disabilityFacets.forEach((value) => aggregate.disabilityFacets.add(value));
  candidate.conditionLabels.forEach((value) => aggregate.conditionLabels.add(value));
  candidate.disabilityLabels.forEach((value) => aggregate.disabilityLabels.add(value));
  candidate.industryFacets.forEach((value) => aggregate.industryFacets.add(value));
  candidate.companySizeFacets.forEach((value) => aggregate.companySizeFacets.add(value));
  candidate.accommodationFacets.forEach((value) => aggregate.accommodationFacets.add(value));
  candidate.outcomeFacets.forEach((value) => aggregate.outcomeFacets.add(value));
  candidate.presentContexts.forEach((domain) => {
    aggregate.contextHits[domain] = (aggregate.contextHits[domain] || 0) + 1;
  });

  if (aggregate.sampleExcerpts.length < 3) {
    aggregate.sampleExcerpts.push({
      recordId: candidate.recordId,
      sourceId: candidate.sourceId,
      filePath: candidate.filePath,
      sourceUrl: candidate.sourceUrl,
      excerpt: candidate.excerpt,
    });
  }
}

async function readJsonl(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function initializeAggregate(candidate) {
  return {
    key: `${candidate.claimType}|${candidate.signal || 'none'}|${candidate.evidenceScope || 'unknown'}|${candidate.canonicalStatement}`,
    claimType: candidate.claimType,
    signal: candidate.signal,
    statement: candidate.statement,
    canonicalStatement: candidate.canonicalStatement,
    evidenceCount: 0,
    sourceIds: new Set(),
    recordIds: new Set(),
    filePaths: new Set(),
    sourceUrls: new Set(),
    countries: new Set(),
    legalContexts: new Set(),
    languages: new Set(),
    trustTiers: new Set(),
    pageTypes: new Set(),
    evidenceScopes: new Set(),
    disabilityFacets: new Set(),
    conditionLabels: new Set(),
    disabilityLabels: new Set(),
    industryFacets: new Set(),
    companySizeFacets: new Set(),
    accommodationFacets: new Set(),
    outcomeFacets: new Set(),
    contextHits: Object.fromEntries(CONTEXT_DOMAINS.map((domain) => [domain, 0])),
    sampleExcerpts: [],
  };
}

function buildApplicability(aggregate) {
  const missingContexts = CONTEXT_DOMAINS.filter(
    (domain) => (aggregate.contextHits[domain] || 0) === 0,
  );
  const conditions = [];

  const evidenceScopes = Array.from(aggregate.evidenceScopes);
  if (evidenceScopes.includes('specific_case')) {
    conditions.push(
      'Treat as case-bounded evidence; verify transferability to current workplace context.',
    );
  }
  if (evidenceScopes.includes('aggregated_index')) {
    conditions.push(
      'Treat as index-level evidence; require additional case/detail confirmation before action.',
    );
  }
  if (aggregate.countries.size > 0) {
    const countries = Array.from(aggregate.countries).filter((value) => value !== 'unknown');
    if (countries.length > 0) {
      conditions.push(`Apply with jurisdiction check (${countries.join(', ')} legal context).`);
    }
  }
  if (aggregate.industryFacets.size > 0) {
    conditions.push(
      `Industry sensitivity present: ${Array.from(aggregate.industryFacets).join(', ')}.`,
    );
  }

  return {
    missingContexts,
    isPartial: missingContexts.length > 0,
    conditions,
  };
}

function primaryTrustTier(trustTiers) {
  if (trustTiers.includes('primary')) return 'primary';
  if (trustTiers.includes('secondary')) return 'secondary';
  if (trustTiers.includes('external')) return 'external';
  return 'unknown';
}

function primaryEvidenceScope(evidenceScopes) {
  if (evidenceScopes.includes('specific_case')) return 'specific_case';
  if (evidenceScopes.includes('aggregated_index')) return 'aggregated_index';
  return 'unknown';
}

function toClaim(aggregate) {
  const sourceIds = Array.from(aggregate.sourceIds).sort();
  const trustTiers = Array.from(aggregate.trustTiers);
  const pageTypes = Array.from(aggregate.pageTypes);
  const evidenceScopes = Array.from(aggregate.evidenceScopes);
  const evidenceLane = inferEvidenceLane({
    sourceIds,
    evidenceScopes,
    pageTypes,
  });
  const applicability = buildApplicability(aggregate);
  const risk = evaluateRisk({
    evidenceScope: primaryEvidenceScope(evidenceScopes),
    trustTier: primaryTrustTier(trustTiers),
    missingContexts: applicability.missingContexts,
    evidenceCount: aggregate.evidenceCount,
    evidenceLane,
  });
  const confidence = evaluateConfidence({
    trustTier: primaryTrustTier(trustTiers),
    evidenceScope: primaryEvidenceScope(evidenceScopes),
    pageTypes,
    missingContexts: applicability.missingContexts,
    evidenceCount: aggregate.evidenceCount,
  });

  const id = createHash('sha1').update(aggregate.key).digest('hex').slice(0, 16);

  return {
    id,
    claimType: aggregate.claimType,
    signal: aggregate.signal,
    statement: aggregate.statement,
    canonicalStatement: aggregate.canonicalStatement,
    evidenceCount: aggregate.evidenceCount,
    sourceIds,
    evidenceRecordIds: Array.from(aggregate.recordIds).sort(),
    sampleExcerpts: aggregate.sampleExcerpts,
    interactionContextSummary: {
      countries: uniqueSorted(Array.from(aggregate.countries)),
      legalContexts: uniqueSorted(Array.from(aggregate.legalContexts)),
      languages: uniqueSorted(Array.from(aggregate.languages)),
      trustTiers: uniqueSorted(Array.from(aggregate.trustTiers)),
      pageTypes: uniqueSorted(Array.from(aggregate.pageTypes)),
      evidenceScopes: uniqueSorted(Array.from(aggregate.evidenceScopes)),
      evidenceLane,
      disabilityFacets: uniqueSorted(Array.from(aggregate.disabilityFacets)),
      conditionLabels: uniqueSorted(Array.from(aggregate.conditionLabels)),
      disabilityLabels: uniqueSorted(Array.from(aggregate.disabilityLabels)),
      industryFacets: uniqueSorted(Array.from(aggregate.industryFacets)),
      companySizeFacets: uniqueSorted(Array.from(aggregate.companySizeFacets)),
      accommodationFacets: uniqueSorted(Array.from(aggregate.accommodationFacets)),
      outcomeFacets: uniqueSorted(Array.from(aggregate.outcomeFacets)),
    },
    applicability,
    risk,
    confidence,
  };
}

function increment(map, key, amount = 1) {
  map[key] = (map[key] || 0) + amount;
}

async function main() {
  const records = await readJsonl(inputPath);
  const aggregateMap = new Map();
  let attemptedCandidateCount = 0;
  let candidateCount = 0;
  let boilerplateRejectedCount = 0;
  let sentenceSelectionRejectedCount = 0;
  let candidateEmissionRejectedCount = 0;
  let eligibleRecordCount = 0;
  const rejectedByReason = {};
  const rejectedBySourceId = {};
  const rejectedByPageType = {};
  const rejectedByEvidenceScope = {};
  const rejectedByStage = {};

  for (const record of records) {
    const { candidates, rejections, attemptedCount } = buildCandidates(record);
    attemptedCandidateCount += attemptedCount;

    for (const rejection of rejections) {
      boilerplateRejectedCount += 1;
      if (rejection.stage === 'sentence_selection') sentenceSelectionRejectedCount += 1;
      if (rejection.stage === 'candidate_emission') candidateEmissionRejectedCount += 1;
      increment(rejectedByReason, rejection.reason || 'unknown_rejection');
      increment(rejectedBySourceId, rejection.sourceId || 'unknown');
      increment(rejectedByPageType, rejection.pageType || 'unknown');
      increment(rejectedByEvidenceScope, rejection.evidenceScope || 'unknown');
      increment(rejectedByStage, rejection.stage || 'unknown');
    }

    if (attemptedCount === 0) continue;
    eligibleRecordCount += 1;

    for (const candidate of candidates) {
      candidateCount += 1;
      const key = `${candidate.claimType}|${candidate.signal || 'none'}|${candidate.evidenceScope || 'unknown'}|${candidate.canonicalStatement}`;
      if (!aggregateMap.has(key)) {
        aggregateMap.set(key, initializeAggregate(candidate));
      }
      mergeCandidate(aggregateMap.get(key), candidate);
    }
  }

  const claims = Array.from(aggregateMap.values()).map((aggregate) => toClaim(aggregate));
  claims.sort((a, b) => {
    if (b.evidenceCount !== a.evidenceCount) return b.evidenceCount - a.evidenceCount;
    return b.confidence.score - a.confidence.score;
  });

  const byClaimType = {};
  const bySignal = {};
  const byRiskLevel = {};
  const byConfidenceLevel = {};
  const bySourceId = {};
  const byCountry = {};
  const byLegalContext = {};
  const byEvidenceScope = {};
  const byEvidenceLane = {};
  let partialClaims = 0;

  for (const claim of claims) {
    increment(byClaimType, claim.claimType);
    increment(byRiskLevel, claim.risk.level);
    increment(byConfidenceLevel, claim.confidence.level);
    if (claim.signal) increment(bySignal, claim.signal);
    if (claim.applicability.isPartial) partialClaims += 1;

    for (const sourceId of claim.sourceIds) increment(bySourceId, sourceId);
    for (const country of claim.interactionContextSummary.countries) increment(byCountry, country);
    for (const legalContext of claim.interactionContextSummary.legalContexts)
      increment(byLegalContext, legalContext);
    for (const evidenceScope of claim.interactionContextSummary.evidenceScopes)
      increment(byEvidenceScope, evidenceScope);
    increment(byEvidenceLane, claim.interactionContextSummary.evidenceLane || 'unknown');
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    inputPath,
    outputPath,
    inputRecordCount: records.length,
    eligibleRecordCount,
    attemptedCandidateCount,
    candidateCount,
    boilerplateRejectedCount,
    sentenceSelectionRejectedCount,
    candidateEmissionRejectedCount,
    claimCount: claims.length,
    dedupReductionPct:
      candidateCount === 0
        ? 0
        : Number((((candidateCount - claims.length) / candidateCount) * 100).toFixed(1)),
    partialClaimCount: partialClaims,
    byClaimType,
    bySignal,
    byRiskLevel,
    byConfidenceLevel,
    bySourceId,
    byCountry,
    byLegalContext,
    byEvidenceScope,
    byEvidenceLane,
    rejectedByReason,
    rejectedBySourceId,
    rejectedByPageType,
    rejectedByEvidenceScope,
    rejectedByStage,
  };

  await fs.writeFile(
    outputPath,
    claims.map((claim) => JSON.stringify(claim)).join('\n') + '\n',
    'utf8',
  );
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`Claims written: ${outputPath}`);
  console.log(`Claims count: ${claims.length}`);
  console.log(`Candidates: ${candidateCount}`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
