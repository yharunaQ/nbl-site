import { render, screen } from '@testing-library/react';
import WorkDesignFrameReferencePage, { getStaticProps } from '@/pages/jac/frames';

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/jac/frames',
  }),
}));

describe('Work design frame reference page', () => {
  it('renders the card edition as the current core surface', async () => {
    const result = await getStaticProps({} as never);
    if (!('props' in result)) {
      throw new Error('Expected static props for frame reference page');
    }
    const props = result.props as Parameters<typeof WorkDesignFrameReferencePage>[0];

    render(<WorkDesignFrameReferencePage {...props} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '3レイヤー・26フレームの早見表',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('カード全体で共通する設計原則')).toBeInTheDocument();
    expect(screen.getAllByText('このフレームで先に整える土台').length).toBeGreaterThan(0);
    expect(screen.getAllByText('26フレーム早見表').length).toBeGreaterThan(0);
    expect(screen.queryByRole('link', { name: '仕事設計ガイドを見る' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '先行5章版の開発履歴を見る' })).not.toBeInTheDocument();
  });
});
