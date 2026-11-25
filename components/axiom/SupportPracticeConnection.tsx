import { AxiomNextSiteLink as Link } from './AxiomNextSiteLinks';
import { organizationChecks, supportToolHref } from './organizationChecklistContent';
import styles from './SupportPracticeConnection.module.css';

// Product-to-product editorial links, not additional evidence or a compulsory care sequence.
export const supportGuideConnections: Record<string, string> = {
  'WDG2-06': 'work',
  'WDG2-07': 'network',
  'WDG2-10': 'learning',
};

export default function SupportPracticeConnection({ theme }: { theme: string }) {
  const item = organizationChecks.find((check) => check.id === theme);
  if (!item) return null;
  return (
    <aside className={styles.connection} aria-label="必要な支援を届ける体制も見直す">
      <div>
        <p>支援の実践・体制改善ツール</p>
        <h3>この対応を、担当者の頑張りだけにしない。</h3>
        <p>{item.organization.question}</p>
        <p className={styles.note}>
          実際に届いている支援と、それを可能にする体制を分けて確認します。体制の改善を待たずに、今必要な対応は進められます。
        </p>
      </div>
      <Link href={supportToolHref(theme)}>{item.short}の支援・体制を確かめる →</Link>
    </aside>
  );
}
