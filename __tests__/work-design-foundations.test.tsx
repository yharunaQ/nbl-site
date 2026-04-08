import { fireEvent, render, screen } from '@testing-library/react';
import WorkDesignFoundationsPage from '@/pages/resources/work-design-foundations';

describe('Work design foundations page', () => {
  it('allows infographic zoom for detailed reading', () => {
    render(<WorkDesignFoundationsPage />);

    const openButton = screen.getByRole('button', {
      name: '仕事のコンディションマップを拡大して見る',
    });

    fireEvent.click(openButton);

    expect(screen.getByRole('dialog', { name: '仕事のコンディションマップの拡大表示' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '画像を別タブで開く' })).toBeInTheDocument();
  });

  it('shows correct next-step links', () => {
    render(<WorkDesignFoundationsPage />);

    expect(screen.getByRole('link', { name: 'はたらく相談室（AI対話）' })).toHaveAttribute('href', '/jac');
    expect(screen.getAllByRole('link', { name: '仕事設計ガイド（インタラクティブ）' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'リソース一覧へ' })).toHaveAttribute('href', '/resources');
  });
});
