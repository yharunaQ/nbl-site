// Authored fictional comparison for Axiom Development. No source/person records or runtime knowledge imports.
export type RoleOptionId = 'partial' | 'other' | 'maintain';
export type RoleIssueId = 'role' | 'income' | 'unknown' | 'sufficient';

export const roleOptions = [
  {
    id: 'partial' as const, title: 'A 現職の担当を一部変える',
    work: '既存入力の週2時間を、説明資料の分かりやすさ確認へ置き換える候補。実業務・品質は管理者へ確認。',
    value: '文章で人に伝える工程へ関わる。本人にとって望む役割かは別に確認。',
    access: '指示とフィードバックを使える形式へ。対象学習と職場の教え方を一緒に組む。',
    time: '既存の有給週20時間内で置換。準備・確認も含め、無償の追加2時間にしない。',
    pay: '既存賃金を保つ案として協議。変更後の評価・責任・賃金は雇用主の承認待ち。',
    owner: '管理者が実業務・勤務・評価を、指導者と専門支援の提供者が有償時間・開始を受理。',
    next: '本人が比較したい内容を確認し、管理者へ実業務・品質と週20時間内の置換を照会する。対象学習と使える指示・返答を同時に設計する。',
    agreement: '企業の仕事・情報設計、職場指導、専門支援の担当と有償時間・費用を承認する。未承認の開始や無償の追加責任は置かない。',
    return: '合意した条件で担当を戻せるか確認。本人が変更・停止を望む時は、所得と必要支援を別に確認する。',
  },
  {
    id: 'other' as const, title: 'B 別部署の情報編集を調べる',
    work: '編集業務の実在、必要品質・技能、担当枠を部署責任者から説明してもらう。',
    value: '編集の役割をより担う可能性。Aの役割と同等と支援者が決めない。',
    access: '会議、編集手順、相談先と必要な指導・情報アクセスを確認。',
    time: '勤務時間と負荷は未確認。現職の20時間を別部署の条件へ転記しない。',
    pay: '異動後の賃金・評価と契約条件は未確認。編集への関心を異動承諾にしない。',
    owner: '本人が照会の共有範囲を選び、部署責任者が仕事内容を、人事等の権限者が異動・賃金条件を返す。',
    next: '本人が許可する範囲で、部署責任者へ実業務・勤務・賃金条件の説明を依頼する。照会と異動の同意・承認は分ける。',
    agreement: '照会・比較にも担当と有償時間を置く。勤務、指導、費用と開始条件は実際の返答後に積算し、Aの試算を流用しない。',
    return: '情報収集で現職を終了しない。本人が別案・保留を選ぶ時の現職と相談先を保つ。',
  },
  {
    id: 'maintain' as const, title: 'C 今は現職を維持する',
    work: '既存の入力業務を維持。本人が望む場合だけ、対象学習を別に協議する。',
    value: '今の安定・関係を保つ。成長、意味の説明や学習を維持の条件にしない。',
    access: '今使える指示・応答を保つ。追加の教材・指導は本人が望む時だけ。',
    time: '既存の勤務条件を保つ。学習を加えるなら勤務内の置換と負担を別に合意。',
    pay: '現職の条件を保持する案。維持だけなら追加支援費を自動で発生させない。',
    owner: '本人が維持と必要な相談を選ぶ。変更する時だけ管理者・提供者が時間・費用を確認。',
    next: '今の条件で十分かを本人が選ぶ範囲で確認し、維持と必要時の相談先を保つ。学習や新しい支援契約を必須にしない。',
    agreement: '追加変更なしなら新しい費用試算は不要。本人が学習を選ぶ時だけ対象、勤務内時間、指導と費用を合意する。',
    return: '後で役割変更、探索、休養を相談できる経路を保つ。今の維持を将来も同じ役割への固定にしない。',
  },
] as const;

export const roleIssues = [
  { id: 'role' as const, title: '望む役割と情報アクセスが足りない',
    first: '候補の工程・需要と、本人が使う指示・対象学習、職場の返答を並行して具体化する。意欲訓練の修了を先に求めない。',
    owner: '本人、業務・配置の決定者、指導と必要支援の提供者。' },
  { id: 'income' as const, title: '今の仕事を評価しているが、所得・仕事量が不足する',
    first: '今の関係と仕事の維持を保ちながら、支払・契約・仕事供給の決定者へ改善と生活資金の不足時点を確認する。役割比較は望む場合に並行し、やりがいや満足で収入不足を埋めない。',
    owner: '雇用主等の賃金・契約・仕事供給の決定者と、必要な所得・資金の担当。' },
  { id: 'unknown' as const, title: '本人の希望や、足りない条件はまだ分からない',
    first: '本人が今決めたいことと、理解・表出しやすい方法を必要な範囲で選べるようにする。家族の意味の評価を本人の同意へ変えず、役割変更を先に開始しない。',
    owner: '本人と、本人が使いたい意思疎通・選択の援助を担う人。' },
  { id: 'sufficient' as const, title: '今の条件で十分で、本人は維持を望む',
    first: '十分な仕事・支援条件を維持し、望む再相談の経路を保つ。比較のためだけに尺度、体験、学習や契約を増やさない。',
    owner: '本人と現在の仕事・支援担当。変更が必要になった時に権限者へ戻る。' },
] as const;

export function roleTrialCosts(existingMentorTimeAvailable: boolean) {
  const gross = 2 * 6000 + 3 * 5000 + 0.5 * 4 * 6000 + 0.5 * 4 * 5000;
  const existing = existingMentorTimeAvailable ? 0.25 * 4 * 6000 : 0;
  return { gross, existing, incremental: gross - existing, startup: 27000, availableAtStartup: 20000, startupGap: 7000 };
}

export function personValuedRoleMemo(roleId: RoleOptionId, issueId: RoleIssueId, existingMentorTimeAvailable: boolean, separateSupplyContext = false) {
  const role = roleOptions.find((item) => item.id === roleId)!;
  const issue = roleIssues.find((item) => item.id === issueId)!;
  const costs = roleTrialCosts(existingMentorTimeAvailable);
  const lines = [
    '## 役割と条件の比較・実施合意のたたき台',
    '架空例：文章で人に情報を伝える役割に関心がある現職の人。既存の有給週20時間。',
    '以下は画面で検討する案で、実在する本人の希望・選択・承認・実施ではありません。',
    ...(separateSupplyContext ? ['以下の本人・仕事の状況は、年間容量や上位の供給条件から推定した状態ではなく、独立に比較する架空の条件です。上位の受理・有償時間・支払確認は完了していません。'] : []),
    `今回比較した状況：${issue.title}`, `この状況の第一手：${issue.first}`, `第一手の担当：${issue.owner}`,
    '### 比較した候補',
    ...roleOptions.flatMap((item) => [item.title, `工程：${item.work}`, `本人にとっての違い：${item.value}`, `情報・学習：${item.access}`, `勤務：${item.time}`, `賃金・評価：${item.pay}`]),
    '### 担当へ渡す案',
    `検討する案：${role.title}`, `案の次の確認：${role.next}`, `実担当：${role.owner}`,
    `有償の実施合意：${role.agreement}`, `停止・再選択：${role.return}`,
  ];
  if (roleId === 'partial' && issueId === 'role') lines.push(
    '### A案が選ばれ、承認される場合の4週間の仮試算',
    '企業初期2h×6000円＝12000円、専門初期3h×5000円＝15000円、指導0.5h×4週×6000円＝12000円、専門振返り0.5h×4週×5000円＝10000円。',
    `総額：${costs.gross}円。同じ活動に使える非重複の既存分：${costs.existing}円。純増：${costs.incremental}円。`,
    `開始前必要：${costs.startup}円。仮の承認済み資金：${costs.availableAtStartup}円。開始時不足：${costs.startupGap}円。`,
    '仮単価で、通常賃金・全通常業務・税等は含めていません。支払主体・受理・支払日は未確認。本人や同僚、NBLの持出しで開始しない。',
  );
  else lines.push('費用：この案・状況の費用は未積算。A案の43000円を流用しない。維持だけで追加変更がない場合、新しい試算を必須にしない。');
  return [...lines,
    '### 合意で埋める必要部分',
    '本人の選択・共有範囲：未確認', '企業の業務・勤務・評価・賃金の承認：未確認',
    '提供者の受理・有償時間・開始日・代替：未確認', '支払主体・使える財源・支払日：未確認',
    '実施・非実施と理由：未確認',
    '見直し：本人が選んだ役割、実施した工程、本人評価、品質、健康、所得、他者の実時間・費用を別に確認する。',
    '就職前の対象学習と職場の準備、就職後の適応も本人と職場の双方へ。支援の厚さで役割・別の仕事への機会を閉じず、移行のために所得・必要支援を撤去しない。',
    '本人が意味を話さない、仕事以外で得る、休養・退出を選ぶ時も選択を保つ。この画面で研究参加や個人情報の提出は求めない。',
  ].join('\n');
}
