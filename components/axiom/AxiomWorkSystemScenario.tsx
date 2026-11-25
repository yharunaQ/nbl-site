import styles from './AxiomWorkSystemScenario.module.css';

export type WorkSystemScenario = {
  title: string;
  scene: string;
  exampleLabel?: string;
  exampleTitle: string;
  exampleIntro: string;
  takeaway: string;
} & (
  | { cues: readonly { label: string; value: string }[]; comparison?: never }
  | {
      cues?: never;
      comparison: {
        beforeLabel: string;
        afterLabel: string;
        rows: readonly { label: string; before: string; after: string }[];
      };
    }
);

export default function AxiomWorkSystemScenario({ scenario }: { scenario: WorkSystemScenario }) {
  const exampleLabel =
    scenario.exampleLabel ?? (scenario.comparison ? '条件を比べる例' : '仕組みの使い方の例');
  return (
    <section className={styles.scenario} aria-label={scenario.title}>
      <h3>{scenario.title}</h3>
      <p className={styles.scene}>{scenario.scene}</p>
      <figure
        className={styles.card}
        aria-label={`${exampleLabel}（架空）：${scenario.exampleTitle}`}
      >
        <figcaption>
          <span className={styles.exampleLabel}>{exampleLabel}（架空）</span>
          <h4>{scenario.exampleTitle}</h4>
        </figcaption>
        <p className={styles.exampleIntro}>{scenario.exampleIntro}</p>
        {scenario.comparison ? (
          <table
            className={styles.comparison}
            role="table"
            aria-label={`${scenario.exampleTitle}：条件の比較`}
          >
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader">
                  項目
                </th>
                <th scope="col" role="columnheader">
                  {scenario.comparison.beforeLabel}
                </th>
                <th scope="col" role="columnheader">
                  {scenario.comparison.afterLabel}
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {scenario.comparison.rows.map((row, index) => (
                <tr role="row" key={`${row.label}-${index}`}>
                  <th scope="row" role="rowheader">
                    {row.label}
                  </th>
                  <td role="cell">
                    <span className={styles.columnLabel} aria-hidden="true">
                      {scenario.comparison!.beforeLabel}
                    </span>
                    {row.before}
                  </td>
                  <td role="cell">
                    <span className={styles.columnLabel} aria-hidden="true">
                      {scenario.comparison!.afterLabel}
                    </span>
                    {row.after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <dl className={styles.cues}>
            {scenario.cues.map((cue, index) => (
              <div key={`${cue.label}-${index}`}>
                <dt>{cue.label}</dt>
                <dd>{cue.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className={styles.takeaway}>{scenario.takeaway}</p>
      </figure>
    </section>
  );
}
