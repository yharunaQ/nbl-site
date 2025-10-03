import Head from 'next/head';
import React from 'react';
import VisionRocket from "@/components/VisionRocket";

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
  <link rel="canonical" href="https://nextbeinglab.org/" />
  <meta name="description" content="不公平の見える化を、合意可能な設計へ。難病就労支援・障害者雇用の研究と社会実装ユニット。" />
  <meta property="og:title" content="Next Being Lab" />
  <meta property="og:description" content="働くは設計できる。At work, CAN matters." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://nextbeinglab.org/" />
  <meta property="og:image" content="https://nextbeinglab.org/og.png" />
  <meta name="twitter:image" content="https://nextbeinglab.org/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <script
    type="application/ld+json"
    // Organizationスキーマ（email/同一URL/ロゴも付与）
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Next Being Lab',
        url: 'https://nextbeinglab.org',
        email: 'info@nextbeinglab.org',
        logo: 'https://nextbeinglab.org/og.png',
        sameAs: ['https://www.youtube.com/@next-being-lab'],
        description: '難病就労支援・障害者雇用の研究と実装ユニット。合理的配慮を科学し社会実装する。'
      })
    }}
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
            <a href="#about" className="hover:opacity-80">NBLとは</a>
            <a href="#pillars" className="hover:opacity-80">4つの柱</a>
            <a href="#product" className="hover:opacity-80">JAC（製品）</a>
            <a href="#services" className="hover:opacity-80">サービス</a>
            <a href="#reports" className="hover:opacity-80">レポート</a>
            <a href="#campaign" className="hover:opacity-80">キャンペーン</a>
            <a href="#vision" className="hover:opacity-80" data-testid="nav-vision">ビジョン</a>
            <a href="#contact" className="hover:opacity-80">連絡</a>
          </div>
          <a href="#poc" className="rounded-xl px-3 py-1.5 text-sm bg-gray-900 text-white shadow">PoC募集</a>
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
              <span className="whitespace-nowrap">働くは設計できる。</span>{' '}
              <span className="text-gray-700">At work, CAN matters.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-700">
              現場感覚 × 学術の厳密性 × 実装力 × 物語化 × 財務妥当性。難病・慢性疾患・ニューロダイバージェンスを前提に、
              不公平の見える化を<span className="font-semibold">合意可能な設計</span>へ。政策・職場・当事者の三位一体で進めます。
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#product" className="rounded-2xl px-4 py-2 bg-gray-900 text-white shadow">JACを見る</a>
              <a href="#reports" className="rounded-2xl px-4 py-2 bg-white border shadow-sm">最新レポート</a>
              <a href="#campaign" className="rounded-2xl px-4 py-2 bg-white border shadow-sm">CAN &gt; CAN'T</a>
              <a href="#vision" className="rounded-2xl px-4 py-2 bg-white border shadow-sm" data-testid="hero-vision">ビジョン</a>
            </div>
          </div>
          <div className="rounded-3xl border bg-white shadow-sm p-6">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">JAC α（2025-10開始）</span>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs border">PoC募集</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['提案','申請','実装','KPI','テンプレ','非同期会議','温度配慮','NCヘッドホン','在宅・ハイブリッド','通勤時差','タスク分担','安全制限'].slice(0,9).map((t,i)=>(
                  <div key={i} className="rounded-xl border px-3 py-2 text-xs text-gray-700 bg-gray-50">{t}</div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <a href="#poc" className="rounded-xl px-3 py-2 bg-gray-900 text-white text-sm">PoC相談</a>
                <a href="#downloads" className="rounded-xl px-3 py-2 border text-sm">ドキュメント</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust strip */}
      <div className="border-y bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-2 md:grid-cols-6 gap-4 text-xs md:text-sm text-gray-600">
          <div>当事者・企業・支援者協働</div>
          <div>ICF/EBPM基盤</div>
          <div>合理的配慮の標準化</div>
          <div>講義・政策・実装の一体化</div>
          <div>オープンアクセス（CC BY 4.0）</div>
          <div>合意形成デザイン</div>
        </div>
      </div>

      {/* Vision */}
      <section id="vision" data-testid="vision" className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">Next Being ビジョン</h2>
          <p className="text-gray-700 leading-relaxed">
            猿 → 人間 → <span className="whitespace-nowrap">人間＋AI</span> → <span className="font-semibold">Next Being</span>。道具と文化が加速してきた人類史の延長に、
            <span className="font-semibold">人×AI×コミュニティ×環境</span>の協働で生まれる新しい“在り方”を構想します。NBLは、
            その移行期に必要な <span className="font-semibold">設計・標準・物語</span> を実装します（Designing the Human Next）。
          </p>
        <div className="mt-4">
          <VisionRocket />
        </div>
        </div>
        //<div className="md:col-span-3 grid gap-4">
        <div className="grid md:grid-cols-3 gap-4">
          {/* H1 / Stage 1 */}
          <div className="rounded-2xl border p-5 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-gradient-to-r from-sky-50 to-indigo-50">Stage 1</span>
              <span className="text-xs text-gray-500">H1（いま）</span>
            </div>
            <h3 className="font-medium mb-1">不公平の見える化 — 公平な働き方を設計する</h3>
            <p className="text-gray-700 text-sm">
              データ×現場の言語化で指標を整備し、合理的配慮を科学。
              <span className="whitespace-nowrap">提案→申請→実装→KPI</span> を一筆書きにする <span className="whitespace-nowrap">（JAC／Playbook）</span>。
            </p>
            <ul className="mt-3 text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>データ×現場の言語化、指標づくり</li>
              <li>合理的配慮×ワーク設計の実務化</li>
              <li>KPI とチェックリストで運用</li>
            </ul>
          </div>
        
          {/* H2 / Stage 2 */}
          <div className="rounded-2xl border p-5 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-gradient-to-r from-fuchsia-50 to-rose-50">Stage 2</span>
              <span className="text-xs text-gray-500">H2（2026–2029）</span>
            </div>
            <h3 className="font-medium mb-1">合意可能な設計 — 人間＋AIの共同行為へ</h3>
            <p className="text-gray-700 text-sm">
              協調エージェントが日々の仕事・学び・ケアを共同設計。
              個人は「存在の物語」で価値創出し、現場の合意形成を加速。
            </p>
            <ul className="mt-3 text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>合意形成プロセスの標準化</li>
              <li>非同期・リモート前提の業務分解</li>
              <li>AIアシストによる負荷調整と可視化</li>
            </ul>
          </div>
        
          {/* H3 / Stage 3 */}
          <div className="rounded-2xl border p-5 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-gradient-to-r from-amber-50 to-emerald-50">Stage 3</span>
              <span className="text-xs text-gray-500">H3（2030+）</span>
            </div>
            <h3 className="font-medium mb-1">Next Being Commons — 社会実装のコモンズ化</h3>
            <p className="text-gray-700 text-sm">
              公共圏に開かれた支援・学習・労働のコモンズ化。
              評価は <span className="whitespace-nowrap">尊厳・貢献・持続可能性</span> の三軸で。
            </p>
            <ul className="mt-3 text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>企業・自治体と実証→標準化</li>
              <li>オープンライセンスと再利用性</li>
              <li>フェアネス指標の社会合意</li>
            </ul>
          </div>
        </div>
          <div className="rounded-2xl border p-5 shadow-sm bg-white">
            <h3 className="font-medium mb-1">設計原則（Draft）</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
              <li>尊厳を埋め込む（Dignity by Design）</li>
              <li>支援が自律を拡張する（Autonomy with Assistance）</li>
              <li>安全・説明責任・反証可能性</li>
              <li>インクルージョンとアクセシビリティ</li>
              <li>オープンナレッジと再利用性（CC BY）</li>
              <li>エビデンス・ファースト、物語で拡張</li>
              <li>持続可能性と楽しさ（Joy）</li>
            </ul>
          </div>
          <div className="rounded-2xl border p-5 shadow-sm bg-white">
            <h3 className="font-medium mb-1">探索中のリサーチクエスチョン</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
              <li>症状×タスク×KPIの共通語彙はどこまで一般化できるか</li>
              <li>配慮の効果を“チーム成果”で測る最小指標は何か</li>
              <li>AIエージェントは個人の自律をどう拡張しうるか</li>
              <li>公平性の可視化は意思決定のスピードを上げるか</li>
            </ul>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" data-testid="about" className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">NBLとは</h2>
          <p className="text-gray-700 leading-relaxed">
            Next Being Lab（NBL）は、難病を含む多様な身体条件を前提にした働き方・学び方・暮らし方を設計する研究・実装ユニットです。
            <span className="block">目的は「不公平の見える化」を、誰もが納得可能な合意設計へ翻訳すること。</span>
          </p>
        </div>
        <div className="md:col-span-3 grid gap-4">
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

      {/* The 4 Pillars */}
      <section id="pillars" data-testid="pillars" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">NBLの4つの柱</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { title: 'Product', desc: 'JAC：配慮の提案→申請→実装→KPIを一筆書き' },
            { title: 'Standard', desc: 'Accommodation Playbook：現場で回る標準手順' },
            { title: 'Research', desc: 'ICF/EBPMに基づく実証とオープンレポート' },
            { title: 'Narrative', desc: "CAN > CAN'T キャンペーンと学習コンテンツ" },
          ].map((p, i) => (
            <div key={i} className="rounded-2xl border p-6 bg-white shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{p.title}</div>
              <div className="font-medium mb-1">{p.desc}</div>
              <a href="#" className="text-sm underline">詳しく</a>
            </div>
          ))}
        </div>
      </section>

      {/* Product: JAC */}
      <section id="product" data-testid="product" className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">JAC（Job Accommodation Copilot）</h2>
          <p className="text-gray-700 mb-4">
            症状や診断名ではなく、<span className="font-semibold">タスク条件×症状像</span>で合理的配慮を設計。
            提案・申請テンプレ・実装チェック・KPIトラッキングまでを最小UIで提供します（α）。
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-5">
            <li>レコメンド：症状×タスクから配慮案（カタログ連動）</li>
            <li>テンプレ出力：本人／上長／人事のPDF様式</li>
            <li>KPI：欠勤・疲労NRS・自己生産性・実装率</li>
            <li>プライバシー：病名を扱わない抽象度で設計</li>
          </ul>
          <div className="flex flex-wrap gap-3" id="downloads">
            <a href="/docs/JAC_Alpha_Requirements_1Pager.md" className="rounded-xl px-3 py-2 border text-sm">α要件1-Pager</a>
            <a href="/docs/JAC_Accommodation_Catalog_v0_3.yaml" className="rounded-xl px-3 py-2 border text-sm">配慮カタログ（YAML）</a>
            <a href="/docs/JAC_DisclosureLanguage_Templates_v0_3.md" className="rounded-xl px-3 py-2 border text-sm">開示の言語テンプレ</a>
          </div>
        </div>
        <div className="rounded-3xl border bg-white shadow-sm p-6">
          <div className="text-sm text-gray-600 mb-3">サンプル配慮（抜粋）</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {['短時間勤務＋可変コアタイム','在宅・ハイブリッド','作業ペース配分','温度調整','ノイズコントロール','音声入力・読み上げ','タスク・ローテーション','席の近接配慮','会議の非同期化','通勤配慮','安全優先のタスク制限','視覚負荷軽減'].map((t,i)=>(
              <div key={i} className="rounded-xl border p-4 text-sm bg-gray-50">{t}</div>
            ))}
          </div>
          <a id="poc" href="#contact" className="mt-4 inline-flex rounded-xl px-4 py-2 bg-gray-900 text-white text-sm">PoCの相談をする</a>
        </div>
      </section>

      {/* Services */}
      <section id="services" data-testid="services" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">サービス</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <div className="text-xs text-gray-500 mb-1">30日クイックアセスメント</div>
            <div className="font-medium mb-2">現状把握と改善優先度の可視化</div>
            <p className="text-sm text-gray-700 mb-3">ヒアリング→タスク分解→配慮実装余地→KPI合意。</p>
            <a href="#contact" className="text-sm underline">相談する</a>
          </div>
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <div className="text-xs text-gray-500 mb-1">研修・講義・認定</div>
            <div className="font-medium mb-2">職場配慮実装士（仮）</div>
            <p className="text-sm text-gray-700 mb-3">現場導入の標準手順と評価設計を習得。</p>
            <a href="#reports" className="text-sm underline">教材と資料</a>
          </div>
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <div className="text-xs text-gray-500 mb-1">PoC/共同研究</div>
            <div className="font-medium mb-2">JAC α/β 導入サポート</div>
            <p className="text-sm text-gray-700 mb-3">2〜4週間の小さな試行から開始できます。</p>
            <a href="#contact" className="text-sm underline">問い合わせ</a>
          </div>
        </div>
      </section>

      {/* Reports */}
      <section id="reports" data-testid="reports" className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">最新レポート・資料</h2>
          <a href="#" className="text-sm text-gray-600 hover:underline">すべて見る</a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: '難病就労支援：国際比較2025（速報）', desc: '制度と現場のベストプラクティスを8頁で凝縮。', href: '/docs/houkoku126_summary.pdf' },
            { title: '雇用の質×合理的配慮：設計ガイド', desc: '非同期会議・在宅・温度/騒音配慮の実務手順。', href: '/docs/remote-accommodation.pdf' },
            { title: '巻頭言：職業リハビリテーションの黄金期はこれから', desc: '2025/07 読み物版。', href: '/docs/01-巻頭言-春名.pdf' },
          ].map((r, i) => (
            <article key={i} className="rounded-2xl border overflow-hidden shadow-sm bg-white">
              <div className="aspect-video bg-gradient-to-br from-indigo-50 to-sky-50" />
              <div className="p-5">
                <h3 className="font-medium mb-1">{r.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{r.desc}</p>
                <div className="flex gap-3">
                  <a href={encodeURI(r.href)} className="text-sm underline">PDF（CC BY）</a>
                  <a href="#video" className="text-sm underline">10分講義</a>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            { title: 'リハ協カフェ講演資料', desc: '2025/07/31 ウェブ講演スライド。', href: '/docs/リハ協カフェ20250731春名2.pdf' },
            { title: '京都難病2025 プレゼン', desc: '企画スライド案（PPTX）', href: '/docs/京都難病2025.pptx' },
            { title: '難病患者の雇用促進：研究会まとめ', desc: '議論要旨と提案（DOCX）', href: '/docs/難病患者の雇用促進に関する研究会の議論まとめ.docx' },
          ].map((r, i) => (
            <article key={i} className="rounded-2xl border overflow-hidden shadow-sm bg-white">
              <div className="aspect-video bg-gradient-to-br from-amber-50 to-emerald-50" />
              <div className="p-5">
                <h3 className="font-medium mb-1">{r.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{r.desc}</p>
                <div className="flex gap-3">
                  <a href={encodeURI(r.href)} className="text-sm underline">資料</a>
                  <a href="#join" className="text-sm underline">相談する</a>
                </div>
              </div>
            </article>
          ))}
        </div> 
     </section>

      {/* Campaign */}
      <section id="campaign" data-testid="campaign" className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl border overflow-hidden shadow-sm bg-white">
          <div className="aspect-video">
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/7aD6tQn3qW8" title="CAN > CAN'T ダイジェスト" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </div>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">CAN &gt; CAN'T キャンペーン</h2>
          <p className="text-gray-700 mb-4">職場の“できない前提”を“できる設計”へ。60秒ショートで配慮の具体を可視化し、企業の配慮担当者をヒーローにします。</p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4">
            <li>ショート動画：非同期会議／温度配慮／NCヘッドホン</li>
            <li>『合理的配慮100の実装』図鑑（写真＋1枚1配慮）</li>
            <li>“開示の言語”テンプレ：本人→上長→人事→産業医</li>
          </ul>
          <a href="#reports" className="rounded-xl px-4 py-2 bg-gray-900 text-white text-sm">図鑑（準備中）を見る</a>
        </div>
      </section>

      {/* Join / Contact */}
      <section id="contact" data-testid="contact" className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border shadow-sm p-8 md:p-10 bg-gradient-to-br from-white to-sky-50">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">一緒に社会実装を進めませんか？</h2>
          <p className="text-gray-700 mb-5">編集・広報・合意形成が得意な方、当事者・企業・自治体の皆さまを歓迎します。小さな試行（2〜4週間）から。</p>
          <form className="grid md:grid-cols-3 gap-3" onSubmit={(e) => e.preventDefault()}>
            <input className="rounded-2xl border px-4 py-2" placeholder="お名前" />
            <input className="rounded-2xl border px-4 py-2" placeholder="メールアドレス" type="email" />
            <button className="rounded-2xl px-4 py-2 bg-gray-900 text-white shadow">関心を送る</button>
          </form>
          <p className="text-xs text-gray-500 mt-2">フォームが使えない場合は <a className="underline" href="mailto:info@nextbeinglab.org">info@nextbeinglab.org</a> へ。</p>
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
      <a className="underline" href="#about">NBLとは</a>
      <a className="underline" href="#product">JAC</a>
      <a className="underline" href="#services">サービス</a>
    </div>
    <div className="flex flex-col gap-1">
      <div className="font-medium mb-1">リソース</div>
      <a className="underline" href="#reports">レポート</a>
      <a className="underline" href="#campaign">キャンペーン</a>
      <a className="underline" href="#downloads">ドキュメント</a>
    </div>
  </div>
</footer>
    </div>
  );
}
