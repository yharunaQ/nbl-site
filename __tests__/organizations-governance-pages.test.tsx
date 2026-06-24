import { render, screen } from '@testing-library/react';
import OrganizationsPage from '@/pages/organizations';
import OrganizationsDesignPage from '@/pages/organizations/design';
import OrganizationsDiagnosisPage from '@/pages/organizations/diagnosis';

jest.mock('@/components/SiteNav', () => function MockSiteNav() {
  return <div data-testid="site-nav" />;
});

describe('Organization governance surfaces', () => {
  it('shows the governance note on the organizations index', () => {
    render(<OrganizationsPage />);

    expect(screen.getByRole('heading', { level: 1, name: '職場の環境を変えたい' })).toBeInTheDocument();
    expect(screen.getByText('組織設計の入口')).toBeInTheDocument();
    expect(
      screen.getByText(/支援機関の管理職・機関長や企業の人事担当者/),
    ).toBeInTheDocument();
  });

  it('shows the governance note on the organizations design page', () => {
    render(<OrganizationsDesignPage />);

    expect(screen.getByRole('heading', { level: 1, name: '日本のデータが示す、効果的実践の構造' })).toBeInTheDocument();
    expect(screen.getByText('組織設計ガイド')).toBeInTheDocument();
    expect(
      screen.getByText(/日本の調査研究と国際的な実践知を手がかりに/),
    ).toBeInTheDocument();
  });

  it('shows the governance note on the organizations diagnosis intro', () => {
    render(<OrganizationsDiagnosisPage />);

    expect(screen.getByRole('heading', { level: 1, name: '組織自己チェック' })).toBeInTheDocument();
    expect(screen.getByText('この面は、話し合いの入口として使う自己チェックです')).toBeInTheDocument();
    expect(screen.queryByTestId('site-nav')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '相談する' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Resources' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ツールキット' })).toHaveAttribute(
      'href',
      '/toolkit-studio',
    );
    expect(screen.getByRole('link', { name: 'NBLレポート' })).toHaveAttribute(
      'href',
      '/articles-social-questions',
    );
  });
});
