import { withManagedAssetVersion } from '@/lib/content/managedAssetVersion';

export type EmploymentDesignSignal = {
  title: string;
  summary: string;
};

export type EmploymentDesignThemeLane = {
  title: string;
  summary: string;
  nblRole: string;
  siteRole: string;
  signals: string[];
  nextMove: string;
};

export type EmploymentDesignImage = {
  src: string;
  alt: string;
  label: string;
};

export type EmploymentDesignCluster = {
  id: string;
  title: string;
  status: 'public_anchor' | 'rewrite_needed';
  summary: string;
  whyItMatters: string;
  caution: string;
  lenses: string[];
  nextMove: string;
  images: EmploymentDesignImage[];
};

export type EmploymentDesignStep = {
  step: string;
  title: string;
  detail: string;
};

export const employmentDesignHero = {
  eyebrow: 'Employment Design Review',
  headline: '隔離・分離から包摂へを、雇用設計の読み方として束ね直す。',
  subheadline:
    'インフォグラフィック群の中でも、企業の困りごとだけでなく、支援設計・制度設計・慢性疾患支援までを同じ地図で読める束から先に hidden review 化する。公開前の下書きとして、何を中核に置くかをここで絞る。',
};

export const employmentDesignSignals: EmploymentDesignSignal[] = [
  {
    title: '観察',
    summary:
      '障害者雇用をめぐる画像は多いが、世界標準、日本の制度課題、慢性疾患支援が別々に語られやすく、仕事設計の全体像としては読みにくい。',
  },
  {
    title: '推論',
    summary:
      'NBL の強みは、制度批評を強く言うことより、企業課題、専門支援、社会制度のずれを仕事設計の言葉へ訳し直し、接続点を構造で見せられることにある。',
  },
  {
    title: '公開仮説',
    summary:
      '最初の public candidate は、論争的な主張画像の束ではなく、`世界標準 / 日本の変革課題 / 慢性疾患の支援` を雇用設計の読み方として束ねた collection として出す方が安全で強い。',
  },
];

export const employmentDesignThemeLanes: EmploymentDesignThemeLane[] = [
  {
    title: '障害者雇用支援の世界標準',
    summary:
      'インクルーシブ雇用、合理的配慮の実装、諸外国の3層などを通じて、課題を企業内の努力不足ではなく、支援設計と制度設計を含む実装課題として捉え直す。',
    nblRole:
      'NBL が企業向けの助言だけをするのではなく、支援モデルと制度モデルを仕事設計へ翻訳する理由を示す土台になる。',
    siteRole:
      '3レイヤー、雇用の正常化、質の指標の背景理論として、雇用設計コレクションの上流に置くべきテーマ。',
    signals: ['インクルーシブ雇用', '諸外国の3層', '合理的配慮の潮流', '雇用の質'],
    nextMove:
      '世界標準の解説単体ではなく、日本の制度課題とセットで、`何を更新すべきか` が見える束に組み替える。',
  },
  {
    title: '日本における変革課題',
    summary:
      '雇用率制度の前提、雇用の正常化、日本と世界の比較を通じて、日本では何が企業に押し戻され、何が制度側で未整理のまま残っているかを見える化する。',
    nblRole:
      'NBL が企業だけに責任を押し戻すのではなく、制度の前提そのものを読み替えようとしていることを示す中心テーマになる。',
    siteRole:
      'For Enterprise の文脈とも接続するが、本質は企業向け営業資料ではなく、制度と運用のねじれを見せる public review lane。',
    signals: ['障害者雇用の正常化', '雇用率制度の更新', '日本と世界の比較', '制度と運用のねじれ'],
    nextMove:
      '制度批評だけに閉じず、`だから仕事設計から始める` という橋を明示した collection copy に落とし直す。',
  },
  {
    title: '慢性疾患の支援',
    summary:
      '難病・慢性疾患、体調変動、継続就労、専門支援との連携を扱い、障害者雇用だけでは拾いきれない働きづらさと支援設計の課題を見える化する。',
    nblRole:
      'NBL が障害者雇用枠だけの会社ではなく、難病・慢性疾患と仕事設計の接点まで扱う理由を示す橋渡しのテーマになる。',
    siteRole:
      '見えない障害シリーズと雇用設計コレクションをつなぐ bridge lane。動画は一部 public にあるが、collection としての位置づけは未整理。',
    signals: ['難病・慢性疾患', '体調変動', '継続就労', '専門支援との連携'],
    nextMove:
      '公開済み動画、図解、4コマをまとめ直し、`慢性疾患の支援` を独立した collection 候補として hidden review 化する。',
  },
];

export const employmentDesignClusters: EmploymentDesignCluster[] = [
  {
    id: 'three-layers',
    title: '3レイヤーで、働きづらさの場所を分けて読む',
    status: 'public_anchor',
    summary:
      '体調、移行、職場運用を同じ問題として混ぜず、どのレイヤーで難しさが起きているかを分けて見せる。NBL の仕事設計観を最も端的に示せる束。',
    whyItMatters:
      '診断名や雇用枠だけで仕事の困難を説明しない前提を置けるため、JAC foundations や企業向け説明にも接続しやすい。',
    caution:
      '方法論としては強いが、日本制度や合理的配慮との接続が薄いままだと抽象理論だけに見えやすい。',
    lenses: ['person', 'job', 'environment', 'support', 'time'],
    nextMove:
      'public candidate では、3レイヤーを入口にしつつ `制度との接点はどこか` を 1 段だけ補う。',
    images: [
      {
        src: withManagedAssetVersion('/jac-foundations/health-layer.png'),
        alt: '体調レイヤーの図',
        label: '体調レイヤー',
      },
      {
        src: withManagedAssetVersion('/jac-foundations/transition-layer.png'),
        alt: '就職移行レイヤーの図',
        label: '就職移行レイヤー',
      },
      {
        src: withManagedAssetVersion('/jac-foundations/operation-layer.png'),
        alt: '職場運用レイヤーの図',
        label: '職場運用レイヤー',
      },
    ],
  },
  {
    id: 'condition-map',
    title: 'コンディションマップで、仕事条件との相互作用を具体化する',
    status: 'public_anchor',
    summary:
      '見えない困りごとを本人の努力不足に戻さず、人・仕事・環境・支援の相互作用として読めるようにする地図。抽象論を実務に下ろす橋渡しになる。',
    whyItMatters:
      '3レイヤーだけでは広すぎる話を、実際の仕事条件に着地させられるため、public でも `理念先行` に見えにくい。',
    caution:
      '図の読み方を急ぎすぎると、個別事情を単純な類型に押し込める誤読が起こりうる。運用例や境界説明とセットで見せる必要がある。',
    lenses: ['person', 'job', 'environment', 'support', 'time'],
    nextMove:
      'public candidate では、26フレーム全展開より先に `何を見る地図か` を短く言い直して入口化する。',
    images: [
      {
        src: withManagedAssetVersion('/jac-foundations/condition-map.png'),
        alt: '仕事のコンディションマップ',
        label: '仕事のコンディションマップ',
      },
    ],
  },
  {
    id: 'normalization',
    title: '雇用の正常化を、制度批評ではなく設計の入口として使う',
    status: 'rewrite_needed',
    summary:
      '日本の障害者雇用が、雇用率や特別枠だけでは読み切れないことを示す強い図。問題設定として有効だが、単体だと批評だけが前に出やすい。',
    whyItMatters:
      'NBL が `今の仕組みの中で少し良くする` だけでなく、働きやすさの設計単位を更新しようとしていることを示せる。',
    caution:
      '企業責任批判や制度批判だけに読まれると、NBL が何を作る側なのかが見えにくくなる。仕事設計への接続文が必須。',
    lenses: ['job', 'environment', 'institution'],
    nextMove:
      'public candidate では、単独の主張画像ではなく `なぜ仕事設計から始めるのか` の補助図として使う。',
    images: [
      {
        src: withManagedAssetVersion('/jac-foundations/employment-normalization.png'),
        alt: '障害者雇用の正常化に関する図',
        label: '障害者雇用の正常化',
      },
    ],
  },
  {
    id: 'quality-metrics',
    title: '雇用の質を、継続就労と相談可能性の軸で見直す',
    status: 'rewrite_needed',
    summary:
      '雇用率だけでは見えない論点を、継続、相談、調整可能性の観点で捉え直す図。制度と運用の間にある評価軸を補強できる。',
    whyItMatters:
      'NBL の説明が `理念` ではなく `何を良い状態とみなすか` に着地するため、企業にも支援者にも使いどころが分かりやすい。',
    caution:
      '指標を万能の正解のように見せず、業務特性や支援条件によって読み方が変わることを添える必要がある。',
    lenses: ['job', 'environment', 'support', 'institution', 'time'],
    nextMove:
      'public candidate では、正常化の図の次に置き、`だから何を測り直すのか` を 1 枚でつなぐ役に寄せる。',
    images: [
      {
        src: withManagedAssetVersion('/jac-foundations/quality-metrics.png'),
        alt: '障害者雇用の質の指標',
        label: '障害者雇用の質の指標',
      },
    ],
  },
];

export const employmentDesignSequence: EmploymentDesignStep[] = [
  {
    step: '1',
    title: '働きづらさを 3 レイヤーで分けて見る',
    detail:
      '最初に `体調 / 移行 / 職場運用` を分けることで、診断名や雇用枠の話だけに閉じない読み方を置く。',
  },
  {
    step: '2',
    title: 'コンディションマップで仕事条件へ下ろす',
    detail:
      'どの条件が実際の摩擦を生むかを地図で示し、抽象理念に見えるリスクを下げる。',
  },
  {
    step: '3',
    title: '正常化と質の指標で制度・運用の評価軸をずらす',
    detail:
      '最後に `今の見方では何が抜けるか` を示し、NBL が何を変えたいのかを public-safe に接続する。',
  },
];

export const employmentDesignGuardrails = [
  '障害者雇用批判だけに寄せず、必ず仕事設計・支援設計の話へ戻す',
  '1つの制度図を日本の確定事実や唯一の正解として見せない',
  '診断名や制度区分だけで困難を説明しない',
  '当事者理解の図と政策論の図を、そのまま同じ強さで一般化しない',
];

export const employmentDesignFounderBoundary = [
  'この draft を hidden review として持つ段階では、Founder の Yes / No / Adjust はまだ不要。',
  'Founder 判断が必要なのは、これを `地平1` という public collection に上げるか、`雇用設計の変革` のような外向き名称を確定するか、制度批評の強さをどこまで public promise に入れるかを決める時点。',
];
