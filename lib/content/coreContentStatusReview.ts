export type CoreContentStatusState =
  | 'public_now'
  | 'hidden_review'
  | 'implemented_but_misaligned'
  | 'internal_tool'
  | 'internal_base';

export type CoreContentStatusTrack = {
  title: string;
  state: CoreContentStatusState;
  publicRoute?: string;
  reviewRoute?: string;
  role: string;
  currentState: string;
  whyItFeelsMissing: string;
  nextMove: string;
  founderCheck: string;
  evidence: string[];
};

export type CoreContentCheckStep = {
  step: string;
  title: string;
  detail: string;
};

export const coreContentStatusHero = {
  eyebrow: 'Work Design Core Status',
  headline: 'NBLの現在のコアが、何が live で、何が review 中で、何がまだ境界前かを一枚で見る。',
  subheadline:
    'NBL の公開本線は、仕事設計の見取り図と 26フレームカード版です。仕事設計ガイドは内部チェック段階、配慮設計アシストは内部ツール、先行5章版は役割を終えた試作として扱います。',
};

export const coreContentCheckSteps: CoreContentCheckStep[] = [
  {
    step: '1',
    title: 'まず live な基礎地図を見る',
    detail:
      '`/jac-foundations` を開く。ここが現在 public-safe に出している `仕事設計の見取り図` で、3レイヤー、仕事のコンディションマップ、雇用の正常化、質の指標が見える。',
  },
  {
    step: '2',
    title: '次に公開済みの変革テーマ群を見る',
    detail:
      '`/resources/work-support-transformation` を開く。制度、専門支援、慢性疾患支援まで含めた public collection を確認し、必要なら `/review/employment-design` で構成判断の内部面を追う。',
  },
  {
    step: '3',
    title: '仕事設計コアプロダクトの位置づけを見る',
    detail:
      '`/review/jac-core-product` と `/review/jac-positioning` を開く。見取り図 / 26フレームカード版 を公開本線に絞り、ガイドを内部チェックへ下げ、`AIカウンセラー` を避けるべき理由がここにある。',
  },
  {
    step: '4',
    title: 'そのあと新しい review surface を見る',
    detail:
      '`/review/work-design-frame-reference` を先に開く。必要なら `/review/work-design-guide` で内部チェック用の面を見て、`設計の考え方` の重複や debug 前提が残っていないかを確認する。',
  },
];

export const coreContentStatusTracks: CoreContentStatusTrack[] = [
  {
    title: '就労支援設計の変革テーマ群',
    state: 'public_now',
    publicRoute: '/resources/work-support-transformation',
    reviewRoute: '/review/employment-design',
    role: '制度、専門支援、慢性疾患支援まで含めて、就労支援設計を公開で共有する public collection。',
    currentState:
      '`障害者雇用支援の世界標準 / 日本における変革課題 / 慢性疾患の支援` を 3 つのテーマレーンとして public collection に上げ、review はその構成判断を残す内部面として持つ形に切り替えた。',
    whyItFeelsMissing:
      '公開されたばかりで、まだ `NBL の事業定義そのものとどうつながるか` が他ページでは十分に揃っていない可能性がある。',
    nextMove:
      'What We Do、Resources、For Enterprise で `社会OS事業の公開知識層` としての位置づけを揃え、見取り図や見えない障害シリーズとの往復導線を強める。',
    founderCheck:
      '次に Founder が見るべきなのは、collection をどこまでトップや事業説明の中心に寄せるか、そして追加テーマをどの順で公開層へ上げるかの Yes / No / Adjust。',
    evidence: [
      '/resources/work-support-transformation',
      '/review/employment-design',
      'content-review/employment-design-series/page-draft.md',
      'docs/nbl-workspace/content-inventory.md',
    ],
  },
  {
    title: '仕事設計の見取り図',
    state: 'public_now',
    publicRoute: '/jac-foundations',
    role: '仕事設計プロダクト群の土台を返す public-safe な基礎地図。',
    currentState:
      '3レイヤー、仕事のコンディションマップ、雇用の正常化、質の指標がすでに public に見られる。',
    whyItFeelsMissing:
      'トップや現在のコアとの関係整理がまだ弱く、`これが雇用設計と条件整理の土台だ` と認識しづらい。',
    nextMove:
      '仕事設計 / Resources / 雇用設計 review の関係を見える化し、ここを現在のコアの基礎面として固定する。',
    founderCheck:
      'この面自体に直ちに Yes / No / Adjust は不要。必要なのは、これをどの collection の土台として見せるかの整理。',
    evidence: [
      '/jac-foundations',
      'docs/nbl-workspace/jac-foundations-round-2026-03-17.md',
    ],
  },
  {
    title: '26フレームカード版',
    state: 'hidden_review',
    reviewRoute: '/review/work-design-frame-reference',
    role: '見取り図の次に置く、3/9 時点の 26カード版を基にした main surface。',
    currentState:
      'docs の `jac-26-card-edition.md` を基に、利用者向けに読める 26カード版として review surface まで起こした。',
    whyItFeelsMissing:
      'まだ hidden review で、top や current status から直接辿れる public route がないため、`いまの本体` としての存在が伝わりにくい。',
    nextMove:
      '見取り図との往復導線と wording を最終見直しし、current core の main surface として public-safe に出すかを判断する。',
    founderCheck:
      'Founder が返すべき判断は、26フレームカード版を現在の本体として先に出すか、その範囲をどこまでにするかの Yes / No / Adjust。',
    evidence: [
      '/review/work-design-frame-reference',
      'docs/guidebook/jac-26-card-edition.md',
      'docs/nbl-workspace/content-inventory.md',
    ],
  },
  {
    title: '仕事設計ガイド',
    state: 'internal_base',
    reviewRoute: '/review/work-design-guide',
    role: '内部チェック用に残している検証面。',
    currentState:
      '長い導入ガイドとして実装はあるが、debug 用の監査出力と利用者向け出力が同居しており、現状では利用者向けには出せない。',
    whyItFeelsMissing:
      '実装はあるのに公開本線から外したため、役割が中途半端に見えやすい。',
    nextMove:
      '当面は内部チェック面として扱い、利用者向け導線には戻さない。debug と検証に必要な出力だけを整理する。',
    founderCheck:
      '直近の public 判断は不要。必要なのは、内部チェック面としてどこまで維持するかの整理。',
    evidence: [
      '/review/work-design-guide',
      '/jac/guide',
      '/review/jac-core-product',
    ],
  },
  {
    title: '配慮設計アシスト',
    state: 'internal_tool',
    publicRoute: '/jac',
    reviewRoute: '/review/jac-positioning',
    role: 'Founder が外部依頼対応の中で使い、ノウハウを集める internal tool。',
    currentState:
      '実装と API は存在し、現在は Founder が外部依頼に対応する際の内部ツールとして使う前提が最も自然になっている。',
    whyItFeelsMissing:
      '公開 route は legacy のまま残っていても、実際には public product として出さない前提なので、`実装はあるのに見えない` 状態になっている。',
    nextMove:
      'Founder-operated internal tool として boundary を固定し、将来は `Founderの代わりに使う人間の操作` -> `相談者が自分で使うツール` の順で段階を分けて評価する。',
    founderCheck:
      'Founder の Yes / No / Adjust が必要なのは、public open の可否ではなく、次段階を `内部運用の拡張` にするか `外部向け operator-assist` にするかの判断。',
    evidence: [
      '/jac',
      '/review/jac-positioning',
      'pages/jac.tsx',
    ],
  },
  {
    title: '先行5章版アーカイブ',
    state: 'internal_base',
    publicRoute: '/jac/guidebook',
    reviewRoute: '/review/work-design-workbook',
    role: '重点5章でまとめ方を試した開発履歴 / 編集資産。',
    currentState:
      '重点5章の本文資産は残っているが、現在の導線では役割を持たせず、必要なら過去の試作として参照する程度が自然になっている。',
    whyItFeelsMissing:
      'route は残っていても役割を終えているため、いま表で積極的に見せる必要がない。',
    nextMove:
      '新たな surface としては育てず、必要なら docs 側の参照資産としてだけ扱う。',
    founderCheck:
      '直近の判断は不要。基本的には役割終了として扱う。',
    evidence: [
      '/review/work-design-workbook',
      '/jac/guidebook',
      'docs/guidebook/jac-focus5-guidebook-sample.md',
    ],
  },
  {
    title: '先行5章版・26カード版の編集基盤',
    state: 'internal_base',
    role: 'ガイドブック本文や編集 packet の内部基盤。',
    currentState:
      '重点5章試作、26カード版、編集 packet など、本文の原稿資産は docs に蓄積されている。',
    whyItFeelsMissing:
      'これは route ではなく docs 側の内部基盤なので、サイトを見るだけでは存在が分からない。',
    nextMove:
      'public route をどう見せるかと切り分けて、本文資産は編集系 runbook と接続したまま育てる。',
    founderCheck:
      '直ちに public 判断は不要。必要なのは、どの editorial slice を guidebook surface に反映するかの優先順位。',
    evidence: [
      'docs/guidebook/jac-focus5-guidebook-sample.md',
      'docs/guidebook/jac-26-card-edition.md',
      'docs/guidebook/jac-editorial-agent-workflow.md',
    ],
  },
];

export const coreContentStatusWhyConfusing = [
  'public-safe に live な面と、hidden review だけにある面が別 route に散っている。',
  '配慮設計アシストや先行5章版は実装が残っている一方で、最新の公開方針では `internal tool / 開発履歴` に寄っており、古い route 名だけを見ると温度感を誤解しやすい。',
  'inventory 上での状態整理が、Founder が普段見る web 面に直結していなかった。',
];

export const coreContentStatusFounderDecisions = [
  '就労支援設計の変革テーマ群を、トップや What We Do のどこまで中心導線に寄せるか。',
  '26フレームカード版を現在の本体として先に出すか、その範囲をどこまでにするか。',
  '配慮設計アシストを internal tool として固定し、次段階を operator-assist にするか later self-serve にするか。',
];
