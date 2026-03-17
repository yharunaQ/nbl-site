export type EnterpriseCard = {
  title: string;
  summary: string;
  implication?: string;
};

export type EnterpriseTheme = {
  title: string;
  summary: string;
  firstLook: string;
};

export type EnterpriseStep = {
  title: string;
  detail: string;
};

export type EnterpriseResourceLink = {
  title: string;
  summary: string;
  href: string;
  cta: string;
};

export const publicEnterpriseEntry = {
  hero: {
    eyebrow: 'Enterprise And Organizational Readers',
    headline: '働きづらさを、個人の問題だけでなく職場設計の課題として捉え直す。',
    subheadline:
      'Next Being Lab は、障害や病気のある人の働きづらさを重要な実装領域として扱いながら、仕事・情報・運用の設計を見直し、継続就労や組織運用の質を高める入口をつくる AI-native なチームです。',
  },
  pageReturns: [
    '合理的配慮を、特別対応ではなく職場設計として捉える見方',
    '企業担当者が最初に見直しやすい実務テーマ',
    '次に読むべき JAC と公開動画への入口',
  ],
  framingPoints: [
    {
      title: '合理的配慮は職場設計',
      summary:
        '思いやりや特別扱いではなく、仕事、情報、運用のどこを変えると働きやすさが上がるかという設計課題として考えます。',
      implication:
        'まず見るのは、職務の切り方、指示の出し方、会議や報告の流れ、休憩や通院の扱いなどです。',
    },
    {
      title: '雇用率は結果指標',
      summary:
        '数字だけを先に追うのではなく、辞めなくて済む設計や働き続けられる運用の質を整えた結果として現れる指標と捉えます。',
      implication:
        '採用人数だけでなく、継続就労、相談しやすさ、現場での運用定着まで見ないと質は分かりません。',
    },
    {
      title: 'まず職場設計、その次に支援連携',
      summary:
        '最初から外部へ丸投げするのではなく、まず職場側で改善できる領域を取り、その次に必要な支援を接続します。',
      implication:
        '企業内で変えられる条件を見ずに支援連携だけ増やすと、根本の運用課題が残りやすくなります。',
    },
  ] as EnterpriseCard[],
  audiences: [
    {
      title: '人事・DEI・労務',
      summary:
        '合理的配慮や雇用管理を、個別対応だけでなく継続可能な運用や職場設計として見直したい方に向いています。',
    },
    {
      title: '経営企画・DX・事業責任者',
      summary:
        'AI導入を効率化だけでなく、仕事設計や組織の持続可能性につなげたい方に向いています。',
    },
    {
      title: '産業保健・支援連携・現場管理',
      summary:
        '現場の困りごとと制度、支援、仕事設計の間をどうつなぐか整理したい方に向いています。',
    },
  ] as EnterpriseCard[],
  practicalThemes: [
    {
      title: '中途障害者の継続雇用',
      summary:
        '体調や治療条件が変わった後に、元の働き方へそのまま戻そうとして詰まる場面は少なくありません。辞めるかどうかの前に、勤務、業務、引継ぎ、フォローの設計を見直す余地があります。',
      firstLook: '最初に見るなら: 勤務時間、通院調整、休憩、引継ぎ、復帰直後の負荷の置き方。',
    },
    {
      title: 'ニューロダイバーシティ',
      summary:
        '採用や評価の偏りだけでなく、曖昧な指示、同時処理負荷、会議運用、感覚負荷などが日常的な働きづらさになっていることがあります。',
      firstLook: '最初に見るなら: 指示の粒度、タスク分解、会議ルール、優先順位の見え方、評価の言語化。',
    },
    {
      title: '相談しやすい導線と秘密保持',
      summary:
        '相談窓口があっても、誰に、どこまで、どのように共有されるかが不明だと、実際には相談しにくいままです。相談導線と情報共有境界の設計が必要です。',
      firstLook: '最初に見るなら: 相談先の複線化、共有範囲、本人同意、管理職への伝わり方、記録の扱い。',
    },
    {
      title: '仕事・情報・運用の見直し',
      summary:
        '働きづらさは、能力の不足よりも、会議、報告、緊急対応、例外処理、評価運用などの日常設計に埋め込まれていることがあります。',
      firstLook: '最初に見るなら: 定例会議、報連相の流れ、例外時の判断、エスカレーション、現場の暗黙知。',
    },
  ] as EnterpriseTheme[],
  firstSteps: [
    {
      title: '1. いま一番詰まっている場面を一つに絞る',
      detail:
        '採用、復職、日常運用、相談導線などを一度に全部扱わず、最初に一つの場面へ焦点を当てます。',
    },
    {
      title: '2. 個人要因と職場要因を分けて書き出す',
      detail:
        '本人、仕事、環境、支援、時間、制度の条件を分けて見るだけでも、動かせる論点が見えやすくなります。',
    },
    {
      title: '3. まず一つの運用条件を変えてみる',
      detail:
        '配慮の是非を抽象的に議論するより、指示、会議、勤務、引継ぎのどれか一つを変えて観察する方が前に進みます。',
    },
  ] as EnterpriseStep[],
  boundaries: [
    'このページは、個別ケースの最終判断や法的結論を示すページではありません。',
    '診断名だけで必要な配慮や働き方を決め打ちするためのページではありません。',
    '支援機関への丸投げや、販売優先の導線を主目的にしたページではありません。',
  ],
  resourceLinks: [
    {
      title: 'JACの基礎説明',
      summary:
        '3レイヤー、読み方、基礎図解を含めて、方法論の土台を先に押さえたいときの入口です。',
      href: '/jac-foundations',
      cta: 'JACの考え方を見る',
    },
    {
      title: '公開中の動画',
      summary:
        '合理的配慮、障害者雇用の質、全体マップなどを短く掴みたいときの入口です。',
      href: '/videos',
      cta: '公開動画を見る',
    },
  ] as EnterpriseResourceLink[],
};
