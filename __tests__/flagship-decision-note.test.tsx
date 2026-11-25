import { fireEvent, render, screen, within } from '@testing-library/react';
import FlagshipDecisionNote from '@/components/axiom/FlagshipDecisionNote';

it('keeps private fields out of the public question and only carries checked text', () => {
  render(
    <FlagshipDecisionNote
      kind="case"
      contextId="selection-test"
      contextTitle="校正の例（架空）"
      question="帰りの介助を誰が確かめる？"
      sourceHref="#case-detail"
      references={[{ label: '公開の原典', href: 'https://example.org/source' }]}
      publicContext={['夕方の介助者が未確保。']}
    />,
  );
  fireEvent.change(screen.getByRole('textbox', { name: '残したい仕事・生活' }), {
    target: { value: '手元にだけ残す事情' },
  });
  const pending = screen.getByRole('textbox', { name: '断る・保留する条件' });
  fireEvent.change(pending, { target: { value: '帰りの担当と返答日を聞きたい。' } });

  const share = screen.getByText('持ち帰る項目を選ぶ', { selector: 'summary' }).closest('details')!;
  fireEvent.click(share.querySelector('summary')!);
  const keep = within(share).getByRole('checkbox', { name: '断る・保留する条件' });
  fireEvent.click(keep);
  const text = (within(share).getByRole('textbox', { name: '持ち帰り用テキスト' }) as HTMLTextAreaElement).value;
  expect(text).toContain('帰りの担当と返答日を聞きたい。');
  expect(text).toContain('https://example.org/source');
  expect(text).toContain('2026-11-25');
  expect(text).not.toContain('手元にだけ残す事情');

  const ai = screen.getByText('紙で書く・自分のAIで考える', { selector: 'summary' }).closest('details')!;
  fireEvent.click(ai.querySelector('summary')!);
  const publicText = (within(ai).getByRole('textbox', { name: '自分のAIに渡す問い' }) as HTMLTextAreaElement).value;
  expect(publicText).toContain('夕方の介助者が未確保。');
  expect(publicText).not.toContain('手元にだけ残す事情');
  expect(publicText).not.toContain('帰りの担当と返答日を聞きたい。');

  fireEvent.change(pending, { target: { value: '共有前に書き換えた内容' } });
  expect(keep).not.toBeChecked();
  expect(within(share).getByRole('button', { name: '選んだ内容を印刷' })).toBeDisabled();
});
