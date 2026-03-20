import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SONGS_ROOT = path.join(ROOT, 'content-inbox/songs');
const OUTPUT_PATH = path.join(SONGS_ROOT, 'campaign-song-tracker.md');
const INFOGRAPHIC_MAP_PATH = path.join(SONGS_ROOT, 'song-infographic-candidate-map-latest.md');

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

function toRelativePath(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, '/');
}

function toStatus(value) {
  return value ? 'done' : 'todo';
}

function sortByCampaignThenTitle(left, right) {
  return (
    left.campaign.localeCompare(right.campaign, 'ja') || left.title.localeCompare(right.title, 'ja')
  );
}

async function main() {
  const today = formatTokyoDate();
  const noteFiles = await findNoteFiles(SONGS_ROOT);

  const notes = [];
  for (const filePath of noteFiles) {
    const content = await fs.readFile(filePath, 'utf8');
    const title = extractField(content, 'Title') || path.basename(path.dirname(filePath));
    const campaign = extractField(content, 'Campaign') || '未分類 / 単独曲';
    const primaryAudience = extractField(content, 'Primary audience');
    const campaignPurpose = extractField(content, 'Campaign purpose');
    const concept = extractField(content, 'Short concept note \\(120-200 chars\\)');
    const lyrics = extractLyrics(content);
    const infographic = extractField(content, 'Related infographic');
    const still = extractField(content, 'Still visual / cover art');
    const boundary = extractField(content, 'Companion boundary note');

    notes.push({
      campaign,
      title,
      notePath: toRelativePath(filePath),
      primaryAudience,
      campaignPurpose,
      concept,
      lyrics,
      infographic,
      still,
      boundary,
    });
  }

  notes.sort(sortByCampaignThenTitle);

  const summary = {
    total: notes.length,
    audience: notes.filter((note) => note.primaryAudience).length,
    purpose: notes.filter((note) => note.campaignPurpose).length,
    concept: notes.filter((note) => note.concept).length,
    lyrics: notes.filter((note) => note.lyrics).length,
    infographic: notes.filter((note) => note.infographic).length,
    still: notes.filter((note) => note.still).length,
    boundary: notes.filter((note) => note.boundary).length,
  };

  const hasInfographicMap = await fs
    .access(INFOGRAPHIC_MAP_PATH)
    .then(() => true)
    .catch(() => false);

  const lines = [
    '# Campaign Song Tracker',
    '',
    `更新日: ${today}`,
    '',
    '## How to use',
    '',
    '- `campaign-song-note.md` を埋めながら、この一覧で進捗を見る',
    '- `lyrics`, `concept`, `infographic`, `boundary` の 4 項目が埋まると minimum package に近い',
    '- `audience` は primary audience が入れば first pass とみなす',
    '- tracker を更新するには `npm run songs:tracker` を実行する',
  ];

  if (hasInfographicMap) {
    lines.push(
      '- インフォグラフィック候補の確認は `content-inbox/songs/song-infographic-candidate-map-latest.md` を見る',
    );
  }

  lines.push(
    '',
    '## Snapshot',
    '',
    `- Songs: ${summary.total}`,
    `- Audience entered: ${summary.audience}/${summary.total}`,
    `- Purpose entered: ${summary.purpose}/${summary.total}`,
    `- Concept entered: ${summary.concept}/${summary.total}`,
    `- Lyrics entered: ${summary.lyrics}/${summary.total}`,
    `- Infographic linked: ${summary.infographic}/${summary.total}`,
    `- Still visual linked: ${summary.still}/${summary.total}`,
    `- Boundary note linked: ${summary.boundary}/${summary.total}`,
    '',
    '## Tracker',
    '',
    '| Campaign | Title | Note | Audience | Purpose | Concept | Lyrics | Infographic | Still | Boundary |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  );

  for (const note of notes) {
    lines.push(
      `| ${note.campaign} | ${note.title} | \`${note.notePath}\` | ${toStatus(note.primaryAudience)} | ${toStatus(note.campaignPurpose)} | ${toStatus(note.concept)} | ${toStatus(note.lyrics)} | ${toStatus(note.infographic)} | ${toStatus(note.still)} | ${toStatus(note.boundary)} |`,
    );
  }

  lines.push('');

  await fs.writeFile(OUTPUT_PATH, lines.join('\n'), 'utf8');
  process.stdout.write(`${OUTPUT_PATH}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
