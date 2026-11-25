// Source-mapped editorial questions, not original survey items, a validated
// scale, a causal model, or an assessment of a named person.
export const supportResearch = {
  r134: {
    title: 'NIVR No.134（2017）',
    url: 'https://www.nivr.jeed.go.jp/research/report/houkoku/p8ocur0000000o15-att/houkoku134.pdf',
    role: '支援内容と、機関の方針・評価・資源、地域連携を捉える調査。回答者から見た状況と統計的な関連であり、機関の格付けではありません。',
  },
  r147: {
    title: 'NIVR No.147（2019）',
    url: 'https://www.nivr.jeed.go.jp/research/report/houkoku/p8ocur0000000n97-att/houkoku147.pdf',
    role: '本人と企業の双方を就職前から就職後まで支える共通基盤。訓練だけにも、就職させるだけにも縮めないための参照資料です。',
  },
  r167: {
    title: 'NIVR No.167（2023）',
    url: 'https://www.nivr.jeed.go.jp/research/report/houkoku/h3iskd0000005pbm-att/houkoku167.pdf',
    role: '実際の支援、外部との連携、理念、組織的育成を分けて確認する調査。理念への賛同だけから実践や成果を判定しません。',
  },
  r180: {
    title: 'NIVR No.180（2025）',
    url: 'https://www.nivr.jeed.go.jp/research/report/houkoku/uu6opd0000000ltk-att/houkoku180.pdf',
    role: '16領域65項目の知識・スキルと育成方法を整理。巻末資料8には研修・助言援助ニーズ用チェックリストがあります。本ツールは技能試験ではなく、実践と実施条件を見直す道具です。',
  },
} as const;
export type SupportMode = 'organization' | 'practice';

// Editorial navigation only: these themes are not a source-derived taxonomy or a score.
export function supportToolHref(theme?: string, view: SupportMode = 'organization') {
  const base = '/preview/axiom-next-nbl-v2/support-organization-checklist';
  return theme ? `${base}?theme=${encodeURIComponent(theme)}&view=${view}#support-workbench` : base;
}
export const supportModeLabels = {
  organization: '就労支援機関チェックリスト',
  practice: '支援者の支援内容チェック',
} as const;
export const practiceAnswerLabels = {
  direct: '自機関で実施',
  joint: '他機関と協働して実施',
  partner: '主に他機関が実施',
  partial: '人・場面によって異なる',
  missing: '必要だが実施できていない',
  no_opportunity: '該当する機会がない',
  unknown: '実際の状況は不明',
} as const;
export const organizationAnswerLabels = {
  working: '必要な時に使えている',
  fragile: '担当者や場面に依存する',
  partner: '他機関との分担で確保',
  missing: '必要だが確保できていない',
  no_opportunity: '該当する機会がない',
  unknown: '実際の状況は不明',
} as const;
export type PracticeAnswer = keyof typeof practiceAnswerLabels;
export type OrganizationAnswer = keyof typeof organizationAnswerLabels;
export type SupportAnswers = {
  practice: Record<string, PracticeAnswer>;
  organization: Record<string, OrganizationAnswer>;
};
type SourceAnchor = { report: keyof typeof supportResearch; location: string };
type Check = { question: string; observe: string; sources: SourceAnchor[] };
export type SupportCheck = {
  id: string;
  short: string;
  title: string;
  opening: string;
  practice: Check;
  organization: Check;
  action: string;
  owner: string;
  firstStep: string;
  revisit: string;
  caution: string;
  guide: string;
  guideLabel: string;
  case: string;
  caseLabel: string;
};

// Eight navigational themes, not eight research factors or an exhaustive
// competency taxonomy. Sources belong to individual questions, not just a footer.
export const organizationChecks: SupportCheck[] = [
  {
    id: 'choice',
    short: '希望と選び直し',
    title: '働く希望を、具体的な選択肢にする',
    opening:
      '「働きたい」も「今は決められない」も、支援者の結論に置き換えない。仕事を知る機会と、選び直せる余地を用意します。',
    practice: {
      question:
        '本人の希望と強みを確かめ、仕事や支援の選択肢を本人が比べられるようにしていますか。',
      observe:
        '家族・支援者の希望と区別します。説明したかだけでなく、保留・断る・選び直すことができるかを確認します。',
      sources: [
        { report: 'r180', location: '概要 p.2：領域⑤・⑦・⑨・⑪' },
        { report: 'r167', location: 'p.305：実務者票 問10⑤' },
      ],
    },
    organization: {
      question:
        '本人が保留や別の選択をした時も、方針や計画を見直せる相談・承認の仕組みがありますか。',
      observe:
        '就職目標だけで急がせていないか。希望を確認する時間と方法、意見が食い違う時の相談先を確認します。',
      sources: [
        { report: 'r134', location: 'p.180：問14①②④' },
        { report: 'r180', location: '概要 pp.2–3：自己決定支援と組織的育成' },
      ],
    },
    action:
      '支援計画で「本人が望むこと」「支援側の提案」「まだ決めていないこと」を区別し、選び直した時の担当を決める。',
    owner: '支援担当者と計画の責任者。本人の選択は本人が行います。',
    firstStep: '計画様式を一つ開き、本人と支援者の意向が同じ欄になっていないか確認する。',
    revisit: '保留や辞退が不利益扱いされていないか。言いやすい方法で希望を確認できたか。',
    caution:
      '働くことを望まない人に、就労への同意を求めるチェックではありません。切迫した安全や権利の問題への対応は、この点検を待たせません。',
    guide: 'WDG2-01',
    guideLabel: '相談と意思決定の共通基盤',
    case: 'person-words-without-proxy-takeover',
    caseLabel: '本人の言葉を、周囲の意向で置き換えない',
  },
  {
    id: 'work',
    short: '実際の仕事で確かめる',
    title: '「まだ準備不足」の先に、働ける条件を探す',
    opening:
      '施設内の評価で難しさが見えても、すべての仕事で同じとは限りません。何の仕事を、どの条件で行うかまで確かめます。',
    practice: {
      question:
        '本人が望む仕事の要求と、教え方・道具・時間などを変えた時の遂行を、実際の仕事に結びつけて確かめていますか。',
      observe:
        '検査や訓練に加え、職場見学・実習等で「できた条件／難しかった条件」を確認します。計画があることと、実施したことは別です。',
      sources: [
        { report: 'r134', location: 'p.179：問11③④⑥' },
        { report: 'r167', location: 'p.304：実務者票 問8②④' },
      ],
    },
    organization: {
      question:
        '一般的な準備性だけで就職活動を一律に待たせず、実際の仕事と必要な支援を検討できる方針・担当・時間がありますか。',
      observe:
        '生活・体調の課題が残る場合も、本人が希望すれば、仕事の選択肢と継続支援を並行して検討できるか。訪問・実習調整を業務として扱えるかを確認します。',
      sources: [
        { report: 'r147', location: 'pp.16–19：表1-1と職業生活支援のケースマネジメント' },
        { report: 'r134', location: 'p.180：問14①③④' },
      ],
    },
    action:
      '「準備が整うまで待つ」という判断に、想定する仕事・難しい条件・調整して確かめる方法・見直す時期を加える。',
    owner: '支援計画の責任者、企業開拓・実習調整担当、必要に応じて職業評価の専門職',
    firstStep:
      '職場見学や仕事の情報収集を、訓練の全課題を終える前にも行えるか、現在の運用を確認する。',
    revisit:
      '確かめた条件で仕事の選択肢や計画が変わったか。実習でできたことを別の職場へ無条件に一般化していないか。',
    caution:
      '評価・訓練を省くことでも、先に就職させることでもありません。本人の希望、健康、安全、企業が実際に用意できる条件を確かめます。',
    guide: 'WDG2-06',
    guideLabel: '採用・実習と就職後をつなぐ備え',
    case: 'job-condition-placement-comparison',
    caseLabel: '職種名が同じでも、実際の仕事条件が違う時',
  },
  {
    id: 'employer',
    short: '企業と仕事をつくる',
    title: '求人票との照合から、企業の仕事の相談へ',
    opening:
      '既存の求人条件に合う人を探すだけでなく、企業が必要としている仕事と、本人の強みを活かせる担当の組合せを探します。',
    practice: {
      question:
        '企業の人材・業務上のニーズを聞き、作業や職務の組合せ、教え方、評価の仕方を企業と検討していますか。',
      observe:
        '雇用への理解を求める説明だけでなく、どの仕事に貢献できるかを確認します。本人が望む役割・収入・成長も含めます。',
      sources: [
        { report: 'r134', location: 'p.179：問11⑦⑨' },
        { report: 'r180', location: '概要 p.2：領域④・⑭' },
      ],
    },
    organization: {
      question:
        '企業訪問や職務の調整を担当でき、現場で仕事・人員・評価を決める人と話せる体制がありますか。',
      observe:
        '開拓件数だけでなく、業務を理解する時間、訪問の承認、企業の決定者への経路を確認します。外部の企業支援担当との分担も選べます。',
      sources: [
        { report: 'r134', location: 'p.180：問14②③⑤' },
        { report: 'r167', location: 'pp.304–305：実務者票 問8⑤・問9⑦' },
      ],
    },
    action:
      '企業への聞き取りに「必要な仕事・詰まっている工程・任せる条件」を加え、職務を調整できる人との相談枠をつくる。',
    owner: '企業支援担当と管理者、企業側の業務・人員配置の責任者',
    firstStep:
      '既存の訪問の打合せ項目を見直す。専任者がいなければ、企業支援を担う連携先と役割を分ける。',
    revisit:
      '担当する仕事と企業の必要性が結びついたか。単純作業への固定、同僚への無理な負担移転、本人が望まない役割縮小がないか。',
    caution:
      '企業の生産性だけで本人の価値や支援の必要性を決めません。支援者が職務・賃金変更を一方的に約束することもできません。',
    guide: 'WDG2-03',
    guideLabel: '仕事の分け方・進め方の共通基盤',
    case: 'job-condition-placement-comparison',
    caseLabel: '配属先を、仕事の条件まで比べて選ぶ',
  },
  {
    id: 'adjustment',
    short: '職場で使える支援',
    title: '助言を、職場で動く調整に変える',
    opening:
      '配慮事項を伝えて終わらず、本人・職場・支援者が「誰が、いつ、どう行うか」まで共有します。',
    practice: {
      question:
        '本人が共有を望む範囲を確かめ、教え方や環境調整を職場と具体化し、実際に使えるか確認していますか。',
      observe:
        '資料を渡したかだけでなく、実施担当・道具・時間・同僚への影響を確認します。本人への対処スキル支援と職場側の調整の両方を扱います。',
      sources: [
        { report: 'r134', location: 'p.179：問11⑧⑨⑫' },
        { report: 'r167', location: 'p.304：実務者票 問8⑥⑧' },
      ],
    },
    organization: {
      question:
        '職場訪問やジョブコーチ等の専門支援を必要な時に確保し、助言後の実施確認まで担当できますか。',
      observe:
        '自機関か連携か、承認・勤務枠・費用・対応できない時の相談先を確認します。資格や連絡先の存在だけでは実施体制としません。',
      sources: [
        { report: 'r134', location: 'p.180：問13・問14③④' },
        { report: 'r180', location: '概要 p.2：領域⑫・⑭・⑮' },
      ],
    },
    action:
      '助言の申し送りを「仕事の場面・実施する人・必要な資源・使えたかの確認」に変え、実施確認の担当を決める。',
    owner: '本人と合意した支援担当、職場の業務責任者、必要な専門職',
    firstStep: '助言後に実施担当へ確認する機会が、既存の予定に入っているかを見る。',
    revisit:
      '実施できたかと、その結果を分ける。仕事・体調・参加の悪化や新しい負担があれば方法を変える。',
    caution:
      '障害や病気の情報を広く共有することは調整の前提ではありません。診断名だけから配慮を決めません。',
    guide: 'WDG2-07',
    guideLabel: '専門支援と、仕事の改善を進める備え',
    case: 'professional-advice-to-workplace',
    caseLabel: '専門家の助言が、現場で実行されない時',
  },
  {
    id: 'continuity',
    short: '就職後と選び直し',
    title: '就職で支援を切らず、働く生活を支える',
    opening:
      '就職できたことと、望む働き方を続けられることは別です。本人と職場の変化を確かめ、成長・復職・転職などの選び直しにつなぎます。',
    practice: {
      question:
        '就職後も、本人が選んだ相手・範囲・時期で本人や職場をフォローし、体調・仕事内容・収入・希望の変化に応じて支援を見直していますか。',
      observe:
        '在籍期間だけでなく、役割、学ぶ機会、健康・生活と職場の状況を、本人が選ぶ範囲で確認します。連絡が取れない時は問題なしでなく未確認です。連絡・追跡や職場への共有を断ることを支援全体の拒否とせず、本人が望む支援と再相談の入口を保ちます。',
      sources: [
        { report: 'r134', location: 'p.179：問11⑩⑪' },
        { report: 'r167', location: 'p.304：実務者票 問8⑩' },
      ],
    },
    organization: {
      question:
        '就職後の相談や担当交代、サービス終了時にも、次の連絡役と支援先を確認できる体制がありますか。',
      observe:
        '訪問を減らす時は、教え方の変更、欠員・繁忙時の代替、本人の相談を誰が引き受けるか確かめます。引受けの返答を得たら、担当が必要な時刻に権限を使って対応できるかを、勤務表と試行で確認します。外部が再開できる条件も本人と確かめます。',
      sources: [
        { report: 'r147', location: 'pp.16–19：就職前から就職後の双方への支援' },
        { report: 'r134', location: 'p.180：問13・問14①②③' },
      ],
    },
    action:
      '職場の担当・代替を有償の勤務に置き、本人が必要時に使う外部の相談先と受入れを確かめる。担い手が空いている機能は先に確保する。',
    owner: '現在の支援責任者、受入れ先の担当者、企業の相談窓口',
    firstStep: '直近の訪問で担った仕事を一つ選び、次の繁忙時に誰が行うかを確かめる。契約の終了通知より前に、必要な延長や代替の受入れを確認する。',
    revisit:
      '本人が再相談できたか。不利益を見落として在籍だけを成功にしていないか。役割・学び・働き方の再検討につながったか。',
    caution:
      '同じ職場への定着を本人の希望より優先しません。続ける、休む、辞める、別の仕事を選ぶことを、必要な専門支援とともに検討します。',
    guide: 'WDG2-09',
    guideLabel: '役割・評価・成長機会を公平にする備え',
    case: 'role-evaluation-growth',
    caseLabel: '働き続けていても、役割と成長が見えない時',
  },
  {
    id: 'life',
    short: '医療・生活との両立',
    title: '支援が必要なことを、働けない理由に固定しない',
    opening:
      '治療や生活支援が続く人でも、仕事との組合せを検討できます。健康や生活の課題を小さく扱わず、就職後も続けられる支援を確かめます。',
    practice: {
      question:
        '本人の意向に沿って、医療・生活の支援と、勤務・通勤・休息などの仕事条件を一緒に調整していますか。',
      observe:
        '就職後も使える支援の時間・範囲を確かめます。家族の無理や通院中断で成り立つ案を、就労可能な条件とは扱いません。',
      sources: [
        { report: 'r167', location: 'p.304：実務者票 問8①⑨' },
        { report: 'r180', location: '概要 p.2：領域⑬・⑮' },
      ],
    },
    organization: {
      question:
        '本人が望む範囲の情報で医療・生活・就労の関係者と役割を調整し、支援の空白を相談できる経路がありますか。',
      observe:
        '紹介先の有無だけでなく、就職後の利用条件、対応できない時間帯、共有内容と相手を確認します。医療判断を代行しません。',
      sources: [
        { report: 'r134', location: 'p.180：問13' },
        { report: 'r167', location: 'p.305：実務者票 問9②③④⑥' },
      ],
    },
    action:
      '就職すると変わる支援の時間・利用条件を確認し、勤務条件と両立しない部分の調整先を決める。',
    owner: '本人が選ぶ連絡役、医療・生活支援の担当者、勤務を決める職場の責任者',
    firstStep: '就職前後で支援の空白が生じる場合、どの窓口へ相談するかを機関間で確認する。',
    revisit: '治療・休息・生活も続けられたか。本人・家族・職場のどこかへ無理を移していないか。',
    caution:
      '体調が完全に整うまで一律に待つことも、健康上の危険を押して働くことも勧めません。情報共有を断った理由と別の方法も扱います。',
    guide: 'WDG2-04',
    guideLabel: '時間・仕事量・体調変動への備え',
    case: 'medical-life-work-person-governed-bridge',
    caseLabel: '医療・生活・仕事の相談を本人のもとでつなぐ',
  },
  {
    id: 'network',
    short: '連携と受入れ',
    title: '紹介した先で、支援が始まるところまで',
    opening:
      '一機関で全部を行う必要はありません。大事なのは、必要な支援を誰が担い、本人が実際につながれるかです。',
    practice: {
      question:
        '必要な外部支援について、本人の同意、紹介先の受入れ、次の担当とそれまでの連絡役を確かめていますか。',
      observe:
        '連絡先を渡したことと支援が始まったことを区別します。待機や利用できない条件、本人が利用を望まない時も扱います。',
      sources: [
        { report: 'r134', location: 'p.179：問11⑬⑭' },
        { report: 'r167', location: 'p.305：実務者票 問9' },
      ],
    },
    organization: {
      question:
        '地域の連携に参加し、役割分担・受入れ・対応できない時の調整を、機関の業務として行えますか。',
      observe:
        '会議の出席回数より、相談できる相手と範囲を確認します。参加・調整の勤務枠、費用、代替担当も扱います。',
      sources: [
        { report: 'r134', location: 'p.180：問13・問14①③⑦' },
        { report: 'r147', location: 'pp.16–19：連携と職業生活支援の共通基盤' },
      ],
    },
    action: '地域との支援分担を確認し、受入れ未確定・待機・担当不在の時の連絡役と相談先を決める。',
    owner: '機関管理者と連携担当、受入れを決められる連携先の担当者',
    firstStep: '既存の地域の打合せで、受入れまでに担当が空白になる場面と、その連絡役を確認する。',
    revisit:
      '連絡先の一覧が実際の受入れにつながったか。自機関だけでは解決できない不足を、地域の調整課題として共有できたか。',
    caution:
      '他機関が担うことを低評価にしません。逆に「紹介済み」だけでは支援の成立を確認できません。地域に資源がなければ、その不足を明記します。',
    guide: 'WDG2-07',
    guideLabel: '専門支援と職場をつなぐ備え',
    case: 'support-response-with-person-control',
    caseLabel: '紹介先が決まっても、支援につながらない時',
  },
  {
    id: 'learning',
    short: '実践から学ぶ体制',
    title: 'できる人任せにせず、支援の経験を育てる',
    opening:
      '研修で知ることと、支援で使えることは別です。経験を検討する時間と助言を得る経路を、仕事に組み込みます。',
    practice: {
      question:
        '実際に行った支援と、その後の本人・職場の変化を分けて振り返り、別の見立てや方法を検討していますか。',
      observe:
        '未実施・変化なし・悪化・中断も扱います。結果が悪ければ本人の意欲不足、と決めず、実施条件や支援側の見立ても見直します。',
      sources: [
        { report: 'r134', location: 'p.179：問12⑨⑩⑪' },
        { report: 'r180', location: '概要 pp.2–3：領域⑨、OJT・事例検討等' },
      ],
    },
    organization: {
      question:
        '事例検討や助言を受ける時間を業務に組み込み、支援方針・担当・資源を見直す判断につなげていますか。',
      observe:
        '受講数だけでなく、同行・OJT・外部助言、担当者の負担調整を確認します。件数に表れにくい調整や選び直しも評価で扱います。',
      sources: [
        { report: 'r167', location: 'p.299：管理者票 問12' },
        { report: 'r134', location: 'p.180：問14②③④' },
        { report: 'r180', location: '概要 pp.2–3、巻末資料8' },
      ],
    },
    action:
      '既存の会議の一部を、実施条件と結果から次の支援を決める時間に変え、足りない助言・実務経験を補う方法を選ぶ。',
    owner: '管理者・育成担当と実務者、必要な分野の助言者',
    firstStep: '記録を増やす前に既存の重複を減らし、未実施や悪化も話せる振り返りの枠をつくる。',
    revisit:
      '学びが実践と機関の運用に反映されたか。担当者を責める場や、記録負担だけの追加になっていないか。',
    caution:
      '一事例の改善は効果の証明ではありません。技能の習得を詳しく確認する時は、No.180巻末資料8も参照できます。',
    guide: 'WDG2-10',
    guideLabel: '試した結果を振り返り改善する備え',
    case: 'trial-success-condition-transfer',
    caseLabel: '試行がうまくいった後、条件が変わる時',
  },
];

export function supportAnswerLabel(mode: SupportMode, value?: string) {
  const labels: Record<string, string> =
    mode === 'practice' ? practiceAnswerLabels : organizationAnswerLabels;
  return value && Object.prototype.hasOwnProperty.call(labels, value) ? labels[value] : '未回答';
}
export function supportResponseNextStep(mode: SupportMode, value?: string): string {
  if (!value)
    return '未回答です。提案を読むことはできますが、不足があると判定したわけではありません。まず、実際の状況を確かめます。';
  if (value === 'unknown')
    return 'まず、実際の担当者・業務記録・連携先に確認します。不明を未実施とは扱いません。';
  if (value === 'no_opportunity')
    return '今は実施実績を判定できません。必要になった時の窓口だけ確認し、不要な支援を新たに課すことはしません。';
  if (value === 'partner')
    return '適切な分業を活かします。受入れ、役割分担、待機中の連絡役を確認し、自機関で同じ支援を重複して始めません。';
  if (value === 'joint')
    return '協働を活かし、本人が誰に相談できるか、機関間で役割が重複・空白になっていないかを確認します。';
  if (value === 'fragile' || value === 'partial')
    return 'できている場面と止まる場面を比べ、担当・承認・時間・経験・連携先のどこが違うかを確認します。個人の熱意だけに原因を求めません。';
  if (value === 'missing')
    return mode === 'practice'
      ? '必要な支援が届いていない場面を確認し、本人の意向に沿って、まず自機関又は連携でできる対応を決めます。機関全体の改善完了を待たせません。'
      : '方針・権限・時間や費用・人材育成・地域資源のどこが不足しているかを確認します。自機関で変えられない点は、調整先を明記します。';
  return '使えている方法を活かします。担当交代や状況の変化でも使えるか、本人と職場の経験に照らして確かめます。';
}
export function supportPairObservation(answers: SupportAnswers, id: string) {
  const p = answers.practice[id],
    o = answers.organization[id];
  if ((p === 'direct' || p === 'joint') && (o === 'missing' || o === 'fragile'))
    return '実践はあるのに、支える体制が不安定という回答です。担当者の持ち出しや属人的な調整で成り立っていないかを確認しましょう。';
  if (p === 'missing' && o === 'working')
    return '体制は使えるという認識でも、必要な実践には届いていないという回答です。利用条件・承認・周知など、どこで止まるかを確認しましょう。回答だけでは原因は確定できません。';
  if (p === 'unknown' || o === 'unknown')
    return '一方の状況が不明です。分かっている側の回答で補わず、観察できる担当者に確かめましょう。';
  return '実践と体制は別々に確認します。管理者と実務者で見え方が異なる場合も、平均せず、どの場面を見ているかから話し合います。';
}
export type OrganizationDraft = { owner: string; timing: string; note: string };

export function organizationReviewText(
  answers: SupportAnswers,
  selected: string,
  owner = '',
  timing = '',
  note = '',
  drafts: Record<string, OrganizationDraft> = {},
) {
  const focus = organizationChecks.find((item) => item.id === selected);
  return [
    '# 就労支援の実践・体制改善ツール — 打合せメモ',
    '目標：障害のある人が、必要な支援とともに望む仕事と生活を選べること。本人が比較できる仕事と、実行する権限・有償時間・費用・代替を検討します。',
    'NBL編集版 2026-09-15。原調査票・検証済み尺度ではありません。採点・機関分類・個人評価には使いません。',
    '利用者の自己チェックです。未回答、不明、機会なし、他機関との分担を不足に換算しません。',
    '\n## 今回の改善テーマ',
    focus ? focus.title : '未選択（改善策はまだ選んでいません）',
    ...(focus
      ? [
          `支援の実践：${supportAnswerLabel('practice', answers.practice[focus.id])}`,
          `機関の体制：${supportAnswerLabel('organization', answers.organization[focus.id])}`,
          `実践側の確認：${supportResponseNextStep('practice', answers.practice[focus.id])}`,
          `体制側の確認：${supportResponseNextStep('organization', answers.organization[focus.id])}`,
          supportPairObservation(answers, focus.id),
          `検討する案（未決定）：${focus.action}`,
          `決める役割の例：${focus.owner}`,
          `最初の一歩：${focus.firstStep}`,
          `実施後の確認：${focus.revisit}`,
          `見落とさないこと：${focus.caution}`,
        ]
      : []),
    `\n自分たちで決めたこと・まだ確認すること：${note || '未記入（案を採用したという意味ではありません）'}`,
    `決める人・一緒に確認する役割：${owner || '未記入'}`,
    `次に確認する日・機会：${timing || '未記入'}`,
    ...organizationChecks.filter(item => item.id !== selected && Object.values(drafts[item.id] ?? {}).some(value => value.trim())).flatMap(item => [
      `\n## 別テーマの改善メモ：${item.title}`,
      `支援の実践：${supportAnswerLabel('practice', answers.practice[item.id])}`,
      `機関の体制：${supportAnswerLabel('organization', answers.organization[item.id])}`,
      `検討する案（未決定）：${item.action}`,
      `自分たちで決めたこと・まだ確認すること：${drafts[item.id].note || '未記入'}`,
      `決める人・一緒に確認する役割：${drafts[item.id].owner || '未記入'}`,
      `次に確認する日・機会：${drafts[item.id].timing || '未記入'}`,
      `実施後の確認：${item.revisit}`,
    ]),
    '\n## 8テーマの確認状況と出典対応',
    ...organizationChecks.flatMap((item) => [
      `\n### ${item.title}`,
      ...(['practice', 'organization'] as const).flatMap((mode) => [
        `${supportModeLabels[mode]}：${item[mode].question}`,
        `回答：${supportAnswerLabel(mode, answers[mode][item.id])}`,
        ...item[mode].sources.map(
          (s) =>
            `設計参照：${supportResearch[s.report].title} ${s.location} ${supportResearch[s.report].url}`,
        ),
      ]),
    ]),
    '\n## 利用範囲',
    '研究の支援内容・組織条件を参照し、NBLが問い・選択肢・改善案を編集しました。原調査の得点や全国の結果とは比較できません。回答から支援効果や原因を判定しません。',
    '改善が済むまで今必要な支援を待たせません。本人の意思・情報の共有範囲を尊重し、実施は担当者と権限のある人が決めます。',
    '画面から送信・自動保存はしていません。個人名・病状・個別相談は記入せず、保存先と共有範囲を確認してください。',
  ].join('\n');
}
