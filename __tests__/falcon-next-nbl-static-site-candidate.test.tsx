import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import FalconNextNblPreviewHomePage from '@/pages/preview/falcon-next-nbl';
import { getStaticPaths as getPreviewSlugStaticPaths } from '@/pages/preview/falcon-next-nbl/[slug]';
import {
  getNextNblPreviewHref,
  getNextNblPublicHref,
  nextNblStaticCandidateSummary,
  NextNblStaticSitePageCandidate,
} from '@/components/falconLab/NextNblStaticSiteCandidate';
import { nextSiteCandidatePages } from '@/lib/falconLab/nextNblFalconInterfaceFixtures';

describe('Falcon next NBL static site candidate', () => {
  const readTeachingKit = (fileName: string) =>
    readFileSync(path.join(process.cwd(), 'public/downloads/teaching-library', fileName), 'utf8');

  it('renders a concrete static preview site instead of a schedule artifact', () => {
    render(<FalconNextNblPreviewHomePage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '見えなかった関係を、仕事条件の地図へ。',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('障害者雇用や難病就労支援に長く残る難しさを、本人、仕事、環境、支援、時間、制度の相互作用として読み直します。診断名や配慮名で止めず、社会で使える相談事例、21視点、記事、場面、認知補助ツールへ変換する入口です。'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /課題の地図を見る/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /5つの入口を見る/ })).not.toBeInTheDocument();
    expect(screen.getByText('関係を読めると、支援の形が変わる。')).toBeInTheDocument();
    expect(screen.getAllByText('古くて新しい課題').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '支援が足りないだけではない。関係を読める地図が足りなかった。',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('雇用率や採用数は見えるが、役割・評価・成長は見えにくい')).toBeInTheDocument();
    expect(screen.getByText('通院・治療・回復・症状変動が勤務表や評価に翻訳されにくい')).toBeInTheDocument();
    expect(screen.getByText('検索や要約は入口になる一方、古い障害観や単純化を再生産しうる')).toBeInTheDocument();
    expect(screen.queryByText('入口を選ぶ')).not.toBeInTheDocument();
    expect(screen.queryByText('いま必要な読み方から入る。')).not.toBeInTheDocument();
    expect(screen.getByText('5つの入口')).toBeInTheDocument();
    expect(screen.getByText('同じ知識ネットワークを、使う形に分ける。')).toBeInTheDocument();
    expect(screen.getAllByText('障害種類から見る').length).toBeGreaterThan(0);
    expect(screen.getByText('障害種類から入って、仕事の見方を広げる。')).toBeInTheDocument();
    expect(screen.getByText(/よくある特性理解に、時間、情報、環境、評価、支援の見方を重ねる/)).toBeInTheDocument();
    expect(screen.getAllByText('読みを広げる入口').length).toBeGreaterThan(0);
    expect(screen.getAllByText('視覚障害').length).toBeGreaterThan(0);
    expect(screen.getAllByText('発達障害').length).toBeGreaterThan(0);
    expect(screen.getAllByText('難病').length).toBeGreaterThan(0);
    expect(screen.getByText('背景にある考え方')).toBeInTheDocument();
    expect(screen.getAllByText('なぜ可能か').length).toBeGreaterThan(0);
    expect(screen.getAllByText('このサイトについて').length).toBeGreaterThan(0);
    expect(screen.getByText('断片情報をそのまま答えにせず、ICF相互作用とAIの文脈読解で、本人・仕事・環境・支援・時間・制度の関係を見える地図へ変える方法です。')).toBeInTheDocument();
    expect(screen.getAllByText('場面から入る').length).toBeGreaterThan(0);
    expect(screen.getAllByText('相談事例集').length).toBeGreaterThan(0);
    expect(screen.getAllByText('21視点ガイド').length).toBeGreaterThan(0);
    expect(screen.getAllByText('記事集').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ツールキット').length).toBeGreaterThan(0);
    expect(screen.getByText('本人・企業・支援者が別々に見ている場面を、ひとつの仕事条件として見える化します。')).toBeInTheDocument();
    expect(screen.getByText('短い相談文を、正解配慮ではなく、読み筋、追加確認、次に話す問いへ変えます。')).toBeInTheDocument();
    expect(screen.getByText('蓄積された支援知見を、企業経営、雇用管理、専門支援、制度設計の視点として学べます。')).toBeInTheDocument();
    expect(screen.getByText('文章だけでは共有しにくい関係を、図解、場面、ワーク、研修素材にして扱えるようにします。')).toBeInTheDocument();
    expect(screen.getByText('記事集とも連動するイベント')).toBeInTheDocument();
    expect(screen.getByText('仕事条件デザイン・バーチャルフォーラム')).toBeInTheDocument();
    expect(screen.getByText('「働ける人を探す」から、「働ける条件を設計する」へ。')).toBeInTheDocument();
    expect(screen.getByText(/6セッション、22発表の仮想フォーラム/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /フォーラムを見る/ })).toHaveAttribute(
      'href',
      '/events/work-condition-forum#forum-top',
    );
    expect(screen.getByRole('link', { name: /^イベント一覧へ$/ })).toHaveAttribute(
      'href',
      '/events',
    );
    expect(screen.getByRole('link', { name: /^音楽フェスを見る$/ })).toHaveAttribute(
      'href',
      '/resources/songs',
    );
    expect(screen.queryByText('読む、学ぶ、使う。')).not.toBeInTheDocument();
    expect(screen.queryByText('図解、ワーク、音、読み下しを会議や研修で使う。')).not.toBeInTheDocument();
    expect(screen.queryByText(/Founder|完成スパイン|校正サンプル|内部プレビュー|公開承認前|SKP-01/)).not.toBeInTheDocument();
    expect(screen.queryByText('継続発展の仕組み')).not.toBeInTheDocument();
    expect(screen.queryByText('短い問いを、記事・図解・教材へ戻し続ける。')).not.toBeInTheDocument();
    expect(screen.getByText('SNSとコミュニケーション')).toBeInTheDocument();
    expect(screen.queryByText('短い発信から、読み、体験、対話へつなぐ。')).not.toBeInTheDocument();
    expect(screen.getByText('Xで短い問いを届け、サイトへ戻す。')).toBeInTheDocument();
    expect(screen.getByAltText('NBL｜仕事条件デザインのXアイコン')).toHaveAttribute(
      'src',
      '/images/nbl-workdesign-x-icon-v4-2026-06-07.webp',
    );
    expect(screen.getByText('NBL｜仕事条件デザイン')).toBeInTheDocument();
    expect(screen.getByText('@NBL_workdesign')).toBeInTheDocument();
    expect(screen.getByText('短い問い')).toBeInTheDocument();
    expect(screen.getByText('深く読む')).toBeInTheDocument();
    expect(screen.getByText('場で共有')).toBeInTheDocument();
    expect(screen.getByText('現場で使う')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /SNSを見る/ })).toHaveAttribute(
      'href',
      'https://x.com/NBL_workdesign',
    );
    expect(screen.queryByText('当面のX発信')).not.toBeInTheDocument();
    expect(screen.queryByText('仕事デザインの短い問いを、定期的に届けます。')).not.toBeInTheDocument();
    expect(screen.getByText(/一部は自動投稿で運用しますが/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Xで見る/ })).toHaveAttribute(
      'href',
      'https://x.com/NBL_workdesign',
    );
    expect(screen.queryByText(/DMやリプライで個別相談/)).not.toBeInTheDocument();
    expect(screen.getByText('ここで扱うのは、仕事の見方と教材です。')).toBeInTheDocument();
    expect(screen.queryByText('まず、近い立場から読む')).not.toBeInTheDocument();
    expect(screen.queryByText('近い入口から、同じ地図へ。')).not.toBeInTheDocument();
    expect(screen.queryByText('同じテーマで読む')).not.toBeInTheDocument();
    expect(screen.queryByText('相談事例集の奥にある方法')).not.toBeInTheDocument();
    expect(screen.queryByText('使いどころ')).not.toBeInTheDocument();
    expect(screen.queryByText('見られるもの')).not.toBeInTheDocument();
    expect(screen.queryByText(/Falcon/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Heron/)).not.toBeInTheDocument();
    expect(screen.queryByText(/SCIMA\/FCHMA/)).not.toBeInTheDocument();
    expect(screen.queryByText(/static-first/)).not.toBeInTheDocument();
  });

  it('exposes all nine next NBL candidate pages as preview routes without making condition windows a sixth product', () => {
    render(<FalconNextNblPreviewHomePage />);

    for (const label of [
      '全体入口',
      '場面から入る',
      '相談事例集',
      '21視点ガイド',
      '記事集',
      'ツールキット',
      '障害種類から見る',
      'なぜ可能か',
      'このサイトについて',
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }

    expect(nextNblStaticCandidateSummary.pageCount).toBe(9);
    expect(nextNblStaticCandidateSummary.routeHrefs).toContain('/preview/falcon-next-nbl');
    expect(nextNblStaticCandidateSummary.routeHrefs).toContain(
      '/preview/falcon-next-nbl/work-design-map',
    );
    expect(nextNblStaticCandidateSummary.routeHrefs).toContain(
      '/preview/falcon-next-nbl/work-condition-window',
    );
    expect(nextNblStaticCandidateSummary.routeHrefs).toContain(
      '/preview/falcon-next-nbl/work-assessment-concept',
    );
    expect(nextNblStaticCandidateSummary.routeHrefs).toContain(
      '/preview/falcon-next-nbl/about',
    );
    expect(nextNblStaticCandidateSummary.publicRouteHrefs).toContain('/');
    expect(nextNblStaticCandidateSummary.publicRouteHrefs).toContain('/work-design-map');
    expect(nextNblStaticCandidateSummary.publicRouteHrefs).toContain('/work-condition-window');
    expect(nextNblStaticCandidateSummary.publicRouteHrefs).toContain('/work-assessment-concept');
    expect(nextNblStaticCandidateSummary.publicRouteHrefs).toContain('/about');
    expect(getNextNblPreviewHref(nextSiteCandidatePages[5])).toBe(
      '/preview/falcon-next-nbl/partnership',
    );
    expect(getNextNblPublicHref(nextSiteCandidatePages[0])).toBe('/');
    expect(getNextNblPublicHref(nextSiteCandidatePages[5])).toBe('/partnership');

    for (const [id, heading] of [
      ['NS-02', '相談の一言から見立てを組み立てる'],
      ['NS-04', '場面から入る'],
      ['NS-03', '21視点で未来の仕事を設計する'],
      ['NS-05', '働き方の問いをひらく記事集'],
      ['NS-06', '認知補助ツールキット'],
      ['NS-07', '見えなかった関係を、仕事条件の知識ネットワークへ。'],
      ['NS-08', 'NBLについて'],
      ['NS-09', '障害種類・疾病名から、職場条件へ。'],
    ] as const) {
      const page = nextSiteCandidatePages.find((candidate) => candidate.id === id);
      expect(page).toBeDefined();
      const { unmount } = render(<NextNblStaticSitePageCandidate page={page!} />);
      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
      unmount();
    }
  });

  it('keeps the disability and disease name entry as a cross-product condition window, not a support lookup table', () => {
    const conditionWindowPage = nextSiteCandidatePages.find((page) => page.id === 'NS-09');
    expect(conditionWindowPage).toBeDefined();

    render(<NextNblStaticSitePageCandidate page={conditionWindowPage!} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '障害種類・疾病名から、職場条件へ。',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('障害種類・疾病名から、職場条件へ。').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByAltText('障害種類・疾病名から、時間、情報、環境、動線、評価、支援の職場条件へつなぎ、相談事例集、21視点、場面、記事、ツールキットへ進む図')).toBeInTheDocument();
    expect(screen.getByText('名前を入口にして、確認する条件へ進む。')).toBeInTheDocument();
    expect(screen.getByText('障害種類・疾病名から探せる')).toBeInTheDocument();
    expect(screen.getByText('特性理解を、仕事の条件へ')).toBeInTheDocument();
    expect(screen.getByText('職場で起きることとして見る')).toBeInTheDocument();
    expect(screen.getByText('相談、研修、一般の働き方にも使う')).toBeInTheDocument();
    expect(screen.getByText('10分類を、職場で確認できる条件へつなぐ。')).toBeInTheDocument();
    expect(screen.getByText(/時間、情報、環境、動線、評価、支援の条件を確認できるようにします/)).toBeInTheDocument();
    expect(screen.getAllByText('最初に見えやすい見方').length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText('起きやすい構造').length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText('変え方の方向').length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText('職場で起きやすい4つの場面').length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText('支援ネットワークで進める5つの確認').length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText('進め方').length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText('共有しておきたい3つの前提').length).toBeGreaterThanOrEqual(10);
    expect(screen.queryByText('この障害種類から使う関連プロダクト')).not.toBeInTheDocument();
    for (const label of [
      '視覚障害',
      '聴覚障害',
      '肢体不自由',
      '内部障害',
      '知的障害',
      '精神障害',
      '発達障害',
      '高次脳機能障害',
      '難病',
      'ニューロダイバーシティ',
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getByText('見え方・読み取り方法の多様性')).toBeInTheDocument();
    expect(screen.getByText(/資料・画面にアクセスできない/)).toBeInTheDocument();
    expect(screen.getByText('暗黙・即時・多重の仕事設計')).toBeInTheDocument();
    expect(screen.getByText(/相談の外部化/)).toBeInTheDocument();
    expect(screen.getByText('体調の変動性')).toBeInTheDocument();
    expect(screen.getByText('変動を扱える仕事設計')).toBeInTheDocument();
    expect(screen.getAllByText('病名だけで支援を決めない。').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('標準的な人材像')).toBeInTheDocument();
    expect(screen.getByText('選べる働き方')).toBeInTheDocument();
    expect(screen.getByText('強みと困りごとは同時に見る。')).toBeInTheDocument();
    expect(
      screen.queryByAltText('視覚障害の仕事設計：情報アクセスと動線設計の観点からのインフォグラフィック'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /場面から入る.*困りごとが起きる場面を、実在ケースではないモデル場面として本人、企業、支援者で共有します/s,
      }),
    ).toHaveAttribute('href', '/preview/falcon-next-nbl/work-design-studio');
    expect(
      screen.getByRole('link', {
        name: /相談事例集へ.*このページで見えた職場条件を、短い相談文の読み筋、追加確認、合意前の確認候補へ変えます/s,
      }),
    ).toHaveAttribute('href', '/preview/falcon-next-nbl/work-design-map');
    expect(screen.getByText('見えた論点に合わせて、次の入口を選ぶ。')).toBeInTheDocument();
    expect(screen.getByText('個別判断は、必要な確認へ分ける。')).toBeInTheDocument();
    expect(screen.getByText(/ここでは病名・障害名から支援策、就労可否、医学判断、法的判断、合理的配慮妥当性を直接決めません/)).toBeInTheDocument();
    expect(screen.getAllByText('相談事例集へ').length).toBeGreaterThan(0);
    expect(screen.getByText('21視点ガイドへ')).toBeInTheDocument();
    expect(screen.getByText('記事集へ')).toBeInTheDocument();
    expect(screen.getByText('ツールキットへ')).toBeInTheDocument();
    expect(screen.queryByText('条件窓は、第6プロダクトではありません。')).not.toBeInTheDocument();
    expect(screen.queryByText('障害別の支援策一覧')).not.toBeInTheDocument();
    expect(screen.queryByText('診断名別マニュアル')).not.toBeInTheDocument();
    expect(screen.queryByText('必要な配慮がわかります')).not.toBeInTheDocument();
    expect(screen.queryByText('現場で起きやすいこと')).not.toBeInTheDocument();
    expect(screen.queryByText('このページで見ること')).not.toBeInTheDocument();
    expect(screen.queryByText('ここでは扱わないこと')).not.toBeInTheDocument();
    expect(screen.queryByText('読みはじめ')).not.toBeInTheDocument();
    expect(screen.queryByText('障害種類から入っていい')).not.toBeInTheDocument();
    expect(screen.queryByText('面白くなったところから、次へ進む。')).not.toBeInTheDocument();
    expect(screen.queryByText('入口で起きる見落とし')).not.toBeInTheDocument();
    expect(screen.queryByText('困難の式')).not.toBeInTheDocument();
    expect(screen.queryByText('解決の式')).not.toBeInTheDocument();
    expect(screen.queryByText('現実に起きる4つの詰まり')).not.toBeInTheDocument();
    expect(screen.queryByText('支援ネットワークで行う5つの実装')).not.toBeInTheDocument();
    expect(screen.queryByText('支援ループ')).not.toBeInTheDocument();
    expect(screen.queryByText('共有すべき3つの合意')).not.toBeInTheDocument();
    expect(screen.queryByText('就労の詰まり')).not.toBeInTheDocument();
    expect(screen.queryByText(/Falcon|Heron|SCIMA\/FCHMA|public approval|runtime/)).not.toBeInTheDocument();
  });

  it('adds a reader-facing about surface without turning it into another product or internal memo', () => {
    const aboutPage = nextSiteCandidatePages.find((page) => page.id === 'NS-08');
    expect(aboutPage).toBeDefined();

    render(<NextNblStaticSitePageCandidate page={aboutPage!} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'NBLについて',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Next Being Lab').length).toBeGreaterThan(0);
    expect(screen.getAllByText('基本情報').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/このページでは、NBLの基本情報、創設者、連絡先、情報の扱い方、個別判断をしない境界を確認できます/),
    ).toBeInTheDocument();
    expect(screen.getByText('Next Being Lab（NBL）')).toBeInTheDocument();
    expect(screen.getByText(/インクルーシブ就労支援の実践知識を開発・提供する知識プラットフォームです/)).toBeInTheDocument();
    expect(screen.getByText('創設者')).toBeInTheDocument();
    expect(screen.getByText('春名由一郎')).toBeInTheDocument();
    expect(screen.getByText('Next Being Lab 創設者')).toBeInTheDocument();
    expect(screen.getByText(/前・独立行政法人高齢・障害・求職者雇用支援機構/)).toBeInTheDocument();
    expect(screen.getByText(/創設者個人への属人的な個別相談窓口ではなく/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /研究プロフィールを見る/ })).toHaveAttribute(
      'href',
      'https://researchmap.jp/yharuna',
    );
    expect(screen.getByText('公開情報を使う')).toBeInTheDocument();
    expect(
      screen.getByText(/調査研究報告、マニュアル、合理的配慮事例集、雇用事例集、海外の情報提供サイト、制度など/),
    ).toBeInTheDocument();
    expect(screen.getByText('連絡先')).toBeInTheDocument();
    expect(screen.getByText('連携・お問い合わせは、NBLの窓口へ。')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /お問い合わせフォーム/ })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: 'info@nextbeinglab.org' })).toHaveAttribute(
      'href',
      'mailto:info@nextbeinglab.org',
    );
    expect(screen.getByText('企業・支援機関との共同検討')).toBeInTheDocument();
    expect(screen.getByText('研修・教材・記事企画の相談')).toBeInTheDocument();
    expect(screen.getByText('研究、政策、社会発信に関する連携')).toBeInTheDocument();
    expect(screen.getByText('病名・障害名から支援策へ直行しません')).toBeInTheDocument();
    expect(screen.getByText('個別相談や緊急相談の受付ではありません')).toBeInTheDocument();
    expect(screen.getByText('医学・法務・雇用判断をしません')).toBeInTheDocument();
    expect(screen.getByText('AIを最終判断者にしません')).toBeInTheDocument();
    expect(screen.getByText(/個別の医学判断、法的判断、採用・配置判断、緊急相談を受け付ける窓口ではありません/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /全体入口へ/ })[0]).toHaveAttribute(
      'href',
      '/preview/falcon-next-nbl',
    );
    expect(screen.getByRole('link', { name: /理論と発見へ/ })).toHaveAttribute(
      'href',
      '/preview/falcon-next-nbl/work-assessment-concept',
    );
    expect(screen.getByRole('link', { name: /公開中のNBLについて/ })).toHaveAttribute('href', '/about');
    expect(screen.queryByText('このページは、使い方ではなく信頼の説明です。')).not.toBeInTheDocument();
    expect(screen.queryByText('Next Being Labが運営します')).not.toBeInTheDocument();
    expect(screen.queryByText('NBLとは')).not.toBeInTheDocument();
    expect(screen.queryByText('読める・学べる・使える形へ')).not.toBeInTheDocument();
    expect(screen.queryByText('5つの入口と、背景にある考え方')).not.toBeInTheDocument();
    expect(screen.queryByText('近い場面から入る。')).not.toBeInTheDocument();
    expect(screen.queryByText('社会の反応を、記事・図解・教材の改稿へ戻す。')).not.toBeInTheDocument();
    expect(screen.queryByText('実際のAI応答や自動判定には接続していません')).not.toBeInTheDocument();
    expect(screen.queryByText('同じテーマへ戻る')).not.toBeInTheDocument();
    expect(screen.queryByText('サイト全体の読み方')).not.toBeInTheDocument();
    expect(screen.queryByText(/Founder|完成スパイン|校正サンプル|内部プレビュー|公開承認前|SKP-01/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Falcon/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Heron/)).not.toBeInTheDocument();
    expect(screen.queryByText(/SCIMA\/FCHMA/)).not.toBeInTheDocument();
    expect(screen.queryByText(/runtime/)).not.toBeInTheDocument();
    expect(screen.queryByText(/source\/support validity/)).not.toBeInTheDocument();
    expect(screen.queryByText(/public approval/)).not.toBeInTheDocument();
  });

  it('frames the 21-view surface as both a guidebook and a reference toolkit', () => {
    const workDesignTools = nextSiteCandidatePages.find((page) => page.id === 'NS-03');
    expect(workDesignTools).toBeDefined();

    render(<NextNblStaticSitePageCandidate page={workDesignTools!} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '21視点で未来の仕事を設計する',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '障害者雇用や難病就労支援で蓄積されてきた知見を、人間の多様性を前提にした企業経営、雇用管理、専門支援、制度設計へ展開します。21視点は、未来の仕事を設計するための全体地図です。',
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText('未来地図を見る').length).toBeGreaterThan(0);
    expect(
      screen.getByAltText(
        '21視点で未来の仕事を設計するために、仕事条件と人間の多様性を中心に、健康時間と生活、入口・翻訳・支援、職場・参加・価値の3設計面と、企業経営、雇用管理、専門支援、制度設計の4実装領域へ展開する図解',
      ),
    ).toHaveAttribute('src', '/images/next-nbl-future-design-21-view-map-v2.png');
    expect(screen.getAllByText('未来設計マップ').length).toBeGreaterThan(0);
    expect(screen.getByText('仕事条件から、未来の取り組みへ。')).toBeInTheDocument();
    expect(screen.getByText('未来の仕事を、21の問いで設計する。')).toBeInTheDocument();
    expect(screen.getByText('全体像')).toBeInTheDocument();
    expect(screen.getByText('3つの設計面が、7つの問いずつに開く。')).toBeInTheDocument();
    expect(screen.getAllByText('21視点の全体像を見る').length).toBeGreaterThan(0);
    expect(screen.getByText('設計対象')).toBeInTheDocument();
    expect(screen.getByText('人間の多様性を前提に、仕事条件そのものを設計する。')).toBeInTheDocument();
    expect(screen.getByText('3面 x 7問いで、取り組みを具体化する。')).toBeInTheDocument();
    expect(screen.queryByText('21個を、最初から全部読まない。')).not.toBeInTheDocument();
    expect(screen.queryByText('ひと目の使い方')).not.toBeInTheDocument();
    expect(screen.queryByText('一文を、3つの入口へ置いてみる。')).not.toBeInTheDocument();
    expect(screen.queryByText('必要な視点だけ開く')).not.toBeInTheDocument();
    expect(screen.queryByText('使う先、見る面、手元の問いを分ける。')).not.toBeInTheDocument();
    expect(screen.queryByText('このページの読み方')).not.toBeInTheDocument();
    expect(screen.queryByText('使う先 / 4つの実装領域')).not.toBeInTheDocument();
    expect(screen.queryByText('見る面 / 3つの設計面')).not.toBeInTheDocument();
    expect(screen.queryByText('手元の問い / 21視点')).not.toBeInTheDocument();
    expect(screen.queryByText('補助目盛り / 状況レベル')).not.toBeInTheDocument();
    expect(screen.getAllByText('企業経営').length).toBeGreaterThan(0);
    expect(screen.getAllByText('雇用管理').length).toBeGreaterThan(0);
    expect(screen.getAllByText('専門支援').length).toBeGreaterThan(0);
    expect(screen.getAllByText('制度設計').length).toBeGreaterThan(0);
    expect(screen.queryByText('一言を、観測点と確認問いへ変える。')).not.toBeInTheDocument();
    expect(screen.queryByText('同じテーマへ戻る')).not.toBeInTheDocument();
    expect(screen.queryByText('サイト全体の読み方')).not.toBeInTheDocument();
    expect(screen.queryByText('ガイドの読み方')).not.toBeInTheDocument();
    expect(screen.queryByText('通して読めるガイドブックと、必要時に引ける道具箱を両立する。')).not.toBeInTheDocument();
    expect(screen.getAllByText('21視点ボード').length).toBeGreaterThan(0);
    expect(screen.getByText('未来の仕事設計を、21の観測点へ開く。')).toBeInTheDocument();
    expect(screen.getByText('人間の多様性を前提にした企業経営、雇用管理、専門支援、制度設計を、21の問いで組み立てるための全体地図です。')).toBeInTheDocument();
    expect(screen.getByText('4つの実装領域')).toBeInTheDocument();
    expect(screen.getByText('未来の取り組みに持ち込む。')).toBeInTheDocument();
    expect(screen.getByText('どこへ持ち込むか')).toBeInTheDocument();
    expect(screen.getByText('何を同時に見るか')).toBeInTheDocument();
    expect(screen.getByText('何を問うか')).toBeInTheDocument();
    expect(screen.queryByText('まず1面を選び、必要な問いだけ開く。')).not.toBeInTheDocument();
    expect(screen.queryByText('今日の入口')).not.toBeInTheDocument();
    expect(screen.queryByText('復職後、短時間勤務なのに評価が曖昧で不安が強い。')).not.toBeInTheDocument();
    expect(screen.queryByText('この一文を「本人の不安」で閉じず、仕事条件として見える場所へ置き直します。')).not.toBeInTheDocument();
    expect(screen.queryByText('近い観測点へ進む')).not.toBeInTheDocument();
    expect(screen.queryByText('21視点 構造ガイド')).not.toBeInTheDocument();
    expect(screen.queryByText('まず、構造をつかむ。')).not.toBeInTheDocument();
    expect(screen.queryByText('読む順番')).not.toBeInTheDocument();
    expect(screen.queryByText('構造、設計面、観測点。')).not.toBeInTheDocument();
    expect(screen.queryByText('取り組みに使う')).not.toBeInTheDocument();
    expect(screen.queryByText('短時間勤務を、健康時間・評価・役割設計へ広げる。')).not.toBeInTheDocument();
    expect(screen.queryByText('相談事例集との関係')).not.toBeInTheDocument();
    expect(screen.getByText('読み方の補助メモ')).toBeInTheDocument();
    expect(screen.queryByText('読みを崩さないために')).not.toBeInTheDocument();
    expect(screen.queryByText('6つの約束を下敷きにする。')).not.toBeInTheDocument();
    expect(screen.getByText('名前から決めつけない')).toBeInTheDocument();
    expect(screen.getByText('一つの説明で閉じない')).toBeInTheDocument();
    expect(screen.getByText('支援名・配慮名を正解にしない')).toBeInTheDocument();
    expect(screen.getByText('根拠の身元と新しさを分ける')).toBeInTheDocument();
    expect(screen.getByText('共有範囲を守る')).toBeInTheDocument();
    expect(screen.getByText('学びを固定しない')).toBeInTheDocument();
    expect(screen.queryByText('読みの土台')).not.toBeInTheDocument();
    expect(screen.queryByText('21項目の下には、4つの流れがある。')).not.toBeInTheDocument();
    expect(screen.queryByText('状況レベルで、取組状況を見える形にする。')).not.toBeInTheDocument();
    expect(screen.getAllByText(/安定・予防/).length).toBeGreaterThan(20);
    expect(screen.getAllByText(/要調整/).length).toBeGreaterThan(20);
    expect(screen.getAllByText(/高頻度支障/).length).toBeGreaterThan(20);
    expect(screen.getAllByText(/破綻・停止/).length).toBeGreaterThan(20);
    expect(screen.getAllByText('構造上の束').length).toBe(3);
    expect(screen.getAllByText('この面で見る観測点').length).toBe(3);
    expect(screen.getAllByText('観測点').length).toBe(21);
    expect(screen.getAllByText('状況レベル').length).toBe(21);
    expect(screen.getAllByText(/観測軸:/).length).toBe(21);
    expect(screen.getAllByText('本質構造:').length).toBe(21);
    expect(screen.getAllByText('よくあるサイン').length).toBe(21);
    expect(screen.getAllByText('構造として読む').length).toBe(21);
    expect(screen.getAllByText('すぐ出す確認問い').length).toBe(21);
    expect(screen.getAllByText('ひっかけ注意').length).toBe(21);
    expect(screen.getByText('負荷と回復の余地')).toBeInTheDocument();
    expect(screen.getByText('支援の再翻訳容量')).toBeInTheDocument();
    expect(screen.getByText('成果・役割・処遇の価値翻訳')).toBeInTheDocument();
    expect(
      screen.getByText('作業量、密度、順序、休憩、通勤、翌日の回復まで含めて山をならせている。'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('伝える内容、伝えない内容、共有先、同意範囲、更新時点が調整目的ごとに分かれている。'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('公式情報、非公式情報、会議、文書、音声、ICT、感覚刺激、情報量まで参加条件として整えている。'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('人や職場の採点ではなく、仕事条件としてどこまで扱えているかを見る目盛りです。')
        .length,
    ).toBe(21);
    expect(screen.queryByText('未来の取り組みに使う')).not.toBeInTheDocument();
    expect(screen.queryByText('21項目は、組織と社会の設計に使う。')).not.toBeInTheDocument();
    expect(screen.getAllByText('負荷をならす').length).toBeGreaterThan(0);
    expect(screen.getAllByText('求人と本人条件をすり合わせる').length).toBeGreaterThan(0);
    expect(screen.getAllByText('職場規模・地域資源に合わせる').length).toBeGreaterThan(0);
    expect(screen.getByText(/健康・機能のリズム/)).toBeInTheDocument();
    expect(screen.getAllByText('障害種類から見る').length).toBeGreaterThan(0);
    expect(screen.queryByText('障害別の支援策一覧')).not.toBeInTheDocument();
    expect(
      screen.getByText(/体調変動は、本人の不安定さだけを意味しません。/),
    ).toBeInTheDocument();
    expect(screen.queryByText('まず、3つだけ覚える。')).not.toBeInTheDocument();
    expect(screen.queryByText('7語で覚える')).not.toBeInTheDocument();
    expect(
      screen.queryByText('21項目は、全部を同じ強さで読むものではない。'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('27項目')).not.toBeInTheDocument();
    expect(screen.queryByText('Cross-Cutting Check Axes')).not.toBeInTheDocument();
  });

  it('keeps detail pages static-first and away from individual judgments', () => {
    const workDesignStudio = nextSiteCandidatePages.find((page) => page.id === 'NS-04');
    expect(workDesignStudio).toBeDefined();

    render(<NextNblStaticSitePageCandidate page={workDesignStudio!} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '場面から入る',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('タテ割り支援で見えにくくなった状況を、直感的なストーリーとして見える化します。場面カードは独立した答えではなく、相談事例集、理論、教材へ進むための導入です。')).toBeInTheDocument();
    expect(
      screen.getAllByText('本人の事情、企業の制約、支援者の問い、医療・生活側の情報が別々の言葉で語られ、同じ場面として共有されない。')
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('タテ割りで見えない状況を、ストーリーで同じ場面に戻す。')).toBeInTheDocument();
    expect(screen.getAllByText('相談事例集へ進む').length).toBeGreaterThan(0);
    expect(screen.getAllByText('月末締切が集中する事務チーム').length).toBeGreaterThan(0);
    expect(screen.getByText('モデル場面 01')).toBeInTheDocument();
    expect(screen.getByText('モデル場面で読む')).toBeInTheDocument();
    expect(screen.getByText('自分だけで説明を背負わず、相談に持っていく仕事条件を見つける。')).toBeInTheDocument();
    expect(screen.getByText('4場面を、先に絵で見る。')).toBeInTheDocument();
    expect(screen.getByText('月末締切、手順変更、動線と道具、開示と評価。まず場面でつかみ、その後に仕事条件へ戻します。')).toBeInTheDocument();
    expect(screen.getByAltText('場面から入る、月末締切、手順変更、動線と道具、開示と評価を並べた4コマストーリーボード')).toHaveAttribute(
      'src',
      '/images/next-nbl-work-design-studio-storyboard-v1.webp',
    );
    expect(screen.getByAltText('月末締切が集中する事務チームを4コマで示すマンガ')).toHaveAttribute(
      'src',
      '/images/next-nbl-work-design-scene-month-end-v1.webp',
    );
    expect(screen.getByAltText('作業手順の変更が現場に残らない場面を4コマで示すマンガ')).toHaveAttribute(
      'src',
      '/images/next-nbl-work-design-scene-procedure-change-v1.webp',
    );
    expect(screen.getByAltText('動線と道具で担当範囲が狭くなる場面を4コマで示すマンガ')).toHaveAttribute(
      'src',
      '/images/next-nbl-work-design-scene-route-tools-v1.webp',
    );
    expect(screen.getByAltText('開示範囲と評価面談が混ざる場面を4コマで示すマンガ')).toHaveAttribute(
      'src',
      '/images/next-nbl-work-design-scene-disclosure-evaluation-v1.webp',
    );
    expect(screen.getAllByText(/このマンガはモデル場面の入口です。実在ケースや個別判断ではありません。/).length).toBe(4);
    expect(screen.getAllByText('作業手順の変更が現場に残らない').length).toBeGreaterThan(0);
    expect(screen.getAllByText('動線と道具で担当範囲が狭くなる').length).toBeGreaterThan(0);
    expect(screen.getAllByText('開示範囲と評価面談が混ざる').length).toBeGreaterThan(0);
    expect(screen.getByText('対応する相談: 健康時間 / 通院と回復時間が読めない')).toBeInTheDocument();
    expect(screen.getByText('対応する相談: 情報・手順 / 急な予定変更が続く')).toBeInTheDocument();
    expect(screen.getByText('対応する相談: 健康時間 / 職場にいるだけで消耗する')).toBeInTheDocument();
    expect(screen.getByText('対応する相談: 開示・共有 / どこまで聞いてよいか分からない')).toBeInTheDocument();
    const studioConsultationHrefs = screen
      .getAllByRole('link', { name: '相談事例集へ進む' })
      .map((link) => decodeURIComponent(link.getAttribute('href') ?? ''));
    expect(
      studioConsultationHrefs.some((href) =>
        href.includes('/preview/falcon-next-nbl/work-design-map') &&
        href.includes('audience=すべて') &&
        href.includes('issue=健康時間') &&
        href.includes('case=health-time') &&
        href.includes('#case-health-time'),
      ),
    ).toBe(true);
    expect(
      studioConsultationHrefs.some((href) =>
        href.includes('/preview/falcon-next-nbl/work-design-map') &&
        href.includes('issue=情報・手順') &&
        href.includes('case=change-info') &&
        href.includes('#case-change-info'),
      ),
    ).toBe(true);
    expect(
      studioConsultationHrefs.some((href) =>
        href.includes('/preview/falcon-next-nbl/work-design-map') &&
        href.includes('issue=健康時間') &&
        href.includes('case=sensory-office') &&
        href.includes('#case-sensory-office'),
      ),
    ).toBe(true);
    expect(
      studioConsultationHrefs.some((href) =>
        href.includes('/preview/falcon-next-nbl/work-design-map') &&
        href.includes('issue=開示・共有') &&
        href.includes('case=disclosure-boundary') &&
        href.includes('#case-disclosure-boundary'),
      ),
    ).toBe(true);
    expect(screen.getAllByText('絵で起きていること').length).toBeGreaterThan(0);
    expect(screen.getAllByText('見落としやすい問い').length).toBeGreaterThan(0);
    expect(screen.getAllByText('企業側の読み').length).toBeGreaterThan(0);
    expect(screen.getAllByText('追加で確認する問い').length).toBeGreaterThan(0);
    expect(screen.getByText('体調変動はどの曜日・時間帯・作業負荷で起きやすいか。')).toBeInTheDocument();
    expect(screen.getByText('締切分散案、共有境界、試行期間、評価条件の確認メモ。')).toBeInTheDocument();
    expect(screen.getByText('健康時間 / 情報と手順 / 支援と再翻訳 / 評価と参加の質')).toBeInTheDocument();
    expect(screen.getByText('共有境界、面談分離、記録範囲、見直し条件のメモ。')).toBeInTheDocument();
    expect(
      screen.getAllByText('採用、配置、合理的配慮、労務判断の妥当性を判定するものではありません。')
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('個別相談、医療・法務・雇用判断、配慮妥当性の結論は扱いません。')).toBeInTheDocument();
    expect(screen.queryByText(/Falcon/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Heron/)).not.toBeInTheDocument();
    expect(screen.queryByText(/source\/support validity/)).not.toBeInTheDocument();
    expect(screen.queryByText(/public approval/)).not.toBeInTheDocument();
    expect(screen.queryByText(/runtime retrieval/)).not.toBeInTheDocument();
  });

  it('renders the work design map as a practical consultation case library, separated from concept explanation', () => {
    const workDesignMap = nextSiteCandidatePages.find((page) => page.id === 'NS-02');
    expect(workDesignMap).toBeDefined();

    render(<NextNblStaticSitePageCandidate page={workDesignMap!} />);

    expect(screen.getByRole('heading', { level: 1, name: '相談の一言から見立てを組み立てる' })).toBeInTheDocument();
    expect(screen.queryByText('同じテーマへ戻る')).not.toBeInTheDocument();
    expect(screen.queryByText('サイト全体の読み方')).not.toBeInTheDocument();
    expect(screen.queryByText('このページだけで閉じず、場面、相談事例、考え方、21視点、記事、教材を同じ仕事条件の地図として読み戻します。')).not.toBeInTheDocument();
    expect(screen.getByText('よくある相談を、答え集ではなく、複数の読み筋、まだ分からないこと、情報が増えると見えること、合意前の確認候補までたどる見立てのプロセスとして読めるようにします。')).toBeInTheDocument();
    expect(screen.getByText('一言を、仕事条件の地図へ。')).toBeInTheDocument();
    expect(screen.getByText('すぐに判断せず、同じ職場場面を時間、作業、情報、環境、支援、評価、共有へ分けて読みます。')).toBeInTheDocument();
    expect(screen.getByAltText('相談の一言を、時間、作業、情報、環境、支援、評価、共有の仕事条件へ展開する図')).toHaveAttribute(
      'src',
      '/images/next-nbl-work-design-map-visual-v1.webp',
    );
    expect(screen.getByText('見立てプロセス')).toBeInTheDocument();
    expect(screen.getByText('相談の一言を、判断ではなく確認地図へ変える。')).toBeInTheDocument();
    expect(screen.getByText('相談事例集は、よくある答えの一覧ではありません。断片的な相談から、どこで読みが止まりやすいか、何をまだ確認していないか、次に誰と何を話すかを組み立てるページです。')).toBeInTheDocument();
    expect(screen.getByText('場面で気づく')).toBeInTheDocument();
    expect(screen.getByText('手順で確かめる')).toBeInTheDocument();
    expect(screen.getByText('結論ではなく、話し合い前に確認する地図です。')).toBeInTheDocument();
    expect(screen.getByText('典型相談事例ライブラリ')).toBeInTheDocument();
    expect(screen.getByText('相談を選ぶと、見立てが開く。')).toBeInTheDocument();
    expect(screen.getByText('30件のモデル事例から選び、入口語、止まりやすい読み、7接点、複数仮説、追加確認、短い試行、次の道具までを同じ画面で読みます。')).toBeInTheDocument();
    expect(screen.getByText('掲載 30件')).toBeInTheDocument();
    expect(screen.queryByText('近い構造から、読み筋の流れを読む。')).not.toBeInTheDocument();
    expect(screen.getAllByText('当事者').length).toBeGreaterThan(0);
    expect(screen.getAllByText('企業').length).toBeGreaterThan(0);
    expect(screen.getAllByText('支援者').length).toBeGreaterThan(0);
    expect(screen.getAllByText('行政・研修').length).toBeGreaterThan(0);
    expect(screen.getByText('近い相談を選ぶ')).toBeInTheDocument();
    expect(screen.getByText('一言から、開く問いまで見る。')).toBeInTheDocument();
    expect(screen.getAllByText('入口').length).toBeGreaterThan(0);
    expect(screen.getByText('詰まり方')).toBeInTheDocument();
    expect(screen.getByText('選択中の相談')).toBeInTheDocument();
    expect(screen.getByText('今開いている仕事条件')).toBeInTheDocument();
    expect(screen.getByText('見立てボード')).toBeInTheDocument();
    expect(screen.getByText('一言を、見立てのプロセスへ変える。')).toBeInTheDocument();
    expect(screen.getByText('入口を受け取る')).toBeInTheDocument();
    expect(screen.getByText('問いを直す')).toBeInTheDocument();
    expect(screen.getByText('構造を見る')).toBeInTheDocument();
    expect(screen.getByText('確かめる')).toBeInTheDocument();
    expect(screen.getByText('次に動く')).toBeInTheDocument();
    expect(screen.queryByText('入口別の広がり')).not.toBeInTheDocument();
    expect(screen.queryByText('詰まり方別の広がり')).not.toBeInTheDocument();
    expect(screen.getByLabelText('キーワードで探す')).toBeInTheDocument();
    expect(screen.getByText('表示中: 30 / 30件')).toBeInTheDocument();
    expect(screen.getAllByText('健康時間').length).toBeGreaterThan(0);
    expect(screen.getByText('情報・手順')).toBeInTheDocument();
    expect(screen.getByText('研修・制度')).toBeInTheDocument();
    expect(screen.getAllByText('急な予定変更が続く').length).toBeGreaterThan(0);
    expect(screen.getByText('通院と回復時間が読めない')).toBeInTheDocument();
    expect(screen.getByText('意欲が続かないと言われる')).toBeInTheDocument();
    expect(screen.getByText('どこまで聞いてよいか分からない')).toBeInTheDocument();
    expect(screen.getByText('実習ではできたのに続かない')).toBeInTheDocument();
    expect(screen.getByText('研修メニューが作れない')).toBeInTheDocument();
    expect(screen.getByText('復職後の戻り方が分からない')).toBeInTheDocument();
    expect(screen.getByText('短時間勤務の評価が曖昧')).toBeInTheDocument();
    expect(screen.getByText('メンタルヘルス研修と分断する')).toBeInTheDocument();
    expect(screen.getByText('産業保健と現場がつながらない')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('キーワードで探す'), {
      target: { value: 'OJT' },
    });
    expect(screen.getAllByText('OJTが噛み合わない').length).toBeGreaterThan(0);
    expect(screen.getAllByText('採用後のOJTで、教える側も本人も疲弊する').length).toBeGreaterThan(0);
    expect(screen.getByText('作業を「定型」「例外」「判断が必要」に分けて教える。')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('キーワードで探す'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: /急な予定変更が続く/ }));
    expect(screen.getByText(/開く問い: 変更情報は、誰が、いつ、何をする手順として残っているか。/)).toBeInTheDocument();
    expect(screen.getByText('現在は30件の初期ライブラリです。実際の状況がこの範囲に収まらない場合、このページだけでは結論を出しません。近い相談がない場合は、必要な専門確認へ切り分けてください。')).toBeInTheDocument();
    expect(screen.queryByText('相談の一言が、読み筋と次の行動に変わるまで。')).not.toBeInTheDocument();
    expect(screen.getByText('見立てボード')).toBeInTheDocument();
    expect(screen.getByText('一言を、見立てのプロセスへ変える。')).toBeInTheDocument();
    expect(screen.getByText('この事例で開く問い')).toBeInTheDocument();
    expect(screen.getByText('入口を受け取る')).toBeInTheDocument();
    expect(screen.getByText('問いを直す')).toBeInTheDocument();
    expect(screen.getByText('構造を見る')).toBeInTheDocument();
    expect(screen.getByText('確かめる')).toBeInTheDocument();
    expect(screen.getByText('次に動く')).toBeInTheDocument();
    expect(screen.getByText('1. 相談者の入口')).toBeInTheDocument();
    expect(screen.getByText('2. このままだと止まりやすい問い')).toBeInTheDocument();
    expect(screen.getByText('仕事条件として問い直す')).toBeInTheDocument();
    expect(screen.getByText('急な変更が苦手な人には、どう配慮すればよいですか。')).toBeInTheDocument();
    expect(screen.getAllByText('変更情報は、誰が、いつ、何をする手順として残っているか。').length).toBeGreaterThan(0);
    expect(screen.getByText('ここで広がること: 本人の苦手さから、変更連絡、確認先、評価の重なりへ広げる。')).toBeInTheDocument();
    expect(screen.getByText('3. 構造を見る')).toBeInTheDocument();
    expect(screen.getAllByText('7接点と複数の読み筋で、詰まり方を分ける。').length).toBeGreaterThan(0);
    expect(screen.getByText('読み筋 1')).toBeInTheDocument();
    expect(screen.getAllByText('評価と参加の質').length).toBeGreaterThan(0);
    expect(screen.getByText('情報は、形式、タイミング、確認方法、責任分担まで設計されているか。')).toBeInTheDocument();
    expect(screen.getByText('4. 解像度を上げる確認')).toBeInTheDocument();
    expect(screen.getByText('すぐ結論を出さず、何を聞けば読みが深まるかを見る。')).toBeInTheDocument();
    expect(screen.getAllByText(/合意前の確認候補/).length).toBeGreaterThan(0);
    expect(screen.getByText('5. 情報が増えると見えること')).toBeInTheDocument();
    expect(screen.getByText('合意前の確認候補例')).toBeInTheDocument();
    expect(screen.getByText('詰まりは「急な変更が苦手」だけではない。変更後の正解が職場に残らず、確認行動が評価不安と結びつくため、本人は確認したくても動けなくなっている。')).toBeInTheDocument();
    expect(screen.getByText('変更連絡を「変更点、期限、確認先」の3行テンプレートにする。')).toBeInTheDocument();
    expect(screen.getByText('ケース読解パスポート')).toBeInTheDocument();
    expect(screen.getByText('この事例を、次の道具へ渡せる形にする。')).toBeInTheDocument();
    expect(screen.getByText('モデル事例 / 個別判断ではありません')).toBeInTheDocument();
    expect(screen.getByText('情報源レンズ')).toBeInTheDocument();
    expect(screen.getByText('本人の言葉')).toBeInTheDocument();
    expect(screen.getByText('職場・支援者の観察')).toBeInTheDocument();
    expect(screen.getByText('公的・研究知')).toBeInTheDocument();
    expect(screen.getByText('実装する人の条件')).toBeInTheDocument();
    expect(screen.getByText('別読み')).toBeInTheDocument();
    expect(screen.getByText('本人の認知特性だけとは限りません。情報の形式、変更連絡、確認先、責任範囲が仕事手順として残っているかを確認します。')).toBeInTheDocument();
    expect(screen.getByText('試行メモ')).toBeInTheDocument();
    expect(screen.getAllByText('上司またはチーム担当者が、変更点、期限、確認先を1週間同じ書式で残し、手戻りと確認しやすさを見る。').length).toBeGreaterThan(0);
    expect(screen.getByText('事例から次へ')).toBeInTheDocument();
    expect(screen.getByText('読んだ事例を、どの形に変えるか。')).toBeInTheDocument();
    expect(screen.getByText('相談で終わらせない')).toBeInTheDocument();
    expect(screen.getByText('場面化する')).toBeInTheDocument();
    expect(screen.getByText('ストーリーでつかむ')).toBeInTheDocument();
    expect(screen.getByText('使う')).toBeInTheDocument();
    expect(screen.getByText('会議や研修の道具にする')).toBeInTheDocument();
    expect(screen.getByText('この事例の注意事項:')).toBeInTheDocument();
    expect(screen.getByText(/この相談事例は、実在の個別相談ではなく、考え方を説明するためのモデル事例です。/)).toBeInTheDocument();
    expect(screen.getByText('変更情報が作業手順に変換されないまま流れている')).toBeInTheDocument();
    fireEvent.click(screen.getByText('配慮が上司任せになる'));
    expect(screen.getByText('配慮が上司の能力や善意に乗っている限り、異動や繁忙期で崩れる。必要なのは理解ある上司ではなく、代替者、記録、同僚への業務説明、見直し日を含む運用手順。')).toBeInTheDocument();
    expect(screen.getByText('上司が抱えている判断を「休憩、作業配分、説明、支援者連絡」に分解する。')).toBeInTheDocument();
    fireEvent.click(screen.getByText('職場にいるだけで消耗する'));
    expect(screen.getByText('集中力の問題ではなく、環境刺激が作業品質と回復時間を削っている。別室という配慮名ではなく、どの時間帯のどの作業をどの環境で行うと品質が保てるかを見る必要がある。')).toBeInTheDocument();
    fireEvent.click(screen.getByText('本人がうまく説明できない'));
    expect(screen.getByText('本人が説明できない、で止めると代弁が強くなりすぎる。本人の短い言葉を出発点にし、本人の同意範囲で、電話後の集中、確認作業、休憩などの仕事条件へ翻訳する支援が必要。')).toBeInTheDocument();
    fireEvent.click(screen.getByText('メンタルヘルス研修と分断する'));
    expect(screen.getByText('テーマを分けるほど、仕事量、相談先、開示、評価が別々に扱われ、現場管理職の負荷は統合されない。共通の仕事条件は同じ地図で見せ、制度差と情報共有境界は別枠で分ける設計が必要。')).toBeInTheDocument();
    fireEvent.click(screen.getByText('通院と回復時間が読めない'));
    expect(screen.getAllByText('体調変動と締切が同じ週に重なる').length).toBeGreaterThan(0);
    expect(screen.getByText('回復時間が仕事の予定に組み込まれていない')).toBeInTheDocument();
    expect(screen.getByText('必要なのは「休ませるかどうか」の二択ではない。通院、締切、修正、翌日の回復が同じ週に山を作っており、健康時間を工程表に入れていないことが詰まりになっている。')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '行政・研修' }));
    expect(screen.getByText('制度説明が現場に届かない')).toBeInTheDocument();
    expect(screen.getAllByText('研修メニューが作れない').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: '研修・制度' }));
    expect(screen.getAllByText('研修メニューが作れない').length).toBeGreaterThan(0);
    expect(screen.queryByText('地域資源がつながらない')).not.toBeInTheDocument();
    expect(screen.getAllByText('理論を読む').length).toBeGreaterThan(0);
    expect(screen.queryByText('仕事条件マップ ワークシート')).not.toBeInTheDocument();
    expect(screen.queryByText('古くて新しい問題')).not.toBeInTheDocument();
    expect(screen.queryByText('7接点の確認シート')).not.toBeInTheDocument();

    expect(screen.queryByText('仕事の地図の読み順')).not.toBeInTheDocument();
    expect(screen.queryByText(/これから/)).not.toBeInTheDocument();
    expect(screen.queryByText(/提案/)).not.toBeInTheDocument();
  });

  it('lands the fatigue-theme consultation link on the health-time model case', async () => {
    const workDesignMap = nextSiteCandidatePages.find((page) => page.id === 'NS-02');
    expect(workDesignMap).toBeDefined();
    window.history.pushState(
      {},
      '',
      '/preview/falcon-next-nbl/work-design-map?audience=%E3%81%99%E3%81%B9%E3%81%A6&issue=%E5%81%A5%E5%BA%B7%E6%99%82%E9%96%93&case=health-time#case-health-time',
    );

    render(<NextNblStaticSitePageCandidate page={workDesignMap!} />);

    expect(screen.getByText('表示中: 7 / 30件')).toBeInTheDocument();
    expect((await screen.findAllByText('体調変動と締切が同じ週に重なる')).length).toBeGreaterThan(0);
    expect(screen.getByText('必要なのは「休ませるかどうか」の二択ではない。通院、締切、修正、翌日の回復が同じ週に山を作っており、健康時間を工程表に入れていないことが詰まりになっている。')).toBeInTheDocument();
    expect(screen.getByText('回復時間が仕事の予定に組み込まれていない')).toBeInTheDocument();

    window.history.pushState({}, '', '/');
  });

  it('renders the theory page as the knowledge-network backbone, not another product page', () => {
    const conceptPage = nextSiteCandidatePages.find((page) => page.id === 'NS-07');
    expect(conceptPage).toBeDefined();

    render(<NextNblStaticSitePageCandidate page={conceptPage!} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '見えなかった関係を、仕事条件の知識ネットワークへ。',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('障害者雇用や難病就労支援に長く残ってきた難しさを、本人、仕事、環境、支援、時間、制度の相互作用として読み直します。人間だけでは扱いきれなかった複雑な関係を、ICF準拠の枠組みとAIの文脈読解で知識ネットワークに変え、読める・学べる・使えるプロダクト群へ展開します。')).toBeInTheDocument();
    expect(screen.getAllByText('理論を読む').length).toBeGreaterThan(0);
    expect(screen.getByText('プロダクト群を見る')).toBeInTheDocument();
    expect(screen.getByText('古くて新しい課題')).toBeInTheDocument();
    expect(screen.getByText('問題の本質は、過重な認知負荷にある。')).toBeInTheDocument();
    expect(screen.getByText('支援が足りないだけではない。関係を読める地図が足りなかった。')).toBeInTheDocument();
    expect(screen.getByText('情報は多いが、そのまま拾うと偏りも拾う')).toBeInTheDocument();
    expect(screen.getByText('複雑さが、人間の認知負荷に押し込まれる')).toBeInTheDocument();
    expect(screen.getByText('早すぎる結論が、設計の余地を閉じる')).toBeInTheDocument();
    expect(screen.getByText('専門知識ネットワーク')).toBeInTheDocument();
    expect(screen.getByText('検索・要約ではなく、偏りをほどき、相互作用を読む知識ネットワークをつくる。')).toBeInTheDocument();
    const theoryVisuals = screen.getAllByAltText(
      '断片情報と偏りを、ICF相互作用とAI文脈読解で専門知識ネットワークへ変換し、相談事例、21視点、記事、場面、認知補助ツールへ展開する図解',
    );
    expect(theoryVisuals.some((image) => image.getAttribute('src') === '/images/next-nbl-knowledge-network-theory-map-v2.webp')).toBe(true);
    expect(theoryVisuals.some((image) => image.getAttribute('src') === '/images/next-nbl-knowledge-network-theory-map-mobile-v2.webp')).toBe(true);
    expect(
      screen.getByText(
        '左の断片情報をそのまま答えにせず、中央で相互作用の関係として読み直し、右側で人間が使える相談、学習、記事、場面、認知補助の入口へ翻訳します。',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('偏見を再生産しないために、情報の身元と視点を分ける')).toBeInTheDocument();
    expect(screen.getByText('分類表ではなく、相互作用を読む科学的フレームとして使う')).toBeInTheDocument();
    expect(screen.getByText('AIの文脈読解力で、人間が保持しきれない関係を候補化する')).toBeInTheDocument();
    expect(screen.getByText('高度な知識ネットワークを、人間が使えるインターフェイスへ変える')).toBeInTheDocument();
    expect(screen.getByText(/公開された調査研究報告、マニュアル、合理的配慮事例集、雇用事例集、海外情報サイト、制度情報/)).toBeInTheDocument();
    expect(screen.getByText(/単なる情報検索・要約ツールでは、古い先入観、診断名からの決めつけ/)).toBeInTheDocument();
    expect(screen.getByText(/ICFを項目分類やチェックリストとして使うだけでは、仕事場面の動きは見えません/)).toBeInTheDocument();
    expect(screen.getByText(/AIの価値は、文章を短く要約することだけではありません/)).toBeInTheDocument();
    expect(screen.getByText(/言語と非言語の認知を補助・拡張する形へ変換します/)).toBeInTheDocument();
    expect(screen.getByText('解決策としてのプロダクト群')).toBeInTheDocument();
    expect(screen.getByText('思いつきのページ群ではない。専門知識ネットワークの出口を、用途ごとに分けている。')).toBeInTheDocument();
    expect(screen.getByText('断片相談から、複数の見立てへ')).toBeInTheDocument();
    expect(screen.getByText('未来の仕事設計へ広げる')).toBeInTheDocument();
    expect(screen.getByText('複雑な関係を、ストーリーでつかむ')).toBeInTheDocument();
    expect(screen.getByText('社会の問いを、関係として読み直す')).toBeInTheDocument();
    expect(screen.getByText('言葉以外のチャンネルへ展開する')).toBeInTheDocument();
    expect(screen.getByText('AIの使い方')).toBeInTheDocument();
    expect(screen.getByText('物知り回答機ではなく、関係を読む認知補助として使う。')).toBeInTheDocument();
    expect(screen.getByText(/断片情報を世界そのものではなく一部の投影として受け取り/)).toBeInTheDocument();
    expect(screen.getByText('公開情報、相談の一文、SNSの反応を、そのまま世界の答えとして扱わない。')).toBeInTheDocument();
    expect(screen.getByText('AIの文脈読解で、暗黙の前提、反対仮説、欠けた確認点を関係候補として広げる。')).toBeInTheDocument();
    expect(screen.getByText('人間が確認できる地図、相談事例、記事、場面、ワーク、教材へ戻す。')).toBeInTheDocument();
    expect(screen.getByText('高度な読みを扱うほど、判断境界は明確にする。')).toBeInTheDocument();
    expect(screen.getByText('個別判断はしない')).toBeInTheDocument();
    expect(screen.getByText('病名から配慮へ直行しない')).toBeInTheDocument();
    expect(screen.getByText('AIを判断者にしない')).toBeInTheDocument();
    expect(screen.getByText('根拠と使い道を混ぜない')).toBeInTheDocument();
    expect(screen.getByText('相談事例集へ')).toBeInTheDocument();
    expect(screen.getByText('未来設計21視点へ')).toBeInTheDocument();
    expect(screen.getByText('認知補助ツールへ')).toBeInTheDocument();
    expect(screen.queryByText('仕事条件アセスメントの考え方')).not.toBeInTheDocument();
    expect(screen.queryByText('「疲れやすい」を、7つの確認点に分ける。')).not.toBeInTheDocument();
    expect(screen.queryByText('仕事条件マップ ワークシート')).not.toBeInTheDocument();
    expect(screen.queryByText('7接点の確認シート')).not.toBeInTheDocument();
    expect(screen.queryByText('場面カードへ')).not.toBeInTheDocument();
    expect(screen.queryByText('読み順を見る')).not.toBeInTheDocument();
    expect(screen.queryByText('典型相談事例ライブラリ')).not.toBeInTheDocument();
  });

  it('renders the work-question article collection as a concrete article product', () => {
    const questionNote = nextSiteCandidatePages.find((page) => page.id === 'NS-05');
    expect(questionNote).toBeDefined();

    const { container } = render(<NextNblStaticSitePageCandidate page={questionNote!} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '働き方の問いをひらく記事集',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/ニュース、SNS、制度、研究、研修現場で出てくる違和感/)).toBeInTheDocument();
    expect(screen.getByText('読む入口')).toBeInTheDocument();
    expect(screen.getByText('問いから、本文へ。')).toBeInTheDocument();
    expect(screen.getByText('まず記事を選び、図解と本文で読む。')).toBeInTheDocument();
    expect(screen.queryByText('仕事条件レンズ')).not.toBeInTheDocument();
    expect(screen.queryByText('記事集の役割')).not.toBeInTheDocument();
    expect(screen.queryByText('社会の問いを、職場で話せる問いと設計条件へ変える。')).not.toBeInTheDocument();
    expect(screen.queryByText(/ここは記事を並べる棚ではありません/)).not.toBeInTheDocument();
    expect(screen.queryByText(/個別相談への回答、医学的判断、就労可否/)).not.toBeInTheDocument();
    expect(screen.queryByText('社会に出ている問いを入口にする')).not.toBeInTheDocument();
    expect(screen.queryByText('関係として構造化する')).not.toBeInTheDocument();
    expect(screen.queryByText('記事、図解、次の道具へ分ける')).not.toBeInTheDocument();
    expect(screen.queryByText('反応を、次の改稿の手がかりにする')).not.toBeInTheDocument();
    expect(screen.getByText('イベント特集')).toBeInTheDocument();
    expect(screen.getByText('仕事条件デザイン・バーチャルフォーラム')).toBeInTheDocument();
    expect(screen.getByText('「働ける人を探す」から、「働ける条件を設計する」へ。')).toBeInTheDocument();
    expect(screen.getByText(/6セッション/)).toBeInTheDocument();
    expect(screen.getByText(/22発表/)).toBeInTheDocument();
    expect(screen.getByText('雇用率の先へ')).toBeInTheDocument();
    expect(screen.getByText('ラベルと言葉の向こうの就労経験')).toBeInTheDocument();
    expect(screen.getByText('AIは支援者を置き換えるのか、増幅するのか')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /イベントを開く/ })).toHaveAttribute(
      'href',
      '/events/work-condition-forum#forum-top',
    );
    expect(screen.queryByText('APSE公式')).not.toBeInTheDocument();
    expect(screen.queryByText('APSE翻訳')).not.toBeInTheDocument();
    expect(screen.queryByText('APSE認定')).not.toBeInTheDocument();
    expect(screen.queryByText('Falcon Lab')).not.toBeInTheDocument();
    expect(screen.queryByText('public未承認')).not.toBeInTheDocument();
    expect(screen.queryByText('NotebookLM素材')).not.toBeInTheDocument();
    expect(screen.queryByText('ARTICLE FIRST')).not.toBeInTheDocument();
    expect(screen.queryByText('VF-01')).not.toBeInTheDocument();
    expect(screen.queryByText('VF-22')).not.toBeInTheDocument();
    expect(screen.getByText('更新の入口')).toBeInTheDocument();
    expect(screen.getByText('読まれ方を見て、記事を直す。')).toBeInTheDocument();
    expect(screen.getByText(/反応は根拠ではなく、次に直す説明の手がかりです/)).toBeInTheDocument();
    expect(screen.getByText('拾う')).toBeInTheDocument();
    expect(screen.getByText('戻す')).toBeInTheDocument();
    expect(screen.getByText('守る')).toBeInTheDocument();
    expect(screen.queryByText('社会の問いとの往復')).not.toBeInTheDocument();
    expect(screen.queryByText('日々の信号を、記事・図解・教材へ戻す。')).not.toBeInTheDocument();
    expect(screen.queryByText('3つの動き方')).not.toBeInTheDocument();
    expect(screen.queryByText('その日の話題、まとまった論点、長期テーマを分ける。')).not.toBeInTheDocument();
    expect(screen.queryByText('今日の話題がある日')).not.toBeInTheDocument();
    expect(screen.queryByText('まとまった論点が見えた日')).not.toBeInTheDocument();
    expect(screen.queryByText('特別な話題がない日')).not.toBeInTheDocument();
    expect(screen.queryByText('社会接点で守る境界')).not.toBeInTheDocument();
    expect(screen.queryByText('手動投稿キュー')).not.toBeInTheDocument();
    expect(screen.queryByText(/下書き候補/)).not.toBeInTheDocument();
    expect(screen.queryByText('返信停止条件')).not.toBeInTheDocument();
    expect(screen.queryByText('投稿前に止める条件')).not.toBeInTheDocument();
    expect(
      screen.getAllByAltText(
        'ニュース、SNS、制度、研究、研修現場の問いを専門知識ネットワークで関係として読み、記事、図解、相談事例、21視点、教材へ返す図解',
      )[0],
    ).toHaveAttribute('src', '/images/next-nbl-open-work-questions-article-hub-mobile-v1.webp');
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '問いから記事を選ぶ',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('ニュースや制度の話題を、賛否ではなく職場で話せる問いへ戻す。')).toBeInTheDocument();
    expect(screen.getAllByText('問いから読む').length).toBeGreaterThan(0);
    expect(screen.getAllByText('図解目次').length).toBeGreaterThan(0);
    expect(screen.getByText('記事ごとの図解から選ぶ。')).toBeInTheDocument();
    for (const category of [
      'すべて',
      '雇用の質',
      '見えない病気',
      '治療と仕事',
      'メンタルヘルス',
      '相互作用',
      '配慮と仕事設計',
      '多分野連携',
      '職場接触点',
      '実装と研修',
      '三者視点',
      '政策・研究',
      '資料と会議',
    ]) {
      expect(screen.getByRole('button', { name: category })).toBeInTheDocument();
    }
    for (const title of [
      '医学モデルか社会モデルか、で止めない。',
      '配慮名の前に、仕事を分解する。',
      '連携は、同じ場面を見ることから始まる。',
      '職場の不安を、人の評価で止めない。',
      'ワークショップを、いい話で終わらせない。',
      '同じ仕事でも、三者の見え方は違う。',
      '制度や研究を、現場の問いに翻訳する。',
      'マニュアルを増やすより、会議で使える形にする。',
    ]) {
      expect(screen.getByRole('button', { name: new RegExp(title) })).toBeInTheDocument();
    }
    for (const node of ['人数', '役割', '評価', '相談経路', '健康時間']) {
      expect(screen.getAllByText(node).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText('記事 01').length).toBeGreaterThan(0);
    expect(screen.getAllByText('雇用率だけでは、よい雇用か分からない。').length).toBeGreaterThan(0);
    expect(screen.getAllByText('人数は入口です。働いている先で、役割、評価、相談経路、回復時間が閉じていないかを見る必要があります。').length).toBeGreaterThan(0);
    expect(screen.getByText(/障害者雇用率は、社会が「雇用の入口」を閉じないための重要な制度です。/)).toBeInTheDocument();
    expect(screen.getByText(/だから、最初の問いは「雇用率を満たしたか」では終わりません。/)).toBeInTheDocument();
    expect(screen.getByText('数字は入口であって、結論ではない')).toBeInTheDocument();
    expect(screen.getByText('定着の中に、参加の質を見に行く')).toBeInTheDocument();
    expect(screen.getByText('健康時間は、仕事設計の外に置けない')).toBeInTheDocument();
    expect(screen.getByText('関係として読む')).toBeInTheDocument();
    expect(screen.getByText('社会の話題を、そのまま答えにせず、関係の地図へ戻す。')).toBeInTheDocument();
    expect(screen.getByText('入口の言葉')).toBeInTheDocument();
    expect(screen.getByText('戻す関係')).toBeInTheDocument();
    expect(screen.getByText('仕事条件で開いた問い')).toBeInTheDocument();
    expect(screen.getByText(/これは診断、医学判断、就労可否、法的判断、配慮妥当性の判定ではありません。/)).toBeInTheDocument();
    const articleReaderText = container.querySelector('#article-reader')?.textContent ?? '';
    expect(articleReaderText.indexOf('対応インフォグラフィック')).toBeLessThan(
      articleReaderText.indexOf('数字は入口であって、結論ではない'),
    );
    expect(articleReaderText.indexOf('数字は入口であって、結論ではない')).toBeLessThan(
      articleReaderText.indexOf('関係として読む'),
    );
    expect(articleReaderText.indexOf('関係として読む')).toBeLessThan(
      articleReaderText.indexOf('この記事を道具にする'),
    );
    expect(screen.getAllByText('雇用率を満たしていれば、取組は進んでいると言えるのか。').length).toBeGreaterThan(0);
    expect(screen.getAllByText('人数の外側にある役割、健康時間、評価、処遇、相談経路をどう観測するか。').length).toBeGreaterThan(0);
    expect(screen.getByText('対応インフォグラフィック')).toBeInTheDocument();
    expect(screen.getAllByText('人数から参加の質へ').length).toBeGreaterThan(0);
    expect(screen.getByAltText('人数だけのグラフから、役割、評価、相談経路、健康時間、見直しへ視点が広がるインフォグラフィック')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /人数から参加の質へのインフォグラフィックを拡大して見る/ })).toBeInTheDocument();
    expect(screen.getByText('読後に話す問い')).toBeInTheDocument();
    expect(screen.getByText('あなたの職場や支援では、雇用された人数以外に、何を見れば「よい雇用に近づいている」と言えますか。')).toBeInTheDocument();
    expect(screen.getAllByText('開く').length).toBeGreaterThan(0);
    expect(screen.queryByText('いま起きている問いを読む')).not.toBeInTheDocument();
    expect(screen.queryByText('まだ話題になっていない問いを掘り起こす')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /人数から参加の質へのインフォグラフィックを拡大して見る/ }));
    expect(screen.getByRole('dialog', { name: /人数から参加の質へのインフォグラフィック拡大表示/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /閉じる/ }));
    expect(screen.queryByRole('dialog', { name: /人数から参加の質へのインフォグラフィック拡大表示/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /配慮名の前に、仕事を分解する。/ }));
    expect(window.location.hash).toBe('#article-reader');
    expect(screen.getByText('この記事を道具にする')).toBeInTheDocument();
    expect(screen.getByText('この記事を読んだ後、会議・研修・場面共有で使うための道具です。')).toBeInTheDocument();
    expect(screen.getByText('教材 06: 配慮名の前に、仕事を分解する')).toBeInTheDocument();
    expect(screen.getByText('教材 02: がんばり美談から、仕事の前提へ')).toBeInTheDocument();
    expect(
      document.querySelector('a[href="/downloads/teaching-library/accommodation-work-design-kit-v1.html"]'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /見えない病気は、理解啓発だけでは足りない。/ }));
    expect(screen.getAllByText('記事 02').length).toBeGreaterThan(0);
    expect(screen.getAllByText('見た目では分からない病気は、理解を広げればよいのか。').length).toBeGreaterThan(0);
    expect(screen.getAllByText('通院、症状変動、説明負担、開示境界、評価を仕事条件としてどう扱うか。').length).toBeGreaterThan(0);
    expect(screen.getAllByText('共感から条件設計へ').length).toBeGreaterThan(0);
    expect(screen.getByText('理解だけでは、説明負担は消えない')).toBeInTheDocument();
    expect(screen.getByAltText('見えない病気を理解啓発だけで終わらせず、通院、症状変動、説明負担、開示境界、評価を仕事条件として見るインフォグラフィック')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /共感から条件設計へのインフォグラフィックを拡大して見る/ })).toBeInTheDocument();
    expect(screen.getByText('見えない負担を、本人の説明力ではなく、職場で確認できる条件として置くなら、最初に何を見るべきでしょうか。')).toBeInTheDocument();
    for (const article of [
      {
        title: '治療と仕事を、別々の予定表にしない。',
        alt: '治療と仕事を別々の予定表にせず、治療、通勤、勤務量、回復、収入を一週間の統合マップとして見るインフォグラフィック',
        button: /一週間をつなぐのインフォグラフィックを拡大して見る/,
      },
      {
        title: 'メンタルヘルスを、セルフケアだけに閉じない。',
        alt: 'メンタルヘルスをセルフケアだけに閉じず、仕事量、裁量、変更、相談先、評価を早期相談の条件として見るインフォグラフィック',
        button: /個人努力から早期相談へのインフォグラフィックを拡大して見る/,
      },
      {
        title: 'ダイバーシティを、採用の看板で終わらせない。',
        alt: 'ダイバーシティを採用の看板で終わらせず、採用、情報、会議、育成、役割を参加設計として見るインフォグラフィック',
        button: /採用から参加設計へのインフォグラフィックを拡大して見る/,
      },
      {
        title: '支援機関を増やすだけでは、職場は動かない。',
        alt: '支援機関を増やすだけでなく、本人、医療、企業、支援者の言葉を仕事場面へ翻訳する役割を見るインフォグラフィック',
        button: /窓口から翻訳役へのインフォグラフィックを拡大して見る/,
      },
    ]) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(article.title) }));
      expect(screen.getByAltText(article.alt)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: article.button })).toBeInTheDocument();
    }
    for (const article of [
      {
        title: '医学モデルか社会モデルか、で止めない。',
        alt: '医学モデルか社会モデルかの二択から、同じ仕事場面で本人、仕事、環境、支援、時間の相互作用を見る図解',
        button: /二択から相互作用へのインフォグラフィックを拡大して見る/,
      },
      {
        title: '配慮名の前に、仕事を分解する。',
        alt: '配慮名で止めず、作業、時間、情報、環境、相談、評価へ仕事を分解して見る図解',
        button: /配慮名から仕事分解へのインフォグラフィックを拡大して見る/,
      },
      {
        title: '連携は、同じ場面を見ることから始まる。',
        alt: '多分野連携を連絡で止めず、本人、企業、医療、支援、行政が同じ仕事場面を見るための図解',
        button: /連絡から共同場面へのインフォグラフィックを拡大して見る/,
      },
      {
        title: '職場の不安を、人の評価で止めない。',
        alt: '職場の不安を本人や企業の評価で止めず、安全、顧客対応、人員余力、欠勤代替、評価運用へ分解する図解',
        button: /不安から接触点へのインフォグラフィックを拡大して見る/,
      },
      {
        title: 'ワークショップを、いい話で終わらせない。',
        alt: 'ワークショップの気づきを確認項目、役割分担、二週間確認、記録、戻り回路へ変える図解',
        button: /気づきから戻り回路へのインフォグラフィックを拡大して見る/,
      },
      {
        title: '同じ仕事でも、三者の見え方は違う。',
        alt: '本人、人事労務、職場上司が同じ仕事を異なる視点で見ている差を、困難、負担、満足、役割、評価へ置く図解',
        button: /三者の見え方を並べるのインフォグラフィックを拡大して見る/,
      },
      {
        title: '制度や研究を、現場の問いに翻訳する。',
        alt: '制度、研究、統計、審議会資料を、作業、時間、情報、評価、相談経路、支援など現場で確認できる問いへ翻訳する図解',
        button: /資料から観測点へのインフォグラフィックを拡大して見る/,
      },
      {
        title: 'マニュアルを増やすより、会議で使える形にする。',
        alt: '大量のマニュアルや好事例を、会議で使える一枚地図、分ける表、二週間確認、記録、見直しへ変換する図解',
        button: /資料から会議道具へのインフォグラフィックを拡大して見る/,
      },
    ]) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(article.title) }));
      expect(screen.getByAltText(article.alt)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: article.button })).toBeInTheDocument();
    }
    expect(screen.queryByText('読みどころ')).not.toBeInTheDocument();
    expect(screen.queryByText('記事と図解')).not.toBeInTheDocument();
    expect(screen.queryByText('短い記事')).not.toBeInTheDocument();
    expect(screen.queryByText('関連記事')).not.toBeInTheDocument();
    expect(screen.queryByText('仕事条件の地図に変える。')).not.toBeInTheDocument();
    expect(screen.queryByText('短い問いに、本文と図で答える。')).not.toBeInTheDocument();
    expect(screen.queryByText('読めるノート')).not.toBeInTheDocument();
    expect(screen.queryByText('NBLの論点編集面')).not.toBeInTheDocument();
    expect(screen.queryByText('SNSから来た方へ')).not.toBeInTheDocument();
    expect(screen.queryByText('会話の入口')).not.toBeInTheDocument();
    expect(screen.queryByText('社会的問いへの回答集')).not.toBeInTheDocument();
    expect(screen.queryByText(/量産ライン/)).not.toBeInTheDocument();
    expect(screen.queryByText(/母艦/)).not.toBeInTheDocument();
    expect(screen.queryByText('資料の身元を確認する')).not.toBeInTheDocument();
    expect(screen.queryByText('問い整理ノート')).not.toBeInTheDocument();
    expect(screen.queryByText(/PTD-/)).not.toBeInTheDocument();
    expect(screen.queryByText(/FQA/)).not.toBeInTheDocument();
    expect(screen.queryByText(/SCIMA\/FCHMA/)).not.toBeInTheDocument();
    expect(screen.queryByText('SNS反応を知識の根拠にする')).not.toBeInTheDocument();
    expect(screen.queryByText('個別相談を受け付ける')).not.toBeInTheDocument();
  });

  it('opens a linked article URL directly at the article reader with its toolkit connection', async () => {
    const questionNote = nextSiteCandidatePages.find((page) => page.id === 'NS-05');
    expect(questionNote).toBeDefined();

    window.history.pushState(
      null,
      '',
      '/preview/falcon-next-nbl/policy-research?article=multidisciplinary-shared-scene#article-reader',
    );

    render(<NextNblStaticSitePageCandidate page={questionNote!} />);

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: '連携は、同じ場面を見ることから始まる。',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('連携の必要性は、すでに共有されている')).toBeInTheDocument();
    expect(screen.getByText('この記事を道具にする')).toBeInTheDocument();
    expect(screen.getByText('教材 04: 連携会議の地図合わせ')).toBeInTheDocument();
    expect(
      document.querySelector(
        'a[href="/downloads/teaching-library/multidisciplinary-shared-scene-workshop-kit-v1.html"]',
      ),
    ).toBeInTheDocument();

    window.history.pushState(null, '', '/');
  });

  it('turns added cognitive toolkit packages into printable workshop tools, not just concept pages', () => {
    const kitChecks = [
      {
        fileName: 'multidisciplinary-shared-scene-workshop-kit-v1.html',
        markers: ['復職初週の月曜朝', '同じ場面シート', '4役割カード', '戻り回路シート', '場面を一つにする'],
      },
      {
        fileName: 'person-centered-icf-case-map-kit-v1.html',
        markers: ['同じ一週間の地図', 'ICF接触点カード', '次に聞く3問', '本人責任にしない'],
      },
      {
        fileName: 'accommodation-work-design-kit-v1.html',
        markers: ['仕事分解表', '二週間実験シート', '合意メモ', '名前を仮置きする'],
      },
      {
        fileName: 'support-organization-change-kit-v1.html',
        markers: ['翻訳負荷マップ', '組織機能診断ミニ', '30日改善シート', '個人技にしない'],
      },
    ];

    for (const kit of kitChecks) {
      const html = readTeachingKit(kit.fileName);
      for (const sharedMarker of [
        'USE CASE / 使う場面',
        'TOOL FLOW / 図解からワークへ',
        'ROOM SET / 会場に置くもの',
        'SCENE / 場面のリアリティ',
        'FILLED SAMPLE / 記入例',
        'FACILITATION / 進行台本',
        'PRINT SET / 印刷して使う3枚',
        'CARD DECK / 場で使う問いカード',
        'READ DOWN / 読み下し',
        '@page { size: A4; margin: 12mm; }',
        'break-inside: avoid',
      ]) {
        expect(html).toContain(sharedMarker);
      }
      for (const marker of kit.markers) {
        expect(html).toContain(marker);
      }
    }
  });

  it('frames partnership as a readable teaching product rather than a production plot', () => {
    const partnership = nextSiteCandidatePages.find((page) => page.id === 'NS-06');
    expect(partnership).toBeDefined();

    const { container } = render(<NextNblStaticSitePageCandidate page={partnership!} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '認知補助ツールキット',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('長い説明や文書では伝わりにくいことが、音楽、映像、図解、一緒に手を動かす体験で一気に見えることがあります。認知補助ツールキットは、働きづらさの具体的な問いを、共感、笑い、ひらめき、手ざわりのあるワークへ変え、同じ場面を共有する入口です。'),
    ).toBeInTheDocument();
    expect(screen.getByText('見て、聞いて、笑って、手を動かす。')).toBeInTheDocument();
    expect(screen.getByText(/多くの言葉や文書では分かりにくいことも、音楽、映像、一緒に手を動かす体験で、同じ場面としてつかみやすくなることがあります/)).toBeInTheDocument();
    expect(screen.getByAltText('参加者が図解、音楽、映像、ワークシートを囲んで、あ、そうかと気づきながら同じ場面を共有する認知補助ツールキットの図解')).toBeInTheDocument();
    expect(screen.getByText('このページ自体が入口')).toBeInTheDocument();
    expect(screen.getByText('見えると、同じ場面を話し始められる。')).toBeInTheDocument();
    expect(screen.getByText('音楽、映像、図解、ワークで、言葉だけでは届きにくい関係を場に置きます。')).toBeInTheDocument();
    expect(screen.getByText('文章で深く読む')).toBeInTheDocument();
    expect(screen.getAllByText('問いをひらく記事').length).toBeGreaterThan(0);
    expect(screen.getByText('体験で同じ場面をつかむ')).toBeInTheDocument();
    for (const rule of ['関係を一目で置く', '読む前の注意を開く', '同じ場面を直感で見る', '場で動いて確認する', '合意前の条件を書く', '誰が何を戻すか残す']) {
      expect(screen.getAllByText(rule).length).toBeGreaterThan(0);
    }
    expect(screen.getByText('体験の入口を選ぶ')).toBeInTheDocument();
    expect(screen.getByText('どの場で、見て、聞いて、手を動かしたいか。')).toBeInTheDocument();
    expect(screen.getByText('キット一覧')).toBeInTheDocument();
    expect(screen.getByText('近いテーマを選んで、すぐ開く。')).toBeInTheDocument();
    expect(screen.getByText('資料を一枚地図、分ける表、二週間確認へ変える。')).toBeInTheDocument();
    expect(screen.getByText('教材 01')).toBeInTheDocument();
    expect(screen.getByText('教材 02')).toBeInTheDocument();
    expect(screen.getByText('教材 03')).toBeInTheDocument();
    expect(screen.getByText('教材 04')).toBeInTheDocument();
    expect(screen.getByText('教材 05')).toBeInTheDocument();
    expect(screen.getByText('教材 06')).toBeInTheDocument();
    expect(screen.getByText('教材 07')).toBeInTheDocument();
    expect(screen.getByText('見えない病気と働く')).toBeInTheDocument();
    expect(screen.getByText('がんばり美談から、仕事の前提へ')).toBeInTheDocument();
    expect(screen.getByText('研修後15分で、会議に一手を残す')).toBeInTheDocument();
    expect(screen.getByText('連携会議の地図合わせ')).toBeInTheDocument();
    expect(screen.getByText('本人中心を、同じ一週間で読む')).toBeInTheDocument();
    expect(screen.getByText('配慮名の前に、仕事を分解する')).toBeInTheDocument();
    expect(screen.getByText('支援者が動ける組織へ')).toBeInTheDocument();
    expect(screen.getByText('WORK UPDATE FEST 2026')).toBeInTheDocument();
    expect(screen.getByText('音楽で入る')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /音楽フェスを開く/ })).toHaveAttribute(
      'href',
      '/resources/songs',
    );
    expect(screen.getByText('元気そう、疲れやすい、通院が多い、で止めない。')).toBeInTheDocument();
    expect(screen.getByText('ヒーローを増やすより、仕事の床を平らにする。')).toBeInTheDocument();
    expect(screen.getByText('マニュアル、通達、好事例を、今日の場面、分ける表、二週間確認へ。')).toBeInTheDocument();
    expect(screen.getByAltText('見えない負担をリュックで表した図解')).toBeInTheDocument();
    expect(screen.getByAltText('がんばり美談を仕事の前提へ戻すマンガ')).toBeInTheDocument();
    expect(screen.getByAltText('前に進めないままでの音声入口ビジュアル')).toBeInTheDocument();
    expect(screen.getByAltText('多職種が同じ仕事場面を見るインフォグラフィック')).toBeInTheDocument();
    expect(screen.getByAltText('生活機能の相互作用を仕事場面へ戻すインフォグラフィック')).toBeInTheDocument();
    expect(screen.getByAltText('合理的配慮を仕事設計へ戻すインフォグラフィック')).toBeInTheDocument();
    expect(screen.getAllByAltText('支援者の翻訳負荷を示すインフォグラフィック').length).toBeGreaterThan(0);
    expect(screen.getAllByText('実物')).toHaveLength(8);
    expect(screen.getAllByText('使う場面').length).toBeGreaterThanOrEqual(8);
    expect(screen.getByText('関係者が集まるのに、見ている場面が揃わない時')).toBeInTheDocument();
    expect(screen.getByText('場面地図、4役割カード、確認担当、戻り先')).toBeInTheDocument();
    expect(screen.getByText('本人中心を、希望だけでも支援者任せでもなく整理したい時')).toBeInTheDocument();
    expect(screen.getByText('同じ一週間の地図、相互作用カード、次に聞く3問')).toBeInTheDocument();
    expect(screen.getByText('配慮名や制度説明の前に、実際の仕事を見たい時')).toBeInTheDocument();
    expect(screen.getByText('仕事分解表、二週間確認シート、合意メモ')).toBeInTheDocument();
    expect(screen.getByText('支援者の頑張りが属人化し、組織に残らない時')).toBeInTheDocument();
    expect(screen.getByText('翻訳負荷マップ、組織機能診断ミニ、30日改善シート')).toBeInTheDocument();
    expect(screen.getByText('美談分解カード')).toBeInTheDocument();
    expect(screen.getByText('二週間確認ワーク')).toBeInTheDocument();
    expect(screen.getByText('会議ワークボード')).toBeInTheDocument();
    expect(screen.getByText('15分進行台本')).toBeInTheDocument();
    expect(screen.getByText('会議で使う3枚')).toBeInTheDocument();
    expect(screen.getAllByText('戻り回路シート').length).toBeGreaterThan(0);
    expect(screen.getByText('4役割カード')).toBeInTheDocument();
    expect(screen.getByText('同じ一週間の地図')).toBeInTheDocument();
    expect(screen.getByText('作業分解カード')).toBeInTheDocument();
    expect(screen.getByText('組織診断ミニ')).toBeInTheDocument();
    expect(screen.getAllByText('組織自己チェック').length).toBeGreaterThan(0);
    expect(screen.getByText('5観点チェック')).toBeInTheDocument();
    expect(screen.getAllByText('同じテーマを記事で読む')).toHaveLength(8);
    expect(
      document.querySelector('a[href="/preview/falcon-next-nbl/policy-research?article=manual-abundance#article-reader"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('a[href="/preview/falcon-next-nbl/policy-research?article=manual-abundance#article-reader"]'),
    ).toHaveTextContent('マニュアルを増やすより、会議で使える形にする。');
    expect(
      document.querySelector('a[href="/preview/falcon-next-nbl/policy-research?article=invisible-illness#article-reader"]'),
    ).toHaveAttribute(
      'href',
      '/preview/falcon-next-nbl/policy-research?article=invisible-illness#article-reader',
    );
    const toolkitPageText = container.querySelector('#page-flow')?.textContent ?? '';
    expect(toolkitPageText.indexOf('言葉だけでは届きにくいところへ')).toBeLessThan(
      toolkitPageText.indexOf('キット一覧'),
    );
    expect(toolkitPageText.indexOf('キット一覧')).toBeLessThan(
      toolkitPageText.indexOf('使い方'),
    );
    expect(toolkitPageText).not.toContain('この道具でできること');
    expect(toolkitPageText).not.toContain('6つの機能');
    expect(toolkitPageText).not.toContain('認知チャンネルを増やす設計');
    expect(toolkitPageText).not.toContain('持ち帰るもの');
    expect(toolkitPageText).not.toContain('詳しい読みと関連資料を開く');
    expect(toolkitPageText).not.toContain('右脳');
    expect(toolkitPageText).not.toContain('左脳');
    const kitLinks = screen.getAllByRole('link', { name: /キットを開く/ });
    expect(kitLinks).toHaveLength(8);
    expect(kitLinks[0]).toHaveAttribute(
      'href',
      '/downloads/teaching-library/invisible-illness-action-read-down-kit-v1.html',
    );
    expect(kitLinks[1]).toHaveAttribute(
      'href',
      '/downloads/teaching-library/work-assumption-shift-package-v1.html',
    );
    expect(kitLinks[2]).toHaveAttribute(
      'href',
      '/downloads/teaching-library/manual-to-meeting-package-v1.html',
    );
    expect(kitLinks[3]).toHaveAttribute(
      'href',
      '/downloads/teaching-library/multidisciplinary-shared-scene-workshop-kit-v1.html',
    );
    expect(kitLinks[4]).toHaveAttribute(
      'href',
      '/downloads/teaching-library/person-centered-icf-case-map-kit-v1.html',
    );
    expect(kitLinks[5]).toHaveAttribute(
      'href',
      '/downloads/teaching-library/accommodation-work-design-kit-v1.html',
    );
    expect(kitLinks[6]).toHaveAttribute(
      'href',
      '/downloads/teaching-library/support-organization-change-kit-v1.html',
    );
    expect(kitLinks[7]).toHaveAttribute('href', '/organizations/diagnosis');
    expect(screen.getByAltText('見えない荷物のヒーローの音声入口ビジュアル')).toBeInTheDocument();
    expect(screen.getByAltText('つなぐ光の音声入口ビジュアル')).toBeInTheDocument();
    expect(screen.getByAltText('人が先の音声入口ビジュアル')).toBeInTheDocument();
    expect(screen.getByAltText('ともに作る未来の音声入口ビジュアル')).toBeInTheDocument();
    const audioLinks = screen.getAllByRole('link', { name: /音の入口を開く/ });
    expect(audioLinks).toHaveLength(7);
    expect(audioLinks.map((link) => link.getAttribute('href'))).toEqual(
      expect.arrayContaining([
        '/songs/audio/mienai-nimotsu-no-hero.mp3',
        '/songs/audio/ganbari-yori-sekkei.mp3',
        '/songs/audio/mae-ni-susumenai-mama-de.mp3',
        '/songs/audio/tsunagu-hikari.mp3',
        '/songs/audio/hito-ga-saki.mp3',
        '/songs/audio/hairyo-ga-areba-hatarakeru.mp3',
        '/songs/audio/tomo-ni-tsukuru-mirai.mp3',
      ]),
    );
    expect(screen.queryByText('次に増やすパッケージ')).not.toBeInTheDocument();
    expect(screen.queryByText('ニーズ別に、棚を広げる。')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /関連する入口を見る/ })).not.toBeInTheDocument();
    expect(screen.getByText('使い方')).toBeInTheDocument();
    expect(screen.getByText('近いテーマを選び、同じ場面を見て、ワークで一手にする。')).toBeInTheDocument();
    expect(screen.getByText('STEP 1')).toBeInTheDocument();
    expect(screen.getByText('STEP 2')).toBeInTheDocument();
    expect(screen.getByText('STEP 3')).toBeInTheDocument();
    expect(screen.getByText('境界')).toBeInTheDocument();
    expect(screen.getByText('教材は判断ではなく、場面共有の入口です。')).toBeInTheDocument();
    expect(screen.getByText('このページは教材・研修・会議補助です。個別の就労可否、医学判断、法的判断、合理的配慮の妥当性判断を行うものではありません。')).toBeInTheDocument();
    expect(screen.queryByText('記事ライブラリ')).not.toBeInTheDocument();
    expect(screen.queryByText('読んで考えを深める')).not.toBeInTheDocument();
    expect(screen.queryByText('同じ場面を見て動かす')).not.toBeInTheDocument();
    expect(screen.queryByText('Prototype 01を見る')).not.toBeInTheDocument();
    expect(screen.queryByText('Prototype 01 / Package A')).not.toBeInTheDocument();
    expect(screen.queryByText('実物キットを開く')).not.toBeInTheDocument();
    expect(screen.queryByText('6機能を一つの体験にする')).not.toBeInTheDocument();
    expect(screen.queryByText('入口、比喩、場面、構造、ワーク、読み下しを同時に置く。')).not.toBeInTheDocument();
    expect(screen.queryByText('6機能キットを開く')).not.toBeInTheDocument();
    expect(screen.queryByText('音・短尺入口')).not.toBeInTheDocument();
    expect(screen.queryByText('見方の転換例')).not.toBeInTheDocument();
    expect(screen.queryByText('使い方を間違えない')).not.toBeInTheDocument();
    expect(screen.queryByText('ずっと言われてきたのに、動かなかった課題を教材にする。')).not.toBeInTheDocument();
    expect(screen.queryByText('従来の伝え方で落ちるもの')).not.toBeInTheDocument();
    expect(screen.queryByText('認知負荷軽減パッケージの考え方')).not.toBeInTheDocument();
    expect(screen.queryByText('教材パッケージの棚')).not.toBeInTheDocument();
    expect(screen.queryByText('素材から作る次の棚')).not.toBeInTheDocument();
    expect(screen.queryByText('教材本文 01')).not.toBeInTheDocument();
    expect(screen.queryByText('既存記事・教材の仕事設計リライト')).not.toBeInTheDocument();
    expect(screen.queryByText('最小単位:')).not.toBeInTheDocument();
    expect(screen.queryByText('持ち込む素材:')).not.toBeInTheDocument();
    expect(screen.queryByText('初回で見られるもの:')).not.toBeInTheDocument();
    expect(screen.queryByText('制作計画')).not.toBeInTheDocument();
    expect(screen.queryByText('制作工程')).not.toBeInTheDocument();
    expect(screen.queryByText('候補素材')).not.toBeInTheDocument();
    expect(screen.queryByText('1テーマ4変換')).not.toBeInTheDocument();
    expect(screen.queryByText('公開前レビューキュー')).not.toBeInTheDocument();
    expect(screen.queryByText('プロット')).not.toBeInTheDocument();
    expect(screen.queryByText('制作管理')).not.toBeInTheDocument();
    expect(screen.queryByText('作ったデモ教材')).not.toBeInTheDocument();
    expect(screen.queryByText('まず8本、実際に読める形にする。')).not.toBeInTheDocument();
    expect(screen.queryByText('コンテンツの形を変えると、考え始めやすくなる。')).not.toBeInTheDocument();
    expect(screen.queryByText('テーマ別の見せ方')).not.toBeInTheDocument();
    expect(screen.queryByText('研修前読み下し')).not.toBeInTheDocument();
    expect(screen.queryByText('疲れやすさを、仕事条件で読み直す。')).not.toBeInTheDocument();
    expect(screen.queryByText(/Falcon/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Heron/)).not.toBeInTheDocument();
  });

  it('keeps preview slug static paths away from routes that already have explicit preview pages', () => {
    const result = getPreviewSlugStaticPaths({});
    if ('then' in result) {
      throw new Error('Expected synchronous preview slug static paths');
    }

    const slugs = result.paths.map((entry) => {
      if (typeof entry === 'string') return entry;
      return String(entry.params?.slug ?? '');
    });

    expect(slugs).toEqual(expect.arrayContaining(['about', 'work-condition-window']));
    expect(slugs).not.toEqual(
      expect.arrayContaining([
        'work-design-map',
        'work-design-tools',
        'work-design-studio',
        'policy-research',
        'partnership',
        'work-assessment-concept',
      ]),
    );
  });
});
