import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';
describe('NBL Home', () => {
  it('shows Vision link in nav', () => {
    render(<Home />);
    const link = screen.getAllByText('ビジョン')[0];
    expect(link).toBeInTheDocument();
  });
  it('has key sections present (ids)', () => {
    render(<Home />);
    const ids = ['about','pillars','product','services','reports','campaign','vision','contact'];
    ids.forEach((id) => { expect(document.querySelector(`#${id}`)).toBeInTheDocument(); });
  });
  it('hero has CTA buttons', () => {
    render(<Home />);
    expect(screen.getByText('JACを見る')).toBeInTheDocument();
    expect(screen.getByText('最新レポート')).toBeInTheDocument();
  });
});
