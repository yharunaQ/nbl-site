// Generated with scripts/ops/export-public-flagship-data.cjs.


export type NblConsultationCaseV2ReaderCase = {
  caseId: string;
  sourceBriefId: string;
  titleJa: string;
  openingJa: string;
  readerJa: string;
  phaseJa: string;
  doNotConcludeJa: string;
  turningQuestionJa: string;
  personControlJa: string;
  authorityBoundaryJa: string;
  stopConditionsJa: string;
  outcomeRevisionJa: string;
  possibilities: Array<{
    hypothesisId: string;
    kind: 'primary' | 'alternative' | 'counter';
    statementJa: string;
    wouldReviseJa: string;
  }>;
  branches: Array<{
    branchId: string;
    conditionJa: string;
    nextMoveJa: string;
    guideUnitId: string;
    readinessSystemId?: string;
    guideSystemId: string;
    guideTitleJa: string;
    readinessSectionId?: string;
  }>;
  legacyEntries: Array<{ caseId: string; labelJa: string }>;
  aliasResolutions: Array<{ currentQuestionJa: string }>;
};

type ReaderGuide = {
  systemId: string;
  purposeJa: string;
  readinessQuestionJa: string;
  installBeforeCaseJa: string[];
  ownersJa: string[];
  operatingCadenceJa: string;
  artifactsJa: string[];
  readinessLevelsJa: {
    absent: string;
    fragile: string;
    operating: string;
  };
  caseActivationJa: string[];
  individualizationQuestionsJa: string[];
  burdenAndEquityChecksJa: string[];
  stopAndEscalationJa: string;
  outcomeReviewJa: string;
  currentGuideFrameIds: string[];
  currentGuideDeltaJa: string;
  linkedCaseBriefIds: string[];
  readerTitleJa: string;
};

export const NBL_CONSULTATION_CASE_V2_READER_PRODUCTION: { version: string; cases: NblConsultationCaseV2ReaderCase[]; guides: ReaderGuide[] } = {
  "version": "v12-public-candidate-reader-ia-2026-08-18",
  "cases": [
    {
      "caseId": "recruitment-information-choice",
      "sourceBriefId": "CC2-PROD-01",
      "titleJa": "伝えるか、伏せるかの二択にしない採用前相談",
      "openingJa": "必要な配慮を伝えると、採用されなくなるのではと不安です。",
      "readerJa": "求職者・実習者",
      "phaseJa": "就職活動・採用",
      "doNotConcludeJa": "求職者の不安は重要だが、それだけでは募集職務の実条件、選考権限、受入環境、情報の利用範囲は分からない。",
      "turningQuestionJa": "採用判断に必要な具体的職務条件と、本人が共有を選ぶ情報を分けたとき、次の判断に本当に足りないものは何ですか。",
      "personControlJa": "応募、保留、共有しない、共有範囲を狭める選択を同格に置く。",
      "authorityBoundaryJa": "採用判断は雇用側、情報提供は本人、支援者は仕事条件への翻訳候補まで。",
      "stopConditionsJa": "本人が拒否した情報を要求する、共有先や用途が不明、診断名を適性の代理にする場合は停止する。",
      "outcomeRevisionJa": "質問への回答、共有の選択、選考過程で生じた不利益・安心・未解決を分け、次の応募支援仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "P01-H1",
          "kind": "primary",
          "statementJa": "必要な仕事条件を確認できないことが、開示の損失を過大にしている。",
          "wouldReviseJa": "職務条件が明確でも選考上の不利益懸念が残る。"
        },
        {
          "hypothesisId": "P01-H2",
          "kind": "alternative",
          "statementJa": "受領環境の差別・二次利用リスクが、限定共有も難しくしている。",
          "wouldReviseJa": "本人が信頼できる受領者と用途を指定できる。"
        },
        {
          "hypothesisId": "P01-H3",
          "kind": "counter",
          "statementJa": "現時点では共有せず応募することが本人の合理的な選択である。",
          "wouldReviseJa": "本人が限定共有による具体的利益を望む。"
        }
      ],
      "branches": [
        {
          "branchId": "P01-B1",
          "conditionJa": "本人が共有を保留し、まず仕事内容を確かめたい。",
          "nextMoveJa": "個人情報を増やさず、勤務・工程・品質・環境の実条件を質問できる形にする。",
          "guideUnitId": "GUIDE-01",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        },
        {
          "branchId": "P01-B2",
          "conditionJa": "本人が特定の条件だけ限定共有したい。",
          "nextMoveJa": "目的・受領者・範囲・保持期間・撤回方法を本人が選ぶ最小共有案を作る。",
          "guideUnitId": "GUIDE-01",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        }
      ],
      "legacyEntries": [],
      "aliasResolutions": []
    },
    {
      "caseId": "family-life-burden",
      "sourceBriefId": "CC2-PROD-02",
      "titleJa": "就労継続の裏側にある家族・生活負担を見える化する",
      "openingJa": "働き続けるための回復や送迎を、家族だけで支えるのが限界です。",
      "readerJa": "家族・生活側",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "家族の限界は重要な観察だが、本人の希望、職場で調整できる負担、支援利用の可否を家族だけから確定しない。",
      "turningQuestionJa": "就労継続のために増えた時間・移動・事務・心理負担を、本人・家族・職場・支援者別に置くと、どこへ集中していますか。",
      "personControlJa": "家族の希望を本人の希望に置き換えず、両者の負担と選択を別記する。",
      "authorityBoundaryJa": "勤務変更は職場、生活支援利用は本人・家族と提供機関、統合判断は本人参加で行う。",
      "stopConditionsJa": "家族の無償負担を配慮の成立条件にする、本人不在で働き方を固定する場合は停止する。",
      "outcomeRevisionJa": "仕事継続だけで成功とせず、本人・家族・職場の負担変化と撤回希望で仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "P02-H1",
          "kind": "primary",
          "statementJa": "勤務時間・通勤・回復条件の不整合が家庭へ補償負担を移している。",
          "wouldReviseJa": "職場条件を変えても家族負担が変わらない。"
        },
        {
          "hypothesisId": "P02-H2",
          "kind": "alternative",
          "statementJa": "支援資源の接続・時間帯・利用条件が合っていない。",
          "wouldReviseJa": "利用可能な支援が本人希望と生活条件に適合する。"
        },
        {
          "hypothesisId": "P02-H3",
          "kind": "counter",
          "statementJa": "本人が現在の働き方を優先し、家族とは別の負担調整を望んでいる。",
          "wouldReviseJa": "本人が職場条件の見直しを選ぶ。"
        }
      ],
      "branches": [
        {
          "branchId": "P02-B1",
          "conditionJa": "通勤・勤務・回復条件が主な負担源。",
          "nextMoveJa": "本人が選ぶ勤務・移動・支援の必要な組合せを期限付きで調整し、本人と家族の負担を別に確認する。切り分けられる変更は絞っても、必要な支援は外さない。",
          "guideUnitId": "GUIDE-02",
          "guideSystemId": "WDG2-08",
          "guideTitleJa": "チームの負担と応援体制を整える"
        },
        {
          "branchId": "P02-B2",
          "conditionJa": "生活側支援の時間・接続が主な障壁。",
          "nextMoveJa": "本人同意の範囲で相談先・受入条件・担当を一つずつ確認する。",
          "guideUnitId": "GUIDE-02",
          "guideSystemId": "WDG2-08",
          "guideTitleJa": "チームの負担と応援体制を整える"
        }
      ],
      "legacyEntries": [],
      "aliasResolutions": []
    },
    {
      "caseId": "coworker-burden-redesign",
      "sourceBriefId": "CC2-PROD-03",
      "titleJa": "善意の穴埋めを、正式な仕事設計へ戻す",
      "openingJa": "配慮には賛成ですが、穴埋めがいつも私たちに来て相談できません。",
      "readerJa": "同僚・チーム",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "同僚の負担は本人の価値や能力の証明ではない。業務量、権限、期限、評価と、本人の参加を合わせて確認する。",
      "turningQuestionJa": "誰のどの仕事が増え、その分の時間は確保されていますか。本人と応援する人は続けられると感じていますか。続く負担があれば、誰が仕事量・期限・評価を見直せますか。",
      "personControlJa": "同僚相談を本人批判へ転用せず、本人にも役割変更を知り意見を述べる機会を置く。",
      "authorityBoundaryJa": "業務配分・人員・評価は管理者、支援者は負担構造の可視化まで。",
      "stopConditionsJa": "本人への非難、同僚への無償恒常負担、評価上の不利益が生じる運用は止めて再設計する。",
      "outcomeRevisionJa": "本人の参加・仕事品質・同僚負担・管理負担を別々に記録し、改善と負担移転を区別する。",
      "possibilities": [
        {
          "hypothesisId": "P03-H1",
          "kind": "primary",
          "statementJa": "配慮ではなく、業務再配分の所有者・期限・評価が未設計である。",
          "wouldReviseJa": "正式な再配分でも特定者へ負担が集中する。"
        },
        {
          "hypothesisId": "P03-H2",
          "kind": "alternative",
          "statementJa": "繁忙や欠員という全員共通の業務設計問題が重なっている。",
          "wouldReviseJa": "本人関連の調整を外すと負担が解消する。"
        },
        {
          "hypothesisId": "P03-H3",
          "kind": "counter",
          "statementJa": "短期の相互支援はチームが選んだ妥当な運用で、固定化だけが問題である。",
          "wouldReviseJa": "期限・見直し・評価があっても負担が許容できない。"
        }
      ],
      "branches": [
        {
          "branchId": "P03-B1",
          "conditionJa": "非公式な穴埋めが固定化している。",
          "nextMoveJa": "業務・担当・期限・判断者を明記し、本人を含めた正式な仕事再設計へ戻す。",
          "guideUnitId": "GUIDE-02",
          "guideSystemId": "WDG2-08",
          "guideTitleJa": "チームの負担と応援体制を整える"
        },
        {
          "branchId": "P03-B2",
          "conditionJa": "全体的な人員・繁忙問題が主因。",
          "nextMoveJa": "障害配慮から切り離し、チーム全体の業務量と優先順位を再設計する。",
          "guideUnitId": "GUIDE-02",
          "guideSystemId": "WDG2-08",
          "guideTitleJa": "チームの負担と応援体制を整える"
        },
        {
          "branchId": "P03-B3",
          "conditionJa": "短期の助け合いが、本人と応援する人の双方に無理なく機能している。",
          "nextMoveJa": "使えている方法は維持する。大きな制度への作り替えを目的にせず、応援が長引く、負担が偏る、誰かが続けにくいと感じた時に、担当者と配分を見直せるようにする。管理者の見た目だけで「無理がない」と決めない。",
          "guideUnitId": "GUIDE-02",
          "guideSystemId": "WDG2-08",
          "guideTitleJa": "チームの負担と応援体制を整える"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "coworker-fairness",
          "labelJa": "周囲から不公平と言われる"
        }
      ],
      "aliasResolutions": [
        {
          "currentQuestionJa": "周囲の納得を得るため、本人の事情をどこまで説明すればよいか。"
        }
      ]
    },
    {
      "caseId": "professional-advice-to-workplace",
      "sourceBriefId": "CC2-PROD-04",
      "titleJa": "就業上の助言を、実装と結果の往復へつなぐ",
      "openingJa": "就業上の助言を出しても、職場で何が変わったか戻ってきません。",
      "readerJa": "医療・産業保健",
      "phaseJa": "悪化・休職・復職",
      "doNotConcludeJa": "医療・産業保健の助言は重要なsource evidenceだが、職務設計・決裁・実装・本人の選択を代行しない。",
      "turningQuestionJa": "助言の目的、対象となる仕事条件、本人の選択、受領者、決裁者、実施者、確認日はそれぞれ誰・何ですか。",
      "personControlJa": "助言を共有・実施するか、代替案を選ぶかを本人抜きで決めない。",
      "authorityBoundaryJa": "専門職は健康・機能上の見解、職場は仕事実装、本人は共有と選択を担う。",
      "stopConditionsJa": "同意のない共有、助言を命令として扱う、誰も実装責任を持たない場合は止める。",
      "outcomeRevisionJa": "実施・不実施、本人・仕事・健康・負担の変化、帰属限界を記録して助言仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "P04-H1",
          "kind": "primary",
          "statementJa": "助言が具体的な仕事条件へ翻訳されず、決裁者へ届いていない。",
          "wouldReviseJa": "翻訳と決裁後も実装されない。"
        },
        {
          "hypothesisId": "P04-H2",
          "kind": "alternative",
          "statementJa": "本人が共有・実施を望んでいない、または別案を望んでいる。",
          "wouldReviseJa": "本人が同意した案でも進まない。"
        },
        {
          "hypothesisId": "P04-H3",
          "kind": "counter",
          "statementJa": "職場は別の安全・運営情報に基づき実施を見送った可能性がある。",
          "wouldReviseJa": "根拠と代替案が示されない。"
        }
      ],
      "branches": [
        {
          "branchId": "P04-B1",
          "conditionJa": "仕事条件への翻訳と担当が欠けている。",
          "nextMoveJa": "本人同意の範囲で一つの仕事条件・担当・確認日へ変換する。",
          "guideUnitId": "GUIDE-05",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        },
        {
          "branchId": "P04-B2",
          "conditionJa": "本人の希望または職場判断が異なる。",
          "nextMoveJa": "不実施理由と代替案を本人へ戻し、選び直しを可能にする。",
          "guideUnitId": "GUIDE-05",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "industrial-health-bridge",
          "labelJa": "産業保健と現場がつながらない"
        }
      ],
      "aliasResolutions": [
        {
          "currentQuestionJa": "産業保健に相談すれば、職場の対応内容まで決まるのか。"
        }
      ]
    },
    {
      "caseId": "role-evaluation-growth",
      "sourceBriefId": "CC2-PROD-05",
      "titleJa": "配慮の有無から、役割・評価・成長機会へ進む",
      "openingJa": "配慮はありますが、成長機会が減っている気がします。",
      "readerJa": "就労中の本人",
      "phaseJa": "評価・役割・成長",
      "doNotConcludeJa": "機会減少を直ちに差別とも能力不足ともせず、本人の安定選択、仕事基準、一般的人事要因、配慮後の役割変化を競合させる。",
      "turningQuestionJa": "本人が望む安定と成長、役割を決めた人・時点、求められる仕事基準を分けると、どの差が次の判断を変えますか。",
      "personControlJa": "成長、安定、保留、再選択を同格に置く。",
      "authorityBoundaryJa": "役割・評価・配置は職場権限、本人は希望と同意、支援者は基準の翻訳まで。",
      "stopConditionsJa": "本人・チームの隠れた追加負担、不明な評価基準、不利益が現れたら試行を止める。",
      "outcomeRevisionJa": "遂行だけでなく、本人選択、学習、役割、評価、本人・チーム負担で見立てを更新する。",
      "possibilities": [
        {
          "hypothesisId": "P05-H1",
          "kind": "primary",
          "statementJa": "配慮後の役割設計が、本人の意思なく機会を狭めている。",
          "wouldReviseJa": "本人が現在の安定を明確に選んでいる。"
        },
        {
          "hypothesisId": "P05-H2",
          "kind": "alternative",
          "statementJa": "一般的な人事・育成・仕事基準の不透明さが主因である。",
          "wouldReviseJa": "同条件の他者と異なる制限が確認される。"
        },
        {
          "hypothesisId": "P05-H3",
          "kind": "counter",
          "statementJa": "本人は現時点の安定を選び、拡張を望んでいない。",
          "wouldReviseJa": "本人が小さな役割拡張を希望する。"
        }
      ],
      "branches": [
        {
          "branchId": "P05-B1",
          "conditionJa": "本人が一部の成長機会を望む。",
          "nextMoveJa": "仕事量を増やさず一項目だけ入れ替え、基準・支援・期限を共有する。",
          "guideUnitId": "GUIDE-03",
          "guideSystemId": "WDG2-09",
          "guideTitleJa": "役割・評価・成長機会を公平にする"
        },
        {
          "branchId": "P05-B2",
          "conditionJa": "本人が現在の安定を選ぶ。",
          "nextMoveJa": "非拡張を失敗とせず、再選択できる入口と評価上の不利益なしを確認する。",
          "guideUnitId": "GUIDE-03",
          "guideSystemId": "WDG2-09",
          "guideTitleJa": "役割・評価・成長機会を公平にする"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "job-carving-value",
          "labelJa": "職務切り出しが雑用になる"
        }
      ],
      "aliasResolutions": [
        {
          "currentQuestionJa": "できる仕事だけを切り出せば、安定して働き続けられるか。"
        }
      ]
    },
    {
      "caseId": "no-consultation-low-signal",
      "sourceBriefId": "CC2-PROD-06",
      "titleJa": "「相談がない」を、問題なしと支援対象化の間で扱う",
      "openingJa": "本人から相談がないので、このままでよいと考えてよいでしょうか。",
      "readerJa": "直属上司・現場管理者",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "上司から見える低信号は、安定、不要、相談困難、接点不足、非開示、通常対応への包含を区別できない。",
      "turningQuestionJa": "個人を探さずに、相談入口・不利益防止・仕事条件の選択肢を点検すると、本人が選べる経路は実際にありますか。",
      "personControlJa": "相談しない、後で相談する、匿名で尋ねる選択を守る。",
      "authorityBoundaryJa": "管理者は入口と仕事環境を整えられるが、本人の状態やニーズを推定して確定しない。",
      "stopConditionsJa": "個人探索、診断推測、非相談を同意とみなす、不利益な記録化へ進む場合は停止する。",
      "outcomeRevisionJa": "相談件数の増減だけでなく、入口の利用可能性、不利益、普遍的改善、未把握を分けて更新する。",
      "possibilities": [
        {
          "hypothesisId": "P06-H1",
          "kind": "primary",
          "statementJa": "相談しなくても仕事が安定しており、追加対応は不要である。",
          "wouldReviseJa": "本人が相談したくても不利益を懸念している。"
        },
        {
          "hypothesisId": "P06-H2",
          "kind": "alternative",
          "statementJa": "相談経路・心理的安全・情報統制が弱く、必要が見えない。",
          "wouldReviseJa": "匿名・限定相談経路にも需要がない。"
        },
        {
          "hypothesisId": "P06-H3",
          "kind": "counter",
          "statementJa": "個別支援ではなく、誰にでも使える仕事設計改善が適切である。",
          "wouldReviseJa": "具体的で本人選択を要する個別条件が生じる。"
        }
      ],
      "branches": [
        {
          "branchId": "P06-B1",
          "conditionJa": "個別相談の必要は確認されない。",
          "nextMoveJa": "個人を推測せず、匿名の相談入口と普遍的な仕事条件を維持する。",
          "guideUnitId": "GUIDE-04",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        },
        {
          "branchId": "P06-B2",
          "conditionJa": "相談経路や不利益防止が弱い。",
          "nextMoveJa": "診断名を集めず、選べる相談先・守秘・不利益防止・撤回を組織単位で整える。",
          "guideUnitId": "GUIDE-04",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        }
      ],
      "legacyEntries": [],
      "aliasResolutions": []
    },
    {
      "caseId": "accommodation-exit-risk",
      "sourceBriefId": "CC2-PROD-07",
      "titleJa": "配慮相談後の役割縮小・離職危機を通常改善から分ける",
      "openingJa": "配慮を相談した後から、任せられる仕事が減り、退職の話が出ています。",
      "readerJa": "就労中の本人",
      "phaseJa": "離職・雇止め危機",
      "doNotConcludeJa": "本人の時間順の経験は重大だが、因果や違法性を自動確定せず、具体的決定・基準・権限・代替案を急いで分離する。",
      "turningQuestionJa": "相談後に変わった具体的な仕事・評価・雇用判断は何で、誰が何の基準で決め、本人が選べる代替案は何でしたか。",
      "personControlJa": "残る・異議を述べる・保留する・離れる・別経路を選ぶ権利を保持する。",
      "authorityBoundaryJa": "NBLは違法・差別・適性を確定しない。雇用判断の権限と外部専門判断を明示する。",
      "stopConditionsJa": "退職・雇止め・評価低下が進行、報復懸念、本人参加なし、記録保全が必要なら通常の小試行を停止する。",
      "outcomeRevisionJa": "雇用継続を唯一の成功にせず、本人の選択、役割、評価、生活、安全、不利益、未決着で更新する。",
      "possibilities": [
        {
          "hypothesisId": "P07-H1",
          "kind": "primary",
          "statementJa": "配慮相談を契機に、根拠不明な役割制限または退職圧力が生じている。",
          "wouldReviseJa": "相談前から同じ基準と決定過程が確認される。"
        },
        {
          "hypothesisId": "P07-H2",
          "kind": "alternative",
          "statementJa": "安全・品質・契約・組織変更に関する別の判断が重なっている。",
          "wouldReviseJa": "その根拠・比較・代替案が示されない。"
        },
        {
          "hypothesisId": "P07-H3",
          "kind": "counter",
          "statementJa": "本人が負担軽減や離職・再選択を望んでいる可能性がある。",
          "wouldReviseJa": "本人が役割維持または別案を明確に望む。"
        }
      ],
      "branches": [
        {
          "branchId": "P07-B1",
          "conditionJa": "根拠・手続・代替案が不明な不利益判断が進行中。",
          "nextMoveJa": "通常試行を止め、記録・決定者・基準・独立相談先を確認する。",
          "guideUnitId": "GUIDE-03",
          "guideSystemId": "WDG2-09",
          "guideTitleJa": "役割・評価・成長機会を公平にする"
        },
        {
          "branchId": "P07-B2",
          "conditionJa": "本人が離職または再選択を望む。",
          "nextMoveJa": "残留を成功と固定せず、情報・時間・生活影響を確認して本人の選択を支える。",
          "guideUnitId": "GUIDE-03",
          "guideSystemId": "WDG2-09",
          "guideTitleJa": "役割・評価・成長機会を公平にする"
        }
      ],
      "legacyEntries": [],
      "aliasResolutions": []
    },
    {
      "caseId": "person-controlled-coordination",
      "sourceBriefId": "CC2-PROD-08",
      "titleJa": "本人抜きの連携を、本人統制のある協働へ戻す",
      "openingJa": "私のことを話す会議なのに、何が決まったのか後からしか分かりません。",
      "readerJa": "就労中の本人",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "連携の多さを支援の質とみなさず、本人の参加・拒否・訂正・撤回と各者の決定権を分ける。",
      "turningQuestionJa": "本人が拒否・保留・撤回したら、会議・共有・決定のどこが止まり、本人不在でも可能な組織側の代替行動は何ですか。",
      "personControlJa": "参加、代理出席、限定委任、拒否、訂正、撤回を実行可能にする。",
      "authorityBoundaryJa": "各参加者は自分の権限だけを行使し、支援者も本人や職場の決定を所有しない。",
      "stopConditionsJa": "目的外共有、拒否後の継続、参加者・決定権不明、訂正不能な記録化では停止する。",
      "outcomeRevisionJa": "会議開催を成果にせず、本人理解・選択、実装、負担、不利益、撤回・修正で連携仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "P08-H1",
          "kind": "primary",
          "statementJa": "支援連携が本人参加を欠き、代理決定と情報拡散になっている。",
          "wouldReviseJa": "本人が範囲と目的を事前に選び、決定内容を確認できる。"
        },
        {
          "hypothesisId": "P08-H2",
          "kind": "alternative",
          "statementJa": "緊急・安全上の限定対応があったが、説明と事後訂正が欠けた。",
          "wouldReviseJa": "緊急性・最小範囲・事後確認が記録される。"
        },
        {
          "hypothesisId": "P08-H3",
          "kind": "counter",
          "statementJa": "本人が一部調整を委任したが、委任範囲の理解がずれた。",
          "wouldReviseJa": "本人が委任自体を否定する。"
        }
      ],
      "branches": [
        {
          "branchId": "P08-B1",
          "conditionJa": "本人が参加または限定委任を望む。",
          "nextMoveJa": "目的・参加者・共有範囲・決定権・確認方法を本人と再設定する。",
          "guideUnitId": "GUIDE-01",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        },
        {
          "branchId": "P08-B2",
          "conditionJa": "本人が共有・会議を望まない。",
          "nextMoveJa": "個人情報を使わず、組織一般の仕事条件・相談経路だけを改善する。",
          "guideUnitId": "GUIDE-04",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        }
      ],
      "legacyEntries": [],
      "aliasResolutions": []
    },
    {
      "caseId": "health-time-and-morning-variation",
      "sourceBriefId": "CC2-MIG-01",
      "titleJa": "体調の波と仕事の山を、同じ時間軸で設計する",
      "openingJa": "通院後や午前中など体調に波がある時間へ、判断や締切が重なり、仕事を続けられるか不安です。",
      "readerJa": "就労中の本人",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "本人が感じる波は重要だが、病状だけで勤務変更を決めない。通院・睡眠・回復、具体的作業、時間帯、通勤、品質基準、相談しやすさがどう重なるかはまだ分からない。",
      "turningQuestionJa": "困るのは、仕事が重なる時間帯、必要な時に抜けて戻ること、それとも指示や確認の仕方など別のことですか。",
      "personControlJa": "本人は体調・診断の共有範囲、試す仕事条件、現状維持、医療・生活側の確認を先にする選択を決められる。",
      "authorityBoundaryJa": "健康・治療判断は本人と医療側、工程・品質・配置は職場の権限者、支援者は相互作用の翻訳候補を支える。",
      "stopConditionsJa": "急な健康悪化、重大安全リスク、安全な中断・交代が確保できない場合、本人が望まない情報要求、評価・雇用判断の即断では通常の試行を止める。切迫した必要への対応を、体制の完成まで待たせない。",
      "outcomeRevisionJa": "予定した変更が実際に使えたかを先に確かめる。中断できても、戻った後の手戻りや本人が望む参加の減少があれば成功で括らない。再開もできるのに回復が足りなければ、総負荷・通勤・健康条件等へ戻る。当日と翌日の回復、品質、本人と同僚の負担、現状維持の希望を分け、未実施を無効と取り違えず見直す。",
      "possibilities": [
        {
          "hypothesisId": "M01-H1",
          "kind": "primary",
          "statementJa": "通院・回復・立ち上がりの時間と、判断・締切・対人対応の山が同じ時間帯に集中している。",
          "wouldReviseJa": "時間帯や工程を変えても、同じ作業困難と翌日への影響が変わらない。"
        },
        {
          "hypothesisId": "M01-H2",
          "kind": "alternative",
          "statementJa": "時間の長さだけでなく、必要な時に中断する方法や、戻った時の作業状態・決定事項が共有されていない。変更情報や評価基準の曖昧さも重なっている。",
          "wouldReviseJa": "必要な時に安全に中断・再開でき、仕事条件も明確なのに、特定時間帯の困難や回復不足が残る。"
        },
        {
          "hypothesisId": "M01-H3",
          "kind": "counter",
          "statementJa": "本人は現在の勤務や共有範囲を変えたくなく、職場試行より治療・生活上の確認又は現状維持を選ぶことが合理的である。",
          "wouldReviseJa": "本人が仕事側の特定条件を変える小さな試行を望む。"
        }
      ],
      "branches": [
        {
          "branchId": "M01-B1",
          "conditionJa": "特定の時間帯に、締切・判断・対人負荷が集中している。",
          "nextMoveJa": "本人が選ぶ範囲で、負荷が集中する工程を選び、仕事の山を移す案と必要な休憩・分担を組み合わせる。当日だけでなく翌日の回復と仕事の質を確認する。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-04",
          "guideSystemId": "WDG2-04",
          "guideTitleJa": "時間・仕事量・体調変動への備え"
        },
        {
          "branchId": "M01-B2",
          "conditionJa": "時間帯より、変更情報・確認先・品質基準・評価の曖昧さが困難を増やしている。",
          "nextMoveJa": "勤務時間を先に変えず、対象作業の完了条件、確認先、変更手順を一つの工程表にして試す。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-03",
          "guideSystemId": "WDG2-03",
          "guideTitleJa": "仕事の分け方・進め方"
        },
        {
          "branchId": "M01-B3",
          "conditionJa": "中断の時刻は決められないが、作業を安全に保存して後から再開できる。",
          "nextMoveJa": "交代要員を足すことから始めず、中断してよい範囲、途中の状態の残し方、再開時の確認先を決める。本人が望む方法で、事情の説明を毎回繰り返さずに使えるか確かめる。戻った時に仕事を詰め込んでいないかも見る。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-04",
          "guideSystemId": "WDG2-04",
          "guideTitleJa": "時間・仕事量・体調変動への備え",
          "readinessSectionId": "time-interruption"
        },
        {
          "branchId": "M01-B4",
          "conditionJa": "対面対応や工程を誰かへ渡す必要がある、又は中断すると大切な決定に参加できない。",
          "nextMoveJa": "交代が必要なら、担当名だけでなく必要な時に間に合うか、相手の仕事と受入余力まで確認する。会議等では、決定事項や本人の意見を戻す方法を検討し、担当から外すだけで解決としない。安全な中断・交代を確保できなければ通常の試行に進まず、権限者が工程・配置・受入量を見直す。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-04",
          "guideSystemId": "WDG2-04",
          "guideTitleJa": "時間・仕事量・体調変動への備え",
          "readinessSectionId": "time-interruption"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "health-time",
          "labelJa": "通院と回復時間が読めない"
        },
        {
          "caseId": "morning-drowsiness",
          "labelJa": "午前中の眠気で注意される"
        },
        {
          "caseId": "commute-fatigue",
          "labelJa": "通勤だけで消耗する"
        }
      ],
      "aliasResolutions": [
        {
          "currentQuestionJa": "通勤がつらいなら、在宅勤務にすべきか。"
        }
      ]
    },
    {
      "caseId": "evaluation-role-learning",
      "sourceBriefId": "CC2-MIG-02",
      "titleJa": "「意欲が続かない」を、役割・評価・学習条件の仮説に開く",
      "openingJa": "評価面談で「意欲が続かない」と言われますが、何を期待され、何を学べば評価が変わるのか分かりません。",
      "readerJa": "就労中の本人",
      "phaseJa": "評価・役割・成長",
      "doNotConcludeJa": "行動量の低下や上司の評価は観察の一部であり、本人の意欲・能力を確定しない。役割期待、仕事量、裁量、フィードバック、学習機会、健康・生活上の制約、本人が望む働き方はまだ分からない。",
      "turningQuestionJa": "本人が望む役割と安定を確認した上で、行動が減る前に、期待・仕事配分・練習機会・フィードバックのどれが変わりましたか。",
      "personControlJa": "本人は安定、学習、役割拡大、別役割、保留を同格に選び、評価面談へ同席者又は別経路を求められる。",
      "authorityBoundaryJa": "本人が目標と情報共有を選び、管理者が仕事期待を明示し、人事が評価制度と機会の公正を点検する。支援者は意欲や適性を確定しない。",
      "stopConditionsJa": "報復・退職強要の懸念、本人不在の機会縮小、診断名による役割制限、未合意の評価変更、健康危機がある場合は通常の育成試行を止める。",
      "outcomeRevisionJa": "成果の質だけでなく、役割の選択、学習機会、評価の納得、健康・生活負担、同僚負担、機会縮小を分け、改善・不変・悪化・混合で見立てを更新する。",
      "possibilities": [
        {
          "hypothesisId": "M02-H1",
          "kind": "primary",
          "statementJa": "役割と成果基準、練習機会、フィードバックが曖昧で、本人が何を変えればよいか判断できない。",
          "wouldReviseJa": "期待・基準・練習機会が明確でも、本人はその役割や学習を望んでいない。"
        },
        {
          "hypothesisId": "M02-H2",
          "kind": "alternative",
          "statementJa": "配慮や失敗回避を理由に役割・裁量・学習機会が先回りして縮小され、行動の減少が意欲低下として評価されている。",
          "wouldReviseJa": "役割と機会は維持され、本人も利用できているが、別の健康・生活・対人条件が行動を制約している。"
        },
        {
          "hypothesisId": "M02-H3",
          "kind": "counter",
          "statementJa": "本人は現在の安定した役割を選び、拡大や昇進を望んでいないため、成長機会を増やすこと自体が望ましいとは限らない。",
          "wouldReviseJa": "本人が役割拡大又は異なる評価機会を望むが、選択肢を提示されていない。"
        }
      ],
      "branches": [
        {
          "branchId": "M02-B1",
          "conditionJa": "本人は学習や役割拡大を望むが、期待・基準・練習機会が曖昧である。",
          "nextMoveJa": "評価を保留したまま、対象業務一つの完了条件、練習場面、フィードバック日を合意し、学習可能性を確認する。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-03",
          "guideSystemId": "WDG2-03",
          "guideTitleJa": "仕事の分け方・進め方"
        },
        {
          "branchId": "M02-B2",
          "conditionJa": "本人は現在の安定を望む、又は配慮後に機会が先回りして縮小されている。",
          "nextMoveJa": "役割拡大を前提にせず、現状維持・再拡大・別役割の選択肢と、各選択の評価・所得・負担を本人と確認する。",
          "guideUnitId": "GUIDE-03",
          "readinessSystemId": "WDG2-09",
          "guideSystemId": "WDG2-09",
          "guideTitleJa": "役割・評価・成長機会を公平にする"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "evaluation",
          "labelJa": "意欲が続かないと言われる"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "quality-error-safety-boundary",
      "sourceBriefId": "CC2-MIG-03",
      "titleJa": "「任せる／外す」の前に、ミスをリスクと学習条件へ分ける",
      "openingJa": "ミスが続き、現場から「もう任せられない」と言われていますが、安全の問題なのか、やり方を変えて確かめられる問題なのか整理できません。",
      "readerJa": "直属上司・現場管理者",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "管理者の品質・安全への懸念は重要だが、「ミス」という集計だけでは本人の能力、健康、適性、雇用判断を確定しない。具体的な作業、結果の重大性、検知と復旧、時間・中断・指示条件、既存の工程防護はまだ分からない。",
      "turningQuestionJa": "直近の一件は、どの作業で起き、手戻り・品質・安全のどれに影響し、いつ誰が検知でき、検知できなければ何が起きましたか。",
      "personControlJa": "本人は事実確認へ参加し、健康情報の共有範囲、同席者、説明の訂正、通常試行へ進まない選択を決められる。安全上の停止権限とは分ける。",
      "authorityBoundaryJa": "安全・品質責任者が工程停止と再開条件を決め、管理者が工程・教育・確認を設計し、人事が評価・雇用判断を別手続で扱う。支援者は適性を確定しない。",
      "stopConditionsJa": "重大危害の可能性、防護不明、事実確認前の排除、診断名からの危険推定、報復又は雇用判断への短絡がある場合は通常の小試行を止める。",
      "outcomeRevisionJa": "エラーの種類、頻度、検知時点、復旧、品質・安全、本人・確認者の負担、役割・評価への影響を分け、改善・不変・悪化・混合・未実装で仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "M03-H1",
          "kind": "primary",
          "statementJa": "可逆的な入力漏れや手戻りが、締切前の集中、中断、確認点の不足によって増え、安全上の危険と一括りにされている。",
          "wouldReviseJa": "ミスが不可逆又は重大な危害へ直結し、既存の防護でも発生前に止められない。"
        },
        {
          "hypothesisId": "M03-H2",
          "kind": "alternative",
          "statementJa": "本人側の変化だけでなく、指示変更、例外処理、速度、割込み、教育・確認担当の不在が、エラーの発生又は発見遅れを作っている。",
          "wouldReviseJa": "作業条件と防護が安定していても同じ種類のエラーが再現し、別の確認が必要になる。"
        },
        {
          "hypothesisId": "M03-H3",
          "kind": "counter",
          "statementJa": "高損失又は検知不能な安全リスクであり、小さな仕事試行を先に行うこと自体が不適切で、権限者による停止と専門確認が必要である。",
          "wouldReviseJa": "結果が可逆的で早期検知でき、安全責任者が防護付きの限定試行を承認できる。"
        }
      ],
      "branches": [
        {
          "branchId": "M03-B1",
          "conditionJa": "不可逆又は重大な安全影響があり、早期検知と防護条件を確認できない。",
          "nextMoveJa": "通常の改善試行を止め、対象工程を切り離し、安全・品質責任者が危険源、必要な防護、再開権限を確認する。これを本人の雇用適性判断へ直結させない。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-05",
          "guideSystemId": "WDG2-05",
          "guideTitleJa": "働く環境・情報・安全へのアクセス"
        },
        {
          "branchId": "M03-B2",
          "conditionJa": "影響は可逆的で検知でき、特定の中断・締切・確認条件に集中している。",
          "nextMoveJa": "一工程だけに確認点又は中断ルールを置き、手戻り、品質、本人負担、確認者負担を期限付きで比較する。",
          "guideUnitId": "GUIDE-02",
          "readinessSystemId": "WDG2-03",
          "guideSystemId": "WDG2-03",
          "guideTitleJa": "仕事の分け方・進め方"
        },
        {
          "branchId": "M03-B3",
          "conditionJa": "指示が食い違い、聞き直すと叱責や不利益を受ける心配から確認できなくなっている。",
          "nextMoveJa": "質問練習を増やす前に、本人が話せる別の担当と共有範囲を確かめる。職場の決定者は指示の食い違いと返答方法を直し、申告された出来事の確認は利害関係から独立した経路へつなぐ。未確認のまま事実を断定せず、必要な安全確保まで待たせない。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "quality-error-safety",
          "labelJa": "ミスをどう扱うか迷う"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "support-plan-to-workplace-implementation",
      "sourceBriefId": "CC2-MIG-04",
      "titleJa": "支援計画を、本人統制のある仕事条件と実装責任へ翻訳する",
      "openingJa": "支援計画には「疲労への配慮が必要」とありますが、職場では何を誰が変えるのか決まらず、計画を渡したところで止まっています。",
      "readerJa": "就労支援者",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "支援計画は支援側の重要な観察と提案だが、本人の現在の希望、共有同意、月末の具体的仕事、職場の権限・人員・安全条件を単独では確定しない。文書受領は実装でも結果でもない。",
      "turningQuestionJa": "本人が実現したいことを一つ選ぶと、この計画の一文は、どの仕事条件を、誰が、いつ変え、何を見て続行・中止・修正する提案になりますか。",
      "personControlJa": "本人は計画を共有しない、範囲を狭める、表現を訂正する、仕事変更を保留する、同席者と結果返却先を選ぶことができる。",
      "authorityBoundaryJa": "本人が目標と情報共有を選び、支援者が翻訳候補を作り、職場の権限者が業務・要員・安全を決裁する。支援計画は職場命令又は医療判断を代行しない。",
      "stopConditionsJa": "本人同意のない共有、目的外利用、診断・支援ラベルからの職務排除、実行責任者不在、負担又は安全悪化、未実装を本人の非協力と扱う場合は進めない。",
      "outcomeRevisionJa": "受領、翻訳、決裁、実装、未実装を分け、仕事、疲労・回復、生活、本人・同僚・支援者の負担、不利益、本人の再選択から計画と仕事設計を見直す。",
      "possibilities": [
        {
          "hypothesisId": "M04-H1",
          "kind": "primary",
          "statementJa": "「疲労への配慮」などの支援用語が、月末残業、急な確認依頼、回復時間、優先順位、評価期間のどれを変える話か翻訳されていない。",
          "wouldReviseJa": "対象仕事と変更条件は具体的だが、権限者、要員又は実装期限がなく動いていない。"
        },
        {
          "hypothesisId": "M04-H2",
          "kind": "alternative",
          "statementJa": "翻訳案はあるが、職場側の決裁・要員・安全責任と支援側の結果回収がつながらず、文書受領が完了扱いになっている。",
          "wouldReviseJa": "実行責任と確認日はあるが、本人の目標又は共有範囲と一致していない。"
        },
        {
          "hypothesisId": "M04-H3",
          "kind": "counter",
          "statementJa": "本人は計画の共有又は職場変更を望んでおらず、支援者が善意で連携を進めることが本人統制と信頼を損なう。",
          "wouldReviseJa": "本人が目的、受領者、共有範囲、試す仕事条件を選び、限定的な実装を望む。"
        }
      ],
      "branches": [
        {
          "branchId": "M04-B1",
          "conditionJa": "本人が限定共有と一つの仕事条件変更を望み、職場に実行権限者がいる。",
          "nextMoveJa": "計画の一文を対象作業、変更内容、担当、実装日、確認日、戻り先へ変換し、実装できない場合も理由と代替案を本人へ返す。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-07",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        },
        {
          "branchId": "M04-B2",
          "conditionJa": "本人の目的・共有選択が未確認、又は受領者と利用目的が広すぎる。",
          "nextMoveJa": "計画全文の送付を止め、本人と目的、受領者、最小情報、保留・撤回を確認する。職場では個人情報なしで確認できる仕事条件から始める。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-02",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "support-plan-not-workplace",
          "labelJa": "支援計画が職場に届かない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "training-to-workplace-use-and-revision",
      "sourceBriefId": "CC2-MIG-05",
      "titleJa": "研修を、持ち帰る一問から職場での使用・不使用まで設計する",
      "openingJa": "制度説明や事例紹介の研修は満足度が高いのですが、受講者が職場で何を確かめ、使わなかったとき何を見直すのか分かりません。",
      "readerJa": "行政・研修設計",
      "phaseJa": "研修・制度・地域",
      "doNotConcludeJa": "主催者の研修要望と満足度は一つの観察にすぎず、受講者の役割、職場権限、実行余力、本人が関わる情報統制、実際の使用・結果は分からない。理解又は使用が支援効果を証明するわけでもない。",
      "turningQuestionJa": "受講者が研修後に一つだけ確かめる職場場面は何で、その答えを誰の判断へ渡し、使われなかった場合は研修・権限・資源のどれを見直しますか。",
      "personControlJa": "障害・疾病のある本人の事例や情報を研修素材に使う場合は、目的、範囲、匿名化、撤回を本人が選ぶ。受講者も個人情報を出さず人工事例で練習できる。",
      "authorityBoundaryJa": "主催者が研修目的を、受講者が役割内の持ち帰りを、職場権限者が仕事変更を決める。研修受講は専門性、個人適合、支援効果又は実行権限を認証しない。",
      "stopConditionsJa": "同意のない実ケース利用、診断別の固定対応、満足度からの効果断定、権限外の職場変更、追跡による個人監視、負担・不利益の増加では実施又は追跡を止める。",
      "outcomeRevisionJa": "受講、理解、使用、未使用と理由、実装、仕事上の変化、無変化・悪化、本人・受講者・職場の負担を分け、研修仮説と組織側の実装条件を人間が見直す。",
      "possibilities": [
        {
          "hypothesisId": "M05-H1",
          "kind": "primary",
          "statementJa": "対象者像と制度項目を広く教える一方で、受講者が翌日どの職場場面をどう識別するかという判断課題が固定されていない。",
          "wouldReviseJa": "判断課題と持ち帰り道具は明確だが、職場で使う権限・時間・相談先がない。"
        },
        {
          "hypothesisId": "M05-H2",
          "kind": "alternative",
          "statementJa": "研修内容は理解されても、仕事条件を変える権限、要員、確認日、支援者への戻り先がなく、未使用が受講者個人の問題にされている。",
          "wouldReviseJa": "使用機会と権限はあるが、研修の問いが実際の複雑な相談を区別できない。"
        },
        {
          "hypothesisId": "M05-H3",
          "kind": "counter",
          "statementJa": "不足しているのは知識ではなく決裁、業務量又は連携責任であり、追加研修より組織の運用設計を直接変える方が適切である。",
          "wouldReviseJa": "権限・資源・責任はあるが、受講者が相談断片を具体的仕事条件へ翻訳できず判断が止まる。"
        }
      ],
      "branches": [
        {
          "branchId": "M05-B1",
          "conditionJa": "変えたい職場判断はあるが、持ち帰る問いと実装先が定まっていない。",
          "nextMoveJa": "一つの人工相談を使い、断片、競合仮説、次の一問、職場で渡す相手を一枚にする。個人情報や診断別正解集は持ち込まない。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-07",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        },
        {
          "branchId": "M05-B2",
          "conditionJa": "持ち帰り道具はあるが、使用・不使用、負担、結果、改訂が追われていない。",
          "nextMoveJa": "受講、理解、使用、未使用、実装を分け、確認した仕事条件と負担を期限付きで戻す。満足度や使用件数を効果へ変換しない。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-10",
          "guideSystemId": "WDG2-10",
          "guideTitleJa": "試した結果を振り返り改善する"
        },
        {
          "branchId": "M05-B3",
          "conditionJa": "知識より、権限・要員・責任の不在が職場実装を止めている。",
          "nextMoveJa": "研修追加を保留し、決裁者、実装担当、減らす仕事、相談経路を組織側の準備課題として扱う。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "training-menu",
          "labelJa": "研修メニューが作れない"
        },
        {
          "caseId": "training-followup",
          "labelJa": "研修後の変化が追えない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "workplace-information-request-boundary",
      "sourceBriefId": "CC2-MIG-06",
      "titleJa": "「どこまで聞くか」を、必要な仕事判断と情報統制へ分ける",
      "openingJa": "本人から事情を聞きましたが、仕事を調整するために何を確認し、何は聞かず、誰まで共有してよいのか判断できません。",
      "readerJa": "人事・雇用担当",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "職場が仕事上の判断に必要な条件を確認する責任と、本人の情報統制はどちらも重要である。しかし「配慮に必要」「安全のため」という抽象目的だけでは、必要性、受領者、保有期間、再共有、代替手段、本人の不利益を確定できない。",
      "turningQuestionJa": "いま誰が何を決めるために必要な情報で、病状や私生活ではなく、時間・作業・連絡・環境・安全の条件として本人が共有を選べる最小範囲は何ですか。",
      "personControlJa": "本人は共有する仕事条件、共有しない情報、受領者、同席者、保留、訂正、撤回を選べる。共有しないことを協力不足又は能力判断へ変換しない。",
      "authorityBoundaryJa": "本人が情報提供を選び、情報管理責任者が利用範囲を管理し、管理者・人事が各自の仕事・雇用権限だけを行使する。支援者とNBLは開示義務、適法性又は適性を確定しない。",
      "stopConditionsJa": "目的不明の質問、診断名の一括要求、同意のない再共有、撤回不能、報復・評価利用の懸念、情報と雇用判断の権限混同では通常の聞き取りを止める。",
      "outcomeRevisionJa": "情報取得量ではなく、本人の選択、用途遵守、仕事条件の実装、説明負担、二次利用、不利益、未解決を分け、情報仮説と職場設計を更新する。",
      "possibilities": [
        {
          "hypothesisId": "M06-H1",
          "kind": "primary",
          "statementJa": "調整したい仕事判断が特定されず、病状や生活事情を広く聞くことが情報収集の入口になっている。",
          "wouldReviseJa": "対象の仕事判断、必要最小情報、受領者、期限が明確でも、本人が共有を望まない又は別の仕事設計を望む。"
        },
        {
          "hypothesisId": "M06-H2",
          "kind": "alternative",
          "statementJa": "本人は仕事条件の限定共有を望むが、受領後の再共有、保存、評価利用、訂正・撤回の運用がないため共有できない。",
          "wouldReviseJa": "目的別の最小共有と統制が実際に動き、それでも必要な仕事判断に不足が残る。"
        },
        {
          "hypothesisId": "M06-H3",
          "kind": "counter",
          "statementJa": "本人の追加情報を得なくても、職務・工程・連絡・休憩・安全の一般条件を明確にすれば、いまの判断には足りる。",
          "wouldReviseJa": "一般条件を明確にしても、本人だけが選べる限定情報なしには具体的な選択肢を比較できない。"
        }
      ],
      "branches": [
        {
          "branchId": "M06-B1",
          "conditionJa": "具体的な仕事判断と受領者が定まり、本人が限定した仕事条件の共有を望む。",
          "nextMoveJa": "目的、受領者、仕事条件、保有期限、再共有、訂正・撤回を一枚にし、実装に不要な病状・生活情報を収集しない。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-02",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        },
        {
          "branchId": "M06-B2",
          "conditionJa": "仕事判断が曖昧、本人が共有を望まない、又は一般的な職務・工程情報だけで判断できる。",
          "nextMoveJa": "追加の健康情報要求を止め、個人情報を使わず職務、連絡、休憩、アクセス、安全の一般条件を先に整える。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-05",
          "guideSystemId": "WDG2-05",
          "guideTitleJa": "働く環境・情報・安全へのアクセス"
        },
        {
          "branchId": "M06-B3",
          "conditionJa": "具体的な重大安全又は不利益の懸念があるが、必要性、権限、情報取扱いが確認できない。",
          "nextMoveJa": "通常の聞き取りと小試行を止め、安全・情報管理・雇用判断の権限者を分けて確認し、本人への一括開示要求へ進まない。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "disclosure-boundary",
          "labelJa": "どこまで聞いてよいか分からない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "return-to-work-staged-recovery",
      "sourceBriefId": "CC2-MIG-07",
      "titleJa": "復職を一日で完成させず、仕事と回復を別速度で戻す",
      "openingJa": "復職はできましたが、出勤できたことを通常業務へ戻せることと見られ、二週目から疲労と修正作業が重なっています。",
      "readerJa": "休職・復職者",
      "phaseJa": "悪化・休職・復職",
      "doNotConcludeJa": "出勤実績、本人の不安、専門職の助言、上司の観察はそれぞれ重要だが、単独では復職可否、仕事量、継続可能性、能力、予後を確定しない。仕事と回復の時間差、評価圧力、家庭負担、戻す権限はまだ分からない。",
      "turningQuestionJa": "今週増やす候補を出勤時間・仕事量・判断範囲・対人負荷・評価の一つに分けたとき、本人はどれを選び、何が起きたら誰の権限で保留又は一段戻しますか。",
      "personControlJa": "本人は増やす、維持する、戻す、保留する、再休養する選択と、健康情報の共有範囲、確認参加者を決められる。復職速度を意欲又は協力の尺度にしない。",
      "authorityBoundaryJa": "本人が目標と共有を選び、医療・産業保健が役割内の健康・機能上の見解を、人事・職場権限者が就業・工程・評価判断を担う。支援者とNBLは復職可否や予後を確定しない。",
      "stopConditionsJa": "急な健康・安全悪化、本人が望まない増加、戻す選択の消失、評価・雇用不利益への短絡、権限者不在、計画外の仕事密度増加では段階試行を止める。",
      "outcomeRevisionJa": "出勤だけでなく、仕事量・品質、判断・対人負荷、当日と翌日以降の回復、生活、本人選択、同僚・家族負担、未実装を分け、段階と仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "M07-H1",
          "kind": "primary",
          "statementJa": "出勤、仕事量、判断範囲、会議・対人負荷、評価が同じ速度で戻され、翌日以降の回復を確認する期間がない。",
          "wouldReviseJa": "各条件を段階化し回復も確認しているが、別の健康・安全又は生活条件が継続を制約している。"
        },
        {
          "hypothesisId": "M07-H2",
          "kind": "alternative",
          "statementJa": "本人が再休職や低評価を恐れて負荷増加を言い出せず、計画上の段階復帰と実際の仕事密度がずれている。",
          "wouldReviseJa": "本人が不利益なく増減・保留を選べ、実際の仕事量も記録どおりである。"
        },
        {
          "hypothesisId": "M07-H3",
          "kind": "counter",
          "statementJa": "いまは仕事条件の小試行より、本人が望む保留・再休養又は健康・安全上の専門確認を先にする段階である。",
          "wouldReviseJa": "本人が限定した仕事再開を望み、必要な健康・安全確認と職場権限がそろう。"
        }
      ],
      "branches": [
        {
          "branchId": "M07-B1",
          "conditionJa": "本人が限定した復帰を望み、健康・安全確認と実装権限がそろい、戻す基準を決められる。",
          "nextMoveJa": "一期間に一条件だけ増やし、当日遂行、翌日以降の回復、仕事品質、本人・周囲負担を確認してから次段階を選ぶ。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-06",
          "guideSystemId": "WDG2-06",
          "guideTitleJa": "採用・実習・復職・異動をつなぐ"
        },
        {
          "branchId": "M07-B2",
          "conditionJa": "出勤はできるが、実際の仕事密度、会議、判断、評価が計画より先に通常化している。",
          "nextMoveJa": "勤務時間だけを減らさず、仕事量・判断・会議・締切を段階表へ戻し、増やす仕事と同時に減らす仕事を決める。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-04",
          "guideSystemId": "WDG2-04",
          "guideTitleJa": "時間・仕事量・体調変動への備え"
        },
        {
          "branchId": "M07-B3",
          "conditionJa": "本人が保留・再休養を望む、急な悪化又は安全懸念がある、必要な専門確認又は職場権限がない。",
          "nextMoveJa": "通常化と仕事試行を止め、本人の選択、健康・安全確認、就業判断、職場実装の権限を分けて再確認する。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-07",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "return-to-work-step",
          "labelJa": "復職後の戻り方が分からない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "support-response-with-person-control",
      "sourceBriefId": "CC2-MIG-08",
      "titleJa": "支援を早める前に、本人統制と応答責任を設計する",
      "openingJa": "休憩や確認ミスが増えてから支援へ連絡しようとしても、本人は大ごとにされたくなく、職場も支援側も誰がいつ応答するのか決まっていません。",
      "readerJa": "就労支援者",
      "phaseJa": "悪化・休職・復職",
      "doNotConcludeJa": "職場の小さな変化、本人の沈黙、支援者の過去経験は部分的観察であり、悪化、支援必要性、本人の意思、緊急性を単独では確定しない。早期連絡は利益だけでなく問題化、監視、説明負担、情報拡散を生む可能性がある。",
      "turningQuestionJa": "観察された一つの変化について、本人は何を望み、何を共有せず、誰がいつまでにどの仕事判断へ応答し、応答が遅れた場合に先に失われるものは何ですか。",
      "personControlJa": "本人は相談する、限定する、保留する、別経路を選ぶ、訂正・撤回する選択を持つ。急迫時も可能な範囲で目的、共有、参加、事後確認を本人へ戻す。",
      "authorityBoundaryJa": "支援機関が相談受領と翻訳を、職場権限者が仕事実装を、該当専門職が役割内の高損失判断を担う。本人の意思、診断、危機、就業可否を支援者又はNBLが確定しない。",
      "stopConditionsJa": "本人の非相談を遵守不足とみなす、観察だけで悪化を確定する、同意のない恒常監視、応答責任者不在、急迫情報を通常経路へ留める、支援者が雇用判断を所有する場合は停止する。",
      "outcomeRevisionJa": "早期連絡件数ではなく、本人選択、応答時間、仕事条件の実装・未実装、健康・仕事・生活、説明負担、情報拡散、不利益、支援側負担を分け、応答仮説を人間が更新する。",
      "possibilities": [
        {
          "hypothesisId": "M08-H1",
          "kind": "primary",
          "statementJa": "本人と職場が軽く相談できる範囲、受領者、応答期限がなく、重大化するまで正式依頼として受け付けられない。",
          "wouldReviseJa": "低負担の入口と応答責任はあるが、本人が過去の不利益又は別の希望から利用を望まない。"
        },
        {
          "hypothesisId": "M08-H2",
          "kind": "alternative",
          "statementJa": "早期サインとされる変化が繁忙、工程変更、上司不在など一般的職場条件で生じ、個別支援へ接続する前に職場側で確認できる。",
          "wouldReviseJa": "一般的な仕事条件を戻しても本人が選ぶ個別相談の必要が残る。"
        },
        {
          "hypothesisId": "M08-H3",
          "kind": "counter",
          "statementJa": "本人は支援接続を望まず、急迫した高損失懸念もないため、支援を早めるより非相談を守り、組織一般の仕事条件だけを改善する方が適切である。",
          "wouldReviseJa": "本人が限定相談を望む、又は具体的な安全・健康・雇用上の高損失情報が生じる。"
        }
      ],
      "branches": [
        {
          "branchId": "M08-B1",
          "conditionJa": "本人が限定した軽い相談を望み、急迫した高損失懸念はなく、支援側の応答担当と期限を置ける。",
          "nextMoveJa": "一つの仕事場面、共有範囲、受領者、一次回答日を合意し、支援依頼ではなく仕事条件の短い確認として往復させる。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-07",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        },
        {
          "branchId": "M08-B2",
          "conditionJa": "本人は連絡を望まない、又は変化は繁忙・工程・上司不在など一般的職場条件で説明可能で、高損失懸念がない。",
          "nextMoveJa": "個人情報を集めず支援接続を保留し、誰にでも使える仕事条件と、本人が後から選べる相談入口を維持する。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        },
        {
          "branchId": "M08-B3",
          "conditionJa": "具体的な健康・安全・報復・離職上の高損失懸念があり、通常の応答期限では先に損失が生じる。",
          "nextMoveJa": "通常の低負担確認を止め、本人の参加可能性を確保しつつ、健康・安全・雇用の該当権限者へ分けて緊急接続する。支援者だけで結論を所有しない。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        },
        {
          "branchId": "M08-B4",
          "conditionJa": "本人は相談を望むが、紹介先が引き受けたか分からない、対象外、又は待機中である。",
          "nextMoveJa": "紹介したことと受理されたことを分ける。本人が選ぶ連絡役が、相手の対応範囲・受入・次の返答を確認し、引き受けられなければ代替先と待つ間に職場でできる対応を相談する。就職や担当交代を支援の自動終了にせず、再相談先と引継ぎ範囲を本人と決める。恒常的な追跡や無断共有は行わない。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-07",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "support-agency-delay",
          "labelJa": "支援がいつも後手になる"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "medical-life-work-person-governed-bridge",
      "sourceBriefId": "CC2-MIG-09",
      "titleJa": "医療・生活・仕事を、本人が選ぶ判断の橋でつなぐ",
      "openingJa": "主治医、生活支援、職場にそれぞれ相談していますが、話が別々で、誰に何を戻せば仕事が変わるのか分かりません。",
      "readerJa": "就労支援者",
      "phaseJa": "悪化・休職・復職",
      "doNotConcludeJa": "医療、生活、職場の情報はそれぞれ異なる場面の部分視点である。本人の目的と同意、具体的仕事条件、家族・生活側の負担、緊急性、各者の権限が分からないまま、情報を結合したり就業可否を推定したりしない。",
      "turningQuestionJa": "本人が今変えたいことは何で、医療・生活・仕事のどの観察が誰のどの判断を変え、何は共有しないままにしますか。",
      "personControlJa": "本人は、つなぐ目的、共有する観察、共有しない詳細、参加者、確認・訂正・撤回、領域を別々に保つ選択を決められる。家族又は支援者の希望を本人の希望へ置き換えない。",
      "authorityBoundaryJa": "医療側は役割内の健康・機能判断、生活支援側は生活条件と利用支援、職場は仕事条件と雇用上の実装を担う。就労支援者は接続候補を作るが、本人の意思、就業可否、各領域の最終判断を統合所有しない。",
      "stopConditionsJa": "目的・受領者・決定権が不明な情報集約、本人不在の恒常共有、家族の無償負担を就労継続条件にする、医療情報から雇用判断へ直結する、急迫情報を通常連携へ留める場合は停止する。",
      "outcomeRevisionJa": "連携件数ではなく、本人の選択、仕事条件の実装・未実装、健康・生活・仕事・家族・支援側の負担、情報拡散、不利益、無変化・悪化・混合結果を分け、人間が接続仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "M09-H1",
          "kind": "primary",
          "statementJa": "医療・生活側で見える回復不足や負担が、職場で変更可能な時間・負荷・相談先へ翻訳されていない。",
          "wouldReviseJa": "本人が選んだ仕事条件へ翻訳し実装しても、生活・健康・仕事の接触と負担が変わらない。"
        },
        {
          "hypothesisId": "M09-H2",
          "kind": "alternative",
          "statementJa": "情報不足より、目的・受領者・決定者・実装者・確認日が領域ごとに異なり、誰も接続責任を持っていない。",
          "wouldReviseJa": "各者の役割と戻り先が明確でも、本人が必要とする判断だけが進まない。"
        },
        {
          "hypothesisId": "M09-H3",
          "kind": "counter",
          "statementJa": "本人は領域間共有を望まず、一般的な仕事条件の改善又は各領域内の支援を別々に進める方が妥当である。",
          "wouldReviseJa": "本人が限定した情報と目的で、複数領域をつなぐ判断を希望する。"
        }
      ],
      "branches": [
        {
          "branchId": "M09-B1",
          "conditionJa": "本人が、特定の生活・健康上の観察を一つの仕事条件へ限定して翻訳することを望む。",
          "nextMoveJa": "診断や生活詳細を広げず、変更対象、受領者、決定者、実装者、確認日を一本の橋として合意する。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-07",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        },
        {
          "branchId": "M09-B2",
          "conditionJa": "本人が領域間共有を望まない、又は個人情報なしに一般の仕事条件を先に変えられる。",
          "nextMoveJa": "連携を増やさず、本人が選ぶ各領域内の相談と、職場一般の時間・負荷・相談経路の改善を分けて進める。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-02",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        },
        {
          "branchId": "M09-B3",
          "conditionJa": "急な健康・安全上の懸念、生活基盤の破綻、又は差し迫る雇用上の不利益がある。",
          "nextMoveJa": "通常の連携設計を止め、該当領域の権限者へ限定してつなぎ、本人参加と仕事判断を別に保持する。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "medical-life-work-gap",
          "labelJa": "医療・生活・仕事が分断する"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "person-words-without-proxy-takeover",
      "sourceBriefId": "CC2-MIG-10",
      "titleJa": "短い言葉を奪わず、本人参加のまま仕事条件へ翻訳する",
      "openingJa": "本人は「疲れる」とだけ言います。詳しく説明できないなら、支援者が代わりに職場へ話すしかないのでしょうか。",
      "readerJa": "就労支援者",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "短い言葉は説明能力、意思、就労能力の不足を示さない。本人が話さない選択、質問形式・関係・時間・言語・認知負荷、具体的仕事接触、支援者の推測、職場が必要とする判断を分けて確認する。",
      "turningQuestionJa": "本人が残したい一文は何で、どの仕事場面を一つ確かめると、支援者が意味を足さずに次の判断を分けられますか。",
      "personControlJa": "本人は短い言葉のまま相談する、別の表現方法を選ぶ、原文を残す、補足を修正・拒否・撤回する、詳しく話さず一般条件だけを変える選択を持つ。",
      "authorityBoundaryJa": "本人が意味と共有範囲を、支援者が本人確認済みの仕事条件への翻訳候補を、職場権限者が工程・品質・負担の実装を担う。支援者又はAIは本人の意思・診断・能力・適性を代理決定しない。",
      "stopConditionsJa": "本人の原文が消える、支援者の推測を本人発言として扱う、拒否後も説明を続ける、長い説明を支援条件にする、本人不在で共有・評価・雇用判断へ進む、重大安全信号を通常翻訳で扱う場合は停止する。",
      "outcomeRevisionJa": "説明量や合意成立だけで成功とせず、本人参加・情報境界、仕事品質、本人・同僚・支援者の負担、実装・不実装、無変化・悪化・混合、撤回を分け、人間が翻訳仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "M10-H1",
          "kind": "primary",
          "statementJa": "本人の短い言葉には仕事接触の手掛かりがあるが、説明量を増やすことが先行し、次の判断を分ける一場面が確かめられていない。",
          "wouldReviseJa": "本人が選んだ方法で具体的仕事場面を確かめても、困難の現れ方や望む変更が区別できない。"
        },
        {
          "hypothesisId": "M10-H2",
          "kind": "alternative",
          "statementJa": "内容の不足ではなく、質問形式、時間、相手、言語、感覚・認知負荷、又は職場の確認方法が表現を狭めている。",
          "wouldReviseJa": "本人が選ぶ表現方法や確認手順へ変えても、伝えたい範囲と仕事条件が変わらない。"
        },
        {
          "hypothesisId": "M10-H3",
          "kind": "counter",
          "statementJa": "本人は詳しく説明することも支援者の補足も望まず、個人情報を使わない一般的な仕事条件の改善を選んでいる。",
          "wouldReviseJa": "本人が一文又は限定した補足を選び、特定の仕事判断へ使うことを望む。"
        }
      ],
      "branches": [
        {
          "branchId": "M10-B1",
          "conditionJa": "本人が一文と一つの仕事場面を選び、限定した仕事条件への翻訳を望む。",
          "nextMoveJa": "本人の原文と支援者の補足を分け、本人確認後に作業・時間・情報・環境の一条件だけを職場へ渡す。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-02",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        },
        {
          "branchId": "M10-B2",
          "conditionJa": "表現方法、質問形式、時間、相手又は情報アクセスが主な障壁である。",
          "nextMoveJa": "長い説明を求めず、本人が選ぶ短文、選択肢、図、時間差回答など一つの確認方法を試す。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-05",
          "guideSystemId": "WDG2-05",
          "guideTitleJa": "働く環境・情報・安全へのアクセス"
        },
        {
          "branchId": "M10-B3",
          "conditionJa": "本人が補足・共有を望まない、又は支援者と本人の意味が一致しない。",
          "nextMoveJa": "代理説明を止め、非共有を保持する。個人情報なしの一般的な仕事条件だけを職場側で点検する。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-02",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "self-advocacy-words",
          "labelJa": "本人がうまく説明できない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "workplace-owned-priority-change",
      "sourceBriefId": "CC2-MIG-11",
      "titleJa": "優先順位を、本人の段取りではなく職場の決定として管理する",
      "openingJa": "複数の人から依頼が来て途中で優先順位も変わり、何から手をつけても「違う」と言われそうで止まります。",
      "readerJa": "就労中の本人",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "本人の停止や遅れは重要な観察だが、段取り能力の不足を確定しない。依頼者間の権限、変更基準、旧期限、完了条件、確認先、評価責任、本人が使いやすい外部化方法はまだ分からない。",
      "turningQuestionJa": "いまの一位を誰が決め、変更するとき、誰が元の依頼者・期限・完了条件・評価を更新しますか。",
      "personControlJa": "本人は確認する、競合を権限者へ戻す、外部化方法を選ぶ、途中変更を記録してもらう、特定ツールを使わない選択を持つ。",
      "authorityBoundaryJa": "優先順位・期限・品質・評価は職場の権限者が決め、本人は使う確認・外部化方法を選ぶ。支援者は競合構造を可視化できるが、業務命令を代理決定しない。",
      "stopConditionsJa": "相反する業務命令のまま不利益評価を行う、確認行動を懲戒・報復へ結びつける、重大な安全・品質判断を本人だけに委ねる、本人の状態を診断名で確定する場合は通常試行を止める。",
      "outcomeRevisionJa": "完了件数だけでなく、競合解消時間、旧依頼者への連絡、手戻り、品質、本人・管理者・同僚負担、評価の更新、不変・悪化・混合を分けて仮説を見直す。",
      "possibilities": [
        {
          "hypothesisId": "M11-H1",
          "kind": "primary",
          "statementJa": "複数依頼の優先順位を決める単一の権限者が不在で、競合の解消を本人が引き受けている。",
          "wouldReviseJa": "優先順位の決定者と基準が一貫していても、着手・切替・再開の困難が残る。"
        },
        {
          "hypothesisId": "M11-H2",
          "kind": "alternative",
          "statementJa": "変更の決定自体は妥当だが、旧依頼者への連絡、元の期限、完了条件、評価が更新されず、本人だけが未完了責任を負っている。",
          "wouldReviseJa": "変更時に関係者・期限・評価が更新されても、同じ板挟みと遅れが続く。"
        },
        {
          "hypothesisId": "M11-H3",
          "kind": "counter",
          "statementJa": "職場の優先順位と変更手順は十分明確で、本人が選ぶ外部化方法又は切替後の再開手順を整えるだけで足りる可能性がある。",
          "wouldReviseJa": "本人が使いやすい方法を選んでも、競合命令又は評価責任の曖昧さが再発する。"
        }
      ],
      "branches": [
        {
          "branchId": "M11-B1",
          "conditionJa": "優先順位を決める権限者又は競合を戻す先がない。",
          "nextMoveJa": "複数依頼を一つの一覧へ置き、職場の権限者が一位と保留理由を決める。本人を依頼者間の調整役にしない。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        },
        {
          "branchId": "M11-B2",
          "conditionJa": "変更後も旧期限・完了条件・評価が残っている。",
          "nextMoveJa": "変更決定と同時に、元依頼者への連絡者、延期又は中止、再開地点、評価基準を更新する。",
          "guideUnitId": "GUIDE-02",
          "readinessSystemId": "WDG2-03",
          "guideSystemId": "WDG2-03",
          "guideTitleJa": "仕事の分け方・進め方"
        },
        {
          "branchId": "M11-B3",
          "conditionJa": "権限と変更手順は明確で、本人が切替・再開方法を選びたい。",
          "nextMoveJa": "一つの外部化方法を本人が選び、切替前の保存点と再開確認だけを小さく試す。特定ツールを義務化しない。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-05",
          "guideSystemId": "WDG2-05",
          "guideTitleJa": "働く環境・情報・安全へのアクセス"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "priority-switching",
          "labelJa": "優先順位がすぐ変わる"
        },
        {
          "caseId": "change-info",
          "labelJa": "急な予定変更が続く"
        },
        {
          "caseId": "chat-tone-misread",
          "labelJa": "チャットの意図が読めない"
        }
      ],
      "aliasResolutions": [
        {
          "currentQuestionJa": "急な予定変更が苦手な人には、どのような配慮を用意すればよいか。"
        },
        {
          "currentQuestionJa": "チャットが苦手な人には、口頭で説明すればよいか。"
        }
      ]
    },
    {
      "caseId": "short-time-role-outcome-evaluation",
      "sourceBriefId": "CC2-MIG-12",
      "titleJa": "短時間勤務を、時間の不足ではなく役割・成果・こぼれ仕事で評価する",
      "openingJa": "短時間勤務なので評価しにくいと言われますが、終えた仕事より不在時間の対応件数だけが見られています。",
      "readerJa": "人事・雇用担当",
      "phaseJa": "評価・役割・成長",
      "doNotConcludeJa": "短い勤務時間も対応件数も一部の観察であり、貢献・能力・公正を単独では決めない。役割、成果物、品質、引継ぎ、時間外へこぼれる仕事、処遇、本人が望む安定・成長、同僚負担はまだ分からない。",
      "turningQuestionJa": "本人の役割・成果物・品質・引継ぎと、勤務時間外へこぼれた仕事を分けると、何を評価し、残りを誰が担っていますか。",
      "personControlJa": "本人は現在の時間と役割を保つ、評価項目を確認する、役割・学習機会を選び直す、同席・別経路・保留を求める選択を持つ。",
      "authorityBoundaryJa": "役割・仕事配分・評価・処遇は職場の権限者が説明し、本人は希望と参加を選ぶ。支援者は成果・負担構造の翻訳までで、評価・契約・法的判断を代行しない。",
      "stopConditionsJa": "合意のない時間外労働・持ち帰り、本人不在の役割・処遇変更、目的不明の健康情報要求、短時間勤務だけを能力の代理にする、評価から即時に雇用判断へ進む場合は通常試行を止める。",
      "outcomeRevisionJa": "成果物・品質・引継ぎ、本人選択、評価の納得、所得・役割・学習機会、こぼれ仕事、本人・同僚・管理負担、不変・悪化・混合を別々に記録して仮説を見直す。",
      "possibilities": [
        {
          "hypothesisId": "M12-H1",
          "kind": "primary",
          "statementJa": "評価軸がフルタイムで接触できる時間・件数を暗黙の基準にし、短時間内に完了した成果物・品質・引継ぎを捉えていない。",
          "wouldReviseJa": "役割と成果物を勤務条件に合わせて明示しても、期待した品質又は安定性が確認できない。"
        },
        {
          "hypothesisId": "M12-H2",
          "kind": "alternative",
          "statementJa": "本人の担当範囲は明確でも、勤務時間外へこぼれた仕事と同僚負担が記録されず、本人評価とチーム資源の問題が混ざっている。",
          "wouldReviseJa": "こぼれ仕事と負担を調整しても、本人の役割・処遇・学習機会の不透明さが残る。"
        },
        {
          "hypothesisId": "M12-H3",
          "kind": "counter",
          "statementJa": "本人が現在の役割と時間を選び、成果・処遇・再選択条件も明確で、異なる仕事量は不利益ではなく合意された仕事設計である可能性がある。",
          "wouldReviseJa": "本人が異なる役割・評価機会を望む、又は時間外負担や不利益を選択できない。"
        }
      ],
      "branches": [
        {
          "branchId": "M12-B1",
          "conditionJa": "勤務時間又は対応件数だけが評価軸になっている。",
          "nextMoveJa": "対象期間を限定し、役割、完了成果物、品質、引継ぎを評価項目として明文化する。評価結果はまだ確定しない。",
          "guideUnitId": "GUIDE-03",
          "readinessSystemId": "WDG2-09",
          "guideSystemId": "WDG2-09",
          "guideTitleJa": "役割・評価・成長機会を公平にする"
        },
        {
          "branchId": "M12-B2",
          "conditionJa": "勤務時間外の仕事が同僚又は本人の無償負担としてこぼれている。",
          "nextMoveJa": "こぼれ仕事を記録し、廃止・移管・当番化・役割再配分を選ぶ。本人の評価とチーム資源の問題を分ける。",
          "guideUnitId": "GUIDE-02",
          "readinessSystemId": "WDG2-08",
          "guideSystemId": "WDG2-08",
          "guideTitleJa": "チームの負担と応援体制を整える"
        },
        {
          "branchId": "M12-B3",
          "conditionJa": "処遇・契約・キャリア上の不利益又は本人不在の変更が疑われる。",
          "nextMoveJa": "通常の評価改善を止め、決定者・基準・時点・代替案を保全し、本人が選ぶ人事・専門確認経路へ分ける。",
          "guideUnitId": "GUIDE-03",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "short-time-evaluation",
          "labelJa": "短時間勤務の評価が曖昧"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "ojt-as-teaching-work-system",
      "sourceBriefId": "CC2-MIG-13",
      "titleJa": "OJTを、本人の記憶力ではなく教える仕事システムとして設計する",
      "openingJa": "同じ説明を何度しても本番の例外処理で止まり、本人もOJT担当者も疲れています。",
      "readerJa": "直属上司・現場管理者",
      "phaseJa": "実習・配置・OJT",
      "doNotConcludeJa": "教える側の反復感と本人の停止は重要だが、能力・努力・職務適合を確定しない。仕事の粒度、定型と例外、練習機会、確認方法、評価時点、指導時間、支援移管、安全境界はまだ分からない。",
      "turningQuestionJa": "定型・例外・判断、練習・本番評価、OJT担当者の時間・確認範囲を分けると、どこで誰の仕事が止まっていますか。",
      "personControlJa": "本人は確認方法、練習速度、支援者の参加、仕事範囲、再練習・保留・選び直しを選べる。失敗を避けるための質問を不利益に扱わない。",
      "authorityBoundaryJa": "職場は業務分解・指導資源・安全・評価を、本人は参加方法と選択を、支援者は本人確認済みの学習条件への翻訳を担う。AI又はOJT担当者は能力・適性を最終決定しない。",
      "stopConditionsJa": "重大安全リスクを練習扱いする、訓練中の失敗を即時の能力・雇用判断にする、無制限の随時対応を担当者へ課す、本人の拒否後も支援・情報共有を続ける場合は通常OJTを止める。",
      "outcomeRevisionJa": "習得回数だけでなく、定型・例外・判断別の品質、質問・再開、本人参加、担当者・同僚負担、支援移管、不変・悪化・混合を分け、人間が教育仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "M13-H1",
          "kind": "primary",
          "statementJa": "業務が定型・例外・判断へ分解されず、一連の説明と本番経験だけで習得を求めている。",
          "wouldReviseJa": "仕事を分解し、例外練習と確認手順を置いても、同じ箇所で困難が残る。"
        },
        {
          "hypothesisId": "M13-H2",
          "kind": "alternative",
          "statementJa": "OJT担当者の指導時間・範囲・代替・評価役割が未設計で、随時対応の負担が本人への否定的評価へ変わっている。",
          "wouldReviseJa": "担当時間と役割を整えても、本人・担当者双方の負担と品質が変わらない。"
        },
        {
          "hypothesisId": "M13-H3",
          "kind": "counter",
          "statementJa": "教育システムは十分明確で、本人が別の確認方法、仕事範囲、支援又は配置の選び直しを望む可能性がある。",
          "wouldReviseJa": "本人が現在の仕事と方法を望み、未設計の教育条件が具体的に確認される。"
        }
      ],
      "branches": [
        {
          "branchId": "M13-B1",
          "conditionJa": "定型・例外・判断と、練習・本番評価が分かれていない。",
          "nextMoveJa": "一業務を三種類へ分け、例外一つを安全な練習場面で確認する。評価は練習期間と分ける。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-03",
          "guideSystemId": "WDG2-03",
          "guideTitleJa": "仕事の分け方・進め方"
        },
        {
          "branchId": "M13-B2",
          "conditionJa": "OJT担当者の随時対応と評価負担が固定化している。",
          "nextMoveJa": "指導時間、質問の置き場、代替担当、評価者を明示し、担当者の善意ではなく勤務内の資源として配分する。",
          "guideUnitId": "GUIDE-02",
          "readinessSystemId": "WDG2-08",
          "guideSystemId": "WDG2-08",
          "guideTitleJa": "チームの負担と応援体制を整える"
        },
        {
          "branchId": "M13-B3",
          "conditionJa": "教育条件を整えても困難が残り、本人が方法又は仕事範囲の見直しを望む。",
          "nextMoveJa": "能力を確定せず、本人が選ぶ確認方法、支援接続、仕事範囲、再練習又は保留を比較し、移管先と確認日を置く。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-06",
          "guideSystemId": "WDG2-06",
          "guideTitleJa": "採用・実習・復職・異動をつなぐ"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "ojt-overload",
          "labelJa": "OJTが噛み合わない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "manager-accommodation-operating-system",
      "sourceBriefId": "CC2-MIG-14",
      "titleJa": "上司の善意を、代替可能な配慮運用へ変える",
      "openingJa": "休憩、仕事配分、同僚への説明、支援者連絡を直属上司が全部抱え、繁忙期には本人もチームも待つようになります。",
      "readerJa": "直属上司・現場管理者",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "上司の負担感は重要だが、理解不足又は本人への配慮量だけを原因にしない。判断の種類、決裁権、代替者、記録、業務量、本人の情報境界、同僚へ移った仕事はまだ分からない。",
      "turningQuestionJa": "上司が毎回行う判断を一つ選ぶと、誰が代われて、そのために誰のどの仕事を減らす必要がありますか。",
      "personControlJa": "本人は共有範囲、確認方法、同席者、個別運用又は共通運用、保留・撤回を選べる。上司負担の解消を理由に本人情報を広げない。",
      "authorityBoundaryJa": "人事・部門責任者が役割と資源を、現場管理者が日常運用を、本人が情報と参加方法を決める。支援者は業務命令や人員決裁を代行しない。",
      "stopConditionsJa": "本人への不利益・報復、同僚又は上司の無償過重負担、目的外の健康情報共有、重大な安全判断の属人化があれば通常運用試行を止める。",
      "outcomeRevisionJa": "対応件数でなく、待ち時間、実装の一貫性、本人・上司・同僚・支援者の負担、品質、不利益、無変化・悪化を分けて人間が見直す。",
      "possibilities": [
        {
          "hypothesisId": "M14-H1",
          "kind": "primary",
          "statementJa": "配慮に伴う反復判断が正式業務にならず、直属上司一人の記憶・裁量・時間へ集中している。",
          "wouldReviseJa": "判断を標準化し代替者を置いても、本人・上司・同僚の待ち時間と負担が変わらない。"
        },
        {
          "hypothesisId": "M14-H2",
          "kind": "alternative",
          "statementJa": "役割表はあっても、調整業務に使う時間・要員が配分されず、通常業務との競合が放置されている。",
          "wouldReviseJa": "調整時間と減らす仕事を決裁しても、運用の属人性が残らない。"
        },
        {
          "hypothesisId": "M14-H3",
          "kind": "counter",
          "statementJa": "配慮固有の問題より、部署全体の優先順位・引継ぎ・管理幅の不備が中心で、一般の業務改善を先にすべきである。",
          "wouldReviseJa": "一般運用を整えても、本人が選ぶ情報・仕事条件の決定だけが止まる。"
        }
      ],
      "branches": [
        {
          "branchId": "M14-B1",
          "conditionJa": "反復判断が上司の頭の中にあり、代替者と記録がない。",
          "nextMoveJa": "本人が共有を選んだ仕事条件だけを、判断基準、主担当、代替者、記録場所、確認日に分ける。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        },
        {
          "branchId": "M14-B2",
          "conditionJa": "担当は決まっているが、調整時間と人員がない。",
          "nextMoveJa": "調整を勤務内の正式業務として計上し、同時に減らす仕事又は追加資源を決裁する。",
          "guideUnitId": "GUIDE-02",
          "readinessSystemId": "WDG2-08",
          "guideSystemId": "WDG2-08",
          "guideTitleJa": "チームの負担と応援体制を整える"
        },
        {
          "branchId": "M14-B3",
          "conditionJa": "部署全体の変更・引継ぎ不全が同様に起きている。",
          "nextMoveJa": "個人情報を広げず、部署共通の優先順位、変更通知、引継ぎを先に直し、残る個別条件だけを再確認する。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-03",
          "guideSystemId": "WDG2-03",
          "guideTitleJa": "仕事の分け方・進め方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "manager-overload",
          "labelJa": "配慮が上司任せになる"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "sensory-environment-work-contact",
      "sourceBriefId": "CC2-MIG-15",
      "titleJa": "環境刺激と仕事品質を、場所・時間・参加でほどく",
      "openingJa": "仕事は分かるのに、午後になると電話音、人の出入り、急な声かけが重なり、確認作業のミスと疲れが増えます。",
      "readerJa": "就労中の本人",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "本人の感覚経験は重要だが、診断名又は感覚過敏を確定しない。刺激の種類、作業との接触、時間、回復、情報欠落、品質・安全、場所変更による参加機会はまだ分からない。",
      "turningQuestionJa": "どの刺激が、どの作業・時間帯で品質又は回復を変え、環境を変えたとき何の参加機会が失われますか。",
      "personControlJa": "本人は使う環境、時間、作業、説明表現、利用しない選択、途中撤回を決められる。診断名の開示を設備利用の条件にしない。",
      "authorityBoundaryJa": "本人が参加と情報を、職場が設備・工程・品質・安全を決める。医療・支援側の見解は候補であり、職務適性又は配置を確定しない。",
      "stopConditionsJa": "利用が本人の特定・孤立・評価低下を生む、安全条件が不明、健康悪化、本人が望まない継続観察があれば試行を止める。",
      "outcomeRevisionJa": "利用有無でなく、品質、疲労、回復、情報到達、参加、本人・同僚負担、不利益、無変化・悪化・混合で仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "M15-H1",
          "kind": "primary",
          "statementJa": "特定の刺激と集中作業が重なることで、作業理解とは別に品質と回復が悪化している。",
          "wouldReviseJa": "刺激と作業の接触を変えても品質・疲労・翌日の回復が変わらない。"
        },
        {
          "hypothesisId": "M15-H2",
          "kind": "alternative",
          "statementJa": "環境刺激より、割込み後の再開地点、期限、完了条件が残らず手戻りを増やしている。",
          "wouldReviseJa": "再開手順と完了条件を明確にしても、特定環境でのみ困難が再現する。"
        },
        {
          "hypothesisId": "M15-H3",
          "kind": "counter",
          "statementJa": "静かな別室は仕事品質を守っても、連携・学習・所属を狭め、本人が望む参加を損なう可能性がある。",
          "wouldReviseJa": "本人が限定利用を望み、必要な連携と機会を保てる。"
        }
      ],
      "branches": [
        {
          "branchId": "M15-B1",
          "conditionJa": "刺激と特定作業の接触が再現する。",
          "nextMoveJa": "本人が選ぶ一作業・一時間帯だけ環境を変え、品質、疲労、参加、翌日への影響を確認する。",
          "guideUnitId": "GUIDE-02",
          "readinessSystemId": "WDG2-05",
          "guideSystemId": "WDG2-05",
          "guideTitleJa": "働く環境・情報・安全へのアクセス"
        },
        {
          "branchId": "M15-B2",
          "conditionJa": "割込み後の情報欠落と再開困難が中心である。",
          "nextMoveJa": "場所を固定する前に、保存点、再開手順、完了条件を共通工程として試す。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-03",
          "guideSystemId": "WDG2-03",
          "guideTitleJa": "仕事の分け方・進め方"
        },
        {
          "branchId": "M15-B3",
          "conditionJa": "環境変更が本人を隔離し、情報・評価・学習機会を減らす。",
          "nextMoveJa": "利用を止め、本人が必要な参加場面と共有範囲を選び直し、共通アクセス側を再設計する。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-02",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "sensory-office",
          "labelJa": "職場にいるだけで消耗する"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "trial-success-condition-transfer",
      "sourceBriefId": "CC2-MIG-16",
      "titleJa": "実習の成功条件を、採用後の仕事へ引き継ぐ",
      "openingJa": "実習中は安定していたのに、採用後は仕事量と指示方法が変わり、「前はできたのに」と言われています。",
      "readerJa": "求職者・実習者",
      "phaseJa": "実習・配置・OJT",
      "doNotConcludeJa": "実習と採用後の成績は部分観察であり、能力・適性を確定しない。作業構成、支援、評価責任、契約上の役割、本人の希望、成功条件の持続可能性はまだ分からない。",
      "turningQuestionJa": "実習から採用後へ変わった条件を一つずつ比べると、本人が引き継ぎたい成功条件と、職場が新たに求める役割は何ですか。",
      "personControlJa": "本人は引き継ぐ条件・情報・同席者、現在の役割を続けるか、別経路へ戻るかを選べる。実習成功を同意なき採用後義務にしない。",
      "authorityBoundaryJa": "採用・配置・品質は職場権限者、情報と選択は本人、支援者は条件翻訳と移管を担う。実習評価だけで適性又は雇用継続を確定しない。",
      "stopConditionsJa": "無償又は長期の選別、本人同意のない情報継承、訓練失敗の即時雇用判断、安全条件不明、戻る選択の剥奪では移行を止める。",
      "outcomeRevisionJa": "採用成立だけでなく、条件維持、仕事品質、健康・生活、再説明、本人・OJT・支援者負担、無変化・悪化・再選択を分けて見直す。",
      "possibilities": [
        {
          "hypothesisId": "M16-H1",
          "kind": "primary",
          "statementJa": "実習中の作業量・指示・確認先・支援頻度が成功条件として残らず、採用後に一括して失われた。",
          "wouldReviseJa": "条件を同程度に再現しても、仕事品質と参加が戻らない。"
        },
        {
          "hypothesisId": "M16-H2",
          "kind": "alternative",
          "statementJa": "採用後は役割・品質・判断範囲が実習と異なるのに、同じ仕事として評価されている。",
          "wouldReviseJa": "役割差と評価差を明示しても、つまずきの位置が変わらない。"
        },
        {
          "hypothesisId": "M16-H3",
          "kind": "counter",
          "statementJa": "実習条件の再現を本人は望まず、別の役割、支援、就労経路又は保留を選び直す方が妥当である。",
          "wouldReviseJa": "本人が採用後の仕事を望み、引き継ぎたい具体条件を選ぶ。"
        }
      ],
      "branches": [
        {
          "branchId": "M16-B1",
          "conditionJa": "成功条件が記録・継承されていない。",
          "nextMoveJa": "本人が選ぶ範囲で、作業量、指示、確認先、支援頻度、評価を条件引継ぎシートへ戻す。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-06",
          "guideSystemId": "WDG2-06",
          "guideTitleJa": "採用・実習・復職・異動をつなぐ"
        },
        {
          "branchId": "M16-B2",
          "conditionJa": "採用後の役割・判断・品質が実習と実質的に異なる。",
          "nextMoveJa": "新しい仕事を定型・例外・判断へ分け、練習と本番評価、OJT担当時間を再設計する。",
          "guideUnitId": "GUIDE-02",
          "readinessSystemId": "WDG2-03",
          "guideSystemId": "WDG2-03",
          "guideTitleJa": "仕事の分け方・進め方"
        },
        {
          "branchId": "M16-B3",
          "conditionJa": "本人が条件再現又は現在の経路を望まない。",
          "nextMoveJa": "採用維持を唯一の成功にせず、役割変更、別支援、保留、別経路を本人が比較できる状態へ戻す。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-09",
          "guideSystemId": "WDG2-09",
          "guideTitleJa": "役割・評価・成長機会を公平にする"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "trial-to-employment",
          "labelJa": "実習ではできたのに続かない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "person-workplace-authorized-options",
      "sourceBriefId": "CC2-MIG-17",
      "titleJa": "本人希望と職場制約を、権限のある選択肢へ分解する",
      "openingJa": "本人は在宅を望み、企業は教育と連携のため出社を求め、支援者だけが答えを決めるよう求められています。",
      "readerJa": "就労支援者",
      "phaseJa": "就業継続",
      "doNotConcludeJa": "本人希望と企業運用はどちらも部分視点であり、正当性又は妥協点を先に決めない。目的、必須業務、変更権限、契約、情報境界、報復懸念、代替案と負担はまだ分からない。",
      "turningQuestionJa": "本人と企業が守りたいものを、通勤・教育・連携・集中・評価へ分けると、誰の権限で何を小さく試せて、何は試行してはいけませんか。",
      "personControlJa": "本人は望む働き方、共有理由、試す条件、支援者の役割、保留・拒否・独立相談を選べる。支援利用を企業案への同意にしない。",
      "authorityBoundaryJa": "本人が目標と情報を、企業の権限者が契約・勤務・評価を、支援者が翻訳と選択肢形成を担う。支援者又はAIは紛争・法的結論を決めない。",
      "stopConditionsJa": "報復、差別、退職強要、同意なき情報共有、一方的契約変更、重大な健康・安全懸念、支援者への代理決定強要では通常試行を止める。",
      "outcomeRevisionJa": "合意成立だけでなく、本人の選択、実装・未実装、仕事・健康・参加、契約・評価、不利益、各者負担、撤回・再選択を分けて人間が見直す。",
      "possibilities": [
        {
          "hypothesisId": "M17-H1",
          "kind": "primary",
          "statementJa": "在宅と出社の主張の下にある通勤回復、教育、連携、集中作業が分解されず、二択になっている。",
          "wouldReviseJa": "目的と仕事を分けても、両立する権限内の組合せがない。"
        },
        {
          "hypothesisId": "M17-H2",
          "kind": "alternative",
          "statementJa": "選択肢はあるが、契約・評価・チーム運用を更新する決裁者が対話に参加せず、支援者へ責任が移っている。",
          "wouldReviseJa": "決裁者が参加し条件を更新しても、本人の目的と職場要件が接続しない。"
        },
        {
          "hypothesisId": "M17-H3",
          "kind": "counter",
          "statementJa": "報復、差別、契約上の高損失又は安全懸念があり、通常の共同試行より独立した専門判断経路を先にすべきである。",
          "wouldReviseJa": "高損失懸念がなく、本人が可逆的な仕事条件の比較を望む。"
        }
      ],
      "branches": [
        {
          "branchId": "M17-B1",
          "conditionJa": "目的別に仕事を分けると可逆的な組合せがある。",
          "nextMoveJa": "本人が望む範囲で、出社目的、在宅作業、通勤後の回復、確認日を限定した組合せを決裁者が承認する。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-06",
          "guideSystemId": "WDG2-06",
          "guideTitleJa": "採用・実習・復職・異動をつなぐ"
        },
        {
          "branchId": "M17-B2",
          "conditionJa": "決裁者不在又は支援者が業務・契約判断を背負っている。",
          "nextMoveJa": "支援者は結論を保留し、決定事項、決裁者、本人の選択、未解決、高損失経路を同じ表へ戻す。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        },
        {
          "branchId": "M17-B3",
          "conditionJa": "報復・差別・契約・安全上の高損失懸念がある。",
          "nextMoveJa": "通常の妥協試行を止め、本人が選ぶ独立相談へ限定してつなぎ、仕事改善と権利・安全判断を分ける。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "worker-employer-conflict",
          "labelJa": "本人希望と職場都合がぶつかる"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "policy-to-workplace-implementation",
      "sourceBriefId": "CC2-MIG-18",
      "titleJa": "制度の言葉を、現場の判断・実装・見直しへつなぐ",
      "openingJa": "施策資料と説明会は整っていますが、企業相談は手続きで止まり、現場管理者が何を変えるか残りません。",
      "readerJa": "行政・研修設計",
      "phaseJa": "研修・制度・地域",
      "doNotConcludeJa": "参加数や相談件数は利用の一部であり、理解・使用・実装・結果又は効果を確定しない。施策目的、対象判断、権限、資源、現場負担、制度外の障壁はまだ分からない。",
      "turningQuestionJa": "この施策は誰のどの判断を変え、その人が明日確認する仕事条件と、使えなかったとき制度側へ返す理由は何ですか。",
      "personControlJa": "本人又は現場は制度利用、非利用、匿名の意見、追跡拒否を選べる。個人情報提供を制度改善参加の条件にしない。",
      "authorityBoundaryJa": "行政が施策、組織権限者が資源、現場が実装、本人が参加と情報を決める。研修者・支援者・AIは制度解釈、効果又は個人適合を最終決定しない。",
      "stopConditionsJa": "現在法の断定、同意なき事例利用、利用件数からの効果主張、権限外実装、個人監視、報告負担増加では実装・追跡を止める。",
      "outcomeRevisionJa": "受講・理解・使用・未使用・実装を分け、仕事・本人・組織負担、不変・悪化・中断、制度側の変更を人間がレビューする。",
      "possibilities": [
        {
          "hypothesisId": "M18-H1",
          "kind": "primary",
          "statementJa": "施策目的が、現場で識別する相談場面と仕事条件へ翻訳されず、手続き知識で止まっている。",
          "wouldReviseJa": "判断課題と現場道具が明確でも、使用・実装が進まない。"
        },
        {
          "hypothesisId": "M18-H2",
          "kind": "alternative",
          "statementJa": "現場は理解しているが、時間、要員、決裁、相談先がなく、未使用が理解不足として誤読されている。",
          "wouldReviseJa": "資源と権限を置いても、現場が制度目的を仕事条件へ変換できない。"
        },
        {
          "hypothesisId": "M18-H3",
          "kind": "counter",
          "statementJa": "現場改善ではなく制度の対象・要件・申請負担自体が障壁で、教材改善では解けない。",
          "wouldReviseJa": "制度条件は利用可能で、現場の判断・実装連鎖だけが欠けている。"
        }
      ],
      "branches": [
        {
          "branchId": "M18-B1",
          "conditionJa": "施策目的と現場の判断課題が接続していない。",
          "nextMoveJa": "一つの人工相談で、制度目的、確認する仕事条件、渡す決裁者、実装期限を中間教材にする。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-07",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        },
        {
          "branchId": "M18-B2",
          "conditionJa": "理解はあるが権限・要員・時間がない。",
          "nextMoveJa": "追加説明を保留し、実装担当、減らす仕事、資源、未使用理由の返却先を制度・組織側で決める。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        },
        {
          "branchId": "M18-B3",
          "conditionJa": "制度要件又は利用負担自体が現場利用を阻む。",
          "nextMoveJa": "利用件数を個人努力へ帰属せず、未使用・中断理由と負担を制度改訂候補として人間のレビューへ戻す。",
          "guideUnitId": "GUIDE-03",
          "readinessSystemId": "WDG2-10",
          "guideSystemId": "WDG2-10",
          "guideTitleJa": "試した結果を振り返り改善する"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "policy-implementation-gap",
          "labelJa": "制度説明が現場に届かない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "person-governed-regional-support-path",
      "sourceBriefId": "CC2-MIG-19",
      "titleJa": "地域資源を、本人統制のある翻訳・実装経路へ変える",
      "openingJa": "本人は医療・生活側、企業は雇用側へ相談していますが、同じ仕事場面へ戻す責任者がおらず、説明だけが繰り返されます。",
      "readerJa": "行政・研修設計",
      "phaseJa": "研修・制度・地域",
      "doNotConcludeJa": "窓口数、会議数、紹介数は部分観察であり、連携の質又は本人利益を確定しない。本人の目的・同意、非連携選択、翻訳者、決裁者、危機、情報拡散、各機関負担はまだ分からない。",
      "turningQuestionJa": "本人が今進めたい一つの判断は何で、誰がどの限定情報を仕事条件へ翻訳し、誰が決め、何を本人へ返しますか。",
      "personControlJa": "本人は相談入口、目的、受領者、共有範囲、連携しない選択、訂正・撤回、会議不参加、返却方法を選べる。",
      "authorityBoundaryJa": "各機関は役割内の判断だけを担い、職場権限者が仕事実装、本人が情報と目標を決める。連携会議又はAIは診断・就業可否・雇用判断を統合決定しない。",
      "stopConditionsJa": "同意なき共有、目的外利用、重複聴取、危機の通常処理、支援利用を協力義務にする、責任者不在の会議継続、本人不在の雇用判断では停止する。",
      "outcomeRevisionJa": "紹介・会議数でなく、到達時間、実装・未実装、説明・情報負担、仕事・健康・生活、不利益、離脱、無変化・悪化で経路仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "M19-H1",
          "kind": "primary",
          "statementJa": "各機関は相談を受けているが、限定情報を具体的仕事条件へ翻訳し、職場決裁へ渡す所有者がいない。",
          "wouldReviseJa": "翻訳責任者と決裁経路を置いても、本人・企業の必要な判断が進まない。"
        },
        {
          "hypothesisId": "M19-H2",
          "kind": "alternative",
          "statementJa": "連携不足より、重複聴取・再共有・会議参加の負担が本人と支援者へ集中し、経路から離脱している。",
          "wouldReviseJa": "説明と会議を減らし本人統制を強めても、接続が進まない。"
        },
        {
          "hypothesisId": "M19-H3",
          "kind": "counter",
          "statementJa": "本人は機関連携を望まず、一般の職場改善又は各領域内の支援を別々に進める方が妥当である。",
          "wouldReviseJa": "本人が目的・受領者・範囲を限定した接続を望む。"
        }
      ],
      "branches": [
        {
          "branchId": "M19-B1",
          "conditionJa": "本人が限定連携を望み、翻訳・決裁・返却責任が空いている。",
          "nextMoveJa": "一つの仕事場面だけで、入口、翻訳者、決裁者、実装者、確認日、本人への返却を一本化する。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-07",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        },
        {
          "branchId": "M19-B2",
          "conditionJa": "重複説明・再共有・会議が本人又は支援者の負担になっている。",
          "nextMoveJa": "本人確認済みの最小共有を再利用し、参加者と会議を減らし、訂正・撤回・再共有拒否を経路に入れる。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-02",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        },
        {
          "branchId": "M19-B3",
          "conditionJa": "本人が連携を望まない、又は危機・報復・高損失懸念がある。",
          "nextMoveJa": "通常連携を止め、非連携の一般改善又は本人が選ぶ独立経路へ限定し、情報を広げない。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "resource-network",
          "labelJa": "地域資源がつながらない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "job-condition-placement-comparison",
      "sourceBriefId": "CC2-MIG-20",
      "titleJa": "職種適性を、具体的な仕事条件と変更可能性へ開く",
      "openingJa": "「事務が向く」と言われましたが、候補職場は電話と来客の割込みが多く、入力中心の仕事とは条件が違います。",
      "readerJa": "就労支援者",
      "phaseJa": "就職活動・採用",
      "doNotConcludeJa": "過去の得意不得意、診断、職種名、実習成績は部分観察であり、適性を確定しない。本人の目標、具体的職務、変更可能性、評価、契約、安全、別経路はまだ分からない。",
      "turningQuestionJa": "候補職場の一日をタスク・割込み・時間・判断・評価へ分けると、本人が望む条件と、職場が変更できる条件はどこで重なりますか。",
      "personControlJa": "本人は重視する条件、伝える情報、実習・応募・保留・拒否、支援者の関与、別候補への再選択を決められる。",
      "authorityBoundaryJa": "本人が目標と応募を、企業が職務・採用・配置を、支援者が条件比較を担う。支援者・診断・AIは適職又は採否を最終決定しない。",
      "stopConditionsJa": "診断別適職化、同意なき情報共有、無償の長期選別、安全条件不明、実習失敗の即時排除、本人が望まない応募継続では停止する。",
      "outcomeRevisionJa": "採用だけでなく、条件理解、選択、仕事品質、健康・生活、説明負担、職場変更、撤回・再選択、無変化・悪化を分けて仮説を更新する。",
      "possibilities": [
        {
          "hypothesisId": "M20-H1",
          "kind": "primary",
          "statementJa": "職種名が粗く、電話・割込み・締切・判断・環境・評価の比率が候補間で比較されていない。",
          "wouldReviseJa": "仕事条件を分解しても候補間の判断差が生まれない。"
        },
        {
          "hypothesisId": "M20-H2",
          "kind": "alternative",
          "statementJa": "現在の職務要求より、採用・配属後に変更できる条件と支援移管が示されず、過度に固定的な適合判断になっている。",
          "wouldReviseJa": "変更可能性と移管条件が明確でも、本人が望む選択肢が成立しない。"
        },
        {
          "hypothesisId": "M20-H3",
          "kind": "counter",
          "statementJa": "安全、契約又は不利益の境界が不明で、試行を適性検査として進めるべきでない。",
          "wouldReviseJa": "高損失境界が整理され、本人が限定した条件比較を望む。"
        }
      ],
      "branches": [
        {
          "branchId": "M20-B1",
          "conditionJa": "職種名しかなく具体的仕事条件が比較できない。",
          "nextMoveJa": "候補をタスク、割込み、時間、対人・感覚、判断、品質へ分け、本人が重要な三条件だけ比較する。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-03",
          "guideSystemId": "WDG2-03",
          "guideTitleJa": "仕事の分け方・進め方"
        },
        {
          "branchId": "M20-B2",
          "conditionJa": "条件仮説を可逆的に確かめる機会と引継ぎが必要である。",
          "nextMoveJa": "本人同意の人工説明又は限定実習で一条件だけ確かめ、成功・不成功を能力でなく条件として次局面へ戻す。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-06",
          "guideSystemId": "WDG2-06",
          "guideTitleJa": "採用・実習・復職・異動をつなぐ"
        },
        {
          "branchId": "M20-B3",
          "conditionJa": "本人が現在候補を望まない、又は高損失境界が未整理である。",
          "nextMoveJa": "適合判定を保留し、別候補、情報追加、独立相談、応募しない選択を本人へ戻す。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-09",
          "guideSystemId": "WDG2-09",
          "guideTitleJa": "役割・評価・成長機会を公平にする"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "placement-fit",
          "labelJa": "配置先が合わない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "small-workplace-support-entry",
      "sourceBriefId": "CC2-MIG-21",
      "titleJa": "小規模職場の実行余力から、支援の入口を設計する",
      "openingJa": "制度資料は届いていますが、管理職が面談時間を取れず、支援を使う前の「最初の15分」で止まっています。",
      "readerJa": "行政・研修設計",
      "phaseJa": "研修・制度・地域",
      "doNotConcludeJa": "企業規模、制度利用、担当者の多忙は部分観察であり、支援能力を確定しない。緊急性、権限、要員、申請負担、外部資源、本人の希望、減らせる仕事はまだ分からない。",
      "turningQuestionJa": "今週15分で確認できる一つの仕事条件は何で、その次の判断を誰が持ち、足りない時間・人員をどこから補いますか。",
      "personControlJa": "本人は相談、共有範囲、外部支援の参加、保留・拒否を選べる。企業の余力不足を理由に本人へ説明・調整責任を移さない。",
      "authorityBoundaryJa": "企業権限者が仕事変更、支援側が入口と専門機能、行政が制度・資源、本人が参加と情報を決める。資料又はAIは最終判断をしない。",
      "stopConditionsJa": "高損失懸念の簡易処理、本人への事務負担転嫁、無償の管理職・同僚負担、現在制度の断定、同意なき外部接続では停止する。",
      "outcomeRevisionJa": "資料配布数でなく、到達時間、実装・未実装、仕事・本人・管理者負担、外部資源、無変化・悪化・中断を分けて入口仮説を見直す。",
      "possibilities": [
        {
          "hypothesisId": "M21-H1",
          "kind": "primary",
          "statementJa": "支援の入口が資料探索、複数窓口、長い面談を前提にし、現場の最初の行動へ翻訳されていない。",
          "wouldReviseJa": "単一入口と短い確認を用意しても利用・実装が進まない。"
        },
        {
          "hypothesisId": "M21-H2",
          "kind": "alternative",
          "statementJa": "入口は分かるが、代替要員・調整時間・専門機能がなく、支援利用自体が新たな過重負担になる。",
          "wouldReviseJa": "共有資源と業務削減を置いても、必要な判断が進まない。"
        },
        {
          "hypothesisId": "M21-H3",
          "kind": "counter",
          "statementJa": "簡易化してよい問題ではなく、安全・報復・雇用又は専門判断の高損失経路を先に要する。",
          "wouldReviseJa": "高損失懸念がなく、組織内の小さな確認から始められる。"
        }
      ],
      "branches": [
        {
          "branchId": "M21-B1",
          "conditionJa": "制度情報はあるが、最初の確認と相談先が多すぎる。",
          "nextMoveJa": "単一入口と一つの仕事条件チェックだけを渡し、次に必要な決裁へ支援側が案内する。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        },
        {
          "branchId": "M21-B2",
          "conditionJa": "実装時間・代替要員・専門機能がない。",
          "nextMoveJa": "共有できる外部機能、正式な調整時間、減らす仕事を決め、制度利用の事務負担も資源として計上する。",
          "guideUnitId": "GUIDE-02",
          "readinessSystemId": "WDG2-08",
          "guideSystemId": "WDG2-08",
          "guideTitleJa": "チームの負担と応援体制を整える"
        },
        {
          "branchId": "M21-B3",
          "conditionJa": "高損失境界又は専門判断が必要である。",
          "nextMoveJa": "簡易チェックを止め、本人が選ぶ独立経路へつなぎ、現場に最終判断を背負わせない。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-07",
          "guideSystemId": "WDG2-07",
          "guideTitleJa": "専門支援と、仕事の改善を進める"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "small-company-support",
          "labelJa": "中小企業が支援を使えない"
        }
      ],
      "aliasResolutions": []
    },
    {
      "caseId": "shared-work-system-distinct-specialist-paths",
      "sourceBriefId": "CC2-MIG-22",
      "titleJa": "テーマ別研修を、共通仕事システムと異なる専門経路へ組み直す",
      "openingJa": "同じ管理職が仕事量、相談、開示、評価を調整していますが、研修はテーマ別で、共通運用と異なる境界が見えません。",
      "readerJa": "行政・研修設計",
      "phaseJa": "研修・制度・地域",
      "doNotConcludeJa": "研修テーマと相談カテゴリーは部分的な分類であり、人又は対応を同質化しない。共通する仕事条件、異なる同意・制度・危機・専門経路、受講者の権限と実装余力はまだ分からない。",
      "turningQuestionJa": "一つの職場場面で共通に確認する仕事条件と、本人同意・制度・危機・専門支援として分けて渡す判断は何ですか。",
      "personControlJa": "本人はテーマ分類に回収されず、情報、相談経路、参加、保留・拒否を選べる。実ケースを研修に使う場合は目的・匿名化・撤回を本人が決める。",
      "authorityBoundaryJa": "主催者が研修、組織権限者が仕事基盤、専門職が役割内判断、本人が情報と選択を担う。研修・AIは診断、危機、個人適合、効果を確定しない。",
      "stopConditionsJa": "対象者の同質化、診断別固定対応、同意なき実ケース利用、危機の一般研修処理、現在法又は効果の断定、権限外実装では停止する。",
      "outcomeRevisionJa": "満足度でなく、共通問いの使用・未使用、専門経路への適切な切分け、仕事実装、本人・管理者負担、不変・悪化・中断を分けて見直す。",
      "possibilities": [
        {
          "hypothesisId": "M22-H1",
          "kind": "primary",
          "statementJa": "テーマ別研修が、同じ管理職が扱う仕事量・相談・情報・評価を別運用にし、現場の判断負担を増やしている。",
          "wouldReviseJa": "共通仕事システムを置いても、現場判断と負担が変わらない。"
        },
        {
          "hypothesisId": "M22-H2",
          "kind": "alternative",
          "statementJa": "共通化が進みすぎ、本人同意、制度、危機、専門支援の違いが一般的な職場改善へ吸収されている。",
          "wouldReviseJa": "異なる境界と経路を明示しても、必要な専門判断が失われる。"
        },
        {
          "hypothesisId": "M22-H3",
          "kind": "counter",
          "statementJa": "研修再編より、権限・人員・相談経路の欠如が中心で、組織基盤の決裁を先にすべきである。",
          "wouldReviseJa": "基盤はあるが、受講者が共通場面と異なる境界を識別できない。"
        }
      ],
      "branches": [
        {
          "branchId": "M22-B1",
          "conditionJa": "同じ現場判断がテーマ別に分断されている。",
          "nextMoveJa": "人工事例一つで仕事量、時間、情報、相談、評価、役割を共通軸にし、明日使う一問を作る。",
          "guideUnitId": "GUIDE-05",
          "readinessSystemId": "WDG2-03",
          "guideSystemId": "WDG2-03",
          "guideTitleJa": "仕事の分け方・進め方"
        },
        {
          "branchId": "M22-B2",
          "conditionJa": "共通化が本人同意・制度・危機・専門経路の違いを消す。",
          "nextMoveJa": "共通仕事システムから情報統制と高損失経路を分け、受講者の権限外判断を明示する。",
          "guideUnitId": "GUIDE-01",
          "readinessSystemId": "WDG2-02",
          "guideSystemId": "WDG2-02",
          "guideTitleJa": "情報の伝え方・守り方"
        },
        {
          "branchId": "M22-B3",
          "conditionJa": "知識より権限・要員・相談経路がない。",
          "nextMoveJa": "研修追加を保留し、決裁者、相談入口、実装時間、専門経路を組織準備性として先に整える。",
          "guideUnitId": "GUIDE-04",
          "readinessSystemId": "WDG2-01",
          "guideSystemId": "WDG2-01",
          "guideTitleJa": "相談の入口と決め方"
        }
      ],
      "legacyEntries": [
        {
          "caseId": "mental-health-diversity-gap",
          "labelJa": "メンタルヘルス研修と分断する"
        }
      ],
      "aliasResolutions": []
    }
  ],
  "guides": [
    {
      "systemId": "WDG2-01",
      "purposeJa": "相談の有無を本人の準備性の指標にせず、誰が受け、誰が決め、行き詰まったときにどこへ戻すかを平時から明確にする。",
      "readinessQuestionJa": "相談者が自分で正しい担当者を探し回らなくても、問題が決定者まで届くか。",
      "installBeforeCaseJa": [
        "上司、人事、産業保健、外部支援など複数の入口を、利用条件と守秘範囲付きで公開する。",
        "相談受付、事実確認、決裁、実装、経過確認の担当を役割表にする。",
        "通常相談、緊急安全、報復・不利益懸念を別の経路へ分ける。",
        "健康・生活上の危機では、仕事改善より先に利用する緊急接続先を確認しておく。",
        "相談しないこと、保留すること、別経路へ移ることを不利益にしない規則を置く。"
      ],
      "ownersJa": [
        "人事・労務責任者",
        "現場管理者",
        "相談窓口責任者"
      ],
      "operatingCadenceJa": "半期ごとの経路点検と、担当・組織変更時の即時更新。",
      "artifactsJa": [
        "意思決定RACI",
        "相談経路図",
        "緊急・報復懸念のエスカレーション基準"
      ],
      "readinessLevelsJa": {
        "absent": "入口が上司一人に依存し、決裁者と実装者が分からない。",
        "fragile": "経路はあるが、担当者の善意や個人的ネットワークでしか動かない。",
        "operating": "複数入口、期限、所有者、代替経路、記録と見直しが通常業務として動く。"
      },
      "caseActivationJa": [
        "相談者が選ぶ入口と、相談しない選択を確認する。",
        "次に必要な判断だけを特定し、その決定権を持つ人へつなぐ。",
        "報復・安全・雇用上の高損失懸念があれば通常の小試行から分ける。"
      ],
      "individualizationQuestionsJa": [
        "今ほしいのは情報、相談、決定、実装、緊急保護のどれか。",
        "誰を経路に入れたくないか、誰なら話せるか。",
        "回答が遅れたとき、どの損失が先に起きるか。"
      ],
      "burdenAndEquityChecksJa": [
        "相談者が毎回経緯を説明し直す負担を増やしていないか。",
        "非相談者や非開示者を、協力不足として扱っていないか。"
      ],
      "stopAndEscalationJa": "報復、差別、安全、解雇・退職強要の懸念がある場合は、通常改善を止め、独立した判断経路へ移す。",
      "outcomeReviewJa": "相談件数ではなく、到達時間、未回答、経路離脱、不利益、実装責任の所在を確認する。",
      "currentGuideFrameIds": [
        "III-09"
      ],
      "currentGuideDeltaJa": "現行の職場内相談ルートを保持しつつ、受付だけで終わらない決裁・実装RACI、代替経路、高損失時の独立エスカレーションまで拡張する。",
      "linkedCaseBriefIds": [
        "CC2-PROD-04",
        "CC2-PROD-06",
        "CC2-PROD-07",
        "CC2-PROD-08",
        "CC2-MIG-03",
        "CC2-MIG-05",
        "CC2-MIG-06",
        "CC2-MIG-08",
        "CC2-MIG-09",
        "CC2-MIG-10",
        "CC2-MIG-11",
        "CC2-MIG-12",
        "CC2-MIG-13",
        "CC2-MIG-14",
        "CC2-MIG-17",
        "CC2-MIG-18",
        "CC2-MIG-19",
        "CC2-MIG-21",
        "CC2-MIG-22"
      ],
      "readerTitleJa": "相談の入口と決め方"
    },
    {
      "systemId": "WDG2-02",
      "purposeJa": "診断名の全面開示を入口にせず、目的、受領者、範囲、期限、訂正・撤回を本人が選べる情報運用を用意する。",
      "readinessQuestionJa": "本人が「全部話す／何も話さない」以外の共有方法を実際に選べるか。",
      "installBeforeCaseJa": [
        "健康情報と、仕事を調整するための条件情報を分けて扱う様式を用意する。",
        "利用目的、受領者、保存期間、再共有の可否を記録する。",
        "本人の訂正、保留、撤回、代理参加の方法を明文化する。",
        "個人情報を使わずに仕事条件を質問・改善できる匿名経路を置く。"
      ],
      "ownersJa": [
        "情報管理責任者",
        "人事・相談窓口",
        "本人が選ぶ同席者"
      ],
      "operatingCadenceJa": "共有の都度確認し、目的変更・異動・支援者変更時に再同意する。",
      "artifactsJa": [
        "最小共有シート",
        "受領者・目的ログ",
        "訂正・撤回手順"
      ],
      "readinessLevelsJa": {
        "absent": "診断名の全面開示か非開示しか選べず、情報の行き先が見えない。",
        "fragile": "同意書はあるが、共有後の訂正・撤回・再共有制御ができない。",
        "operating": "目的別の最小共有、本人確認、期限、訂正、撤回が一連の運用になっている。"
      },
      "caseActivationJa": [
        "次の判断に必要な情報と、単に知りたい情報を分ける。",
        "本人が共有したい仕事条件の表現を一緒に選ぶ。",
        "共有後に誰が何をしたかを本人へ戻す。"
      ],
      "individualizationQuestionsJa": [
        "何を実現するための共有か。",
        "誰に、どの範囲まで、いつまで伝えてよいか。",
        "伝えない場合に使える別の仕事設計はあるか。"
      ],
      "burdenAndEquityChecksJa": [
        "説明能力や医療文書の入手可能性で利用格差を作っていないか。",
        "家族や支援者の情報が本人の能力評価へ転用されていないか。"
      ],
      "stopAndEscalationJa": "目的外利用、本人不在の代理決定、撤回不能、診断名から適性を推定する運用では停止する。",
      "outcomeReviewJa": "安心感だけでなく、二次利用、不利益、説明負担、未解決、共有を狭めた選択を別々に確認する。",
      "currentGuideFrameIds": [
        "II-10",
        "III-03",
        "III-04"
      ],
      "currentGuideDeltaJa": "現行の開示・伝え方・相談ルートを統合し、本人側の伝達技能から組織側の最小共有・訂正・撤回運用へ重心を移す。",
      "linkedCaseBriefIds": [
        "CC2-PROD-01",
        "CC2-PROD-06",
        "CC2-PROD-08",
        "CC2-MIG-04",
        "CC2-MIG-06",
        "CC2-MIG-08",
        "CC2-MIG-09",
        "CC2-MIG-10",
        "CC2-MIG-14",
        "CC2-MIG-15",
        "CC2-MIG-17",
        "CC2-MIG-19",
        "CC2-MIG-20",
        "CC2-MIG-22"
      ],
      "readerTitleJa": "情報の伝え方・守り方"
    },
    {
      "systemId": "WDG2-03",
      "purposeJa": "能力を抽象評価する前に、具体的な仕事、順序、切替、品質、期限、裁量、支援可能点を調整可能な単位にする。",
      "readinessQuestionJa": "本人の特性を説明しなくても、仕事のどこを変えられるか話せるか。",
      "installBeforeCaseJa": [
        "主要職務をタスク、頻度、時間帯、品質、安全、対人・認知負荷に分ける。",
        "必須条件と、慣行にすぎない条件を区別する。",
        "指示、優先順位、完了条件、変更時の通知方法を標準化する。",
        "記憶や段取りを個人の努力だけに置かない共通ツールを用意する。"
      ],
      "ownersJa": [
        "現場管理者",
        "業務設計担当",
        "品質・安全担当"
      ],
      "operatingCadenceJa": "職務変更時と四半期ごとの業務棚卸し。",
      "artifactsJa": [
        "職務要求カード",
        "優先順位・完了条件表",
        "変更通知テンプレート"
      ],
      "readinessLevelsJa": {
        "absent": "役割が「臨機応変」「普通にできること」でしか説明されない。",
        "fragile": "職務記述はあるが、実際の切替・例外・品質基準が担当者の頭の中にある。",
        "operating": "仕事要求、裁量、変更可能点、品質・安全条件を現場で共同確認できる。"
      },
      "caseActivationJa": [
        "困難が生じる一つの具体的工程を選ぶ。",
        "本人、同僚、管理者の異なる観察を混ぜずに並べる。",
        "仕事量を詰め込まず、必要な指示・手順・分担の変更を組み合わせ、何を変えたかを残す。"
      ],
      "individualizationQuestionsJa": [
        "どの作業、時点、頻度、環境で変化するか。",
        "品質・速度・安全のどれが本当に必須か。",
        "指示や切替を変えると、別の負担は誰へ移るか。"
      ],
      "burdenAndEquityChecksJa": [
        "非公式の穴埋めを同僚の善意へ固定していないか。",
        "見える生産量だけで、段取り・支援・回復の負担を消していないか。"
      ],
      "stopAndEscalationJa": "安全基準が不明、隠れた追加業務が生じる、役割縮小が評価・雇用判断へ直結する場合は通常試行を止める。",
      "outcomeReviewJa": "作業達成、品質、安全、本人負担、同僚負担、管理負担を別々に確認し、職務設計を更新する。",
      "currentGuideFrameIds": [
        "II-07",
        "II-08",
        "II-09"
      ],
      "currentGuideDeltaJa": "現行の指示・切替・記憶支援を保持しつつ、個人の対処法集から、職務要求と変更権限を管理する共通業務基盤へ組み替える。",
      "linkedCaseBriefIds": [
        "CC2-PROD-03",
        "CC2-PROD-04",
        "CC2-PROD-05",
        "CC2-PROD-07",
        "CC2-MIG-01",
        "CC2-MIG-02",
        "CC2-MIG-03",
        "CC2-MIG-04",
        "CC2-MIG-10",
        "CC2-MIG-11",
        "CC2-MIG-12",
        "CC2-MIG-13",
        "CC2-MIG-14",
        "CC2-MIG-15",
        "CC2-MIG-16",
        "CC2-MIG-18",
        "CC2-MIG-20",
        "CC2-MIG-22"
      ],
      "readerTitleJa": "仕事の分け方・進め方"
    },
    {
      "systemId": "WDG2-04",
      "purposeJa": "体調の自己管理を本人だけに求めず、勤務量、時間帯、休憩、通院、欠勤、変動時の戻り方を業務運用として設計する。",
      "readinessQuestionJa": "体調が変わった日でも、本人が毎回特別交渉をせず仕事を調整できるか。",
      "installBeforeCaseJa": [
        "勤務量、開始終了、休憩、在宅・出社、通院、服薬・食事・休養の選択肢と決裁者を決める。",
        "繁忙、締切、季節、治療周期による負荷変動を業務計画に入れる。",
        "当日変更、欠勤、復帰、段階的増減の手順を全員に使える形で用意する。",
        "休むことを例外扱いせず、代替・引継ぎ・期限再設定を業務側で準備する。"
      ],
      "ownersJa": [
        "現場管理者",
        "勤怠・人事担当",
        "業務継続責任者"
      ],
      "operatingCadenceJa": "月次の負荷点検、繁忙期前、勤務・治療条件変更時。",
      "artifactsJa": [
        "勤務選択肢表",
        "変動時プレイブック",
        "欠勤・復帰・引継ぎ手順"
      ],
      "readinessLevelsJa": {
        "absent": "体調変動は本人の自己管理不足として扱われる。",
        "fragile": "個別の好意で調整できるが、上司や部署が変わると失われる。",
        "operating": "変更条件、決裁、代替業務、戻し方が通常の勤務運用になっている。"
      },
      "caseActivationJa": [
        "症状名ではなく、時間・作業・回復の具体的な変動を確認する。",
        "本人が選ぶ最小の勤務条件変更を期限付きで設定する。",
        "仕事量と家庭・通勤・治療側の負担を同時に増やしていないか確かめる。"
      ],
      "individualizationQuestionsJa": [
        "いつ、どの仕事の前後で負担が変わるか。",
        "休憩、時間帯、量、場所、順序のどれを変えると判断が分かれるか。",
        "改善、無変化、悪化、別領域への負担移転をどう観察するか。"
      ],
      "burdenAndEquityChecksJa": [
        "家族の送迎・回復支援を就労成立の前提にしていないか。",
        "短時間化が、仕事密度や評価不利益を高めていないか。"
      ],
      "stopAndEscalationJa": "健康・安全悪化、回復不能、無償の家庭負担、業務密度増大が見られたら試行を止め、条件または目標を戻す。",
      "outcomeReviewJa": "勤務継続だけでなく、健康、回復、生活、作業、収入、周囲負担を分けて見直す。",
      "currentGuideFrameIds": [
        "I-01",
        "I-02",
        "I-03",
        "I-04",
        "I-05",
        "I-07"
      ],
      "currentGuideDeltaJa": "現行の体調・通院・回復・リズム・備えを統合し、本人の管理行動中心から、変動を前提にした勤務・業務継続システムへ転換する。",
      "linkedCaseBriefIds": [
        "CC2-PROD-02",
        "CC2-PROD-03",
        "CC2-PROD-04",
        "CC2-PROD-07",
        "CC2-MIG-01",
        "CC2-MIG-07",
        "CC2-MIG-09",
        "CC2-MIG-15",
        "CC2-MIG-17"
      ],
      "readerTitleJa": "時間・仕事量・体調変動への備え"
    },
    {
      "systemId": "WDG2-05",
      "purposeJa": "個別申告を待たず、物理、感覚、情報、会議、対人応答、安全の障壁を日常の仕事環境から減らす。",
      "readinessQuestionJa": "診断名を知らなくても、複数の受け取り方・伝え方・作業環境を選べるか。",
      "installBeforeCaseJa": [
        "静かな場所、照明、温度、座席、機器、遠隔参加などの選択肢を通常設備にする。",
        "口頭、文書、図、字幕、記録、後回答を組み合わせられる会議標準を作る。",
        "即時応答が必要な場面と、考える時間を確保できる場面を分ける。",
        "安全重視業務では、個人申告だけに頼らない工程・設備・相互確認を設ける。"
      ],
      "ownersJa": [
        "施設・IT担当",
        "会議・業務責任者",
        "安全衛生責任者"
      ],
      "operatingCadenceJa": "設備・システム更新時、年次安全点検、会議運用の四半期レビュー。",
      "artifactsJa": [
        "アクセス選択肢一覧",
        "会議・指示標準",
        "安全工程チェック"
      ],
      "readinessLevelsJa": {
        "absent": "標準環境に合わない人が個別に我慢または申告するしかない。",
        "fragile": "機器や方法はあるが、利用には特別許可や診断説明が必要。",
        "operating": "複数の環境・伝達・確認方法を通常選択でき、安全条件も工程で担保する。"
      },
      "caseActivationJa": [
        "障壁が起きる環境、情報形式、対話、工程を特定する。",
        "既存の共通選択肢から本人が試すものを選ぶ。",
        "必要な環境・情報手段は組み合わせ、別の人への負担と安全条件も分けて確認する。"
      ],
      "individualizationQuestionsJa": [
        "どの刺激、情報形式、速度、対人条件で変わるか。",
        "本人が使いやすい代替手段は何か。",
        "安全上、推測ではなく確認すべき具体条件は何か。"
      ],
      "burdenAndEquityChecksJa": [
        "利用を目立たせたり、特別扱いの説明負担を生んでいないか。",
        "安全を理由に、具体的工程を見ず職務全体から排除していないか。"
      ],
      "stopAndEscalationJa": "安全条件が確かめられない、利用が本人を特定・孤立させる、別の障壁を増やす場合は導入を止め再設計する。",
      "outcomeReviewJa": "利用有無ではなく、情報到達、作業、安全、疲労、参加、不利益を別々に確認する。",
      "currentGuideFrameIds": [
        "II-01",
        "II-03",
        "II-04",
        "II-05",
        "II-06",
        "II-11"
      ],
      "currentGuideDeltaJa": "現行の環境・情報・コミュニケーション・安全フレームを、個別配慮メニューから全員が選べる共通仕事環境へ再配置する。",
      "linkedCaseBriefIds": [
        "CC2-PROD-03",
        "CC2-PROD-04",
        "CC2-PROD-06",
        "CC2-MIG-03",
        "CC2-MIG-06",
        "CC2-MIG-10",
        "CC2-MIG-11",
        "CC2-MIG-15",
        "CC2-MIG-20",
        "CC2-MIG-22"
      ],
      "readerTitleJa": "働く環境・情報・安全へのアクセス"
    },
    {
      "systemId": "WDG2-06",
      "purposeJa": "応募、通勤、実習、採用、配属、休職、復帰を別々のイベントにせず、条件と決定を次の局面へ引き継ぐ。",
      "readinessQuestionJa": "局面が変わっても、本人がゼロから説明・交渉し直さずに済むか。",
      "installBeforeCaseJa": [
        "募集時点で勤務、通勤、主要職務、環境、選考工程の実条件を示す。",
        "一般・専門援助、実習、訓練、直接応募など複数の求職・移行経路を、本人が比較できる形にする。",
        "実習・採用・配属・復帰で引き継ぐ条件と、引き継がない個人情報を分ける。",
        "段階的な職務・時間の増減と、戻す基準を用意する。",
        "通勤・移動が難しいときの場所、時間、方法の代替を平時から決める。"
      ],
      "ownersJa": [
        "採用担当",
        "配属先管理者",
        "復職・移行調整者"
      ],
      "operatingCadenceJa": "募集・配置・休復職の各節目と、移行後30日・90日の確認。",
      "artifactsJa": [
        "局面移行チェックリスト",
        "条件引継ぎシート",
        "段階移行・戻し基準"
      ],
      "readinessLevelsJa": {
        "absent": "局面ごとに別担当となり、条件と経緯が失われる。",
        "fragile": "担当者間で口頭引継ぎはあるが、本人の選択と戻し基準がない。",
        "operating": "必要条件、情報統制、責任者、確認日、再選択が局面を越えて維持される。"
      },
      "caseActivationJa": [
        "次の局面で変わる仕事条件と権限を確認する。",
        "本人が引き継ぐ情報・条件・同席者を選ぶ。",
        "一方向の復帰・就職だけでなく、保留・戻す・別経路を残す。"
      ],
      "individualizationQuestionsJa": [
        "次の局面で失われる支援・裁量・関係は何か。",
        "通勤、時間、仕事、情報のどれが移行を左右するか。",
        "成功・中止・再選択を誰がいつ確認するか。"
      ],
      "burdenAndEquityChecksJa": [
        "実習や段階移行を無償の長期選別にしていないか。",
        "移動困難を本人の就労意欲の問題へ置き換えていないか。"
      ],
      "stopAndEscalationJa": "条件不明のまま移行を急ぐ、本人同意なく情報を引き継ぐ、戻る選択を失わせる場合は停止する。",
      "outcomeReviewJa": "就職・復帰の成立だけでなく、条件の維持、再説明負担、健康、仕事、生活、再選択を確認する。",
      "currentGuideFrameIds": [
        "I-06",
        "II-02",
        "III-05",
        "III-06"
      ],
      "currentGuideDeltaJa": "現行の段階的職務、通勤、求職、実習を一つの連続設計へ結び、個人の準備段階ではなく組織間の条件継承を中心にする。",
      "linkedCaseBriefIds": [
        "CC2-PROD-01",
        "CC2-PROD-04",
        "CC2-PROD-07",
        "CC2-MIG-01",
        "CC2-MIG-07",
        "CC2-MIG-09",
        "CC2-MIG-13",
        "CC2-MIG-16",
        "CC2-MIG-17",
        "CC2-MIG-20"
      ],
      "readerTitleJa": "採用・実習・復職・異動をつなぐ"
    },
    {
      "systemId": "WDG2-07",
      "purposeJa": "医療・産業保健・支援の助言を命令や診断代理にせず、本人が選ぶ具体的な仕事条件、担当、期限、確認へ翻訳する。",
      "readinessQuestionJa": "助言を受け取った後、職場で誰が何を変え、結果を誰へ返すか決まっているか。",
      "installBeforeCaseJa": [
        "助言の依頼目的、本人同意、必要最小情報、受領者を定型化する。",
        "健康・機能上の見解と、職場の業務・人員・安全判断を分ける。",
        "受領、翻訳、決裁、実装、確認の所有者と期限を置く。",
        "連携を望まない場合の組織内代替経路を用意する。"
      ],
      "ownersJa": [
        "本人が選ぶ連携責任者",
        "職場決裁者",
        "専門職・支援者"
      ],
      "operatingCadenceJa": "助言受領時、実装予定日、確認日、条件変更時。",
      "artifactsJa": [
        "助言―仕事条件変換表",
        "連携責任・期限表",
        "実装結果返却票"
      ],
      "readinessLevelsJa": {
        "absent": "助言書を受け取るだけで、実装責任者と仕事条件が決まらない。",
        "fragile": "担当者が個別に翻訳するが、本人選択と結果返却がない。",
        "operating": "助言、選択、決裁、実装、観察、修正が別状態として往復する。"
      },
      "caseActivationJa": [
        "助言が変えようとする一つの仕事条件を特定する。",
        "本人が共有・実施・保留する範囲を選ぶ。",
        "実装できない場合は理由と代替案を本人へ戻す。"
      ],
      "individualizationQuestionsJa": [
        "助言は何を観察し、何を推測しているか。",
        "誰に実装権限と資源があるか。",
        "どの結果が助言、仕事設計、本人選択の見直しを分けるか。"
      ],
      "burdenAndEquityChecksJa": [
        "文書取得や専門職アクセスの差を本人責任にしていないか。",
        "連携の事務負担を本人・家族へ集中させていないか。"
      ],
      "stopAndEscalationJa": "本人同意がない、助言を職務排除の根拠へ直結する、実装責任者がいない場合は連携を進めない。",
      "outcomeReviewJa": "会議や文書作成を成果にせず、実装有無、仕事、健康、生活、負担、不利益、本人の再選択を返す。",
      "currentGuideFrameIds": [
        "III-08"
      ],
      "currentGuideDeltaJa": "現行の支援ネットワーク接続を、紹介先の列挙から、本人統制のある助言―実装―結果返却の責任連鎖へ改訂する。",
      "linkedCaseBriefIds": [
        "CC2-PROD-02",
        "CC2-PROD-04",
        "CC2-PROD-08",
        "CC2-MIG-04",
        "CC2-MIG-05",
        "CC2-MIG-07",
        "CC2-MIG-08",
        "CC2-MIG-09",
        "CC2-MIG-10",
        "CC2-MIG-17",
        "CC2-MIG-18",
        "CC2-MIG-19",
        "CC2-MIG-21",
        "CC2-MIG-22"
      ],
      "readerTitleJa": "専門支援と、仕事の改善を進める"
    },
    {
      "systemId": "WDG2-08",
      "purposeJa": "配慮や支援を本人、家族、同僚、担当支援者の無償の穴埋めで成立させず、仕事量、代替要員、時間、費用を正式に配分する。",
      "readinessQuestionJa": "一人を支える変更が、別の人の見えない過重負担で維持されていないか。",
      "installBeforeCaseJa": [
        "欠勤・繁忙・タスク再配分時の代替要員と優先順位を決める。",
        "支援・調整に必要な時間と担当を正式業務として計上する。",
        "本人、同僚、家族、管理者、支援者の負担を別々に確認する様式を作る。",
        "追加資源がない場合は、減らせる仕事・動かせる期限と、それを決める権限を確認する。"
      ],
      "ownersJa": [
        "部門責任者",
        "人員・予算決裁者",
        "業務配分担当"
      ],
      "operatingCadenceJa": "月次の業務量確認、欠勤・配置変更・繁忙期の前後。",
      "artifactsJa": [
        "負担配分表",
        "代替要員・引継ぎ表",
        "追加資源または業務削減の決裁記録"
      ],
      "readinessLevelsJa": {
        "absent": "配慮は現場の善意と家族支援で補われる。",
        "fragile": "一時的な穴埋めはできるが、期限・評価・資源が決まらない。",
        "operating": "負担、期限、所有者、資源、終期、再配分を正式に決めて見直す。"
      },
      "caseActivationJa": [
        "変更前後の仕事量と、各者に増える負担を記録する。",
        "追加業務を引き受ける余力を、元の業務・期限・安全条件から確認する。減らせない場合は、受付量・工程・配置・資源を決められる人と別案を検討する。",
        "期限と再決裁日を置き、善意の恒久化を防ぐ。"
      ],
      "individualizationQuestionsJa": [
        "誰のどの時間・責任・生活負担が増えるか。",
        "その負担は本人が望む就労目標と整合するか。",
        "受渡しが必要な時に、誰の仕事なら動かせるか。動かせない仕事と、変更を決める人は誰か。"
      ],
      "burdenAndEquityChecksJa": [
        "配慮利用者への反感を、資源不足の問題から分けているか。",
        "家族・少人数職場・低資源地域の負担を前提化していないか。"
      ],
      "stopAndEscalationJa": "無償負担が固定する、役割外業務が評価されない、安全余裕が失われる場合は案を止め、資源または仕事量を再決裁する。",
      "outcomeReviewJa": "本人の勤務継続に加え、同僚、家族、管理者、支援者の負担とチーム機能を別々に確認する。",
      "currentGuideFrameIds": [],
      "currentGuideDeltaJa": "新設。現行ガイドで暗黙だった配慮の実装コストと負担移転を、仕事設計の中心的な準備項目として扱う。",
      "linkedCaseBriefIds": [
        "CC2-PROD-02",
        "CC2-PROD-03",
        "CC2-PROD-04",
        "CC2-PROD-07",
        "CC2-MIG-03",
        "CC2-MIG-05",
        "CC2-MIG-09",
        "CC2-MIG-12",
        "CC2-MIG-13",
        "CC2-MIG-14",
        "CC2-MIG-16",
        "CC2-MIG-19",
        "CC2-MIG-21"
      ],
      "readerTitleJa": "チームの負担と応援体制を整える"
    },
    {
      "systemId": "WDG2-09",
      "purposeJa": "就労継続や配慮の有無だけでなく、役割、評価、学習、昇進、所得、所属、離職・再選択を独立した論点として扱う。",
      "readinessQuestionJa": "配慮を使っても、役割・評価・成長・所得を本人と再交渉できるか。",
      "installBeforeCaseJa": [
        "役割、品質、評価、昇進、報酬の基準と決定者を明示する。",
        "配慮利用と能力・意欲・昇進可能性を自動連結しない監査点を置く。",
        "安定、成長、学習、貢献、所得、再選択を別々に話せる面談様式を作る。",
        "収入・給付・社会保険の選択は、確認日と担当窓口を記録した現行情報で試算できる経路を用意する。",
        "役割縮小、評価低下、退職圧力の兆候を通常の仕事改善から分ける。"
      ],
      "ownersJa": [
        "評価・配置決定者",
        "人事・報酬担当",
        "本人が選ぶ相談者"
      ],
      "operatingCadenceJa": "評価期、役割変更時、配慮変更後、本人が再選択を求めた時。",
      "artifactsJa": [
        "評価基準表",
        "役割・成長・所得の選択記録",
        "確認日付き収入・給付試算",
        "不利益兆候チェック"
      ],
      "readinessLevelsJa": {
        "absent": "在籍できることが唯一の成功で、役割・評価の変化が見えない。",
        "fragile": "本人の希望は聞くが、評価基準と決定権が説明されない。",
        "operating": "複数の就労目標、基準、選択肢、不利益、再選択を定期的に確認する。"
      },
      "caseActivationJa": [
        "本人が今望む安定・成長・所得・再選択を分けて確認する。",
        "相談前後の役割、評価、機会、雇用判断を時系列で確認する。",
        "高損失の不利益懸念がなければ、期限・基準付きの選択肢を比較する。"
      ],
      "individualizationQuestionsJa": [
        "本人にとって今の成功は何で、何は成功ではないか。",
        "どの基準と権限が役割・評価・所得を決めるか。",
        "残留、変更、離職、再訓練の各選択で何が変わるか。"
      ],
      "burdenAndEquityChecksJa": [
        "配慮による追加努力を評価から消していないか。",
        "保護を名目に挑戦・学習・昇進機会を狭めていないか。"
      ],
      "stopAndEscalationJa": "報復、差別、退職強要、説明不能な評価低下、本人が望まない役割縮小の懸念では通常試行を止める。",
      "outcomeReviewJa": "在籍・離職だけでなく、役割、評価、学習、貢献、所得、健康、生活、本人の再選択を分けて確認する。",
      "currentGuideFrameIds": [
        "III-01",
        "III-02",
        "III-07"
      ],
      "currentGuideDeltaJa": "現行の参加・制度・所得を保持しながら、意欲や所属の回復を本人側に求めず、職場の評価・機会・再選択の公正へ広げる。",
      "linkedCaseBriefIds": [
        "CC2-PROD-01",
        "CC2-PROD-02",
        "CC2-PROD-05",
        "CC2-PROD-07",
        "CC2-MIG-02",
        "CC2-MIG-07",
        "CC2-MIG-12",
        "CC2-MIG-16",
        "CC2-MIG-17",
        "CC2-MIG-20"
      ],
      "readerTitleJa": "役割・評価・成長機会を公平にする"
    },
    {
      "systemId": "WDG2-10",
      "purposeJa": "提案、本人選択、権限者の承認、実装、観察、帰属判断、人間修正を分け、成功だけでなく無変化・悪化・中断・負担移転から見立てを更新する。",
      "readinessQuestionJa": "提案した後、何が実際に起き、誰がどう見立てを変えたか追えるか。",
      "installBeforeCaseJa": [
        "提案・選択・承認・実装・観察・修正を別状態で記録する。",
        "仕事、健康、生活、参加、安全、負担を別々に観察できる最小項目を決める。",
        "改善、無変化、悪化、混合、中断、未実装を同格に残す。",
        "モデル候補と人間の決定・修正を分け、理由と再確認日を保存する。"
      ],
      "ownersJa": [
        "実装責任者",
        "本人が選ぶレビュー参加者",
        "知識・品質管理者"
      ],
      "operatingCadenceJa": "各試行の事前基準日、短期確認日、終了・継続・修正日。",
      "artifactsJa": [
        "実装状態ログ",
        "複数領域の結果レビュー",
        "人間修正・未解決記録"
      ],
      "readinessLevelsJa": {
        "absent": "提案や会議開催を成果として終了する。",
        "fragile": "結果確認はあるが、実装有無・帰属限界・負担移転が分かれない。",
        "operating": "状態、複数結果、停止、帰属限界、人間修正が次の仮説へ戻る。"
      },
      "caseActivationJa": [
        "本人が選んだ目標と、観察しない情報を確認する。",
        "一つの変更、期限、停止条件、確認方法を決める。",
        "結果からどの仮説を維持・修正・保留するか人間が記録する。"
      ],
      "individualizationQuestionsJa": [
        "実際に実装されたのは何で、されなかったのは何か。",
        "本人、仕事、生活、周囲で異なる結果は出たか。",
        "何が分からず、次の一問でどの判断が変わるか。"
      ],
      "burdenAndEquityChecksJa": [
        "記録・評価の負担が本人や支援者へ集中していないか。",
        "悪化や中断を意欲・遵守不足へ自動変換していないか。"
      ],
      "stopAndEscalationJa": "同意した範囲を越える観察、害・負担の増加、停止条件への到達、権限外の結論化では試行と記録拡張を止める。",
      "outcomeReviewJa": "結果は因果効果の証明ではなく、次の構造・評価・介入仮説と人間判断を更新する材料として扱う。",
      "currentGuideFrameIds": [],
      "currentGuideDeltaJa": "新設。現行27フレームの「点検」を、実装状態、無変化・悪化・中断、帰属限界、人間修正まで閉じる学習基盤へ拡張する。",
      "linkedCaseBriefIds": [
        "CC2-PROD-02",
        "CC2-PROD-03",
        "CC2-PROD-04",
        "CC2-PROD-05",
        "CC2-PROD-06",
        "CC2-PROD-07",
        "CC2-MIG-01",
        "CC2-MIG-02",
        "CC2-MIG-03",
        "CC2-MIG-04",
        "CC2-MIG-05",
        "CC2-MIG-06",
        "CC2-MIG-07",
        "CC2-MIG-08",
        "CC2-MIG-09",
        "CC2-MIG-10",
        "CC2-MIG-11",
        "CC2-MIG-12",
        "CC2-MIG-13",
        "CC2-MIG-14",
        "CC2-MIG-15",
        "CC2-MIG-16",
        "CC2-MIG-17",
        "CC2-MIG-18",
        "CC2-MIG-19",
        "CC2-MIG-20",
        "CC2-MIG-21",
        "CC2-MIG-22"
      ],
      "readerTitleJa": "試した結果を振り返り改善する"
    }
  ]
};
