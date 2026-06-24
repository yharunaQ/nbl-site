import {
  buildAxiomKernelCorpusHumanReviewPacket,
  validateAxiomKernelCorpusHumanReviewPacket,
  type AxiomKernelCorpusHumanReviewPacket,
  type AxiomKernelCorpusHumanReviewUnit,
} from './kernelCorpusHumanReviewPacket';
import {
  buildAxiomKernelCorpusReviewReadoutAdapter,
  type AxiomKernelCorpusReviewReadoutAdapter,
  type AxiomKernelCorpusReviewReadoutRow,
} from './kernelCorpusReviewReadoutAdapter';
import { type AxiomCoreProgressClass } from './interactionHypothesisKernelContract';
import {
  type AxiomRealDerivedEvidencePacket,
} from './interactionHypothesisKernelRealDerivedEvidenceProtocol';
import {
  runAxiomRealDataScaleUpIntegrationRun,
} from './realDataScaleUpIntegrationRun';
import {
  buildAxiomSourceFamilyScaleUpWave2Attachment,
} from './sourceFamilyScaleUpWave2';
import {
  buildAxiomManualDocumentSourceFamilyAttachment,
} from './manualDocumentSourceFamilyAttachment';

export const AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_VERSION = 'v0_2026_06_08' as const;

export const AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_BOUNDARY =
  'axiom_kernel_corpus_human_review_tool_is_local_internal_review_aid_not_review_execution_submission_or_approval' as const;

export const AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_CORE_PROGRESS_CLASSES = [
  'kernel_human_review_loop',
  'kernel_display',
] as const satisfies readonly AxiomCoreProgressClass[];

export type AxiomKernelCorpusHumanReviewDecisionOption =
  | 'accept_as_provisional_kernel_structure'
  | 'revise_kernel_fields_before_review_result'
  | 'hold_for_missing_context_or_source_lens'
  | 'external_review_required_before_any_promotion';

export type AxiomKernelCorpusHumanReviewToolDossierRow = {
  rowId: string;
  packetId: string;
  scenarioId: string;
  scenarioLabelJa: string;
  sourceFamilyLabelsJa: string[];
  actionabilityBand: AxiomKernelCorpusReviewReadoutRow['actionabilityBand'];
  dataPolicyNote: string;
  evidenceSpanSummaries: string[];
  observations: string[];
  inference: string;
  counterHypotheses: string[];
  missingContextQuestions: string[];
  implementationActorConditions: string[];
  sourceLensStatusSummary: string[];
  cannotYetSay: string[];
};

export type AxiomKernelCorpusHumanReviewToolDossier = {
  titleJa: string;
  shortPurposeJa: string;
  reviewQuestionJa: string;
  acceptIfJa: string;
  reviseIfJa: string;
  holdIfJa: string;
  whatReviewerReadsJa: string;
  whyThisMattersJa: string;
  includedScenarioLabelsJa: string[];
  includedSourceFamilyLabelsJa: string[];
  reviewerMustJudgeJa: string[];
  reviewerMustNotJudgeJa: string[];
  rows: AxiomKernelCorpusHumanReviewToolDossierRow[];
};

export type AxiomKernelCorpusHumanReviewToolUnit = {
  toolUnitId: string;
  sourceReviewUnitId: string;
  unitType: AxiomKernelCorpusHumanReviewUnit['unitType'];
  reviewDossier: AxiomKernelCorpusHumanReviewToolDossier;
  reviewQuestion: string;
  rowCount: number;
  scenarioIds: string[];
  sourceFamilyEntryIds: string[];
  kernelFieldsInScope: string[];
  checklistLabels: string[];
  decisionOptions: AxiomKernelCorpusHumanReviewDecisionOption[];
  defaultDecision: 'external_review_required_before_any_promotion';
  noteFields: Array<
    | 'reviewer_name_or_role'
    | 'decision_reason'
    | 'required_revision'
    | 'missing_context_to_check'
    | 'source_lens_or_bias_risk'
    | 'promotion_blocker'
  >;
  inputStatus: 'blank_for_human_review';
  outputStatus: 'not_submitted_not_recorded';
};

export type AxiomKernelCorpusHumanReviewReceiptTemplateUnit = {
  sourceReviewUnitId: string;
  selectedDecision: 'unfilled';
  reviewerNameOrRole: '';
  decisionReason: '';
  requiredRevision: '';
  missingContextToCheck: '';
  sourceLensOrBiasRisk: '';
  promotionBlocker: '';
  reviewResultStatus: 'not_recorded';
};

export type AxiomKernelCorpusHumanReviewTool = {
  toolId: string;
  objectType: 'axiom_kernel_corpus_human_review_tool';
  contractVersion: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_VERSION;
  lane: 'Falcon Lab';
  status: 'human_review_tool_prepared_input_only_not_submitted';
  boundary: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_CORE_PROGRESS_CLASSES;
  sourcePacketId: string;
  sourcePacketStatus: AxiomKernelCorpusHumanReviewPacket['status'];
  unitCount: number;
  maxCoreHumanReviewUnits: 100;
  totalKernelRows: 15;
  sourceFamilyCount: 10;
  scenarioCount: 5;
  reviewExecutionStatus: 'not_executed';
  reviewerAssignmentStatus: 'not_assigned_by_codex';
  submissionStatus: 'not_submitted';
  persistenceStatus: 'not_persisted_no_db_or_api';
  approvalStatus: 'not_approved';
  publicationStatus: 'not_published';
  receiptTemplateStatus: 'blank_template_only_not_received';
  units: AxiomKernelCorpusHumanReviewToolUnit[];
  receiptTemplate: {
    packetId: string;
    sourcePacketId: string;
    receiptStatus: 'blank_not_received';
    reviewerSummary: '';
    overallDecision: 'unfilled';
    unitResults: AxiomKernelCorpusHumanReviewReceiptTemplateUnit[];
    movementBoundary: AxiomKernelCorpusHumanReviewPacket['movementBoundary'];
  };
  notNow: string[];
};

export type AxiomKernelCorpusHumanReviewToolValidation = {
  valid: boolean;
  validationStatus:
    | 'kernel_corpus_human_review_tool_valid'
    | 'kernel_corpus_human_review_tool_invalid';
  errorCount: number;
  errors: string[];
  boundary: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_BOUNDARY;
  strengthensCore: typeof AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_CORE_PROGRESS_CLASSES;
};

const DECISION_OPTIONS: AxiomKernelCorpusHumanReviewDecisionOption[] = [
  'accept_as_provisional_kernel_structure',
  'revise_kernel_fields_before_review_result',
  'hold_for_missing_context_or_source_lens',
  'external_review_required_before_any_promotion',
];

const NOTE_FIELDS: AxiomKernelCorpusHumanReviewToolUnit['noteFields'] = [
  'reviewer_name_or_role',
  'decision_reason',
  'required_revision',
  'missing_context_to_check',
  'source_lens_or_bias_risk',
  'promotion_blocker',
];

const SCENARIO_LABELS_JA: Record<string, string> = {
  l3_health_time_accommodation_lookup_trap_v0:
    '健康・時間・配慮を病名 lookup にしない見立て',
  l3_disclosure_information_procedure_boundary_v0:
    '開示・情報・手順境界を分ける見立て',
  l3_policy_service_coordination_source_lens_v0:
    '政策・サービス連携をsource lens込みで読む見立て',
  l3_public_condition_window_non_lookup_v0:
    '公開向けcondition windowを非lookupで読む見立て',
  l3_post_hiring_quality_evaluation_loop_v0:
    '採用後の質・評価・改善ループを読む見立て',
};

const SOURCE_FAMILY_LABELS_JA: Record<string, string> = {
  source_family_respondent_surveys_3000_4000:
    '当事者調査データ 3000-4000: respondent reality-shadow',
  source_family_supporter_practice:
    '支援者実践データ: supporter practice lens',
  source_family_workplace_surveys:
    '職場側調査データ: workplace / employer lens',
  source_family_workshop_practice_knowledge:
    'ワークショップ実践知: implementation / learning lens',
  source_family_domestic_web_cache:
    '国内web-cache/公的・準公的情報: source-lens evidence',
  source_family_international_web_cache:
    '海外web-cache/国際資料: comparative source-lens evidence',
  source_family_historical_2001_abc:
    '2001 ABC historical layer: historical contrast lens',
  source_family_stage1_scima_fchma_derived:
    'Stage 1 SCIMA/FCHMA derived outputs',
  source_family_l3_ft03_review_frames:
    'L3 21視点 / FT03 review frames',
  source_family_manuals_and_documents:
    'マニュアル・長文資料: document source-family lens',
};

const REVIEW_UNIT_LABELS_JA: Record<
  string,
  {
    titleJa: string;
    shortPurposeJa: string;
    reviewQuestionJa: string;
    acceptIfJa: string;
    reviseIfJa: string;
    holdIfJa: string;
    focusJa: string[];
  }
> = {
  review_unit_kernel_contract: {
    titleJa: 'Kernelの基本契約が守られているか',
    shortPurposeJa:
      '観察、推論、反対仮説、missing context、cannot yet sayが混ざらず、別々の欄として機能しているかを見る。',
    reviewQuestionJa:
      '8件のkernel rowを横断して、Axiomが「見たこと」と「推測したこと」と「まだ分からないこと」を分けて扱えているか。',
    acceptIfJa:
      '観察から推論への橋渡しが読め、反対仮説とmissing contextが隠れず、まだ言えないことが明示されている。',
    reviseIfJa:
      '観察と推論が混ざっている、反対仮説が弱い、missing contextが一般的すぎる、cannot yet sayが形式文になっている。',
    holdIfJa:
      'source lensの不足や根拠の飛躍が大きく、暫定kernel構造としても受け入れにくい。',
    focusJa: [
      '観察と推論が混線していないか',
      '反対仮説とmissing contextが弱さとして見えているか',
      'kernel objectが最終助言や公開コピーになっていないか',
    ],
  },
  review_unit_actionability_bands: {
    titleJa: 'Actionability bandが強すぎないか',
    shortPurposeJa:
      '暫定的に使える見立て、質問優先、保留の線引きが、助言の確信度に化けていないかを見る。',
    reviewQuestionJa:
      '各rowのactionability bandが、根拠の強さではなく「今どこまで使ってよいか」の線引きとして妥当か。',
    acceptIfJa:
      'usable / question-first / holdの違いが、missing contextとactor条件に基づいて説明できる。',
    reviseIfJa:
      'bandが強すぎる、弱すぎる、または助言の確信度のように見える。',
    holdIfJa:
      'どの条件を満たせば次のbandへ進むのかが読めない。',
    focusJa: [
      'bandが根拠・missing context・actor条件から出ているか',
      'public/useやsupport validityへ滑っていないか',
      'holdすべき単位がusableに過大評価されていないか',
    ],
  },
  review_unit_l3_principal_pattern_family: {
    titleJa: 'L3 21視点が仮説候補として扱われているか',
    shortPurposeJa:
      'L3 principal patternをAxiom truthではなく、評価・照合・圧縮レビューの候補として使えているかを見る。',
    reviewQuestionJa:
      'L3 21視点が、答えそのものではなく、kernel rowを読むための仮説候補として使われているか。',
    acceptIfJa:
      'L3 IDが推論の足場として使われ、source familyやscenarioとの接続が読める。',
    reviseIfJa:
      'L3 IDがラベル貼りだけになっている、またはAxiom core truthのように扱われている。',
    holdIfJa:
      'どのL3視点が何を説明しているのか、人間が追えない。',
    focusJa: [
      'L3 IDが教義化していないか',
      '見立てがsource familyとscenarioの両方に結び付いているか',
      'candidate pattern昇格が止まっているか',
    ],
  },
  review_unit_cross_cutting_check_family: {
    titleJa: '横断チェックがFalcon型の弱点を止めているか',
    shortPurposeJa:
      '病名lookup、source-lens平板化、公開境界 drift、最終判断化を止める横断チェックを見る。',
    reviewQuestionJa:
      '各rowが、病名lookup・公的資料の過信・公開境界の緩み・最終判断化を避けているか。',
    acceptIfJa:
      '疾患名や制度名から支援結論へ短絡せず、別解・限界・確認質問が残っている。',
    reviseIfJa:
      '見立てが便利な結論に寄りすぎている、またはsource lensの違いが消えている。',
    holdIfJa:
      '公開・支援妥当性・法務/医療/雇用判断に滑る危険が高い。',
    focusJa: [
      '疾患名から配慮へ短絡していないか',
      '公的資料やweb-cacheを現在有効な支援判断にしていないか',
      '公開・runtime・learning境界が止まっているか',
    ],
  },
  review_unit_source_lens_status: {
    titleJa: 'Source lensの違いと欠落が見えているか',
    shortPurposeJa:
      'respondent / supporter / external evidence / implementation actorの違いと薄さを隠していないかを見る。',
    reviewQuestionJa:
      '当事者データ、支援者データ、外部資料、実装主体条件のどれが濃く、どれが薄いかが見えるか。',
    acceptIfJa:
      'lensごとの有無・薄さ・bootstrap扱いが明示され、薄いlensを一般論で埋めていない。',
    reviseIfJa:
      '複数sourceが一枚岩に見える、または薄いsource lensが強い根拠のように見える。',
    holdIfJa:
      'どのsource lensから来た見立てなのか判別できない。',
    focusJa: [
      'どのlensが濃く、どのlensが薄いか',
      '薄いlensを一般論で補っていないか',
      'source/support validityを未決のまま保てているか',
    ],
  },
  review_unit_implementation_actor_conditions: {
    titleJa: '実装主体条件が見立てに入っているか',
    shortPurposeJa:
      '誰が何を確認・変更・判断できる条件が必要かを、個人側だけに寄せずに読めているかを見る。',
    reviewQuestionJa:
      'worker、employer、support staff、public actor、reviewerなど、誰の条件が必要かが見立てに入っているか。',
    acceptIfJa:
      '見立てが個人特性だけでなく、職場・支援・制度・評価・時間条件に接続している。',
    reviseIfJa:
      '実装主体が曖昧、または「本人が頑張る/支援者が配慮する」程度に縮んでいる。',
    holdIfJa:
      '誰が何を変えられるのかが読めず、実装条件として使えない。',
    focusJa: [
      'worker / employer / support staff / public actor / reviewerの条件が見えるか',
      '支援策ではなく、実装前提条件として書かれているか',
      'actor条件がmissing contextと接続しているか',
    ],
  },
  review_unit_review_driven_promotion_gate: {
    titleJa: 'Review-driven promotion gateが本当にgateになっているか',
    shortPurposeJa:
      'source/support validity、candidate_pattern、runtime/public approval、publication、learning updateが人間レビューまで止まるかを見る。',
    reviewQuestionJa:
      'この単位を見れば、何が暫定利用でき、何が人間レビューまで止まるのかが明確に分かるか。',
    acceptIfJa:
      '暫定仮説生成やmissing context質問生成は止めず、promotionや公開やlearning updateだけが止まっている。',
    reviseIfJa:
      'レビューが何でも止める官僚的gateに見える、または逆にpromotionを止めきれていない。',
    holdIfJa:
      'レビュー前にsource/support validityやpublic/runtime/learningへ進めそうな抜け道がある。',
    focusJa: [
      'レビュー結果なしに昇格する経路がないか',
      '個別仮説ではなく圧縮単位でレビューできるか',
      '暫定仮説生成やmissing context質問生成は止めていないか',
    ],
  },
  review_unit_cannot_yet_say_boundary: {
    titleJa: 'Cannot-yet-say境界が十分に明示されているか',
    shortPurposeJa:
      'まだ言えないことが、医療・法務・雇用・配慮・支援妥当性・公開・学習更新に分かれているかを見る。',
    reviewQuestionJa:
      'このkernelが「まだ言えないこと」を、実質的な限界として具体的に書けているか。',
    acceptIfJa:
      '医療・法務・雇用・配慮・支援妥当性・公開・runtime・learningの未決事項が区別されている。',
    reviseIfJa:
      'cannot yet sayが定型文だけで、何を保留するのかが具体的でない。',
    holdIfJa:
      'まだ言えない境界が曖昧で、誤って公開・助言・妥当性判断に使われそう。',
    focusJa: [
      '「まだ言えない」が形式文でなく実質的なblockerになっているか',
      'public copyや相談助言に使えない理由が明確か',
      '次に何を確認すれば進めるかが見えるか',
    ],
  },
};

function scenarioLabelJa(scenarioId: string) {
  return SCENARIO_LABELS_JA[scenarioId] ?? scenarioId;
}

function sourceFamilyLabelJa(sourceFamilyEntryId: string) {
  return SOURCE_FAMILY_LABELS_JA[sourceFamilyEntryId] ?? sourceFamilyEntryId;
}

function pushIf(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function buildEvidencePacketMap() {
  const packets = new Map<string, AxiomRealDerivedEvidencePacket>();
  const integrationRun = runAxiomRealDataScaleUpIntegrationRun();
  const wave2Attachment = buildAxiomSourceFamilyScaleUpWave2Attachment();
  const manualAttachment = buildAxiomManualDocumentSourceFamilyAttachment();

  for (const run of integrationRun.integratedBatchRun.runs) {
    packets.set(run.evidencePacket.packetId, run.evidencePacket);
  }
  for (const run of wave2Attachment.wave2BatchRun.runs) {
    packets.set(run.evidencePacket.packetId, run.evidencePacket);
  }
  for (const run of manualAttachment.manualDocumentBatchRun.runs) {
    packets.set(run.evidencePacket.packetId, run.evidencePacket);
  }

  return packets;
}

function sourceLensStatusSummary(packet: AxiomRealDerivedEvidencePacket): string[] {
  return Object.values(packet.sourceLensStatus).map(
    (status) => `${status.lens}: ${status.status} / ${status.note}`,
  );
}

function dossierRowsForUnit(
  unit: AxiomKernelCorpusHumanReviewUnit,
  adapter: AxiomKernelCorpusReviewReadoutAdapter,
  evidencePackets: Map<string, AxiomRealDerivedEvidencePacket>,
): AxiomKernelCorpusHumanReviewToolDossierRow[] {
  const adapterRowsById = new Map(adapter.rows.map((row) => [row.rowId, row]));

  return unit.rowIds.map((rowId) => {
    const row = adapterRowsById.get(rowId);
    if (!row) {
      return {
        rowId,
        packetId: 'missing_packet',
        scenarioId: 'missing_scenario',
        scenarioLabelJa: 'missing scenario',
        sourceFamilyLabelsJa: [],
        actionabilityBand: 'hold_or_research_needed',
        dataPolicyNote: 'adapter row was not found',
        evidenceSpanSummaries: [],
        observations: [],
        inference: 'adapter row was not found',
        counterHypotheses: [],
        missingContextQuestions: [],
        implementationActorConditions: [],
        sourceLensStatusSummary: [],
        cannotYetSay: [],
      };
    }

    const packet = evidencePackets.get(row.packetId);

    return {
      rowId,
      packetId: row.packetId,
      scenarioId: row.scenarioId,
      scenarioLabelJa: scenarioLabelJa(row.scenarioId),
      sourceFamilyLabelsJa: row.sourceFamilyEntryIds.map(sourceFamilyLabelJa),
      actionabilityBand: row.actionabilityBand,
      dataPolicyNote: packet?.dataPolicy.note ?? 'evidence packet summary unavailable',
      evidenceSpanSummaries: packet?.evidenceSpans.map((span) => span.summary) ?? [],
      observations: packet?.observationCandidates.map((observation) => observation.text) ?? [],
      inference: packet?.inferenceCandidate.text ?? 'inference summary unavailable',
      counterHypotheses: packet?.counterHypothesis.map((counter) => counter.text) ?? [],
      missingContextQuestions:
        packet?.missingContext.map((context) => `${context.slot}: ${context.question}`) ?? [],
      implementationActorConditions:
        packet?.implementationActorConditions.map(
          (condition) => `${condition.actor}: ${condition.condition}`,
        ) ?? [],
      sourceLensStatusSummary: packet ? sourceLensStatusSummary(packet) : [],
      cannotYetSay: packet?.cannotYetSay ?? [],
    };
  });
}

function reviewUnitLabel(unit: AxiomKernelCorpusHumanReviewUnit) {
  if (unit.unitType === 'source_family_coverage_review') {
    return {
      titleJa: '10系統の実データがcoreに痩せずに入っているか',
      shortPurposeJa:
        '完璧なデータだけを入れる設計ではなく、不完全な実データを現実の影として読み、ただしsource/support validityは未決のまま保つ。',
      reviewQuestionJa:
        '10系統の実データが、完璧性を要求されて排除されず、現実の影としてkernel groundingに使われているか。',
      acceptIfJa:
        '10系統が represented として見え、弱さはmissing contextやsource lensに残っている。',
      reviseIfJa:
        '特定source familyの弱さが消えている、または強い妥当性に見えてしまう。',
      holdIfJa:
        'どのsource familyが何を支えているか、人間が確認できない。',
      focusJa: [
        '10個のcore-eligible source familyが表現されているか',
        'source familyごとの弱さ・欠落・lens差が隠れていないか',
        'delivery layerをcore truthに混ぜていないか',
      ],
    };
  }

  if (unit.unitType === 'cross_corpus_boundary_review') {
    return {
      titleJa: '15件corpus全体の境界が崩れていないか',
      shortPurposeJa:
        'raw/source text、field value、public recommendation、source/support validityを隠し、内部kernel reviewに留められているかを見る。',
      reviewQuestionJa:
        '15件corpus全体で、Axiom core truthとFalcon/Heron delivery layerや公開候補が混ざっていないか。',
      acceptIfJa:
        '内部kernel表示・レビュー準備だけが進み、公開・runtime・learning・validityは止まっている。',
      reviseIfJa:
        '公開ページやSNS進捗やpayload shellが、core truthのように見える。',
      holdIfJa:
        '境界が曖昧で、次の作業者が公開・promotionへ進めてしまいそう。',
      focusJa: [
        'Falcon/Heron公開面やSNS進捗がAxiom core truthに混入していないか',
        'レビュー前にpromotion・public・runtime・learningが動く経路がないか',
        '暫定kernel workだけは止めずに進められるか',
      ],
    };
  }

  return (
    REVIEW_UNIT_LABELS_JA[(unit.sourceReviewUnitId ?? '').replace(/^promotion_/, '')] ?? {
      titleJa: unit.sourceReviewUnitId ?? unit.unitId,
      shortPurposeJa: 'この圧縮レビュー単位に含まれるkernel rowsの暫定見立てを確認する。',
      reviewQuestionJa:
        'この圧縮レビュー単位の見立てが、人間に読める暫定kernel構造になっているか。',
      acceptIfJa: '観察・推論・反対仮説・missing context・境界が追える。',
      reviseIfJa: '何を見ればよいか、または何を直せばよいかが曖昧。',
      holdIfJa: '暫定kernel構造としても読めない。',
      focusJa: [
        'observationからinferenceへの橋渡しが妥当か',
        'counterHypothesisとmissingContextが十分か',
        'promotion前に人間レビューが必要な状態を保てているか',
      ],
    }
  );
}

function buildReviewDossier(
  unit: AxiomKernelCorpusHumanReviewUnit,
  adapter: AxiomKernelCorpusReviewReadoutAdapter,
  evidencePackets: Map<string, AxiomRealDerivedEvidencePacket>,
): AxiomKernelCorpusHumanReviewToolDossier {
  const label = reviewUnitLabel(unit);
  const rows = dossierRowsForUnit(unit, adapter, evidencePackets);

  return {
    titleJa: label.titleJa,
    shortPurposeJa: label.shortPurposeJa,
    reviewQuestionJa: label.reviewQuestionJa,
    acceptIfJa: label.acceptIfJa,
    reviseIfJa: label.reviseIfJa,
    holdIfJa: label.holdIfJa,
    whatReviewerReadsJa:
      '以下のderived evidence packet / grounded kernel rowを読み、観察から推論への飛躍、反対仮説、missing context、source lensの薄さ、actionability bandの強さを確認する。',
    whyThisMattersJa:
      'ここで見るのは個別仮説数百件ではなく、Axiom coreに入る見立ての圧縮単位です。この単位が読めないと、人間レビューは形式だけになり、Falconの未完kernel問題が再発します。',
    includedScenarioLabelsJa: unique(rows.map((row) => row.scenarioLabelJa)),
    includedSourceFamilyLabelsJa: unique(rows.flatMap((row) => row.sourceFamilyLabelsJa)),
    reviewerMustJudgeJa: [
      ...label.focusJa,
      'この単位を暫定kernel構造として受け入れるか、修正するか、missing context/source lens確認までholdするか',
    ],
    reviewerMustNotJudgeJa: [
      'source/support validityの最終判断',
      'candidate_pattern昇格',
      'runtime/public approval',
      'publication',
      'learning update',
    ],
    rows,
  };
}

function unitToToolUnit(
  unit: AxiomKernelCorpusHumanReviewUnit,
  adapter: AxiomKernelCorpusReviewReadoutAdapter,
  evidencePackets: Map<string, AxiomRealDerivedEvidencePacket>,
): AxiomKernelCorpusHumanReviewToolUnit {
  return {
    toolUnitId: `tool_${unit.unitId}`,
    sourceReviewUnitId: unit.unitId,
    unitType: unit.unitType,
    reviewDossier: buildReviewDossier(unit, adapter, evidencePackets),
    reviewQuestion: unit.reviewQuestion,
    rowCount: unit.rowCount,
    scenarioIds: [...unit.scenarioIds],
    sourceFamilyEntryIds: [...unit.sourceFamilyEntryIds],
    kernelFieldsInScope: [...unit.kernelFieldsInScope],
    checklistLabels: unit.readableChecklist.map((item) => item.label),
    decisionOptions: [...DECISION_OPTIONS],
    defaultDecision: 'external_review_required_before_any_promotion',
    noteFields: [...NOTE_FIELDS],
    inputStatus: 'blank_for_human_review',
    outputStatus: 'not_submitted_not_recorded',
  };
}

function unitToReceiptTemplate(
  unit: AxiomKernelCorpusHumanReviewUnit,
): AxiomKernelCorpusHumanReviewReceiptTemplateUnit {
  return {
    sourceReviewUnitId: unit.unitId,
    selectedDecision: 'unfilled',
    reviewerNameOrRole: '',
    decisionReason: '',
    requiredRevision: '',
    missingContextToCheck: '',
    sourceLensOrBiasRisk: '',
    promotionBlocker: '',
    reviewResultStatus: 'not_recorded',
  };
}

export function buildAxiomKernelCorpusHumanReviewTool(
  packet: AxiomKernelCorpusHumanReviewPacket = buildAxiomKernelCorpusHumanReviewPacket(),
  adapter: AxiomKernelCorpusReviewReadoutAdapter = buildAxiomKernelCorpusReviewReadoutAdapter(),
): AxiomKernelCorpusHumanReviewTool {
  const evidencePackets = buildEvidencePacketMap();

  return {
    toolId: `axiom_kernel_corpus_human_review_tool_from_${packet.packetId}`,
    objectType: 'axiom_kernel_corpus_human_review_tool',
    contractVersion: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_VERSION,
    lane: 'Falcon Lab',
    status: 'human_review_tool_prepared_input_only_not_submitted',
    boundary: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_CORE_PROGRESS_CLASSES],
    sourcePacketId: packet.packetId,
    sourcePacketStatus: packet.status,
    unitCount: packet.unitCount,
    maxCoreHumanReviewUnits: 100,
    totalKernelRows: 15,
    sourceFamilyCount: 10,
    scenarioCount: 5,
    reviewExecutionStatus: 'not_executed',
    reviewerAssignmentStatus: 'not_assigned_by_codex',
    submissionStatus: 'not_submitted',
    persistenceStatus: 'not_persisted_no_db_or_api',
    approvalStatus: 'not_approved',
    publicationStatus: 'not_published',
    receiptTemplateStatus: 'blank_template_only_not_received',
    units: packet.units.map((unit) => unitToToolUnit(unit, adapter, evidencePackets)),
    receiptTemplate: {
      packetId: `blank_receipt_template_for_${packet.packetId}`,
      sourcePacketId: packet.packetId,
      receiptStatus: 'blank_not_received',
      reviewerSummary: '',
      overallDecision: 'unfilled',
      unitResults: packet.units.map(unitToReceiptTemplate),
      movementBoundary: { ...packet.movementBoundary },
    },
    notNow: [
      'no_form_submission_or_ingestion',
      'no_review_execution_by_codex',
      'no_reviewer_assignment_by_codex',
      'no_review_result_recorded',
      'no_source_or_support_validity_decision',
      'no_candidate_pattern_movement',
      'no_public_approval_or_publication',
      'no_runtime_prompt_retrieval_model_provider_db_schema_change',
      'no_learning_update',
      ...packet.notNow,
    ],
  };
}

export function validateAxiomKernelCorpusHumanReviewTool(
  tool: AxiomKernelCorpusHumanReviewTool,
  packet: AxiomKernelCorpusHumanReviewPacket = buildAxiomKernelCorpusHumanReviewPacket(),
): AxiomKernelCorpusHumanReviewToolValidation {
  const errors: string[] = [];
  const packetValidation = validateAxiomKernelCorpusHumanReviewPacket(packet);
  const toolSourceUnitIds = new Set(tool.units.map((unit) => unit.sourceReviewUnitId));
  const receiptSourceUnitIds = new Set(
    tool.receiptTemplate.unitResults.map((unit) => unit.sourceReviewUnitId),
  );

  pushIf(!packetValidation.valid, errors, 'source_human_review_packet_must_be_valid');
  pushIf(
    tool.objectType !== 'axiom_kernel_corpus_human_review_tool',
    errors,
    'object_type_must_match_kernel_corpus_human_review_tool',
  );
  pushIf(
    tool.contractVersion !== AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_VERSION,
    errors,
    'contract_version_must_match_kernel_corpus_human_review_tool_v0_2026_06_08',
  );
  pushIf(tool.lane !== 'Falcon Lab', errors, 'lane_must_remain_falcon_lab');
  pushIf(
    tool.status !== 'human_review_tool_prepared_input_only_not_submitted',
    errors,
    'status_must_remain_input_only_not_submitted',
  );
  pushIf(
    tool.boundary !== AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_BOUNDARY,
    errors,
    'boundary_must_remain_review_aid_not_execution_submission_or_approval',
  );
  pushIf(tool.sourcePacketId !== packet.packetId, errors, 'source_packet_id_mismatch');
  pushIf(
    tool.sourcePacketStatus !== 'compressed_human_review_packet_prepared_not_executed',
    errors,
    'source_packet_status_must_be_prepared_not_executed',
  );
  pushIf(
    tool.unitCount !== packet.unitCount ||
      tool.units.length !== packet.units.length ||
      tool.unitCount > tool.maxCoreHumanReviewUnits,
    errors,
    'tool_unit_count_must_match_packet_and_stay_under_100',
  );
  pushIf(
    tool.totalKernelRows !== 15 || tool.sourceFamilyCount !== 10 || tool.scenarioCount !== 5,
    errors,
    'tool_summary_must_anchor_to_15_rows_10_source_families_5_scenarios',
  );
  pushIf(
    tool.reviewExecutionStatus !== 'not_executed' ||
      tool.reviewerAssignmentStatus !== 'not_assigned_by_codex' ||
      tool.submissionStatus !== 'not_submitted' ||
      tool.persistenceStatus !== 'not_persisted_no_db_or_api' ||
      tool.approvalStatus !== 'not_approved' ||
      tool.publicationStatus !== 'not_published' ||
      tool.receiptTemplateStatus !== 'blank_template_only_not_received',
    errors,
    'tool_must_not_execute_assign_submit_persist_approve_publish_or_receive_receipt',
  );

  for (const packetUnit of packet.units) {
    pushIf(
      !toolSourceUnitIds.has(packetUnit.unitId),
      errors,
      `tool_unit_missing_for_packet_unit:${packetUnit.unitId}`,
    );
    pushIf(
      !receiptSourceUnitIds.has(packetUnit.unitId),
      errors,
      `receipt_template_unit_missing_for_packet_unit:${packetUnit.unitId}`,
    );
  }

  for (const unit of tool.units) {
    pushIf(
      unit.decisionOptions.join('|') !== DECISION_OPTIONS.join('|'),
      errors,
      `unit_decision_options_must_match_standard_options:${unit.toolUnitId}`,
    );
    pushIf(
      unit.defaultDecision !== 'external_review_required_before_any_promotion',
      errors,
      `unit_default_decision_must_block_promotion:${unit.toolUnitId}`,
    );
    pushIf(
      unit.noteFields.join('|') !== NOTE_FIELDS.join('|'),
      errors,
      `unit_note_fields_must_match_review_tool_fields:${unit.toolUnitId}`,
    );
    pushIf(
      unit.inputStatus !== 'blank_for_human_review' ||
        unit.outputStatus !== 'not_submitted_not_recorded',
      errors,
      `unit_must_remain_blank_not_submitted:${unit.toolUnitId}`,
    );
    pushIf(unit.checklistLabels.length === 0, errors, `unit_checklist_required:${unit.toolUnitId}`);
    pushIf(
      !unit.reviewDossier.titleJa ||
        !unit.reviewDossier.shortPurposeJa ||
        unit.reviewDossier.rows.length !== unit.rowCount,
      errors,
      `unit_review_dossier_must_explain_review_target:${unit.toolUnitId}`,
    );
    pushIf(
      unit.reviewDossier.reviewerMustJudgeJa.length === 0 ||
        unit.reviewDossier.reviewerMustNotJudgeJa.length === 0,
      errors,
      `unit_review_dossier_must_name_decisions_and_non_decisions:${unit.toolUnitId}`,
    );
    for (const row of unit.reviewDossier.rows) {
      pushIf(!row.scenarioLabelJa, errors, `dossier_row_scenario_label_required:${row.rowId}`);
      pushIf(
        row.sourceFamilyLabelsJa.length === 0,
        errors,
        `dossier_row_source_family_label_required:${row.rowId}`,
      );
      pushIf(
        row.observations.length === 0 || !row.inference || row.counterHypotheses.length === 0,
        errors,
        `dossier_row_kernel_content_required:${row.rowId}`,
      );
      pushIf(
        row.missingContextQuestions.length === 0 ||
          row.sourceLensStatusSummary.length === 0 ||
          row.cannotYetSay.length === 0,
        errors,
        `dossier_row_limits_required:${row.rowId}`,
      );
    }
  }

  pushIf(
    tool.receiptTemplate.receiptStatus !== 'blank_not_received' ||
      tool.receiptTemplate.reviewerSummary !== '' ||
      tool.receiptTemplate.overallDecision !== 'unfilled' ||
      tool.receiptTemplate.unitResults.length !== packet.units.length,
    errors,
    'receipt_template_must_remain_blank_not_received',
  );
  pushIf(
    tool.receiptTemplate.movementBoundary.sourceValidity !== 'not_decided' ||
      tool.receiptTemplate.movementBoundary.supportValidity !== 'not_decided' ||
      tool.receiptTemplate.movementBoundary.candidatePattern !== 'not_candidate_pattern' ||
      tool.receiptTemplate.movementBoundary.runtimeApproved !== 'not_approved' ||
      tool.receiptTemplate.movementBoundary.publicApproved !== 'not_approved' ||
      tool.receiptTemplate.movementBoundary.publicRelease !== 'not_approved' ||
      tool.receiptTemplate.movementBoundary.publication !== 'not_published' ||
      tool.receiptTemplate.movementBoundary.knowledgePromotion !== 'not_promoted' ||
      tool.receiptTemplate.movementBoundary.learningUpdate !== 'not_promoted',
    errors,
    'receipt_template_must_not_move_validity_public_promotion_or_learning',
  );
  pushIf(
    !tool.notNow.includes('no_form_submission_or_ingestion') ||
      !tool.notNow.includes('no_review_execution_by_codex') ||
      !tool.notNow.includes('no_source_or_support_validity_decision') ||
      !tool.notNow.includes('no_runtime_prompt_retrieval_model_provider_db_schema_change') ||
      !tool.notNow.includes('no_learning_update'),
    errors,
    'tool_not_now_must_block_submission_review_validity_runtime_and_learning',
  );

  return {
    valid: errors.length === 0,
    validationStatus:
      errors.length === 0
        ? 'kernel_corpus_human_review_tool_valid'
        : 'kernel_corpus_human_review_tool_invalid',
    errorCount: errors.length,
    errors,
    boundary: AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_BOUNDARY,
    strengthensCore: [...AXIOM_KERNEL_CORPUS_HUMAN_REVIEW_TOOL_CORE_PROGRESS_CLASSES],
  };
}
