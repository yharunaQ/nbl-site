import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Ear,
  FileSearch,
  Handshake,
  Network,
  Route,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

export type NextSiteCandidateSection = {
  label: string;
  body: string;
  bullets: string[];
};

export type NextSiteCandidatePage = {
  id: string;
  label: string;
  slugCandidate: string;
  audience: string;
  pagePromise: string;
  eyebrow: string;
  headline: string;
  lead: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  sections: NextSiteCandidateSection[];
  sourceStatus: string;
  boundary: string;
  icon: LucideIcon;
};

export type WorkDesignMapNode = {
  id: string;
  label: string;
  firstQuestion: string;
  icon: LucideIcon;
};

export type WorkDesignStudioScenario = {
  id: string;
  title: string;
  workplace: string;
  artificialCase: string;
  startingQuestion: string;
  employerRead: string;
  practitionerRead: string;
  designMoves: string[];
  supportQuestions: string[];
  redFlags: string[];
  output: string;
  contactPointIds: string[];
};

export const nextSiteCandidateBundleIntro = {
  title: '働きづらさを、仕事条件から考える。',
};

export const workDesignMapNodes: WorkDesignMapNode[] = [
  {
    id: 'WM-01',
    label: '健康時間',
    firstQuestion: '勤務量、休憩、通院、回復、代替は評価条件とつながっているか。',
    icon: TimerReset,
  },
  {
    id: 'WM-02',
    label: '仕事接触点',
    firstQuestion: 'やりにくさは、作業、道具、場所、情報、確認、評価のどこで起きているか。',
    icon: BriefcaseBusiness,
  },
  {
    id: 'WM-03',
    label: '情報と手順',
    firstQuestion: '情報は、形式、タイミング、確認方法、責任分担まで設計されているか。',
    icon: Ear,
  },
  {
    id: 'WM-04',
    label: '開示境界',
    firstQuestion: '誰に、何を、どこまで、どの手順で共有し、何を共有しないか。',
    icon: ShieldCheck,
  },
  {
    id: 'WM-05',
    label: '入口以前',
    firstQuestion: '求人条件へ近づく前に、生活、健康、訓練、支援、説明の何が必要か。',
    icon: Route,
  },
  {
    id: 'WM-06',
    label: '支援と再翻訳',
    firstQuestion: '状況が変わったとき、誰が何を誰へ翻訳し直しているか。',
    icon: Handshake,
  },
  {
    id: 'WM-07',
    label: '評価と参加の質',
    firstQuestion: '条件付き遂行は、役割、技能、評価、処遇、将来見通しへつながっているか。',
    icon: BadgeCheck,
  },
];

export const workDesignStudioScenarios: WorkDesignStudioScenario[] = [
  {
    id: 'WDS-01',
    title: '月末締切が集中する事務チーム',
    workplace: '中小企業のバックオフィス。月末に請求、確認、社内連絡が集中する。',
    artificialCase:
      'ある担当者は、月末近くに通院と疲労回復の時間が必要になりやすい。周囲は「休むかどうか」だけを気にしているが、実際には締切、確認、代替、評価が一緒に絡んでいる。',
    startingQuestion:
      'この場面を「欠勤リスク」ではなく、健康時間と締切設計の問題として読み直せるか。',
    employerRead:
      '人員配置だけでなく、締切の分散、確認の前倒し、代替できる作業と本人でないと難しい作業を分けて見る。',
    practitionerRead:
      '本人の説明を、勤務時間、作業量、回復余白、評価条件、相談経路へ翻訳する。',
    designMoves: [
      '月末に集中する確認作業を週内で分散する。',
      '締切前の進捗確認を短く定例化する。',
      '代替可能な入力作業と本人確認が必要な作業を分ける。',
      '試行期間と見直し時点を先に置く。',
    ],
    supportQuestions: [
      '体調変動はどの曜日・時間帯・作業負荷で起きやすいか。',
      '職場が先に知る必要がある情報と、共有しなくてよい情報は何か。',
      '評価は結果だけか、調整後の遂行条件も含めて見直せるか。',
    ],
    redFlags: [
      '診断名から勤務可否を決める。',
      '通院情報を広く共有させる。',
      '短期の試行を恒久的な配慮判断として扱う。',
    ],
    output: '締切分散案、共有境界、試行期間、評価条件の確認メモ。',
    contactPointIds: ['WM-01', 'WM-03', 'WM-06', 'WM-07'],
  },
  {
    id: 'WDS-02',
    title: '作業手順の変更が現場に残らない',
    workplace: '店舗・現場系チーム。日ごとに担当者と作業順が少し変わる。',
    artificialCase:
      'ある作業者は、口頭だけの指示変更や急な担当交代でミスが増える。周囲は「コミュニケーションの問題」と呼ぶが、手順、見本、確認、責任分担が曖昧である。',
    startingQuestion:
      'この場面を「理解力」や「伝え方」だけでなく、情報が仕事手順になっているかとして読めるか。',
    employerRead:
      '説明の量ではなく、誰が見ても確認できる手順、変更履歴、安全確認、エラー時の戻り方を見る。',
    practitionerRead:
      '本人に合う説明形式だけでなく、職場全体の手順化、確認ループ、相談経路を確認する。',
    designMoves: [
      '変更点だけを残す小さな手順メモを作る。',
      '作業開始前の確認を30秒で行う。',
      'ミスが起きた時の戻り先を個人責任ではなく手順に入れる。',
      '支援者が、本人特性ではなく仕事手順の改善点として共有する。',
    ],
    supportQuestions: [
      '変更はどの形式なら現場に残るか。',
      '誰が確認したら作業開始できるか。',
      'ミスの検出と修正は、本人だけに寄っていないか。',
    ],
    redFlags: [
      '本人の理解力や障害名を主説明にする。',
      '支援者が職場手順を見ずに本人訓練だけを増やす。',
      '安全確認を個人努力にする。',
    ],
    output: '手順化する情報、確認ループ、責任分担、支援者の翻訳メモ。',
    contactPointIds: ['WM-02', 'WM-03', 'WM-06'],
  },
  {
    id: 'WDS-03',
    title: '動線と道具で担当範囲が狭くなる',
    workplace: '軽作業・受付・庶務が混ざる職場。移動、姿勢、端末、保管場所が分散している。',
    artificialCase:
      'ある人は、仕事の一部は安定してできるが、物の置き場所、移動回数、姿勢、端末位置が重なる場面で疲労や遅れが出る。職場は「できる仕事だけ担当」で済ませようとしている。',
    startingQuestion:
      'この場面を「できる/できない」ではなく、仕事接触点が役割と参加範囲を狭めていないかとして読めるか。',
    employerRead:
      '担当範囲を削る前に、動線、道具配置、姿勢、確認方法、エラー許容度を点検する。',
    practitionerRead:
      '本人の強みが活きる作業と、接触点で閉じている作業を分けて職場に説明する。',
    designMoves: [
      'よく使う物の置き場所と移動回数を見直す。',
      '姿勢変更や休憩を作業手順に入れる。',
      '担当を減らす前に、道具と配置を試す。',
      '役割と評価が狭くならないかを確認する。',
    ],
    supportQuestions: [
      '疲労や遅れは、どの作業接点で起きるか。',
      '担当範囲の縮小は一時的か、役割固定になっていないか。',
      '評価や技能形成から外れていないか。',
    ],
    redFlags: [
      'できない作業を減らすだけで終える。',
      '道具や動線を見ずに本人の能力問題にする。',
      '役割を狭めたまま評価だけを下げる。',
    ],
    output: '接触点の見直し、役割の保護、試行条件、評価への接続メモ。',
    contactPointIds: ['WM-02', 'WM-07', 'WM-06'],
  },
  {
    id: 'WDS-04',
    title: '開示範囲と評価面談が混ざる',
    workplace: '人事面談と現場評価が近い小規模組織。相談相手も評価者も同じ人になりやすい。',
    artificialCase:
      'ある社員は、体調や特性をどこまで話すか迷っている。職場は「早く言ってくれれば対応できる」と言うが、本人は評価や配置にどう影響するか分からず不安が強い。',
    startingQuestion:
      'この場面を「言う/言わない」ではなく、仕事に必要な共有範囲と評価境界の設計として読めるか。',
    employerRead:
      '共有目的、共有先、記録、評価との分離、見直し時点を先に決める。',
    practitionerRead:
      '本人の説明負担を下げ、仕事に必要な条件だけを安全に共有する文脈を整える。',
    designMoves: [
      '面談の目的を、相談、業務調整、評価で分ける。',
      '共有する情報と共有しない情報を先に書き分ける。',
      '記録の扱いと見直しの時点を明確にする。',
      '支援者が必要に応じて仕事条件の言葉へ翻訳する。',
    ],
    supportQuestions: [
      '何を共有すると仕事条件の調整に役立つか。',
      '共有先は誰で、評価者とはどう分けるか。',
      '共有した情報を後で見直したり撤回したりできるか。',
    ],
    redFlags: [
      '開示を本人の勇気だけに任せる。',
      '病名や症状を広く共有させる。',
      '相談内容をそのまま評価材料にする。',
    ],
    output: '共有境界、面談分離、記録範囲、見直し条件のメモ。',
    contactPointIds: ['WM-04', 'WM-06', 'WM-07'],
  },
];

export const nextSiteCandidatePages: NextSiteCandidatePage[] = [
  {
    id: 'NS-01',
    label: '全体入口',
    slugCandidate: '/next/top',
    audience: '初めて読む人 / 支援者 / 企業担当者 / 研修・政策・研究に関わる人',
    pagePromise: '働きづらさを、本人の状態だけでなく仕事条件の重なりとして読める入口にする。',
    eyebrow: '見えなかった関係を読む入口',
    headline: '見えなかった関係を、仕事条件の地図へ。',
    lead:
      '障害者雇用や難病就労支援に長く残る難しさを、本人、仕事、環境、支援、時間、制度の相互作用として読み直します。',
    primaryActionLabel: '課題の地図を見る',
    secondaryActionLabel: '5つの入口を見る',
    sections: [
      {
        label: '入口',
        body: '読者が、場面、相談、学習、記事、教材のどこから入るか選べるようにする。',
        bullets: ['場面でつかむ', '相談で深める', '記事や教材へ広げる'],
      },
    ],
    sourceStatus: 'public site surface; public-use review pending.',
    boundary: '個別相談、医療・法務・雇用判断、合理的配慮妥当性の結論は扱わない。',
    icon: Sparkles,
  },
  {
    id: 'NS-02',
    label: '相談事例集',
    slugCandidate: '/next/work-design-map',
    audience: '相談の一言から考え始める人 / 支援者 / 企業担当者',
    pagePromise: '断片的な相談を、複数の読み筋、追加確認、次の行動候補へ変える。',
    eyebrow: 'プロダクト 01',
    headline: '仕事条件で読む相談事例集',
    lead:
      '「疲れやすい」「手順が変わるとつらい」などの一言を、本人だけの問題で止めず、仕事条件として問い直します。',
    primaryActionLabel: '相談事例を読む',
    secondaryActionLabel: '理論を読む',
    sections: [
      {
        label: '使い方',
        body: '近い相談から入り、読み筋、確認したいこと、次に見るページへ進む。',
        bullets: ['断定しない', '複数の仮説を置く', '仕事条件へ戻す'],
      },
      {
        label: '見られるもの',
        body: '相談者の入口、止まりやすい問い、広げた問い、7接点、追加情報後の読み。',
        bullets: ['入口の言葉', '構造化', '次の一手'],
      },
    ],
    sourceStatus: 'consultation case collection product surface; public-use review pending.',
    boundary: '医学、法務、雇用、合理的配慮の最終判断には使わない。',
    icon: ClipboardList,
  },
  {
    id: 'NS-03',
    label: '21視点ガイド',
    slugCandidate: '/next/work-design-tools',
    audience: '企業経営・雇用管理・専門支援・制度設計を学びたい人',
    pagePromise: 'これからのインクルーシブな仕事設計を、21の観測点で学べるガイドにする。',
    eyebrow: 'プロダクト 02',
    headline: '21視点ガイド',
    lead:
      '個別相談への回答ではなく、企業、支援、制度、研修で使える未来志向の仕事設計ガイドです。',
    primaryActionLabel: '21視点を見る',
    secondaryActionLabel: '相談事例集へ',
    sections: [
      {
        label: '使う先',
        body: '経営、雇用管理、専門支援、制度・政策の4領域へ持ち込む。',
        bullets: ['組織設計', '支援設計', '社会設計'],
      },
      {
        label: '見る面',
        body: '仕事参加を、時間・入口、翻訳・支援、職場・価値の3面から読む。',
        bullets: ['健康時間', '情報と支援', '評価と参加の質'],
      },
    ],
    sourceStatus: 'work-design guide surface; public-use review pending.',
    boundary: '公式基準、チェックリスト、個別ケースの結論として扱わない。',
    icon: Network,
  },
  {
    id: 'NS-04',
    label: '場面から入る',
    slugCandidate: '/next/work-design-studio',
    audience: '企業担当者 / 支援者 / 企業支援・研修担当者',
    pagePromise: '実在ケースを扱わず、架空の職場場面で仕事設計の読み方を試せるようにする。',
    eyebrow: '入口ストーリー',
    headline: '場面から入る',
    lead:
      'タテ割り支援で見えにくくなった状況を、直感的なストーリーとして見える化します。',
    primaryActionLabel: '場面を読む',
    secondaryActionLabel: '相談事例集へ',
    sections: [
      {
        label: '4つの場面',
        body: '月末締切、作業手順、動線と道具、開示と評価など、実在情報を使わない場面で構造を読む。',
        bullets: ['企業側と支援者側の読みを並べる', '設計変更案を確認条件として置く', '赤旗を示す'],
      },
    ],
    sourceStatus: 'artificial scenario surface; no real employer review assumed.',
    boundary: '実在ケース、法的安全保証、採用・配置・配慮妥当性判断に使わない。',
    icon: Building2,
  },
  {
    id: 'NS-05',
    label: '記事集',
    slugCandidate: '/next/policy-research',
    audience: '政策・研究関係者 / 支援機関 / 企業研修担当',
    pagePromise: 'SNSやニュースの短い問いを、職場で話せる働き方の問いへひらく。',
    eyebrow: '社会の問い',
    headline: '働き方の問いをひらく記事集',
    lead:
      'SNSやニュースで出る短い疑問を、賛否や相談回答で終わらせず、職場で観察できる条件と次に話す問いへひらくページです。',
    primaryActionLabel: '記事を読む',
    secondaryActionLabel: '21視点ガイドも読む',
    sections: [
      {
        label: '記事集の使い方',
        body: '短い投稿で生まれた違和感を、記事、図解、読後に話す問い、次に読むページへつなぐ。',
        bullets: ['結論で閉じない', '個人情報を書かずに読める', '仕事条件へ戻す'],
      },
    ],
    sourceStatus: 'article library surface; live verification required before current policy claims.',
    boundary: '現行制度・法令解釈・公式見解・政策評価を断定しない。',
    icon: FileSearch,
  },
  {
    id: 'NS-06',
    label: '認知補助ツールキット',
    slugCandidate: '/next/partnership',
    audience: '研修担当 / 支援機関 / 企業支援者 / 共同研究候補',
    pagePromise: '文章だけでは伝わりにくい働きづらさを、図解、音、ワーク、動画、場面へ変換する。',
    eyebrow: 'プロダクト 05',
    headline: '認知補助ツールキット',
    lead:
      '文章だけでは共有しにくい働きづらさを、図解、場面、ワークシート、音の入口、読み下しへ分け、会議や研修で使えるパッケージとして届けます。',
    primaryActionLabel: 'ツールを見る',
    secondaryActionLabel: '場面から入る',
    sections: [
      {
        label: '届け方',
        body: '多くの言葉では伝わりにくいことを、見て、聞いて、一緒に手を動かせる形へ変える。',
        bullets: ['図解', '音楽', 'ワークショップ', '自己チェック'],
      },
    ],
    sourceStatus: 'toolkit surface; public-use review pending.',
    boundary: '成果保証、個別相談、医学・法務・雇用判断には使わない。',
    icon: Handshake,
  },
  {
    id: 'NS-07',
    label: '理論と発見',
    slugCandidate: '/next/work-assessment-concept',
    audience: 'サイト全体の根拠を知りたい読者 / 支援者 / 企業担当者 / 研修担当',
    pagePromise: '古くて新しい課題を、人間の過重な認知負荷と相互作用の問題として示す。',
    eyebrow: 'なぜ可能か',
    headline: '見えなかった関係を、仕事条件の知識ネットワークへ。',
    lead:
      '公開情報をICF準拠の相互作用フレームとAIの文脈読解で整理し、相談事例集、21視点、記事、場面、図解ツールへ展開する考え方を示します。',
    primaryActionLabel: '理論を読む',
    secondaryActionLabel: 'プロダクト群を見る',
    sections: [
      {
        label: '古くて新しい問題',
        body: '困難は本人の中だけにも、職場の中だけにもない。複数条件の相互作用として読む必要がある。',
        bullets: ['人、仕事、環境、支援、時間、制度が絡む', '単純な検索や要約では偏りが残る', '人間が同時に保持するには認知負荷が高い'],
      },
    ],
    sourceStatus: 'method background surface; public-use review pending.',
    boundary: '個別対応の正解、法的・医療・人事判断、配慮妥当性を決めない。',
    icon: Network,
  },
  {
    id: 'NS-08',
    label: 'このサイトについて',
    slugCandidate: '/next/about',
    audience: '初めて読む人 / 支援者 / 企業担当者 / 研修・政策・研究に関わる人',
    pagePromise: 'NBLとは何か、創設者は誰か、どこへ連絡できるか、どこから先を扱わないかを示す。',
    eyebrow: 'Next Being Lab',
    headline: 'NBLについて',
    lead: 'NBLの基本情報、創設者、連絡先、情報の扱い方、個別判断をしない境界を確認できます。',
    primaryActionLabel: 'お問い合わせ',
    secondaryActionLabel: '全体入口へ',
    sections: [
      {
        label: 'NBLとは',
        body: 'Next Being Lab（NBL）は、インクルーシブ就労支援の実践知識を開発・提供する知識プラットフォームです。',
        bullets: ['起点は就労支援', '広げる先は仕事設計と社会設計', '個別相談窓口ではない'],
      },
    ],
    sourceStatus: 'site information surface; public-use review pending.',
    boundary: 'サイトの使い方ガイド、個別相談、医学・法務・雇用判断、合理的配慮妥当性を扱わない。',
    icon: UsersRound,
  },
  {
    id: 'NS-09',
    label: '障害種類から見る',
    slugCandidate: '/next/work-condition-window',
    audience: '障害種類・疾病名から考え始めた読者 / 支援者 / 企業担当者 / 研修担当',
    pagePromise: '障害種類・疾病名を入口にしつつ、仕事条件の発見へ広げる。',
    eyebrow: '障害種類・疾病名から見る仕事条件',
    headline: '障害種類・疾病名から、職場条件へ。',
    lead:
      '発達障害、精神障害、難病、内部障害などの名前から調べ始めた時に、特性理解だけで止めず、時間、情報、環境、動線、評価、支援のどこを確認すればよいかへ進みます。',
    primaryActionLabel: '10分類を見る',
    secondaryActionLabel: '相談事例集へ',
    sections: [
      {
        label: '障害種類・疾病名から探せる',
        body: '読者が診断名、障害種類、疾病名から考え始めることを入口として受け取り、仕事条件へ視界を広げる。',
        bullets: ['名前を入口にする', '結論にはしない', '他のプロダクトへ接続する'],
      },
    ],
    sourceStatus: 'Heron disability work-design series reviewed as reuse candidate; public-use review pending.',
    boundary: '病名・障害名から支援策、就労可否、医学判断、法的判断、合理的配慮妥当性を直接導かない。',
    icon: SearchCheck,
  },
];
