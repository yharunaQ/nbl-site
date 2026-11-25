import fs from 'node:fs';
import path from 'node:path';
import type { MaterialData, MaterialSlug } from './catalog';
// Build-time only. The delivery pages consume the curated files, never restricted sources.
export function loadMaterial(slug: MaterialSlug): MaterialData {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'content/materials', `${slug}.json`), 'utf8'),
  );
}
