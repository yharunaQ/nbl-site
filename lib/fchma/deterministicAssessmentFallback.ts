import type {
  FchmaAiAssessment,
  FchmaFullAssessment,
  FchmaInterventionItem,
  FchmaReferenceItem,
  FchmaStructuralHypothesis,
  FchmaStructuredFollowupQuestion,
} from '@/lib/fchma/aiAssessmentOrchestration';
import { fchmaCausalFrameworkAtlas } from '@/lib/fchma/causalFrameworkAtlas';
import type { FchmaRespondentPatternMatch } from '@/lib/fchma/respondentPatternMatcher';

type ExtractedSignals = FchmaFullAssessment['extractedSignals'];

type FallbackDomain = {
  id: string;
  label: string;
  intervention_ports: string[];
};

type FallbackMotif = {
  id: string;
  label: string;
  summary: string;
};

function unique(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function hasAny(items: string[]): boolean {
  return items.length > 0;
}

function hasNegativeSupportSignal(items: string[]): boolean {
  return items.some((item) => /未整備|不足|なし|難しい|言え|隠/.test(item));
}

function pickDomainId(signals: ExtractedSignals): string {
  if (hasAny(signals.supportContext) && hasNegativeSupportSignal(signals.supportContext)) {
    return 'accommodation_environment_gap';
  }
  if (hasAny(signals.disclosureContext)) {
    return 'communication_disclosure_mediation';
  }
  if (hasAny(signals.workContext) && hasAny(signals.difficultyContext)) {
    return 'task_demand_mismatch';
  }
  if (hasAny(signals.futureContext)) {
    return 'participation_role_instability';
  }
  if (hasAny(signals.healthConditions) || hasAny(signals.difficultyContext)) {
    return 'symptom_variability';
  }
  return 'support_coordination_access';
}

function pickMotifId(signals: ExtractedSignals, matchedPatterns: FchmaRespondentPatternMatch[]): string {
  if (hasAny(signals.supportContext) && hasNegativeSupportSignal(signals.supportContext)) {
    return 'bottleneck';
  }
  if (hasAny(signals.workContext) && hasAny(signals.difficultyContext)) {
    return 'mismatch';
  }
  if (hasAny(signals.futureContext)) {
    return 'delay_recurrence';
  }
  if (matchedPatterns.length > 0) {
    return 'amplification';
  }
  return 'mismatch';
}

function findDomain(domainId: string): FallbackDomain {
  return (
    fchmaCausalFrameworkAtlas.domains.find((domain) => domain.id === domainId) ?? {
      id: 'task_demand_mismatch',
      label: '仕事要求ミスマッチ',
      intervention_ports: ['タスク切り出し', '時間設計の変更', '役割期待の調整'],
    }
  );
}

function findMotif(motifId: string): FallbackMotif {
  return (
    fchmaCausalFrameworkAtlas.motifs.find((motif) => motif.id === motifId) ?? {
      id: 'mismatch',
      label: 'ミスマッチ',
      summary: '要求条件と利用可能条件のズレが生じている。',
    }
  );
}

function summarizeSignals(signals: ExtractedSignals): string {
  const parts = [
    signals.healthConditions.length ? `健康・体調: ${signals.healthConditions.join('、')}` : '',
    signals.workContext.length ? `仕事・場面: ${signals.workContext.slice(0, 2).join(' / ')}` : '',
    signals.difficultyContext.length ? `困難: ${signals.difficultyContext.slice(0, 2).join(' / ')}` : '',
    signals.supportContext.length ? `支援・配慮: ${signals.supportContext.slice(0, 2).join(' / ')}` : '',
  ];
  return parts.filter(Boolean).join('。') || '相談文から抽出できるシグナルはまだ少ない状態です。';
}

function buildPrimaryCausalChain(signals: ExtractedSignals, domain: FallbackDomain): string {
  const health = signals.healthConditions[0] || '体調・本人条件';
  const work = signals.workContext[0] || '仕事要求・場面負荷';
  const difficulty = signals.difficultyContext[0] || domain.label;
  return `${health} → ${work} → ${difficulty} → 就労参加の不安定化`;
}

function buildStructuredFollowupQuestions(questions: string[]): FchmaStructuredFollowupQuestion[] {
  return questions.slice(0, 4).map((question) => ({
    question,
    suggestedOptions: inferQuestionOptions(question),
  }));
}

function inferQuestionOptions(question: string): string[] {
  if (/体調|診断名|症状/.test(question)) {
    return ['日内変動がある', '週単位で波がある', '作業後に悪化する'];
  }
  if (/業務|時間帯|場面/.test(question)) {
    return ['始業直後が難しい', '長時間作業で悪化する', '対人場面で強く出る'];
  }
  if (/配慮|支援|未整備/.test(question)) {
    return ['勤務時間の調整', '業務量の調整', '相談先の明確化'];
  }
  if (/上司|人事|誰に|伝え/.test(question)) {
    return ['上司に共有済み', '人事に未共有', '外部支援者と整理中'];
  }
  if (/守りたい|働き続ける|負荷|相談経路/.test(question)) {
    return ['働き続けること', '負荷を下げること', '相談経路を整えること'];
  }
  return ['すぐ確認できる', '次回面談で確認する', '関係者に確認する'];
}

function buildStructuralHypotheses(
  assessment: FchmaFullAssessment,
  domain: FallbackDomain,
  motif: FallbackMotif,
): FchmaStructuralHypothesis[] {
  const signals = assessment.extractedSignals;
  const topPattern = assessment.matchedPatterns[0];
  const primaryChain = buildPrimaryCausalChain(signals, domain);
  const signalSummary = summarizeSignals(signals);
  const patternPorts = topPattern?.interventionPorts ?? [];
  const interventionPoints = unique([...domain.intervention_ports, ...patternPorts]).slice(0, 5);
  const amplifiers = unique([
    ...signals.difficultyContext,
    ...(topPattern?.causalAmplifiers ?? []),
  ]).slice(0, 5);
  const protectors = unique(
    signals.supportContext.filter((item) => !hasNegativeSupportSignal([item])),
  );

  const hypotheses: FchmaStructuralHypothesis[] = [
    {
      domainId: domain.id,
      domainLabel: domain.label,
      motifId: motif.id,
      motifLabel: motif.label,
      label: `${domain.label}の暫定仮説`,
      rationale:
        `OpenAI による精密生成は使わず、入力文から抽出したシグナルで暫定整理しています。${signalSummary}` +
        ` ${domain.label} × ${motif.label} として、どの仕事条件が困難を強めているかを人が確認する前提の候補です。`,
      causalChain: primaryChain,
      keyElements: unique([
        ...signals.healthConditions,
        'activities',
        'participation',
        'environmental_factors',
        domain.label,
      ]),
      amplifiers: amplifiers.length ? amplifiers : ['困難が出る場面の詳細が未確定'],
      protectors: protectors.length ? protectors : ['相談内容が言語化されていること'],
      interventionPoints: interventionPoints.length ? interventionPoints : ['困難場面の切り分け'],
      confidence: topPattern ? 'medium' : 'low',
    },
  ];

  if (topPattern) {
    hypotheses.push({
      domainId: domain.id,
      domainLabel: domain.label,
      motifId: motif.id,
      motifLabel: motif.label,
      label: '類似パターン参照仮説',
      rationale:
        `ローカルの回答者パターン「${topPattern.patternKey}」との重なりから、同じ因果連鎖が関与する可能性を置いています。` +
        'ただし、これは類似性に基づく候補であり、本人の語りと関係者確認で修正する前提です。',
      causalChain: topPattern.causalSummary || primaryChain,
      keyElements: Object.keys(topPattern.topLabels).slice(0, 5),
      amplifiers: topPattern.causalAmplifiers.slice(0, 5),
      protectors: ['類似ケースの介入ポートを検討できること'],
      interventionPoints: topPattern.interventionPorts.slice(0, 5),
      confidence: topPattern.score >= 5 ? 'medium' : 'low',
    });
  }

  return hypotheses;
}

function buildInterventionPlan(
  assessment: FchmaFullAssessment,
  domain: FallbackDomain,
): FchmaInterventionItem[] {
  const signals = assessment.extractedSignals;
  const signalEvidence = summarizeSignals(signals);
  const items: FchmaInterventionItem[] = [
    {
      title: '困難が強まる場面の切り分け',
      interventionType: 'work_design',
      ownerRole: 'case_worker',
      rationale:
        `${domain.label}を暫定フレームとして、まず業務・時間帯・対人場面のどこで負荷が強まるかを分ける。`,
      implementationNotes: [
        '困難が出る時間帯と業務を一つずつ記録する',
        '体調変動と作業負荷を分けて確認する',
        '1週間程度の短い試行期間を決めて再評価する',
      ],
      evidenceBasis: `deterministic signal preview: ${signalEvidence}`,
      feasibility: 'high',
    },
    {
      title: '必要配慮の言語化と小さな試行',
      interventionType: 'accommodation',
      ownerRole: 'manager_or_hr',
      rationale:
        '個人の努力に戻さず、職場側で調整可能な条件を小さく試すことで、参加の安定性を確認する。',
      implementationNotes: [
        '本人が説明してよい範囲を先に確認する',
        '調整候補を勤務時間・業務量・相談経路に分ける',
        '試行後に本人・職場・支援者で結果を見直す',
      ],
      evidenceBasis: 'FCHMA ICF-based accommodation hypothesis',
      feasibility: 'medium',
    },
  ];

  if (signals.supportContext.length || signals.disclosureContext.length) {
    items.push({
      title: '相談経路と説明順序の整理',
      interventionType: 'support_linkage',
      ownerRole: 'external_supporter',
      rationale:
        '配慮や開示の文脈が含まれるため、誰に何をどの順で伝えるかを整えることが介入点になる。',
      implementationNotes: [
        '共有相手を上司・人事・外部支援者に分ける',
        '本人が望む開示範囲を確認する',
        '次回の確認者と期限を決める',
      ],
      evidenceBasis: 'support orchestration fallback hypothesis',
      feasibility: 'medium',
    });
  }

  return items;
}

function buildReferenceItems(assessment: FchmaFullAssessment): FchmaReferenceItem[] {
  const topPattern = assessment.matchedPatterns[0];
  const items: FchmaReferenceItem[] = [
    {
      title: 'FCHMA 因果フレーム暫定整理',
      summary:
        'ICFの相互作用モデルを土台に、健康状態・活動・参加・環境条件の関係を暫定的に分けて見ています。',
      sourceType: 'guideline',
      evidenceRole: 'conditional_hypothesis',
      relevanceNote: 'OpenAI 生成が利用できない場合のローカル暫定見立てとして使用。',
    },
  ];

  if (topPattern) {
    items.push({
      title: `回答者パターン ${topPattern.patternKey}`,
      summary: topPattern.causalSummary,
      sourceType: 'manifold_pattern',
      evidenceRole: 'related_reading',
      relevanceNote: `キーワード・健康条件の重なりに基づく参考パターン。score=${topPattern.score}`,
    });
  }

  return items;
}

function buildDeterministicAssessment(assessment: FchmaFullAssessment): FchmaAiAssessment {
  const domain = findDomain(pickDomainId(assessment.extractedSignals));
  const motif = findMotif(pickMotifId(assessment.extractedSignals, assessment.matchedPatterns));
  const signalSummary = summarizeSignals(assessment.extractedSignals);

  return {
    primaryDomainId: domain.id,
    primaryDomainLabel: domain.label,
    primaryMotifId: motif.id,
    primaryMotifLabel: motif.label,
    frameworkSummary:
      `これは OpenAI による精密生成ではなく、入力文から抽出したシグナルとローカルパターン照合に基づく暫定見立てです。` +
      ` ${signalSummary} ${motif.summary}`,
    structuralHypotheses: buildStructuralHypotheses(assessment, domain, motif),
    interventionPlan: buildInterventionPlan(assessment, domain),
    followupQuestions: assessment.deterministicFollowupQuestions,
    structuredFollowupQuestions: buildStructuredFollowupQuestions(
      assessment.deterministicFollowupQuestions,
    ),
    referenceItems: buildReferenceItems(assessment),
  };
}

export function withDeterministicFchmaAssessmentFallback(
  assessment: FchmaFullAssessment,
): FchmaFullAssessment {
  if (assessment.aiAssessment) {
    return assessment;
  }

  return {
    ...assessment,
    aiAssessment: buildDeterministicAssessment(assessment),
    aiError: null,
    providerId: 'deterministic_only',
  };
}
