import { useEffect, useState } from 'react';
import { AxiomNextSiteLink as Link, useNextSiteHref } from './AxiomNextSiteLinks';
import {
  practiceWorkbooks,
  resolveWorkbookId,
  practiceWorkbookMarkdown,
  workbookHref,
  type WorkbookDrafts,
  type WorkbookId,
} from './practiceWorkbook';

export default function AxiomPracticeWorkbook() {
  const nextSiteHref = useNextSiteHref();
  const [active, setActive] = useState<WorkbookId>('book1');
  const [drafts, setDrafts] = useState<WorkbookDrafts>({});
  const [saved, setSaved] = useState(false);
  const book = practiceWorkbooks.find((item) => item.id === active)!;
  useEffect(() => {
    const read = () =>
      setActive(resolveWorkbookId(new URLSearchParams(window.location.search).get('form')));
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);
  function choose(id: WorkbookId) {
    setActive(id);
    window.history.replaceState(null, '', nextSiteHref(workbookHref(id)));
  }
  function update(field: string, value: string) {
    setDrafts((previous) => ({ ...previous, [active]: { ...previous[active], [field]: value } }));
    setSaved(false);
  }
  function save() {
    const url = URL.createObjectURL(
      new Blob([practiceWorkbookMarkdown(drafts)], { type: 'text/markdown;charset=utf-8' }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'nbl-practice-workbook.md';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  }
  return (
    <main className="workbook">
      <div className="screen">
        <header>
          <p className="eyebrow">NBL / 考えたことを、次の打合せへ</p>
          <h1>会議用ワークブック</h1>
          <p>
            教科書の三様式を短く使う版と、機関の機能・勤務・費用を見直す一枚です。必要な欄だけ使えます。記入を支援や就業への条件にしません。
          </p>
          <p>
            障害のある人が、必要な支援とともに望む仕事と生活を選べるように。比較する仕事の条件と、実行する担当・権限・有償時間・費用をつなぎます。必要な準備・生活・健康支援を維持し、本人が選ぶ順序で考えます。
          </p>
        </header>
        <nav aria-label="会議用様式を選ぶ">
          {practiceWorkbooks.map((item, index) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={active === item.id}
              onClick={() => choose(item.id)}
            >
              <small>様式 {index + 1}</small>
              {item.title}
            </button>
          ))}
        </nav>
        <section id="workbook-form" aria-labelledby="workbook-title">
          <h2 id="workbook-title">{book.title}</h2>
          <p>{book.purpose}</p>
          <p id="workbook-privacy" className="notice">
            入力はこの画面内だけで扱い、送信・自動保存しません。様式を切り替えても下書きは残りますが、再読込・ページ移動で消えます。個人名や病状の詳細は書かず、共有範囲・保存先は本人と関係者が選んでください。
          </p>
          {book.fields.map((field) => (
            <div className="field" key={`${active}-${field.id}`}>
              <label htmlFor={`${active}-${field.id}`}>
                <strong>{field.label}</strong>
              </label>
              <span id={`${active}-${field.id}-hint`}>{field.hint}</span>
              <textarea
                id={`${active}-${field.id}`}
                aria-describedby={`${active}-${field.id}-hint workbook-privacy`}
                rows={3}
                maxLength={3000}
                value={drafts[active]?.[field.id] ?? ''}
                onChange={(event) => update(field.id, event.target.value)}
              />
            </div>
          ))}
          <details className="example">
            <summary>架空の記入例を別に読む（入力は変わりません）</summary>
            <p>学習用の架空例です。実在事例、成功実績、承認済みの実施案ではありません。</p>
            {book.fields.map((field) => (
              <div key={field.id}>
                <h3>{field.label}</h3>
                <p>{book.example[field.id]}</p>
              </div>
            ))}
          </details>
        </section>
        <div className="actions">
          <button type="button" onClick={save}>
            四様式の入力を保存（md）
          </button>
          <button type="button" onClick={() => window.print()}>
            四様式の入力を印刷
          </button>
        </div>
        <p role="status">
          {saved
            ? '保存操作を行いました。保存先のファイルを確認してください。'
            : '架空例は保存・印刷する入力に含めません。未記入の欄は未記入と示します。'}
        </p>
        <p>
          結果が得られたら、
          <button className="textButton" type="button" onClick={() => choose('book3')}>
            結果と再判断へ進む
          </button>
          。本人の保留・変更と各担当の権限を残します。
        </p>
        <footer>
          <Link href="/preview/axiom-next-nbl-v2/case-readings">相談事例へ</Link>
          <Link href="/preview/axiom-next-nbl-v2/work-design-views-guide">仕事設計ガイドへ</Link>
          <Link href="/preview/axiom-next-nbl-v2/support-organization-checklist">
            実践・体制改善ツールへ
          </Link>
        </footer>
      </div>
      <section className="print" aria-hidden="true">
        <pre>{practiceWorkbookMarkdown(drafts)}</pre>
      </section>
      <style jsx>{`
        .workbook {
          max-width: 960px;
          margin: 0 auto;
          padding: 36px 24px 64px;
          color: #19313a;
          font-family: inherit;
          line-height: 1.8;
        }
        .eyebrow {
          color: #3e6777;
          font-size: 14px;
        }
        h1 {
          font-size: 32px;
          line-height: 1.35;
        }
        h2 {
          font-size: 24px;
        }
        h3 {
          font-size: 16px;
        }
        nav {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin: 26px 0;
        }
        button {
          font: inherit;
          cursor: pointer;
          border: 1px solid #b8ced4;
          border-radius: 8px;
          background: #f2f7f7;
          color: #19313a;
          padding: 12px 16px;
        }
        nav button {
          text-align: left;
        }
        nav small {
          display: block;
          color: #436877;
        }
        nav button[aria-pressed='true'] {
          border: 2px solid #286379;
          background: #e7f1f4;
        }
        section {
          scroll-margin-top: 24px;
        }
        .notice {
          padding: 16px;
          background: #f3f5ef;
          border-radius: 8px;
          font-size: 14px;
        }
        .field {
          display: block;
          margin: 24px 0;
        }
        .field strong,
        .field span {
          display: block;
        }
        .field span {
          font-size: 14px;
          color: #52656a;
          margin: 5px 0 10px;
        }
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #9fb5bd;
          border-radius: 6px;
          padding: 12px;
          font: inherit;
          background: white;
          color: #19313a;
          resize: vertical;
        }
        textarea:focus,
        button:focus-visible {
          outline: 3px solid #65a1b7;
          outline-offset: 3px;
        }
        .example {
          padding: 18px;
          border: 1px solid #ccdadd;
          border-radius: 8px;
          background: #fafbf9;
        }
        summary {
          cursor: pointer;
          font-weight: 600;
        }
        .actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }
        .textButton {
          border: 0;
          padding: 0;
          text-decoration: underline;
          background: transparent;
        }
        footer {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-top: 32px;
        }
        .print {
          display: none;
        }
        @media (max-width: 540px) {
          .workbook {
            padding: 24px 16px;
          }
          nav {
            grid-template-columns: 1fr;
          }
          h1 {
            font-size: 27px;
          }
        }
        @media print {
          .screen {
            display: none;
          }
          .print {
            display: block;
          }
          .workbook {
            max-width: none;
            margin: 0;
            padding: 0;
          }
          .print pre {
            white-space: pre-wrap;
            overflow-wrap: anywhere;
            font: 12pt/1.6 sans-serif;
          }
        }
      `}</style>
    </main>
  );
}
