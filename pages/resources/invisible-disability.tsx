import Head from 'next/head';
import React from 'react';
import InvisibleDisabilitySeriesPage from '@/components/InvisibleDisabilitySeriesPage';

export default function InvisibleDisabilityPage() {
  return (
    <>
      <Head>
        <title>見えない障害の理解 | Next Being Lab</title>
        <meta
          name="description"
          content="見た目では分かりにくい困りごとを、病名知識だけでなく、仕事や支援の設計につなげて理解するためのNBLのシリーズ。"
        />
        <link rel="canonical" href="https://nextbeinglab.org/resources/invisible-disability" />
      </Head>
      <InvisibleDisabilitySeriesPage
        variant="public"
        backHref="/resources"
        backLabel="Resourcesへ戻る"
      />
    </>
  );
}
