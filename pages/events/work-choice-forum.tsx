import Link from 'next/link';
import type { InferGetStaticPropsType } from 'next';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';
import { forum } from '@/lib/workChoiceForum';
import styles from './work-choice-forum.module.css';

export const getStaticProps = async () => ({ props: { forum } });

export default function WorkChoiceForumPage({
  forum,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSeo
        title={`${forum.title} | Next Being Lab`}
        description={forum.subtitle}
        path="/events/work-choice-forum"
        imagePath="/images/work-condition-forum-virtual-stage-v1.webp"
      />
      <SiteNav />
      <main id="forum-content" className={styles.forum}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <Link href="/events" className={styles.back}>
              ← イベント一覧
            </Link>
            <p className={styles.eyebrow}>NBL VIRTUAL FORUM · 講演と共同討議</p>
            <h1>{forum.title}</h1>
            <p className={styles.subtitle}>{forum.subtitle}</p>
            <p className={styles.fiction}>
              登壇者・発表・討議・共同宣言はNBLの創作です。参照した実際の会議資料は
              <a href="#sources-title">末尾に掲載</a>しています。
            </p>
          </div>
        </header>
        <div className={styles.body}>
          <p className={styles.lead}>{forum.lead}</p>
          <section id="keynote" className={styles.opening} aria-labelledby="opening-title">
            <p className={styles.eyebrow}>基調講演 · {forum.keynote.time}</p>
            <h2 id="opening-title">
              <Link href={`/events/work-choice-forum/lecture/${forum.keynote.id}`}>
                {forum.keynote.title}
              </Link>
            </h2>
            <p className={styles.speaker}>
              {forum.keynote.name} <span>{forum.keynote.role}</span>
            </p>
            <p className={styles.prose}>{forum.keynote.abstract}</p>
            <Link
              className={styles.lectureLink}
              href={`/events/work-choice-forum/lecture/${forum.keynote.id}`}
            >
              基調講演の全文・発表資料を読む →
            </Link>
          </section>
          <nav id="programme" aria-label="フォーラムのプログラム" className={styles.agenda}>
            <h2>プログラム</h2>
            <div className={styles.agendaBookend}>
              <Link href={`/events/work-choice-forum/lecture/${forum.keynote.id}`}>
                <span>
                  {forum.keynote.time} · 基調講演 · {forum.keynote.name}
                </span>
                <strong>{forum.keynote.title}</strong>
              </Link>
            </div>
            <ol>
              {forum.sessions.map((session) => (
                <li key={session.id}>
                  <a href={`#${session.id}`}>
                    <span>
                      {session.time} · {session.format}
                    </span>
                    <strong>{session.title}</strong>
                  </a>
                  <div className={styles.lineup}>
                    <ul>
                      {session.talks.map((talk) => (
                        <li key={talk.name}>
                          <Link href={`/events/work-choice-forum/lecture/${talk.id}`}>
                            <span>{talk.name}</span>
                            <strong>{talk.title}</strong>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
            <div className={styles.agendaBookend}>
              <a href={`#${forum.plenary.id}`}>
                <span>{forum.plenary.time} · 全体討議・まとめ</span>
                <strong>{forum.plenary.title}</strong>
              </a>
            </div>
            <a className={styles.declarationLink} href="#declaration">
              共同宣言を読む ↓
            </a>
          </nav>
          {forum.sessions.map((session, index) => (
            <section
              id={session.id}
              key={session.id}
              className={styles.session}
              aria-labelledby={`${session.id}-title`}
            >
              <header className={styles.sessionHeader}>
                <p className={styles.eyebrow}>
                  SESSION {String(index + 1).padStart(2, '0')} · {session.time} · {session.format}
                </p>
                <h2 id={`${session.id}-title`}>{session.title}</h2>
                <p className={styles.question}>{session.question}</p>
                <p className={styles.prose}>{session.intro}</p>
              </header>
              <div className={styles.talks}>
                {session.talks.map((talk, talkIndex) => (
                  <article
                    id={`${session.id}-talk-${talkIndex + 1}`}
                    className={styles.talk}
                    key={talk.name}
                  >
                    <p className={styles.speaker}>
                      {talk.name}
                      <span>{talk.role}</span>
                    </p>
                    <h3>
                      <Link href={`/events/work-choice-forum/lecture/${talk.id}`}>
                        {talk.title}
                      </Link>
                    </h3>
                    <p className={styles.prose}>{talk.abstract}</p>
                    <Link
                      className={styles.lectureLink}
                      href={`/events/work-choice-forum/lecture/${talk.id}`}
                    >
                      講演全文・発表資料を読む →
                    </Link>
                  </article>
                ))}
              </div>
              <section
                id={`${session.id}-discussion`}
                className={styles.exchange}
                aria-label={`${session.title}の共同討議`}
              >
                <p className={styles.eyebrow}>FLOOR DISCUSSION · 架空の対話</p>
                <h3>発表を受けての共同討議</h3>
                {session.exchange.map((turn, turnIndex) => (
                  <div className={styles.turn} key={turnIndex}>
                    <p className={styles.speaker}>{turn.name}</p>
                    <p className={styles.prose}>{turn.text}</p>
                  </div>
                ))}
              </section>
              <aside className={styles.amendment}>
                <h3>議論を経て、提案を改める</h3>
                <dl>
                  <dt>議論前の提案</dt>
                  <dd>{session.amendment.before}</dd>
                  <dt>議論後の提案</dt>
                  <dd>{session.amendment.after}</dd>
                </dl>
                <a className={styles.lectureLink} href={`#${session.handoff.round}`}>
                  全体討議へ · {session.handoff.text} →
                </a>
              </aside>
              <div className={styles.sourceLinks}>
                <span>このセッションの参照資料</span>
                {session.sourceIds.map((id) => {
                  const source = forum.sources.find((item) => item.id === id);
                  return (
                    <a key={id} href={`#source-${id}`}>
                      {source?.title ?? id}
                    </a>
                  );
                })}
              </div>
              <a className={styles.returnLink} href="#programme">
                プログラムへ戻る ↑
              </a>
            </section>
          ))}
          <section id={forum.plenary.id} className={styles.session} aria-labelledby="plenary-title">
            <header className={styles.sessionHeader}>
              <p className={styles.eyebrow}>PLENARY · {forum.plenary.time}</p>
              <h2 id="plenary-title">{forum.plenary.title}</h2>
              <p className={styles.prose}>{forum.plenary.lead}</p>
            </header>
            <nav className={styles.plenaryContents} aria-label="全体討議の進行">
              <ul>
                <li><a href="#plenary-synthesis">五つの会場から共同提案へ</a></li>
                <li><a href={`#${forum.plenary.application.id}`}>{forum.plenary.application.title}</a></li>
              </ul>
            </nav>
            <section id="plenary-synthesis" aria-labelledby="synthesis-title">
              <h3 id="synthesis-title" className={styles.proposalTitle}>五つの会場から共同提案へ</h3>
              {forum.plenary.rounds.map((round) => (
                <section id={round.id} key={round.id} className={styles.exchange}>
                  <h4>{round.title}</h4>
                  {round.turns.map((turn) => (
                    <div className={styles.turn} key={turn.name}>
                      <p className={styles.speaker}>{turn.name}</p>
                      <p className={styles.prose}>{turn.text}</p>
                    </div>
                  ))}
                  <div className={styles.articleLinks} aria-label="この討議から生まれた条項">
                    {forum.declaration.articles.map((article, index) =>
                      round.articleIds.includes(article.id) ? (
                        <a key={article.id} href={`#${article.id}`} aria-label={`宣言第${index + 1}項　${article.title}`}>
                          宣言第{index + 1}項 →
                        </a>
                      ) : null,
                    )}
                  </div>
                </section>
              ))}
              <p className={styles.prose}>{forum.plenary.synthesis}</p>
            </section>
            <section id={forum.plenary.application.id} className={styles.exchange} aria-labelledby="application-title">
              <h3 id="application-title">{forum.plenary.application.title}</h3>
              <p className={styles.prose}>{forum.plenary.application.prompt}</p>
              {forum.plenary.application.turns.map((turn) => (
                <div className={styles.turn} key={turn.name}>
                  <p className={styles.speaker}>{turn.name}</p>
                  <p className={styles.prose}>{turn.text}</p>
                </div>
              ))}
            </section>
            <div className={styles.amendment}>
              <h3>共同宣言へ</h3>
              <p className={styles.prose}>{forum.plenary.decision}</p>
              <a className={styles.lectureLink} href="#declaration">
                採択した共同宣言を読む ↓
              </a>
            </div>
            <a className={styles.returnLink} href="#programme">
              プログラムへ戻る ↑
            </a>
          </section>
          <section
            id="declaration"
            className={styles.declaration}
            aria-labelledby="declaration-title"
          >
            <p className={styles.eyebrow}>JOINT DECLARATION · 架空の共同宣言</p>
            <h2 id="declaration-title">{forum.declaration.title}</h2>
            <p className={styles.prose}>{forum.declaration.preamble}</p>
            <p className={styles.prose}>{forum.declaration.purpose}</p>
            <h3 className={styles.proposalTitle}>なぜ、この六項を一緒に求めるのか</h3>
            <p className={styles.prose}>{forum.declaration.rationale}</p>
            <ol>
              {forum.declaration.articles.map((article) => (
                <li key={article.id} id={article.id}>
                  <h3>{article.title}</h3>
                  <p className={styles.prose}>{article.text}</p>
                  <details className={styles.articleExample}>
                    <summary>{article.exampleTitle}</summary>
                    <p className={styles.prose}>{article.example}</p>
                  </details>
                  <div className={styles.articleLinks}>
                    {article.id === forum.plenary.application.amendedArticle && (
                      <a href={`#${forum.plenary.application.id}`}>この条項を改めた最後の照合へ ↑</a>
                    )}
                    {forum.plenary.rounds.filter((round) => round.articleIds.includes(article.id)).map((round) => (
                      <a key={round.id} href={`#${round.id}`}>全体討議 · {round.title} ↑</a>
                    ))}
                    {forum.sessions
                      .filter((session) => article.sessions.includes(session.id))
                      .map((session) => (
                        <a key={session.id} href={`#${session.id}`}>
                          {session.title.split('　')[0]}の討議へ ↑
                        </a>
                      ))}
                  </div>
                </li>
              ))}
            </ol>
            <h3 className={styles.proposalTitle}>国の次の制度改正に求めること</h3>
            <p className={styles.prose}>{forum.declaration.nationalAction}</p>
            <p className={styles.prose}>{forum.declaration.deliberation}</p>
            <div className={styles.articleLinks}>
              <a href="#source-right-to-work">宣言の出発点となる障害者権利条約第27条</a>
              <a href="#source-cross-interim">国内で始まっている雇用・福祉の横断審議</a>
              <a href="#next-steps">地域での試行と、国で比べる二つの制度課題 ↓</a>
            </div>
            <section id="next-steps" className={styles.reservation} aria-labelledby="next-steps-title">
              <h3 id="next-steps-title">実施と検証　地域の九十日と国の制度選択</h3>
              {forum.declaration.trials.map((trial) => (
                <div key={trial.id} id={trial.id}>
                  <h4>{trial.title}</h4>
                  <p className={styles.prose}>{trial.text}</p>
                </div>
              ))}
            </section>
          </section>
          <section className={styles.sources} aria-labelledby="sources-title">
            <p className={styles.eyebrow}>SOURCES & STATUS</p>
            <h2 id="sources-title">参照資料と位置づけ</h2>
            {forum.sources.map((source) => (
              <article id={`source-${source.id}`} key={source.id}>
                <p className={styles.eyebrow}>
                  {source.group} · {source.date}
                </p>
                <h3>{source.title}</h3>
                <p className={styles.status}>{source.status}</p>
                <p className={styles.prose}>{source.text}</p>
                {source.url && <a href={source.url}>参照先を開く ↗</a>}
              </article>
            ))}
          </section>
          <footer className={styles.footer}>
            <p>Next Being Lab · 架空のフォーラムとして読む、仕事と選択の議論。</p>
            <Link href="/events/work-condition-forum">
              仕事条件デザイン・バーチャルフォーラムへ →
            </Link>
            <a href="#forum-content">ページの先頭へ ↑</a>
          </footer>
        </div>
      </main>
    </>
  );
}
