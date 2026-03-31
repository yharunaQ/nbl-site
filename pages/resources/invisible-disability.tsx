import React from 'react';
import PageSeo from '@/components/PageSeo';
import InvisibleDisabilitySeriesPage from '@/components/InvisibleDisabilitySeriesPage';

export default function InvisibleDisabilityPage() {
  return (
    <>
      <PageSeo
        title="見えない障害の理解 | Next Being Lab"
        description="見た目では分かりにくい困りごとを、病名知識だけでなく、仕事や支援の設計につなげて理解するためのNBLのシリーズ。"
        path="/resources/invisible-disability"
      />
      <InvisibleDisabilitySeriesPage
        variant="public"
        backHref="/resources"
        backLabel="Resourcesへ戻る"
      />
    </>
  );
}
