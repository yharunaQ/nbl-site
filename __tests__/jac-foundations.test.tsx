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

  it('links each layer to the corresponding frame details page', () => {
    render(<JacFoundationsPage />);

    expect(screen.getByRole('link', { name: '体調レイヤーのフレーム詳細を見る' })).toHaveAttribute(
      'href',
      '/jac/frames#%E4%BD%93%E8%AA%BF%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC',
    );
    expect(screen.getByRole('link', { name: '就職移行レイヤーのフレーム詳細を見る' })).toHaveAttribute(
      'href',
      '/jac/frames#%E5%B0%B1%E8%81%B7%E7%A7%BB%E8%A1%8C%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC',
    );
    expect(screen.getByRole('link', { name: '職場運用レイヤーのフレーム詳細を見る' })).toHaveAttribute(
      'href',
      '/jac/frames#%E8%81%B7%E5%A0%B4%E9%81%8B%E7%94%A8%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC',
    );
  });
});
