export const STEP4_REFERENCE_POSITIONING_TITLE = '実践の参考資料';

export const STEP4_REFERENCE_POSITIONING_SUMMARY =
  'Step 4 の参考資料は、合意文書に書いた合理的配慮や支援を、実際にどう実施するか具体化するために参照します。';

export const STEP4_REFERENCE_POSITIONING_DETAIL =
  '直接根拠ではなく、合意した合理的配慮や支援について、どの場面で何を確認し、どう試し、どう見直すかを具体化する実践資料です。';

export const STEP4_REFERENCE_SOURCE_NOTE =
  'web-cache 由来の類似事例・雇用ガイダンスは、合意文書に書いた合理的配慮や支援の実施方法を具体化する実践資料として参照しました。';

export const STEP4_REFERENCE_PROMPT_RULES = [
  'Step 4 の参考資料は、最終合意文書に書いた合理的配慮や支援を実施するための実践資料として扱う。',
  '参考資料は、直接根拠ではなく、実施前の確認事項、試行の組み立て、導入後の見直しポイントを具体化するために使う。',
  '類似事例を出すときは、診断名や障害名の一般論ではなく、今回の個別調整に近い実施場面と具体策を優先する。',
  '海外情報を使うときは、日本の制度へそのまま当てはめず、本人・業務・職場条件を確認した上で、実施のヒントとして扱う。',
  '参考資料は、合意文書の文面を支えるというより、合意した合理的配慮や支援を現場でどう動かすかを補うものとして使う。',
];

export function buildStep4ReferencePromptGuidance(): string {
  return ['Step 4 参考資料の位置付け:', ...STEP4_REFERENCE_PROMPT_RULES.map((rule) => `- ${rule}`)].join(
    '\n',
  );
}
