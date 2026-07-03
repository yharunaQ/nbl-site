import {
  buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport,
} from '@/lib/axiom/realDataIntegratedDomainKnowledgeL3ContrastReport';
import {
  buildAxiomAllLayerIntegratedDomainKnowledgeRebuild,
  type AxiomAllLayerRebuiltReviewUnit,
} from '@/lib/axiom/allLayerIntegratedDomainKnowledgeRebuild';
import {
  buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt,
} from '@/lib/axiom/allLayerIntegratedDomainKnowledgeFounderReviewResultReceipt';
import {
  buildAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell,
} from '@/lib/axiom/realDataIntegratedDomainKnowledgeFounderReviewReceiptShell';
import {
  buildAxiomRealDataIntegratedDomainKnowledgeObject,
  type AxiomIntegratedDomainKnowledgeAxis,
} from '@/lib/axiom/realDataIntegratedDomainKnowledgeObject';
import {
  buildAxiomRealDataSemanticFacetCoverage,
} from '@/lib/axiom/realDataSemanticFacetCoverage';
import {
  buildAxiomRealDataStratifiedDomainReanalysis,
} from '@/lib/axiom/realDataStratifiedDomainReanalysis';

import styles from './AxiomIntegratedDomainKnowledgeReviewSurface.module.css';

const knowledgeObject = buildAxiomRealDataIntegratedDomainKnowledgeObject();
const l3ContrastReport = buildAxiomRealDataIntegratedDomainKnowledgeL3ContrastReport(
  knowledgeObject,
);
const semanticFacetCoverage = buildAxiomRealDataSemanticFacetCoverage(knowledgeObject);
const stratifiedReanalysis = buildAxiomRealDataStratifiedDomainReanalysis();
const allLayerRebuild = buildAxiomAllLayerIntegratedDomainKnowledgeRebuild(
  stratifiedReanalysis,
);
const allLayerFounderReviewResultReceipt =
  buildAxiomAllLayerIntegratedDomainKnowledgeFounderReviewResultReceipt(
    allLayerRebuild,
  );
const reviewReceiptShell = buildAxiomIntegratedDomainKnowledgeFounderReviewReceiptShell(
  knowledgeObject,
  semanticFacetCoverage,
  l3ContrastReport,
);

const REVIEW_DECISION_OPTIONS = [
  'この仮説をAxiom coreの発見として受け入れる',
  '方向は受け入れるが、言葉や範囲を修正する',
  '他の仮説と分割・統合してから受け入れる',
  'missing contextやsource lens確認までholdする',
];

const REBUILT_REVIEW_DECISION_OPTIONS = [
  'この候補をAxiom coreの統合知識候補として受け入れる',
  '候補の方向は受け入れるが、言葉や範囲を修正する',
  '候補同士を分割・統合してから受け入れる',
  '候補のmissing contextやsource lens確認までholdする',
];

const DISCOVERY_REVIEW_COPY: Record<
  string,
  {
    discoveryJa: string;
    shiftsJa: string[];
    reviewQuestionJa: string;
    surfaceUseJa: string;
    plainConclusionJa: string;
  }
> = {
  axiom_domain_axis_health_time_life_security_work_density: {
    plainConclusionJa:
      '働きづらさは、体調だけでなく「働く時間の設計」が合っていない時に強くなる。ただし難病の体調変動だけで健康時間全体を代表させない。',
    discoveryJa:
      '体調変動は「本人の不安定さ」ではなく、仕事密度、回復時間、通院・定期検診、収入不安、評価時期が同じ時間軸で衝突する構造として現れる。内部障害の定期的管理と難病の変動・再燃は分けて読む。',
    shiftsJa: [
      '病名や疲れやすさから配慮を探すのではなく、時間・仕事量・収入・評価の噛み合わせを見る。',
      '難病データの量に引っ張られず、内部障害、精神障害、感覚障害などの時間制約をサブグループ信号として残す。',
      '休む、減らす、戻る、選び直す自由を仕事条件の一部として扱う。',
    ],
    reviewQuestionJa:
      'この発見は、Axiom版NBLの中心的な仕事設計視点として受け入れてよいか。',
    surfaceUseJa:
      'home、work-condition window、相談事例、toolkitで「健康時間を仕事条件として読む」導線に使う。',
  },
  axiom_domain_axis_support_retranslation_continuity_network: {
    plainConclusionJa:
      '支援の質は、人がいることではなく、関係者の言葉を仕事条件へ翻訳し続けられることで決まる。',
    discoveryJa:
      '支援の本体は「支援者がいること」ではなく、本人・職場・医療・制度の言葉を仕事条件へ翻訳し直し、変化後も戻れる接続を保つ機能にある。',
    shiftsJa: [
      '相談・紹介・会議の有無を支援の質と見なさない。',
      '翻訳、handoff、再接続、役割境界を支援ネットワークの中心として見る。',
    ],
    reviewQuestionJa:
      'この発見は、支援の質を読む中核軸として十分か。過不足や分割すべき点はあるか。',
    surfaceUseJa:
      '相談事例、theory/trust、aboutで「支援を再翻訳機能として読む」説明に使う。',
  },
  axiom_domain_axis_worksite_contact_task_information_safety: {
    plainConclusionJa:
      '配慮の成否は、職場のどの接触点をどう変えられるかまで分解できるかで決まる。',
    discoveryJa:
      '配慮は抽象的な善意や制度手続ではなく、作業、手順、道具、情報形式、安全、人員余力、顧客接点という職場接触点の設計として現れる。',
    shiftsJa: [
      '職場の懸念を能力判断にせず、どの接触点が未分解なのかを見る。',
      '本人側を変える前に、仕事との接触面を変えられるかを見る。',
    ],
    reviewQuestionJa:
      'この発見は、現場実装の解像度として十分か。抜けている接触点はあるか。',
    surfaceUseJa:
      'work-condition window、toolkit、case-readingで具体的な仕事条件カードや図解へ展開する。',
  },
  axiom_domain_axis_source_lens_jurisdiction_historical_brake: {
    plainConclusionJa:
      '海外資料や過去資料は、答えの輸入ではなく、時代や国を超えて残る構造と制度差を分けて読む材料になる。',
    discoveryJa:
      '本人視点、支援者視点、職場視点、国内外資料、歴史資料はそれぞれ部分的な光である。Axiomでは、それらを過剰一般化のブレーキにするだけでなく、制度や時代を超えて反復する普遍構造候補を見つける材料として使う。',
    shiftsJa: [
      '情報の多さを妥当性と取り違えない。',
      '海外資料や歴史資料を答えにせず、別制度・別時代から構造を照らす補助線として使う。',
      '制度差だけを理由に捨てるのでもなく、普遍構造候補と現在日本での適用限界を分ける。',
    ],
    reviewQuestionJa:
      'このsource lens軸は、普遍構造候補の発見と公開表現前のブレーキの両方として十分か。',
    surfaceUseJa:
      'theory/method/trust、about、記事で「なぜ断定しないのか」を説明する基盤に使う。',
  },
  axiom_domain_axis_information_participation_disclosure_boundary: {
    plainConclusionJa:
      '開示の問題と、視覚・聴覚などの情報アクセス問題は分けて読む。その上で、どちらも参加しやすい仕事条件へつなげる。',
    discoveryJa:
      '開示や情報共有の問題は、情報量ではなく、目的限定、同意、差別リスクとして現れる。一方、視覚・聴覚等の感覚障害では、文書、音声、視覚情報、会議速度、情報媒体の問題が独立した参加条件として現れる。',
    shiftsJa: [
      '何を知らせるかだけでなく、何のために、誰が使い、どの形式なら参加できるかを見る。',
      '感覚障害のコミュニケーション困難を、本人が病状を開示する問題に吸収しない。',
      '開示を支援の入口にしつつ、不利益評価や過剰管理へ変わる危険を残す。',
    ],
    reviewQuestionJa:
      'この発見は、開示境界と情報アクセスを分けた上で、参加設計の軸として扱ってよいか。',
    surfaceUseJa:
      'work-condition window、記事、toolkitで「開示前に仕事条件を見える化する」導線に使う。',
  },
  axiom_domain_axis_value_role_growth_quality_loop: {
    plainConclusionJa:
      '就労支援の目的は就職・定着で終わらず、役割・評価・成長の質が更新されることにある。',
    discoveryJa:
      '就労支援の質は、就職や定着で終わらず、役割、評価、処遇、学習、キャリア、成長、働き続ける意味が更新されるループとして現れる。',
    shiftsJa: [
      '雇用率・定着・配慮実施だけを成果にしない。',
      '健康時間を守ることが成長機会や評価から排除されない設計を見る。',
    ],
    reviewQuestionJa:
      'この発見は、NBLが「働き続ける質」を扱うための最終軸として妥当か。',
    surfaceUseJa:
      'home、work-design guide、SNS/articleで「就業後の質と成長」を中心テーマ化する。',
  },
};

function CompactList({ items, limit }: { items: string[]; limit?: number }) {
  const visibleItems = typeof limit === 'number' ? items.slice(0, limit) : items;
  const hiddenCount = typeof limit === 'number' ? Math.max(items.length - limit, 0) : 0;

  return (
    <ul>
      {visibleItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
      {hiddenCount > 0 ? <li>他 {hiddenCount} 件</li> : null}
    </ul>
  );
}

function DiscoveryCard({
  axis,
  index,
}: {
  axis: AxiomIntegratedDomainKnowledgeAxis;
  index: number;
}) {
  const discovery = DISCOVERY_REVIEW_COPY[axis.axisId];
  const axisFacets = semanticFacetCoverage.facets.filter(
    (facet) => facet.parentAxisId === axis.axisId,
  );

  return (
    <article className="discoveryCard">
      <header className="discoveryHeader">
        <div>
          <p>Hypothesis {index + 1} / {knowledgeObject.axes.length}</p>
          <h2>{axis.candidateLabelJa}</h2>
        </div>
        <span>review: accept / revise / split / hold</span>
      </header>
      <section className="plainStatement">
        <h3>一言でいうと</h3>
        <p>{discovery.plainConclusionJa}</p>
      </section>
      <div className="hypothesisLayout">
        <section className="hypothesisBody">
          <h3>Axiomが読み取った発見</h3>
          <p className="discoveryLead">{discovery.discoveryJa}</p>
          <h3>この仮説で変わる読み方</h3>
          <CompactList items={discovery.shiftsJa} />
        </section>
        <aside className="reviewPanel">
          <h3>レビュー判断</h3>
          <ol>
            {REVIEW_DECISION_OPTIONS.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ol>
          <h3>この仮説の確認ポイント</h3>
          <p>{discovery.reviewQuestionJa}</p>
          <h3>サイトへの反映</h3>
          <p>{discovery.surfaceUseJa}</p>
        </aside>
      </div>
      <div className="facetDetail">
        <h3>補助facet: この仮説を支える詳しい読み筋</h3>
        <div className="facetDetailGrid">
          {axisFacets.map((facet) => (
            <article key={facet.facetId}>
              <h4>{facet.labelJa}</h4>
              <p>{facet.roleJa}</p>
            </article>
          ))}
        </div>
      </div>
    </article>
  );
}

function AxisCard({ axis, index }: { axis: AxiomIntegratedDomainKnowledgeAxis; index: number }) {
  return (
    <article className="axisCard">
      <header>
        <p>Review axis {index + 1} / {knowledgeObject.axes.length}</p>
        <h2>{axis.candidateLabelJa}</h2>
      </header>
      <p className="role">{axis.integrationRoleJa}</p>
      <dl className="axisMeta">
        <div>
          <dt>actionability</dt>
          <dd>{axis.actionabilityBand}</dd>
        </div>
        <div>
          <dt>source packets</dt>
          <dd>{axis.sourcePacketIds.length}</dd>
        </div>
        <div>
          <dt>review route</dt>
          <dd>{axis.humanReviewRoute}</dd>
        </div>
      </dl>
      <div className="axisGrid">
        <section>
          <h3>観察の統合</h3>
          <p>{axis.observationSynthesisJa}</p>
        </section>
        <section>
          <h3>推論の統合</h3>
          <p>{axis.inferenceSynthesisJa}</p>
        </section>
        <section>
          <h3>反対仮説</h3>
          <CompactList items={axis.counterHypothesesJa} />
        </section>
        <section>
          <h3>Missing context</h3>
          <CompactList
            items={axis.missingContextQuestionsJa.map(
              (question) => `${question.slot}: ${question.questionJa}`,
            )}
          />
        </section>
        <section>
          <h3>実装主体条件</h3>
          <CompactList
            items={axis.implementationActorConditionsJa.map(
              (condition) => `${condition.actor}: ${condition.conditionJa}`,
            )}
          />
        </section>
        <section>
          <h3>Cannot yet say</h3>
          <CompactList items={axis.cannotYetSayJa} />
        </section>
      </div>
      <details>
        <summary>source lens / packet traceを見る</summary>
        <p>{axis.sourceLensStatusSummaryJa}</p>
        <CompactList items={axis.sourcePacketIds} />
      </details>
    </article>
  );
}

function RebuiltReviewCard({
  unit,
  index,
}: {
  unit: AxiomAllLayerRebuiltReviewUnit;
  index: number;
}) {
  return (
    <article className="rebuiltReviewCard">
      <header className="rebuiltReviewHeader">
        <div>
          <p>Review candidate {index + 1} / {allLayerRebuild.revalidatedReviewUnitCount}</p>
          <h2>{unit.titleJa}</h2>
        </div>
        <span>{unit.unitKind}</span>
      </header>
      <section className="rebuiltPlainFinding">
        <h3>一言でいうと</h3>
        <p>{unit.founderReviewCard.plainFindingJa}</p>
      </section>
      <div className="rebuiltReviewLayout">
        <section className="rebuiltReviewBody">
          <h3>Axiomが読み取った発見</h3>
          <p className="rebuiltLead">{unit.founderReviewCard.axiomReadingJa}</p>
          <h3>この候補で変わる読み方</h3>
          <CompactList items={unit.founderReviewCard.changesReadingJa} />
          <h3>粒度と下部構造の状態</h3>
          <p>{unit.substructureCoverageNoteJa}</p>
          <h3>境界メモ</h3>
          <p>{unit.founderReviewCard.boundaryNoteJa}</p>
        </section>
        <aside className="rebuiltReviewPanel">
          <h3>Founder review question</h3>
          <p>{unit.founderReviewCard.founderReviewQuestionJa}</p>
          <h3>Review decision draft</h3>
          <ol>
            {REBUILT_REVIEW_DECISION_OPTIONS.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ol>
          <h3>次期NBL候補での使い方</h3>
          <p>{unit.founderReviewCard.nextNblUseCandidateJa}</p>
        </aside>
      </div>
      <section className="substructurePanel">
        <header>
          <div>
            <p className="eyebrow">substructure / bias-resistant coverage</p>
            <h3>この候補の下部構造</h3>
          </div>
          <span>{unit.substructures.length} substructures</span>
        </header>
        <div className="substructureGrid">
          {unit.substructures.map((substructure) => (
            <article key={substructure.substructureId}>
              <p>{substructure.coverageRole}</p>
              <h4>{substructure.labelJa}</h4>
              <h5>observation</h5>
              <p>{substructure.observationFocusJa}</p>
              <h5>inference</h5>
              <p>{substructure.inferenceFocusJa}</p>
              <h5>bias guard</h5>
              <p>{substructure.biasGuardJa}</p>
              <h5>protected signals</h5>
              <CompactList items={substructure.protectedSignalsJa} limit={5} />
            </article>
          ))}
        </div>
      </section>
      <details>
        <summary>この候補のprotected signalsとsource traceを見る</summary>
        <div className="rebuiltTraceGrid">
          <section>
            <h3>なぜこの単位か</h3>
            <p>{unit.whyJa}</p>
          </section>
          <section>
            <h3>レビュー焦点</h3>
            <p>{unit.reviewFocusJa}</p>
          </section>
          <section>
            <h3>protected signals</h3>
            <CompactList items={unit.allLayerProtectionInputs.protectedSignalLabelsJa} />
          </section>
          <section>
            <h3>source provisional units</h3>
            <CompactList items={unit.sourceProvisionalUnitIds} />
          </section>
        </div>
      </details>
    </article>
  );
}

export default function AxiomIntegratedDomainKnowledgeReviewSurface() {
  return (
    <main className={styles.domainReview}>
      <header className="hero">
        <p className="eyebrow">Falcon Lab / Axiom core review</p>
        <h1>Axiom Discovery Review</h1>
        <p>
          14 real-derived packetsをAxiom中核スキルで読み直し、全scannable layerを保護して再構成した
          10個の統合知識候補をレビューする画面。暫定9候補は固定せず、旧6軸は比較材料へ下げる。
        </p>
        <div className="heroMeta">
          <span>{knowledgeObject.inputPacketCount} input packets</span>
          <span>{knowledgeObject.integratedAxisCount} integrated axes</span>
          <span>6-axis candidate superseded</span>
          <span>{stratifiedReanalysis.revisedReviewUnitCount} provisional review-unit candidates</span>
          <span>{allLayerRebuild.revalidatedReviewUnitCount} all-layer revalidated candidates</span>
          <span>{stratifiedReanalysis.longTailHealthConditionSignals.length} long-tail health-condition signals</span>
          <span>{stratifiedReanalysis.upperDisabilityCategorySignals.length} upper disability categories</span>
          <span>{stratifiedReanalysis.employmentPhaseCoverageAudit.nonCurrentIncomeWorkPercent} non-current income work</span>
          <span>{semanticFacetCoverage.facetCount} semantic facets</span>
          <span>{semanticFacetCoverage.coveragePolicy.targetOverallSemanticCoveragePercent}% target coverage</span>
          <span>{l3ContrastReport.l3SeedCount} L3 contrast seeds</span>
          <span>{reviewReceiptShell.reviewUnitCount} receipt-shell units</span>
          <span>{knowledgeObject.reviewCompression.maxCoreHumanReviewUnits} max core review units</span>
        </div>
      </header>

      <section className="boundary" aria-labelledby="boundary-heading">
        <div>
          <h2 id="boundary-heading">ここでレビューすること</h2>
          <p>
            Axiomが実データの不完全な影から読み取った10個の統合知識候補が、NBL-Axiomの専門知識として妥当か。
            これは最終ページ本文ではなく、次の公開候補ページを生成する前のFounder review単位。
          </p>
        </div>
        <dl>
          <div>
            <dt>review target</dt>
            <dd>10 all-layer rebuilt candidates</dd>
          </div>
          <div>
            <dt>decision</dt>
            <dd>受け入れる / 修正する / 分割・統合する / holdする</dd>
          </div>
          <div>
            <dt>coverage</dt>
            <dd>10 scannable layers・49 protected tokens・18 long-tail health signals・9 upper categoriesを保持</dd>
          </div>
          <div>
            <dt>not deciding</dt>
            <dd>公開承認・source/support validity・runtime・learning update</dd>
          </div>
          <div>
            <dt>after review</dt>
            <dd>次期NBL 9 surfaceの候補本文へ展開</dd>
          </div>
          <div>
            <dt>L3 use</dt>
            <dd>比較・抜け確認だけ。本文ソースにはしない。</dd>
          </div>
        </dl>
      </section>

      <section className="founderResultPanel" aria-labelledby="founder-result-heading">
        <div className="sectionIntro">
          <p className="eyebrow">Founder review result received</p>
          <h2 id="founder-result-heading">10 / 10 accepted as Axiom integrated domain knowledge</h2>
          <p>{allLayerFounderReviewResultReceipt.externalReviewSummaryJa}</p>
        </div>
        <dl className="founderResultGrid">
          <div>
            <dt>review source</dt>
            <dd>{allLayerFounderReviewResultReceipt.reviewSource}</dd>
          </div>
          <div>
            <dt>accepted units</dt>
            <dd>
              {allLayerFounderReviewResultReceipt.acceptedUnitCount}
              {' / '}
              {allLayerFounderReviewResultReceipt.unitCount}
            </dd>
          </div>
          <div>
            <dt>accepted substructures</dt>
            <dd>{allLayerFounderReviewResultReceipt.totalAcceptedSubstructureCount}</dd>
          </div>
          <div>
            <dt>next allowed step</dt>
            <dd>{allLayerFounderReviewResultReceipt.surfaceProjectionBridge.nextAllowedStep}</dd>
          </div>
          <div>
            <dt>allowed scope</dt>
            <dd>{allLayerFounderReviewResultReceipt.surfaceProjectionBridge.allowedScope}</dd>
          </div>
          <div>
            <dt>public approval</dt>
            <dd>{allLayerFounderReviewResultReceipt.reviewResultInterpretation.directPublicationDecision}</dd>
          </div>
        </dl>
        <div className="founderResultColumns">
          <section>
            <h3>次に引き継ぐもの</h3>
            <CompactList items={[...allLayerFounderReviewResultReceipt.surfaceProjectionBridge.mustCarryForward]} />
          </section>
          <section>
            <h3>このreceiptで進めないこと</h3>
            <CompactList items={[...allLayerFounderReviewResultReceipt.surfaceProjectionBridge.prohibitedByThisReceipt]} />
          </section>
        </div>
      </section>

      <section className="preFounderReview" aria-labelledby="pre-founder-review-heading">
        <div className="sectionIntro">
          <p className="eyebrow">Codex pre-Founder autonomous review</p>
          <h2 id="pre-founder-review-heading">Founderレビュー前にCodexが先に潰した論点</h2>
          <p>
            {allLayerRebuild.preFounderAutonomousReview.founderReviewCompression.codexPreReviewRoleJa}
          </p>
        </div>
        <dl className="preFounderSummary">
          <div>
            <dt>review passes</dt>
            <dd>{allLayerRebuild.preFounderAutonomousReview.findingCount}</dd>
          </div>
          <div>
            <dt>resolved by rebuild</dt>
            <dd>{allLayerRebuild.preFounderAutonomousReview.resolvedFindingCount}</dd>
          </div>
          <div>
            <dt>Founder attention</dt>
            <dd>{allLayerRebuild.preFounderAutonomousReview.founderAttentionRequiredCount}</dd>
          </div>
          <div>
            <dt>status</dt>
            <dd>{allLayerRebuild.preFounderAutonomousReview.status}</dd>
          </div>
        </dl>
        <div className="preFounderGrid">
          {allLayerRebuild.preFounderAutonomousReview.findings.map((finding, index) => (
            <article key={finding.findingId}>
              <p className="eyebrow">pre-review pass {index + 1} / 5</p>
              <h3>{finding.passId}</h3>
              <dl>
                <div>
                  <dt>Codex observation</dt>
                  <dd>{finding.observationJa}</dd>
                </div>
                <div>
                  <dt>Correction already applied</dt>
                  <dd>{finding.correctionAppliedJa}</dd>
                </div>
                <div>
                  <dt>Remaining Founder question</dt>
                  <dd>{finding.remainingFounderQuestionJa}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <div className="preFounderCompression">
          <h3>Founderに残す判断</h3>
          <p>{allLayerRebuild.preFounderAutonomousReview.founderReviewCompression.founderReviewRoleJa}</p>
          <h3>ここでは判断しないこと</h3>
          <CompactList
            items={
              allLayerRebuild.preFounderAutonomousReview.founderReviewCompression
                .founderMustNotReviewJa
            }
          />
        </div>
      </section>

      <section className="coverageAudit" aria-labelledby="coverage-audit-heading">
        <div className="sectionIntro">
          <p className="eyebrow">coverage audit / not source validity</p>
          <h2 id="coverage-audit-heading">10候補のcoverage確認</h2>
          <p>{allLayerRebuild.allLayerCoverageReview.coverageConclusionJa}</p>
        </div>
        <dl className="coverageAuditGrid">
          <div>
            <dt>token layers</dt>
            <dd>{allLayerRebuild.allLayerCoverageReview.protectedTokenLayerCoverage}</dd>
          </div>
          <div>
            <dt>protected tokens</dt>
            <dd>{allLayerRebuild.allLayerCoverageReview.protectedJointSubjectTokenCoverage}</dd>
          </div>
          <div>
            <dt>long-tail health</dt>
            <dd>{allLayerRebuild.allLayerCoverageReview.longTailHealthConditionCoverage}</dd>
          </div>
          <div>
            <dt>pattern families</dt>
            <dd>{allLayerRebuild.allLayerCoverageReview.patternFamilyCoverage}</dd>
          </div>
          <div>
            <dt>pattern levels</dt>
            <dd>{allLayerRebuild.allLayerCoverageReview.patternLevelCoverage}</dd>
          </div>
          <div>
            <dt>source lenses</dt>
            <dd>{allLayerRebuild.allLayerCoverageReview.sourceLensCoverage}</dd>
          </div>
          <div>
            <dt>substructures</dt>
            <dd>{allLayerRebuild.allLayerCoverageReview.totalSubstructureCount}</dd>
          </div>
          <div>
            <dt>prohibited shortcut</dt>
            <dd>{allLayerRebuild.allLayerCoverageReview.prohibitedShortcut}</dd>
          </div>
        </dl>
        <div className="coverageAuditColumns">
          <section>
            <h3>下部構造レビューが必要な候補</h3>
            <CompactList items={allLayerRebuild.allLayerCoverageReview.substructureRequiredUnitIds} />
          </section>
          <section>
            <h3>残るリスク</h3>
            <p>{allLayerRebuild.allLayerCoverageReview.remainingRiskJa}</p>
          </section>
        </div>
      </section>

      <section className="rebuiltDiscoveryStack" aria-labelledby="rebuilt-discovery-heading">
        <div className="sectionIntro">
          <p className="eyebrow">main Founder review target</p>
          <h2 id="rebuilt-discovery-heading">全層reanalysis後の10個のAxiom発見候補</h2>
          <p>
            以下が今回レビューする主対象。旧6軸や暫定9候補ではなく、少数シグナル保護後に維持・分割・境界調整した
            10候補を、次期NBL本文の前段階として確認する。
          </p>
        </div>
        {allLayerRebuild.rebuiltReviewUnits.map((unit, index) => (
          <RebuiltReviewCard unit={unit} index={index} key={unit.rebuiltUnitId} />
        ))}
      </section>

      <section className="reanalysisNotice" aria-labelledby="reanalysis-heading">
        <div className="sectionIntro">
          <p className="eyebrow">stratified reanalysis / supersedes six-axis correction</p>
          <h2 id="reanalysis-heading">層別再分析で分かったこと</h2>
          <p>
            旧6軸は、方針補正だけでは不十分。joint subject space、44 manifold patterns、source-model priorsを読み直すと、
            6軸をそのまま次期NBL本文へ進めず、暫定9候補も全層保護後に維持・分割・統合・holdを再判定する必要がある。
          </p>
        </div>
        <div className="reanalysisGrid">
          <article>
            <h3>なぜ6軸補正では足りないか</h3>
            <p>{stratifiedReanalysis.reanalysisReasonJa}</p>
          </article>
          <article>
            <h3>例示対応ではなく、少数シグナル全体を保護する</h3>
            <p>{stratifiedReanalysis.generalizedProtectionFindingJa}</p>
          </article>
          <article>
            <h3>実データ由来の再分析単位</h3>
            <dl>
              <div>
                <dt>joint subjects</dt>
                <dd>{stratifiedReanalysis.dataProfile.jointSubjectCount}</dd>
              </div>
              <div>
                <dt>employment survey</dt>
                <dd>{stratifiedReanalysis.dataProfile.datasetCounts.employment_survey_3000}</dd>
              </div>
              <div>
                <dt>nanbyo survey</dt>
                <dd>{stratifiedReanalysis.dataProfile.datasetCounts.nanbyo_survey_4000}</dd>
              </div>
              <div>
                <dt>long-tail health tokens</dt>
                <dd>
                  {stratifiedReanalysis.minoritySignalProtectionPolicy.longTailHealthConditionTokenCount}
                  {' / '}
                  {stratifiedReanalysis.minoritySignalProtectionPolicy.totalHealthConditionTokenCount}
                </dd>
              </div>
              <div>
                <dt>upper disability categories</dt>
                <dd>{stratifiedReanalysis.minoritySignalProtectionPolicy.upperDisabilityCategoryCount}</dd>
              </div>
              <div>
                <dt>non-current income work</dt>
                <dd>
                  {stratifiedReanalysis.employmentPhaseCoverageAudit.nonCurrentIncomeWorkCount}
                  {' / '}
                  {stratifiedReanalysis.employmentPhaseCoverageAudit.totalRespondents}
                  {' ('}
                  {stratifiedReanalysis.employmentPhaseCoverageAudit.nonCurrentIncomeWorkPercent}
                  {')'}
                </dd>
              </div>
              <div>
                <dt>scannable layers</dt>
                <dd>{stratifiedReanalysis.minoritySignalProtectionPolicy.scannableLayerIds.length}</dd>
              </div>
              <div>
                <dt>old six-axis status</dt>
                <dd>{stratifiedReanalysis.oldSixAxisFinding}</dd>
              </div>
            </dl>
          </article>
        </div>
        <div className="longTailPanel">
          <header>
            <div>
              <p className="eyebrow">minority signal protection policy</p>
              <h3>軸再構成前に全scannable layerをrouteする</h3>
            </div>
            <span>{stratifiedReanalysis.minoritySignalProtectionPolicy.prohibitedShortcut}</span>
          </header>
          <p>{stratifiedReanalysis.minoritySignalProtectionPolicy.reviewUseJa}</p>
          <div>
            {stratifiedReanalysis.protectedTokenLayerSummaries.map((layer) => (
              <article key={layer.layerId}>
                <h4>{layer.layerId}</h4>
                <p>
                  {layer.protectedTokenCount} / {layer.totalTokenCount} tokens protected
                </p>
                <ul>
                  {layer.tokens
                    .filter(
                      (token) =>
                        token.protectionClass === 'low_n_high_specificity' ||
                        token.protectionClass === 'phase_specific_context',
                    )
                    .slice(0, 6)
                    .map((token) => (
                      <li key={token.sourceTokenColumn}>
                        {token.labelJa}: {token.count} rows
                      </li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <div className="longTailPanel">
          <header>
            <div>
              <p className="eyebrow">upper disability category layer</p>
              <h3>上位障害種類9カテゴリを詳細疾病tokenと分けて見る</h3>
            </div>
            <span>{stratifiedReanalysis.upperDisabilityCategorySignals.length} protected</span>
          </header>
          <p>
            health_conditionの長尾18件は詳細分類の保護であり、上位障害種類を置き換えない。
            上位分類は、仕事設計上の差が詳細疾病名に埋もれないように別レイヤーで保持する。
          </p>
          <div>
            {stratifiedReanalysis.upperDisabilityCategorySignals.map((signalItem) => (
              <article key={signalItem.labelJa}>
                <h4>{signalItem.labelJa}</h4>
                <p>
                  {signalItem.count} / {signalItem.denominator} respondents
                </p>
                <ul>
                  {signalItem.routedToReviewUnitIds.map((unitId) => (
                    <li key={unitId}>{unitId}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <div className="longTailPanel">
          <header>
            <div>
              <p className="eyebrow">employment phase audit</p>
              <h3>入口前・非就労中フェーズは低頻度ではない</h3>
            </div>
            <span>
              {stratifiedReanalysis.employmentPhaseCoverageAudit.nonCurrentIncomeWorkPercent}
            </span>
          </header>
          <p>{stratifiedReanalysis.employmentPhaseCoverageAudit.interpretationCorrectionJa}</p>
          <div>
            <article>
              <h4>8就労経験</h4>
              <p>
                現在収入のある仕事あり:
                {' '}
                {stratifiedReanalysis.employmentPhaseCoverageAudit.currentIncomeWorkCount}
                {' / '}
                {stratifiedReanalysis.employmentPhaseCoverageAudit.currentIncomeWorkPercent}
              </p>
              <p>
                現在収入のある仕事なし:
                {' '}
                {stratifiedReanalysis.employmentPhaseCoverageAudit.nonCurrentIncomeWorkCount}
                {' / '}
                {stratifiedReanalysis.employmentPhaseCoverageAudit.nonCurrentIncomeWorkPercent}
              </p>
              <p>
                収入のある仕事経験なし:
                {' '}
                {stratifiedReanalysis.employmentPhaseCoverageAudit.neverIncomeWorkCount}
                {' / '}
                {stratifiedReanalysis.employmentPhaseCoverageAudit.neverIncomeWorkPercent}
              </p>
            </article>
            <article>
              <h4>7系 就職前・就職活動課題</h4>
              <p>
                特に必要なし以外:
                {' '}
                {
                  stratifiedReanalysis.employmentPhaseCoverageAudit
                    .q7StructuredAnyNotUnneededRespondentCount
                }
                {' / '}
                {
                  stratifiedReanalysis.employmentPhaseCoverageAudit
                    .q7StructuredAnyNotUnneededRespondentPercent
                }
              </p>
              <p>
                課題あり/解決済:
                {' '}
                {
                  stratifiedReanalysis.employmentPhaseCoverageAudit
                    .q7StructuredProblemOrResolvedRespondentCount
                }
                {' / '}
                {
                  stratifiedReanalysis.employmentPhaseCoverageAudit
                    .q7StructuredProblemOrResolvedRespondentPercent
                }
              </p>
              <p>
                ７記述:
                {' '}
                {stratifiedReanalysis.employmentPhaseCoverageAudit.q7FreeTextRespondentCount}
                {' respondents / '}
                {stratifiedReanalysis.employmentPhaseCoverageAudit.q7FreeTextUnitCount}
                {' units'}
              </p>
            </article>
          </div>
        </div>
        <div className="longTailPanel">
          <header>
            <div>
              <p className="eyebrow">health-condition long tail details</p>
              <h3>health_conditionの長尾18件</h3>
            </div>
            <span>{stratifiedReanalysis.longTailHealthConditionSignals.length} protected</span>
          </header>
          <div>
            {stratifiedReanalysis.longTailHealthConditionSignals.map((signalItem) => (
              <article key={signalItem.sourceTokenColumn}>
                <h4>{signalItem.labelJa}</h4>
                <p>{signalItem.count} rows</p>
                <ul>
                  {signalItem.routedToReviewUnitIds.map((unitId) => (
                    <li key={unitId}>{unitId}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <div className="layerProtectionGrid">
          <section>
            <h3>pattern familyを大きさで潰さない</h3>
            <div>
              {stratifiedReanalysis.patternFamilyProtections.map((family) => (
                <article key={family.familyId}>
                  <h4>{family.familyId}</h4>
                  <p>{family.patternCount} patterns</p>
                  <p>{family.protectionReasonJa}</p>
                </article>
              ))}
            </div>
          </section>
          <section>
            <h3>global / local / microを同時に保持する</h3>
            <div>
              {stratifiedReanalysis.patternLevelProtections.map((level) => (
                <article key={level.levelId}>
                  <h4>{level.levelId}</h4>
                  <p>{level.patternCount} patterns</p>
                  <p>{level.protectionReasonJa}</p>
                </article>
              ))}
            </div>
          </section>
          <section>
            <h3>source lensの重みと限界を同時に持つ</h3>
            <div>
              {stratifiedReanalysis.sourceLensProtections.map((lens) => (
                <article key={lens.sourceLensId}>
                  <h4>{lens.sourceLensId}</h4>
                  <p>{lens.protectionReasonJa}</p>
                  <CompactList items={lens.cannotUseAsJa} />
                </article>
              ))}
            </div>
          </section>
        </div>
        <div className="signalGrid">
          {stratifiedReanalysis.signals.map((signalItem) => (
            <article key={signalItem.signalId}>
              <p>{signalItem.signalKind}</p>
              <h3>{signalItem.labelJa}</h3>
              <dl>
                <div>
                  <dt>metric</dt>
                  <dd>{signalItem.sourceMetric.metricKind}</dd>
                </div>
                <div>
                  <dt>count</dt>
                  <dd>
                    {typeof signalItem.sourceMetric.count === 'number'
                      ? signalItem.sourceMetric.count
                      : 'qualitative'}
                  </dd>
                </div>
                <div>
                  <dt>axis implication</dt>
                  <dd>{signalItem.axisImplication}</dd>
                </div>
              </dl>
              <p>{signalItem.interpretationJa}</p>
            </article>
          ))}
        </div>
        <div className="rebuiltUnits">
          <h3>暫定9 review-unit candidates: 全層保護後に再評価する</h3>
          <p>{stratifiedReanalysis.reviewUnitCandidateSetUseJa}</p>
          <div>
            {stratifiedReanalysis.revisedReviewUnitCandidates.map((unit) => (
              <article key={unit.unitId}>
                <p>{unit.unitKind}</p>
                <h4>{unit.titleJa}</h4>
                <p>{unit.whyRebuiltJa}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="rebuiltUnits allLayerRebuild">
          <h3>全層reanalysis後の10 review-unit candidates</h3>
          <p>{allLayerRebuild.revalidationPrincipleJa}</p>
          <div>
            {allLayerRebuild.provisionalCandidateRevalidations.map((decision) => (
              <article key={decision.provisionalUnitId}>
                <p>{decision.decision}</p>
                <h4>{decision.provisionalUnitId}</h4>
                <p>{decision.reasonJa}</p>
              </article>
            ))}
          </div>
          <div>
            {allLayerRebuild.rebuiltReviewUnits.map((unit) => (
              <article key={unit.rebuiltUnitId}>
                <p>{unit.decisionFromProvisional}</p>
                <h4>{unit.titleJa}</h4>
                <p>{unit.whyJa}</p>
                <h5>review focus</h5>
                <p>{unit.reviewFocusJa}</p>
                <h5>protected signals</h5>
                <CompactList items={unit.allLayerProtectionInputs.protectedSignalLabelsJa} limit={6} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="discoveryStack" aria-labelledby="discovery-heading">
        <div className="sectionIntro">
          <p className="eyebrow">superseded six-axis candidate</p>
          <h2 id="discovery-heading">旧6発見: 層別再分析により再構成が必要</h2>
          <p>
            以下は以前の6軸候補。現在は最終候補ではなく、全層保護後に9候補を維持・分割・統合・holdするか再評価するための比較材料として読む。
          </p>
        </div>
        {knowledgeObject.axes.map((axis, index) => (
          <DiscoveryCard axis={axis} index={index} key={axis.axisId} />
        ))}
      </section>

      <details className="auditDisclosure">
        <summary>監査用データ、coverage、L3照合、receipt shellを開く</summary>
        <div className="auditBody">
      <section className="receiptShell" aria-labelledby="receipt-shell-heading">
        <div className="sectionIntro">
          <p className="eyebrow">review receipt shell / not a decision</p>
          <h2 id="receipt-shell-heading">確認用: 9 receipt-shell units</h2>
          <p>
            上の6つの発見を、coverage policy、residual watchlist、L3 contrastと合わせて受け取るための確認欄。
            レビュー結果ではなく、投影前の安全ゲート。
          </p>
        </div>
        <dl className="receiptMeta">
          <div>
            <dt>required source</dt>
            <dd>{reviewReceiptShell.reviewSourceRequired}</dd>
          </div>
          <div>
            <dt>can project now</dt>
            <dd>{String(reviewReceiptShell.surfaceProjectionGate.canProjectToNineCandidateSurfacesNow)}</dd>
          </div>
          <div>
            <dt>after receipt</dt>
            <dd>{reviewReceiptShell.surfaceProjectionGate.allowedAfterReceipt}</dd>
          </div>
        </dl>
        <div className="reviewUnitGrid">
          {reviewReceiptShell.reviewUnits.map((unit) => (
            <article key={unit.reviewUnitId}>
              <header>
                <p>{unit.unitKind}</p>
                <h3>{unit.titleJa}</h3>
              </header>
              <dl>
                <div>
                  <dt>facets</dt>
                  <dd>{unit.sourceFacetIds.length}</dd>
                </div>
                <div>
                  <dt>residuals</dt>
                  <dd>{unit.sourceResidualIds.length}</dd>
                </div>
                <div>
                  <dt>L3 seeds</dt>
                  <dd>{unit.l3SeedCount}</dd>
                </div>
                <div>
                  <dt>coverage after accept</dt>
                  <dd>{unit.estimatedCoveragePercentAfterAcceptance}%</dd>
                </div>
              </dl>
              <h4>ここで判断すること</h4>
              <CompactList items={unit.reviewerMustJudgeJa} />
              <h4>判断しないこと</h4>
              <CompactList items={[...unit.reviewerMustNotJudge]} />
            </article>
          ))}
        </div>
        <details>
          <summary>receiptに必要なfieldと投影前の禁止事項を見る</summary>
          <div className="receiptDetails">
            <section>
              <h3>required receipt fields</h3>
              <CompactList items={[...reviewReceiptShell.requiredReceiptFields]} />
            </section>
            <section>
              <h3>prohibited before receipt</h3>
              <CompactList items={[...reviewReceiptShell.surfaceProjectionGate.prohibitedBeforeReceipt]} />
            </section>
          </div>
        </details>
      </section>

      <section className="axisStack" aria-labelledby="axis-heading">
        <div className="sectionIntro">
          <p className="eyebrow">Founder review target</p>
          <h2 id="axis-heading">詳細: 六つのAxiom統合知識軸</h2>
          <p>
            発見カードの根拠となる観察、推論、反対仮説、missing context、実装主体条件。
          </p>
        </div>
        {knowledgeObject.axes.map((axis, index) => (
          <AxisCard axis={axis} index={index} key={axis.axisId} />
        ))}
      </section>

      <section className="facetCoverage" aria-labelledby="facet-coverage-heading">
        <div className="sectionIntro">
          <p className="eyebrow">semantic coverage / diversity first</p>
          <h2 id="facet-coverage-heading">42 facetで多様性coverageを上げる</h2>
          <p>
            6軸はレビュー圧縮の上位層で、専門知識の最終解像度ではない。85〜90%は最低限の床であり、
            Axiomでは42 facetとresidual watchlistで97% target、Founder review後に99%相当を目指す。
          </p>
        </div>
        <dl className="movementGrid">
          {semanticFacetCoverage.coverageCurve.map((step) => (
            <div key={step.layer}>
              <dt>{step.layer}</dt>
              <dd>{step.estimatedSemanticCoveragePercent}%</dd>
              <p>{step.interpretation}</p>
            </div>
          ))}
        </dl>
        <div className="facetGroups">
          {knowledgeObject.axes.map((axis) => {
            const axisFacets = semanticFacetCoverage.facets.filter(
              (facet) => facet.parentAxisId === axis.axisId,
            );

            return (
              <article key={axis.axisId}>
                <header>
                  <p>{axisFacets.length} facets</p>
                  <h3>{axis.candidateLabelJa}</h3>
                </header>
                <CompactList
                  items={axisFacets.map(
                    (facet) => `${facet.labelJa}: ${facet.roleJa}`,
                  )}
                  limit={8}
                />
              </article>
            );
          })}
        </div>
        <div className="residualGrid">
          {semanticFacetCoverage.residuals.map((residual) => (
            <article key={residual.residualId}>
              <h3>{residual.labelJa}</h3>
              <p>{residual.whyRetainedJa}</p>
              <CompactList items={residual.relatedFacetIds} />
            </article>
          ))}
        </div>
      </section>

      <section className="contrast" aria-labelledby="contrast-heading">
        <div className="sectionIntro">
          <p className="eyebrow">bootstrap prior contrast</p>
          <h2 id="contrast-heading">L3 27 seedとの照合</h2>
          <p>
            L3 27はAxiom本文の材料ではない。六軸を作った後に、coverage / gap / merge / split / rename / holdの確認表として使う。
          </p>
        </div>
        <dl className="movementGrid">
          {Object.entries(l3ContrastReport.movementSummary).map(([movement, count]) => (
            <div key={movement}>
              <dt>{movement}</dt>
              <dd>{count}</dd>
            </div>
          ))}
        </dl>
        <div className="contrastRows">
          {l3ContrastReport.rows.map((row) => (
            <article key={row.seedId}>
              <header>
                <p>{row.seedKind}</p>
                <h3>{row.seedId} {row.l3LabelJa}</h3>
                <span>{row.movement}</span>
              </header>
              <p>{row.reasonJa}</p>
              <p className="question">{row.founderReviewQuestionJa}</p>
              <div className="chips">
                {row.comparedAxisIds.map((axisId) => (
                  <span key={axisId}>{axisId}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
        </div>
      </details>

      <style jsx>{`
        .domainReview {
          background: #fbfaf6;
          color: #17201a;
          min-height: 100vh;
          padding: 48px 32px;
        }

        .hero,
        .boundary,
        .discoveryCard,
        .axisCard,
        .receiptShell,
        .contrast {
          background: #fffefb;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          box-shadow: 0 16px 48px rgba(31, 45, 32, 0.06);
        }

        .hero {
          padding: 28px;
        }

        .eyebrow {
          color: #667568;
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin: 0;
        }

        h1 {
          font-size: clamp(2rem, 5vw, 4.4rem);
          line-height: 0.98;
          margin-top: 10px;
          max-width: 920px;
        }

        .hero > p:last-of-type {
          color: #3f4c43;
          line-height: 1.7;
          margin-top: 18px;
          max-width: 980px;
        }

        .heroMeta,
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .heroMeta {
          margin-top: 20px;
        }

        .heroMeta span,
        .chips span,
        .contrastRows header span {
          background: #eef1e8;
          border: 1px solid #d8ded1;
          border-radius: 999px;
          color: #2f4736;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 6px 10px;
        }

        .boundary,
        .discoveryStack,
        .axisStack,
        .receiptShell,
        .facetCoverage,
        .contrast {
          margin-top: 18px;
        }

        .boundary {
          display: grid;
          gap: 20px;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 0.8fr);
          padding: 22px;
        }

        .boundary h2,
        .sectionIntro h2 {
          font-size: 1.25rem;
          margin-top: 4px;
        }

        .boundary p,
        .sectionIntro p:last-child,
        .axisCard p,
        .contrastRows p {
          color: #3f4c43;
          line-height: 1.7;
        }

        .boundary dl,
        .axisMeta,
        .receiptMeta,
        .movementGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin: 0;
        }

        dt {
          color: #6b786c;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        dd {
          font-size: 0.86rem;
          font-weight: 750;
          margin: 4px 0 0;
          overflow-wrap: anywhere;
        }

        .sectionIntro {
          margin-bottom: 12px;
        }

        .discoveryStack,
        .axisStack {
          display: grid;
          gap: 14px;
        }

        .axisCard,
        .discoveryCard,
        .receiptShell,
        .facetCoverage,
        .contrast {
          padding: 20px;
        }

        .axisCard header p,
        .discoveryHeader p,
        .contrastRows header p {
          color: #667568;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .axisCard h2 {
          font-size: 1.45rem;
          margin-top: 4px;
        }

        .discoveryHeader {
          align-items: start;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }

        .discoveryHeader span {
          background: #eef1e8;
          border: 1px solid #d8ded1;
          border-radius: 999px;
          color: #2f4736;
          flex: 0 0 auto;
          font-size: 0.76rem;
          font-weight: 850;
          padding: 7px 10px;
        }

        .discoveryCard h2 {
          font-size: 1.55rem;
          margin-top: 4px;
        }

        .discoveryLead {
          color: #203228;
          font-size: 1.05rem;
          font-weight: 760;
          line-height: 1.75;
          margin-top: 12px;
        }

        .plainStatement {
          background: #eef1e8;
          border-left: 4px solid #4d6a54;
          margin-top: 14px;
          padding: 12px 14px;
        }

        .plainStatement h3,
        .hypothesisBody h3,
        .reviewPanel h3,
        .facetDetail h3 {
          color: #304137;
          font-size: 0.86rem;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .plainStatement p {
          color: #18271e;
          font-size: 1.16rem;
          font-weight: 850;
          line-height: 1.7;
        }

        .hypothesisLayout {
          display: grid;
          gap: 16px;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.48fr);
          margin-top: 16px;
        }

        .hypothesisBody,
        .reviewPanel {
          background: #f8f7f1;
          border: 1px solid #e2e6dc;
          border-radius: 8px;
          padding: 16px;
        }

        .hypothesisBody h3:not(:first-child),
        .reviewPanel h3:not(:first-child) {
          margin-top: 16px;
        }

        .reviewPanel {
          background: #fffaf0;
          border-color: #e5d9bd;
        }

        .reviewPanel ol {
          counter-reset: review;
          display: grid;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .reviewPanel ol li {
          background: #fffefb;
          border: 1px solid #e5d9bd;
          border-radius: 8px;
          color: #3f4c43;
          line-height: 1.5;
          padding: 9px 10px;
        }

        .reviewPanel p {
          color: #3f4c43;
          line-height: 1.65;
        }

        .facetDetail {
          margin-top: 16px;
        }

        .facetDetailGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .facetDetailGrid article {
          background: #fbfaf6;
          border: 1px solid #e2e6dc;
          border-radius: 8px;
          padding: 12px;
        }

        .facetDetailGrid h4 {
          color: #24362b;
          font-size: 0.92rem;
          margin: 0 0 6px;
        }

        .facetDetailGrid p {
          color: #4a574d;
          line-height: 1.58;
          margin: 0;
        }

        .role,
        .axisMeta,
        .axisGrid,
        details {
          margin-top: 12px;
        }

        .auditDisclosure {
          background: #fffefb;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          box-shadow: 0 16px 48px rgba(31, 45, 32, 0.06);
          margin-top: 18px;
          padding: 18px 20px;
        }

        .auditDisclosure > summary {
          font-size: 1rem;
        }

        .auditBody {
          margin-top: 16px;
        }

        .axisGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .axisGrid section,
        .reviewUnitGrid article,
        .receiptDetails section,
        .facetGroups article,
        .residualGrid article,
        .contrastRows article {
          background: #f8f7f1;
          border: 1px solid #e2e6dc;
          border-radius: 8px;
          padding: 14px;
        }

        .axisGrid h3,
        .receiptShell h3,
        .facetGroups h3,
        .residualGrid h3,
        .contrastRows h3 {
          font-size: 0.95rem;
          margin-bottom: 8px;
        }

        .receiptShell h4 {
          font-size: 0.84rem;
          margin: 12px 0 6px;
        }

        ul {
          display: grid;
          gap: 6px;
          margin: 0;
          padding-left: 18px;
        }

        li {
          color: #3f4c43;
          line-height: 1.55;
        }

        summary {
          color: #2e4a37;
          cursor: pointer;
          font-weight: 850;
        }

        details p {
          margin-top: 8px;
        }

        details ul {
          margin-top: 8px;
        }

        .movementGrid {
          grid-template-columns: repeat(5, minmax(0, 1fr));
          margin-top: 14px;
        }

        .movementGrid div {
          background: #eef1e8;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 10px;
        }

        .movementGrid dd {
          font-size: 1.3rem;
        }

        .movementGrid p {
          color: #4e5c51;
          font-size: 0.78rem;
          line-height: 1.5;
          margin-top: 6px;
        }

        .facetGroups,
        .reviewUnitGrid,
        .residualGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .facetGroups header p {
          color: #667568;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .reviewUnitGrid header p {
          color: #667568;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .reviewUnitGrid article dl,
        .receiptDetails {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin: 12px 0 0;
        }

        .reviewUnitGrid article dl div {
          background: #eef1e8;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 8px;
        }

        .residualGrid p {
          color: #3f4c43;
          line-height: 1.65;
          margin-bottom: 10px;
        }

        .contrastRows {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 14px;
        }

        .contrastRows header {
          align-items: flex-start;
          display: grid;
          gap: 8px;
          margin-bottom: 8px;
        }

        .question {
          border-left: 3px solid #78876f;
          margin-top: 8px;
          padding-left: 10px;
        }

        .chips {
          margin-top: 10px;
        }

        .chips span {
          border-radius: 6px;
          overflow-wrap: anywhere;
        }

        @media (max-width: 980px) {
          .domainReview {
            padding: 28px 18px;
          }

          .boundary,
          .boundary dl,
          .axisMeta,
          .hypothesisLayout,
          .facetDetailGrid,
          .axisGrid,
          .movementGrid,
          .facetGroups,
          .reviewUnitGrid,
          .receiptDetails,
          .residualGrid,
          .contrastRows {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
