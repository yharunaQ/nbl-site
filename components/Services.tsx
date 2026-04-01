import Link from 'next/link';
import React from 'react';

export default function Services() {
  return (
    <section
      id="services"
      data-testid="services"
      className="mx-auto max-w-7xl px-6 py-16 scroll-mt-24"
    >
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Next Being Lab
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          現在提供しているもの
        </h2>
        <p className="text-gray-600 leading-relaxed">
          個別コンサルティングや受託開発は現在受け付けていません。
          就労支援者向けAIツール「配慮設計アシスト」と、
          公開コンテンツ（仕事設計ガイド・リソース）を提供しています。
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Link
            href="/contact"
            className="rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-black transition-colors"
          >
            ツール利用申込（招待制）
          </Link>
          <Link
            href="/jac/guide"
            className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            仕事設計ガイドを見る
          </Link>
        </div>
      </div>
    </section>
  );
}
