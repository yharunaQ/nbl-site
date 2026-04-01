import LegacyPublicHome from '@/components/LegacyPublicHome';
import PageSeo from '@/components/PageSeo';
import RelaunchPublicHome from '@/components/RelaunchPublicHome';
import TemporaryPublicHome from '@/components/TemporaryPublicHome';
import { PUBLIC_HOME_VARIANT, TEMPORARY_PUBLIC_SITE_ENABLED } from '@/lib/publicSiteMode';

export default function NBLHome() {
  if (!TEMPORARY_PUBLIC_SITE_ENABLED) {
    return <LegacyPublicHome />;
  }

  if (PUBLIC_HOME_VARIANT === 'relaunch') {
    return (
      <>
        <PageSeo
          title="Next Being Lab | AI時代の人間参加を設計し直す"
          description="Next Being Lab は、障害・難病の雇用支援を重要な実装領域として扱いながら、仕事設計、方法論、共有資源、AI運営の境界を積み上げる研究と実装のスタジオです。"
          path="/"
        />
        <RelaunchPublicHome />
      </>
    );
  }

  return <TemporaryPublicHome />;
}
