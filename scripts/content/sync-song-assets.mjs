/**
 * Sync song assets
 *
 * For each song in content/media/songs/generated.json:
 * 1. Find the WAV file in content-inbox/songs/<campaign>/<title>/
 * 2. Convert to MP3 (192kbps) → public/songs/audio/<slug>.mp3
 * 3. Copy still visual → public/songs/still/<slug>.jpg (if present in inbox)
 * 4. Copy lyric card  → public/songs/lyric-card/<slug>.jpg (if present)
 *
 * Usage:
 *   node scripts/content/sync-song-assets.mjs [--dry-run]
 *
 * Requires: ffmpeg in PATH (brew install ffmpeg)
 */

import { promises as fs } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const execFileAsync = promisify(execFile);

const ROOT = process.cwd();
const SONGS_ROOT = path.join(ROOT, 'content-inbox/songs');
const GENERATED_JSON = path.join(ROOT, 'content/media/songs/generated.json');
const PUBLIC_AUDIO = path.join(ROOT, 'public/songs/audio');
const PUBLIC_STILL = path.join(ROOT, 'public/songs/still');
const PUBLIC_LYRIC_CARD = path.join(ROOT, 'public/songs/lyric-card');

const DRY_RUN = process.argv.includes('--dry-run');

const FFMPEG_BITRATE = '192k';
const FFMPEG_CODEC = 'libmp3lame';

const CAMPAIGN_SLUG_TO_JA = {
  'reasonable-accommodation': '合理的配慮キャンペーン',
  'inclusive-employment': 'インクルーシブ雇用キャンペーン',
  'disability-awareness': '障害者雇用啓発キャンペーン',
  'care-work-employment-bridge': '医療・福祉・雇用の連携キャンペーン',
};

let converted = 0;
let copied = 0;
let skipped = 0;
let errors = 0;

function log(msg) {
  if (DRY_RUN) process.stdout.write(`[dry-run] ${msg}\n`);
  else process.stdout.write(`${msg}\n`);
}

async function ensureDir(dir) {
  if (!DRY_RUN) await fs.mkdir(dir, { recursive: true });
}

async function findWavFile(song) {
  // Find folder by campaign slug (map to Japanese) + title
  const campaignJa = CAMPAIGN_SLUG_TO_JA[song.campaignSlug];
  if (!campaignJa) {
    console.warn(`[warn] Unknown campaign slug "${song.campaignSlug}" for ${song.slug}`);
    return null;
  }

  const titleDir = path.join(SONGS_ROOT, campaignJa, song.title);

  let files;
  try {
    files = await fs.readdir(titleDir);
  } catch {
    console.warn(`[warn] Song folder not found: ${titleDir}`);
    return null;
  }

  // Use audioSource field if specified, otherwise find any .wav
  if (song.audioSource) {
    const candidate = path.join(titleDir, song.audioSource);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      console.warn(`[warn] audioSource "${song.audioSource}" not found in ${titleDir}`);
    }
  }

  // Fallback: first .wav file
  const wav = files.find((f) => f.toLowerCase().endsWith('.wav'));
  return wav ? path.join(titleDir, wav) : null;
}

async function findStillFile(song) {
  const campaignJa = CAMPAIGN_SLUG_TO_JA[song.campaignSlug];
  if (!campaignJa) return null;
  const titleDir = path.join(SONGS_ROOT, campaignJa, song.title);

  let files;
  try {
    files = await fs.readdir(titleDir);
  } catch {
    return null;
  }

  // Look for jpg/png that isn't the wav
  const image = files.find((f) => /\.(jpe?g|png|webp)$/i.test(f));
  return image ? path.join(titleDir, image) : null;
}

async function convertToMp3(wavPath, mp3Path) {
  log(`convert  ${path.relative(ROOT, wavPath)} → ${path.relative(ROOT, mp3Path)}`);
  if (DRY_RUN) return;

  await execFileAsync('ffmpeg', [
    '-y',
    '-i', wavPath,
    '-codec:a', FFMPEG_CODEC,
    '-b:a', FFMPEG_BITRATE,
    // ID3 tags injected via metadata — title/artist/album
    '-metadata', `title=${path.basename(wavPath, path.extname(wavPath))}`,
    '-metadata', 'artist=Next Being Lab',
    mp3Path,
  ]);
}

async function copyFile(src, dest, label) {
  log(`copy     ${label}: ${path.relative(ROOT, src)} → ${path.relative(ROOT, dest)}`);
  if (DRY_RUN) return;
  await fs.copyFile(src, dest);
}

async function processSong(song) {
  const { slug, title, campaignSlug } = song;

  // --- Audio ---
  const mp3Path = path.join(PUBLIC_AUDIO, `${slug}.mp3`);
  const wavPath = await findWavFile(song);

  if (!wavPath) {
    console.warn(`[warn] No WAV found for "${title}" (${campaignSlug}) — skip audio`);
    errors++;
  } else {
    let needsConvert = true;
    if (!DRY_RUN) {
      try {
        const [wavStat, mp3Stat] = await Promise.all([fs.stat(wavPath), fs.stat(mp3Path)]);
        // Skip if mp3 is newer than wav
        if (mp3Stat.mtimeMs >= wavStat.mtimeMs) {
          needsConvert = false;
          skipped++;
        }
      } catch {
        // mp3 doesn't exist yet
      }
    }

    if (needsConvert) {
      await ensureDir(PUBLIC_AUDIO);
      try {
        await convertToMp3(wavPath, mp3Path);
        converted++;
      } catch (e) {
        console.error(`[error] ffmpeg failed for ${slug}: ${e.message}`);
        errors++;
      }
    }
  }

  // --- Still visual ---
  const stillDest = path.join(PUBLIC_STILL, `${slug}.jpg`);
  const stillSrc = await findStillFile(song);

  if (stillSrc) {
    let needsCopy = true;
    if (!DRY_RUN) {
      try {
        const [srcStat, destStat] = await Promise.all([fs.stat(stillSrc), fs.stat(stillDest)]);
        if (destStat.mtimeMs >= srcStat.mtimeMs) {
          needsCopy = false;
          skipped++;
        }
      } catch {
        // dest doesn't exist yet
      }
    }
    if (needsCopy) {
      await ensureDir(PUBLIC_STILL);
      try {
        await copyFile(stillSrc, stillDest, 'still');
        copied++;
      } catch (e) {
        console.error(`[error] copy still failed for ${slug}: ${e.message}`);
        errors++;
      }
    }
  }
}

async function main() {
  if (DRY_RUN) console.log('--- DRY RUN (no files will be written) ---\n');

  let generated;
  try {
    const raw = await fs.readFile(GENERATED_JSON, 'utf8');
    generated = JSON.parse(raw);
  } catch {
    console.error(`[error] Cannot read ${GENERATED_JSON} — run "npm run songs:build" first`);
    process.exitCode = 1;
    return;
  }

  const songs = generated.songs ?? [];
  console.log(`Processing ${songs.length} songs from generated.json\n`);

  for (const song of songs) {
    await processSong(song);
  }

  console.log(`\nDone: converted=${converted} copied=${copied} skipped=${skipped} errors=${errors}`);
  if (errors > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
