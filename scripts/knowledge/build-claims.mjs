#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const projectRoot = '/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter';
const indexRoot = path.join(projectRoot, 'references', 'index');
const inputPath = path.join(indexRoot, 'normalized-records.jsonl');
const outputPath = path.join(indexRoot, 'knowledge-claims.jsonl');
const manifestPath = path.join(indexRoot, 'knowledge-claims-manifest.json');

const CONTEXT_DOMAINS = ['person', 'job', 'environment', 'support', 'time', 'institution', 'evidence'];

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
    difficulty_resolution: ['解決', '改善', '軽減', '緩和', 'mitigation', 'resolve', 'solution', 'adjustment'],
    symptom_exacerbation: ['症状', '悪化', '疲労', 'flare', 'symptom', 'worsen', '体調'],
    support_needs: ['必要', 'ニーズ', '支援', '配慮', 'accommodation', 'support', 'need', 'request'],
};

const ACCOMMODATION_KEYWORDS = {
    schedule_flexibility: ['時差', '短時間', '勤務時間', '休憩', '休暇', 'telework', 'flexible schedule'],
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
];

function uniqueSorted(values) {
    return Array.from(new Set(values.filter((value) => value !== null && value !== undefined && String(value).trim() !== ''))).sort();
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

function isBoilerplateText(text) {
    const normalized = String(text || '').replace(/\s+/g, ' ').trim();
    if (!normalized) return true;
    if (normalized.length < 14) return true;
    if (BOILERPLATE_PATTERNS.some((pattern) => pattern.test(normalized))) return true;
    return false;
}

function pickSentence(text, keywords) {
    const sentences = splitSentences(text);
    if (sentences.length === 0) {
        return String(text || '').replace(/\s+/g, ' ').trim().slice(0, 260);
    }

    const meaningfulSentences = sentences.filter((sentence) => !isBoilerplateText(sentence));

    for (const sentence of meaningfulSentences) {
        if (hasAny(sentence, keywords)) {
            return sentence.slice(0, 260);
        }
    }

    if (meaningfulSentences.length > 0) {
        return meaningfulSentences[0].slice(0, 260);
    }

    return sentences[0].slice(0, 260);
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
    const text = String(record.text || '');
    const disabilityFacets = ctx.disabilityFacets || ctx.disabilityHints || [];
    const industryFacets = ctx.industryFacets || [];
    const supportHints = ctx.supportTypeHints || [];
    const accommodationFacets = ctx.accommodationFacets || [];

    const hasTimeSignal =
        Boolean(ctx.linkedCaseYear) ||
        /\b(19|20)\d{2}\b/.test(text) ||
        /(年度|年次|year|years|monthly|weekly|daily)/i.test(text);

    const coverage = {
        person: disabilityFacets.length > 0 || /(本人|当事者|employee|worker|user|individual)/i.test(text),
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

function evaluateRisk({ evidenceScope, trustTier, missingContexts, evidenceCount }) {
    const missingCore = missingContexts.filter((domain) => ['person', 'job', 'support', 'institution'].includes(domain)).length;

    if (evidenceScope === 'aggregated_index' && trustTier === 'external') {
        return {
            level: 'high',
            reasons: ['aggregated_external_evidence'],
        };
    }

    if (evidenceScope === 'aggregated_index' && missingCore >= 1) {
        return {
            level: 'high',
            reasons: ['aggregated_index_evidence', 'missing_core_contexts'],
        };
    }

    if (trustTier === 'external' && evidenceCount <= 2 && missingCore >= 2) {
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

function evaluateConfidence({ trustTier, evidenceScope, pageTypes, missingContexts, evidenceCount }) {
    let score = mapTrustTierScore(trustTier);

    if (evidenceScope === 'specific_case') score += 0.1;
    if (evidenceScope === 'aggregated_index') score -= 0.05;
    if (pageTypes.includes('case_detail') || pageTypes.includes('case_guide')) score += 0.05;
    score -= Math.min(0.3, missingContexts.length * 0.04);
    score += Math.min(0.18, Math.max(0, evidenceCount - 1) * 0.03);
    score = Number(clamp(score, 0.05, 0.95).toFixed(3));

    const level = score >= 0.75 ? 'high' : score >= 0.55 ? 'medium' : 'low';
    return { score, level };
}

function makeCandidate(record, { claimType, signal = null, keywords = [] }) {
    const ctx = record.interactionContext || {};
    const statement = pickSentence(record.text, keywords);
    const canonicalStatement = normalizeForKey(statement);
    if (!canonicalStatement) return null;
    if (isBoilerplateText(statement)) return null;

    const coverage = inferContextCoverage(record);

    return {
        claimType,
        signal,
        statement,
        canonicalStatement,
        sourceId: record.sourceId,
        recordId: record.id,
        filePath: record.filePath,
        excerpt: String(record.text || '').replace(/\s+/g, ' ').trim().slice(0, 220),
        sourceUrl: ctx.finalUrl || ctx.sourceUrl || null,
        country: ctx.country || 'unknown',
        legalContext: ctx.legalContext || 'unspecified',
        language: ctx.language || 'unknown',
        trustTier: ctx.trustTier || 'unknown',
        pageType: ctx.pageType || 'unknown',
        evidenceScope: ctx.evidenceScope || 'unknown',
        disabilityFacets: uniqueSorted(ctx.disabilityFacets || ctx.disabilityHints || []),
        industryFacets: uniqueSorted(ctx.industryFacets || []),
        companySizeFacets: uniqueSorted(ctx.companySizeFacets || []),
        accommodationFacets: uniqueSorted(ctx.accommodationFacets || ctx.supportTypeHints || []),
        outcomeFacets: uniqueSorted(ctx.outcomeFacets || []),
        missingContexts: coverage.missingContexts,
        presentContexts: CONTEXT_DOMAINS.filter((domain) => !coverage.missingContexts.includes(domain)),
    };
}

function buildCandidates(record) {
    if (record.contentType === 'metadata_only') return [];
    if (!record.text || String(record.text).trim().length < 20) return [];

    const ctx = record.interactionContext || {};
    const signals = ctx.interactionModelSignals || {};
    const candidates = [];

    for (const [signal, isActive] of Object.entries(signals)) {
        if (!isActive) continue;
        candidates.push(
            makeCandidate(record, {
                claimType: 'interaction_signal',
                signal,
                keywords: SIGNAL_KEYWORDS[signal] || [],
            }),
        );
    }

    const accommodationFacets = uniqueSorted([...(ctx.accommodationFacets || []), ...(ctx.supportTypeHints || [])]);
    if (accommodationFacets.length > 0) {
        const keywords = uniqueSorted(
            accommodationFacets.flatMap((facet) => ACCOMMODATION_KEYWORDS[facet] || []).concat(['配慮', 'adjustment', 'support']),
        );
        candidates.push(
            makeCandidate(record, {
                claimType: 'accommodation_action',
                signal: null,
                keywords,
            }),
        );
    }

    const outcomeFacets = uniqueSorted(ctx.outcomeFacets || []);
    if (outcomeFacets.length > 0) {
        const keywords = uniqueSorted(outcomeFacets.flatMap((facet) => OUTCOME_KEYWORDS[facet] || []).concat(['結果', 'outcome']));
        candidates.push(
            makeCandidate(record, {
                claimType: 'outcome_signal',
                signal: null,
                keywords,
            }),
        );
    }

    return candidates.filter(Boolean);
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
        industryFacets: new Set(),
        companySizeFacets: new Set(),
        accommodationFacets: new Set(),
        outcomeFacets: new Set(),
        contextHits: Object.fromEntries(CONTEXT_DOMAINS.map((domain) => [domain, 0])),
        sampleExcerpts: [],
    };
}

function buildApplicability(aggregate) {
    const missingContexts = CONTEXT_DOMAINS.filter((domain) => (aggregate.contextHits[domain] || 0) === 0);
    const conditions = [];

    const evidenceScopes = Array.from(aggregate.evidenceScopes);
    if (evidenceScopes.includes('specific_case')) {
        conditions.push('Treat as case-bounded evidence; verify transferability to current workplace context.');
    }
    if (evidenceScopes.includes('aggregated_index')) {
        conditions.push('Treat as index-level evidence; require additional case/detail confirmation before action.');
    }
    if (aggregate.countries.size > 0) {
        const countries = Array.from(aggregate.countries).filter((value) => value !== 'unknown');
        if (countries.length > 0) {
            conditions.push(`Apply with jurisdiction check (${countries.join(', ')} legal context).`);
        }
    }
    if (aggregate.industryFacets.size > 0) {
        conditions.push(`Industry sensitivity present: ${Array.from(aggregate.industryFacets).join(', ')}.`);
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
    const applicability = buildApplicability(aggregate);
    const risk = evaluateRisk({
        evidenceScope: primaryEvidenceScope(evidenceScopes),
        trustTier: primaryTrustTier(trustTiers),
        missingContexts: applicability.missingContexts,
        evidenceCount: aggregate.evidenceCount,
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
            disabilityFacets: uniqueSorted(Array.from(aggregate.disabilityFacets)),
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
    let candidateCount = 0;
    let eligibleRecordCount = 0;

    for (const record of records) {
        const candidates = buildCandidates(record);
        if (candidates.length === 0) continue;
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
    let partialClaims = 0;

    for (const claim of claims) {
        increment(byClaimType, claim.claimType);
        increment(byRiskLevel, claim.risk.level);
        increment(byConfidenceLevel, claim.confidence.level);
        if (claim.signal) increment(bySignal, claim.signal);
        if (claim.applicability.isPartial) partialClaims += 1;

        for (const sourceId of claim.sourceIds) increment(bySourceId, sourceId);
        for (const country of claim.interactionContextSummary.countries) increment(byCountry, country);
        for (const legalContext of claim.interactionContextSummary.legalContexts) increment(byLegalContext, legalContext);
        for (const evidenceScope of claim.interactionContextSummary.evidenceScopes) increment(byEvidenceScope, evidenceScope);
    }

    const manifest = {
        generatedAt: new Date().toISOString(),
        inputPath,
        outputPath,
        inputRecordCount: records.length,
        eligibleRecordCount,
        candidateCount,
        claimCount: claims.length,
        dedupReductionPct:
            candidateCount === 0 ? 0 : Number((((candidateCount - claims.length) / candidateCount) * 100).toFixed(1)),
        partialClaimCount: partialClaims,
        byClaimType,
        bySignal,
        byRiskLevel,
        byConfidenceLevel,
        bySourceId,
        byCountry,
        byLegalContext,
        byEvidenceScope,
    };

    await fs.writeFile(outputPath, claims.map((claim) => JSON.stringify(claim)).join('\n') + '\n', 'utf8');
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
