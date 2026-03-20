import { render, screen } from '@testing-library/react';
import PublicVideosPage from '@/pages/videos';

describe('Public videos page', () => {
  it('shows related links that match each video topic', () => {
    render(<PublicVideosPage />);

    expect(
      screen.getAllByRole('link', { name: '企業・組織向けの整理を見る' }).every((link) => link.getAttribute('href') === '/for-enterprise'),
    ).toBe(true);
    expect(
      screen.getAllByRole('link', { name: '仕事設計の見取り図を見る' }).every((link) => link.getAttribute('href') === '/jac-foundations'),
    ).toBe(true);
    expect(screen.getByRole('link', { name: '障害者雇用の基礎図解を見る' })).toHaveAttribute(
      'href',
      '/jac-foundations#quality-metrics',
    );
  });
});
