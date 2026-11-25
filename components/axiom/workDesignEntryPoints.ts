// Editorial navigation into the existing grounded product inventory, not a Core taxonomy
// or an empirically exhaustive classification. Multiple topics may help the same situation.
export const workDesignEntryPoints = [
  {
    systemId: 'WDG2-04',
    problem: '休めても、仕事が減らない',
    change: '時間・仕事量・引継ぎをセットで変える',
    cue: '休憩 短時間 通院 疲労 残業 締切',
  },
  {
    systemId: 'WDG2-05',
    problem: '伝わらない。集中しづらい',
    change: '情報の届き方・作業環境・安全を見直す',
    cue: '会議 音 光 警報 聞き漏らし 見えにくい',
  },
  {
    systemId: 'WDG2-08',
    problem: 'いつも同じ人が、穴を埋めている',
    change: '応援する人の仕事量と代行を決める',
    cue: '同僚 負担 チーム 人手不足 不公平',
  },
  {
    systemId: 'WDG2-03',
    problem: '何度説明しても、やり直しになる',
    change: '指示・工程・完了の基準をそろえる',
    cue: '手戻り ミス 切替 手順 暗黙',
  },
  {
    systemId: 'WDG2-01',
    problem: '相談しても、誰も決められない',
    change: '相談先・決める人・返答の見通しをつくる',
    cue: '言い出せない たらい回し 無回答',
  },
  {
    systemId: 'WDG2-02',
    problem: 'どこまで話せばいいか、分からない',
    change: '仕事に必要な情報と共有先を本人と選ぶ',
    cue: '開示 病名 秘密 プライバシー 同意',
  },
  {
    systemId: 'WDG2-06',
    problem: '入社・復職のたびに、振り出しへ戻る',
    change: '実際の仕事条件と引継ぎをつなぐ',
    cue: '採用 実習 異動 就職活動 移行',
  },
  {
    systemId: 'WDG2-07',
    problem: '専門家と、現場の仕事を見直したい',
    change: '仕事の分析・教え方・助言の活用を一緒に考える',
    cue: '支援機関 医療 産業保健 連携 助言 教え方 練習 実装',
  },
  {
    systemId: 'WDG2-09',
    problem: '続けられるけれど、先が見えない',
    change: '役割・収入・評価・学ぶ機会を確かめる',
    cue: '昇進 キャリア 成長 処遇 参加',
  },
  {
    systemId: 'WDG2-10',
    problem: '試した対応を、続けてよいか迷う',
    change: '実施できたことと、起きた変化を分ける',
    cue: '効果なし 悪化 中断 振り返り 見直し',
  },
] as const;

export function workDesignEntry(systemId: string) {
  return workDesignEntryPoints.find((entry) => entry.systemId === systemId);
}

// A reading route through the existing inventory, not an implementation priority or Core ontology.
export const workDesignReadingOrder = [
  'WDG2-03',
  'WDG2-04',
  'WDG2-05',
  'WDG2-01',
  'WDG2-02',
  'WDG2-08',
  'WDG2-06',
  'WDG2-07',
  'WDG2-09',
  'WDG2-10',
] as const;
