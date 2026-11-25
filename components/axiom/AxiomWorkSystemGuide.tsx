import { AxiomNextSiteLink as Link } from './AxiomNextSiteLinks';
import { Download } from 'lucide-react';
import type { NBL_CONSULTATION_CASE_V2_READER_PRODUCTION } from '@/lib/fchma/core/nblConsultationCaseV2ReaderProduction';
import AxiomWorkSystemScenario from './AxiomWorkSystemScenario';
import AxiomEmploymentWorkPlan from './AxiomEmploymentWorkPlan';
import { employmentWorkPlanFields, employmentWorkPlanHref } from './employmentWorkPlan';
import { workSystemPracticalExamples } from './workSystemPracticalExamples';
import styles from './AxiomWorkSystemGuide.module.css';
import ResearchKnowledgeApplication from './ResearchKnowledgeApplication';

type Guide = (typeof NBL_CONSULTATION_CASE_V2_READER_PRODUCTION.guides)[number];

export function buildWorkSystemBlankMemo(guide: Guide) {
  const example = workSystemPracticalExamples[guide.systemId];
  return [
    `# ${example?.memoTitle ?? `${guide.readerTitleJa} — 話し合うためのメモ`}`,
    'NBL 仕事設計ガイド2.0 / 2026年11月25日版',
    '',
    '必要な行だけ使えます。全項目の記入は必要ありません。',
    '個人情報を記入せず、仕事の条件・選択肢・担当を整理します。NBLへの提出用ではありません。',
    '',
    ...(guide.systemId === 'WDG2-03'
      ? [
          '## 任せる仕事と支援を組み立てる',
          ...employmentWorkPlanFields.map((field) => `- ${field}：`),
          '',
          '## 仕事を渡すときの具体的な条件',
        ]
      : []),
    ...(example?.memoFields.map((field) => `- ${field}：`) ?? ['- いま困っている仕事の場面：']),
    '- 本人が守りたいこと／共有する範囲：',
    '- 変えてみること／保留すること：',
    '- 決める人／実施する人／必要な時間や資源：',
    '- 止める条件／使える代替経路：',
    '- 見直す機会：',
    '',
    '## 試したあと、必要に応じて',
    '- 予定した変更／実際にできた変更・できなかったこと：',
    '- 良くなったこと／変わらないこと／悪化・中断／別の人への負担：',
    '- 本人の希望・機会への影響／不明な点：',
    '- 次に確かめること／見直す対応と担当：',
    '',
    'これは効果や個別の適合性を判定する用紙ではありません。記入後は職場の情報管理手順で扱います。',
  ].join('\n');
}

export default function AxiomWorkSystemGuide({
  guide,
  entry,
  visual,
  frameTitles,
  relatedCases,
  compareJobConditions = false,
}: {
  guide: Guide;
  entry: { problem: string; change: string };
  visual: { src: string; alt: string; caption: string };
  frameTitles: string[];
  relatedCases: Array<{ caseId: string; openingJa: string }>;
  compareJobConditions?: boolean;
}) {
  const example = workSystemPracticalExamples[guide.systemId];
  // Reorder only supplied, already-linked cases. Do not introduce new evidence mappings.
  const caseRank = (id: string) => {
    const index = example?.primaryCaseIds.indexOf(id) ?? -1;
    return index < 0 ? Number.MAX_SAFE_INTEGER : index;
  };
  const orderedCases = [...relatedCases].sort((a, b) => caseRank(a.caseId) - caseRank(b.caseId));
  const translatedActions = example?.actionDetails.some((item) => item.readerTitle);
  const operationItems = example?.operationItems ?? [
    { label: '関わる役割', value: guide.ownersJa.join(' ／ ') },
    { label: '確認・更新の機会（例）', value: guide.operatingCadenceJa },
    { label: '用意するもの', value: guide.artifactsJa.join(' ／ ') },
  ];
  const memoDownload = (
    <>
      <a
        className={styles.download}
        download={`nbl-${guide.systemId.toLowerCase()}-work-memo.md`}
        href={`data:text/markdown;charset=utf-8,${encodeURIComponent(buildWorkSystemBlankMemo(guide))}`}
      >
        <Download size={17} aria-hidden="true" />{' '}
        {example ? `${example.memoTitle}を保存（白紙）` : '必要な行だけ使える白紙メモを保存'}
      </a>
      <p className={styles.caption}>
        任意のMarkdownメモです。必要な行だけ使えます。この画面で個人情報の入力・保存・送信は行いません。
      </p>
    </>
  );
  return (
    <div className={styles.guide}>
      {example && <AxiomWorkSystemScenario scenario={example.scenario} />}
      <section
        className={styles.foundation}
        id={`${guide.systemId}-common-foundation`}
        aria-label={entry.problem}
      >
        <h3>{entry.change}</h3>
        <p>
          {example?.startHere ??
            'いま困っている仕事の場面から、必要な変更を選べます。個別相談から始めても構いません。診断名の開示や、職場の仕組みをすべて整え終えることは前提にしません。'}
        </p>
        <ul className={example ? styles.explainedActions : styles.actions}>
          {guide.installBeforeCaseJa.map((item) => {
            const explanation = example?.actionDetails.find((detail) => detail.sourceText === item);
            return (
              <li
                key={item}
                id={explanation?.anchorId}
                tabIndex={explanation?.anchorId ? -1 : undefined}
                style={explanation?.anchorId ? { scrollMarginTop: '6rem' } : undefined}
              >
                {explanation ? (
                  <>
                    <strong>{explanation.readerTitle ?? item}</strong>
                    <p>{explanation.explanation}</p>
                  </>
                ) : (
                  item
                )}
              </li>
            );
          })}
        </ul>
        <div className={styles.operation}>
          <h4>{example?.operationTitle ?? '話を、実際に動かせる担当へつなぐ'}</h4>
          <dl>
            {operationItems.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <aside className={styles.stop}>
          <h4>そのまま進めず、別の対応を考えるとき</h4>
          <p>{guide.stopAndEscalationJa}</p>
          {example && <p>{example.stopClarification}</p>}
        </aside>
      </section>

      {compareJobConditions && guide.systemId === 'WDG2-02' && <ResearchKnowledgeApplication mode="work" initialExampleId="sharing-response" />}
      {compareJobConditions && guide.systemId === 'WDG2-03' && <ResearchKnowledgeApplication mode="job" initialExampleId="instruction-scope" />}
      {compareJobConditions && guide.systemId === 'WDG2-09' && <ResearchKnowledgeApplication mode="job" initialExampleId="person-valued-roles" />}

      {guide.systemId === 'WDG2-03' && <AxiomEmploymentWorkPlan download={memoDownload} />}
      {['WDG2-07', 'WDG2-09'].includes(guide.systemId) && (
        <p className={styles.chapter}>
          仕事の中身・教え方・支援・評価を一緒に決めたいときは、
          <Link className={styles.inlineLink} href={employmentWorkPlanHref}>
            任せる仕事と支援を組み立てる記入例・白紙メモ
          </Link>
          を使えます。
        </p>
      )}

      <section className={styles.chapter} aria-labelledby={`${guide.systemId}-person-title`}>
        <h3 id={`${guide.systemId}-person-title`}>
          {example?.personTitle ?? 'この人には、何を変えるとよさそうか'}
        </h3>
        <p>
          {example?.personIntro ??
            '同じ困りごとに見えても、本人の希望や仕事の条件で対応は変わります。次の問いのうち、判断を変えそうなことから確かめます。'}
        </p>
        <ul className={styles.questions}>
          {guide.individualizationQuestionsJa.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {guide.systemId === 'WDG2-03' && (
          <p>
            質問した際の叱責や不利益が心配なときは、本人の質問練習だけで解決しようとせず、
            <Link
              className={styles.inlineLink}
              href="/preview/axiom-next-nbl-v2/work-design-views-guide?system=WDG2-01#WDG2-01-common-foundation"
            >
              上司以外にも話せる相談経路
            </Link>
            を確かめます。事実の確認と、いま必要な安全確保・仕事の調整は分けて進めます。
          </p>
        )}
        <h4>答えを受けて、対応を組み立てる</h4>
        <div className={styles.adaptation}>
          {guide.caseActivationJa.map((item) => (
            <p key={item}>
              {example?.adaptationDetails?.find((detail) => detail.sourceText === item)
                ?.readerText ?? item}
            </p>
          ))}
        </div>
        {guide.systemId === 'WDG2-08' && (
          <p>
            <Link href="/preview/axiom-next-nbl-v2/case-readings#health-time-and-morning-variation">
              相談事例へ：必要な時の交代が、ほかの仕事や本人の役割にぶつかるとき
            </Link>
          </p>
        )}
        {relatedCases.length > 0 && (
          <nav className={styles.related} aria-label={`${guide.readerTitleJa}につながる相談事例`}>
            <h4>相談の一言から、対応を考える</h4>
            <ul>
              {orderedCases.slice(0, 3).map((item) => (
                <li key={item.caseId}>
                  <Link
                    href={`/preview/axiom-next-nbl-v2/case-readings#${encodeURIComponent(item.caseId)}`}
                  >
                    「{item.openingJa}」
                  </Link>
                </li>
              ))}
            </ul>
            {relatedCases.length > 3 && (
              <details className={styles.moreCases}>
                <summary>ほかの関連相談を見る（{relatedCases.length - 3}件）</summary>
                <ul>
                  {orderedCases.slice(3).map((item) => (
                    <li key={item.caseId}>
                      <Link
                        href={`/preview/axiom-next-nbl-v2/case-readings#${encodeURIComponent(item.caseId)}`}
                      >
                        「{item.openingJa}」
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </nav>
        )}
      </section>

      <section className={styles.chapter} aria-labelledby={`${guide.systemId}-review-title`}>
        <h3 id={`${guide.systemId}-review-title`}>
          {example?.reviewTitle ?? '良くなったことと、残った負担を分ける'}
        </h3>
        <p>
          {example?.reviewIntro ??
            '予定した変更と実際にできた変更を分けて確認します。未実施なら実施を妨げた条件を、実施しても変わらなければ別の説明や対応を検討します。改善だけでなく、無変化・悪化・中断・不明な点も残します。'}
        </p>
        {example && <p>{example.outcomePrompt}</p>}
        <p className={styles.outcome}>{guide.outcomeReviewJa}</p>
        <ul className={styles.burden}>
          {guide.burdenAndEquityChecksJa.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>別の負担や不利益が見えたら、本人の希望と担当者の判断に戻って対応を見直します。</p>
        {guide.systemId !== 'WDG2-03' && memoDownload}
      </section>

      <details className={styles.details}>
        <summary>仕事条件の図・元のフレームを確かめる</summary>
        <figure className={styles.reference}>
          <img src={visual.src} alt={visual.alt} loading="lazy" />
          <figcaption>{visual.caption}</figcaption>
        </figure>
        {frameTitles.length > 0 ? (
          <ul>
            {frameTitles.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
        ) : (
          <p>
            個別の仕事条件を横断する負担配分や結果の見直しを扱うため、現行版の単一フレームには対応していません。
          </p>
        )}
        <h4>現行版から引き継ぎ、広げたこと</h4>
        <p>{guide.currentGuideDeltaJa}</p>
        {example?.researchLinks && (
          <nav aria-label="この説明に関連する研究抄録">
            <h4>判断の根拠を、もう少し詳しく</h4>
            <ul>
              {example.researchLinks.map((item) => (
                <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
              ))}
            </ul>
          </nav>
        )}
        {example?.readerPurpose && (
          <>
            <h4>本文のもとにした目的</h4>
            <p>{guide.purposeJa}</p>
          </>
        )}
        {translatedActions && (
          <>
            <h4>本文のもとにした整備項目</h4>
            <p className={styles.caption}>
              以下は既存ガイドの設計上の表現です。本文では実際の役割と行動で説明しています。一律の必須様式や企業の採点項目ではありません。
            </p>
            <ul>
              {guide.installBeforeCaseJa.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {example?.adaptationDetails && (
              <>
                <h4>個別対応のもとにした表現</h4>
                <p className={styles.caption}>
                  「一つの変更」は始め方の例であり、必要な複合調整を禁止する条件ではありません。本文では変更の組合せと、結果の原因を断定しない扱いを示しています。
                </p>
                <ul>
                  {guide.caseActivationJa.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            {example?.operationItems && (
              <dl className={styles.contrasts}>
                <div>
                  <dt>想定した役割</dt>
                  <dd>{guide.ownersJa.join(' ／ ')}</dd>
                </div>
                <div>
                  <dt>確認・更新の機会（例）</dt>
                  <dd>{guide.operatingCadenceJa}</dd>
                </div>
                <div>
                  <dt>道具の設計上の名前</dt>
                  <dd>{guide.artifactsJa.join(' ／ ')}</dd>
                </div>
              </dl>
            )}
          </>
        )}
      </details>
      <details className={styles.details}>
        <summary>繰り返し使える仕組みにするための参照</summary>
        <p>{guide.readinessQuestionJa}</p>
        <p className={styles.caption}>
          職場や人を採点する尺度ではありません。今の運用で何が途切れるかを見るための対照です。
        </p>
        <dl className={styles.contrasts}>
          <div>
            <dt>仕組みがないとき</dt>
            <dd>{guide.readinessLevelsJa.absent}</dd>
          </div>
          <div>
            <dt>部分的な対応にとどまるとき</dt>
            <dd>{guide.readinessLevelsJa.fragile}</dd>
          </div>
          <div>
            <dt>仕事の運用に組み込めたとき</dt>
            <dd>{guide.readinessLevelsJa.operating}</dd>
          </div>
        </dl>
      </details>
    </div>
  );
}
