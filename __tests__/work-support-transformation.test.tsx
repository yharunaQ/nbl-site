import { render, screen } from '@testing-library/react';
import WorkSupportTransformationPage from '@/pages/resources/work-support-transformation';

describe('Work support transformation collection', () => {
  it('renders the public collection and core links', () => {
    render(<WorkSupportTransformationPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /就労支援設計の変革テーマ群/ }),
    ).toBeInTheDocument();
    expect(screen.getByText('障害者雇用支援の世界標準')).toBeInTheDocument();
    expect(screen.getByText('日本における変革課題')).toBeInTheDocument();
    expect(screen.getByText('慢性疾患の支援')).toBeInTheDocument();
    expect(screen.getByText('支援者・行政の実装レーン')).toBeInTheDocument();
    expect(screen.getByText('インクルーシブ雇用の要：就労選択支援')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Resourcesへ戻る' })).toHaveAttribute('href', '/resources');
    expect(screen.getByRole('link', { name: '仕事設計の基礎図解を見る' })).toHaveAttribute(
      'href',
      '/resources/work-design-foundations',
    );
    expect(screen.getByRole('link', { name: 'What We Do を見る' })).toHaveAttribute(
      'href',
      '/what-we-do',
    );
  });
});
