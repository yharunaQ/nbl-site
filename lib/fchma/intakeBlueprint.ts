import {
  getResponseTypeMap,
  listCaseStructureSources,
  respondentCanonicalConceptMap,
} from '@/lib/fchma/sourceSpecs';

export type FchmaIntakeSection = {
  id: string;
  title: string;
  description: string;
  canonicalConcepts: string[];
  sourceDatasets: string[];
  suggestedFields: Array<{
    datasetId: string;
    rawName: string;
    displayName: string;
    responseType: string;
  }>;
};

export type FchmaIntakeBlueprint = {
  version: string;
  sections: FchmaIntakeSection[];
  availableDatasets: Array<{
    datasetId: string;
    label: string;
    freeTextColumns: string[];
  }>;
};

const intakeSectionDefinitions: Array<{
  id: string;
  title: string;
  description: string;
  conceptIds: string[];
}> = [
  {
    id: 'respondent_profile',
    title: '基本プロフィール',
    description: '年齢、性別、地域、属性など、ケースの前提条件を確認する。',
    conceptIds: ['respondent_profile'],
  },
  {
    id: 'health_condition',
    title: '健康状態・障害/疾病',
    description: '病名・障害名・制度区分と、ICD正規化の起点になる情報を扱う。',
    conceptIds: ['health_condition'],
  },
  {
    id: 'work_status',
    title: '就労状況・仕事内容',
    description: '現在の就労状態、仕事内容、働き方の条件を押さえる。',
    conceptIds: ['work_status'],
  },
  {
    id: 'difficulty',
    title: '活動・参加の困難',
    description: '就職前、就職後、仕事・社会参加上の困難を構造化する。',
    conceptIds: ['activity_and_participation_difficulty'],
  },
  {
    id: 'support_and_accommodation',
    title: '配慮・支援・環境調整',
    description: '既存の支援、必要な支援、配慮ギャップを把握する。',
    conceptIds: ['accommodation_and_support'],
  },
  {
    id: 'disclosure',
    title: '説明・開示',
    description: '病気や障害の説明、開示/非開示の状態や困難を確認する。',
    conceptIds: ['disclosure_and_explanation'],
  },
  {
    id: 'future_outlook',
    title: '希望・見通し・自己効力感',
    description: '今後の希望、働ける感覚、生活の見通しを捉える。',
    conceptIds: ['self_efficacy_and_future_outlook'],
  },
  {
    id: 'narratives',
    title: '自由記述・面談ナラティブ',
    description: '文脈的意味連鎖の起点になる自由記述を保持する。',
    conceptIds: ['narrative_units'],
  },
];

function inferDatasetLabel(datasetId: string): string {
  if (datasetId === 'employment_survey_3000') return '障害・疾病 就労調査';
  if (datasetId === 'nanbyo_survey_4000') return '難病患者調査';
  return datasetId;
}

export function buildFchmaIntakeBlueprint(): FchmaIntakeBlueprint {
  const availableDatasets = listCaseStructureSources().map((manifest) => ({
    datasetId: manifest.dataset_id,
    label: inferDatasetLabel(manifest.dataset_id),
    freeTextColumns: manifest.free_text_columns ?? [],
  }));

  const sections = intakeSectionDefinitions.map<FchmaIntakeSection>((definition) => {
    const concepts = respondentCanonicalConceptMap.canonical_concepts.filter((concept) =>
      definition.conceptIds.includes(concept.concept_id),
    );

    const sourceDatasets = Array.from(
      new Set(concepts.flatMap((concept) => Object.keys(concept.source_fields))),
    );

    const suggestedFields = concepts.flatMap((concept) =>
      sourceDatasets.flatMap((datasetId) => {
        const responseTypeMap = getResponseTypeMap(datasetId);
        const sourceFields = concept.source_fields[datasetId] ?? [];

        return sourceFields
          .filter((fieldName) => !fieldName.includes('*'))
          .flatMap((fieldName) => {
            const variable = responseTypeMap?.variables.find((item) => item.raw_name === fieldName);

            if (!variable) {
              return [];
            }

            return {
              datasetId,
              rawName: variable.raw_name,
              displayName: variable.display_name,
              responseType: variable.response_type_guess,
            };
          });
      }),
    );

    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      canonicalConcepts: concepts.map((concept) => concept.concept_id),
      sourceDatasets,
      suggestedFields,
    };
  });

  return {
    version: 'v0',
    sections,
    availableDatasets,
  };
}
