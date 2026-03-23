export type RelaunchPublicHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  supportingCopy: string;
  operatingNote: string;
  primaryCta: string;
  secondaryCta: string;
};

export type RelaunchPublicSignal = {
  label: string;
  value: string;
};

export type RelaunchPublicTension = {
  title: string;
  detail: string;
  bullets: string[];
};

export type RelaunchPublicManifesto = {
  title: string;
  detail: string;
};

export type RelaunchPublicMove = {
  step: string;
  title: string;
  detail: string;
  proof: string;
};

export type RelaunchPublicArtifact = {
  title: string;
  detail: string;
  note: string;
  href: string;
  publicHref?: string;
  cta: string;
};

export type RelaunchPublicLens = {
  title: string;
  detail: string;
};

export type RelaunchPublicStream = {
  id: 'what-we-do' | 'methods' | 'resources' | 'vision' | 'operating-model';
  title: string;
  detail: string;
  question: string;
  href: string;
  publicHref?: string;
};

export type RelaunchPublicBoundary = {
  title: string;
  status: string;
  detail: string;
};

export type RelaunchPublicLearningSignal = {
  title: string;
  detail: string;
  proof: string;
};

export type RelaunchPublicQuestionPath = {
  title: string;
  question: string;
  detail: string;
  href: string;
  publicHref?: string;
  cta: string;
};

export type RelaunchPublicFirstVisitPath = {
  title: string;
  audience: string;
  detail: string;
  href: string;
  cta: string;
};

export const relaunchPublicHero: RelaunchPublicHero = {
  eyebrow: 'Next Being Lab',
  headline: '障害・難病と仕事設計から始める、AI時代の研究と実装のスタジオ',
  subheadline:
    '働きづらさを個人の問題で終わらせず、仕事・情報・運用・支援・制度の設計課題として読み替える。',
  supportingCopy:
    'Next Being Lab の現在のコアは、働きづらさを仕事設計の課題として読み替えるプロダクト群と、企業・支援者・行政が同じ地図で読める公開コレクションです。いま利用者向けに見せる本線は、仕事設計の見取り図と 26フレームカード版、そして就労支援設計の変革テーマ群です。その他のガイドや個別整理の面は、まだ内部で検証しながら境界を整えています。',
  operatingNote: 'AIが整理と叩き台を進め、人が公開約束と高リスク判断を持つ。',
  primaryCta: 'What We Do から見る',
  secondaryCta: '仕事設計の見取り図を見る',
};

export const relaunchPublicSignals: RelaunchPublicSignal[] = [
  {
    label: '現在のコア',
    value: '見取り図 -> 26カード版',
  },
  {
    label: 'Human-in-Command',
    value: '高リスク判断と対外責任',
  },
  {
    label: '蓄積単位',
    value: '資料 / 判断メモ / 公開資源',
  },
];

export const relaunchPublicFirstVisitPaths: RelaunchPublicFirstVisitPath[] = [
  {
    title: '企業・組織の方へ',
    audience: '記事の続きを実務で考えたい',
    detail:
      '合理的配慮、継続就労、相談導線を、制度説明だけでなく職場設計として整理した補足ページです。',
    href: '/for-enterprise',
    cta: '企業向け整理を見る',
  },
  {
    title: '支援者・行政・当事者の方へ',
    audience: '制度・支援・現場の全体像をつなぎたい',
    detail:
      '見えない障害シリーズ、就労支援設計の変革テーマ群、支援連携の図解、公開動画の入口から、理解と実装の橋渡しを見られます。',
    href: '/resources',
    cta: 'Resourcesを見る',
  },
  {
    title: '現在のコアから知りたい方へ',
    audience: 'NBLがいま何を中核に積み上げているか知りたい',
    detail:
      '困りごとを職場設計として読むための 3レイヤーの地図と、条件読み取りの基礎説明を、NBL の現在のコアとして公開向けにまとめています。',
    href: '/jac-foundations',
    cta: '仕事設計の見取り図を見る',
  },
];

export const relaunchPublicTensions: RelaunchPublicTension[] = [
  {
    title: 'AIで何が変わったか',
    detail:
      '同じ働き方を全員に強いるより、AIで人間の限界を超える実装を回し、その余力で人の参加の器を設計し直す時代に入っています。',
    bullets: [
      '人間の件数処理だけでは届かない速度で比較・整理・下書きが進む',
      'それでも、高リスク判断や不可逆な約束は人が持つ必要がある',
      '価値は単発の応答より、再利用可能な部品が残ることに移る',
    ],
  },
  {
    title: 'NBLが今つくっているもの',
    detail:
      'NBL は、相談をただ受ける窓口ではなく、論点整理、方法論、workflow、理解資源、境界設計を積み上げる社会OSの実装層をつくっています。',
    bullets: [
      '状況を読む単位をそろえる',
      '介入や運用を設計単位へ落とす',
      '次に再利用できる資源と判断境界を残す',
    ],
  },
];

export const relaunchPublicManifesto: RelaunchPublicManifesto[] = [
  {
    title: 'AIで人を不要にするのではない',
    detail:
      '目指すのは、人を機械の代替物として扱うことではなく、人が人として参加できる仕事と社会の器を増やすことです。',
  },
  {
    title: '障害就労は狭い支援テーマではなく、設計課題が見えやすい実装領域',
    detail:
      '働きづらさが表に出る場面では、仕事、情報、運用、支援、制度の歪みが見えやすくなります。NBL はそこから、より広い participation design を考えます。',
  },
  {
    title: '個別対応で終わらず、方法と資源を残す',
    detail:
      '条件マップ、仕事設計の見取り図、手順、基礎図解、説明パック、境界メモを残し、毎回ゼロから始めない運営へ寄せます。',
  },
];

export const relaunchPublicMoves: RelaunchPublicMove[] = [
  {
    step: '01',
    title: '状況を読む',
    detail: '困りごとを、そのまま診断名や印象で扱わず、条件つきの設計課題として読み替えます。',
    proof: '論点整理、条件マップ、関係者が共有できる見取り図',
  },
  {
    step: '02',
    title: '介入を設計する',
    detail: '仕事、情報、運用、相談導線、秘密保持、支援連携を、無理のない実装単位に落とします。',
    proof: '手順、運用メモ、説明文、見取り図を使った設計の叩き台',
  },
  {
    step: '03',
    title: '再利用可能な部品を残す',
    detail: '1件だけで終わらせず、次の現場でも使える資源と意思決定の境界を残します。',
    proof: '図解、動画、境界メモ、ガイド、シリーズとして蓄積',
  },
];

export const relaunchPublicArtifacts: RelaunchPublicArtifact[] = [
  {
    title: '条件マップ',
    detail: '人・仕事・環境・支援・時間・制度を分けて見られる読み取り単位。',
    note: '診断名だけで結論を出さないための土台。',
    href: '/jac-foundations',
    cta: '仕事設計の地図を見る',
  },
  {
    title: '運用の手順',
    detail: '相談導線、配慮運用、説明の順序を、現場で回る手順へ落としたもの。',
    note: '単発助言より、繰り返し使える形を優先。',
    href: '/review/what-we-do',
    publicHref: '/what-we-do',
    cta: 'What We Do を見る',
  },
  {
    title: '図解と説明資源',
    detail: '図解、動画、4コマ、基礎資料を、文脈つきの理解資源として束ねたもの。',
    note: '見えない障害シリーズや変革テーマ群のように、啓発だけで終わらず次の対話へつなぐ。',
    href: '/review/resources-first-release',
    publicHref: '/resources',
    cta: 'Resources を見る',
  },
  {
    title: '判断境界のメモ',
    detail: 'どこまで AI が進め、どこで人が決めるかを明示する公開上のメモ。',
    note: 'Human-in-Command を運用で見えるようにする。',
    href: '/review/operating-loops',
    publicHref: '/operating-model',
    cta: 'Operating Model を見る',
  },
];

export const relaunchPublicLenses: RelaunchPublicLens[] = [
  {
    title: '本人',
    detail: '症状の揺れ、得意なこと、本人の希望や無理の出やすさを見る。',
  },
  {
    title: '仕事',
    detail: '何の仕事を、どの精度と速度で、どこまで担う前提なのかを見る。',
  },
  {
    title: '環境',
    detail: '情報の流れ、対人関係、感覚負荷、管理の仕方など職場環境を見る。',
  },
  {
    title: '支援',
    detail: '配慮、ツール、外部支援、相談導線、秘密保持の設計を見る。',
  },
  {
    title: '時間',
    detail: 'いま一時的なのか、移行期なのか、再発や変動をどう見るかを含める。',
  },
  {
    title: '制度',
    detail: '制度、社内ルール、法的枠組み、責任分担の境界を確認する。',
  },
];

export const relaunchPublicStreams: RelaunchPublicStream[] = [
  {
    id: 'what-we-do',
    title: 'What We Do',
    detail: 'いま外部に約束できること、どこから始めるか、どんな入り方があるか。',
    question: '今、何を頼めるのか。',
    href: '/review/what-we-do',
    publicHref: '/what-we-do',
  },
  {
    id: 'methods',
    title: '仕事設計の見取り図',
    detail:
      'NBL の現在のコアである仕事設計プロダクト群の起点。3レイヤー、条件読み取り、そして 26カード版へどうつながるかを見る。',
    question: 'いまのコアは何か。',
    href: '/jac-foundations',
  },
  {
    id: 'resources',
    title: 'Resources',
    detail: '動画、図解、見えない障害シリーズ、就労支援設計の変革テーマ群などの公開資源。',
    question: 'まず何を使えるのか。',
    href: '/review/resources-first-release',
    publicHref: '/resources',
  },
  {
    id: 'vision',
    title: 'About',
    detail: 'AI時代の人間参加、新しい仕事、participation design の方向。',
    question: 'どこへ向かうのか。',
    href: '/review/about',
    publicHref: '/about',
  },
];

export const relaunchPublicBoundaries: RelaunchPublicBoundary[] = [
  {
    title: 'AI-prepared',
    status: 'AIが進める',
    detail: '比較、整理、叩き台、artifact 化、公開可能な下書きづくり。',
  },
  {
    title: 'Human-reviewed',
    status: '人が境界を持つ',
    detail: '高リスク判断、外部約束、支援・権利に関わる最終判断、実名候補との接続。',
  },
  {
    title: 'Public commitment',
    status: '公開約束',
    detail: '今できること、今は出さないこと、今後の検証対象を混ぜずに示す。',
  },
];

export const relaunchPublicLearningSignals: RelaunchPublicLearningSignal[] = [
  {
    title: '速く試す',
    detail:
      'AIが比較、整理、下書き、再構成を高速に回し、人は止めるべき判断だけを持つことで、試行の回転数を上げます。',
    proof: '指摘 -> 比較 -> 修正 -> 公開 のサイクルを短く回す',
  },
  {
    title: '判断を残す',
    detail:
      'なぜ直したか、どこまで公開するか、どこで人が境界を持つかを、あとから追える形で残します。',
    proof: '判断境界、review、公開文言の変更理由が追える',
  },
  {
    title: '次が速くなる',
    detail:
      'ページ、図解、手順、判断メモが資産として残るので、次の仕事が毎回ゼロから始まらず、精度も速度も上がっていきます。',
    proof: '見取り図、Resources、運用メモが次のラウンドの土台になる',
  },
];

export const relaunchPublicQuestionPaths: RelaunchPublicQuestionPath[] = [
  {
    title: '今、何を頼めるかから入る',
    question: 'NBL は現在、どこまで返せるのか。',
    detail: 'offer、導入の考え方、AIチームが担う範囲を確認する。',
    href: '/review/what-we-do',
    publicHref: '/what-we-do',
    cta: 'What We Do',
  },
  {
    title: '方法論から入る',
    question: '困りごとをどんな単位で読んでいるのか。',
    detail: '仕事設計の見取り図、3レイヤー、そして次に 26カード版で何を確認できるかを見る。',
    href: '/jac-foundations',
    cta: '仕事設計の見取り図',
  },
  {
    title: '公開資源から入る',
    question: 'まず役立つものを見たい。',
    detail: '見えない障害シリーズ、変革テーマ群、動画や図解など、理解資源の入口から入る。',
    href: '/review/resources-first-release',
    publicHref: '/resources',
    cta: 'Resources',
  },
  {
    title: 'ビジョンから入る',
    question: 'なぜこの事業をやるのか。',
    detail: 'AI時代の人間参加と、新しい仕事・社会設計の本丸を見る。',
    href: '/review/about',
    publicHref: '/about',
    cta: 'About',
  },
];
