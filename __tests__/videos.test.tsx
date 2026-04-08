import { render, screen } from '@testing-library/react';
import PublicVideosPage from '@/pages/videos';

describe('Public videos page', () => {
  it('shows related links that match each video topic', () => {
    render(<PublicVideosPage />);

    expect(
      screen
        .getAllByRole('link', { name: '就労支援設計の変革テーマ群を見る' })
        .every((link) => link.getAttribute('href') === '/resources/work-support-transformation'),
    ).toBe(true);
    expect(
      screen.getAllByRole('link', { name: '仕事設計の基礎図解を見る' }).every((link) => link.getAttribute('href') === '/resources/work-design-foundations'),
    ).toBe(true);
  });

  it('shows the newly added awareness videos', () => {
    render(<PublicVideosPage />);

    expect(screen.getByRole('heading', { name: '障害者雇用の「能力主義」に潜む3つの罠' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '「配慮疲れ」を終わらせる3つの神話とシステム転換' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '障害者雇用の「枠」は撤廃すべきか？' })).toBeInTheDocument();
  });
});
