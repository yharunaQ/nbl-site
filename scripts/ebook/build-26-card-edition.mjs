#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INPUT_PATH = path.join(ROOT, 'references', 'jac', 'common-work-design-copy.json');
const INSIGHTS_PATH = path.join(ROOT, 'references', 'jac', 'expert-insights.json');
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
  const insightsSource = JSON.parse(await fs.readFile(INSIGHTS_PATH, 'utf8'));
  const EXPERT_INSIGHTS_DATA = insightsSource.insights || {};
  const cardMap = new Map(source.cards.map((card) => [card.id, card]));
  const lines = [];

  lines.push('# 仕事設計ガイドブック');
  lines.push('');
  lines.push(`更新日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('発行: Next Being Lab');
  lines.push('');
  lines.push(
    '就労支援員・ジョブコーチ・障害者職業生活相談員が、相談現場で困りごとを整理するためのリファレンスです。',
  );
  lines.push(
    '働きづらさを診断名や個人特性で扱うのではなく、仕事・環境・支援・時間・制度の設計課題として読み替えることを目的としています。',
  );
  lines.push('');
  lines.push(
    '3レイヤーは全体地図です。まず体調・就職移行・職場運用のどのレイヤーで詰まっているかを見ます。',
  );
  lines.push(
    'その後、該当フレームの「鑑別診断 / 問題の切り分け」と「具体的な取組み内容」で最初の一手と戻し先を決めます。',
  );
  lines.push(
    '状況レベル 🟢 / 🟡 / 🔴 / 💣 は診断の重さではなく、仕事がどれだけ詰まり、運用で吸収できているかで切り分けます。',
  );
  lines.push(
    '「先に見えやすい文脈」は配慮が可視化されやすい例であり、診断名でフレームを決め打ちするための欄ではありません。',
  );
  lines.push(
    '最終判断は支援者と本人が持ちます。制度適用や個人情報の扱いは、法域・雇用区分・本人同意を確認して判断してください。',
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
        `> 着眼点: ${EXPERT_INSIGHTS_DATA[id] || '主課題がどこで止まっているかを、人ではなく仕事側の条件から見直す。'}`,
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
