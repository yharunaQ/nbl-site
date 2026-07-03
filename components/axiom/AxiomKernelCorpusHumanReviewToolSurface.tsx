import {
  buildAxiomKernelCorpusHumanReviewTool,
  type AxiomKernelCorpusHumanReviewTool,
  type AxiomKernelCorpusHumanReviewToolDossierRow,
  type AxiomKernelCorpusHumanReviewToolUnit,
} from '@/lib/axiom/kernelCorpusHumanReviewTool';
import {
  buildAxiomKernelCorpusHumanReviewResultReceipt,
  type AxiomKernelCorpusHumanReviewResultReceipt,
} from '@/lib/axiom/kernelCorpusHumanReviewResultReceipt';

const tool = buildAxiomKernelCorpusHumanReviewTool();
const reviewResultReceipt = buildAxiomKernelCorpusHumanReviewResultReceipt(tool);
const previewUnits = tool.units;
const receiptTemplateText = JSON.stringify(tool.receiptTemplate, null, 2);
const reviewResultReceiptText = JSON.stringify(reviewResultReceipt, null, 2);

function labelForDecision(decision: AxiomKernelCorpusHumanReviewToolUnit['decisionOptions'][number]) {
  if (decision === 'accept_as_provisional_kernel_structure') {
    return '暫定kernel構造として受け入れる';
  }
  if (decision === 'revise_kernel_fields_before_review_result') {
    return 'review result前にkernel fieldを修正';
  }
  if (decision === 'hold_for_missing_context_or_source_lens') {
    return 'missing context / source lens確認までhold';
  }

  return 'promotion前に外部人間レビュー必須';
}

function noteLabel(field: AxiomKernelCorpusHumanReviewToolUnit['noteFields'][number]) {
  const labels: Record<AxiomKernelCorpusHumanReviewToolUnit['noteFields'][number], string> = {
    reviewer_name_or_role: 'reviewer / role',
    decision_reason: '判断理由',
    required_revision: '必要修正',
    missing_context_to_check: '追加確認すべきmissing context',
    source_lens_or_bias_risk: 'source lens / bias risk',
    promotion_blocker: 'promotion blocker',
  };

  return labels[field];
}

function BoundarySummary({ reviewTool }: { reviewTool: AxiomKernelCorpusHumanReviewTool }) {
  return (
    <dl className="boundaryGrid">
      <div>
        <dt>review</dt>
        <dd>{reviewTool.reviewExecutionStatus}</dd>
      </div>
      <div>
        <dt>assignment</dt>
        <dd>{reviewTool.reviewerAssignmentStatus}</dd>
      </div>
      <div>
        <dt>submit</dt>
        <dd>{reviewTool.submissionStatus}</dd>
      </div>
      <div>
        <dt>storage</dt>
        <dd>{reviewTool.persistenceStatus}</dd>
      </div>
      <div>
        <dt>approval</dt>
        <dd>{reviewTool.approvalStatus}</dd>
      </div>
      <div>
        <dt>publication</dt>
        <dd>{reviewTool.publicationStatus}</dd>
      </div>
    </dl>
  );
}

function ReviewResultSummary({
  receipt,
}: {
  receipt: AxiomKernelCorpusHumanReviewResultReceipt;
}) {
  return (
    <section className="reviewResult" aria-labelledby="founder-review-result">
      <div>
        <p className="eyebrow">Founder review result received</p>
        <h2 id="founder-review-result">18 / 18 accepted as provisional kernel structure</h2>
        <p>{receipt.externalReviewSummaryJa}</p>
      </div>
      <dl className="resultGrid">
        <div>
          <dt>kernel use</dt>
          <dd>{receipt.status}</dd>
        </div>
        <div>
          <dt>public interface</dt>
          <dd>{receipt.reviewResultInterpretation.kernelBackedPublicInterfaceContinuation}</dd>
        </div>
        <div>
          <dt>next allowed step</dt>
          <dd>{receipt.publicInterfaceBridge.nextAllowedStep}</dd>
        </div>
      </dl>
      <div className="bridgeGrid">
        <section>
          <h3>公開インターフェイスへ接続するもの</h3>
          <CompactList items={[...receipt.publicInterfaceBridge.allowedPublicTranslationFields]} />
        </section>
        <section>
          <h3>直接出さないもの</h3>
          <CompactList items={[...receipt.publicInterfaceBridge.doNotExposeAsPublicTruth]} />
        </section>
      </div>
    </section>
  );
}

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

function DossierRow({ row }: { row: AxiomKernelCorpusHumanReviewToolDossierRow }) {
  return (
    <article className="dossierRow">
      <header>
        <p>{row.scenarioLabelJa}</p>
        <h3>{row.packetId}</h3>
      </header>
      <div className="unitMeta">
        <span>{row.actionabilityBand}</span>
        {row.sourceFamilyLabelsJa.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="dossierGrid">
        <section>
          <h4>観察</h4>
          <CompactList items={row.observations} />
        </section>
        <section>
          <h4>推論</h4>
          <p>{row.inference}</p>
        </section>
        <section>
          <h4>反対仮説</h4>
          <CompactList items={row.counterHypotheses} />
        </section>
        <section>
          <h4>Missing context</h4>
          <CompactList items={row.missingContextQuestions} limit={4} />
        </section>
        <section>
          <h4>Source lens</h4>
          <CompactList items={row.sourceLensStatusSummary} />
        </section>
        <section>
          <h4>Cannot yet say</h4>
          <CompactList items={row.cannotYetSay} />
        </section>
      </div>
      <details>
        <summary>根拠span / 実装主体条件 / data policyを見る</summary>
        <div className="detailGrid">
          <section>
            <h4>根拠span要約</h4>
            <CompactList items={row.evidenceSpanSummaries} limit={6} />
          </section>
          <section>
            <h4>実装主体条件</h4>
            <CompactList items={row.implementationActorConditions} />
          </section>
          <section>
            <h4>Data policy</h4>
            <p>{row.dataPolicyNote}</p>
          </section>
        </div>
      </details>
    </article>
  );
}

function ReviewItemIndex({ units }: { units: AxiomKernelCorpusHumanReviewToolUnit[] }) {
  return (
    <section className="reviewItemIndex" aria-labelledby="review-item-index">
      <h2 id="review-item-index">レビューする18項目</h2>
      <p>
        この画面で人間レビューする対象は、下の18項目です。各項目はAxiom coreに入る前の暫定kernel review unitで、公開承認やsource/support validity判断ではありません。
      </p>
      <ol>
        {units.map((unit, index) => (
          <li key={unit.toolUnitId}>
            <span>Review item {index + 1} / {units.length}</span>
            <strong>{unit.reviewDossier.titleJa}</strong>
            <em>{unit.reviewDossier.reviewQuestionJa}</em>
          </li>
        ))}
      </ol>
    </section>
  );
}

function UnitCard({ unit, index }: { unit: AxiomKernelCorpusHumanReviewToolUnit; index: number }) {
  const groupName = `decision-${index}`;
  const dossier = unit.reviewDossier;

  return (
    <article className="unitCard">
      <header>
        <p>
          Review item {index + 1} / {previewUnits.length}
        </p>
        <h2>{dossier.titleJa}</h2>
      </header>
      <div className="unitMeta">
        <span>kernel row {unit.rowCount}件</span>
        <span>scenario {unit.scenarioIds.length}種類</span>
        <span>source family {unit.sourceFamilyEntryIds.length}系統</span>
      </div>
      <section className="plainReview" aria-label={`${unit.sourceReviewUnitId} plain review target`}>
        <p className="purpose">{dossier.shortPurposeJa}</p>
        <section className="reviewQuestionBox">
          <h3>レビュー問い</h3>
          <p>{dossier.reviewQuestionJa}</p>
        </section>
        <div className="plainReviewGrid">
          <section>
            <h3>ここで判断すること</h3>
            <CompactList items={dossier.reviewerMustJudgeJa} />
          </section>
          <section>
            <h3>ここで判断しないこと</h3>
            <CompactList items={dossier.reviewerMustNotJudgeJa} />
          </section>
          <section>
            <h3>受け入れでよい状態</h3>
            <p>{dossier.acceptIfJa}</p>
          </section>
          <section>
            <h3>修正が必要な状態</h3>
            <p>{dossier.reviseIfJa}</p>
          </section>
          <section>
            <h3>保留すべき状態</h3>
            <p>{dossier.holdIfJa}</p>
          </section>
        </div>
      </section>
      <fieldset>
        <legend>Recorded review decision</legend>
        {unit.decisionOptions.map((decision) => (
          <label key={decision}>
            <input
              defaultChecked={decision === 'accept_as_provisional_kernel_structure'}
              name={groupName}
              type="radio"
              value={decision}
            />
            <span>{labelForDecision(decision)}</span>
          </label>
        ))}
      </fieldset>
      <div className="notes">
        {unit.noteFields.map((field) => (
          <label key={field}>
            <span>{noteLabel(field)}</span>
            <textarea rows={2} />
          </label>
        ))}
      </div>
      <details className="technicalDetails">
        <summary>根拠とチェックリストを開く</summary>
        <section className="dossierIntro" aria-label={`${unit.sourceReviewUnitId} review dossier`}>
          <p>{dossier.whatReviewerReadsJa}</p>
          <p>{dossier.whyThisMattersJa}</p>
          <div className="reviewDecisionGrid">
            <section>
              <h3>含まれるシナリオ</h3>
              <CompactList items={dossier.includedScenarioLabelsJa} />
            </section>
            <section>
              <h3>含まれる実データ系統</h3>
              <CompactList items={dossier.includedSourceFamilyLabelsJa} />
            </section>
          </div>
        </section>
        <p className="question">{unit.reviewQuestion}</p>
        <div className="technicalIdBox">
          <span>internal unit id: {unit.sourceReviewUnitId}</span>
          <span>kernel fields: {unit.kernelFieldsInScope.join(', ')}</span>
        </div>
        <section className="kernelRows" aria-label={`${unit.sourceReviewUnitId} kernel rows`}>
          <h3>レビュー対象のkernel rows</h3>
          {dossier.rows.map((row) => (
            <DossierRow key={row.rowId} row={row} />
          ))}
        </section>
        <section aria-label={`${unit.sourceReviewUnitId} checklist`} className="checklist">
          {unit.checklistLabels.map((label) => (
            <label key={label}>
              <input type="checkbox" />
              <span>{label}</span>
            </label>
          ))}
        </section>
      </details>
    </article>
  );
}

export default function AxiomKernelCorpusHumanReviewToolSurface() {
  return (
    <main className="reviewTool">
      <header className="hero">
        <p className="eyebrow">Falcon Lab / Axiom core</p>
        <h1>Axiom Kernel Corpus Human Review Tool</h1>
        <p>
          18個のreview itemはFounderレビューで暫定kernel構造として受け入れ済み。
          この画面は、kernel-backed public interfaceへ進むための接続範囲と、直接出してはいけないものを確認する内部ツール。
        </p>
      </header>

      <section className="reviewTarget" aria-labelledby="review-target">
        <h2 id="review-target">何をレビューする画面か</h2>
        <p>
          レビュー対象は公開ページ案そのものではなく、公開面を生成する基盤になるAxiom kernel corpusです。
          不完全な実データを現実の影として読む構造は受け入れ済みで、次はkernel objectを安全な公開fieldへ翻訳します。
          ただし最終source/support validity、candidate_pattern昇格、個別事例の最終判断、raw/source text、runtime変更、publication実行はこの結果だけでは出しません。
        </p>
      </section>

      <ReviewResultSummary receipt={reviewResultReceipt} />

      <ReviewItemIndex units={previewUnits} />

      <section className="summary" aria-labelledby="tool-summary">
        <div>
          <h2 id="tool-summary">Tool Summary</h2>
          <p>{tool.boundary}</p>
        </div>
        <dl className="summaryGrid">
          <div>
            <dt>status</dt>
            <dd>{tool.status}</dd>
          </div>
          <div>
            <dt>units</dt>
            <dd>
              {tool.unitCount} / {tool.maxCoreHumanReviewUnits}
            </dd>
          </div>
          <div>
            <dt>kernel rows</dt>
            <dd>{tool.totalKernelRows}</dd>
          </div>
          <div>
            <dt>source families</dt>
            <dd>{tool.sourceFamilyCount}</dd>
          </div>
          <div>
            <dt>scenarios</dt>
            <dd>{tool.scenarioCount}</dd>
          </div>
          <div>
            <dt>receipt</dt>
            <dd>{tool.receiptTemplateStatus}</dd>
          </div>
          <div>
            <dt>founder result</dt>
            <dd>{reviewResultReceipt.overallDecision}</dd>
          </div>
        </dl>
      </section>

      <section className="boundary" aria-labelledby="boundary">
        <h2 id="boundary">Movement Boundary</h2>
        <BoundarySummary reviewTool={tool} />
      </section>

      <section className="instructions" aria-labelledby="review-instructions">
        <h2 id="review-instructions">Review Instructions</h2>
        <ol>
          <li>18項目はすべて「暫定kernel構造として受け入れる」で受領済み。</li>
          <li>各itemの短い目的と「判断すること / 判断しないこと」は、公開翻訳時の守るべきルールとして読む。</li>
          <li>必要修正・missing context・source lens riskが後から出た場合だけ、該当itemを修正またはholdへ戻す。</li>
          <li>必要な場合だけ「根拠とチェックリストを開く」を見る。</li>
          <li>次の作業は、review済みkernel fieldsから公開用content slotsを作ること。</li>
        </ol>
      </section>

      <section className="unitList" aria-labelledby="review-units">
        <h2 id="review-units">18項目レビュー入力</h2>
        {previewUnits.map((unit, index) => (
          <UnitCard index={index} key={unit.toolUnitId} unit={unit} />
        ))}
      </section>

      <section className="receipt" aria-labelledby="receipt-template">
        <h2 id="receipt-template">Blank Receipt Template</h2>
        <p>
          元のreview toolはsubmitしない入力補助として残す。実際のFounderレビュー結果は下のreceipt contractとして記録済み。
        </p>
        <textarea readOnly rows={18} value={receiptTemplateText} />
      </section>

      <section className="receipt" aria-labelledby="review-result-receipt">
        <h2 id="review-result-receipt">Founder Review Result Receipt</h2>
        <p>
          18項目すべてaccept。Axiom kernelを次期NBL公開インターフェイスの生成基盤として使う。ただし最終妥当性、個別判断、publication実行、runtime変更、learning updateはこのreceiptでは動かさない。
        </p>
        <textarea readOnly rows={18} value={reviewResultReceiptText} />
      </section>

      <style jsx>{`
        .reviewTool {
          min-height: 100vh;
          background: #f7f5ef;
          color: #17201a;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            sans-serif;
          padding: 40px;
        }

        .hero,
        .reviewTarget,
        .reviewResult,
        .summary,
        .reviewItemIndex,
        .boundary,
        .instructions,
        .unitList,
        .receipt {
          max-width: 1180px;
          margin: 0 auto 24px;
        }

        .hero {
          border-bottom: 1px solid #cad2c3;
          padding-bottom: 28px;
        }

        .eyebrow {
          color: #59705e;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        h1,
        h2,
        p,
        dl,
        ol {
          margin: 0;
        }

        h1 {
          font-size: clamp(2.2rem, 5vw, 4.2rem);
          line-height: 1;
          letter-spacing: 0;
          max-width: 920px;
          margin-top: 10px;
        }

        .hero p:last-child,
        .reviewTarget p,
        .reviewItemIndex p,
        .summary p,
        .receipt p,
        .question,
        li {
          color: #4d5a51;
          font-size: 0.92rem;
          line-height: 1.7;
        }

        .hero p:last-child {
          max-width: 760px;
          margin-top: 18px;
        }

        .summary,
        .reviewResult,
        .reviewItemIndex,
        .reviewTarget,
        .boundary,
        .instructions,
        .receipt,
        .unitCard {
          background: #fff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 22px;
        }

        .summary {
          display: grid;
          gap: 22px;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        }

        .reviewResult {
          display: grid;
          gap: 18px;
        }

        .reviewItemIndex ol {
          display: grid;
          gap: 10px;
          margin: 16px 0 0;
          padding: 0;
        }

        .reviewItemIndex li {
          background: #f5f7f0;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          display: grid;
          gap: 5px;
          list-style: none;
          padding: 14px;
        }

        .reviewItemIndex span {
          color: #5e705f;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .reviewItemIndex strong {
          color: #17201a;
          font-size: 1rem;
          line-height: 1.45;
        }

        .reviewItemIndex em {
          color: #435147;
          font-size: 0.9rem;
          font-style: normal;
          line-height: 1.6;
        }

        .summaryGrid,
        .boundaryGrid,
        .resultGrid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .summaryGrid div,
        .boundaryGrid div,
        .resultGrid div {
          background: #eef2e9;
          border-radius: 8px;
          padding: 12px;
        }

        .bridgeGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .bridgeGrid section {
          background: #f5f7f0;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 14px;
        }

        .bridgeGrid h3 {
          color: #1f2e24;
          font-size: 0.86rem;
          margin: 0 0 8px;
        }

        .bridgeGrid ul {
          display: grid;
          gap: 6px;
          margin: 0;
          padding-left: 18px;
        }

        dt {
          color: #6d7c6e;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        dd {
          color: #1c281f;
          font-size: 0.9rem;
          font-weight: 700;
          margin: 4px 0 0;
          overflow-wrap: anywhere;
        }

        .instructions ol {
          display: grid;
          gap: 8px;
          margin-top: 12px;
          padding-left: 20px;
        }

        .unitList {
          display: grid;
          gap: 14px;
        }

        .unitCard header p {
          color: #748273;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .unitCard h2 {
          font-size: 1.28rem;
          margin-top: 6px;
          overflow-wrap: anywhere;
        }

        .unitId {
          color: #647367;
          display: inline-block;
          font-size: 0.76rem;
          font-weight: 700;
          margin-top: 6px;
          overflow-wrap: anywhere;
        }

        .unitMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .unitMeta span {
          background: #eef2e9;
          border: 1px solid #d8ded1;
          border-radius: 999px;
          color: #304034;
          font-size: 0.76rem;
          font-weight: 700;
          line-height: 1.35;
          max-width: 100%;
          overflow-wrap: anywhere;
          padding: 7px 9px;
        }

        .question {
          border-top: 1px solid #e3e7de;
          margin-top: 14px;
          padding-top: 14px;
        }

        .dossierIntro {
          background: #f5f7f0;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          display: grid;
          gap: 10px;
          margin-top: 14px;
          padding: 16px;
        }

        .plainReview {
          background: #f5f7f0;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          display: grid;
          gap: 12px;
          margin-top: 14px;
          padding: 16px;
        }

        .plainReviewGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .plainReviewGrid section {
          background: #fff;
          border: 1px solid #e1e6dc;
          border-radius: 8px;
          padding: 12px;
        }

        .reviewQuestionBox {
          background: #fff;
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 14px;
        }

        .reviewQuestionBox h3 {
          color: #1f2e24;
          font-size: 0.86rem;
          margin: 0 0 8px;
        }

        .dossierIntro p,
        .plainReview p,
        .plainReview li,
        .dossierGrid p,
        .detailGrid p,
        .dossierRow li,
        .dossierIntro li {
          color: #415046;
          font-size: 0.9rem;
          line-height: 1.65;
        }

        .purpose {
          color: #16261b;
          font-weight: 800;
        }

        .reviewDecisionGrid,
        .plainReviewGrid,
        .dossierGrid,
        .detailGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .reviewDecisionGrid section,
        .plainReviewGrid section,
        .dossierGrid section,
        .detailGrid section {
          background: #fff;
          border: 1px solid #e1e6dc;
          border-radius: 8px;
          padding: 12px;
        }

        .kernelRows {
          display: grid;
          gap: 12px;
          margin-top: 16px;
        }

        .kernelRows > h3,
        .reviewDecisionGrid h3,
        .plainReviewGrid h3,
        .dossierRow h3,
        h4 {
          color: #1f2e24;
          font-size: 0.86rem;
          margin: 0;
        }

        .dossierRow {
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 14px;
        }

        .dossierRow header p {
          color: #57705d;
          font-size: 0.8rem;
          font-weight: 800;
          line-height: 1.45;
        }

        .dossierRow h3 {
          margin-top: 4px;
          overflow-wrap: anywhere;
        }

        .dossierGrid,
        .detailGrid {
          margin-top: 12px;
        }

        .dossierGrid ul,
        .detailGrid ul,
        .plainReviewGrid ul,
        .reviewDecisionGrid ul {
          display: grid;
          gap: 6px;
          margin: 8px 0 0;
          padding-left: 18px;
        }

        details {
          margin-top: 12px;
        }

        .technicalDetails {
          border-top: 1px solid #e3e7de;
          padding-top: 14px;
        }

        .technicalIdBox {
          background: #fbfaf6;
          border: 1px solid #e3e7de;
          border-radius: 8px;
          display: grid;
          gap: 6px;
          margin-top: 12px;
          padding: 10px;
        }

        .technicalIdBox span {
          color: #68766b;
          font-size: 0.78rem;
          overflow-wrap: anywhere;
        }

        summary {
          color: #2e4a37;
          cursor: pointer;
          font-size: 0.86rem;
          font-weight: 800;
        }

        .checklist,
        fieldset,
        .notes {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }

        .checklist label,
        fieldset label {
          align-items: flex-start;
          display: flex;
          gap: 8px;
          color: #273229;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        input {
          margin-top: 0.2rem;
        }

        fieldset {
          border: 1px solid #d8ded1;
          border-radius: 8px;
          padding: 14px;
        }

        legend {
          color: #5e705f;
          font-size: 0.76rem;
          font-weight: 800;
          padding: 0 6px;
          text-transform: uppercase;
        }

        .notes {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .notes label {
          color: #5e705f;
          display: grid;
          font-size: 0.76rem;
          font-weight: 800;
          gap: 6px;
          text-transform: uppercase;
        }

        textarea {
          background: #fbfaf6;
          border: 1px solid #cad2c3;
          border-radius: 8px;
          color: #17201a;
          font: inherit;
          min-width: 0;
          padding: 10px;
          resize: vertical;
          width: 100%;
        }

        .receipt textarea {
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            'Liberation Mono',
            monospace;
          font-size: 0.82rem;
          margin-top: 12px;
        }

        @media (max-width: 900px) {
          .reviewTool {
            padding: 28px 18px;
          }

          .summary,
          .summaryGrid,
          .boundaryGrid,
          .resultGrid,
          .bridgeGrid,
          .reviewDecisionGrid,
          .plainReviewGrid,
          .dossierGrid,
          .detailGrid,
          .notes {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
