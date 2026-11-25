import type { NblConsultationCaseV2ReaderCase } from '@/lib/fchma/core/nblConsultationCaseV2ReaderProduction';

type ReaderEntry = NblConsultationCaseV2ReaderCase & { entryId: string };

// Local editorial entry, not a new source case, diagnosis, or automated matching rule.
// Keep the existing inventory/legacy binding; do not append every issue to the
// health-time case. Inquiry and limits: expert inquiry document, sections 11–12.
function buildConsultationCaseEntry(
  item: NblConsultationCaseV2ReaderCase,
  requestedId = '',
  query = '',
): ReaderEntry {
  if (item.sourceBriefId === 'CC2-MIG-03') {
    return {
      ...item,
      entryId: item.caseId,
      turningQuestionJa:
        '直近の一件で、正しい情報はいつ、どこに届きましたか。作業中に変更や割込みがあれば、再開時に見る情報と、外へ出す前に検知できる人を確かめます。確認を頼めても返答を待って止まるなら、権限のある人がいつ応答できるかを調べます。',
      possibilities: item.possibilities.map((hypothesis) => hypothesis.hypothesisId === 'M03-H2' ? {
        ...hypothesis,
        statementJa:
          '教わった手順を使えていても、変更後の最新版が届かなかったり、中断後に別の作業へ戻ったりすると、同じ取り違えが起こります。負荷が高い時間帯や、確認担当が不在だった可能性も確かめます。',
        wouldReviseJa:
          '同じ作業で最新版・再開時の照合・確認担当をそろえても同種の誤りが残れば、負荷、具体的な技能、健康・安全のどこを確かめるか見直します。',
      } : hypothesis),
    };
  }
  if (item.sourceBriefId === 'CC2-MIG-07') {
    return {
      ...item,
      entryId: item.caseId,
      turningQuestionJa:
        '本人は、今の仕事と勤務をどのように保ち、変え、または休みたいですか。必要な調整の組合せと、予定を待たず見直す条件を、本人・専門職・職場で確かめます。',
      branches: item.branches.map((branch) => branch.branchId === 'M07-B1' ? {
        ...branch,
        nextMoveJa:
          '増やす・維持する・減らす・休養する案を、本人の希望と健康・安全、仕事の条件から選びます。勤務時間、仕事量、判断や対人負荷など必要な調整は組み合わせ、何を変えたかを分けて残します。当日の仕事と翌日以降の回復、品質、本人・周囲の負担を確認し、予定の段階に進むことを優先せず見直します。',
      } : branch),
    };
  }
  if (item.sourceBriefId === 'CC2-MIG-15') {
    return {
      ...item,
      entryId: item.caseId,
      branches: item.branches.map((branch) => branch.branchId === 'M15-B3' ? {
        ...branch,
        nextMoveJa:
          '本人が望み、安全に役立っている静かな場所は保ちます。止める対象は、そこを使うことで情報・評価・学習から外れる運用です。必要な参加場面と共有範囲を本人と確かめ、情報の受渡し、会議の方法、学ぶ機会を担当者と変えます。場所自体を変更する場合も、本人が選ぶ安全な代替を確認します。',
      } : branch),
      stopConditionsJa:
        '健康・安全の悪化、本人が望まない観察、情報や機会からの排除が起きたら、その運用をそのまま続けません。役立つ保護環境や必要支援を一律に外さず、本人と権限ある担当者で安全な維持・変更・代替を選びます。',
    };
  }
  if (item.sourceBriefId === 'CC2-MIG-20') {
    return {
      ...item,
      entryId: item.caseId,
      branches: item.branches.map((branch) => branch.branchId === 'M20-B2' ? {
        ...branch,
        nextMoveJa:
          '本人が選ぶ範囲で、実際の仕事内容を説明し、必要なら目的と期間を限った実習を検討します。説明から分かったことと、実際の作業で確かめたことは分けて残します。変えた条件と結果を次の担当へ引き継ぎ、一度の成功・不成功で本人の能力を決めません。',
      } : branch),
    };
  }
  if (item.sourceBriefId === 'CC2-PROD-08' || item.sourceBriefId === 'CC2-MIG-10') {
    return {
      ...item,
      entryId: item.caseId,
      branches: item.branches.map((branch) =>
        branch.branchId === 'P08-B2' || branch.branchId === 'M10-B3' ? {
          ...branch,
          nextMoveJa:
            '本人が望まない会議・共有・代理説明は止めます。そのことを個別支援全体の拒否とはせず、本人が選ぶ各分野内の相談や支援と、情報を広げずにできる仕事の変更を続けます。必要な専門・安全上の確認は、その目的と担当を分けて説明し、使える別の確認方法を本人と選びます。',
        } : branch),
    };
  }
  if (item.sourceBriefId === 'CC2-PROD-04') {
    return {
      ...item,
      entryId: item.caseId,
      doNotConcludeJa:
        '医療・産業保健の助言は、健康や機能についての大切な専門的見解です。助言が出たことと、本人が望む仕事の変更、職場の決定や手配、実施は別に確かめます。',
    };
  }
  if (item.sourceBriefId === 'CC2-PROD-06') {
    return {
      ...item,
      entryId: item.caseId,
      doNotConcludeJa:
        '相談がない時には、今の仕事で十分に支えられている場合も、相談しづらい、接点がない、詳しく話したくない場合もあります。相談の少なさだけで、問題の有無や本人の支援希望は決められません。',
    };
  }
  if (item.sourceBriefId === 'CC2-MIG-08') {
    return {
      ...item,
      entryId: item.caseId,
      branches: item.branches.map((branch) =>
        branch.branchId === 'M08-B1'
          ? {
              ...branch,
              nextMoveJa:
                '本人が望む範囲の短い相談から始めます。一つの仕事場面、共有範囲、受領者、一次回答日を合意し、相手が扱える範囲と必要な手続を確認します。正式な支援依頼が必要なら、本人と相談してその手続につなぎます。',
            }
          : branch,
      ),
    };
  }
  // Clarify the public-facing role division without altering the frozen source brief.
  if (item.sourceBriefId === 'CC2-PROD-05') {
    return {
      ...item,
      entryId: item.caseId,
      authorityBoundaryJa:
        '役割・評価・配置は職場の権限者が決め、本人は希望・保留・共有範囲を選びます。支援者は合意した範囲で仕事分析、教え方や練習、実施後の調整を助けられますが、人事判断を代行しません。',
    };
  }
  const isCommute =
    item.legacyEntries.some((entry) => entry.caseId === 'commute-fatigue') &&
    (requestedId === 'commute-fatigue' || /通勤|送迎|交通手段/.test(query));
  if (!isCommute) return { ...item, entryId: item.caseId };
  return {
    ...item,
    entryId: 'commute-fatigue',
    titleJa: '通勤の困りごとを、交通手段と一日の負担に分けて考える',
    openingJa: '通勤が難しくなりました。働く時間まで減らすしかないのでしょうか。',
    doNotConcludeJa:
      '職場へ行く手段・時刻が合わないことと、通勤や仕事で消耗することは別です。両方が重なることもあります。在宅勤務や時短に決める前に、何に困り、どんな働き方を続けたいかを確かめます。',
    possibilities: [
      {
        hypothesisId: 'COMMUTE-ACCESS',
        kind: 'primary',
        statementJa:
          '仕事は続けられるが、交通機関の時刻や送迎の変更で、職場に着く手段が合わなくなっている。',
        wouldReviseJa: '到着できる条件でも、仕事や回復に難しさが残る。',
      },
      {
        hypothesisId: 'COMMUTE-LOAD',
        kind: 'alternative',
        statementJa: '職場には着けるが、往復と仕事の負担が重なり、帰宅後や翌日まで回復が足りない。',
        wouldReviseJa: '回復は保たれ、困難が特定の交通手段や時刻だけにある。',
      },
      {
        hypothesisId: 'COMMUTE-CHOICE',
        kind: 'counter',
        statementJa:
          '家族の送迎など、本人も協力する人も望み、無理なく使えている方法がある。今の助け合いを続ける選択もある。',
        wouldReviseJa: 'どちらかが負担を抱えている、続けたくない、又は利用できる条件が変わる。',
      },
    ],
    turningQuestionJa:
      '困っているのは、職場に着く手段・時刻ですか、一日の疲れや回復ですか、それとも両方ですか。働く時間と収入は、どうしたいですか。',
    branches: [
      {
        branchId: 'COMMUTE-ACCESS-NEXT',
        conditionJa: '交通手段や時刻が合わず、働く時間数と収入は保ちたい。',
        nextMoveJa:
          '到着できる時刻と、その前に必要な仕事を分けて確認します。始業・終業をずらす、場所や担当の組合せを変える、往復の移動手段を確保する案を、本人と職場の決定者で比べます。始業時の対面応対などがあるなら、時刻をずらすだけでは足りません。誰がその仕事を受け持てるか、移動の費用や帰りの便も確認します。',
        guideUnitId: 'GUIDE-04',
        readinessSystemId: 'WDG2-06',
        guideSystemId: 'WDG2-06',
        guideTitleJa: '仕事設計ガイド：通勤を含む仕事条件の備え',
        readinessSectionId: 'WDG2-06-commute-conditions',
      },
      {
        branchId: 'COMMUTE-LOAD-NEXT',
        conditionJa: '到着できても回復が足りない、又は本人が働く時間を減らしたい。',
        nextMoveJa:
          '勤務時間の維持を目標に固定しません。往復・出勤日・仕事量・休憩・勤務時間を、本人の希望に沿って組み合わせます。減らした仕事を残りの時間へ詰め込まず、収入や役割、帰宅後の生活への影響も確認します。交通手段だけを変えて終わりにせず、必要な健康面の確認と職場の調整を進めます。',
        guideUnitId: 'GUIDE-04',
        readinessSystemId: 'WDG2-04',
        guideSystemId: 'WDG2-04',
        guideTitleJa: '時間・仕事量・体調変動への備え',
        readinessSectionId: 'time-prepare',
      },
    ],
    personControlJa:
      '時間・収入・担当を保ちたい、減らしたい、別の働き方にしたいという希望を本人と確かめます。両方の困難があれば、どちらか一つに絞る必要はありません。家族の協力は当然視も禁止もせず、本人と協力する人が続けたいかを確認します。',
    authorityBoundaryJa:
      '勤務・担当・場所・費用は、それを決められる職場の責任者と相談します。支援者は選択肢と調整先を整理しますが、交通サービスの利用や職場の変更を保証できません。共有する事情と相手は本人と確認します。',
    stopConditionsJa:
      '安全に移動できない、体調が急に悪化した、又は同意のない勤務・収入・役割の変更が進むときは、そのまま試行を続けません。今日の出勤や働く条件に切迫した問題がある場合、基盤整備の完了を待たず、必要な専門的確認と権限のある担当者への相談を進めます。',
    outcomeRevisionJa:
      '決めた交通手段や勤務変更が実際に使えたかと、その結果を分けます。到着できたことだけで解決とせず、帰宅後・翌日の回復、仕事への参加、収入、本人と協力する人の負担を確認します。改善しない、別の負担が増える、希望が変わる場合は組合せを見直します。',
  };
}

function readerLanguage(text: string) {
  return text
    .replace(/高損失経路/g, '重大な影響が心配な場合の専門相談')
    .replace(/高損失境界/g, '重大な不利益を避けるための確認事項')
    .replace(/高損失停止/g, '重大な影響が心配な時の中止判断')
    .replace(/高損失判断/g, '重大な影響に関する専門判断')
    .replace(/高損失情報/g, '重大な影響が心配される情報')
    .replace(/高損失懸念/g, '重大な影響の懸念')
    .replace(/高損失又は/g, '重大な影響がある、又は')
    .replace(/高損失/g, '重大な影響');
}

export function consultationCaseEntry(
  item: NblConsultationCaseV2ReaderCase,
  requestedId = '',
  query = '',
): ReaderEntry {
  const entry = buildConsultationCaseEntry(item, requestedId, query);
  return {
    ...entry,
    doNotConcludeJa: readerLanguage(entry.doNotConcludeJa),
    turningQuestionJa: readerLanguage(entry.turningQuestionJa),
    possibilities: entry.possibilities.map((p) => ({ ...p,
      statementJa: readerLanguage(p.statementJa), wouldReviseJa: readerLanguage(p.wouldReviseJa),
    })),
    branches: entry.branches.map((b) => ({ ...b,
      conditionJa: readerLanguage(b.conditionJa), nextMoveJa: readerLanguage(b.nextMoveJa),
    })),
    personControlJa: readerLanguage(entry.personControlJa),
    authorityBoundaryJa: readerLanguage(entry.authorityBoundaryJa),
    stopConditionsJa: readerLanguage(entry.stopConditionsJa),
    outcomeRevisionJa: readerLanguage(entry.outcomeRevisionJa),
  };
}

export function matchesConsultationEntry(item: NblConsultationCaseV2ReaderCase, id: string) {
  return item.caseId === id || item.legacyEntries.some((entry) => entry.caseId === id);
}

export function consultationEntrySearchText(item: NblConsultationCaseV2ReaderCase) {
  return [
    item.titleJa,
    item.openingJa,
    item.readerJa,
    item.phaseJa,
    ...item.legacyEntries.map((entry) => entry.labelJa),
    ...item.aliasResolutions.map((entry) => entry.currentQuestionJa),
    ...(item.legacyEntries.some((entry) => entry.caseId === 'commute-fatigue')
      ? ['通勤 送迎 交通手段', consultationCaseEntry(item, 'commute-fatigue').openingJa]
      : []),
  ].join(' ');
}
