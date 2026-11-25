import type { ReadingEntry } from './catalog';

export const completeBookSlugs = ['textbook', 'policy'] as const;
export function supportsCompleteBook(slug: string) {
  return completeBookSlugs.some((item) => item === slug);
}
export const bookEntryAnchor = (id: string) => `book-entry-${id}`;

// Chapter-local IDs recur in the curated records. Give each one its own scope
// in a complete book, and keep same-book links inside the assembled document.
export function completeBookEntries(slug: string, entries: ReadingEntry[]): ReadingEntry[] {
  entries = entries.filter(entry => !supportsCompleteBook(slug) || (entry.editionPart !== 'technical' && entry.id !== 'technical'));
  const idsByEntry = new Map(entries.map((entry) => [entry.id,
    new Set([...entry.html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]))]));
  const scopedId = (entryId: string, id: string) => `${bookEntryAnchor(entryId)}-${id}`;
  return entries.map((entry) => ({
    ...entry,
    html: entry.html
      .replace(/\bid="([^"]+)"/g, (_, id: string) => `id="${scopedId(entry.id, id)}"`)
      .replace(/href="([^"]+)"/g, (whole, raw: string) => {
        const url = raw.replace(/&amp;/g, '&');
        if (url.startsWith('#') && idsByEntry.get(entry.id)?.has(url.slice(1)))
          return `href="#${scopedId(entry.id, url.slice(1))}"`;
        const prefix = `/materials/${slug}/`;
        if (!url.startsWith(prefix)) return whole;
        const [target, fragment] = url.slice(prefix.length).split('#');
        if (!idsByEntry.has(target)) return whole;
        if (fragment && idsByEntry.get(target)?.has(fragment))
          return `href="#${scopedId(target, fragment)}"`;
        return fragment ? whole : `href="#${bookEntryAnchor(target)}"`;
      })
      .replace(/<(\/?)(h[2-5])(?=[\s>])/g, (_, slash: string, heading: string) =>
        `<${slash}h${Number(heading.slice(1)) + 1}`),
  }));
}
