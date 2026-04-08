import { fireEvent, render, screen } from '@testing-library/react';
import JacFoundationsPage from '@/pages/jac-foundations';

describe('Jac foundations page', () => {
  it('allows infographic zoom for detailed reading', () => {
    render(<JacFoundationsPage />);

    const openButton = screen.getByRole('button', {
      name: '仕事のコンディションマップを拡大して見る',
    });

    fireEvent.click(openButton);

    expect(screen.getByRole('dialog', { name: '仕事のコンディションマップの拡大表示' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '画像を別タブで開く' })).toBeInTheDocument();
  });

  it('shows correct next-step links without old frame pages', () => {
    render(<JacFoundationsPage />);

    expect(screen.getByRole('link', { name: 'はたらく相談室（AI対話）' })).toHaveAttribute('href', '/jac');
    expect(screen.getByRole('link', { name: '仕事設計ガイド（インタラクティブ）' })).toHaveAttribute('href', '/jac/guide');
    expect(screen.queryByRole('link', { name: '26フレーム早見表' })).toBeNull();
    expect(screen.queryByRole('link', { name: /jac\/frames/ })).toBeNull();
  });
});
