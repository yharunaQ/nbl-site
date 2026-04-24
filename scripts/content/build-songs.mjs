/**
 * Songs generator
 *
 * Reads all campaign-song-note.md files from content-inbox/songs/,
 * skips `Status: hold`, validates `Status: public` gates,
 * and writes generated JSON indexes to content/media/songs/.
 *
 * Also validates weekly-pick.yml slugs against generated songs.
 *
 * Usage: node scripts/content/build-songs.mjs [--strict]
 *   --strict: exit 1 on any warning (use in CI / preflight)
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const ROOT = process.cwd();
const SONGS_ROOT = path.join(ROOT, 'content-inbox/songs');
const MEDIA_ROOT = path.join(ROOT, 'content/media/songs');
const CAMPAIGNS_FILE = path.join(MEDIA_ROOT, 'campaigns.yml');
const WEEKLY_PICK_FILE = path.join(MEDIA_ROOT, 'weekly-pick.yml');

const STRICT = process.argv.includes('--strict');

// Public gate: these fields must be non-empty for Status: public to pass
const PUBLIC_GATE_FIELDS = [
  'slug',
  'catchphrase',
  'heroVisual',
  'audioPublic',
  'lyrics',
  'shortConceptNote',
  'companionBoundaryNote',
  'primaryAudience',
];

// Campaign slug map: Japanese label → English slug
const CAMPAIGN_SLUG_MAP = {
  '合理的配慮キャンペーン': 'reasonable-accommodation',
  'インクルーシブ雇用キャンペーン': 'inclusive-employment',
  '障害者雇用啓発キャンペーン': 'disability-awareness',
  '医療・福祉・雇用の連携キャンペーン': 'care-work-employment-bridge',
  '次の地平へ': 'next-horizon',
  '周辺化された人々': 'marginalized-people',
};

const warnings = [];
const errors = [];

function warn(msg) {
  warnings.push(msg);
  console.warn(`[warn] ${msg}`);
}

function error(msg) {
  errors.push(msg);
  console.error(`[error] ${msg}`);
}

function formatTokyoDateTime(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
    .format(date)
    .replace(' ', 'T');
}

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
  // label is passed as a regex-ready string (callers pre-escape special chars with \\)
  const match = content.match(new RegExp(`^- ${label}:[ \\t]*(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

function extractLyrics(content) {
  const match = content.match(/## Lyrics\s+```(?:text)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : '';
}

function extractSection(content, sectionName) {
  const match = content.match(
    new RegExp(`## ${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`),
  );
  return match ? match[1] : '';
}

function parseCommaSeparated(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSong(content, filePath) {
  const campaignJa = extractField(content, 'Campaign') || path.basename(path.dirname(path.dirname(filePath)));
  const title = extractField(content, 'Title') || path.basename(path.dirname(filePath));
  const campaignSlug = CAMPAIGN_SLUG_MAP[campaignJa.normalize('NFC')] || campaignJa;

  // Publishing section
  const publishingSection = extractSection(content, 'Publishing');
  const slug = extractField(publishingSection, 'Slug');
  const publishStatus = extractField(publishingSection, 'Status') || extractField(content, 'Status') || 'inbox';
  const catchphrase = extractField(publishingSection, 'Catchphrase');
  const releaseDate = extractField(publishingSection, 'Release date');
  const duration = extractField(publishingSection, 'Duration');

  // Assets section
  const assetsSection = extractSection(content, 'Assets \\(web\\)');
  const audioSource = extractField(assetsSection, 'Audio source');
  const heroVisual = extractField(assetsSection, 'Hero visual');
  const lyricCard = extractField(assetsSection, 'Lyric card \\(optional\\)');
  const youtubeId = extractField(assetsSection, 'YouTube id');

  // Derive audioPublic from slug
  const audioPublic = slug ? `songs/audio/${slug}.mp3` : '';

  // Campaign Intent
  const intentSection = extractSection(content, 'Campaign Intent');
  const primaryAudience = extractField(intentSection, 'Primary audience') || extractField(content, 'Primary audience');
  const secondaryAudience = extractField(intentSection, 'Secondary audience') || extractField(content, 'Secondary audience');
  const shortConceptNote = extractField(intentSection, 'Short concept note \\(120-200 chars\\)') || extractField(content, 'Short concept note \\(120-200 chars\\)');

  // Cross-links
  const crossLinksSection = extractSection(content, 'Cross-links');
  const relatedSongSlugs = parseCommaSeparated(extractField(crossLinksSection, 'Related song slugs'));
  const relatedCampaignSlugs = parseCommaSeparated(extractField(crossLinksSection, 'Related campaigns'));
  const relatedInfographicKeys = parseCommaSeparated(extractField(crossLinksSection, 'Related infographic keys'));

  // Related resource paths (may be multi-line bullets)
  const resourcePathsMatch = crossLinksSection.match(/- Related resource paths:([\s\S]*?)(?=\n- |\n## |$)/);
  const relatedResourcePaths = [];
  if (resourcePathsMatch) {
    const block = resourcePathsMatch[1];
    // If value is on same line
    const sameLine = block.match(/^[ \t]*(.+)$/m);
    if (sameLine && sameLine[1].startsWith('/')) {
      relatedResourcePaths.push(sameLine[1].trim());
    }
    // Multi-line bullets
    const bullets = block.matchAll(/^\s+-\s+(.+)$/gm);
    for (const b of bullets) relatedResourcePaths.push(b[1].trim());
  }

  // Share copy
  const shareSection = extractSection(content, 'Share copy');
  const shareCopyX = extractField(shareSection, 'X \\(140字以内\\)');
  const shareCopyThreads = extractField(shareSection, 'Threads \\(200字以内\\)');
  const shareCopyLine = extractField(shareSection, 'LINE \\(120字以内\\)');

  // Guardrails / boundary note (from Related Assets for legacy, Guardrails for new)
  const companionBoundaryNote = extractField(content, 'Companion boundary note');

  const lyrics = extractLyrics(content);
  const notePath = path.relative(ROOT, filePath).replaceAll(path.sep, '/');

  return {
    slug,
    title,
    campaignSlug,
    campaignTitle: campaignJa,
    status: publishStatus,
    releaseDate: releaseDate || undefined,
    catchphrase,
    shortConceptNote,
    lyrics,
    duration: duration || undefined,
    companionBoundaryNote,
    primaryAudience,
    secondaryAudience: secondaryAudience || undefined,
    heroVisual: heroVisual || undefined,
    audioPublic: audioPublic || undefined,
    audioSource: audioSource || undefined,
    lyricCard: lyricCard || undefined,
    youtubeId: youtubeId || undefined,
    relatedSongSlugs,
    relatedCampaignSlugs,
    relatedResourcePaths,
    relatedInfographicKeys,
    shareCopyX: shareCopyX || undefined,
    shareCopyThreads: shareCopyThreads || undefined,
    shareCopyLine: shareCopyLine || undefined,
    notePath,
  };
}

function validatePublicGate(song) {
  const missing = [];
  for (const field of PUBLIC_GATE_FIELDS) {
    if (!song[field]) missing.push(field);
  }
  return missing;
}

function buildInverseIndexes(songs) {
  const byInfographic = {};
  const byResourcePath = {};
  const byCampaign = {};

  for (const song of songs) {
    // by campaign
    if (!byCampaign[song.campaignSlug]) byCampaign[song.campaignSlug] = [];
    byCampaign[song.campaignSlug].push(song.slug);

    // by infographic
    for (const key of song.relatedInfographicKeys) {
      if (!byInfographic[key]) byInfographic[key] = [];
      byInfographic[key].push(song.slug);
    }

    // by resource path
    for (const p of song.relatedResourcePaths) {
      if (!byResourcePath[p]) byResourcePath[p] = [];
      byResourcePath[p].push(song.slug);
    }
  }

  return { byInfographic, byResourcePath, byCampaign };
}

async function validateWeeklyPick(publicSlugs) {
  let raw;
  try {
    raw = await fs.readFile(WEEKLY_PICK_FILE, 'utf8');
  } catch {
    warn('weekly-pick.yml not found — skipping validation');
    return;
  }

  let data;
  try {
    data = parseYaml(raw);
  } catch (e) {
    error(`weekly-pick.yml parse error: ${e.message}`);
    return;
  }

  const current = data?.current;
  if (!current) {
    warn('weekly-pick.yml: no "current" block found');
    return;
  }

  for (const pick of current.picks ?? []) {
    if (!publicSlugs.has(pick.slug)) {
      error(`weekly-pick.yml: slug "${pick.slug}" not found in public songs`);
    }
  }

  // Staleness check: warn if week_of is more than 14 days ago
  if (current.week_of) {
    const weekOf = new Date(current.week_of);
    const now = new Date();
    const daysDiff = (now - weekOf) / (1000 * 60 * 60 * 24);
    if (daysDiff > 14) {
      warn(`weekly-pick.yml: "current.week_of" is ${Math.floor(daysDiff)} days old — consider updating`);
    }
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`wrote ${path.relative(ROOT, filePath)}`);
}

async function main() {
  const noteFiles = await findNoteFiles(SONGS_ROOT);
  const allSongs = [];

  for (const filePath of noteFiles) {
    const content = await fs.readFile(filePath, 'utf8');
    const song = parseSong(content, filePath);

    // Skip hold
    if (song.status === 'hold') {
      console.log(`[skip] hold: ${song.title}`);
      continue;
    }

    // Slug required for all non-hold songs
    if (!song.slug) {
      warn(`Missing Slug in ${song.notePath} (status: ${song.status}) — song excluded from output`);
      continue;
    }

    // Validate public gate
    if (song.status === 'public') {
      const missing = validatePublicGate(song);
      if (missing.length > 0) {
        error(`Public gate FAIL [${song.slug}]: missing fields: ${missing.join(', ')}`);
        // Downgrade to review so it doesn't block build unless --strict
        song.status = 'review';
      }
    }

    allSongs.push(song);
  }

  // Slug uniqueness
  const slugCounts = {};
  for (const song of allSongs) {
    slugCounts[song.slug] = (slugCounts[song.slug] ?? 0) + 1;
  }
  for (const [slug, count] of Object.entries(slugCounts)) {
    if (count > 1) error(`Duplicate slug: "${slug}" appears ${count} times`);
  }

  // Public songs only
  const publicSongs = allSongs.filter((s) => s.status === 'public');
  const publicSlugs = new Set(publicSongs.map((s) => s.slug));

  // Validate cross-references (related song slugs point to known songs)
  const allSlugs = new Set(allSongs.map((s) => s.slug));
  for (const song of allSongs) {
    for (const related of song.relatedSongSlugs) {
      if (!allSlugs.has(related)) {
        warn(`[${song.slug}] relatedSongSlugs: unknown slug "${related}"`);
      }
    }
  }

  await validateWeeklyPick(publicSlugs);

  // Build indexes (all non-hold songs, not just public, for cross-linking in review state)
  const { byInfographic, byResourcePath, byCampaign } = buildInverseIndexes(allSongs);

  // Snapshot
  console.log(`\nSongs: ${allSongs.length} (hold excluded)`);
  console.log(`  public: ${publicSongs.length}`);
  console.log(`  review: ${allSongs.filter((s) => s.status === 'review').length}`);
  console.log(`  inbox:  ${allSongs.filter((s) => s.status === 'inbox').length}`);

  // Write outputs
  await writeJson(path.join(MEDIA_ROOT, 'generated.json'), {
    songs: allSongs,
    generatedAt: formatTokyoDateTime(),
  });

  await writeJson(path.join(MEDIA_ROOT, 'by-infographic.json'), byInfographic);
  await writeJson(path.join(MEDIA_ROOT, 'by-resource-path.json'), byResourcePath);
  await writeJson(path.join(MEDIA_ROOT, 'by-campaign.json'), byCampaign);

  // Summary
  if (warnings.length > 0) {
    console.warn(`\n${warnings.length} warning(s)`);
  }
  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s)`);
    if (STRICT) {
      process.exitCode = 1;
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
