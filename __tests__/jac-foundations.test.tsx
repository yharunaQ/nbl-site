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
});
