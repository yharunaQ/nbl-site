import Head from 'next/head';
import React from 'react';
import InvisibleDisabilitySeriesPage from '@/components/InvisibleDisabilitySeriesPage';

export default function InvisibleDisabilityReviewPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Head>
        <title>Review Draft | 見えない障害の理解</title>
        <meta
          name="description"
          content="NBL review draft for the Invisible Disability Understanding series."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <InvisibleDisabilitySeriesPage
        variant="review"
        backHref="/review/resources-first-release"
        backLabel="Back To Resources Review"
      />
    </div>
  );
}
