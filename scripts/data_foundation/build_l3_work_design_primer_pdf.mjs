import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const outDir = path.join(
  repoRoot,
  "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
);
const htmlPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-book-v1-2026-05-26.html"
);
const pdfPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-book-v1-2026-05-26.pdf"
);
const contentJsonPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-book-content-v1-2026-05-26.json"
);
const manifestPath = path.join(
  outDir,
  "stage1-production-l3-work-design-primer-book-manifest-v1-2026-05-26.md"
);

async function loadPlaywright() {
  const nodePaths = (process.env.NODE_PATH || "").split(path.delimiter).filter(Boolean);
  for (const nodePath of nodePaths) {
    const candidate = path.join(nodePath, "playwright/index.js");
    try {
      await fs.access(candidate);
      return import(pathToFileURL(candidate).href);
    } catch {
      // Try the next configured module root.
    }
  }
  return import("playwright");
}

const planes = [
  {
    id: "I",
    label: "体調・治療・生活時間の設計",
    short: "Health Time",
    title: "続けられる働き方は、時間の設計から始まる",
    lead:
      "体調や治療を本人の事情として脇に置くと、仕事の設計を誤る。働く前後の時間、通院、回復、休息、生活保障、戻り方までを同じ地図に置く。",
    color: "#25636f",
  },
  {
    id: "II",
    label: "入口・相談・情報共有の設計",
    short: "Translation",
    title: "支援とは、条件を仕事の言葉に置き換え直すこと",
    lead:
      "本人の生活語、求人の言葉、職場の実務語、制度の言葉は、そのままではつながらない。支援の価値は、条件を仕事で使える形に変える力にある。",
    color: "#7b5134",
  },
  {
    id: "III",
    label: "仕事・評価・将来の設計",
    short: "Worksite Value",
    title: "配慮は、仕事が成り立つ接点の設計である",
    lead:
      "配慮名を探す前に、作業、道具、情報、指示、安全、評価、役割、学びがどこで接触しているかを見る。雇用されたかではなく、参加の質を読む。",
    color: "#545f2f",
  },
];

const principles = [
  ["条件名を答えにしない", "病名・障害名・制度カテゴリは、答えではなく相互作用を見る窓として使う。"],
  ["一つの説明に閉じない", "本人、職場、支援、生活保障、評価、情報形式など複数の読みを残す。"],
  ["支援名を効果の証明にしない", "支援や配慮の名前ではなく、どの余地を開いたかを見る。"],
  ["根拠の種類と現在性を分ける", "本人の声、職場回答、研究、古い調査、公式資料の見える範囲を分ける。"],
  ["情報共有は同意と目的で区切る", "誰に、何のために、どこまで、いつ更新するかを分ける。"],
  ["結論より先に問いを残す", "個別の正解に急がず、構造、別の読み、足りない文脈、次に聞く問いを残す。"],
];

const patterns = [
  {
    n: 1,
    plane: 0,
    title: "負荷をならす",
    question: "作業量、密度、締切、休憩は、体調の波とどう接しているか。",
    core:
      "体調変動は、本人の不安定さだけを意味しない。仕事の量、密度、順序、休憩、通勤、翌日の回復時間と重なることで、続ける余地が狭まったり広がったりする。",
    example:
      "ある人は通常業務では安定しているが、月末の締切が重なると翌日まで疲労が残る。職場は「波がある」と見るが、実際には締切、休憩の取りにくさ、帰宅後の回復不足が重なっている。",
    reading:
      "この場面では、働けるかではなく、どこで負荷が急に高くなるかを地図にする。作業を小さくするだけでなく、山場の順序、休憩の取り方、翌日への影響、相談のタイミングを見る。",
    check: ["負荷が高くなる作業・時間帯・場所はどこか。", "休憩や作業順序の変更で翌日への影響は変わるか。", "負荷が上がった時、本人だけが抱え込む形になっていないか。"],
    stop: "短時間勤務を入れれば解決、または本人が安定すべき、という読みで閉じない。",
  },
  {
    n: 2,
    plane: 0,
    title: "治療と仕事時間を合わせる",
    question: "治療、通院、服薬、回復時間は、勤務、引継ぎ、評価、収入と衝突していないか。",
    core:
      "治療時間は、仕事の外側にある私用ではなく、働き続ける条件の一部である。通院や回復を仕事設計に入れないと、健康を守る時間と評価される時間がぶつかる。",
    example:
      "通院日は遅刻扱いにはならないが、重要な朝会に出られず情報が抜ける。本人は治療を優先しているだけなのに、周囲からは参加が弱いように見える。",
    reading:
      "見るべきは、通院可否だけではない。治療後の回復、引継ぎ、会議情報、評価、収入への影響までを一つの流れとして見る。",
    check: ["治療や通院の周期は、業務の山場とどう重なるか。", "治療後の回復時間は仕事設計に入っているか。", "時間調整が評価や収入不安につながっていないか。"],
    stop: "通院を許可したかどうかだけで十分と考えない。",
  },
  {
    n: 3,
    plane: 0,
    title: "休む・戻る道筋を作る",
    question: "休む、短く戻る、役割を変える、再調整する道はあるか。",
    core:
      "休むことは、就労継続の失敗ではない。戻り方が設計されていない時に、休職や悪化は、辞めるか我慢するかの二択になりやすい。",
    example:
      "体調悪化で一度休んだ人が、復職時に元の業務量へすぐ戻される。本人は再発を恐れているが、職場には段階復帰の手順がない。",
    reading:
      "復職は元に戻ることだけではない。戻る時の仕事量、役割、評価、相談線、再調整の時点を決めることが、継続の回路になる。",
    check: ["休む前、休んでいる間、戻る時に相談線が切れていないか。", "段階的に戻るための仕事量・役割・評価はあるか。", "同じ働き方に戻ることだけが復職になっていないか。"],
    stop: "休職を本人の離脱、復職を元の状態への復元としてだけ扱わない。",
  },
  {
    n: 4,
    plane: 0,
    title: "移動と休憩場所まで含める",
    question: "通勤、職場内移動、姿勢、休息場所は、仕事前後の体力をどう変えるか。",
    core:
      "仕事そのものが調整されていても、通勤や休息場所が設計されていなければ、働く前に選択肢が狭まる。移動と休息は背景ではなく、仕事参加の条件である。",
    example:
      "作業時間は短く調整されているが、通勤で体力を使い切り、職場には横になれる場所もない。本人は勤務中より、勤務前後で消耗している。",
    reading:
      "業務内容だけを見ると見落とす。通勤、職場内移動、座席、温度、音、照明、休息場所を同じ図に置くと、仕事が始まる前に閉じている余地が見えてくる。",
    check: ["通勤や職場内移動が疲労や痛みを増幅していないか。", "休憩場所は実際に使える位置・時間・雰囲気にあるか。", "作業場所の環境条件が活動や集中を妨げていないか。"],
    stop: "設備があることと、本人が安心して使えることを同じにしない。",
  },
  {
    n: 5,
    plane: 0,
    title: "待てる余地をつくる",
    question: "生活保障や制度条件は、待つ、休む、試す、選び直す余地を開いているか。",
    core:
      "生活が不安定な時、人は条件を整える前に、急いで仕事を決めざるを得ない。生活保障は背景ではなく、選択肢を直接左右する設計変数である。",
    example:
      "支援者は慎重に職場を探したいが、本人は医療費と家計不安から早く働きたい。結果として、体調に合わない仕事でも断りにくくなる。",
    reading:
      "意欲や準備性だけで読まない。収入、医療費、制度カテゴリ、家族資源、地域資源が、待てる時間や試せる機会をどう変えるかを見る。",
    check: ["収入不安が治療や職場選択を急がせていないか。", "制度カテゴリの外にいることで相談や支援の入口が閉じていないか。", "待つ、休む、試す、選び直す余地はあるか。"],
    stop: "本人の選択を本人の意思だけで説明しない。",
  },
  {
    n: 6,
    plane: 0,
    title: "評価・収入との衝突を見る",
    question: "調整された働き方は、評価、処遇、契約、収入、将来見通しと衝突していないか。",
    core:
      "配慮があっても、その働き方が低い評価、低い収入、固定的な役割につながるなら、参加の質は高まらない。健康時間と評価の衝突を見る必要がある。",
    example:
      "通院のため勤務時間を調整している人が、昇進や重要業務から外され続ける。職場は配慮しているつもりだが、本人には将来が狭まって見える。",
    reading:
      "配慮の有無ではなく、調整された働き方がどの基準で評価されているかを見る。評価、賃金、役割、学び、生活できる収入を切り離さない。",
    check: ["調整後の成果はどの基準で評価されているか。", "通院や短時間が処遇や役割の固定化につながっていないか。", "健康維持と生活できる収入は両立しているか。"],
    stop: "配慮があるからよい状態だと見ない。",
  },
  {
    n: 7,
    plane: 0,
    title: "変化を話し直せる",
    question: "体調、生活、職場条件が変わった時、話し直せる場所はあるか。",
    core:
      "体調や生活は変化する。一度決めた配慮や役割を固定すると、変化した時に本人が説明し直す負担だけが増える。",
    example:
      "最初の配慮合意では問題がなかったが、治療変更で疲労の出方が変わった。本人は言い出しにくく、職場は最初の合意がまだ有効だと思っている。",
    reading:
      "初回合意を完成形にしない。変化、悪化予兆、将来不安、再発、生活変化を話し直すタイミングと相手を決めておく。",
    check: ["変化を誰にどう伝え直せるか。", "変更の話し合いが評価低下や関係悪化と結びついていないか。", "将来不安を今の仕事設計に接続できているか。"],
    stop: "将来不安を本人の心配性として片づけない。",
  },
  {
    n: 8,
    plane: 1,
    title: "求人と本人条件をすり合わせる",
    question: "求人要件、職務、生活、健康時間、本人希望は、相互に置き換えられているか。",
    core:
      "求人票の言葉と本人の生活・機能の言葉がつながらないと、応募前から選択肢が狭まる。求人要件は、具体的な作業条件へ分けて読む必要がある。",
    example:
      "求人票には「臨機応変な対応」とある。本人は不安を感じて応募を迷うが、実際には一部の電話対応と予定変更への連絡が中心だった。",
    reading:
      "抽象語をそのまま能力要件にしない。作業、時間、対人、判断、環境、評価へ分解し、本人条件と職務条件を同じ地図に置く。",
    check: ["求人の抽象語は具体作業へ分解されているか。", "本人の希望や制約は職務条件に置き換えられているか。", "試せる余地や職務調整の余地はあるか。"],
    stop: "本人を求人条件に合わせるだけにしない。",
  },
  {
    n: 9,
    plane: 1,
    title: "見学・実習で仕事像を確かめる",
    question: "体験で見えた作業、環境、相談線、評価は、採用後に引き継がれているか。",
    core:
      "見学や実習は、適性判定だけの場ではない。仕事像、生活リズム、作業接点、ストレス、相談線を確認し、採用後の設計へ渡す場である。",
    example:
      "実習中は支援者がそばにいて作業が安定したが、採用後はその支援がなくなり、実習で見えた手順上の工夫も引き継がれなかった。",
    reading:
      "体験で見えた情報を、採用可否だけで消費しない。採用後の作業手順、相談線、評価、休憩、情報形式へ接続する。",
    check: ["実際の作業、環境、評価、相談線を体験で確認できているか。", "体験で見えた条件は採用後に引き継がれているか。", "失敗や違和感を設計情報として扱えているか。"],
    stop: "実習を適性判定だけにしない。",
  },
  {
    n: 10,
    plane: 1,
    title: "伝える範囲を目的で決める",
    question: "誰に、何のために、どこまで、いつ更新するか。",
    core:
      "開示は、病名を伝えるかどうかだけではない。必要なのは、仕事で使う情報と守る情報を、目的と同意範囲で分けることだ。",
    example:
      "本人は病名を言うべきか迷っている。職場が本当に知る必要があるのは、病名そのものではなく、急な疲労時の連絡方法と休憩の取り方だった。",
    reading:
      "開示を善悪や勇気の問題にしない。業務影響、調整目的、共有先、更新時点を整理する。伝えない権利と調整を得る権利を両立させる。",
    check: ["共有する情報は業務影響や調整目的に結びついているか。", "伝えない情報と伝える情報は分かれているか。", "同意範囲、更新時点、共有先は明確か。"],
    stop: "病名共有を配慮取得の必須条件のように扱わない。",
  },
  {
    n: 11,
    plane: 1,
    title: "人・仕事・制度をつなぎ直す",
    question: "支援は、本人条件、職場条件、制度条件、評価を仕事で使える形につないでいるか。",
    core:
      "支援の価値は、支援機関が存在することではない。本人の言葉、職場の不安、制度情報、評価基準を、仕事で使える形につなぎ直すことにある。",
    example:
      "相談先はあるが、相談内容が職場の作業手順に反映されない。職場の不安も支援者に伝わらず、本人だけが調整を説明し続けている。",
    reading:
      "支援量ではなく、支援が何をつないでいるかを見る。本人条件を職務条件へ、職場不安を作業・安全・人員余力へ、制度情報を生活保障や調整へ置き換える。",
    check: ["支援者は本人の言葉を職務条件や職場手順へ置き換えているか。", "職場不安を安全、人員余力、作業手順へ分けているか。", "制度情報は生活保障や職場調整へ接続しているか。"],
    stop: "支援機関につながっていることを、支援が機能していることと同じにしない。",
  },
  {
    n: 12,
    plane: 1,
    title: "戻れる相談ルートを残す",
    question: "採用後、変化時、評価時、休職時、復職時に戻れる相談線はあるか。",
    core:
      "相談は就職前だけで終わらない。仕事が始まってから、変化、評価、休職、復職のたびに、条件をつなぎ直す場所が必要になる。",
    example:
      "就職後に困りごとが出たが、支援は就職決定で終わった扱いになり、本人も上司も誰に相談すればよいか分からない。",
    reading:
      "相談窓口の有無ではなく、相談後に仕事手順や評価へ反映される回路を見る。本人、上司、人事、支援者が孤立していないかを確認する。",
    check: ["就職後に困った時、どこへ戻れるか。", "相談が本人、職場、人事、支援者の間で孤立していないか。", "相談後に職場手順や評価へ反映されるか。"],
    stop: "就職決定を支援終了とみなさない。",
  },
  {
    n: 13,
    plane: 1,
    title: "情報を分かる手順に変える",
    question: "文書、音声、会議、口頭指示、非公式情報は、仕事手順へ同期されているか。",
    core:
      "情報形式が合わないと、能力があっても参加できない。情報を分かる形にするだけでなく、実際の仕事手順として使えるように同期する必要がある。",
    example:
      "重要な変更は会議後の雑談で伝わる。本人には公式文書だけが届くため、何が変わったか分からず、結果としてミスが増える。",
    reading:
      "理解不足を本人の問題にしない。口頭、文書、会議、チャット、非公式情報、安全確認がどこでこぼれるかを見る。",
    check: ["指示や会議情報は本人が使える形式になっているか。", "安全確認や変更連絡は非公式な場だけで流れていないか。", "文書、図、音声、実演、チェックリストは同期しているか。"],
    stop: "手順書があることと、仕事で使えることを同じにしない。",
  },
  {
    n: 14,
    plane: 1,
    title: "見え方のズレを見つける",
    question: "本人、職場、人事、支援者、資料は、同じ出来事をどう違って見ているか。",
    core:
      "視点差はノイズではない。同じ出来事の見え方がずれる時、どこで言葉や情報がつながっていないかが見える。",
    example:
      "本人は疲労を訴え、上司は勤務の安定性を心配し、人事は制度対応済みと考えている。三者とも嘘をついていないが、見ている場所が違う。",
    reading:
      "一つの視点を正解にしない。本人、上司、人事、支援者、調査・資料が何を見て何を見ていないかを分ける。",
    check: ["本人が困っている点と職場が不安に思っている点は対応しているか。", "支援者の説明は本人や職場の実感とずれていないか。", "資料やデータは誰の視点からの情報か。"],
    stop: "三者差や資料差を単なる不一致として捨てない。",
  },
  {
    n: 15,
    plane: 2,
    title: "作業・道具・座席を合わせる",
    question: "作業、道具、設備、座席、動線、姿勢、機器は、機能や活動とどう接しているか。",
    core:
      "配慮名を探す前に、仕事の接点を具体的に見る。作業、道具、姿勢、動線、機器が少し変わるだけで、疲労や遂行のしやすさが変わることがある。",
    example:
      "本人は作業が遅いと言われているが、実際には道具の置き場所と確認画面の位置が合わず、毎回余分な移動と確認が発生している。",
    reading:
      "本人の能力評価へ進む前に、作業のどの部分が身体、感覚、認知、疲労と接しているかを分ける。",
    check: ["作業のどの部分が機能や活動と接しているか。", "道具、座席、配置、姿勢、機器の変更で何が変わるか。", "必須接点と変更可能な接点はどこか。"],
    stop: "作業分析なしに、本人側の能力評価へ進まない。",
  },
  {
    n: 16,
    plane: 2,
    title: "安全・顧客・人員余力を見込む",
    question: "安全要件、顧客対応、人員余力、欠勤代替、現場責任は、調整可能性をどう変えるか。",
    core:
      "職場側の不安は、偏見だけとは限らない。安全、顧客、人員余力、代替体制が未分解のままだと、職場も本人も動きにくい。",
    example:
      "上司は受け入れたいが、少人数シフトで欠勤代替がなく、安全確認も一人に集中している。支援したい気持ちだけでは実装できない。",
    reading:
      "職場不安を、善意か差別かの二分法で見ない。何が実際の制約で、どこなら設計できるかを分ける。",
    check: ["安全や顧客対応のどの部分が制約になっているか。", "人員余力や代替体制は調整を支えられるか。", "現場責任が本人や一人の上司に集中していないか。"],
    stop: "職場不安をすべて理解不足として片づけない。安全を理由に過剰排除もしない。",
  },
  {
    n: 17,
    plane: 2,
    title: "情報アクセスを整える",
    question: "重要情報は、誰に、どの形式で届いているか。",
    core:
      "仕事能力があっても、会議、文書、音声、ICT、非公式連絡にアクセスできなければ、判断や関係形成、評価に参加しにくくなる。",
    example:
      "会議資料はあるが、会議中の補足説明や雑談で決まった実務変更は記録されない。本人は公式情報だけを見て作業し、周囲とのズレが広がる。",
    reading:
      "情報保障を会議参加だけに縮めない。公式情報と非公式情報、文書と音声、会議とチャット、感覚刺激や情報量まで見る。",
    check: ["重要情報は誰にどの形式で届いているか。", "会議や非公式情報からこぼれる人はいないか。", "感覚刺激や情報量が疲労や集中を悪化させていないか。"],
    stop: "ICT導入を、それだけで解決策とみなさない。",
  },
  {
    n: 18,
    plane: 2,
    title: "指示・切替・記憶負荷を整える",
    question: "指示、優先順位、完了条件、切替、同時並行、確認は、仕事遂行をどう変えているか。",
    core:
      "ミスや遅れは、本人特性だけでなく、指示の曖昧さ、切替の多さ、記憶負荷、確認回路の不足から生まれることがある。",
    example:
      "本人は指示を聞いた直後は理解しているが、複数業務が割り込むと優先順位を失う。上司は「覚えていない」と見るが、仕事の切替設計が弱い。",
    reading:
      "手順を細かくすればよいと単純化しない。開始、切替、完了、確認、失敗から戻る道を設計する。",
    check: ["作業の開始、切替、完了確認は明確か。", "記憶や同時並行に過剰な負荷がかかっていないか。", "失敗した時に戻れる確認回路があるか。"],
    stop: "ミスや遅れを本人特性だけで説明しない。",
  },
  {
    n: 19,
    plane: 2,
    title: "成果の見方を合わせる",
    question: "調整された条件下の成果は、どう評価されているか。",
    core:
      "働けていることと、仕事として評価されていることは同じではない。役割、成果、評価、賃金、昇進、面談は参加の質の中核である。",
    example:
      "本人は安定して働いているが、配慮対象だからと難しい仕事から外され続ける。職場は負担を避けているつもりでも、本人には低い期待として届く。",
    reading:
      "雇用継続だけを成功にしない。配慮下の成果をどう見るか、評価と処遇がどうつながるかを話し合う。",
    check: ["調整された条件下の成果はどの基準で評価されているか。", "役割や賃金が配慮を理由に不当に固定化されていないか。", "評価面談で将来や学習が話されているか。"],
    stop: "評価や処遇を就労支援の外に置かない。",
  },
  {
    n: 20,
    plane: 2,
    title: "学び・役割・キャリアにつなげる",
    question: "学習、職務拡張、役割変更、将来希望は、支援や評価と接続しているか。",
    core:
      "仕事は、今の作業をこなすだけではない。学び、役割の広がり、将来希望が接続して初めて、参加は厚みを持つ。",
    example:
      "仕事には慣れているが、新しい業務を任される機会がない。本人は成長したいが、職場は安定を崩したくないと考えている。",
    reading:
      "安定就労を、同じ役割に固定することと混同しない。体調や支援を前提にしながら、学びと役割の広がりを設計する。",
    check: ["新しい仕事を学ぶ機会はあるか。", "支援や配慮が役割拡張を止める方向に働いていないか。", "本人の将来希望と職場の育成・評価は話し合われているか。"],
    stop: "キャリアを障害者雇用や支援の後回しにしない。",
  },
  {
    n: 21,
    plane: 2,
    title: "職場規模・地域資源に合わせる",
    question: "職場規模、地域資源、業種、支援接続は、同じ構造の実装可能性をどう変えるか。",
    core:
      "同じ支援や仕事設計でも、小規模職場、大企業、地域資源、業種によって実装可能性は変わる。一般論としてよい支援でも、現場条件に合わなければ機能しない。",
    example:
      "大企業で使える専門部署連携の方法を、小規模職場にそのまま求めると、上司一人に負担が集中する。別の外部支援接続が必要になる。",
    reading:
      "職場や地域の資源差を努力不足として見ない。同じ構造を、その職場の条件でどう実装できるかを見る。",
    check: ["職場規模や地域資源は相談線や調整余力をどう変えるか。", "外部支援、医療、福祉、産業保健、行政は接続可能か。", "同じ構造をその職場の条件でどう実装できるか。"],
    stop: "大企業前提の支援モデルを小規模職場へそのまま当てない。",
  },
];

const frameShifts = [
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
];

const scenes = [
  {
    n: 1,
    title: "体調の波を、仕事時間の地図に置く",
    short: "時間の地形図",
    lead:
      "働く力は、勤務時間の中だけで決まらない。仕事の前後にある通勤、治療、回復、休息、生活時間までを同じ地図に置く。",
    story:
      "ある人は仕事そのものは好きで、作業内容も理解している。しかし繁忙期と通勤が重なると疲労が翌日まで残る。職場には「日によって安定しない」と見え、本人には「続けたいが、このままだと持たない」と見えている。",
    diagram: "time",
    patternIds: [1, 2, 3, 4, 7],
    shift: ["体調が安定してから働く", "変動がある中で、続ける条件を設計する"],
    falcon:
      "ここでFalconが見るのは、働けるかどうかの判定ではない。負荷の山、回復時間、通院、通勤、戻り方がどこでつながらず、どこを変えると続ける余地が開くかである。",
    exercise: "勤務時間だけでなく、前後の時間も含めて負荷が高い場所と戻れる場所を一つずつ書く。",
  },
  {
    n: 2,
    title: "待つ・休む・試す余地をつくる",
    short: "待つ・休む・試す余地の地図",
    lead:
      "生活保障は就労支援の背景ではない。待つ、休む、試す、選び直す余地を直接開閉する条件である。",
    story:
      "体調を考えると、少し待って条件を調整した方がよさそうに見える。しかし収入不安、医療費、家族の事情があり、本人は早く仕事を決めざるを得ない。支援者には「希望が定まらない」と見えている。",
    diagram: "freedom",
    patternIds: [5, 6],
    shift: ["本人の意欲や準備性を見る", "生活保障が選択肢をどう狭めるかを見る"],
    falcon:
      "急いだ選択を本人の意思だけで読まない。生活できること、治療できること、評価されること、選び直せることが同時に成り立つかを見る。",
    exercise: "本人が本当は選びたいが選べていない選択肢を一つ挙げ、その制約が収入、制度、評価のどこから来ているかを書く。",
  },
  {
    n: 3,
    title: "求人票の言葉を、働く場面にほどく",
    short: "求人票を仕事場面へ分解する",
    lead:
      "求人票の言葉と本人の生活・機能の言葉は、そのままではつながらない。抽象語を作業場面へほどく必要がある。",
    story:
      "求人票には「臨機応変な対応」とある。本人は不安で応募を迷うが、実際には一部の電話対応と予定変更への連絡が中心だった。言葉が抽象的なまま、応募前に選択肢が狭まっている。",
    diagram: "translation",
    patternIds: [8, 9, 10],
    shift: ["求人条件に本人を合わせる", "求人と本人条件を相互に翻訳する"],
    falcon:
      "Falconは病名別の向き不向きではなく、求人の抽象語を作業、時間、対人、判断、環境、評価へ分解する。入口で仕事像が見えるほど、試す余地が生まれる。",
    exercise: "求人票にある抽象語を一つ選び、実際の作業、時間、対人、判断へ分けて書く。",
  },
  {
    n: 4,
    title: "支援を、現場で使える翻訳にする",
    short: "翻訳橋と相談ルート",
    lead:
      "支援があることと、支援が仕事に届くことは同じではない。支援の価値は、本人・職場・制度の言葉をつなぎ直す力にある。",
    story:
      "相談先はあるが、相談内容が職場の作業手順に反映されない。職場の不安も支援者に届かず、本人だけが毎回説明している。支援はあるのに、仕事の条件が変わらない。",
    diagram: "bridge",
    patternIds: [11, 12, 14, 13],
    shift: ["支援につながれば前進である", "支援が何を再翻訳しているかを見る"],
    falcon:
      "Falconは支援量ではなく再翻訳容量を見る。本人の言葉が職務条件へ、職場の不安が安全・人員余力・評価へ、制度情報が生活保障や調整へ変わっているかを見る。",
    exercise: "本人、職場、支援者の言葉がずれている点を一つ書き、それを仕事で使える問いへ置き換える。",
  },
  {
    n: 5,
    title: "情報・手順・確認がずれるとき",
    short: "職場断面図と情報フロー",
    lead:
      "ミスや確認の多さは、本人の能力だけで起きるとは限らない。情報、手順、道具、確認先、評価が少しずつずれていることがある。",
    story:
      "会議で作業手順の一部が変わったが、手順書は更新されず、チャットには短い補足だけが流れた。本人は古い手順書を見ながら作業し、違和感を覚えて確認した。上司には、前にも説明したことをまた聞いているように見えた。",
    diagram: "worksite",
    patternIds: [13, 15, 17, 18],
    shift: ["同じ確認をする人の問題を見る", "情報が仕事手順になる流れを見る"],
    falcon:
      "ここでFalconは、確認が多い人を探さない。変更情報が使える手順になったか、確認が評価不安に変わっていないか、失敗から戻る道があるかを見る。",
    exercise: "最近の変更情報を一つ選び、会議、文書、チャット、実作業、評価のどこでずれているかを書く。",
  },
  {
    n: 6,
    title: "職場の不安を、実装条件に分解する",
    short: "安全・顧客・人員余力の比較図",
    lead:
      "職場側の不安は、偏見だけとも正当な理由だけとも決めつけない。安全、顧客、人員余力、地域資源へ分解して見る。",
    story:
      "上司は受け入れたいが、少人数シフトで欠勤代替がなく、安全確認も一人に集中している。支援したい気持ちはあるが、このままだと本人にも上司にも負担が集中する。",
    diagram: "implementation",
    patternIds: [16, 21],
    shift: ["職場の理解不足として片づける", "実装条件を分けて設計余地を見る"],
    falcon:
      "Falconは職場を免責しないし、単純に断罪もしない。現場責任、安全、顧客、人員余力、地域資源を分け、どこなら実装できるかを探す。",
    exercise: "職場側の不安を一つ挙げ、安全、顧客、人員余力、代替体制、地域資源のどれに関係するか分ける。",
  },
  {
    n: 7,
    title: "「働けている」の先にある参加の質",
    short: "参加の質を読む",
    lead:
      "雇用が続いていることと、参加の質が高いことは同じではない。役割、評価、賃金、学び、将来見通しまでを見る。",
    story:
      "本人は安定して働いているが、配慮対象だからと難しい仕事から外され続けている。職場は負担を避けているつもりだが、本人には低い期待として届いている。",
    diagram: "value",
    patternIds: [19, 20],
    shift: ["就職・定着できれば成功である", "役割、評価、学び、将来まで含めて参加を見る"],
    falcon:
      "Falconは就労有無だけで成功を見ない。調整された条件下の成果がどう評価され、役割や学びや将来会話につながっているかを見る。",
    exercise: "現在の役割が、評価、学び、将来希望のどれにつながっているか、つながっていないかを書く。",
  },
];

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function slug(n) {
  return `p${String(n).padStart(2, "0")}`;
}

function renderPrism() {
  return `
    <svg class="prism" viewBox="0 0 980 540" role="img" aria-label="三面プリズム図">
      <defs>
        <linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#e7f2f0"/><stop offset="1" stop-color="#c8ded8"/></linearGradient>
        <linearGradient id="g2" x1="0" x2="1"><stop offset="0" stop-color="#f3e8dc"/><stop offset="1" stop-color="#dfc7ae"/></linearGradient>
        <linearGradient id="g3" x1="0" x2="1"><stop offset="0" stop-color="#ecefdd"/><stop offset="1" stop-color="#cfd6b2"/></linearGradient>
      </defs>
      <rect x="0" y="0" width="980" height="540" rx="28" fill="#f8f6f1"/>
      <polygon points="490,70 185,405 490,465" fill="url(#g1)" stroke="#315e62" stroke-width="3"/>
      <polygon points="490,70 795,405 490,465" fill="url(#g2)" stroke="#7b5134" stroke-width="3"/>
      <polygon points="185,405 795,405 490,465" fill="url(#g3)" stroke="#5b6631" stroke-width="3"/>
      <circle cx="490" cy="332" r="86" fill="#fffdf8" stroke="#2f2f2f" stroke-width="2"/>
      <text x="490" y="318" text-anchor="middle" class="svg-title">参加の余地</text>
      <text x="490" y="350" text-anchor="middle" class="svg-small">続ける・試す・戻る・育つ</text>
      <text x="326" y="265" text-anchor="middle" class="svg-label">体調・治療・生活時間</text>
      <text x="652" y="265" text-anchor="middle" class="svg-label">入口・相談・情報共有</text>
      <text x="490" y="437" text-anchor="middle" class="svg-label">仕事・評価・将来</text>
      <path d="M305 178 C383 144 590 144 675 178" fill="none" stroke="#4d4d4d" stroke-width="2" stroke-dasharray="8 8"/>
      <text x="490" y="132" text-anchor="middle" class="svg-small">同じ場を三方向から見る</text>
    </svg>`;
}

function renderTimeMap() {
  return `
    <svg class="figure-svg" viewBox="0 0 920 360" role="img" aria-label="時間の地形図">
      <rect x="0" y="0" width="920" height="360" rx="24" fill="#f7faf8"/>
      <path d="M60 230 C150 120, 220 270, 310 155 S495 125, 585 210 S750 285, 860 145" fill="none" stroke="#25636f" stroke-width="8" stroke-linecap="round"/>
      <line x1="70" y1="284" x2="850" y2="284" stroke="#9aa8a7" stroke-width="2"/>
      ${["起床", "通勤", "作業山場", "休憩", "通院", "回復", "翌日"].map((t, i) => {
        const x = 80 + i * 125;
        return `<circle cx="${x}" cy="284" r="8" fill="#25636f"/><text x="${x}" y="318" text-anchor="middle" class="svg-small">${t}</text>`;
      }).join("")}
      <rect x="300" y="66" width="176" height="52" rx="14" fill="#fff" stroke="#25636f" stroke-width="2"/>
      <text x="388" y="99" text-anchor="middle" class="svg-small">負荷が高い場所</text>
      <rect x="620" y="222" width="166" height="52" rx="14" fill="#fff" stroke="#7b5134" stroke-width="2"/>
      <text x="703" y="255" text-anchor="middle" class="svg-small">戻れる場所</text>
    </svg>`;
}

function renderBridge() {
  const nodes = [
    ["本人の生活語", 115, 86, "#e7f2f0"],
    ["職場の仕事語", 720, 86, "#ecefdd"],
    ["支援・制度の言葉", 415, 236, "#f3e8dc"],
  ];
  return `
    <svg class="figure-svg" viewBox="0 0 920 360" role="img" aria-label="翻訳橋">
      <rect x="0" y="0" width="920" height="360" rx="24" fill="#fbf8f4"/>
      <path d="M230 115 C330 72, 510 72, 625 115" fill="none" stroke="#7b5134" stroke-width="8" stroke-linecap="round"/>
      <path d="M210 145 C320 225, 575 225, 700 145" fill="none" stroke="#7b5134" stroke-width="4" stroke-dasharray="10 10"/>
      ${nodes.map(([t, x, y, c]) => `<rect x="${x}" y="${y}" width="190" height="68" rx="18" fill="${c}" stroke="#333" stroke-width="2"/><text x="${x + 95}" y="${y + 42}" text-anchor="middle" class="svg-label">${t}</text>`).join("")}
      <circle cx="460" cy="143" r="60" fill="#fffdf8" stroke="#7b5134" stroke-width="3"/>
      <text x="460" y="134" text-anchor="middle" class="svg-title">置き換え</text>
      <text x="460" y="162" text-anchor="middle" class="svg-small">仕事で使える言葉へ</text>
    </svg>`;
}

function renderWorksite() {
  return `
    <svg class="figure-svg" viewBox="0 0 920 360" role="img" aria-label="職場の断面図">
      <rect x="0" y="0" width="920" height="360" rx="24" fill="#fafbf5"/>
      <rect x="80" y="88" width="240" height="150" rx="18" fill="#fff" stroke="#545f2f" stroke-width="3"/>
      <text x="200" y="130" text-anchor="middle" class="svg-label">作業・道具・座席</text>
      <text x="200" y="170" text-anchor="middle" class="svg-small">動線 / 姿勢 / 確認</text>
      <rect x="365" y="64" width="210" height="98" rx="18" fill="#fff" stroke="#25636f" stroke-width="3"/>
      <text x="470" y="106" text-anchor="middle" class="svg-label">情報・指示</text>
      <text x="470" y="134" text-anchor="middle" class="svg-small">会議 / 文書 / 口頭</text>
      <rect x="610" y="170" width="220" height="116" rx="18" fill="#fff" stroke="#7b5134" stroke-width="3"/>
      <text x="720" y="214" text-anchor="middle" class="svg-label">評価・役割・学び</text>
      <text x="720" y="244" text-anchor="middle" class="svg-small">成果 / 処遇 / 将来</text>
      <path d="M320 164 L365 118 M575 120 L634 178 M320 218 C450 284, 560 286, 610 238" fill="none" stroke="#777" stroke-width="3" stroke-dasharray="8 8"/>
    </svg>`;
}

function renderFrameShift() {
  return `
    <section class="page-break shift-page">
      <h2>この本の見方の転換</h2>
      <p class="lead">障害や難病の就労支援で見えてくるのは、特別な人だけの問題ではない。標準的な働き方が暗黙に前提としてきた「同じ時間に、同じ場所で、同じ情報を、同じ速さで処理できる人」という仮定を見直す入口である。</p>
      <div class="shift-grid">
        ${frameShifts.map((item) => `
          <div class="shift-card">
            <div class="shift-old"><span>これまでの見方</span><p>${esc(item.common)}</p></div>
            <div class="shift-arrow">↓ 見方を転換</div>
            <div class="shift-new"><span>この本の見方</span><p>${esc(item.newView)}</p></div>
          </div>`).join("")}
      </div>
      <p>この転換が、七つの現場場面と21の視点を貫く芯である。支援を「例外対応」としてではなく、仕事と社会を人間の多様性に合わせて設計し直す技術として読む。</p>
    </section>`;
}

function renderSceneDiagram(kind) {
  if (kind === "time") return renderTimeMap();
  if (kind === "bridge" || kind === "translation") return renderBridge();
  if (kind === "worksite") return renderWorksite();
  if (kind === "freedom") {
    return `
      <svg class="figure-svg" viewBox="0 0 920 360" role="img" aria-label="待つ・休む・試す余地の地図">
        <rect x="0" y="0" width="920" height="360" rx="24" fill="#fff8ef"/>
        ${["待つ", "休む", "試す", "選び直す"].map((t, i) => {
          const x = 145 + i * 210;
          return `<circle cx="${x}" cy="165" r="58" fill="#fff" stroke="#7b5134" stroke-width="4"/><text x="${x}" y="174" text-anchor="middle" class="svg-label">${t}</text>`;
        }).join("")}
        <path d="M205 165 L295 165 M415 165 L505 165 M625 165 L715 165" stroke="#7b5134" stroke-width="5" stroke-linecap="round"/>
        <text x="460" y="276" text-anchor="middle" class="svg-small">収入・医療費・制度・家族資源が、選択肢の幅を変える</text>
      </svg>`;
  }
  if (kind === "implementation") {
    return `
      <svg class="figure-svg" viewBox="0 0 920 360" role="img" aria-label="職場実装条件の比較図">
        <rect x="0" y="0" width="920" height="360" rx="24" fill="#f8faf2"/>
        ${[
          ["安全", 115, 90],
          ["顧客", 360, 90],
          ["人員余力", 605, 90],
          ["代替体制", 238, 218],
          ["地域資源", 482, 218],
        ].map(([t, x, y]) => `<rect x="${x}" y="${y}" width="190" height="74" rx="18" fill="#fff" stroke="#545f2f" stroke-width="3"/><text x="${x + 95}" y="${y + 45}" text-anchor="middle" class="svg-label">${t}</text>`).join("")}
        <path d="M210 127 L360 127 M455 127 L605 127 M333 218 L210 164 M575 218 L700 164" stroke="#8b9273" stroke-width="3" stroke-dasharray="8 8"/>
        <text x="460" y="324" text-anchor="middle" class="svg-small">職場の不安を分けると、設計できる場所が見える</text>
      </svg>`;
  }
  return `
    <svg class="figure-svg" viewBox="0 0 920 360" role="img" aria-label="参加の質">
      <rect x="0" y="0" width="920" height="360" rx="24" fill="#f8f6f1"/>
      ${["役割", "評価", "学び", "将来"].map((t, i) => {
        const x = 130 + i * 210;
        return `<rect x="${x}" y="112" width="150" height="94" rx="18" fill="#fff" stroke="#315e62" stroke-width="3"/><text x="${x + 75}" y="166" text-anchor="middle" class="svg-label">${t}</text>`;
      }).join("")}
      <path d="M280 159 L340 159 M490 159 L550 159 M700 159 L760 159" stroke="#315e62" stroke-width="4"/>
      <text x="460" y="276" text-anchor="middle" class="svg-small">雇用継続だけでなく、参加の厚みを見る</text>
    </svg>`;
}

function renderReaderLanes() {
  const lanes = [
    ["本人・家族", "これは自分の努力不足として抱え込んでいる話ではないか。"],
    ["支援者", "本人の言葉を、仕事で使える問いへどう置き換えるか。"],
    ["人事・上司", "安全、評価、人員余力、作業手順のどこに制約があるか。"],
    ["政策・サービス設計", "入口、生活保障、職場実装、評価のどこで接続が切れているか。"],
  ];
  return `<div class="reader-lanes">${lanes.map(([label, text]) => `<div><b>${label}</b><span>${text}</span></div>`).join("")}</div>`;
}

function renderScene(scene) {
  const scenePatterns = scene.patternIds
    .map((id) => patterns.find((pattern) => pattern.n === id))
    .filter(Boolean);
  return `
    <article class="scene-chapter page-break" id="scene-${scene.n}">
      <div class="scene-number">第${scene.n}章</div>
      <h2>${esc(scene.title)}</h2>
      <p class="scene-short">${esc(scene.short)}</p>
      <div class="scene-shift">
        <div><span>よくある読み</span><p>${esc(scene.shift[0])}</p></div>
        <strong>→</strong>
        <div><span>Falconの読み</span><p>${esc(scene.shift[1])}</p></div>
      </div>
      <p class="lead">${esc(scene.lead)}</p>
      <section class="story-box">
        <h3>合成場面</h3>
        <p>${esc(scene.story)}</p>
      </section>
      ${renderSceneDiagram(scene.diagram)}
      <section class="scene-patterns">
        <h3>この場面で使う視点</h3>
        <div class="pattern-card-grid">
          ${scenePatterns.map((pattern) => `
            <div class="mini-pattern" style="--accent:${planes[pattern.plane].color}">
              <span>${String(pattern.n).padStart(2, "0")}</span>
              <h4>${esc(pattern.title)}</h4>
              <p>${esc(pattern.question)}</p>
              <small>${esc(pattern.stop)}</small>
            </div>`).join("")}
        </div>
      </section>
      <section class="reader-lane-section">
        <h3>読者別に見る問い</h3>
        ${renderReaderLanes()}
      </section>
      <section class="falcon-note">
        <h3>Falconの専門家コメント</h3>
        <div class="falcon-triad">
          <div><b>構造仮説</b><p>${esc(scene.falcon)}</p></div>
          <div><b>足りない文脈</b><p>本人、職場、支援者、制度・文書のどの見え方がまだ欠けているかを確認する。</p></div>
          <div><b>まだ決めないこと</b><p>病名、障害名、支援名、職場不安から、配慮妥当性や就労可否を急いで決めない。</p></div>
        </div>
      </section>
      <section class="exercise-box">
        <h3>10分で書けるワークシート</h3>
        <div class="worksheet">
          <div><b>今すぐ決めないこと</b><span>____________________________</span></div>
          <div><b>足りない視点</b><span>____________________________</span></div>
          <div><b>次に聞く問い</b><span>${esc(scene.exercise)}</span></div>
        </div>
      </section>
    </article>`;
}

function renderPatternIndex() {
  return `
    <section class="page-break appendix">
      <h2>21視点索引</h2>
      <p class="lead">困った場面から入り、必要に応じて視点へ戻る。視点は支援メニューではなく、仕事と人間の条件が接する場所を読むための道具である。</p>
      <div class="appendix-list">
        <ol>
          ${patterns.map((pattern) => `<li><strong>${String(pattern.n).padStart(2, "0")} ${esc(pattern.title)}</strong><br><span>${esc(pattern.question)}</span></li>`).join("")}
        </ol>
      </div>
    </section>`;
}

function renderMatrix() {
  return `
    <section class="matrix-section page-break">
      <h2>3×7で見る、21の視点</h2>
      <p class="lead">21項目は並列のリストではない。三つの設計面にそれぞれ七つの視点があり、どの場面でも組み合わせて使う。</p>
      <div class="matrix">
        ${planes.map((plane, i) => `
          <div class="matrix-col" style="--accent:${plane.color}">
            <div class="matrix-head">
              <span>${plane.id}</span>
              <strong>${plane.label}</strong>
            </div>
            ${patterns.filter((p) => p.plane === i).map((p) => `<a href="#${slug(p.n)}"><b>${String(p.n).padStart(2, "0")}</b>${esc(p.title)}</a>`).join("")}
          </div>`).join("")}
      </div>
    </section>`;
}

function renderPattern(pattern) {
  const plane = planes[pattern.plane];
  return `
    <article class="pattern page-break" id="${slug(pattern.n)}" style="--accent:${plane.color}">
      <div class="pattern-kicker">第${plane.id}部 ${esc(plane.label)}</div>
      <h2><span>${String(pattern.n).padStart(2, "0")}</span>${esc(pattern.title)}</h2>
      <p class="chapter-question">${esc(pattern.question)}</p>
      <div class="two-col">
        <section>
          <h3>考え方</h3>
          <p>${esc(pattern.core)}</p>
          <p>${esc(pattern.reading)}</p>
        </section>
        <aside class="example-box">
          <h3>合成例</h3>
          <p>${esc(pattern.example)}</p>
        </aside>
      </div>
      <div class="note-grid">
        <section class="check-box">
          <h3>確認したいこと</h3>
          <ul>${pattern.check.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        </section>
        <section class="pause-box">
          <h3>ここで立ち止まる</h3>
          <p>${esc(pattern.stop)}</p>
        </section>
      </div>
    </article>`;
}

function renderHtml() {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>働き方を、条件から設計する</title>
  <style>
    @page { size: A4; margin: 16mm 15mm 18mm; }
    * { box-sizing: border-box; }
    html { color: #292724; font-family: "Hiragino Sans", "Yu Gothic", "YuGothic", "Noto Sans CJK JP", system-ui, sans-serif; line-height: 1.78; }
    body { margin: 0; background: #e9e2d6; padding: 32px 0; }
    main { background: #fffdf8; max-width: 1040px; margin: 0 auto; box-shadow: 0 18px 60px rgba(45,38,27,.16); }
    .page-break { break-before: page; page-break-before: always; }
    .cover { min-height: 760px; padding: 78px 72px 64px; display: flex; flex-direction: column; justify-content: space-between; background: radial-gradient(circle at 70% 20%, #e7f2f0 0, #e7f2f0 22%, transparent 23%), linear-gradient(135deg, #fffdf8 0%, #f3eee4 100%); }
    .cover-label { font-size: 9.5pt; letter-spacing: .08em; color: #666; text-transform: uppercase; }
    h1 { margin: 12mm 0 6mm; font-size: 34pt; line-height: 1.22; font-weight: 800; color: #222; letter-spacing: 0; }
    .subtitle { max-width: 128mm; font-size: 15pt; color: #514d45; line-height: 1.65; }
    .cover-note { border-left: 5px solid #25636f; padding: 4mm 0 4mm 6mm; max-width: 136mm; font-size: 10.5pt; color: #3c3a35; background: rgba(255,255,255,.65); }
    .meta { font-size: 9pt; color: #6f6a61; }
    section, article { padding: 56px 72px; }
    h2 { margin: 0 0 7mm; font-size: 22pt; line-height: 1.35; color: #25231f; letter-spacing: 0; }
    h3 { margin: 7mm 0 2.2mm; font-size: 12.5pt; line-height: 1.45; color: #2f403f; }
    p { margin: 0 0 4mm; font-size: 10.4pt; }
    ul { margin: 0 0 3mm 0; padding-left: 5mm; }
    li { margin: 0 0 1.6mm; font-size: 9.8pt; }
    .lead { font-size: 12.5pt; line-height: 1.75; color: #34312d; max-width: 155mm; }
    .quiet { color: #67625a; font-size: 9.3pt; }
    .part-opener { min-height: 235mm; display: flex; flex-direction: column; justify-content: center; }
    .part-id { font-size: 40pt; line-height: 1; color: var(--accent); font-weight: 800; margin-bottom: 6mm; }
    .part-title { font-size: 25pt; line-height: 1.35; margin-bottom: 6mm; color: #222; }
    .part-lead { font-size: 13pt; max-width: 145mm; }
    .principles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4mm; margin-top: 5mm; }
    .principle { padding: 4mm; border-radius: 4mm; background: #f3f0e8; border-left: 4px solid #7b5134; }
    .principle b { display: block; margin-bottom: 1mm; font-size: 10.5pt; }
    .principle span { font-size: 9pt; color: #555047; }
    .svg-title { font: 700 30px "Hiragino Sans", "Yu Gothic", sans-serif; fill: #25231f; }
    .svg-label { font: 700 22px "Hiragino Sans", "Yu Gothic", sans-serif; fill: #25231f; }
    .svg-small { font: 500 17px "Hiragino Sans", "Yu Gothic", sans-serif; fill: #4f4a43; }
    .prism, .figure-svg { width: 100%; display: block; margin: 7mm 0; }
    .toc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-top: 7mm; }
    .toc-card { border-top: 4px solid var(--accent); background: #f7f4ec; padding: 5mm; border-radius: 4mm; min-height: 42mm; }
    .toc-card h3 { margin-top: 0; color: var(--accent); }
    .toc-card p { font-size: 9.4pt; }
    .matrix { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin-top: 7mm; }
    .matrix-col { border: 1.2px solid #ded8ca; border-radius: 4mm; overflow: hidden; background: #fff; }
    .matrix-head { min-height: 34mm; padding: 5mm; background: color-mix(in srgb, var(--accent) 15%, #fff); border-bottom: 1px solid #ded8ca; }
    .matrix-head span { color: var(--accent); font-weight: 800; font-size: 18pt; display: block; }
    .matrix-head strong { display: block; font-size: 10.5pt; line-height: 1.5; }
    .matrix-col a { display: block; text-decoration: none; color: #282622; padding: 3.1mm 4mm; border-bottom: 1px solid #ece7dc; font-size: 9.2pt; line-height: 1.45; }
    .matrix-col a b { color: var(--accent); margin-right: 2mm; }
    .pattern { padding-top: 0; }
    .pattern-kicker { color: var(--accent); font-size: 9.3pt; font-weight: 700; margin-bottom: 3mm; letter-spacing: .03em; }
    .pattern h2 { border-top: 5px solid var(--accent); padding-top: 5mm; display: flex; align-items: baseline; gap: 4mm; }
    .pattern h2 span { color: var(--accent); font-size: 26pt; font-weight: 800; }
    .chapter-question { font-size: 13pt; font-weight: 700; color: #3c3a35; padding: 4mm 5mm; background: #f3f0e8; border-radius: 4mm; }
    .two-col { display: grid; grid-template-columns: 1.15fr .85fr; gap: 5mm; align-items: start; }
    .example-box { background: #f7f4ec; border-radius: 4mm; padding: 5mm; border: 1px solid #e2dacb; }
    .example-box h3, .check-box h3, .pause-box h3 { margin-top: 0; }
    .note-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-top: 5mm; }
    .check-box, .pause-box { padding: 5mm; border-radius: 4mm; }
    .check-box { background: #f5faf8; border: 1px solid #cfddd9; }
    .pause-box { background: #fff7ec; border: 1px solid #e5d1b9; }
    .boundary { background: #f2f2f0; border-left: 5px solid #3d3b37; padding: 5mm 6mm; margin: 6mm 0; }
    .three-entry { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; margin: 7mm 0; }
    .entry-card { padding: 5mm; border-radius: 4mm; background: #fff; border: 1px solid #ded8ca; border-top: 5px solid var(--accent); }
    .entry-card h3 { color: var(--accent); margin-top: 0; }
    .shift-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5mm; margin: 8mm 0; }
    .shift-card { border: 1px solid #ded8ca; background: #fff; border-radius: 3mm; overflow: hidden; }
    .shift-old { background: #f6f2ea; padding: 4mm; border-bottom: 1px solid #ded8ca; }
    .shift-old span, .shift-new span { display: block; font-size: 8.2pt; color: #6f685f; font-weight: 700; margin-bottom: 1mm; }
    .shift-old p { margin: 0; font-size: 9pt; color: #6d665e; }
    .shift-arrow { text-align: center; color: #25636f; font-weight: 800; font-size: 12pt; padding: 2.5mm 0; }
    .shift-new { background: #edf6f4; border-top: 4px solid #25636f; padding: 5mm; }
    .shift-new span { color: #25636f; }
    .shift-new p { margin: 0; font-size: 13.5pt; line-height: 1.55; font-weight: 800; color: #24221f; }
    .scene-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5mm; margin-top: 7mm; }
    .scene-link { background: #fff; border: 1px solid #ded8ca; border-left: 5px solid #25636f; border-radius: 3mm; padding: 4mm; }
    .scene-link b { display: block; color: #25636f; margin-bottom: 1mm; }
    .scene-link span { color: #5d574f; font-size: 9pt; }
    .scene-chapter { padding-top: 0; }
    .scene-number { color: #25636f; font-weight: 800; letter-spacing: .06em; margin-bottom: 3mm; }
    .scene-short { display: inline-block; padding: 2mm 4mm; background: #f3f0e8; border-radius: 999px; color: #5a554e; font-size: 9.5pt; margin-bottom: 5mm; }
    .scene-shift { display: grid; grid-template-columns: 1fr 12mm 1fr; align-items: stretch; gap: 3mm; margin: 5mm 0 7mm; }
    .scene-shift div { background: #f7f4ec; border: 1px solid #ded8ca; border-radius: 3mm; padding: 3.5mm; }
    .scene-shift div:last-child { background: #edf6f4; border-color: #bfd9d5; }
    .scene-shift span { display: block; color: #6d665e; font-weight: 700; font-size: 8.2pt; margin-bottom: 1mm; }
    .scene-shift p { margin: 0; font-size: 10.2pt; font-weight: 700; }
    .scene-shift strong { align-self: center; text-align: center; color: #25636f; font-size: 18pt; }
    .story-box, .falcon-note, .exercise-box { border-radius: 4mm; padding: 5mm; margin: 5mm 0; border: 1px solid #ded8ca; }
    .story-box { background: #fff; }
    .falcon-note { background: #edf6f4; border-left: 5px solid #25636f; }
    .exercise-box { background: #fff8ed; border-left: 5px solid #7b5134; }
    .pattern-card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4mm; margin-top: 4mm; }
    .mini-pattern { background: #fff; border: 1px solid #ded8ca; border-top: 4px solid var(--accent); border-radius: 3mm; padding: 4mm; break-inside: avoid; }
    .mini-pattern span { color: var(--accent); font-size: 16pt; font-weight: 800; }
    .mini-pattern h4 { margin: 1mm 0 2mm; font-size: 11.2pt; line-height: 1.45; }
    .mini-pattern p { font-size: 9pt; margin-bottom: 2mm; }
    .mini-pattern small { display: block; color: #6b635a; font-size: 8.2pt; line-height: 1.5; border-top: 1px solid #eee5d9; padding-top: 2mm; }
    .reader-lanes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin: 3mm 0 6mm; }
    .reader-lanes div { background: #fff; border: 1px solid #ded8ca; border-radius: 3mm; padding: 3.2mm; }
    .reader-lanes b { display: block; color: #315e62; font-size: 8.8pt; margin-bottom: 1mm; }
    .reader-lanes span { display: block; color: #5d574f; font-size: 8pt; line-height: 1.45; }
    .falcon-triad { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 3mm; }
    .falcon-triad div { background: rgba(255,255,255,.72); border-radius: 3mm; padding: 3.5mm; }
    .falcon-triad b { color: #25636f; }
    .falcon-triad p { font-size: 8.8pt; margin-top: 1.5mm; }
    .worksheet { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; }
    .worksheet div { min-height: 25mm; background: #fff; border: 1px dashed #c9b79e; border-radius: 3mm; padding: 3.2mm; }
    .worksheet b { display: block; color: #7b5134; margin-bottom: 2mm; }
    .worksheet span { display: block; color: #5d574f; font-size: 8.3pt; line-height: 1.5; }
    .small-table { width: 100%; border-collapse: collapse; margin: 5mm 0; }
    .small-table th, .small-table td { border: 1px solid #ded8ca; padding: 2.8mm; vertical-align: top; font-size: 9pt; }
    .small-table th { background: #f0ece2; text-align: left; }
    .appendix-list { columns: 2; column-gap: 9mm; }
    .appendix-list li { break-inside: avoid; }
    @media print {
      body { background: #fff; padding: 0; }
      main { max-width: none; margin: 0; box-shadow: none; }
      section, article { padding: 4mm 0; }
      .cover { min-height: 262mm; padding: 24mm 18mm 18mm; }
    }
    @media screen and (max-width: 820px) {
      body { padding: 0; background: #fffdf8; }
      main { max-width: none; box-shadow: none; }
      section, article { padding: 36px 24px; }
      .cover { min-height: 680px; padding: 52px 28px 40px; }
      .two-col, .matrix, .scene-list, .pattern-card-grid, .shift-grid, .note-grid, .three-entry, .reader-lanes, .worksheet { grid-template-columns: 1fr; }
      .scene-shift { grid-template-columns: 1fr; }
      .scene-shift strong { transform: rotate(90deg); }
      .appendix-list { columns: 1; }
    }
    a { color: #25636f; }
  </style>
</head>
<body>
<main>
  <section class="cover">
    <div>
      <div class="cover-label">Falcon仕事設計入門</div>
      <h1>働き方を、<br>条件から設計する</h1>
      <p class="subtitle">病名別の答えを越えて、人・仕事・環境の接点を読む入門</p>
    </div>
    ${renderPrism()}
    <div>
      <p class="cover-note">人間は、標準仕様ではない。障害・難病就労支援で見えてきた知見を手がかりに、仕事を人間の多様性に合わせて設計し直すための入門書。</p>
      <p class="meta">Version: v1 / 2026-05-26 / Falcon Stage 1 L3 Principal Interaction Patterns</p>
    </div>
  </section>

  <section class="page-break">
    <h2>はじめに</h2>
    <p class="lead">この本は、障害や難病のある人だけのための本ではない。障害・難病の就労支援で見えてくるのは、私たちの仕事や社会が、どんな人間像を前提に作られてきたのかという問いである。</p>
    <p>体調が変わる。集中できる時間が違う。移動や休息に条件がある。説明できることと、説明すると不利になることがある。情報の受け取り方や、評価される場面が人によって違う。</p>
    <p>こうした違いを「例外」として扱う限り、仕事は一部の人にしか合わないものになる。</p>
    <p>障害や病気のある人の就労支援では、よく「この病名なら、どんな配慮が必要ですか」と聞かれる。現場では時間が限られている。本人も、支援者も、企業も、早く手がかりを得たい。病名別の配慮リストや支援メニュー表が役に立つ場面もある。</p>
    <p>けれども、それだけでは見落とすことがある。同じ病名でも働きにくさは同じではない。仕事の内容、通勤、勤務時間、情報の伝わり方、上司との相談線、評価、収入、治療、家庭の事情によって、困りごとの形は変わる。</p>
    <p>反対に、違う病名や障害名でも、同じ場所で選択肢が狭まることがある。例えば、会議情報が口頭だけで流れる職場では、聴覚の条件、認知の条件、疲労、言語理解、経験不足など、さまざまな人が参加しにくくなる。</p>
    <div class="boundary">
      <p><strong>この本は、障害や病気のある人に「何ができないか」を尋ねる本ではない。</strong></p>
      <p>仕事、体調、生活、職場、制度、支援がどこでかみ合い、どこで選択肢を狭めているのかを見るための本である。</p>
    </div>
    <p>必要なのは、病名から答えを引くことではなく、人と仕事の接点を丁寧に読むことである。</p>
  </section>

  ${renderFrameShift()}

  <section class="page-break">
    <h2>この本でできるようになること</h2>
    <p>この本が目指すのは、すぐに正解を出すことではなく、よい問いを立てることである。</p>
    <div class="toc-grid">
      <div class="toc-card" style="--accent:#25636f"><h3>本人・家族</h3><p>困りごとを能力不足や病名だけに閉じず、仕事・環境・時間・支援との関係で言葉にできる。</p></div>
      <div class="toc-card" style="--accent:#7b5134"><h3>支援者</h3><p>本人の話を、職場や制度で使える問いへ置き換えられる。</p></div>
      <div class="toc-card" style="--accent:#545f2f"><h3>企業・現場</h3><p>安全、評価、人員余力、作業手順を分けて考えられる。</p></div>
      <div class="toc-card" style="--accent:#3d3b37"><h3>政策・サービス設計</h3><p>制度メニューの有無ではなく、つながりが切れる場所を見られる。</p></div>
    </div>
    <p class="lead">支援とは、本人を仕事に合わせることでも、職場に負担を押しつけることでもない。人の条件、仕事の条件、制度の条件が接する場所を読み、続ける・試す・戻る・成長する余地を設計することである。</p>
  </section>

  <section class="page-break">
    <h2>仕事を読み解く三つの入口</h2>
    ${renderPrism()}
    <div class="three-entry">
      ${planes.map((plane) => `
        <div class="entry-card" style="--accent:${plane.color}">
          <h3>${plane.label}</h3>
          <p><strong>${plane.title}</strong></p>
          <p>${plane.lead}</p>
        </div>`).join("")}
    </div>
    <p class="quiet">三分類は、就職前、就職時、就職後という時系列ではない。どの段階でも三つの入口は同時に関係する。</p>
  </section>

  <section class="page-break">
    <h2>この本を使うための六つの約束</h2>
    <p>六つの約束は、倫理的な注意書きであると同時に、現場を読み間違えないための実務上の規律である。</p>
    <div class="principles">
      ${principles.map(([t, d]) => `<div class="principle"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join("")}
    </div>
  </section>

  ${renderMatrix()}

  <section class="page-break">
    <h2>七つの現場場面から読む</h2>
    <p class="lead">21の視点は暗記するリストではない。困っている場面に出会った時、どの場所を見落としていないかを確かめるための道具箱である。</p>
    <div class="scene-list">
      ${scenes.map((scene) => `<div class="scene-link"><b>第${scene.n}章 ${esc(scene.title)}</b><span>${esc(scene.short)} / 視点 ${scene.patternIds.map((id) => String(id).padStart(2, "0")).join(", ")}</span></div>`).join("")}
    </div>
  </section>

  ${scenes.map(renderScene).join("")}

  ${renderPatternIndex()}

  <section class="page-break">
    <h2>終章 Falconと一緒に、仕事の前提を問い直す</h2>
    <p class="lead">この本の使い方は、個別の正解を急ぐことではない。場面を分け、視点を重ね、誰の見え方が足りないかを確かめ、次に聞く問いを残すことである。</p>
    <p>Falconの専門性は、障害・難病就労支援を特殊な例外対応として閉じないことにある。一人の困りごとを丁寧に読むと、仕事や制度がどんな人間像を標準としてきたかが見えてくる。</p>
    <p>そこから始まるのは、できない人を探す支援ではない。できる条件を設計し、人間の幅に合わせて仕事と社会を作り直す実践である。</p>
  </section>
</main>
</body>
</html>`;
}

async function main() {
  const html = renderHtml();
  await fs.writeFile(htmlPath, html, "utf8");
  await fs.writeFile(
    contentJsonPath,
    JSON.stringify({ planes, principles, frameShifts, scenes, patterns }, null, 2),
    "utf8"
  );
  await fs.writeFile(
    manifestPath,
    `# Stage 1 L3 Work Design Primer Book Manifest v1

作成日: 2026-05-26
Lane: Falcon / Falcon Lab
Status: full reader-facing booklet v1 / no source validity decision / no support validity decision / no public approval / no runtime approval

## Deliverables

- HTML: \`stage1-production-l3-work-design-primer-book-v1-2026-05-26.html\`
- PDF: \`stage1-production-l3-work-design-primer-book-v1-2026-05-26.pdf\`
- Content JSON: \`stage1-production-l3-work-design-primer-book-content-v1-2026-05-26.json\`

## Production Direction

This v1 uses seven reader-facing workplace scenes as the main path.
The 3x7 map and 21 principal interaction patterns remain as the knowledge map, but they are embedded in scenes rather than used as an encyclopedia-like table of contents.

Reader-facing pages foreground Falcon's expert identity: disability / rare-disease employment support as a way to redesign work and society for human diversity.
Governance boundaries stay in this manifest and production policy, not in the reader's learning path.

## Rendering QA Notes

- HTML screen layout uses a constrained reader width, outer background, and wider internal padding so the page is readable when opened directly in a browser.
- Horizontal "common reading -> Falcon reading" shifts use right arrows; vertical frame-shift cards keep the downward transition.
- PDF output is generated with \`build_l3_work_design_primer_reportlab_pdf.py\`; the ReportLab generator strips literal HTML tags from text and maps scene diagrams to their own diagram types instead of collapsing them into a generic figure.

## Boundaries

This artifact does not move source validity, support validity, candidate_pattern, Domain Core, Atlas / 27-frame, public_safe / public_approved, runtime_approved, or individual medical/legal/employment/accommodation/support-validity judgment.

Examples are synthetic and do not quote raw sensitive records or identifiable free text.
`,
    "utf8"
  );

  if (process.env.FALCON_SKIP_BROWSER === "1") {
    console.log(JSON.stringify({ htmlPath, contentJsonPath }, null, 2));
    return;
  }

  const playwright = await loadPlaywright();
  const chromium = playwright.chromium || playwright.default?.chromium;
  const executableCandidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ];
  let executablePath;
  for (const candidate of executableCandidates) {
    try {
      await fs.access(candidate);
      executablePath = candidate;
      break;
    } catch {
      // Keep looking.
    }
  }
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1240, height: 1754 },
      deviceScaleFactor: 1,
    });
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      margin: { top: "13mm", right: "14mm", bottom: "16mm", left: "14mm" },
      headerTemplate: `<div></div>`,
      footerTemplate: `<div style="width:100%; font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', sans-serif; font-size:8px; color:#777; padding:0 14mm; display:flex; justify-content:space-between;"><span>働き方を、条件から設計する</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    });
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify({ htmlPath, contentJsonPath, pdfPath, manifestPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
