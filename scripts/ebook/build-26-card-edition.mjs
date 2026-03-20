#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INPUT_PATH = path.join(ROOT, 'references', 'jac', 'common-work-design-copy.json');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'guidebook', 'jac-26-card-edition.md');

const LAYERS = [
  {
    key: 'health',
    label: '体調レイヤー',
    intro:
      '体調や回復リズムと仕事の密度がぶつかるときに、勤務設計と戻り道を整えるレイヤー。本人の頑張り方ではなく、業務量、時間帯、回復時間、移動負荷をどう設計し直すかを見る。',
    ids: [
      'p-fatigue-pacing',
      'p-medical-schedule',
      'p-internal-treatment-compatibility',
      'p-shift-rhythm-guard',
      'p-return-to-work-ramp',
      'p-mental-fluctuation-plan',
      'p-environment-sensory',
      'p-commute-hybrid',
      'p-physical-mobility-route',
    ],
  },
  {
    key: 'transition',
    label: '就職移行レイヤー',
    intro:
      '応募前後の探索、連絡、実習、制度接続が分断されるときに、就職までの工程をつなぎ直すレイヤー。意欲や自己理解の問題に閉じず、工程の順番、引継ぎ、支援接続を見直す。',
    ids: [
      'p-jobmatch-exploration',
      'p-application-contact-flow',
      'p-interview-self-advocacy',
      'p-skill-building-path',
      'p-worktrial-transition',
      'p-income-condition-stability',
      'p-support-service-navigation',
    ],
  },
  {
    key: 'operation',
    label: '職場運用レイヤー',
    intro:
      '入社後の会議、指示、相談、情報共有、安全運用の設計を整え、配慮が単発で終わらないようにするレイヤー。本人の申告能力だけに寄せず、職場側の運用構造を変える。',
    ids: [
      'p-meeting-overload',
      'p-disclosure-boundary',
      'p-manager-checkin',
      'p-customer-facing-load',
      'p-visual-document-access',
      'p-hearing-meeting-access',
      'p-intellectual-task-clarity',
      'p-developmental-switch-load',
      'p-higher-brain-memory-support',
      'p-safety-critical-operations',
    ],
  },
];

const EXPERT_INSIGHTS = {
  'p-fatigue-pacing':
    '問題は体力不足ではなく、業務密度と回復速度のズレが日ごとに累積していることにある。',
  'p-medical-schedule':
    '問題は通院そのものより、受診日と業務ピークが同じ人の自己調整に委ねられていることにある。',
  'p-internal-treatment-compatibility':
    '問題は治療日ではなく、治療後の回復時間が勤務設計に織り込まれていないことにある。',
  'p-shift-rhythm-guard':
    '問題は夜勤や早番の有無だけでなく、睡眠・服薬・通院のリズムが連続勤務で崩れることにある。',
  'p-return-to-work-ramp':
    '問題は「できるか」ではなく、「その負荷で続けられるか」を段階で確かめていないことにある。',
  'p-mental-fluctuation-plan':
    '問題は危機対応の遅さだけでなく、小さな変化を調整の入口として扱えていないことにある。',
  'p-environment-sensory':
    '問題は本人の過敏さではなく、刺激の強い環境が仕事の持続を削っていることにある。',
  'p-commute-hybrid':
    '問題は通勤時間の長さだけでなく、始業前にエネルギーを使い切る設計になっていることにある。',
  'p-physical-mobility-route':
    '問題は歩けるかどうかではなく、移動回数と動線の長さが仕事の前提を重くしていることにある。',
  'p-jobmatch-exploration':
    '問題は意欲不足ではなく、業務要件と本人条件の照合軸が粗いまま探索していることにある。',
  'p-application-contact-flow':
    '問題は応募能力より、連絡・書類・追跡の実務が工程として固定されていないことにある。',
  'p-interview-self-advocacy':
    '問題は話し方の上手下手より、配慮要望を業務影響ベースで短く伝える準備ができていないことにある。',
  'p-skill-building-path':
    '問題は学ぶ量ではなく、学習内容が就職までの工程と接続していないことにある。',
  'p-worktrial-transition':
    '問題は実習評価の有無ではなく、安定条件が採用後運用へ翻訳されていないことにある。',
  'p-income-condition-stability':
    '問題は収入額だけでなく、契約条件と体調維持可能な稼働量の整合が見えていないことにある。',
  'p-support-service-navigation':
    '問題は制度知識不足ではなく、窓口の順番・期限・責任者・戻し先が一枚になっていないことにある。',
  'p-meeting-overload': '問題は理解力不足ではなく、会議で同時に求める処理量が多すぎることにある。',
  'p-disclosure-boundary':
    '問題は話す量そのものより、共有目的と更新責任が決まらないまま開示が始まることにある。',
  'p-manager-checkin': '問題は相談しにくさより、相談を業務変更まで運ぶ責任線がないことにある。',
  'p-customer-facing-load':
    '問題は対人スキルの不足ではなく、即時応答が続く場面で負荷分散が設計されていないことにある。',
  'p-visual-document-access':
    '問題は読む速さだけでなく、資料形式が読み取り支援を前提に作られていないことにある。',
  'p-hearing-meeting-access':
    '問題は聞き漏らしではなく、発話ルールとテキスト補助がないために情報欠落が運用で補われていないことにある。',
  'p-intellectual-task-clarity':
    '問題は理解力ではなく、完了条件と手順の曖昧さが作業再現性を下げていることにある。',
  'p-developmental-switch-load':
    '問題は集中力ではなく、割込みと同時並行が切替コストを押し上げていることにある。',
  'p-higher-brain-memory-support':
    '問題は記憶力の弱さではなく、保持と段取りを前提にした工程設計が手戻りを増やしていることにある。',
  'p-safety-critical-operations':
    '問題は本人の注意不足ではなく、安全判断の条件と停止ラインが先に定義されていないことにある。',
};

const GENERIC_SUPPORT_LINES = new Set([
  '企業内で回せる共通設計と、個別調整が必要な部分を切り分ける',
  '企業内担当者、期限、見直し条件を明文化し、重い実装は外部支援込みで提示する',
  '企業単独で抱えにくい配慮や支援を、実施可能な体制へ翻訳する',
  '実施が止まったら、本人・JAC・企業・地域支援者で役割と次回判断点を再固定する。',
]);

function clean(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function ensureSentence(value) {
  const text = clean(value);
  if (!text) return '';
  return /[。！？]$/.test(text) ? text : `${text}。`;
}

function unique(items) {
  const seen = new Set();
  const output = [];
  for (const item of items) {
    const value = clean(item);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    output.push(value);
  }
  return output;
}

function extractSentences(value) {
  const matches = clean(value).match(/[^。！？]+[。！？]?/g);
  return (matches || []).map((item) => clean(item)).filter(Boolean);
}

function normalizeSituation(value) {
  return ensureSentence(
    clean(value)
      .replace(/^就業共通設計では、人を選別する前に仕事の側を先に設計し、/, '')
      .replace(
        /この設計要素は、特性差・体調変動・ライフイベントの違いがある誰にでも起こりうる。?$/,
        '',
      ),
  );
}

function buildSceneContextLine(card) {
  const examples = card.disabilityEmploymentConnection?.examples || [];
  if (examples.length === 0) return '';
  return `先に見えやすい文脈: ${examples.join(' / ')}`;
}

function buildSelectionSections(card) {
  const sentences = extractSentences(clean(card.selectionBoundary).replace(/^選ぶ目安:\s*/, ''));
  const main = sentences.shift() || '';
  const use = [];
  const diff = [];

  if (main) {
    use.push(ensureSentence(main.replace(/なら本カード。?$/, 'なら、このフレームを優先する。')));
  }

  for (const sentence of sentences) {
    diff.push(ensureSentence(sentence));
  }

  if (diff.length === 0) {
    diff.push('近いフレームと迷うときは、主課題がどこで止まっているかを先に切り分ける。');
  }

  return { use: unique(use), diff: unique(diff) };
}

function isGenericInternalCheck(item) {
  return /person\s*\/\s*job\s*\/\s*environment\s*\/\s*support\s*\/\s*time\s*\/\s*institution(?:\s*\/\s*evidence)?/i.test(
    item,
  );
}

function buildFirstStepBullets(card) {
  const standardized = (card.quickBundle?.standardized || []).filter(
    (item) => !isGenericInternalCheck(item),
  );
  const individualized = (card.quickBundle?.individualized || []).filter(
    (item) => !isGenericInternalCheck(item),
  );
  return unique([...standardized, ...individualized]).slice(0, 4);
}

function pickSpecificLegalCheck(card) {
  const checks = card.legalPolicyGuardrail?.checks || [];
  return (
    checks.find(
      (item) =>
        !item.startsWith('適用法域を ') &&
        !item.startsWith('義務か推奨か') &&
        !item.startsWith('法域差が残る'),
    ) ||
    checks[0] ||
    ''
  );
}

function buildRiskBullets(card) {
  return unique([card.legalPolicyGuardrail?.summary, pickSpecificLegalCheck(card)]).slice(0, 2);
}

function buildContextParagraph(card) {
  const principle = clean(card.quickBundle?.principle);
  const firstAction = buildFirstStepBullets(card)[0];
  if (principle) {
    return `${principle}。${
      firstAction ? ` まずは ${firstAction} を土台にし、` : ' まずは共通設計を土台にし、'
    }そのうえで本人条件に合わせた個別調整を重ねる。`;
  }
  return '';
}

function pickSpecificSupportLine(items, { allowFallback = false } = {}) {
  const lines = unique(items);
  const specific = lines.find((item) => !GENERIC_SUPPORT_LINES.has(item));
  if (specific) return specific;
  return allowFallback ? lines[0] || '' : '';
}

function buildExternalSupportBullets(card) {
  const jacRole = pickSpecificSupportLine(
    (card.regionalSupportOverlay?.jacRole || []).filter((item) => !isGenericInternalCheck(item)),
  );
  const regionalRole = pickSpecificSupportLine(
    (card.regionalSupportOverlay?.regionalRole || []).filter(
      (item) => !isGenericInternalCheck(item),
    ),
    { allowFallback: true },
  );
  const returnPath = pickSpecificSupportLine([card.regionalSupportOverlay?.returnPath]);
  return unique([
    jacRole ? `JACは、${jacRole}。` : '',
    regionalRole ? `地域支援者は、${regionalRole}。` : '',
    returnPath,
  ]).slice(0, 3);
}

function buildSituationLevelBullets(card) {
  const order = {
    stable: 0,
    moderate: 1,
    high: 2,
    critical: 3,
  };
  const levels = Array.isArray(card.situationLevels) ? card.situationLevels : [];
  return [...levels]
    .sort((a, b) => (order[String(a?.tone || '')] ?? 99) - (order[String(b?.tone || '')] ?? 99))
    .map((level) => {
      const icon = clean(level?.icon);
      const label = clean(level?.label);
      const description = clean(level?.description);
      if (!icon || !label || !description) return '';
      return `${icon} ${label}: ${description}`;
    })
    .filter(Boolean);
}

function appendBulletSection(lines, heading, items) {
  lines.push(`##### ${heading}`);
  const bullets = items.length > 0 ? items : ['（要追記）'];
  for (const item of bullets) {
    lines.push(`- ${item}`);
  }
  lines.push('');
}

async function main() {
  const source = JSON.parse(await fs.readFile(INPUT_PATH, 'utf8'));
  const cardMap = new Map(source.cards.map((card) => [card.id, card]));
  const lines = [];

  lines.push('# JAC 26フレーム カード版');
  lines.push('');
  lines.push(`更新日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('状態: full-card-edition-draft');
  lines.push('');
  lines.push(
    '重点5カードで固めた読み順と誌面方針を、26フレーム全体へ広げた版です。ここでは `3レイヤー` を全体地図、`カード` を現場で使う最小単位として扱います。',
  );
  lines.push(
    '読者はまず、どのレイヤーで詰まっているかを見て、その後に `鑑別診断 / 問題の切り分け` と `具体的な取組み内容` を使って、最初の一手と戻し先を決めます。',
  );
  lines.push(
    '状況レベルは `🟢 / 🟡 / 🔴 / 💣` の4段階で統一し、診断の重さではなく、仕事がどれだけ詰まり、運用で吸収できているかで切り分けます。',
  );
  lines.push(
    '各カードの「先に見えやすい文脈」は、配慮が可視化されやすい例であり、診断名でカードを決め打ちするための欄ではない。',
  );
  lines.push(
    '本文は読者向けに絞り、採用根拠の細かなログは外している。制度適用や個人情報の扱いは、法域・雇用区分・本人同意を確認して判断する。',
  );
  lines.push('');
  lines.push('- `体調レイヤー`: 体調、回復、勤務密度、移動負荷がぶつかるときに使う');
  lines.push('- `就職移行レイヤー`: 探索、応募、実習、制度接続の工程が切れているときに使う');
  lines.push(
    '- `職場運用レイヤー`: 入社後の会議、指示、相談、情報共有、安全運用が詰まるときに使う',
  );
  lines.push('');
  lines.push('---');
  lines.push('');

  let frameNumber = 1;

  for (const layer of LAYERS) {
    lines.push(`## ${layer.label}`);
    lines.push('');
    lines.push(layer.intro);
    lines.push('');

    for (const id of layer.ids) {
      const card = cardMap.get(id);
      if (!card) {
        throw new Error(`Card not found: ${id}`);
      }

      const selection = buildSelectionSections(card);
      const firstSteps = buildFirstStepBullets(card);
      const riskBullets = buildRiskBullets(card);
      const contextParagraph = buildContextParagraph(card);
      const externalSupport = buildExternalSupportBullets(card);
      const situationLevels = buildSituationLevelBullets(card);
      const sceneContextLine = buildSceneContextLine(card);
      const frameNo = String(frameNumber).padStart(2, '0');

      lines.push(`### フレーム${frameNo} ${card.title}`);
      lines.push('');
      lines.push(normalizeSituation(card.situation));
      lines.push(
        `> JACの着眼点: ${EXPERT_INSIGHTS[id] || '主課題がどこで止まっているかを、人ではなく仕事側の条件から見直す。'}`,
      );
      lines.push('');
      lines.push('#### こんな場面で起きやすい');
      lines.push('');
      if (sceneContextLine) {
        lines.push(sceneContextLine);
        lines.push('');
      }
      appendBulletSection(lines, '状況レベル（🟢 → 💣）', situationLevels);
      lines.push('#### 鑑別診断 / 問題の切り分け');
      lines.push('');
      appendBulletSection(lines, 'このフレームを使うとき', selection.use);
      appendBulletSection(lines, '近いフレームとの見分け方', selection.diff);
      lines.push('#### 具体的な取組み内容');
      lines.push('');
      appendBulletSection(lines, '最初にやること', firstSteps);
      appendBulletSection(lines, '見落としやすい点', riskBullets);
      lines.push('##### 設計の考え方');
      if (contextParagraph) {
        lines.push(contextParagraph);
        lines.push('');
      } else {
        lines.push(
          '共通設計の土台と個別調整の条件を分けて読む。単独事例ではなく、反復して見える詰まりと支援の組み合わせとして扱う。',
        );
        lines.push('');
      }
      appendBulletSection(lines, '外部と一緒に考える場面', externalSupport);

      frameNumber += 1;
    }
  }

  await fs.writeFile(OUTPUT_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        inputPath: INPUT_PATH,
        outputPath: OUTPUT_PATH,
        cardCount: source.cards.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
