import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const outDir = path.join(
  repoRoot,
  "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
);

const sourceContentPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-book-content-v0-2026-05-26.json"
);
const contentPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-scene5-prototype-content-v0-2026-05-26.json"
);
const htmlPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-scene5-prototype-v0-2026-05-26.html"
);
const manifestPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-scene5-prototype-manifest-v0-2026-05-26.md"
);

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const sourceContent = JSON.parse(await fs.readFile(sourceContentPath, "utf8"));
const sourceCards = new Map(sourceContent.patterns.map((pattern) => [pattern.n, pattern]));

const cards = [13, 15, 17, 18].map((n) => {
  const source = sourceCards.get(n);
  if (!source) {
    throw new Error(`Missing source pattern ${n}`);
  }
  const additions = {
    13: {
      role: "橋渡しカード",
      plainTitle: "情報が、使える手順になっているか",
      alternate:
        "本人が聞いていないのではなく、非公式な変更、会議中の補足、口頭だけの注意が、作業手順へ変換されていない可能性がある。",
      sourceLens: [
        "本人: 公式資料どおり作業しているのに、周囲とズレる。",
        "上司/HR: 説明したはずなのに、同じ確認が繰り返される。",
        "支援者: 情報共有はあるが、本人が使える手順になっていない。",
        "観察可能条件: 変更履歴、会議決定、口頭補足、確認先、手順書の更新頻度。",
      ],
      connected: "第4章の翻訳橋と、第5章の職場断面図をつなぐ。",
    },
    15: {
      role: "主カード",
      plainTitle: "作業の接点を、本人評価の前に見る",
      alternate:
        "作業が遅いのではなく、道具配置、座席、画面、姿勢、確認場所が余分な移動や疲労を作っている可能性がある。",
      sourceLens: [
        "本人: 一つ一つの作業は分かるが、続けると消耗する。",
        "上司/HR: 作業速度や正確性にばらつきがある。",
        "支援者: 作業分析なしに本人側の課題として読まれている。",
        "観察可能条件: 座席、道具、動線、姿勢、画面位置、確認回数。",
      ],
      connected: "情報アクセスや指示負荷と一緒に見る。",
    },
    17: {
      role: "主カード",
      plainTitle: "会議・文書・音声・ICTへのアクセスを見る",
      alternate:
        "理解力の問題ではなく、重要情報が音声、雑談、画面、資料、通知に分散し、本人が同じ情報面に立てていない可能性がある。",
      sourceLens: [
        "本人: 後から知る情報が多く、参加していても置いていかれる。",
        "上司/HR: 必要資料は共有済みだと考えている。",
        "支援者: 情報形式と参加の関係が支援課題として扱われていない。",
        "観察可能条件: 会議資料、議事録、音声情報、チャット、ICT権限、非公式決定。",
      ],
      connected: "情報形式から手順への変換、評価の見え方へ接続する。",
    },
    18: {
      role: "主カード",
      plainTitle: "指示・切替・記憶負荷を仕事設計として見る",
      alternate:
        "注意不足や理解不足ではなく、開始条件、優先順位、完了基準、割り込み、確認回路が曖昧な可能性がある。",
      sourceLens: [
        "本人: 何から始めるか、いつ完了か、途中変更時に迷う。",
        "上司/HR: 一度説明したことを覚えていないように見える。",
        "支援者: 記憶や切替負荷が、本人努力として処理されている。",
        "観察可能条件: 指示単位、完了条件、優先順位、割り込み、レビュー、復旧手順。",
      ],
      connected: "作業接点、情報アクセス、評価基準と一体で見る。",
    },
  };
  return { ...source, ...additions[n] };
});

const content = {
  metadata: {
    title: "第5章プロトタイプ: 作業・情報・指示の接点が整っているか",
    subtitle: "7場面導線と21視点カードを統合する完成版試験章",
    date: "2026-05-26",
    lane: "Falcon / Falcon Lab",
    status:
      "internal chapter prototype / no source validity decision / no support validity decision / no public approval / no runtime approval",
    sourcePolicy:
      "Synthetic examples only. No raw sensitive records, identifiable free text, or unapproved source quotations.",
  },
  chapter: {
    number: 5,
    title: "作業・情報・指示の接点が整っているか",
    readerPromise:
      "「ミスが多い」「指示が通らない」「ついていけない」を、本人特性や職場理解不足だけで閉じず、作業・道具・情報・指示・確認回路の接点として読み直せるようにする。",
    scene:
      "職場では、本人が何度も同じ確認をしているように見える。本人からは、会議で決まった変更が手順書に反映されず、口頭指示とチャット通知と画面上の表示がずれているように感じられる。支援者は、本人の理解力だけではなく、作業の接点と情報の流れを見たいと考えている。",
    notThis:
      "この章は、手順書を作ればよい、指示を簡単にすればよい、という支援メニューの章ではない。仕事のどこで情報が手順になり、どこで指示・切替・記憶負荷が発生し、どこで本人評価へ早く閉じているかを見る章である。",
  },
  mainDiagram: {
    title: "職場断面図と情報フロー",
    steps: ["仕事要求", "情報形式", "作業手順", "確認回路", "評価・役割"],
    contactPoints: ["道具・座席", "会議・文書・音声", "指示・切替", "戻り方"],
  },
  sourceLens: [
    {
      label: "本人の見え方",
      text: "公式資料どおり進めているつもりでも、途中で変わった条件が見えない。確認すると「また聞いている」と受け取られる。",
    },
    {
      label: "上司/HRの見え方",
      text: "説明や資料共有はしている。本人が覚えていない、応用できない、作業が遅いように見える。",
    },
    {
      label: "支援者の見え方",
      text: "本人と職場の説明が食い違っている。どちらか一方の正誤ではなく、情報が仕事手順になる経路を見たい。",
    },
    {
      label: "観察可能な仕事条件",
      text: "変更履歴、会議決定、口頭補足、チャット、座席、道具配置、完了条件、確認先、レビュー頻度。",
    },
  ],
  readerQuestions: [
    {
      role: "本人・家族",
      question:
        "自分の理解不足と感じていることの中に、情報形式、確認先、完了条件、切替の多さが混ざっていないか。",
    },
    {
      role: "就労支援者",
      question:
        "本人の言葉を、作業接点、情報形式、指示単位、確認回路として職場で扱える問いに置き換えられるか。",
    },
    {
      role: "企業人事 / 現場上司",
      question:
        "安全、品質、顧客対応、人員余力を守りながら、指示・情報・確認のどこを設計し直せるか。",
    },
    {
      role: "政策・サービス設計者",
      question:
        "支援サービスや制度情報は、職場の具体的な作業手順・評価・相談線まで届いているか。",
    },
  ],
  exercise: [
    "いま単純化されすぎている説明を一つ書く。",
    "作業、情報、指示、確認、評価のどこに別の読みがありそうか印をつける。",
    "本人、上司/HR、支援者、観察可能条件のうち、足りないsource lensを一つ選ぶ。",
    "今決めると危ない判断を一つ残す。",
    "次に聞くと状況が開く質問を一つ書く。",
  ],
  falconExample: {
    good: [
      "本人の理解力だけでなく、会議情報が作業手順へ変換される経路を確認する。",
      "作業接点、情報アクセス、指示・切替負荷、確認回路を分けて仮説化する。",
      "上司/HR、本人、支援者、観察可能な仕事条件の見え方の差を残す。",
      "必要な追加情報を質問として返し、支援妥当性や配慮判断は閉じない。",
    ],
    bad: [
      "診断名や障害種別から、必要な配慮を直接決める。",
      "手順書を作る、指示を明確にする、と支援名だけを返す。",
      "職場の不安を偏見、本人の困難を意欲や能力不足として単純化する。",
      "合理的配慮、雇用判断、個別支援妥当性をAIが最終判断する。",
    ],
  },
  scene1ToneSample: {
    title: "第1章冒頭トーンサンプル: 体調が変わっても続けられるか",
    text:
      "体調の波がある人に対して、現場では「安定して働けるか」と問いたくなる。けれども、その問いだけでは、仕事のどこで負荷が高くなり、どこに休む余地があり、どこで評価や収入と衝突しているかが見えにくい。見るべきなのは、本人の安定性だけではない。起床、通勤、作業山場、休憩、通院、回復、翌日の準備までを同じ時間地図に置き、続けるための余地を探すことである。",
  },
  cards,
  reviewChecklist: [
    "7場面主導線が保たれているか。",
    "視点13/15/17/18が支援メニューではなく、相互作用カードとして読めるか。",
    "source lens、別の読み、欠落文脈、誤読ガードが残っているか。",
    "病名・障害名から配慮へ直行していないか。",
    "Falcon出力例が、構造仮説と問いで止まっているか。",
    "境界表示がpublic approvalやsupport validityを動かしたように見えないか。",
  ],
};

function boundaryRibbon() {
  return `<div class="boundary">Internal Falcon Lab prototype / no source validity decision / no support validity decision / no public_safe-public_approved movement / no runtime_approved movement / synthetic examples only</div>`;
}

function matrixHtml() {
  const rows = [
    ["01", "02", "03", "04", "05", "06", "07"],
    ["08", "09", "10", "11", "12", "13", "14"],
    ["15", "16", "17", "18", "19", "20", "21"],
  ];
  const labels = ["体調・治療・生活時間", "入口・相談・情報共有", "仕事・評価・将来"];
  return `<div class="matrix">${rows
    .map(
      (row, rowIndex) => `<div class="matrix-row"><b>${labels[rowIndex]}</b>${row
        .map((id) => `<span class="${["13", "15", "17", "18"].includes(id) ? "hot" : ""}">${id}</span>`)
        .join("")}</div>`
    )
    .join("")}</div>`;
}

function diagramHtml() {
  return `<figure class="diagram" aria-label="職場断面図と情報フロー">
  <svg viewBox="0 0 980 520" role="img">
    <rect x="30" y="42" width="920" height="420" rx="22" fill="#faf7ef" stroke="#333" stroke-width="2"/>
    <text x="64" y="92" class="svg-title">職場断面図: 情報が仕事手順になるまで</text>
    <g class="flow">
      ${content.mainDiagram.steps
        .map((step, index) => {
          const x = 70 + index * 178;
          const colors = ["#e7f2f0", "#f1e2d2", "#fff8d9", "#e4e9ce", "#f3edf5"];
          return `<rect x="${x}" y="142" width="138" height="74" rx="16" fill="${colors[index]}" stroke="#303030" stroke-width="2"/>
            <text x="${x + 69}" y="185" text-anchor="middle" class="svg-label">${esc(step)}</text>
            ${index < 4 ? `<path d="M${x + 142} 179 L${x + 174} 179" stroke="#5f5a52" stroke-width="3" marker-end="url(#arrow)"/>` : ""}`;
        })
        .join("")}
    </g>
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#5f5a52"/>
      </marker>
    </defs>
    <g>
      <line x1="90" y1="305" x2="890" y2="305" stroke="#8b867c" stroke-width="2" stroke-dasharray="8 8"/>
      ${content.mainDiagram.contactPoints
        .map((point, index) => {
          const x = 118 + index * 214;
          return `<circle cx="${x}" cy="305" r="42" fill="#fff" stroke="#25636f" stroke-width="3"/>
            <text x="${x}" y="299" text-anchor="middle" class="svg-small">${esc(point.split("・")[0])}</text>
            <text x="${x}" y="318" text-anchor="middle" class="svg-small">${esc(point.split("・").slice(1).join("・"))}</text>`;
        })
        .join("")}
    </g>
    <path d="M118 350 C260 430, 430 386, 546 350 S760 286, 885 350" fill="none" stroke="#b45b3e" stroke-width="4"/>
    <text x="64" y="426" class="svg-note">見る順番: 仕事要求 -> 情報形式 -> 作業手順 -> 確認回路 -> 評価。途中でsource lensと別の読みを残す。</text>
  </svg>
</figure>`;
}

function cardHtml(card) {
  return `<article class="card pattern">
    <div class="card-kicker">${esc(card.role)} / 視点${String(card.n).padStart(2, "0")}</div>
    <h3>${esc(card.plainTitle)}</h3>
    <p class="question">${esc(card.question)}</p>
    <p>${esc(card.core)}</p>
    <div class="split">
      <div><h4>合成例</h4><p>${esc(card.example)}</p></div>
      <div><h4>別の読み</h4><p>${esc(card.alternate)}</p></div>
    </div>
    <h4>source lens</h4>
    <ul>${card.sourceLens.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    <h4>確認問い</h4>
    <ul>${card.check.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    <p class="stop"><b>ここで立ち止まる:</b> ${esc(card.stop)}</p>
    <p class="connected"><b>つながる視点:</b> ${esc(card.connected)}</p>
  </article>`;
}

const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(content.metadata.title)}</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #24221f;
      --muted: #625d55;
      --paper: #fffdf8;
      --band: #f5f1e8;
      --teal: #25636f;
      --rust: #8a4d34;
      --olive: #59642f;
      --gold: #b58a2c;
      --line: #d7d0c3;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      background: #ede8dc;
      font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", "YuGothic", "Noto Sans JP", sans-serif;
      line-height: 1.78;
    }
    main { max-width: 980px; margin: 0 auto; background: var(--paper); }
    .page {
      min-height: 1080px;
      padding: 54px 66px;
      border-bottom: 1px solid var(--line);
      position: relative;
    }
    .cover {
      display: grid;
      align-content: center;
      min-height: 1120px;
      background: linear-gradient(180deg, #fffdf8 0%, #f7f2e8 100%);
    }
    .eyebrow { color: var(--teal); font-weight: 700; letter-spacing: 0; margin: 0 0 18px; }
    h1, h2, h3, h4 { line-height: 1.32; letter-spacing: 0; }
    h1 { font-size: 46px; margin: 0 0 18px; }
    h2 { font-size: 28px; margin: 0 0 20px; }
    h3 { font-size: 21px; margin: 0 0 12px; }
    h4 { font-size: 15px; margin: 16px 0 6px; color: #3c3a35; }
    p { margin: 0 0 14px; }
    ul { margin: 0 0 14px 1.15em; padding: 0; }
    li { margin: 0 0 4px; }
    .lead { font-size: 18px; color: #3d3933; max-width: 760px; }
    .boundary {
      margin: 0 0 22px;
      padding: 10px 14px;
      border: 1px solid #c9c0b0;
      background: #f8f5ed;
      color: #4d4840;
      font-size: 12px;
      line-height: 1.5;
    }
    .hero-map {
      margin-top: 42px;
      border: 1px solid var(--line);
      background: #ffffff;
      padding: 28px;
    }
    .route {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-top: 22px;
    }
    .route span {
      min-height: 84px;
      display: grid;
      place-items: center;
      text-align: center;
      padding: 12px;
      border: 1px solid var(--line);
      background: #fbfaf6;
      font-weight: 700;
      line-height: 1.45;
    }
    .matrix { display: grid; gap: 10px; margin: 20px 0; }
    .matrix-row {
      display: grid;
      grid-template-columns: 170px repeat(7, 1fr);
      gap: 8px;
      align-items: center;
    }
    .matrix b { font-size: 13px; color: var(--muted); }
    .matrix span {
      display: grid;
      place-items: center;
      min-height: 40px;
      border: 1px solid var(--line);
      background: #fbfaf6;
      font-weight: 700;
    }
    .matrix .hot { border-color: var(--rust); background: #f4dfd4; color: #5b2e1f; }
    .scene {
      display: grid;
      grid-template-columns: 1.05fr .95fr;
      gap: 24px;
      align-items: start;
    }
    .panel, .card {
      border: 1px solid var(--line);
      background: #fff;
      padding: 22px;
    }
    .panel strong { color: var(--teal); }
    .source-grid, .reader-grid, .split, .do-dont {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .source-grid .panel, .reader-grid .panel { min-height: 160px; }
    .diagram {
      margin: 20px 0 0;
      padding: 0;
      border: 1px solid var(--line);
      background: #fff;
    }
    svg { width: 100%; height: auto; display: block; }
    .svg-title { font: 700 24px sans-serif; fill: #24221f; }
    .svg-label { font: 700 18px sans-serif; fill: #24221f; }
    .svg-small { font: 700 15px sans-serif; fill: #24221f; }
    .svg-note { font: 15px sans-serif; fill: #514d45; }
    .pattern { margin-bottom: 20px; break-inside: avoid; }
    .card-kicker { color: var(--rust); font-weight: 700; font-size: 13px; margin-bottom: 6px; }
    .question {
      border-left: 5px solid var(--teal);
      padding: 8px 0 8px 14px;
      background: #f3f9f8;
      font-weight: 700;
    }
    .stop {
      padding: 12px 14px;
      background: #fff7df;
      border-left: 5px solid var(--gold);
    }
    .connected { color: var(--muted); font-size: 14px; }
    .sample {
      background: #f7f4ec;
      border: 1px solid #d2cab9;
      padding: 24px;
    }
    .footer-note {
      position: absolute;
      left: 66px;
      right: 66px;
      bottom: 28px;
      font-size: 11px;
      color: #716a60;
      border-top: 1px solid var(--line);
      padding-top: 8px;
    }
    @media print {
      body { background: #fff; }
      main { max-width: none; }
      .page { page-break-after: always; min-height: auto; border: 0; }
      .pattern { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <main>
    <section class="page cover">
      <p class="eyebrow">Falcon Lab / L3 Work Design Primer / Chapter Prototype</p>
      <h1>${esc(content.metadata.title)}</h1>
      <p class="lead">${esc(content.metadata.subtitle)}</p>
      <div class="hero-map">
        <h2>完成版の試験条件</h2>
        <p>7つの現場場面を主導線にしながら、背後の3×7知識地図と21視点カードを本文中で使えるようにする。第5章は、その統合が最も難しく、最も価値が見える章である。</p>
        <div class="route">
          <span>読者の経験</span><span>第5章の場面</span><span>視点13/15/17/18</span><span>図解と演習</span><span>Falcon出力境界</span>
        </div>
      </div>
      <div class="footer-note">${esc(content.metadata.status)}</div>
    </section>

    <section class="page">
      ${boundaryRibbon()}
      <h2>この章で見ること</h2>
      <p class="lead">${esc(content.chapter.readerPromise)}</p>
      <div class="scene">
        <div class="panel"><h3>合成場面</h3><p>${esc(content.chapter.scene)}</p></div>
        <div class="panel"><h3>この章ではないもの</h3><p>${esc(content.chapter.notThis)}</p></div>
      </div>
      ${matrixHtml()}
      <p>視点13は第4章の翻訳・支援容量に属するが、第5章では再登場させる。現場では、情報が「共有された」だけでは足りず、作業手順、確認回路、評価の中で使える形になっている必要があるからである。</p>
      <div class="footer-note">Scene 5 prototype / seven-scene reading path + 3×7 knowledge map</div>
    </section>

    <section class="page">
      ${boundaryRibbon()}
      <h2>${esc(content.mainDiagram.title)}</h2>
      <p>図は、本人の中に問題を置く前に、仕事の接点を順番に見るためのもの。仕事要求、情報形式、作業手順、確認回路、評価・役割のどこで自由度が閉じているかを見る。</p>
      ${diagramHtml()}
      <p class="stop"><b>誤読ガード:</b> 図解は「正しい配慮手順」ではない。観察、仮説、未確認文脈、別の読みを置くための作業台である。</p>
      <div class="footer-note">Diagram is hand-composed. Japanese labels and arrows are not delegated to generated images.</div>
    </section>

    <section class="page">
      ${boundaryRibbon()}
      <h2>source lens: 見え方の差を残す</h2>
      <p>この場面では、誰が正しいかを急いで決めない。本人、上司/HR、支援者、観察可能な仕事条件の見え方を分けて置く。</p>
      <div class="source-grid">
        ${content.sourceLens
          .map((item) => `<div class="panel"><h3>${esc(item.label)}</h3><p>${esc(item.text)}</p></div>`)
          .join("")}
      </div>
      <p class="stop"><b>ここで立ち止まる:</b> source lensの差は、平均して一つの説明にしない。差があること自体が、次の問いを作る材料である。</p>
      <div class="footer-note">No source/support validity decision is made here.</div>
    </section>

    <section class="page">
      ${boundaryRibbon()}
      <h2>視点カード</h2>
      ${cardHtml(cards[0])}
      <div class="footer-note">Pattern card 13 / bridge between translation and worksite contact</div>
    </section>

    <section class="page">
      ${boundaryRibbon()}
      ${cardHtml(cards[1])}
      <div class="footer-note">Pattern card 15 / worksite contact before individual ability judgment</div>
    </section>

    <section class="page">
      ${boundaryRibbon()}
      ${cardHtml(cards[2])}
      <div class="footer-note">Pattern card 17 / information access as participation condition</div>
    </section>

    <section class="page">
      ${boundaryRibbon()}
      ${cardHtml(cards[3])}
      <div class="footer-note">Pattern card 18 / instruction, switching, memory load, confirmation loop</div>
    </section>

    <section class="page">
      ${boundaryRibbon()}
      <h2>読者別に、問いへ変える</h2>
      <div class="reader-grid">
        ${content.readerQuestions
          .map((item) => `<div class="panel"><h3>${esc(item.role)}</h3><p>${esc(item.question)}</p></div>`)
          .join("")}
      </div>
      <h2>5-10分の演習</h2>
      <ol>${content.exercise.map((item) => `<li>${esc(item)}</li>`).join("")}</ol>
      <p class="stop"><b>演習の出口:</b> 決定ではなく、メモと次の問いを残す。</p>
      <div class="footer-note">Exercises are for structured reflection, not support validity judgment.</div>
    </section>

    <section class="page">
      ${boundaryRibbon()}
      <h2>Falconならどう返すか</h2>
      <p>この章は、エージェント評価にも使う。Falconが返してよいのは、構造仮説、反対仮説、欠落文脈、次の質問である。</p>
      <div class="do-dont">
        <div class="panel"><h3>よい返し方</h3><ul>${content.falconExample.good.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>
        <div class="panel"><h3>してはいけない返し方</h3><ul>${content.falconExample.bad.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>
      </div>
      <h2>レビューで見ること</h2>
      <ul>${content.reviewChecklist.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      <div class="footer-note">Falcon output example is not runtime behavior approval.</div>
    </section>

    <section class="page">
      ${boundaryRibbon()}
      <h2>${esc(content.scene1ToneSample.title)}</h2>
      <div class="sample"><p>${esc(content.scene1ToneSample.text)}</p></div>
      <p>第5章で紙面システムを検証し、第1章冒頭で入門書の入口トーンを確認する。これで「現場場面から自然に入る」方針と、「21視点を厚く読ませる」方針を同時に試せる。</p>
      <div class="footer-note">Tone sample only. Full chapter 1 is not produced in this slice.</div>
    </section>
  </main>
</body>
</html>
`;

const manifest = `# Stage 1 L3 Work Design Primer Scene 5 Prototype Manifest v0

作成日: 2026-05-26
Lane: Falcon / Falcon Lab
Status: internal chapter prototype manifest / no source validity decision / no support validity decision / no public approval / no runtime approval

## Deliverables

- HTML: \`stage1-production-l3-work-design-primer-scene5-prototype-v0-2026-05-26.html\`
- Content JSON: \`stage1-production-l3-work-design-primer-scene5-prototype-content-v0-2026-05-26.json\`
- PDF: \`stage1-production-l3-work-design-primer-scene5-prototype-v0-2026-05-26.pdf\`

## Purpose

This prototype tests the final-primer production policy:

- the reading path starts from the seven field scenes;
- the 3x7 map remains a knowledge map, not the table of contents;
- the 21 principal interaction patterns appear as field cards inside scenes;
- Scene 5 tests the hardest integration point: information, task contact, instruction, switching, memory load, confirmation, and evaluation.

## Included Slice

- Scene 5: \`作業・情報・指示の接点が整っているか\`
- Pattern cards: 13, 15, 17, 18
- Main diagram: worksite contact cross-section and information flow
- Source-lens comparison
- Reader-specific questions
- Short exercise
- Falcon output boundary example
- Scene 1 opening tone sample

## Visual Direction

This slice uses hand-composed diagrams rather than generated raster illustrations.

Image-2.0 or similar generated images may be used later for chapter-opener atmosphere, but exact Japanese text, arrows, numbers, legends, maps, source-lens comparison, and boundary notes must remain hand-composed and verified.

## Boundaries

This artifact does not move:

- source validity
- support validity
- candidate_pattern
- Domain Core
- Atlas / 27-frame
- public_safe / public_approved
- runtime_approved
- medical, legal, employment, reasonable-accommodation, support-validity, or individual-case final judgment

Examples are synthetic. This artifact does not quote raw sensitive records, free-text records, or identifiable source material.

## Next Use

Use this prototype for the E1-E5 checks defined in the final production policy:

1. editorial flow;
2. learning design;
3. SCIMA/FCHMA and ICF integrity;
4. reader-advocate readability;
5. visual/accessibility and boundary review.
`;

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`);
await fs.writeFile(htmlPath, html);
await fs.writeFile(manifestPath, manifest);

console.log(`Wrote ${path.relative(repoRoot, htmlPath)}`);
console.log(`Wrote ${path.relative(repoRoot, contentPath)}`);
console.log(`Wrote ${path.relative(repoRoot, manifestPath)}`);
