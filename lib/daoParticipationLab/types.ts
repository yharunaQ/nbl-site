export const proposalStatuses = ['draft', 'active', 'review', 'closed'] as const;

export type ProposalStatus = (typeof proposalStatuses)[number];

export type ProposalComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type Proposal = {
  id: string;
  title: string;
  summary: string;
  proposer: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
  comments: ProposalComment[];
};

export type ProposalStore = {
  proposals: Proposal[];
};

export type CreateProposalInput = {
  title: string;
  summary: string;
  proposer: string;
};

export type AddCommentInput = {
  author: string;
  body: string;
};

export const proposalStatusLabels: Record<ProposalStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  review: 'Review',
  closed: 'Closed',
};

export function isProposalStatus(value: string): value is ProposalStatus {
  return proposalStatuses.includes(value as ProposalStatus);
}

export function sortProposals(proposals: Proposal[]): Proposal[] {
  const statusOrder: Record<ProposalStatus, number> = {
    active: 0,
    review: 1,
    draft: 2,
    closed: 3,
  };

  return [...proposals].sort((left, right) => {
    const statusDelta = statusOrder[left.status] - statusOrder[right.status];
    if (statusDelta !== 0) return statusDelta;
    return right.updatedAt.localeCompare(left.updatedAt);
  });
}
