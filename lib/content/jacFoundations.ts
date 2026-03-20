import { withManagedAssetVersion } from '@/lib/content/managedAssetVersion';

export type JacFoundationTakeaway = {
  title: string;
  detail: string;
};

export type JacFoundationReason = {
  title: string;
  detail: string;
};

export type JacFoundationReadingStep = {
  step: string;
  title: string;
  detail: string;
};

export type JacFoundationContextAxis = {
  title: string;
  detail: string;
};

export type JacFoundationPrinciple = {
  title: string;
  detail: string;
};

export type JacFoundationDevelopmentStat = {
  value: string;
  label: string;
  detail: string;
};

export type JacFoundationDevelopmentStep = {
  step: string;
  title: string;
  detail: string;
  evidence: string;
};

export type JacFoundationLayer = {
  title: string;
  frameCount: string;
  purpose: string;
  businessMeaning: string;
  typicalQuestions: string[];
  blindSpot: string;
  imageSrc: string;
  imageAlt: string;
  imageNote: string;
};

export type JacFoundationInfographic = {
  slug: string;
  title: string;
  summary: string;
  whatItAdds: string;
  businessMeaning: string;
  imageSrc: string;
  imageAlt: string;
};

export const jacFoundationsHero = {
  eyebrow: '仕事設計の見取り図',
  headline:
    '仕事設計の見取り図は、困りごとを診断名ではなく、反復する職場課題の型として読むための地図です。',
  subheadline:
    'このページでは、3レイヤーと 26フレームの全体像を、企業担当者にも読みやすい形で紹介します。個別事情を飛ばして結論を出すためではなく、職場設計の見立てをそろえるための入口です。',
  audience:
    '想定読者は、人事、現場管理職、産業保健、支援連携担当、継続就労やニューロダイバーシティの実務に関心のある方です。',
};

export const jacFoundationTakeaways: JacFoundationTakeaway[] = [
  {
    title: '3レイヤーの全体像',
    detail: '体調、就職移行、職場運用のどこで詰まりが起きやすいかを切り分けて見られます。',
  },
  {
    title: 'この見取り図の見立て方',
    detail:
      '診断名から結論を急ぐのではなく、仕事・環境・支援・時間の条件をそろえて考える姿勢が分かります。',
  },
  {
    title: '企業側の最初の論点',
    detail:
      '合理的配慮、継続就労、相談導線を、個別善意ではなく職場設計として捉える視点が持てます。',
  },
];

export const jacFoundationNotThisPage = [
  '個別ケースの最終判断',
  '診断名だけによる自動的な見立て',
  '法的判断や高リスク案件の完結',
];

export const jacFoundationReadingSteps: JacFoundationReadingStep[] = [
  {
    step: '01',
    title: 'まず、困りごとがどこで現れているかを見る',
    detail:
      '診断名から結論へ飛ばず、体調の変動、移行工程の詰まり、職場運用の摩擦のどこに問題が現れているかを切り分けます。',
  },
  {
    step: '02',
    title: '次に、どのレイヤーで考えるべきか見当をつける',
    detail:
      '3レイヤーは固定分類ではなく、見落としやすい論点を漏らさず確認するための地図です。複数レイヤーにまたがることも前提にします。',
  },
  {
    step: '03',
    title: '最後に、個別条件を重ねて具体化する',
    detail:
      '本人、仕事、環境、支援、時間、制度の条件を重ねてはじめて、個別の設計に近づきます。26フレームだけで答えは決まりません。',
  },
];

export const jacFoundationReasons: JacFoundationReason[] = [
  {
    title: '体調の波と職場課題を混ぜないため',
    detail:
      '不調が見えると、原因も解決策も本人側だけに寄りがちです。まず体調条件と職場条件を分けて見ることで、調整できる論点が見えやすくなります。',
  },
  {
    title: '就職・復職・定着の詰まりを工程で見つけるため',
    detail:
      '採用や復職の場面では、説明不足、合意の曖昧さ、支援連携の抜けが起きやすくなります。移行工程をひとまとめにせず、段階ごとに見ます。',
  },
  {
    title: '日常の運用設計に戻せるようにするため',
    detail:
      '困りごとは会議、指示、情報共有、安全配慮、評価運用などの日常設計に埋め込まれています。現場が変えられる論点に戻すためのレイヤーです。',
  },
];

export const jacFoundationContextAxes: JacFoundationContextAxis[] = [
  {
    title: '本人',
    detail: '症状の変動、強み、苦手さ、本人の希望を切り分けて見ます。',
  },
  {
    title: '仕事',
    detail: '必須業務、業務量、速度、ミス許容度、優先順位の持ち方を確認します。',
  },
  {
    title: '環境',
    detail: '物理環境、感覚負荷、対人関係、管理の仕方などの条件を別軸で見ます。',
  },
  {
    title: '支援',
    detail: '既に試した配慮、使えるツール、社内外の支援体制を整理します。',
  },
  {
    title: '時間',
    detail: '一時的な移行期か、再発しやすい局面か、継続調整が要るかを見ます。',
  },
  {
    title: '制度',
    detail: '法政策差、社内ルール、情報共有の境界などを条件として扱います。',
  },
];

export const jacFoundationPrinciples: JacFoundationPrinciple[] = [
  {
    title: '診断名だけで結論を固定しない',
    detail: '同じ診断名でも、仕事、環境、支援、時間、制度の条件が違えば必要な設計は変わります。',
  },
  {
    title: '古い障害観をそのまま再生産しない',
    detail:
      '既存情報には、欠陥中心の見方、能力主義、診断決め打ちが混ざりやすいため、そのまま一般化せず、相互作用モデルで読み替えます。',
  },
  {
    title: '合理的配慮を職場設計として見る',
    detail: '特別対応や思いやりではなく、仕事・情報・運用の調整として整理します。',
  },
  {
    title: 'まず課題の型を見て、その後に個別条件を詰める',
    detail: '26フレームは地図であり、最終設計を自動で決めるためのものではありません。',
  },
  {
    title: 'うまくいかないときは、根性論ではなく運用を見直す',
    detail: '詰まりを個人要因だけで片づけず、職場側で動かせる条件を先に探します。',
  },
];

export const jacFoundationDevelopmentIntro = {
  eyebrow: 'この地図の開発背景',
  headline:
    'この見取り図は、古い障害観に汚染された情報をそのまま並べるのではなく、ICFに基づく相互作用モデルで批判的に読み替えたうえで、AI で再統合し、監査しながら単純化したものです。',
  summary:
    '障害に関する既存情報は中立ではなく、古い障害概念モデル、偏見、差別、診断名による決め打ちに強く影響されていることがあります。NBL ではまず、ICF に基づく相互作用モデルと条件つき因果の見方で、何が本人要因で、何が仕事・環境・支援・制度との相互作用なのかを批判的かつ限定的に整理します。そのうえで、現在の生成AIの文脈理解を使って複数の情報源を再統合し、3レイヤーと26フレームへ絞り込んでいます。',
  note:
    '公開中の見取り図は完成済みの最終形というより、今後の個別整理や AI 支援へつなぐための土台です。フレームだけで結論を固定せず、個別事情を重ねる前提で使います。特に、既存情報に含まれる偏見や差別の再生産を避けるため、診断名だけの説明や欠陥中心の説明をそのまま使わないことを前提にしています。',
};

export const jacFoundationDevelopmentStats: JacFoundationDevelopmentStat[] = [
  {
    value: '52 類型',
    label: '統合した知識類型',
    detail: 'data2 index に整理された類型の数。異なる障害や難病の論点を横断して見られる土台です。',
  },
  {
    value: '1076 課題行',
    label: '見落とし確認の元データ',
    detail: '仕事上の詰まりを行単位で保持し、未カバーが出ていないかを監査しています。',
  },
  {
    value: '201 件',
    label: '経験の断片',
    detail: '本人側の経験や声を narrative highlights として残し、抽象論だけに寄らないようにしています。',
  },
  {
    value: '4914 件',
    label: '再整理した知識断片',
    detail: '公開知識を claims として保持し、言い回しがどこに根拠を持つかを追える形にしています。',
  },
  {
    value: '539 関連',
    label: 'GLM の有意関連',
    detail: '難病GLMの有意関連を、どのフレームに厚みがあるかを見る手掛かりにしています。',
  },
  {
    value: '26 / 26 整合',
    label: 'フレーム整合の監査結果',
    detail: '26フレームの Tier 設計は現在 26/26 で整合。未カバー課題行は 0 件です。',
  },
];

export const jacFoundationDevelopmentSteps: JacFoundationDevelopmentStep[] = [
  {
    step: '01',
    title: '集める',
    detail:
      '公開知識、調査結果、実務記述、ガイド原稿を、そのままでは使わず、同じ形式で読める形へ整えます。',
    evidence: 'raw から sanitized、index へ整え、追加知識を同じ形で読めるようにします。',
  },
  {
    step: '02',
    title: '批判的にふるい直す',
    detail:
      '障害概念モデルの古さや欠陥中心の見方をそのまま受け取らず、ICF に基づく相互作用モデルで、条件つきの情報だけを残します。',
    evidence:
      '原因を個人属性の固定説明ではなく、条件 × 業務 × 運用の相互作用で読むことを原則にしています。',
  },
  {
    step: '03',
    title: 'AIで再統合する',
    detail:
      'AI が issue、support、claim、relation を横断し、別々の資料に出てくる同種の詰まりを照合しながら、文脈つきで再統合します。',
    evidence: 'data2、claims、GLM relations を照合し、別資料にある同種の課題を見比べます。',
  },
  {
    step: '04',
    title: '単純化する',
    detail:
      '複雑な論点を、そのまま羅列せず、3レイヤー、26フレーム、条件軸へ絞って、最初の対話で使える地図へ落とします。',
    evidence: 'カード数のゆらぎと、残す論点・外へ逃がす論点を別に点検します。',
  },
  {
    step: '05',
    title: '境界を監査する',
    detail:
      'どこまでカード本体に残し、どこから法政策や支援接続の別レイヤーへ逃がすかを明示します。',
    evidence: 'Tier alignment 26/26、未カバー課題行 0、希少記述の未カバー 0 を確認しています。',
  },
  {
    step: '06',
    title: '個別化へつなぐ',
    detail:
      '実際のケースでは、本人、仕事、環境、支援、時間、制度の条件を重ねて、個別事情に近い整理へ進みます。',
    evidence: 'この見取り図は入口であり、個別事情や高リスク判断を単独で処理しません。',
  },
];

export const jacFoundationConsultationBridge = {
  title: '今後の個別整理へどうつながるか',
  detail:
    '将来的に個別事情の整理へ進むときも、土台になる考え方は同じです。公開ページでは地図だけを示し、その先で条件軸、支援接続、見直し観点を重ねることで、個別AI支援や人の判断へ橋をかけます。',
  bullets: [
    '最初の公開面では、誰でも見られる地図として 3レイヤーと 26フレームを共有する。',
    '次の段階では、本人、仕事、環境、支援、時間、制度の条件を重ねて、個別事情の整理へ進む。',
    '高リスク判断や法政策判断は、この地図だけで完結させず、人の判断や外部支援へ戻す。',
  ],
};

export const jacFoundationLayers: JacFoundationLayer[] = [
  {
    title: '体調レイヤー',
    frameCount: '9フレーム',
    purpose:
      '変動、治療、回復、疲労、生活リズムなど、働く前提となる体調条件を整理するレイヤーです。',
    businessMeaning:
      '同じ職務でも、勤務時間、連続作業、通院調整、休憩設計、引継ぎの置き方で継続可能性は大きく変わります。',
    typicalQuestions: [
      'どの条件で負荷が上がりやすく、どの条件で安定しやすいか。',
      '勤務時間、休憩、通院、在宅や移動負荷をどう組み直せるか。',
      '体調変動がある前提で、引継ぎやフォローの運用をどう置くか。',
    ],
    blindSpot:
      '不調があることを、そのまま「働けない」や「任せにくい」に結びつけず、条件が変わると何が安定するかを見る必要があります。',
    imageSrc: withManagedAssetVersion('/jac-foundations/health-layer.png'),
    imageAlt: '26フレーム 体調レイヤー一覧',
    imageNote: 'まずは全体像として読み、個別事情は別途絞り込みます。',
  },
  {
    title: '就職移行レイヤー',
    frameCount: '7フレーム',
    purpose:
      '探索、応募、面接、合意、オンボーディング、定着など、移行工程のどこで詰まりが起きやすいかを見るレイヤーです。',
    businessMeaning:
      '採用や復職の意思決定だけでなく、説明の仕方、合意の残し方、情報共有の境界、支援連携のタイミングまで含めて考えます。',
    typicalQuestions: [
      'どの段階で認識差や説明不足が起きやすいか。',
      '配慮事項や支援連携の合意を、誰とどこまで共有するか。',
      '採用や復職の決定後に、現場運用へ滑らかに接続できているか。',
    ],
    blindSpot:
      '採用できた時点で終わりにせず、定着までを一続きの工程として見ないと、初期合意が現場で消えてしまいます。',
    imageSrc: withManagedAssetVersion('/jac-foundations/transition-layer.png'),
    imageAlt: '26フレーム 就職移行レイヤー一覧',
    imageNote: '移行工程は一回限りの面談ではなく、複数の接点で設計されます。',
  },
  {
    title: '職場運用レイヤー',
    frameCount: '10フレーム',
    purpose:
      '会議、指示、情報共有、安全配慮、日常業務、評価など、職場側の運用設計で詰まりやすいポイントを見るレイヤーです。',
    businessMeaning:
      '困りごとの原因が、能力そのものではなく、曖昧な指示、同時処理負荷、例外時の運用、相談のしにくさにある場合を捉えやすくなります。',
    typicalQuestions: [
      'どの会議、連絡、評価、緊急対応が日常的な負荷になっているか。',
      '曖昧さや同時処理負荷を減らす情報設計ができるか。',
      '管理職、同僚、支援者の役割分担やエスカレーションが明確か。',
    ],
    blindSpot:
      '本人の工夫や善意に頼り続けると再発しやすくなります。日常の仕事の流れ自体を見直す視点が必要です。',
    imageSrc: withManagedAssetVersion('/jac-foundations/operation-layer.png'),
    imageAlt: '26フレーム 職場運用レイヤー一覧',
    imageNote: '運用課題は個人の努力ではなく、チームの設計課題として現れることがあります。',
  },
];

export const jacFoundationInfographics: JacFoundationInfographic[] = [
  {
    slug: 'place-design',
    title: '「個人の根性論」から「場の設計」へ',
    summary:
      'この見取り図の起点にあるのは、困りごとを努力不足や意欲の問題として片づけず、設計課題として見直す発想です。',
    whatItAdds:
      '3レイヤーを読むときの基本姿勢を補います。まず個人責任を疑うのではなく、仕事・情報・運用のどこが調整可能かを見るための図です。',
    businessMeaning:
      '管理職や人事が「配慮をするかどうか」ではなく、「どの条件を変えると働きやすさが上がるか」を考え始める入口になります。',
    imageSrc: withManagedAssetVersion('/jac-foundations/place-design.png'),
    imageAlt: '個人の根性論から場の設計へインフォグラフィック',
  },
  {
    slug: 'condition-map',
    title: '仕事のコンディションマップ',
    summary:
      '本人要因だけでなく、仕事の条件、環境条件、支援の有無を一緒に見て整理するための基礎図解です。',
    whatItAdds:
      'この見取り図の見立てが「人の問題」だけに偏らないための補助線です。体調、仕事、環境、支援の相互作用を見る視点を支えます。',
    businessMeaning:
      '相談や面談の場で論点が症状説明だけに寄らず、仕事の条件や環境の見直しまで広がる助けになります。',
    imageSrc: withManagedAssetVersion('/jac-foundations/condition-map.png'),
    imageAlt: '仕事のコンディションマップ',
  },
  {
    slug: 'employment-normalization',
    title: '障害者雇用の正常化',
    summary:
      '日本企業にとっては、いきなり高度な評価指標へ進む前に、障害者雇用を特別枠のしわ寄せでなく、通常の仕事設計へ戻して考える入口が必要です。',
    whatItAdds:
      'まずは「企業だけに負担が増える話」でも「採用数だけの話」でもなく、雇用のあり方そのものを正常化する必要があると共有するための基礎図解です。',
    businessMeaning:
      '管理職や人事が、防御的に構える前に「なぜ現場でしわ寄せが起きるのか」を理解し、質の議論へ進む前提をそろえやすくなります。',
    imageSrc: withManagedAssetVersion('/jac-foundations/employment-normalization.png'),
    imageAlt: '障害者雇用の正常化（企業へのしわ寄せ解消）',
  },
  {
    slug: 'quality-metrics',
    title: '障害者雇用の質の指標',
    summary:
      '雇用率だけでなく、継続性、相談のしやすさ、仕事設計、支援連携の質として障害者雇用を見るための基礎図解です。日本企業向けには、まず「障害者雇用の正常化」を見た後に読む方が入りやすい図です。',
    whatItAdds:
      'この見取り図を単なる個別対応ツールではなく、職場の設計品質を見る枠組みとして位置づけやすくします。正常化の入口を共有した後に置くことで、抽象論に見えにくくなります。',
    businessMeaning:
      '採用件数だけを追うのではなく、辞めなくて済む設計や相談しやすい導線を評価対象に含める視点につながります。単独で前面に出すより、正常化の図とセットにした方が企業実務へ落とし込みやすくなります。',
    imageSrc: withManagedAssetVersion('/jac-foundations/quality-metrics.png'),
    imageAlt: '障害者雇用の質の指標',
  },
];

export const jacFoundationEnterpriseSignals = [
  '合理的配慮を、個別善意ではなく仕事・情報・運用の設計として見直す。',
  '継続就労や復職を、本人の頑張りだけでなく、職場側の条件設計として捉える。',
  'ニューロダイバーシティや見えない障害の論点を、採用広報だけでなく日常運用まで接続する。',
];

export const jacFoundationGuardrails = [
  '3レイヤーは全体地図であり、個別事情を飛ばして結論を固定するためのものではありません。',
  '障害種別の例はあくまで理解のための文脈であり、診断名でカードを決め打ちしません。',
  '法政策差、医療判断、高リスク判断は、この紹介ページだけで完結させません。',
];
