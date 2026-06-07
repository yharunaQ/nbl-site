export type WorkConditionForumManifestSession = {
  id: string;
  title: string;
  presenter: string;
  style: string;
  slug: string;
  notebookLmReady: boolean;
  hasSlideDeckStructure: boolean;
  hasCoreReasoningContext: boolean;
  status: string;
};

type WorkConditionForumManifest = {
  count: number;
  sessions: WorkConditionForumManifestSession[];
  status: string;
};

export type WorkConditionForumGroup = {
  id: string;
  number: number;
  label: string;
  lead: string;
  range: string;
  accentClass: string;
};

export type WorkConditionForumPresentation = WorkConditionForumManifestSession & {
  number: number;
  groupId: string;
  summary: string;
  photoPosition: string;
  presenterImagePath: string;
  videoUrl: string;
  infographicHref: string;
  textHref: string;
};

export const workConditionForumStyleboardImage =
  '/images/work-condition-forum-22-session-photo-styleboard-v1.webp';

const workConditionForumSessions: WorkConditionForumManifestSession[] = [
  {
    id: 'VF-01',
    title: '雇用率の先へ：人数管理から仕事設計へ',
    presenter: '社会実装編集者',
    style: 'opening keynote',
    slug: 'employment-rate-work-design',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-02',
    title: 'ラベルと言葉の向こうの就労経験',
    presenter: '本人経験の翻訳を担う当事者協働エディター',
    style: 'dialogue keynote',
    slug: 'labels-lived-work-experience',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-03',
    title: '支援ツールボックスの統合：CE、IPS、定着、AT、AI',
    presenter: '支援手法を横断する実践スーパーバイザー',
    style: 'tool integration panel',
    slug: 'support-toolbox-integration',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-04',
    title: '持続可能な雇用成果とは何か',
    presenter: '評価研究者と現場支援責任者の共同クロージング',
    style: 'closing dialogue',
    slug: 'sustainable-employment-outcomes',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-05',
    title: '観察から仕事をつくる：ジョブ分析と職務創出',
    presenter: '職場観察型ジョブコーチ',
    style: 'workshop demonstration',
    slug: 'job-analysis-job-creation',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-06',
    title: '“選択”だけでは足りない：インフォームド・チョイス',
    presenter: '選択支援を専門にする移行支援ファシリテーター',
    style: 'lecture + exercise',
    slug: 'informed-choice-supported-decision',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-07',
    title: '見えない強みを可視化する：プロフィールと支援記録',
    presenter: 'プロフィールと支援記録を扱うチームコーディネーター',
    style: 'practice demo',
    slug: 'profiles-support-records',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-08',
    title: '収入・ベネフィット・キャリアを同時に設計する',
    presenter: '生活設計と就労移行をつなぐ相談員',
    style: 'caution lecture',
    slug: 'income-benefits-career',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-09',
    title: '見えない障害・難病・症状変動を職場で扱う',
    presenter: '健康時間を仕事条件へ翻訳する産業保健・就労支援ブリッジ役',
    style: 'field translation talk',
    slug: 'invisible-health-time-work',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-10',
    title: '就職不安・回避・離脱を支える',
    presenter: '若者の就職不安を扱う移行支援カウンセラー',
    style: 'dialogue session',
    slug: 'job-anxiety-transition-support',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-11',
    title: '“問題行動”を勤務条件のサインとして読む',
    presenter: '行動を環境・作業条件から読み直すケース検討司会者',
    style: 'case review',
    slug: 'behavior-as-work-condition-signal',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-12',
    title: '心理的安全・トラウマ・感覚調整と定着',
    presenter: '心理的安全と感覚調整を扱う職場学習デザイナー',
    style: 'workshop',
    slug: 'psychological-safety-sensory-retention',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-13',
    title: '学校から仕事へ：進路決定で終わらせない',
    presenter: '学校・就労移行・企業をつなぐ移行コーディネーター',
    style: 'panel',
    slug: 'school-to-work-transition-design',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-14',
    title: 'ニューロダイバージェントな若者の成長設計',
    presenter: 'ニューロダイバージェントな若者の育成を扱う人材開発リード',
    style: 'future design talk',
    slug: 'neurodivergent-youth-growth-design',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-15',
    title: 'AAC・コミュニケーション支援を職場へ移す',
    presenter: 'AAC/コミュニケーション支援を職場へ翻訳する専門職',
    style: 'demo',
    slug: 'aac-communication-workplace',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-16',
    title: 'HRを門番から戦略パートナーへ',
    presenter: 'HRを戦略パートナーへ変える企業内推進者',
    style: 'employer talk',
    slug: 'hr-strategic-work-design-partner',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-17',
    title: '企業連携は営業ではない：事業課題から仕事をつくる',
    presenter: '企業課題から役割をつくる事業連携ファシリテーター',
    style: 'workshop',
    slug: 'business-partnership-work-creation',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-18',
    title: '自治体・公的部門をモデル雇用主にする',
    presenter: '自治体人事と支援機関の共同実装チーム',
    style: 'policy-practice panel',
    slug: 'public-sector-model-employer',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-19',
    title: '政策を現場に閉じる：制度と実践のループ',
    presenter: '制度と言葉を現場へ翻訳する政策実装デスク',
    style: 'roundtable',
    slug: 'policy-practice-loop',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-20',
    title: '福祉的就労から地域雇用へ：圧力でなく選択肢として',
    presenter: '福祉的就労から地域雇用への選択肢を扱う境界ファシリテーター',
    style: 'boundary dialogue',
    slug: 'welfare-work-community-employment-choice',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-21',
    title: 'AIは支援者を置き換えるのか、増幅するのか',
    presenter: 'AI safer-useレビューを担う支援技術編集者',
    style: 'technology keynote',
    slug: 'ai-safer-use-support-amplifier',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
  {
    id: 'VF-22',
    title: '測るべきものを測る：品質指標と本人便益',
    presenter: '本人便益を中心に据える評価研究者',
    style: 'research talk',
    slug: 'quality-indicators-worker-benefit',
    notebookLmReady: true,
    hasSlideDeckStructure: true,
    hasCoreReasoningContext: true,
    status: 'series article ready',
  },
];

export const workConditionForumManifest: WorkConditionForumManifest = {
  count: workConditionForumSessions.length,
  status: 'series ready',
  sessions: workConditionForumSessions,
};

export const workConditionForumGroups: WorkConditionForumGroup[] = [
  {
    id: 'session-1',
    number: 1,
    label: '基調・統合',
    lead: '人数、ラベル、手法、成果を、仕事条件の言葉へ戻す。',
    range: 'VF-01-04',
    accentClass: 'border-cyan-700 bg-cyan-50 text-cyan-950',
  },
  {
    id: 'session-2',
    number: 2,
    label: '本人中心の仕事設計',
    lead: '求人票、選択、強み、生活設計を、働く条件として組み直す。',
    range: 'VF-05-08',
    accentClass: 'border-emerald-700 bg-emerald-50 text-emerald-950',
  },
  {
    id: 'session-3',
    number: 3,
    label: '見えない条件と健康時間',
    lead: '症状変動、不安、行動、感覚を、職場運用の問いへ翻訳する。',
    range: 'VF-09-12',
    accentClass: 'border-rose-700 bg-rose-50 text-rose-950',
  },
  {
    id: 'session-4',
    number: 4,
    label: '若者移行とコミュニケーション',
    lead: '進路決定で終わらせず、成長と表現の条件を職場へ渡す。',
    range: 'VF-13-15',
    accentClass: 'border-amber-700 bg-amber-50 text-amber-950',
  },
  {
    id: 'session-5',
    number: 5,
    label: '企業連携と制度実装',
    lead: 'HR、企業、自治体、政策、福祉的就労を同じ仕事条件マップで読む。',
    range: 'VF-16-20',
    accentClass: 'border-indigo-700 bg-indigo-50 text-indigo-950',
  },
  {
    id: 'session-6',
    number: 6,
    label: 'AI・研究・評価',
    lead: 'AIを判断の代替ではなく、問いと根拠を増やす仕組みにする。',
    range: 'VF-21-22',
    accentClass: 'border-slate-700 bg-slate-100 text-slate-950',
  },
];

export const workConditionForumVideoUrls: Record<string, string> = {
  'VF-01': 'https://youtu.be/9kSy-qJtBpU',
  'VF-02': 'https://youtu.be/adqCsx7CASo',
  'VF-03': 'https://youtu.be/Np7ZpP5_cc4',
  'VF-04': 'https://youtu.be/Zck7fR_lCvo',
  'VF-05': 'https://youtu.be/pzlQCk_E-Cs',
  'VF-06': 'https://youtu.be/gQpI0M_Rwfk',
  'VF-07': 'https://youtu.be/MgQ1nAgYzro',
  'VF-08': 'https://youtu.be/v2J8HDL3bzY',
  'VF-09': 'https://youtu.be/M8LrJ-1r1_w',
  'VF-10': 'https://youtu.be/_kQ6QAkzQpI',
  'VF-11': 'https://youtu.be/fkAQYcUjzUI',
  'VF-12': 'https://youtu.be/GIAffbY0JGw',
  'VF-13': 'https://youtu.be/OED99duB5ic',
  'VF-14': 'https://youtu.be/ad8Xtoc8J0s',
  'VF-15': 'https://youtu.be/f9AMBZoJFCo',
  'VF-16': 'https://youtu.be/Efr2N_MGmsw',
  'VF-17': 'https://youtu.be/b2Um5byPdfI',
  'VF-18': 'https://youtu.be/uwsAJ0CQFQQ',
  'VF-19': 'https://youtu.be/bqZxDBj_1t8',
  'VF-20': 'https://youtu.be/OMLwqZ8YmcE',
  'VF-21': 'https://youtu.be/Z2Wyp3Ec-9w',
  'VF-22': 'https://youtu.be/jsnxDOg4-og',
};

export const workConditionForumSummaries: Record<string, string> = {
  'VF-01':
    '雇用率や採用人数は入口として重要です。ただし、その先に役割、評価、相談経路、見直しの仕組みがなければ、働けていることの中身は見えません。人数管理を、参加の質を読む仕事条件設計へ進めます。',
  'VF-02':
    '診断名や属性名は支援への入口になりますが、ラベルだけでは仕事場面で何が起きているかは分かりません。本人が何を説明したいか、どこまで共有するかを守りながら、経験を仕事条件の言葉へ翻訳します。',
  'VF-03':
    'カスタマイズ就業、IPS、定着支援、支援機器、AIは、どれか一つが万能という話ではありません。目の前の仕事条件のどこが詰まっているかを見て、手法を道具として組み合わせます。',
  'VF-04':
    '就職件数や定着期間は大切ですが、それだけでは本人便益や成長、役割の広がりは見えません。続いている状態を、無理が残っていないか、直せる構造があるかという成果の中身から読み直します。',
  'VF-05':
    '求人票に書かれた仕事だけが職場の仕事ではありません。業務の流れを観察し、滞り、負荷、価値、引き継ぎを読みながら、本人の条件と重なる役割を作ります。',
  'VF-06':
    '本人中心は、本人に選択を丸投げすることではありません。比較できる情報、試せる経験、失敗後に戻れる道を整えて、選び直せるインフォームド・チョイスを設計します。',
  'VF-07':
    '強みは性格の中に固定されているのではなく、環境、手順、支援、同意の中で現れます。プロフィールと支援記録を、売り込み文ではなく次の調整へ渡る仕事条件の記録として扱います。',
  'VF-08':
    '働く量を増やすことは前進になり得ますが、収入、制度、通院、疲労、家庭役割、キャリア学習は同時に動きます。生活を守りながら可能性を閉じないため、制度確認とキャリア設計を分けずに見ます。',
  'VF-09':
    '見えない症状や難病、体調変動は、診断名だけでは勤務上の対応に翻訳できません。疲労、通勤、回復時間、連絡トリガー、代替手順を、開示圧力ではなく共有可能な仕事条件として整理します。',
  'VF-10':
    '就職不安や直前の離脱は、意欲不足だけでは説明できません。評価への怖さ、支援終了の不安、失敗後の戻り方の不透明さを読み、怖さを抱えたまま試せる大きさへ仕事を分けます。',
  'VF-11':
    '離席、沈黙、拒否、怒りを単に問題行動として扱うと、前後にある仕事条件を見落とします。行動の影響を曖昧にせず、指示、感覚負荷、予測可能性、安全対応の信号として読み直します。',
  'VF-12':
    '心理的安全は雰囲気ではなく、早めに言えて直せる運用です。トラウマ経験や感覚負荷を個人のメンタル問題だけに閉じず、予測可能性、フィードバック、相談経路、修正手順として設計します。',
  'VF-13':
    '学校から仕事への移行は、進路先が決まった時点で終わりません。生活リズム、通勤、指示の受け方、実習で見えた条件、支援機関との橋渡しを、翌週の月曜日へ引き継ぎます。',
  'VF-14':
    'ニューロダイバージェントな若者を、才能物語にも困難物語にも閉じ込めません。認知スタイル、感覚環境、課題構造、暗黙ルールを見ながら、興味を価値へ変える成長条件を設計します。',
  'VF-15':
    'AACや視覚支援は本人に道具を渡すだけでは職場に根づきません。表現手段、仕事場面、同僚の待ち方、確認の仕方、緊急時経路を含め、職場側の応答設計として移します。',
  'VF-16':
    'HRは採用可否の門番だけではなく、配置、評価、相談経路、管理職支援をつなぐ位置にいます。配慮名を増やすより、役割と責任を運用に落とす仕事条件の戦略パートナーへ変えます。',
  'VF-17':
    '企業連携は雇用をお願いする営業ではありません。品質確認、属人化、滞り、作業分解を一緒に読み、企業の事業課題と本人の条件が重なる意味ある役割を共同設計します。',
  'VF-18':
    '自治体や公的部門は制度を説明する側であると同時に、自らも職場です。失敗しない模範ではなく、調整を記録し、学びを地域へ返せるモデル雇用主としての運用を考えます。',
  'VF-19':
    '政策語は方向を示しますが、現場で誰が何をいつ確認するかに翻訳されなければ動きません。制度の言葉を職場で動く問いへ下ろし、実践から見えた未解決を政策へ戻します。',
  'VF-20':
    '地域雇用は重要な選択肢ですが、圧力になれば本人の安全と選択を壊します。福祉的就労の意味を認めながら、試行条件、生活安全、支援継続、戻れる道をそろえます。',
  'VF-21':
    'AIは支援者を置き換える答え製造機ではなく、問い、根拠、未確認点、反証を増やす道具として使う必要があります。証拠、構造、仮説、判断を分け、人間のレビューを残す使い方を設計します。',
  'VF-22':
    '件数や面談回数など測りやすいものだけを品質指標にすると、支援の方向がずれます。本人便益、役割明確性、相談アクセス、証拠状態を含め、現場に次の問いを返す評価へ変えます。',
};

const photoPositions: Record<string, string> = {
  'VF-01': '12% 15%',
  'VF-02': '50% 13%',
  'VF-03': '84% 14%',
  'VF-04': '16% 36%',
  'VF-05': '50% 36%',
  'VF-06': '84% 36%',
  'VF-07': '16% 57%',
  'VF-08': '50% 57%',
  'VF-09': '84% 57%',
  'VF-10': '16% 77%',
  'VF-11': '50% 77%',
  'VF-12': '84% 77%',
  'VF-13': '16% 90%',
  'VF-14': '50% 90%',
  'VF-15': '84% 90%',
  'VF-16': '22% 24%',
  'VF-17': '58% 24%',
  'VF-18': '78% 30%',
  'VF-19': '28% 68%',
  'VF-20': '60% 68%',
  'VF-21': '78% 72%',
  'VF-22': '48% 48%',
};

export function workConditionForumSessionNumber(id: string): number {
  return Number(id.replace('VF-', ''));
}

export function workConditionForumGroupForId(id: string): WorkConditionForumGroup {
  const number = workConditionForumSessionNumber(id);
  if (number <= 4) return workConditionForumGroups[0];
  if (number <= 8) return workConditionForumGroups[1];
  if (number <= 12) return workConditionForumGroups[2];
  if (number <= 15) return workConditionForumGroups[3];
  if (number <= 20) return workConditionForumGroups[4];
  return workConditionForumGroups[5];
}

export function workConditionForumAssetUrl(kind: 'infographic', id: string): string {
  const number = String(workConditionForumSessionNumber(id)).padStart(2, '0');
  return `/images/work-condition-forum-infographics/vf-${number}.webp`;
}

export function workConditionForumTextUrl(id: string): string {
  return `/preview/work-condition-forum-text/${encodeURIComponent(id)}`;
}

export function workConditionForumPresenterImagePath(id: string): string {
  const paddedNumber = String(workConditionForumSessionNumber(id)).padStart(2, '0');
  return `/images/work-condition-forum-presenters/vf-${paddedNumber}.webp`;
}

export function youtubeEmbedUrl(url: string): string {
  return `https://www.youtube.com/embed/${url.replace('https://youtu.be/', '')}`;
}

export function workConditionForumArticleFileName(session: WorkConditionForumManifestSession) {
  const paddedNumber = String(workConditionForumSessionNumber(session.id)).padStart(2, '0');
  return `vf-${paddedNumber}-${session.slug}-structured-article-v1-2026-06-05.md`;
}

export const workConditionForumPresentations: WorkConditionForumPresentation[] =
  workConditionForumManifest.sessions.map((session) => {
    const group = workConditionForumGroupForId(session.id);
    return {
      ...session,
      number: workConditionForumSessionNumber(session.id),
      groupId: group.id,
      summary: workConditionForumSummaries[session.id],
      photoPosition: photoPositions[session.id] ?? '50% 50%',
      presenterImagePath: workConditionForumPresenterImagePath(session.id),
      videoUrl: workConditionForumVideoUrls[session.id],
      infographicHref: workConditionForumAssetUrl('infographic', session.id),
      textHref: workConditionForumTextUrl(session.id),
    };
  });

export const groupedWorkConditionForumPresentations = workConditionForumGroups.map((group) => ({
  ...group,
  presentations: workConditionForumPresentations.filter(
    (presentation) => presentation.groupId === group.id,
  ),
}));

export function getWorkConditionForumPresentationById(id: string) {
  return workConditionForumPresentations.find((presentation) => presentation.id === id) ?? null;
}

export function getNextWorkConditionForumPresentation(id: string) {
  const currentIndex = workConditionForumPresentations.findIndex(
    (presentation) => presentation.id === id,
  );

  if (currentIndex < 0) {
    return null;
  }

  return workConditionForumPresentations[currentIndex + 1] ?? null;
}
