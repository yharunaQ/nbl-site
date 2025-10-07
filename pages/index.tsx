import Head from 'next/head';
import React from 'react';
import VisionRocket from '../components/VisionRocket';
import Image from 'next/image';

export default function NBLHome() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Next Being Lab',
    url: 'https://nextbeinglab.org',
    sameAs: ['https://www.youtube.com/@next-being-lab'],
    description: '難病就労支援・障害者雇用の研究と実装ユニット。合理的配慮を科学し社会実装する。',
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Head>
        <title>Next Being Lab | 働くは設計できる。</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="canonical" href="https://nextbeinglab.org/" />
        <meta
          name="description"
          content="不公平の見える化を、合意可能な設計へ。難病就労支援・障害者雇用の研究と社会実装ユニット。"
        />
        <meta name="robots" content="index,follow" />
        {/* Open Graph */}
        <meta property="og:site_name" content="Next Being Lab" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nextbeinglab.org/" />
        <meta property="og:title" content="Next Being Lab | 働くは設計できる。" />
        <meta property="og:description" content="働くは設計できる。At work, CAN matters." />
        <meta property="og:image" content="https://nextbeinglab.org/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Next Being Lab — 働くは設計できる。" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Next Being Lab | 働くは設計できる。" />
        <meta name="twitter:description" content="働くは設計できる。At work, CAN matters." />
        <meta name="twitter:image" content="https://nextbeinglab.org/og.png" />

        {/* PWA/Chrome UI 小物（任意） */}
        <meta name="theme-color" content="#111827" />
        <meta name="format-detection" content="telephone=no" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Next Being Lab',
              url: 'https://nextbeinglab.org',
              email: 'info@nextbeinglab.org',
              logo: 'https://nextbeinglab.org/og.png',
              sameAs: ['https://blog.nextbeinglab.org', 'https://www.youtube.com/@next-being-lab'],
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  email: 'info@nextbeinglab.org',
                  contactType: 'customer support',
                  availableLanguage: ['ja', 'en'],
                },
              ],
              description:
                '難病就労支援・障害者雇用の研究と実装ユニット。合理的配慮を科学し社会実装する。',
            }),
          }}
        />

        {/* JSON-LD: Person (Founder) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Yuichiro Haruna',
              jobTitle: 'Founder & Scientist',
              affiliation: {
                '@type': 'Organization',
                name: 'Next Being Lab',
                url: 'https://nextbeinglab.org',
              },
              url: 'https://nextbeinglab.org/blog',
              email: 'info@nextbeinglab.org',
            }),
          }}
        />

        {/* RSS（ブログを運用中なら） */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="NBL Blog"
          href="https://blog.nextbeinglab.org/feed"
        />
      </Head>

    {/* Top Nav */}
    <nav className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur" data-testid="top-nav">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-emerald-400" />
          <span className="font-semibold tracking-wide">Next Being Lab</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#vision" className="hover:opacity-80" data-testid="nav-vision">ビジョン</a>
          <a href="#phase1" className="hover:opacity-80">NBL（Phase 1）</a>
          <a href="#product" className="hover:opacity-80">JACα(製品)</a>
          <a href="#services" className="hover:opacity-80">サービス</a>
          <a href="#reports" className="hover:opacity-80">レポート</a>
          <a href="#campaign" className="hover:opacity-80">キャンペーン</a>
          <a href="#contact" className="hover:opacity-80">連絡</a>
        </div>
        <a href="#poc" className="rounded-2xl px-4 py-2 bg-white border shadow-sm" aria-label="実証パイロット（PoC）の詳細へ">実証パイロット（PoC）とは？</a>
      </div>
    </nav>

      {/* Hero */}
      <header className="relative overflow-hidden" data-testid="hero">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-5 md:max-w-2xl">
            <span className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs md:text-sm bg-white/70 backdrop-blur">
              Next Being Lab — 人間の存在意義を拡張する社会インフラ
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              働くは設計できる。
              <br className="hidden md:block" />
              <span className="text-gray-700">At work, CAN matters.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-700">
              難病・慢性疾患・多様な特性を前提に、課題の見える化から配慮設計・運用・
              成果の評価までを<span className="font-semibold">一本化</span>。現場と科学で進めます。
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#product" className="rounded-2xl px-4 py-2 bg-gray-900 text-white shadow">
                JAC α を見る
              </a>
              <a href="#reports" className="rounded-2xl px-4 py-2 bg-white border shadow-sm">
                レポート（PDF）
              </a>
              <a href="#campaign" className="rounded-2xl px-4 py-2 bg-white border shadow-sm">
                CAN &gt; CAN'T
              </a>
              <a href="#vision" className="rounded-2xl px-4 py-2 bg-white border shadow-sm">
                ビジョン
              </a>
              <a href="/blog" className="rounded-2xl px-4 py-2 bg-white border shadow-sm">
                Founder’s Blog
              </a>
            </div>
          </div>
          <div className="rounded-3xl border bg-white shadow-sm p-6">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">JAC α（2025-10開始）</span>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs border">
                  実証パイロット（PoC）募集
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  '提案',
                  '申請',
                  '実装',
                  'KPI',
                  'テンプレ',
                  '非同期会議',
                  '温度配慮',
                  'NCヘッドホン',
                  '在宅・ハイブリッド',
                  '通勤時差',
                  'タスク分担',
                  '安全制限',
                ]
                  .slice(0, 9)
                  .map((t, i) => (
                    <div
                      key={i}
                      className="rounded-xl border px-3 py-2 text-xs text-gray-700 bg-gray-50"
                    >
                      {t}
                    </div>
                  ))}
              </div>
              <div className="flex gap-3 pt-2">
                <a href="#poc" className="rounded-xl px-3 py-2 bg-gray-900 text-white text-sm">
                  実証パイロット（PoC）相談
                </a>
                <a href="#downloads" className="rounded-xl px-3 py-2 border text-sm">
                  ドキュメント
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust strip（リンク付きチップ） */}
      <section aria-label="信頼の根拠" className="border-y bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <ul className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
            <li>
              <a
                href="#about"
                className="inline-flex items-center rounded-full border px-3 py-1 bg-gray-50 hover:bg-gray-100 hover:underline"
              >
                当事者・企業・支援者協働
              </a>
            </li>
            <li>
              <a
                href="/docs/houkoku126_summary.pdf"
                className="inline-flex items-center rounded-full border px-3 py-1 bg-gray-50 hover:bg-gray-100 hover:underline"
              >
                ICF / EBPM 基盤
              </a>
            </li>
            <li>
              <a
                href="#product"
                className="inline-flex items-center rounded-full border px-3 py-1 bg-gray-50 hover:bg-gray-100 hover:underline"
              >
                合理的配慮の標準化（JAC）
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="inline-flex items-center rounded-full border px-3 py-1 bg-gray-50 hover:bg-gray-100 hover:underline"
              >
                講義・政策・実装の一体化
              </a>
            </li>
            <li>
              <a
                href="https://creativecommons.org/licenses/by/4.0/deed.ja"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border px-3 py-1 bg-gray-50 hover:bg-gray-100 hover:underline"
              >
                オープンアクセス（CC BY 4.0）
              </a>
            </li>
            <li>
              <a
                href="#vision"
                className="inline-flex items-center rounded-full border px-3 py-1 bg-gray-50 hover:bg-gray-100 hover:underline"
              >
                合意形成デザイン
              </a>
            </li>
          </ul>
        </div>
      </section>

        {/* ============================
           Vision セクション（5カラム基礎グリッド）
           - md以上: 左2列 = 説明＋イラスト、右3列 = ステージ3枚＋補助2枚
           - モバイル: すべて縦積み
        =============================*/}
        <section
          id="vision"
          data-testid="vision"
          className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-5 gap-8 items-start"
        >
          {/* LEFT: 説明＋イラスト（md以上で全5列中の2列を使用） */}
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Next Being ビジョン — <span className="whitespace-nowrap">AGI前夜に間に合う</span>デザイン
            </h2>
        
            {/* リード文：AGI転回点とNBLの役割 */}
            <p className="text-gray-700 leading-relaxed">
              猿 → 人間 → <span className="whitespace-nowrap">人間＋AI</span> →{" "}
              <span className="font-semibold">Next Being</span>。
              <br className="hidden md:block" />
              2027年、汎用AI(AGI)が社会の基本動作に溶ける<strong className="font-semibold">転回点</strong>が来ると言われます。
              NBLはこの前後を跨いで、
              <span className="font-semibold">人×AI×コミュニティ×環境</span>が協働する“次の在り方”を設計し、
              <span className="font-semibold">設計・標準・物語</span>を実装します。
            </p>
        
            {/* サブリード：姿勢の宣言（短文） */}
            <div className="mt-2 text-xs text-gray-600">
              シンギュラリティは終着点ではなく、<span className="font-semibold">人間拡張の始動点</span>。
              尊厳が主軸に残るガードレールを、今つくる。
            </div>
        
            {/* イラスト（VisionRocket を使わない時は画像で） */}
            <div className="mt-4">
              {/* VisionRocket を使うなら次の1行のコメントを外す */}
              {/* <VisionRocket /> */}
              <Image
                src="/images/evolution-nextbeing3.webp"
                alt="猿→人間→人間＋AGI→Next Being（AGIで人類・地球がつながるイメージ）"
                width={1200}
                height={600}
                priority
              />
            </div>
          </div>
        
          {/* RIGHT: ステージ3枚（横3カラム）＋補助2枚（横2カラム） = 合計3列領域 */}
          <div className="md:col-span-3 grid gap-4">
            {/* ステージカード：md以上で3列グリッド／モバイルは縦積み */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Phase 1 */}
              <article className="rounded-2xl border p-5 shadow-sm bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-gradient-to-r from-sky-50 to-indigo-50">
                    Phase 1
                  </span>
                  <span className="text-xs text-gray-500">（2025–2026）</span>
                </div>
                <h3 className="font-medium mb-1">不公平の見える化 — 公平を“運用可能”に</h3>
                <p className="text-gray-700 text-sm">
                  データ×現場の言語化で指標を整備し、合理的配慮を科学。
                  <span className="whitespace-nowrap">提案→申請→実装→KPI</span> を一筆書きにする（
                  <span className="whitespace-nowrap">JAC／Playbook</span>）。
                </p>
                <ul className="mt-3 text-xs text-gray-600 list-disc pl-4 space-y-1">
                  <li>症状×タスク×KPIの語彙統一</li>
                  <li>非同期前提の業務分解と配慮カタログ</li>
                  <li>職場運用チェックリストと監査可能性</li>
                </ul>
              </article>
        
              {/* Phase 2 */}
              <article className="rounded-2xl border p-5 shadow-sm bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-gradient-to-r from-fuchsia-50 to-rose-50">
                    Phase 2
                  </span>
                  <span className="text-xs text-gray-500">（2026–2029）</span>
                </div>
                <h3 className="font-medium mb-1">AGI前夜 — 人間＋AGIの共同行為を標準化</h3>
                <p className="text-gray-700 text-sm">
                  協調エージェントが仕事・学び・ケアを共同設計。意思決定は
                  <span className="font-semibold">人が主</span>、AGIは
                  <span className="font-semibold">可視化・最適化・安全装置</span>を担う。
                </p>
                <ul className="mt-3 text-xs text-gray-600 list-disc pl-4 space-y-1">
                  <li>役割分担のガードレール（人が決める／AGIが支える）</li>
                  <li>負荷調整・説明責任・偏り検知の自動化</li>
                  <li>「存在の物語」を評価へ接続（納得の合意）</li>
                </ul>
                <div className="mt-2 text-[11px] text-gray-500">
                  AGIは補助輪。ハンドルは人に。— <span className="font-semibold">Human-in-Command</span>
                </div>
              </article>
        
              {/* Phase 3 */}
              <article className="rounded-2xl border p-5 shadow-sm bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-gradient-to-r from-amber-50 to-emerald-50">
                    Phase 3
                  </span>
                  <span className="text-xs text-gray-500">（2030+）</span>
                </div>
                <h3 className="font-medium mb-1">Next Being Commons — 社会実装のコモンズ化</h3>
                <p className="text-gray-700 text-sm">
                  支援・学習・労働が公共圏に開かれ、再利用可能に。評価は
                  <span className="whitespace-nowrap"> 尊厳・貢献・持続可能性 </span>の三軸。
                </p>
                <ul className="mt-3 text-xs text-gray-600 list-disc pl-4 space-y-1">
                  <li>企業・自治体と実証→標準化（オープン仕様）</li>
                  <li>ライセンスとAPIで再利用性を担保（AGI可読）</li>
                  <li>フェアネス指標の社会合意と監査制度</li>
                </ul>
              </article>
            </div>
        
            {/* 補助カード：md以上で2列グリッド／モバイルは縦積み */}
            <div className="grid md:grid-cols-2 gap-4">
              <article className="rounded-2xl border p-5 shadow-sm bg-white">
                <h3 className="font-medium mb-1">AGI時代の設計原則</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                  <li>尊厳を埋め込む（Dignity by Design）</li>
                  <li>支援が自律を拡張する（Autonomy with Assistance）</li>
                  <li>安全・説明責任・反証可能性（可視化とログ）</li>
                  <li>インクルージョンとアクセシビリティ（人中心UI）</li>
                  <li>オープンナレッジと再利用性（CC BY／API）</li>
                  <li>エビデンス・ファースト、物語で拡張</li>
                  <li>持続可能性と楽しさ（Joy）</li>
                </ul>
              </article>
        
              <article className="rounded-2xl border p-5 shadow-sm bg-white">
                <h3 className="font-medium mb-1">いま問いたいリサーチクエスチョン</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                  <li>症状×タスク×KPIの語彙はどこまで一般化できるか</li>
                  <li>配慮の効果を“チーム成果”で測る最小指標は何か</li>
                  <li>AGI協調は個人の自律と創造性をどう拡張しうるか</li>
                  <li>公平性の可視化は意思決定のスピードを上げるか</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* NBL（Phase 1） */}
        <section id="phase1" data-testid="phase1" className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Next Being Lab（Phase 1）— 運用可能な公平性
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Next Being Lab（NBL）は、人×AI×コミュニティが共創する次の社会に向けた研究・実装ラボです。
              Phase 1では、難病・慢性疾患・ニューロダイバージェンスを前提に、現場の“不公平”をデータで可視化し、
              <span className="font-semibold">誰もが運用できる合意設計</span>へ翻訳します。
            </p>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">JAC（Job Accommodation Copilot）</span> と
              <span className="font-semibold">Accommodation Playbook</span> を核に、
              <span className="whitespace-nowrap">提案→申請→実装→KPI</span> を一筆書きにし、
              働き方・学び方・暮らし方の標準を現場からつくります。
            </p>
            <div className="mt-4">
              {/* <VisionRocket /> */}
              <Image
                src="/images/EEJ2.webp"
                alt="Equality: 同じ踏み台でも背の低い人は見えない。Equity: 必要な数の踏み台で全員が見える。Justice: 塀を網フェンスに替え、踏み台なしでも全員見える。"
                width={1200}
                priority
              />
            </div>
            {/* Founder’s Note（リンクだけ） */}
            <article className="rounded-2xl border p-5 shadow-sm bg-white">
              <h3 className="font-medium mb-1">Founder’s Note</h3>
              <p className="text-sm text-gray-600 mb-3">
                春名由一郎（Founder/Scientist）が、現場の声×研究の気づきを短く更新。
                合意可能な設計と実装の途中経過を記録します。
              </p>
              <a href="/blog" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-gray-900 text-white shadow">
                最新記事を読む
              </a>
            </article>

          </div>
        
          <div className="md:col-span-3 grid gap-4">

             {/* NBLの4つの柱（Phase 1 に内包） */}
            <div className="rounded-2xl border p-5 shadow-sm bg-white">
              <h3 className="font-medium mb-3">NBLの4つの柱（Phase 1 の推進要素）</h3>
            
              {/* md以上=2列、lg以上=4列。モバイルは縦積み */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Product */}
                <article className="rounded-xl border p-4 bg-white">
                  <div className="text-xs text-gray-500 mb-1">Product</div>
                  <div className="font-medium mb-1">JAC：提案→申請→実装→KPI</div>
                  <p className="text-xs text-gray-600 mb-2">配慮の一筆書き運用を最小UIで提供。</p>
                  <a href="#product" className="text-sm underline">JACを見る</a>
                </article>
            
                {/* Standard */}
                <article className="rounded-xl border p-4 bg-white">
                  <div className="text-xs text-gray-500 mb-1">Standard</div>
                  <div className="font-medium mb-1">Accommodation Playbook</div>
                  <p className="text-xs text-gray-600 mb-2">現場で回る標準手順とテンプレ群。</p>
                  <a href="#phase1" className="text-sm underline">概要</a>
                </article>
            
                {/* Research */}
                <article className="rounded-xl border p-4 bg-white">
                  <div className="text-xs text-gray-500 mb-1">Research</div>
                  <div className="font-medium mb-1">ICF/EBPM 実証とレポート</div>
                  <p className="text-xs text-gray-600 mb-2">症状×タスク×KPIの語彙と検証。</p>
                  <a href="#reports" className="text-sm underline">レポート</a>
                </article>
            
                {/* Narrative */}
                <article className="rounded-xl border p-4 bg-white">
                  <div className="text-xs text-gray-500 mb-1">Narrative</div>
                  <div className="font-medium mb-1">CAN &gt; CAN'T キャンペーン</div>
                  <p className="text-xs text-gray-600 mb-2">配慮を物語化し合意形成を加速。</p>
                  <a href="#campaign" className="text-sm underline">キャンペーン</a>
                </article>
              </div>
            </div>  
          
            <div className="rounded-2xl border p-5 shadow-sm bg-white">
              <h3 className="font-medium mb-1">フォーカス領域</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>難病・慢性疾患×就労の国際比較と政策実装</li>
                <li>合理的配慮の科学化（症状×タスク×KPI）</li>
                <li>合意形成／物語化／評価指標の社会実装</li>
              </ul>
            </div>
            <div className="rounded-2xl border p-5 shadow-sm bg-white">
              <h3 className="font-medium mb-1">提供物</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>JAC（Job Accommodation Copilot）</li>
                <li>Accommodation Playbook（日本版）</li>
                <li>オープンレポート／講義／研修・認定</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product: JAC */}
        <section id="product" data-testid="product" className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* 左カラム：要点と資料 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                JAC（Job Accommodation Copilot）
              </h2>
              <p className="text-gray-700">
                診断名ではなく <span className="font-semibold">タスク条件 × 症状像</span> で配慮を設計。
                設計→合意→実装→KPIを一筆書きで回し、調整後の実力（Design-Adjusted Merit）で評価します。
                主役は人、AIは<span className="whitespace-nowrap"> 可視化・最適化・安全装置 </span>を担う
                <span className="whitespace-nowrap"> Human-in-Command</span>。
              </p>
        
              {/* 特徴 */}
              <ul className="list-disc pl-5 text-gray-700 space-y-1 my-5">
                <li>レコメンド：症状×タスクから配慮案（カタログ連動）</li>
                <li>テンプレ出力：本人／上長／人事のPDF様式</li>
                <li>KPI：欠勤・疲労NRS・自己生産性・実装率（監査可能ログ）</li>
                <li>プライバシー：病名を扱わず抽象度で設計（最小限データ）</li>
              </ul>
        
              {/* ドキュメント */}
              <div className="flex flex-wrap gap-3" id="downloads">
                <a href="/docs/JAC_Alpha_Requirements_1Pager.md" className="rounded-xl px-3 py-2 border text-sm">仕様1-Pager（α）</a>
                <a href="/docs/JAC_Accommodation_Catalog_v0_3.yaml" className="rounded-xl px-3 py-2 border text-sm">配慮カタログ（YAML）</a>
                <a href="/docs/JAC_DisclosureLanguage_Templates_v0_3.md" className="rounded-xl px-3 py-2 border text-sm">合意・開示テンプレ</a>
              </div>
        
              {/* ICF図 */}
              <figure className="mt-4 md:max-w-[500px] mx-auto">
                <Image
                  src="/images/ICF.webp"
                  alt="職種・就業条件・職場環境・支援等が相互作用するモデル（ICF）"
                  width={672}
                  height={420}
                  sizes="(min-width: 768px) 500px, 100vw"
                  className="rounded-2xl border shadow-sm w-full h-auto"
                  priority
                />
              </figure>
        
            </div>
        
            {/* 右カラム：3ステップ（上）＋ サンプル配慮（下） */}
            <div className="grid gap-4">
              {/* 3ステップ */}
              <div className="rounded-3xl border bg-white shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-3">JACの流れ（3ステップ）</div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border p-4 bg-white shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Step 1</div>
                    <div className="font-medium">設計</div>
                    <p className="text-xs text-gray-600">
                      症状×タスクを分解し、配慮候補をレコメンド（カタログ連動）。
                    </p>
                  </div>
                  <div className="rounded-2xl border p-4 bg-white shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Step 2</div>
                    <div className="font-medium">合意</div>
                    <p className="text-xs text-gray-600">
                      本人・上長・人事の文章を自動整形し、合意文書を生成。
                    </p>
                  </div>
                  <div className="rounded-2xl border p-4 bg-white shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Step 3</div>
                    <div className="font-medium">KPI</div>
                    <p className="text-xs text-gray-600">
                      欠勤・疲労NRS・自己生産性・実装率などを軽量に記録。
                    </p>
                  </div>
                </div>
              </div>
        
              {/* サンプル配慮 */}
              <div className="rounded-3xl border bg-white shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-3">サンプル配慮（抜粋）</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    '短時間勤務＋可変コアタイム',
                    '在宅・ハイブリッド',
                    '作業ペース配分',
                    '温度調整',
                    'ノイズコントロール',
                    '音声入力・読み上げ',
                    'タスク・ローテーション',
                    '席の近接配慮',
                    '会議の非同期化',
                    '通勤配慮',
                    '安全優先のタスク制限',
                    '視覚負荷軽減',
                  ].map((t, i) => (
                    <div key={i} className="rounded-xl border p-4 text-sm bg-gray-50">{t}</div>
                  ))}
                </div>
        
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="#poc" className="rounded-xl px-4 py-2 bg-gray-900 text-white text-sm">
                    実証パイロット（PoC）の相談をする
                  </a>
                  <a href="#pricing" className="rounded-xl px-4 py-2 border text-sm">
                    料金を見る
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

    {/* PoC / Pilot */}
    <section id="poc" data-testid="poc" className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">実証パイロット（PoC）とは？</h2>
      <p className="text-gray-700 mb-5">
        小さく早く検証して、<span className="font-semibold">“できる”を証明</span>する短期プロジェクトです。
        NBLの <span className="font-semibold">JAC（Job Accommodation Copilot）</span> と
        <span className="font-semibold">Accommodation Playbook</span> を使い、
        <span className="whitespace-nowrap">提案→申請→実装→KPI</span> を2〜4週間で一筆書きに回します。
      </p>

      {/* Services */}
      <section id="services" data-testid="services" className="mx-auto max-w-7xl px-6 py-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">サービス</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <div className="text-xs text-gray-500 mb-1">30日クイックアセスメント</div>
            <div className="font-medium mb-2">現状把握と改善優先度の可視化</div>
            <p className="text-sm text-gray-700 mb-3">
              ヒアリング→タスク分解→配慮実装余地→KPI合意。
            </p>
            <a href="#contact" className="text-sm underline">
              相談する
            </a>
          </div>
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <div className="text-xs text-gray-500 mb-1">研修・講義・認定</div>
            <div className="font-medium mb-2">職場配慮デザイン認定（仮）</div>
            <p className="text-sm text-gray-700 mb-3">現場導入の標準手順と評価設計を習得。</p>
            <a href="#reports" className="text-sm underline">
              教材と資料
            </a>
          </div>
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <div className="text-xs text-gray-500 mb-1">PoC/共同研究</div>
            <div className="font-medium mb-2">JAC α/β 導入サポート</div>
            <p className="text-sm text-gray-700 mb-3">2〜4週間の小さな試行から開始できます。</p>
            <a href="#contact" className="text-sm underline">
              問い合わせ
            </a>
          </div>
        </div>
      </section>
    
        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-7xl px-6 py-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">料金（目安）</h2>
          <p className="text-gray-700 mb-5 text-sm">
            実施規模・対象人数・データ連携の有無などで変動します。ここは「目安」です。
            詳細は <a href="#contact" className="underline">お問い合わせ</a> ください。
          </p>
        
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border p-5 bg-white shadow-sm">
              <div className="text-xs text-gray-500 mb-1">2–4週間</div>
              <div className="font-medium">PoC（小規模検証）</div>
              <p className="text-sm text-gray-700 mt-2">
                少人数・1部門で仮説検証。<br/>
                <span className="text-gray-600 text-xs">
                  価格レンジ：<span className="italic">要相談（数値が決まり次第ここに記載）</span>
                </span>
              </p>
            </div>
        
            <div className="rounded-2xl border p-5 bg-white shadow-sm">
              <div className="text-xs text-gray-500 mb-1">約3か月</div>
              <div className="font-medium">Pilot（実装テスト）</div>
              <p className="text-sm text-gray-700 mt-2">
                複数部署での標準手順・評価設計の検証。<br/>
                <span className="text-gray-600 text-xs">価格レンジ：<span className="italic">要相談</span></span>
              </p>
            </div>
        
            <div className="rounded-2xl border p-5 bg-white shadow-sm">
              <div className="text-xs text-gray-500 mb-1">研修／単発</div>
              <div className="font-medium">研修・認定（職場配慮デザイン認定（仮） ほか）</div>
              <p className="text-sm text-gray-700 mt-2">
                現場導入の標準手順と評価設計。<br/>
                <span className="text-gray-600 text-xs">価格レンジ：<span className="italic">要相談</span></span>
              </p>
            </div>
          </div>        
        </section>

      {/* CTA */}
      <div className="flex flex-wrap gap-3 mt-6">
        <a
          className="rounded-2xl px-4 py-2 bg-gray-900 text-white shadow"
          href="mailto:info@nextbeinglab.org?subject=NBL%20PoC%E7%9B%B8%E8%AB%87&body=%E3%80%90%E6%A1%88%E4%BB%B6%E5%90%8D%E3%80%91%0A%E3%80%90%E5%AF%BE%E8%B1%A1%E9%83%A8%E7%BD%B2%E3%83%BB%E4%BA%BA%E6%95%B0%E3%80%91%0A%E3%80%90%E5%B0%8F%E5%88%86%E9%A1%9E%E3%80%91Starter%20(30-60%E4%B8%87%E5%86%86)%2FStandard%20(80-150%E4%B8%87%E5%86%86)%2FCustom%0A%E3%80%90%E6%9C%9F%E9%96%93%E3%80%912%E9%80%B1%E9%96%93%2F4%E9%80%B1%E9%96%93%2F%E3%81%9D%E3%81%AE%E4%BB%96%0A%E3%80%90%E4%BA%88%E7%AE%97%E6%84%9F%E3%80%91%0A%E3%80%90NDA%E3%80%91%E6%9C%89%E3%82%8A%2F%E7%84%A1%E3%81%97"
          aria-label="メールでPoC相談"
        >
          料金の相談・見積依頼（メール）
        </a>
        <a className="rounded-2xl px-4 py-2 border shadow-sm" href="#contact">フォームで連絡</a>
        <a className="rounded-2xl px-4 py-2 border shadow-sm" href="/docs/JAC_Alpha_Requirements_1Pager.md">1-Pagerを読む</a>
      </div>
    
      {/* FAQ */}
      <details className="mt-6 rounded-2xl border p-5 bg-white shadow-sm">
        <summary className="cursor-pointer font-medium">よくある質問</summary>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mt-3">
          <li>対象：企業／自治体／NPO。部署単位の小規模からOK。</li>
          <li>データ：個人情報は扱わず、タスク条件×症状像で設計します。</li>
          <li>NDA：必要に応じて締結可能。ログと監査可能性を重視。</li>
          <li>期間：2〜4週間（意思決定の速さを優先）。</li>
        </ul>
      </details>
    </section>


      {/* Reports */}
      <section id="reports" data-testid="reports" className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">最新レポート・資料</h2>
          <a href="#" className="text-sm text-gray-600 hover:underline">
            すべて見る
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: '難病就労支援：国際比較2025（速報）',
              desc: '制度と現場のベストプラクティスを8頁で凝縮。',
              href: '/docs/houkoku126_summary.pdf',
            },
            {
              title: '雇用の質×合理的配慮：設計ガイド',
              desc: '非同期会議・在宅・温度/騒音配慮の実務手順。',
              href: '/docs/remote-accommodation.pdf',
            },
            {
              title: '巻頭言：職業リハビリテーションの黄金期はこれから',
              desc: '2025/07 読み物版。',
              href: '/docs/01-巻頭言-春名.pdf',
            },
          ].map((r, i) => (
            <article key={i} className="rounded-2xl border overflow-hidden shadow-sm bg-white">
              <div className="aspect-video bg-gradient-to-br from-indigo-50 to-sky-50" />
              <div className="p-5">
                <h3 className="font-medium mb-1">{r.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{r.desc}</p>
                <div className="flex gap-3">
                  <a href={encodeURI(r.href)} className="text-sm underline">
                    PDF（CC BY）
                  </a>
                  <a href="#video" className="text-sm underline">
                    10分講義
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            {
              title: 'リハ協カフェ講演資料',
              desc: '2025/07/31 ウェブ講演スライド。',
              href: '/docs/リハ協カフェ20250731春名2.pdf',
            },
            {
              title: '京都難病2025 プレゼン',
              desc: '企画スライド案（PPTX）',
              href: '/docs/京都難病2025.pptx',
            },
            {
              title: '難病患者の雇用促進：研究会まとめ',
              desc: '議論要旨と提案（DOCX）',
              href: '/docs/難病患者の雇用促進に関する研究会の議論まとめ.docx',
            },
          ].map((r, i) => (
            <article key={i} className="rounded-2xl border overflow-hidden shadow-sm bg-white">
              <div className="aspect-video bg-gradient-to-br from-amber-50 to-emerald-50" />
              <div className="p-5">
                <h3 className="font-medium mb-1">{r.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{r.desc}</p>
                <div className="flex gap-3">
                  <a href={encodeURI(r.href)} className="text-sm underline">
                    資料
                  </a>
                  <a href="#join" className="text-sm underline">
                    相談する
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Campaign */}
      <section
        id="campaign"
        data-testid="campaign"
        className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center"
      >
        <div className="rounded-3xl border overflow-hidden shadow-sm bg-white">
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/7aD6tQn3qW8"
              title="CAN > CAN'T ダイジェスト"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">CAN &gt; CAN'T キャンペーン</h2>
          <p className="text-gray-700 mb-4">
            職場の“できない前提”を“できる設計”へ。60秒ショートで配慮の具体を可視化し、企業の配慮担当者をヒーローにします。
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4">
            <li>ショート動画：非同期会議／温度配慮／NCヘッドホン</li>
            <li>『合理的配慮100の実装』図鑑（写真＋1枚1配慮）</li>
            <li>“開示の言語”テンプレ：本人→上長→人事→産業医</li>
          </ul>
          <a href="#reports" className="rounded-xl px-4 py-2 bg-gray-900 text-white text-sm">
            図鑑（準備中）を見る
          </a>
        </div>
      </section>

      {/* Join / Contact */}
      <section id="contact" data-testid="contact" className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border shadow-sm p-8 md:p-10 bg-gradient-to-br from-white to-sky-50">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">
            一緒に社会実装を進めませんか？
          </h2>
          <p className="text-gray-700 mb-5">
            編集・広報・合意形成が得意な方、当事者・企業・自治体の皆さまを歓迎します。小さな試行（2〜4週間）から。
          </p>
          <form className="grid md:grid-cols-3 gap-3" onSubmit={(e) => e.preventDefault()}>
            <input className="rounded-2xl border px-4 py-2" placeholder="お名前" />
            <input
              className="rounded-2xl border px-4 py-2"
              placeholder="メールアドレス"
              type="email"
            />
            <button className="rounded-2xl px-4 py-2 bg-gray-900 text-white shadow">
              関心を送る
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            フォームが使えない場合は{' '}
            <a className="underline" href="mailto:info@nextbeinglab.org">
              info@nextbeinglab.org
            </a>{' '}
            へ。
          </p>
        </div>
      </section>

        {/* Footer */}
        <footer className="border-t">
          <div className="mx-auto max-w-7xl px-6 py-10 grid md:grid-cols-4 gap-6 items-start text-sm text-gray-600">
            <div className="md:col-span-2">
              <div className="font-medium mb-1">Next Being Lab</div>
              <p>
                このサイトのコンテンツは、
                <a className="underline" href="https://creativecommons.org/licenses/by/4.0/deed.ja" target="_blank" rel="noreferrer">CC BY 4.0</a>
                で提供しています。
              </p>
              <p className="mt-2">
                お問い合わせ: <a className="underline" href="mailto:info@nextbeinglab.org">info@nextbeinglab.org</a>
              </p>
              <p className="mt-2">© {new Date().getFullYear()} Next Being Lab — Justice & Innovation for a Generative, Equitable Era.</p>
            </div>
        
            <div className="flex flex-col gap-1">
              <div className="font-medium mb-1">利用ガイド</div>
              <a className="underline" href="#phase1">NBL（Phase 1）</a>
              <a className="underline" href="#product">JAC</a>
              <a className="underline" href="#services">サービス</a>
            </div>
        
            <div className="flex flex-col gap-1">
              <div className="font-medium mb-1">リソース</div>
              <a className="underline" href="#reports">レポート</a>
              <a className="underline" href="#campaign">キャンペーン</a>
              <a className="underline" href="#downloads">ドキュメント</a>
              <a className="underline" href="/blog">Founder’s Blog</a>
            </div>
          </div>
        </footer>
    </div>
  );
}
