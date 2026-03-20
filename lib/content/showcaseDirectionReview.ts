export type ShowcaseHero = {
  eyebrow: string;
  headline: string;
  subheadline: string;
};

export type ShowcaseDiagnosis = {
  title: string;
  detail: string;
};

export type ShowcaseDirection = {
  title: string;
  detail: string;
};

export type ShowcasePhase = {
  phase: string;
  title: string;
  detail: string;
};

export type ShowcaseGuardrail = {
  title: string;
  detail: string;
};

export type ShowcaseAgent = {
  role: string;
  focus: string;
  conclusion: string;
};

export const showcaseDirectionHero: ShowcaseHero = {
  eyebrow: 'Showcase Direction',
  headline: '新しい時代のshowcaseにするには、磨くより先に、機構を見せる必要がある。',
  subheadline:
    '今回のマルチエージェント検討では、現行 draft の弱さは `AIっぽい見た目` の不足ではなく、NBL が本当に持っている operating model、artifact、boundary、stream の関係が、訪問体験として十分に知覚できていない点にあると整理された。',
};

export const showcaseAgents: ShowcaseAgent[] = [
  {
    role: 'Visual Systems Director',
    focus: 'タイポグラフィ、構図、色、リズム',
    conclusion:
      'soft gradient と均一なカード列が、整理された SaaS 感を強めている。公的研究ラボと運用マニュアルのあいだのような緊張感が必要。',
  },
  {
    role: 'Content Systems Director',
    focus: 'IAを壊さずに概念を深める',
    conclusion:
      'Home の役割は正しいが、social OS の変換機構が見えない。`concern -> framing -> trial -> reusable artifact` の鎖を示すべき。',
  },
  {
    role: 'AI-Native Experience Director',
    focus: 'AI-native らしさを gimmick にしない',
    conclusion:
      'AI-native はチャットUIや擬人化でなく、loop、artifact、boundary、last updated、review status が見えることによって信頼化される。',
  },
  {
    role: 'Showcase Delivery Director',
    focus: '壊さずに進める段階設計',
    conclusion:
      'まず Home を orchestration shell として強くし、taxonomy を固定し、その後 shared shell で各ページへ広げるのが最短。',
  },
];

export const showcaseDiagnoses: ShowcaseDiagnosis[] = [
  {
    title: '均一な card grammar が、内容の力を平坦化している',
    detail:
      '大きな主張、proof、boundary、navigation が同じ密度と同じ見え方で並ぶため、ページ全体が `整っているが勾配が弱い` 体験になっている。',
  },
  {
    title: 'social OS が説明されているが、機構として知覚されていない',
    detail:
      '何を蓄積し、どう再利用し、どこで人が境界を持つかが、文章では書かれているが、閲覧体験としては見えにくい。',
  },
  {
    title: '障害就労の位置づけが analytical ではなく section 化されやすい',
    detail:
      '重要な旗艦領域である一方、単なる1セクションに見えると、狭い障害者雇用サイトにも見えうる。領域の意味づけを設計論として示す必要がある。',
  },
  {
    title: 'public draft の visible surface に staging language が混じる',
    detail:
      'hidden review の便利さが、そのまま visible copy に漏れると authority が落ちる。review utility は残しても、visible surface は完成形に近づけるべき。',
  },
];

export const showcaseDirections: ShowcaseDirection[] = [
  {
    title: 'Friendly AI SaaS ではなく civic systems futurism へ寄せる',
    detail:
      '親切で丸い SaaS aesthetic ではなく、公共性、研究性、運用性が同居する空気をつくる。色数は絞り、雰囲気は一つに寄せる。',
  },
  {
    title: 'Mechanism first にする',
    detail:
      'abstract claim を増やすより、`How NBL works in 3 moves`、`What accumulates`、`Operating note` を通して、動く仕組みを先に見せる。',
  },
  {
    title: 'Question-led routing へ変える',
    detail:
      '訪問者セグメントではなく、`今何を知りたいか` を起点に入り口を分ける。Home は router としての役割を強める。',
  },
  {
    title: '障害就労の説明は six-lens に立ち戻る',
    detail:
      '診断中心ではなく、Person / Job / Environment / Support / Time / Institution の相互作用として見る構造を visible に置く。',
  },
  {
    title: 'Next Horizon は raw future nav にしない',
    detail:
      'future vision は About / Vision に内包し、public の正面ではまだ peer stream にしない。showcase は hype でなく統治感からつくる。',
  },
];

export const showcasePhases: ShowcasePhase[] = [
  {
    phase: 'Phase 0',
    title: 'taxonomy と public promise を固定する',
    detail:
      'Home / What We Do / Methods / Resources / Vision / Operating Model の関係をそろえ、raw Next Horizon を public peer にしない。',
  },
  {
    phase: 'Phase 1',
    title: 'Home を evidence-first の orchestration shell にする',
    detail:
      '3 moves、artifact layer、six-lens、governance、question router を入れ、claims を proof に近づける。',
  },
  {
    phase: 'Phase 2',
    title: 'shared shell を What We Do / JAC / Resources / About へ広げる',
    detail:
      'hero、section header、governance label、CTA の文法をそろえ、ページごとの差ではなくシステムの一貫性で質を上げる。',
  },
  {
    phase: 'Phase 3',
    title: 'operating evidence と learning trail を公開化する',
    detail:
      'last updated、artifact recency、method changelog、boundary label を軽く見せ、AI-native 組織としての継続学習を表現する。',
  },
];

export const showcaseGuardrails: ShowcaseGuardrail[] = [
  {
    title: '抽象論を足しすぎない',
    detail:
      '新しい概念は downstream owner page があるものだけ足す。Home は position と routing に徹する。',
  },
  {
    title: '障害就労を診断中心で語らない',
    detail:
      '一般化された disability awareness ではなく、仕事・環境・支援・時間・制度との相互作用として扱う。',
  },
  {
    title: '擬人化AIや疑似相談UIを front に置かない',
    detail:
      'この領域では、相談・権利・診断に見える誤認が大きな trust risk になる。',
  },
  {
    title: 'future vision が present-day support を上書きしない',
    detail:
      'Horizon 2 を語るときも、Horizon 1 の現実の R&D と public-safe な役立ちを前に残す。',
  },
];
