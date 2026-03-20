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

const K_MIN = Number(process.env.JAC_CLUSTER_K_MIN || 18);
const K_MAX = Number(process.env.JAC_CLUSTER_K_MAX || 34);
const RESTARTS = Number(process.env.JAC_CLUSTER_RESTARTS || 4);
const MAX_ITERS = Number(process.env.JAC_CLUSTER_MAX_ITERS || 18);
const SAMPLE_MAX_CLAIMS = Number(process.env.JAC_CLUSTER_MAX_CLAIMS || 900);
const SAMPLE_MAX_SILHOUETTE = Number(process.env.JAC_CLUSTER_MAX_SILHOUETTE || 500);
const FEATURE_MAX_PER_DOC = Number(process.env.JAC_CLUSTER_FEATURE_MAX_PER_DOC || 80);
const MIN_TOKEN_DF = Number(process.env.JAC_CLUSTER_MIN_TOKEN_DF || 3);
const BASE_SEED = Number(process.env.JAC_CLUSTER_SEED || 20260302);
const COMPLEXITY_PENALTY = Number(process.env.JAC_CLUSTER_COMPLEXITY_PENALTY || 0.015);

const NOISY_STATEMENT_REGEX =
  /(close menu|toggle navigation|skip to main content|サイトマップ|検索結果|本文へ|文字サイズ変更|背景色変更|all rights reserved|copyright|メニュー\s*閉じる|table of contents)/i;

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\r?\n/g, ' ')
    .replace(/[「」『』（）()［］\[\]【】〈〉《》]/g, ' ')
    .replace(/[、。，．,.:：;；!?！？/／\\|・]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeMixed(text) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  const tokens = [];

  const latinWords = normalized.match(/[a-z0-9][a-z0-9_-]{1,}/g) || [];
  tokens.push(...latinWords);

  const jaSegments = normalized.match(/[ぁ-んァ-ヶー一-龠]{2,}/g) || [];
  for (const seg of jaSegments) {
    tokens.push(seg);
    const maxGram = Math.min(seg.length - 1, 6);
    for (let i = 0; i < seg.length - 1; i += 1) {
      for (let g = 2; g <= maxGram; g += 1) {
        if (i + g > seg.length) break;
        tokens.push(seg.slice(i, i + g));
      }
    }
  }

  return tokens.filter((token) => token.length >= 2 && token.length <= 16);
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
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

function extractObjectSource(fileText, marker) {
  const markerIndex = fileText.indexOf(marker);
  if (markerIndex < 0) return null;
  const braceStart = fileText.indexOf('{', markerIndex);
  if (braceStart < 0) return null;
  let depth = 0;
  let braceEnd = -1;
  for (let i = braceStart; i < fileText.length; i += 1) {
    const ch = fileText[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        braceEnd = i;
        break;
      }
    }
  }
  if (braceEnd < 0) return null;
  return fileText.slice(braceStart, braceEnd + 1);
}

function countKeywordMatches(text, keywords) {
  const normalized = normalizeText(text);
  return (Array.isArray(keywords) ? keywords : []).reduce((count, keyword) => {
    const key = normalizeText(keyword);
    if (!key) return count;
    return normalized.includes(key) ? count + 1 : count;
  }, 0);
}

function scoreSampleForCard(sampleText, profile) {
  const issueHits = countKeywordMatches(sampleText, profile.issueKeywords || []);
  const supportHits = countKeywordMatches(sampleText, profile.supportKeywords || []);
  const claimHits = countKeywordMatches(sampleText, profile.claimKeywords || []);
  return issueHits * 2 + supportHits * 2 + claimHits;
}

function dotSparse(left, right) {
  if (!left || !right) return 0;
  const small = left.size <= right.size ? left : right;
  const large = left.size <= right.size ? right : left;
  let sum = 0;
  for (const [key, value] of small) {
    const other = large.get(key);
    if (typeof other === 'number') sum += value * other;
  }
  return sum;
}

function normalizeSparse(vector) {
  let norm = 0;
  for (const value of vector.values()) norm += value * value;
  norm = Math.sqrt(norm);
  if (!norm) return vector;
  const out = new Map();
  for (const [key, value] of vector) out.set(key, value / norm);
  return out;
}

function cosineDistanceSquared(a, b) {
  const d = dotSparse(a, b);
  const bounded = Math.max(-1, Math.min(1, d));
  return 2 - 2 * bounded;
}

function pickWeightedIndex(weights, rand) {
  const total = weights.reduce((sum, w) => sum + (w > 0 ? w : 0), 0);
  if (total <= 0) return Math.floor(rand() * weights.length);
  const pivot = rand() * total;
  let acc = 0;
  for (let i = 0; i < weights.length; i += 1) {
    const w = weights[i] > 0 ? weights[i] : 0;
    acc += w;
    if (acc >= pivot) return i;
  }
  return weights.length - 1;
}

function initCentersKMeansPP(vectors, k, rand) {
  const n = vectors.length;
  const centers = [];
  centers.push(vectors[Math.floor(rand() * n)]);

  while (centers.length < k) {
    const minDistances = new Array(n).fill(Number.POSITIVE_INFINITY);
    for (let i = 0; i < n; i += 1) {
      for (const center of centers) {
        const d = cosineDistanceSquared(vectors[i], center);
        if (d < minDistances[i]) minDistances[i] = d;
      }
    }
    const nextIdx = pickWeightedIndex(minDistances, rand);
    centers.push(vectors[nextIdx]);
  }
  return centers;
}

function recomputeCenters(vectors, assignments, k, rand) {
  const accumulators = Array.from({ length: k }, () => new Map());
  const counts = new Array(k).fill(0);

  for (let i = 0; i < vectors.length; i += 1) {
    const cluster = assignments[i];
    counts[cluster] += 1;
    const acc = accumulators[cluster];
    for (const [term, value] of vectors[i]) {
      acc.set(term, (acc.get(term) || 0) + value);
    }
  }

  for (let c = 0; c < k; c += 1) {
    if (counts[c] > 0) {
      const inv = 1 / counts[c];
      for (const [term, value] of accumulators[c]) {
        accumulators[c].set(term, value * inv);
      }
      accumulators[c] = normalizeSparse(accumulators[c]);
    } else {
      accumulators[c] = vectors[Math.floor(rand() * vectors.length)];
    }
  }
  return accumulators;
}

function runKMeans(vectors, k, restarts, maxIters, seedBase) {
  let best = null;

  for (let restart = 0; restart < restarts; restart += 1) {
    const rand = mulberry32(seedBase + restart * 7919 + k * 187);
    let centers = initCentersKMeansPP(vectors, k, rand);
    let assignments = new Array(vectors.length).fill(0);
    let changed = true;
    let iter = 0;

    while (changed && iter < maxIters) {
      changed = false;
      iter += 1;
      for (let i = 0; i < vectors.length; i += 1) {
        let bestCluster = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        for (let c = 0; c < k; c += 1) {
          const d = cosineDistanceSquared(vectors[i], centers[c]);
          if (d < bestDist) {
            bestDist = d;
            bestCluster = c;
          }
        }
        if (assignments[i] !== bestCluster) {
          assignments[i] = bestCluster;
          changed = true;
        }
      }
      centers = recomputeCenters(vectors, assignments, k, rand);
    }

    let sse = 0;
    const clusterSizes = new Array(k).fill(0);
    for (let i = 0; i < vectors.length; i += 1) {
      const c = assignments[i];
      const d = cosineDistanceSquared(vectors[i], centers[c]);
      sse += d;
      clusterSizes[c] += 1;
    }

    const runResult = {
      sse: Number(sse.toFixed(6)),
      assignments,
      centers,
      clusterSizes,
      iterations: iter,
      restart,
    };
    if (!best || runResult.sse < best.sse) best = runResult;
  }

  return best;
}

function computeSilhouetteProxy(vectors, assignments, centers, maxSamples, seed) {
  const n = vectors.length;
  const rand = mulberry32(seed);
  const sampleCount = Math.min(n, Math.max(80, maxSamples));
  const indices = [];
  if (sampleCount >= n) {
    for (let i = 0; i < n; i += 1) indices.push(i);
  } else {
    const picked = new Set();
    while (indices.length < sampleCount) {
      const idx = Math.floor(rand() * n);
      if (picked.has(idx)) continue;
      picked.add(idx);
      indices.push(idx);
    }
  }

  let sum = 0;
  for (const idx of indices) {
    const own = assignments[idx];
    const a = cosineDistanceSquared(vectors[idx], centers[own]);
    let b = Number.POSITIVE_INFINITY;
    for (let c = 0; c < centers.length; c += 1) {
      if (c === own) continue;
      const d = cosineDistanceSquared(vectors[idx], centers[c]);
      if (d < b) b = d;
    }
    const den = Math.max(a, b);
    const s = den === 0 ? 0 : (b - a) / den;
    sum += s;
  }
  return Number((sum / indices.length).toFixed(4));
}

function buildVocabulary(samples) {
  const df = new Map();
  const tokenized = [];
  for (const sample of samples) {
    const tokens = tokenizeMixed(sample.text);
    tokenized.push(tokens);
    const uniq = new Set(tokens);
    for (const token of uniq) {
      df.set(token, (df.get(token) || 0) + 1);
    }
  }

  const vocab = new Map();
  const dfByTermId = new Map();
  let nextId = 0;
  for (const [token, count] of df) {
    if (count < MIN_TOKEN_DF) continue;
    vocab.set(token, nextId);
    dfByTermId.set(nextId, count);
    nextId += 1;
  }
  return { dfByTermId, vocab, tokenized };
}

function vectorizeSamples(samples, dfByTermId, vocab, tokenized) {
  const nDocs = samples.length;
  const vectors = [];
  const keptSamples = [];

  for (let i = 0; i < samples.length; i += 1) {
    const tokens = tokenized[i];
    const tf = new Map();
    for (const token of tokens) {
      const termId = vocab.get(token);
      if (typeof termId !== 'number') continue;
      tf.set(termId, (tf.get(termId) || 0) + 1);
    }
    if (tf.size === 0) continue;

    const weighted = [];
    for (const [termId, count] of tf) {
      const tokenDf = Number(dfByTermId.get(termId) || 1);
      const idf = Math.log((1 + nDocs) / (1 + tokenDf)) + 1;
      const value = Math.log(1 + count) * idf;
      weighted.push([termId, value]);
    }

    weighted.sort((a, b) => b[1] - a[1]);
    const sparse = new Map(weighted.slice(0, FEATURE_MAX_PER_DOC));
    vectors.push(normalizeSparse(sparse));
    keptSamples.push(samples[i]);
  }

  return { vectors, samples: keptSamples };
}

function buildSamples(data2, claims, glmRelations) {
  const samples = [];
  let nextId = 0;

  for (const entry of data2?.entries || []) {
    const disability = String(entry?.disability || '').trim() || '不明';
    for (const issueRow of entry?.issues || []) {
      const issue = String(issueRow?.issue || '').trim();
      if (!issue) continue;
      const supports = Array.isArray(issueRow?.supports) ? issueRow.supports : [];
      const text = [issue, ...supports.map((s) => String(s || '').trim())].join(' ');
      samples.push({
        id: `data2-${nextId++}`,
        source: 'data2_issue',
        text,
        meta: { disability, entryId: Number(entry?.id || 0) },
      });
    }
  }

  const eligibleClaims = claims
    .filter((claim) => String(claim?.risk?.level || '') !== 'high')
    .map((claim) => {
      const statement = String(claim?.canonicalStatement || claim?.statement || '').trim();
      return { claim, statement };
    })
    .filter((row) => row.statement && !NOISY_STATEMENT_REGEX.test(row.statement))
    .sort((a, b) => {
      const eA = Number(a.claim?.evidenceCount || 0);
      const eB = Number(b.claim?.evidenceCount || 0);
      if (eB !== eA) return eB - eA;
      return b.statement.length - a.statement.length;
    })
    .slice(0, SAMPLE_MAX_CLAIMS);

  for (const row of eligibleClaims) {
    samples.push({
      id: `claim-${nextId++}`,
      source: 'claim',
      text: row.statement,
      meta: { claimId: String(row.claim?.id || '') },
    });
  }

  const relations = Array.isArray(glmRelations?.relations)
    ? glmRelations.relations
    : Array.isArray(glmRelations)
      ? glmRelations
      : [];
  for (const relation of relations) {
    const relationId = String(relation?.id || '').trim();
    if (!relationId) continue;
    const text = [
      String(relation?.predictor || ''),
      String(relation?.outcome || ''),
      String(relation?.summary || ''),
      ...(Array.isArray(relation?.keywords) ? relation.keywords.map((k) => String(k || '')) : []),
    ]
      .join(' ')
      .trim();
    if (!text) continue;
    samples.push({
      id: `glm-${nextId++}`,
      source: 'glm_relation',
      text,
      meta: { relationId },
    });
  }

  return samples;
}

function clusterCardAlignment(samples, assignments, k, profiles) {
  const cardIds = Object.keys(profiles);
  const perCluster = Array.from({ length: k }, () => ({
    total: 0,
    byCard: new Map(),
    bySource: new Map(),
    topCard: '',
    topCardCount: 0,
    purity: 0,
  }));

  for (let i = 0; i < samples.length; i += 1) {
    const cluster = assignments[i];
    const sample = samples[i];
    const bucket = perCluster[cluster];
    bucket.total += 1;
    bucket.bySource.set(sample.source, (bucket.bySource.get(sample.source) || 0) + 1);

    let bestCard = '';
    let bestScore = 0;
    for (const cardId of cardIds) {
      const score = scoreSampleForCard(sample.text, profiles[cardId]);
      if (score > bestScore) {
        bestScore = score;
        bestCard = cardId;
      }
    }
    if (bestCard) {
      bucket.byCard.set(bestCard, (bucket.byCard.get(bestCard) || 0) + 1);
    }
  }

  const dominantCardSet = new Set();
  const rows = perCluster.map((bucket, clusterId) => {
    const topCardRow = Array.from(bucket.byCard.entries()).sort((a, b) => b[1] - a[1])[0] || null;
    const topCard = topCardRow?.[0] || '';
    const topCardCount = Number(topCardRow?.[1] || 0);
    const purity = bucket.total === 0 ? 0 : topCardCount / bucket.total;
    if (topCard) dominantCardSet.add(topCard);
    const sourceMix = Array.from(bucket.bySource.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([source, count]) => `${source}:${count}`);
    return {
      clusterId,
      size: bucket.total,
      topCard,
      topCardCount,
      purity: Number(purity.toFixed(3)),
      sourceMix,
    };
  });

  const weightedPurity =
    rows.reduce((sum, row) => sum + row.size * row.purity, 0) /
    Math.max(1, rows.reduce((sum, row) => sum + row.size, 0));

  const emptyClusters = rows.filter((row) => row.size === 0).length;

  return {
    weightedPurity: Number(weightedPurity.toFixed(4)),
    dominantCardCount: dominantCardSet.size,
    emptyClusters,
    clusterRowsTop: rows
      .sort((a, b) => {
        if (b.size !== a.size) return b.size - a.size;
        return a.clusterId - b.clusterId;
      })
      .slice(0, 12),
  };
}

function selectBestByCriterion(rows) {
  const sorted = [...rows].sort((a, b) => {
    if (b.objective !== a.objective) return b.objective - a.objective;
    if (b.silhouetteProxy !== a.silhouetteProxy) return b.silhouetteProxy - a.silhouetteProxy;
    if (a.kDistanceTo26 !== b.kDistanceTo26) return a.kDistanceTo26 - b.kDistanceTo26;
    return a.k - b.k;
  });
  return sorted[0] || null;
}

function selectBestByParsimonious(rows, penalty) {
  const sorted = [...rows].sort((a, b) => {
    const scoreA = a.objective - penalty * a.k;
    const scoreB = b.objective - penalty * b.k;
    if (scoreB !== scoreA) return scoreB - scoreA;
    if (b.objective !== a.objective) return b.objective - a.objective;
    return a.k - b.k;
  });
  return sorted[0] || null;
}

async function main() {
  const [guideText, data2Raw, claimsRaw, glmRaw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(DATA2_INDEX_PATH, 'utf8'),
    fs.readFile(CLAIMS_JSONL_PATH, 'utf8'),
    fs.readFile(GLM_RELATIONS_PATH, 'utf8'),
  ]);

  const profilesSource = extractObjectSource(guideText, 'const CARD_MINING_PROFILES');
  if (!profilesSource) throw new Error('CARD_MINING_PROFILES not found in guide.tsx');
  const profiles = new Function(`return (${profilesSource});`)();

  const data2 = JSON.parse(data2Raw);
  const claims = parseJsonl(claimsRaw);
  const glmRelations = JSON.parse(glmRaw);

  const rawSamples = buildSamples(data2, claims, glmRelations);
  if (rawSamples.length < Math.max(120, K_MAX * 3)) {
    throw new Error(`Insufficient samples for clustering: ${rawSamples.length}`);
  }

  const { dfByTermId, vocab, tokenized } = buildVocabulary(rawSamples);
  const vectorized = vectorizeSamples(rawSamples, dfByTermId, vocab, tokenized);
  const samples = vectorized.samples;
  const vectors = vectorized.vectors;
  if (vectors.length < Math.max(120, K_MAX * 3)) {
    throw new Error(`Insufficient vectorized samples: ${vectors.length}`);
  }

  const kRows = [];
  for (let k = K_MIN; k <= K_MAX; k += 1) {
    const km = runKMeans(vectors, k, RESTARTS, MAX_ITERS, BASE_SEED + 97 * k);
    const silhouetteProxy = computeSilhouetteProxy(
      vectors,
      km.assignments,
      km.centers,
      SAMPLE_MAX_SILHOUETTE,
      BASE_SEED + 211 * k,
    );
    const alignment = clusterCardAlignment(samples, km.assignments, k, profiles);
    const avgClusterSize = vectors.length / k;
    const objectiveRaw =
      silhouetteProxy * 1.2 +
      alignment.weightedPurity * 0.55 -
      km.sse / Math.max(1, vectors.length) * 0.15 -
      Math.abs(avgClusterSize - 90) * 0.0006;
    const objective = Number(objectiveRaw.toFixed(5));
    kRows.push({
      k,
      sse: km.sse,
      ssePerSample: Number((km.sse / vectors.length).toFixed(6)),
      silhouetteProxy,
      weightedPurity: alignment.weightedPurity,
      dominantCardCount: alignment.dominantCardCount,
      emptyClusters: alignment.emptyClusters,
      objective,
      kDistanceTo26: Math.abs(k - 26),
      clusterRowsTop: alignment.clusterRowsTop,
    });
  }

  const best = selectBestByCriterion(kRows);
  const bestParsimonious = selectBestByParsimonious(kRows, COMPLEXITY_PENALTY);
  const row26 = kRows.find((row) => row.k === 26) || null;
  const topCandidates = [...kRows]
    .sort((a, b) => {
      if (b.objective !== a.objective) return b.objective - a.objective;
      if (b.silhouetteProxy !== a.silhouetteProxy) return b.silhouetteProxy - a.silhouetteProxy;
      return a.k - b.k;
    })
    .slice(0, 8)
    .map((row) => ({
      k: row.k,
      objective: row.objective,
      silhouetteProxy: row.silhouetteProxy,
      weightedPurity: row.weightedPurity,
      dominantCardCount: row.dominantCardCount,
      ssePerSample: row.ssePerSample,
    }));

  const withinBand = kRows
    .filter((row) => row.k >= 24 && row.k <= 28)
    .sort((a, b) => b.objective - a.objective)
    .map((row) => ({
      k: row.k,
      objective: row.objective,
      silhouetteProxy: row.silhouetteProxy,
      weightedPurity: row.weightedPurity,
      dominantCardCount: row.dominantCardCount,
    }));

  const objectiveGap26 =
    best && row26 ? Number((best.objective - row26.objective).toFixed(5)) : null;
  const nearOptimal26 =
    best && row26 ? Number((row26.objective / Math.max(1e-9, best.objective)).toFixed(4)) : null;

  const kOptimalAt26 = Boolean(best && best.k === 26);
  const kNear26 = Boolean(best && Math.abs(best.k - 26) <= 1);
  const parsimoniousKIs26 = Boolean(bestParsimonious && bestParsimonious.k === 26);
  const nearOptimalPass = nearOptimal26 !== null && nearOptimal26 >= 0.98;
  const robustness = Boolean((kOptimalAt26 && nearOptimalPass) || (kNear26 && nearOptimalPass));
  const requiredPenaltyFor26 =
    best && row26 && best.k > 26 && best.objective > row26.objective
      ? Number(((best.objective - row26.objective) / (best.k - 26)).toFixed(5))
      : 0;

  let interpretation = '26は実用上有効だが、固定前提を外すと別kが優位。再設計余地あり。';
  if (kOptimalAt26 && nearOptimalPass) {
    interpretation = '26は固定前提を外しても最適帯にあり、カード数として頑強。';
  } else if (kNear26 && nearOptimalPass) {
    interpretation = '最適は26近傍で、26はほぼ同等。カード数は概ね頑強。';
  } else if (parsimoniousKIs26) {
    interpretation =
      '高kは説明力で優位だが、複雑度を織り込むと26が最適。実運用上は26維持が妥当。';
  }

  const result = {
    generatedAt: new Date().toISOString(),
    config: {
      kMin: K_MIN,
      kMax: K_MAX,
      restarts: RESTARTS,
      maxIters: MAX_ITERS,
      maxClaims: SAMPLE_MAX_CLAIMS,
      minTokenDf: MIN_TOKEN_DF,
      featureMaxPerDoc: FEATURE_MAX_PER_DOC,
    },
    sampleSnapshot: {
      rawSamples: rawSamples.length,
      vectorizedSamples: vectors.length,
      sourceCounts: samples.reduce((acc, row) => {
        acc[row.source] = (acc[row.source] || 0) + 1;
        return acc;
      }, {}),
      vocabSize: vocab.size,
    },
    bestK: best
      ? {
          k: best.k,
          objective: best.objective,
          silhouetteProxy: best.silhouetteProxy,
          weightedPurity: best.weightedPurity,
          dominantCardCount: best.dominantCardCount,
          ssePerSample: best.ssePerSample,
        }
      : null,
    bestParsimoniousK: bestParsimonious
      ? {
          k: bestParsimonious.k,
          objective: bestParsimonious.objective,
          parsimonyObjective: Number(
            (bestParsimonious.objective - COMPLEXITY_PENALTY * bestParsimonious.k).toFixed(5),
          ),
          silhouetteProxy: bestParsimonious.silhouetteProxy,
          weightedPurity: bestParsimonious.weightedPurity,
          dominantCardCount: bestParsimonious.dominantCardCount,
        }
      : null,
    k26: row26
      ? {
          objective: row26.objective,
          silhouetteProxy: row26.silhouetteProxy,
          weightedPurity: row26.weightedPurity,
          dominantCardCount: row26.dominantCardCount,
          ssePerSample: row26.ssePerSample,
        }
      : null,
    comparison: {
      objectiveGap26,
      nearOptimal26,
      bestKIs26: kOptimalAt26,
      bestKNear26: kNear26,
      bestParsimoniousKIs26: parsimoniousKIs26,
      configuredComplexityPenalty: COMPLEXITY_PENALTY,
      requiredPenaltyFor26OverBestK: requiredPenaltyFor26,
      robustAt26: Boolean(robustness),
      cardBoundarySignalAt26: row26
        ? {
            dominantCardCount: row26.dominantCardCount,
            weightedPurity: row26.weightedPurity,
            note: 'これはカード境界の分離度指標であり、k最適性とは別軸。',
          }
        : null,
      interpretation,
    },
    topCandidates,
    around26Band: withinBand,
    clusterPreviewAt26: row26 ? row26.clusterRowsTop : [],
  };

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
