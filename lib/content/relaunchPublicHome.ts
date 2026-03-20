export type RelaunchPublicHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
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
  headline: 'AIが働く時代に、人間の参加を設計し直す。',
  subheadline:
    'NBL は、障害・難病の雇用支援を重要な実装領域として扱いながら、仕事設計、参加設計、方法論、共有資源を再利用可能な部品として積み上げる AI-native team です。',
  primaryCta: 'NBLが今できることを見る',
  secondaryCta: '仕事設計の見取り図を見る',
};

export const relaunchPublicSignals: RelaunchPublicSignal[] = [
  {
    label: '定常ループ',
    value: '5 loops',
  },
  {
    label: '現在の旗艦領域',
    value: '障害・難病と仕事設計',
  },
  {
    label: '高リスク判断',
    value: 'Human-in-Command',
  },
  {
    label: '更新単位',
    value: 'artifact / decision / resource',
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
    title: '当事者・家族・支援者の方へ',
    audience: '見えにくい困りごとや背景を知りたい',
    detail: '見えない障害シリーズ、基礎図解、公開動画の入口から、理解と実装の橋渡しを見られます。',
    href: '/resources',
    cta: 'Resourcesを見る',
  },
  {
    title: '方法論から知りたい方へ',
    audience: 'NBLがどんな単位で読んでいるか知りたい',
    detail:
      '困りごとを職場設計として読むための 3レイヤーの地図と、条件読み取りの基礎説明を公開向けにまとめています。',
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
      '次に再利用できる artifact と decision を残す',
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
      '条件マップ、仕事設計の見取り図、workflow、基礎図解、説明パック、境界メモを残し、毎回ゼロから始めない運営へ寄せます。',
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
    proof: 'workflow、運用メモ、説明文、見取り図を使った設計の叩き台',
  },
  {
    step: '03',
    title: '再利用可能な部品を残す',
    detail: '1件だけで終わらせず、次の現場でも使える資源と意思決定の境界を残します。',
    proof: '図解、動画、boundary memo、guide、series として蓄積',
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
    title: 'workflow / protocol',
    detail: '相談導線、配慮運用、説明の順序を、現場で回る手順へ落としたもの。',
    note: '単発助言より、繰り返し使える形を優先。',
    href: '/review/what-we-do',
    publicHref: '/what-we-do',
    cta: 'What We Do を見る',
  },
  {
    title: 'explainer / resource pack',
    detail: '図解、動画、4コマ、基礎資料を、文脈つきの理解資源として束ねたもの。',
    note: '啓発だけで終わらず、次の対話へつなぐ。',
    href: '/review/resources-first-release',
    publicHref: '/resources',
    cta: 'Resources を見る',
  },
  {
    title: 'boundary / governance note',
    detail: 'どこまで AI が進め、どこで人が決めるかを明示する判断メモ。',
    note: 'Human-in-Command を運用で見えるようにする。',
    href: '/review/operating-loops',
    publicHref: '/operating-model',
    cta: 'Operating Loops を見る',
  },
];

export const relaunchPublicLenses: RelaunchPublicLens[] = [
  {
    title: 'Person',
    detail: '症状の揺れ、得意なこと、本人の希望や無理の出やすさを見る。',
  },
  {
    title: 'Job',
    detail: '何の仕事を、どの精度と速度で、どこまで担う前提なのかを見る。',
  },
  {
    title: 'Environment',
    detail: '情報の流れ、対人関係、感覚負荷、管理の仕方など職場環境を見る。',
  },
  {
    title: 'Support',
    detail: '配慮、ツール、外部支援、相談導線、秘密保持の設計を見る。',
  },
  {
    title: 'Time',
    detail: 'いま一時的なのか、移行期なのか、再発や変動をどう見るかを含める。',
  },
  {
    title: 'Institution',
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
    title: 'Methods',
    detail: '仕事設計の見取り図、3レイヤー、条件読み取りなどの方法論。',
    question: 'どう考え、どう読むのか。',
    href: '/jac-foundations',
  },
  {
    id: 'resources',
    title: 'Resources',
    detail: '動画、図解、見えない障害シリーズ、基礎資料などの公開資源。',
    question: 'まず何を使えるのか。',
    href: '/review/resources-first-release',
    publicHref: '/resources',
  },
  {
    id: 'vision',
    title: 'Vision',
    detail: 'AI時代の人間参加、新しい仕事、participation design の方向。',
    question: 'どこへ向かうのか。',
    href: '/review/about',
    publicHref: '/about',
  },
  {
    id: 'operating-model',
    title: 'Operating Model',
    detail: 'AIチームがどう回り、どこで人が決め、何を記録として残すのか。',
    question: 'どう運営されるのか。',
    href: '/review/operating-loops',
    publicHref: '/operating-model',
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
    title: '更新が部品として残る',
    detail:
      'サイトの改善は、その場しのぎの文言修正で終わらず、decision、template、resource、method として残る単位で進める。',
    proof: 'artifact / decision / resource が更新単位になる',
  },
  {
    title: '改善理由が追える',
    detail:
      '気づき、比較、統合、public-safe な更新という順で進め、なぜ変わったかを後から追える状態を保つ。',
    proof: 'feedback -> round -> synthesis -> artifact の流れを固定する',
  },
  {
    title: '速さより境界を見せる',
    detail:
      'すべてを自動公開するのでなく、public promise、高リスク判断、外部行動は人が止める前提を visible にする。',
    proof: 'Human-in-Command と weekly red-signal review を維持する',
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
    detail: '仕事設計の見取り図、3レイヤー、設計課題への読み替え方を見る。',
    href: '/jac-foundations',
    cta: 'Methods',
  },
  {
    title: '公開資源から入る',
    question: 'まず役立つものを見たい。',
    detail: '動画や図解など、理解資源の入口から入る。',
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
    cta: 'Vision',
  },
  {
    title: '運営モデルから入る',
    question: 'AI中心といっても、どう回るのか。',
    detail: '定常ループ、判断境界、Founder が止まる条件を確認する。',
    href: '/review/operating-loops',
    publicHref: '/operating-model',
    cta: 'Operating Model',
  },
];
