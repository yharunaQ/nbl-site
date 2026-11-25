// Generated with scripts/ops/export-public-flagship-data.cjs.


type TimeGuide = {
  conditionRowsJa: Array<{
    id: string;
    labelJa: string;
    ordinaryOptionJa: string;
    fluctuationSwitchJa: string;
    returnPathJa: string;
  }>;
  implementationChecksJa: Array<{
    id: 'not-implemented' | 'partial-or-unknown' | 'implemented';
    labelJa: string;
    nextJa: string;
  }>;
  outcomeRoutesJa: Array<{
    resultJa: string;
    meaningJa: string;
    nextJa: string;
  }>;
  reversibleTrialJa: { titleJa: string; boundaryJa: string; fieldsJa: Array<{ labelJa: string; promptJa: string }> };
};

export const NBL_WORK_DESIGN_GUIDE_V2 = {
  "version": "v6-alpha-current30-complete-2026-08-17"
};

export const NBL_WORK_DESIGN_GUIDE_V2_SYSTEMS = [
  {
    "systemId": "WDG2-01",
    "currentGuideDeltaJa": "現行の職場内相談ルートを保持しつつ、受付だけで終わらない決裁・実装RACI、代替経路、高損失時の独立エスカレーションまで拡張する。"
  },
  {
    "systemId": "WDG2-02",
    "currentGuideDeltaJa": "現行の開示・伝え方・相談ルートを統合し、本人側の伝達技能から組織側の最小共有・訂正・撤回運用へ重心を移す。"
  },
  {
    "systemId": "WDG2-03",
    "currentGuideDeltaJa": "現行の指示・切替・記憶支援を保持しつつ、個人の対処法集から、職務要求と変更権限を管理する共通業務基盤へ組み替える。"
  },
  {
    "systemId": "WDG2-04",
    "currentGuideDeltaJa": "現行の体調・通院・回復・リズム・備えを統合し、本人の管理行動中心から、変動を前提にした勤務・業務継続システムへ転換する。"
  },
  {
    "systemId": "WDG2-05",
    "currentGuideDeltaJa": "現行の環境・情報・コミュニケーション・安全フレームを、個別配慮メニューから全員が選べる共通仕事環境へ再配置する。"
  },
  {
    "systemId": "WDG2-06",
    "currentGuideDeltaJa": "現行の段階的職務、通勤、求職、実習を一つの連続設計へ結び、個人の準備段階ではなく組織間の条件継承を中心にする。"
  },
  {
    "systemId": "WDG2-07",
    "currentGuideDeltaJa": "現行の支援ネットワーク接続を、紹介先の列挙から、本人統制のある助言―実装―結果返却の責任連鎖へ改訂する。"
  },
  {
    "systemId": "WDG2-08",
    "currentGuideDeltaJa": "新設。現行ガイドで暗黙だった配慮の実装コストと負担移転を、仕事設計の中心的な準備項目として扱う。"
  },
  {
    "systemId": "WDG2-09",
    "currentGuideDeltaJa": "現行の参加・制度・所得を保持しながら、意欲や所属の回復を本人側に求めず、職場の評価・機会・再選択の公正へ広げる。"
  },
  {
    "systemId": "WDG2-10",
    "currentGuideDeltaJa": "新設。現行27フレームの「点検」を、実装状態、無変化・悪化・中断、帰属限界、人間修正まで閉じる学習基盤へ拡張する。"
  }
];

export const NBL_WORK_DESIGN_GUIDE_V2_CURRENT_FRAMES = [
  {
    "frameId": "I-01",
    "titleJa": "体調変動の設計"
  },
  {
    "frameId": "I-02",
    "titleJa": "治療・通院の統合設計"
  },
  {
    "frameId": "I-03",
    "titleJa": "職場内疾患管理の実装"
  },
  {
    "frameId": "I-04",
    "titleJa": "回復時間の確保設計"
  },
  {
    "frameId": "I-05",
    "titleJa": "勤務リズムの適合設計"
  },
  {
    "frameId": "I-06",
    "titleJa": "段階的職務設計"
  },
  {
    "frameId": "I-07",
    "titleJa": "病状変化への備えの設計"
  },
  {
    "frameId": "II-01",
    "titleJa": "感覚環境の設計"
  },
  {
    "frameId": "II-02",
    "titleJa": "通勤・移動の負荷設計"
  },
  {
    "frameId": "II-03",
    "titleJa": "会議・情報処理の設計"
  },
  {
    "frameId": "II-04",
    "titleJa": "視覚的情報アクセス設計"
  },
  {
    "frameId": "II-05",
    "titleJa": "音声・コミュニケーション環境の設計"
  },
  {
    "frameId": "II-06",
    "titleJa": "対人応答負荷の調整"
  },
  {
    "frameId": "II-07",
    "titleJa": "指示・業務設計の明確化"
  },
  {
    "frameId": "II-08",
    "titleJa": "タスク切替の負荷設計"
  },
  {
    "frameId": "II-09",
    "titleJa": "記憶・段取りの外部化設計"
  },
  {
    "frameId": "II-10",
    "titleJa": "情報共有の範囲設計"
  },
  {
    "frameId": "II-11",
    "titleJa": "安全重視業務の運用設計"
  },
  {
    "frameId": "III-01",
    "titleJa": "就労意欲・社会参加の再接続"
  },
  {
    "frameId": "III-02",
    "titleJa": "制度的所属と就労選択肢の整理"
  },
  {
    "frameId": "III-03",
    "titleJa": "開示判断の設計"
  },
  {
    "frameId": "III-04",
    "titleJa": "伝え方の設計"
  },
  {
    "frameId": "III-05",
    "titleJa": "求職活動の道筋設計"
  },
  {
    "frameId": "III-06",
    "titleJa": "実習・訓練から就業への接続"
  },
  {
    "frameId": "III-07",
    "titleJa": "収入・給付の安定設計"
  },
  {
    "frameId": "III-08",
    "titleJa": "支援ネットワークへの接続"
  },
  {
    "frameId": "III-09",
    "titleJa": "職場内相談ルートの設計"
  }
];

export const NBL_WORK_DESIGN_GUIDE_V2_OPERATIONAL_MODULES: { 'WDG2-04': TimeGuide } = {
  "WDG2-04": {
    "conditionRowsJa": [
      {
        "id": "task-volume",
        "labelJa": "仕事量・優先順位",
        "ordinaryOptionJa": "必須・延期可・分担可を平時から分ける。",
        "fluctuationSwitchJa": "当日の量、締切、同時進行数を一段下げる。",
        "returnPathJa": "本人の希望、回復と業務状況を確認し、維持・再調整・増減を選ぶ。元の量へ戻すことを既定にしない。"
      },
      {
        "id": "schedule",
        "labelJa": "開始・終了・勤務日",
        "ordinaryOptionJa": "時差、短時間、在宅、連続勤務を避ける選択肢を示す。",
        "fluctuationSwitchJa": "開始延期、早退、勤務日の入替の判断者と、不在時の代行・連絡方法を決める。",
        "returnPathJa": "日数、時間、仕事量の組合せを記録して調整する。切り分けて試せる場合も、必要な配慮を外して比較しない。"
      },
      {
        "id": "break-recovery",
        "labelJa": "休憩・回復",
        "ordinaryOptionJa": "休憩場所と取り方を選べる。決まった時刻の休憩だけで足りるか、必要時に中断できる方法も確かめる。",
        "fluctuationSwitchJa": "保存して再開できる仕事と、その場の交代が必要な仕事を分ける。休憩の追加で仕事密度を上げない。",
        "returnPathJa": "回復時間を先に削らず、持続性を確認してから変更する。"
      },
      {
        "id": "commute-treatment-life",
        "labelJa": "通勤・治療・生活との衝突",
        "ordinaryOptionJa": "通勤混雑、通院日、生活責任と勤務の衝突を予定段階で確認する。",
        "fluctuationSwitchJa": "移動・待機・家庭負担を含む一日の総負荷から勤務条件を変える。",
        "returnPathJa": "家族の無償支援や回復時間の削減に置き換わっていないか再確認する。"
      },
      {
        "id": "handover-return",
        "labelJa": "引継ぎ・欠勤・復帰",
        "ordinaryOptionJa": "途中の状態を残す方法を用意し、交代が必要な仕事では必要時の受入余力と期限の扱いも決める。",
        "fluctuationSwitchJa": "本人の追加説明なしで、保留・代替・連絡が動く。",
        "returnPathJa": "休んだ分を一括で戻さず、作業状態・決定事項・本人が望む役割へ再接続する。"
      },
      {
        "id": "pay-role-growth",
        "labelJa": "収入・評価・役割・成長",
        "ordinaryOptionJa": "勤務条件と、賃金・評価・役割・学習機会を別項目で説明する。",
        "fluctuationSwitchJa": "一時的な変更を能力や意欲の評価へ自動変換しない。",
        "returnPathJa": "本人が望む役割や機会へ再接続する判断日を置く。"
      }
    ],
    "implementationChecksJa": [
      {
        "id": "not-implemented",
        "labelJa": "まだ実施できていない",
        "nextJa": "担当者不在、代替要員不足、期限の未変更など、職場側で実施できなかった理由を先に直します。試していない案を「効果がなかった」と扱いません。本人が実施を選ばなかった場合も、不従順や失敗とは扱いません。"
      },
      {
        "id": "partial-or-unknown",
        "labelJa": "一部だけ・まだ分からない",
        "nextJa": "予定と実際の違い、誰のどの様子が分かっていないかを確認します。無変化と決めつけず、安全を確保したうえで、追加確認・再調整・保留のどれにするか本人と決めます。"
      },
      {
        "id": "implemented",
        "labelJa": "実施し、様子を確認できた",
        "nextJa": "ここで初めて、実施した条件で何が変わったかを分けて見ます。勤務が続いたことだけで成功とせず、健康・生活・仕事の質・機会・周囲の負担を確かめます。"
      }
    ],
    "outcomeRoutesJa": [
      {
        "resultJa": "改善した",
        "meaningJa": "この条件と期間では役立った可能性。誰にでも効く方法とはまだ言えない。",
        "nextJa": "本人が続けたいか、無理なく続くかを確認する。他の人へ自動適用せず、選択肢と担当手順に改善点を戻す。"
      },
      {
        "resultJa": "変わらなかった",
        "meaningJa": "本人の努力不足ではなく、変えた条件・観察期間・目標のどれかが合っていない可能性。",
        "nextJa": "実施内容と観察期間を確かめたうえで、別の見立て・条件の組合せ・目標を検討する。元の条件へ戻すことを自動的に選ばない。"
      },
      {
        "resultJa": "悪化した・中断した",
        "meaningJa": "安全、健康、仕事、生活、機会のどこが悪化したかを分ける。",
        "nextJa": "問題のある作業・変更を止め、安全な代替や必要な専門経路へつなぐ。元の条件が安全とは限らず、同じ試行を自動反復しない。"
      },
      {
        "resultJa": "一部は良いが別の負担が増えた",
        "meaningJa": "混合結果。得られた利益と、移った負担を同じ成功指標にまとめない。",
        "nextJa": "利益を残せるか検討し、負担を受けた人・領域と一緒に条件を組み直す。"
      }
    ],
    "reversibleTrialJa": {
      "titleJa": "実施前に、変更する条件と見直し方を合意する",
      "boundaryJa": "本人が選び、実装権限を持つ人が合意できる範囲だけで試します。医療・安全上の判断が必要な場合は職場だけで決めません。",
      "fieldsJa": [
        {
          "labelJa": "本人が守りたいこと",
          "promptJa": "仕事、健康、生活、収入、参加のうち今回優先するもの"
        },
        {
          "labelJa": "組み合わせて変える条件",
          "promptJa": "時間、仕事量、休憩、引継ぎなど、同時に必要な変更とその理由"
        },
        {
          "labelJa": "変えない条件と解釈の限界",
          "promptJa": "無理なく切り分けられる場合は変更を絞る。複数を変えた結果を一つの条件の効果と断定しない"
        },
        {
          "labelJa": "期間と確認日",
          "promptJa": "試す期間、途中確認、終了または更新を決める日"
        },
        {
          "labelJa": "判断者と実装担当",
          "promptJa": "承認、現場実装、記録、緊急時の担当"
        },
        {
          "labelJa": "情報の範囲",
          "promptJa": "共有してよい仕事条件と、共有しない個人情報"
        }
      ]
    }
  }
};
