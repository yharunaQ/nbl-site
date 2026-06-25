import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();

describe('NBL favicon assets', () => {
  it('wires the public NBL icon assets into the global document head', () => {
    const documentSource = fs.readFileSync(path.join(repoRoot, 'pages/_document.tsx'), 'utf8');

    expect(documentSource).toContain('href="/favicon.ico"');
    expect(documentSource).toContain('href="/favicon.svg"');
    expect(documentSource).toContain('href="/favicon-32x32.png"');
    expect(documentSource).toContain('href="/apple-touch-icon.png"');
    expect(documentSource).toContain('href="/site.webmanifest"');
    expect(documentSource).toContain('content="#0f3d36"');
  });

  it('keeps the generated browser and app icon files available', () => {
    const requiredAssets = [
      'public/favicon.ico',
      'public/favicon.svg',
      'public/favicon-32x32.png',
      'public/favicon-192x192.png',
      'public/favicon-512x512.png',
      'public/apple-touch-icon.png',
      'public/site.webmanifest',
    ];

    for (const asset of requiredAssets) {
      expect(fs.existsSync(path.join(repoRoot, asset))).toBe(true);
    }
  });

  it('uses the NBL public-site theme color in shared SEO metadata', () => {
    const pageSeoSource = fs.readFileSync(path.join(repoRoot, 'components/PageSeo.tsx'), 'utf8');

    expect(pageSeoSource).toContain('<meta name="theme-color" content="#0f3d36"');
  });
});
