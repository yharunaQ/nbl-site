import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import MaterialsShell from './MaterialsShell';
import { materialCatalog, type ReadingEntry } from '@/lib/materials/catalog';
import { bookEntryAnchor, completeBookEntries } from '@/lib/materials/complete';
import styles from './Materials.module.css';

export default function MaterialCompleteReader({ slug, entries, contents = entries }: { slug: string; entries: ReadingEntry[]; contents?: Omit<ReadingEntry, 'html'>[] }) {
  const meta = materialCatalog.find((item) => item.slug === slug)!;
  const chapters = completeBookEntries(slug, entries);
  const hasCompanion = contents.some(entry => entry.id === 'technical');
  const companionLabel = slug === 'policy' ? '技術別冊' : '実践詳論';
  const bookLabel = hasCompanion ? '本編全文' : '全冊版';
  return (
    <MaterialsShell title={`${meta.title} — ${bookLabel}`} description={meta.description} path={`/materials/${slug}/all`}>
      <div className={styles.completeBook}>
        <div className={styles.bookToolbar}>
          <Link href={`/materials/${slug}`}><ArrowLeft size={16} aria-hidden="true" /> 章を選んで読む</Link>
          <button type="button" className={styles.print} onClick={() => window.print()}>
            <Printer size={16} aria-hidden="true" /> {hasCompanion ? '本編全文を印刷・PDF保存' : '全冊を印刷・PDF保存'}
          </button>
        </div>
        <header className={styles.bookCover}>
          <p className={styles.eyebrow}>{meta.label} ／ {bookLabel}</p>
          {hasCompanion && <p>{companionLabel}は別ページです。<Link href={`/materials/${slug}/technical`}>{companionLabel}を読む →</Link></p>}
          <h1>{meta.title}</h1>
          <p className={styles.articleLead}>{meta.description}</p>
          <p className={styles.meta}>{meta.readerEdition} ／ {meta.readerUpdated}　・　{meta.edition}</p>
          <p className={styles.scopeSmall}>{meta.scope}</p>
        </header>
        <nav className={styles.bookContents} aria-label={hasCompanion ? '本編全文の目次' : '全冊の目次'}>
          <h2>この本の内容</h2>
          <ol>{chapters.map((entry) => (
            <li key={entry.id}><a href={`#${bookEntryAnchor(entry.id)}`}>{entry.title}<small>{entry.subtitle}</small></a></li>
          ))}</ol>
        </nav>
        {chapters.map((entry) => (
          <article className={styles.completeChapter} key={entry.id} aria-labelledby={bookEntryAnchor(entry.id)}>
            <header>
              <h2 id={bookEntryAnchor(entry.id)}>{entry.title}</h2>
              {entry.subtitle && <p className={styles.articleLead}>{entry.subtitle}</p>}
              <Link className={styles.chapterStandalone} href={`/materials/${slug}/${entry.id}`}>この本文だけ開く →</Link>
            </header>
            <div className={styles.prose} dangerouslySetInnerHTML={{ __html: entry.html }} />
          </article>
        ))}
      </div>
    </MaterialsShell>
  );
}
