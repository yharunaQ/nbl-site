export const MATERIALS_EDITION = 'NBL資料集・暫定閲覧版';
export const MATERIALS_UPDATED = '2026-11-09';
export const RESEARCH_ABSTRACT_COUNT = 140;
export const materialCatalog = [
  {
    slug: 'research',
    number: '01',
    label: '根拠を確かめる',
    title: '研究抄録集',
    count: `${RESEARCH_ABSTRACT_COUNT}件の抄録＋横断解説`,
    readerEdition: '閲覧版 v14',
    readerUpdated: '2026-11-12',
    edition: '140論証・仕事と支援が次の機会をつくる（2026-11-12）',
    audience: '論証と反証を検討したい方へ',
    description:
      'どの条件で、何が言えるのか。膨大な情報をICFとフロンティアAIで吟味し、重なる問いを整理した論証・抄録を読む。',
    decision: '提案の根拠、別の説明、判断を変える条件を確かめる。',
    start: '巻頭で、どの作業で止まったかを調べ、職場の担当や制度を変える条件までたどれます。個別抄録から根拠と見直し方に戻れます。',
    example: 'reading-guide',
    exampleLabel: '働く機会はどのように生まれ、続くのか',
    scope:
      '140件の個別論証を収録しています。調査の再分析、比較、実装・政策の仮説など、各論証で根拠の種類と反証を示します。巻頭の横断解説は件数の外に置き、版ごとの本文は資料案内から確認できます。',
  },
  {
    slug: 'work-design',
    number: '02',
    label: '職場を変える',
    title: '企業向け仕事設計ガイド2.0',
    count: '10テーマ',
    readerEdition: '閲覧版 v3',
    readerUpdated: '2026-11-12',
    edition: '2.0 開発版からの閲覧版',
    audience: '企業の人事・現場責任者と支援者へ',
    description:
      '相談、仕事の分担、勤務、専門助言、評価。個別の工夫を、必要な時に使える職場の仕組みへつなぐ。',
    decision: '何を変え、誰が決め、試した後に何を見直すかを決める。',
    start: '「時間・仕事量・体調変動」から、勤務短縮だけでは解けない条件を比べる。',
    example: 'WDG2-04',
    exampleLabel: '時間を短くする時、仕事量と締切も変えられるか',
    scope:
      '条件に応じて話し合うためのガイドです。現在の公開ガイド（5領域・10論点・37項目）とは別の版です。個別の適合性や支援効果を認定するものではありません。',
  },
  {
    slug: 'support',
    number: '03',
    label: '支援を届ける',
    title: '支援機関チェックリスト',
    count: '8テーマ',
    readerEdition: '閲覧版 v3',
    readerUpdated: '2026-11-12',
    edition: '支援内容と機関体制の点検・閲覧版 v3',
    audience: '就労支援の担当者と管理者へ',
    description:
      '支援者が実施していることと、それを支える方針・担当・勤務時間・連携を、一緒に点検する。',
    decision: '担当者の努力で補う前に、管理者や連携先が整える条件を選ぶ。',
    start: '「実際の仕事で確かめる」で、支援の実施と機関が用意する条件を並べて読む。',
    example: 'work',
    exampleLabel: '実践したい支援に、担当と時間があるか',
    scope:
      '調査を参照して作った編集上の問いです。採点・格付け・技能試験や、効果が検証された尺度ではありません。個人情報の入力・送信は必要ありません。',
  },
  {
    slug: 'textbook',
    number: '04',
    label: '学ぶ・教える',
    title: '働く条件をつくり直す',
    count: '本編13章・実践詳論',
    readerEdition: '閲覧版 v12',
    readerUpdated: '2026-11-12',
    edition: '教科書 本編v52・実践詳論v3（2026-11-12）',
    audience: '支援を学ぶ人、企業・医療・福祉・行政の実務者へ',
    description:
      '可能性を組合せで作る。責任と資源をそろえる。変化しても支援をつなぐ。三つの原理から、仕事づくりと次の判断を具体例で学ぶ。',
    decision: '次の相談で、何を確かめ、自分は何を担い、誰へ渡すかを選ぶ。',
    start: '読書案内のRさんの相談から、仕事の候補、職場の変更、支援の開始、実施後の見直しへ進めます。',
    example: '1',
    exampleLabel: '訓練以外に、支援で何を変えられるか',
    scope:
      '架空の相談を使って就労支援を学ぶ教材です。個別の医学・法律・就業判断は、その権限を持つ担当者が行います。',
  },
  {
    slug: 'policy',
    number: '05',
    label: '制度と資源を考える',
    title: '働く機会と支援の再設計',
    count: '本編12章・技術別冊',
    readerEdition: '閲覧版 v12',
    readerUpdated: '2026-11-12',
    edition: '総合政策提言 本編v21・技術別冊v5（2026-11-12）',
    audience: '国・自治体、企業・提供組織、本人・関係団体へ',
    description:
      '国内の審議を手掛かりに、採用前から必要な支援を使い、職場が変わっても引き継げる制度を提案する。',
    decision: 'どの改革案を採り、誰が何を負担し、どんな条件で別案へ変えるかを判断する。',
    start: '第1章で日本の制度が途切れる理由、第2章で諸外国の経験、第3章で日本の制度案の比較を読みます。',
    example: 'overview',
    exampleLabel: '政策判断の要点と読み方',
    scope:
      'NBLによる制度改正の提案です。工程や負担率は提案値、数量例は比較のための仮定です。',
  },
] as const;
export type MaterialSlug = (typeof materialCatalog)[number]['slug'];
export type MaterialMeta = (typeof materialCatalog)[number];
export const researchAreas: Record<string, string> = {
  function_job: '生活機能と具体的な仕事',
  supported_employment: '援助付き就業と学習',
  workplace_management: '企業の仕事と経営',
  collaboration: '多職種・組織・地域連携',
  policy_finance: '制度・財源と支援の層',
  choice_outcomes: '本人の選択と結果',
};
export type ReadingEntry = {
  editionPart?: 'technical';
  id: string;
  title: string;
  subtitle: string;
  html: string;
  area?: string;
  version?: number;
};
export type MaterialData = { slug: MaterialSlug; entries: ReadingEntry[] };
