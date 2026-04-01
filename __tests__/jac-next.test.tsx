import { render, screen } from '@testing-library/react';
import JacNextPage from '@/pages/jac/next';

describe('Jac next page', () => {
  it('renders the consultation entry', () => {
    render(<JacNextPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '就労困難の見立てを、一緒に構築する。',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: '見立てを開始する' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'ツール紹介を見る' }),
    ).toHaveAttribute('href', '/jac/intro');
  });

  it('shows the tool description section before assessment', () => {
    render(<JacNextPage />);
    expect(screen.getByText('このツールについて')).toBeInTheDocument();
    expect(screen.getByText('支援仮説の生成')).toBeInTheDocument();
    expect(screen.getByText('合意文書の作成')).toBeInTheDocument();
  });
});
