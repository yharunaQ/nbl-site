import LegacyPublicHome from '@/components/LegacyPublicHome';
import TemporaryPublicHome from '@/components/TemporaryPublicHome';
import { TEMPORARY_PUBLIC_SITE_ENABLED } from '@/lib/publicSiteMode';

export default function NBLHome() {
  return TEMPORARY_PUBLIC_SITE_ENABLED ? <TemporaryPublicHome /> : <LegacyPublicHome />;
}
