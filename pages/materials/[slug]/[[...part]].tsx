import type { GetStaticPaths, GetStaticProps } from 'next';
import MaterialReader, { type MaterialReaderProps } from '@/components/materials/MaterialReader';
import { materialCatalog, type MaterialSlug } from '@/lib/materials/catalog';
import { loadMaterial } from '@/lib/materials/load';
import { supportsCompleteBook } from '@/lib/materials/complete';
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: materialCatalog.flatMap((m) => [
    { params: { slug: m.slug, part: [] } },
    ...(supportsCompleteBook(m.slug) ? [{ params: { slug: m.slug, part: ['all'] } }] : []),
    ...loadMaterial(m.slug).entries.map((e) => ({ params: { slug: m.slug, part: [e.id] } })),
  ]),
  fallback: false,
});
export const getStaticProps: GetStaticProps<MaterialReaderProps> = async ({ params }) => {
  const slug = params?.slug as MaterialSlug;
  if (!materialCatalog.some((m) => m.slug === slug)) return { notFound: true };
  const data = loadMaterial(slug);
  const part = params?.part as string[] | undefined;
  if (part && part.length > 1) return { notFound: true };
  if (part?.[0] === 'all' && supportsCompleteBook(slug))
    return { props: { slug, entry: null, completeEntries: data.entries.filter(e => e.id !== 'technical' && e.editionPart !== 'technical'), contents: data.entries.map(({ html, ...e }) => e) } };
  const entry = part?.length ? (data.entries.find((e) => e.id === part[0]) ?? null) : null;
  if (part?.length && !entry) return { notFound: true };
  return { props: { slug, entry, contents: data.entries.map(({ html, ...e }) =>
    slug === 'research' && !entry
      ? { ...e, searchText: html.replace(/<[^>]*>/g, ' ').replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" })[entity]!).replace(/\s+/g, ' ').trim() }
      : e) } };
};
export default MaterialReader;
