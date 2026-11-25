import { useState } from 'react';
import Link from 'next/link';

const subjects = ['議題を提案する', '本人の別案を加える', '資料や道具の修正を提案する'] as const;
const email = 'info@nextbeinglab.org';
const mailto = `mailto:${email}?subject=${encodeURIComponent('NBLサイトへの提案')}`;
const repository = 'https://github.com/yharunaQ/nbl-site';
const publicProposalTitle = '[NBL提案] ';
const publicProposalTemplate = [
  '### 対象の資料・版・箇所',
  '',
  '### 議題・別案・修正の提案',
  '',
  '### 理由・出典・試す条件（任意）',
  '',
  '公開してよい情報だけで書いてください。個人を特定できる情報や内部資料の転載は避けてください。',
  '',
  '[NBLの公開の議論と改善提案](https://nextbeinglab.org/public-collaboration#updates)',
].join('\n');
const newIssue = `${repository}/issues/new?title=${encodeURIComponent(publicProposalTitle)}&body=${encodeURIComponent(publicProposalTemplate)}`;
const proposalIssues = `${repository}/issues?q=${encodeURIComponent('is:issue in:title "[NBL提案]"')}`;

export default function AxiomPublicCollaboration({ basePath = '' }: { basePath?: string }) {
  const [subject, setSubject] = useState<(typeof subjects)[number]>(subjects[0]);
  const [target, setTarget] = useState('');
  const [proposal, setProposal] = useState('');
  const [basis, setBasis] = useState('');
  const [status, setStatus] = useState('');
  const draft = [
    subject,
    `対象の資料・版・箇所：${target.trim() || '（未記入）'}`,
    `提案：${proposal.trim() || '（未記入）'}`,
    `理由・出典・試す条件：${basis.trim() || '（未記入）'}`,
    'サイトへの掲載を希望する範囲と表記名は、編集部から相談があったときに決めます。',
  ].join('\n\n');

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus('控えをコピーしました。メールや会議の資料に貼り付けられます。');
    } catch {
      setStatus('コピーできない場合は、下の控えを選択してコピーできます。');
    }
  }

  function downloadDraft() {
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nbl-proposal.txt';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('提案の控えをテキスト形式で書き出しました。');
  }

  const fieldClass = 'mt-2 block w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-base text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800';
  const actionClass = 'inline-flex min-h-11 items-center rounded-lg border border-teal-800 px-4 py-2 font-semibold text-teal-950 hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800';
  const linkClass = 'font-semibold text-teal-900 underline decoration-teal-600 underline-offset-4 hover:text-teal-700';

  return (
    <div className="min-h-screen bg-[#faf9f4] text-slate-950">
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <Link href={basePath || '/'} className={linkClass}>NBLの表紙へ</Link>
        <header className="max-w-3xl border-b border-slate-300 pb-8 pt-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">公開の議論と改善提案</h1>
          <p className="mt-5 text-lg leading-8">
            「この条件なら別の仕事を選びたい」「実際の職場ではこの手順が使えた」「この出典からはそこまで言えない」。
            資料のどこを、なぜ変えたいかを書き、公開で話し合ったり、NBL編集部に伝えたりできます。
          </p>
          <nav aria-label="ページ内の案内" className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <a className={linkClass} href="#proposal">提案をまとめる</a>
            <a className={linkClass} href="#discussion">論点と対話先</a>
            <a className={linkClass} href="#updates">検討状況と更新</a>
          </nav>
        </header>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section id="proposal" aria-labelledby="proposal-title" className="min-w-0 rounded-xl border border-slate-300 bg-white p-5 sm:p-7">
            <h2 id="proposal-title" className="text-2xl font-bold">提案をまとめる</h2>
            <p className="mt-3 leading-7" id="proposal-help">
              公開してよい内容だけを下書きに使ってください。個人が特定できる相談記録や勤務先の内部資料は手元に置き、条件や論点だけを書きます。
              控えは自分で保存できます。共有するときは、送る先と本文をご自身で確認してください。
            </p>
            <div className="mt-5 space-y-4">
              <label className="block font-semibold">提案の種類
                <select className={fieldClass} value={subject} onChange={(event) => setSubject(subjects.find((item) => item === event.target.value) ?? subjects[0])}>
                  {subjects.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="block font-semibold">対象の資料・版・箇所
                <input className={fieldClass} value={target} onChange={(event) => setTarget(event.target.value)} placeholder="資料名やURL、見出しなど" />
              </label>
              <label className="block font-semibold">提案
                <textarea className={fieldClass} rows={3} value={proposal} onChange={(event) => setProposal(event.target.value)} aria-describedby="proposal-help" />
              </label>
              <label className="block font-semibold">理由・出典・試す条件（任意）
                <textarea className={fieldClass} rows={3} value={basis} onChange={(event) => setBasis(event.target.value)} />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className={actionClass} onClick={copyDraft}>控えをコピー</button>
              <button type="button" className={actionClass} onClick={downloadDraft}>テキストで保存</button>
            </div>
            <p role="status" className="mt-2 min-h-6 text-sm text-teal-950">{status}</p>
            <details className="mt-3">
              <summary className="cursor-pointer font-semibold text-teal-950">控えの本文を見る</summary>
              <label className="mt-3 block text-sm font-semibold">コピーまたは記入に使える本文
                <textarea readOnly className={fieldClass} value={draft} rows={8} />
              </label>
            </details>
            <div className="mt-6 border-t border-slate-200 pt-5">
              <a href={mailto} className={actionClass}>編集部宛てのメールを開く</a>
              <p className="mt-2 text-sm leading-6">宛先は {email} です。控えから送る内容を選んで貼り付けます。</p>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-5">
              <a href={newIssue} className={actionClass}>GitHubで公開提案を書く</a>
              <p className="mt-2 text-sm leading-6">
                投稿にはGitHubアカウントが必要で、本文とアカウント名は誰でも読めます。
                空欄のひな形が開きます。控えから公開する部分だけを選び、内容を確かめて投稿してください。
              </p>
            </div>
          </section>
          <div className="min-w-0 space-y-6">
            <section id="discussion" aria-labelledby="discussion-title" className="rounded-xl border border-slate-300 p-5 sm:p-7">
              <h2 id="discussion-title" className="text-2xl font-bold">論点と対話先</h2>
              <p className="mt-3 leading-7">たとえば、家族の送迎を使えない人が夕方の仕事を選ぶには、迎えの担当と費用を誰が決められるでしょうか。別の時間帯、交通の手段、地域で分担する案のどこまで試せそうかを話せます。</p>
              <ul className="mt-4 space-y-3">
                <li><Link className={linkClass} href="/events/work-choice-forum">働く場を、選び直せるか</Link><span className="block text-sm leading-6">講演・討議・宣言を読めるNBLの創作フォーラム</span></li>
                <li><Link className={linkClass} href="/events/work-condition-forum">働ける条件を設計する</Link><span className="block text-sm leading-6">講演と原典から論点を探す</span></li>
                <li><a className={linkClass} href="https://x.com/NBL_workdesign">XのNBL｜仕事条件デザイン</a><span className="block text-sm leading-6">公開投稿への返信で、一つの問いや異論を伝える</span></li>
              </ul>
            </section>
            <section id="updates" aria-labelledby="updates-title" className="rounded-xl border border-slate-300 p-5 sm:p-7">
              <h2 id="updates-title" className="text-2xl font-bold">検討状況と更新</h2>
              <p className="mt-3 leading-7">
                編集部は対象箇所と理由を照合し、修正、条件を確かめてから再検討、見送りを判断します。
                公開できる経過は、掲載する範囲と表記名を本人に確かめたうえで、判断の理由と対象資料へのリンクをここに記します。
              </p>
              <p className="mt-3 leading-7">外部から寄せられた提案の採否は、まだ掲載していません。</p>
              <ul className="mt-4 space-y-3">
                <li><a className={linkClass} href={proposalIssues}>GitHubの提案一覧を開く</a><span className="block text-sm leading-6">理由や異論は各Issueで読み返せます。条件が変わったときは、再検討の理由を元の提案に書き添えられます。</span></li>
                <li><a className={linkClass} href={`${repository}/pulls?q=is%3Apr`}>GitHubの変更案と改訂を開く</a><span className="block text-sm leading-6">関連する変更案がある場合は、採否と差分を確認できます。取り込み済みの変更は「Merged」と表示されます。</span></li>
              </ul>
              <article className="mt-5 border-l-4 border-teal-800 pl-4">
                <h3 className="font-bold">2026年11月25日　校正の仕事をめぐる三つの道具</h3>
                <p className="mt-2 leading-7">帰りの介助が決まらないとき、返事を待つほかに、募集が始まれば希望の勤務のまま応募する選択も書き加えました。職場と支援機関には、未確定の条件と次の返答日を示す仕事が残ります。</p>
                <Link className={linkClass} href={`${basePath}/case-readings#proofreading-example`}>改訂した相談事例を読む</Link>
              </article>
              <p className="mt-4 leading-7">提案と対象ページのURLを控えておくと、更新後に元の箇所と見比べられます。</p>
              <ul className="mt-4 space-y-3">
                <li><Link className={linkClass} href={`${basePath}/case-readings`}>相談事例へ</Link></li>
                <li><Link className={linkClass} href={`${basePath}/work-design-views-guide`}>仕事設計ガイドへ</Link></li>
                <li><Link className={linkClass} href={`${basePath}/support-organization-checklist`}>支援実践・体制改善ツールへ</Link></li>
                <li><Link className={linkClass} href="/contact">連携・お問い合わせ</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
