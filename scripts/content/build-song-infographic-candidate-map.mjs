import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SONGS_ROOT = path.join(ROOT, 'content-inbox/songs');
const LATEST_OUTPUT_PATH = path.join(SONGS_ROOT, 'song-infographic-candidate-map-latest.md');

const ASSETS = {
  inclusiveEmployment: {
    path: 'content-inbox/地平1_隔離・分離から包摂へ/障害者雇用支援の世界標準/インクルーシブ雇用.png',
    note: 'インクルーシブ雇用を前向きな全体像として返しやすい。',
  },
  foreignThreeLayers: {
    path: 'content-inbox/地平1_隔離・分離から包摂へ/障害者雇用支援の世界標準/諸外国の３層.png',
    note: '海外の多層構造や新しい見方へ接続しやすい。',
  },
  qualityMetrics: {
    path: 'content-inbox/地平1_隔離・分離から包摂へ/障害者雇用支援の世界標準/障害者雇用の質の指標.png',
    note: '人数や雇用率だけでなく、雇用の質へ読み替える補助線になる。日本企業向けには正常化の図の後ろに置く方が読みやすい。',
  },
  reasonableAccommodation: {
    path: 'content-inbox/基本概念/医学モデルと社会モデル/合理的配慮.png',
    note: '合理的配慮を特別対応でなく設計として返しやすい。',
  },
  accommodationTrend: {
    path: 'content-inbox/地平1_隔離・分離から包摂へ/障害者雇用支援の世界標準/合理的配慮のアメリカのトレンド.png',
    note: '合理的配慮の更新方向や国際文脈を添えやすい。',
  },
  conditionMap: {
    path: 'content-inbox/地平2_エンゲージメント/仕事のコンディションマップA3.png',
    note: 'できる条件やコンディション調整の曲と相性がよい。',
  },
  healthLayer: {
    path: 'content-inbox/地平1_隔離・分離から包摂へ/標準職場設計26フレーム/体調レイヤー.png',
    note: '体調の波や勤務条件との相互作用を補いやすい。',
  },
  transitionLayer: {
    path: 'content-inbox/地平1_隔離・分離から包摂へ/標準職場設計26フレーム/就職移行レイヤー.png',
    note: 'キャリア継続や就労移行の話とつなぎやすい。',
  },
  operationsLayer: {
    path: 'content-inbox/地平1_隔離・分離から包摂へ/標準職場設計26フレーム/職場運用レイヤー.png',
    note: '相談導線、情報共有、日常運用の配慮を補いやすい。',
  },
  healthConditions: {
    path: 'content-inbox/難病理解/健康状態とHealth Conditions.png',
    note: '健康状態と仕事条件の関係を説明しやすい。',
  },
  fluctuatingCondition: {
    path: 'content-inbox/難病理解/体調の波のある人.png',
    note: '見えにくい体調変動や周囲から分かりにくい困りごとを補いやすい。',
  },
  backpack: {
    path: 'content-inbox/難病理解/IBD（バッグパック）.png',
    note: '見えない負担や外から見えないしんどさの表現と相性がよい。',
  },
  visualAccess: {
    path: 'content-inbox/基本概念/医学モデルと社会モデル/視覚障害インフォグラフィック.png',
    note: '白杖、駅、情報提供、視覚アクセスの文脈を補いやすい。',
  },
  employmentNormalization: {
    path: 'content-inbox/地平1_隔離・分離から包摂へ/日本における変革課題/障害者雇用の正常化（企業へのしわ寄せ解消）.png',
    note: '制度停滞や構造更新を歌う曲の補助線になる。',
  },
  employmentUpdate: {
    path: 'content-inbox/地平1_隔離・分離から包摂へ/日本における変革課題/障害者雇用率制度の基本的考え方の更新.png',
    note: '雇用率や制度理解の更新を押し出す曲と相性がよい。',
  },
  japanWorldComparison: {
    path: 'content-inbox/地平1_隔離・分離から包摂へ/日本における変革課題/日本と世界の比較.png',
    note: '日本の遅れや更新必要性を示す比較線として使いやすい。',
  },
  socialDesignMemo: {
    path: 'content-inbox/地平2_エンゲージメント/多様な個人が働きやすい社会設計メモ.png',
    note: '社会設計や共創のメッセージを補いやすい。',
  },
  aiAgency: {
    path: 'content-inbox/地平2_エンゲージメント/AI時代の「主体性」ガイド.png',
    note: 'AI時代の主体性や次の地平の歌と接続しやすい。',
  },
};

const TITLE_OVERRIDES = {
  'de ・ki・ru ジョーケン': ['reasonableAccommodation', 'conditionMap', 'operationsLayer'],
  'コンディション・スイッチ': ['conditionMap', 'healthLayer', 'healthConditions'],
  リターンは笑顔: ['reasonableAccommodation', 'operationsLayer', 'inclusiveEmployment'],
  目を覚ますよ: ['employmentUpdate', 'japanWorldComparison', 'employmentNormalization'],
  笑顔のハーモニー: ['reasonableAccommodation', 'inclusiveEmployment', 'operationsLayer'],
  輝きのスイッチ: ['conditionMap', 'reasonableAccommodation', 'healthLayer'],
  配慮があれば働ける: ['reasonableAccommodation', 'accommodationTrend', 'conditionMap'],
  キャリアを止めない: ['transitionLayer', 'inclusiveEmployment', 'conditionMap'],
  あきらめなくていい: ['inclusiveEmployment', 'transitionLayer', 'operationsLayer'],
  'あきらめなくていい(障害者雇用)': ['inclusiveEmployment', 'transitionLayer', 'operationsLayer'],
  がんばりより設計: ['operationsLayer', 'employmentNormalization', 'conditionMap'],
  人が先: ['visualAccess', 'fluctuatingCondition', 'healthConditions'],
  見えない翼: ['fluctuatingCondition', 'healthConditions', 'backpack'],
  見えない荷物のヒーロー: ['backpack', 'fluctuatingCondition', 'healthConditions'],
  違いを力に変えて: ['employmentNormalization', 'inclusiveEmployment', 'qualityMetrics'],
  '「できる」を見つける社会に': [
    'employmentNormalization',
    'inclusiveEmployment',
    'qualityMetrics',
  ],
  働き方アップデート: ['employmentNormalization', 'employmentUpdate', 'japanWorldComparison'],
  合図は笑いだ: ['employmentNormalization', 'employmentUpdate', 'japanWorldComparison'],
  'light me up': ['inclusiveEmployment', 'foreignThreeLayers', 'socialDesignMemo'],
  'work of tomorrow': ['inclusiveEmployment', 'foreignThreeLayers', 'socialDesignMemo'],
  共に創る未来: ['inclusiveEmployment', 'socialDesignMemo', 'employmentNormalization'],
  明日をつくる僕ら: ['inclusiveEmployment', 'socialDesignMemo', 'employmentNormalization'],
  'next being': ['aiAgency', 'socialDesignMemo', 'inclusiveEmployment'],
  静かな革命: ['employmentNormalization', 'socialDesignMemo', 'aiAgency'],
  腹ペコのまま: ['aiAgency', 'socialDesignMemo'],
};

const KEYWORD_RULES = [
  {
    keywords: ['合理的配慮', '配慮', 'できる条件', 'じょーけん'],
    assets: ['reasonableAccommodation', 'conditionMap', 'operationsLayer'],
  },
  {
    keywords: ['体調', '波', '元気そう', '夜', '通院', '痛み', 'コンディション'],
    assets: ['healthLayer', 'healthConditions', 'fluctuatingCondition'],
  },
  {
    keywords: ['キャリア', '継続', '止めない', '復職', 'つづけられる'],
    assets: ['transitionLayer', 'conditionMap', 'inclusiveEmployment'],
  },
  {
    keywords: ['見えない', '荷物', 'バッグパック', 'Invisible', '翼'],
    assets: ['backpack', 'fluctuatingCondition', 'healthConditions'],
  },
  {
    keywords: ['白いつえ', '白杖', '駅', '改札', 'ホーム', 'どうぞ', '必要ですか'],
    assets: ['visualAccess', 'operationsLayer', 'healthConditions'],
  },
  {
    keywords: ['インクルーシブ', '共に', '未来', '明日', 'work of tomorrow', 'tomorrow'],
    assets: ['inclusiveEmployment', 'foreignThreeLayers', 'socialDesignMemo'],
  },
  {
    keywords: ['アップデート', '構造', '仕組み', '正常化', '雇用率'],
    assets: ['employmentNormalization', 'qualityMetrics', 'employmentUpdate'],
  },
  {
    keywords: ['ai', '主体性', '次の地平'],
    assets: ['aiAgency', 'socialDesignMemo'],
  },
];

function formatTokyoDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

async function findNoteFiles(dirPath) {
  const results = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findNoteFiles(entryPath)));
    } else if (entry.isFile() && entry.name === 'campaign-song-note.md') {
      results.push(entryPath);
    }
  }

  return results.sort();
}

function extractField(content, label) {
  const match = content.match(new RegExp(`^- ${label}:[ \\t]*(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

function extractLyrics(content) {
  const match = content.match(/## Lyrics\s+```(?:text)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : '';
}

function normalizeText(value) {
  return value.normalize('NFKC').toLowerCase();
}

function dedupe(items) {
  return [...new Set(items)];
}

function suggestAssetIds(note) {
  const titleKey = normalizeText(note.title);
  const text = normalizeText(
    [
      note.campaign,
      note.title,
      note.primaryAudience,
      note.campaignPurpose,
      note.concept,
      note.lyrics,
    ].join('\n'),
  );
  const matchedKeywords = [];
  const collected = [];

  if (TITLE_OVERRIDES[titleKey]) {
    collected.push(...TITLE_OVERRIDES[titleKey]);
  }

  for (const rule of KEYWORD_RULES) {
    const hits = rule.keywords.filter((keyword) => text.includes(normalizeText(keyword)));
    if (hits.length > 0) {
      matchedKeywords.push(...hits);
      collected.push(...rule.assets);
    }
  }

  if (collected.length === 0) {
    if (text.includes(normalizeText('合理的配慮キャンペーン'))) {
      collected.push('reasonableAccommodation', 'conditionMap');
    } else if (text.includes(normalizeText('インクルーシブ雇用キャンペーン'))) {
      collected.push('inclusiveEmployment', 'foreignThreeLayers');
    } else if (text.includes(normalizeText('障害者雇用啓発キャンペーン'))) {
      collected.push('employmentNormalization', 'inclusiveEmployment');
    } else {
      collected.push('socialDesignMemo');
    }
  }

  return {
    assetIds: dedupe(collected).slice(0, 3),
    matchedKeywords: dedupe(matchedKeywords).slice(0, 8),
  };
}

function toConfidence(note, matchedKeywords, usedOverride) {
  if (usedOverride || matchedKeywords.length >= 3 || note.primaryAudience) {
    return 'high';
  }

  if (matchedKeywords.length >= 1 || note.campaignPurpose || note.concept) {
    return 'medium';
  }

  return 'low';
}

async function main() {
  const today = formatTokyoDate();
  const outputPath = path.join(SONGS_ROOT, `song-infographic-candidate-map-${today}.md`);
  const noteFiles = await findNoteFiles(SONGS_ROOT);

  const notes = [];
  for (const filePath of noteFiles) {
    const content = await fs.readFile(filePath, 'utf8');
    const title = extractField(content, 'Title');
    const campaign = extractField(content, 'Campaign');
    const primaryAudience = extractField(content, 'Primary audience');
    const campaignPurpose = extractField(content, 'Campaign purpose');
    const concept = extractField(content, 'Short concept note \\(120-200 chars\\)');
    const relatedInfographic = extractField(content, 'Related infographic');
    const lyrics = extractLyrics(content);
    const titleKey = normalizeText(title);
    const usedOverride = Boolean(TITLE_OVERRIDES[titleKey]);
    const { assetIds, matchedKeywords } = suggestAssetIds({
      title,
      campaign,
      primaryAudience,
      campaignPurpose,
      concept,
      lyrics,
    });

    notes.push({
      filePath: path.relative(ROOT, filePath),
      title,
      campaign,
      primaryAudience,
      relatedInfographic,
      usedOverride,
      matchedKeywords,
      assetIds,
      confidence: toConfidence(
        { primaryAudience, campaignPurpose, concept },
        matchedKeywords,
        usedOverride,
      ),
    });
  }

  const sections = notes.map((note) => {
    const candidates = note.assetIds
      .map((assetId, index) => {
        const asset = ASSETS[assetId];
        return `${index + 1}. \`${asset.path}\`\n   - why: ${asset.note}`;
      })
      .join('\n');

    const cues =
      note.matchedKeywords.length > 0
        ? note.matchedKeywords.map((keyword) => `\`${keyword}\``).join(', ')
        : 'title / campaign ベースの仮置き';

    return `## ${note.campaign} / ${note.title}

- note: \`${note.filePath}\`
- current related infographic field: ${note.relatedInfographic || 'empty'}
- confidence: ${note.confidence}
- observed cues: ${cues}
- primary audience: ${note.primaryAudience || 'empty'}

### Suggested candidates

${candidates}

### Check first

- song が返したい中心概念と、画像が返す概念がズレていないか
- song 単体の感情訴求を、画像が制度説明に寄せすぎていないか
- 画像が必要以上に diagnosis-only に読まれないか
`;
  });

  const content = `# Song Infographic Candidate Map

更新日: ${today}

## Purpose

各曲の campaign-song-note.md を見ながら、関連インフォグラフィック候補を先に 1-3 本へ絞るための仮マップ。

- これは確定表ではなく、候補・理由・要確認点を並べたチェック用シート
- 確定したら各曲フォルダの Related infographic へ転記する
- song 単体を制度説明の代替にしない

## Candidate Notes

${sections.join('\n')}
`;

  await Promise.all([
    fs.writeFile(outputPath, content, 'utf8'),
    fs.writeFile(LATEST_OUTPUT_PATH, content, 'utf8'),
  ]);

  process.stdout.write(`${outputPath}\n${LATEST_OUTPUT_PATH}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
