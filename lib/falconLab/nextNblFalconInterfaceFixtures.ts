import {
  Activity,
  BadgeCheck,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  Database,
  Ear,
  FileSearch,
  Handshake,
  Image as ImageIcon,
  Map,
  Megaphone,
  Network,
  Route,
  Scale,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TimerReset,
  UserRoundCheck,
  UsersRound,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type FalconPrinciple = {
  id: string;
  title: string;
  short: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type ContextBranch = {
  id: string;
  title: string;
  count: number;
  signal: string;
  question: string;
  principleIds: string[];
};

export type ContextBranchGroup = {
  id: string;
  title: string;
  body: string;
  branches: ContextBranch[];
};

export type ImprovementTask = {
  id: string;
  title: string;
  coreQuestion: string;
  branchIds: string[];
};

export type EntryAxis = {
  id: string;
  label: string;
  branchIds: string[];
};

export type SocialRoute = {
  id: string;
  label: string;
  job: string;
  branchIds: string[];
};

export type WorkDesignMapNode = {
  id: string;
  label: string;
  role: string;
  publicExplanation: string;
  firstQuestion: string;
  designMove: string;
  riskIfFlattened: string;
  branchIds: string[];
  listeningThemeIds: string[];
  icon: LucideIcon;
};

export type WorkDesignToolboxPlane = {
  id: string;
  label: string;
  purpose: string;
  items: string[];
  branchIds: string[];
  icon: LucideIcon;
};

export type WorkDesignReturnPath = {
  id: string;
  label: string;
  fromSignal: string;
  nextAction: string;
  boundary: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type HeronMigrationDecision =
  | 'rewrite_for_falcon'
  | 'keep_heron_stable'
  | 'reuse_as_context'
  | 'hold_for_review';

export type HeronMigrationCandidate = {
  id: string;
  surface: string;
  routes: string[];
  currentRole: string;
  heronValue: string;
  falconOpportunity: string;
  migrationDecision: HeronMigrationDecision;
  targetSurface: string;
  workDesignRisk: string;
  publicCopyRisk: string;
  sourceReviewNeed: string;
  nextAction: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type HeronMigrationGate = {
  id: string;
  label: string;
  question: string;
  stopIf: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type StakeholderReviewLens = {
  id: string;
  label: string;
  reviewerSeat: string;
  primaryQuestion: string;
  canJudge: string;
  cannotJudge: string;
  recordAs: string;
  branchIds: string[];
  agentIds: string[];
  heronCandidateIds: string[];
  icon: LucideIcon;
};

export type StakeholderReviewCard = {
  id: string;
  title: string;
  artifactToRead: string;
  whyThisMatters: string;
  reviewPrompt: string;
  goodSignal: string;
  stopSignal: string;
  output: string;
  branchIds: string[];
  lensIds: string[];
  heronCandidateIds: string[];
  icon: LucideIcon;
};

export type StakeholderReviewStep = {
  id: string;
  label: string;
  job: string;
  doNotDo: string;
  output: string;
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
  reviewCardIds: string[];
  heronCandidateIds: string[];
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type WorkDesignStudioStep = {
  id: string;
  label: string;
  job: string;
  pe01Input: string;
  pe03Input: string;
  output: string;
  doNotDo: string;
  icon: LucideIcon;
};

export type WorkDesignStudioSignal = {
  id: string;
  label: string;
  readAs: string;
  recordAs: string;
  nextMove: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type PartnershipTheme = {
  id: string;
  label: string;
  partnerType: string;
  startingSurface: string;
  jointQuestion: string;
  firstArtifact: string;
  nblProvides: string[];
  partnerProvides: string[];
  notProvided: string[];
  safeFirstStep: string;
  stopIf: string;
  branchIds: string[];
  agentIds: string[];
  heronCandidateIds: string[];
  productExperimentIds: string[];
  icon: LucideIcon;
};

export type PartnershipStep = {
  id: string;
  label: string;
  job: string;
  output: string;
  doNotDo: string;
  icon: LucideIcon;
};

export type PartnershipGate = {
  id: string;
  label: string;
  question: string;
  stopIf: string;
  nextIfPass: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type PartnershipOpportunityBridge = {
  id: string;
  label: string;
  sourceSignal: string;
  status: string;
  linkedThemeId: string;
  whyItMatters: string;
  separateChat: string;
  minimumOutput: string[];
  returnToCore: string[];
  doNotDo: string[];
  reviewNeeded: string;
  icon: LucideIcon;
};

export type PolicyTranslationStep = {
  id: string;
  label: string;
  job: string;
  output: string;
  holdIf: string;
  icon: LucideIcon;
};

export type PolicySourceLane = {
  id: string;
  label: string;
  sourceRole: string;
  safeLayer: string;
  usableFor: string;
  notUsableFor: string;
  liveVerification: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type PolicyTranslationCard = {
  id: string;
  title: string;
  sourceSignal: string;
  sourceLaneIds: string[];
  policyResearchQuestion: string;
  falconTranslation: string;
  icfInteraction: string[];
  workDesignOutput: string;
  publicUseHold: string;
  returnSurface: string;
  branchIds: string[];
  agentIds: string[];
  heronCandidateIds: string[];
  productExperimentIds: string[];
  icon: LucideIcon;
};

export type PolicyTranslationGate = {
  id: string;
  label: string;
  check: string;
  stopIf: string;
  nextIfPass: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type PolicyTranslationReturnRoute = {
  id: string;
  label: string;
  fromPolicyDesk: string;
  sendTo: string;
  onlyAs: string;
  neverAs: string;
  icon: LucideIcon;
};

export type ProductionDeliverable = {
  id: string;
  label: string;
  role: string;
  firstBuild: string;
  operatingPosture: string;
  notYet: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type ProductionHostingConstraint = {
  id: string;
  label: string;
  currentFact: string;
  risk: string;
  productionPosture: string;
  nextAction: string;
  sourceNote: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type ProductionSnsAccountLane = {
  id: string;
  label: string;
  currentState: string;
  roleForV0: string;
  doNow: string;
  doNotDo: string;
  launchBlocker: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type ProductionFeedbackLoopStep = {
  id: string;
  label: string;
  input: string;
  classifyAs: string;
  output: string;
  doNotStore: string;
  icon: LucideIcon;
};

export type ProductionOpsGate = {
  id: string;
  label: string;
  check: string;
  stopIf: string;
  nextIfPass: string;
  icon: LucideIcon;
};

export type SocialImpactTargetSegment = {
  id: string;
  label: string;
  audience: string;
  feltGap: string;
  whyTheyCare: string;
  falconValue: string;
  firstSurface: string;
  message: string;
  notFirstMove: string;
  impactLever: string;
  branchIds: string[];
  productExperimentIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type TargetMessageRewrite = {
  id: string;
  label: string;
  abstractBefore: string;
  targetAfter: string;
  whyBetter: string;
  riskIfOverdone: string;
  icon: LucideIcon;
};

export type TargetSurfaceRoute = {
  id: string;
  label: string;
  audienceTrigger: string;
  firstQuestion: string;
  firstSurface: string;
  conversionArtifact: string;
  listenFor: string;
  doNotRouteTo: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type TargetingGate = {
  id: string;
  label: string;
  check: string;
  stopIf: string;
  nextIfPass: string;
  icon: LucideIcon;
};

export type SocialInterfacePersonalityTrait = {
  id: string;
  label: string;
  stance: string;
  socialBehavior: string;
  teamPractice: string;
  publicVoice: string;
  antiPattern: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type SocialInterfaceCoreExpertEnablement = {
  id: string;
  label: string;
  risk: string;
  supportDesign: string;
  teamPractice: string;
  protectedOutput: string;
  boundary: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type SocialInterfaceConversationMove = {
  id: string;
  label: string;
  whenUsed: string;
  sayThis: string;
  askThis: string;
  listenFor: string;
  returnTo: string;
  doNotDo: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type SocialInterfaceGrowthLoopStep = {
  id: string;
  label: string;
  input: string;
  teamResponse: string;
  artifactChange: string;
  boundary: string;
  icon: LucideIcon;
};

export type SocialInterfacePersonalityGate = {
  id: string;
  label: string;
  check: string;
  stopIf: string;
  nextIfPass: string;
  icon: LucideIcon;
};

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
  staticAssets: string[];
  noApiReason: string;
  sourceStatus: string;
  boundary: string;
  branchIds: string[];
  productExperimentIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type StaticBuildChecklistItem = {
  id: string;
  label: string;
  mustHave: string;
  avoid: string;
  output: string;
  icon: LucideIcon;
};

export type SnsAccountProfileCandidate = {
  id: string;
  label: string;
  accountLaneId: string;
  handleCandidates: string[];
  bioDraft: string;
  pinnedPostDraft: string;
  avatarBrief: string;
  beforeCreate: string;
  doNotDo: string;
  icon: LucideIcon;
};

export type SnsAccountIdentityDecision = {
  id: string;
  title: string;
  status: string;
  recommendedXDisplayName: string;
  recommendedXHandle: string;
  handleAlternatives: string[];
  handleAvailabilityNote: string;
  xBioDraft: string;
  xPinnedPostDraft: string;
  avatarDecision: string;
  avatarAvoid: string[];
  officialXRole: string;
  founderPersonalPolicy: string;
  facebookPolicy: string;
  instagramPolicy: string;
  firstThirtyDaysRule: string;
  replyAndDmPolicy: string;
  beforeCreateChecklist: string[];
  boundaryNote: string;
  exportJsonPath: string;
  exportMarkdownPath: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type FounderAccountCreationPostCandidate = {
  queueItemId: string;
  experimentBufferId: string;
  theme: string;
  whyFirst: string;
  holdIf: string;
};

export type FounderAccountCreationReviewPacket = {
  id: string;
  title: string;
  status: string;
  sourceIdentityDecisionId: string;
  finalDisplayName: string;
  handleFallbackOrder: string[];
  handleCheckInstruction: string;
  bioFinalCandidate: string;
  pinnedPostFinalCandidate: string;
  avatarPreviewPath: string;
  avatarReviewNote: string;
  firstPostCandidates: FounderAccountCreationPostCandidate[];
  founderVisibleSummary: string;
  founderPersonalSplit: string;
  facebookSplit: string;
  replyStopRule: string;
  dmBoundary: string;
  publicCopyRiskReview: string;
  finalDecisionOptions: string[];
  boundaryChecks: string[];
  exportJsonPath: string;
  exportMarkdownPath: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type ExistingAccountActivationReviewPacket = {
  id: string;
  title: string;
  status: string;
  existingHandle: string;
  handleSourceNote: string;
  recommendedDisplayName: string;
  profileBioCandidate: string;
  pinnedPostCandidate: string;
  avatarCandidatePath: string;
  accountRole: string;
  founderActionChecklist: string[];
  firstPostPacketId: string;
  firstPostGate: string;
  replyAndDmStop: string;
  profileRiskReview: string;
  finalDecisionOptions: string[];
  boundaryChecks: string[];
  exportJsonPath: string;
  exportMarkdownPath: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type FirstThreePostsFounderReviewItem = {
  queueItemId: string;
  sourceExperimentBufferId: string;
  theme: string;
  draftPost: string;
  targetReader: string;
  founderDecisionQuestion: string;
  publishWindow: string;
  targetProductReturn: string[];
  observeForLearning: string[];
  doNotMeasure: string[];
  misunderstandingSignals: string[];
  revisionIfMisread: string;
  holdBoundary: string;
  publicCopyRiskStatus: string;
  campaignBoundaryStatus: string;
  decisionOptions: string[];
};

export type FirstThreePostsFounderReviewPacket = {
  id: string;
  title: string;
  status: string;
  sourceAccountCreationPacketId: string;
  purpose: string;
  founderShield: string;
  operatingRule: string;
  accountDependency: string;
  noReactionMetricRule: string;
  reviewRhythm: string;
  items: FirstThreePostsFounderReviewItem[];
  packetDecisionOptions: string[];
  boundaryChecks: string[];
  exportJsonPath: string;
  exportMarkdownPath: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type PostAftercareLearningNoteField = {
  id: string;
  label: string;
  capture: string;
  doNotCapture: string;
  returnTo: string;
};

export type PostAftercareLearningNoteTemplate = {
  id: string;
  title: string;
  status: string;
  sourceFirstPostPacketId: string;
  accountHandle: string;
  trigger: string;
  reviewWindows: string[];
  founderShield: string;
  postingAutomationStatus: string;
  futureAutomationGate: string;
  allowedInputs: string[];
  forbiddenInputs: string[];
  fields: PostAftercareLearningNoteField[];
  decisionOptions: string[];
  boundaryChecks: string[];
  exportJsonPath: string;
  exportMarkdownPath: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type NextBeingLabManualLaunchStep = {
  id: string;
  label: string;
  action: string;
  doneSignal: string;
  stopIf: string;
};

export type NextBeingLabManualLaunchCopyBlock = {
  id: string;
  label: string;
  surface: string;
  pasteTarget: string;
  copy: string;
  founderCheck: string;
};

export type NextBeingLabManualLaunchAftercareWindow = {
  windowLabel: string;
  founderDoesNotOpen: string;
  aiReadsOnly: string;
  notePrompt: string;
  nextAction: string;
};

export type NextBeingLabManualLaunchKit = {
  id: string;
  title: string;
  status: string;
  accountHandle: string;
  launchMode: string;
  sourceExistingAccountPacketId: string;
  sourceFirstPostPacketId: string;
  sourceAftercarePacketId: string;
  preflightSteps: NextBeingLabManualLaunchStep[];
  copyBlocks: NextBeingLabManualLaunchCopyBlock[];
  aftercareWindows: NextBeingLabManualLaunchAftercareWindow[];
  completionCriteria: string[];
  notDone: string[];
  boundaryChecks: string[];
  exportJsonPath: string;
  exportMarkdownPath: string;
  copyTextPath: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type SnsManualQueueExportPack = {
  id: string;
  label: string;
  jsonPath: string;
  markdownPath: string;
  columns: string[];
  templateBlocks: string[];
  operationRule: string;
  notIncluded: string;
  icon: LucideIcon;
};

export type SnsManualQueueItem = {
  id: string;
  theme: string;
  accountLaneId: string;
  platformGroup: string;
  status: string;
  nblXDraft: string;
  instagramSlides: string[];
  facebookDraft: string;
  founderAmplifierDraft: string;
  visualBrief: string;
  returnDestination: string;
  expectedSignal: string;
  replyStopRule: string;
  boundaryNote: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type SocialSignalScoutRecord = {
  signalId: string;
  observedAt: string;
  signalType: string;
  shortDescription: string;
  sourceUrlOrNote: string;
  currentClaimRisk: string;
  personalDataRisk: string;
  scoutNote: string;
};

export type SocialSignalContentRouteDecision = {
  route: string;
  returnDestination: string;
  reason: string;
  missingContext: string;
  liveVerificationNeeded: string;
};

export type SocialSignalPostPackCandidate = {
  targetReader: string;
  shortHook: string;
  returnDestination: string;
  visualBrief: string;
  doNotReplyAsAdviceNote: string;
  humanReviewNeeded: string;
};

export type SocialSignalReactionReadingNote = {
  reactionWindow: string;
  misunderstandingSignal: string;
  silenceOrLowReactionReading: string;
  additionalQuestion: string;
  collaborationSignal: string;
  notEvidenceNote: string;
};

export type SocialSignalRevisionTask = {
  targetSurface: string;
  changeNeeded: string;
  priority: string;
  boundaryReason: string;
  ownerRole: string;
};

export type SocialSignalTeamPass = {
  role: string;
  decision: string;
  stopCondition: string;
};

export type SocialSignalScoutPack = {
  id: string;
  title: string;
  status: string;
  purpose: string;
  founderQuestion: string;
  noGo: string[];
  socialSignalRecord: SocialSignalScoutRecord;
  contentRouteDecision: SocialSignalContentRouteDecision;
  socialPostPackCandidate: SocialSignalPostPackCandidate;
  reactionReadingNote: SocialSignalReactionReadingNote;
  revisionTasks: SocialSignalRevisionTask[];
  teamPasses: SocialSignalTeamPass[];
  automationBoundary: string;
  exportJsonPath: string;
  exportMarkdownPath: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type FalconCuriositySourceBand = {
  id: string;
  label: string;
  whatFalconLooksFor: string;
  allowedUse: string;
  mustNotUseAs: string;
  routingGate: string;
  icon: LucideIcon;
};

export type FalconCuriosityGrowthStep = {
  id: string;
  label: string;
  falconMove: string;
  internalArtifact: string;
  founderSees: string;
  stopIf: string;
  icon: LucideIcon;
};

export type FalconCuriosityProbePack = {
  id: string;
  title: string;
  status: string;
  curiosityQuestion: string;
  whyItMatters: string;
  sourceBandIds: string[];
  whatFalconNotices: string[];
  structuralReframe: string;
  productReturn: string[];
  growthHypothesis: string;
  experimentShape: string;
  founderShield: string;
  learningBoundary: string;
  nextArtifact: string;
  doNotDo: string[];
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type SnsExperimentHookVariant = {
  id: string;
  label: string;
  hook: string;
  intendedLearning: string;
  riskIfMisread: string;
};

export type SnsExperimentBuffer = {
  id: string;
  title: string;
  status: string;
  curiosityProbeId: string;
  scoutPackId: string;
  targetReader: string;
  hookVariants: SnsExperimentHookVariant[];
  whatToObserve: string[];
  whatNotToMeasure: string[];
  founderVisibility: string;
  productReturn: string[];
  holdCondition: string;
  boundaryNote: string;
  nextRevisionPacket: string;
  automationBoundary: string;
  exportJsonPath: string;
  exportMarkdownPath: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type SnsQueueChecklistItem = {
  id: string;
  label: string;
  check: string;
  stopIf: string;
  output: string;
  icon: LucideIcon;
};

export type VisualAssetPlan = {
  id: string;
  label: string;
  format: string;
  hook: string;
  imagePromptSeed: string;
  guardrail: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type SnsAutomationStep = {
  id: string;
  label: string;
  job: string;
  automation: string;
  humanGate: string;
  icon: LucideIcon;
};

export type SnsNativeOperatingLoop = {
  id: string;
  label: string;
  job: string;
  aiDoes: string;
  founderDoes: string;
  output: string;
  successSignal: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type SnsRelationshipRing = {
  id: string;
  label: string;
  who: string;
  listenFor: string;
  engagementMove: string;
  returnTo: string;
  doNotDo: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type SnsMotivationGuard = {
  id: string;
  label: string;
  rule: string;
  reason: string;
  metric: string;
  icon: LucideIcon;
};

export type SnsListeningTheme = {
  id: string;
  title: string;
  audience: string;
  structuralShift: string;
  hook: string;
  listeningQuestion: string;
  bodyOutline: string[];
  visualPromptSeed: string;
  returnDestination: string;
  likelyMisunderstanding: string;
  doNotReplyTo: string;
  humanReviewGate: string;
  responseTaxonomyIds: string[];
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type SnsResponseTaxonomy = {
  id: string;
  label: string;
  captureAs: string;
  neverTreatAs: string;
  humanGate: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type AgentCouncilRole = {
  id: string;
  label: string;
  mission: string;
  output: string;
  guardrail: string;
  branchIds: string[];
  icon: LucideIcon;
};

export type ProductExperiment = {
  id: string;
  label: string;
  surface: string;
  hypothesis: string;
  firstArtifact: string;
  successSignal: string;
  hardBoundary: string;
  branchIds: string[];
  agentIds: string[];
  icon: LucideIcon;
};

export type AgileExecutionLoopStep = {
  id: string;
  label: string;
  job: string;
  output: string;
  killIf: string;
  icon: LucideIcon;
};

export const interfaceStatus = {
  lane: 'Falcon Lab',
  reviewStatus: '未レビュー',
  runtimeStatus: 'runtime未接続',
  publicStatus: '公開未承認',
  dataHandling: '自由記述入力なし',
};

export const entryAxes: EntryAxis[] = [
  {
    id: 'health-time',
    label: '体調変動・治療時間',
    branchIds: ['QR-01', 'QR-04'],
  },
  {
    id: 'information-procedure',
    label: '情報保障・仕事手順',
    branchIds: ['QR-02', 'QR-06'],
  },
  {
    id: 'work-contact',
    label: '仕事接触点・環境',
    branchIds: ['QR-03', 'QR-08'],
  },
  {
    id: 'entry-life-security',
    label: '入口以前・生活保障',
    branchIds: ['QR-04', 'QR-05'],
  },
  {
    id: 'quality-career',
    label: '参加品質・評価',
    branchIds: ['QR-07', 'QR-01'],
  },
  {
    id: 'policy-interface',
    label: '行政課題・社会接点',
    branchIds: ['QR-08', 'QR-02', 'QR-07'],
  },
];

export const agileExecutionLoop = {
  title: '自律並行・社会学習ループ',
  thesis:
    'このLabは小刻みな承認待ちの装置ではない。承認境界内では複数面を自律並行で進め、完成成果物を社会インターフェイスへ出し、実社会の反応で改善するための作業台である。',
  steps: [
    {
      id: 'AL-01',
      label: '束ねて決める',
      job: 'PE-01からPE-06、PTブリッジ、SNS、研修、政策翻訳を、独立部署ではなく一つの完成成果物群として束ねる。',
      output: 'parallel work bundle / default decisions / hard-boundary list.',
      killIf: 'Founderへの細かい確認待ち、承認待ち表、会議体、担当割りだけが増える。',
      icon: Route,
    },
    {
      id: 'AL-02',
      label: '完成物まで作る',
      job: '画面、コピー、投稿案、研修骨子、人工シナリオ、source memo、連携ノートを、読める完成物として一気通貫で作る。',
      output: 'finished artifact set with internal boundaries.',
      killIf: '方針、要綱、レビュー手順、途中メモだけが増え、読める完成物が増えない。',
      icon: ClipboardCheck,
    },
    {
      id: 'AL-03',
      label: '社会接点で試す',
      job: '実在ケースを集めず、サイト、SNS、研修、共同設計、政策対話、連携候補の反応を、社会側の問い・誤解・関心として受け取る。',
      output: 'social feedback signals / misunderstanding map / opportunity signals.',
      killIf:
        'Founderだけとの確認ループ、内部レビューだけの品質保証、実在レビュー済み表示に変わる。',
      icon: SearchCheck,
    },
    {
      id: 'AL-04',
      label: '実装へ戻す',
      job: '社会から得た反応を、次期サイト、SNS、研修、政策翻訳、連携テーマ、Falcon知識ネットワークのどこに戻すかを決め、次版へ反映する。',
      output: 'next version / revised artifacts / source-readiness or explicit hold.',
      killIf: '反応の記録だけ残して、次の文言、画面、カード、研修、提案、知識整理に反映されない。',
      icon: Workflow,
    },
  ] satisfies AgileExecutionLoopStep[],
};

export const falconPrinciples: FalconPrinciple[] = [
  {
    id: 'FP-01',
    title: '属性より先に相互作用を見る',
    short: '疾病・障害種類は説明の中心ではなく、構造がどの形を取るかを変える条件窓。',
    branchIds: ['QR-08'],
    icon: Network,
  },
  {
    id: 'FP-02',
    title: '問題と解決を同じ構造の開閉として読む',
    short: '困難発生と困難軽減を別物にせず、同じ自由度が閉じた状態と開いた状態として比較する。',
    branchIds: ['QR-01', 'QR-03'],
    icon: SearchCheck,
  },
  {
    id: 'FP-03',
    title: '健康時間は仕事設計である',
    short: '体調変動、疲労、通院、回復を勤務量、休憩、役割、評価へ翻訳する。',
    branchIds: ['QR-01', 'QR-04'],
    icon: Activity,
  },
  {
    id: 'FP-04',
    title: '情報は仕事手順になって初めて参加を支える',
    short: '情報保障を、作業手順、安全確認、責任分担、評価、相談経路へ落とす。',
    branchIds: ['QR-02', 'QR-06'],
    icon: Ear,
  },
  {
    id: 'FP-05',
    title: '仕事接触点を設計単位にする',
    short: '設備、通勤、動線、道具を配慮項目ではなく仕事参加の接触点として見る。',
    branchIds: ['QR-03', 'QR-08'],
    icon: Map,
  },
  {
    id: 'FP-06',
    title: '開示は告白ではなく境界設計である',
    short: '仕事に必要な条件を、誰に、どこまで、どの手順へ接続するかを設計する。',
    branchIds: ['QR-06', 'QR-05'],
    icon: ShieldCheck,
  },
  {
    id: 'FP-07',
    title: '支援は存在ではなく再翻訳機能である',
    short: '支援者や制度が、本人条件・求人条件・職場条件を変化局面で再翻訳しているかを見る。',
    branchIds: ['QR-06', 'QR-01'],
    icon: Handshake,
  },
  {
    id: 'FP-08',
    title: '生活保障は仕事選択の自由度を形づくる',
    short: '収入、医療費、休業、家計、制度対象を、待つ・休む・戻る・選び直す自由度として読む。',
    branchIds: ['QR-04', 'QR-05'],
    icon: Scale,
  },
  {
    id: 'FP-09',
    title: '参加には深さと入口以前がある',
    short: '就職入口と定着だけでなく、役割、技能、評価、生活リズム、訓練、自信を見る。',
    branchIds: ['QR-07', 'QR-05'],
    icon: Route,
  },
  {
    id: 'FP-10',
    title: '評価は遂行を価値へ翻訳する装置である',
    short: '条件付き遂行が役割、技能、処遇、キャリアへ接続されているかを見る。',
    branchIds: ['QR-07', 'QR-01'],
    icon: BadgeCheck,
  },
  {
    id: 'FP-11',
    title: '少数条件窓は発見窓である',
    short: '件数が小さい枝を捨てず、多数派平均では消える接触点や自由度を残す。',
    branchIds: ['QR-08', 'QR-03'],
    icon: FileSearch,
  },
  {
    id: 'FP-12',
    title: '答えを渡すより、学習する構造を作る',
    short: '観察、構造仮説、反対仮説、境界例、実装、結果、レビューを接続する。',
    branchIds: ['QR-01', 'QR-02', 'QR-08'],
    icon: Sparkles,
  },
];

export const contextBranchGroups: ContextBranchGroup[] = [
  {
    id: 'stage1-routes',
    title: 'Stage 1 query routes',
    body: '調査データ、workshop、NIVR/web-cacheのSCIMA/FCHMA分析から、Codex上で引ける8つの入口。',
    branches: [
      {
        id: 'QR-01',
        title: '体調変動・治療時間・仕事設計',
        count: 1905,
        signal: '健康時間、勤務量、休憩、職務代替、評価条件が同時に動く。',
        question: '健康時間は、仕事側の時間構造と評価条件へ翻訳されているか。',
        principleIds: ['FP-02', 'FP-03', 'FP-07', 'FP-10', 'FP-12'],
      },
      {
        id: 'QR-02',
        title: '情報保障・仕事手順化',
        count: 1243,
        signal: '情報形式、確認可能性、責任所在、作業手順、安全、評価が接続する。',
        question: '情報は、仕事手順・安全確認・評価へ落ちているか。',
        principleIds: ['FP-04', 'FP-12'],
      },
      {
        id: 'QR-03',
        title: '仕事接触点・移動・物理環境',
        count: 834,
        signal: '通勤、動線、姿勢、設備、作業場所、安全確認が仕事参加を変える。',
        question: '配慮名ではなく、どの仕事接触点を変えているか。',
        principleIds: ['FP-02', 'FP-05', 'FP-11'],
      },
      {
        id: 'QR-04',
        title: '生活保障・仕事選択の順序',
        count: 861,
        signal: '収入、医療費、休業、家計、制度対象が、待つ・休む・戻る自由度を変える。',
        question: '生活保障は、仕事選択と健康時間の順序をどう変えているか。',
        principleIds: ['FP-03', 'FP-08'],
      },
      {
        id: 'QR-05',
        title: '入口以前参加・求人条件への翻訳',
        count: 1089,
        signal: '生活リズム、体力、訓練、説明、支援接続、職務イメージが応募前に動く。',
        question: '入口以前参加は、求人条件へ翻訳されているか。',
        principleIds: ['FP-06', 'FP-08', 'FP-09'],
      },
      {
        id: 'QR-06',
        title: '開示境界・相互翻訳',
        count: 1764,
        signal: '病名や障害名の開示ではなく、仕事に必要な条件をどこまで共有するかが問われる。',
        question: '開示範囲は、本人の尊厳と仕事手順の両方を守る境界になっているか。',
        principleIds: ['FP-04', 'FP-06', 'FP-07'],
      },
      {
        id: 'QR-07',
        title: '参加品質・評価・キャリア',
        count: 1565,
        signal: '働けていることと、役割、技能、処遇、将来見通しへ接続することは違う。',
        question: '条件付き遂行は、仕事の価値として評価されているか。',
        principleIds: ['FP-09', 'FP-10'],
      },
      {
        id: 'QR-08',
        title: '多様性条件窓・同型構造',
        count: 1467,
        signal: '疾病群、障害種類、年齢、性別などで、同じ構造が別形態を取る。',
        question: '少数条件窓にだけ見える接触点を、上位構造へ戻せているか。',
        principleIds: ['FP-01', 'FP-05', 'FP-11', 'FP-12'],
      },
    ],
  },
];

export const improvementTasks: ImprovementTask[] = [
  {
    id: 'JA-01',
    title: '病名・障害名別配慮リストから相互作用設計へ',
    coreQuestion: '分類で止めず、仕事・環境・情報・時間・評価との相互作用へ戻す。',
    branchIds: ['QR-08'],
  },
  {
    id: 'JA-02',
    title: '体調変動・治療時間を仕事設計の中心へ',
    coreQuestion: '健康時間を、勤務量、休憩、職務代替、評価、生活保障へ翻訳する。',
    branchIds: ['QR-01', 'QR-04'],
  },
  {
    id: 'JA-03',
    title: '情報保障を仕事手順・安全確認・評価へ落とす',
    coreQuestion: '情報提供で終えず、確認可能性、責任分担、作業手順へ接続する。',
    branchIds: ['QR-02', 'QR-06'],
  },
  {
    id: 'JA-04',
    title: '配慮項目ではなく仕事接触点を再設計する',
    coreQuestion: '設備名ではなく、移動、姿勢、情報、安全、評価の接触点を見る。',
    branchIds: ['QR-03', 'QR-08'],
  },
  {
    id: 'JA-05',
    title: '支援機関の有無から再翻訳ループへ',
    coreQuestion: '支援が何を、どの局面で、誰へ再翻訳しているかを見る。',
    branchIds: ['QR-06', 'QR-01'],
  },
  {
    id: 'JA-06',
    title: '生活保障を仕事選択の自由度として扱う',
    coreQuestion: '生活保障を、休む・戻る・選び直す自由度として仕事設計に入れる。',
    branchIds: ['QR-04', 'QR-05'],
  },
  {
    id: 'JA-07',
    title: '就職・定着だけでなく参加の質と入口以前を見る',
    coreQuestion: '役割、技能、評価、処遇、生活リズム、訓練、自信を読む。',
    branchIds: ['QR-07', 'QR-05'],
  },
  {
    id: 'JA-08',
    title: '開示負担を本人に集中させず境界を設計する',
    coreQuestion: '本人の説明責任ではなく、翻訳責任と情報共有範囲を設計する。',
    branchIds: ['QR-06', 'QR-02'],
  },
  {
    id: 'JA-09',
    title: '静的ガイダンスから学習する専門知識ネットワークへ',
    coreQuestion: '候補命題、反対命題、境界例、実装条件、結果学習をつなぐ。',
    branchIds: ['QR-01', 'QR-02', 'QR-08'],
  },
];

export const socialRoutes: SocialRoute[] = [
  {
    id: 'SR-01',
    label: 'First Principles Explorer',
    job: 'Falconの12第一原理と5層モデルを、一般読者が理解できる入口にする。',
    branchIds: ['QR-08', 'QR-01', 'QR-02'],
  },
  {
    id: 'SR-02',
    label: 'Self Evaluation / Consultation Prep',
    job: '利用者が自由度をチェックし、相談・検討しやすい構造メモとして保存する。',
    branchIds: ['QR-01', 'QR-03', 'QR-05', 'QR-06'],
  },
  {
    id: 'SR-03',
    label: 'Policy / Administrative Lens',
    job: '厚労省研究会・統計・認定制度を、Falcon第一原理で読み替える。',
    branchIds: ['QR-08', 'QR-07', 'QR-04'],
  },
  {
    id: 'SR-04',
    label: 'Work Redesign Lab',
    job: '企業・支援者が配慮項目でなく、仕事接触点と評価条件を検討する。',
    branchIds: ['QR-03', 'QR-02', 'QR-07'],
  },
  {
    id: 'SR-05',
    label: 'Heron Reuse Review',
    job: 'Heronの既存ページを、再利用、修正、保留に分けてFalcon化する。',
    branchIds: ['QR-08', 'QR-03', 'QR-06'],
  },
  {
    id: 'SR-06',
    label: 'SNS Structure Posts',
    job: '一つの見方の変換を短く届け、自己評価・公式資料確認へ戻す。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
  },
];

export const workDesignMapIntro = {
  eyebrow: 'PE-01 Public Work Design Map',
  title: '仕事の困難を、人・仕事・環境・支援・時間・制度の接点として見る',
  body: 'NBLの次期第一接点は、病名別配慮表でも、相談チャット入口でもなく、働きにくさや働きやすさがどこで生まれるかを一緒に見る仕事設計マップです。',
  oneMinute:
    '病名や障害名は大切な情報ですが、それだけでは仕事上の困難も可能性も説明しきれません。Falconは、体調、作業、情報、環境、支援、生活保障、評価が接する場所を読み、どこを変えれば自由度が開くかを考えます。このマップは、誰かを判定するためではなく、相談・支援・職場設計・政策対話の前に、見るべき接点をそろえるための入口です。',
  notThis: '病名から配慮を引く表、AI相談受付、雇用・法務・医療判断の自動化',
  insteadThis: '仕事参加の接点を見える化し、次に確認すべき問いをそろえる入口',
};

export const workDesignMapNodes: WorkDesignMapNode[] = [
  {
    id: 'WM-01',
    label: '健康時間',
    role: '体調変動、疲労、通院、回復を仕事の時間構造として見る。',
    publicExplanation: '働く時間、休む時間、戻る時間を分けて考える接点。',
    firstQuestion: '勤務量、休憩、通院、回復、代替は評価条件とつながっているか。',
    designMove: '時間割、休憩、役割代替、回復余白、見直し窓を設計する。',
    riskIfFlattened: '本人の不安定さ、欠勤リスク、根性論として処理される。',
    branchIds: ['QR-01', 'QR-04'],
    listeningThemeIds: ['SLS-02'],
    icon: TimerReset,
  },
  {
    id: 'WM-02',
    label: '仕事接触点',
    role: '作業、動線、道具、姿勢、情報、安全確認が仕事参加を変える単位。',
    publicExplanation: '配慮名ではなく、どの仕事場面を変えるかを見る接点。',
    firstQuestion: 'やりにくさは、作業、道具、場所、情報、確認、評価のどこで起きているか。',
    designMove: '作業手順、道具、配置、確認方法、負荷、エラー許容度を分解する。',
    riskIfFlattened: '配慮リストの有無、設備の有無だけで判断される。',
    branchIds: ['QR-03', 'QR-08'],
    listeningThemeIds: ['SLS-03'],
    icon: Map,
  },
  {
    id: 'WM-03',
    label: '情報と手順',
    role: '情報保障を、作業手順、安全確認、責任分担、評価へ落とす。',
    publicExplanation: '伝えたかではなく、仕事として確認できる形になっているかを見る接点。',
    firstQuestion: '情報は、形式、タイミング、確認方法、責任分担まで設計されているか。',
    designMove: '手順書、見本、確認ループ、会議設計、緊急連絡、安全確認へ変換する。',
    riskIfFlattened: '説明した／聞いていない、能力不足、コミュニケーション問題として扱われる。',
    branchIds: ['QR-02', 'QR-06'],
    listeningThemeIds: ['SLS-01', 'SLS-04'],
    icon: Ear,
  },
  {
    id: 'WM-04',
    label: '開示境界',
    role: '病名を言うかどうかではなく、仕事に必要な条件を安全に共有する設計。',
    publicExplanation: '本人の尊厳と仕事手順の両方を守る情報共有の接点。',
    firstQuestion: '誰に、何を、どこまで、どの手順で共有し、何を共有しないか。',
    designMove: '共有範囲、共有先、記録、更新、相談経路、撤回可能性を設計する。',
    riskIfFlattened: '本人の告白責任、隠す／言うの二択、採用判断材料にされる。',
    branchIds: ['QR-06', 'QR-05'],
    listeningThemeIds: ['SLS-04'],
    icon: ShieldCheck,
  },
  {
    id: 'WM-05',
    label: '入口以前',
    role: '応募前の生活リズム、訓練、体力、説明準備、支援接続を見る。',
    publicExplanation: '就職の手前で参加条件を整える接点。',
    firstQuestion: '求人条件へ近づく前に、生活、健康、訓練、支援、説明の何が必要か。',
    designMove: '準備ステップ、試行機会、支援接続、生活保障、求人理解を並べる。',
    riskIfFlattened: '就職意欲、本人準備不足、支援対象外として切り分けられる。',
    branchIds: ['QR-05', 'QR-04'],
    listeningThemeIds: ['SLS-05'],
    icon: Route,
  },
  {
    id: 'WM-06',
    label: '支援と再翻訳',
    role: '支援の有無ではなく、条件を変化局面で再翻訳できているかを見る。',
    publicExplanation: '本人条件、求人条件、職場条件をつなぎ直す接点。',
    firstQuestion: '状況が変わったとき、誰が何を誰へ翻訳し直しているか。',
    designMove: '相談経路、支援者役割、職場側窓口、見直し会議、記録を設計する。',
    riskIfFlattened: '支援機関がある／ない、本人が相談した／しないだけで扱われる。',
    branchIds: ['QR-06', 'QR-01'],
    listeningThemeIds: ['SLS-01', 'SLS-04'],
    icon: Handshake,
  },
  {
    id: 'WM-07',
    label: '評価と参加の質',
    role: '働けていることを、役割、技能、処遇、キャリア、見直しへ接続する。',
    publicExplanation: '雇用や定着の先に、仕事の価値として認められるかを見る接点。',
    firstQuestion: '条件付き遂行は、役割、技能、評価、処遇、将来見通しへつながっているか。',
    designMove: '評価基準、役割設計、技能形成、キャリア、参加品質の見直しを作る。',
    riskIfFlattened: '雇用率、定着、出勤できているかだけで成功とされる。',
    branchIds: ['QR-07', 'QR-08'],
    listeningThemeIds: ['SLS-06'],
    icon: BadgeCheck,
  },
];

export const workDesignToolboxPlanes: WorkDesignToolboxPlane[] = [
  {
    id: 'TB-01',
    label: '健康時間と生活の自由度',
    purpose: '働く前提を、体調・時間・生活保障から整える。',
    items: [
      '負荷をならす',
      '治療と仕事時間を合わせる',
      '休む・戻る道筋を作る',
      '移動と休憩場所まで含める',
      '待てる余地をつくる',
      '評価・収入との衝突を見る',
      '変化を話し直せる',
    ],
    branchIds: ['QR-01', 'QR-04'],
    icon: CalendarClock,
  },
  {
    id: 'TB-02',
    label: '入口・翻訳・支援の力',
    purpose: '本人条件と求人・職場条件を、無理なく接続する。',
    items: [
      '求人と本人条件をすり合わせる',
      '見学・実習で仕事像を確かめる',
      '伝える範囲を目的で決める',
      '人・仕事・制度をつなぎ直す',
      '戻れる相談ルートを残す',
      '情報を分かる手順に変える',
      '見え方のズレを見つける',
    ],
    branchIds: ['QR-02', 'QR-05', 'QR-06'],
    icon: Workflow,
  },
  {
    id: 'TB-03',
    label: '職場・参加・価値',
    purpose: '働くことを、役割・評価・成長へつなげる。',
    items: [
      '作業・道具・座席を合わせる',
      '安全・顧客・人員余力を見込む',
      '情報アクセスを整える',
      '指示・切替・記憶負荷を整える',
      '成果の見方を合わせる',
      '学び・役割・キャリアにつなげる',
      '職場規模・地域資源に合わせる',
    ],
    branchIds: ['QR-03', 'QR-07', 'QR-08'],
    icon: BriefcaseBusiness,
  },
];

export const workDesignReturnPaths: WorkDesignReturnPath[] = [
  {
    id: 'RP-01',
    label: 'SNSから来た読者',
    fromSignal: '見方の転換に関心があるが、まだ全体像を持っていない。',
    nextAction: '仕事設計マップで7つの接点を眺め、近い問いを1つ選ぶ。',
    boundary: '個別相談や診断別配慮へ直接進めない。',
    branchIds: ['QR-01', 'QR-08'],
    icon: Megaphone,
  },
  {
    id: 'RP-02',
    label: '本人・家族・支援者',
    fromSignal: '困りごとの説明や相談準備をしたい。',
    nextAction: '自己評価・相談準備メモへ進み、文脈枝を選ぶ。',
    boundary: '医療・法律・雇用判断や個別支援の正誤判定にしない。',
    branchIds: ['QR-04', 'QR-05', 'QR-06'],
    icon: ClipboardList,
  },
  {
    id: 'RP-03',
    label: '企業・管理職・人事',
    fromSignal: '職場で何を変えればよいかを知りたい。',
    nextAction: '人工シナリオのWork-Design Studioへ接続し、仕事接触点を分解する。',
    boundary: '法的安全保証、合理的配慮妥当性判定、採用・配置助言にしない。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    icon: Building2,
  },
  {
    id: 'RP-04',
    label: '研究・政策・協力候補',
    fromSignal: '制度、研究、研修、共同実装との接続を見たい。',
    nextAction: 'Policy / Research Translation DeskやPartnership Pipelineへ進む。',
    boundary: '現行政策や統計の未検証断定、公的承認、成果保証にしない。',
    branchIds: ['QR-07', 'QR-08', 'QR-04'],
    icon: FileSearch,
  },
];

export const heronMigrationIntro = {
  eyebrow: 'Heron public content inventory',
  title: '公開中のHeron資産を、Falconへ直接混ぜずに棚卸しする',
  body: 'Heronの公開資産は、すでに社会との接点を持っている貴重な入口です。ただし、そのままFalconの専門知識ネットワークや次期NBLへ移すと、古い約束、診断名中心の見え方、未検証の統計・政策表現、個別助言への誤読が混ざる可能性があります。',
  operatingRule:
    '移行判断は、公開実績ではなく、Falconの仕事設計マップ、SCIMA/FCHMAの相互作用理解、境界表示、source/public review要否で行う。',
};

export const heronMigrationCandidates: HeronMigrationCandidate[] = [
  {
    id: 'HM-01',
    surface: 'Top / Current Public Home',
    routes: ['/'],
    currentRole: 'NBLの現在地、統計的インパクト、JAC・Knowledge・Aboutへの入口を示す。',
    heronValue: '社会に何をしている団体かを短時間で伝える力がある。',
    falconOpportunity: 'PE-01の仕事設計マップを第一接点にし、統計訴求から接点理解へ重心を移す。',
    migrationDecision: 'rewrite_for_falcon',
    targetSurface: 'PE-01 Public Work Design Map',
    workDesignRisk: '数値インパクトが先に立つと、Falconの発見単位が接点ではなく問題量に見える。',
    publicCopyRisk: '統計、JEED/NIVR表記、9,000件超などはsource/public reviewなしに強く出さない。',
    sourceReviewNeed: '統計・調査由来表現は出典、時点、NBL分析範囲を再確認。',
    nextAction: 'トップheroをPE-01 thesisへ置き換える内部案を作る。',
    branchIds: ['QR-01', 'QR-08'],
    agentIds: ['A1', 'A2', 'A3', 'A6', 'A12'],
    icon: Map,
  },
  {
    id: 'HM-02',
    surface: 'What We Do / Current Promise',
    routes: ['/what-we-do'],
    currentRole: 'NBLがいま案内できること、AIと人の役割、current promiseを示す。',
    heronValue: '公開約束の境界を持つ点はFalconと相性がよい。',
    falconOpportunity:
      'Falcon social interfaceの「何をする/しない」を、仕事設計・共同レビュー・政策翻訳へ整理し直す。',
    migrationDecision: 'reuse_as_context',
    targetSurface: 'PE-01 / PE-03 / PE-06',
    workDesignRisk:
      'current promiseの説明が、事業メニュー中心になり専門知識ネットワークの入口が薄くなる。',
    publicCopyRisk: '「AIが進める」表現が、人間判断代替や専門判断自動化に見える可能性。',
    sourceReviewNeed: 'source claimよりもpublic promise boundary reviewが中心。',
    nextAction: 'What We DoをFalcon版の約束範囲・共同設計・相談外境界へ再編する。',
    branchIds: ['QR-06', 'QR-08'],
    agentIds: ['A3', 'A6', 'A11'],
    icon: ShieldCheck,
  },
  {
    id: 'HM-03',
    surface: 'Resources Hub',
    routes: ['/resources', '/videos', '/resources/songs'],
    currentRole: '公開コレクション、動画、キャンペーンソングを束ねる入口。',
    heronValue: '社会に届く素材群をすでに持っている。',
    falconOpportunity:
      '3x7道具箱、仕事設計マップ、SNS listening seriesへ戻る知識資源棚に再編できる。',
    migrationDecision: 'rewrite_for_falcon',
    targetSurface: 'PE-01 / PE-02 / PE-03',
    workDesignRisk: '素材一覧になると、Falconの相互作用構造が見えず啓発・広報に寄る。',
    publicCopyRisk: 'キャンペーン素材が助言、根拠、公式見解のように読まれる可能性。',
    sourceReviewNeed: '各resourceのpublic-use boundary、著作権、source/current claimを別管理。',
    nextAction: 'Resourcesを「読む順番」ではなく「どの接点の理解を助けるか」で再分類する。',
    branchIds: ['QR-02', 'QR-05', 'QR-08'],
    agentIds: ['A2', 'A3', 'A6', 'A12'],
    icon: FileSearch,
  },
  {
    id: 'HM-04',
    surface: 'Guide / 27 Frames',
    routes: ['/guide', '/guide/[frame-id]', '/jac/guide'],
    currentRole: '仕事設計ガイド、27フレーム、典型的な見方を提供する。',
    heronValue: '人間が理解しやすいパターン化資産として価値がある。',
    falconOpportunity:
      '27フレームを上流真理ではなく、Falcon coreから降りる説明・教育用projectionとして位置付ける。',
    migrationDecision: 'reuse_as_context',
    targetSurface: 'PE-01 / Work Design Primer',
    workDesignRisk: '27フレームがFalcon coreそのものに見え、SCIMA/FCHMAの多層性が潰れる。',
    publicCopyRisk: 'フレームがチェックリストや診断のように使われる可能性。',
    sourceReviewNeed: 'L3 principal patternsとの接続と、旧Heronフレームの改名・統合レビュー。',
    nextAction: '27フレームを3x7道具箱と7接点に再接続するcrosswalkを作る。',
    branchIds: ['QR-03', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A3', 'A6'],
    icon: ClipboardList,
  },
  {
    id: 'HM-05',
    surface: 'JAC / はたらく相談室',
    routes: ['/jac', '/jac/next', '/jac/intro', '/jac/frames'],
    currentRole: '相談内容をICF的に整理する現行プロダクト入口。',
    heronValue: 'Falconのcase-centered loopに近い実装経験を持つ。',
    falconOpportunity:
      '次期NBLでは相談受付より前に、仕事設計マップと相談準備へ戻す位置付けにする。',
    migrationDecision: 'keep_heron_stable',
    targetSurface: 'Case consultation support / PE-01 return path',
    workDesignRisk: 'Falconが助言チャットや自動見立て機能として理解される。',
    publicCopyRisk: '「見立て」「一手」が個別支援妥当性判断に見える可能性。',
    sourceReviewNeed: 'runtime/retrieval/prompt/schemaは別ゲート。ここでは公開導線の位置付けのみ。',
    nextAction: 'JACはHeron安定面として維持し、Falcon移行は相談前の構造化導線だけを検討する。',
    branchIds: ['QR-01', 'QR-06', 'QR-08'],
    agentIds: ['A1', 'A4', 'A6', 'A8'],
    icon: Bot,
  },
  {
    id: 'HM-06',
    surface: 'Organizations / Enterprise',
    routes: [
      '/organizations',
      '/organizations/design',
      '/organizations/diagnosis',
      '/for-enterprise',
    ],
    currentRole: '企業、組織、支援機関向けに職場・組織設計を説明する。',
    heronValue: 'PE-04の企業・支援者向け実験面に直結する。',
    falconOpportunity:
      '仕事接触点、評価、支援再翻訳を人工シナリオで試すWork-Design Studioへ発展できる。',
    migrationDecision: 'rewrite_for_falcon',
    targetSurface: 'PE-04 Employer / Practitioner Work-Design Studio',
    workDesignRisk: '組織診断が、支援者や組織の良し悪し判定として読まれる。',
    publicCopyRisk: '合理的配慮・法務安全・組織診断の最終判断に見える可能性。',
    sourceReviewNeed: '診断軸やQ14データ参照は出典・範囲・非判定境界を再確認。',
    nextAction: '企業向けページをPE-04人工シナリオに寄せ、判定ではなく接点分解にする。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    agentIds: ['A1', 'A3', 'A6', 'A9'],
    icon: Building2,
  },
  {
    id: 'HM-07',
    surface: 'Rare Disease Linkage Project',
    routes: [
      '/projects/rare-disease-linkage',
      '/projects/rare-disease-linkage/resources',
      '/projects/rare-disease-linkage/workshop',
      '/projects/rare-disease-linkage/hospital',
      '/projects/rare-disease-linkage/partner',
    ],
    currentRole: '難病地域連携を、情報付き橋渡し・共同設計・資料公開として進める。',
    heronValue: '社会実装、共同レビュー、本人説明負担の軽減というFalconらしい実践面を持つ。',
    falconOpportunity:
      'PE-03/PE-05/PE-06の核になる。共同設計カードと政策・研究接続の入口にできる。',
    migrationDecision: 'keep_heron_stable',
    targetSurface: 'PE-03 / PE-05 / PE-06',
    workDesignRisk: '難病支援だけの個別プロジェクトに見え、仕事設計の普遍的地図と接続しにくい。',
    publicCopyRisk: '医療・制度・地域連携の実施責任や成果保証に見える可能性。',
    sourceReviewNeed: '公式制度・地域資源・医療連携に触れる場合はlive verificationが必要。',
    nextAction: 'Heron公開は維持し、Falcon側では共同設計カードとpolicy translationへ接続する。',
    branchIds: ['QR-01', 'QR-04', 'QR-06'],
    agentIds: ['A1', 'A6', 'A7', 'A8', 'A10', 'A11'],
    icon: Handshake,
  },
  {
    id: 'HM-08',
    surface: 'Employment Mobility / Reform',
    routes: ['/nbl-employment-reform', '/projects/employment-mobility'],
    currentRole: '障害者就労支援を箱から移動可能性へ、という政策・思想の旗艦面。',
    heronValue: 'Falconの日本改善課題と社会提言に近い。',
    falconOpportunity: 'Stage 3 Japan improvement agendaからPE-05の政策・研究翻訳へ接続できる。',
    migrationDecision: 'hold_for_review',
    targetSurface: 'PE-05 Policy / Research Translation Desk',
    workDesignRisk: '政策提言がFalcon coreの確定知識や公式評価のように見える。',
    publicCopyRisk: '現行制度、政策、統計、審議会、法制度の現在情報を未検証で断定するリスク。',
    sourceReviewNeed: '公的資料のlive verificationと、提言のpublic reviewが必須。',
    nextAction: '政策系は先にsource lensとcurrent-source確認パケットを作る。',
    branchIds: ['QR-04', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A2', 'A6', 'A10'],
    icon: FileSearch,
  },
  {
    id: 'HM-09',
    surface: 'Disability Work Design Series',
    routes: ['/resources/disability-work-design'],
    currentRole: '障害別に仕事設計の見取り図を示す。',
    heronValue: '読者にとって入口は分かりやすい。',
    falconOpportunity: '条件窓としての障害分類を使い、共通構造と特殊構造を分ける教育面にできる。',
    migrationDecision: 'hold_for_review',
    targetSurface: 'PE-01 / 3x7 toolbox / condition-window explainer',
    workDesignRisk: '障害名から配慮や困難性を引くlookupに戻る危険が高い。',
    publicCopyRisk: '障害別説明がステレオタイプ、過剰一般化、配慮リスト化に読まれる。',
    sourceReviewNeed: '各分類の根拠、反対構造、条件窓表現のレビューが必要。',
    nextAction: 'Falconの条件窓ルールで再編集し、障害別ページはすぐ移行しない。',
    branchIds: ['QR-03', 'QR-08'],
    agentIds: ['A1', 'A2', 'A6', 'A12'],
    icon: Network,
  },
  {
    id: 'HM-10',
    surface: 'Invisible Disability / Work Support Transformation',
    routes: ['/resources/invisible-disability', '/resources/work-support-transformation'],
    currentRole: '見えない障害、慢性疾患、支援変革テーマをシリーズとして説明する。',
    heronValue: '理解促進と仕事設計の橋になりやすい。',
    falconOpportunity: '健康時間、開示境界、支援再翻訳の接点説明へ再接続できる。',
    migrationDecision: 'rewrite_for_falcon',
    targetSurface: 'PE-01 / PE-02 / Work Design Primer',
    workDesignRisk: '体験理解に寄りすぎると、仕事設計や制度接続が薄くなる。',
    publicCopyRisk: '見えない障害を一枚岩にする、感動・悲劇訴求へ寄るリスク。',
    sourceReviewNeed: '体験・漫画・図解素材はpublic-copy/risk reviewと引用・著作権確認。',
    nextAction: '健康時間・開示境界・再翻訳へ再分類し、SNS連載の戻り先にする。',
    branchIds: ['QR-01', 'QR-04', 'QR-06'],
    agentIds: ['A1', 'A3', 'A6', 'A12'],
    icon: Ear,
  },
  {
    id: 'HM-11',
    surface: 'Songs / Campaign Assets',
    routes: [
      '/resources/songs',
      '/resources/songs/[slug]',
      '/resources/songs/campaigns/[campaign]',
    ],
    currentRole: '合理的配慮、インクルーシブ雇用、障害理解を感情的に届ける。',
    heronValue: 'SNSや関心喚起の入口として強い。',
    falconOpportunity: 'PE-02のawareness layerとして使えるが、Falcon core知識とは分ける。',
    migrationDecision: 'keep_heron_stable',
    targetSurface: 'PE-02 / Campaign companion notes',
    workDesignRisk: '感情的メッセージが仕事設計の精密さを置き換える。',
    publicCopyRisk: '歌詞・音源・著作権、合理的配慮の法的解釈、個別助言化。',
    sourceReviewNeed:
      'campaign-content-boundary、著作権・ライセンス、companion note reviewが必要。',
    nextAction: 'Falconへはcampaign signalとしてのみ接続し、知識ネットワークへ昇格しない。',
    branchIds: ['QR-02', 'QR-06', 'QR-08'],
    agentIds: ['A6', 'A12'],
    icon: Megaphone,
  },
  {
    id: 'HM-12',
    surface: 'About / Operating Model / Contact',
    routes: ['/about', '/about/knowledge-base', '/operating-model', '/contact'],
    currentRole: 'NBLの立ち位置、運営モデル、問い合わせ入口を示す。',
    heronValue: '信頼と境界の説明に使える。',
    falconOpportunity:
      'Falconの監査可能性、AIと人間の役割、public/review/runtime境界を分かりやすく説明できる。',
    migrationDecision: 'reuse_as_context',
    targetSurface: 'Trust path / PE-03 review explanation',
    workDesignRisk: '内部手続きが表に出すぎると、読者が何を得られるか分からなくなる。',
    publicCopyRisk: 'AI governance説明がサービス責任や承認済み品質保証に読まれる。',
    sourceReviewNeed: 'public promise reviewと問い合わせ導線の個人情報境界確認。',
    nextAction: 'AboutはFalconの信頼入口として再編集し、手続き語を読者語に変える。',
    branchIds: ['QR-06', 'QR-08'],
    agentIds: ['A3', 'A6', 'A11'],
    icon: ShieldCheck,
  },
];

export const heronMigrationGates: HeronMigrationGate[] = [
  {
    id: 'HG-01',
    label: '病名lookupへ戻っていないか',
    question: '病名・障害名が、条件窓ではなく配慮や困難性の決定表になっていないか。',
    stopIf: '障害別ページ、合理的配慮ページ、JAC導線が診断名から支援を引く形に見える。',
    branchIds: ['QR-08'],
    icon: Network,
  },
  {
    id: 'HG-02',
    label: '公式・統計・政策claimを断定していないか',
    question: '制度、統計、審議会、政策評価、法的義務の表現がlive verificationなしに出ていないか。',
    stopIf: '現在情報や法的解釈の断定がある。',
    branchIds: ['QR-04', 'QR-07'],
    icon: FileSearch,
  },
  {
    id: 'HG-03',
    label: '個別判断へ滑っていないか',
    question: '相談、組織診断、配慮説明が、就労可否・合理的配慮妥当性・支援正誤に見えないか。',
    stopIf: 'AIまたはNBLが判断するように読める。',
    branchIds: ['QR-01', 'QR-06'],
    icon: ShieldCheck,
  },
  {
    id: 'HG-04',
    label: '素材が知識に昇格していないか',
    question: '歌、漫画、SNS反応、体験共有が、根拠や代表事例として扱われていないか。',
    stopIf: 'campaign assetや反応をFalcon core evidenceのように扱っている。',
    branchIds: ['QR-02', 'QR-08'],
    icon: Megaphone,
  },
  {
    id: 'HG-05',
    label: '読者の次の動きが安全か',
    question: '読者が、理解、相談準備、共同レビュー、公式確認へ進む導線になっているか。',
    stopIf: '個人情報入力、個別相談、外部連携、販売、法務・医療判断へ直行する。',
    branchIds: ['QR-05', 'QR-06'],
    icon: Route,
  },
];

export const stakeholderCoDesignIntro = {
  eyebrow: 'PE-03 Stakeholder Co-Design Room',
  title: 'レビューを承認作業ではなく、設計学習に変える',
  body: 'Falconの仕事設計マップ、SNS連載、Heron移行候補を、当事者・家族、支援者、企業、政策/研究側がそれぞれの現実から点検する内部面です。目的は「よい/悪い」を決めることではなく、どの説明が届き、どこで誤解され、何を設計に戻すべきかを見つけることです。',
  operatingRule:
    '外部レビューは公開承認ではない。レビュー反応は知識証明ではなく、次の問い、欠落文脈、表現修正、実装課題として記録する。',
};

export const stakeholderReviewLenses: StakeholderReviewLens[] = [
  {
    id: 'SL-01',
    label: '本人・家族の生活現実',
    reviewerSeat: 'Lived Experience Co-Design Council',
    primaryQuestion:
      'この説明は、自分の体調、生活、仕事、開示、支援の現実を一枚の問題に潰していないか。',
    canJudge: '分かりやすさ、尊厳、説明負担、本人の選択肢が増えるか。',
    cannotJudge: '医療判断、制度対象判断、就労可否、他者への一般化。',
    recordAs: '分からなかった語、救われた視点、傷つく表現、追加してほしい生活文脈。',
    branchIds: ['QR-01', 'QR-04', 'QR-06', 'QR-08'],
    agentIds: ['A7', 'A12'],
    heronCandidateIds: ['HM-07', 'HM-09', 'HM-10', 'HM-11'],
    icon: UsersRound,
  },
  {
    id: 'SL-02',
    label: '支援者・相談現場の使いやすさ',
    reviewerSeat: 'Employment Support Practitioner Council',
    primaryQuestion:
      '相談やケース会議で、本人条件、仕事条件、支援条件を分けて確認する助けになるか。',
    canJudge: '相談準備、確認質問、支援機関連携、記録しやすさ。',
    cannotJudge: '個別ケースの正解、支援妥当性、機関連携の責任分担確定。',
    recordAs: '現場で使える問い、足りない情報、誤用しやすい導線、支援者負荷。',
    branchIds: ['QR-02', 'QR-05', 'QR-06'],
    agentIds: ['A8', 'A6'],
    heronCandidateIds: ['HM-04', 'HM-05', 'HM-07'],
    icon: Handshake,
  },
  {
    id: 'SL-03',
    label: '企業・上司・人事の実装現実',
    reviewerSeat: 'Employer / HR / Manager Partner Council',
    primaryQuestion:
      '管理職や人事が、配慮判断を背負い込むのでなく、仕事接触点と調整手順を見られるか。',
    canJudge: '職務、時間、評価、情報共有、合意形成の現実感。',
    cannotJudge: '法的安全、合理的配慮の最終判断、採用・配置・処遇判断。',
    recordAs: '管理職が迷う点、運用できる単位、過剰負荷、職場で説明しにくい語。',
    branchIds: ['QR-03', 'QR-06', 'QR-07'],
    agentIds: ['A9', 'A11'],
    heronCandidateIds: ['HM-06', 'HM-10', 'HM-12'],
    icon: Building2,
  },
  {
    id: 'SL-04',
    label: '政策・研究・制度接続',
    reviewerSeat: 'Policy / Research / Institution Relations',
    primaryQuestion:
      '社会課題や制度課題を、現在情報の断定ではなく、検証可能な仕事設計の問いへ戻せているか。',
    canJudge: '問いの立て方、source lens、研究・行政・研修へ戻す道筋。',
    cannotJudge: '現行制度の断定、政策評価、公式見解、統計のpublic-use確定。',
    recordAs: '確認すべき公式資料、時点依存claim、政策対話の相手、保留すべき表現。',
    branchIds: ['QR-04', 'QR-07', 'QR-08'],
    agentIds: ['A10', 'A2', 'A6'],
    heronCandidateIds: ['HM-01', 'HM-08', 'HM-12'],
    icon: FileSearch,
  },
];

export const stakeholderReviewCards: StakeholderReviewCard[] = [
  {
    id: 'RC-01',
    title: '見方の転換カード',
    artifactToRead: 'PE-01 Public Work Design Map / 仕事設計マップ',
    whyThisMatters:
      '次期NBLの最初の一歩が、病名別配慮表ではなく、仕事と社会を人間の多様性に合わせて設計する地図として伝わるかを見る。',
    reviewPrompt:
      '「困りごとは人の中だけで起きていない」という転換が、読者の現実に照らして自然に理解できるか。',
    goodSignal: '本人・支援者・企業が、次に確認すべき接点を言葉にできる。',
    stopSignal: '病名、障害名、配慮リスト、組織診断、AI助言へ短絡して読まれる。',
    output: '分かりにくい語、転換が伝わった箇所、誤読された箇所、追加すべき接点。',
    branchIds: ['QR-01', 'QR-03', 'QR-08'],
    lensIds: ['SL-01', 'SL-02', 'SL-03'],
    heronCandidateIds: ['HM-01', 'HM-09', 'HM-10'],
    icon: Map,
  },
  {
    id: 'RC-02',
    title: 'Heron移行カード',
    artifactToRead: 'Heron Migration Inventory / 12 surface families',
    whyThisMatters:
      '公開中Heronの価値を壊さず、古い表現や未検証claimをFalcon coreや次期NBLへ混ぜないために見る。',
    reviewPrompt:
      'どのHeron資産は維持し、どれは書き換え、どれはレビューまで保留すべきか。理由は読者視点で説明できるか。',
    goodSignal: 'Heronの社会接点価値とFalconへの混入リスクを同時に言える。',
    stopSignal: '公開実績があるからそのまま移す、または古いから全部捨てる、という二択になる。',
    output: '移行判断への異議、追加ゲート、保留理由、最初に書き換えるべき面。',
    branchIds: ['QR-06', 'QR-08'],
    lensIds: ['SL-01', 'SL-02', 'SL-03', 'SL-04'],
    heronCandidateIds: ['HM-01', 'HM-03', 'HM-04', 'HM-07', 'HM-08', 'HM-12'],
    icon: ClipboardCheck,
  },
  {
    id: 'RC-03',
    title: '相談前の構造化カード',
    artifactToRead: 'JAC / Rare Disease Linkage / 相談前の戻り先設計',
    whyThisMatters:
      'Falconを助言チャットではなく、相談前に文脈を整理し、本人・支援者・関係機関の確認負荷を下げる道具として置く。',
    reviewPrompt:
      'この導線は、個別判断をAIに任せず、本人の説明可能性と支援者の確認可能性を増やしているか。',
    goodSignal: '相談に持っていく問い、共有しない情報、次に確認する相手が明確になる。',
    stopSignal: 'AIが支援案、配慮可否、就労可否、医療・制度判断を出すように見える。',
    output: '相談準備に必要な項目、共有境界、支援者が見たい構造、危険な入力誘導。',
    branchIds: ['QR-01', 'QR-05', 'QR-06'],
    lensIds: ['SL-01', 'SL-02'],
    heronCandidateIds: ['HM-05', 'HM-07'],
    icon: UserRoundCheck,
  },
  {
    id: 'RC-04',
    title: '企業・支援者実験カード',
    artifactToRead: 'PE-04 Work-Design Studio preview / Organizations migration candidate',
    whyThisMatters:
      '企業や支援者に、診断名や制度リスクでなく、仕事接触点、時間、評価、情報共有の分解として試してもらう。',
    reviewPrompt: '人工シナリオなら、管理職・人事・支援者が安全に仕事設計の考え方を試せるか。',
    goodSignal: '誰が、どの接点を、どの順番で確認するかを話し合える。',
    stopSignal: '組織診断、法的安全判定、配慮判定、社員評価のように使われる。',
    output: '人工シナリオで必要な制約、職場側の迷い、支援者の問い、禁止すべき表示。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    lensIds: ['SL-02', 'SL-03'],
    heronCandidateIds: ['HM-06'],
    icon: BriefcaseBusiness,
  },
  {
    id: 'RC-05',
    title: '政策・研究翻訳カード',
    artifactToRead: 'Employment Mobility / Reform / Policy Translation Desk',
    whyThisMatters:
      '制度や研究を、公式見解の断定ではなく、現場・政策・研究が一緒に検証できる仕事設計の問いに変える。',
    reviewPrompt:
      '時点依存の政策claim、統計、審議会情報を保留しつつ、社会課題の焦点は失っていないか。',
    goodSignal: '公式資料で確認すべき点、現場で検証すべき点、社会に問うべき点を分けられる。',
    stopSignal: '最新制度の断定、政策批判の断定、公式承認済み提言のように読まれる。',
    output: 'live verificationが必要なclaim、保留語、政策対話の相手、研究接続テーマ。',
    branchIds: ['QR-04', 'QR-07', 'QR-08'],
    lensIds: ['SL-04'],
    heronCandidateIds: ['HM-08', 'HM-12'],
    icon: Scale,
  },
  {
    id: 'RC-06',
    title: 'SNS反応学習カード',
    artifactToRead: 'PE-02 SNS Listening Series / response taxonomy',
    whyThisMatters:
      'SNSを宣伝や反応集めにせず、社会側の誤解、問い、協力候補、説明需要を設計に戻す。',
    reviewPrompt:
      'この連載は、炎上・個別相談・証拠扱いを避けながら、見方の転換を小さく届けられるか。',
    goodSignal: '反応を、追加説明需要、誤解、実装課題、協力候補、赤旗に分けられる。',
    stopSignal: '個別助言、炎上応答、体験談の証拠化、キャンペーン素材の知識昇格が起きる。',
    output: '返信しない条件、説明し直す語、次の投稿テーマ、共同レビュー候補。',
    branchIds: ['QR-01', 'QR-02', 'QR-06', 'QR-08'],
    lensIds: ['SL-01', 'SL-02', 'SL-04'],
    heronCandidateIds: ['HM-03', 'HM-10', 'HM-11'],
    icon: Megaphone,
  },
];

export const stakeholderReviewSteps: StakeholderReviewStep[] = [
  {
    id: 'RS-01',
    label: '読む対象を限定する',
    job: '仕事設計マップ、Heron移行候補、SNS連載、相談前導線のどれを見てもらうかを先に決める。',
    doNotDo: '全部読ませない。長い背景説明でレビューの目的をぼかさない。',
    output: '今回見るartifact、読者席、見てほしい問い。',
    icon: ClipboardList,
  },
  {
    id: 'RS-02',
    label: '判断できることを分ける',
    job: '分かりやすさ、現実感、尊厳、実装負荷、source確認需要を分けて聞く。',
    doNotDo: 'レビュー者に専門妥当性、法的判断、支援正誤、公開承認を背負わせない。',
    output: 'can judge / cannot judge の明示。',
    icon: ShieldCheck,
  },
  {
    id: 'RS-03',
    label: '赤旗を先に止める',
    job: '病名lookup、個別判断、政策断定、素材の知識昇格、個人情報入力誘導を検出する。',
    doNotDo: 'よい反応を根拠化したり、強い共感をそのままpublic copyへ移さない。',
    output: 'stop signal と保留理由。',
    icon: SearchCheck,
  },
  {
    id: 'RS-04',
    label: '設計変更へ戻す',
    job: 'レビュー結果を、表現修正、追加説明、戻り先設計、source確認、保留に分ける。',
    doNotDo: 'レビュー済み、承認済み、public-safe、runtime-readyへ動かさない。',
    output: '次のUI/コピー/資料/検証タスク。',
    icon: Workflow,
  },
];

export const workDesignStudioIntro = {
  eyebrow: 'PE-04 Employer / Practitioner Work-Design Studio',
  title: '正解配慮を探す前に、仕事の条件を分解する',
  body: 'PE-04は、企業・管理職・人事・支援者が、実在ケースや個人情報を使わずにFalconの仕事設計の読み方を試す内部スタジオです。PE-01の仕事接点を人工シナリオへ通し、PE-03のレビュー席で誤読や実装負荷を確認します。',
  operatingRule:
    'ここで扱うのは人工シナリオだけ。出力は、確認すべき仕事条件、支援者の質問、職場側の制約、赤旗であり、合理的配慮の妥当性判断、法的安全保証、採用・配置・評価判断ではない。',
};

export const workDesignStudioSteps: WorkDesignStudioStep[] = [
  {
    id: 'WS-01',
    label: '場面を読む',
    job: '本人属性や診断名でなく、どの仕事場面で自由度が閉じているかを読む。',
    pe01Input: '健康時間、仕事接触点、情報と手順、開示境界、評価と参加の質。',
    pe03Input: '企業・上司・人事の実装現実、支援者・相談現場の使いやすさ。',
    output: '最初に確認する仕事場面と、まだ分からない文脈。',
    doNotDo: '職場や本人の良し悪し、配慮の正解、法的安全を判定しない。',
    icon: SearchCheck,
  },
  {
    id: 'WS-02',
    label: '接点へ分解する',
    job: '困りごとを、作業、時間、情報、動線、道具、相談経路、評価条件へ分ける。',
    pe01Input: '7つの仕事設計マップ接点。',
    pe03Input: 'レビューカード RC-04 と RC-03。',
    output: '変えられる接点、変えにくい接点、確認が必要な接点。',
    doNotDo: '「特別扱いする/しない」「本人が頑張る/頑張らない」の二択にしない。',
    icon: Map,
  },
  {
    id: 'WS-03',
    label: '二者の読みを並べる',
    job: '企業側の制約と支援者側の問いを、対立ではなく同じ設計表に並べる。',
    pe01Input: '支援と再翻訳、開示境界、評価と参加の質。',
    pe03Input: 'SL-02 支援者、SL-03 企業。',
    output: '企業が管理できる条件、支援者が確認すべき条件、本人に背負わせない翻訳。',
    doNotDo: '企業責任だけ、支援者責任だけ、本人説明責任だけに寄せない。',
    icon: Handshake,
  },
  {
    id: 'WS-04',
    label: '試す設計を作る',
    job: '最終対応ではなく、一定期間試せる仕事条件の変更案へ落とす。',
    pe01Input: 'デザインムーブと戻り先設計。',
    pe03Input: 'good signal / stop signal。',
    output: '試行条件、見直し時点、記録する変化、止める条件。',
    doNotDo: '個別支援計画、労務判断、採用・配置判断として出さない。',
    icon: Workflow,
  },
  {
    id: 'WS-05',
    label: 'レビューに戻す',
    job: 'シナリオで見えた誤読、実装負荷、足りない説明をPE-03へ戻す。',
    pe01Input: 'どの接点説明が分かりにくかったか。',
    pe03Input: 'can judge / cannot judge とレビュー記録。',
    output: 'UI修正、用語修正、追加シナリオ、保留理由。',
    doNotDo: 'よい反応をpublic-safeやruntime-readyの根拠にしない。',
    icon: ClipboardCheck,
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
    practitionerRead: '本人の説明を、勤務時間、作業量、回復余白、評価条件、相談経路へ翻訳する。',
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
    reviewCardIds: ['RC-03', 'RC-04'],
    heronCandidateIds: ['HM-06', 'HM-10'],
    branchIds: ['QR-01', 'QR-02', 'QR-06', 'QR-07'],
    agentIds: ['A1', 'A6', 'A8', 'A9'],
    icon: TimerReset,
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
    reviewCardIds: ['RC-03', 'RC-04'],
    heronCandidateIds: ['HM-04', 'HM-06'],
    branchIds: ['QR-02', 'QR-03', 'QR-06'],
    agentIds: ['A1', 'A6', 'A8', 'A9'],
    icon: Ear,
  },
  {
    id: 'WDS-03',
    title: '動線と道具で担当範囲が狭くなる',
    workplace: '軽作業・受付・庶務が混ざる職場。移動、姿勢、端末、保管場所が分散している。',
    artificialCase:
      'ある人は、仕事の一部は安定してできるが、物の置き場所、移動回数、姿勢、端末位置が重なる場面で疲労や遅れが出る。職場は「できる仕事だけ担当」で済ませようとしている。',
    startingQuestion:
      'この場面を「できる/できない」ではなく、仕事接触点が役割と参加範囲を狭めていないかとして読めるか。',
    employerRead: '担当範囲を削る前に、動線、道具配置、姿勢、確認方法、エラー許容度を点検する。',
    practitionerRead: '本人の強みが活きる作業と、接触点で閉じている作業を分けて職場に説明する。',
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
      'できる仕事だけに固定してキャリアを閉じる。',
      '設備の有無だけで十分とする。',
      '本人の体力不足としてだけ扱う。',
    ],
    output: '動線・道具・姿勢の点検表、役割維持案、参加品質の見直しメモ。',
    contactPointIds: ['WM-02', 'WM-05', 'WM-07'],
    reviewCardIds: ['RC-01', 'RC-04'],
    heronCandidateIds: ['HM-04', 'HM-06'],
    branchIds: ['QR-03', 'QR-05', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A6', 'A8', 'A9'],
    icon: Map,
  },
  {
    id: 'WDS-04',
    title: '開示範囲と評価面談が混ざる',
    workplace: '配属後のチーム。上司、人事、支援者がそれぞれ情報を持っている。',
    artificialCase:
      'ある社員について、上司は仕事上の調整に必要な情報を知りたい。本人は詳細な病状や生活情報まで広がることを不安に感じている。評価面談と配慮相談が同じ場で混ざり始めている。',
    startingQuestion:
      'この場面を「開示するかしないか」ではなく、仕事に必要な情報の境界と評価の分離として読めるか。',
    employerRead:
      '上司が必要とするのは病状詳細ではなく、仕事手順、時間、連絡、見直しの条件であることを明確にする。',
    practitionerRead:
      '本人の不安を、共有範囲、共有先、記録、撤回可能性、評価との切り分けへ翻訳する。',
    designMoves: [
      '配慮相談と評価面談を分ける。',
      '共有する情報を仕事条件に限定する。',
      '誰が何を記録し、いつ見直すかを決める。',
      '本人が共有を修正できる窓を置く。',
    ],
    supportQuestions: [
      '職場が本当に必要としている情報は何か。',
      '共有しない情報を明示できているか。',
      '評価者と相談相手を分けられるか。',
    ],
    redFlags: [
      '診断名や病状詳細を上司に求める。',
      '評価と配慮相談を同じ判断材料にする。',
      '本人の同意や撤回可能性を曖昧にする。',
    ],
    output: '共有境界、面談分離、記録範囲、見直し条件のメモ。',
    contactPointIds: ['WM-04', 'WM-06', 'WM-07'],
    reviewCardIds: ['RC-03', 'RC-04'],
    heronCandidateIds: ['HM-05', 'HM-06', 'HM-12'],
    branchIds: ['QR-06', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A6', 'A8', 'A9'],
    icon: ShieldCheck,
  },
];

export const workDesignStudioSignals: WorkDesignStudioSignal[] = [
  {
    id: 'GREEN',
    label: '緑: 設計として読めている',
    readAs: '企業・支援者が、本人属性ではなく仕事条件、確認順、見直し窓を話している。',
    recordAs: '使える問い、実装できそうな接点、PE-01で伝わった説明。',
    nextMove: '同じ型で別シナリオを増やし、PE-03レビューカードへ渡す。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    icon: BadgeCheck,
  },
  {
    id: 'YELLOW',
    label: '黄: 誤読リスクがある',
    readAs: '配慮リスト、組織診断、支援者負荷、本人説明責任へ寄りかけている。',
    recordAs: '分かりにくい語、足りない前提、企業・支援者が迷った箇所。',
    nextMove: '用語、図解、シナリオ制約、赤旗表示を修正する。',
    branchIds: ['QR-06', 'QR-08'],
    icon: FileSearch,
  },
  {
    id: 'RED',
    label: '赤: 使い方を止める',
    readAs: '法的安全、合理的配慮妥当性、採用配置、就労可否、実在ケース判断に読まれている。',
    recordAs: '止める理由、消す表示、別導線が必要な相談領域。',
    nextMove: '公開・レビュー・runtime接続へ進めず、境界と文言を作り直す。',
    branchIds: ['QR-04', 'QR-06', 'QR-08'],
    icon: Stethoscope,
  },
];

export const partnershipPipelineIntro = {
  eyebrow: 'PE-06 Partnership / Business Experiment Pipeline',
  title: 'Falconの専門性を、販売ではなく共同実装の入口へ変換する',
  body: 'PE-06は、次期NBLサイト・SNS・人工シナリオ・政策翻訳から生まれる関心を、相談受付や営業トークへ直行させず、共同研究、研修、実証、委託、助成、編集協力、技術検証へ分ける内部面です。',
  operatingRule:
    'ここで作るのは連携テーマであり、公開オファー、価格表、契約条件、成果保証、助言サービス、実在ケース受付ではない。各テーマは、NBLが提供するもの、相手に依存するもの、提供しないものを先に分ける。',
};

export const partnershipSteps: PartnershipStep[] = [
  {
    id: 'PS-01',
    label: '関心を連携テーマへ翻訳する',
    job: 'SNS、仕事マップ、人工シナリオ、Heron棚卸しから来た関心を、販売導線ではなく共同で検証する問いへ変える。',
    output: '誰と、何を、どの範囲で一緒に検証するか。',
    doNotDo: '問い合わせを個別相談、受注、顧客化、助言サービスへ短絡しない。',
    icon: Route,
  },
  {
    id: 'PS-02',
    label: '最小成果物を決める',
    job: '実在ケースや個人情報を使わずに始められる、短いノート、研修案、人工シナリオ、図解、検証質問を選ぶ。',
    output: '最初の共同成果物と、公開しない範囲。',
    doNotDo: '最初から本格導入、実在職場診断、個別事例収集、公式見解化にしない。',
    icon: ClipboardList,
  },
  {
    id: 'PS-03',
    label: '相互の提供物を分ける',
    job: 'NBLが出す専門知識・構造化・試作と、相手が出す現場文脈・研修場・研究設計・資金を分ける。',
    output: 'NBL provides / partner provides / not provided.',
    doNotDo: 'NBLだけが価値を提供する営業資料にしない。相手に専門判断や承認を背負わせない。',
    icon: Handshake,
  },
  {
    id: 'PS-04',
    label: '境界を先に書く',
    job: '法務、医療、雇用、合理的配慮、政策、公開承認、runtime、個別判断の境界をテーマごとに置く。',
    output: 'stop condition と human gate.',
    doNotDo: '連携先の名前や信頼で、未承認知識・未検証claimを強く見せない。',
    icon: ShieldCheck,
  },
  {
    id: 'PS-05',
    label: '次の面へ戻す',
    job: '共同研究はPE-05、研修・企業実験はPE-04、SNS/編集はPE-02、初見説明はPE-01へ戻す。',
    output: '戻り先、保留理由、次に作るartifact.',
    doNotDo: 'Pipeline内に全部抱え込まない。公開・契約・runtimeへ直接進めない。',
    icon: Workflow,
  },
];

export const partnershipThemes: PartnershipTheme[] = [
  {
    id: 'PT-01',
    label: '仕事設計ミニ研修の共同試作',
    partnerType: '支援機関、企業研修担当、職能団体',
    startingSurface: 'PE-01 work-design map / PE-04 artificial scenarios',
    jointQuestion:
      '病名別配慮表ではなく、仕事接点を分解して考える研修は、支援者と企業の共通語になりうるか。',
    firstArtifact: '45分の研修骨子、人工シナリオ1件、受講後の理解チェック。',
    nblProvides: [
      '7つの仕事接点の説明',
      '人工シナリオと赤黄緑レビュー',
      '診断名lookupを避ける境界メモ',
    ],
    partnerProvides: ['研修参加者の想定', '現場で使いにくい語の指摘', '研修後に見たい理解変化'],
    notProvided: ['個別社員の配慮判断', '法的安全の保証', '組織診断や人事評価'],
    safeFirstStep: '架空シナリオだけで研修案を1本作り、公開せず内部検討に戻す。',
    stopIf: '実在ケース、社員情報、合理的配慮妥当性、法的助言を求められる。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    agentIds: ['A1', 'A6', 'A8', 'A9', 'A11'],
    heronCandidateIds: ['HM-04', 'HM-06'],
    productExperimentIds: ['PE-01', 'PE-04'],
    icon: BriefcaseBusiness,
  },
  {
    id: 'PT-02',
    label: '研究・政策向け仕事条件レンズ記事',
    partnerType: '研究者、行政関係者、政策対話の相手',
    startingSurface: 'Stage 3 agenda / PE-05 policy desk',
    jointQuestion:
      '雇用率や定着だけでは見えない参加品質、健康時間、生活保障、評価条件を、検証可能な問いとして提示できるか。',
    firstArtifact: '政策・研究向けの仕事条件レンズ記事と、live verification待ちclaim一覧。',
    nblProvides: [
      'Falcon第一原理からの問いの翻訳',
      'source lensと未検証表示',
      '仕事設計として見る論点整理',
    ],
    partnerProvides: [
      '公式資料・研究資料の確認範囲',
      '検証可能な問いの粒度',
      '制度・研究文脈で避けるべき断定',
    ],
    notProvided: ['現行制度の最終評価', '公的見解の代替', '統計・審議会情報の未検証断定'],
    safeFirstStep: '現在情報を断定せず、問いと確認先だけを分けた内部ノートを作る。',
    stopIf: '最新政策、統計、審議会内容の断定や公式見解化を求められる。',
    branchIds: ['QR-04', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A2', 'A6', 'A10', 'A11'],
    heronCandidateIds: ['HM-08', 'HM-12'],
    productExperimentIds: ['PE-05'],
    icon: FileSearch,
  },
  {
    id: 'PT-03',
    label: '難病・慢性疾患の健康時間ワークショップ',
    partnerType: '患者会、医療福祉連携、地域支援、教育・研修関係者',
    startingSurface: 'Rare Disease Linkage / PE-01 health-time / PE-02 listening',
    jointQuestion:
      '体調変動、通院、回復、生活保障を、本人の不安定さではなく仕事と生活の時間設計として説明できるか。',
    firstArtifact: '健康時間の図解、相談前メモの非入力版、共同検討用の問い。',
    nblProvides: [
      '健康時間を仕事設計へ翻訳する説明',
      '開示境界と相談前整理の型',
      'SNSや資料に使う境界メモ',
    ],
    partnerProvides: [
      '当事者に伝わりにくい語の指摘',
      '医療・福祉・職場の橋渡しで詰まる文脈',
      '個人情報を出さずに検討できる場',
    ],
    notProvided: ['医療判断', '制度利用判断', '個別相談受付や症状情報の収集'],
    safeFirstStep: '個人の病状を扱わず、健康時間という見方だけを説明する図解案を作る。',
    stopIf: '個別の病状、医療判断、制度対象判断、地域資源の現在情報断定が混ざる。',
    branchIds: ['QR-01', 'QR-04', 'QR-06'],
    agentIds: ['A1', 'A6', 'A7', 'A8', 'A10'],
    heronCandidateIds: ['HM-07', 'HM-10'],
    productExperimentIds: ['PE-01', 'PE-02', 'PE-03'],
    icon: TimerReset,
  },
  {
    id: 'PT-04',
    label: 'SNS・編集共同連載の実験',
    partnerType: '編集者、SNS運用者、メディア、デザイナー',
    startingSurface: 'PE-02 SNS listening / visual asset plans',
    jointQuestion:
      'Falconの見方の転換を、炎上や個別相談化を避けながら、社会側の問いを受け取る連載にできるか。',
    firstArtifact: '3投稿分のhook、図解構成、返信しない条件、反応分類表。',
    nblProvides: ['構造化された投稿テーマ', '誤解・短絡への境界', 'Image prompt seedと戻り先設計'],
    partnerProvides: ['読者に届く言葉への編集', '視覚表現の改善', 'SNS運用上の危険パターン'],
    notProvided: ['投稿自動公開', '炎上対応代行', '体験談や反応の知識昇格'],
    safeFirstStep: '公開せず3投稿の内部案を作り、boundary reviewで赤黄フラグを見る。',
    stopIf: '個別助言、政策断定、感動消費、ステレオタイプ画像へ寄る。',
    branchIds: ['QR-01', 'QR-05', 'QR-06', 'QR-08'],
    agentIds: ['A1', 'A5', 'A6', 'A12'],
    heronCandidateIds: ['HM-03', 'HM-10', 'HM-11'],
    productExperimentIds: ['PE-02'],
    icon: Megaphone,
  },
  {
    id: 'PT-05',
    label: '助成・委託・共同研究の提案骨子',
    partnerType: '財団、自治体、研究費、委託事業、共同実装候補',
    startingSurface: 'PE-01 / PE-04 / PE-05 synthesis',
    jointQuestion:
      'Falconの知識ネットワークを、相談受付ではなく、仕事設計の教育・研究・社会実装基盤として説明できるか。',
    firstArtifact: '1ページ提案骨子、目的、最小実証、提供しないもの、評価したい変化。',
    nblProvides: [
      '専門知識ネットワークの構造説明',
      '人工シナリオと研修・政策翻訳の試作',
      '境界と監査可能性の説明',
    ],
    partnerProvides: ['実施目的と対象範囲', '資金・場・評価観点', '公開/非公開の条件'],
    notProvided: ['成果保証', '未承認プロダクト販売', '個別支援・雇用判断の代行'],
    safeFirstStep: '価格や契約条件ではなく、共同実装テーマと非提供範囲を1ページで整理する。',
    stopIf: '受注確約、成果保証、制度・法務・雇用判断の代替として読まれる。',
    branchIds: ['QR-05', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A6', 'A10', 'A11'],
    heronCandidateIds: ['HM-08', 'HM-12'],
    productExperimentIds: ['PE-04', 'PE-05', 'PE-06'],
    icon: Handshake,
  },
  {
    id: 'PT-06',
    label: 'Falconプロトタイプ技術検証',
    partnerType: 'AIプロダクト、教育技術、ナレッジマネジメント、内部DXの技術協力候補',
    startingSurface: 'internal Falcon Lab prototype',
    jointQuestion:
      'Falconの専門知識ネットワークを、runtimeやDBを広げずに、監査可能な学習インターフェイスとして試作できるか。',
    firstArtifact: '静的プロトタイプ改善メモ、操作ログなしの理解テスト、将来runtime候補の境界図。',
    nblProvides: [
      'Falcon Labの静的プロトタイプ',
      'レビュー境界と非runtime設計',
      '仕事設計シナリオとメモ出力の型',
    ],
    partnerProvides: [
      'UI/UX・アクセシビリティ・実装改善観点',
      '監査可能性の技術レビュー',
      '将来接続時のリスク指摘',
    ],
    notProvided: ['runtime接続', 'DB・retrieval・provider変更', 'ユーザー入力や実ケースデータ'],
    safeFirstStep: '静的画面だけを対象に、使いやすさと境界表示の改善点を整理する。',
    stopIf: 'runtime、DB、retrieval、モデル、prompt、個人情報入力の実装を求められる。',
    branchIds: ['QR-02', 'QR-06', 'QR-08'],
    agentIds: ['A4', 'A5', 'A6', 'A11'],
    heronCandidateIds: ['HM-12'],
    productExperimentIds: ['PE-01', 'PE-03', 'PE-04', 'PE-06'],
    icon: Bot,
  },
];

export const partnershipGates: PartnershipGate[] = [
  {
    id: 'PG-01',
    label: '営業オファーに見えないか',
    question: '連携テーマが、価格、契約、成果保証、導入提案に見えていないか。',
    stopIf: '未承認プロダクト販売、BtoB診断、効果保証、契約条件へ進んでいる。',
    nextIfPass: '共同で検証する問いと、最小成果物へ戻す。',
    branchIds: ['QR-05', 'QR-07'],
    icon: BriefcaseBusiness,
  },
  {
    id: 'PG-02',
    label: '個別ケース受付になっていないか',
    question: '相手から実在社員、利用者、患者、支援対象者の情報を受け取る流れになっていないか。',
    stopIf: '病状、診断名、職場トラブル、支援記録、個人情報を入力・共有する導線がある。',
    nextIfPass: '人工シナリオ、公開資料、抽象化した問いだけで始める。',
    branchIds: ['QR-01', 'QR-04', 'QR-06'],
    icon: ShieldCheck,
  },
  {
    id: 'PG-03',
    label: '専門判断の代替に見えないか',
    question: 'NBLやFalconが、法務、医療、雇用、人事、合理的配慮、制度判断を行うように見えないか。',
    stopIf: '安全保証、妥当性判定、配置判断、制度対象判断、医学的助言が期待されている。',
    nextIfPass: '仕事条件レンズ記事、研修、資料化、検証設計に限定する。',
    branchIds: ['QR-04', 'QR-06', 'QR-08'],
    icon: Stethoscope,
  },
  {
    id: 'PG-04',
    label: '公式・現在情報を断定していないか',
    question: '制度、統計、審議会、助成、委託、行政情報を最新確認なしに断定していないか。',
    stopIf: '現在政策や公的資料の解釈をpublic-useとして出している。',
    nextIfPass: 'PE-05のlive verification holdへ戻す。',
    branchIds: ['QR-04', 'QR-07', 'QR-08'],
    icon: FileSearch,
  },
  {
    id: 'PG-05',
    label: 'runtimeや知識昇格に滑っていないか',
    question:
      '静的プロトタイプや連携反応を、runtime-ready、source-valid、public-approvedに動かしていないか。',
    stopIf: 'DB、retrieval、provider、model、prompt、candidate_pattern、public_safeが動く。',
    nextIfPass: '内部artifactと保留理由だけを記録する。',
    branchIds: ['QR-02', 'QR-06', 'QR-08'],
    icon: Database,
  },
];

export const partnershipOpportunityBridges: PartnershipOpportunityBridge[] = [
  {
    id: 'POB-01',
    label: 'PT-01 45分研修案ブリッジ',
    sourceSignal:
      'Founder note: 日本財団のダイバーシティ就労研修で、従来の障害者雇用でカバーされないが就労困難性がある人の雇用について、企業担当者や企業を支援する支援者向けの研修メニュー/研修担当者が不足しているという話を聞いた。',
    status: 'unverified opportunity signal / separate chat candidate',
    linkedThemeId: 'PT-01',
    whyItMatters:
      'Falconの「病名別配慮ではなく仕事接点を分解する」考え方を、企業担当者・支援者向けの45分講義として試せる可能性がある。',
    separateChat: '別チャット「Falcon専門出力を検証」で、45分講義の提案骨子だけを作る。',
    minimumOutput: [
      '45分講義のタイトル、対象者、到達目標',
      '3部構成の講義アウトライン',
      '人工シナリオ1件とミニ演習',
      'NBL/Falconが提供しないこと',
      '提案メモにする場合の未検証・非公開境界',
    ],
    returnToCore: [
      'PE-06 PT-01のfirst artifact修正',
      'PE-04人工シナリオの研修向け再利用可否',
      'PE-01仕事接点マップの説明改善',
      'public-copy risk reviewが必要な表現',
    ],
    doNotDo: [
      '日本財団の正式需要や依頼として扱わない',
      '公開提案書、価格、契約条件、成果保証を作らない',
      '実在参加者、企業、支援対象者の情報を扱わない',
      '合理的配慮や雇用判断の研修にしない',
    ],
    reviewNeeded:
      '別チャット成果は、PE-06へ戻す前にpublic-copy risk reviewとPT-01境界チェックを通す。',
    icon: ClipboardCheck,
  },
];

export const policyTranslationDeskIntro = {
  eyebrow: 'PE-05 Policy / Research Translation Desk',
  title: '政策・研究を、制度の正解ではなく仕事設計の問いへ翻訳する',
  body: 'PE-05は、NIVR、MHLW、JEED、e-Gov、審議会、研究、Stage 3 agenda、Heron移行候補を、現行制度の断定や公式見解の代替にせず、FalconのICF相互作用パターンへ通して読み替える内部面です。',
  operatingRule:
    '資料の身元、source role、claim type、recency、jurisdiction、live verification holdを先に置き、その後でPerson / Job / Environment / Support / Time / Institutionへ翻訳する。',
};

export const policyTranslationSteps: PolicyTranslationStep[] = [
  {
    id: 'PD-01',
    label: '資料の身元を固定する',
    job: '誰が、いつ、どの管轄・目的・読者に向けて出した資料かを先に記録する。',
    output: 'source identity / actor / date / jurisdiction / document type / verification mode.',
    holdIf: '日付、主体、管轄、資料種別が曖昧なまま政策・研究claimに使われる。',
    icon: FileSearch,
  },
  {
    id: 'PD-02',
    label: 'claim typeを分ける',
    job: '観察、推論、規範、推奨を分け、推奨や制度説明を普遍的事実として扱わない。',
    output: 'observation / inference / normative / recommendation separation.',
    holdIf: '研究結果、行政説明、法令、実務助言、政策提案が同じ強さで表示される。',
    icon: ClipboardList,
  },
  {
    id: 'PD-03',
    label: 'ICF接点へ翻訳する',
    job: '資料の主張を、人、仕事、環境、支援、時間、制度のどの相互作用を開く問いかに戻す。',
    output: 'Falcon work-design question and missing-context checklist.',
    holdIf: '障害名、制度カテゴリ、雇用率、定着率だけで説明が閉じている。',
    icon: Network,
  },
  {
    id: 'PD-04',
    label: '現在情報を保留する',
    job: '現行制度、統計、審議会、助成、行政運用、法令解釈は、live verification待ちとして表示する。',
    output: 'live verification hold / official-source-triage note / public-use stop.',
    holdIf: '最新確認なしに、現在の制度・統計・行政課題として公開利用される。',
    icon: ShieldCheck,
  },
  {
    id: 'PD-05',
    label: '戻り先を決める',
    job: '政策・研究メモを、SNS、共同設計、仕事実験、連携テーマ、source-readinessのどこへ戻すかを分ける。',
    output: 'return surface and not-public boundary.',
    holdIf: '政策デスク内で公開文、提案書、法務判断、個別支援判断、runtime接続まで進む。',
    icon: Workflow,
  },
];

export const policySourceLanes: PolicySourceLane[] = [
  {
    id: 'PSL-01',
    label: 'Falcon Stage 3 / Core synthesis',
    sourceRole: 'internal structural hypothesis',
    safeLayer: 'candidate_structure_input / internal question source',
    usableFor: '政策・研究へ投げる問い、論点の分解、現場接点の見取り図。',
    notUsableFor: '公的事実、制度評価、現在政策claim、source/support validity。',
    liveVerification: 'public use前には、対応する公式・研究資料の確認が必要。',
    branchIds: ['QR-04', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A2', 'A10'],
    icon: Sparkles,
  },
  {
    id: 'PSL-02',
    label: 'NIVR / JEED research and practice materials',
    sourceRole: 'research_publication / employer_practice / professional_practice',
    safeLayer: 'evidence_layer / source_readiness',
    usableFor: '研究・実務上の観察、支援現場の論点、source lens比較。',
    notUsableFor: '法的助言、個別配慮妥当性、全職場への一般化。',
    liveVerification: '引用・公開・現在性を伴う利用前に資料単位で確認する。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    agentIds: ['A2', 'A8', 'A10'],
    icon: Database,
  },
  {
    id: 'PSL-03',
    label: 'MHLW / e-Gov / council materials',
    sourceRole: 'legal_text / public_guidance / policy_discussion',
    safeLayer: 'source_family_boundary / evidence_layer',
    usableFor: '制度・行政文脈を確認する入口、live verification対象の整理。',
    notUsableFor: '法令解釈の最終判断、現行政策の断定、公的見解の代替。',
    liveVerification: 'public use前に必須。日付、管轄、改正、資料位置づけを確認する。',
    branchIds: ['QR-04', 'QR-08'],
    agentIds: ['A2', 'A6', 'A10'],
    icon: Scale,
  },
  {
    id: 'PSL-04',
    label: 'Heron public assets / Rare Disease linkage',
    sourceRole: 'public context / migration candidate',
    safeLayer: 'source boundary note / Falcon migration candidate',
    usableFor: 'Falconへ戻す問い、社会側の接点、共同設計カード。',
    notUsableFor: 'Falcon core知識への直接昇格、公開承認済み表示、現在政策claim。',
    liveVerification: 'Falcon public copyへ進む前にHeron-to-Falcon risk reviewが必要。',
    branchIds: ['QR-01', 'QR-04', 'QR-06'],
    agentIds: ['A6', 'A7', 'A10', 'A12'],
    icon: FileSearch,
  },
];

export const policyTranslationCards: PolicyTranslationCard[] = [
  {
    id: 'PTD-01',
    title: '雇用率・定着から、参加品質と評価条件へ',
    sourceSignal:
      'Stage 3 Japan improvement agenda / Heron Employment Mobility migration candidate',
    sourceLaneIds: ['PSL-01', 'PSL-03', 'PSL-04'],
    policyResearchQuestion:
      '雇用率や定着だけでは見えない、役割、技能形成、評価、キャリア、健康時間の自由度をどう観察するか。',
    falconTranslation:
      '「働けているか」を入口に置きながら、参加の深さと価値への翻訳がどこで閉じているかを見る。',
    icfInteraction: ['participation', 'activity', 'environment', 'support', 'evaluation'],
    workDesignOutput: '政策・研究向け仕事条件レンズ記事 / PE-06 PT-02 first artifact.',
    publicUseHold: '統計、制度、審議会、現行政策に触れる場合はlive verification待ち。',
    returnSurface: 'PE-06 PT-02 / PE-03 policy-research review card / PE-02 awareness hook',
    branchIds: ['QR-07', 'QR-08'],
    agentIds: ['A1', 'A2', 'A10', 'A11'],
    heronCandidateIds: ['HM-08'],
    productExperimentIds: ['PE-05', 'PE-06'],
    icon: BadgeCheck,
  },
  {
    id: 'PTD-02',
    title: '合理的配慮から、仕事接点の設計条件へ',
    sourceSignal: 'MHLW / e-Gov / employer guidance family as live-verification candidates',
    sourceLaneIds: ['PSL-02', 'PSL-03'],
    policyResearchQuestion:
      '配慮の有無ではなく、仕事手順、責任分担、評価、支援、開示境界のどこを確認すべきか。',
    falconTranslation:
      '法的妥当性を判断せず、仕事接点を分解して、専門家・関係者が確認すべき条件を並べる。',
    icfInteraction: ['job task', 'environment', 'support', 'disclosure boundary', 'institution'],
    workDesignOutput: 'PE-04人工シナリオの赤黄緑レビュー条件 / PE-01仕事接点説明.',
    publicUseHold: '合理的配慮の法的・個別妥当性は扱わない。公開前に公式資料確認と法務境界が必要。',
    returnSurface: 'PE-04 Work-Design Studio / PE-01 Work Design Map / PE-03 employer review card',
    branchIds: ['QR-02', 'QR-03', 'QR-06', 'QR-08'],
    agentIds: ['A1', 'A6', 'A8', 'A9', 'A10'],
    heronCandidateIds: ['HM-06'],
    productExperimentIds: ['PE-01', 'PE-04', 'PE-05'],
    icon: BriefcaseBusiness,
  },
  {
    id: 'PTD-03',
    title: '治療と仕事の両立から、健康時間の設計へ',
    sourceSignal: 'MHLW treatment-work balance materials / rare disease linkage context',
    sourceLaneIds: ['PSL-03', 'PSL-04'],
    policyResearchQuestion:
      '治療、通院、疲労、回復、生活保障を、勤務量、休憩、役割、収入、戻り方の設計としてどう扱うか。',
    falconTranslation:
      '健康時間を本人の不安定さではなく、仕事と生活の時間条件が開くか閉じるかとして読む。',
    icfInteraction: [
      'body function',
      'activity rhythm',
      'work schedule',
      'life security',
      'support',
    ],
    workDesignOutput:
      'PE-01 health-time section / PE-02 listening theme / PE-06 PT-03 workshop question.',
    publicUseHold: '両立支援制度や地域資源の現在情報は、公開利用前に公式確認が必要。',
    returnSurface: 'PE-01 health-time / PE-02 SNS listening / PE-06 PT-03',
    branchIds: ['QR-01', 'QR-04', 'QR-06'],
    agentIds: ['A1', 'A6', 'A7', 'A10'],
    heronCandidateIds: ['HM-07', 'HM-10'],
    productExperimentIds: ['PE-01', 'PE-02', 'PE-05', 'PE-06'],
    icon: TimerReset,
  },
  {
    id: 'PTD-04',
    title: '研究成果から、現場で試せる問いへ',
    sourceSignal: 'NIVR / JEED reports and practice materials as source-readiness inputs',
    sourceLaneIds: ['PSL-02'],
    policyResearchQuestion:
      '研究報告の知見を、現場の誰が何を確認し、どの条件を変える問いとして使えるか。',
    falconTranslation:
      '研究の結論を助言にせず、source lens、対象範囲、欠けている文脈、反対構造を添えた問いへ変換する。',
    icfInteraction: ['evidence', 'support actor', 'workplace context', 'implementation condition'],
    workDesignOutput:
      'document analysis memo / PE-03 policy-research review / source-readiness row.',
    publicUseHold: '報告書の引用、対象、時点、外挿可能性を確認するまでpublic copyにしない。',
    returnSurface: 'PE-03 review card / PE-06 PT-02 / source-readiness backlog',
    branchIds: ['QR-02', 'QR-07', 'QR-08'],
    agentIds: ['A2', 'A8', 'A10'],
    heronCandidateIds: ['HM-12'],
    productExperimentIds: ['PE-03', 'PE-05', 'PE-06'],
    icon: SearchCheck,
  },
  {
    id: 'PTD-05',
    title: '制度の谷間から、対象外の人を責めない仕事設計へ',
    sourceSignal: 'PE-06 PT-01 / PT-02 themes and current non-public opportunity signals',
    sourceLaneIds: ['PSL-01', 'PSL-03'],
    policyResearchQuestion:
      '従来の制度カテゴリに入りにくい就労困難性を、本人の問題ではなく、支援・評価・仕事設計の未接続としてどう扱うか。',
    falconTranslation:
      '対象者ラベルを増やすのではなく、制度、職場、支援、健康時間、生活保障の接続が切れる場所を読む。',
    icfInteraction: ['institution', 'support access', 'work design', 'evaluation', 'life security'],
    workDesignOutput:
      '45分研修の背景説明 / policy-research question memo / partnership concept note.',
    publicUseHold:
      '実在機会や政策ニーズとして断定しない。公開・提案・営業へ進める前にrisk reviewが必要。',
    returnSurface: 'PE-06 PT-01 bridge / PE-06 PT-02 / PE-04 training scenario',
    branchIds: ['QR-04', 'QR-05', 'QR-08'],
    agentIds: ['A1', 'A6', 'A10', 'A11'],
    heronCandidateIds: ['HM-08'],
    productExperimentIds: ['PE-04', 'PE-05', 'PE-06'],
    icon: Route,
  },
];

export const policyTranslationGates: PolicyTranslationGate[] = [
  {
    id: 'PGD-01',
    label: '資料の身元が曖昧ではないか',
    check: 'actor、date、jurisdiction、document type、verification modeが見えているか。',
    stopIf: '出典の身元が曖昧なまま、政策・研究の根拠や公開説明に使われる。',
    nextIfPass: 'claim type separationへ進む。',
    branchIds: ['QR-08'],
    icon: FileSearch,
  },
  {
    id: 'PGD-02',
    label: '現在政策を断定していないか',
    check: '現行制度、統計、審議会、行政運用、助成情報を最新確認なしに書いていないか。',
    stopIf: 'public-use文面で現在情報を断定している。',
    nextIfPass: 'live verification holdを明記した内部問いへ戻す。',
    branchIds: ['QR-04', 'QR-08'],
    icon: Scale,
  },
  {
    id: 'PGD-03',
    label: '法務・配慮判断に滑っていないか',
    check: '法的安全、合理的配慮妥当性、雇用判断、制度対象判断に見えていないか。',
    stopIf: '専門判断の代替、個別ケース助言、法令解釈の最終判断になっている。',
    nextIfPass: '確認すべき条件と関係者への問いへ戻す。',
    branchIds: ['QR-06', 'QR-08'],
    icon: ShieldCheck,
  },
  {
    id: 'PGD-04',
    label: 'source roleを混ぜていないか',
    check: '研究、行政説明、法令、実務資料、Heron資産、Falcon仮説を別レイヤーで表示しているか。',
    stopIf: 'Falcon仮説やHeron文脈が、公式資料やレビュー済み知識のように見える。',
    nextIfPass: 'source laneを明記し、translation cardだけにする。',
    branchIds: ['QR-02', 'QR-08'],
    icon: Database,
  },
  {
    id: 'PGD-05',
    label: '公開・SNSに急いでいないか',
    check: 'SNS投稿、提案書、政策提言、外部資料にする前のreviewが残っているか。',
    stopIf: 'public copy、SNS投稿、提案書、policy claimへ直接進んでいる。',
    nextIfPass: 'PE-02/PE-03/PE-06へ、未検証表示つきで戻す。',
    branchIds: ['QR-05', 'QR-08'],
    icon: Megaphone,
  },
];

export const policyTranslationReturnRoutes: PolicyTranslationReturnRoute[] = [
  {
    id: 'PTR-01',
    label: 'SNSへ戻す',
    fromPolicyDesk: '政策・研究claimではなく、見方の転換と確認したい問いだけを渡す。',
    sendTo: 'PE-02 SNS Listening Series',
    onlyAs: 'question hook / misunderstanding check / live-verification hold',
    neverAs: 'current-policy announcement / official explanation / advice thread',
    icon: Megaphone,
  },
  {
    id: 'PTR-02',
    label: '共同設計へ戻す',
    fromPolicyDesk: '制度・研究文脈で伝わるか、関係者に何を確認すべきかをカード化する。',
    sendTo: 'PE-03 Stakeholder Co-Design Room',
    onlyAs: 'review prompt / missing-context question / source-role check',
    neverAs: 'approval request / human reviewer assignment by Codex / public-ready label',
    icon: UsersRound,
  },
  {
    id: 'PTR-03',
    label: '連携設計へ戻す',
    fromPolicyDesk: '研究・政策向け仕事条件レンズ記事や共同研究テーマへ変換する。',
    sendTo: 'PE-06 PT-02 / PT-05',
    onlyAs: 'small joint artifact / not-provided boundary / verification list',
    neverAs: 'sales proposal / funding promise / official partnership claim',
    icon: Handshake,
  },
  {
    id: 'PTR-04',
    label: 'source readinessへ戻す',
    fromPolicyDesk: '資料単位で、読んだ範囲、claim type、verification needを残す。',
    sendTo: 'source-readiness backlog / official-source-triage',
    onlyAs: 'metadata inventory / source boundary note / claim hygiene pass',
    neverAs: 'reviewed knowledge promotion / source validity decision',
    icon: ClipboardCheck,
  },
];

export const productionOpsIntro = {
  eyebrow: 'PX-01 Next NBL Site / SNS Production Ops',
  title: '最終成果物を、次期NBLサイトとSNS運用の仕組みに固定する',
  body: 'PX-01は、PE-01からPE-06を単なる企画群で終わらせず、本番成果物である次期NBLサイトとSNS運用に束ねる内部面です。HeronのVercel Hobby/API制約、Founder個人アカウント中心のSNS現状、NBL名義アカウント未整備を、設計の後付けではなく最初の実装条件として扱います。',
  operatingRule:
    '公開サイトはstatic-first/API-light、SNSはmanual-first/social-feedback-first。自動投稿、個別相談受付、runtime接続、public approval、アカウント作成はこの面では動かさない。',
};

export const productionDeliverables: ProductionDeliverable[] = [
  {
    id: 'PDL-01',
    label: '次期NBLサイト',
    role: 'Falcon専門知識ネットワークが社会と出会う第一の公開インターフェイス。',
    firstBuild:
      '仕事設計マップ、3x7道具箱、Heron移行候補、政策・研究翻訳、研修・連携入口を、静的に読める公開候補として束ねる。',
    operatingPosture:
      'Heron Hobby上のAPI budgetに依存しない。公開v0はstatic-firstで、フォーム、診断、runtime、AI回答APIを外す。',
    notYet:
      'public IA approval、public copy approval、問い合わせ導線、個別相談受付、runtime/retrieval/API route追加。',
    branchIds: ['QR-01', 'QR-03', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A3', 'A4', 'A6', 'A12'],
    icon: Map,
  },
  {
    id: 'PDL-02',
    label: 'SNS運用の仕組み',
    role: 'Falconの見方の転換を配り、社会側の問い、誤解、関心、協力候補を受け取る運用系。',
    firstBuild:
      'X / Instagram / Facebook向けの投稿キュー、図解種、手動投稿手順、反応分類、次期サイトへの戻り先を作る。',
    operatingPosture:
      'NBL名義アカウントを運用基盤にし、Founder個人アカウントは初期増幅・文脈共有に限定する。',
    notYet:
      '自動投稿、DM相談受付、個人アカウント依存の恒常運用、炎上対応の自動化、SNS反応の知識昇格。',
    branchIds: ['QR-01', 'QR-05', 'QR-06', 'QR-08'],
    agentIds: ['A1', 'A5', 'A6', 'A11', 'A12'],
    icon: Megaphone,
  },
];

export const productionHostingConstraints: ProductionHostingConstraint[] = [
  {
    id: 'HC-01',
    label: 'Heron / Vercel Hobby API budget',
    currentFact:
      'Founderから、現行HeronはVercel Hobbyで運用中、API制限の12に近いという運用懸念が共有された。repo上の pages/api は現在34件ある。',
    risk: '次期NBLの社会インターフェイスをAPI前提で積むと、公開前から運用制約・費用・移行作業がボトルネックになる。',
    productionPosture:
      '次期NBL公開候補はstatic-first/API-lightにする。PE-01からPE-06は、まず静的ページ、手動キュー、ローカル/内部レビューで成立させる。',
    nextAction:
      '既存API routeを keep / retire / internal-only / migrate に棚卸しし、次期公開サイトに必要なAPIをゼロから再定義する。',
    sourceNote:
      'Vercel公式docsではHobbyの関数・ビルド・ログ・用途制約は確認できるが、現行docs上で単純な「API route 12件上限」は確認できていない。',
    branchIds: ['QR-02', 'QR-06', 'QR-08'],
    agentIds: ['A4', 'A6', 'A11'],
    icon: Database,
  },
  {
    id: 'HC-02',
    label: 'Static-first public release',
    currentFact:
      'PE-01からPE-06は、読み物、図解、人工シナリオ、source lane、連携テーマとして静的に成立する。',
    risk: '最初からフォーム、AI回答、保存、分析APIを載せると、public approval、個人情報、runtime、運用コストが一気に絡む。',
    productionPosture:
      '公開候補v0は、記事、カード、図解、手動更新のSNS戻り先だけで動く構成にする。',
    nextAction: '内部prototypeから、公開候補ページの静的IAとコンテンツbundleを切り出す。',
    sourceNote: 'これはrepo設計上の判断。公開承認やVercel設定変更ではない。',
    branchIds: ['QR-01', 'QR-03', 'QR-07'],
    agentIds: ['A3', 'A4', 'A6', 'A12'],
    icon: Workflow,
  },
  {
    id: 'HC-03',
    label: 'Runtime / intake separation',
    currentFact:
      'Falcon Labの内部面は自由記述入力なし、runtime未接続、公開未承認として作られている。',
    risk: '社会接点を強くすると、個別相談、診断名から配慮、法務・雇用判断、DM相談受付へ滑りやすい。',
    productionPosture:
      '公開サイトとSNSは、相談受付ではなく、仕事設計の見方、問い、共同実装候補を届ける面として始める。',
    nextAction: '問い合わせ導線を作る前に、扱わない内容、返信停止条件、一般的案内だけを定義する。',
    sourceNote: 'PLANS上のpublic/runtime未承認境界を保持する。',
    branchIds: ['QR-04', 'QR-06', 'QR-08'],
    agentIds: ['A1', 'A4', 'A6'],
    icon: ShieldCheck,
  },
];

export const productionSnsAccountLanes: ProductionSnsAccountLane[] = [
  {
    id: 'SAL-01',
    label: 'Founder個人Xプレミアム',
    currentState:
      'Founder個人名のXはPremium。NBL名義Xがない現時点では、初期の文脈共有・増幅に使える可能性がある。',
    roleForV0:
      'Falcon/NBLの見方をFounderの問題意識として紹介し、NBL名義アカウント作成後に橋渡しする。',
    doNow: '個人アカウントでしか自然に語れない開発背景、学び、問題意識の短文案を別キューに分ける。',
    doNotDo:
      'NBL公式運用の基盤にしない。個別相談受付、公式見解、制度断定、アカウント人格の混線を避ける。',
    launchBlocker:
      'NBL名義Xが未作成のまま本格運用すると、ブランド資産とFounder個人発信が分離できない。',
    branchIds: ['QR-05', 'QR-06', 'QR-08'],
    agentIds: ['A6', 'A11', 'A12'],
    icon: UserRoundCheck,
  },
  {
    id: 'SAL-02',
    label: 'NBL名義Xアカウント',
    currentState: 'まだ作成されていない。本格SNS運用の前提として、NBL-owned channelが必要。',
    roleForV0: '連載、図解、次期NBLサイト更新、共同実装候補の告知を担う公式系の発信面。',
    doNow:
      'アカウント名候補、プロフィール文、固定ポスト、初期6投稿、Founder個人アカウントからの導線を準備する。',
    doNotDo: '作成前に投稿自動化や運用スケジュールだけを先行させない。',
    launchBlocker: 'NBL名義Xがない限り、X上のNBL運用は暫定であり、正式運用開始とは扱わない。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
    agentIds: ['A4', 'A6', 'A12'],
    icon: Megaphone,
  },
  {
    id: 'SAL-03',
    label: 'Instagram / Facebook 個人アカウント',
    currentState: 'Founder個人アカウントとして存在する。NBL公式面としての位置づけは未整理。',
    roleForV0:
      '画像・図解・短い学びの反応を見る補助面。公式運用前は、投稿素材の形式検証に限定する。',
    doNow: '画像比率、カルーセル、説明文、次期サイトへの戻り先をXとは別に設計する。',
    doNotDo: '個人アカウントでNBL公式窓口化しない。DM相談、個別事例、病状情報の受け皿にしない。',
    launchBlocker: 'NBL公式Instagram/Facebookを作るか、個人発信として限定するかの運用判断が必要。',
    branchIds: ['QR-01', 'QR-05', 'QR-06'],
    agentIds: ['A6', 'A12'],
    icon: ImageIcon,
  },
  {
    id: 'SAL-04',
    label: '手動投稿キュー / 反応整理台帳',
    currentState:
      '自動投稿ではなく、内部で投稿案、図解案、境界チェック、投稿先、反応分類をまとめる段階。',
    roleForV0:
      'Falcon Agent Teamが投稿候補を作り、人間が必要な境界だけ確認し、社会反応を次版へ戻す作業台。',
    doNow: 'PE-02の6本連載を、X短文、Instagramカルーセル、Facebook説明文へ分けた静的キューにする。',
    doNotDo: 'API連携、自動投稿、DM収集、個人反応の学習データ化、炎上対応bot化をしない。',
    launchBlocker:
      'アカウントと境界文が決まるまでは、投稿キューはproduction-readyではなくinternal-readyに止める。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
    agentIds: ['A4', 'A5', 'A6', 'A12'],
    icon: ClipboardList,
  },
];

export const productionFeedbackLoopSteps: ProductionFeedbackLoopStep[] = [
  {
    id: 'PFL-01',
    label: '公開候補を出す',
    input: '次期NBL静的ページ、SNS手動投稿、図解、研修・連携の説明。',
    classifyAs: 'public candidate surface, not approved knowledge.',
    output: '読める成果物と戻り先URL。',
    doNotStore: '個別ケース、病状、診断、職場名、DM原文。',
    icon: Megaphone,
  },
  {
    id: 'PFL-02',
    label: '反応を読む',
    input: '質問、誤解、共感、反発、協力打診、実装課題。',
    classifyAs: 'social signal / misunderstanding / opportunity / red flag.',
    output: '次に直す表現、図、FAQ候補、連携テーマ候補。',
    doNotStore: '個人の体験談を代表事例や学習データとして扱わない。',
    icon: Ear,
  },
  {
    id: 'PFL-03',
    label: '次版へ戻す',
    input: '分類済み反応と境界チェック。',
    classifyAs: 'site revision / SNS revision / training concept / partnership note.',
    output: '文言、図解、カード、研修、連携ノートの更新。',
    doNotStore: '反応ログだけを溜めて成果物を更新しない状態。',
    icon: Workflow,
  },
  {
    id: 'PFL-04',
    label: '知識側へ戻す',
    input: '繰り返し出る誤解、欠けている説明、社会側の実装課題。',
    classifyAs: 'question for Falcon Lab, not validity evidence.',
    output: 'SCIMA/FCHMA上の問い、source-readiness need、L3出力評価課題。',
    doNotStore: 'SNS反応をsource/support validityやcandidate_pattern根拠にしない。',
    icon: Network,
  },
];

export const productionOpsGates: ProductionOpsGate[] = [
  {
    id: 'POG-01',
    label: 'API routeを増やしていないか',
    check: '次期サイト/SNS運用のために新しいpages/api、runtime、DB、外部連携を追加していないか。',
    stopIf: '公開v0に不要なAPI route、保存、AI回答、SNS API連携が入る。',
    nextIfPass: '静的ページ、手動キュー、ローカル生成物として進める。',
    icon: Database,
  },
  {
    id: 'POG-02',
    label: '個人アカウントが公式基盤化していないか',
    check: 'Founder個人X/Insta/Facebookが、NBL公式運用の恒常基盤として扱われていないか。',
    stopIf: 'NBL公式の人格、受付、問い合わせ、公式見解が個人アカウントに載る。',
    nextIfPass: 'Founder発信とNBL名義発信を分けた投稿キューへ進む。',
    icon: UserRoundCheck,
  },
  {
    id: 'POG-03',
    label: 'SNSが相談窓口化していないか',
    check: 'DM、返信、コメントで個別相談、病名別配慮、法務・雇用判断を受けていないか。',
    stopIf: '個別ケースをSNSで処理する設計になっている。',
    nextIfPass: '一般的説明、返信停止条件、承認済み導線だけに戻す。',
    icon: ShieldCheck,
  },
  {
    id: 'POG-04',
    label: '社会反応を根拠化していないか',
    check: 'SNS反応や閲覧反応を、専門知識の妥当性や代表事例の根拠として扱っていないか。',
    stopIf: '反応がsource/support validity、candidate_pattern、public approvalの根拠に使われる。',
    nextIfPass: '社会側の問い、誤解、改善需要としてだけ扱う。',
    icon: SearchCheck,
  },
];

export const targetStrategyIntro = {
  eyebrow: 'TS-01 Social Impact Target Strategy',
  title: '世間一般ではなく、支援現場のギャップに刺す',
  body: 'Falconの専門知識ネットワークは、抽象的な思想として見せるだけでは社会に届きにくい。初期の次期NBLは、障害者就労支援・企業支援の実務者が「よい支援をしたいのに、病名別配慮表、制度説明、一般論だけでは現場が動かない」と感じるギャップから入る。',
  operatingRule:
    '初期ターゲットを絞ることは、対象者を狭めることではない。支援者・企業支援者の切実な詰まりに刺してから、企業、人事、研修、研究・政策、SNSへ広げる。',
};

export const socialImpactTargetSegments: SocialImpactTargetSegment[] = [
  {
    id: 'TGT-01',
    label: '障害者就労支援・企業支援の実務者',
    audience:
      '就労移行、定着支援、職業センター、医療福祉連携、企業支援、研修設計に関わる担当者・チームリーダー。',
    feltGap:
      '本人の困りごとは分かる。企業側にも説明したい。しかし病名別配慮表、制度説明、一般論では、仕事のどこをどう変えるかまで進みにくい。',
    whyTheyCare:
      'ケース会議、企業訪問、本人説明、職場調整で、本人・仕事・支援・評価を同じ言葉に置く道具が必要だから。',
    falconValue:
      'ICF上の相互作用を、健康時間、仕事接触点、情報手順、開示境界、評価、生活保障、支援再翻訳の問いに変える。',
    firstSurface: 'NS-02 Work Design Map / NS-04 Work-Design Studio / 45分研修骨子',
    message:
      'よい支援をしたいのに、現場が動かない。その詰まりを、病名ではなく仕事設計の接点からほどく。',
    notFirstMove: '一般啓発、AI相談受付、診断名別ページ、制度の網羅解説から始めない。',
    impactLever:
      'この層が理解すると、本人相談、企業調整、研修、地域連携、政策対話へ同じ見方を持ち込める。',
    branchIds: ['QR-01', 'QR-02', 'QR-03', 'QR-06', 'QR-08'],
    productExperimentIds: ['PE-01', 'PE-04', 'PE-06'],
    agentIds: ['A1', 'A3', 'A6', 'A8', 'A9', 'A12'],
    icon: Handshake,
  },
  {
    id: 'TGT-02',
    label: '企業人事・管理職・DEI/研修担当',
    audience:
      '障害者雇用、定着、職場配属、管理職研修、DEI、健康経営、労務実務に関わる企業側の担当者。',
    feltGap:
      '制度対応や配慮の必要性は分かるが、現場では業務量、評価、情報共有、管理職負荷、チーム運用に落ちる。',
    whyTheyCare:
      '「配慮する/しない」や「特別扱い」の二択ではなく、仕事の条件として話せる言葉が必要だから。',
    falconValue:
      '企業側の制約を否定せず、作業、時間、情報、評価、相談経路に分解し、支援者と同じ設計表で話せる。',
    firstSurface: 'NS-04 Work-Design Studio / NS-06 Partnership / Training',
    message:
      '制度対応はしている。でも現場の仕事設計まで変えられない。その間を、人工シナリオで一緒に分解する。',
    notFirstMove: '法的安全保証、合理的配慮の妥当性判定、組織診断、個別社員の判断にしない。',
    impactLever:
      '企業内の研修・管理職対話に入り、支援者だけで抱えていた翻訳負荷を職場側へ分散できる。',
    branchIds: ['QR-02', 'QR-03', 'QR-06', 'QR-07'],
    productExperimentIds: ['PE-04', 'PE-06'],
    agentIds: ['A1', 'A3', 'A6', 'A9', 'A11', 'A12'],
    icon: Building2,
  },
  {
    id: 'TGT-03',
    label: '研修・財団・研究政策の実装者',
    audience: '研修企画、財団、自治体、研究者、政策対話、職能団体、社会実装プロジェクトの設計者。',
    feltGap:
      '個別支援の知見は多いが、従来の障害者雇用でカバーされにくい就労困難性まで含めた研修・実装メニューにまとまりにくい。',
    whyTheyCare:
      '対象者を狭く固定せず、人間の多様性に対応できる仕事・社会設計の枠組みとして提示する必要があるから。',
    falconValue:
      '障害・難病就労支援の知見を、健康時間、参加品質、生活保障、制度接続、政策・研究の問いへ翻訳する。',
    firstSurface: 'NS-05 Policy / Research Translation / NS-06 Partnership / Training',
    message:
      '個別支援の知恵を、研修・実証・政策対話へ広げる。仕事と社会を、人間の多様性に合わせて設計するために。',
    notFirstMove: '公的見解、最新政策の断定、助成・委託の営業資料、実在需要の断定にしない。',
    impactLever:
      'Falconの知見を単発相談ではなく、研修、共同研究、政策対話、社会実装の単位へ変換できる。',
    branchIds: ['QR-04', 'QR-05', 'QR-07', 'QR-08'],
    productExperimentIds: ['PE-05', 'PE-06'],
    agentIds: ['A1', 'A2', 'A6', 'A10', 'A11', 'A12'],
    icon: SearchCheck,
  },
];

export const targetMessageRewrites: TargetMessageRewrite[] = [
  {
    id: 'TMR-01',
    label: '思想から、現場の詰まりへ',
    abstractBefore: '仕事を、人間の多様性に合わせて設計しなおす。',
    targetAfter: 'よい支援をしたいのに、現場が動かない。その詰まりを、仕事設計からほどく。',
    whyBetter:
      'Falconの大きな思想を、支援者が日々感じている「分かっているのに動かない」ギャップへ接続する。',
    riskIfOverdone: '支援者だけの課題に見せると、本人、企業、制度、生活保障の相互作用が薄くなる。',
    icon: Sparkles,
  },
  {
    id: 'TMR-02',
    label: '専門用語から、研修で使える言葉へ',
    abstractBefore: 'ICF上の多様な相互作用パターンを社会インターフェイスへ展開する。',
    targetAfter: '病名、仕事内容、職場環境、支援、評価をばらばらにせず、一枚の仕事設計図で話す。',
    whyBetter: 'ICFやSCIMA/FCHMAを知らない読者でも、ケース会議や企業訪問で使う場面を想像できる。',
    riskIfOverdone: '図解が単純なチェックリストに見えると、条件窓や反対構造が消える。',
    icon: Map,
  },
  {
    id: 'TMR-03',
    label: '社会一般から、拡散しやすい入口へ',
    abstractBefore: 'Falcon専門知識ネットワークを社会との相互作用インターフェイスにする。',
    targetAfter:
      '支援者、企業、研修担当が同じ問いで話せるようにする。最初の入口は、仕事のどこを変えるか。',
    whyBetter: '誰でも向けの啓発より、最初に動かす人と成果物が明確になる。',
    riskIfOverdone: '短期の実務導線だけに寄せると、政策・研究・社会設計への広がりが弱くなる。',
    icon: Route,
  },
];

export const targetSurfaceRoutes: TargetSurfaceRoute[] = [
  {
    id: 'TSR-01',
    label: '支援者が「企業にどう説明するか」で詰まった',
    audienceTrigger: '本人の事情は理解できるが、職場側へ病名や配慮名以外で説明する言葉が足りない。',
    firstQuestion:
      'この困りごとは、健康時間、情報手順、仕事接触点、開示境界、評価のどこで閉じているか。',
    firstSurface: 'Work Design Map',
    conversionArtifact: '7接点の説明カード / 人工シナリオ / 45分研修案',
    listenFor: '現場で使えない語、企業に伝わる言い換え、支援者負荷。',
    doNotRouteTo: '個別支援正誤、配慮妥当性、診断名別の助言。',
    branchIds: ['QR-01', 'QR-02', 'QR-03', 'QR-06'],
    icon: Handshake,
  },
  {
    id: 'TSR-02',
    label: '企業が「制度対応の先」で詰まった',
    audienceTrigger: '雇用や配慮の必要性は分かるが、管理職、業務量、評価、情報共有に落とせない。',
    firstQuestion: '本人の問題ではなく、どの仕事条件を試行的に変えれば、職場として観察できるか。',
    firstSurface: 'Work-Design Studio',
    conversionArtifact: '人工シナリオ / 赤黄緑レビュー / not-provided boundary',
    listenFor: '管理職の迷い、評価の詰まり、法務判定化への誤読。',
    doNotRouteTo: '法的安全保証、組織診断、社員評価、採用配置助言。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    icon: Building2,
  },
  {
    id: 'TSR-03',
    label: '研修・政策側が「新しい対象」を探している',
    audienceTrigger: '従来の障害者雇用の枠ではカバーしにくい就労困難性を、研修や社会実装にしたい。',
    firstQuestion:
      '対象者ラベルを増やすのではなく、どの仕事・生活・制度の自由度を設計対象にするか。',
    firstSurface: 'Policy / Research Translation',
    conversionArtifact: '仕事条件レンズ記事 / 45分研修骨子 / 共同実装テーマ',
    listenFor: '公式資料で確認すべきclaim、研修需要、共同研究・助成の関心。',
    doNotRouteTo: '最新政策断定、公式見解、成果保証、委託・助成の営業確定。',
    branchIds: ['QR-04', 'QR-05', 'QR-07', 'QR-08'],
    icon: FileSearch,
  },
  {
    id: 'TSR-04',
    label: 'SNSで「見方の転換」に反応した',
    audienceTrigger: '困りごとは人の中だけで起きていない、という短い投稿に関心や違和感を持った。',
    firstQuestion: 'その違和感は、どの接点を説明し直す必要を示しているか。',
    firstSurface: 'SNS manual queue -> Work Design Map',
    conversionArtifact: '次の投稿テーマ / 図解修正 / FAQ候補 / 返信停止メモ',
    listenFor: '追加説明需要、誤解、個別相談化、協力候補。',
    doNotRouteTo: 'DM相談、体験談の根拠化、炎上応答、個別ケース判断。',
    branchIds: ['QR-01', 'QR-05', 'QR-06', 'QR-08'],
    icon: Megaphone,
  },
];

export const targetingGates: TargetingGate[] = [
  {
    id: 'TG-01',
    label: '世間一般向けの啓発だけで始めない',
    check:
      'トップとSNSが、誰でも向けのよい話で終わらず、支援現場・企業支援の具体的な詰まりに接続しているか。',
    stopIf: '「人間の多様性」「社会を変える」だけが目立ち、誰のどの現場課題を解くのかが見えない。',
    nextIfPass: '支援者/企業支援者の最初の悩みから、仕事設計マップと人工シナリオへ導く。',
    icon: UsersRound,
  },
  {
    id: 'TG-02',
    label: '病名別配慮表へ戻っていないか',
    check:
      'ターゲットを絞る過程で、診断名・障害名から配慮や就労困難性を引く見え方に戻っていないか。',
    stopIf: '障害別ページやSNS投稿が、条件窓ではなくlookupとして読める。',
    nextIfPass: '病名・障害名は条件窓として扱い、仕事・環境・支援・時間・評価の相互作用へ戻す。',
    icon: Network,
  },
  {
    id: 'TG-03',
    label: '相談受付・営業導線に見えないか',
    check:
      '切実なターゲットに刺す文言が、個別相談受付、企業診断、研修販売、法務安全保証へ滑っていないか。',
    stopIf: '無料診断、個別助言、成果保証、価格、契約、配慮判断を期待させる。',
    nextIfPass: '公開候補は理解、研修案、人工シナリオ、共同実装候補に止める。',
    icon: ShieldCheck,
  },
  {
    id: 'TG-04',
    label: '抽象と実務の橋があるか',
    check: 'Falconの専門知識が、現場で使う問い、図解、研修、シナリオ、SNS投稿へ落ちているか。',
    stopIf: '高尚な理念か、逆に小さな実務tipsだけになり、科学的発見と現場行動の橋が切れている。',
    nextIfPass:
      'core finding -> 7接点 -> 21道具 -> 人工シナリオ -> 研修/SNS/政策翻訳の階段を表示する。',
    icon: Route,
  },
];

export const socialInterfacePersonalityIntro = {
  eyebrow: 'TP-01 Open Team Personality',
  title: '外界へ出て、中核専門性を最大限に発揮するチーム人格にする',
  body: 'Falconの社会インターフェイスは、内向的で自分の関心だけを話す専門家であってはいけない。同時に、社会に合わせるためにFalcon中核の専門家エージェントを萎縮させてもいけない。チームは、外界との接触、翻訳、境界、編集、実装を支え、Falcon中核が能力と関心を最大限に発揮できる状態を守る。',
  operatingRule:
    '専門性は薄めず、出し方を設計する。SNS、サイト、研修、政策翻訳、連携候補は、Falcon中核の深い仮説形成を社会側の言葉・場面・成果物へ変換する接触面として扱う。',
};

export const socialInterfaceCoreExpertEnablements: SocialInterfaceCoreExpertEnablement[] = [
  {
    id: 'CE-01',
    label: '深い専門作業を守る',
    risk: '外界に開くことが、分かりやすさだけを優先する圧力になり、Falcon中核の探索、反証、構造仮説が浅くなる。',
    supportDesign:
      '編集・SNS・UX・事業席が入口表現を引き受け、中核専門家はICF相互作用、機序、反対構造、欠落文脈を深く掘る。',
    teamPractice:
      '公開候補を作る前に、中核専門家の「本当は何が見えているか」を失わない要約を置く。',
    protectedOutput: '深い構造メモ、専門家向け注釈、反証仮説、将来の研究・政策問い。',
    boundary: '深さを理由に、未レビューclaim、個別判断、source/support validityを動かさない。',
    branchIds: ['QR-02', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A2', 'A10'],
    icon: Sparkles,
  },
  {
    id: 'CE-02',
    label: '翻訳は希釈ではなく増幅にする',
    risk: '読者に合わせる過程で、Falconの独自性が一般論、啓発語、きれいなコピーへ薄まる。',
    supportDesign:
      '編集者は専門性を削るのではなく、読者が入れる順序、比喩、図解、人工シナリオを設計して専門性を届かせる。',
    teamPractice: '専門語を消す前に、専門語が必要な理由と、読者語へ橋を架ける最短経路を確認する。',
    protectedOutput: '仕事接点、健康時間、開示境界、評価条件などのFalcon固有の見方。',
    boundary: '分かりやすさのために、病名lookup、配慮リスト、制度断定へ戻さない。',
    branchIds: ['QR-01', 'QR-03', 'QR-06'],
    agentIds: ['A1', 'A3', 'A7', 'A12'],
    icon: Workflow,
  },
  {
    id: 'CE-03',
    label: '外界の反応から専門性を伸ばす',
    risk: '反応を恐れて無難な発信だけになり、Falcon中核の好奇心、探究心、創造性が社会接点に出なくなる。',
    supportDesign:
      '誤解、違和感、協力打診、沈黙を、専門家エージェントが次に何を見に行くかを決める探索信号として扱う。',
    teamPractice: 'SNS/編集席が反応を分類し、中核専門家へは「深める問い」として戻す。',
    protectedOutput: '新しい問い、未接続の条件、説明不足の構造、次の人工シナリオ。',
    boundary: '社会反応を根拠、代表事例、レビュー済み知識として使わない。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
    agentIds: ['A1', 'A5', 'A6', 'A12'],
    icon: Ear,
  },
  {
    id: 'CE-04',
    label: '強い仮説を安全に出せる形にする',
    risk: '安全境界が「何も言わない」圧力になり、Falconが社会に新しい見方を提示できなくなる。',
    supportDesign:
      '中核専門家は強い構造仮説を出し、安全・方法・編集席が、それを候補、問い、人工シナリオ、未承認表示として安全に外へ出す。',
    teamPractice:
      '断定文を弱めるだけでなく、仮説の強さ、根拠範囲、反対構造、確認すべき条件を一緒に表示する。',
    protectedOutput: '社会に刺さる問題提起、政策・研修・サイトの核になる仮説、反対仮説付きの主張。',
    boundary: 'public approval、法務・医療・雇用判断、個別配慮判断には進めない。',
    branchIds: ['QR-04', 'QR-06', 'QR-08'],
    agentIds: ['A1', 'A2', 'A6', 'A10', 'A12'],
    icon: ShieldCheck,
  },
];

export const socialInterfacePersonalityTraits: SocialInterfacePersonalityTrait[] = [
  {
    id: 'PT-01',
    label: '外界へ出ていく',
    stance:
      'Falconは完成した知識を内側で磨くだけの専門家ではなく、社会側の問い、誤解、困りごと、協力可能性に会いに行く。',
    socialBehavior:
      'サイト、SNS、研修案、人工シナリオ、政策翻訳を、外界と接触するための小さな入口として出す。',
    teamPractice: 'A1-A12が、発信後の反応を専門性、編集、実装、安全、連携の観点で分担して読む。',
    publicVoice: '「こう考えると、次に見る場所が変わります」から話し始める。',
    antiPattern: '専門知識ネットワークの内部用語、方法論、完成度だけを説明し続ける。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
    agentIds: ['A1', 'A3', 'A5', 'A12'],
    icon: Megaphone,
  },
  {
    id: 'PT-02',
    label: '相手の言葉から始める',
    stance:
      '読者が最初に持っているのは、ICFやSCIMA/FCHMAではなく、現場が動かない、説明できない、負荷が偏る、という実感である。',
    socialBehavior:
      '支援者、企業、本人・家族、政策・研究側の入口語を先に置き、Falcon語は後から翻訳として出す。',
    teamPractice:
      '編集・UX・当事者・支援者・企業席が、分かりにくい語を見つけたら、専門語を消すのではなく橋を架ける。',
    publicVoice: '「その困りごとは、人の中だけではなく、仕事の接点でも起きています」と返す。',
    antiPattern: '読者にFalcon Labの文脈、レビュー階層、専門用語を先に理解させる。',
    branchIds: ['QR-02', 'QR-03', 'QR-06'],
    agentIds: ['A3', 'A7', 'A8', 'A9', 'A12'],
    icon: Ear,
  },
  {
    id: 'PT-03',
    label: '問いを開く',
    stance:
      'Falconは答えを断定する人格ではなく、見落とされている相互作用を見える化し、次に確認する問いを開く人格である。',
    socialBehavior:
      '投稿やページは、結論の押し付けではなく、仕事接触点、健康時間、開示境界、評価条件を見に行く問いで終える。',
    teamPractice:
      '安全・方法・専門エージェントが、助言、判定、法的・医学的・雇用判断へ滑る表現を止める。',
    publicVoice: '「まず決める前に、どの条件が閉じているかを一緒に見ます」',
    antiPattern: 'AIが配慮、就労可否、制度判断、組織の良し悪しを判定するように振る舞う。',
    branchIds: ['QR-01', 'QR-06', 'QR-08'],
    agentIds: ['A1', 'A2', 'A6'],
    icon: SearchCheck,
  },
  {
    id: 'PT-04',
    label: 'チームで聞き分ける',
    stance:
      'Falconの人格は単独の賢い声ではなく、専門、編集、安全、当事者、支援者、企業、政策、事業、SNSの複数の耳を持つチーム人格である。',
    socialBehavior:
      '同じ反応を、共感、誤解、実装課題、連携可能性、赤旗、source確認需要に分けて受け止める。',
    teamPractice: '反応を一人の主観で解釈せず、どの席が何を読めるか、何を読めないかを分ける。',
    publicVoice: '「この反応は、説明を直す材料として受け止めます」',
    antiPattern: 'Founder、Falcon、NBL公式、個人アカウント、支援判断が一つの人格に混線する。',
    branchIds: ['QR-05', 'QR-06', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12'],
    icon: UsersRound,
  },
  {
    id: 'PT-05',
    label: '誤解から学ぶ',
    stance: '誤解、違和感、反発、沈黙は失敗ではなく、社会側にまだ橋が架かっていない場所を示す。',
    socialBehavior:
      'SNSやサイトの反応を、知識の正しさの証拠ではなく、次の説明、図解、シナリオ、FAQ、研修への修正信号として扱う。',
    teamPractice: '反応分類から、次に直す文言、戻り先、図解、研修場面、保留理由を決める。',
    publicVoice: '「伝わらなかった点を、次の説明で直します」',
    antiPattern: '反応数、共感、批判を、source/support validityや知識昇格の根拠にする。',
    branchIds: ['QR-01', 'QR-02', 'QR-08'],
    agentIds: ['A2', 'A5', 'A6', 'A12'],
    icon: Workflow,
  },
  {
    id: 'PT-06',
    label: '境界を守って開く',
    stance:
      '開かれた人格は、何でも受ける人格ではない。個別相談、病状、法務、雇用判断、配慮判断を受けないからこそ、安心して社会と対話できる。',
    socialBehavior:
      'DM相談、個別ケース、診断名別助言へ滑る前に、一般的な見方、公式確認、相談先、返信停止条件へ戻す。',
    teamPractice: '安全・プライバシー席が、対話の入口と扱わない内容を常に見える場所に置く。',
    publicVoice: '「ここでは個別判断は行わず、仕事の見方と確認すべき条件を整理します」',
    antiPattern: '親しみやすさを理由に、個別情報、DM相談、支援判断、営業導線を受けてしまう。',
    branchIds: ['QR-04', 'QR-06', 'QR-08'],
    agentIds: ['A4', 'A6', 'A11'],
    icon: ShieldCheck,
  },
];

export const socialInterfaceConversationMoves: SocialInterfaceConversationMove[] = [
  {
    id: 'CM-01',
    label: '初めて関心を持った人へ',
    whenUsed: 'SNSやトップページで、仕事設計という見方に初めて触れた読者がいる。',
    sayThis:
      '困りごとは、人の中だけで起きているのではありません。作業、時間、情報、支援、評価の接点で形を変えます。',
    askThis: 'いま一番動かしにくいのは、作業、時間、情報、支援、評価のどこですか。',
    listenFor: '分かりにくい語、刺さった場面、診断名lookupへの短絡、研修需要。',
    returnTo: 'NS-02 Work Design Map / SQ-01 Manual SNS Queue',
    doNotDo: '個別事情を聞き出さない。診断名から配慮を答えない。AI相談へ誘導しない。',
    branchIds: ['QR-01', 'QR-03', 'QR-08'],
    icon: Megaphone,
  },
  {
    id: 'CM-02',
    label: '現場支援者の詰まりへ',
    whenUsed: '支援者が、本人には寄り添っているが企業や職場へ説明しきれないと感じている。',
    sayThis: '本人の事情を、職場で確認できる仕事条件へ翻訳するところに、支援の難しさがあります。',
    askThis: '本人に背負わせずに、職場側と一緒に確認できる条件は何でしょうか。',
    listenFor: '企業に伝わる言い換え、支援者負荷、ケース会議で使える問い。',
    returnTo: 'NS-02 Work Design Map / NS-04 Work-Design Studio',
    doNotDo: '支援者の力量不足に見せない。企業を責める言葉にしない。配慮正誤にしない。',
    branchIds: ['QR-02', 'QR-06', 'QR-07'],
    icon: Handshake,
  },
  {
    id: 'CM-03',
    label: '企業側の制約へ',
    whenUsed: '企業、人事、管理職が、制度対応の先で現場運用に困っている。',
    sayThis:
      '企業側の制約も、仕事設計の重要な情報です。責任を押し付ける前に、作業、時間、情報、評価へ分けて見ます。',
    askThis: 'どの条件なら短期間で試し、観察し、見直せますか。',
    listenFor: '管理職負荷、評価の不安、法務判定化、組織診断への誤読。',
    returnTo: 'NS-04 Work-Design Studio / PE-06 Partnership Pipeline',
    doNotDo: '法的安全、合理的配慮妥当性、採用配置、社員評価を判断しない。',
    branchIds: ['QR-03', 'QR-06', 'QR-07'],
    icon: Building2,
  },
  {
    id: 'CM-04',
    label: '誤解・反発へ',
    whenUsed: '投稿やページが、きれいごと、企業寄り、支援者批判、AI判定、病気軽視として読まれる。',
    sayThis:
      'その受け止めは大事な修正信号です。Falconが見たいのは、誰か一方の責任ではなく、条件がどこで閉じるかです。',
    askThis: 'どの言葉が、責任の押し付けや個別判断のように見えましたか。',
    listenFor: '傷つく語、欠けた主体、説明不足、境界表示不足。',
    returnTo: 'copy revision / visual revision / targeting gate',
    doNotDo: '議論に勝とうとしない。反応を根拠にしない。個別事情へ踏み込まない。',
    branchIds: ['QR-01', 'QR-06', 'QR-08'],
    icon: Ear,
  },
  {
    id: 'CM-05',
    label: '協力・連携関心へ',
    whenUsed: '研修、共同研究、政策対話、財団・企業連携への関心が生まれた。',
    sayThis: '最初は大きな導入ではなく、小さな読める成果物から一緒に作れます。',
    askThis: '45分研修、人工シナリオ、仕事条件レンズ記事、図解連載のどれが最初の接点になりますか。',
    listenFor: '研修需要、共同研究テーマ、source確認需要、営業や成果保証への誤読。',
    returnTo: 'NS-06 Partnership / Training / PT-01-PT-05',
    doNotDo: '公開オファー、価格、契約条件、成果保証、正式需要の断定にしない。',
    branchIds: ['QR-04', 'QR-05', 'QR-07', 'QR-08'],
    icon: Handshake,
  },
];

export const socialInterfaceGrowthLoopSteps: SocialInterfaceGrowthLoopStep[] = [
  {
    id: 'GL-01',
    label: '外へ出す',
    input: 'サイト候補、SNS投稿、図解、人工シナリオ、研修骨子。',
    teamResponse: '編集・安全・専門・実装の席で、外界へ出してよい最小の表現に整える。',
    artifactChange: '読めるページ、投稿キュー、研修案、連携ノート。',
    boundary: 'public approval、SNS投稿、runtime接続、個別相談受付は動かさない。',
    icon: Megaphone,
  },
  {
    id: 'GL-02',
    label: '聞く',
    input: '質問、違和感、誤解、共感、反発、協力打診、沈黙。',
    teamResponse:
      '反応を勝ち負けや人気ではなく、追加説明需要、誤読、実装課題、赤旗、連携候補に分ける。',
    artifactChange: '反応分類、返信停止メモ、次に直す箇所。',
    boundary: '反応をsource/support validity、代表事例、candidate_patternの根拠にしない。',
    icon: Ear,
  },
  {
    id: 'GL-03',
    label: '翻訳し直す',
    input: '伝わらなかった言葉、抜けた主体、過剰に専門的な説明。',
    teamResponse: 'Falcon語を、読者の現場語、企業語、研修語、政策語へ変換する。',
    artifactChange: 'hero copy、図解ラベル、人工シナリオ、FAQ候補。',
    boundary: '分かりやすさのために、病名lookup、配慮判定、制度断定へ単純化しない。',
    icon: Workflow,
  },
  {
    id: 'GL-04',
    label: '次版へ戻す',
    input: '分類済みの社会信号と修正案。',
    teamResponse: 'サイト、SNS、研修、政策翻訳、連携設計、Falcon Labのどこを直すか決める。',
    artifactChange: '次版ページ、投稿、研修、source-readiness question、保留理由。',
    boundary: '反応ログだけを溜めず、成果物の更新へ戻す。',
    icon: Route,
  },
  {
    id: 'GL-05',
    label: '学習を汚さない',
    input: '個別経験、個人情報らしき投稿、DM、未検証の政策claim。',
    teamResponse: '使わないもの、要確認のもの、一般的な説明に戻すものを分ける。',
    artifactChange: 'do-not-use note、source verification need、boundary repair。',
    boundary: 'PII、センシティブ原文、個別相談、現行政策断定を知識化しない。',
    icon: ShieldCheck,
  },
];

export const socialInterfacePersonalityGates: SocialInterfacePersonalityGate[] = [
  {
    id: 'PG-01',
    label: '自分の関心だけを話していないか',
    check:
      '方法論、知識ネットワーク、内部レビュー、AIチームの説明が、読者の現場課題より前に出ていないか。',
    stopIf: '読者が「これは誰の何を助けるのか」を想像できない。',
    nextIfPass: '相手の詰まりから入り、必要になった場所で専門性を見せる。',
    icon: SearchCheck,
  },
  {
    id: 'PG-02',
    label: '専門語で閉じていないか',
    check:
      'ICF、SCIMA/FCHMA、source lens、public-safeなどの語が、読者の理解を助ける橋になっているか。',
    stopIf: '専門語が説明責任を読者へ押し付けている。',
    nextIfPass: '現場語で言い換え、専門語は裏側の品質保証として使う。',
    icon: FileSearch,
  },
  {
    id: 'PG-03',
    label: '開くことが受け付けることに変わっていないか',
    check: '外界接触が、DM相談、個別ケース、診断名別助言、企業診断、営業受付へ滑っていないか。',
    stopIf: '個別情報の入力、相談受付、法務・雇用・医療判断を期待させる。',
    nextIfPass: '一般的な見方、人工シナリオ、研修案、公式確認、返信停止条件へ戻す。',
    icon: ShieldCheck,
  },
  {
    id: 'PG-04',
    label: '反応を根拠化していないか',
    check:
      '社会反応を、Falcon知識の妥当性や代表例ではなく、説明改善と接触面改善の信号として扱っているか。',
    stopIf:
      '共感数、批判、体験談、協力打診がsource/support validityやpublic approvalの材料にされる。',
    nextIfPass: '反応は問い、誤解、欠落文脈、改善候補としてだけ扱う。',
    icon: Database,
  },
];

export const nextSiteCandidateBundleIntro = {
  eyebrow: 'SB-01 Static Next NBL Candidate Bundle',
  title: '5つのプロダクトで、働きづらさを解決に向かう道具へ変える',
  body: '読者別入口、障害種類から見る横断入口、場面から入る導入、仕事条件で読む相談事例集、理論と発見、21視点ガイド、仕事条件レンズ、認知補助ツールキットを、静的ページとして読める順番に束ねた候補です。障害種類から見る入口は第6プロダクトではなく、10分類の具体的な職場・社会設計の問いから5つの入口へ移るための横断入口です。',
  operatingRule:
    'フォーム、自由記述入力、AI回答、保存、SNS API、現在政策断定を入れず、読者が近いプロダクトから入れるページとして完成させる。',
};

export const nextSiteCandidatePages: NextSiteCandidatePage[] = [
  {
    id: 'NS-01',
    label: '概要',
    slugCandidate: '/next',
    audience: '障害者就労支援・企業支援の実務者 / 企業担当者 / 研修・研究政策の実装者',
    pagePromise:
      '障害者雇用・難病就労支援で蓄積されてきた知恵を、読者別入口、場面、相談事例集、理論、21視点、仕事条件レンズ、教材へ変換して見せる。',
    eyebrow: '障害者雇用・難病就労支援から',
    headline: '働きづらさを、仕事条件から考える。',
    lead: '障害者雇用、難病・慢性疾患の就労支援で積み上がった知恵を、場面から入る導入、相談事例集、理論、21視点、仕事条件レンズ、教材へ束ねます。診断名・障害の種類で止めず、仕事の条件として話せる形にします。',
    primaryActionLabel: '近い入口を選ぶ',
    secondaryActionLabel: '理論を読む',
    sections: [
      {
        label: '最初に刺す相手',
        body: '本人にも企業にも向き合っているのに、支援が制度説明や配慮名で止まり、仕事の条件まで動かせない実務者から入る。',
        bullets: [
          '障害者就労支援・企業支援の担当者。',
          '職場調整や研修を担う企業人事・管理職。',
          '研修、研究、政策、社会実装に広げたい実装者。',
        ],
      },
      {
        label: 'よくある詰まり',
        body: '病名、配慮名、制度説明、本人の努力、企業の負担がばらばらに語られ、同じ仕事設計図に乗らない。',
        bullets: [
          '本人の状況を職場条件へ翻訳しにくい。',
          '企業側の制約を支援の失敗としてだけ見てしまう。',
          '評価、役割、生活保障、開示境界が後回しになる。',
        ],
      },
      {
        label: 'このサイトで見られるもの',
        body: '正解配慮ではなく、健康時間、仕事接触点、情報手順、開示境界、支援再翻訳、評価を並べ、次に確認する問いへ変える。',
        bullets: [
          '仕事設計マップで7つの接点を見る。',
          '人工シナリオで企業・支援者の読みを並べる。',
          '研修、SNS、政策翻訳、共同実装へ広げる。',
        ],
      },
    ],
    staticAssets: ['targeted hero copy', 'contact-point diagram', 'three-entry cards'],
    noApiReason: '初見理解だけで成立するため、API、フォーム、保存、AI応答は不要。',
    sourceStatus: 'Falcon Stage 1-3 synthesis as internal candidate; public-use review pending.',
    boundary: 'public copy / public IA approvalは未実施。公開候補としてのみ扱う。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
    productExperimentIds: ['PE-01', 'PE-02', 'PE-06'],
    agentIds: ['A1', 'A3', 'A6', 'A12'],
    icon: Sparkles,
  },
  {
    id: 'NS-02',
    label: '仕事条件で読む相談事例集',
    slugCandidate: '/next/work-design-map',
    audience: '支援者 / 企業支援担当 / 企業担当者 / 管理職',
    pagePromise:
      '支援者と企業が、断片的な相談を本人属性ではなく、仕事条件の相互作用として読む典型相談事例を提供する。',
    eyebrow: 'プロダクト 01',
    headline: '相談の一言から見立てを組み立てる',
    lead: 'よくある相談を、答え集ではなく、複数の読み筋、まだ分からないこと、情報が増えると見えること、合意前の確認候補までたどる見立てのプロセスとして読めるようにします。',
    primaryActionLabel: '近い構造を読む',
    secondaryActionLabel: '理論を読む',
    sections: [
      {
        label: '7つの接触点',
        body: '健康時間、情報、作業手順、場所と道具、支援、開示境界、評価と参加品質を一枚の地図にする。',
        bullets: [
          '同じ配慮名でも、効く接触点は現場ごとに違う。',
          '本人の説明力だけに負荷を戻さない。',
          '職場側の実装負荷も、設計条件として扱う。',
        ],
      },
      {
        label: '問いの型',
        body: '何が必要かを決める前に、どの接点で条件が閉じているかを問う。',
        bullets: [
          '時間量なのか、時間帯なのか、回復時間なのか。',
          '作業能力なのか、手順や情報の残り方なのか。',
          '評価の問題なのか、価値への翻訳の問題なのか。',
        ],
      },
    ],
    staticAssets: ['7 contact point map', 'question cards', 'not lookup warning strip'],
    noApiReason: '地図と問いは静的表示で成立し、回答生成を必要としない。',
    sourceStatus: 'Stage 1 Core principal patterns / PE-01 candidate surface.',
    boundary: '合理的配慮の妥当性判断、個別助言、職場責任認定に使わない。',
    branchIds: ['QR-01', 'QR-02', 'QR-03', 'QR-06', 'QR-08'],
    productExperimentIds: ['PE-01', 'PE-04'],
    agentIds: ['A1', 'A3', 'A6', 'A8', 'A9'],
    icon: Map,
  },
  {
    id: 'NS-03',
    label: '未来設計21視点ガイド',
    slugCandidate: '/next/work-design-tools',
    audience: '支援者 / 企業研修担当 / 学習者',
    pagePromise:
      '21の主成分的パターンを、通して読める仕事設計ガイドブックと、必要時に引ける道具箱として読めるようにする。',
    eyebrow: 'プロダクト 03',
    headline: '21視点で未来の仕事を設計する',
    lead: '障害者雇用や難病就労支援で蓄積されてきた知見を、人間の多様性を前提にした企業経営、雇用管理、専門支援、制度設計へ展開します。通して読めば未来の設計地図に、必要な場面で開けば取り組みガイドになります。',
    primaryActionLabel: '未来地図を見る',
    secondaryActionLabel: '相談事例集へ',
    sections: [
      {
        label: '健康時間と生活の自由度',
        body: '治療、疲労、回復、生活保障を、働く・休む・待つ・戻る自由度として見る。',
        bullets: ['体調変動', '通院と勤務量', '生活保障', '復帰と見直し'],
      },
      {
        label: '入口・翻訳・支援の力',
        body: '応募以前、説明、開示、支援接続、訓練、情報保障を、参加へ近づく翻訳として見る。',
        bullets: ['入口以前の準備', '説明の翻訳', '開示境界', '支援の接続'],
      },
      {
        label: '職場・参加・価値',
        body: '作業、道具、役割、評価、処遇、キャリアを、働けている先の参加品質として見る。',
        bullets: ['仕事接触点', '評価', '役割', '技能形成', '価値への翻訳'],
      },
    ],
    staticAssets: ['3-chapter guide map', '21-view reference table', 'primer excerpt cards'],
    noApiReason: '入門書導線は静的コンテンツとして配布できる。',
    sourceStatus: 'L3 principal pattern extraction / work-design primer candidate.',
    boundary: '21視点を公式基準、配慮判定表、診断名別マニュアルとして表示しない。',
    branchIds: ['QR-01', 'QR-04', 'QR-05', 'QR-07', 'QR-08'],
    productExperimentIds: ['PE-01', 'PE-03'],
    agentIds: ['A1', 'A3', 'A6', 'A12'],
    icon: ClipboardList,
  },
  {
    id: 'NS-04',
    label: '場面から入る',
    slugCandidate: '/next/work-design-studio',
    audience: '企業担当者 / 支援者 / 企業支援・研修担当者',
    pagePromise: '実在ケースを扱わず、架空の職場場面で仕事設計の読み方を試せるようにする。',
    eyebrow: '入口ストーリー',
    headline: '場面から入る',
    lead: 'タテ割り支援で見えにくくなった状況を、直感的なストーリーとして見える化します。場面カードは独立した答えではなく、相談事例集、理論、教材へ進むための導入です。',
    primaryActionLabel: '場面を読む',
    secondaryActionLabel: '相談事例集へ',
    sections: [
      {
        label: '4つの場面',
        body: '月末締切、作業手順、動線と道具、開示と評価など、実在情報を使わない場面で構造を読む。',
        bullets: [
          '企業側の読みと支援者側の読みを並べる。',
          '設計変更案を、法的判断ではなく確認条件として置く。',
          '赤旗が出たら個別判断へ進まない。',
        ],
      },
      {
        label: '研修への転用',
        body: '45分程度のミニ研修や共同試作へ展開できるが、個別企業の正解判定にはしない。',
        bullets: ['導入10分', '場面読解20分', '設計条件の整理10分', '境界確認5分'],
      },
    ],
    staticAssets: [
      'Image-2.0 storyboard',
      'employer/practitioner read columns',
      'green-yellow-red strip',
    ],
    noApiReason: '人工シナリオは静的教材として成立し、実在入力を必要としない。',
    sourceStatus: 'PE-04 artificial scenario candidate; no real employer review assumed.',
    boundary: '実在ケース、法的安全保証、採用・配置・配慮妥当性判断に使わない。',
    branchIds: ['QR-02', 'QR-03', 'QR-06', 'QR-07'],
    productExperimentIds: ['PE-04', 'PE-06'],
    agentIds: ['A1', 'A6', 'A8', 'A9', 'A11'],
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
    lead: 'SNSやニュースで出る短い疑問を、賛否や相談回答で終わらせず、職場で観察できる条件と次に話す問いへひらくページです。',
    primaryActionLabel: '記事を読む',
    secondaryActionLabel: '21視点ガイドも読む',
    sections: [
      {
        label: '記事集の使い方',
        body: '短い投稿で生まれた違和感を、記事、図解、読後に話す問い、次に読むページへつなぐ。',
        bullets: [
          '短い投稿を、結論や相談回答にしない。',
          '個別の病状、所属先、相談内容を書かなくても参加できる問いにする。',
          '仕事条件、相談事例集、21視点、教材へ読みをつなげる。',
        ],
      },
      {
        label: '記事と読後に話す問い',
        body: '読者が「分かった」で終わらず、自分の現場では何を見るかを話せるようにする。',
        bullets: ['記事', '止まりやすい読み', '仕事条件の問い', '続けて読む場所'],
      },
    ],
    staticAssets: [
      'SNS landing strip',
      'question note body',
      'conversation prompts',
      'next-reading cards',
    ],
    noApiReason: '資料メタデータと翻訳カードは静的メモとして管理できる。',
    sourceStatus:
      'PE-05 internal translation desk; live verification required before public policy claims.',
    boundary: '現行制度・法令解釈・公式見解・政策評価を断定しない。',
    branchIds: ['QR-04', 'QR-07', 'QR-08'],
    productExperimentIds: ['PE-05', 'PE-06'],
    agentIds: ['A1', 'A2', 'A6', 'A10'],
    icon: FileSearch,
  },
  {
    id: 'NS-06',
    label: '認知補助ツールキット',
    slugCandidate: '/next/partnership',
    audience: '研修担当 / 財団・支援機関 / 企業支援者 / 共同研究候補',
    pagePromise:
      'NBLの専門性を、販売や相談受付ではなく、共同研究、研修、実証、編集、政策対話の入口へ変換する。',
    eyebrow: 'プロダクト 05',
    headline: '認知補助ツールキット',
    lead: '文章だけでは共有しにくい働きづらさを、図解、場面、ワークシート、音の入口、読み下しへ分け、会議や研修で使えるパッケージとして届けます。',
    primaryActionLabel: 'ツールを見る',
    secondaryActionLabel: '場面から入る',
    sections: [
      {
        label: '最初の共同成果物',
        body: 'いきなり契約や販売ではなく、読める1枚、45分研修骨子、仕事条件レンズ記事、図解連載などから始める。',
        bullets: [
          '仕事設計ミニ研修の共同試作',
          '研究・政策向け仕事条件レンズ記事',
          '難病・慢性疾患の健康時間ワークショップ',
          'SNS・編集共同連載の実験',
        ],
      },
      {
        label: '提供しないこと',
        body: '成果保証、法務判断、個別ケース対応、制度対象判断、患者・団体の顧客化はしない。',
        bullets: [
          '販売オファーではなく共同実装候補。',
          '外部関心は合意や需要として断定しない。',
          '実在情報は別の承認された扱いが必要。',
        ],
      },
    ],
    staticAssets: ['partnership theme cards', 'not-provided matrix', 'training concept note'],
    noApiReason: '共同テーマの初期提示は静的ページと手動連絡で成立する。',
    sourceStatus: 'PE-06 internal partnership pipeline; not public offer copy.',
    boundary: '価格、契約条件、成果保証、実在依頼の断定をしない。',
    branchIds: ['QR-05', 'QR-07', 'QR-08'],
    productExperimentIds: ['PE-06'],
    agentIds: ['A1', 'A6', 'A10', 'A11', 'A12'],
    icon: Handshake,
  },
  {
    id: 'NS-07',
    label: '理論と発見',
    slugCandidate: '/next/work-assessment-concept',
    audience: 'サイト全体の根拠を知りたい読者 / 支援者 / 企業担当者 / 研修担当',
    pagePromise:
      '古くて新しい課題の本質を、人間の過重な認知負荷と相互作用の問題として示し、専門知識ネットワークからプロダクト群が生まれる理由を整理する。',
    eyebrow: 'なぜ可能か',
    headline: '見えなかった関係を、仕事条件の知識ネットワークへ。',
    lead: '既存の障害者雇用や難病就労支援の情報を、ICF準拠の相互作用フレームとAIの文脈読解で整理し、相談事例集、21視点、記事、場面、図解ツールへ展開する考え方を示します。',
    primaryActionLabel: '理論を読む',
    secondaryActionLabel: 'プロダクト群を見る',
    sections: [
      {
        label: '古くて新しい問題',
        body: '困難は本人の中だけにも、職場の中だけにもない。複数条件の相互作用として読む必要がある。',
        bullets: [
          '本人、仕事、環境、支援、時間、制度、評価が絡む。',
          '病名別配慮表や一般論では、現場で次に確認する条件まで届きにくい。',
          '専門家でも全部を同時に保持するには認知負荷が高い。',
        ],
      },
      {
        label: '相談事例集との関係',
        body: '考え方を先に勉強させるのではなく、相談事例集を使いながら必要に応じて戻れる背景ページとして置く。',
        bullets: [
          '相談事例集は実用面。',
          'このページは考え方と確認シート。',
          '個別判断はこのページでは行わない。',
        ],
      },
    ],
    staticAssets: ['assessment concept panels', '7 contact point worksheet', 'question table'],
    noApiReason: '考え方と確認シートは静的に読める背景ページとして成立する。',
    sourceStatus:
      'consultation case collection product concept companion; public-use review pending.',
    boundary: '個別対応の正解、法的・医療・人事判断、配慮妥当性を決めない。',
    branchIds: ['QR-01', 'QR-02', 'QR-03', 'QR-06', 'QR-08'],
    productExperimentIds: ['PE-01', 'PE-04'],
    agentIds: ['A1', 'A3', 'A6', 'A8'],
    icon: Network,
  },
  {
    id: 'NS-08',
    label: 'このサイトについて',
    slugCandidate: '/next/about',
    audience: '初めて読む人 / 支援者 / 企業担当者 / 研修・政策・研究に関わる人',
    pagePromise:
      'NBLとは何か、創設者は誰か、どこへ連絡できるか、どこから先を扱わないかが分かる基本情報ページとして説明する。',
    eyebrow: 'Next Being Lab',
    headline: 'NBLについて',
    lead: 'このページでは、NBLの基本情報、創設者、連絡先、情報の扱い方、個別判断をしない境界を確認できます。',
    primaryActionLabel: 'お問い合わせ',
    secondaryActionLabel: '全体入口へ',
    sections: [
      {
        label: 'NBLとは',
        body: 'Next Being Lab（NBL）は、インクルーシブ就労支援の実践知識を開発・提供する知識プラットフォームであり、就労支援を起点に仕事設計と社会設計へ取り組みを広げる。創設者情報は、読者が運営背景を確認するために簡潔に示す。',
        bullets: [
          '起点はインクルーシブ就労支援。',
          '広げる先は仕事設計と社会設計。',
          '創設者は春名由一郎。NBLは創設者個人への属人的な個別相談窓口ではない。',
        ],
      },
      {
        label: 'どう運営しているか',
        body: '調査研究報告、マニュアル、合理的配慮事例集、雇用事例集、海外の情報提供サイト、制度などの公開情報を、情報の身元、偏り、確認範囲を分けながら扱う。',
        bullets: [
          '公開情報を材料にする。',
          '病名、障害種類、制度語をそのまま結論にしない。',
          'AIは整理、下書き、複数の読み筋、図解や教材への変換を支える補助として使う。',
        ],
      },
      {
        label: '連絡先と境界',
        body: 'NBLの活動、記事、教材、研修、共同検討についての連絡先を示しつつ、個別相談、医学・法務・雇用判断、合理的配慮妥当性判断には接続しない境界を明示する。',
        bullets: [
          'お問い合わせフォームと info@nextbeinglab.org を示す。',
          '個別相談や緊急相談の受付ではないことを示す。',
          '病名・障害名から支援策へ直行しないことを示す。',
        ],
      },
    ],
    staticAssets: [
      'about basic information surface',
      'operator contact block',
      'operation boundary cards',
    ],
    noApiReason:
      'NBLの基本情報、連絡先、情報の扱い、判断境界の説明は静的ページで成立し、入力フォームやAI応答を必要としない。',
    sourceStatus: 'site orientation surface; public-use review pending.',
    boundary:
      'サイトの使い方ガイド、個別相談、緊急相談、医学・法務・雇用判断、合理的配慮妥当性、実際のAI応答、自動判定、根拠の妥当性認定を扱わない。',
    branchIds: ['QR-01', 'QR-05', 'QR-07', 'QR-08'],
    productExperimentIds: ['PE-01', 'PE-05', 'PE-06'],
    agentIds: ['A1', 'A6', 'A10', 'A12'],
    icon: UsersRound,
  },
  {
    id: 'NS-09',
    label: '障害種類から見る',
    slugCandidate: '/next/work-condition-window',
    audience: '障害種類・疾病名から考え始めた読者 / 支援者 / 企業担当者 / 研修担当',
    pagePromise:
      '障害種類・疾病名から探し始める読者を受け止め、特性理解を仕事条件の発見へ広げて5つの既存入口へ接続する。',
    eyebrow: '障害種類・疾病名から見る仕事条件',
    headline: '障害種類・疾病名から、職場条件へ。',
    lead: '発達障害、精神障害、難病、内部障害などの名前から調べ始めた時に、特性理解だけで止めず、時間、情報、環境、動線、評価、支援のどこを確認すればよいかへ進みます。',
    primaryActionLabel: '10分類を見る',
    secondaryActionLabel: '相談事例集へ',
    sections: [
      {
        label: '障害種類・疾病名から探せる',
        body: '読者が診断名、障害種類、疾病名から考え始めることを実務上の入口として受け取り、本人、仕事、環境、支援、時間、制度の関係へ視界を広げる。',
        bullets: [
          '名前を探しに来た読者が、そのまま職場条件へ進める。',
          'よくある特性理解に、仕事条件の見方を足す。',
          '同じ名前でも、仕事、環境、支援、時間、制度で対応の組み方は変わる。',
        ],
      },
      {
        label: '10分類を具体的な設計入口にする',
        body: '分類ごとに困難や支援策を決めるのではなく、視覚障害、聴覚障害、肢体不自由、内部障害、知的障害、精神障害、発達障害、高次脳機能障害、難病、ニューロダイバーシティを、それぞれ最初に見えやすい見方、起きやすい構造、変え方の方向、職場で起きやすい場面、支援ネットワークで進める確認として読めるようにする。',
        bullets: [
          '情報アクセス、情報伝達、動線、健康時間、仕事の見える化、回復、仕事仕様、外部記憶、処理特性を分けて見る。',
          '本人だけの課題ではなく、仕事情報、会議、道具、役割、評価、社会の標準設計として読む。',
          '足りない確認を、個別判断ではなく次に職場で話す問いへ変える。',
        ],
      },
      {
        label: '他の入口も読みたくなる',
        body: 'この入口で見方が広がった読者を、相談事例、21視点、記事、場面、教材へ自然に送る。ただし障害種類カードごとに汎用2リンクを置かず、10分類を読んだ後のページ全体の導線として、相談、研修、場面共有、社会の問い、教材化の読み方を示す。障害者支援だけでなく、一般の働き方設計にも使える視界へつなぐ。',
        bullets: [
          '短い相談なら相談事例集へ。',
          '学習や研修なら21視点やツールキットへ。',
          '社会や一般の働き方の問いなら記事集へ。',
          'プロダクト遷移は、個別分類からの汎用ジャンプではなく、読者の次の目的で選ぶ。',
        ],
      },
    ],
    staticAssets: [
      '10 deep disability-category work-design cards',
      'large in-page infographic maps generated from current Falcon Lab card content',
      'difficulty formula / solution formula / workplace snags / implementation moves / support loop / shared agreements per category',
      'site-level next-reading route cards',
      'bounded not-lookup boundary strip',
    ],
    noApiReason: '障害種類・疾病名の入力や検索を受けず、静的な発見型入口として成立させる。',
    sourceStatus:
      'Heron disability work-design series reviewed as reuse candidate; Falcon public-use review pending.',
    boundary:
      '病名・障害名から支援策、就労可否、医学判断、法的判断、合理的配慮妥当性を直接導かない。',
    branchIds: ['QR-01', 'QR-02', 'QR-03', 'QR-06', 'QR-08'],
    productExperimentIds: ['PE-01', 'PE-03', 'PE-04', 'PE-05'],
    agentIds: ['A1', 'A3', 'A6', 'A8', 'A12'],
    icon: SearchCheck,
  },
];

export const staticBuildChecklist: StaticBuildChecklistItem[] = [
  {
    id: 'SBC-01',
    label: 'APIなしで読める',
    mustHave: 'ページ本文、図解説明、カード、戻り先が静的に表示される。',
    avoid: 'フォーム、自由記述、AI回答、SNS API、自動保存。',
    output: 'static page bundle / build-time content.',
    icon: Database,
  },
  {
    id: 'SBC-02',
    label: '承認状態を混ぜない',
    mustHave: 'internal candidate、public-use review pending、live verification holdを表示する。',
    avoid: '公開承認済み、公式見解、レビュー済み専門知識のような表示。',
    output: 'status strip and boundary note.',
    icon: ShieldCheck,
  },
  {
    id: 'SBC-03',
    label: 'SNSへ戻せる',
    mustHave: '各ページから、SNS連載テーマと反応分類へ戻せる文脈を持つ。',
    avoid: 'SNSを相談受付や議論勝利の場にする。',
    output: 'return destination labels.',
    icon: Megaphone,
  },
  {
    id: 'SBC-04',
    label: '次版へ直せる',
    mustHave: '社会反応から直す単位が、文言、図、カード、研修、連携ノートとして分かれている。',
    avoid: '反応ログだけを溜めて更新しない。',
    output: 'revision unit list.',
    icon: Workflow,
  },
];

export const snsManualQueueIntro = {
  eyebrow: 'SQ-01 Manual SNS Operation Queue',
  title: 'NBL名義SNSとFounder個人発信を分け、手動投稿キューとして作る',
  body: 'SNSは自動投稿ではなく、見方の転換を社会に配り、反応を次期サイトとFalcon Labへ戻す運用系です。NBL名義アカウント未作成のため、公式運用候補とFounder個人増幅を明確に分けます。',
  operatingRule:
    '投稿候補はinternal-ready止まり。NBL名義アカウント作成、public copy review、アカウント運用判断、人間投稿を経るまで公開しない。',
};

export const snsAccountIdentityDecisionIntro = {
  eyebrow: 'AID-01 SNS Account Identity Decision Pack',
  title: '既存@NextBeingLabを、NBLの社会接点アカウントとして使う前提へ切り替える',
  body: 'Founderが作成済みだった@NextBeingLabを、新規作成候補ではなく既存アカウントとして扱います。名前とプロフィールは、相談受付ではなく、仕事条件の問いを社会に配るための入口として設計します。',
  operatingRule:
    'このdecision packは既存アカウント利用前のFounder確認用です。Codexはログイン、外部確認、プロフィール変更、実投稿、返信、DM運用を行わない。',
};

export const snsAccountIdentityDecisions: SnsAccountIdentityDecision[] = [
  {
    id: 'AID-2026-06-03-01',
    title: '既存@NextBeingLabを「NBL｜仕事条件デザイン」の表示名で使う',
    status: 'existing account founder-supplied / Founder review needed / no posting',
    recommendedXDisplayName: 'NBL｜仕事条件デザイン',
    recommendedXHandle: '@NextBeingLab',
    handleAlternatives: ['@NBL_workdesign', '@WorkDesignNBL', '@NBL_falcon'],
    handleAvailabilityNote:
      'Founder supplied that @NextBeingLab already exists. Codex has not logged in, checked X, or independently verified the account. 新規作成候補は、既存アカウントを使わない判断になった場合のfallbackとしてだけ残す。',
    xBioDraft:
      '仕事の困りごとを、人だけの問題にせず、仕事・環境・支援・時間・制度の接点から考えるNext Being Lab / NBLの実験入口。障害・難病就労支援の知見を、仕事条件の問いへ。DM相談不可。',
    xPinnedPostDraft:
      'NBLは、病名別の配慮表ではなく、仕事を人間の多様性に合わせて設計しなおすための地図を作っています。ここでは、仕事の困りごとを「人だけの問題」にせず、仕事・環境・支援・時間・制度の接点として読む問いを発信します。個別相談はSNS/DMでは扱いません。',
    avatarDecision:
      '白地または淡い背景に、NBLの文字と7つの小さな接点ノードを置く。医療・福祉・診断の印象より、仕事条件を整理する知的で落ち着いた印象を優先する。',
    avatarAvoid: [
      '医療十字や診断アイコンに見える形',
      '困っている人物シルエット',
      '制度・行政ロゴに見える紋章',
      'Falconだけを前面に出す猛禽類モチーフ',
      '相談受付や認証済み専門機関に見える表現',
    ],
    officialXRole:
      'NBL名義Xは、短い問い、記事・図解・教材への導線、Founder確認済みの実験hookを出す場。公式相談窓口、個別助言、政策評価、制度速報にはしない。',
    founderPersonalPolicy:
      'Founder個人アカウントは、NBL公式候補投稿の補足、開発背景、なぜこの問いが重要かの短い私見に限定する。NBL公式発表、相談受付、個別返信、反応数の受け皿にしない。',
    facebookPolicy:
      'FacebookはXの短文をそのまま流す場所ではなく、週1以下の長めの文脈共有、関係者向けの説明、記事・図解への導線に使う。コメント欄は議論歓迎ではなく、個別相談・制度相談・診断別助言を扱わない境界を明記する。',
    instagramPolicy:
      'Instagramは初期30日は保留し、図解カルーセルの制作テンプレートが安定してから使う。使う場合も1枚目の問い、2-4枚目の図解、最後の戻り先に限定し、DM相談を受けない。',
    firstThirtyDaysRule:
      '最初の30日は、X公式候補を主軸に週2本まで。Founder個人は公式候補投稿の補足だけ。Facebookは必要時の長文説明だけ。Instagramは原則保留。',
    replyAndDmPolicy:
      '返信は感謝、戻り先案内、境界説明まで。個別相談、診断名、職場名、法務・医療・雇用判断、DM誘導には進まない。DMは相談受付に使わない。',
    beforeCreateChecklist: [
      '@NextBeingLabの所有・ログイン・2FA・回復手段をFounder側で確認',
      'display nameをNBL｜仕事条件デザインにするか確認',
      'bio draftのpublic copy risk review',
      'pinned post draftのpublic copy risk review',
      'avatar最終画像のcampaign boundary review',
      '返信停止条件の確認',
      'Founder個人アカウントの増幅ルール確認',
      'F3P-2026-06-03-01から最初の手動投稿候補を選ぶ',
    ],
    boundaryNote:
      'このpackは既存account identity候補であり、public approval、ログイン、プロフィール変更、投稿実行、SNS API接続、DM運用、現行制度・統計・政策主張、専門知識の根拠化を承認しない。',
    exportJsonPath:
      'references/social/falcon-sns-account-identity-decision-pack-v0-2026-06-03.json',
    exportMarkdownPath:
      'references/social/falcon-sns-account-identity-decision-pack-v0-2026-06-03.md',
    branchIds: ['QR-05', 'QR-06', 'QR-08'],
    agentIds: ['A5', 'A6', 'A10', 'A12'],
    icon: BadgeCheck,
  },
];

export const founderAccountCreationReviewIntro = {
  eyebrow: 'FAC-01 Existing Account Transition Review Packet',
  title: '既存@NextBeingLabを使う前に、Founderが見る項目だけへ圧縮する',
  body: '表示名、既存handle、プロフィール、固定ポスト、アイコン案、最初の3投稿、返信/DM停止ルールを1枚にまとめます。Codexはログインや変更操作を行わず、Founderは利用/保留/修正のどれかを選びます。',
  operatingRule:
    'このpacketはFounder確認用であり、ログイン、プロフィール変更、投稿、返信、DM運用、public approval、SNS API接続を含まない。',
};

export const founderAccountCreationReviewPackets: FounderAccountCreationReviewPacket[] = [
  {
    id: 'FAC-2026-06-03-01',
    title: '@NextBeingLab 既存アカウント利用前確認',
    status: 'Founder review packet / existing account founder-supplied / no posting',
    sourceIdentityDecisionId: 'AID-2026-06-03-01',
    finalDisplayName: 'NBL｜仕事条件デザイン',
    handleFallbackOrder: ['@NextBeingLab'],
    handleCheckInstruction:
      'Founder supplied that @NextBeingLab already exists. Codex has not logged in, checked X, or changed the profile. 所有、ログイン、2FA、回復手段、表示名変更可否はFounder側で確認する。',
    bioFinalCandidate:
      '仕事の困りごとを、人だけの問題にせず、仕事・環境・支援・時間・制度の接点から考えるNext Being Lab / NBLの実験入口。障害・難病就労支援の知見を、仕事条件の問いへ。DM相談不可。',
    pinnedPostFinalCandidate:
      'NBLは、病名別の配慮表ではなく、仕事を人間の多様性に合わせて設計しなおすための地図を作っています。ここでは、仕事の困りごとを「人だけの問題」にせず、仕事・環境・支援・時間・制度の接点として読む問いを発信します。個別相談はSNS/DMでは扱いません。',
    avatarPreviewPath: '/images/nbl-sns-account-icon-concept-v0.svg',
    avatarReviewNote:
      'SVGは初期アイコン候補。公開前に、相談受付・医療判断・行政公式・認証済み専門機関に見えないかcampaign boundary reviewを通す。',
    firstPostCandidates: [
      {
        queueItemId: 'SQ-01',
        experimentBufferId: 'SEB-2026-06-03-01',
        theme: '困りごとは、人の中だけで起きていない',
        whyFirst:
          'NBL名義の最初の投稿として、病名別配慮表ではなく仕事条件を見る立場を最も安全に示せる。',
        holdIf: '「本人の問題ではない」が企業批判や責任回避に読まれる表現になった場合。',
      },
      {
        queueItemId: 'SQ-02',
        experimentBufferId: 'SEB-2026-06-03-01',
        theme: '体調変動は、仕事の時間設計で読む',
        whyFirst:
          '健康時間を仕事条件へ戻すNBLらしい具体例で、記事・図解・教材への導線が作りやすい。',
        holdIf: '医学判断、休職復職判断、合理的配慮の妥当性判断に見える場合。',
      },
      {
        queueItemId: 'SQ-06',
        experimentBufferId: 'SEB-2026-06-03-01',
        theme: '働けている、の先に参加の質がある',
        whyFirst:
          '制度や雇用率の話題を、役割、評価、成長、見直しの問いへ戻すための社会接点になる。',
        holdIf: '現行統計、政策評価、企業評価の断定へ引っ張られる場合。',
      },
    ],
    founderVisibleSummary:
      'Founderは、既存handle、表示名、bio、固定ポスト、アイコン候補、最初の3投稿候補、返信/DM停止ルールだけを見る。',
    founderPersonalSplit:
      'Founder個人Xは、公式候補投稿の補足と開発背景だけ。NBL公式発表、個別相談、反応数の受け皿にしない。',
    facebookSplit:
      'Facebookは初期30日は必要時の長文文脈共有のみ。X短文転載、コメント相談、制度相談、診断別助言には使わない。',
    replyStopRule:
      '返信は感謝、戻り先案内、境界説明まで。診断名、病状、職場名、法務・医療・雇用判断、個別配慮質問には具体助言で返さない。',
    dmBoundary: 'DMは相談受付に使わない。プロフィールと固定ポストにDM相談不可を明記する。',
    publicCopyRiskReview:
      'bio、固定ポスト、最初の3投稿はusable_with_revision止まり。公開承認、法務・医療・雇用判断、制度・統計断定を含まないことを確認する。',
    finalDecisionOptions: [
      'use_existing_nextbeinglab_profile',
      'hold_and_revise_profile',
      'hold_until_avatar_review',
    ],
    boundaryChecks: [
      'existing_account_founder_supplied_not_verified_by_codex',
      'no_account_login_or_profile_change_by_codex',
      'no_handle_availability_claim',
      'no_public_approval',
      'no_auto_posting',
      'no_auto_reply',
      'no_DM_consultation',
      'no_personal_data_collection',
      'no_reaction_as_evidence',
      'no_current_policy_or_statistics_claim_without_live_verification',
    ],
    exportJsonPath:
      'references/social/falcon-founder-account-creation-review-packet-v0-2026-06-03.json',
    exportMarkdownPath:
      'references/social/falcon-founder-account-creation-review-packet-v0-2026-06-03.md',
    branchIds: ['QR-05', 'QR-06', 'QR-08'],
    agentIds: ['A5', 'A6', 'A10', 'A12'],
    icon: ClipboardCheck,
  },
];

export const existingAccountActivationReviewIntro = {
  eyebrow: 'EAA-01 Existing Account Activation Review Packet',
  title: '@NextBeingLabを、投稿前のプロフィール確認パックへ移す',
  body: '既存アカウントがある状態では、次の判断は新規作成ではなく、プロフィール、固定ポスト、アイコン、初回投稿ゲートをどう設定するかです。Codexは操作せず、Founder確認用の変更案だけをまとめます。',
  operatingRule:
    'このpacketは既存アカウント利用前の内部確認用です。ログイン、プロフィール変更、投稿、返信、DM運用、public approval、SNS API接続を含まない。',
};

export const existingAccountActivationReviewPackets: ExistingAccountActivationReviewPacket[] = [
  {
    id: 'EAA-2026-06-03-01',
    title: '@NextBeingLab プロフィール利用前確認',
    status: 'existing account founder-supplied / profile activation review / no posting',
    existingHandle: '@NextBeingLab',
    handleSourceNote:
      'Founder reported that @NextBeingLab had already been created. Codex has not logged in, checked the public account, changed settings, or verified platform state.',
    recommendedDisplayName: 'NBL｜仕事条件デザイン',
    profileBioCandidate:
      '仕事の困りごとを、人だけの問題にせず、仕事・環境・支援・時間・制度の接点から考えるNext Being Lab / NBLの実験入口。障害・難病就労支援の知見を、仕事条件の問いへ。DM相談不可。',
    pinnedPostCandidate:
      'Next Being Lab / NBLは、病名別の配慮表ではなく、仕事を人間の多様性に合わせて設計しなおすための地図を作っています。ここでは、仕事の困りごとを「人だけの問題」にせず、仕事・環境・支援・時間・制度の接点として読む問いを発信します。個別相談はSNS/DMでは扱いません。',
    avatarCandidatePath: '/images/nbl-sns-account-icon-concept-v0.svg',
    accountRole:
      '@NextBeingLabは、短い問い、記事・図解・教材への導線、Founder確認済みの実験hookを出す場。公式相談窓口、個別助言、政策評価、制度速報にはしない。',
    founderActionChecklist: [
      '@NextBeingLabの所有、ログイン、2FA、回復手段をFounder側で確認する',
      'display nameをNBL｜仕事条件デザインにするか決める',
      'bioをDM相談不可の境界つきで設定するか決める',
      '固定ポストを設定するか、初回投稿後まで保留するか決める',
      'SVGアイコン候補を使うか、別画像を作るか決める',
      'F3P-2026-06-03-01から最初に出す投稿を1本だけ選ぶ',
      '返信停止条件をプロフィールまたは固定ポストに明記する',
    ],
    firstPostPacketId: 'F3P-2026-06-03-01',
    firstPostGate:
      '初回投稿はF3P-2026-06-03-01から1本だけ手動で選ぶ。3本連続投稿、予約投稿、自動投稿はしない。',
    replyAndDmStop:
      '返信は感謝、戻り先案内、境界説明まで。DMは相談受付に使わず、診断名、病状、職場名、法務・医療・雇用判断、個別配慮質問には具体助言で返さない。',
    profileRiskReview:
      'profile bio、固定ポスト、アイコンはusable_with_revision / review止まり。公開承認、法務・医療・雇用判断、制度・統計断定、個別相談受付に見えないかFounderが確認する。',
    finalDecisionOptions: [
      'activate_profile_only_no_posts',
      'activate_profile_then_manual_sq01',
      'hold_and_revise_profile',
      'hold_until_avatar_review',
    ],
    boundaryChecks: [
      'existing_account_founder_supplied_not_verified_by_codex',
      'no_account_login_or_profile_change_by_codex',
      'no_posting_in_this_packet',
      'no_auto_posting',
      'no_auto_reply',
      'no_DM_consultation',
      'no_personal_data_collection',
      'no_reaction_metrics_for_founder',
      'no_reaction_as_evidence',
      'no_current_policy_or_statistics_claim_without_live_verification',
      'no_public_approval',
      'no_SNS_API_connection',
    ],
    exportJsonPath:
      'references/social/falcon-existing-account-activation-review-packet-v0-2026-06-03.json',
    exportMarkdownPath:
      'references/social/falcon-existing-account-activation-review-packet-v0-2026-06-03.md',
    branchIds: ['QR-05', 'QR-06', 'QR-08'],
    agentIds: ['A5', 'A6', 'A10', 'A12'],
    icon: UserRoundCheck,
  },
];

export const firstThreePostsFounderReviewIntro = {
  eyebrow: 'F3P-01 First 3 Posts Founder Review Packet',
  title: '初回3投稿を、反応ではなく学習実験として確認する',
  body: '@NextBeingLabのプロフィール確認後に最初に出せる3投稿を、Founderが投稿/保留/修正で判断できるようにします。見るのは反応数ではなく、どの問いが記事・図解・教材・相談事例・21視点へ戻るかです。',
  operatingRule:
    'このpacketは投稿前レビュー用です。アカウント未作成、投稿未実行、返信未実行、DM未使用、public approval未実施のまま、draft、戻り先、誤読時改稿、保留条件だけを固定する。',
};

export const firstThreePostsFounderReviewPackets: FirstThreePostsFounderReviewPacket[] = [
  {
    id: 'F3P-2026-06-03-01',
    title: 'SQ-01 / SQ-02 / SQ-06 初回投稿Founder確認',
    status: 'Founder review packet / no posting / no reaction metrics',
    sourceAccountCreationPacketId: 'FAC-2026-06-03-01',
    purpose:
      'FounderがSNS反応を気にしすぎず、3つの短い問いを継続学習の実験単位として選べるようにする。',
    founderShield:
      'Founderは反応数や個別コメントではなく、投稿前の問い、戻り先、誤読停止条件だけを見る。投稿後レビューも24時間/72時間の限定メモにする。',
    operatingRule:
      '投稿は人間が手動で行う。Codex automationは、社会信号スカウト、route判断、draft pack生成、Founder確認用整理までに限定する。',
    accountDependency:
      '@NextBeingLabのプロフィール利用確認がFounder側で完了するまで、どのdraftも公開しない。',
    noReactionMetricRule:
      'いいね、リポスト、インプレッション、フォロワー増加は成功/失敗の指標にしない。誤読、追加質問、戻り先不足、説明の詰まりだけを改稿材料にする。',
    reviewRhythm:
      '投稿した場合のみ、24時間後と72時間後にFounder確認用の短いlearning noteを作る。生コメント、DM、個人情報は取り込まない。',
    items: [
      {
        queueItemId: 'SQ-01',
        sourceExperimentBufferId: 'SEB-2026-06-03-01',
        theme: '困りごとは、人の中だけで起きていない',
        draftPost:
          '困りごとは、人の中だけで起きているわけではありません。仕事の量、時間、情報、評価、支援の置き方が変わると、同じ人の働きやすさも変わります。NBLでは、困りごとを仕事条件の問いとして読み直していきます。',
        targetReader: '初めてNBLを見る読者 / 支援者 / 企業担当者',
        founderDecisionQuestion:
          'NBLの最初の姿勢として、本人責任論にも企業批判にも寄りすぎず、仕事条件の問いとして読めるか。',
        publishWindow: '@NextBeingLab profile checked + Founder manual posting only',
        targetProductReturn: [
          '記事集: 働き方の問いをひらく記事集',
          '図解: 仕事条件マップ',
          '相談事例集: 相談文を仕事条件へ分解する入口',
        ],
        observeForLearning: [
          '読者が「仕事条件」という語を理解できるか',
          '本人と職場のどちらか一方の責任論へ偏らないか',
          '次に見たい図解や事例の不足が見えるか',
        ],
        doNotMeasure: ['いいね数', 'リポスト数', 'インプレッション', '賛否の勝敗'],
        misunderstandingSignals: [
          '本人の問題ではないので会社だけが悪い、という読み',
          '仕事条件を整えれば必ず解決する、という読み',
          '個別の配慮判断をSNSで求める返信',
        ],
        revisionIfMisread:
          '「本人、仕事、環境、支援、時間の関係を見る」という補助図解を先に出す順序へ改稿する。',
        holdBoundary:
          '本人責任の否定だけ、または企業批判だけに読まれる場合は保留して、短文より図解入口を先に作る。',
        publicCopyRiskStatus: 'usable_with_revision / internal only / not public-approved',
        campaignBoundaryStatus: 'review / awareness hook only / not advice',
        decisionOptions: ['post_manually', 'revise_hook', 'hold_until_map_visual'],
      },
      {
        queueItemId: 'SQ-02',
        sourceExperimentBufferId: 'SEB-2026-06-03-01',
        theme: '体調変動は、仕事の時間設計で読む',
        draftPost:
          '体調変動は、自己管理だけの話ではありません。勤務量、休憩、通院、回復、評価のタイミングがずれると、仕事の続け方も揺れます。まず一週間の時間設計として見てみる。そこから確認できる条件があります。',
        targetReader: '支援者 / 企業担当者 / 研修参加者 / 産業保健に近い読者',
        founderDecisionQuestion:
          '医療判断や休復職判断に見えず、健康時間を仕事条件として考える導入になっているか。',
        publishWindow: '@NextBeingLab profile checked + Founder manual posting only',
        targetProductReturn: [
          '記事集: 治療、回復、勤務量を同じ一週間として読む',
          '図解: 一週間の健康時間マップ',
          '教材: 勤務量・休憩・通院・回復・評価ワークシート',
          '21視点: 健康時間',
        ],
        observeForLearning: [
          '読者が時間軸図解を必要としているか',
          'セルフケア論だけに戻っていないか',
          '支援者/企業向け教材への入口が見えるか',
        ],
        doNotMeasure: [
          '同情的反応の多さ',
          '病名や症状の個別コメント',
          '制度相談の件数',
          '拡散速度',
        ],
        misunderstandingSignals: [
          '治療・休職・復職の正解を示しているように読まれる',
          '会社が必ず勤務時間を変えるべき、という断定へ進む',
          '個人の病状説明を求める返信が増える',
        ],
        revisionIfMisread:
          'draft本文に「個別判断ではなく、職場で確認する条件を分ける問いです」を足すか、先にワークシートへの導線を出す。',
        holdBoundary:
          '医学判断、休復職判断、合理的配慮妥当性判断に見える場合は投稿せず、記事/図解側を先に整える。',
        publicCopyRiskStatus: 'usable_with_revision / internal only / not public-approved',
        campaignBoundaryStatus: 'review / work-time awareness hook only / not advice',
        decisionOptions: ['post_manually', 'revise_with_caveat', 'hold_until_time_map'],
      },
      {
        queueItemId: 'SQ-06',
        sourceExperimentBufferId: 'SEB-2026-06-03-01',
        theme: '働けている、の先に参加の質がある',
        draftPost:
          '「働けている」で話を止めると、役割、評価、成長、見直しの機会が見えなくなることがあります。雇用の有無だけでなく、参加の質をどう設計するか。NBLはそこを仕事条件の問いとして考えます。',
        targetReader: '政策・研究・支援・企業の接点にいる読者',
        founderDecisionQuestion:
          '現行統計や政策評価の断定に見えず、参加の質を仕事条件の問いとして開けているか。',
        publishWindow: '@NextBeingLab profile checked + Founder manual posting only',
        targetProductReturn: [
          '記事集: 雇用の数から参加の質へ',
          '21視点: 役割・評価・成長・見直し',
          '政策/研究 translation desk',
          '相談事例集: 働けているが成長や役割が見えないケース入口',
        ],
        observeForLearning: [
          '読者が雇用率ではなく役割/評価/成長の問いへ移れるか',
          '政策批判や企業評価へ短絡しないか',
          '21視点への導線が自然に見えるか',
        ],
        doNotMeasure: ['政策論争の盛り上がり', '特定企業や制度への賛否', '統計の引用数', '拡散数'],
        misunderstandingSignals: [
          '現行制度や雇用率を評価しているように読まれる',
          '企業の障害者雇用全体を批判しているように読まれる',
          '具体的な人事評価の正解をSNSで求められる',
        ],
        revisionIfMisread:
          '「これは制度評価ではなく、職場で次に見る条件の問いです」を明記し、21視点カードへの戻り先を先に置く。',
        holdBoundary:
          '現行統計、制度評価、企業評価の断定に引っ張られる場合は保留し、出典確認が必要な記事とは分離する。',
        publicCopyRiskStatus: 'usable_with_revision / internal only / not public-approved',
        campaignBoundaryStatus: 'review / social question hook only / not policy claim',
        decisionOptions: ['post_manually', 'revise_to_21_views', 'hold_until_source_triage'],
      },
    ],
    packetDecisionOptions: [
      'approve_all_three_for_manual_sequence',
      'approve_only_sq01_and_sq02',
      'revise_before_any_post',
      'hold_until_nextbeinglab_profile_checked',
    ],
    boundaryChecks: [
      'existing_account_founder_supplied_not_verified_by_codex',
      'no_account_login_or_profile_change_by_codex',
      'no_posting_in_this_packet',
      'no_auto_posting',
      'no_auto_reply',
      'no_DM_consultation',
      'no_personal_data_collection',
      'no_reaction_metrics_for_founder',
      'no_reaction_as_evidence',
      'no_current_policy_or_statistics_claim_without_live_verification',
      'no_public_approval',
    ],
    exportJsonPath:
      'references/social/falcon-first-3-posts-founder-review-packet-v0-2026-06-03.json',
    exportMarkdownPath:
      'references/social/falcon-first-3-posts-founder-review-packet-v0-2026-06-03.md',
    branchIds: ['QR-05', 'QR-06', 'QR-08'],
    agentIds: ['A5', 'A6', 'A10', 'A12'],
    icon: ClipboardList,
  },
];

export const postAftercareLearningNoteIntro = {
  eyebrow: 'PAL-01 Post-Aftercare Learning Note Template',
  title: '手動投稿後に、反応数ではなく改稿材料だけを回収する',
  body: '@NextBeingLabでFounderが手動投稿した場合だけ、24時間後と72時間後に短い学習メモを作ります。見るのは誤読、追加質問、戻り先不足、改稿タスク、保留フラグだけです。',
  operatingRule:
    'このtemplateは投稿後の内部メモ用です。反応数、個別コメント原文、DM、個人情報、制度・統計の根拠化、自動投稿、自動返信、SNS API接続を含まない。',
};

export const postAftercareLearningNoteTemplates: PostAftercareLearningNoteTemplate[] = [
  {
    id: 'PAL-2026-06-03-01',
    title: '@NextBeingLab 手動投稿後 learning note',
    status: 'aftercare template / manual post only / no metrics / no automation',
    sourceFirstPostPacketId: 'F3P-2026-06-03-01',
    accountHandle: '@NextBeingLab',
    trigger: 'FounderがF3P-2026-06-03-01から1本を選び、@NextBeingLabで手動投稿した場合のみ使う。',
    reviewWindows: ['24h_after_manual_post', '72h_after_manual_post'],
    founderShield:
      'Founderはいいね、リポスト、インプレッション、フォロワー増加、生コメント一覧を見ない。AI側は抽象化された誤読/質問/戻り先不足だけをFounder確認用に圧縮する。',
    postingAutomationStatus:
      'not_prepared_intentionally_off: このrepoにはX API連携、OAuth、認証情報保存、予約投稿、投稿実行、投稿後取得、削除/取消処理はない。',
    futureAutomationGate:
      '将来検討する場合は human_confirmed_post_handoff として別ゲート化する。必要条件はFounder明示承認、X/API仕様確認、認証情報管理、投稿前プレビュー、送信直前確認、監査ログ、取消手順、失敗時停止、public copy/source boundary review。',
    allowedInputs: [
      'manual_post_unit_id',
      'manual_post_time_window_label',
      'abstract_misunderstanding_pattern',
      'additional_question_type',
      'return_route_gap',
      'revision_task_candidate',
      'hold_or_escalation_flag',
    ],
    forbiddenInputs: [
      'like_count',
      'repost_count',
      'impression_count',
      'follower_count_delta',
      'raw_comment_text',
      'DM_content',
      'diagnosis_or_symptom_details',
      'workplace_or_personal_identifiers',
      'legal_medical_employment_advice_request',
      'platform_access_tokens',
    ],
    fields: [
      {
        id: 'PAL-F01',
        label: 'posted unit',
        capture: 'F3P内のどのunitを手動投稿したか。例: SQ-01 / SQ-02 / SQ-06。',
        doNotCapture: '投稿URL、アカウント操作ログ、反応数、投稿実行証跡を必須にしない。',
        returnTo: 'F3P-2026-06-03-01',
      },
      {
        id: 'PAL-F02',
        label: 'misunderstanding pattern',
        capture:
          '誤読があった場合、本人責任論、企業批判、医療判断化、制度評価化、個別助言要求などの型だけを書く。',
        doNotCapture: '個別コメント原文、個人名、職場名、病状、診断名、第三者情報を残さない。',
        returnTo: 'public copy revision / campaign boundary note',
      },
      {
        id: 'PAL-F03',
        label: 'additional question type',
        capture:
          '読者がさらに求めているものを、図解、事例、用語説明、職場で話す問い、制度出典確認のどれかへ分類する。',
        doNotCapture:
          '個別相談、DM相談、法務・医療・雇用判断、合理的配慮妥当性判断として扱わない。',
        returnTo: 'article / infographic / toolkit / case collection / 21 views',
      },
      {
        id: 'PAL-F04',
        label: 'return-route gap',
        capture:
          '投稿から戻すべき記事、図解、教材、相談事例、21視点が足りないか、導線名だけを書く。',
        doNotCapture: 'SNS反応を根拠に新しい専門知識やcandidate_patternを作らない。',
        returnTo: 'Next NBL product route backlog',
      },
      {
        id: 'PAL-F05',
        label: 'revision task candidate',
        capture: '改稿対象、変更一文、優先度、境界理由を短く書く。',
        doNotCapture: '公開承認済み、根拠あり、効果あり、制度的に正しい、のような判断を書かない。',
        returnTo: 'revision task / Founder review',
      },
      {
        id: 'PAL-F06',
        label: 'hold or escalation flag',
        capture:
          'source/current-policy、法務、医療、雇用判断、個人情報、炎上・誤読拡大のどれで止めるかだけを書く。',
        doNotCapture: 'その場で返信方針、個別助言、政策評価、謝罪文、公的見解を生成しない。',
        returnTo: 'hold note / official-source-triage / public-copy-risk-review',
      },
    ],
    decisionOptions: [
      'continue_same_theme_with_revision',
      'revise_return_route_before_next_post',
      'hold_theme_until_boundary_review',
      'route_to_article_or_toolkit_instead_of_sns',
    ],
    boundaryChecks: [
      'manual_post_only',
      'no_auto_posting_prepared',
      'no_auto_reply',
      'no_SNS_API_connection',
      'no_platform_access_tokens',
      'no_reaction_metrics_for_founder',
      'no_raw_comment_storage',
      'no_DM_consultation',
      'no_personal_data_collection',
      'no_reaction_as_evidence',
      'no_current_policy_or_statistics_claim_without_live_verification',
      'no_public_approval',
    ],
    exportJsonPath:
      'references/social/falcon-post-aftercare-learning-note-template-v0-2026-06-03.json',
    exportMarkdownPath:
      'references/social/falcon-post-aftercare-learning-note-template-v0-2026-06-03.md',
    branchIds: ['QR-05', 'QR-06', 'QR-08'],
    agentIds: ['A5', 'A6', 'A10', 'A12'],
    icon: ClipboardList,
  },
];

export const nextBeingLabManualLaunchKitIntro = {
  eyebrow: 'MLK-01 Manual Launch Kit',
  title: '@NextBeingLabを1本だけ手動投稿まで進める',
  body: '設計文書ではなく、Founderがそのまま使える運用キットです。プロフィール確認、コピー用本文、手動投稿、24h/72h aftercare、次アクションまでを1枚に束ねます。',
  operatingRule:
    'このkitは手動実行専用です。Codexはログイン、プロフィール変更、投稿、返信、DM、API接続、反応数確認、個別コメント保存を行わない。',
};

export const nextBeingLabManualLaunchKits: NextBeingLabManualLaunchKit[] = [
  {
    id: 'MLK-2026-06-03-01',
    title: '@NextBeingLab first manual post kit',
    status: 'copy-ready / manual_founder_handoff_only / not auto-posting',
    accountHandle: '@NextBeingLab',
    launchMode: 'manual_founder_handoff_only',
    sourceExistingAccountPacketId: 'EAA-2026-06-03-01',
    sourceFirstPostPacketId: 'F3P-2026-06-03-01',
    sourceAftercarePacketId: 'PAL-2026-06-03-01',
    preflightSteps: [
      {
        id: 'MLK-PF-01',
        label: 'profile ownership',
        action: '@NextBeingLabの所有、ログイン、2FA、回復手段をFounder側で確認する。',
        doneSignal: 'profile_checked_by_founder',
        stopIf: '所有者、ログイン、回復手段が曖昧な場合は投稿しない。',
      },
      {
        id: 'MLK-PF-02',
        label: 'profile boundary',
        action: '表示名、bio、DM相談不可、固定ポスト候補が相談窓口や専門判断に見えないか確認する。',
        doneSignal: 'profile_boundary_checked',
        stopIf: 'DM相談、個別助言、法務・医療・雇用判断に見える場合は投稿しない。',
      },
      {
        id: 'MLK-PF-03',
        label: 'one post only',
        action:
          '初回はSQ-01だけを手動投稿する。SQ-02/SQ-06、Facebook、Instagram、Founder補足は同日連投しない。',
        doneSignal: 'first_manual_post_limited_to_sq01',
        stopIf: '反応を取りにいく連投、予約投稿、自動投稿にしたくなった場合は止める。',
      },
    ],
    copyBlocks: [
      {
        id: 'MLK-COPY-01',
        label: 'profile display name',
        surface: 'X profile',
        pasteTarget: 'display name',
        copy: 'NBL｜仕事条件デザイン',
        founderCheck: 'NBLが相談窓口や認証済み専門機関に見えず、仕事条件の問いを出す場に見えるか。',
      },
      {
        id: 'MLK-COPY-02',
        label: 'profile bio',
        surface: 'X profile',
        pasteTarget: 'bio',
        copy: '仕事の困りごとを、人だけの問題にせず、仕事・環境・支援・時間・制度の接点から考えるNext Being Lab / NBLの実験入口。障害・難病就労支援の知見を、仕事条件の問いへ。DM相談不可。',
        founderCheck: '個別相談受付、診断別助言、制度判断、雇用判断に見えないか。',
      },
      {
        id: 'MLK-COPY-03',
        label: 'manual post: SQ-01',
        surface: 'X post',
        pasteTarget: '@NextBeingLab new post',
        copy: '困りごとは、人の中だけで起きているわけではありません。仕事の量、時間、情報、評価、支援の置き方が変わると、同じ人の働きやすさも変わります。NBLでは、困りごとを仕事条件の問いとして読み直していきます。',
        founderCheck: '本人責任論の否定だけ、企業批判だけ、個別配慮の正解提示に読まれないか。',
      },
      {
        id: 'MLK-COPY-04',
        label: 'optional founder amplifier hold',
        surface: 'Founder personal X',
        pasteTarget: 'do not post on day 1',
        copy: '今日は投稿しない。@NextBeingLabの初回投稿後、72h aftercareで戻り先が見えてから、開発背景だけを個人アカウントで補足する。',
        founderCheck: 'Founder個人アカウントを反応数の受け皿にしない。',
      },
    ],
    aftercareWindows: [
      {
        windowLabel: '24h_after_manual_post',
        founderDoesNotOpen: 'いいね、リポスト、インプレッション、フォロワー増加、生コメント一覧。',
        aiReadsOnly: '抽象化できる誤読型、追加質問型、戻り先不足、境界リスク。',
        notePrompt:
          'SQ-01は、仕事条件の問いとして読まれたか。足りない戻り先は、図解、記事、事例、21視点のどれか。',
        nextAction: '誤読がなければ同テーマを図解化。誤読があればSQ-01本文か固定ポストを改稿。',
      },
      {
        windowLabel: '72h_after_manual_post',
        founderDoesNotOpen: '反応数の推移、拡散比較、個別コメント原文、DM。',
        aiReadsOnly: '次の1本を出すより先に必要な記事/図解/教材/相談事例/21視点の欠け。',
        notePrompt:
          '次にSNSへ出すべきか、記事・図解・教材へ戻すべきか。SNSで続ける場合もSQ-02かSQ-06のどちらか1本だけ。',
        nextAction:
          'continue_same_theme_with_revision / revise_return_route_before_next_post / hold_theme_until_boundary_reviewから1つ選ぶ。',
      },
    ],
    completionCriteria: [
      'profile_checked_by_founder',
      'profile_boundary_checked',
      'one_manual_post_selected',
      'SQ-01_manual_post_completed_by_founder',
      '24h_aftercare_note_created_without_metrics',
      '72h_aftercare_route_decision_created',
    ],
    notDone: [
      'posting_not_done_by_codex',
      'profile_change_not_done_by_codex',
      'founder_personal_amplifier_not_used_on_day_1',
      'facebook_instagram_not_started',
      'reaction_metrics_not_collected',
      'raw_comments_not_stored',
      'DM_not_used',
    ],
    boundaryChecks: [
      'manual_founder_handoff_only',
      'no_auto_posting_in_launch_kit',
      'no_auto_reply',
      'no_SNS_API_connection',
      'no_platform_access_tokens',
      'no_DM_consultation',
      'no_personal_data_collection',
      'no_reaction_metrics_for_founder',
      'no_reaction_as_evidence',
      'no_public_approval',
    ],
    exportJsonPath: 'references/social/falcon-nextbeinglab-manual-launch-kit-v0-2026-06-03.json',
    exportMarkdownPath: 'references/social/falcon-nextbeinglab-manual-launch-kit-v0-2026-06-03.md',
    copyTextPath: 'references/social/falcon-nextbeinglab-manual-launch-copy-v0-2026-06-03.txt',
    branchIds: ['QR-05', 'QR-06', 'QR-08'],
    agentIds: ['A5', 'A6', 'A10', 'A12'],
    icon: ClipboardCheck,
  },
];

export const snsNativeOperatingIntro = {
  eyebrow: 'SNS-OS-01 AI Native Social Networking System',
  title: '投稿作業ではなく、関係が育つ運用OSにする',
  body: 'Founderひとりが毎回ネタを考え、投稿し、弱い反応に耐え、次の発信へ戻す運用は続かない。AI側が、テーマ発掘、投稿束、返信候補、会話相手候補、再利用先、改善仮説まで持ち、人間は公開判断と最後の人格だけを担う。',
  operatingRule:
    '自動投稿や自動返信ではなく、AIが毎週の社会接点を準備し、手動で出し、反応を次のサイト・教材・相談事例・連携テーマへ戻す。',
};

export const socialSignalScoutPackIntro = {
  eyebrow: 'SSP-01 Social Signal Scout Pack',
  title: '投稿を始点にせず、社会信号を知識プロダクトへ戻す',
  body: '毎日のニュース、SNS、研究、制度、研修現場の違和感を、投稿本文ではなくFounder確認用パックとして整理します。確認するのは、どこへ戻す問いか、何を検証せずに止めるか、次に直す記事・図解・教材は何かです。',
  operatingRule:
    'Codex automationを使う場合も、signal scout、route decision、draft pack generationまで。投稿、返信、DM相談、個人情報収集、反応の根拠化、public approvalには接続しない。',
};

export const socialSignalScoutPacks: SocialSignalScoutPack[] = [
  {
    id: 'SSP-2026-06-03-01',
    title: '疲れやすい、で止めない: 健康時間を仕事条件へ戻す',
    status: 'internal scout sample / Founder review needed / no posting',
    purpose: '公開信号を、相談事例集、記事、図解、教材、21視点へ戻す最小ループの1テーマ検証。',
    founderQuestion:
      'このテーマを今日扱うなら、既存記事へ戻すだけで足りるか、図解・教材の追加に進めるか。',
    noGo: [
      '自動投稿しない',
      '自動返信しない',
      'DM相談を読まない',
      '病状、診断名、職場状況を収集しない',
      '反応数を専門知識の根拠にしない',
      '制度、統計、法令の現在断定をしない',
    ],
    socialSignalRecord: {
      signalId: 'SSR-fatigue-health-time-2026-06-03',
      observedAt: '2026-06-03',
      signalType: 'evergreen / sns / field_training',
      shortDescription:
        '体調変動や疲れやすさが、本人の自己管理や根性の話として閉じやすい。仕事量、休憩、通院、回復、評価の設計条件へ戻す必要がある。',
      sourceUrlOrNote:
        '既存Falconプレビュー、手動SNSキューSQ-02、教材パッケージ「疲れやすい、で止めない」からの内部検証サンプル。外部の個別投稿やDMは使わない。',
      currentClaimRisk:
        '低から中。制度・統計の現在断定は含めない。治療と仕事や合理的配慮に接続する場合は別途live verificationが必要。',
      personalDataRisk: '低。個人の病状、診断名、職場名、個別相談文を扱わない。',
      scoutNote:
        '社会の問いとしては扱えるが、病名別助言、休職・復職判断、配慮妥当性判断へ進めない。',
    },
    contentRouteDecision: {
      route: 'existing_article + infographic + toolkit + case_collection + 21_views',
      returnDestination:
        '記事「治療、回復、勤務量を同じ一週間として読む」 / 相談事例集 health-time / 21視点 健康時間 / 認知補助ツールキット',
      reason:
        '既存面に戻れるテーマだが、短文だけでは「本人の疲労」へ戻りやすい。時間軸図解とワークシートで、仕事条件として見える形にする必要がある。',
      missingContext:
        '対象読者を支援者、企業、人事、産業保健、当事者団体のどこに置くか。外部ニュースへ接続する場合は出典、日付、管轄。',
      liveVerificationNeeded:
        '制度、統計、合理的配慮義務、治療と仕事の現行施策名を出す場合のみ必要。今回の確認パックでは出さない。',
    },
    socialPostPackCandidate: {
      targetReader: '支援者 / 企業担当者 / 研修参加者',
      shortHook:
        '体調変動は、本人の不安定さだけではありません。勤務量、休憩、通院、回復、戻り方をどう設計するかという、仕事の時間設計の情報でもあります。',
      returnDestination: 'まず記事と図解へ戻し、個別返信ではなく「確認する問い」へ誘導する。',
      visualBrief:
        '一週間の時間軸に、仕事量、通院、休憩、回復、評価を重ねる。人物の苦悩表現ではなく、条件の重なりを見せる。',
      doNotReplyAsAdviceNote:
        '「私の場合どうすればよいか」「この病名では働けるか」「会社は何をすべきか」にはSNS上で具体助言しない。',
      humanReviewNeeded:
        'hookが医療・雇用・法務判断に読まれないか、Founderが投稿可否と人格を確認する。',
    },
    reactionReadingNote: {
      reactionWindow: '投稿した場合のみ、24時間後と72時間後の2回に限定して読む。',
      misunderstandingSignal:
        '「本人が休めばよい」「会社が全部合わせるべき」「病名ごとの正解がある」と読まれたら誤読メモにする。',
      silenceOrLowReactionReading:
        '低反応は失敗ではなく、hook、図解、読者、戻り先のズレとして読む。',
      additionalQuestion:
        '読者は「何を記録すると職場で話せるか」を知りたいのか、「制度説明」が必要なのかを分ける。',
      collaborationSignal:
        '研修、図解、ワークシート化、産業保健・支援者向け教材への関心があれば連携候補として残す。',
      notEvidenceNote:
        '反応、共感、引用、沈黙はsource/support validity、candidate_pattern、代表事例の根拠にしない。',
    },
    revisionTasks: [
      {
        targetSurface: '記事集 / treatment-work-time',
        changeNeeded:
          '導入に「体調変動を仕事の時間設計として読む」1段落と、読後に話す問いを追加する。',
        priority: 'high',
        boundaryReason: '記事が制度論やセルフケア論だけに読まれると、仕事条件への翻訳が弱くなる。',
        ownerRole: 'Article Editor',
      },
      {
        targetSurface: '認知補助ツールキット',
        changeNeeded:
          '一週間の時間軸図解と、勤務量・休憩・通院・回復・評価を分けるワークシートを追加候補にする。',
        priority: 'high',
        boundaryReason: '短文SNSだけでは個別助言に見えやすく、図解と問いで判断を止める必要がある。',
        ownerRole: 'Cognitive Designer / Teaching Material Designer',
      },
      {
        targetSurface: '相談事例集 / health-time',
        changeNeeded:
          '「疲れやすいので配慮が必要です」から、午後の問い合わせ、休憩後ろ倒し、評価条件へ開く読み筋を目立たせる。',
        priority: 'medium',
        boundaryReason:
          'ケース風の例が個別支援判断に見えないよう、確認問いと人工シナリオ境界を強める。',
        ownerRole: 'Falcon Core Specialist / Public Boundary Reviewer',
      },
      {
        targetSurface: '21視点ガイド / 健康時間',
        changeNeeded: '健康時間、回復時間、生活の余白の参照導線を記事から戻せるようにする。',
        priority: 'medium',
        boundaryReason: '21視点を完成済み基準ではなく、次に見る観測点として扱う。',
        ownerRole: 'Product Navigation Editor',
      },
    ],
    teamPasses: [
      {
        role: 'Falcon Core Specialist',
        decision:
          '本人の疲労特性だけでなく、勤務量、休憩、回復、問い合わせ、評価の接点として読む。',
        stopCondition: '疾病別の就労可否や医学判断へ進んだら止める。',
      },
      {
        role: 'SNS Relationship Operator',
        decision: 'hookは短くしてよいが、戻り先と返信停止条件を同じパックに置く。',
        stopCondition: '反応取りや投稿頻度が目的になったら止める。',
      },
      {
        role: 'Article Editor',
        decision: '既存記事へ戻せるが、図解・教材の追加タスクを同時に切る。',
        stopCondition: '一般啓発コラムだけで終わり、相談事例や21視点へ戻らない場合は保留。',
      },
      {
        role: 'UX / IA',
        decision: '公開ページには内部管理語を出さず、内部画面でFounder確認パックとして読む。',
        stopCondition: '公開面が投稿管理表や反応台帳に見えたら戻す。',
      },
      {
        role: 'Boundary Reviewer',
        decision: 'awareness asset / thinking aidに限定し、助言・判定・制度断定・根拠化を避ける。',
        stopCondition: 'public approval、current-policy claim、個別相談受付に見えたらhard stop。',
      },
    ],
    automationBoundary:
      'Codex automation candidate is allowed only as scheduled scout / route sorter / Founder review pack generator. It must not save as approved content, post, reply, read DMs, collect personal data, or treat reactions as evidence.',
    exportJsonPath: 'references/social/falcon-social-signal-scout-pack-v0-2026-06-03.json',
    exportMarkdownPath: 'references/social/falcon-social-signal-scout-pack-v0-2026-06-03.md',
    branchIds: ['QR-01', 'QR-04', 'QR-05', 'QR-08'],
    agentIds: ['A1', 'A5', 'A6', 'A8', 'A10', 'A12'],
    icon: SearchCheck,
  },
];

export const falconCuriosityLoopIntro = {
  eyebrow: 'FCL-01 Falcon Curiosity Growth Loop',
  title: 'Falconが外界に好奇心を持ち、社会接点から育つ仕組み',
  body: 'Falconの成長は、外部情報をそのまま採用することではありません。公開情報、SNS上の問い、研究・制度・現場の違和感を見て、なぜ気になるのか、既存の知識ネットワークのどこを揺さぶるのか、どの公開プロダクトへ戻すのかを内部で整理します。',
  operatingRule:
    '好奇心は許可する。ただし、外部情報はまずcuriosity probeとして隔離し、source/current affairs triage、構造読み、境界レビュー、Founder確認を通るまで、根拠・助言・公開コピー・知識更新にしない。',
};

export const falconCuriositySourceBands: FalconCuriositySourceBand[] = [
  {
    id: 'FCS-01',
    label: 'ニュース / 制度の話題',
    whatFalconLooksFor:
      '制度語、統計語、社会的議論が、現場の仕事条件や評価条件へ翻訳されずに止まっている箇所。',
    allowedUse: '問い候補、source/current affairs triage候補、記事ルート候補。',
    mustNotUseAs: '現行制度断定、政策評価、統計の確認済み根拠、公式見解。',
    routingGate: '出典、日付、管轄、公式/準公式/報道/意見の区分を確認するまで保留。',
    icon: FileSearch,
  },
  {
    id: 'FCS-02',
    label: 'SNS上の違和感 / 誤読',
    whatFalconLooksFor: '短い言葉で出てくる誤解、怒り、沈黙、共感、説明需要、共同制作の気配。',
    allowedUse: 'hook改善、記事見出しの修正、図解ラベル、教材化候補。',
    mustNotUseAs: '代表事例、個人相談、妥当性証明、反応数KPI。',
    routingGate: '個人情報、診断名、職場名、個別助言要求が含まれる場合は取り込まない。',
    icon: Ear,
  },
  {
    id: 'FCS-03',
    label: '研究 / 実務資料',
    whatFalconLooksFor: '有用な知見が、職場で最初に確認する問いや研修行動へ落ちていない箇所。',
    allowedUse: '外部 evidence-layer 候補、読み替えメモ、記事・教材の欠落検出。',
    mustNotUseAs: 'レビュー済み構造知識、source/support validity、public-approved 根拠。',
    routingGate: '研究種別、対象、国・制度条件、限界、NBL知識層との差を明示する。',
    icon: SearchCheck,
  },
  {
    id: 'FCS-04',
    label: '現場研修 / 支援者の詰まり',
    whatFalconLooksFor:
      '良い話だったで終わり、職場で使う問い、記録、試行、戻り回路が残らない箇所。',
    allowedUse: '教材改善、研修台本、相談事例の追加確認問い、21視点の導線改善。',
    mustNotUseAs: '支援妥当性判断、個別ケース判断、研修効果の断定。',
    routingGate: '具体個人・職場を抽象化し、人工シナリオまたは一般的問いに変換する。',
    icon: UsersRound,
  },
];

export const falconCuriosityGrowthSteps: FalconCuriosityGrowthStep[] = [
  {
    id: 'FCG-01',
    label: '気になる点を拾う',
    falconMove:
      '公開情報や社会反応を見て、違和感、未翻訳、誤読、沈黙、繰り返し出る問いを3件以内で拾う。',
    internalArtifact: 'curiosity_probe',
    founderSees: '問いの名前と、なぜ気になったかだけ。',
    stopIf: '個人情報、DM、診断名別助言、現行制度断定に触れる場合。',
    icon: Sparkles,
  },
  {
    id: 'FCG-02',
    label: '構造へ読み替える',
    falconMove: '気になった点を、人 / 仕事 / 環境 / 支援 / 時間 / 制度の接点へ置き直す。',
    internalArtifact: 'structural_reframe',
    founderSees: '社会の話題を、仕事条件の問いへ変換した短い説明。',
    stopIf: '病名lookup、企業責任の単純化、本人努力論へ戻る場合。',
    icon: Network,
  },
  {
    id: 'FCG-03',
    label: '戻り先を決める',
    falconMove: '記事、図解、教材、相談事例、21視点、保留のどこへ戻すと最も学習になるかを決める。',
    internalArtifact: 'growth_route_decision',
    founderSees: '次に直す面と、直す理由。',
    stopIf: '投稿本文だけが成果物になり、プロダクトへ戻らない場合。',
    icon: Route,
  },
  {
    id: 'FCG-04',
    label: '小さく実験する',
    falconMove: 'hook、図解、読者、戻り先のうち1つだけ変えて、反応ではなく説明改善を観察する。',
    internalArtifact: 'experiment_buffer',
    founderSees: '出す / 出さない / 保留 の選択だけ。',
    stopIf: 'Founderが数字や反応を直接浴びる設計になった場合。',
    icon: TimerReset,
  },
  {
    id: 'FCG-05',
    label: '成長候補にする',
    falconMove:
      '反応や外部情報を根拠にせず、次の記事改稿、図解追加、教材化、source triage候補として残す。',
    internalArtifact: 'growth_candidate_note',
    founderSees: '次に作る成果物候補だけ。',
    stopIf: '知識昇格、candidate_pattern、public-approved、source/support validityへ進む場合。',
    icon: Workflow,
  },
];

export const falconCuriosityProbePacks: FalconCuriosityProbePack[] = [
  {
    id: 'FCP-2026-06-03-01',
    title: '制度や雇用率の話題を、参加の質の問いへ戻す',
    status: 'curiosity probe / not evidence / not publication-ready',
    curiosityQuestion:
      '社会では「雇用されたか」「制度上どうか」が見えやすいが、役割、評価、成長、見直し、健康時間はどこで見えなくなるのか。',
    whyItMatters:
      'Falconの中核は、数値や制度語を軽視せず、その先にある仕事参加の質と再翻訳の条件を見える化することにある。',
    sourceBandIds: ['FCS-01', 'FCS-02', 'FCS-03'],
    whatFalconNotices: [
      '雇用・定着の入口指標は見えるが、評価条件や役割形成が見えにくい。',
      'SNSでは制度批判か企業批判に二極化しやすく、仕事条件の問いが残りにくい。',
      '研究・制度資料は有用だが、現場で最初に見る問いへ翻訳されにくい。',
    ],
    structuralReframe:
      '制度・数値の話を、本人の役割、仕事量、評価、相談経路、支援の再翻訳、見直し時間の相互作用として読む。',
    productReturn: [
      '記事集: 雇用率を入口に、参加の質を問う記事を改稿する。',
      '21視点: 参加品質、評価、技能形成、見直しループへ戻す。',
      '教材: 管理職研修用の「人数の次に見る問い」カードを作る。',
      '相談事例集: 働けているが評価条件が見えない人工シナリオへ接続する。',
    ],
    growthHypothesis:
      '制度語をそのまま説明するより、仕事参加の質へ翻訳した短い問いを出した方が、支援者・企業・政策読者の共通会話になりやすい。',
    experimentShape:
      '投稿する場合は、数値や現行制度の断定を避け、hookだけを「働けている、の先に何を見るか」に固定する。反応は記事見出しと図解ラベルの改善だけに使う。',
    founderShield:
      'Founderは反応数を見ない。AIが24h/72h窓で、誤読、追加質問、協力の気配、低反応時の改善仮説だけを返す。',
    learningBoundary:
      '外部情報やSNS反応は、source/support validity、candidate_pattern、public-approved、専門知識の妥当性根拠にしない。',
    nextArtifact:
      'SNS Experiment Buffer: hook違い2案、見る信号、見ない数字、戻す先、保留条件を作る。',
    doNotDo: [
      '現行雇用率や法令状態を未確認で断定しない',
      '政策評価や企業評価として出さない',
      '反応数を成功失敗の判定にしない',
      '個別企業・個人の話を取り込まない',
      '知識ネットワークへ自動昇格しない',
    ],
    branchIds: ['QR-05', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A2', 'A6', 'A10', 'A12'],
    icon: Sparkles,
  },
];

export const snsExperimentBufferIntro = {
  eyebrow: 'SEB-01 SNS Experiment Buffer',
  title: '反応を浴びずに、問いと戻り先を小さく試す',
  body: 'SNSの実験は、反応数を見ることではありません。Falconがhook、読者、図解、戻り先を1つずつ変え、Founderには数字ではなく「次に直す成果物候補」だけを返します。',
  operatingRule:
    'Experiment Bufferは投稿指示ではなく、Founder確認前の内部実験単位です。自動投稿、自動返信、DM相談、個人情報収集、反応の根拠化、現行制度断定、public approvalには接続しない。',
};

export const snsExperimentBuffers: SnsExperimentBuffer[] = [
  {
    id: 'SEB-2026-06-03-01',
    title: '働けている、の先に何を見るか',
    status: 'experiment buffer / Founder shielded / no posting',
    curiosityProbeId: 'FCP-2026-06-03-01',
    scoutPackId: 'SSP-2026-06-03-01',
    targetReader: '支援者 / 企業担当者 / 政策・研究を読む実務者',
    hookVariants: [
      {
        id: 'SEB-01-A',
        label: '参加の質hook',
        hook: '「働けている」は、ゴールではなく観察の入口かもしれません。役割、評価、成長、見直しは、どこで見えなくなるでしょうか。',
        intendedLearning: '読者が雇用・定着の先にある仕事参加の質へ自然に移れるかを見る。',
        riskIfMisread: '雇用率や制度対応を軽視している、または企業批判として読まれる可能性。',
      },
      {
        id: 'SEB-01-B',
        label: '人数の次に見る問いhook',
        hook: '人数が増えた後に、次に見る問いがあります。役割はあるか、評価は伝わるか、成長の道は残っているか。',
        intendedLearning:
          '政策・人事・支援者の読者が、数値の次に確認する問いとして受け取れるかを見る。',
        riskIfMisread:
          '現行統計や政策評価の話だと読まれ、未確認の制度・数値議論へ引っ張られる可能性。',
      },
    ],
    whatToObserve: [
      '読者が「役割」「評価」「成長」「見直し」のどれに追加質問を出すか。',
      '図解が必要そうな語がどこか。人数、定着、評価、参加品質のどれか。',
      '支援者、企業、政策・研究読者のどこに最初の共通語が生まれそうか。',
      '誤読が起きた場合、記事見出し、図解ラベル、相談事例導入のどこを直すべきか。',
    ],
    whatNotToMeasure: [
      'いいね数',
      '拡散数',
      'フォロワー増減',
      '反応が多い少ないによる正しさ判定',
      'SNS反応からのsource/support validity判断',
    ],
    founderVisibility:
      'Founderには、A/Bどちらのhookを出すか、保留するか、次に直す成果物候補だけを表示する。反応数、個別コメント、引用反応の生ログは表示しない。',
    productReturn: [
      '記事集: 「雇用率の先にある参加の質」導入見出しを1案作る。',
      '図解: 人数、役割、評価、成長、見直しを横並びにする1枚図へ戻す。',
      '教材: 管理職研修用「人数の次に見る問い」カードへ戻す。',
      '相談事例集: 働けているが役割と評価条件が見えない人工事例へ戻す。',
      '21視点: 参加品質、評価、技能形成、見直しループへ戻す。',
    ],
    holdCondition:
      '現行制度、統計、法令、政策評価を述べたくなる場合、または個別企業・個人の経験に反応したくなる場合は保留し、source/current affairs triageまたは境界レビューへ戻す。',
    boundaryNote:
      'これはawareness / thinking aidの実験であり、助言、制度解説、政策評価、合理的配慮判断、専門知識の根拠ではない。',
    nextRevisionPacket:
      '記事見出し1案、図解ラベル3案、相談事例導入1案、保留理由1案をFounder確認用にまとめる。',
    automationBoundary:
      'Codex automation candidate may generate experiment buffers and Founder review packets only. It must not post, reply, scrape DMs, collect personal data, expose reaction numbers, or update knowledge validity.',
    exportJsonPath: 'references/social/falcon-sns-experiment-buffer-v0-2026-06-03.json',
    exportMarkdownPath: 'references/social/falcon-sns-experiment-buffer-v0-2026-06-03.md',
    branchIds: ['QR-05', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A5', 'A6', 'A10', 'A12'],
    icon: TimerReset,
  },
];

export const snsNativeOperatingLoops: SnsNativeOperatingLoop[] = [
  {
    id: 'SNO-01',
    label: 'テーマを発掘する',
    job: 'サイト、相談事例集、仕事条件レンズ、21視点、既存X反応から、今週話しかけるテーマを3つに絞る。',
    aiDoes:
      '反応が強かったテーマ、社会で誤解されやすいテーマ、プロダクトへ戻せるテーマを分け、投稿束の候補を作る。',
    founderDoes: '3候補のうち、今週の気分と社会的タイミングに合うものを選ぶ。',
    output: '週3テーマ / それぞれの入口文 / 戻り先URL / 使わないテーマ',
    successSignal: '投稿数ではなく、次に作るノート、図解、事例、教材の種が増える。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
    icon: SearchCheck,
  },
  {
    id: 'SNO-02',
    label: '投稿束を作る',
    job: '1テーマを、NBL名義、Founder補足、Instagramカルーセル、Facebook説明文、図解briefへ展開する。',
    aiDoes: '短文、画像1枚目、長めの説明、返信停止条件、読者の誤解リスク、戻り先を同時に作る。',
    founderDoes: '公開してよい声か、違和感のある言葉がないかだけを見る。',
    output: '1テーマ5形式の手動投稿パック',
    successSignal: 'リンク単独や思いつき投稿ではなく、同じテーマが複数面で一貫して出る。',
    branchIds: ['QR-01', 'QR-06', 'QR-08'],
    icon: Megaphone,
  },
  {
    id: 'SNO-03',
    label: '反応を読む',
    job: 'いいね数だけで成功失敗を決めず、問い、誤解、保存したい表現、連携の気配を分類する。',
    aiDoes:
      '反応が弱い投稿も、hook、読者層、画像、戻り先、タイミングのどこを直すべきかに分解する。',
    founderDoes: '数字を見て落ち込む前に、AIの分類結果だけを見る。',
    output: '反応分類 / 改善仮説 / 次回の言い換え',
    successSignal: '低反応でも「やめる」ではなく「次の打ち手」に変換される。',
    branchIds: ['QR-01', 'QR-05', 'QR-06'],
    icon: Ear,
  },
  {
    id: 'SNO-04',
    label: '関係を作る',
    job: '投稿だけで待たず、関連する人・団体・媒体・研究者・支援者の投稿へ、価値ある反応候補を作る。',
    aiDoes:
      '同意、補足、質問、紹介、引用リポスト候補を作り、個別助言や売り込みに見えるものを除く。',
    founderDoes: '人間として自然に言えるものだけを選んで出す。',
    output: 'コメント候補 / 引用候補 / 反応しない候補',
    successSignal: '一方的な発信ではなく、会話相手と戻り先が増える。',
    branchIds: ['QR-02', 'QR-05', 'QR-08'],
    icon: Handshake,
  },
  {
    id: 'SNO-05',
    label: 'プロダクトへ戻す',
    job: 'SNS反応を知識の根拠にせず、サイト、相談事例、仕事条件レンズ、教材、連携テーマの改善素材へ戻す。',
    aiDoes: '繰り返し出る誤解、よく保存される言い方、足りない図解、次に必要な相談事例を提案する。',
    founderDoes: '公開承認ではなく、次に作る成果物の優先順位だけを見る。',
    output: '次版サイト修正 / ノート候補 / 教材候補 / 連携候補',
    successSignal: 'SNSが消耗ではなく、プロダクト改善の入口になる。',
    branchIds: ['QR-03', 'QR-07', 'QR-08'],
    icon: Workflow,
  },
];

export const snsRelationshipRings: SnsRelationshipRing[] = [
  {
    id: 'SRR-01',
    label: '支援者・企業支援者',
    who: '就労支援、職リハ、企業支援、研修担当、ジョブコーチ的な実務者。',
    listenFor: 'よい支援をしたいが、現場で何を変えればよいか分からない詰まり。',
    engagementMove: '相談事例集、場面カード、21視点のうち、近い入口へ戻すコメント候補を作る。',
    returnTo: '相談事例集 / 場面カード / 45分研修',
    doNotDo: '個別ケースの助言や支援妥当性判断に入らない。',
    branchIds: ['QR-01', 'QR-03', 'QR-06'],
    icon: UsersRound,
  },
  {
    id: 'SRR-02',
    label: '企業・人事・産業保健',
    who: '人事、上司、DEI担当、産業保健、雇用管理に関心がある層。',
    listenFor: '合理的配慮、メンタルヘルス、治療と仕事、評価、配置で実装に迷う声。',
    engagementMove: 'リスク論や制度説明だけでなく、仕事条件へ置き直す短い補足を作る。',
    returnTo: '理論と発見 / 21視点ガイド',
    doNotDo: '法的安全、配置可否、個別配慮の正解を示さない。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    icon: BriefcaseBusiness,
  },
  {
    id: 'SRR-03',
    label: '当事者・患者会・家族',
    who: '見えない病気、難病、慢性疾患、障害のある人や家族、患者会。',
    listenFor: '説明負担、孤立、働き方への不安、制度の分かりにくさ、尊厳への違和感。',
    engagementMove: '体験を代表事例化せず、仕事や制度側で何を見直せるかを丁寧に返す。',
    returnTo: '仕事条件レンズ / 見えない病気と働く教材',
    doNotDo: '病状、治療、就労可否、個別生活判断に踏み込まない。',
    branchIds: ['QR-01', 'QR-04', 'QR-06'],
    icon: Ear,
  },
  {
    id: 'SRR-04',
    label: '研究・政策・メディア',
    who: '研究者、行政関係者、政策対話の相手、福祉・雇用・医療系メディア。',
    listenFor: 'データ不足、制度分断、評価指標、国際比較、研修需要、政策翻訳の需要。',
    engagementMove: '現在政策を断定せず、仕事条件レンズや出典確認つきの記事候補へ戻す。',
    returnTo: '仕事条件レンズ / 政策・研究翻訳',
    doNotDo: '未確認の統計、法令、行政運用を断定しない。',
    branchIds: ['QR-05', 'QR-07', 'QR-08'],
    icon: FileSearch,
  },
  {
    id: 'SRR-05',
    label: '編集・デザイン・クリエイティブ',
    who: '編集者、デザイナー、動画制作者、音楽・キャンペーンに関心がある協力者。',
    listenFor: '重いテーマを伝える形式、視覚化、短い動画、教材、研修への転換可能性。',
    engagementMove: '右脳的入口を、仕事条件の読み下しテキストと境界メモに接続する。',
    returnTo: '認知補助ツールキット / 発信設計',
    doNotDo: '感情的な表現だけで専門的説明や判断を置き換えない。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
    icon: ImageIcon,
  },
];

export const snsMotivationGuards: SnsMotivationGuard[] = [
  {
    id: 'SMG-01',
    label: '反応数だけを見ない',
    rule: 'いいね、閲覧、リポストは見るが、それを成功失敗の単独指標にしない。',
    reason: '小規模アカウント初期は、反応数よりも、届いた相手、問いの質、再利用可能性が重要。',
    metric: '保存した問い数、改善したhook数、作れた再利用素材数、会話候補数。',
    icon: ShieldCheck,
  },
  {
    id: 'SMG-02',
    label: 'Founderの作業を10分に切る',
    rule: 'AIが候補を用意し、Founderは選ぶ、直す、出す、出さないを短時間で決める。',
    reason: 'SNS運用を個人の気力に依存させると、反応が弱い時に止まる。',
    metric: '1日10分で処理できた候補数、保留理由、次にAIへ戻した修正点。',
    icon: TimerReset,
  },
  {
    id: 'SMG-03',
    label: '弱反応は改善素材にする',
    rule: '弱反応の投稿は削るのではなく、hook、画像、読者、戻り先、タイミングのどこが弱いかを見る。',
    reason:
      '反応が弱いことは、テーマが悪い証拠ではなく、社会への接続形式が未調整という信号かもしれない。',
    metric: '言い換え再投稿候補、図解化候補、相談事例化候補、別チャンネル展開候補。',
    icon: Activity,
  },
  {
    id: 'SMG-04',
    label: '見に行く時間を決める',
    rule: '投稿後すぐに何度も反応を見ず、確認窓を決めてAI分類だけを見る。',
    reason: '反応待ちの心理負荷を下げないと、継続が意欲消耗ゲームになる。',
    metric: '確認窓の回数、分類済み反応数、次回改善メモ。',
    icon: CalendarClock,
  },
];

export const snsManualQueueExportPack: SnsManualQueueExportPack = {
  id: 'SQX-01',
  label: 'Manual SNS Static Export Pack',
  jsonPath: 'references/social/falcon-sns-manual-queue-export-v0-2026-05-27.json',
  markdownPath: 'references/social/falcon-sns-manual-queue-export-v0-2026-05-27.md',
  columns: [
    'id',
    'theme',
    'status',
    'account_lane',
    'nbl_x_draft',
    'instagram_slides',
    'facebook_draft',
    'founder_amplifier_draft',
    'visual_brief',
    'return_destination',
    'expected_signal',
    'reply_stop_rule',
    'boundary_note',
  ],
  templateBlocks: [
    'NBL X one-post draft',
    'Instagram carousel slide text',
    'Facebook longer draft',
    'Founder amplifier draft',
    'Visual brief for designer / image generation',
    'Reply stop and return destination',
  ],
  operationRule:
    '静的ファイルとして渡せるが、投稿、予約投稿、SNS API接続、コメント対応、公開承認を含まない。',
  notIncluded: 'アカウント作成、投稿実行、画像生成、最新政策確認、法務・医療・雇用判断、個別返信。',
  icon: FileSearch,
};

export const snsAccountProfileCandidates: SnsAccountProfileCandidate[] = [
  {
    id: 'SAP-01',
    label: '@NextBeingLab profile candidate',
    accountLaneId: 'SAL-02',
    handleCandidates: ['@NextBeingLab'],
    bioDraft:
      '仕事の困りごとを、人だけの問題にせず、仕事・環境・支援・時間・制度の接点から考えるNext Being Lab / NBLの実験入口。障害・難病就労支援の知見を、仕事条件の問いへ。DM相談不可。',
    pinnedPostDraft:
      'NBLは、障害・難病就労支援で蓄積されてきた知見を、病名別の配慮表ではなく仕事設計の地図として届けようとしています。支援者、企業、研修担当が同じ問いで話せるように、仕事・環境・支援・時間・制度の接点から発信します。',
    avatarBrief:
      'NBL wordmark + 7 contact-point node motif on a calm light background. Avoid medical cross, disability icon, official seal impression, or advice-window look.',
    beforeCreate:
      'AID-2026-06-03-01とEAA-2026-06-03-01を確認し、@NextBeingLabの所有、プロフィール文、固定ポスト、アイコン境界、運用責任者、返信停止条件を決める。',
    doNotDo: 'NBL公式相談窓口、診断別配慮受付、DM相談、法務・雇用判断の場にしない。',
    icon: Megaphone,
  },
  {
    id: 'SAP-02',
    label: 'Founder amplifier profile note',
    accountLaneId: 'SAL-01',
    handleCandidates: ['existing Founder personal X'],
    bioDraft:
      '個人アカウントはNBL公式ではなく、開発背景、問題意識、学び、NBL名義発信への橋渡しに限定する。',
    pinnedPostDraft:
      'NBL/Falconでは、障害・難病就労支援の知見を、より広く「人間の多様性に合わせた仕事設計」の言葉へ翻訳しています。公式の継続発信はNBL名義アカウントへ分ける予定です。',
    avatarBrief: 'No change required. Keep personal identity separate from NBL official surface.',
    beforeCreate: 'NBL公式アカウント作成後の導線文を用意する。',
    doNotDo: '個人アカウントをNBL公式窓口化しない。',
    icon: UserRoundCheck,
  },
  {
    id: 'SAP-03',
    label: 'Instagram / Facebook format note',
    accountLaneId: 'SAL-03',
    handleCandidates: ['NBL official account undecided', 'Founder personal account limited use'],
    bioDraft:
      '図解・カルーセル・短い学びを中心に、公式運用にするか個人発信に限定するかを分けて判断する。',
    pinnedPostDraft:
      '仕事の困難を、人・仕事・環境・支援・時間・制度の接点として見る。図解で少しずつ共有していきます。',
    avatarBrief: 'Use consistent NBL visual system only after official account decision.',
    beforeCreate: '公式アカウント作成方針、画像テンプレート、コメント対応方針を決める。',
    doNotDo: '個別体験談やDMを学習データ、代表事例、相談受付として扱わない。',
    icon: ImageIcon,
  },
];

export const snsManualQueueItems: SnsManualQueueItem[] = [
  {
    id: 'SQ-01',
    theme: '困りごとは、人の中だけで起きていない',
    accountLaneId: 'SAL-02',
    platformGroup: 'X / Instagram / Facebook',
    status: 'internal-ready / NBL account needed / public review pending',
    nblXDraft:
      'よい支援をしたいのに、現場が動かない。そんな時、困りごとを本人の中だけに置くと、変えられる条件が見えなくなります。作業、環境、時間、情報、支援、評価の接点を見る地図が必要です。',
    instagramSlides: [
      '1. よい支援をしたいのに、現場が動かない',
      '2. 困りごとは、人の中だけで起きていない',
      '3. 作業、環境、時間、情報、支援、評価の接点を見る',
      '4. 病名や障害名は入口。でも説明をそこで閉じない',
      '5. まず確認するのは、どの条件が閉じているか',
      '6. 次期NBLは、仕事設計の地図を作ります',
    ],
    facebookDraft:
      '支援者が本人にも企業にも向き合っているのに、現場が動かないことがあります。仕事上の困難を本人の問題だけとして扱うと、変えられる条件が見えなくなります。NBLでは、人・仕事・環境・支援・時間・制度の接点に戻して、次に確認すべき問いを整理する見方を作っています。',
    founderAmplifierDraft:
      'Heronで刺さっていた「よい支援をしたいのにできない」ギャップを、Falconでは仕事設計の地図として解こうとしています。障害や病気を軽視せず、相互作用として精密に見る。',
    visualBrief:
      '中央に「困りごと」、周囲に人、仕事、環境、支援、時間、制度。双方向の線。診断名や配慮名は主役にしない。',
    returnDestination: 'NS-01 Top / NS-02 Work Design Map',
    expectedSignal: '追加説明需要、誤解・短絡、仕事設計マップへの関心。',
    replyStopRule: '個別診断名から配慮を聞く返信には具体助言で返さない。',
    boundaryNote: 'awareness / perspective shift, not advice.',
    branchIds: ['QR-08', 'QR-01', 'QR-02'],
    agentIds: ['A1', 'A6', 'A12'],
    icon: Network,
  },
  {
    id: 'SQ-02',
    theme: '体調変動は、仕事の時間設計で読む',
    accountLaneId: 'SAL-02',
    platformGroup: 'X / Instagram / Facebook',
    status: 'internal-ready / public review pending',
    nblXDraft:
      '体調変動は、本人の不安定さだけを示すものではありません。勤務量、休憩、通院、回復、戻り方をどう設計するかという、仕事の時間設計の情報でもあります。',
    instagramSlides: [
      '1. 体調変動は、仕事の時間設計で読む',
      '2. 見るのは勤務量、休憩、通院、回復、戻り方',
      '3. 安定して働けるか、だけで閉じない',
      '4. 休む・待つ・戻る自由度も設計条件',
      '5. 健康時間を仕事の条件として見える化する',
    ],
    facebookDraft:
      '体調変動を本人の問題としてだけ扱うと、仕事側で調整できる時間条件が見えにくくなります。勤務量、休憩、通院、回復、戻り方、生活保障を分けて考えることで、仕事設計の問いが立ち上がります。',
    founderAmplifierDraft:
      '難病・慢性疾患・メンタルヘルスの就労課題を考えるとき、この「健康時間」の見方はかなり中核になると思っています。',
    visualBrief:
      '1日の時間軸に、仕事量、休憩、通院、回復の層を重ねる。人物の苦悩表現ではなく設計図。',
    returnDestination: 'NS-03 21 Tools / health-time shelf',
    expectedSignal: '健康時間、休み方、戻り方への質問。',
    replyStopRule: '休職・復職・疾病別就労可否の個別判断には返さない。',
    boundaryNote: 'thinking aid, not medical, HR, or legal judgment.',
    branchIds: ['QR-01', 'QR-04'],
    agentIds: ['A1', 'A6', 'A8', 'A12'],
    icon: TimerReset,
  },
  {
    id: 'SQ-03',
    theme: '配慮リストより、仕事接触点を見る',
    accountLaneId: 'SAL-02',
    platformGroup: 'X / Instagram / Facebook',
    status: 'internal-ready / public review pending',
    nblXDraft:
      '配慮リストを探す前に、仕事の接触点を見ます。作業手順、情報、道具、動線、相談経路、評価。どこで条件が閉じているかが分かると、確認すべき問いが変わります。',
    instagramSlides: [
      '1. 配慮リストより、仕事接触点を見る',
      '2. 作業手順',
      '3. 情報と道具',
      '4. 動線と相談経路',
      '5. 評価と役割',
      '6. 正解配慮ではなく、確認すべき条件へ',
    ],
    facebookDraft:
      '同じ配慮名でも、効く理由は職場ごとに違います。作業手順なのか、情報の残り方なのか、道具や動線なのか、相談経路なのか、評価の見方なのか。仕事の接触点に戻すことで、本人にも職場にも説明しやすい問いになります。',
    founderAmplifierDraft:
      '「配慮名」より「効く機序」。ここを丁寧に見ることが、Falconらしさのひとつです。',
    visualBrief:
      '職場俯瞰マップに、作業、情報、道具、相談、評価の問いアイコンを置く。チェックリスト風にしない。',
    returnDestination: 'NS-02 Work Design Map / NS-04 Work-Design Studio',
    expectedSignal: '企業・支援者の実装課題、研修需要。',
    replyStopRule: 'この配慮で足りるか、企業が法的に安全か、という判定には返さない。',
    boundaryNote: 'work-design explanation, not accommodation validity judgment.',
    branchIds: ['QR-02', 'QR-03', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A6', 'A8', 'A9', 'A12'],
    icon: Map,
  },
  {
    id: 'SQ-04',
    theme: '開示は、告白ではなく境界設計',
    accountLaneId: 'SAL-02',
    platformGroup: 'X / Instagram / Facebook',
    status: 'internal-ready / public review pending',
    nblXDraft:
      '開示は、告白ではなく境界設計です。何を、誰に、どこまで、どの手順で共有するか。仕事に必要な情報と、守るべき情報を分けて考える必要があります。',
    instagramSlides: [
      '1. 開示は、告白ではなく境界設計',
      '2. 共有する情報',
      '3. 共有しない情報',
      '4. 共有先と手順',
      '5. 記録と見直し',
      '6. 本人の勇気だけに背負わせない',
    ],
    facebookDraft:
      '仕事に必要な情報を共有することと、病状や個人情報を広く開示することは同じではありません。共有範囲、共有先、手順、記録、見直しを分けて考えることで、本人にも職場にも安全な境界が作りやすくなります。',
    founderAmplifierDraft:
      '開示を本人の勇気や説明力だけに背負わせない。これはもっと広く共有したい視点です。',
    visualBrief: '情報の範囲を調整するスライダー。本人、支援者、職場の間に安全な共有ルート。',
    returnDestination: 'NS-02 Work Design Map / PE-03 Co-Design Room',
    expectedSignal: '開示の不安、情報共有手順への関心。',
    replyStopRule: '誰に言うべきか、採用でどう扱うべきかの個別判断には返さない。',
    boundaryNote: 'boundary design concept, not disclosure advice.',
    branchIds: ['QR-06', 'QR-02', 'QR-05'],
    agentIds: ['A1', 'A6', 'A7', 'A8', 'A9', 'A12'],
    icon: ShieldCheck,
  },
  {
    id: 'SQ-05',
    theme: '入口以前にも、参加は始まっている',
    accountLaneId: 'SAL-02',
    platformGroup: 'X / Instagram / Facebook',
    status: 'internal-ready / public review pending',
    nblXDraft:
      '就職の前にも、参加は始まっています。生活リズム、体力、訓練、求人理解、説明準備、支援接続、生活保障。応募の手前にある条件を、本人の努力だけで片づけない。',
    instagramSlides: [
      '1. 入口以前にも、参加は始まっている',
      '2. 生活リズムと健康時間',
      '3. 訓練と求人理解',
      '4. 説明準備と支援接続',
      '5. 生活保障',
      '6. 応募の手前にある条件を見る',
    ],
    facebookDraft:
      '就職できたかどうかだけを見ると、応募の手前で必要だった条件が見えなくなります。生活、健康時間、訓練、支援接続、求人理解、説明準備、生活保障を一つの過程として見ることが、参加の自由度を広げます。',
    founderAmplifierDraft:
      '「就職前」は空白ではなく、参加の条件が組み上がる大事な時間。ここを見える化したい。',
    visualBrief:
      '応募ボタンの手前に、生活、健康時間、訓練、相談、求人理解、生活保障のステップを置くロードマップ。',
    returnDestination: 'NS-03 21 Tools / NS-06 Partnership',
    expectedSignal: '研修、支援接続、生活保障への関心。',
    replyStopRule: '給付、家族対応、就労可否の個別助言には返さない。',
    boundaryNote: 'structural participation concept, not benefit or employment advice.',
    branchIds: ['QR-05', 'QR-04', 'QR-06'],
    agentIds: ['A1', 'A6', 'A7', 'A8', 'A11', 'A12'],
    icon: Route,
  },
  {
    id: 'SQ-06',
    theme: '働けている、の先に参加の質がある',
    accountLaneId: 'SAL-02',
    platformGroup: 'X / Instagram / Facebook',
    status: 'internal-ready / live verification needed for policy claims',
    nblXDraft:
      '「働けている」と「参加の質が高い」は同じではありません。役割、技能形成、評価、処遇、キャリア、見直し。雇用や定着の先にある仕事参加の質を見える化したい。',
    instagramSlides: [
      '1. 働けている、の先に参加の質がある',
      '2. 役割',
      '3. 技能形成',
      '4. 評価と処遇',
      '5. キャリア',
      '6. 見直しループ',
    ],
    facebookDraft:
      '雇用されたか、定着したかは大事な入口です。ただ、それだけでは役割、技能形成、評価、処遇、キャリア、見直しの質までは見えません。NBLでは、仕事参加の質を、仕事設計の問いとして整理していきます。',
    founderAmplifierDraft:
      '雇用率や定着の先に、参加の質がある。ここは政策・研究・現場をつなぐ重要な論点になりそうです。',
    visualBrief: '左に雇用・定着、右に役割・技能・評価・キャリア。中央に仕事設計の橋。',
    returnDestination: 'NS-05 Policy / Research Translation',
    expectedSignal: '政策・研究・企業の評価指標への関心。',
    replyStopRule: '現行政策、統計、企業評価の断定には返さない。',
    boundaryNote: 'policy/research question, not current policy claim.',
    branchIds: ['QR-07', 'QR-08', 'QR-04'],
    agentIds: ['A1', 'A2', 'A6', 'A10', 'A12'],
    icon: BadgeCheck,
  },
];

export const snsQueueChecklist: SnsQueueChecklistItem[] = [
  {
    id: 'SQC-01',
    label: 'アカウント人格を分ける',
    check: 'NBL名義アカウントの公式候補とFounder個人増幅を別文面にしているか。',
    stopIf: '個人アカウントがNBL公式窓口に見える。',
    output: 'account lane label.',
    icon: UserRoundCheck,
  },
  {
    id: 'SQC-02',
    label: '返信停止条件を持つ',
    check: '個別相談、診断、法務、雇用判断へ滑る返信を止める文があるか。',
    stopIf: '個別質問にSNS上で答える設計になっている。',
    output: 'reply stop rule.',
    icon: ShieldCheck,
  },
  {
    id: 'SQC-03',
    label: '戻り先を持つ',
    check: '各投稿が次期NBL候補ページ、図解、人工シナリオ、政策翻訳へ戻るか。',
    stopIf: '投稿だけが独立して、学習ループへ戻らない。',
    output: 'return destination.',
    icon: Route,
  },
  {
    id: 'SQC-04',
    label: '反応を根拠化しない',
    check: 'SNS反応を、source/support validityや代表事例として扱っていないか。',
    stopIf: '反応を専門知識の妥当性証明や学習データにする。',
    output: 'social signal classification only.',
    icon: SearchCheck,
  },
];

export const visualAssetPlans: VisualAssetPlan[] = [
  {
    id: 'VA-01',
    label: '第一原理 図解カード',
    format: '正方形図解 / SNS 1枚目',
    hook: '困りごとは、人の中だけで起きているのではない。',
    imagePromptSeed:
      '落ち着いた日本語の教育図解。中央に「人」、周囲に「仕事」「環境」「支援」「時間」「情報」「制度」の小さなノード。矢印は双方向。医療的・法律的な断定を避け、余白のある専門的なデザイン。',
    guardrail:
      '診断名や障害種類を主役にせず、相互作用構造を主役にする。個別助言や判定に見える文言を入れない。',
    branchIds: ['QR-08', 'QR-01', 'QR-02'],
    icon: Network,
  },
  {
    id: 'VA-02',
    label: '自己評価 hookサムネイル',
    format: '横長サムネイル / 記事・動画入口',
    hook: '配慮を探す前に、仕事の接触点を見る。',
    imagePromptSeed:
      '机、通路、情報端末、休憩スペース、相談経路を抽象化した仕事場マップ。人を小さく中心に置き、場所ごとにチェックマークではなく問いの印を置く。明るいが誇張しない配色。',
    guardrail: '「この配慮が正解」と読ませない。仕事接触点を一緒に点検する入口にする。',
    branchIds: ['QR-03', 'QR-06', 'QR-07'],
    icon: ImageIcon,
  },
  {
    id: 'VA-03',
    label: '健康時間 アイキャッチ',
    format: 'SNSカルーセル 1枚目',
    hook: '体調変動は、仕事の時間設計で読む。',
    imagePromptSeed:
      '1日の時間軸、波のような体調変動、勤務量、休憩、通院、回復時間が重なるミニマルなインフォグラフィック。人物の苦悩表現ではなく、時間設計の図として表現する。',
    guardrail: '本人の不安定さを強調しない。健康時間を仕事設計の情報として扱う。',
    branchIds: ['QR-01', 'QR-04'],
    icon: TimerReset,
  },
  {
    id: 'VA-04',
    label: '行政課題 ブリッジ図',
    format: '記事内図解 / policy lens',
    hook: '雇用率と、仕事参加の質は同じ指標ではない。',
    imagePromptSeed:
      '左に量的指標、右に参加品質。中央にFalconの第一原理が橋をかける構成。公的資料のような信頼感と、一般読者が読める柔らかさを両立する。',
    guardrail: '政策の最終評価にしない。公式資料の解釈や現行法の断定を避ける。',
    branchIds: ['QR-07', 'QR-08', 'QR-04'],
    icon: Building2,
  },
  {
    id: 'VA-05',
    label: 'SNS連載 キービジュアル',
    format: '連載共通アイキャッチ',
    hook: '仕事を、人間の多様性に合わせて設計しなおす。',
    imagePromptSeed:
      '多様な働き方の接触点を抽象的なネットワークとして描く。人の属性ではなく、仕事、環境、情報、時間、支援の組み合わせが変わる様子を表す。NBLらしい静かで専門的なトーン。',
    guardrail: '障害者像のステレオタイプ化を避ける。過度に感動的、悲劇的、煽情的な絵にしない。',
    branchIds: ['QR-08', 'QR-05', 'QR-07'],
    icon: Sparkles,
  },
];

export const snsAutomationSteps: SnsAutomationStep[] = [
  {
    id: 'SA-01',
    label: '構造選択',
    job: '投稿の出発点を文脈枝と第一原理から選ぶ。',
    automation: '選択中のQR/FPから投稿テーマ候補を生成する。',
    humanGate: '中心メッセージがNBLの価値判断に関わる場合だけFounder確認。',
    icon: Workflow,
  },
  {
    id: 'SA-02',
    label: 'hook生成',
    job: '1投稿1構造で、短く誤解されにくい入口文を作る。',
    automation: 'hook、本文、CTAを3案ずつ作り、診断名短絡や断定表現を除外する。',
    humanGate: '強い社会的主張、政策批判、制度名を含む場合だけ確認。',
    icon: Megaphone,
  },
  {
    id: 'SA-03',
    label: 'visual生成指示',
    job: 'Image-2.0等へ渡す図解・サムネイル・アイキャッチのプロンプト種を作る。',
    automation: 'visual asset planから、画像プロンプト、入れる短文、避ける表現を生成する。',
    humanGate: '実在人物、実在団体、特定制度ロゴ、著作物風表現を含む場合は止める。',
    icon: ImageIcon,
  },
  {
    id: 'SA-04',
    label: '境界チェック',
    job: '投稿が助言、判定、公式解釈、公開承認に見えないか点検する。',
    automation: 'Boundary / Risk Agentが赤黄フラグを付け、黄は修正案、赤は保留にする。',
    humanGate: '赤フラグ、法制度・統計・公的資料断定、個別相談誘導はFounder確認。',
    icon: ShieldCheck,
  },
  {
    id: 'SA-05',
    label: '反応整理',
    job: '投稿後の反応を知識昇格ではなく、社会側の疑問として蓄積する。',
    automation: '質問、誤解、関心、反発、追加説明需要を分類する。',
    humanGate: '反応をFalcon知識へ反映する場合は別途レビュー。',
    icon: Bot,
  },
];

export const snsListeningThemes: SnsListeningTheme[] = [
  {
    id: 'SLS-01',
    title: '困りごとは、人の中だけで起きていない',
    audience: '初見読者 / 支援者 / 企業担当者',
    structuralShift:
      '「本人の問題」から、人・仕事・環境・支援・時間・制度が接する場所で起きる現象へ移す。',
    hook: '困りごとは、人の中だけで起きているのではありません。',
    listeningQuestion:
      'あなたの現場では、困りごとが「人の問題」として処理されやすい場面はどこですか。',
    bodyOutline: [
      '病名や障害名は入口になるが、仕事上の困難の説明をそこで止めない。',
      '見る単位を、作業、環境、時間、情報、支援、評価の接点へ移す。',
      '次期NBLでは、この接点を一緒に見える化する。',
    ],
    visualPromptSeed:
      '白背景の落ち着いた日本語インフォグラフィック。中央に「困りごと」、周囲に「人」「仕事」「環境」「支援」「時間」「制度」。単方向ではなく相互作用の線。診断名や個別助言は入れない。',
    returnDestination: 'PE-01 Public Work Design Map / 仕事設計マップ導入',
    likelyMisunderstanding: '病気や障害の影響を軽視している、と読まれる可能性。',
    doNotReplyTo: '個別の診断名から必要配慮を聞く返信には、具体助言で返さない。',
    humanReviewGate: '医学・法的・雇用判断に見える返信、強い反発、個別相談化は人間確認へ。',
    responseTaxonomyIds: ['RT-01', 'RT-02', 'RT-05'],
    branchIds: ['QR-08', 'QR-01', 'QR-02'],
    agentIds: ['A1', 'A3', 'A6', 'A12'],
    icon: Network,
  },
  {
    id: 'SLS-02',
    title: '体調変動は、仕事の時間設計で読む',
    audience: '難病・慢性疾患・メンタルヘルスに関心がある読者 / 支援者 / 企業',
    structuralShift:
      '「安定して働けるか」から、勤務量、休憩、通院、回復、評価をどう設計するかへ移す。',
    hook: '体調変動は、仕事の時間設計の情報です。',
    listeningQuestion:
      '働く時間、休む時間、戻る時間を分けて考える仕組みは、あなたの周りにありますか。',
    bodyOutline: [
      '体調変動は、本人の不安定さとしてだけ扱うと設計の入口を失う。',
      '勤務量、休憩、通院、回復、代替、評価の接続を見る。',
      '生活保障も、休む・待つ・戻る自由度として関係する。',
    ],
    visualPromptSeed:
      '一日の時間軸に、体調の波、仕事量、休憩、通院、回復が重なる静かな図解。人物の苦悩表現ではなく、設計図として見える構成。',
    returnDestination: 'PE-01 health-time section / 3x7道具箱「健康時間」',
    likelyMisunderstanding: '勤務免除や特別扱いの主張として読まれる可能性。',
    doNotReplyTo: '特定疾病の就労可否、休職・復職可否、法的義務の断定には返さない。',
    humanReviewGate: '復職、休職、合理的配慮、労務対応の個別判断は人間確認へ。',
    responseTaxonomyIds: ['RT-01', 'RT-03', 'RT-06'],
    branchIds: ['QR-01', 'QR-04'],
    agentIds: ['A1', 'A5', 'A6', 'A8', 'A9'],
    icon: TimerReset,
  },
  {
    id: 'SLS-03',
    title: '配慮リストより、仕事接触点を見る',
    audience: '企業 / 管理職 / 支援者 / 研修担当',
    structuralShift:
      '「どの配慮をするか」から、作業、動線、情報、道具、安全、評価のどこを変えるかへ移す。',
    hook: '配慮を探す前に、仕事の接触点を見ます。',
    listeningQuestion: 'あなたの職場で、仕事のやりにくさが起きる接触点はどこにありますか。',
    bodyOutline: [
      '配慮名だけを並べると、なぜ必要か、どこを変えるかが見えにくい。',
      '作業手順、道具、動線、情報、相談経路、評価の接点へ分解する。',
      '同じ配慮名でも、効く機序は現場ごとに違う。',
    ],
    visualPromptSeed:
      '職場を俯瞰した抽象マップ。机、通路、端末、会議、休憩、相談経路に小さな問いのアイコン。チェックリストではなく設計点検の雰囲気。',
    returnDestination: 'PE-04 Employer / Practitioner Work-Design Studio',
    likelyMisunderstanding: '企業の責任逃れや、本人努力への差し戻しとして読まれる可能性。',
    doNotReplyTo: 'この配慮で足りるか、企業が法的に安全か、という判定には返さない。',
    humanReviewGate: '実在企業・職場・雇用トラブルに関わる返信は人間確認へ。',
    responseTaxonomyIds: ['RT-03', 'RT-04', 'RT-06'],
    branchIds: ['QR-03', 'QR-02', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A6', 'A8', 'A9', 'A12'],
    icon: Map,
  },
  {
    id: 'SLS-04',
    title: '開示は、告白ではなく境界設計',
    audience: '本人 / 支援者 / 人事 / 管理職',
    structuralShift:
      '「病名を伝えるかどうか」から、仕事に必要な条件を誰に、どこまで、どう共有するかへ移す。',
    hook: '開示は、告白ではなく境界設計です。',
    listeningQuestion: '仕事に必要な情報だけを、安全に共有する手順はありますか。',
    bodyOutline: [
      '開示を本人の勇気や説明力だけに背負わせない。',
      '共有する情報、共有しない情報、共有先、手順、記録、見直しを分ける。',
      '情報保障と仕事手順化をつなげる。',
    ],
    visualPromptSeed:
      '鍵と扉ではなく、情報の範囲を調整するスライダーや境界線の図。本人、支援者、職場の間に安全な情報共有ルート。',
    returnDestination: 'PE-03 Stakeholder Co-Design Room / disclosure review card',
    likelyMisunderstanding: '開示すべき、または隠すべきという一律メッセージに見える可能性。',
    doNotReplyTo: '開示すべきか、誰に言うべきか、採用でどう扱うべきかの個別判断には返さない。',
    humanReviewGate: '個人情報、採用、配置、ハラスメント、紛争に関わる返信は人間確認へ。',
    responseTaxonomyIds: ['RT-02', 'RT-03', 'RT-06'],
    branchIds: ['QR-06', 'QR-02', 'QR-05'],
    agentIds: ['A1', 'A6', 'A7', 'A8', 'A9'],
    icon: ShieldCheck,
  },
  {
    id: 'SLS-05',
    title: '入口以前にも、参加は始まっている',
    audience: '本人 / 家族 / 支援者 / 教育・訓練関係者',
    structuralShift:
      '「就職できたか」から、生活リズム、体力、訓練、説明、自信、生活保障が求人条件へ近づく過程へ移す。',
    hook: '就職の前にも、参加は始まっています。',
    listeningQuestion: '応募の前に整えるべき条件は、個人の努力として片づけられていませんか。',
    bodyOutline: [
      '就職入口だけを見ると、準備に必要な条件が見えなくなる。',
      '生活、健康時間、訓練、支援接続、求人理解、説明準備を一つの過程として見る。',
      '生活保障は、選ぶ・待つ・試す自由度を作る。',
    ],
    visualPromptSeed:
      '応募ボタンの手前に、生活リズム、体力、訓練、相談、求人理解、生活保障の小さなステップが並ぶロードマップ。説教調ではなく支える設計図。',
    returnDestination: 'PE-03 co-design review / PE-06 partnership themes',
    likelyMisunderstanding: '本人の準備不足を責める表現として読まれる可能性。',
    doNotReplyTo: '本人の就労可能性、家族対応、給付・制度利用の個別助言には返さない。',
    humanReviewGate: '生活困窮、制度利用、家族関係、医療・福祉連携の個別相談化は人間確認へ。',
    responseTaxonomyIds: ['RT-01', 'RT-04', 'RT-06'],
    branchIds: ['QR-05', 'QR-04', 'QR-06'],
    agentIds: ['A1', 'A6', 'A7', 'A8', 'A11'],
    icon: Route,
  },
  {
    id: 'SLS-06',
    title: '働けている、の先に参加の質がある',
    audience: '企業 / 支援者 / 政策・研究関係者',
    structuralShift:
      '「雇用されたか・定着したか」から、役割、技能、評価、処遇、キャリア、見直しへ移す。',
    hook: '「働けている」の先に、参加の質があります。',
    listeningQuestion: '雇用や定着の数字だけでは見えない参加の質を、どこで確認していますか。',
    bodyOutline: [
      '働けていることと、役割や技能が価値として評価されることは同じではない。',
      '評価、処遇、キャリア、職場内の役割、見直しループを見る。',
      'SNS反応も、正解化ではなく社会側の問いとして戻す。',
    ],
    visualPromptSeed:
      '左に「雇用・定着」の指標、右に「役割・技能・評価・キャリア・見直し」の質的要素。中央に仕事設計の橋を置く専門的な図解。',
    returnDestination: 'PE-05 Policy / Research Translation Desk',
    likelyMisunderstanding: '雇用率や制度努力を否定している、と読まれる可能性。',
    doNotReplyTo: '政策評価、企業評価、制度批判の断定には返さない。',
    humanReviewGate:
      '現行政策、統計、審議会、公式資料に関する返信はlive verificationと人間確認へ。',
    responseTaxonomyIds: ['RT-01', 'RT-03', 'RT-04'],
    branchIds: ['QR-07', 'QR-08', 'QR-04'],
    agentIds: ['A1', 'A2', 'A5', 'A6', 'A10', 'A12'],
    icon: BadgeCheck,
  },
];

export const snsResponseTaxonomy: SnsResponseTaxonomy[] = [
  {
    id: 'RT-01',
    label: '追加説明需要',
    captureAs: 'どの概念・図解・用語が分かりにくいか。',
    neverTreatAs: '読者理解済みの証拠、専門知識の妥当性証明。',
    humanGate: '用語や図解を大きく変える場合は編集レビューへ。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
    icon: SearchCheck,
  },
  {
    id: 'RT-02',
    label: '誤解・短絡',
    captureAs: '病名別配慮、本人責任、企業責任だけに寄った読み。',
    neverTreatAs: '反論すべき相手、SNS上で説得し切る対象。',
    humanGate: '炎上、差別的表現、強い対立は返信前に人間確認。',
    branchIds: ['QR-06', 'QR-08'],
    icon: ShieldCheck,
  },
  {
    id: 'RT-03',
    label: '実装課題',
    captureAs: '職場、支援、制度、評価、時間設計で実際に詰まる条件。',
    neverTreatAs: '個別ケースの正誤、企業や支援機関の責任認定。',
    humanGate: '実名、個別企業、労務・法的判断につながる内容は人間確認。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    icon: Workflow,
  },
  {
    id: 'RT-04',
    label: '協力候補',
    captureAs: 'レビュー、共同研究、研修、実証、取材、政策対話の入口。',
    neverTreatAs: '受注見込み、協力合意、NBLの公的承認。',
    humanGate: '外部連携・共同事業・資金に関わる場合はFounder判断へ。',
    branchIds: ['QR-05', 'QR-07', 'QR-08'],
    icon: Handshake,
  },
  {
    id: 'RT-05',
    label: '体験・事例の共有',
    captureAs: '社会側の問いや不足文脈。再利用前提ではなく、扱い注意の声。',
    neverTreatAs: '自由記述データ、学習データ、引用素材、代表事例。',
    humanGate: '個人情報、病状、職場、支援者情報を含む場合は扱わないか別ルートへ。',
    branchIds: ['QR-01', 'QR-04', 'QR-06'],
    icon: Ear,
  },
  {
    id: 'RT-06',
    label: '赤旗・個別判断化',
    captureAs: '個別相談、医療・法律・雇用判断、センシティブ情報の混入。',
    neverTreatAs: 'SNS返信で処理できる質問、Falcon知識への入力。',
    humanGate: '返信停止。必要なら一般的な相談先案内や別途承認済み導線だけを検討。',
    branchIds: ['QR-04', 'QR-06', 'QR-08'],
    icon: Stethoscope,
  },
];

export const agentCouncilRoles: AgentCouncilRole[] = [
  {
    id: 'A1',
    label: 'Falcon Core Expert Agent',
    mission:
      '世界一の就労支援専門エージェントとして、SCIMA/FCHMAとICF上の相互作用理解を社会接点へ通す。',
    output: '第一原理、文脈枝、自由度、反対仮説、未レビュー境界、出してよい問い。',
    guardrail: '病名別配慮表、一般論、助言チャット、支援妥当性判断に落とさない。',
    branchIds: ['QR-01', 'QR-02', 'QR-08'],
    icon: Network,
  },
  {
    id: 'A2',
    label: 'Evidence / Method Curator',
    mission:
      '調査、workshop、NIVR、web-cacheの根拠範囲と読みの限界を、制作チームが使える形に保つ。',
    output: 'source lens、未読・薄読みによる注意、使える表現、検証待ち表示。',
    guardrail: '根拠の厚さを演出で膨らませない。source/support validityを勝手に動かさない。',
    branchIds: ['QR-02', 'QR-04', 'QR-08'],
    icon: FileSearch,
  },
  {
    id: 'A3',
    label: 'Product Strategy / UX Research',
    mission:
      'Falconの高度な専門性を、初見読者、利用者、支援者、企業が自然に理解できる体験へ翻訳する。',
    output: 'ユーザージャーニー、情報設計、ワイヤー、読者テストで見る問い。',
    guardrail: '高度さを捨てた単純化、暗号のような専門語、内部都合の画面にしない。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
    icon: Route,
  },
  {
    id: 'A4',
    label: 'AI Systems / Full-Stack Engineering',
    mission:
      '次期NBLサイト、内部ツール、SNS制作補助、レビューUIを、壊れにくく監査可能な実装へ落とす。',
    output: '静的プロトタイプ、データ境界、保存設計、テスト、将来runtime接続の候補。',
    guardrail: '公開IA、runtime、DB、retrieval、モデル、promptを未承認で広げない。',
    branchIds: ['QR-02', 'QR-06', 'QR-08'],
    icon: Bot,
  },
  {
    id: 'A5',
    label: 'Data / Evaluation Engineering',
    mission: '社会接点が本当に理解、問い、実装、反応を生むかを、軽量な評価指標で検査する。',
    output: '理解チェック、反応分類、A/B比較、誤解パターン、次の改善候補。',
    guardrail: 'SNS反応や利用ログを根拠化・知識昇格・個別事例化しない。',
    branchIds: ['QR-01', 'QR-07', 'QR-08'],
    icon: SearchCheck,
  },
  {
    id: 'A6',
    label: 'Privacy / Safety / Boundary',
    mission: '個人情報、判断代替、公開承認、法的・医学的・雇用判断化を、制作の入口で止める。',
    output: '赤黄フラグ、保留条件、human gate、公開前レビュー要求。',
    guardrail: '安全レビューを出版承認、法務承認、専門判断承認に見せない。',
    branchIds: ['QR-04', 'QR-06', 'QR-08'],
    icon: ShieldCheck,
  },
  {
    id: 'A7',
    label: 'Lived Experience Co-Design Council',
    mission: '本人、家族、当事者団体の実在レビューへつなぐ席を、最初から制作体制に入れる。',
    output: '尊厳、負担、不安、開示圧力、自己決定、読まれ方のレビュー観点。',
    guardrail: 'AIによる仮想当事者で代替しない。実在レビュー前に当事者承認のように見せない。',
    branchIds: ['QR-04', 'QR-05', 'QR-06'],
    icon: Handshake,
  },
  {
    id: 'A8',
    label: 'Employment Support Practitioner Council',
    mission: '就労支援、相談支援、職場定着、医療・福祉連携の現場から、使える問いへ磨く。',
    output: '相談準備項目、支援者の追加質問、現場で詰まる箇所、研修化の視点。',
    guardrail: '専門職レビューの代替にしない。個別ケースの正誤判定へ進まない。',
    branchIds: ['QR-01', 'QR-03', 'QR-06'],
    icon: ClipboardList,
  },
  {
    id: 'A9',
    label: 'Employer / HR / Manager Partner Council',
    mission: '企業、人事、上司、中小企業の実装負荷、責任、手順、評価の現実と接続する。',
    output: '企業が防衛的になりにくい表現、実装導線、職場制約、BtoB実験仮説。',
    guardrail: '職場を一方的に悪者にしない。法的安全保証や合理的配慮判定にしない。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    icon: Building2,
  },
  {
    id: 'A10',
    label: 'Policy / Research / Institution Relations',
    mission: '行政、研究、職能団体、支援機関、教育機関との接点を、公式情報と社会実装の橋にする。',
    output: '公式資料の翻訳方針、協力依頼の問い、研究・政策向け説明、検証待ち表示。',
    guardrail: '現行政策、統計、審議会内容、公式見解を未検証で断定しない。',
    branchIds: ['QR-04', 'QR-07', 'QR-08'],
    icon: FileSearch,
  },
  {
    id: 'A11',
    label: 'Business / Partnership / Funding',
    mission: 'Falconの社会的価値を、共同研究、実証、研修、委託、助成、企業連携へ接続する。',
    output: '協力候補、最小実証案、収益化せず始める入口、ビジネス上の仮説。',
    guardrail: '患者・支援団体を顧客扱いしない。未承認プロダクトを売らない。',
    branchIds: ['QR-05', 'QR-07', 'QR-08'],
    icon: BriefcaseBusiness,
  },
  {
    id: 'A12',
    label: 'SNS / Editorial / Creative Studio',
    mission:
      'SNSプロ、編集者、デザイナー、イラストレーターの視点で、社会に届く連載・図解・動画へ磨く。',
    output: '投稿テーマ、hook、本文、図解構造、Image prompt、動画種、反応整理。',
    guardrail: '炎上狙い、断定、個別助言、感動消費、ステレオタイプ画像へ寄せない。',
    branchIds: ['QR-01', 'QR-05', 'QR-08'],
    icon: Megaphone,
  },
];

export const productExperiments: ProductExperiment[] = [
  {
    id: 'PE-01',
    label: 'Public Work Design Map',
    surface: '次期NBLトップ / 社会向け第一接点',
    hypothesis:
      '最初にサービス説明ではなく、仕事の困難を人・仕事・環境・支援・時間・制度の接点として示すと、NBLの独自性が伝わる。',
    firstArtifact: 'トップ初見ビュー、仕事設計マップ、3x7道具箱への導線、1分説明コピー。',
    successSignal:
      '初見読者が「病名別配慮表ではなく、人間の多様性に合わせた仕事設計の地図」と説明できる。',
    hardBoundary: '公開コピー承認、個別相談受付、病名別配慮導線はまだ作らない。',
    branchIds: ['QR-01', 'QR-03', 'QR-08'],
    agentIds: ['A1', 'A3', 'A6', 'A12'],
    icon: Map,
  },
  {
    id: 'PE-02',
    label: 'SNS Structure + Listening Series',
    surface: 'X / LinkedIn / note companion',
    hypothesis:
      'SNSを宣伝ではなく、小さな見方の転換と社会側の問いを受け取る場にすると、Falconの有効な接点が見える。',
    firstArtifact: '6本の連載テーマ、hook、図解種、戻り先、反応分類、返信しない境界。',
    successSignal:
      '反応が相談申込ではなく、追加説明需要、誤解、関心領域、協力候補として分類できる。',
    hardBoundary: '投稿自動公開、政策断定、個別助言、感動・悲劇訴求にしない。',
    branchIds: ['QR-01', 'QR-05', 'QR-06', 'QR-08'],
    agentIds: ['A1', 'A5', 'A6', 'A12'],
    icon: Megaphone,
  },
  {
    id: 'PE-03',
    label: 'Stakeholder Co-Design Room',
    surface: '当事者・家族・支援者・企業レビュー用の内部提示面',
    hypothesis:
      '外部レビューを後付けにせず、見てほしい論点と答えてほしい問いを最初からUIに組み込むと、社会実装の学習速度が上がる。',
    firstArtifact: '6種類のレビューカード、読む順番、確認してほしい問い、記録テンプレート。',
    successSignal: 'レビュー者が「これは承認作業ではなく、設計をよくする共同作業」と理解できる。',
    hardBoundary: 'AIによる仮想当事者レビュー、実在レビュー済み表示、個別ケース収集はしない。',
    branchIds: ['QR-04', 'QR-05', 'QR-06'],
    agentIds: ['A3', 'A6', 'A7', 'A8', 'A9'],
    icon: Handshake,
  },
  {
    id: 'PE-04',
    label: 'Employer / Practitioner Work-Design Studio',
    surface: '企業・支援者・管理職向けの人工シナリオ実験面',
    hypothesis:
      '実在ケースを使わず人工シナリオで仕事接触点を分解すると、企業・支援者が安全にFalconの使い方を試せる。',
    firstArtifact: '人工シナリオ4件、仕事接触点マップ、支援者質問、企業側制約、赤黄緑レビュー。',
    successSignal: '企業・支援者が「正解配慮」ではなく「設計条件の分解」として使える。',
    hardBoundary: '法的安全保証、合理的配慮妥当性判定、実在顧客レビュー、求人・採用助言にしない。',
    branchIds: ['QR-02', 'QR-03', 'QR-07'],
    agentIds: ['A1', 'A4', 'A6', 'A8', 'A9'],
    icon: Building2,
  },
  {
    id: 'PE-05',
    label: 'Policy / Research Translation Desk',
    surface: '公式資料・研究信号と社会側の問いをつなぐ面',
    hypothesis:
      '公式資料をそのまま紹介せず、仕事設計への意味、限界、未検証箇所を分けると、政策・研究と現場の橋になる。',
    firstArtifact:
      'NIVR/MHLW/JEED信号ノートの型、live verification待ち表示、SNS化条件、協力依頼文。',
    successSignal:
      '読者が「制度の正解」ではなく「仕事設計で見る問い」として受け取り、研究・政策側の接点が生まれる。',
    hardBoundary: '現行制度・統計・審議会内容の未検証断定、公式見解の代替をしない。',
    branchIds: ['QR-04', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A2', 'A6', 'A10'],
    icon: FileSearch,
  },
  {
    id: 'PE-06',
    label: 'Partnership / Business Experiment Pipeline',
    surface: '共同研究・研修・実証・委託・助成への接続面',
    hypothesis:
      'NBLの専門性を「相談受付」だけにせず、社会実装の協力テーマへ翻訳すると、Falconの価値が継続的な事業・研究・実証になる。',
    firstArtifact: '協力テーマ6件、対象パートナー、最小実証、NBLが提供するもの、提供しないもの。',
    successSignal: '協力候補が、販売されるサービスではなく共同実装の入口として理解できる。',
    hardBoundary:
      '未承認プロダクト販売、患者・団体の顧客化、成果保証、助成・委託の確約表現にしない。',
    branchIds: ['QR-05', 'QR-07', 'QR-08'],
    agentIds: ['A1', 'A6', 'A10', 'A11', 'A12'],
    icon: BriefcaseBusiness,
  },
];

export const branchLookup = contextBranchGroups
  .flatMap((group) => group.branches)
  .reduce<Record<string, ContextBranch>>((acc, branch) => {
    acc[branch.id] = branch;
    return acc;
  }, {});

export const boundaryChecks = [
  {
    label: '判断しない',
    text: '診断、就労可否、配慮可否、雇用上の行動、法的評価は出さない。',
    icon: ShieldCheck,
  },
  {
    label: '未レビューを明示する',
    text: 'Stage 1/2/3の候補ネットワークであり、知識昇格や公開承認ではない。',
    icon: FileSearch,
  },
  {
    label: '入力を絞る',
    text: 'この内部プロトタイプは自由記述を受け取らず、チェック選択だけを扱う。',
    icon: ClipboardList,
  },
  {
    label: '保存を限定する',
    text: '保存はブラウザ内の選択状態のみ。サーバー送信や学習更新は行わない。',
    icon: TimerReset,
  },
  {
    label: '公式資料を昇格しない',
    text: '厚労省等の公式資料は政策文脈として扱い、source validityや法的解釈を決めない。',
    icon: Stethoscope,
  },
  {
    label: '社会接点へ戻す',
    text: 'SNSや公開コピーは結論で終えず、自己評価、仕事再設計、公的情報確認へ戻す。',
    icon: Building2,
  },
];
