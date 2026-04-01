import { render, screen } from '@testing-library/react';
import WorkDesignWorkbookPage, { getStaticProps } from '@/pages/jac/guidebook';

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/jac/guidebook',
  }),
}));

describe('Work design workbook page', () => {
  it('renders the five-chapter pilot as archive and development history', async () => {
    const result = await getStaticProps({} as never);
    if (!('props' in result)) {
      throw new Error('Expected static props for workbook page');
    }
    const props = result.props as Parameters<typeof WorkDesignWorkbookPage>[0];

    render(<WorkDesignWorkbookPage {...props} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '重点5章の先行試作を、開発履歴として残す。',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('参考資料')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '26カード版を見る' })).toHaveAttribute(
      'href',
      '/jac/frames',
    );
    expect(screen.queryByText('購入ありがとうございます')).not.toBeInTheDocument();
  });
});
