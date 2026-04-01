import type { TagGroupKey } from '@/lib/jac/tagTaxonomy';

export type TagSelection = Record<TagGroupKey, string[]>;

export const STEP2_ROLE_TITLE = '見落とし防止の入口';
export const STEP2_ROLE_DETAIL =
  'Step 2 は、最初の相談文だけでは抜けやすい重要論点を、粗く網羅的に確認する段階です。ここでは結論まで決めず、見立てが変わる大きな条件を拾います。';

export const STEP2_HANDOFF_NOTE =
  '細かな条件差、運用設計、情報共有範囲、支援連携の具体設計は Step 3 以降で確認します。';

export const STEP3_ROLE_TITLE = '見立てに必要な条件確認';
export const STEP3_ROLE_DETAIL =
  'Step 3 は、Step 2 で拾った粗い論点を前提に、見立てや個別調整を変える条件差だけをインテリジェントに確認する段階です。タグの再確認ではなく、仮説の鑑別と条件の具体化を行います。';

export const STEP3_CONFIRMATION_NOTE =
  'Step 3 ではタグを結論扱いせず、場面、頻度、時間帯、運用責任、既に試した工夫など、判断が変わる条件だけを深掘りします。';

export const STEP_CONTRACT_PRINCIPLES = [
  'Step 2 は、相談文の見落としを減らすための粗い入口である。',
  'Step 2 のタグは結論ではなく、追加質問の分岐を作るための補助線である。',
  'Step 3 は、タグそのものを再確認する場ではなく、見立てや個別調整を変える条件差を確認する場である。',
  '情報開示境界、地域支援運用、制度詳細、Step 4 の根拠表示ルールは、原則として Step 2 のタグに入れず、Step 3 以降で扱う。',
];

export function buildStepContractPromptGuidance(): string {
  return [
    '- selected_tags は Step 2 の粗い入口情報であり、確定診断や確定結論として扱わない。',
    '- selected_tags の役割は、相談文だけでは抜けやすい重要論点の見落とし防止である。',
    '- Step 3 では、タグそのものをなぞるのではなく、場面・頻度・時間帯・運用条件・既試行の工夫など、見立てが変わる条件差だけを確認する。',
    '- 情報開示境界、ケース会議運用、法域詳細、Step 4 の根拠表示ルールのような細部は、タグでなく Step 3 以降の確認対象として扱う。',
  ].join('\n');
}

export function buildSelectedTagContractSummary(selectedTags: TagSelection) {
  const selectedEntries = (Object.entries(selectedTags) as [TagGroupKey, string[]][])
    .filter(([, tags]) => Array.isArray(tags) && tags.length > 0)
    .map(([group, tags]) => ({
      group,
      tags,
    }));

  return {
    selected_tag_count: selectedEntries.reduce((sum, item) => sum + item.tags.length, 0),
    selected_tag_groups: selectedEntries,
    step2_role: STEP2_ROLE_DETAIL,
    step2_handoff_note: STEP2_HANDOFF_NOTE,
    step3_role: STEP3_ROLE_DETAIL,
    step3_confirmation_note: STEP3_CONFIRMATION_NOTE,
    principles: STEP_CONTRACT_PRINCIPLES,
  };
}
