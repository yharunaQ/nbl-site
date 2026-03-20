import ProposalStatusBadge from '@/components/daoParticipationLab/ProposalStatusBadge';
import type { Proposal } from '@/lib/daoParticipationLab/types';

type ProposalListProps = {
  proposals: Proposal[];
  selectedProposalId: string | null;
  onSelect: (proposalId: string) => void;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function ProposalList({
  proposals,
  selectedProposalId,
  onSelect,
}: ProposalListProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="border-b border-slate-100 px-2 pb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Proposals
        </p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">
          実験提案一覧
        </h2>
      </div>

      <div className="mt-3 space-y-2">
        {proposals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">
            提案がまだありません。右側のフォームから最初の提案を作成できます。
          </div>
        ) : null}

        {proposals.map((proposal) => {
          const isSelected = proposal.id === selectedProposalId;
          return (
            <button
              key={proposal.id}
              type="button"
              onClick={() => onSelect(proposal.id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                  : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{proposal.title}</p>
                  <p
                    className={`mt-1 text-xs ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {proposal.proposer} ・ {formatDate(proposal.updatedAt)}
                  </p>
                </div>
                <ProposalStatusBadge status={proposal.status} />
              </div>
              <p
                className={`mt-3 line-clamp-3 text-sm leading-6 ${
                  isSelected ? 'text-slate-200' : 'text-slate-600'
                }`}
              >
                {proposal.summary}
              </p>
              <p
                className={`mt-3 text-xs font-medium ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                コメント {proposal.comments.length}件
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
