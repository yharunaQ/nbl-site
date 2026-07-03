import { render } from '@testing-library/react';
import AxiomNextNblPublicCandidateHomePage from '@/pages/internal/axiom-next-nbl-public-candidate';
import AxiomNextNblPublicCandidatePage from '@/pages/internal/axiom-next-nbl-public-candidate/[slug]';

const publicCandidateSlugs = [
  'home',
  'scene-entry',
  'case-readings',
  'work-design-views-guide',
  'articles-social-questions',
  'toolkit-studio',
  'work-condition-window',
  'theory-method-trust',
  'about-boundary',
] as const;

const blockedReaderTerms = [
  'kernel',
  'runtime',
  'source lens',
  'missing context',
  'cannot-yet-say',
  'candidate_pattern',
  'public_approved',
  'learning update',
  'Founderレビュー済み',
  'internal Founder review candidate',
  'not actual public navigation',
  'not publication',
  '内部候補表示',
  '正式公開版ではありません',
] as const;

function renderPublicCandidate(slug: (typeof publicCandidateSlugs)[number]) {
  if (slug === 'home') {
    return render(<AxiomNextNblPublicCandidateHomePage />);
  }

  return render(<AxiomNextNblPublicCandidatePage slug={slug} />);
}

describe('Axiom next NBL public candidate language boundary', () => {
  it('keeps internal kernel/runtime/source-review terms out of visible public-candidate copy', () => {
    for (const slug of publicCandidateSlugs) {
      const { container, unmount } = renderPublicCandidate(slug);
      const visibleText = container.textContent ?? '';

      for (const term of blockedReaderTerms) {
        expect(visibleText).not.toContain(term);
      }

      unmount();
    }
  });

  it('preserves visible boundary language without turning it into individual advice or final judgment', () => {
    const { container } = render(<AxiomNextNblPublicCandidatePage slug="about-boundary" />);
    const visibleText = container.textContent ?? '';

    expect(visibleText).toContain('個別相談、医療・法律・人事判断、合理的配慮の最終判断は扱いません');
    expect(visibleText).toContain('医療判断、法的判断、人事判断、就労可否判断は行いません');
    expect(visibleText).toContain('合理的配慮の妥当性や実施義務を最終判断しません');
    expect(visibleText).toContain('@NBL_workdesign');
    expect(visibleText).not.toContain('AIが合理的配慮を判定します');
    expect(visibleText).not.toContain('この対応でトラブルを防げます');
  });
});
