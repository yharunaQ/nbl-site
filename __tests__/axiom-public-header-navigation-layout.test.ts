import fs from 'fs';
import path from 'path';

describe('Axiom public header navigation layout', () => {
  it('keeps desktop header compact after adding concept search', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'components/axiom/AxiomNextNblPublicCandidateSiteSurface.tsx'),
      'utf8',
    );

    expect(source).toContain('primaryDesktopNavSlugs');
    expect(source).toContain("'articles-social-questions'");
    expect(source).toContain('全ページ');
    expect(source).toContain('NBL site all pages');
    expect(source).toContain('overflow-x-auto');
    expect(source).not.toContain('className="hidden items-center gap-1 lg:flex"');
  });
});
