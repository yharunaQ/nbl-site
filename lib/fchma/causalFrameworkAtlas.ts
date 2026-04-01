import atlasJson from '@/data/specs/canonical-maps/fchma-causal-framework-atlas-v0.json';

export type FchmaCausalFrameworkAtlas = {
  version: string;
  generated_at: string;
  positioning: {
    role: string;
    note: string;
  };
  layers: Array<{
    id: string;
    label: string;
    description: string;
  }>;
  domains: Array<{
    id: string;
    label: string;
    primary_layer: string;
    node_pattern: string[];
    question_seed: string;
    intervention_ports: string[];
  }>;
  motifs: Array<{
    id: string;
    label: string;
    relation_pattern: string[];
    summary: string;
  }>;
  framework_count: number;
  frameworks: Array<{
    framework_id: string;
    title: string;
    primary_layer: string;
    domain_id: string;
    motif_id: string;
    summary: string;
    node_pattern: string[];
    relation_pattern: string[];
    core_question: string;
    interpretation_focus: string[];
    typical_intervention_ports: string[];
    view_cut_keys: string[];
  }>;
  cut_principles: string[];
};

export const fchmaCausalFrameworkAtlas =
  atlasJson as FchmaCausalFrameworkAtlas;

export function listFchmaCausalFrameworks() {
  return fchmaCausalFrameworkAtlas.frameworks;
}
