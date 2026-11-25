import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AxiomPublicCollaboration from '@/components/axiom/AxiomPublicCollaboration';

describe('public collaboration', () => {
  it('creates a portable proposal without placing the input in an external link', async () => {
    const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    try {
      render(<AxiomPublicCollaboration basePath="/preview/axiom-next-nbl-v2" />);
      fireEvent.change(screen.getByLabelText('提案の種類'), { target: { value: '本人の別案を加える' } });
      fireEvent.change(screen.getByLabelText('対象の資料・版・箇所'), { target: { value: '相談事例の第2節' } });
      fireEvent.change(screen.getByLabelText('提案', { exact: true }), { target: { value: '夕方以外も選べる案を加える' } });
      fireEvent.click(screen.getByRole('button', { name: '控えをコピー' }));

      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('控えをコピーしました'));
      const draft = writeText.mock.calls[0][0];
      expect(draft).toContain('本人の別案を加える');
      expect(draft).toContain('相談事例の第2節');
      expect(draft).toContain('夕方以外も選べる案を加える');

      expect(screen.getByRole('link', { name: '編集部宛てのメールを開く' })).toHaveAttribute(
        'href',
        `mailto:info@nextbeinglab.org?subject=${encodeURIComponent('NBLサイトへの提案')}`,
      );
      expect(screen.getByRole('link', { name: '相談事例へ' })).toHaveAttribute(
        'href',
        '/preview/axiom-next-nbl-v2/case-readings',
      );
      expect(screen.getByRole('link', { name: 'XのNBL｜仕事条件デザイン' })).toHaveAttribute(
        'href',
        'https://x.com/NBL_workdesign',
      );
      const issueUrl = new URL(screen.getByRole('link', { name: 'GitHubで公開提案を書く' }).getAttribute('href')!);
      expect(issueUrl.pathname).toBe('/yharunaQ/nbl-site/issues/new');
      expect(issueUrl.searchParams.get('title')).toBe('[NBL提案] ');
      expect(issueUrl.searchParams.get('body')).toContain('対象の資料・版・箇所');
      expect(issueUrl.searchParams.get('body')).not.toContain('夕方以外も選べる案を加える');
      expect(screen.getByRole('link', { name: 'GitHubの提案一覧を開く' })).toHaveAttribute(
        'href',
        expect.stringContaining('/yharunaQ/nbl-site/issues?q='),
      );
    } finally {
      if (clipboard) Object.defineProperty(navigator, 'clipboard', clipboard);
      else Reflect.deleteProperty(navigator, 'clipboard');
    }
  });
});
