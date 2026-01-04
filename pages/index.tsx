import Head from 'next/head';
import React from 'react';
import Campaign from '../components/Campaign';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import MarketVision from '../components/MarketVision';
import Phase1 from '../components/Phase1';
import ProductJac from '../components/ProductJac';
import Reports from '../components/Reports';
import Services from '../components/Services';
import TrustStrip from '../components/TrustStrip';
import Vision from '../components/Vision';

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
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Head>
        <title>Next Being Lab | 働くは設計できる。</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://nextbeinglab.org/" />
        <meta name="description" content="不公平の見える化を、合意可能な設計へ。難病就労支援・障害者雇用の研究と社会実装ユニット。" />
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
        {/* PWA/Theme */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="format-detection" content="telephone=no" />
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* Top Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md" data-testid="top-nav">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <circle cx="14" cy="14" r="13" stroke="#7DD3FC" strokeWidth="1" fill="none" />
              <circle cx="14" cy="14" r="10" stroke="#14B8A6" strokeWidth="2" fill="none" />
              <circle cx="14" cy="14" r="6" fill="white" />
            </svg>
            <span className="font-bold tracking-wide text-gray-900">Next Being Lab</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#vision" className="hover:text-indigo-600 transition-colors">ビジョン</a>
            <a href="#phase1" className="hover:text-indigo-600 transition-colors">NBL(Phase1)</a>
            <a href="#product" className="hover:text-indigo-600 transition-colors">JAC</a>
            <a href="#services" className="hover:text-indigo-600 transition-colors">サービス</a>
            <a href="#reports" className="hover:text-indigo-600 transition-colors">レポート</a>
            <a href="#campaign" className="hover:text-indigo-600 transition-colors">CAN BY DESIGN</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          <a href="#poc" className="rounded-full px-5 py-2 bg-gray-900 text-white text-sm font-bold shadow-md hover:bg-black transition-all">
            PoC相談
          </a>
        </div>
      </nav>

      {/* Main Content Components */}
      <main>
        <Hero />
        <TrustStrip />
        <Campaign />
        <Phase1 />
        <Reports />
        <ProductJac />
        <Services />
        <Vision />
        <MarketVision />
      </main>

      <Footer />
    </div>
  );
}
