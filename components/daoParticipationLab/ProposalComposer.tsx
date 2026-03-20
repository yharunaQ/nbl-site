import { useState, type FormEvent } from 'react';
import type { CreateProposalInput } from '@/lib/daoParticipationLab/types';

type ProposalComposerProps = {
  onCreate: (input: CreateProposalInput) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
};

const initialForm = {
  title: '',
  proposer: '',
  summary: '',
};

export default function ProposalComposer({
  onCreate,
  isSubmitting,
  errorMessage,
}: ProposalComposerProps) {
  const [form, setForm] = useState(initialForm);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await onCreate(form);
      setForm(initialForm);
    } catch {
      // エラー表示は親コンポーネント側で扱う。
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          New Proposal
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          新しい実験提案を追加する
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          タイトル、概要、提案者名だけで作成できます。状態は自動で
          <span className="font-semibold text-slate-900"> draft </span>
          から始まります。
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">タイトル</span>
          <input
            type="text"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none"
            placeholder="例: JAC初回導線の違和感レビュー"
            maxLength={100}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">提案者名</span>
          <input
            type="text"
            value={form.proposer}
            onChange={(event) =>
              setForm((current) => ({ ...current, proposer: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none"
            placeholder="例: NBL Lab Host"
            maxLength={50}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">概要</span>
          <textarea
            value={form.summary}
            onChange={(event) =>
              setForm((current) => ({ ...current, summary: event.target.value }))
            }
            className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none"
            placeholder="何を試したいか、どんなフィードバックがほしいかを短く書く"
            maxLength={1000}
          />
        </label>

        {errorMessage ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? '作成中...' : '提案を作成'}
        </button>
      </form>
    </section>
  );
}
