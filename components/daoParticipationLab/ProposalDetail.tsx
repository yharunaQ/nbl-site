import { useState, type FormEvent } from 'react';
import ProposalStatusBadge from '@/components/daoParticipationLab/ProposalStatusBadge';
import {
  proposalStatuses,
  proposalStatusLabels,
  type AddCommentInput,
  type Proposal,
  type ProposalStatus,
} from '@/lib/daoParticipationLab/types';

type ProposalDetailProps = {
  proposal: Proposal | null;
  isUpdatingStatus: boolean;
  isSubmittingComment: boolean;
  mutationError: string | null;
  onStatusChange: (proposalId: string, status: ProposalStatus) => Promise<void>;
  onCommentCreate: (proposalId: string, input: AddCommentInput) => Promise<void>;
};

function formatLongDate(value: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

const initialComment = {
  author: '',
  body: '',
};

export default function ProposalDetail({
  proposal,
  isUpdatingStatus,
  isSubmittingComment,
  mutationError,
  onStatusChange,
  onCommentCreate,
}: ProposalDetailProps) {
  const [commentForm, setCommentForm] = useState(initialComment);

  if (!proposal) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500">
        表示する提案がありません。左の一覧から選ぶか、新規提案を作成してください。
      </section>
    );
  }

  const currentProposal = proposal;

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await onCommentCreate(currentProposal.id, commentForm);
      setCommentForm(initialComment);
    } catch {
      // エラー表示は親コンポーネント側で扱う。
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <ProposalStatusBadge status={currentProposal.status} />
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              Proposal Detail
            </p>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">{currentProposal.title}</h2>
          <p className="mt-2 text-sm text-slate-500">
            提案者: {currentProposal.proposer} ・ 作成:{' '}
            {formatLongDate(currentProposal.createdAt)} ・ 更新:{' '}
            {formatLongDate(currentProposal.updatedAt)}
          </p>
          <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {currentProposal.summary}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 md:max-w-xs">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">状態を変更</span>
            <select
              value={currentProposal.status}
              disabled={isUpdatingStatus}
              onChange={(event) =>
                onStatusChange(currentProposal.id, event.target.value as ProposalStatus)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
            >
              {proposalStatuses.map((status) => (
                <option key={status} value={status}>
                  {proposalStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            draft / active / review / closed を切り替えられます。状態変更はこのローカル
            JSON ストアに保存されます。
          </p>
        </div>
      </div>

      {mutationError ? (
        <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {mutationError}
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">コメント</h3>
            <span className="text-sm text-slate-500">{currentProposal.comments.length}件</span>
          </div>

          <div className="mt-4 space-y-4">
            {currentProposal.comments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                まだコメントはありません。最初の感想や確認事項を書けます。
              </div>
            ) : null}

            {currentProposal.comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{comment.author}</p>
                  <p className="text-xs text-slate-500">{formatLongDate(comment.createdAt)}</p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {comment.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">コメントを追加</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            短い感想、懸念、改善提案を残せます。認証はなく、ローカル環境でのみ使う前提です。
          </p>

          <form className="mt-5 space-y-4" onSubmit={handleCommentSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                コメント投稿者名
              </span>
              <input
                type="text"
                value={commentForm.author}
                onChange={(event) =>
                  setCommentForm((current) => ({ ...current, author: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                placeholder="例: Reviewer A"
                maxLength={50}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                コメント本文
              </span>
              <textarea
                value={commentForm.body}
                onChange={(event) =>
                  setCommentForm((current) => ({ ...current, body: event.target.value }))
                }
                className="min-h-36 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 focus:border-slate-400 focus:outline-none"
                placeholder="例: 初回導線で何をすればよいか迷いやすい"
                maxLength={2000}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmittingComment}
              className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmittingComment ? '保存中...' : 'コメントを追加'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
