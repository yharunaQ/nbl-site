import { render, screen } from '@testing-library/react';
import ContactPage from '@/pages/contact';

describe('Contact page', () => {
  it('renders the softer contact guide with founder context', () => {
    render(<ContactPage />);

    expect(
      screen.getByRole('heading', {
        name: 'NBL と話を始めたい方へ',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('NBL と話を始めたい方へ')).toBeInTheDocument();
    expect(screen.getByText('春名由一郎')).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link', { name: 'About を見る' })
        .every((link) => link.getAttribute('href') === '/about'),
    ).toBe(true);
    expect(screen.getByRole('link', { name: '研究プロフィールを見る' })).toHaveAttribute(
      'href',
      'https://researchmap.jp/yharuna',
    );
    expect(
      screen.getByRole('link', { name: 'info@nextbeinglab.org にメールする' }),
    ).toHaveAttribute('href', 'mailto:info@nextbeinglab.org');
  });
});
