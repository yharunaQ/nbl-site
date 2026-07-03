import {
  AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE,
  buildFalconAxiomPublicSiteUpdatePlan,
  type FalconAxiomPublicSiteUpdatePlanRow,
} from './falconAxiomPublicSiteUpdatePlan';

export const AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_VERSION = 'v0_2026_06_24' as const;

export const AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_BOUNDARY =
  'axiom_next_nbl_virtual_beta_test_is_internal_pre_public_feedback_synthesis_not_public_approval_publication_runtime_or_learning_update' as const;

export type AxiomVirtualBetaAgentKind =
  | 'reader_user'
  | 'implementation_actor'
  | 'professional_support'
  | 'public_discourse'
  | 'nbl_business_team';

export type AxiomVirtualBetaStakeholderGroup =
  | 'disabled_worker_or_jobseeker'
  | 'rare_disease_or_chronic_condition_worker'
  | 'sensory_access_user'
  | 'neurodivergent_or_mental_health_user'
  | 'employer_hr_dei'
  | 'frontline_manager'
  | 'employment_support_provider'
  | 'medical_welfare_education_connector'
  | 'policy_research_administration'
  | 'family_or_peer_support'
  | 'media_sns_reader'
  | 'nbl_product_editorial'
  | 'nbl_partnership_revenue'
  | 'nbl_trust_operations'
  | 'nbl_social_growth';

export type AxiomVirtualBetaSkillId =
  | 'fragmented_consultation_pickup'
  | 'work_condition_translation'
  | 'low_vision_and_screen_reader_access'
  | 'hearing_information_access'
  | 'cognitive_load_plain_language'
  | 'employer_implementation_path'
  | 'supporter_handoff_review'
  | 'policy_research_boundary'
  | 'public_copy_boundary'
  | 'multimodal_learning_use'
  | 'article_editorial_worth_spreading'
  | 'business_model_surface_fit'
  | 'partnership_use_case_design'
  | 'trust_and_contact_operations'
  | 'sns_circulation_learning_loop';

export type AxiomVirtualBetaAgent = {
  agentId: string;
  kind: AxiomVirtualBetaAgentKind;
  stakeholderGroup: AxiomVirtualBetaStakeholderGroup;
  nameJa: string;
  perspectiveJa: string;
  primaryNeedsJa: string[];
  reviewSkills: AxiomVirtualBetaSkillId[];
  failureSignalsJa: string[];
};

export type AxiomVirtualBetaSeverity = 'critical' | 'high' | 'medium' | 'low';

export type AxiomVirtualBetaFinding = {
  findingId: string;
  agentIds: string[];
  severity: AxiomVirtualBetaSeverity;
  lensJa: string;
  whatWorkedJa: string;
  issueJa: string;
  improvementJa: string;
};

export type AxiomVirtualBetaPageReview = {
  pageSlug: string;
  pagePath: string;
  navLabelJa: string;
  pageRoleJa: string;
  reviewSummaryJa: string;
  strongestUseJa: string;
  betaFindings: AxiomVirtualBetaFinding[];
  businessUseJa: string[];
  nextImprovementJa: string[];
};

export type AxiomVirtualBetaBusinessReview = {
  businessReviewId: string;
  titleJa: string;
  valueHypothesisJa: string;
  useCasesJa: string[];
  risksJa: string[];
  nextOperatingMovesJa: string[];
};

export type AxiomVirtualBetaPriorityImprovement = {
  improvementId: string;
  severity: AxiomVirtualBetaSeverity;
  titleJa: string;
  affectedPageSlugs: string[];
  ownerLensJa: string;
  actionJa: string;
  whyNowJa: string;
};

export type AxiomNextNblVirtualBetaRun = {
  runId: string;
  objectType: 'axiom_next_nbl_virtual_beta_test_run';
  version: typeof AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_VERSION;
  lane: 'Falcon Lab';
  status: 'internal_virtual_beta_completed_not_public_approval';
  boundary: typeof AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_BOUNDARY;
  candidateRouteBase: typeof AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE;
  agentCount: number;
  pageCount: 9;
  findingCount: number;
  agents: AxiomVirtualBetaAgent[];
  pageReviews: AxiomVirtualBetaPageReview[];
  businessReviews: AxiomVirtualBetaBusinessReview[];
  priorityImprovements: AxiomVirtualBetaPriorityImprovement[];
  executiveSummaryJa: string[];
  notNow: string[];
};

export type AxiomNextNblVirtualBetaRunValidation = {
  valid: boolean;
  validationStatus:
    | 'axiom_next_nbl_virtual_beta_run_valid'
    | 'axiom_next_nbl_virtual_beta_run_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_BOUNDARY;
};

export const AXIOM_VIRTUAL_BETA_AGENTS = [
  {
    agentId: 'worker_rare_disease_health_time',
    kind: 'reader_user',
    stakeholderGroup: 'rare_disease_or_chronic_condition_worker',
    nameJa: '難病・慢性疾患のある就労者',
    perspectiveJa: '通院、症状変動、収入、評価、説明負担が同時に絡む読者として見る。',
    primaryNeedsJa: ['自分の困りごとが単なる体調問題にされないこと', '働き方の再設計に進む入口', '相談前に言葉を整える材料'],
    reviewSkills: ['fragmented_consultation_pickup', 'work_condition_translation', 'cognitive_load_plain_language'],
    failureSignalsJa: ['健康時間が説教や自己管理論に見える', '支援計画が確認前に決め打ちされる'],
  },
  {
    agentId: 'worker_jobseeker_disability_general',
    kind: 'reader_user',
    stakeholderGroup: 'disabled_worker_or_jobseeker',
    nameJa: '障害のある求職者・転職検討者',
    perspectiveJa: '自分に合う仕事像、応募前の確認、職場体験、支援とのつながりを探す読者として見る。',
    primaryNeedsJa: ['就職前の不安が薄い材料扱いされないこと', '診断名ではなく仕事像へ進めること', '支援につながる前の言葉を得ること'],
    reviewSkills: ['fragmented_consultation_pickup', 'work_condition_translation', 'cognitive_load_plain_language'],
    failureSignalsJa: ['就職後の話ばかりで入口前の困りごとが見えない', '本人が準備不足だと言われているように読める'],
  },
  {
    agentId: 'worker_visual_access',
    kind: 'reader_user',
    stakeholderGroup: 'sensory_access_user',
    nameJa: '視覚障害のある求職者・就労者',
    perspectiveJa: '情報形式、画面、動線、安全、読み上げや拡大の利用を前提に見る。',
    primaryNeedsJa: ['障害種類ページで入口をすぐ選べること', '図解だけに依存しない情報', '職場接触点の具体性'],
    reviewSkills: ['low_vision_and_screen_reader_access', 'work_condition_translation', 'public_copy_boundary'],
    failureSignalsJa: ['画像の意味が代替テキストで分からない', '視覚障害が情報アクセスだけに狭まる'],
  },
  {
    agentId: 'worker_hearing_access',
    kind: 'reader_user',
    stakeholderGroup: 'sensory_access_user',
    nameJa: '聴覚・情報参加の当事者',
    perspectiveJa: '会議、雑談、緊急連絡、評価面談、非公式情報の流れを見落とさないかを見る。',
    primaryNeedsJa: ['情報参加の問題が開示問題と混ざらないこと', '具体的な会議・連絡・評価の設計例', '本人だけの説明負担に戻らないこと'],
    reviewSkills: ['hearing_information_access', 'work_condition_translation', 'fragmented_consultation_pickup'],
    failureSignalsJa: ['聞こえの問題が精神論や人間関係論になる', '情報保障が配慮名だけで止まる'],
  },
  {
    agentId: 'worker_neurodivergent_mental_health',
    kind: 'reader_user',
    stakeholderGroup: 'neurodivergent_or_mental_health_user',
    nameJa: '発達障害・精神障害・メンタルヘルスの読者',
    perspectiveJa: '暗黙の手順、切替、評価不安、疲労、再発予防を個人責任にしないかを見る。',
    primaryNeedsJa: ['責められない入口', '支援者や上司に説明しやすい言葉', '予防と成長につながる設計視点'],
    reviewSkills: ['cognitive_load_plain_language', 'fragmented_consultation_pickup', 'work_condition_translation'],
    failureSignalsJa: ['説明が長くて読む前に離脱する', '困りごとが本人の能力不足として読める'],
  },
  {
    agentId: 'employer_hr_dei',
    kind: 'implementation_actor',
    stakeholderGroup: 'employer_hr_dei',
    nameJa: '企業人事・DEI担当',
    perspectiveJa: '採用、配置、定着、評価、合理的配慮、管理職支援へどう使えるかを見る。',
    primaryNeedsJa: ['制度説明から現場運用への翻訳', '管理職が使える言葉', '研修・会議で共有できる資料'],
    reviewSkills: ['employer_implementation_path', 'public_copy_boundary', 'business_model_surface_fit'],
    failureSignalsJa: ['企業だけが責められている印象', '個別対応の負担だけが増える印象'],
  },
  {
    agentId: 'frontline_manager',
    kind: 'implementation_actor',
    stakeholderGroup: 'frontline_manager',
    nameJa: '現場管理職',
    perspectiveJa: '今日の業務、手順、休憩、メンバー間共有、評価面談へ落とせるかを見る。',
    primaryNeedsJa: ['何を確認すればよいかが見えること', '善意や属人対応にしない道筋', '忙しい現場でも読める短さ'],
    reviewSkills: ['employer_implementation_path', 'cognitive_load_plain_language', 'work_condition_translation'],
    failureSignalsJa: ['抽象度が高すぎて現場で使えない', '支援者向けの授業に見える'],
  },
  {
    agentId: 'employment_support_provider',
    kind: 'professional_support',
    stakeholderGroup: 'employment_support_provider',
    nameJa: '就労支援機関・ジョブコーチ',
    perspectiveJa: '本人の言葉を職場条件へ翻訳し、企業や医療・福祉へつなぐ道具として見る。',
    primaryNeedsJa: ['アセスメント手順の妥当性', 'missing contextを自然に聞けること', '支援計画への分岐が見えること'],
    reviewSkills: ['supporter_handoff_review', 'fragmented_consultation_pickup', 'work_condition_translation'],
    failureSignalsJa: ['確認前に一手を出してしまう', 'モデル事例が個別相談の代替に見える'],
  },
  {
    agentId: 'medical_welfare_education_connector',
    kind: 'professional_support',
    stakeholderGroup: 'medical_welfare_education_connector',
    nameJa: '医療・福祉・教育から職場へつなぐ支援者',
    perspectiveJa: '病状説明や生活情報を職場で使える条件へ翻訳できるかを見る。',
    primaryNeedsJa: ['医療情報をそのまま職場判断にしないこと', '就職前・移行期の扱い', '家族・学校・支援から職場への橋渡し'],
    reviewSkills: ['supporter_handoff_review', 'policy_research_boundary', 'public_copy_boundary'],
    failureSignalsJa: ['専門領域の情報が職場で使えないまま残る', '就職前のデータが薄く扱われる'],
  },
  {
    agentId: 'policy_research_admin',
    kind: 'public_discourse',
    stakeholderGroup: 'policy_research_administration',
    nameJa: '行政・政策・研究の読者',
    perspectiveJa: '制度、統計、調査研究、研修、政策議論を現場条件へ戻せるかを見る。',
    primaryNeedsJa: ['根拠と仮説の区別', '現行制度の断定回避', '政策議論に使える論点整理'],
    reviewSkills: ['policy_research_boundary', 'article_editorial_worth_spreading', 'public_copy_boundary'],
    failureSignalsJa: ['現在の制度や統計を検証済みのように書く', '論説が現場の問いから離れる'],
  },
  {
    agentId: 'family_peer_support',
    kind: 'reader_user',
    stakeholderGroup: 'family_or_peer_support',
    nameJa: '家族・ピアサポートの読者',
    perspectiveJa: '本人の代わりに決めるのでなく、本人の言葉を守りながら相談につなげられるかを見る。',
    primaryNeedsJa: ['責任を背負いすぎない説明', '近い相談を探せる入口', '本人の自己決定を尊重する文言'],
    reviewSkills: ['fragmented_consultation_pickup', 'cognitive_load_plain_language', 'public_copy_boundary'],
    failureSignalsJa: ['家族が代理判断するページに見える', '不安だけが強まる'],
  },
  {
    agentId: 'media_sns_reader',
    kind: 'public_discourse',
    stakeholderGroup: 'media_sns_reader',
    nameJa: 'ニュース・SNS経由の読者',
    perspectiveJa: '短い違和感から入り、煽りや炎上でなく記事・図解・問いへ進めるかを見る。',
    primaryNeedsJa: ['一撃で分かるコピー', '共有したくなる図解', '誤読しにくい境界'],
    reviewSkills: ['article_editorial_worth_spreading', 'sns_circulation_learning_loop', 'public_copy_boundary'],
    failureSignalsJa: ['内部用語が残る', '長すぎてSNSからの入口として重い'],
  },
  {
    agentId: 'nbl_product_editor',
    kind: 'nbl_business_team',
    stakeholderGroup: 'nbl_product_editorial',
    nameJa: 'NBL編集・プロダクト責任者',
    perspectiveJa: '9ページが同じ専門知識を違う入口に翻訳できているか、重複と欠落を見る。',
    primaryNeedsJa: ['ページごとの役割分担', '読者目線の言葉', '公開候補としての編集品質'],
    reviewSkills: ['business_model_surface_fit', 'article_editorial_worth_spreading', 'public_copy_boundary'],
    failureSignalsJa: ['内部説明が公開ページに残る', 'ページ間で同じ話が重複する'],
  },
  {
    agentId: 'nbl_partnership_lead',
    kind: 'nbl_business_team',
    stakeholderGroup: 'nbl_partnership_revenue',
    nameJa: 'NBL事業開発・連携責任者',
    perspectiveJa: '企業、行政、支援機関、研究者との共同実装や研修・委託につながるかを見る。',
    primaryNeedsJa: ['協働の入口', '使い道の説明', '販売色を出しすぎない価値提示'],
    reviewSkills: ['partnership_use_case_design', 'business_model_surface_fit', 'trust_and_contact_operations'],
    failureSignalsJa: ['誰に何を相談・依頼できるかが見えない', '個別相談窓口と誤解される'],
  },
  {
    agentId: 'nbl_trust_ops',
    kind: 'nbl_business_team',
    stakeholderGroup: 'nbl_trust_operations',
    nameJa: 'NBL信頼・運営境界責任者',
    perspectiveJa: '免責、問い合わせ、著作権、AI利用、SNS運用、個別判断境界を見る。',
    primaryNeedsJa: ['信頼できる運営情報', '相談・引用・転載の境界', '公開前レビューの記録'],
    reviewSkills: ['trust_and_contact_operations', 'public_copy_boundary', 'policy_research_boundary'],
    failureSignalsJa: ['公開承認済みのように見える', '個人情報や相談受付を誘発する'],
  },
  {
    agentId: 'nbl_social_growth',
    kind: 'nbl_business_team',
    stakeholderGroup: 'nbl_social_growth',
    nameJa: 'NBL SNS・社会対話責任者',
    perspectiveJa: '記事、図解、4コマ、ツールキットがSNSや研修反応から改善循環に戻るかを見る。',
    primaryNeedsJa: ['共有単位の明確さ', 'SNSフォロー導線', '反応を改善に戻す安全な運用'],
    reviewSkills: ['sns_circulation_learning_loop', 'article_editorial_worth_spreading', 'multimodal_learning_use'],
    failureSignalsJa: ['反応数最適化に見える', '炎上対応や自動返信を約束してしまう'],
  },
] as const satisfies readonly AxiomVirtualBetaAgent[];

const PAGE_REVIEW_BLUEPRINTS: Record<
  string,
  Omit<AxiomVirtualBetaPageReview, 'pageSlug' | 'pagePath' | 'navLabelJa' | 'pageRoleJa'>
> = {
  home: {
    reviewSummaryJa:
      'トップページは、NBLが「働きづらさを人の問題で終わらせず、仕事条件の地図へ変える」サイトであることを伝え始めている。公開直前には、初見の読者が3秒で自分の入口を選べるかをさらに磨く必要がある。',
    strongestUseJa: 'ニュースや紹介から来た読者に、8つの課題、相談事例、設計ガイド、NBLレポート、ツールキットへ迷わず分岐させる入口。',
    betaFindings: [
      {
        findingId: 'home_first_view_concept_hit',
        agentIds: ['media_sns_reader', 'nbl_product_editor'],
        severity: 'medium',
        lensJa: '初見の一撃理解',
        whatWorkedJa: '「働きづらさを、仕事条件の地図へ。」はサイト全体の核を比較的短く示せている。',
        issueJa: '各入口の価値は見えるが、初見読者には「まずどれを押すべきか」がまだ少し選択負荷になる。',
        improvementJa: 'トップの入口を「状況を見たい」「相談をほどきたい」「設計したい」「記事を読みたい」「素材を使いたい」の行動語でさらに整理する。',
      },
      {
        findingId: 'home_business_conversion',
        agentIds: ['nbl_partnership_lead', 'nbl_trust_ops'],
        severity: 'medium',
        lensJa: '事業導線',
        whatWorkedJa: '公開コンテンツの厚みは、研修・共同研究・委託・講演の信頼入口になりうる。',
        issueJa: 'トップだけでは、企業・行政・支援機関が「NBLと何を一緒にできるか」までは見えにくい。',
        improvementJa: '個別相談ではなく、研修・教材化・共同検討・レポート活用への問い合わせ導線をサイト情報またはトップ下部に最小追加する。',
      },
    ],
    businessUseJa: ['NBLの名刺代わりの入口', '提案前に共有する事業概要', 'SNS投稿からの受け皿'],
    nextImprovementJa: ['入口カードの行動語をさらに短くする', '事業活用への最小導線を内部候補として検討する'],
  },
  'scene-entry': {
    reviewSummaryJa:
      '8つの課題ページは、Axiom/NBLが挑む「古くて新しい課題」を4コマと課題地図で見せる中核入口になっている。課題の認知負荷を下げる力は高いが、漫画内テキストとHTML説明の対応、次に進む導線の最新化を細部まで確認したい。',
    strongestUseJa: '理念や制度では解けなかった問題を、現場・政策・研修で共有できるユースケースとして見せる。',
    betaFindings: [
      {
        findingId: 'scene_old_new_issue_depth',
        agentIds: ['policy_research_admin', 'media_sns_reader', 'frontline_manager'],
        severity: 'high',
        lensJa: '古くて新しい課題の定義',
        whatWorkedJa: '8課題は普通の職場場面ではなく、数字、名前、健康時間、分断、制度、上司依存、検索・SNS・AI要約、学習循環の限界に焦点が戻っている。',
        issueJa: '読者が「よくある困りごと集」と誤読すると、NBLが挑む認知負荷の高さが弱まる。',
        improvementJa: '各課題の冒頭に「何が昔から言われ、なぜ解けなかったか」を1文で添え、4コマの解決後は必ず仕事条件の共有に着地させる。',
      },
      {
        findingId: 'scene_next_routes',
        agentIds: ['employment_support_provider', 'nbl_product_editor'],
        severity: 'medium',
        lensJa: '次導線',
        whatWorkedJa: '4コマから相談事例、設計ガイド、ツールキットへ進める構造は自然。',
        issueJa: '下部の次導線に旧ラベルや内部語が残ると、ページ全体の完成感が落ちる。',
        improvementJa: '「相談の一言をほどく」「仕事・参加設計へ広げる」「図解・4コマを使う」の3導線に合わせて文言を統一する。',
      },
    ],
    businessUseJa: ['研修冒頭の問題共有', '政策・企業向け提案の導入', 'SNSで共有しやすい4コマ入口'],
    nextImprovementJa: ['8課題の課題定義文を点検する', '4コマ画像の日本語・代替テキスト・説明文の対応を確認する'],
  },
  'case-readings': {
    reviewSummaryJa:
      '相談事例ページは、静的FAQではなく、相談の一言をつぶさずにアセスメントへ進めるUIに近づいている。複数領域チェックから当初見立て、確認質問、支援計画分岐へ進む流れは良い。公開候補としては、Hero図とチェック結果の言葉が「個人の問題探し」ではないことをさらに強く示したい。',
    strongestUseJa: '本人、企業、支援者、家族が断片的な相談を持ち込み、広い見立てに進むデモ。',
    betaFindings: [
      {
        findingId: 'case_assessment_not_answer_list',
        agentIds: ['worker_rare_disease_health_time', 'employment_support_provider', 'family_peer_support'],
        severity: 'high',
        lensJa: 'アセスメントUI',
        whatWorkedJa: '役割、相談の一言、具体領域を選ぶ構造は、まとまっていない相談を入口として受け止める。',
        issueJa: '初見では「どれか正解のカードを選ぶ」ように見える可能性がある。',
        improvementJa: '複数選択できること、選択は答えではなく一緒に確認する入口であることをUI上で自然に見せる。',
      },
      {
        findingId: 'case_support_plan_branching',
        agentIds: ['frontline_manager', 'medical_welfare_education_connector'],
        severity: 'medium',
        lensJa: '確認後の支援計画',
        whatWorkedJa: '確認質問と支援計画例を対応させる方向は、見立てから計画へ進むモデルとして妥当。',
        issueJa: '質問数や分岐が少なく見えると、複雑な相談を単純化している印象になる。',
        improvementJa: '選んだ領域ごとに、確認で変わる条件と支援計画例をもう少し厚くする。ただし個別結論は出さない。',
      },
    ],
    businessUseJa: ['個別相談機能の静的デモ', '支援者研修のアセスメント教材', '企業・支援機関との共通言語づくり'],
    nextImprovementJa: ['Hero図を最新コンセプトに合わせて再確認する', '複数選択時の見立て文が複合論点を反映するか点検する'],
  },
  'work-design-views-guide': {
    reviewSummaryJa:
      '設計ガイドは、Axiom統合知識を最も直接的に公共財へ翻訳するページであり、現在の5領域・10論点・37項目の構造は有力。課題は、内部由来の整理を読者向けの「未来の仕事・社会参加設計のマスタープラン」としてさらに一撃で見せること。',
    strongestUseJa: '企業経営、雇用管理、専門支援、制度設計が共有できる仕事・社会参加設計のガイドブック。',
    betaFindings: [
      {
        findingId: 'guide_universal_design_frame',
        agentIds: ['employer_hr_dei', 'policy_research_admin', 'nbl_product_editor'],
        severity: 'high',
        lensJa: '普遍的な仕事設計',
        whatWorkedJa: '障害者雇用や難病就労支援の知見を、狭い標準的職業人像の見直しへ広げる方向は強い。',
        issueJa: '導入カードが少しでも説明過多になると、マスタープランとしての力より方法説明が前に出る。',
        improvementJa: '冒頭は「狭い標準像から、多様性を前提にした仕事・参加設計へ」の1枚図と短文に絞る。',
      },
      {
        findingId: 'guide_card_structure',
        agentIds: ['frontline_manager', 'employment_support_provider', 'worker_neurodivergent_mental_health'],
        severity: 'medium',
        lensJa: '各論点カード',
        whatWorkedJa: '具体設計項目、視点転換、状況レベル4コマ、設計ポイントの順序は読める。',
        issueJa: '視点転換と具体設計項目ごとのポイントに重複が残ると、カードの読むリズムが重くなる。',
        improvementJa: '「詰まり/古い読み」対「設計/設計の読み/設計ポイント」の2カラムにまとめ、下部は具体設計項目ごとの実装ポイントだけにする。',
      },
    ],
    businessUseJa: ['企業研修の中核教材', '行政・研究会の共通フレーム', 'NBLの専門性を示す代表ページ'],
    nextImprovementJa: ['冒頭導入図と説明の圧縮', '10カードの重複文言を最終編集する'],
  },
  'articles-social-questions': {
    reviewSummaryJa:
      'NBLレポートは、NBLのAIネイティブ専門エージェントと社会の対話プラットフォームとして位置づく。36本相当の本格記事、目次・索引・検索、記事ごとのインフォグラフィック一致が完成度を左右する。',
    strongestUseJa: '社会の違和感、政策論点、企業の迷い、支援者の翻訳負荷を、読める論考と図解へ変える。',
    betaFindings: [
      {
        findingId: 'reports_editorial_depth',
        agentIds: ['policy_research_admin', 'media_sns_reader', 'nbl_social_growth'],
        severity: 'high',
        lensJa: '記事の本格性',
        whatWorkedJa: 'NBLレポートという位置づけは、単なる情報提供より事業の社会対話機能に合っている。',
        issueJa: '短い問いやAxiomの独り言に寄ると、世界最高の就労支援専門家としての鮮やかな論考にならない。',
        improvementJa: 'Falcon記事・バーチャルフォーラムテーマを足場に、読者の切実な問いから始め、最小経路で構造と別解へ進む本格記事へ編集する。',
      },
      {
        findingId: 'reports_infographic_match',
        agentIds: ['media_sns_reader', 'nbl_product_editor'],
        severity: 'high',
        lensJa: '図解一致',
        whatWorkedJa: '横長インフォグラフィックを本文前に置き、ページ上で拡大する方針は読みやすい。',
        issueJa: '記事内容と図解が一致しないと、記事の信頼感を大きく損なう。',
        improvementJa: '抽象SVGではなく、各記事の中心論点を一目で示すImage-2.0系インフォグラフィックに差し替える。',
      },
    ],
    businessUseJa: ['SNS・ニュース反応の受け皿', '講演・研修後の深掘り資料', '企業・行政への論点提示'],
    nextImprovementJa: ['記事テーマの索引設計を完成させる', '記事ごとの図解対応表を作る'],
  },
  'toolkit-studio': {
    reviewSummaryJa:
      'ツールキットは、言葉だけでは届きにくい専門知識を図解、4コマ、音楽、フォーラム、チェックリストへ翻訳する棚として価値が高い。今は「他ページへの入口」ではなく、選別素材を使う場面から選べる実験的メディア棚にする方向が合っている。',
    strongestUseJa: '会議、研修、SNS、個人学習で、認知負荷を下げる素材を選ぶページ。',
    betaFindings: [
      {
        findingId: 'toolkit_real_material_shelf',
        agentIds: ['frontline_manager', 'employment_support_provider', 'nbl_social_growth'],
        severity: 'high',
        lensJa: '素材棚',
        whatWorkedJa: '選別図解、4コマ、音楽、フォーラム、就労支援機関チェックリストという棚は具体的。',
        issueJa: '棚が他ページへのリンク集に戻ると、ツールキットの固有価値が弱くなる。',
        improvementJa: 'selected_infographics等の読み取り結果を、内容別・利用場面別に棚へ配置し、拡大表示と短い使い方を添える。',
      },
      {
        findingId: 'toolkit_multimodal_experiment',
        agentIds: ['worker_neurodivergent_mental_health', 'family_peer_support'],
        severity: 'medium',
        lensJa: '非言語チャンネル',
        whatWorkedJa: '音楽フェスや図解を、文章では届きにくい理解のチャンネルとして扱う方針はNBLらしい。',
        issueJa: '実験的であることが伝わらないと、雑多な倉庫に見える。',
        improvementJa: 'Heroと冒頭で「言葉だけでは伝わりにくい仕事条件を、別の形で共有する実験」と明確化する。',
      },
    ],
    businessUseJa: ['研修素材棚', 'SNSカード運用', '企業・支援会議での共通資料'],
    nextImprovementJa: ['棚のカテゴリ名を素材中心に統一する', '各素材に使う場面と注意を短く付ける'],
  },
  'work-condition-window': {
    reviewSummaryJa:
      '障害種類から見るページは、読者が現実に探し始める入口を尊重しながら、障害者雇用を例外対応ではなく多様性対応した職場設計へ広げるページになりつつある。初心者向け説明の温度と具体性が鍵。',
    strongestUseJa: '障害種類・疾病名から調べたい人を、診断名別の答えではなく職場設計の応用問題へ案内する。',
    betaFindings: [
      {
        findingId: 'condition_entry_empathy',
        agentIds: ['worker_visual_access', 'worker_hearing_access', 'family_peer_support'],
        severity: 'high',
        lensJa: '入口の寄り添い',
        whatWorkedJa: '視覚、聴覚、肢体、内部、知的、精神、発達、高次脳機能障害、難病の順序と入口は現実の探し方に合う。',
        issueJa: '説明がすぐメタになると、各障害について知りたい読者に説教されている印象になる。',
        improvementJa: '各カードの冒頭は、初心者が納得できる障害種類の説明から入り、その後に職場設計へ自然に広げる。',
      },
      {
        findingId: 'condition_design_application',
        agentIds: ['employer_hr_dei', 'medical_welfare_education_connector'],
        severity: 'medium',
        lensJa: '職場設計への橋渡し',
        whatWorkedJa: '「障害者雇用は例外対応ではない」という方向は企業・支援者にとって強い。',
        issueJa: '障害種類中心と職場設計中心の図解関係が曖昧だと、ページの思想が伝わりにくい。',
        improvementJa: 'Hero図は「職場を設計する」を中心に置き、障害種類をそこから見える応用課題として配置する。',
      },
    ],
    businessUseJa: ['検索流入の受け皿', '企業研修の障害種類別入口', '支援者の説明資料'],
    nextImprovementJa: ['各障害カードの説明文を初心者向けに再編集する', 'Hero図の中心概念を職場設計に寄せる'],
  },
  'theory-method-trust': {
    reviewSummaryJa:
      'NBLの専門性ページは、二層の専門支援、つまり専門情報を安全に読むOSと、その読み方で作った専門知識ネットワークを説明する重要ページである。内部語を抜きつつ、膨大な資料をどう安全に読み替えるのかの凄みを出したい。',
    strongestUseJa: 'NBLが単なる検索・要約・RAGではなく、偏りを含む情報を仕事条件の知識ネットワークへ読み替える仕組みを説明する。',
    betaFindings: [
      {
        findingId: 'method_layer1_depth',
        agentIds: ['policy_research_admin', 'nbl_trust_ops'],
        severity: 'high',
        lensJa: '読み方の専門性',
        whatWorkedJa: 'Layer 1をICFや権利モデルに近い根本的専門基盤として示す方向は強い。',
        issueJa: '内部語が残ると、専門性ではなく開発メモに見える。',
        improvementJa: '「仮説として読む」「反対仮説を残す」「足りない文脈を聞く」「言いすぎを止める」など、公開向けの原理に翻訳する。',
      },
      {
        findingId: 'method_source_network',
        agentIds: ['policy_research_admin', 'media_sns_reader'],
        severity: 'medium',
        lensJa: '情報源の説明',
        whatWorkedJa: '国内外の調査研究、事例、マニュアル、技術支援情報を活用していることは信頼形成に重要。',
        issueJa: '内部データや個別相談情報を入れているように読めると危険。',
        improvementJa: 'NIVR、JEED、国内外の公的・実務資料等を一般的に説明し、個別相談情報を学習材料として扱っていない境界を明確にする。',
      },
    ],
    businessUseJa: ['提案時の信頼説明', '公開コンテンツの安全性説明', '専門性のブランド中核'],
    nextImprovementJa: ['内部語チェックを再実施する', '専門知識ネットワークの作る/使うプロセス図を再点検する'],
  },
  'about-boundary': {
    reviewSummaryJa:
      'サイト情報ページは、トップや専門性ページで説明済みのコンセプトを繰り返さず、運営者、責任者、目的、問い合わせ、免責、著作権、SNS自動投稿の案内に集中するのが適切。現在の方向は合っているが、表示安定性と権利文言の明確さを継続確認したい。',
    strongestUseJa: '読者・企業・支援者・メディアが、運営主体と利用境界を確認するページ。',
    betaFindings: [
      {
        findingId: 'about_operations_minimal',
        agentIds: ['nbl_trust_ops', 'nbl_partnership_lead'],
        severity: 'medium',
        lensJa: '運営情報',
        whatWorkedJa: '責任者、Researchmap、問い合わせ、免責、著作権、SNSフォローの整理は必要十分に近い。',
        issueJa: '古いページが一瞬表示されるなどの挙動が残ると、信頼ページとして致命的に見える。',
        improvementJa: 'SSR/no-storeと通常アンカー化のような安定化を継続し、旧コンテンツのちらつきがないか確認する。',
      },
      {
        findingId: 'about_copyright_reuse',
        agentIds: ['media_sns_reader', 'nbl_social_growth'],
        severity: 'low',
        lensJa: '共有と権利',
        whatWorkedJa: '無断転載・盗用は禁止しつつ、クレジット付き紹介やSNS拡散を歓迎する方針はNBLに合う。',
        issueJa: '標準ライセンスとの整合や例外が曖昧だと、使いたい人が迷う。',
        improvementJa: 'CC BY-NC相当の考え方を短く示し、商用・改変・大量転載は問い合わせ対象として分ける。',
      },
    ],
    businessUseJa: ['信頼確認の受け皿', '問い合わせ前の境界共有', 'SNS・引用利用の案内'],
    nextImprovementJa: ['表示安定性を継続検証する', '著作権・引用文言の最終レビューを行う'],
  },
};

export const AXIOM_VIRTUAL_BETA_BUSINESS_REVIEWS = [
  {
    businessReviewId: 'business_public_trust_front_door',
    titleJa: '公開信頼の入口としての使い道',
    valueHypothesisJa:
      '次期NBLサイトは、NBLが何を解こうとしているか、どの専門性で解くか、何をしないかを社会に示す信頼の入口になる。',
    useCasesJa: [
      '企業・行政・支援機関への初回共有URL',
      '講演・研修・共同研究の前提資料',
      'SNS投稿から深い読解へ戻す受け皿',
    ],
    risksJa: [
      '個別相談窓口と誤解されると運営負荷と責任境界が崩れる',
      '内部語や開発過程が残ると、専門性ではなく作業中の印象になる',
    ],
    nextOperatingMovesJa: [
      'トップとサイト情報に、個別相談ではなく共同検討・研修・教材活用の問い合わせであることを短く示す',
      'NBLの専門性ページを提案資料の説明母艦にする',
    ],
  },
  {
    businessReviewId: 'business_content_product_system',
    titleJa: 'コンテンツ事業の母艦としての使い道',
    valueHypothesisJa:
      '9ページは静的サイトで終わらず、記事、図解、4コマ、研修、フォーラム、SNSを相互に更新する編集システムになる。',
    useCasesJa: [
      'NBLレポートから研修テーマやフォーラムテーマを設計する',
      'ツールキット素材を会議・研修・SNSカードへ展開する',
      '相談事例ページを将来の安全な動的相談UIの仕様検討材料にする',
    ],
    risksJa: [
      '記事量や素材量が増えるほど、索引と検索が弱いと読まれない',
      'SNS反応を学習更新のように扱うと境界が崩れる',
    ],
    nextOperatingMovesJa: [
      'NBLレポートにテーマ/立場/仕事条件の索引を固定する',
      'SNS反応は「改善候補メモ」に止め、学習更新とは分ける',
    ],
  },
  {
    businessReviewId: 'business_partnership_and_revenue',
    titleJa: '共同実装・収益化の足場としての使い道',
    valueHypothesisJa:
      'サイトは営業ページではなく、企業・行政・支援機関がNBLと共同で扱うべき問題の解像度を上げる公共的な前提資料になる。',
    useCasesJa: [
      '企業研修・管理職研修・支援者研修の教材化',
      '自治体・研究会・職業リハビリ領域の共同検討',
      '図解・記事・フォーラムを組み合わせたテーマ別パッケージ',
    ],
    risksJa: [
      '成果保証や合理的配慮判定のように読まれると危険',
      '無料公開と有償支援の境界が曖昧だと問い合わせの期待値がズレる',
    ],
    nextOperatingMovesJa: [
      '「活用相談」は個別ケース判断でなく、研修・教材・共同検討・調査研究に限定して表現する',
      '問い合わせ前に読んでほしい代表ページをトップまたはサイト情報から案内する',
    ],
  },
] as const satisfies readonly AxiomVirtualBetaBusinessReview[];

export const AXIOM_VIRTUAL_BETA_PRIORITY_IMPROVEMENTS = [
  {
    improvementId: 'p0_public_candidate_internal_language_sweep',
    severity: 'high',
    titleJa: '公開候補ページ全体の内部語・開発語の除去',
    affectedPageSlugs: [
      'home',
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
      'about-boundary',
    ],
    ownerLensJa: 'NBL編集・信頼運営',
    actionJa:
      'Axiom、kernel、missing contextなど内部語が読者向け文脈に漏れていないかを全ページで点検し、必要な場合は公開向けの言葉へ置換する。',
    whyNowJa: '公開直前の印象を最も損ないやすく、かつ一括で改善効果が大きい。',
  },
  {
    improvementId: 'p0_accessibility_and_visual_alt_review',
    severity: 'high',
    titleJa: 'Image-2.0図解・4コマの内容一致とアクセシビリティ点検',
    affectedPageSlugs: [
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
    ],
    ownerLensJa: '視覚障害・情報アクセス・編集',
    actionJa:
      '図解が本文内容と一致しているか、画像内日本語が読めるか、代替テキストだけでも要点が分かるかを確認する。',
    whyNowJa: 'Axiom版サイトの強みは右脳的理解支援なので、画像の不一致や代替情報不足は価値を直接損なう。',
  },
  {
    improvementId: 'p1_business_use_path_without_individual_consultation',
    severity: 'medium',
    titleJa: 'NBL事業活用への最小導線を追加する',
    affectedPageSlugs: ['home', 'articles-social-questions', 'toolkit-studio', 'about-boundary'],
    ownerLensJa: '事業開発・運営境界',
    actionJa:
      '個別相談ではなく、研修・教材・共同検討・講演・調査研究などの活用相談であることを明確にした短い導線を内部候補として作る。',
    whyNowJa: '公開後に関心を持った企業・行政・支援機関が、何を依頼できるか迷う可能性が高い。',
  },
  {
    improvementId: 'p1_report_index_and_infographic_alignment',
    severity: 'medium',
    titleJa: 'NBLレポートの索引・検索・図解対応を完成させる',
    affectedPageSlugs: ['articles-social-questions'],
    ownerLensJa: 'NBL編集・SNS社会対話',
    actionJa:
      '本格記事群をテーマ、立場、仕事条件、読後の問いで探せるようにし、各記事のインフォグラフィックを内容一致で差し替える。',
    whyNowJa: '記事量が増えるほど、読む入口と図解一致がなければページ価値が埋もれる。',
  },
  {
    improvementId: 'p1_case_assessment_branch_depth',
    severity: 'medium',
    titleJa: '相談事例ページの複数選択時の見立てと支援計画分岐を厚くする',
    affectedPageSlugs: ['case-readings'],
    ownerLensJa: '就労支援・アセスメント',
    actionJa:
      '複数の具体領域を選んだ場合に、当初の見立て、確認質問、条件変化、支援計画例が組み合わさって見えるかを点検する。',
    whyNowJa: 'このページは将来の相談UI仕様の前身なので、アセスメントの筋の良さが重要。',
  },
] as const satisfies readonly AxiomVirtualBetaPriorityImprovement[];

function findBlueprint(row: FalconAxiomPublicSiteUpdatePlanRow) {
  const blueprint = PAGE_REVIEW_BLUEPRINTS[row.slug];
  if (!blueprint) {
    throw new Error(`virtual_beta_page_review_blueprint_missing:${row.slug}`);
  }
  return blueprint;
}

function buildPageReview(row: FalconAxiomPublicSiteUpdatePlanRow): AxiomVirtualBetaPageReview {
  const blueprint = findBlueprint(row);
  return {
    pageSlug: row.slug,
    pagePath: row.path,
    navLabelJa: row.navLabelJa,
    pageRoleJa: row.falconPageRoleJa,
    ...blueprint,
  };
}

export function buildAxiomNextNblVirtualBetaRun(): AxiomNextNblVirtualBetaRun {
  const plan = buildFalconAxiomPublicSiteUpdatePlan();
  const pageReviews = plan.rows.map((row) => buildPageReview(row));
  const findingCount = pageReviews.reduce((sum, page) => sum + page.betaFindings.length, 0);

  return {
    runId: `axiom_next_nbl_virtual_beta_test:${AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_VERSION}`,
    objectType: 'axiom_next_nbl_virtual_beta_test_run',
    version: AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_VERSION,
    lane: 'Falcon Lab',
    status: 'internal_virtual_beta_completed_not_public_approval',
    boundary: AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_BOUNDARY,
    candidateRouteBase: AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE,
    agentCount: AXIOM_VIRTUAL_BETA_AGENTS.length,
    pageCount: 9,
    findingCount,
    agents: [...AXIOM_VIRTUAL_BETA_AGENTS],
    pageReviews,
    businessReviews: [...AXIOM_VIRTUAL_BETA_BUSINESS_REVIEWS],
    priorityImprovements: [...AXIOM_VIRTUAL_BETA_PRIORITY_IMPROVEMENTS],
    executiveSummaryJa: [
      'バーチャルベータでは、次期サイトは「公開候補として読める」段階に近づいている一方、公開直前の重点は内部語除去、図解と本文の一致、アクセシビリティ、事業活用導線の最小整理である。',
      '利用者視点では、相談事例、設計ガイド、8つの課題、障害種類から見る入口が特に価値を持つ。弱点は、説明過多になる瞬間と、図解が本文とズレる瞬間に集中する。',
      'NBL事業視点では、サイトは営業ページではなく、研修・共同検討・教材・レポート・SNS社会対話を支える信頼母艦として使うのが自然である。',
    ],
    notNow: [
      'no_public_approval',
      'no_publication_execution',
      'no_actual_public_navigation_change',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_source_support_validity_finality',
      'no_candidate_pattern_promotion',
      'no_individual_consultation_or_case_judgment',
      'no_personal_data_collection_or_feedback_form_activation',
      'no_learning_update_from_virtual_beta',
    ],
  };
}

function pushIf(condition: boolean, errors: string[], error: string) {
  if (condition) errors.push(error);
}

export function validateAxiomNextNblVirtualBetaRun(
  run: AxiomNextNblVirtualBetaRun,
): AxiomNextNblVirtualBetaRunValidation {
  const errors: string[] = [];
  const plan = buildFalconAxiomPublicSiteUpdatePlan();
  const expectedSlugs = plan.rows.map((row) => row.slug);
  const reviewedSlugs = run.pageReviews.map((review) => review.pageSlug);
  const agentIds = new Set(run.agents.map((agent) => agent.agentId));
  const stakeholderGroups = new Set(run.agents.map((agent) => agent.stakeholderGroup));
  const findingAgentIds = run.pageReviews.flatMap((review) =>
    review.betaFindings.flatMap((finding) => finding.agentIds),
  );

  pushIf(run.objectType !== 'axiom_next_nbl_virtual_beta_test_run', errors, 'object_type_must_match');
  pushIf(run.version !== AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_VERSION, errors, 'version_must_match');
  pushIf(run.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(run.status !== 'internal_virtual_beta_completed_not_public_approval', errors, 'status_must_not_be_public_approval');
  pushIf(run.boundary !== AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_BOUNDARY, errors, 'boundary_must_remain_internal_virtual_beta');
  pushIf(run.candidateRouteBase !== AXIOM_NEXT_NBL_PUBLIC_CANDIDATE_ROUTE_BASE, errors, 'candidate_route_base_must_match');
  pushIf(run.pageCount !== 9, errors, 'page_count_must_be_9');
  pushIf(run.pageReviews.length !== 9, errors, 'must_review_all_9_pages');
  pushIf(run.agentCount !== run.agents.length, errors, 'agent_count_must_match_agents');
  pushIf(run.agents.length < 12, errors, 'must_have_broad_virtual_beta_agent_coverage');
  pushIf(run.businessReviews.length < 3, errors, 'must_have_business_team_review_coverage');
  pushIf(run.priorityImprovements.length < 5, errors, 'must_have_actionable_improvement_queue');

  for (const slug of expectedSlugs) {
    pushIf(!reviewedSlugs.includes(slug), errors, `missing_page_review:${slug}`);
  }

  for (const review of run.pageReviews) {
    pushIf(
      review.betaFindings.length < 2,
      errors,
      `each_page_needs_at_least_two_beta_findings:${review.pageSlug}`,
    );
    pushIf(
      review.nextImprovementJa.length < 2,
      errors,
      `each_page_needs_next_improvements:${review.pageSlug}`,
    );
    pushIf(
      !review.pagePath.startsWith(run.candidateRouteBase),
      errors,
      `page_path_must_remain_internal_candidate:${review.pageSlug}`,
    );
  }

  for (const agentId of findingAgentIds) {
    pushIf(!agentIds.has(agentId), errors, `finding_references_unknown_agent:${agentId}`);
  }

  const requiredGroups: AxiomVirtualBetaStakeholderGroup[] = [
    'disabled_worker_or_jobseeker',
    'rare_disease_or_chronic_condition_worker',
    'sensory_access_user',
    'employer_hr_dei',
    'employment_support_provider',
    'policy_research_administration',
    'nbl_product_editorial',
    'nbl_partnership_revenue',
    'nbl_trust_operations',
  ];
  for (const group of requiredGroups) {
    pushIf(!stakeholderGroups.has(group), errors, `missing_stakeholder_group:${group}`);
  }

  for (const requiredBoundary of [
    'no_public_approval',
    'no_publication_execution',
    'no_runtime_prompt_retrieval_model_provider_db_schema_change',
    'no_individual_consultation_or_case_judgment',
    'no_learning_update_from_virtual_beta',
  ]) {
    pushIf(!run.notNow.includes(requiredBoundary), errors, `missing_not_now:${requiredBoundary}`);
  }

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'axiom_next_nbl_virtual_beta_run_valid'
        : 'axiom_next_nbl_virtual_beta_run_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_NEXT_NBL_VIRTUAL_BETA_TEST_BOUNDARY,
  };
}
