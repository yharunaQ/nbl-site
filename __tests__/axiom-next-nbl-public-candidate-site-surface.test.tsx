import { existsSync } from 'node:fs';
import path from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import AxiomNextNblPublicCandidateHomePage from '@/pages/internal/axiom-next-nbl-public-candidate';
import AxiomNextNblPublicCandidatePage, {
  getServerSideProps,
} from '@/pages/internal/axiom-next-nbl-public-candidate/[slug]';
import { buildAxiomReviewedKernelBackedCandidateRouteMap } from '@/lib/axiom/reviewedKernelBackedCandidateRouteMap';

function expectDesignGuideBeforeConsultation(nav: HTMLElement) {
  const labels = Array.from(nav.querySelectorAll('a')).map((link) => link.textContent);

  expect(labels.indexOf('設計ガイド')).toBeGreaterThanOrEqual(0);
  expect(labels.indexOf('相談事例')).toBeGreaterThanOrEqual(0);
  expect(labels.indexOf('設計ガイド')).toBeLessThan(labels.indexOf('相談事例'));
}

function expectNoIssueMapInMenu(nav: HTMLElement) {
  expect(within(nav).queryByRole('link', { name: '課題地図' })).not.toBeInTheDocument();
}

describe('Axiom next NBL public candidate site surface', () => {
  it('renders the home page as a public-like Founder review candidate', () => {
    const { container } = render(<AxiomNextNblPublicCandidateHomePage />);

    expect(container.querySelector('.axiom-public-candidate')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '障害者雇用・難病就労支援から、AI時代の仕事設計へ。',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '障害者雇用・難病就労支援の断片的な情報を、AIの文脈読解補助と人間の確認を通して、本人・仕事・環境・支援・時間・評価の条件地図へ読み替える図',
      ),
    ).toHaveAttribute('src', '/images/next-nbl-home-why-hero-imagegen-v1.png');
    expect(screen.queryByAltText(/働きづらさを仕事条件の地図へ変換/)).not.toBeInTheDocument();
    expect(
      screen.getByRole('navigation', {
        name: 'NBL site navigation',
      }),
    ).toBeInTheDocument();
    expectDesignGuideBeforeConsultation(
      screen.getByRole('navigation', {
        name: 'NBL site navigation',
      }),
    );
    expectDesignGuideBeforeConsultation(
      screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
    );
    expectNoIssueMapInMenu(
      screen.getByRole('navigation', { name: 'NBL site all pages', hidden: true }),
    );
    expectDesignGuideBeforeConsultation(
      screen.getByRole('navigation', { name: 'NBL site mobile navigation' }),
    );
    expectNoIssueMapInMenu(screen.getByRole('navigation', { name: 'NBL site mobile navigation' }));
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '膨大で偏りを含む情報を、実践できる仕事条件の地図へ。',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '6つの入口で、NBLが扱う問題空間を見渡す。',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('関心のある入口から、働きづらさの見え方を変える。'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /現実の課題を、ニュース像として先に読む/ }),
    ).toHaveAttribute('href', '/virtual-news');
    expect((container.textContent ?? '').indexOf('誰もが活躍できる仕事・参加設計へ')).toBeLessThan(
      (container.textContent ?? '').indexOf('一言の相談を、見立てと支援計画へほどく'),
    );
    expect(screen.queryByText('8つの課題の地図で、問題空間を見渡す')).not.toBeInTheDocument();
    expect(screen.queryByText('ハブを開く')).not.toBeInTheDocument();
    expect(screen.getAllByText('相談事例').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NBLレポート').length).toBeGreaterThan(0);
    expect(screen.getAllByText('NBLの専門性').length).toBeGreaterThan(0);
    expect(screen.getAllByText('サイト情報').length).toBeGreaterThan(0);
    expect(screen.getAllByText('プロジェクト').length).toBeGreaterThan(0);
    expect(screen.getByText('NBLを一緒に育てる実装テーマ', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText('現実課題、相談、設計、レポート、共有素材、障害種類。', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText('入口カード自体が地図になる。')).not.toBeInTheDocument();
    expect(screen.queryByText('9つの入口を、Axiom統合知識で作り直す。')).not.toBeInTheDocument();
    expect(screen.queryByText('次に読む')).not.toBeInTheDocument();
    expect(screen.queryByText('このページで扱う中核発見')).not.toBeInTheDocument();
    expect(screen.queryByText('公開コピー化の前に見る点')).not.toBeInTheDocument();
    expect(screen.queryByText('全体入口')).not.toBeInTheDocument();
    expect(screen.getAllByText('トップ').length).toBeGreaterThan(0);
    expect(screen.getAllByText('設計ガイド').length).toBeGreaterThan(0);
    expect(screen.queryByText('企業・行政・支援機関の方へ。')).not.toBeInTheDocument();
    expect(screen.queryByText('企業・管理職研修')).not.toBeInTheDocument();
    expect(screen.queryByText('行政・支援機関の共同検討')).not.toBeInTheDocument();
    expect(screen.queryByText('記事・図解・教材の活用')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /問い合わせ前に確認する/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/internal Founder review candidate/)).not.toBeInTheDocument();
    expect(screen.queryByText(/not actual public navigation/)).not.toBeInTheDocument();
    expect(screen.queryByText(/not publication/)).not.toBeInTheDocument();
    expect(screen.queryByText('内部候補表示。正式公開版ではありません。')).not.toBeInTheDocument();
    expect(screen.getByText('Next Being Lab / 仕事条件で読む')).toBeInTheDocument();
  });

  it('renders the work-design guide as a readable candidate page, not an object ledger', () => {
    const { container } = render(
      <AxiomNextNblPublicCandidatePage slug="work-design-views-guide" />,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '未来の仕事・社会参加設計ガイド',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '未来の仕事・社会参加設計ガイド。仕事、生活、健康、職場アクセス、評価と成長、支援と制度をつなぐ水彩調の関係地図。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '障害者雇用や難病就労支援で見えてきた課題を、人間の多様性を前提にした仕事と社会参加の設計図へ広げます。',
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('障害者雇用の知見を、これからの仕事設計へ。')).toBeInTheDocument();
    expect(
      screen.getByText('狭い「標準的な職業人」像へ人を押し込む構造', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByAltText(
        '狭い標準像から多様性を前提にした仕事・社会参加設計へ読み替える図。障害・難病就労で見えてきた無理を、健康時間、情報形式、移動、支援、評価の仕事条件として整理する。',
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByText('連続した課題として見る')).toBeInTheDocument();
    expect(screen.getByText('仕事の意味が変わる時代の設計知にする')).toBeInTheDocument();
    expect(screen.getByText('個人の問題ではなく、仕事条件の設計へ。')).toBeInTheDocument();
    expect(
      screen.getByText('いま止まっている参加を、時間、情報、手順、評価、支援の条件に分ける。'),
    ).toBeInTheDocument();
    expect(screen.getByText('早期発見')).toBeInTheDocument();
    expect(screen.getByText('5つの設計領域へ進む')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '就職前・入口・移行を設計するへ移動' }),
    ).toHaveAttribute('href', '#work-design-domain-pre-entry-transition');
    expect(
      screen.getByRole('link', { name: '健康時間・生活保障・仕事密度を設計するへ移動' }),
    ).toHaveAttribute('href', '#work-design-domain-health-time-livelihood');
    expect(
      screen.getByRole('link', { name: '情報・手順・接触点を設計するへ移動' }),
    ).toHaveAttribute('href', '#work-design-domain-worksite-access-operations');
    expect(screen.getByText('5つの入口から、詳しい設計カードへ。')).toBeInTheDocument();
    expect(screen.getAllByText('設計領域 A').length).toBeGreaterThan(0);
    expect(screen.getAllByText('設計領域 E').length).toBeGreaterThan(0);
    expect(screen.getAllByText('就職前・入口・移行を設計する').length).toBeGreaterThan(1);
    expect(screen.getAllByText('情報・手順・接触点を設計する').length).toBeGreaterThan(1);
    expect(container.querySelectorAll('[data-work-design-domain-topic-link]')).toHaveLength(10);
    expect(
      screen.queryByText('「個人の問題」に見える時ほど、仕事条件を見る。'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('これまでの詰まり')).not.toBeInTheDocument();
    expect(screen.queryByText('ここでの読み替え')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        '左から右へ、止まっている状態、繰り返している状態、調整を始める状態、予防して続けられる状態として読みます。',
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Step 1/)).not.toBeInTheDocument();
    expect(screen.getAllByText('図解2｜状況レベル4コマ').length).toBeGreaterThan(0);
    expect(screen.getAllByText('5領域 / 10論点 / 37項目').length).toBeGreaterThan(0);
    expect(screen.getAllByText('変動する健康時間・仕事密度・回復余地').length).toBeGreaterThan(1);
    expect(
      screen.getAllByText('視覚・聴覚・身体条件を含む情報形式/コミュニケーションアクセス').length,
    ).toBeGreaterThan(1);
    expect(
      screen.queryByAltText(
        '具体設計項目、健康時間。変動・再燃・疲労、回復余地・戻り方、通勤・移動の消耗、収入・評価との衝突を示す図解ボード。',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(
        '具体設計項目、情報形式。視覚情報・文書形式、聴覚・音声・会議進行、身体操作・道具操作、緊急連絡・非公式情報を示す図解ボード。',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(
        '具体設計項目、就職前・移行。非就労・未就業層の仕事像、応募前の条件言語化、訓練・職場体験・試行機会、家族・学校・支援から職場へを示す図解ボード。',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(
        '具体設計項目、職場接触点。作業分解・仕事密度、道具・設備・環境、職場内外の移動、安全・ミス許容度、人員余力・顧客接点、評価・役割・フィードバックを示す図解ボード。',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(
        '具体設計項目、伝える情報。目的限定の情報共有、見えにくさとスティグマ、不利益評価・過剰管理リスクを示す図解ボード。',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(
        '具体設計項目、支援の接続。言葉を仕事条件へ翻訳、handoff・役割境界、悪化・復職・配置換え後を示す図解ボード。',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(
        '具体設計項目、評価と成長。就職後の役割設計、評価・処遇・収入の公正さ、学習・キャリア・選び直しを示す図解ボード。',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(
        '具体設計項目、資料の読み方。多数データを過大代表させない、歴史・国際資料から構造を探す、公開前の過剰一般化ブレーキを示す図解ボード。',
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('MASTER PLAN')).not.toBeInTheDocument();
    expect(screen.queryByText('Master plan')).not.toBeInTheDocument();
    expect(screen.getAllByText(/図解1｜具体設計項目/).length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText('図解2｜状況レベル4コマ').length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText('視点転換のポイント').length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText('具体設計項目と設計ポイント').length).toBeGreaterThanOrEqual(10);
    expect(screen.queryByText('具体設計項目ごとのポイント')).not.toBeInTheDocument();
    expect(screen.queryByText('メイン図解')).not.toBeInTheDocument();
    expect(screen.queryByText('軸:', { exact: false })).not.toBeInTheDocument();
    expect(screen.getAllByText(/問題状況は固定ではなく/).length).toBeGreaterThanOrEqual(10);
    expect(
      screen.getByAltText(
        '健康時間を設計する。破綻・停止、高頻度支障、要調整、安定・予防の4つの状況レベルを示す図解カード。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '治療・検診時間を設計する。治療か仕事かの二択から、勤務表に健康時間を置く状態までを示す図解カード。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '情報形式を設計する。会議や連絡から外れる状態から、同じ流れを見ながら話せる状態までを示す図解カード。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '手順と戻り方を設計する。開始・切替・完了で詰まる状態から、失敗しても仕事に戻れる状態までを示す図解カード。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '就職前から仕事像を設計する。求人語が壁になる状態から、体験を採用後へつなぐ状態までを示す図解カード。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '職場アクセスを設計する。情報、動線、道具、安全を仕事の接点として整える4つの状況レベル図解カード。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '伝える情報を設計する。調整が動かない状態から、調整と評価を両立する状態までを示す図解カード。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '支援を仕事条件へつなぎ直す。本人・職場・支援が別々の状態から、悪化や変更時に再調整できる状態までを示す図解カード。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '続けるだけでなく育つ道を設計する。定着だけの状態から、役割・賃金・学びを更新する状態までを示す図解カード。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '多様な資料から全体像を設計する。一つの資料で一般化する状態から、共通構造と保留を分けて伝える状態までを示す図解カード。',
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/詰まり・古い読み/).length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText(/設計・設計の読み/).length).toBeGreaterThanOrEqual(10);
    expect(screen.queryByText('絡まり')).not.toBeInTheDocument();
    expect(screen.queryByText('今日から使う設計部品')).not.toBeInTheDocument();
    expect(screen.getAllByText(/具体設計項目/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('締切、勤務密度、体調変動、回復時間を同じ時間表に置いて見る。').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('端末、作業台、照明、音、温度、休憩場所を仕事の接触面として点検する。')
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('発見候補をそのまま公開主張にせず、言える範囲を確認する。').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('体調変動と仕事密度を同じ時間表で設計する').length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText('立場が違っても、同じ設計地図で話せるようにする')).toBeInTheDocument();
    const renderedText = container.textContent ?? '';
    expect(renderedText).not.toContain('Founderレビュー済み');
    expect(renderedText).not.toContain('source lens');
    expect(renderedText).not.toContain('cannot-yet-say');
    expect(renderedText).not.toContain('Axiomの見立て');
    expect(renderedText).not.toContain('Axiom統合知識');
    expect(screen.getByText('このページから、次に進む。')).toBeInTheDocument();
    expect(screen.getByText('設計視点を相談に戻す')).toBeInTheDocument();
    expect(screen.getByText('社会の問いとして深める')).toBeInTheDocument();
    expect(screen.getByText('設計を素材にする')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-work-design-perspective-comparison]')).toHaveLength(
      10,
    );
    expect(container.querySelectorAll('[data-work-design-section-point]')).toHaveLength(30);
    expect(container.querySelector('[data-work-design-section-point]')?.className).toContain(
      'grid-cols-[auto_1fr]',
    );
    expect(container.querySelectorAll('[data-work-design-item-point-card]')).toHaveLength(37);
    expect(screen.queryByText('設計項目')).not.toBeInTheDocument();
    const itemDiagramImages = Array.from(
      container.querySelectorAll<HTMLImageElement>('[data-work-design-item-image-diagram] img'),
    );
    expect(itemDiagramImages).toHaveLength(37);
    for (const image of itemDiagramImages) {
      const src = image.getAttribute('src') ?? '';
      expect(src).toMatch(/^\/images\/axiom-work-design-guide\/item-diagrams\/.+-v1\.png$/);
      expect(existsSync(path.join(process.cwd(), 'public', src))).toBe(true);
    }
    expect(container.querySelectorAll('[data-work-design-item-point]')).toHaveLength(74);
    expect(container.querySelector('#work-design-domain-pre-entry-transition')).not.toBeNull();
    expect(container.querySelector('#work-design-domain-health-time-livelihood')).not.toBeNull();
    expect(
      container.querySelector('#work-design-domain-worksite-access-operations'),
    ).not.toBeNull();
    expect(
      container.querySelector('#work-design-domain-relationship-evaluation-growth'),
    ).not.toBeNull();
    expect(
      container.querySelector('#work-design-domain-support-institution-learning'),
    ).not.toBeNull();
    const firstSectionIndex = renderedText.indexOf('変動する健康時間・仕事密度・回復余地');
    const firstConcreteIndex = renderedText.indexOf('図解1｜具体設計項目', firstSectionIndex + 1);
    const firstSituationIndex = renderedText.indexOf('図解2｜状況レベル4コマ', firstSectionIndex);
    const firstPerspectiveIndex = renderedText.indexOf('視点転換のポイント', firstSectionIndex);
    expect(firstSectionIndex).toBeGreaterThanOrEqual(0);
    expect(firstPerspectiveIndex).toBeGreaterThan(firstSectionIndex);
    expect(firstSituationIndex).toBeGreaterThan(firstPerspectiveIndex);
    expect(firstConcreteIndex).toBeGreaterThan(firstSituationIndex);
    expect(screen.queryByText('Page experience')).not.toBeInTheDocument();
    expect(screen.queryByText(/旧21視点を固定継承せず/)).not.toBeInTheDocument();
    expect(screen.queryByText('視点 10')).not.toBeInTheDocument();
    expect(screen.queryByText('10視点 / 37確認項目')).not.toBeInTheDocument();
    expect(screen.queryByText('このページで扱う中核発見')).not.toBeInTheDocument();
    expect(screen.queryByText(/Axiom coreの発見候補/)).not.toBeInTheDocument();
    expect(screen.queryByText(/source\/support validityとpublic approval/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/発見候補と公開メッセージ/).length).toBeGreaterThan(0);
  });

  it('renders the restored scene-entry page as an 8-issue comic use-case showcase', () => {
    render(<AxiomNextNblPublicCandidatePage slug="scene-entry" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /古くて新しい\s*課題を、\s*仕事条件の地図へ/,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('8つの課題の地図').length).toBeGreaterThan(0);
    expect(screen.queryByText('場面から入る')).not.toBeInTheDocument();
    expect(screen.queryByText('課題ショーケース')).not.toBeInTheDocument();
    expect(screen.getAllByText('8つの課題の地図').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /8つの古くて新しい課題を、\s*仕事条件の地図へ/,
      }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll('[data-scene-showcase-selector]')).toHaveLength(8);
    expect(screen.getAllByText('見える数字と、見えにくい参加').length).toBeGreaterThan(0);
    expect(screen.getAllByText('名前で止まる').length).toBeGreaterThan(0);
    expect(screen.getAllByText('健康時間').length).toBeGreaterThan(0);
    expect(screen.getAllByText('情報の分断').length).toBeGreaterThan(0);
    expect(screen.getAllByText('制度から現場へ').length).toBeGreaterThan(0);
    expect(screen.getAllByText('上司依存').length).toBeGreaterThan(0);
    expect(screen.getAllByText('検索・SNS・AI要約の限界').length).toBeGreaterThan(0);
    expect(screen.getAllByText('学びが育たない').length).toBeGreaterThan(0);
    expect(
      screen.getByAltText(
        '見える数字、名前、健康時間、情報分断、制度、上司依存、検索SNSAI、学びの循環という8つの古くて新しい課題を仕事条件の地図へつなぐ図',
      ),
    ).toHaveAttribute('src', '/images/axiom-scene-comics/axiom-scene-old-new-issue-map-v2.png');
    expect(
      screen.getAllByAltText(
        '雇用率の数字から役割、評価、成長、健康時間、相談線を含む参加の質へ読み替える4コマ',
      )[0],
    ).toHaveAttribute(
      'src',
      '/images/axiom-scene-comics/axiom-scene-old-new-visible-participation-v1.png',
    );
    expect(
      screen.getAllByAltText(
        '相談、研修、会議、政策で生まれた誤読、沈黙、質問を記事、図解、仕事設計、相談事例、研修ワークへ循環させる4コマ',
      )[0],
    ).toHaveAttribute('src', '/images/axiom-scene-comics/axiom-scene-old-new-learning-loop-v1.png');
    expect(
      screen.getByAltText('合理的配慮や制度語を作業、手順、情報、環境、支援、評価へ翻訳する4コマ'),
    ).toBeInTheDocument();
    expect(screen.queryByText('4コマの流れ')).not.toBeInTheDocument();
    expect(screen.queryByText('1コマ目')).not.toBeInTheDocument();
    expect(screen.getByText('雇用率は上がった。')).toBeInTheDocument();
    expect(screen.getByText('社会の学びとして育てる。')).toBeInTheDocument();
    expect(screen.getAllByText('仕事条件の読み').length).toBeGreaterThanOrEqual(8);
    expect(screen.getAllByText('次に変える条件').length).toBeGreaterThanOrEqual(8);
    [
      'axiom-scene-old-new-issue-map-v2.png',
      'axiom-scene-old-new-visible-participation-v1.png',
      'axiom-scene-old-new-name-stops-v1.png',
      'axiom-scene-old-new-health-time-v1.png',
      'axiom-scene-old-new-information-fragmentation-v1.png',
      'axiom-scene-old-new-policy-to-practice-v1.png',
      'axiom-scene-old-new-manager-dependence-v1.png',
      'axiom-scene-old-new-search-ai-limits-v1.png',
      'axiom-scene-old-new-learning-loop-v1.png',
    ].forEach((fileName) => {
      expect(
        existsSync(path.join(process.cwd(), 'public/images/axiom-scene-comics', fileName)),
      ).toBe(true);
    });
    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: '見えている困りごと',
      }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/6つの場面/)).not.toBeInTheDocument();
    expect(screen.queryByText('現場で起きやすいこと')).not.toBeInTheDocument();
    expect(screen.queryByText('このページで見ること')).not.toBeInTheDocument();
    expect(screen.queryByText('ここでは扱わないこと')).not.toBeInTheDocument();
    expect(screen.queryByText(/Axiomが入口として/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Falconの場面ページ/)).not.toBeInTheDocument();
    expect(screen.queryByText('このページで扱う中核発見')).not.toBeInTheDocument();
    expect(screen.queryByText('SNS循環')).not.toBeInTheDocument();
    expect(screen.getByText('このページから、次に進む。')).toBeInTheDocument();
    expect(screen.getByText('自分の相談に近づけて読む')).toBeInTheDocument();
    expect(screen.getByText('仕事・参加設計へ広げる')).toBeInTheDocument();
    expect(screen.getByText('会議や研修で共有する')).toBeInTheDocument();
    expect(screen.queryByText(/missing context/)).not.toBeInTheDocument();
  });

  it('preserves Falcon consultation FAQ coverage and next-route behavior with Axiom content', () => {
    render(<AxiomNextNblPublicCandidatePage slug="case-readings" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '相談の一言を、 仕事条件の 対話へ',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('専門的アセスメントは、個人の問題探しではなく', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '相談の一言を受け止め、条件を一緒に確認し、仕事・環境・支援・時間・評価を見ながら支援計画を組み直す対話型アセスメントの循環図',
      ),
    ).toHaveAttribute('src', '/images/next-nbl-consultation-assessment-loop-hero-v1.png');
    expect(
      existsSync(
        path.join(process.cwd(), 'public/images/next-nbl-consultation-assessment-loop-hero-v1.png'),
      ),
    ).toBe(true);
    expect(screen.queryByText('健康時間の相談')).not.toBeInTheDocument();
    expect(screen.queryByText('開示と情報共有')).not.toBeInTheDocument();
    expect(screen.queryByText('手順理解と変更')).not.toBeInTheDocument();
    expect(screen.getByText('一言を受け止めて、仕事条件の対話へ進む')).toBeInTheDocument();
    expect(
      screen.getByText('アセスメントは個人の問題を探す作業ではなく', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '企業担当者・上司' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '支援者' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '行政・研修・政策' })).toBeInTheDocument();
    expect(screen.getByText('この相談なら、まずこう分ける')).toBeInTheDocument();
    expect(screen.getByText('体調変動と締切が同じ週に重なる')).toBeInTheDocument();
    expect(screen.getAllByText('健康時間・仕事密度').length).toBeGreaterThan(0);
    expect(screen.getAllByText('情報形式・参加').length).toBeGreaterThan(0);
    expect(screen.getAllByText('職場内外の移動・道具').length).toBeGreaterThan(0);
    expect(screen.getAllByText('研修・制度・地域連携').length).toBeGreaterThan(0);
    expect(screen.getAllByText('就職前・復職・移行').length).toBeGreaterThan(0);
    expect(screen.getByText('3. 具体チェック')).toBeInTheDocument();
    expect(screen.queryByText('健康時間・仕事密度の具体チェック')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', {
        name: '疲れやすいので、どのくらい休めばよいですか。',
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('選択した具体チェック')).toBeInTheDocument();
    expect(
      screen.getAllByText('疲れ、通院、回復時間、締切、仕事量、翌日の影響が同じ週に重なる相談。')
        .length,
    ).toBeGreaterThan(1);
    expect(screen.getByText('アセスメントの流れ')).toBeInTheDocument();
    expect(screen.getByText('一言を残す')).toBeInTheDocument();
    expect(screen.getByText('条件に分ける')).toBeInTheDocument();
    expect(screen.getByText('当初見立て')).toBeInTheDocument();
    expect(screen.getByText('一緒に確認')).toBeInTheDocument();
    expect(screen.getByText('計画が変わる')).toBeInTheDocument();
    expect(screen.getByText('1領域を選択')).toBeInTheDocument();
    expect(screen.getByText('近い事例:', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('専門家としての当初の見立て')).toBeInTheDocument();
    expect(screen.queryByText('選択したチェックから見える論点')).not.toBeInTheDocument();
    expect(screen.queryByText('健康時間・仕事密度から見える論点')).not.toBeInTheDocument();
    expect(
      screen.getAllByText('通院、回復時間、仕事量、締切、評価時期を同じ時間軸で見る。').length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('まず外したい決めつけ')).toBeInTheDocument();
    expect(screen.getByText('別の可能性も残す')).toBeInTheDocument();
    expect(
      screen.getByText('見立ての精度を上げるために、一緒に確認したいこと'),
    ).toBeInTheDocument();
    expect(screen.getByText('確認 1')).toBeInTheDocument();
    expect(screen.getAllByText(/^確認 \d+$/).length).toBeGreaterThan(2);
    expect(screen.getAllByText('見えてきたら').length).toBeGreaterThan(0);
    expect(screen.getAllByText('支援計画例').length).toBeGreaterThan(0);
    expect(screen.getByText('通院前後に重い作業が重なっているか。')).toBeInTheDocument();
    expect(
      screen.getByText('疲労や症状が強くなる曜日・時間帯と、作業密度の山が重なっていないか。'),
    ).toBeInTheDocument();
    expect(screen.getByText('通院翌日に負荷が集中しているなら')).toBeInTheDocument();
    expect(
      screen.queryByText('支援計画はここで確定しません。', { exact: false }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('次の小さな一手')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /情報形式・参加/ }));
    expect(screen.queryByText('健康時間・仕事密度の具体チェック')).not.toBeInTheDocument();
    expect(screen.queryByText('情報形式・参加の具体チェック')).not.toBeInTheDocument();
    expect(screen.queryByText('情報形式・参加から見える論点')).not.toBeInTheDocument();
    expect(
      screen.getAllByText('会議、資料、音声、文字、図、警告、連絡方法が参加条件になっている相談。')
        .length,
    ).toBeGreaterThan(1);
    expect(
      screen.getAllByText('音声、文字、図、画面、記録、発言順、確認経路を参加条件として見る。')
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('2領域を選択')).toBeInTheDocument();
    expect(screen.getAllByText(/^確認 \d+$/).length).toBeGreaterThan(5);

    fireEvent.click(screen.getByRole('button', { name: '企業担当者・上司' }));
    expect(screen.getAllByText('どこまで聞いてよいのか分からない。').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('どこまで聞いてよいか分からず、調整が止まる').length,
    ).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: '行政・研修・政策' }));
    expect(
      screen.getAllByText('研修で、診断名別配慮表ではない見方をどう伝えるか。').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('診断名別の研修では、現場の判断が変わらない').length,
    ).toBeGreaterThan(0);

    expect(screen.queryByText('4. 近い事例から直接選ぶ')).not.toBeInTheDocument();
    expect(screen.queryByText('相談FAQカタログ')).not.toBeInTheDocument();
    expect(screen.queryByText('近い事例をさらに読む')).not.toBeInTheDocument();
    expect(screen.getByText('一言から始める')).toBeInTheDocument();
    expect(screen.queryByText('近い相談がないとき')).not.toBeInTheDocument();
    expect(screen.queryByText('見立てプロセス')).not.toBeInTheDocument();
    expect(screen.queryByText('次に読む')).not.toBeInTheDocument();
    expect(screen.getByText('このページから、次に進む。')).toBeInTheDocument();
    expect(screen.getByText('見立てを設計原則へつなぐ')).toBeInTheDocument();
    expect(screen.getByText('障害種類からも確認する')).toBeInTheDocument();
    expect(screen.getByText('相談を共有しやすくする')).toBeInTheDocument();
  });

  it('preserves Falcon article, toolkit, and condition-window functions as public-readable pages', () => {
    const article = render(<AxiomNextNblPublicCandidatePage slug="articles-social-questions" />);

    expect(screen.getAllByText('NBLレポート').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'NBLレポート' }).length).toBeGreaterThan(0);
    expect(screen.queryByText('記事集')).not.toBeInTheDocument();
    expect(
      screen.getByAltText(
        'NBLレポート。本人の違和感、企業の迷い、支援者の翻訳負荷、政策議論、ニュースSNSを、仕事条件の問いへ戻し、読む、話す、相談へ戻す、設計へつなぐ流れを示す図解。',
      ),
    ).toBeInTheDocument();
    expect(article.container.textContent).toContain('仕事条件の問いとして');
    expect(article.container.textContent).not.toContain('主張や炎上ではなく');
    expect(article.container.textContent).not.toContain('解ける問いに戻す');
    expect(screen.getByText('社会の問いから、読みたい論考を探す。')).toBeInTheDocument();
    expect(screen.getByText('本格テーマ')).toBeInTheDocument();
    expect(screen.getByText('仕事条件と立場')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: '記事検索' })).toBeInTheDocument();
    expect(screen.getByText('NBLレポートの編集地図')).toBeInTheDocument();
    expect(screen.getByText('問いから探す')).toBeInTheDocument();
    expect(screen.getByText('テーマで広げる')).toBeInTheDocument();
    expect(screen.getByText('図解と本文を対応させる')).toBeInTheDocument();
    expect(article.container.querySelector('[data-article-editorial-map]')).not.toBeNull();
    expect(article.container.querySelectorAll('[data-full-article-selector]')).toHaveLength(36);
    expect(article.container.querySelector('[data-full-article-reader]')).not.toBeNull();
    expect(article.container.querySelector('[data-article-visual-correspondence]')).not.toBeNull();
    expect(screen.getByText('この図解で先に見ること')).toBeInTheDocument();
    const articleVisual = article.container.querySelector('[data-article-visual]');
    expect(articleVisual).not.toBeNull();
    expect(article.container.querySelector('[data-article-visual] a')).toBeNull();
    const articleVisualImage = article.container.querySelector(
      '[data-article-visual] img',
    ) as HTMLImageElement | null;
    expect(articleVisualImage?.getAttribute('src')).toContain(
      '/images/axiom-article-image2-infographics/health-time-work-condition-v1.png',
    );
    expect(articleVisualImage?.getAttribute('src')).not.toContain(
      '/images/axiom-article-infographics/',
    );
    expect(articleVisualImage?.getAttribute('alt')).toContain('仕事条件の見方へ読み替える流れ');
    article.container.querySelectorAll('[data-full-article-selector]').forEach((selector) => {
      fireEvent.click(selector);
      const selectedImage = article.container.querySelector(
        '[data-article-visual] img',
      ) as HTMLImageElement | null;
      const selectedSrc = selectedImage?.getAttribute('src') ?? '';
      expect(selectedSrc).toContain('/images/axiom-article-image2-infographics/');
      expect(selectedSrc).toContain('-v1.png');
      expect(selectedSrc).not.toContain('/images/axiom-article-infographics/');
      expect(existsSync(path.join(process.cwd(), 'public', selectedSrc))).toBe(true);
    });
    fireEvent.click(article.container.querySelector('[data-full-article-selector]') as Element);
    fireEvent.click(
      screen.getByRole('button', {
        name: /健康時間.*図解をページ上で拡大表示/,
      }),
    );
    expect(
      screen.getByRole('dialog', {
        name: /健康時間.*拡大図解/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('図解を拡大表示')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '拡大図解を閉じる' }));
    expect(
      screen.queryByRole('dialog', {
        name: /健康時間.*拡大図解/,
      }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText('記事 1').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('採用後の空白を埋める。参加は、雇った後に設計する。').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('「疲れやすい」で止めない。健康時間を、仕事の設計条件にする。').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('通勤で消耗する人の仕事設計。').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('視覚・聴覚の情報保障を、特別扱いではなく仕事の仕様にする。').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('診断名別研修では、現場の判断は変わりにくい。').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('観察から仕事をつくる。ジョブ分析と職務創出を読み直す。').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('雇用率の先へ。人数管理から、参加の質を設計する。').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('見えない病気は、理解だけでは仕事条件に戻らない。').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('治療と仕事を、同じ一週間として読む。').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('メンタルヘルスを、セルフケアだけに閉じない。').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('支援はある。翻訳が続くかを見る。').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('政策・研究・AI時代の資料を、仕事条件の問いへ戻す。').length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText('一撃の図解')).not.toBeInTheDocument();
    expect(screen.queryByText('見出しだけで読む')).not.toBeInTheDocument();
    expect(screen.queryByText('視点転換')).not.toBeInTheDocument();
    expect(screen.queryByText('次に読む・使う')).not.toBeInTheDocument();
    expect(screen.getAllByText('よくある読み').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('この記事で見ること').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('現場へ戻す').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('会議・相談で使う問い').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('この記事から深める').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('近い相談で読む').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('設計ガイドで見る').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('ツールにする').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText('「疲れやすい」は入口であって、結論ではない').length,
    ).toBeGreaterThan(0);
    expect(article.container.querySelector('a[href$="#consultation-finder"]')).not.toBeNull();
    expect(
      article.container.querySelector('a[href$="#work-design-domain-health-time-livelihood"]'),
    ).not.toBeNull();
    expect(article.container.querySelector('a[href$="#toolkit-studio-modules"]')).not.toBeNull();
    fireEvent.click(
      screen.getByRole('button', {
        name: '本格記事 「疲れやすい」で止めない。健康時間を、仕事の設計条件にする。 を読む',
      }),
    );
    expect(
      screen.getAllByText('「疲れやすい」は入口であって、結論ではない').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText('一週間の時間地図: 通院、締切、回復、移動、評価予定を一枚に置く。'),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', {
        name: '本格記事 メンタルヘルスを、セルフケアだけに閉じない。 を読む',
      }),
    );
    expect(
      screen.getByText('「相談してください」は、相談できる条件があって初めて機能する'),
    ).toBeInTheDocument();
    expect(screen.getByText('セルフケアと職場設計は対立しない')).toBeInTheDocument();
    expect(
      screen.getByText(
        'メンタルヘルス対策が、本人のセルフケアや相談してくださいという呼びかけで止まっている。',
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', {
        name: '本格記事 観察から仕事をつくる。ジョブ分析と職務創出を読み直す。 を読む',
      }),
    );
    expect(screen.getByText('求人票の前に、職場の実際の流れを見る')).toBeInTheDocument();
    expect(screen.getByText('AI要約と仕事条件の地図。')).toBeInTheDocument();
    expect(screen.queryByText('短い問いの蓄積から、記事を育てる。')).not.toBeInTheDocument();
    expect(screen.queryByText('記事目次')).not.toBeInTheDocument();
    expect(screen.queryByText('記事一覧')).not.toBeInTheDocument();
    expect(article.container.querySelectorAll('[data-article-catalog-row]')).toHaveLength(0);
    expect(screen.getAllByText('治療と仕事を、同じ一週間として読む。').length).toBeGreaterThan(0);
    expect(screen.getAllByText('会議にいるのに、同じ情報に参加できない。').length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getAllByText('どこまで話すかではなく、何を変えるために話すか。').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('多職種連携は、同じ場面を見るところから始まる。').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('雇用率の先へ。人数管理から、参加の質を設計する。').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText('メンタルヘルスを、セルフケアだけに閉じない。').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('ラベルと言葉の向こうの就労経験を読む。').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('支援ツールボックスを、手法名ではなく条件変更ポートで統合する。').length,
    ).toBeGreaterThan(0);
    const articleSearch = screen.getByRole('searchbox', { name: '記事検索' });
    fireEvent.change(articleSearch, { target: { value: 'メンタルヘルス' } });
    expect(
      screen.getAllByText('メンタルヘルスを、セルフケアだけに閉じない。').length,
    ).toBeGreaterThan(0);
    expect(article.container.querySelectorAll('[data-full-article-selector]').length).toBeLessThan(
      36,
    );
    fireEvent.click(screen.getByRole('button', { name: '絞り込みを戻す' }));
    expect(article.container.querySelectorAll('[data-full-article-selector]')).toHaveLength(36);
    fireEvent.click(screen.getByRole('button', { name: '本格テーマ 雇用の質 で絞り込む' }));
    expect(article.container.querySelectorAll('[data-full-article-selector]')).toHaveLength(3);
    expect(screen.getAllByText('持続可能な雇用成果とは何か。').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: '絞り込みを戻す' }));
    fireEvent.click(screen.getByRole('button', { name: '仕事条件 開示・評価 で絞り込む' }));
    expect(
      article.container.querySelectorAll('[data-full-article-selector]').length,
    ).toBeGreaterThan(4);
    expect(screen.getAllByText('評価に響く不安を、情報共有と切り分ける。').length).toBeGreaterThan(
      0,
    );
    fireEvent.click(screen.getByRole('button', { name: '絞り込みを戻す' }));
    fireEvent.click(screen.getByRole('button', { name: '行政・政策' }));
    expect(
      article.container.querySelectorAll('[data-full-article-selector]').length,
    ).toBeGreaterThan(4);
    expect(screen.queryByText('Page experience')).not.toBeInTheDocument();
    expect(screen.queryByText('Page content')).not.toBeInTheDocument();
    expect(screen.queryByText('情報提供者')).not.toBeInTheDocument();
    expect(article.container.textContent).not.toContain('source lens');
    expect(article.container.textContent).not.toContain('cannot-yet-say');
    expect(screen.getByText('論点を相談に戻す')).toBeInTheDocument();
    expect(screen.getByText('仕事・参加設計に戻す')).toBeInTheDocument();
    expect(screen.getByText('共有素材に変える')).toBeInTheDocument();
    article.unmount();

    const toolkit = render(<AxiomNextNblPublicCandidatePage slug="toolkit-studio" />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '言葉だけでは 届きにくいことを、 別の形へ',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('言葉以外の入口').length).toBeGreaterThan(0);
    expect(screen.getAllByText('図解、課題地図、', { exact: false }).length).toBeGreaterThan(0);
    expect(
      screen.getByAltText(
        'ツールキット。言葉だけでは届きにくいことを、選別図解、課題地図、4コマ・マンガ、音楽、フォーラム、ウェブアプリという別の形で手渡す素材棚の図解。',
      ),
    ).toHaveAttribute('src', '/images/next-nbl-toolkit-hero-image2-v1.png');
    expect(screen.getByRole('link', { name: /図解棚を見る/ })).toHaveAttribute(
      'href',
      '#toolkit-selected-infographic-library',
    );
    expect(
      screen.getAllByRole('link', { name: /課題地図を見る/ }).some((link) => {
        return (
          link.getAttribute('href') === '/internal/axiom-next-nbl-public-candidate/scene-entry'
        );
      }),
    ).toBe(true);
    expect(screen.getByRole('link', { name: /ウェブアプリ一覧へ/ })).toHaveAttribute(
      'href',
      '#toolkit-web-app-library',
    );
    expect(screen.getByText('見る、読む、聞く、話す素材を選ぶ。')).toBeInTheDocument();
    expect(screen.queryByText('選別図解・4コマ')).not.toBeInTheDocument();
    expect(screen.queryByText('57枚')).not.toBeInTheDocument();
    expect(screen.queryByText('30曲')).not.toBeInTheDocument();
    expect(screen.queryByText('22本')).not.toBeInTheDocument();
    expect(toolkit.container.querySelectorAll('[data-toolkit-shelf-card]')).toHaveLength(6);
    expect(toolkit.container.querySelector('#toolkit-shelf-issue-map')).not.toBeNull();
    expect(toolkit.container.querySelector('#toolkit-shelf-virtual-news')).toBeNull();
    expect(toolkit.container.querySelector('#toolkit-issue-map-library')).toBeNull();
    expect(screen.getAllByText('8つの課題の地図').length).toBeGreaterThan(0);
    expect(screen.queryByText('8つの課題を、会議で使える地図へ。')).not.toBeInTheDocument();
    expect(toolkit.container.querySelectorAll('[data-toolkit-issue-map-card]')).toHaveLength(0);
    expect(toolkit.container.querySelector('#toolkit-virtual-news-library')).toBeNull();
    expect(screen.queryByText('Virtual news bridge')).not.toBeInTheDocument();
    expect(screen.queryByText('バーチャルニュースは、上位ハブで読む。')).not.toBeInTheDocument();
    expect(toolkit.container.querySelectorAll('[data-toolkit-virtual-news-card]')).toHaveLength(0);
    expect(
      screen.queryByText(
        '障害のある社員への配慮、上司任せにしない。架空企業A社、専門窓口と共通予算で全社対応へ',
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryAllByText('記事を読む')).toHaveLength(0);
    expect(screen.getByText('使う場面から、素材を組み合わせる。')).toBeInTheDocument();
    expect(toolkit.container.querySelectorAll('[data-toolkit-use-package-card]')).toHaveLength(4);
    expect(screen.queryByText('使い方は、時間と場面から選ぶ。')).not.toBeInTheDocument();
    const toolkitText = toolkit.container.textContent ?? '';
    expect(toolkitText.indexOf('選別済みの図解を、内容で探す。')).toBeGreaterThan(-1);
    expect(toolkitText.indexOf('記録と確認を、相談や会議に持ち込める形へ。')).toBeGreaterThan(-1);
    expect(toolkitText.indexOf('使う場面から、素材を組み合わせる。')).toBeGreaterThan(-1);
    expect(toolkitText.indexOf('選別済みの図解を、内容で探す。')).toBeLessThan(
      toolkitText.indexOf('記録と確認を、相談や会議に持ち込める形へ。'),
    );
    expect(toolkitText.indexOf('記録と確認を、相談や会議に持ち込める形へ。')).toBeLessThan(
      toolkitText.indexOf('使う場面から、素材を組み合わせる。'),
    );
    expect(screen.getByText('初回相談・初回会議で、同じ地図を見る')).toBeInTheDocument();
    expect(screen.getByText('管理職・人事研修で、個人問題化を止める')).toBeInTheDocument();
    expect(screen.getByText('難病・慢性疾患の健康時間を話す')).toBeInTheDocument();
    expect(screen.getByText('研修・フォーラム後に、実装へ残す')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /仕事のコンディションマップ/ })).toHaveAttribute(
      'href',
      '#toolkit-infographic-work-condition-map',
    );
    expect(screen.getByRole('link', { name: /相談事例集/ })).toHaveAttribute(
      'href',
      '/internal/axiom-next-nbl-public-candidate/case-readings#consultation-finder',
    );
    expect(screen.getByRole('link', { name: /5つの設計領域/ })).toHaveAttribute(
      'href',
      '/internal/axiom-next-nbl-public-candidate/work-design-views-guide#work-design-domain-health-time-livelihood',
    );
    expect(
      screen.getAllByRole('link', { name: /音楽集/ }).some((link) => {
        return link.getAttribute('href') === '/resources/songs';
      }),
    ).toBe(true);
    expect(screen.getByRole('link', { name: /ワークコンディション・フォーラム/ })).toHaveAttribute(
      'href',
      '/events/work-condition-forum',
    );
    expect(screen.getByText('選別済みの図解を、内容で探す。')).toBeInTheDocument();
    expect(toolkit.container.querySelectorAll('[data-toolkit-infographic-group]')).toHaveLength(8);
    expect(toolkit.container.querySelectorAll('[data-toolkit-infographic-card]')).toHaveLength(59);
    expect(
      screen.getByText(
        'ICFと就労支援プロセスで見方の土台をそろえてから、全体地図、偏見の読み替え、制度、支援接続、難病、疾患別場面を内容から選ぶ棚です。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('就労支援の専門知識リストを、現場で使う形に読み替える'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'ICFと就労支援のプロセスを最初に置き、専門知識を本人・仕事・環境・支援・時間の関係として読み直す棚です。',
      ),
    ).toBeInTheDocument();
    const expertiseShelf = toolkit.container.querySelector(
      '#toolkit-infographic-employment-support-expertise',
    );
    const expertiseCardTitles = Array.from(
      expertiseShelf?.querySelectorAll('[data-toolkit-infographic-card]') ?? [],
    ).map((card) => card.textContent ?? '');
    expect(expertiseCardTitles[0]).toContain('ICFで生活機能を読む');
    expect(expertiseCardTitles[1]).toContain('就労支援のプロセス');
    expect(expertiseCardTitles[2]).toContain('障害者就労支援の5つの核');
    expect(screen.getByText('仕事条件を一枚で見る')).toBeInTheDocument();
    expect(screen.getByText('能力主義とエイブリズムをほどく')).toBeInTheDocument();
    expect(screen.getByText('難病と健康時間を、仕事条件として読む')).toBeInTheDocument();
    expect(screen.getByText('IBDの生活接点を4コマで読む')).toBeInTheDocument();
    expect(screen.getByText('膠原病の変動と生活条件を4コマで読む')).toBeInTheDocument();
    expect(screen.getAllByText('選別図解').length).toBeGreaterThan(0);
    expect(screen.getAllByText('4コマ・マンガ').length).toBeGreaterThan(0);
    expect(screen.getAllByText('音楽').length).toBeGreaterThan(0);
    expect(screen.getAllByText('フォーラム').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ウェブアプリ').length).toBeGreaterThan(0);
    expect(toolkit.container.querySelector('#toolkit-shelf-web-apps')).not.toBeNull();
    expect(screen.getByRole('link', { name: /アプリ一覧を見る/ })).toHaveAttribute(
      'href',
      '#toolkit-web-app-library',
    );
    expect(toolkit.container.querySelector('#toolkit-web-app-library')).not.toBeNull();
    expect(
      toolkit.container.querySelector('#toolkit-shelf-web-apps [data-toolkit-web-app-card]'),
    ).toBeNull();
    expect(toolkit.container.querySelector('[data-toolkit-web-app-smartphone-use]')).not.toBeNull();
    expect(screen.getByText('記録と確認を、相談や会議に持ち込める形へ。')).toBeInTheDocument();
    expect(screen.getByText('ナミノートをスマホで使う前に')).toBeInTheDocument();
    expect(screen.getAllByText(/ホーム画面に追加/).length).toBeGreaterThan(1);
    expect(toolkit.container.querySelectorAll('[data-toolkit-web-app-card]')).toHaveLength(2);
    const webAppCards = Array.from(
      toolkit.container.querySelectorAll('[data-toolkit-web-app-card]'),
    ).map((card) => card.textContent ?? '');
    expect(webAppCards[0]).toContain('就労支援機関チェックリスト');
    expect(webAppCards[1]).toContain('ナミノート');
    expect(screen.queryByText('ナミノート支援者用ツール')).not.toBeInTheDocument();
    expect(
      screen.getByText('支援者との共同レビューは、無料アプリでは提供しません。'),
    ).toBeInTheDocument();
    expect(screen.getByText('事業化後の専門サービス設計', { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /チェックリストを開く/ })).toHaveAttribute(
      'href',
      '/organizations/diagnosis',
    );
    expect(screen.getByRole('link', { name: /ナミノートを開く/ })).toHaveAttribute(
      'href',
      'https://yharunaq.github.io/naminote/',
    );
    expect(screen.getByRole('link', { name: /ナミノートを開く/ })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(screen.getByText(/医療、就労、合理的配慮の判断や助言は行いません/)).toBeInTheDocument();
    expect(screen.getByText(/第三者の個人情報を書かず/)).toBeInTheDocument();
    expect(screen.queryByText('リンク準備中')).not.toBeInTheDocument();
    expect(screen.queryByText('公開準備中')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /公開準備中/ })).not.toBeInTheDocument();
    expect(screen.queryByText('短い問いを、次の図解や記事へ戻す')).not.toBeInTheDocument();
    expect(screen.queryByText('設計ボードで、確認項目を具体化する')).not.toBeInTheDocument();
    expect(
      screen.queryByText('文章だけでは届きにくいものを、選べる棚にする。'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('複雑な専門知識を、図解・ワーク・場面・道具に変える。'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /音楽集を開く/ })).toHaveAttribute(
      'href',
      '/resources/songs',
    );
    expect(screen.getByRole('link', { name: /フォーラムを見る/ })).toHaveAttribute(
      'href',
      '/events/work-condition-forum',
    );
    expect(
      toolkit.container.querySelector('audio[src="/songs/audio/hataraki-kata-update.mp3"]'),
    ).not.toBeNull();
    fireEvent.click(
      screen.getByRole('button', { name: '仕事のコンディションマップを拡大して読む' }),
    );
    expect(toolkit.container.querySelector('[data-toolkit-infographic-lightbox]')).not.toBeNull();
    expect(screen.getByText('図解を拡大表示')).toBeInTheDocument();
    expect(
      screen.getByText(
        '音楽、図解、課題地図、4コマ、ウェブアプリは、助言や判定の代わりではありません。',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Page content')).not.toBeInTheDocument();
    expect(screen.queryByText(/Axiomの見立て/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Axiomの統合知識|同じAxiom知識/)).not.toBeInTheDocument();
    expect(toolkit.container.textContent).not.toContain('learning update');
    expect(screen.getByText('素材を課題共有に使う')).toBeInTheDocument();
    expect(screen.getByText('素材を相談に戻す')).toBeInTheDocument();
    expect(screen.getByText('素材の背景を読む')).toBeInTheDocument();
    expect(existsSync(path.join(process.cwd(), 'public/favicon-512x512.png'))).toBe(true);
    expect(
      existsSync(
        path.join(
          process.cwd(),
          'public/images/nbl-virtual-news/cap-caf-accommodation-center-hero-v1.webp',
        ),
      ),
    ).toBe(true);
    expect(
      existsSync(
        path.join(process.cwd(), 'public/images/axiom-toolkit-selected-infographics/top-13.png'),
      ),
    ).toBe(true);
    expect(
      existsSync(
        path.join(process.cwd(), 'public/images/axiom-toolkit-selected-infographics/ibd-01.png'),
      ),
    ).toBe(true);
    expect(
      existsSync(
        path.join(
          process.cwd(),
          'public/images/axiom-toolkit-selected-infographics/collagen-01.png',
        ),
      ),
    ).toBe(true);
    expect(
      existsSync(
        path.join(
          process.cwd(),
          'public/images/axiom-toolkit-selected-infographics/employment-support-five-core-v1.png',
        ),
      ),
    ).toBe(true);
    expect(
      existsSync(
        path.join(
          process.cwd(),
          'public/images/axiom-toolkit-selected-infographics/employment-support-vocabulary-update-v1.png',
        ),
      ),
    ).toBe(true);
    expect(
      existsSync(path.join(process.cwd(), 'public/songs/audio/hataraki-kata-update.mp3')),
    ).toBe(true);
    toolkit.unmount();

    const conditionWindow = render(
      <AxiomNextNblPublicCandidatePage slug="work-condition-window" />,
    );
    expect(screen.getByText('誰もが活躍できる仕事・参加設計へ')).toBeInTheDocument();
    expect(screen.getByText('障害者雇用は、例外対応ではない。')).toBeInTheDocument();
    expect(
      screen.getByText(
        '視覚、聴覚、肢体、内部、知的、精神、発達、高次脳機能障害、難病。障害種類から見える課題は、誰もが活躍できる仕事／参加設計の応用問題です。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '障害者雇用は例外対応ではなく、視覚、聴覚、肢体、内部、知的、精神、発達、高次脳、難病の入口を、誰もが活躍できる仕事・参加設計へつなぐ図解。',
      ),
    ).toHaveAttribute('src', '/images/next-nbl-condition-window-hero-image2-v1.png');
    expect(screen.getAllByText('障害種類から見る').length).toBeGreaterThan(0);
    expect(screen.queryByText('知りたい障害種類から読む')).not.toBeInTheDocument();
    expect(screen.queryByText('近い入口を選んでください。')).not.toBeInTheDocument();
    expect(screen.queryByText('多様性に応える職場設計力')).not.toBeInTheDocument();
    expect(screen.queryByText('障害種類から、職場を設計する。')).not.toBeInTheDocument();
    expect(screen.queryByText('次の入口')).not.toBeInTheDocument();
    expect(screen.queryByText('条件窓マップ')).not.toBeInTheDocument();
    expect(screen.queryByText('条件窓')).not.toBeInTheDocument();
    expect(screen.queryByText('6つの仕事条件')).not.toBeInTheDocument();
    expect(
      screen.queryByText('障害名ではなく、仕事のどこを変えられるかを見る。'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('9つの入口を、仕事条件の問いへ変える。')).not.toBeInTheDocument();
    expect(
      screen.getByText('障害種類から見えた条件を、相談・設計・記事・素材へつなぐ。'),
    ).toBeInTheDocument();
    expect(screen.getByText('相談したい')).toBeInTheDocument();
    expect(screen.getByText('設計したい')).toBeInTheDocument();
    expect(screen.getByText('課題を共有したい')).toBeInTheDocument();
    const categoryTitles = Array.from(
      conditionWindow.container.querySelectorAll('[data-work-condition-category-title]'),
    ).map((element) => element.textContent);
    expect(categoryTitles).toEqual([
      '視覚障害',
      '聴覚・平衡機能障害',
      '肢体不自由',
      '内部障害',
      '知的障害',
      '精神障害',
      '発達障害',
      '高次脳機能障害',
      '難病',
    ]);
    expect(
      conditionWindow.container.querySelectorAll('[data-work-condition-entry-link]'),
    ).toHaveLength(9);
    expect(
      conditionWindow.container.querySelectorAll('[data-work-condition-category-card]'),
    ).toHaveLength(9);
    expect(
      conditionWindow.container.querySelectorAll('[data-work-condition-flow-card]'),
    ).toHaveLength(9);
    expect(screen.getAllByText('まず知っておきたいこと')).toHaveLength(9);
    expect(screen.getAllByText('職場設計で見ること')).toHaveLength(9);
    expect(screen.getByText('近い相談として読む')).toBeInTheDocument();
    expect(screen.getByText('職場設計へ広げる')).toBeInTheDocument();
    expect(screen.getByText('なぜこの読み方をするか')).toBeInTheDocument();
    expect(screen.queryByText('名前の入口')).not.toBeInTheDocument();
    expect(screen.queryByText('この入口のポイント')).not.toBeInTheDocument();
    expect(screen.queryByText('この入口で見る順番')).not.toBeInTheDocument();
    expect(
      screen.getByText('視覚障害には、見えない、見えにくい', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('視覚障害は、単に「見えない」だけではありません。', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('難病や慢性疾患では、体調が日によって変わる', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('休むか頑張るかの二択ではなく', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('この障害種類から使う関連プロダクト')).not.toBeInTheDocument();
    expect(screen.queryByText('障害名から必要な配慮がわかります')).not.toBeInTheDocument();
    conditionWindow.unmount();
  });

  it('renders the method and trust page as an Axiom-specific explanation of why the site is possible', () => {
    const method = render(<AxiomNextNblPublicCandidatePage slug="theory-method-trust" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /部分的な\s*情報を、\s*仕事と参加の\s*専門知識へ/,
      }),
    ).toBeInTheDocument();
    expect(method.container.textContent ?? '').toContain('AIの読む力を、');
    expect(method.container.textContent ?? '').toContain('関係を見抜く力として使う。');
    expect(
      screen.getByRole('group', { name: 'NBLの専門性を伝える約1分のデモ' }),
    ).toBeInTheDocument();
    expect(screen.getByText('人間は、現実の「影」しか見られない')).toBeInTheDocument();
    expect(screen.getByText('週3回の透析がある')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'デモを一時停止' })).toBeInTheDocument();
    expect(
      screen.getByText('人間の多様性は、単純な支援メニューでは扱えない。'),
    ).toBeInTheDocument();
    expect(screen.getByText('NBLが目指す専門知識', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('読み方の専門知識こそ、NBLの専門性の土台です。')).toBeInTheDocument();
    expect(screen.getByText('専門情報を読む基礎専門性')).toBeInTheDocument();
    expect(
      screen.getByText('ICF的な相互作用の見方と人権モデルの考え方', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('人の問題に閉じない')).toBeInTheDocument();
    expect(screen.getByText('制度名を答えにしない')).toBeInTheDocument();
    expect(screen.getByText('少数の信号を消さない')).toBeInTheDocument();
    expect(screen.getByText('AIを断定に使わない')).toBeInTheDocument();
    expect(screen.getByText('読み取ってまとめた仕事・社会参加の知識')).toBeInTheDocument();
    expect(
      screen.getByText('第一層では、AIの読解力を「断定」ではなく仮説づくりに使う。'),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        '調査データ、ワークショップ記録、実務資料、制度政策資料、国内外の公開情報を相互作用として読み、多様な専門知識ネットワークを作ってから場面、設計ガイド、相談事例、記事、図解ツールへ活用する流れを示す図解',
      ),
    ).toHaveAttribute('src', '/images/next-nbl-knowledge-network-method-v3.png');
    expect(
      screen.getByText('知識を作る材料と、知識を使う場面を混ぜないこと', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '調査データ、ワークショップ記録、実務資料、制度・政策資料、国内外の公開情報から専門知識ネットワークを作り',
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText('NBLの専門性').length).toBeGreaterThan(0);
    expect(screen.queryByText('なぜ可能か')).not.toBeInTheDocument();
    expect(screen.queryByText('理論・方法・信頼')).not.toBeInTheDocument();
    expect(method.container.textContent ?? '').toContain(
      '障害者・難病患者、雇用企業、支援者・支援機関に関する国内の調査研究',
    );
    expect(method.container.textContent ?? '').toContain('JANやEARNなど米国の技術支援情報');
    expect(method.container.textContent ?? '').toContain(
      '公式見解の代替や引用集として使うのではありません',
    );
    expect(screen.getByText('国内調査研究')).toBeInTheDocument();
    expect(screen.getByText('NIVR等の研究資料')).toBeInTheDocument();
    expect(screen.getByText('JEED事例・合理的配慮事例')).toBeInTheDocument();
    expect(screen.getByText('JAN・EARN等の海外技術支援情報')).toBeInTheDocument();
    expect(screen.queryByText('相談文、調査回答', { exact: false })).not.toBeInTheDocument();
    expect(
      screen.queryByText('相談、調査、制度、職場、国内外の資料', { exact: false }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('人、仕事、環境、支援、時間、制度の相互作用', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('第二層では、読み取った知識を相互作用のネットワークとして持つ。'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('直接チャットではなく、典型的な問いに先回りして届ける。'),
    ).toBeInTheDocument();
    expect(screen.getByText('SNSは社会との循環として扱う')).toBeInTheDocument();
    expect(screen.getByText('AIを使っても、責任の境界は消さない。')).toBeInTheDocument();
    const directChatBoundaryHeading = screen.getByText('動的チャットは当面、公開面にしない');
    expect(directChatBoundaryHeading.closest('article')).toHaveClass('text-slate-950');
    expect(
      screen.getByText(
        '利用者が直接AIに個別相談する形ではなく、典型的な問いに合わせて静的コンテンツを前もって作ります。個別判断をAIに任せないためです。',
      ),
    ).toHaveClass('text-slate-700');
    expect(method.container.textContent ?? '').not.toMatch(
      /Axiom|Stage 1|SCIMA|FCHMA|source\/support validity|runtime化|世界一/,
    );
    expect(screen.queryByText('AIが合理的配慮を判定します')).not.toBeInTheDocument();
    expect(screen.queryByText('障害名から必要な配慮がわかります')).not.toBeInTheDocument();
    expect(screen.queryByText('公開承認済み')).not.toBeInTheDocument();

    method.unmount();
  });

  it('keeps all 9 public-candidate slugs in the route map', () => {
    const routeMap = buildAxiomReviewedKernelBackedCandidateRouteMap();

    expect(routeMap.routes.map((route) => route.slug)).toEqual([
      'home',
      'scene-entry',
      'case-readings',
      'work-design-views-guide',
      'articles-social-questions',
      'toolkit-studio',
      'work-condition-window',
      'theory-method-trust',
      'about-boundary',
    ]);
  });

  it('returns no-store server-side slug props and keeps the route internal/noindex', async () => {
    const setHeader = jest.fn();
    const props = await getServerSideProps({
      params: { slug: 'toolkit-studio' },
      res: { setHeader },
    } as never);

    expect(props).toEqual({ props: { slug: 'toolkit-studio' } });
    expect(setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'private, no-store, no-cache, max-age=0, must-revalidate',
    );
    expect(setHeader).toHaveBeenCalledWith('Pragma', 'no-cache');
    expect(setHeader).toHaveBeenCalledWith('Expires', '0');
  });

  it('returns notFound for unknown public-candidate slugs', async () => {
    const props = await getServerSideProps({
      params: { slug: 'unknown' },
      res: { setHeader: jest.fn() },
    } as never);

    expect(props).toEqual({ notFound: true });
  });

  it('does not expose forms, approval controls, or publication controls', () => {
    const { container } = render(<AxiomNextNblPublicCandidatePage slug="about-boundary" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Next Being Labについて',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Next Being Lab（NBL）').length).toBeGreaterThan(0);
    expect(screen.getByText('創設者・運営責任者')).toBeInTheDocument();
    expect(screen.getByText('春名由一郎')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'プロフィール' })).toHaveAttribute(
      'href',
      'https://researchmap.jp/yharuna',
    );
    expect(screen.getAllByText('info@nextbeinglab.org').length).toBeGreaterThan(0);
    expect(screen.getByText('運営目的')).toBeInTheDocument();
    expect(screen.getByText('免責事項')).toBeInTheDocument();
    expect(screen.getByText('著作権・利用')).toBeInTheDocument();
    expect(screen.getByText('SNSでの紹介、リンク共有、感想の投稿は歓迎します')).toBeInTheDocument();
    expect(
      screen.getByText(
        '無断で自作として表示すること、出典を伏せた転載・複製・二次利用はできません',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('SNS発信')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'X: NBL｜仕事条件デザイン（@NBL_workdesign）' }),
    ).toHaveAttribute('href', 'https://x.com/NBL_workdesign');
    expect(screen.getByText('再利用ルールの考え方')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Creative Commons 表示-非営利 4.0 国際' }),
    ).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-nc/4.0/deed.ja');
    expect(screen.queryByText('このサイトの約束')).not.toBeInTheDocument();
    expect(
      screen.queryByText('公開面は、専門知識ネットワークを社会に渡す翻訳面である。'),
    ).not.toBeInTheDocument();
    const forms = Array.from(container.querySelectorAll('form'));
    expect(forms).toHaveLength(1);
    expect(forms[0]).toHaveAttribute('action', '/search');
    const searchInput = container.querySelector('input[name="q"]');
    expect(searchInput).toHaveAttribute('type', 'search');
    expect(searchInput).toHaveAttribute('aria-label', 'サイト内検索');
    expect(container.querySelector('textarea')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
    expect(screen.queryByRole('button', { name: '公開する' })).not.toBeInTheDocument();
    expect(screen.queryByText('公開承認')).not.toBeInTheDocument();
    expect(screen.queryByText('公開する')).not.toBeInTheDocument();
    expect(screen.queryByText('runtime_approved')).not.toBeInTheDocument();
    expect(screen.queryByText('public_approved')).not.toBeInTheDocument();
  });
});
