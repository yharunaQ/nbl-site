import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import PageSeo from '@/components/PageSeo';
import ApplySection from './ApplySection';
import Campaign from './Campaign';
import Footer from './Footer';
import Hero from './Hero';
import MarketVision from './MarketVision';
import Phase1 from './Phase1';
import ProductJac from './ProductJac';
import Reports from './Reports';
import Services from './Services';
import TrustStrip from './TrustStrip';
import Vision from './Vision';

export default function LegacyPublicHome() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Next Being Lab',
    url: 'https://nextbeinglab.org',
    sameAs: ['https://www.youtube.com/@next-being-lab'],
    description: '難病就労支援・障害者雇用の研究と実装ユニット。合理的配慮を科学し社会実装する。',
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <PageSeo
        title="Next Being Lab | 働くは設計できる。"
        description="不公平の見える化を、合意可能な設計へ。難病就労支援・障害者雇用の研究と社会実装ユニット。"
        path="/"
        imageAlt="Next Being Lab - 働くは設計できる。"
      />
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <nav
        className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md"
        data-testid="top-nav"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <circle cx="14" cy="14" r="13" stroke="#7DD3FC" strokeWidth="1" fill="none" />
              <circle cx="14" cy="14" r="10" stroke="#14B8A6" strokeWidth="2" fill="none" />
              <circle cx="14" cy="14" r="6" fill="white" />
            </svg>
            <span className="font-bold tracking-wide text-gray-900">Next Being Lab</span>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            <a href="#vision" className="transition-colors hover:text-indigo-600">
              ビジョン
            </a>
            <a href="#phase1" className="transition-colors hover:text-indigo-600">
              NBL Phase 1
            </a>
            <a href="#product" className="transition-colors hover:text-indigo-600">
              ツール
            </a>
            <Link href="/jac/guide" className="transition-colors hover:text-indigo-600">
              仕事設計ガイド
            </Link>
            <a href="#reports" className="transition-colors hover:text-indigo-600">
              レポート
            </a>
            <a href="#apply" className="transition-colors hover:text-indigo-600">
              利用申込
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/jac/guide"
              className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-bold text-gray-800 transition-all hover:bg-gray-50"
            >
              仕事設計ガイド
            </Link>
            <a
              href="#apply"
              className="rounded-full bg-gray-900 px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-black"
            >
              利用申込
            </a>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <TrustStrip />
        <Campaign />
        <Phase1 />
        <Reports />
        <ProductJac />
        <ApplySection />
        <Services />
        <Vision />
        <MarketVision />
      </main>

      <Footer />
    </div>
  );
}
