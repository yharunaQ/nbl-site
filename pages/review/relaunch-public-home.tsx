import Head from 'next/head';
import React from 'react';
import RelaunchPublicHome from '@/components/RelaunchPublicHome';

export default function RelaunchPublicHomeReviewPage() {
  return (
    <>
      <Head>
        <title>Review Draft | NBL Relaunch Public Home</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <RelaunchPublicHome reviewLink="/review" />
    </>
  );
}
