import { render, screen } from '@testing-library/react';
import AxiomIntegratedDomainKnowledgeReviewPage from '@/pages/internal/axiom-integrated-domain-knowledge-review';

describe('Axiom integrated domain knowledge review internal surface', () => {
  it('renders stratified reanalysis as the main Founder review target before the superseded six-axis candidate', () => {
    render(<AxiomIntegratedDomainKnowledgeReviewPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Axiom Discovery Review',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('14 input packets')).toBeInTheDocument();
    expect(screen.getByText('6 integrated axes')).toBeInTheDocument();
    expect(screen.getByText('6-axis candidate superseded')).toBeInTheDocument();
    expect(screen.getByText('9 provisional review-unit candidates')).toBeInTheDocument();
    expect(screen.getByText('10 all-layer revalidated candidates')).toBeInTheDocument();
    expect(screen.getByText('18 long-tail health-condition signals')).toBeInTheDocument();
    expect(screen.getByText('9 upper disability categories')).toBeInTheDocument();
    expect(screen.getByText('35.8% non-current income work')).toBeInTheDocument();
    expect(screen.getByText('42 semantic facets')).toBeInTheDocument();
    expect(screen.getByText('97% target coverage')).toBeInTheDocument();
    expect(screen.getByText('27 L3 contrast seeds')).toBeInTheDocument();
    expect(screen.getByText('9 receipt-shell units')).toBeInTheDocument();
    expect(
      screen.getByText('10 / 10 accepted as Axiom integrated domain knowledge'),
    ).toBeInTheDocument();
    expect(screen.getByText('founder_chat_review_result_2026_06_12')).toBeInTheDocument();
    expect(
      screen.getByText(
        'build_axiom_integrated_domain_knowledge_backed_next_nbl_candidate_page_bodies',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('internal_founder_review_candidate_pages_only_not_actual_public_navigation')
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('not_decided_by_this_receipt').length).toBeGreaterThan(0);
    expect(screen.getByText('10候補のcoverage確認')).toBeInTheDocument();
    expect(screen.getByText('Founderレビュー前にCodexが先に潰した論点')).toBeInTheDocument();
    expect(screen.getByText('mobility_and_accessibility_overlap_review')).toBeInTheDocument();
    expect(screen.getByText('cross_disability_coverage_review')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Codexは、粒度差、障害種別横断coverage、移動/アクセス混線、source件数バイアス、公開投影リスクを先に検査し、修正済み箇所と残る判断点を分ける。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '通勤・職場外移動による健康時間消耗を候補1へ、職場内移動・職場外移動・通勤接続を候補7へ移し、候補3は身体操作・道具操作へのアクセスに範囲を狭めた。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Founderは、全\d+下部構造を一つずつ監査するのではなく/),
    ).toBeInTheDocument();
    expect(screen.getByText('do_not_accept_top_level_10_without_substructure_coverage_review')).toBeInTheDocument();
    expect(screen.getByText('18/18')).toBeInTheDocument();
    expect(screen.getByText('49/49')).toBeInTheDocument();
    expect(screen.getByText('下部構造レビューが必要な候補')).toBeInTheDocument();
    expect(
      screen.getAllByText('rebuilt_unit_worksite_contact_task_safety_tools').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText('全層reanalysis後の10個のAxiom発見候補'),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/^Review candidate /)).toHaveLength(10);
    expect(screen.getAllByText('この候補の下部構造')).toHaveLength(10);
    expect(screen.getAllByText('substructure / bias-resistant coverage')).toHaveLength(10);
    expect(screen.getByText('視覚情報・文書形式・画面情報へのアクセス')).toBeInTheDocument();
    expect(screen.getByText('聴覚・音声・会議進行へのアクセス')).toBeInTheDocument();
    expect(screen.getByText('指示・手順・説明形式が合わない')).toBeInTheDocument();
    expect(screen.getByText('切替・優先順位・例外対応の負荷')).toBeInTheDocument();
    expect(screen.getByText('訓練・職場体験・試行機会との接続')).toBeInTheDocument();
    expect(screen.getByText('人員余力・顧客接点・調整余地')).toBeInTheDocument();
    expect(screen.getByText('通勤・職場外移動が健康時間を消耗する')).toBeInTheDocument();
    expect(screen.getByText('職場内移動・職場外移動・通勤接続')).toBeInTheDocument();
    expect(screen.getByText('身体操作・道具操作へのアクセス')).toBeInTheDocument();
    expect(screen.getByText('Review candidate 1 / 10')).toBeInTheDocument();
    expect(
      screen.getByText(
        '働きづらさは、体調の有無だけでなく、仕事密度・回復余地・評価時期が健康時間と噛み合わない時に強くなる。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '視覚・聴覚・身体条件による情報アクセスは、本人が何を開示するかとは別の、仕事への参加条件である。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '認知・高次脳・知的障害に関わる働きづらさは、能力の有無ではなく、手順、説明、切替、評価の設計で大きく変わる。',
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText('この候補で変わる読み方')).toHaveLength(10);
    expect(screen.getAllByText('Founder review question')).toHaveLength(10);
    expect(
      screen.getAllByText('この候補をAxiom coreの統合知識候補として受け入れる')
        .length,
    ).toBe(10);
    expect(
      screen.getAllByText('候補のmissing contextやsource lens確認までholdする')
        .length,
    ).toBe(10);
    for (const label of [
      '健康時間・生活保障・仕事密度の相互調整',
      '支援の再翻訳・継続接続・ネットワーク機能',
      '職場接触点・タスク・情報・安全の実装条件',
      'source lens・制度差・歴史差から見る普遍構造と過剰一般化ブレーキ',
      '参加アクセス・情報形式・開示境界の分離設計',
      '役割・価値・成長・就業後の質のループ',
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getByText('層別再分析で分かったこと')).toBeInTheDocument();
    expect(screen.getByText('なぜ6軸補正では足りないか')).toBeInTheDocument();
    expect(
      screen.getByText('例示対応ではなく、少数シグナル全体を保護する'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('軸再構成前に全scannable layerをrouteする'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('上位障害種類9カテゴリを詳細疾病tokenと分けて見る'),
    ).toBeInTheDocument();
    expect(screen.getByText('入口前・非就労中フェーズは低頻度ではない')).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes('上位分類は、仕事設計上の差が詳細疾病名に埋もれないように別レイヤーで保持する'),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('patch_only_examples_named_in_founder_review'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('頸髄損傷').length).toBeGreaterThan(0);
    expect(screen.getAllByText('皮膚筋炎／多発性筋炎').length).toBeGreaterThan(0);
    expect(screen.getAllByText('重症筋無力症').length).toBeGreaterThan(0);
    expect(screen.getByText('指定難病・慢性疾患系の負荷量が強い')).toBeInTheDocument();
    expect(
      screen.getByText('低頻度・高特異性の健康条件tokenを例示に限らず一括保護する'),
    ).toBeInTheDocument();
    expect(screen.getByText('軸再構成前に全scannable layerを保護する')).toBeInTheDocument();
    expect(screen.getAllByText('health_condition').length).toBeGreaterThan(0);
    expect(screen.getAllByText('narrative_concept').length).toBeGreaterThan(0);
    expect(screen.getAllByText('narrative_field').length).toBeGreaterThan(0);
    expect(screen.getByText('health_conditionの長尾18件')).toBeInTheDocument();
    expect(screen.getByText('pattern familyを大きさで潰さない')).toBeInTheDocument();
    expect(screen.getAllByText('accommodation_gap').length).toBeGreaterThan(0);
    expect(screen.getByText('global / local / microを同時に保持する')).toBeInTheDocument();
    expect(screen.getAllByText('micro').length).toBeGreaterThan(0);
    expect(screen.getByText('source lensの重みと限界を同時に持つ')).toBeInTheDocument();
    expect(screen.getAllByText('nanbyo_survey_4000').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('historical_linked_triangular_source_family').length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('視覚・聴覚の情報アクセスとコミュニケーション')).toBeInTheDocument();
    expect(screen.getByText('内部障害・血液透析等の定期管理時間')).toBeInTheDocument();
    expect(screen.getByText('未就業・入口前の仕事像と移行経験')).toBeInTheDocument();
    expect(
      screen.getByText('暫定9 review-unit candidates: 全層保護後に再評価する'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/この9件は、旧6軸を止めるために作った暫定候補セット/),
    ).toBeInTheDocument();
    expect(screen.getByText('全層reanalysis後の10 review-unit candidates')).toBeInTheDocument();
    expect(screen.getByText(/暫定9候補は固定入力ではない/)).toBeInTheDocument();
    expect(screen.getByText('split_after_all_layer_sweep')).toBeInTheDocument();
    expect(
      screen.getAllByText('視覚・聴覚・身体条件を含む情報形式/コミュニケーションアクセス')
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('認知・高次脳・知的障害の手順理解/切替負荷').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('定期検診・治療・内部障害の時間条件').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('視覚・聴覚・認知を含むコミュニケーション/情報アクセス')
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('入口前の仕事像・体験接続・移行支援').length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('旧6発見: 層別再分析により再構成が必要')).toBeInTheDocument();
    expect(screen.getAllByText(/^Hypothesis /)).toHaveLength(6);
    expect(
      screen.getByText(
        '働きづらさは、体調だけでなく「働く時間の設計」が合っていない時に強くなる。ただし難病の体調変動だけで健康時間全体を代表させない。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '体調変動は「本人の不安定さ」ではなく、仕事密度、回復時間、通院・定期検診、収入不安、評価時期が同じ時間軸で衝突する構造として現れる。内部障害の定期的管理と難病の変動・再燃は分けて読む。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '支援の本体は「支援者がいること」ではなく、本人・職場・医療・制度の言葉を仕事条件へ翻訳し直し、変化後も戻れる接続を保つ機能にある。',
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText('この仮説で変わる読み方')).toHaveLength(6);
    expect(screen.getAllByText('レビュー判断')).toHaveLength(6);
    expect(screen.getAllByText('この仮説の確認ポイント')).toHaveLength(6);
    expect(screen.getAllByText('サイトへの反映')).toHaveLength(6);
    expect(
      screen.getAllByText('この仮説をAxiom coreの発見として受け入れる')
        .length,
    ).toBe(6);
    expect(
      screen.getAllByText('方向は受け入れるが、言葉や範囲を修正する').length,
    ).toBe(6);
    expect(
      screen.getAllByText('missing contextやsource lens確認までholdする').length,
    ).toBe(6);
    expect(
      screen.getAllByText('補助facet: この仮説を支える詳しい読み筋'),
    ).toHaveLength(6);
    expect(screen.getByText('体調変動と仕事量平準化')).toBeInTheDocument();
    expect(screen.getByText('治療・通院・定期検診・回復時間の同期')).toBeInTheDocument();
    expect(screen.getByText('視覚・聴覚を含む情報形式アクセシビリティ')).toBeInTheDocument();
    expect(screen.getByText('応募前の仕事像・体験接続')).toBeInTheDocument();
    expect(
      screen.getByText('受け入れる / 修正する / 分割・統合する / holdする'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('監査用データ、coverage、L3照合、receipt shellを開く'),
    ).toBeInTheDocument();
  });

  it('shows L3 27 as contrast only, not as public content source or fixed view count', () => {
    render(<AxiomIntegratedDomainKnowledgeReviewPage />);

    expect(screen.getByText('L3 27 seedとの照合')).toBeInTheDocument();
    expect(screen.getByText('42 facetで多様性coverageを上げる')).toBeInTheDocument();
    expect(screen.getByText('six_axes_plus_42_facets')).toBeInTheDocument();
    expect(screen.getAllByText('97%').length).toBeGreaterThan(0);
    expect(screen.getByText('facet_residual_watchlist')).toBeInTheDocument();
    expect(screen.getAllByText('99%').length).toBeGreaterThan(0);
    expect(screen.getByText('比較・抜け確認だけ。本文ソースにはしない。')).toBeInTheDocument();
    expect(screen.getAllByText('covered_by_integrated_axis').length).toBeGreaterThan(0);
    expect(screen.getAllByText('merge_into_integrated_axis').length).toBeGreaterThan(0);
    expect(screen.getAllByText('split_pressure_on_integrated_axis').length).toBeGreaterThan(0);
    expect(screen.getAllByText('rename_candidate_after_review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('gap_or_hold_until_missing_context').length).toBeGreaterThan(0);
  });

  it('renders all 27 L3 rows and keeps page projection blocked', () => {
    render(<AxiomIntegratedDomainKnowledgeReviewPage />);

    expect(screen.getByText('L3-PIP-01 体調変動と負荷平準化')).toBeInTheDocument();
    expect(screen.getByText('L3-PIP-21 職場規模・地域・支援資源による実装差')).toBeInTheDocument();
    expect(screen.getByText('L3-CCA-27 review / learning loopを閉じない')).toBeInTheDocument();
    expect(screen.getByText('公開承認・source/support validity・runtime・learning update')).toBeInTheDocument();
    expect(screen.getByText('L3 27 seedとの照合')).toBeInTheDocument();
  });

  it('renders the Founder receipt shell as review input and keeps projection blocked before receipt', () => {
    render(<AxiomIntegratedDomainKnowledgeReviewPage />);

    expect(screen.getByText('確認用: 9 receipt-shell units')).toBeInTheDocument();
    expect(screen.getByText('監査用データ、coverage、L3照合、receipt shellを開く')).toBeInTheDocument();
    expect(screen.getByText(/投影前の安全ゲート/)).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
    expect(screen.getAllByText('axis_semantic_facet_bundle')).toHaveLength(6);
    expect(screen.getByText('coverage_policy_review')).toBeInTheDocument();
    expect(screen.getByText('residual_watchlist_review')).toBeInTheDocument();
    expect(screen.getByText('l3_contrast_summary_review')).toBeInTheDocument();
    expect(screen.getByText('required receipt fields')).toBeInTheDocument();
    expect(screen.getByText('prohibited before receipt')).toBeInTheDocument();
  });
});
