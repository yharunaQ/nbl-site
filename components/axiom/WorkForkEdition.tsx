import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Download, Printer } from 'lucide-react';
import { AxiomNextSiteLink as Link } from './AxiomNextSiteLinks';
import { supportToolHref } from './organizationChecklistContent';
import { workForkIssues, type WorkForkIssueId } from './workForkIssues';
import styles from './WorkForkEdition.module.css';

const base = '/preview/axiom-next-nbl-v2';
const scriptUse = 'NBL作成の台本は、作品名と出典を残して、ご自身の会議や授業でそのまま読み合わせできます。改変して配布する場合や販売・出版、第三者資料の複製については、運営案内の利用条件をご確認ください。';

export default function WorkForkEdition({ issue }: { issue: WorkForkIssueId }) {
  return <Edition key={issue} issue={issue} />;
}

function Edition({ issue }: { issue: WorkForkIssueId }) {
  const story = workForkIssues[issue];
  const other = issue === 'inspection' ? 'ict' : 'inspection';
  const [voice, setVoice] = useState(0);
  const [route, setRoute] = useState<number | null>(null);
  const [changed, setChanged] = useState(false);
  const [note, setNote] = useState('');
  const [includeNote, setIncludeNote] = useState(false);
  const [includeChoice, setIncludeChoice] = useState(false);
  const [status, setStatus] = useState('');
  const [origin, setOrigin] = useState('');
  useEffect(() => setOrigin(window.location.origin), []);
  const condition = changed ? 1 : 0;
  const activeRoute = route === null ? null : story.routes[route];
  const choice = activeRoute?.label || (route === null ? 'まだ決めない' : '自分で別案を出す');
  const result = activeRoute ? (changed ? activeRoute.change : activeRoute.next) : story.ownPrompts[condition];
  const relativeSource = (url: string) => url.startsWith('/');
  const discussion = [
    '1分｜場面を読む。一人なら三役を順に読む。複数なら役を一つずつ選ぶ。自分の事情は話さなくてよい。',
    '4分｜三人がそれぞれの台詞を読む。他の役の希望を決めず、自分の役なら残したいものを一つ挙げる。',
    '5分｜' + story.meetingTask,
    '3分｜' + story.reversal + '　先ほどの案を撤回しても、別案を書き足してもよい。',
    '2分｜動かせる人、時間や費用、返事をする日を記す。合意しなかった点、本人が保留した点もそのまま返す。',
  ];
  function packet(personal: boolean, origin = '') {
    return [
      'Next Being Lab　仕事の分かれ道　' + story.number + '｜2026年11月25日版',
      story.title, story.provenance, story.opening, story.question,
      ...(!personal ? [
        '配役と台詞', ...story.voices.map((v) => v.role + '\n「' + v.line + '」\n' + v.ask),
        '読み合わせの進め方（15分）', ...discussion,
        '比べる案と二通りの条件',
        ...story.routes.map((r) => r.label + '\n・' + story.conditions[0] + '　' + r.next + '\n・' + story.conditions[1] + '　' + r.change),
      ] : [story.voices[voice].role + 'の席から\n' + story.voices[voice].ask]),
      ...(personal || includeChoice ? ['今回考えた条件　' + story.conditions[condition], '選んでいる案　' + choice, ...(route !== null ? [result] : [])] : []),
      ...((personal || includeNote) && note.trim() ? ['自分の別案・異論\n' + note.trim()] : []),
      '編集部の見立て\n' + story.proposal + '\n' + story.boundary,
      'この場で確かめること\n誰が決める？　　　　　\n時間・費用の手配は？　　　　　\n誰がいつ本人に返す？　　　　　\n決めずに残すことは？　　　　　',
      '台本の利用について\n' + scriptUse,
      '根拠と作品の出どころ',
      ...story.sources.map((s) => s.title + '\n' + s.note + '\n' + (relativeSource(s.href) ? origin : '') + s.href),
      'ご自身のAIで検討するときの問い\n上の出典で確かめられることと創作を分けてください。私の選んだ条件で編集部の案が成り立たない例と別案を一つずつ出し、誰に何を確かめれば選び直せるか尋ねてください。入力する資料と個人情報の範囲は自分で選べます。',
    ].join('\n\n') + '\n';
  }
  function download(personal: boolean) {
    const file = new Blob([packet(personal, window.location.origin)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nbl-' + issue + (personal ? '-my-choice.txt' : '-meeting.txt');
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setStatus(personal ? '自分用のメモを書き出しました。' : '三役の台本を書き出しました。');
  }
  return (
    <article className={styles.edition}>
      <div className={styles.mast}>
        <Link href={base}><ArrowLeft size={15} aria-hidden="true" /> 編集室の表紙へ</Link>
        <span>仕事の分かれ道　／　{story.number}</span>
      </div>
      <header className={styles.cover} id="scene">
        <div>
          <p className={styles.series}>仕事の分かれ道 <span>{story.number}</span></p>
          <h1>{story.title}</h1>
          <p className={styles.opening}>{story.opening}</p>
          <a className={styles.inkLink} href="#fork">分かれ道を試す <ArrowRight size={16} aria-hidden="true" /></a>
          <a className={styles.simpleLink} href="#meeting">会議で上演する</a>
        </div>
        <figure><img src={story.cover} alt={story.alt} /><figcaption>{story.provenance}</figcaption></figure>
      </header>
      <section id="fork" className={styles.desk}>
        <h2>{story.question}</h2>
        <div className={styles.columns}>
          <div className={styles.voice}>
            <h3>席を替えて、話を聞く</h3>
            <div className={styles.tabs} role="group" aria-label="読む役を選ぶ">
              {story.voices.map((v, i) =>
                <button key={v.role} type="button" aria-pressed={voice === i} onClick={() => setVoice(i)}>{v.role}</button>
              )}
            </div>
            <div aria-live="polite">
              <p className={styles.dialogue}>「{story.voices[voice].line}」</p>
              <p>{story.voices[voice].ask}</p>
            </div>
          </div>
          <div className={styles.branch}>
            <fieldset><legend>この場面で試したい案</legend>
              {story.routes.map((r, i) => <label key={r.label}><input type="radio" name="fork-route" checked={route === i} onChange={() => {setRoute(i); setIncludeChoice(false);}} />{r.label}</label>)}
              <label><input type="radio" name="fork-route" checked={route === story.routes.length} onChange={() => {setRoute(story.routes.length); setIncludeChoice(false);}} />自分で別案を出す</label>
            </fieldset>
            <label className={styles.condition}>条件を変えて読み直す
              <select value={String(condition)} onChange={(e) => {setChanged(e.target.value === '1'); setIncludeChoice(false);}}>
                {story.conditions.map((c, i) => <option key={c} value={i}>{c}</option>)}
              </select>
            </label>
            <div className={styles.result} aria-live="polite">
              <strong>{route === null ? '選ぶ前に' : choice}</strong>
              <p>{route === null ? '上の案を一つ選ぶと、その場合に誰の返事や手配が要るかを読めます。選び直しは何度でもできます。' : result}</p>
            </div>
          </div>
        </div>
        <div className={styles.memo}>
          <label htmlFor="fork-note">私ならどうする？</label>
          <p>編集部の案への異論、まだ決めたくない理由も書けます。入力はこの画面を離れると消えます。</p>
          <textarea id="fork-note" rows={3} maxLength={4000} value={note} onChange={(e) => {setNote(e.target.value); setIncludeNote(false); setStatus('');}} />
          <button type="button" className={styles.paperButton} onClick={() => download(true)}><Download size={16} aria-hidden="true" /> 自分用のメモを保存（TXT）</button>
        </div>
      </section>
      <section id="meeting" className={styles.meeting}>
        <div className={styles.meetingTitle}><p className={styles.series}>進行役の方へ</p><h2>会議で上演する</h2><p>15分、三つの席と一つの場面。台詞は読み上げても、紙で読んでも進められます。役は交代自由です。</p></div>
        <div><ol>{discussion.map((line) => <li key={line}><strong>{line.split('｜')[0]}</strong><span>{line.split('｜')[1]}</span></li>)}</ol>
          <p>台本には三人の台詞、条件別の案、根拠、会議の記入欄、自分のAIで問い直すための一問が入ります。</p>
          <details><summary>この台本を会議や授業で使うとき</summary><p>{scriptUse} <Link href={base + '/about-boundary#script-terms'}>利用条件を見る</Link></p></details>
          <label className={styles.permission}><input type="checkbox" checked={includeChoice} onChange={(e) => setIncludeChoice(e.target.checked)} />私が試した条件と案も会議用の台本に含める</label>
          {note.trim() && <label className={styles.permission}><input type="checkbox" checked={includeNote} onChange={(e) => setIncludeNote(e.target.checked)} />私の自由記入も会議用の台本に含める</label>}
          <div className={styles.actions}>
            <button type="button" onClick={() => download(false)}><Download size={16} aria-hidden="true" /> 台本を保存（TXT）</button>
            <button type="button" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> 台本を印刷</button>
          </div>
          <p className={styles.status} role="status">{status}</p>
        </div>
      </section>
      <section id="responses" className={styles.notes}>
        <div><p className={styles.series}>編集ノート</p><h2>この案が合わないとしたら</h2>
          <p>{story.proposal}</p><p>{story.boundary}</p>
          <details><summary>出典と、編集で変えたところ</summary>
            <p>{issue === 'inspection' ? '仮想フォーラムでは本人からの問いを受け、次の役割を断っても元の注文を守る案が加わりました。本作でも、通常分の数量・単価を残す判断を独立の選択にしました。' : '事業所報告をこの作品にする際、教え続けたいという希望を本人に割り当てず、入力に集中する案を加えました。過去の貢献を評価することは、次の指導役を引き受ける条件にしていません。'}</p>
            <ul>{story.sources.map((s) => <li key={s.href}><a href={s.href}>{s.title}</a><p>{s.note}</p></li>)}</ul>
          </details>
          <p className={styles.readerAsk}>{story.reply}</p>
          <p>別の条件で答えが変わったら、違った条件と読み直したい箇所をメモに残せます。編集部へ伝える場合は、運営案内から出典・訂正の連絡先を確認できます。</p>
          <Link href={base + '/about-boundary#edition-corrections'}>出典・訂正の連絡先 <ArrowRight size={15} /></Link>
        </div>
        <aside><h3>自分の場に持ち込む</h3>
          <Link href={base + '/case-readings?case=role-evaluation-growth#decision-note'}>面談の前に、自分だけの別案を残す</Link>
          <Link href={base + '/work-design-views-guide?system=' + (issue === 'ict' ? 'WDG2-09' : 'WDG2-08') + '#guide-detail'}>{issue === 'ict' ? '担当時間と評価を勤務表に反映する' : '仕事を抜ける人の時間と分担を組み直す'}</Link>
          <Link href={supportToolHref(issue === 'ict' ? 'employer' : 'network')}>勤務や費用が決まらないとき、機関の議案をつくる</Link>
          <Link href={base + '/projects#project-inquiry'}>自分たちの題材で研修をつくる</Link>
          <Link className={styles.next} href={base + '/edition-' + other}>{workForkIssues[other].number}を読む<br />{workForkIssues[other].title} →</Link>
        </aside>
      </section>
      <div className={styles.printPacket} data-meeting-handout>
        <h2>仕事の分かれ道　会議用台本</h2>
        {packet(false, origin).trimEnd().split('\n\n').map((block, index) => {
          const [lead, ...body] = block.split('\n');
          return (
            <div className={styles.printBlock} key={index}>
              {body.length || block.length < 32 ? <strong>{lead}</strong> : <span>{lead}</span>}
              {body.length > 0 && <p>{body.join('\n')}</p>}
            </div>
          );
        })}
      </div>
    </article>
  );
}
