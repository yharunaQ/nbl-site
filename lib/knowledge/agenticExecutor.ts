import { promises as fs } from 'node:fs';
import path from 'node:path';
import { PlannerOutput, PlannerStepProgress } from '@/lib/knowledge/types';

export type EvidenceItem = {
    id: string;
    sourceId: string;
    filePath: string;
    excerpt: string;
    score: number;
};

export type AgenticExecutionContext = {
    query: string;
    keywords: string[];
    maxFiles?: number;
};

export type AgenticExecutionResult = {
    stepProgress: PlannerStepProgress[];
    evidence: EvidenceItem[];
    structuredSummary: string[];
    policyNotes: string[];
};

type NormalizedRecord = {
    id: string;
    sourceId: string;
    filePath: string;
    extension: string;
    contentType: string;
    text: string;
};

type EmbeddingRow = {
    id: string;
    vector: number[];
};

type Manifest = {
    generatedAt: string;
    root: string;
    fileCount: number;
    recordCount: number;
    byExtension: Record<string, number>;
    byContentType?: Record<string, number>;
    metadataOnlyCount?: number;
    extractionCoveragePct?: number;
    warnings: Array<{ filePath: string; warning: string }>;
};

const NORMALIZED_RECORDS_PATH = path.join(process.cwd(), 'references', 'index', 'normalized-records.jsonl');
const EMBEDDINGS_PATH = path.join(process.cwd(), 'references', 'index', 'embeddings.jsonl');
const MANIFEST_PATH = path.join(process.cwd(), 'references', 'index', 'normalized-manifest.json');
const EMBEDDINGS_URL = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_TIMEOUT_MS = 6000;
const BM25_K1 = 1.5;
const BM25_B = 0.75;

function normalizeKeywords(input: string[]): string[] {
    const compact = input
        .flatMap((value) => value.split(/[\s、。,.()\[\]「」\n\r\t]+/))
        .map((value) => value.trim())
        .filter((value) => value.length >= 2);

    return Array.from(new Set(compact)).slice(0, 40);
}

function generateLooseKeywords(input: string[]): string[] {
    const seeds = input
        .map((value) => value.replace(/\s+/g, ' ').trim())
        .filter((value) => value.length >= 2)
        .slice(0, 8);

    const chunks: string[] = [];
    for (const seed of seeds) {
        const plain = seed.replace(/[、。,.()\[\]「」]/g, '');
        if (plain.length < 2) continue;
        for (let i = 0; i < plain.length - 1 && chunks.length < 120; i += 1) {
            chunks.push(plain.slice(i, i + 2));
        }
        for (let i = 0; i < plain.length - 2 && chunks.length < 180; i += 2) {
            chunks.push(plain.slice(i, i + 3));
        }
    }

    return Array.from(new Set(chunks)).filter((term) => term.length >= 2).slice(0, 120);
}

function countTermOccurrences(content: string, term: string): number {
    if (!term || term.length === 0) return 0;

    let count = 0;
    let from = 0;
    while (from < content.length) {
        const index = content.indexOf(term, from);
        if (index === -1) break;
        count += 1;
        from = index + term.length;
    }

    return count;
}

type LexicalContext = {
    idfByKeyword: Map<string, number>;
    avgDocLength: number;
};

function buildLexicalContext(records: NormalizedRecord[], keywords: string[]): LexicalContext {
    const idfByKeyword = new Map<string, number>();
    const docCount = records.length || 1;
    const avgDocLength =
        records.length === 0 ? 1 : records.reduce((sum, record) => sum + Math.max(record.text.length, 1), 0) / records.length;

    for (const keyword of keywords) {
        let df = 0;
        for (const record of records) {
            if (record.text.includes(keyword)) {
                df += 1;
            }
        }

        const idf = Math.log(1 + (docCount - df + 0.5) / (df + 0.5));
        idfByKeyword.set(keyword, Number.isFinite(idf) ? idf : 0);
    }

    return {
        idfByKeyword,
        avgDocLength: avgDocLength > 0 ? avgDocLength : 1,
    };
}

function scoreByBm25(content: string, keywords: string[], lexicalContext: LexicalContext): number {
    const dl = Math.max(content.length, 1);
    let score = 0;

    for (const keyword of keywords) {
        const tf = countTermOccurrences(content, keyword);
        if (tf === 0) continue;

        const idf = lexicalContext.idfByKeyword.get(keyword) || 0;
        const numerator = tf * (BM25_K1 + 1);
        const denominator = tf + BM25_K1 * (1 - BM25_B + BM25_B * (dl / lexicalContext.avgDocLength));
        score += idf * (numerator / denominator);
    }

    return Number(score.toFixed(6));
}

function filterRecordsBySourceIds(records: NormalizedRecord[], sourceIds: string[]): NormalizedRecord[] {
    if (!sourceIds || sourceIds.length === 0) return records;
    const allow = new Set(sourceIds);
    return records.filter((record) => allow.has(record.sourceId));
}

function filterSearchableRecords(records: NormalizedRecord[]): NormalizedRecord[] {
    return records.filter((record) => record.contentType !== 'metadata_only');
}

function pickSearchCandidates(
    records: NormalizedRecord[],
    keywords: string[],
    maxRecords?: number,
): NormalizedRecord[] {
    if (!maxRecords || maxRecords <= 0 || records.length <= maxRecords) {
        return records;
    }

    const ranked = records
        .map((record) => ({
            record,
            signal: keywords.reduce((count, keyword) => count + (record.text.includes(keyword) ? 1 : 0), 0),
        }))
        .sort((a, b) => b.signal - a.signal);

    return ranked.slice(0, maxRecords).map((item) => item.record);
}

function extractBestExcerpt(content: string, keywords: string[]): string {
    const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    for (const line of lines) {
        if (keywords.some((keyword) => line.includes(keyword))) {
            return line.slice(0, 220);
        }
    }

    return content.replace(/\s+/g, ' ').trim().slice(0, 220);
}

function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;

    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i += 1) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function readJsonLines<T>(filePath: string): Promise<T[]> {
    try {
        const raw = await fs.readFile(filePath, 'utf8');
        return raw
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => JSON.parse(line) as T);
    } catch {
        return [];
    }
}

async function readNormalizedRecords(): Promise<NormalizedRecord[]> {
    const rows = await readJsonLines<NormalizedRecord>(NORMALIZED_RECORDS_PATH);
    return rows.filter((row) => typeof row.text === 'string' && row.text.trim().length > 0);
}

async function readEmbeddingMap(): Promise<Map<string, number[]>> {
    const rows = await readJsonLines<EmbeddingRow>(EMBEDDINGS_PATH);
    return new Map(rows.map((row) => [row.id, row.vector]));
}

async function readManifest(): Promise<Manifest | null> {
    try {
        const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
        return JSON.parse(raw) as Manifest;
    } catch {
        return null;
    }
}

async function getQueryEmbedding(query: string): Promise<number[] | null> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), EMBEDDING_TIMEOUT_MS);

    try {
        const response = await fetch(EMBEDDINGS_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.OPENAI_EMBED_MODEL || 'text-embedding-3-small',
                input: query.slice(0, 6000),
            }),
            signal: controller.signal,
        });

        if (!response.ok) return null;
        const json = await response.json();
        return json?.data?.[0]?.embedding || null;
    } catch {
        return null;
    } finally {
        clearTimeout(timeoutId);
    }
}

function runKeywordSearch(
    records: NormalizedRecord[],
    keywords: string[],
    lexicalContext: LexicalContext,
    maxRecords?: number,
): EvidenceItem[] {
    const candidates = pickSearchCandidates(records, keywords, maxRecords);
    const primary = candidates
        .map((record) => {
            const score = scoreByBm25(record.text, keywords, lexicalContext);
            return {
                id: record.id,
                sourceId: record.sourceId,
                filePath: record.filePath,
                excerpt: extractBestExcerpt(record.text, keywords),
                score,
            };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);

    if (primary.length > 0) return primary;

    const looseKeywords = generateLooseKeywords(keywords);
    if (looseKeywords.length === 0) return [];
    const looseLexical = buildLexicalContext(candidates, looseKeywords);

    return candidates
        .map((record) => {
            const score = scoreByBm25(record.text, looseKeywords, looseLexical);
            return {
                id: record.id,
                sourceId: record.sourceId,
                filePath: record.filePath,
                excerpt: extractBestExcerpt(record.text, looseKeywords),
                score: Number((score * 0.6).toFixed(6)),
            };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
}

async function runHybridSemanticSearch(
    records: NormalizedRecord[],
    keywords: string[],
    query: string,
    embeddingMap: Map<string, number[]>,
    lexicalContext: LexicalContext,
    maxRecords?: number,
): Promise<{ hits: EvidenceItem[]; mode: 'hybrid' | 'lexical_fallback' }> {
    const candidates = pickSearchCandidates(records, keywords, maxRecords);
    const embedCandidates = candidates.filter((record) => embeddingMap.has(record.id));
    const queryVector = await getQueryEmbedding(query);

    if (queryVector && embedCandidates.length > 0) {
        const scored = embedCandidates
            .map((record) => {
                const vector = embeddingMap.get(record.id) as number[];
                const cosine = cosineSimilarity(queryVector, vector);
                const lexicalScore = scoreByBm25(record.text, keywords, lexicalContext);
                const combinedScore = cosine * 100 + lexicalScore * 10;

                return {
                    id: record.id,
                    sourceId: record.sourceId,
                    filePath: record.filePath,
                    excerpt: extractBestExcerpt(record.text, keywords),
                    score: Number(combinedScore.toFixed(4)),
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);

        return { hits: scored, mode: 'hybrid' };
    }

    const fallback = candidates
        .map((record) => ({
            id: record.id,
            sourceId: record.sourceId,
            filePath: record.filePath,
            excerpt: extractBestExcerpt(record.text, keywords),
            score: scoreByBm25(record.text, keywords, lexicalContext),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

    if (fallback.length > 0) {
        return { hits: fallback, mode: 'lexical_fallback' };
    }

    const looseKeywords = generateLooseKeywords([query, ...keywords]);
    if (looseKeywords.length === 0) {
        return { hits: [], mode: 'lexical_fallback' };
    }
    const looseLexical = buildLexicalContext(candidates, looseKeywords);
    const looseFallback = candidates
        .map((record) => ({
            id: record.id,
            sourceId: record.sourceId,
            filePath: record.filePath,
            excerpt: extractBestExcerpt(record.text, looseKeywords),
            score: Number((scoreByBm25(record.text, looseKeywords, looseLexical) * 0.6).toFixed(6)),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

    return { hits: looseFallback, mode: 'lexical_fallback' };
}

function summarizeStructuredAssets(manifest: Manifest | null, records: NormalizedRecord[]): string[] {
    if (!manifest) {
        return ['No manifest found. Run npm run knowledge:normalize to enable structured summaries.'];
    }

    const summary = [
        `Dataset files indexed: ${manifest.fileCount}`,
        `Normalized records indexed: ${manifest.recordCount}`,
        `Narrative chunks: ${records.filter((record) => record.contentType === 'narrative').length}`,
        `Guideline chunks: ${records.filter((record) => record.contentType === 'guideline').length}`,
        `Structured metadata records: ${records.filter((record) => record.contentType === 'structured_meta').length}`,
    ];

    if (typeof manifest.metadataOnlyCount === 'number') {
        summary.push(`Metadata-only files: ${manifest.metadataOnlyCount}`);
    }

    if (typeof manifest.extractionCoveragePct === 'number') {
        summary.push(`Extraction coverage: ${manifest.extractionCoveragePct}%`);
    }

    if (manifest.warnings.length > 0) {
        summary.push(`Extraction warnings: ${manifest.warnings.length}`);
    }

    return summary;
}

function buildPolicyNotes(): string[] {
    return [
        'Do not provide medical diagnosis or treatment instructions.',
        'Frame outputs as workplace accommodation proposals, not legal advice.',
        'Use explicit uncertainty when evidence is thin or conflicting.',
    ];
}

export async function executeAgenticPlan(
    plan: PlannerOutput,
    context: AgenticExecutionContext,
): Promise<AgenticExecutionResult> {
    const stepProgress: PlannerStepProgress[] = [];
    const evidence: EvidenceItem[] = [];
    const structuredSummary: string[] = [];
    const policyNotes: string[] = [];

    const keywords = normalizeKeywords([context.query, ...context.keywords]);
    const maxFiles = context.maxFiles;

    const [records, embeddingMap, manifest] = await Promise.all([
        readNormalizedRecords(),
        readEmbeddingMap(),
        readManifest(),
    ]);
    const lexicalContext = buildLexicalContext(records, keywords);

    for (const step of plan.steps) {
        const stepRecords = filterRecordsBySourceIds(records, step.sourceIds);
        const searchableStepRecords = filterSearchableRecords(stepRecords);

        if (step.tool === 'keyword_search') {
            if (searchableStepRecords.length === 0) {
                stepProgress.push({
                    stepId: step.stepId,
                    purpose: step.purpose,
                    tool: step.tool,
                    status: 'skipped',
                    message: 'No normalized records found for selected sources',
                    evidenceCount: 0,
                });
                continue;
            }

            const hits = runKeywordSearch(searchableStepRecords, keywords, lexicalContext, maxFiles);
            evidence.push(...hits);
            stepProgress.push({
                stepId: step.stepId,
                purpose: step.purpose,
                tool: step.tool,
                status: 'completed',
                message: `Retrieved ${hits.length} lexical matches`,
                evidenceCount: hits.length,
            });
            continue;
        }

        if (step.tool === 'semantic_search') {
            if (searchableStepRecords.length === 0) {
                stepProgress.push({
                    stepId: step.stepId,
                    purpose: step.purpose,
                    tool: step.tool,
                    status: 'skipped',
                    message: 'No normalized records found for selected sources',
                    evidenceCount: 0,
                });
                continue;
            }

            const { hits, mode } = await runHybridSemanticSearch(
                searchableStepRecords,
                keywords,
                context.query,
                embeddingMap,
                lexicalContext,
                maxFiles,
            );
            evidence.push(...hits);
            stepProgress.push({
                stepId: step.stepId,
                purpose: step.purpose,
                tool: step.tool,
                status: 'completed',
                message:
                    mode === 'hybrid'
                        ? `Hybrid retrieval done with ${hits.length} matches`
                        : `Fallback lexical retrieval with ${hits.length} matches`,
                evidenceCount: hits.length,
            });
            continue;
        }

        if (step.tool === 'structured_query') {
            const summary = summarizeStructuredAssets(manifest, stepRecords);
            structuredSummary.push(...summary);
            stepProgress.push({
                stepId: step.stepId,
                purpose: step.purpose,
                tool: step.tool,
                status: 'completed',
                message: 'Structured assets summarized',
                evidenceCount: summary.length,
            });
            continue;
        }

        if (step.tool === 'policy_check') {
            const notes = buildPolicyNotes();
            policyNotes.push(...notes);
            stepProgress.push({
                stepId: step.stepId,
                purpose: step.purpose,
                tool: step.tool,
                status: 'completed',
                message: 'Policy guardrails applied',
                evidenceCount: notes.length,
            });
            continue;
        }

        stepProgress.push({
            stepId: step.stepId,
            purpose: step.purpose,
            tool: step.tool,
            status: 'completed',
            message: 'Synthesis step delegated to model',
            evidenceCount: 0,
        });
    }

    const dedupedEvidence = Array.from(
        evidence.reduce((map, item) => {
            const existing = map.get(item.id);
            if (!existing || item.score > existing.score) {
                map.set(item.id, item);
            }
            return map;
        }, new Map<string, EvidenceItem>()),
    )
        .map(([, item]) => item)
        .sort((a, b) => b.score - a.score)
        .slice(0, 16);

    return {
        stepProgress,
        evidence: dedupedEvidence,
        structuredSummary,
        policyNotes,
    };
}
