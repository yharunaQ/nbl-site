import Head from 'next/head';
import { useEffect, useState } from 'react';
import ProposalComposer from '@/components/daoParticipationLab/ProposalComposer';
import ProposalDetail from '@/components/daoParticipationLab/ProposalDetail';
import ProposalList from '@/components/daoParticipationLab/ProposalList';
import { listProposals } from '@/lib/daoParticipationLab/store';
import {
  sortProposals,
  type AddCommentInput,
  type CreateProposalInput,
  type Proposal,
  type ProposalStatus,
} from '@/lib/daoParticipationLab/types';

type DaoParticipationLabPageProps = {
  initialProposals: Proposal[];
};

type MutationResponse = {
  proposal?: Proposal;
  error?: string;
};

export async function getServerSideProps() {
  const initialProposals = await listProposals();
  return {
    props: {
      initialProposals,
    },
  };
}

function readErrorMessage(payload: MutationResponse, fallbackMessage: string): string {
  return payload.error || fallbackMessage;
}

export default function DaoParticipationLabPage({
  initialProposals,
}: DaoParticipationLabPageProps) {
  const [proposals, setProposals] = useState(sortProposals(initialProposals));
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
    initialProposals[0]?.id ?? null,
  );
  const [createError, setCreateError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const selectedProposal =
    proposals.find((proposal) => proposal.id === selectedProposalId) || proposals[0] || null;
  const activeCount = proposals.filter((proposal) => proposal.status === 'active').length;
  const reviewCount = proposals.filter((proposal) => proposal.status === 'review').length;
  const commentCount = proposals.reduce(
    (count, proposal) => count + proposal.comments.length,
    0,
  );

  useEffect(() => {
    if (!selectedProposal && proposals.length > 0) {
      setSelectedProposalId(proposals[0].id);
    }
  }, [proposals, selectedProposal]);

  function upsertProposal(nextProposal: Proposal) {
    setProposals((current) => {
      const exists = current.some((proposal) => proposal.id === nextProposal.id);
      const nextList = exists
        ? current.map((proposal) =>
            proposal.id === nextProposal.id ? nextProposal : proposal,
          )
        : [nextProposal, ...current];
      return sortProposals(nextList);
    });
    setSelectedProposalId(nextProposal.id);
  }

  async function handleCreateProposal(input: CreateProposalInput) {
    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await fetch('/api/dao-participation-lab/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      const payload = (await response.json()) as MutationResponse;

      if (!response.ok || !payload.proposal) {
        throw new Error(readErrorMessage(payload, '提案を作成できませんでした。'));
      }

      upsertProposal(payload.proposal);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : '提案を作成できませんでした。',
      );
      throw error;
    } finally {
      setIsCreating(false);
    }
  }

  async function handleStatusChange(proposalId: string, status: ProposalStatus) {
    setIsUpdatingStatus(true);
    setMutationError(null);

    try {
      const response = await fetch(
        `/api/dao-participation-lab/proposals/${proposalId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        },
      );
      const payload = (await response.json()) as MutationResponse;

      if (!response.ok || !payload.proposal) {
        throw new Error(readErrorMessage(payload, '状態を更新できませんでした。'));
      }

      upsertProposal(payload.proposal);
    } catch (error) {
      setMutationError(
        error instanceof Error ? error.message : '状態を更新できませんでした。',
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleCommentCreate(proposalId: string, input: AddCommentInput) {
    setIsSubmittingComment(true);
    setMutationError(null);

    try {
      const response = await fetch(
        `/api/dao-participation-lab/proposals/${proposalId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        },
      );
      const payload = (await response.json()) as MutationResponse;

      if (!response.ok || !payload.proposal) {
        throw new Error(readErrorMessage(payload, 'コメントを追加できませんでした。'));
      }

      upsertProposal(payload.proposal);
    } catch (error) {
      setMutationError(
        error instanceof Error ? error.message : 'コメントを追加できませんでした。',
      );
      throw error;
    } finally {
      setIsSubmittingComment(false);
    }
  }

  return (
    <>
      <Head>
        <title>DAO Participation Lab | Next Being Lab</title>
        <meta
          name="description"
          content="DAO Participation Lab の最小ローカルWebアプリ。実験提案の一覧、作成、コメント、状態管理を行えます。"
        />
      </Head>

      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e2e8f0,transparent_32%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <header className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-xl shadow-slate-200/70 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
              Next Being Lab
            </p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1.3fr,0.7fr] lg:items-end">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                  DAO Participation Lab
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                  JACプロトタイプやNBLコンテンツに対する小さなフィードバック実験を、
                  ローカル環境で軽く回すための最小アプリです。認証やトークン設計は持たず、
                  提案・コメント・状態管理だけに絞っています。
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Proposals</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{proposals.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Active / Review</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {activeCount} / {reviewCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Comments</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{commentCount}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="mt-8 grid gap-8 xl:grid-cols-[360px,1fr]">
            <div className="space-y-8">
              <ProposalComposer
                onCreate={handleCreateProposal}
                isSubmitting={isCreating}
                errorMessage={createError}
              />
              <ProposalList
                proposals={proposals}
                selectedProposalId={selectedProposal?.id ?? null}
                onSelect={setSelectedProposalId}
              />
            </div>

            <ProposalDetail
              proposal={selectedProposal}
              isUpdatingStatus={isUpdatingStatus}
              isSubmittingComment={isSubmittingComment}
              mutationError={mutationError}
              onStatusChange={handleStatusChange}
              onCommentCreate={handleCommentCreate}
            />
          </div>
        </div>
      </div>
    </>
  );
}
