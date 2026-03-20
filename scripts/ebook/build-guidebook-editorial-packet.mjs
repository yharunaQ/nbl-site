#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const COMMON_COPY_PATH = path.join(ROOT, 'references', 'jac', 'common-work-design-copy.json');
const LAYER_DISPOSITION_PATH = path.join(ROOT, 'references', 'jac', 'layer-disposition.json');
const MANUSCRIPT_PATH = path.join(ROOT, 'docs', 'guidebook', 'manuscript-reader-edition.md');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'guidebook', 'jac-editorial-agent-packet.md');

const REVIEW_CARD_IDS = [
  'p-support-service-navigation',
  'p-worktrial-transition',
  'p-manager-checkin',
  'p-disclosure-boundary',
  'p-mental-fluctuation-plan',
];

const ROLE_SPECS = [
  {
    id: 'evidence_steward',
    title: 'Evidence Steward',
    mission: '根拠、法政策差、地域支援条件、個別条件を落とさずに編集へ渡す。',
    output: 'observation / inference / normative / recommendation を切り分けた根拠メモ。',
  },
  {
    id: 'developmental_editor',
    title: 'Developmental Editor',
    mission: '読者の疑問順で章のストーリーを組み直し、読み進める理由を作る。',
    output: '章の問い順、見開き構成、削る情報と残す情報の判断。',
  },
  {
    id: 'copywriter',
    title: 'Copywriter',
    mission: '技術説明を、読者がそのまま理解できる自然文へ変換する。',
    output: '章頭導入、見出し、図版キャプション、要約文の叩き台。',
  },
  {
    id: 'art_director',
    title: 'Art Director',
    mission: '図版、余白、強弱、視線誘導で「読み切れる見開き」へ変える。',
    output: '見開きラフ、図解指示、重要語の階層設計。',
  },
  {
    id: 'web_translator',
    title: 'Web Translator',
    mission: '冊子で良かった見出し順・図解・導線を、WebカードのUIへ逆輸入する。',
    output: 'ガイド画面へ戻す見出し、補助線、図解、導線の変更案。',
  },
];

const CARD_EDITORIAL_MAP = {
  'p-support-service-navigation': {
    readerQuestion:
      '制度や支援機関が多すぎて、結局どこに相談すればよいのか。どこで止まっているのか。',
    storyPromise: '制度名を増やす章ではなく、止まっている工程をほどき次の一手を決める章にする。',
    editorialRisk:
      '制度一覧の説明に寄ると、読者は「情報量は多いのに動けない」状態になる。',
    developmentalEditor:
      '章の主語を「制度」ではなく「止まりやすい工程」に置く。迷路の説明ではなく、接続図を持つ前後で何が変わるかを見開きで示す。',
    copywriter:
      '窓口名の列挙から入らず、「まず何が止まっているのかを一枚で見る」で導入する。制度名は本文より図版側へ寄せる。',
    artDirector:
      '左ページを「止まりやすい3地点」、右ページを「接続ルート図」にする。担当者と期限を図版の主役にする。',
    webTranslator:
      'Webでは「今どこで止まっているか」を選ぶ導線を追加し、カード本文は接続案よりも工程の見える化を先に出す。',
    spreadIdea: '迷路ではなく交通整理図。窓口名より工程・責任者・期限を大きく見せる。',
  },
  'p-worktrial-transition': {
    readerQuestion:
      '実習ではうまく見えたのに、採用後に急に崩れるのはなぜか。どこを橋渡しすればよいのか。',
    storyPromise: '実習評価を採用後1か月の運用へつなぐ橋として読ませる。',
    editorialRisk:
      '制度説明と支援体制の説明が分離すると、読者は「採用後に何を持ち帰ればよいか」が分からない。',
    developmentalEditor:
      '章の軸を「実習で見えた条件を、採用後1から4週へどう持ち込むか」に固定する。実習評価と初月運用の対照表を中心に据える。',
    copywriter:
      '「実習評価」「初期KPI」「不調時の戻し先」を三点セットで反復する。制度の話は注に下げ、橋渡しの言葉を前に出す。',
    artDirector:
      '見開きの左に実習段階、右に採用後4週間を置き、同じ項目がどう受け継がれるかを線で結ぶ。',
    webTranslator:
      'Webカードでは「実習で確認済みか」「採用後に引き継いだか」の2段チェックを付ける。',
    spreadIdea: '橋の断面図。実習評価を左岸、採用後運用を右岸にして、途切れる要素を可視化する。',
  },
  'p-manager-checkin': {
    readerQuestion:
      '相談窓口があるはずなのに、なぜ調整がいつも遅れるのか。誰が受け止めて誰が動かすのか。',
    storyPromise: '面談の作法ではなく、相談が遅れない仕組みを作る章にする。',
    editorialRisk:
      'ガバナンス説明が抽象化しすぎると、読者は「相談が形骸化する瞬間」を想像できない。',
    developmentalEditor:
      '章の中心を「相談が遅れる瞬間」と「遅れない責任線」に置く。相談導線が切れる瞬間を先に見せる。',
    copywriter:
      '「定例化」や「可視化」だけでは終わらせず、「誰が次の1手を決めるか」まで文章にする。抽象名詞を減らす。',
    artDirector:
      '相談ルート図を、現場→管理者→人事→外部支援の分岐図として見せる。止まる地点は赤、流れる地点は青で差を出す。',
    webTranslator:
      'Webカードでは、相談経路を文章だけでなく1本のタイムラインで表示し、エスカレーションの段差を減らす。',
    spreadIdea: '連絡網の見開き。誰が受け、誰が決め、誰に戻すかが一目で分かる図。',
  },
  'p-disclosure-boundary': {
    readerQuestion:
      'どこまで伝えれば配慮につながり、どこからが伝えすぎになるのか。何を誰に話すべきか。',
    storyPromise: '開示するか否かの二択ではなく、目的ごとに共有を設計する章にする。',
    editorialRisk:
      '制度・個人情報・支援体制が一度に出るため、説明が重くなると読者は章ごと離脱しやすい。',
    developmentalEditor:
      '章を「何のために共有するのか」から始める。目的→相手→共有量→見直しの順に並べ、二択に見せない。',
    copywriter:
      '「最小共有」「必要目的」「戻し先」を短い反復文で定着させる。読者の迷いをそのまま見出しにする。',
    artDirector:
      '共有レイヤー図を主役にする。本人だけが持つ情報、管理責任者が持つ情報、チーム共有する情報を3層で見せる。',
    webTranslator:
      'Webカードでは「共有目的」から入るUIに変え、共有先別の開示量を折りたたみで見せる。',
    spreadIdea: '半透明のレイヤー図。共有目的ごとに見せる情報量が変わることを視覚で理解させる。',
  },
  'p-mental-fluctuation-plan': {
    readerQuestion:
      '悪化のサインが見えても、どの段階で誰が動けばよいのか。重くなる前に何を決めておくべきか。',
    storyPromise: '緊急対応マニュアルではなく、初期サインから再評価までの戻り道を持つ章にする。',
    editorialRisk:
      '危機対応だけが前に出ると、読者は日常の微調整と再評価導線を見落とす。',
    developmentalEditor:
      '章の主線を「初期サイン→段階調整→再評価」に置く。いきなり緊急対応に飛ばず、早い段階の判断線を厚くする。',
    copywriter:
      '「悪化兆候」という抽象語を減らし、「いつもより遅い」「連絡が途切れる」など読者が観察できる語へ寄せる。',
    artDirector:
      '温度計のような段階図で、初期サインから支援頻度の上がり方を見せる。戻し先は図の下部で一貫表示する。',
    webTranslator:
      'Webカードでは、初期サインの観測項目と戻し先をカード上部に固定し、緊急対応は折りたたみ側へ送る。',
    spreadIdea: '段階メーター。悪化ではなく「戻し方」の図解を主役にする。',
  },
};

function unique(items) {
  return [...new Set((Array.isArray(items) ? items : []).map((item) => String(item || '').trim()).filter(Boolean))];
}

function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripPrefix(text, prefix) {
  return String(text || '').replace(new RegExp(`^${escapeRegExp(prefix)}\\s*`), '').trim();
}

function findLine(lines, pattern, startIndex = 0) {
  for (let index = startIndex; index < lines.length; index += 1) {
    if (pattern.test(lines[index])) return index + 1;
  }
  return null;
}

function findChapterLine(lines, title) {
  return findLine(lines, new RegExp(`^## 第\\d+章 ${escapeRegExp(title)}（`));
}

function decisionLabel(detail) {
  const value = String(detail?.disposition || '').trim();
  if (value === 'move_to_shared_layer') return '共通レイヤーへ寄せる';
  if (value === 'move_to_separate_guide') return '別ガイドへ寄せる';
  return 'カード内に残す';
}

function bullets(items) {
  const rows = unique(items);
  if (rows.length === 0) return '- （該当なし）';
  return rows.map((item) => `- ${item}`).join('\n');
}

async function main() {
  const [commonCopyRaw, layerDispositionRaw, manuscriptRaw] = await Promise.all([
    fs.readFile(COMMON_COPY_PATH, 'utf8'),
    fs.readFile(LAYER_DISPOSITION_PATH, 'utf8'),
    fs.readFile(MANUSCRIPT_PATH, 'utf8'),
  ]);

  const commonCopyPayload = JSON.parse(commonCopyRaw);
  const dispositionPayload = JSON.parse(layerDispositionRaw);
  const commonCopyMap = new Map(
    (Array.isArray(commonCopyPayload?.cards) ? commonCopyPayload.cards : [])
      .map((row) => [String(row?.id || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );
  const dispositionMap = new Map(
    (Array.isArray(dispositionPayload?.cards) ? dispositionPayload.cards : [])
      .map((row) => [String(row?.cardId || ''), row])
      .filter((entry) => Boolean(entry[0])),
  );
  const manuscriptLines = manuscriptRaw.split(/\r?\n/);

  const lines = [];
  lines.push('# JAC ガイドブック 編集エージェント・スプリントパケット');
  lines.push('');
  lines.push(`更新日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push('状態: internal-editorial');
  lines.push('');
  lines.push('## 位置づけ');
  lines.push('');
  lines.push('- `observation`: 現在の冊子は、内容の厚みは出てきたが、まだ Web ツール由来の説明順と文体が前に出やすい。');
  lines.push('- `inference`: 読者の疑問順で再構成し、図版・見開き・要約の強弱を入れると、理解速度と実装しやすさが上がる。');
  lines.push('- `normative`: 根拠、法政策差、地域支援体制、個別条件は落とさず、読者が自然に読める順番へ並べ替える。');
  lines.push('- `recommendation`: 知識設計と冊子編集を分離し、AI エージェントの役割分担で重点5章から先に仕上げる。');
  lines.push('');
  lines.push('## 編集チーム');
  lines.push('');
  for (const role of ROLE_SPECS) {
    lines.push(`### ${role.title} \`${role.id}\``);
    lines.push('');
    lines.push(`- 役割: ${role.mission}`);
    lines.push(`- 成果物: ${role.output}`);
    lines.push('');
  }
  lines.push('## スプリントの進め方');
  lines.push('');
  lines.push('1. `evidence_steward` が「落としてはいけない条件」を確定する。');
  lines.push('2. `developmental_editor` が、読者の疑問順で章構成と見開き構成を決める。');
  lines.push('3. `copywriter` が、章頭・小見出し・図版キャプションを自然文へ書き直す。');
  lines.push('4. `art_director` が、図解・余白・強弱で読む順序を固定する。');
  lines.push('5. `web_translator` が、冊子で効いた見せ方を Web ガイドへ逆輸入する。');
  lines.push('');
  lines.push('## 編集ガードレール');
  lines.push('');
  lines.push('- 診断名を主語にしない。仕事・環境・支援・時間の条件から書く。');
  lines.push('- 「読みやすさ」のために法政策差や地域支援体制を消さない。');
  lines.push('- 制度説明や支援機関説明は、それ自体を主役にせず、読者が動く判断のために使う。');
  lines.push('- 章内で解けない論点は、戻し先を曖昧にしない。');
  lines.push('');
  lines.push('## 重点5章 編集パケット');
  lines.push('');

  for (const cardId of REVIEW_CARD_IDS) {
    const card = commonCopyMap.get(cardId);
    const disposition = dispositionMap.get(cardId);
    const config = CARD_EDITORIAL_MAP[cardId];
    if (!card || !disposition || !config) continue;

    const title = String(card?.title || cardId);
    const chapterLine = findChapterLine(manuscriptLines, title);
    const selectionBoundary = stripPrefix(card?.selectionBoundary || '', '選ぶ目安:');
    const legalChecks = unique(card?.legalPolicyGuardrail?.checks).slice(0, 3);
    const regionalJac = unique(card?.regionalSupportOverlay?.jacRole).slice(0, 2);
    const regionalRole = unique(card?.regionalSupportOverlay?.regionalRole).slice(0, 2);
    const standardized = unique(card?.quickBundle?.standardized).slice(0, 2);
    const individualized = unique(card?.quickBundle?.individualized).slice(0, 2);

    lines.push(`### ${title} \`${cardId}\``);
    lines.push('');
    lines.push(`- 冊子位置: ${chapterLine ? `[manuscript-reader-edition.md](${MANUSCRIPT_PATH}#L${chapterLine})` : '（未検出）'}`);
    lines.push(`- 主読者の疑問: ${config.readerQuestion}`);
    lines.push(`- 章の約束: ${config.storyPromise}`);
    lines.push(`- 編集上の危険: ${config.editorialRisk}`);
    lines.push('');
    lines.push('#### Evidence Steward');
    lines.push('');
    lines.push(`- observation: ${selectionBoundary}`);
    lines.push(`- observation: 制度条件は「${String(card?.legalPolicyGuardrail?.summary || '').trim()}」が前提。`);
    lines.push(`- observation: 地域支援条件は「${String(card?.regionalSupportOverlay?.summary || '').trim()}」が前提。`);
    lines.push(`- inference: ${String(disposition?.rationale || '').trim()}`);
    lines.push('- normative: 法政策差、地域支援体制、戻し先は、読者向けに言い換えても削除しない。');
    lines.push('- recommendation: 下記の「絶対に落とさない条件」を本文・図版・補助線のどこかに必ず残す。');
    lines.push('');
    lines.push('#### Developmental Editor');
    lines.push('');
    lines.push(`- recommendation: ${config.developmentalEditor}`);
    lines.push(`- recommendation: 見開きの約束は「${config.spreadIdea}」に置く。`);
    lines.push('');
    lines.push('#### Copywriter');
    lines.push('');
    lines.push(`- recommendation: ${config.copywriter}`);
    lines.push(`- recommendation: 先頭で使うべき読者の疑問は「${config.readerQuestion}」とする。`);
    lines.push('');
    lines.push('#### Art Director');
    lines.push('');
    lines.push(`- recommendation: ${config.artDirector}`);
    lines.push('');
    lines.push('#### Web Translator');
    lines.push('');
    lines.push(`- recommendation: ${config.webTranslator}`);
    lines.push('');
    lines.push('#### 絶対に落とさない条件');
    lines.push('');
    lines.push(`- 法政策の寄せ先: ${decisionLabel(disposition?.legalPolicy)} / ${String(disposition?.legalPolicy?.detailTarget || '（未設定）')}`);
    lines.push(`- 地域支援の寄せ先: ${decisionLabel(disposition?.regionalSupport)} / ${String(disposition?.regionalSupport?.detailTarget || '（未設定）')}`);
    lines.push(`- このカードで残す制度判断: ${unique(disposition?.legalPolicy?.keepInCard).join(' / ') || '（該当なし）'}`);
    lines.push(`- このカードで残す支援判断: ${unique(disposition?.regionalSupport?.keepInCard).join(' / ') || '（該当なし）'}`);
    lines.push(bullets(legalChecks.map((item) => `制度面の先行確認: ${item}`)));
    lines.push(bullets(regionalJac.map((item) => `JACが先に決める: ${item}`)));
    lines.push(bullets(regionalRole.map((item) => `地域支援者へつなぐ: ${item}`)));
    lines.push(bullets(standardized.map((item) => `標準運用で残す: ${item}`)));
    lines.push(bullets(individualized.map((item) => `個別調整で残す: ${item}`)));
    lines.push('');
  }

  lines.push('## 冊子から Web へ戻す優先論点');
  lines.push('');
  lines.push('- 章頭の「主読者の疑問」を Web カード上部の導入文へ戻す。');
  lines.push('- 見開きで効いた図解を、Web の補助図や選択肢チップへ変換する。');
  lines.push('- 4節で効いた「制度面で先に決めること / 支援体制で先に決めること」を、Web 側の補助線にも揃える。');
  lines.push('- 読み味を改善した見出し順は、Web のカード展開順にも反映する。');
  lines.push('');

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath: OUTPUT_PATH,
        reviewCardCount: REVIEW_CARD_IDS.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
