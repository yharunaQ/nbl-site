import { readFile } from 'node:fs/promises';
import path from 'node:path';

export type FchmaRespondentManifoldSummary = {
  generated_at: string;
  subject_count: number;
  cluster_count: number;
  pattern_count: number;
  datasets: string[];
  joint_feature_count: number;
  pattern_levels: string[];
  pattern_keys: string[];
};

export type FchmaRespondentManifoldPattern = {
  pattern_key: string;
  cluster_id: string;
  cluster_subject_count: number;
  dataset_mix: Record<string, number>;
  dominant_keyword_groups: string[];
  keyword_counts: Record<string, number>;
  top_labels_by_concept: Record<string, string[]>;
  causal_framework: {
    summary: string;
    chain: string[];
    amplifiers: string[];
    protectors: string[];
    intervention_ports: string[];
  };
  representative_narratives: Array<{
    dataset_id: string;
    respondent_id: string;
    canonical_concept: string;
    unit_text: string;
  }>;
  prevalence_rows: Array<{
    canonical_concept: string;
    label_text: string;
    cluster_subject_count: number;
    cluster_ratio: number;
    global_ratio: number;
    lift: number;
  }>;
  notes: string[];
};

type FchmaRespondentPatternPayload = {
  summary: FchmaRespondentManifoldSummary;
  patterns: FchmaRespondentManifoldPattern[];
};

function patternLibraryPath(filename: string): string {
  return path.join(
    process.cwd(),
    'data',
    'analysis_ready',
    'pattern_library',
    'respondents',
    'v0',
    filename,
  );
}

async function readPatternPayload(): Promise<FchmaRespondentPatternPayload> {
  const raw = await readFile(patternLibraryPath('respondent_manifold_patterns.json'), 'utf-8');
  return JSON.parse(raw) as FchmaRespondentPatternPayload;
}

export async function getFchmaRespondentManifoldSummary(): Promise<FchmaRespondentManifoldSummary | null> {
  try {
    const payload = await readPatternPayload();
    return payload.summary;
  } catch {
    return null;
  }
}

export async function listFchmaRespondentManifoldPatterns(): Promise<FchmaRespondentManifoldPattern[]> {
  try {
    const payload = await readPatternPayload();
    return payload.patterns;
  } catch {
    return [];
  }
}
