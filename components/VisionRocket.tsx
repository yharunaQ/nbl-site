// components/VisionRocket.tsx
import React from "react";

export default function VisionRocket() {
  return (
    <figure
      aria-label="ビジョンの三段ロケット"
      className="rounded-3xl border bg-white/70 backdrop-blur p-5 md:p-6"
    >
      <figcaption className="sr-only">
        不公平の見える化 → 合意可能な設計 → Next Being 社会実装
      </figcaption>

      <div className="grid md:grid-cols-[1fr_auto] items-center gap-6">
        {/* 3ステージ（テキスト側） */}
        <ul className="grid sm:grid-cols-3 gap-3 w-full">
          <li className="rounded-2xl p-4 bg-gradient-to-br from-sky-50 to-indigo-50 border">
            <div className="text-xs text-gray-500">Stage 1</div>
            <div className="font-semibold">不公平の見える化</div>
            <p className="text-xs text-gray-600 mt-1">データ×現場の言語化、指標づくり</p>
          </li>
          <li className="rounded-2xl p-4 bg-gradient-to-br from-fuchsia-50 to-rose-50 border">
            <div className="text-xs text-gray-500">Stage 2</div>
            <div className="font-semibold">合意可能な設計</div>
            <p className="text-xs text-gray-600 mt-1">合理的配慮×ワーク設計、チェックリスト</p>
          </li>
          <li className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-emerald-50 border">
            <div className="text-xs text-gray-500">Stage 3</div>
            <div className="font-semibold">Next Being 社会実装</div>
            <p className="text-xs text-gray-600 mt-1">企業・自治体と実証→標準化</p>
          </li>
        </ul>

        {/* ロケット（SVG） */}
        <div className="justify-self-center">
          <svg
            viewBox="0 0 120 160"
            className="w-28 h-28 md:w-36 md:h-36 drop-shadow-sm"
            role="img"
            aria-label="上昇するロケットのイラスト"
          >
            <defs>
              <linearGradient id="body" x1="0" x2="1">
                <stop offset="0" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
              <linearGradient id="flame" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#f59e0b" />
                <stop offset="1" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path d="M60 10 C50 28 46 42 46 60 v30 a14 14 0 0 0 28 0 V60 c0-18-4-32-14-50z" fill="url(#body)" />
            <circle cx="60" cy="58" r="8" fill="#fff" stroke="#111827" strokeWidth="2" />
            <path d="M46 88 l-18 10 v12 l18-8z" fill="#7dd3fc" />
            <path d="M74 88 l18 10 v12 l-18-8z" fill="#fda4af" />
            <path d="M60 120 c-6 8-10 18-10 28 c6-4 10-6 10-6 s4 2 10 6 c0-10-4-20-10-28z" fill="url(#flame)" />
            <g stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
              <line x1="20" y1="130" x2="40" y2="130" />
              <line x1="18" y1="140" x2="36" y2="140" />
              <line x1="84" y1="130" x2="104" y2="130" />
              <line x1="86" y1="140" x2="102" y2="140" />
            </g>
          </svg>
        </div>
      </div>
    </figure>
  );
}
