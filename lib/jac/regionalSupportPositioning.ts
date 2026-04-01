export const REGIONAL_SUPPORT_POSITIONING_TITLE = '支援連携を考える文脈';

export const REGIONAL_SUPPORT_POSITIONING_SUMMARY =
  '本人と職場のあいだで起きている課題を、地域支援がどう支えられるか考えるための文脈です。';

export const REGIONAL_SUPPORT_POSITIONING_DETAIL =
  '地域支援は職業的課題そのものの直接解決ではなく、本人と職場の個別調整の設計・実施・継続・再評価を支えるために参照します。';

export const REGIONAL_SUPPORT_POSITIONING_SOURCE_NOTE =
  '地域支援カタログは、本人と職場の個別調整を支える支援連携の文脈として参照しました。';

export const REGIONAL_SUPPORT_EVIDENCE_ROLE_LABEL = '支援連携の文脈';

export const REGIONAL_SUPPORT_EVIDENCE_DESCRIPTION =
  '本人と職場の個別調整を、地域支援がどう支えられるか考えるための知識です。直接根拠ではなく、支援連携の要否や役割分担を判断するために使います。';

export const REGIONAL_SUPPORT_FOLLOWUP_NOTE =
  '追加確認には、職場での個別調整を地域支援がどう支えられるかを見る観点も含めています。';

export const REGIONAL_SUPPORT_PROMPT_RULES = [
  'まず本人と職場の関係の中で生じている職業的課題と、必要な個別調整を整理する。',
  '地域支援は職業的課題そのものの直接解決手段ではなく、個別調整の設計・実施・継続・再評価を支える支援連携として扱う。',
  '地域支援に触れるときは、必ず「何の個別調整を」「どの場面で」支えるのかを結びつける。',
  '職場内で完結できる個別調整が主論点なら、地域支援を過剰に前面化しない。',
  '企業単独での調整が難しい、継続支援や再評価が必要、または制度・生活支援との接続が必要なときに地域支援を検討する。',
];

export const REGIONAL_SUPPORT_EXAMPLE_NOTE =
  '地域支援は、本人と職場の個別調整の設計・実施・継続・再評価を支える支援連携として使う。';

export function buildRegionalSupportPromptGuidance(): string {
  return ['地域支援の位置付け:', ...REGIONAL_SUPPORT_PROMPT_RULES.map((rule) => `- ${rule}`)].join(
    '\n',
  );
}

export function buildRegionalSupportSuggestionReason(
  issueTitle: string,
  supportTitle: string,
): string {
  return `職業的課題「${issueTitle}」に対する本人と職場の個別調整を支える支援連携として、${supportTitle} を検討できます。`;
}
