import { Fragment } from 'react';
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';
import { forum } from '@/lib/workChoiceForum';
import { getSeminar, seminarList } from '@/lib/workChoiceForumSeminars';
import type { Seminar } from '@/lib/workChoiceForumSeminars/types';
import styles from '../../work-choice-forum.module.css';

type LectureProps = {
  seminar: Seminar;
  speaker: { name: string; role: string };
  session: { id: string; title: string };
  isKeynote: boolean;
  sources: (typeof forum.sources)[number][];
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: seminarList.map((seminar) => ({ params: { id: seminar.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<LectureProps> = async ({ params }) => {
  const id = params?.id;
  if (typeof id !== 'string') return { notFound: true };
  const isKeynote = id === forum.keynote.id;
  const session = isKeynote
    ? forum.sessions[0]
    : forum.sessions.find((item) => item.talks.some((talk) => talk.id === id));
  const speaker = isKeynote ? forum.keynote : session?.talks.find((talk) => talk.id === id);
  if (!session || !speaker) return { notFound: true };
  const seminar = getSeminar(id);
  return {
    props: {
      seminar,
      speaker: { name: speaker.name, role: speaker.role },
      session: { id: session.id, title: session.title },
      isKeynote,
      sources: forum.sources.filter((source) => seminar.sourceIds.includes(source.id)),
    },
  };
};

export default function ForumLecturePage({
  seminar,
  speaker,
  session,
  sources,
  isKeynote,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const forumPath = '/events/work-choice-forum';
  return (
    <>
      <PageSeo
        title={`${seminar.title} | NBLバーチャルフォーラム`}
        description={seminar.abstract}
        path={`${forumPath}/lecture/${seminar.id}`}
        imagePath="/images/work-condition-forum-virtual-stage-v1.webp"
      />
      <SiteNav />
      <main id="seminar-content" className={styles.forum}>
        <header className={`${styles.hero} ${styles.lectureHero}`}>
          <div className={styles.lectureInner}>
            <Link href={`${forumPath}#programme`} className={styles.back}>
              ← 全講演のプログラム
            </Link>
            <p className={styles.eyebrow}>NBL VIRTUAL FORUM · {isKeynote ? '基調講演' : '講演'}</p>
            <h1>{seminar.title}</h1>
            <p className={styles.subtitle}>{speaker.name}</p>
            <p className={styles.presenterRole}>{speaker.role}</p>
            <p className={styles.fiction}>
              架空の演者による講演です。発表内の事例・演習・提案は創作で、参照した実際の資料は
              <a href="#lecture-sources">末尾に掲載</a>しています。
            </p>
          </div>
        </header>
        <article className={styles.lectureBody}>
          <p className={styles.lectureAbstract}>{seminar.abstract}</p>
          <nav className={styles.lectureContents} aria-label="講演の目次">
            <ol>
              {seminar.sections.map((section, index) => (
                <li key={section.title}>
                  <a href={`#lecture-section-${index + 1}`}>{section.title}</a>
                </li>
              ))}
            </ol>
            <a href="#lecture-exhibit">発表資料を見る ↓</a>
          </nav>
          {seminar.sections.map((section, index) => (
            <Fragment key={section.title}>
              <section id={`lecture-section-${index + 1}`} className={styles.lectureSection}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex} className={styles.prose}>
                    {paragraph}
                  </p>
                ))}
              </section>
              {index === 1 && (
                <figure id="lecture-exhibit" className={styles.exhibit}>
                  <div className={styles.exhibitTable}>
                    <table>
                      <caption>{seminar.exhibit.title}</caption>
                      <thead>
                        <tr>
                          {seminar.exhibit.columns.map((column) => (
                            <th key={column} scope="col">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {seminar.exhibit.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) =>
                              cellIndex === 0 ? (
                                <th key={cellIndex} scope="row">
                                  {cell}
                                </th>
                              ) : (
                                <td key={cellIndex}>{cell}</td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <figcaption>{seminar.exhibit.note}</figcaption>
                </figure>
              )}
            </Fragment>
          ))}
          <section id="lecture-sources" className={styles.lectureSources}>
            <h2>講演が参照した資料</h2>
            {sources.map((source) => (
              <article key={source.id}>
                <p className={styles.eyebrow}>
                  {source.group} · {source.date}
                </p>
                <h3>
                  <a href={source.url}>{source.title} ↗</a>
                </h3>
                <p className={styles.status}>{source.status}</p>
                <p className={styles.prose}>{source.text}</p>
              </article>
            ))}
          </section>
          <aside className={styles.presenter} aria-label="講師紹介">
            <h2>講師</h2>
            <h3>{speaker.name}</h3>
            <p className={styles.prose}>{speaker.role}</p>
            <p>このフォーラムのために設定した架空の登壇者です。</p>
          </aside>
          <nav className={styles.lectureNext} aria-label="講演のあとの議論">
            <h2>{isKeynote ? '五つのセッションへ' : '同じ議題を、別の立場から'}</h2>
            <p>{session.title}</p>
            {isKeynote ? (
              <Link href={`${forumPath}#${session.id}`}>第1セッションの講演一覧へ →</Link>
            ) : (
              <>
                <Link href={`${forumPath}#${session.id}-discussion`}>発表を受けた共同討議へ →</Link>
                <Link href={`${forumPath}#${session.id}`}>このセッションの講演一覧へ →</Link>
              </>
            )}
            <Link href={`${forumPath}#plenary`}>五つのセッションを結ぶ全体討議へ →</Link>
            <Link href={`${forumPath}#declaration`}>共同宣言へ →</Link>
            <Link href={`${forumPath}#programme`}>全講演のプログラムへ →</Link>
          </nav>
        </article>
      </main>
    </>
  );
}
