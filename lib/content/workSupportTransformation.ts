import { withManagedAssetVersion } from '@/lib/content/managedAssetVersion';

export type WorkSupportTransformationSignal = {
  label: string;
  value: string;
};

export type WorkSupportTransformationCard = {
  slug: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  imageOrientation: 'landscape' | 'portrait';
  role: string;
  summary: string;
  whyItMatters: string;
  caution: string;
  relatedLabel: string;
};

export type WorkSupportTransformationSection = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  accent: string;
  cards: WorkSupportTransformationCard[];
};

export type WorkSupportTransformationPath = {
  title: string;
  summary: string;
  href: string;
  cta: string;
};

export const workSupportTransformationHero = {
  eyebrow: 'Public Collection',
  headline: '就労支援設計の変革テーマ群',
  subheadline:
    '企業の困りごとだけでなく、制度、専門支援、慢性疾患支援、行政との接続まで含めて、働きづらさをどの設計単位で読み直すべきかを公開で共有する collection です。',
  supportingCopy:
    'Next Being Lab は、個別相談を件数で積み上げる事業より、再利用可能な知識、図解、判断境界、仕事設計の方法論を積み上げる社会OS事業として進めています。この collection は、その公開層にあたり、企業だけでなく支援者や行政が同じ地図を持てるようにする役割も担います。',
};

export const workSupportTransformationSignals: WorkSupportTransformationSignal[] = [
  { label: 'テーマ', value: '4' },
  { label: '主な読者', value: '企業 / 支援者 / 行政' },
  { label: '接続先', value: '見取り図 / Resources / Videos' },
];

export const workSupportTransformationPositioning = [
  {
    title: '公開の共通言語をつくる',
    detail:
      '企業だけの問題設定に押し込めず、制度、専門支援、慢性疾患支援まで含めて、何を見直すべきかの共通言語を返します。',
  },
  {
    title: '仕事設計の土台へつなぐ',
    detail:
      '強い主張画像を単独で消費させるのではなく、仕事設計の見取り図や 26フレームカード版へ接続する前段の problem framing として使います。',
  },
  {
    title: '社会OSの公開層として残す',
    detail:
      '単発の相談回答で終わらせず、次の現場でも参照できる図解と説明資源として残し、private layer の実装と往復できる形にします。',
  },
  {
    title: '支援者と行政の実装レーンも示す',
    detail:
      '企業だけに負担を戻さず、支援機関、難病支援、行政担当者がどこで動けるかも同じページで見えるようにします。',
  },
];

export const workSupportTransformationSections: WorkSupportTransformationSection[] = [
  {
    id: 'global-reference',
    eyebrow: 'Theme 01',
    title: '障害者雇用支援の世界標準',
    summary:
      '国際的には、雇用を企業の善意や個人の努力だけでなく、制度設計、専門支援ネットワーク、評価指標を含む仕組みとして捉える前提が広がっています。',
    accent: 'from-sky-100 via-cyan-50 to-white',
    cards: [
      {
        slug: 'inclusive-employment',
        title: 'インクルーシブ雇用',
        imageSrc: withManagedAssetVersion(
          '/resources/work-support-transformation/inclusive-employment.png',
        ),
        imageAlt: 'インクルーシブ雇用の考え方をまとめた図解',
        imageOrientation: 'landscape',
        role: '世界標準の導入図',
        summary:
          '雇用を、特別枠の中だけの話ではなく、働く場の設計全体として捉え直すための入口です。',
        whyItMatters:
          'NBL が企業向けの個別助言だけでなく、支援モデルや制度モデルを仕事設計へ翻訳しようとしている理由が伝わります。',
        caution:
          '国や制度の前提は一枚岩ではありません。日本へそのまま移植できる正解として読むのではなく、参照枠として扱う必要があります。',
        relatedLabel: '関連: 仕事設計の見取り図 / 障害者雇用の質の指標',
      },
      {
        slug: 'global-three-layers',
        title: '諸外国の3層',
        imageSrc: withManagedAssetVersion(
          '/resources/work-support-transformation/global-three-layers.png',
        ),
        imageAlt: '諸外国における障害者就労支援の3層構造を示した図解',
        imageOrientation: 'landscape',
        role: '支援設計の構造図',
        summary:
          '雇用だけを切り出さず、就労支援が複数の層で組み合わさっていることを示します。',
        whyItMatters:
          '企業内の配慮だけでは解けない問題があること、そして支援設計と制度設計も含めて読む必要があることを短く共有できます。',
        caution:
          '諸外国の仕組みをそのまま理想化せず、法域差と運用差があることを前提に見る必要があります。',
        relatedLabel: '関連: 3レイヤー / 支援連携 / Resources',
      },
    ],
  },
  {
    id: 'japan-reform',
    eyebrow: 'Theme 02',
    title: '日本における変革課題',
    summary:
      '日本では、制度の前提と現場の運用がずれたまま、企業や本人にしわ寄せが戻りやすい構図があります。NBL はそこを、仕事設計から読み直す必要があると考えています。',
    accent: 'from-amber-100 via-orange-50 to-white',
    cards: [
      {
        slug: 'japan-vs-world',
        title: '日本と世界の比較',
        imageSrc: withManagedAssetVersion(
          '/resources/work-support-transformation/japan-vs-world.png',
        ),
        imageAlt: '日本と世界の障害者雇用支援の比較を示した図解',
        imageOrientation: 'landscape',
        role: '問題設定の比較図',
        summary:
          '日本の就労支援の前提が、国際的な支援設計の流れとどこでずれているかを見える化します。',
        whyItMatters:
          'NBL が企業向けの実務だけでなく、日本の制度前提そのものを読み替える必要を感じている理由が伝わります。',
        caution:
          '日本と世界を単純な優劣で比べるのではなく、何が欠け、何が押し戻されているのかを読む補助図として使う必要があります。',
        relatedLabel: '関連: 就労選択支援 / 世界標準 / 社会OSの problem framing',
      },
      {
        slug: 'employment-normalization',
        title: '障害者雇用の正常化',
        imageSrc: withManagedAssetVersion('/jac-foundations/employment-normalization.png'),
        imageAlt: '障害者雇用の正常化に関する図',
        imageOrientation: 'landscape',
        role: '制度と運用のねじれを示す図',
        summary:
          '雇用率や特別枠だけでは捉えきれない課題が、現場の運用と継続就労の質にどう現れるかを示します。',
        whyItMatters:
          '制度批評そのものが目的ではなく、なぜ NBL が仕事設計から始めるのかを public-safe に説明できます。',
        caution:
          '企業批判だけに読まれないよう、仕事・情報・運用をどう変えるかという設計の話へ必ず戻す必要があります。',
        relatedLabel: '関連: 仕事設計の見取り図 / 障害者雇用の質の指標',
      },
    ],
  },
  {
    id: 'chronic-illness-support',
    eyebrow: 'Theme 03',
    title: '慢性疾患の支援',
    summary:
      '障害者雇用枠では拾いきれない体調変動や継続就労の課題も、就労支援設計の中核です。慢性疾患の支援は、見えない障害の理解と制度・支援設計をつなぐ bridge lane です。',
    accent: 'from-emerald-100 via-teal-50 to-white',
    cards: [
      {
        slug: 'chronic-illness-trends',
        title: '難病就労支援の諸外国の動向',
        imageSrc: withManagedAssetVersion(
          '/resources/work-support-transformation/chronic-illness-trends.png',
        ),
        imageAlt: '難病就労支援の諸外国の動向を示した図解',
        imageOrientation: 'landscape',
        role: '慢性疾患支援の国際参照図',
        summary:
          '慢性疾患や難病のある人の就労継続を、医療、生活、就労支援の接続として見る視点を共有します。',
        whyItMatters:
          'NBL が障害者雇用だけの organization ではなく、慢性疾患と仕事設計の交点まで扱う理由を示せます。',
        caution:
          '疾患ごとの差や国ごとの差があるため、一般論として固定せず、支援接続の方向を考える参照図として扱います。',
        relatedLabel: '関連: 見えない障害の理解 / 難病就労連携の全体マップ',
      },
      {
        slug: 'balance-treatment-work',
        title: '治療と仕事の両立',
        imageSrc: withManagedAssetVersion(
          '/resources/work-support-transformation/balance-treatment-work.png',
        ),
        imageAlt: '治療と仕事の両立を考えるための図解',
        imageOrientation: 'landscape',
        role: '継続就労の設計図',
        summary:
          '通院、治療、体調変動を個人的事情として切り離さず、継続就労の条件として組み込む必要を示します。',
        whyItMatters:
          'NBL の仕事設計が、本人の気合いや単発配慮でなく、時間と運用の設計を含むことを伝えられます。',
        caution:
          '必要な調整は病状や職種で変わるため、ここにあるのは唯一の答えではなく、何を見落としやすいかの整理です。',
        relatedLabel: '関連: 見えない障害シリーズ / 企業向け実践ガイド動画',
      },
    ],
  },
  {
    id: 'support-and-administration',
    eyebrow: 'Theme 04',
    title: '支援者・行政の実装レーン',
    summary:
      'NBL は企業だけを対象にした設計図をつくりたいのではなく、支援者や行政がスムーズに動けるための OS も返したいと考えています。このレーンでは、その全体像と起点を示します。',
    accent: 'from-violet-100 via-indigo-50 to-white',
    cards: [
      {
        slug: 'employment-frame',
        title: '障害者雇用枠の全体像',
        imageSrc: withManagedAssetVersion(
          '/resources/work-support-transformation/employment-frame.png',
        ),
        imageAlt: '障害者雇用枠の全体像を示した図解',
        imageOrientation: 'landscape',
        role: '企業と支援者の共通地図',
        summary:
          '企業だけでなく支援機関や行政担当者も、障害者雇用の枠組み全体をどこから読み解くかを共有するための図解です。',
        whyItMatters:
          '雇用率、支援導線、職場設計、就労継続の質を別々に議論せず、全体像の中で位置づけやすくなります。',
        caution:
          '制度や運用の時点差がありうるため、最新制度の確定説明としてではなく、全体像をそろえる参照図として使う必要があります。',
        relatedLabel: '関連: 世界標準 / 日本における変革課題 / 障害者雇用の質',
      },
      {
        slug: 'foundational-training',
        title: '基礎的研修から始まる',
        imageSrc: withManagedAssetVersion(
          '/resources/work-support-transformation/foundational-training.png',
        ),
        imageAlt: '基礎的研修から始まることを示した図解',
        imageOrientation: 'landscape',
        role: '支援機関・行政の整備レーン',
        summary:
          '支援や就労選択支援を現場で回す前に、何を共通基盤としてそろえるべきかを示す図解です。',
        whyItMatters:
          '現場の善意や個人差に委ねず、支援者側の基礎的な研修や共通認識を OS として整える必要があることが伝わります。',
        caution:
          '研修だけで解決するという意味ではありません。研修、連携、運用見直しをつなぐ起点として読む必要があります。',
        relatedLabel: '関連: 就労選択支援 / 支援連携 / 補助動画',
      },
      {
        slug: 'job-choice-support',
        title: 'インクルーシブ雇用の要：就労選択支援',
        imageSrc: withManagedAssetVersion(
          '/resources/work-support-transformation/job-choice-support.png',
        ),
        imageAlt: '就労選択支援の重要性を示した図解',
        imageOrientation: 'landscape',
        role: '支援連携の起点図',
        summary:
          '企業だけで解くのでなく、本人、支援機関、行政、職場の接点をどう設計するかを、就労選択支援の観点から整理する図解です。',
        whyItMatters:
          'NBL が支援者層を今後のパートナーとして重視し、支援側がスムーズに動ける OS を返そうとしていることが伝わります。',
        caution:
          '制度名称や地域差のある運用は、法域と時点を確認しながら扱う必要があります。唯一の制度解釈として固定しないことが重要です。',
        relatedLabel: '関連: 全体マップ動画 / 支援者向け導線 / private layer',
      },
    ],
  },
];

export const workSupportTransformationGuardrails = [
  '制度批評だけで終わらせず、仕事設計と支援設計へ戻す',
  '1つの図を唯一の正解や確定事実として扱わない',
  '慢性疾患や障害を単一の当事者像へ一般化しない',
  '企業だけに責任を押し戻さず、制度と専門支援の構図も同時に示す',
];

export const workSupportTransformationPaths: WorkSupportTransformationPath[] = [
  {
    title: '仕事設計の基礎図解',
    summary: 'コンディションマップや基礎図解で、仕事設計の論点を先に押さえたいときの入口です。',
    href: '/resources/work-design-foundations',
    cta: '仕事設計の基礎図解を見る',
  },
  {
    title: '見えない障害の理解',
    summary: '慢性疾患や見えにくい困りごとを、理解と運用の橋渡しとして見たいときの入口です。',
    href: '/resources/invisible-disability',
    cta: 'シリーズを見る',
  },
  {
    title: 'What We Do',
    summary: 'NBL が社会OS事業として何を公開し、どこから private layer へつなぐかを確認したいときの入口です。',
    href: '/what-we-do',
    cta: 'What We Do を見る',
  },
  {
    title: '公開動画',
    summary: 'この collection と往復しながら、企業、支援者、行政に共通する前提整理の動画を見たいときの入口です。',
    href: '/videos',
    cta: '動画を見る',
  },
];

export const workSupportTransformationVideos = [
  {
    title: '難病就労連携「全体マップ」活用セミナー',
    href: 'https://youtu.be/dgO_MYf2T8A',
    note: '支援者、行政、企業が連携全体をつかむための導入動画。',
  },
  {
    title: '障害者雇用の「能力主義」に潜む3つの罠',
    href: 'https://youtu.be/-6PJlEa9DeQ',
    note: '人数合わせから経営戦略への転換を考える啓発動画。',
  },
  {
    title: '「配慮疲れ」を終わらせる3つの神話とシステム転換',
    href: 'https://youtu.be/muwEfKS420U',
    note: '配慮を善意や疲弊の問題でなく、運用設計として捉え直す補助動画。',
  },
  {
    title: '障害者雇用の「枠」は撤廃すべきか？',
    href: 'https://youtu.be/sQ0zoIZaO4w',
    note: '制度枠と DEI の逆説を、対論形式で考える補助動画。',
  },
  {
    title: '障害者雇用の「質」を問う',
    href: 'https://youtu.be/0aUjkKUrIP4',
    note: '雇用率だけでは見えにくい論点を短時間でつかむ補助動画。',
  },
  {
    title: '難病・慢性疾患のある社員を支えるマネジメント実践ガイド',
    href: 'https://youtu.be/Ef9Bu1rXtKQ',
    note: '慢性疾患支援を実務判断へ落とす補助動画。',
  },
];
