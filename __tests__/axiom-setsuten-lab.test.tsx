import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import AxiomSetsutenLabPage from '@/pages/internal/axiom-setsuten-lab';
import {
  AXIOM_SETSUTEN_AI_ALLOWED,
  AXIOM_SETSUTEN_AI_FORBIDDEN,
  AXIOM_SETSUTEN_SCENARIOS,
  buildAxiomSetsutenReviewPacket,
} from '@/lib/axiomSetsutenLab/axiomSetsutenLab';

const prohibitedRuntimePatterns = [
  /fetch\s*\(/,
  /axios/i,
  /localStorage/i,
  /getServerSideProps/,
  /getStaticProps/,
  /api\//,
  /openai/i,
  /anthropic/i,
] as const;

const prohibitedAdvicePatterns = [
  /勤務可否を判断/,
  /診断名から必要配慮を推論します/,
  /職場に共有すべき情報を決めます/,
  /支援内容を決定します/,
  /waralife-v2/i,
  /from ['"].*naminote/i,
  /naminote\/src/i,
] as const;

describe('Axiom Setsuten Lab internal prototype', () => {
  it('renders as a simple NamiNote shared-data analysis app without intake fields', () => {
    const { container } = render(<AxiomSetsutenLabPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'セツテンLab',
      }),
    ).toBeInTheDocument();

    expect(screen.getByText('共有データ')).toBeInTheDocument();
    expect(screen.getByText('ナミノート共有データ')).toBeInTheDocument();
    expect(screen.getByText('naminote-share-sample-a.json')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '読む' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '相談メモ' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AI用' })).toBeInTheDocument();

    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
  });

  it('switches scenarios and question modes as an actual workbench', () => {
    render(<AxiomSetsutenLabPage />);

    fireEvent.click(
      screen.getByRole('button', { name: /午後の報告が遅れる日の見え方を相談したい/ }),
    );
    expect(screen.getByText('naminote-share-sample-b.json')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '読む' }));
    expect(screen.getAllByText('意欲低下という推論').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: '相談メモ' }));
    fireEvent.click(screen.getByRole('button', { name: /反証読み/ }));
    expect(
      screen.getAllByText(/意欲低下ではなく、報告方法や声かけ方法の不一致/).length,
    ).toBeGreaterThan(0);
  });

  it('updates visible source lenses without allowing all lenses to disappear', () => {
    render(<AxiomSetsutenLabPage />);

    fireEvent.click(screen.getByRole('button', { name: '読む' }));
    expect(screen.getAllByText('通勤混雑').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: '時間' }));
    expect(screen.queryAllByText('通勤混雑')).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: '本人' }));
    fireEvent.click(screen.getByRole('button', { name: '仕事' }));
    fireEvent.click(screen.getByRole('button', { name: '支援' }));
    fireEvent.click(screen.getByRole('button', { name: '地域' }));

    expect(screen.getAllByText('通院・生活予定').length).toBeGreaterThan(0);
  });

  it('builds bounded review packets for each synthetic scenario', () => {
    for (const scenario of AXIOM_SETSUTEN_SCENARIOS) {
      const packet = buildAxiomSetsutenReviewPacket(
        scenario,
        scenario.lenses.map((lens) => lens.id),
        'counter_reading',
      );

      expect(packet).toContain('Axiom Setsuten Lab review packet');
      expect(packet).toContain('app_position: axiom_new_app_not_waralife_successor');
      expect(packet).toContain('research_use: bootstrap_prior_only_not_authority');
      expect(packet).toContain('boundary: contact_points_questions_and_counter_hypotheses_only');
      expect(packet).toContain('AI may only add missing variables');
      expect(packet).not.toContain('final support advice');
      expect(packet).not.toContain('work-capacity judgment');

      for (const allowed of AXIOM_SETSUTEN_AI_ALLOWED) {
        expect(packet).toContain(`- ${allowed}`);
      }

      for (const forbidden of AXIOM_SETSUTEN_AI_FORBIDDEN) {
        expect(packet).toContain(`- ${forbidden}`);
      }
    }
  });

  it('keeps the prototype free of runtime calls, NamiNote coupling, and advice wording', () => {
    const componentSource = readFileSync(
      path.join(process.cwd(), 'components/axiomSetsutenLab/AxiomSetsutenLabSurface.tsx'),
      'utf8',
    );
    const dataSource = readFileSync(
      path.join(process.cwd(), 'lib/axiomSetsutenLab/axiomSetsutenLab.ts'),
      'utf8',
    );
    const pageSource = readFileSync(
      path.join(process.cwd(), 'pages/internal/axiom-setsuten-lab.tsx'),
      'utf8',
    );
    const source = `${componentSource}\n${dataSource}\n${pageSource}`;

    for (const pattern of prohibitedRuntimePatterns) {
      expect(source).not.toMatch(pattern);
    }

    for (const pattern of prohibitedAdvicePatterns) {
      expect(source).not.toMatch(pattern);
    }
  });
});
