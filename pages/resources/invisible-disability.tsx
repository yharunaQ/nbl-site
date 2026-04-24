import React from 'react';
import type { GetStaticProps } from 'next';
import PageSeo from '@/components/PageSeo';
import InvisibleDisabilitySeriesPage from '@/components/InvisibleDisabilitySeriesPage';
import { RelatedSongsRailByKey } from '@/components/songs/RelatedSongsRail';
import { getPublicSongs, getByInfographic } from '@/lib/songs';
import type { Song, SongsByInfographic } from '@/lib/types/songs';

interface Props {
  allSongs: Song[];
  byInfographic: SongsByInfographic;
}

export default function InvisibleDisabilityPage({ allSongs, byInfographic }: Props) {
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
      <div className="mx-auto max-w-4xl px-6 pb-14">
        <RelatedSongsRailByKey
          infographicKey="invisible-backpack"
          allSongs={allSongs}
          byInfographic={byInfographic}
        />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [allSongs, byInfographic] = await Promise.all([getPublicSongs(), getByInfographic()]);
  return { props: { allSongs, byInfographic }, revalidate: 1800 };
};
