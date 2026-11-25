import { useEffect, useId, useState, type MouseEvent } from 'react';
import decisionStyles from './FlagshipDecisionNote.module.css';

const decisionNoteEdition = 'NBL 持ち帰りメモ 2026-11-25';

const forms = {
  case: {
    title: '自分の選択を考えるメモ',
    introduction: '一人で整理する、相談で使う、話さずに保留する。必要な欄から使えます。',
    fields: [
      ['残したい仕事・生活', '続けたい役割、守りたい時間、今のやり方で助かっていること。'],
      ['今ある案と気になること', '誰からどんな案が出たか。受けると何が変わり、何が残るか。'],
      ['私から出したい別案', '仕事の内容・量・時間を一つ変えるとしたら。誰に何を頼めるか。'],
      ['断る・保留する条件', '決める前に聞きたいこと、困ったときの合図、元に戻す条件。'],
      ['話す相手と範囲', '自分が選んだ相手に、仕事の条件のうち何を伝えるか。'],
      ['次に選び直す日', '返事がほしい日、やってみて振り返る日。見直しのときに比べたいこと。'],
    ],
  },
  work: {
    title: '現場会議に持ち込む仕事設計メモ',
    introduction: '一つの工程を選び、現行と変更案を並べます。本人の希望と、管理者が手配する時間を確認してください。',
    fields: [
      ['現在の工程・量・困りごと', '求人の有無、既存業務の担当、時間帯、件数や締切。仕事を新たに組めそうな工程はどこか。'],
      ['提案する工程と仕事量', '残す工程、減らす・移す工程、誰がどこまで担当するか。本人の別案と違う場合はその理由も。'],
      ['勤務・交代・育成の手配', '指導や応援の有給時間、外す既存業務、欠員時の代行と責任者。'],
      ['役割・評価・対価', '新しい貢献をどう確認するか。仕事量・等級・賃金に影響する場合、誰が決めるか。'],
      ['試行の決裁と見直し', '本人が選べる試行期間、品質と負担を見る日、止める条件、元に戻す手順。'],
    ],
  },
  support: {
    title: '機関・地域の会議に持ち込む体制改善メモ',
    introduction: '支援が必要な日から逆算し、実際に配置する勤務、その費用を決める人、未決の場合の対応を記入します。',
    fields: [
      ['届けたい支援と期限', '本人・職場が必要とする機能、必要な日、現在の対象・待機・引受けの空白。'],
      ['有償の勤務と代行', '自機関が決められる人数・勤務時間・代行。訪問や同行を担当する人と指導者、練習から現場へ移る条件。'],
      ['費用と支払の分担', '訪問・調整・育成と、直接提供する支援を別々に見積もる。有償時間×単価、移動、代替要員と承認者。'],
      ['機関間の受渡しと本人への返答', '引受けの返事をする相手、期限、本人が共有を選んだ事項。'],
      ['未決・不承認時の代案', 'いつ誰が代替手配を決めるか。本人が辞退・再選択した場合の継続支援と、費用の再検討日。'],
    ],
  },
} as const;

type Props = {
  kind: keyof typeof forms;
  contextId: string;
  contextTitle: string;
  question: string;
  sourceHref: string;
  references?: readonly { label: string; href: string }[];
  publicContext?: readonly string[];
};

export default function FlagshipDecisionNote(props: Props) {
  return <DecisionNote key={`${props.kind}:${props.contextId}`} {...props} />;
}

function DecisionNote({ kind, contextId, contextTitle, question, sourceHref, references = [], publicContext = [] }: Props) {
  const form = forms[kind];
  const id = useId();
  const storageKey = `nbl:next-site:decision-note:v1:${kind}:${contextId}`;
  const [values, setValues] = useState<string[]>([]);
  const [shared, setShared] = useState<boolean[]>([]);
  const [origin, setOrigin] = useState('');
  const [ready, setReady] = useState(false);
  const [stored, setStored] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved: { values?: unknown } | null = JSON.parse(raw);
        if (!saved || !Array.isArray(saved.values)) {
          throw new Error('Invalid saved draft');
        }
        setValues(saved.values.slice(0, form.fields.length).map((value) =>
          typeof value === 'string' ? value.slice(0, 3000) : '',
        ));
        // Disclosure is chosen again on reopening, including on a shared device.
        setStored(true);
        setMessage('このブラウザに保存した下書きを開きました。');
      }
    } catch {
      setMessage('保存を読み込めませんでした。入力とファイルの書き出しは使えます。');
    }
    setReady(true);
  }, [storageKey, form.fields.length]);

  const selected = form.fields.flatMap(([label], index) =>
    shared[index] && values[index]?.trim() ? [[label, values[index].trim()]] : [],
  );
  const referenceText = [
    form.title,
    decisionNoteEdition,
    `参照した題材　${contextTitle}`,
    `題材で確かめること\n${question}`,
    ...references.map(({ label, href }) => `${label} ${href.startsWith('/') ? origin + href : href}`),
  ].join('\n\n');
  const shareText = selected.length ? [
    referenceText,
    ...selected.map(([label, value]) => `${label}\n${value}`),
  ].join('\n\n') : '';
  const blankText = [referenceText, ...form.fields.map(([label, hint]) => `${label}\n${hint}\n\n____________________________________`)].join('\n\n');
  const aiPrompt = `${[referenceText, ...publicContext].join('\n\n')}\n\nこの題材の観察・不明点・提案を分けてください。記入欄に沿って、別の案、今は決めない案、判断が変わる条件を検討してください。本人が選ぶことと、職場や支援機関が勤務・費用として決めることを分けてください。\n\n${form.fields.map(([label, hint]) => `${label}　${hint}`).join('\n')}`;

  function update(index: number, value: string) {
    setValues((previous) => Object.assign([...previous], { [index]: value }));
    toggleShare(index, false);
    setMessage(stored ? '未保存の変更があります。' : '');
  }

  function toggleShare(index: number, checked: boolean) {
    setShared((previous) => Object.assign([...previous], { [index]: checked }));
  }

  function saveHere() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ values }));
      setStored(true);
      setMessage('このブラウザに保存しました。この題材を開くと再開できます。');
    } catch {
      setMessage('このブラウザに保存できませんでした。残したい項目を選び、ファイルに保存できます。');
    }
  }

  function removeSaved() {
    try {
      window.localStorage.removeItem(storageKey);
      setStored(false);
      setMessage('この題材の端末内保存を削除しました。画面上の入力は開いている間使えます。');
    } catch {
      setMessage('保存を削除できませんでした。ブラウザのサイトデータを確認してください。');
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('テキストをコピーしました。');
    } catch {
      setMessage('自動でコピーできませんでした。下のテキスト欄から選んでコピーできます。');
    }
  }

  function print(text: string) {
    const frame = document.createElement('iframe');
    frame.title = '持ち帰り用の印刷';
    frame.className = decisionStyles.printFrame;
    const host = document.body;
    host.appendChild(frame);
    const printWindow = frame.contentWindow;
    if (!printWindow) {
      frame.remove();
      setMessage('印刷を開けませんでした。テキストを保存して印刷できます。');
      return;
    }
    const printDocument = printWindow.document;
    printDocument.documentElement.lang = 'ja';
    printDocument.title = form.title;
    const page = printDocument.createElement('div');
    page.style.cssText = 'white-space: pre-wrap; overflow-wrap: anywhere; font: 11pt/1.5 sans-serif; margin: 1cm';
    page.textContent = text;
    printDocument.body.appendChild(page);
    printWindow.addEventListener('afterprint', () => frame.remove(), { once: true });
    printWindow.focus();
    printWindow.print();
  }

  function download(text: string) {
    const url = URL.createObjectURL(new Blob([text + '\n'], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `nbl-${kind}-memo.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function readSource(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const section = document.getElementById(event.currentTarget.hash.slice(1));
    if (!section) return;
    event.preventDefault();
    const heading = section.querySelector<HTMLElement>('h2, h3');
    if (heading) {
      if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    section.scrollIntoView({ block: 'start' });
  }

  return (
    <section className={decisionStyles.note} aria-labelledby={id}>
      <h3 id={id}>{form.title}</h3>
      <p>{form.introduction}</p>
      <p className={decisionStyles.context}><a href={sourceHref} onClick={readSource}>{contextTitle}</a></p>
      {references.length > 0 && (
        <details className={decisionStyles.references}>
          <summary>参照した本文・版</summary>
          <p>{decisionNoteEdition}</p>
          <ul>{references.map(({ label, href }) => <li key={`${href}-${label}`}><a href={href}>{label}</a></li>)}</ul>
        </details>
      )}
      <p className={decisionStyles.help}>
        入力は送信されません。画面を移る前に、残したい内容をご自身で保存してください。共有する端末では、個人名や病状などの記入・ブラウザへの保存を避けてください。
      </p>
      <div className={decisionStyles.fields}>
        {form.fields.map(([label, hint], index) => (
          <div key={label}>
            <label htmlFor={`${id}-${index}`}><strong>{label}</strong></label>
            <p id={`${id}-hint-${index}`}>{hint}</p>
            <textarea id={`${id}-${index}`} aria-describedby={`${id}-hint-${index}`} rows={2} maxLength={3000}
              value={values[index] ?? ''} onChange={(event) => update(index, event.currentTarget.value)} />
          </div>
        ))}
      </div>
      <div className={decisionStyles.actions}>
        <button type="button" onClick={saveHere} disabled={!ready || !values.some((value) => value?.trim())}>このブラウザに下書きを保存</button>
        {stored && <button type="button" onClick={removeSaved}>端末内の下書きを削除</button>}
      </div>
      <details className={decisionStyles.share}>
        <summary>持ち帰る項目を選ぶ</summary>
        <p>必要な項目を選び、下の本文を確認してください。選んだ項目と題材・問い・出典が入ります。一つの欄に共有したくない情報があれば、選ぶ前に内容を直してください。</p>
        <fieldset>
          <legend>ファイルに含める項目</legend>
          {form.fields.map(([label], index) => (
            <label key={label}>
              <input type="checkbox" disabled={!values[index]?.trim()}
                checked={Boolean(shared[index] && values[index]?.trim())}
                onChange={(event) => toggleShare(index, event.currentTarget.checked)} />
              {label}
            </label>
          ))}
        </fieldset>
        {shareText && <textarea aria-label="持ち帰り用テキスト" readOnly value={shareText} rows={7} />}
        <div className={decisionStyles.actions}>
          <button type="button" onClick={() => download(shareText)} disabled={!shareText}>選んだ内容を保存（txt）</button>
          <button type="button" onClick={() => copy(shareText)} disabled={!shareText}>選んだ内容をコピー</button>
          <button type="button" onClick={() => print(shareText)} disabled={!shareText}>選んだ内容を印刷</button>
        </div>
      </details>
      <details className={decisionStyles.share}>
        <summary>紙で書く・自分のAIで考える</summary>
        <p>どちらにもあなたの入力は入りません。</p>
        <div className={decisionStyles.actions}>
          <button type="button" onClick={() => print(blankText)}>空欄の用紙を印刷</button>
          <button type="button" onClick={() => download(blankText)}>空欄の用紙を保存（txt）</button>
          <button type="button" onClick={() => copy(aiPrompt)}>自分のAIに渡す問いをコピー</button>
        </div>
        <textarea aria-label="自分のAIに渡す問い" readOnly value={aiPrompt} rows={5} />
      </details>
      <p className={decisionStyles.help} role="status">{message}</p>
    </section>
  );
}
