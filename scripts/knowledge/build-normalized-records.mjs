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

const allowedExtensions = new Set(['.txt', '.pdf', '.xlsm', '.sav']);

const MODEL_SIGNAL_KEYWORDS = {
    difficulty_occurrence: {
        anchors: ['困難', '就労困難', 'difficulty', 'barrier', 'limitation', '仕事が難しい'],
        contexts: ['仕事内容', '職務', '業務', '配慮', '職場', '環境', 'job', 'task', 'workplace', 'accommodation'],
    },
    difficulty_resolution: {
        anchors: ['解決', '改善', '軽減', '緩和', '解消', 'solution', 'resolve', 'mitigation', 'improve'],
        contexts: ['配慮', '支援', '調整', '制度', 'accommodation', 'support', 'adjustment', 'policy'],
    },
    symptom_exacerbation: {
        anchors: ['症状', '悪化', '再燃', '疲労', '体調', 'flare', 'symptom', 'fatigue', 'worsen'],
        contexts: ['仕事内容', '勤務', '労働時間', '職場', '環境', '働き方', 'job', 'schedule', 'work style', 'workplace'],
    },
    support_needs: {
        anchors: ['必要', 'ニーズ', '希望', '配慮希望', 'need', 'preference', 'request'],
        contexts: ['支援', '合理的配慮', '配慮', '理解', 'support', 'accommodation', 'assistive'],
    },
};

const SUPPORT_TYPE_HINTS = [
    {
        key: 'schedule_flexibility',
        keywords: ['時差出勤', '短時間勤務', '勤務時間', '休憩', '休暇', 'テレワーク', '在宅勤務', 'schedule', 'remote', 'break'],
    },
    {
        key: 'task_adjustment',
        keywords: ['業務調整', '配置転換', '職務再設計', '作業手順', 'task', 'job redesign', 'duty'],
    },
    {
        key: 'environment_adjustment',
        keywords: ['照明', '騒音', '座席', '動線', '設備', 'workspace', 'noise', 'lighting', 'ergonomic'],
    },
    {
        key: 'communication_support',
        keywords: ['筆談', '手話', '通訳', '面談', '相談', 'コミュニケーション', 'communication', 'interpreter'],
    },
    {
        key: 'assistive_technology',
        keywords: ['支援機器', 'ソフトウェア', '入力補助', 'screen reader', 'assistive technology', 'tool'],
    },
];

const DISABILITY_HINTS = [
    { key: 'physical', keywords: ['肢体', '運動機能', 'physical disability', 'mobility'] },
    { key: 'visual', keywords: ['視覚障害', 'blind', 'low vision'] },
    { key: 'hearing', keywords: ['聴覚障害', '難聴', 'deaf', 'hearing'] },
    { key: 'mental', keywords: ['精神障害', 'うつ', '不安障害', 'mental health', 'depression'] },
    { key: 'developmental', keywords: ['発達障害', 'adhd', 'autism', 'asd'] },
    { key: 'intellectual', keywords: ['知的障害', 'intellectual disability'] },
    { key: 'internal', keywords: ['内部障害', '難病', '慢性疾患', 'chronic illness', 'autoimmune'] },
];

const INDUSTRY_HINTS = [
    { key: 'manufacturing', keywords: ['製造業', 'manufacturing', 'factory'] },
    { key: 'retail_wholesale', keywords: ['卸売', '小売', 'retail', 'wholesale', 'store'] },
    { key: 'healthcare_welfare', keywords: ['医療', '福祉', 'healthcare', 'hospital', 'welfare', 'care'] },
    { key: 'transport_logistics', keywords: ['運輸', '物流', 'transport', 'logistics'] },
    { key: 'construction', keywords: ['建設業', 'construction'] },
    { key: 'service', keywords: ['サービス業', 'service industry', 'hospitality'] },
    { key: 'education', keywords: ['教育', '学校', 'education', 'school'] },
    { key: 'public_sector', keywords: ['官公庁', '自治体', '公的機関', 'government agency', 'public sector'] },
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
    { key: 'schedule_flexibility', keywords: ['時差出勤', '短時間勤務', '休憩', '休暇', 'flexible schedule', 'telework', 'work from home'] },
    { key: 'task_redesign', keywords: ['業務調整', '配置転換', '職務再設計', 'task restructuring', 'job redesign'] },
    { key: 'environment_control', keywords: ['照明', '騒音', '空調', '環境調整', 'air quality', 'lighting', 'noise'] },
    { key: 'communication_support', keywords: ['筆談', '手話', '通訳', '面談', 'コミュニケーション', 'interpreter', 'communication support'] },
    { key: 'assistive_technology', keywords: ['支援機器', '補助具', 'assistive technology', 'screen reader', 'software'] },
    { key: 'policy_and_training', keywords: ['社内ルール', '方針', '研修', 'training', 'policy modification'] },
];

const OUTCOME_HINTS = [
    { key: 'retention', keywords: ['就業継続', '定着', '離職防止', 'retention', 'stay employed'] },
    { key: 'performance_improvement', keywords: ['生産性', '業務効率', '成果', 'performance', 'productivity'] },
    { key: 'symptom_stabilization', keywords: ['症状安定', '悪化防止', '体調管理', 'symptom stabilization', 'reduce flare'] },
    { key: 'barrier_reduction', keywords: ['困難軽減', '負担軽減', '問題解決', 'barrier reduction', 'problem solved'] },
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

function sidecarPathFromTxt(filePath) {
    if (!filePath.endsWith('.txt')) return null;
    return filePath.replace(/\.txt$/i, '.meta.json');
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
    if (!looksLikeWebCacheText(filePath)) {
        return {
            text: content,
            metadata: null,
            sidecarStructuredMetadata: null,
        };
    }

    const parsed = parseLeadingMetadataBlock(content);
    let sidecarStructuredMetadata = null;
    const sidecarPath = sidecarPathFromTxt(filePath);
    if (sidecarPath) {
        try {
            const sidecarRaw = await fs.readFile(sidecarPath, 'utf8');
            const sidecar = JSON.parse(sidecarRaw);
            sidecarStructuredMetadata = sidecar?.structuredMetadata || null;
        } catch {
            sidecarStructuredMetadata = null;
        }
    }

    return {
        text: parsed.body,
        metadata: parsed.metadata,
        sidecarStructuredMetadata,
    };
}

async function extractPdfText(filePath, canUsePdfToText) {
    if (!canUsePdfToText) {
        return {
            text: '',
            warning: 'pdftotext is not available. PDF is stored as metadata only to avoid noisy extraction.',
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
            .filter((entry) => /^xl\/(sharedStrings\.xml|worksheets\/.*\.xml|tables\/.*\.xml)$/i.test(entry));

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

function hasAnyKeyword(text, keywords) {
    const normalized = text.toLowerCase();
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
    if (sourceId === 'askjan_website') return 'US';
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

function inferLegalContext(country, sourceId) {
    if (sourceId === 'jeed_reference' || country === 'JP') return 'japan_disability_employment_policy';
    if (sourceId === 'askjan_website' || country === 'US') return 'ada_title_i';
    if (sourceId === 'uk_gov_disability_employment' || country === 'UK') return 'equality_act_2010';
    if (sourceId === 'eu_reasonable_accommodation' || country === 'EU') return 'eu_employment_equality_framework';
    if (sourceId === 'germany_agg_legal' || country === 'DE') return 'germany_agg';
    if (sourceId === 'germany_antidiscrimination_work') return 'germany_agg';
    if (sourceId === 'australia_jobaccess_guidance' || country === 'AU') return 'australia_disability_discrimination_act';
    if (sourceId === 'canada_duty_to_accommodate' || country === 'CA') return 'canada_human_rights_duty_to_accommodate';
    if (sourceId === 'ilo_workplace_adjustments' || country === 'INTL') return 'ilo_disability_inclusion_guidance';
    return 'unspecified';
}

function inferPageType(sourceId, metadata) {
    const url = metadata?.final_url || metadata?.url || '';
    if (!url) return 'unknown';

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

    return 'document';
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
    return dictionary.filter((entry) => hasAnyKeyword(text, entry.keywords)).map((entry) => entry.key);
}

function detectTrustTier(sourceMap, sourceId) {
    const source = sourceMap.get(sourceId);
    if (!source) return 'unknown';
    if (source.trustLevel === 'primary') return 'primary';
    if (source.trustLevel === 'secondary') return 'secondary';
    return 'external';
}

function buildInteractionContext({ sourceId, filePath, text, metadata, sourceMap, jeedCaseMap }) {
    const language = detectLanguage(text);
    const country = inferCountry(sourceId, metadata, filePath);
    const pageType = inferPageType(sourceId, metadata);
    const evidenceScope =
        pageType === 'case_detail' || pageType === 'case_guide' ? 'specific_case' : pageType === 'unknown' ? 'unknown' : 'aggregated_index';
    const normalizedUrl = normalizeHttpUrl(metadata?.final_url || metadata?.url || '');
    const linkedJeedCase =
        sourceId === 'jeed_reference' && pageType === 'case_detail' && normalizedUrl ? jeedCaseMap.get(normalizedUrl) || null : null;
    const enrichmentText = linkedJeedCase
        ? [linkedJeedCase.title, linkedJeedCase.year, linkedJeedCase.industry, linkedJeedCase.companySize, linkedJeedCase.disability]
              .filter(Boolean)
              .join(' ')
        : '';
    const signalText = enrichmentText ? `${text}\n${enrichmentText}` : text;
    const interactionModelSignals = detectModelSignals(signalText);

    const supportTypeHints = detectHints(signalText, SUPPORT_TYPE_HINTS);
    const disabilityHintsRaw = detectHints(signalText, DISABILITY_HINTS);
    const industryFacetsRaw = detectHints(signalText, INDUSTRY_HINTS);
    const companySizeFacetsRaw = detectHints(signalText, COMPANY_SIZE_HINTS);
    const accommodationFacetsRaw = detectHints(signalText, ACCOMMODATION_ACTION_HINTS);
    const outcomeFacetsRaw = detectHints(signalText, OUTCOME_HINTS);

    const isAggregatedIndex = evidenceScope === 'aggregated_index';
    const disabilityHints = isAggregatedIndex ? [] : disabilityHintsRaw;
    const industryFacets = isAggregatedIndex ? [] : industryFacetsRaw;
    const companySizeFacets = isAggregatedIndex ? [] : companySizeFacetsRaw;
    const accommodationFacets = isAggregatedIndex ? accommodationFacetsRaw.slice(0, 2) : accommodationFacetsRaw;
    const outcomeFacets = isAggregatedIndex ? outcomeFacetsRaw.slice(0, 2) : outcomeFacetsRaw;

    return {
        language,
        country,
        legalContext: inferLegalContext(country, sourceId),
        trustTier: detectTrustTier(sourceMap, sourceId),
        sourceUrl: metadata?.url || null,
        finalUrl: metadata?.final_url || null,
        fetchedAt: metadata?.fetched_at || null,
        linkedCaseTitle: linkedJeedCase?.title || null,
        linkedCaseYear: linkedJeedCase?.year || null,
        pageType,
        evidenceScope,
        interactionModelSignals,
        supportTypeHints,
        disabilityHints,
        disabilityFacets: disabilityHints,
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
        const sidecarPath = sidecarPathFromTxt(filePath);
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
    stats.byPageType[context.pageType || 'unknown'] = (stats.byPageType[context.pageType || 'unknown'] || 0) + 1;
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
        let warning = null;
        let extractedMetadata = null;

        if (extension === '.txt') {
            const result = await readTextFile(filePath);
            text = result.text;
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
        });

        if (warning) {
            warnings.push({ filePath, warning });
        }

        const chunks = chunkText(text);
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
            byContentType[metadataRecord.contentType] = (byContentType[metadataRecord.contentType] || 0) + 1;
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
                text: chunk,
                metadata: extractedMetadata,
                sourceMap,
                jeedCaseMap,
            });

            const isWebCache = looksLikeWebCacheText(filePath);
            const record = {
                id: makeRecordId(filePath, index),
                sourceId,
                filePath,
                extension,
                contentType: isWebCache
                    ? 'web_reference'
                    : extension === '.txt'
                        ? 'narrative'
                        : extension === '.pdf'
                            ? 'guideline'
                            : extension === '.sav'
                                ? 'structured_meta'
                                : 'table_like',
                text: chunk,
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
    await fs.writeFile(recordsPath, records.map((record) => JSON.stringify(record)).join('\n') + '\n', 'utf8');

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
