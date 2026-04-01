import Link from 'next/link';
import React from 'react';

export default function ProductJac() {
  return (
    <section
      id="product"
      data-testid="product"
      className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24 scroll-mt-24"
    >
      <div className="rounded-3xl bg-gray-900 p-8 md:p-12 grid md:grid-cols-2 gap-10 items-start">
        {/* LEFT */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              就労支援者向けAIツール
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              配慮設計アシスト
            </h2>
            <p className="mt-3 text-lg text-gray-300">
              就労困難を因果構造として分析し、<br className="hidden md:block" />
              支援仮説と配慮候補を生成する補助ツール。
            </p>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed">
            就労支援員・ジョブコーチ・障害者職業生活相談員が、
            相談を受けた後の整理作業に使います。
            FCHMAの因果分析と実証済み支援エビデンスがAIの骨格です。最終判断は支援者が持ちます。
          </p>

          <div className="grid gap-3 text-sm">
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Step 1</p>
              <p className="text-white font-semibold">相談文を入力 → シグナル抽出 + 類似パターン照合</p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Step 2</p>
              <p className="text-white font-semibold">因果構造の仮説化 → 増幅因子・保護因子・介入ポート</p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Step 3</p>
              <p className="text-white font-semibold">支援仮説の生成 → 根拠・実施主体・優先順位</p>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-xs text-gray-400 grid gap-1">
            <div className="flex gap-4">
              <span>料金：<span className="text-gray-200">無償（フィードバック条件）</span></span>
              <span>上限：<span className="text-gray-200">1日20件</span></span>
            </div>
            <span>用途：就労支援業務での相談整理に限る（タグ提案・補足質問の生成は上限対象外）</span>
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/jac/next"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-900 hover:bg-gray-100 transition-colors"
            >
              アセスメントを始める
            </Link>
            <Link
              href="/jac/guide"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              仕事設計ガイドを見る
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4 text-sm">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">対象ユーザー</p>
            {[
              '就労移行・就労継続支援事業所の支援員',
              'ジョブコーチ（職場適応援助者）',
              '障害者職業生活相談員',
              '企業の障害者雇用担当者・人事',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-400" />
                <p className="text-gray-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">データの扱い</p>
            {[
              '入力内容はNBLのサーバーに保存されません',
              'AI処理のためOpenAIに送信されます',
              '氏名・住所など個人特定情報は入力しないでください',
              '個人単位のアクセストークンで管理し、アセスメント実行は1日20件までです',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-400" />
                <p className="text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
