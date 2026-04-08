import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/' }),
}));

describe('NBL Home', () => {
  it('renders the main tagline', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { level: 1 }),
    ).toHaveTextContent('就労の詰まりは、');
    expect(
      screen.getByText(/配慮をお願いする/),
    ).toBeInTheDocument();
  });

  it('does not expose review routes from the public home', () => {
    render(<Home />);

    expect(
      screen
        .getAllByRole('link')
        .every((link) => !(link.getAttribute('href') ?? '').startsWith('/review/')),
    ).toBe(true);
  });

  it('shows key stats and entry points', () => {
    render(<Home />);

    expect(screen.getAllByText('46.9%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('71.9%').length).toBeGreaterThan(0);
    expect(screen.getByText('最大6倍')).toBeInTheDocument();
    expect(screen.getByText('9,000件超')).toBeInTheDocument();
    expect(screen.getByText('今の相談事例を整理したい')).toBeInTheDocument();
    expect(screen.getByText('典型的な困難パターンを知りたい')).toBeInTheDocument();
  });
});
