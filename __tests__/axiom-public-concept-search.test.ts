import fs from 'fs';
import path from 'path';
import {
  buildAxiomPublicConceptSearchIndex,
  searchAxiomPublicConceptIndex,
} from '@/lib/axiom/axiomPublicConceptSearch';

describe('Axiom public concept search', () => {
  it('builds a static public search index across pages, reports, and toolkit assets', () => {
    const index = buildAxiomPublicConceptSearchIndex();
    const kinds = new Set(index.map((entry) => entry.kind));

    expect(index.length).toBeGreaterThan(90);
    expect(kinds.has('page')).toBe(true);
    expect(kinds.has('work_design_domain')).toBe(true);
    expect(kinds.has('condition_window')).toBe(true);
    expect(kinds.has('nbl_report')).toBe(true);
    expect(kinds.has('toolkit')).toBe(true);
    expect(index.some((entry) => entry.id === 'projects' && entry.href === '/projects')).toBe(true);
  });

  it('expands 難病 into health-time and treatment-related public results', () => {
    const result = searchAxiomPublicConceptIndex('難病', { limit: 20 });
    const joined = result.matches.map((match) => `${match.title} ${match.href}`).join('\n');

    expect(result.expandedConcepts).toContain('難病・慢性疾患を健康時間として読む');
    expect(joined).toContain('健康時間・生活保障・仕事密度を設計する');
    expect(joined).toContain('/work-condition-window#condition-window-intractable-disease');
    expect(joined).toContain('/articles-social-questions?article=health-time-work-condition');
  });

  it('does not reduce reasonable accommodation to a phrase-only hit', () => {
    const result = searchAxiomPublicConceptIndex('合理的配慮', { limit: 20 });
    const joined = result.matches.map((match) => `${match.title} ${match.summary}`).join('\n');

    expect(result.expandedConcepts).toContain('合理的配慮を仕事条件へ翻訳する');
    expect(joined).toContain('仕事設計');
    expect(joined).toContain('手順');
  });

  it('connects open-close workplace wording to disclosure boundary results', () => {
    const result = searchAxiomPublicConceptIndex('オープン/クローズ', { limit: 20 });
    const joined = result.matches.map((match) => `${match.title} ${match.href}`).join('\n');

    expect(result.expandedConcepts).toContain('開示を目的限定の情報共有として見る');
    expect(result.expandedTerms).toContain('開示');
    expect(result.expandedTerms).toContain('共有範囲');
    expect(joined).toContain('開示・評価・役割・成長を設計する');
  });

  it('surfaces the projects collaboration entrance from project and study-group searches', () => {
    const projectResult = searchAxiomPublicConceptIndex('プロジェクト', { limit: 8 });
    const studyGroupResult = searchAxiomPublicConceptIndex('研究会', { limit: 8 });

    expect(projectResult.matches[0]).toMatchObject({
      href: '/projects',
      title: 'プロジェクト',
    });
    expect(studyGroupResult.matches.some((match) => match.href === '/projects')).toBe(true);
  });

  it('wires the search entry into the published site header', () => {
    const surfaceSource = fs.readFileSync(
      path.join(process.cwd(), 'components/axiom/AxiomNextNblPublicCandidateSiteSurface.tsx'),
      'utf8',
    );

    expect(surfaceSource).toContain('action="/search"');
    expect(surfaceSource).toContain('href="/search"');
    expect(surfaceSource).toContain('サイト内検索');
  });
});
