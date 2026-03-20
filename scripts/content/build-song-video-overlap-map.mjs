import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SONGS_ROOT = path.join(ROOT, 'content-inbox/songs');
const YOUTUBE_LINKS_PATH = path.join(ROOT, 'content-inbox/youtube-links.md');
const LATEST_OUTPUT_PATH = path.join(SONGS_ROOT, 'song-video-overlap-map-latest.md');

const SITE_DECISION_PRIORITY = {
  public_now: 0,
  public_after_rewrite: 1,
  hold: 2,
  unknown: 3,
};

const CATEGORY_RULES = [
  {
    id: 'reasonable-accommodation',
    label: '合理的配慮 / 職場設計',
    mode: 'video-first',
    summary:
      '説明責任が必要な論点なので、まず explainer video で前提をそろえ、song は情景と行動刺激を補う位置が安全。',
    songKeywords: ['合理的配慮', '配慮', 'できる条件', 'コンディション', '職場設計'],
    videoKeywords: ['合理的配慮', 'マネジメント', '全体マップ'],
  },
  {
    id: 'human-first',
    label: '人が先 / 見えにくい困りごと',
    mode: 'song-first',
    summary:
      '情景や言葉が先に響く領域なので、song で入口をつくり、infographic で誤読を補い、video は補助線として後ろに置く。',
    songKeywords: ['人が先', '見えない', '翼', '荷物', '白杖', '必要ですか', 'どうぞ'],
    videoKeywords: ['相互作用モデル', '手帳はないけど', '体験談', '人が先'],
  },
  {
    id: 'employment-quality',
    label: '障害者雇用の質 / 構造更新',
    mode: 'video-first',
    summary:
      '制度や構造への問題提起は動画で骨格を示した方が誤解が少ない。song は slogan 化を避けて、1場面の印象づけに使う。',
    songKeywords: ['雇用', '質', '設計', 'アップデート', '正常化', '違いを力', 'できるを見つける'],
    videoKeywords: ['障害者雇用の「質」', '量から質', 'dei', '障害者雇用'],
  },
  {
    id: 'inclusive-future',
    label: 'インクルーシブ雇用 / 次の仕事観',
    mode: 'paired-later',
    summary:
      '思想や未来像が前に出やすいので、初回公開では main lane に置かず、resources や vision 補助線として育てる方がよい。',
    songKeywords: [
      'インクルーシブ',
      '未来',
      'tomorrow',
      'light me up',
      'work of tomorrow',
      '共に創る未来',
    ],
    videoKeywords: ['dei', '相互作用モデル', '全体マップ'],
  },
  {
    id: 'next-horizon',
    label: 'AI時代の主体性 / 次の地平',
    mode: 'hold-for-now',
    summary:
      'NBL の本丸に近いが、明日 2026-03-20 の流入向けには抽象度が高い。vision lane が育つまで無理に前面化しない。',
    songKeywords: ['次の地平', 'next being', '静かな革命', '腹ペコ', '主体性', 'ai'],
    videoKeywords: ['働かなくていい世界', '社会os', 'ai'],
  },
];

const OTHER_CATEGORY = {
  id: 'other-campaign',
  label: '創作 / 単独 / 別管理',
  mode: 'hold-for-now',
  summary:
    'campaign lane としては面白いが、NBL の初回公開導線とは別に扱った方がよい。site の main lane に混ぜず、独立棚で管理する。',
  songKeywords: [],
  videoKeywords: ['人が先', '幕を上げよう'],
};

const TITLE_CATEGORY_OVERRIDES = {
  'de ・ki・ru ジョーケン': 'reasonable-accommodation',
  'コンディション・スイッチ': 'reasonable-accommodation',
  リターンは笑顔: 'reasonable-accommodation',
  笑顔のハーモニー: 'reasonable-accommodation',
  輝きのスイッチ: 'reasonable-accommodation',
  配慮があれば働ける: 'reasonable-accommodation',
  目を覚ますよ: 'employment-quality',
  働き方アップデート: 'employment-quality',
  がんばりより設計: 'employment-quality',
  違いを力に変えて: 'employment-quality',
  '「できる」を見つける社会に': 'employment-quality',
  人が先: 'human-first',
  見えない翼: 'human-first',
  見えない荷物のヒーロー: 'human-first',
  'light me up': 'inclusive-future',
  'work of tomorrow': 'inclusive-future',
  共に創る未来: 'inclusive-future',
  明日をつくる僕ら: 'inclusive-future',
  キャリアを止めない: 'inclusive-future',
  あきらめなくていい: 'inclusive-future',
  'あきらめなくていい(障害者雇用)': 'inclusive-future',
  'next being': 'next-horizon',
  静かな革命: 'next-horizon',
  腹ペコのまま: 'next-horizon',
  'my second first time': 'other-campaign',
  幕が上がる: 'other-campaign',
};

function formatTokyoDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function normalizeText(value) {
  return value.normalize('NFKC').toLowerCase();
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

function toRelativePath(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, '/');
}

function parseMarkdownTable(content) {
  return content
    .split('\n')
    .filter((line) => line.startsWith('| ') && !line.includes('| ---'))
    .slice(1)
    .map((line) =>
      line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim()),
    )
    .filter((cells) => cells.length >= 8)
    .map(([title, url, status, channel, siteDecision, topic, relatedAssets, notes]) => ({
      title,
      url,
      status,
      channel,
      siteDecision,
      topic,
      relatedAssets,
      notes,
    }));
}

function categorizeSong(note) {
  const normalizedTitle = normalizeText(note.title);
  const overrideCategoryId = TITLE_CATEGORY_OVERRIDES[normalizedTitle];
  if (overrideCategoryId) {
    return CATEGORY_RULES.find((rule) => rule.id === overrideCategoryId) ?? OTHER_CATEGORY;
  }

  const haystack = normalizeText(
    [
      note.campaign,
      note.title,
      note.primaryAudience,
      note.campaignPurpose,
      note.concept,
      note.lyrics,
    ].join('\n'),
  );

  const matchedRule =
    CATEGORY_RULES.find((rule) =>
      rule.songKeywords.some((keyword) => haystack.includes(normalizeText(keyword))),
    ) ?? OTHER_CATEGORY;

  return matchedRule;
}

function matchVideos(category, videos) {
  return videos
    .filter((video) =>
      category.videoKeywords.some((keyword) =>
        normalizeText([video.title, video.topic, video.notes].join('\n')).includes(
          normalizeText(keyword),
        ),
      ),
    )
    .sort((left, right) => {
      const decisionDiff =
        (SITE_DECISION_PRIORITY[left.siteDecision] ?? SITE_DECISION_PRIORITY.unknown) -
        (SITE_DECISION_PRIORITY[right.siteDecision] ?? SITE_DECISION_PRIORITY.unknown);

      if (decisionDiff !== 0) {
        return decisionDiff;
      }

      return left.title.localeCompare(right.title, 'ja');
    })
    .slice(0, 3);
}

function modeLabel(mode) {
  if (mode === 'video-first') {
    return 'video を先頭、song は companion';
  }

  if (mode === 'song-first') {
    return 'song を先頭、infographic 必須、video は補助';
  }

  if (mode === 'paired-later') {
    return 'main 公開の後ろで育てる bundle';
  }

  return '初回公開では hold';
}

async function main() {
  const today = formatTokyoDate();
  const outputPath = path.join(SONGS_ROOT, `song-video-overlap-map-${today}.md`);
  const [noteFiles, youtubeLinks] = await Promise.all([
    findNoteFiles(SONGS_ROOT),
    fs.readFile(YOUTUBE_LINKS_PATH, 'utf8'),
  ]);
  const videos = parseMarkdownTable(youtubeLinks);

  const notes = [];
  for (const filePath of noteFiles) {
    const content = await fs.readFile(filePath, 'utf8');
    const note = {
      filePath: toRelativePath(filePath),
      campaign: extractField(content, 'Campaign') || '未分類 / 単独曲',
      title: extractField(content, 'Title') || path.basename(path.dirname(filePath)),
      primaryAudience: extractField(content, 'Primary audience'),
      campaignPurpose: extractField(content, 'Campaign purpose'),
      concept: extractField(content, 'Short concept note \\(120-200 chars\\)'),
      lyrics: extractLyrics(content),
    };
    const category = categorizeSong(note);
    const relatedVideos = matchVideos(category, videos);

    notes.push({
      ...note,
      category,
      relatedVideos,
    });
  }

  const grouped = [...CATEGORY_RULES, OTHER_CATEGORY]
    .map((category) => ({
      category,
      songs: notes.filter((note) => note.category.id === category.id),
    }))
    .filter((group) => group.songs.length > 0);

  const sections = grouped
    .map(({ category, songs }) => {
      const songLines = songs
        .map((note) => {
          const videosText =
            note.relatedVideos.length > 0
              ? note.relatedVideos
                  .map((video) => `  - ${video.title} [${video.siteDecision}] <${video.url}>`)
                  .join('\n')
              : '  - 関連 video 候補なし';

          return `### ${note.campaign} / ${note.title}

- note: \`${note.filePath}\`
- recommended release mode: ${modeLabel(category.mode)}
- why: ${category.summary}
- related videos:
${videosText}
`;
        })
        .join('\n');

      return `## ${category.label}

- recommended mode: ${modeLabel(category.mode)}
- release reading: ${category.summary}

${songLines}`;
    })
    .join('\n');

  const content = `# Song Video Overlap Map

更新日: ${today}

## Purpose

song と YouTube が同じテーマを扱うときに、重複でなく役割分担として見るための整理メモ。

- song は情景、感情、1場面の印象を返す
- infographic は概念を固定し、誤読を減らす
- video は説明、背景、行動の骨格を補う

## Crossmedia Rule

- 同じテーマでも、song に explainer の役割を背負わせすぎない
- \`public_now\` の video があるテーマは、原則 \`video-first\`
- 人の尊厳や見えにくい困りごとを扱う song は、\`song-first\` でもよいが infographic を必須にする
- 明日 2026-03-20 の暫定公開版では、songs はトップの main CTA に置かず、campaign lane の内部準備として扱う

${sections}
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
