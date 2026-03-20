import { render, screen } from '@testing-library/react';
import InvisibleDisabilityReviewPage from '@/pages/review/invisible-disability';

describe('Invisible disability review page', () => {
  it('renders the draft hero and key section titles', () => {
    render(<InvisibleDisabilityReviewPage />);

    expect(screen.getByText('見えない障害の理解を、')).toBeInTheDocument();
    expect(screen.getByText('病名より先に、共通する壁を見る')).toBeInTheDocument();
    expect(screen.getByText('職場で起きやすい誤解をほどく')).toBeInTheDocument();
    expect(screen.getByText('まずは1ページ、5点構成で出すのが安全です。')).toBeInTheDocument();
  });
});
