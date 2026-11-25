import { useEffect, useRef, useState } from 'react';
import FlagshipDecisionNote from './FlagshipDecisionNote';
import { AxiomNextSiteLink as Link, useNextSiteHref } from './AxiomNextSiteLinks';
import styles from './FlagshipDecisionNote.module.css';

const base = '/preview/axiom-next-nbl-v2';
const scenario = {
  case: {
    path: 'case-readings',
    link: '本人が別案・保留を考える',
    question: '校正の仕事を始めたい。夕方の帰りの介助が決まるまでに、何を確かめてから選びたい？',
    actions: [
      '校正をしてみたいことと、夕方まで働きたい理由を自分の控えに。先に業務の説明を聞く、違う時間帯を提案する、保留することも選べます。募集が始まれば、帰りの介助が未確定のまま希望の勤務で応募することもできます。企業と支援者には、分かっている条件と次の返答日を示してもらえます。',
      '事業者に夕方の担い手がいないなら、予算があるだけでは帰りは確保されません。採用前の職場訪問に費用が付かないなら、校正を任せる条件もまだ分かりません。別々に返答する人と次の返答日を聞けます。',
      '働きたい気持ちや自分の事情を伝えず、「帰りの手配を誰がいつまでに確かめますか」だけを持ち帰ることもできます。',
    ],
  },
  work: {
    path: 'work-design-views-guide',
    link: '職場が求人前の仕事を組む',
    question: '求人を出す前に、どの校正工程を、どの勤務・評価・対価で任せられるか？',
    actions: [
      '原稿と入稿データの突合、修正箇所の記録、最終承認を分けます。現場責任者が実物で件数と締切を調べ、突合と修正記録を一工程として試す案と、確認を従来の担当者が続ける案を比べます。',
      '勤務枠、教える人の有償時間、欠員時の代行、確認漏れの扱い、誰が賃金・評価を決めるかを先に示します。試すなら期限、確かめる品質と負担、本人が止める方法、元の担当へ戻す手順も決めます。',
      '夕方の介助が未確保ならその条件を本人に返します。別時間は本人が希望した場合の提案です。採用前訪問の費用が未決なら、社内で工程調査を担えるかを確認し、未確認部分と返答日を明記します。',
    ],
  },
  support: {
    path: 'support-organization-checklist',
    link: '機関が人員・費用・育成を決める',
    question: '採用前の職務分析と夕方の帰路を、どの担当・勤務・費用で用意できるか？',
    actions: [
      '採用前の訪問と、勤務日の介助を別々に記入します。例えば訪問側は担当1人の有償2時間、先輩の同行1時間、通常業務の代行1時間を別項目にし、自機関の単価と費用の承認者を入れます。数値は架空の見積もり例です。',
      '見習いは先輩の同行で実物と突合の手順を確認し、勤務・教える時間・品質の案を職場と組めたかを振り返ります。育成と訪問を勤務に組める自機関の責任者を定め、通勤介助の提供者・費用の決定者へは必要時刻と回答期日を分けて照会します。',
      '予算があっても夕方に担当者がいなければ帰路は未確保です。人がいても訪問費用が未決なら訪問を手配できるとは返しません。本人にはそれぞれの状況と次の回答日を返し、保留や別案を本人が選べるようにします。',
    ],
  },
} as const;

export const proofreadingExampleHref = '#proofreading-example';

export default function ProofreadingFlagshipExample({ kind }: { kind: keyof typeof scenario }) {
  const resolveHref = useNextSiteHref();
  const content = scenario[kind];
  const details = useRef<HTMLDetailsElement>(null);
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    function openLinkedExample() {
      if (window.location.hash !== proofreadingExampleHref || !details.current) return;
      details.current.open = true;
      setHasOpened(true);
    }
    openLinkedExample();
    window.addEventListener('hashchange', openLinkedExample);
    return () => window.removeEventListener('hashchange', openLinkedExample);
  }, []);

  const exampleHref = resolveHref(`${base}/${content.path}${proofreadingExampleHref}`);
  return (
    <section id="proofreading-example" className={styles.example} aria-labelledby="proofreading-example-title">
      <h2 id="proofreading-example-title">求人がまだない町で、校正の仕事を考える</h2>
      <details ref={details} onToggle={(event) => { if (event.currentTarget.open) setHasOpened(true); }}>
        <summary>{content.link}</summary>
        <p>架空の例です。校正の仕事をしたい人がいます。求人はまだなく、夕方の帰りを担う介助者も決まっていません。</p>
        <h3>{content.question}</h3>
        <ul>{content.actions.map((action) => <li key={action}>{action}</li>)}</ul>
        {hasOpened && <FlagshipDecisionNote
          kind={kind}
          contextId="proofreading-before-job-opening"
          contextTitle="求人がまだない町で、校正の仕事を考える（架空）"
          question={`求人と夕方の帰りの介助は未確保です。${content.question}`}
          sourceHref={proofreadingExampleHref}
          publicContext={content.actions}
          references={[
            { label: 'NBL 架空の校正事例 2026-11-25', href: exampleHref },
            { label: '設計の出発点　厚生労働省『働き方と企業による配慮の好事例集』松江の本人・会社・市の記録（印刷3〜5頁）', href: 'https://www.mhlw.go.jp/content/12200000/001259677.pdf#page=5' },
          ]}
        />}
        <p>移動先にはメモの入力は渡りません。相手に伝える場合は、自分が選んだ項目を確認してから渡せます。</p>
        <nav className={styles.exampleLinks} aria-label="校正の題材を別の立場から見る">
          {Object.values(scenario).filter((item) => item !== content).map((item) => (
            <Link key={item.path} href={`${base}/${item.path}${proofreadingExampleHref}`}>{item.link} →</Link>
          ))}
        </nav>
      </details>
    </section>
  );
}
