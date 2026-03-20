import { proposalStatusLabels, type ProposalStatus } from '@/lib/daoParticipationLab/types';

const statusClasses: Record<ProposalStatus, string> = {
  draft: 'border-slate-200 bg-slate-100 text-slate-700',
  active: 'border-emerald-200 bg-emerald-100 text-emerald-700',
  review: 'border-amber-200 bg-amber-100 text-amber-700',
  closed: 'border-zinc-200 bg-zinc-100 text-zinc-700',
};

type ProposalStatusBadgeProps = {
  status: ProposalStatus;
};

export default function ProposalStatusBadge({ status }: ProposalStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${statusClasses[status]}`}
    >
      {proposalStatusLabels[status]}
    </span>
  );
}
