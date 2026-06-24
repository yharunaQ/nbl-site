import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  NEXT_NBL_CARRYOVER_LINKS,
  resolveNextNblCarryoverResourceLink,
} from '@/lib/axiom/nextNblPublicCandidateCarryoverLinks';

function readRepoFile(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('Axiom carryover legacy page linking', () => {
  it('points inherited music fest navigation back to the published next NBL surfaces', () => {
    const source = readRepoFile('pages/resources/songs/index.tsx');

    expect(source).toContain('NEXT_NBL_CARRYOVER_LINKS.home');
    expect(source).toContain('NEXT_NBL_CARRYOVER_LINKS.toolkit');
    expect(source).not.toContain('href="/"');
    expect(source).not.toContain('href="/resources"');
  });

  it('points inherited forum navigation back to the published next NBL surfaces', () => {
    const forumSource = readRepoFile('pages/preview/work-condition-forum-session-packages.tsx');
    const textSource = readRepoFile('pages/preview/work-condition-forum-text/[id].tsx');

    for (const source of [forumSource, textSource]) {
      expect(source).toContain('siteHomeHref');
      expect(source).toContain('reportHref');
      expect(source).toContain('toolkitHref');
      expect(source).toContain('NBLレポート');
      expect(source).toContain('ツールキット');
      expect(source).not.toContain('href="/"');
      expect(source).not.toContain('href="/policy-research"');
      expect(source).not.toContain('href="/events"');
    }
  });

  it('presents inherited forum text pages as public articles, not draft review pages', () => {
    const textSource = readRepoFile('pages/preview/work-condition-forum-text/[id].tsx');
    const eventTextSource = readRepoFile('pages/events/work-condition-forum/text/[id].tsx');

    expect(textSource).toContain(
      'この本文は、NBL仕事条件デザイン・バーチャルフォーラムの発表を、公開記事として読める形に整理したものです。',
    );
    expect(eventTextSource).toContain('statusLabel="公開記事 / 境界確認"');

    for (const source of [textSource, eventTextSource]) {
      expect(source).not.toContain('制作・レビュー中草稿');
      expect(source).not.toContain('レビュー中草稿');
      expect(source).not.toContain('event text / boundary noted');
      expect(source).not.toContain('text page / boundary noted');
    }
  });

  it('keeps carryover pages stable while mapping old resource links to Axiom pages', () => {
    expect(NEXT_NBL_CARRYOVER_LINKS.home).toBe('/');
    expect(NEXT_NBL_CARRYOVER_LINKS.report).toBe('/articles-social-questions');
    expect(NEXT_NBL_CARRYOVER_LINKS.toolkit).toBe('/toolkit-studio');
    expect(resolveNextNblCarryoverResourceLink('/resources/disability-work-design')).toEqual({
      href: '/work-condition-window',
      label: '障害種類から見る',
    });
  });
});
