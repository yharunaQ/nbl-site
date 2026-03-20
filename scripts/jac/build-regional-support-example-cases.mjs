#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const GUIDE_PATH = path.join(ROOT, 'pages', 'jac', 'guide.tsx');
const COMMON_COPY_PATH = path.join(ROOT, 'references', 'jac', 'common-work-design-copy.json');
const DISPOSITION_PATH = path.join(ROOT, 'references', 'jac', 'layer-disposition.json');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'jac-regional-support-template-examples.md');

const EXAMPLES = [
  {
    cardId: 'p-support-service-navigation',
    title: '支援接続アーキテクチャ 記入例',
    persona:
      '20代後半。就労移行支援を利用しながら事務職を希望。制度・相談窓口が分散し、応募準備と生活支援の調整が止まりやすい。',
    observation: [
      '応募前に必要な手続きが3つ並行し、本人と支援者の双方で優先順位が曖昧になっている。',
      '企業見学日程の調整が止まると、応募準備全体が止まりやすい。',
    ],
    inference: [
      '課題は意欲不足ではなく、窓口順序・期限・責任者が固定されていないことにある。',
      '企業に提案する前に、地域支援体制を1枚で見える化した方が実施しやすさが上がる。',
    ],
    risk: '地域資源の空き状況や自治体要件を確認しないまま進めると、実行不能な提案になりやすい。',
    roleSheet: {
      basic: {
        consultationId: 'EX-RS-001',
        createdAt: '2026-03-07',
        jurisdiction: 'JP / 東京都',
        targetCard: 'p-support-service-navigation',
        consentScope: '就労移行支援事業所担当、JAC担当、応募予定企業の採用担当まで',
        nextReviewDate: '2026-03-14',
        employerOwner: '応募予定企業 採用担当',
        regionalOwner: '就労移行支援事業所 担当支援員',
      },
      rows: [
        {
          support: '応募前に必要な制度・相談窓口を1枚に統合する',
          employer: '採用担当が企業見学と応募条件の確認を返す',
          regional: '支援員が制度要件と申請順序を整理する',
          returnPath: '期限を超えたらJAC担当が責任者を再固定する',
        },
        {
          support: '企業見学と応募準備の優先順位を揃える',
          employer: '見学候補日を3日提示する',
          regional: '支援員が本人の通院予定と生活支援予定を照合する',
          returnPath: '日程が確定しない場合はケース会議候補へ戻す',
        },
        {
          support: '本人へ提示する次アクションを1週間単位に絞る',
          employer: '提出締切と必要書類を明記する',
          regional: '支援員が書類準備の同行支援可否を確認する',
          returnPath: '書類が2回連続で止まったら支援接続ルート図を更新する',
        },
      ],
      notes: [
        '制度・法政策メモ: 自治体の申請期限と企業見学の調整可否を切り分けて確認する',
        '共有しない情報: 診断名の詳細、家族状況の詳細',
        'ケース会議が必要になる条件: 期限未設定の手続きが2件以上残る場合',
      ],
    },
    routeSheet: {
      basics: {
        consultationId: 'EX-RS-001',
        createdAt: '2026-03-07',
        jurisdiction: 'JP / 東京都',
        stuckPoint: '応募前に必要な制度確認と企業見学調整が同時に止まっている',
        consentScope: '就労移行支援事業所担当、JAC担当、応募予定企業の採用担当まで',
        firstMover: '就労移行支援事業所 担当支援員',
      },
      rows: [
        {
          stuck: '利用可能な制度一覧が未整理',
          next: '支援員が制度要件と期限を一覧化する',
          due: '2026-03-09',
          owner: '就労移行支援事業所 担当支援員',
          sharing: '制度名、期限、必要書類のみ共有',
          returnPath: '不明点が残ればJAC担当へ戻す',
        },
        {
          stuck: '企業見学日の確定が止まっている',
          next: '採用担当が候補日を3つ提示する',
          due: '2026-03-10',
          owner: '応募予定企業 採用担当',
          sharing: '見学希望日と必要配慮の有無のみ共有',
          returnPath: '候補日なしならJAC担当が調整会話を再設定する',
        },
        {
          stuck: '応募書類の準備順序が曖昧',
          next: '支援員が提出順と締切を本人と確認する',
          due: '2026-03-12',
          owner: '就労移行支援事業所 担当支援員',
          sharing: '提出締切、必要書類、同行支援の有無',
          returnPath: '2営業日動きがなければケース会議候補に上げる',
        },
      ],
      notes: [
        '制度要件の確認先: 自治体窓口、就労移行支援事業所',
        '企業内で判断できる範囲: 見学日、応募条件、連絡期限',
        '地域支援者に依頼する範囲: 制度要件確認、申請順序、同行支援',
        '再評価が必要になる条件: 期限超過、責任者未定、必要書類未確定',
      ],
    },
  },
  {
    cardId: 'p-mental-fluctuation-plan',
    title: '悪化予兆ハンドリング 記入例',
    persona:
      '30代前半。短時間勤務で就業中。週の後半に不調が強まり、連絡遅延と欠勤前兆が出やすい。企業側は対応手順を持っていない。',
    observation: [
      '悪化サインが出ても、誰が確認し、どの段階で負荷調整へ切り替えるかが曖昧。',
      '本人は共有過多を不安に感じており、連絡先と共有範囲が固定されていない。',
    ],
    inference: [
      '課題は本人の自己管理不足ではなく、初期サイン、連絡手順、戻し先が事前合意されていないことにある。',
      'カード内には再評価導線を残しつつ、ケース会議トリガーを別表で持った方が実務で迷いにくい。',
    ],
    risk: '緊急時ルートと共有範囲が曖昧なままだと、企業側が過剰共有か放置のどちらかに振れやすい。',
    roleSheet: {
      basic: {
        consultationId: 'EX-RS-002',
        createdAt: '2026-03-07',
        jurisdiction: 'JP',
        targetCard: 'p-mental-fluctuation-plan',
        consentScope: '直属上司、人事担当、JAC担当、地域支援担当まで',
        nextReviewDate: '2026-03-21',
        employerOwner: '直属上司 + 人事担当',
        regionalOwner: '定着支援担当者',
      },
      rows: [
        {
          support: '初期悪化サインが出た時の連絡手順を固定する',
          employer: '直属上司が当日中に受信確認し、業務再配分を判断する',
          regional: '定着支援担当者が翌営業日までに状況確認を行う',
          returnPath: '2回連続で悪化サインが出たらケース会議へ戻す',
        },
        {
          support: '段階調整の発動条件を明文化する',
          employer: '人事担当が短時間勤務や在宅切替の可否を確認する',
          regional: '定着支援担当者が負荷調整案を提案する',
          returnPath: '発動条件で迷ったらJAC担当が判断会話を再設定する',
        },
        {
          support: '共有範囲を必要最小限に固定する',
          employer: '直属上司へは業務配分に必要な情報だけ共有する',
          regional: '定着支援担当者が本人同意の範囲を再確認する',
          returnPath: '共有範囲に迷いが出たら共有範囲メモを更新する',
        },
      ],
      notes: [
        '制度・法政策メモ: 健康情報の共有先は目的限定で記録する',
        '共有しない情報: 診療内容の詳細、家庭事情の詳細',
        'ケース会議が必要になる条件: 2週間以内に欠勤前兆が2回以上出た場合',
      ],
    },
    conferenceSheet: {
      basics: {
        consultationId: 'EX-RS-002',
        createdAt: '2026-03-07',
        jurisdiction: 'JP',
        consentScope: '直属上司、人事担当、JAC担当、地域支援担当まで',
        hostCandidate: 'JAC担当',
        emergencyContact: '直属上司 → 人事担当 → 地域支援担当 の順',
      },
      rows: [
        {
          trigger: '症状',
          condition: '週内に初期悪化サインが2回出現し、自己回復しない',
          judge: '直属上司と本人',
          invite: '人事担当、JAC担当、地域支援担当',
          next72h: '負荷調整、勤務切替、次回受診予定の確認',
          returnPath: 'JAC担当が再評価会議を設定する',
        },
        {
          trigger: '業務',
          condition: '締切遅延やミスが連続し、通常のフォローで戻らない',
          judge: '直属上司',
          invite: '人事担当、地域支援担当',
          next72h: '業務再配分と優先順位の再設定',
          returnPath: '地域支援担当が定着支援計画を更新する',
        },
        {
          trigger: '連絡',
          condition: '連絡遅延が2回続き、所在確認が必要になる',
          judge: '直属上司',
          invite: '人事担当、JAC担当',
          next72h: '連絡手段と応答期限を再設定する',
          returnPath: 'JAC担当が相談導線を見直す',
        },
        {
          trigger: '制度',
          condition: '勤務変更や休暇対応の制度条件が不明で判断停止する',
          judge: '人事担当',
          invite: 'JAC担当、必要時地域支援担当',
          next72h: '法域条件と社内規程を確認する',
          returnPath: '人事担当が法政策ガードレール層へ戻す',
        },
      ],
    },
  },
];

function unique(items) {
  return [...new Set((Array.isArray(items) ? items : []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function bullets(items, fallback = '（該当なし）') {
  const rows = unique(items);
  if (rows.length === 0) return `- ${fallback}`;
  return rows.map((item) => `- ${item}`).join('\n');
}

function extractArraySource(text, marker) {
  const start = text.indexOf(marker);
  if (start < 0) return null;
  const equalIndex = text.indexOf('=', start);
  if (equalIndex < 0) return null;
  const bracketStart = text.indexOf('[', equalIndex);
  if (bracketStart < 0) return null;
  let depth = 0;
  let inString = false;
  let quote = '';
  for (let i = bracketStart; i < text.length; i += 1) {
    const ch = text[i];
    const prev = text[i - 1];
    if (inString) {
      if (ch === quote && prev !== '\\') inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '[') depth += 1;
    if (ch === ']') depth -= 1;
    if (depth === 0) return text.slice(bracketStart, i + 1);
  }
  return null;
}

function markdownTable(headers, rows, mapper) {
  const lines = [];
  lines.push(`| ${headers.join(' | ')} |`);
  lines.push(`| ${headers.map(() => '---').join(' | ')} |`);
  for (const row of rows) {
    const cells = mapper(row).map((cell) => String(cell || '').replace(/\n/g, '<br>'));
    lines.push(`| ${cells.join(' | ')} |`);
  }
  return lines.join('\n');
}

async function main() {
  const [guideText, commonCopyRaw, dispositionRaw] = await Promise.all([
    fs.readFile(GUIDE_PATH, 'utf8'),
    fs.readFile(COMMON_COPY_PATH, 'utf8'),
    fs.readFile(DISPOSITION_PATH, 'utf8'),
  ]);

  const cardsSource = extractArraySource(guideText, 'const PATTERN_CARDS: PatternCard[] =');
  if (!cardsSource) throw new Error('PATTERN_CARDS not found in guide.tsx');

  const cards = new Function(`return (${cardsSource});`)();
  const cardMap = new Map(
    (Array.isArray(cards) ? cards : []).map((card) => [String(card?.id || ''), card]).filter((entry) => Boolean(entry[0])),
  );
  const commonCopyPayload = JSON.parse(commonCopyRaw);
  const commonCopyMap = new Map(
    (Array.isArray(commonCopyPayload?.cards) ? commonCopyPayload.cards : [])
      .map((row) => [String(row?.id || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );
  const dispositionPayload = JSON.parse(dispositionRaw);
  const dispositionMap = new Map(
    (Array.isArray(dispositionPayload?.cards) ? dispositionPayload.cards : [])
      .map((row) => [String(row?.cardId || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );

  const lines = [];
  lines.push('# JAC 地域支援テンプレート 記入例');
  lines.push('');
  lines.push(`更新日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('状態: example');
  lines.push('');
  lines.push('## 位置づけ');
  lines.push('');
  lines.push('- 以下は仮想記入例です。実在の個人・企業・支援機関をそのまま写したものではありません。');
  lines.push('- 目的は、テンプレートの空欄が実務でどう埋まるかを示すことです。');
  lines.push('- 法的判断や医療判断は含まず、法域・本人同意・地域資源は必ず実地確認が必要です。');
  lines.push('');

  for (const example of EXAMPLES) {
    const card = cardMap.get(example.cardId);
    const commonCopy = commonCopyMap.get(example.cardId);
    const disposition = dispositionMap.get(example.cardId);
    if (!card || !commonCopy || !disposition) continue;

    lines.push(`## ${example.title}`);
    lines.push('');
    lines.push(`- 対象カード: ${String(commonCopy?.title || card?.title || example.cardId)} \`${example.cardId}\``);
    lines.push(`- 想定状況: ${example.persona}`);
    lines.push('- observation:');
    lines.push(bullets(example.observation));
    lines.push('- inference:');
    lines.push(bullets(example.inference));
    lines.push(`- risk: ${example.risk}`);
    lines.push(`- カード内に残す最小要素: ${unique([
      ...(Array.isArray(disposition?.regionalSupport?.keepInCard) ? disposition.regionalSupport.keepInCard : []),
      ...(Array.isArray(disposition?.legalPolicy?.keepInCard) ? disposition.legalPolicy.keepInCard : []),
    ]).join(' / ')}`);
    lines.push('');

    lines.push('### 1. 役割分担シート 記入例');
    lines.push('');
    lines.push(`- 相談ID: ${example.roleSheet.basic.consultationId}`);
    lines.push(`- 作成日: ${example.roleSheet.basic.createdAt}`);
    lines.push(`- 法域: ${example.roleSheet.basic.jurisdiction}`);
    lines.push(`- 対象カード: ${example.roleSheet.basic.targetCard}`);
    lines.push(`- 本人同意の範囲: ${example.roleSheet.basic.consentScope}`);
    lines.push(`- 次回見直し日: ${example.roleSheet.basic.nextReviewDate}`);
    lines.push(`- 企業内の主担当: ${example.roleSheet.basic.employerOwner}`);
    lines.push(`- 地域支援の主担当: ${example.roleSheet.basic.regionalOwner}`);
    lines.push('');
    lines.push(
      markdownTable(
        ['配慮内容', '企業内担当', '地域支援担当', '止まった時の戻し先'],
        example.roleSheet.rows,
        (row) => [row.support, row.employer, row.regional, row.returnPath],
      ),
    );
    lines.push('');
    lines.push('- 補助メモ:');
    lines.push(bullets(example.roleSheet.notes));
    lines.push('');

    if (example.routeSheet) {
      lines.push('### 2. 支援接続ルート図 記入例');
      lines.push('');
      lines.push(`- 相談ID: ${example.routeSheet.basics.consultationId}`);
      lines.push(`- 作成日: ${example.routeSheet.basics.createdAt}`);
      lines.push(`- 法域 / 自治体: ${example.routeSheet.basics.jurisdiction}`);
      lines.push(`- いま止まっていること: ${example.routeSheet.basics.stuckPoint}`);
      lines.push(`- 本人同意の範囲: ${example.routeSheet.basics.consentScope}`);
      lines.push(`- 次に最初に動く人: ${example.routeSheet.basics.firstMover}`);
      lines.push('');
      lines.push(
        markdownTable(
          ['今止まっている手続き', '次アクション', '期限', '責任者', '共有範囲', '止まった時の戻し先'],
          example.routeSheet.rows,
          (row) => [row.stuck, row.next, row.due, row.owner, row.sharing, row.returnPath],
        ),
      );
      lines.push('');
      lines.push('- 補助メモ:');
      lines.push(bullets(example.routeSheet.notes));
      lines.push('');
    }

    if (example.conferenceSheet) {
      lines.push('### 2. ケース会議トリガー表 記入例');
      lines.push('');
      lines.push(`- 相談ID: ${example.conferenceSheet.basics.consultationId}`);
      lines.push(`- 作成日: ${example.conferenceSheet.basics.createdAt}`);
      lines.push(`- 法域: ${example.conferenceSheet.basics.jurisdiction}`);
      lines.push(`- 本人同意の範囲: ${example.conferenceSheet.basics.consentScope}`);
      lines.push(`- ケース会議の主催候補: ${example.conferenceSheet.basics.hostCandidate}`);
      lines.push(`- 緊急連絡先: ${example.conferenceSheet.basics.emergencyContact}`);
      lines.push('');
      lines.push(
        markdownTable(
          ['起点', '発動条件', '誰が判断するか', '誰を呼ぶか', '24-72時間でやること', '戻し先'],
          example.conferenceSheet.rows,
          (row) => [row.trigger, row.condition, row.judge, row.invite, row.next72h, row.returnPath],
        ),
      );
      lines.push('');
    }

    lines.push('### 3. この記入例で残る確認');
    lines.push('');
    lines.push(
      bullets(
        unique(Array.isArray(card?.followUpQuestions) ? card.followUpQuestions.slice(0, 3) : []),
        '（該当なし）',
      ),
    );
    lines.push('');
  }

  await fs.writeFile(OUTPUT_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        exampleCount: EXAMPLES.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
