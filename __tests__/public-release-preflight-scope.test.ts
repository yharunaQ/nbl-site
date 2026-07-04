import { readFileSync } from 'node:fs';
import path from 'node:path';

const publicKnowledgeInterfaceRoutes = [
  '/about/knowledge-base',
  '/about/data',
  '/knowledge',
  '/knowledge/practice',
  '/knowledge/evidence',
  '/knowledge/network',
] as const;

const publicKnowledgeInterfaceFilePaths = [
  'pages/about/knowledge-base.tsx',
  'pages/about/data.tsx',
  'pages/knowledge/index.tsx',
  'pages/knowledge/practice.tsx',
  'pages/knowledge/evidence.tsx',
  'pages/knowledge/network.tsx',
] as const;

describe('public release preflight scope', () => {
  it('keeps work-design and knowledge interface routes in the public surface check', () => {
    const script = readFileSync(
      path.join(process.cwd(), 'scripts', 'ops', 'check-public-surface-safety.mjs'),
      'utf8',
    );

    expect(script).toContain("'/work-design-views-guide'");
    expect(script).toContain('checked root');
    for (const route of publicKnowledgeInterfaceRoutes) {
      expect(script).toContain(`'${route}'`);
    }
    expect(script).toContain("'review route leak'");
    expect(script).toContain("'internal workspace path leak'");
  });

  it('keeps work-design and knowledge interface files in release preflight checks', () => {
    const sharedScript = readFileSync(
      path.join(process.cwd(), 'scripts', 'ops', 'shared.mjs'),
      'utf8',
    );
    const script = readFileSync(
      path.join(process.cwd(), 'scripts', 'ops', 'run-public-release-preflight.mjs'),
      'utf8',
    );

    expect(sharedScript).toContain('NBL_OPS_ROOT');
    expect(script).toContain("'/work-design-views-guide'");
    expect(script).toContain("'pages/work-design-views-guide.tsx'");
    expect(script).toContain('checked root');
    for (const route of publicKnowledgeInterfaceRoutes) {
      expect(script).toContain(`'${route}'`);
    }
    for (const filePath of publicKnowledgeInterfaceFilePaths) {
      expect(script).toContain(`'${filePath}'`);
    }
    expect(script).toContain('public-release preflight is review evidence only');
    expect(script).toContain('not founder release approval');
    expect(script).toContain('runtime/model adoption');
    expect(script).toContain('knowledge promotion');
  });

  it('keeps the work-design guide in the public sitemap', () => {
    const sitemap = readFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), 'utf8');

    expect(sitemap).toContain('https://nextbeinglab.org/work-design-views-guide');
  });
});
