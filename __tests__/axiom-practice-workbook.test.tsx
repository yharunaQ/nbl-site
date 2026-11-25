import { fireEvent, render, screen } from '@testing-library/react';
import Workbook from '@/components/axiom/AxiomPracticeWorkbook';
import {
  practiceWorkbookMarkdown,
  practiceWorkbooks,
  resolveWorkbookId,
} from '@/components/axiom/practiceWorkbook';
import Checklist from '@/components/axiom/SupportOrganizationChecklist';
import { organizationReviewText } from '@/components/axiom/organizationChecklistContent';

beforeEach(() => window.history.replaceState(null, '', '/'));

test('blank workbook and exports do not mix in fictional examples', () => {
  const text = practiceWorkbookMarkdown({});
  expect(text).toContain('未記入');
  for (const book of practiceWorkbooks)
    for (const example of Object.values(book.example)) expect(text).not.toContain(example);
  expect(resolveWorkbookId('unknown')).toBe('book1');
});

test('deep link selects the requested form; viewing an example preserves input and all forms save actual drafts', () => {
  window.history.replaceState(null, '', '/preview/axiom-next-nbl-v2/practice-workbook?form=book4');
  render(<Workbook />);
  expect(screen.getByRole('heading', { name: '機関の機能・勤務・費用を再配分する' })).toBeVisible();
  fireEvent.change(screen.getByLabelText('今届かない必要機能'), {
    target: { value: '人工の企業接点メモ' },
  });
  fireEvent.click(screen.getByText('架空の記入例を別に読む（入力は変わりません）'));
  expect(screen.getByLabelText('今届かない必要機能')).toHaveValue('人工の企業接点メモ');
  fireEvent.click(screen.getByRole('button', { name: /様式 1/ }));
  fireEvent.change(screen.getByLabelText('第一の説明と根拠'), {
    target: { value: '人工の説明メモ' },
  });
  fireEvent.change(screen.getByLabelText('比較する仕事の条件・未成立の部分'), {
    target: { value: '人工の比較案。別担当の有償時間は未成立' },
  });
  const OriginalBlob = Blob;
  const blobSpy = jest
    .spyOn(global, 'Blob')
    .mockImplementation((parts, options) => new OriginalBlob(parts, options));
  const originalCreate = URL.createObjectURL,
    originalRevoke = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => 'blob:synthetic');
  URL.revokeObjectURL = jest.fn();
  const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  try {
    fireEvent.click(screen.getByRole('button', { name: '四様式の入力を保存（md）' }));
    const text = String(blobSpy.mock.calls[0][0]?.[0]);
    expect(text).toContain('人工の企業接点メモ');
    expect(text).toContain('人工の説明メモ');
    expect(text).toContain('人工の比較案。別担当の有償時間は未成立');
    expect(text).not.toContain(practiceWorkbooks[3].example.gap);
    expect(screen.getByRole('status')).toHaveTextContent('保存操作');
    fireEvent.click(screen.getByRole('button', { name: /様式 4/ }));
    expect(screen.getByLabelText('今届かない必要機能')).toHaveValue('人工の企業接点メモ');
  } finally {
    blobSpy.mockRestore();
    clickSpy.mockRestore();
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});

test('checklist output keeps every written theme, including after selection is cleared', () => {
  const drafts = {
    work: { note: '人工の仕事案', owner: '仕事担当', timing: '来週' },
    network: { note: '人工の受入れ案', owner: '受理担当', timing: '翌週' },
  };
  for (const selected of ['work', '']) {
    const current = drafts[selected as keyof typeof drafts];
    const text = organizationReviewText(
      { practice: {}, organization: {} },
      selected,
      current?.owner,
      current?.timing,
      current?.note,
      drafts,
    );
    expect(text).toContain('人工の仕事案');
    expect(text).toContain('人工の受入れ案');
    expect(text).toContain('受理担当');
    expect(text).toContain('翌週');
  }
});

test('checklist print view retains drafts across themes', () => {
  const { container } = render(<Checklist />);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'work' } });
  fireEvent.change(screen.getByLabelText('自分たちで決めたこと・まだ確認すること'), {
    target: { value: '人工の仕事下書き' },
  });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'network' } });
  fireEvent.change(screen.getByLabelText('自分たちで決めたこと・まだ確認すること'), {
    target: { value: '人工の連携下書き' },
  });
  const print = container.querySelector('section.printOnly[aria-hidden="true"]');
  expect(print?.textContent).toContain('人工の仕事下書き');
  expect(print?.textContent).toContain('人工の連携下書き');
});
