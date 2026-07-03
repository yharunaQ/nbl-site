import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const outDir = path.join(
  repoRoot,
  "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
);

const jsonPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-scene5-reader-sample-content-v0-2026-05-26.json"
);
const htmlPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-scene5-reader-sample-v0-2026-05-26.html"
);
const manifestPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-scene5-reader-sample-manifest-v0-2026-05-26.md"
);

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const content = {
  meta: {
    title: "何度も確認しているように見えるとき",
    subtitle: "障害・難病就労支援から見えてきた、仕事設計の見方",
    chapter: "第5章 読者向け編集サンプル",
    status: "読者向け編集サンプル",
  },
  frameShift: {
    title: "この本の見方の転換",
    lead:
      "障害や難病の就労支援で見えてくるのは、特別な人だけの問題ではない。体調が変わる、情報の受け取り方が違う、移動や休息に条件がある、説明しすぎると不利益になる、評価のされ方で将来が閉じる。こうしたことは、程度や形は違っても、多くの人の働き方に関係している。",
    core:
      "この本の独自性は、障害・難病の就労支援を入り口に、標準的な働き方が前提にしてきた「同じ時間に、同じ場所で、同じ情報を、同じ速さで処理できる人」という仮定を見直すことにある。",
    shifts: [
      {
        common: "困難は本人の中にある",
        newView: "困難は、人の条件と仕事の条件が接する場所に現れる",
      },
      {
        common: "配慮は例外的な追加対応である",
        newView: "配慮は、仕事の自由度を増やす設計の一部である",
      },
      {
        common: "支援は本人を職場に合わせるためにある",
        newView: "支援は、本人・仕事・職場・制度の言葉をつなぎ直すためにある",
      },
      {
        common: "就職や定着ができれば成功である",
        newView: "役割、評価、学び、戻る余地まで含めて参加の質を見る",
      },
    ],
    bridge:
      "第5章の「何度も確認しているように見えるとき」も、この転換の小さな入口である。本人の理解力だけを見るのではなく、情報が仕事の中でどう流れ、どこで使える手順にならず、どこで評価に変わってしまうのかを見る。",
  },
  opening: {
    lead:
      "「また同じ確認をしている」「説明したのに伝わらない」。そう見える場面でも、本人の理解力だけで結論を出す前に、変更情報、手順書、口頭指示、チャット、確認先が同じ方向を向いているかを見てみる。",
    point:
      "この章で見るのは、本人が悪いか、職場が悪いかではない。情報がどこで止まり、どこで作業手順にならず、どこで確認しづらくなっているかである。",
  },
  scene: {
    title: "ある職場の場面",
    body:
      "会議で作業手順の一部が変わった。会議に出ていた人たちは、その場で理由も聞いている。けれども、手順書はすぐには更新されず、チャットにも短い補足だけが流れた。本人は古い手順書を見ながら作業し、途中で違和感を覚えて確認した。上司から見ると、前にも説明したことをまた聞いているように見えた。",
  },
  promise: [
    "まず、本人・上司・支援者・仕事そのものの見え方を分ける。",
    "次に、仕事の流れを、情報、手順、確認、評価に分けて描く。",
    "最後に、どこを変えると状況が開くかを、判断ではなく問いとして残す。",
  ],
  perspectives: [
    {
      label: "本人から見ると",
      text: "公式の手順を見て作業している。途中で変わったことがどこに書かれているのか分からない。確認すると、また聞いていると思われそうで言い出しにくい。",
    },
    {
      label: "上司から見ると",
      text: "会議でもチャットでも伝えたつもりがある。本人が覚えていない、応用できない、作業が遅いように見える。",
    },
    {
      label: "支援者から見ると",
      text: "本人の理解力だけでは説明しきれない。情報が、本人が使える手順や確認方法になっているかを見たい。",
    },
    {
      label: "仕事の流れから見ると",
      text: "会議、チャット、手順書、実際の作業、確認先、評価が少しずつずれている。ずれが本人のミスとして見えている可能性がある。",
    },
  ],
  flowSteps: [
    ["1", "仕事の要求", "何を、どの順番で、どの基準まで行う仕事か。"],
    ["2", "情報の形", "会議、口頭、文書、チャット、画面表示に情報が分かれていないか。"],
    ["3", "作業手順", "情報が、実際に使える手順へ更新されているか。"],
    ["4", "確認の道", "迷った時、誰に、何を、どのタイミングで確認できるか。"],
    ["5", "評価の見え方", "ずれが本人の能力や意欲の評価に早く変わっていないか。"],
  ],
  lenses: [
    {
      id: "13",
      title: "情報を、使える手順にする",
      readerTitle: "伝えた情報は、作業で使える形になっているか",
      body:
        "情報を共有したことと、本人が仕事で使えることは同じではない。会議で決まった変更、口頭の補足、チャットの短い連絡が、手順や確認方法に変換されているかを見る。",
      question: "変更点は、本人が後から見返せる場所にまとまっているか。",
      not: "「説明したから分かるはず」で止めない。",
    },
    {
      id: "15",
      title: "作業・道具・座席を合わせる",
      readerTitle: "作業のしにくさを、本人評価の前に見る",
      body:
        "作業が遅い、正確でない、と見える前に、道具の置き場所、座席、画面、姿勢、動線、確認場所を見る。小さなずれが、疲労や確認回数を増やしていることがある。",
      question: "道具、画面、座席、確認先は、作業の流れに合っているか。",
      not: "作業分析なしに、能力や意欲の問題へ進まない。",
    },
    {
      id: "17",
      title: "情報アクセスを整える",
      readerTitle: "同じ情報面に立てているか",
      body:
        "重要な情報が、音声、雑談、文書、チャット、画面、暗黙の了解に分かれていると、参加しているように見えても同じ情報面に立てないことがある。",
      question: "会議で決まったこと、文書にあること、現場でだけ流れることは一致しているか。",
      not: "資料があることと、情報にアクセスできていることを同じにしない。",
    },
    {
      id: "18",
      title: "指示・切替・記憶負荷を整える",
      readerTitle: "覚える量、切り替える量、戻る道を見る",
      body:
        "開始条件、優先順位、完了基準、途中変更、割り込み、確認先が曖昧だと、記憶や切替の負荷が一気に高くなる。失敗した時に戻れる道も仕事設計の一部である。",
      question: "開始、途中変更、完了確認、やり直しの流れは見える形になっているか。",
      not: "注意不足や理解不足だけで閉じない。",
    },
  ],
  exercise: {
    title: "10分で書けるメモ",
    items: [
      "いま「本人の問題」または「職場の問題」として単純化されている説明を書く。",
      "その説明を、情報、手順、確認、評価のどこに関係するかに分ける。",
      "本人・上司・支援者・仕事の流れのうち、まだ聞けていない見え方を選ぶ。",
      "今すぐ決めると危ない判断を一つ書く。",
      "次に聞くと状況が開きそうな質問を一つ書く。",
    ],
  },
  falconVoice: {
    title: "Falconの視点：できない人を探すのではなく、できる条件を設計する",
    lead:
      "Falconは、障害・難病就労支援を「特別な人への例外対応」の集まりとして読まない。そこに見えているのは、人間の体調、情報処理、移動、感覚、生活時間、開示のしやすさが、仕事の標準設計とぶつかる接点である。",
    points: [
      {
        title: "診断名ではなく、接点を見る",
        text:
          "病名や障害名は重要な条件窓だが、それだけで支援を決めない。体調時間、情報の受け取り方、作業要求、職場の余力、評価のされ方がどこで接しているかを見る。",
      },
      {
        title: "配慮を善意ではなく、設計として見る",
        text:
          "配慮は例外的な優しさではない。情報、時間、場所、手順、確認、評価の自由度を増やし、より多くの人が力を発揮できる仕事に作り替える技術である。",
      },
      {
        title: "個別支援から、社会の標準を問い直す",
        text:
          "一人の困りごとを丁寧に読むと、職場の標準が誰を想定し、誰を見えにくくしているかが分かる。そこから、人間の多様性を前提にした仕事と社会の設計が始まる。",
      },
    ],
    closing:
      "この章の場面も同じである。「確認が多い人」の話で終わらせない。変更情報が使える手順に変わらない仕事、確認が評価不安に変わる職場、戻る道が設計されていない作業として読む。そこに、Falconがこの冊子で開きたい新しい就労支援の視界がある。",
  },
  chapterMap: {
    title: "この章の現在地",
    text:
      "背景には21の視点がある。ただし、読者が最初から番号を覚える必要はない。この章では、情報が仕事の手順になるまでを見るために、13・15・17・18の4つだけを使った。",
    rows: [
      ["体調・治療・生活時間", "01", "02", "03", "04", "05", "06", "07"],
      ["入口・相談・情報共有", "08", "09", "10", "11", "12", "13", "14"],
      ["仕事・評価・将来", "15", "16", "17", "18", "19", "20", "21"],
    ],
    hot: ["13", "15", "17", "18"],
  },
};

function flowHtml() {
  return `<div class="flow">${content.flowSteps
    .map(
      ([n, title, text]) =>
        `<div class="flow-step"><span>${esc(n)}</span><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`
    )
    .join("")}</div>`;
}

function lensHtml(lens) {
  return `<article class="lens">
    <div class="lens-id">視点 ${esc(lens.id)} <span>${esc(lens.title)}</span></div>
    <h3>${esc(lens.readerTitle)}</h3>
    <p>${esc(lens.body)}</p>
    <div class="question"><b>見る問い</b><p>${esc(lens.question)}</p></div>
    <div class="guard"><b>ここで立ち止まる</b><p>${esc(lens.not)}</p></div>
  </article>`;
}

function chapterMapHtml() {
  return `<div class="chapter-map">${content.chapterMap.rows
    .map(
      (row) =>
        `<div class="map-row"><b>${esc(row[0])}</b>${row
          .slice(1)
          .map((id) => `<span class="${content.chapterMap.hot.includes(id) ? "hot" : ""}">${esc(id)}</span>`)
          .join("")}</div>`
    )
    .join("")}</div>`;
}

const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(content.meta.title)}</title>
  <style>
    :root {
      --ink:#25231f;
      --muted:#5b554c;
      --paper:#fffdf8;
      --soft:#f4f0e8;
      --line:#d7d0c4;
      --blue:#315f6c;
      --green:#59663a;
      --yellow:#fff3c7;
    }
    * { box-sizing: border-box; }
    body {
      margin:0;
      background:#e8e2d7;
      color:var(--ink);
      font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic","YuGothic","Noto Sans JP",sans-serif;
      line-height:1.8;
    }
    main { max-width:960px; margin:0 auto; background:var(--paper); }
    section { padding:56px 72px; border-bottom:1px solid var(--line); }
    .cover { min-height:680px; display:grid; align-content:center; background:linear-gradient(180deg,#fffdf8,#f7f1e8); }
    .kicker { font-weight:700; color:var(--blue); margin:0 0 20px; }
    h1,h2,h3 { line-height:1.35; letter-spacing:0; }
    h1 { font-size:44px; margin:0 0 16px; }
    h2 { font-size:28px; margin:0 0 20px; }
    h3 { font-size:21px; margin:0 0 10px; }
    p { margin:0 0 14px; }
    .lead { font-size:19px; color:#3b3833; max-width:760px; }
    .small-note { font-size:13px; color:var(--muted); margin-top:32px; }
    .scene-card {
      border:1px solid var(--line);
      background:#fff;
      padding:28px;
      margin:24px 0;
    }
    .promise {
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:14px;
      margin-top:22px;
    }
    .promise div, .perspective, .lens, .falcon-box {
      border:1px solid var(--line);
      background:#fff;
      padding:20px;
    }
    .promise span {
      display:inline-grid;
      place-items:center;
      width:30px;
      height:30px;
      border-radius:50%;
      background:var(--blue);
      color:#fff;
      font-weight:700;
      margin-bottom:10px;
    }
    .perspectives {
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:16px;
    }
    .perspective h3 { color:var(--blue); }
    .flow {
      display:grid;
      grid-template-columns:repeat(5,1fr);
      gap:10px;
      margin:24px 0;
    }
    .flow-step {
      min-height:180px;
      background:#fff;
      border:1px solid var(--line);
      padding:16px;
    }
    .flow-step span {
      display:inline-grid;
      place-items:center;
      width:30px;
      height:30px;
      border-radius:50%;
      background:var(--green);
      color:#fff;
      font-weight:700;
      margin-bottom:10px;
    }
    .flow-step strong { display:block; margin-bottom:8px; }
    .flow-step p { font-size:14px; color:var(--muted); }
    .lens { margin:18px 0; }
    .lens-id {
      color:var(--blue);
      font-weight:700;
      font-size:14px;
      margin-bottom:8px;
    }
    .lens-id span { color:var(--muted); font-weight:500; margin-left:8px; }
    .question, .guard {
      margin-top:14px;
      padding:14px 16px;
      background:#f3f8f7;
      border-left:5px solid var(--blue);
    }
    .guard {
      background:var(--yellow);
      border-color:#c4912a;
    }
    .exercise {
      background:#fff;
      border:1px solid var(--line);
      padding:24px;
    }
    li { margin-bottom:8px; }
    .falcon-grid {
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:16px;
    }
    .falcon-callout {
      border:1px solid var(--line);
      background:#f3f8f7;
      padding:24px;
      margin-top:20px;
      border-left:6px solid var(--blue);
    }
    .production-note {
      background:#f6f3ec;
      color:#4d473f;
      font-size:13px;
    }
    .shift-grid {
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:16px;
      margin:24px 0;
    }
    .shift-card {
      border:1px solid var(--line);
      background:#fff;
      padding:0;
      overflow:hidden;
    }
    .shift-old {
      padding:14px 18px;
      background:#f7f4ed;
      border-bottom:1px solid var(--line);
    }
    .shift-old span,
    .shift-new span {
      display:block;
      font-size:12px;
      font-weight:700;
      color:var(--muted);
      margin-bottom:4px;
    }
    .shift-old p {
      color:#736c62;
      font-size:14px;
      line-height:1.55;
      margin:0;
    }
    .shift-arrow {
      text-align:center;
      color:var(--blue);
      font-weight:700;
      font-size:17px;
      padding:10px 0 8px;
      background:#fff;
    }
    .shift-new {
      padding:18px;
      background:#f3f8f7;
      border-top:4px solid var(--blue);
    }
    .shift-new span {
      color:var(--blue);
    }
    .shift-new p {
      font-weight:700;
      font-size:19px;
      line-height:1.55;
      margin:0;
    }
    .chapter-map { display:grid; gap:8px; margin:22px 0; }
    .map-row {
      display:grid;
      grid-template-columns:170px repeat(7,1fr);
      gap:7px;
      align-items:center;
    }
    .map-row b { color:var(--muted); font-size:13px; }
    .map-row span {
      display:grid;
      place-items:center;
      min-height:36px;
      border:1px solid var(--line);
      background:#fff;
      font-weight:700;
    }
    .map-row .hot { background:#f3f8f7; border-color:var(--blue); color:var(--blue); }
    @media (max-width:760px) {
      section { padding:36px 24px; }
      h1 { font-size:34px; }
      .promise,.perspectives,.flow,.falcon-grid,.shift-grid { grid-template-columns:1fr; }
      .flow-step { min-height:auto; }
    }
    @media print {
      body { background:#fff; }
      main { max-width:none; }
      section { page-break-after:always; }
      .lens { page-break-inside:avoid; }
    }
  </style>
</head>
<body>
<main>
  <section class="cover">
    <p class="kicker">${esc(content.meta.chapter)}</p>
    <h1>${esc(content.meta.title)}</h1>
    <p class="lead">${esc(content.meta.subtitle)}</p>
  </section>

  <section>
    <h2>${esc(content.frameShift.title)}</h2>
    <p class="lead">${esc(content.frameShift.lead)}</p>
    <p>${esc(content.frameShift.core)}</p>
    <div class="shift-grid">
      ${content.frameShift.shifts
        .map(
          (item) =>
            `<div class="shift-card"><div class="shift-old"><span>これまでの見方</span><p>${esc(item.common)}</p></div><div class="shift-arrow">↓ 見方を転換</div><div class="shift-new"><span>この本の見方</span><p>${esc(item.newView)}</p></div></div>`
        )
        .join("")}
    </div>
    <p>${esc(content.frameShift.bridge)}</p>
  </section>

  <section>
    <h2>まず、場面から入る</h2>
    <p class="lead">${esc(content.opening.lead)}</p>
    <p>${esc(content.opening.point)}</p>
    <div class="scene-card">
      <h3>${esc(content.scene.title)}</h3>
      <p>${esc(content.scene.body)}</p>
    </div>
    <div class="promise">
      ${content.promise.map((item, i) => `<div><span>${i + 1}</span><p>${esc(item)}</p></div>`).join("")}
    </div>
  </section>

  <section>
    <h2>見え方を分ける</h2>
    <p>同じ出来事でも、立場によって見えているものが違う。どれか一つを正解にする前に、まず分けて置く。</p>
    <div class="perspectives">
      ${content.perspectives
        .map((item) => `<div class="perspective"><h3>${esc(item.label)}</h3><p>${esc(item.text)}</p></div>`)
        .join("")}
    </div>
  </section>

  <section>
    <h2>仕事の流れを描く</h2>
    <p>本人の能力や職場の理解へ進む前に、情報が仕事の中でどう流れているかを見る。</p>
    ${flowHtml()}
  </section>

  <section>
    <h2>見直すための4つのレンズ</h2>
    <p>ここからは、専門用語を覚える必要はない。困った場面を見直すためのレンズとして使う。</p>
    ${content.lenses.map(lensHtml).join("")}
  </section>

  <section>
    <div class="exercise">
      <h2>${esc(content.exercise.title)}</h2>
      <ol>${content.exercise.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ol>
    </div>
  </section>

  <section>
    <h2>${esc(content.falconVoice.title)}</h2>
    <p class="lead">${esc(content.falconVoice.lead)}</p>
    <div class="falcon-grid">
      ${content.falconVoice.points
        .map((item) => `<div class="falcon-box"><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div>`)
        .join("")}
    </div>
    <div class="falcon-callout"><p>${esc(content.falconVoice.closing)}</p></div>
  </section>

  <section>
    <h2>${esc(content.chapterMap.title)}</h2>
    <p>${esc(content.chapterMap.text)}</p>
    ${chapterMapHtml()}
  </section>

</main>
</body>
</html>
`;

const manifest = `# Stage 1 L3 Work Design Primer Scene 5 Reader Sample Manifest v0

作成日: 2026-05-26
Lane: Falcon / Falcon Lab
Status: reader-facing editorial sample / no source validity decision / no support validity decision / no public approval / no runtime approval

## Deliverables

- HTML: \`stage1-production-l3-work-design-primer-scene5-reader-sample-v0-2026-05-26.html\`
- Content JSON: \`stage1-production-l3-work-design-primer-scene5-reader-sample-content-v0-2026-05-26.json\`
- PDF: \`stage1-production-l3-work-design-primer-scene5-reader-sample-v0-2026-05-26.pdf\`

## Purpose

This sample corrects the first Scene 5 prototype's overexposure of Falcon Lab language and internal boundary machinery. It also corrects the reader-facing route so Falcon appears as an expert work-design perspective, not as bureaucratic AI-use procedure.

The sample tests a reader-first editorial direction:

- foreground the primer's distinctive frame shift: disability / rare-disease employment support as a way to redesign work for human diversity;
- start from a recognizable workplace scene;
- avoid English headers/footers and internal labels in the reading path;
- remove AI-boundary procedure from the reader path and move governance boundaries to the manifest / production-policy layer;
- foreground Falcon's central identity: do not look for people who cannot work; design the conditions under which diverse people can participate and contribute;
- translate source lens into \`見え方を分ける\`;
- translate pattern cards into \`見直すためのレンズ\`;
- keep governance boundaries in the manifest / production-policy layer instead of putting them in the reader's learning path.

## Boundaries

This artifact does not move source validity, support validity, candidate_pattern, Domain Core, Atlas / 27-frame, public_safe / public_approved, runtime_approved, or individual medical/legal/employment/accommodation/support-validity judgment.

Examples are synthetic and do not quote raw sensitive records or identifiable free text.
`;

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(jsonPath, `${JSON.stringify(content, null, 2)}\n`);
await fs.writeFile(htmlPath, html);
await fs.writeFile(manifestPath, manifest);

console.log(`Wrote ${path.relative(repoRoot, htmlPath)}`);
console.log(`Wrote ${path.relative(repoRoot, jsonPath)}`);
console.log(`Wrote ${path.relative(repoRoot, manifestPath)}`);
