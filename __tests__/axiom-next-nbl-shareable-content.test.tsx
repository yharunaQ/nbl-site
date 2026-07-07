import { render, screen } from '@testing-library/react';
import {
  buildAxiomNblReportShareItems,
  buildAxiomToolkitInfographicShareItems,
} from '@/components/axiom/AxiomNextNblPublicCandidateSiteSurface';
import NblReportSharePage, {
  getStaticPaths as getNblReportShareStaticPaths,
} from '@/pages/share/nbl-report/[articleId]';
import ToolkitInfographicSharePage, {
  getStaticPaths as getToolkitInfographicShareStaticPaths,
} from '@/pages/share/toolkit-infographic/[itemId]';

describe('Axiom next NBL shareable content', () => {
  it('builds shareable NBL report URLs with article deep links and image cards', async () => {
    const items = buildAxiomNblReportShareItems();

    expect(items).toHaveLength(37);
    expect(items[0].sharePath).toMatch(/^\/share\/nbl-report\//);
    expect(items[0].targetPath).toContain('/articles-social-questions?article=');
    expect(items[0].imageSrc).toMatch(/^\/images\/axiom-article-image2-infographics\//);

    const pathsResult = await getNblReportShareStaticPaths({});
    expect('paths' in pathsResult ? pathsResult.paths : []).toHaveLength(items.length);
  });

  it('renders an NBL report share page as a public image-backed entry', () => {
    const item = buildAxiomNblReportShareItems()[0];

    render(<NblReportSharePage item={item} />);

    expect(screen.getByRole('heading', { name: item.title })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: item.imageAlt })).toHaveAttribute(
      'src',
      item.imageSrc,
    );
    expect(screen.getByRole('link', { name: '記事本文を読む' })).toHaveAttribute(
      'href',
      expect.stringContaining('/articles-social-questions?article='),
    );
  });

  it('builds shareable toolkit infographic URLs with direct image deep links', async () => {
    const items = buildAxiomToolkitInfographicShareItems();

    expect(items.length).toBeGreaterThan(50);
    expect(items[0].sharePath).toMatch(/^\/share\/toolkit-infographic\//);
    expect(items[0].targetPath).toContain('/toolkit-studio?image=');
    expect(items[0].imageSrc).toMatch(/^\/images\/axiom-toolkit-selected-infographics\//);
    expect(items.map((item) => item.id)).toEqual(
      expect.arrayContaining([
        'employment-support-five-core-v1',
        'employment-support-vocabulary-update-v1',
      ]),
    );
    expect(
      items.find((item) => item.id === 'employment-support-five-core-v1')?.description,
    ).toContain('知識・スキルの一覧');

    const pathsResult = await getToolkitInfographicShareStaticPaths({});
    expect('paths' in pathsResult ? pathsResult.paths : []).toHaveLength(items.length);
  });

  it('renders a toolkit infographic share page as a public image-backed entry', () => {
    const item = buildAxiomToolkitInfographicShareItems()[0];

    render(<ToolkitInfographicSharePage item={item} />);

    expect(screen.getByRole('heading', { name: item.title })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: item.imageAlt })).toHaveAttribute(
      'src',
      item.imageSrc,
    );
    expect(screen.getByRole('link', { name: '図解をページで開く' })).toHaveAttribute(
      'href',
      expect.stringContaining('/toolkit-studio?image='),
    );
  });
});
