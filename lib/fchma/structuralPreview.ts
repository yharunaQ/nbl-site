import {
  buildFchmaIntakeDraftPreview,
  type FchmaIntakeDraftPayload,
  type FchmaNarrativeUnitPreview,
} from '@/lib/fchma/intakeDraft';

export type FchmaStructureElementPreview = {
  id: string;
  label: string;
  elementGroup:
    | 'body_functions_structures'
    | 'activities'
    | 'participation'
    | 'environmental_factors'
    | 'personal_factors'
    | 'health_condition'
    | 'support_resources'
    | 'work_design';
  polarity: 'burden' | 'protection' | 'neutral';
  evidenceSource: string;
};

export type FchmaStructureRelationPreview = {
  id: string;
  sourceElementId: string;
  targetElementId: string;
  relationType:
    | 'facilitates'
    | 'inhibits'
    | 'mediates'
    | 'amplifies'
    | 'compensates';
  rationale: string;
};

export type FchmaStructuralHypothesisPreview = {
  label: string;
  rationale: string;
  interventionPoints: string[];
};

export type FchmaStructurePreview = {
  elements: FchmaStructureElementPreview[];
  relations: FchmaStructureRelationPreview[];
  hypotheses: FchmaStructuralHypothesisPreview[];
};

function containsAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle));
}

function buildElementId(prefix: string, index: number): string {
  return `${prefix}_${index + 1}`;
}

function compactNarrative(units: FchmaNarrativeUnitPreview[], sourceFieldKey: string): string {
  return units
    .filter((unit) => unit.sourceFieldKey === sourceFieldKey)
    .map((unit) => unit.rawText)
    .join('\n');
}

export function buildFchmaStructurePreview(
  payload: FchmaIntakeDraftPayload,
): FchmaStructurePreview {
  const draft = buildFchmaIntakeDraftPreview(payload);
  const elements: FchmaStructureElementPreview[] = [];
  const relations: FchmaStructureRelationPreview[] = [];
  const hypotheses: FchmaStructuralHypothesisPreview[] = [];

  draft.healthConditions.forEach((condition, index) => {
    elements.push({
      id: buildElementId('health_condition', index),
      label: condition.rawLabel,
      elementGroup: 'health_condition',
      polarity: 'neutral',
      evidenceSource: 'healthCondition',
    });
  });

  const difficultyText = compactNarrative(draft.narrativeUnits, 'difficulty');
  if (difficultyText) {
    elements.push({
      id: 'activities_1',
      label: '仕事・活動上の困難',
      elementGroup: 'activities',
      polarity: 'burden',
      evidenceSource: 'difficulty',
    });
  }

  const workStatusText = compactNarrative(draft.narrativeUnits, 'workStatus');
  if (workStatusText) {
    elements.push({
      id: 'participation_1',
      label: '就労参加の現状',
      elementGroup: 'participation',
      polarity: 'neutral',
      evidenceSource: 'workStatus',
    });

    elements.push({
      id: 'work_design_1',
      label: '仕事内容・勤務条件',
      elementGroup: 'work_design',
      polarity: 'neutral',
      evidenceSource: 'workStatus',
    });
  }

  const supportText = compactNarrative(draft.narrativeUnits, 'supportAndAccommodation');
  if (supportText) {
    const supportPolarity = containsAny(supportText, ['未整備', '不足', 'なし', '難しい'])
      ? 'burden'
      : 'protection';

    elements.push({
      id: 'environment_1',
      label: '職場配慮・環境条件',
      elementGroup: 'environmental_factors',
      polarity: supportPolarity,
      evidenceSource: 'supportAndAccommodation',
    });

    elements.push({
      id: 'support_resource_1',
      label: '支援資源の利用可能性',
      elementGroup: 'support_resources',
      polarity: supportPolarity === 'protection' ? 'protection' : 'neutral',
      evidenceSource: 'supportAndAccommodation',
    });
  }

  const disclosureText = compactNarrative(draft.narrativeUnits, 'disclosure');
  if (disclosureText) {
    elements.push({
      id: 'environment_2',
      label: '説明・開示の職場文脈',
      elementGroup: 'environmental_factors',
      polarity: containsAny(disclosureText, ['未説明', '隠', '言えていない']) ? 'burden' : 'neutral',
      evidenceSource: 'disclosure',
    });
  }

  const futureText = compactNarrative(draft.narrativeUnits, 'futureOutlook');
  if (futureText) {
    let polarity: 'burden' | 'protection' | 'neutral' = 'neutral';
    if (containsAny(futureText, ['不安', '迷い', '難しい'])) {
      polarity = 'burden';
    }
    if (containsAny(futureText, ['続けたい', '希望', 'やりたい'])) {
      polarity = polarity === 'burden' ? 'neutral' : 'protection';
    }

    elements.push({
      id: 'personal_1',
      label: '本人の見通し・自己効力感',
      elementGroup: 'personal_factors',
      polarity,
      evidenceSource: 'futureOutlook',
    });
  }

  const healthElementIds = elements
    .filter((element) => element.elementGroup === 'health_condition')
    .map((element) => element.id);
  const activities = elements.find((element) => element.elementGroup === 'activities');
  const participation = elements.find((element) => element.elementGroup === 'participation');
  const environmentBurden = elements.find(
    (element) =>
      element.elementGroup === 'environmental_factors' && element.polarity !== 'protection',
  );
  const environmentProtection = elements.find(
    (element) =>
      element.elementGroup === 'environmental_factors' && element.polarity === 'protection',
  );
  const personal = elements.find((element) => element.elementGroup === 'personal_factors');

  healthElementIds.forEach((elementId, index) => {
    if (activities) {
      relations.push({
        id: `relation_health_to_activity_${index + 1}`,
        sourceElementId: elementId,
        targetElementId: activities.id,
        relationType: 'amplifies',
        rationale: '健康状態や症状が活動遂行上の困難を増幅しうる。',
      });
    }
  });

  if (activities && participation) {
    relations.push({
      id: 'relation_activity_to_participation',
      sourceElementId: activities.id,
      targetElementId: participation.id,
      relationType: 'inhibits',
      rationale: '活動上の困難が就労参加の安定を阻害しうる。',
    });
  }

  if (environmentBurden && participation) {
    relations.push({
      id: 'relation_environment_burden_to_participation',
      sourceElementId: environmentBurden.id,
      targetElementId: participation.id,
      relationType: 'amplifies',
      rationale: '環境条件や配慮ギャップが参加上の負荷を増幅しうる。',
    });
  }

  if (environmentProtection && participation) {
    relations.push({
      id: 'relation_environment_protection_to_participation',
      sourceElementId: environmentProtection.id,
      targetElementId: participation.id,
      relationType: 'compensates',
      rationale: '配慮や環境調整が参加の不安定さを補償しうる。',
    });
  }

  if (personal && participation) {
    relations.push({
      id: 'relation_personal_to_participation',
      sourceElementId: personal.id,
      targetElementId: participation.id,
      relationType: personal.polarity === 'burden' ? 'amplifies' : 'compensates',
      rationale:
        personal.polarity === 'burden'
          ? '不安や見通しの弱さが就労参加の不安定さを増幅しうる。'
          : '希望や働きたい意図が就労継続を下支えしうる。',
    });
  }

  if (activities && participation) {
    hypotheses.push({
      label: 'activity_participation_stability',
      rationale:
        '活動上の困難が就労参加の安定に直接影響しており、仕事内容や勤務条件の再設計が介入点になる。',
      interventionPoints: ['仕事内容の切り出し', '勤務条件の調整', '負荷の高い場面の再設計'],
    });
  }

  if (environmentBurden) {
    hypotheses.push({
      label: 'accommodation_gap_amplification',
      rationale:
        '必要な配慮が不足しているため、困難が個人側へ押し戻されている可能性が高い。',
      interventionPoints: ['必要配慮の言語化', '上司との調整', '職場内支援者の設定'],
    });
  }

  if (personal?.polarity === 'burden') {
    hypotheses.push({
      label: 'future_outlook_fragility',
      rationale:
        '不安や悪化見通しが自己効力感を弱めており、支援の優先順位付けと安心の再構築が必要。',
      interventionPoints: ['短期目標の再設定', '相談先の明確化', '悪化時の対応ルート設計'],
    });
  }

  return { elements, relations, hypotheses };
}
