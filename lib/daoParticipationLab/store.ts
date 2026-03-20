import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  isProposalStatus,
  sortProposals,
  type AddCommentInput,
  type CreateProposalInput,
  type Proposal,
  type ProposalComment,
  type ProposalStatus,
  type ProposalStore,
} from '@/lib/daoParticipationLab/types';

const runtimeDir = path.join(process.cwd(), '.tmp', 'dao-participation-lab');
const runtimeStorePath = path.join(runtimeDir, 'proposals.json');
const seedStorePath = path.join(
  process.cwd(),
  'dao-participation-lab',
  'data',
  'seed-proposals.json',
);

let writeQueue: Promise<unknown> = Promise.resolve();

function normalizeComment(input: unknown): ProposalComment | null {
  if (!input || typeof input !== 'object') return null;
  const row = input as Record<string, unknown>;
  const id = String(row.id || '').trim();
  const author = String(row.author || '').trim();
  const body = String(row.body || '').trim();
  const createdAt = String(row.createdAt || '').trim();

  if (!id || !author || !body || !createdAt) return null;
  return {
    id,
    author,
    body,
    createdAt,
  };
}

function normalizeProposal(input: unknown): Proposal | null {
  if (!input || typeof input !== 'object') return null;
  const row = input as Record<string, unknown>;
  const id = String(row.id || '').trim();
  const title = String(row.title || '').trim();
  const summary = String(row.summary || '').trim();
  const proposer = String(row.proposer || '').trim();
  const status = String(row.status || '').trim();
  const createdAt = String(row.createdAt || '').trim();
  const updatedAt = String(row.updatedAt || '').trim();
  const comments = Array.isArray(row.comments)
    ? row.comments
        .map((comment) => normalizeComment(comment))
        .filter((comment): comment is ProposalComment => comment !== null)
    : [];

  if (!id || !title || !summary || !proposer || !createdAt || !updatedAt) return null;

  return {
    id,
    title,
    summary,
    proposer,
    status: isProposalStatus(status) ? status : 'draft',
    createdAt,
    updatedAt,
    comments,
  };
}

function normalizeStore(input: unknown): ProposalStore {
  if (!input || typeof input !== 'object') {
    return { proposals: [] };
  }

  const row = input as Record<string, unknown>;
  const proposalsValue = row.proposals;
  const proposals = Array.isArray(proposalsValue)
    ? proposalsValue
        .map((proposal: unknown) => normalizeProposal(proposal))
        .filter((proposal: Proposal | null): proposal is Proposal => proposal !== null)
    : [];

  return {
    proposals: sortProposals(proposals),
  };
}

async function ensureRuntimeStore(): Promise<void> {
  await mkdir(runtimeDir, { recursive: true });
  try {
    await readFile(runtimeStorePath, 'utf-8');
  } catch {
    await copyFile(seedStorePath, runtimeStorePath);
  }
}

async function readStore(): Promise<ProposalStore> {
  await ensureRuntimeStore();
  const raw = await readFile(runtimeStorePath, 'utf-8');
  return normalizeStore(JSON.parse(raw));
}

async function persistStore(store: ProposalStore): Promise<void> {
  const nextStore = {
    proposals: sortProposals(store.proposals),
  };

  await writeFile(runtimeStorePath, `${JSON.stringify(nextStore, null, 2)}\n`, 'utf-8');
}

async function withStoreMutation<T>(
  mutator: (store: ProposalStore) => Promise<{ store: ProposalStore; result: T }> | { store: ProposalStore; result: T },
): Promise<T> {
  const run = writeQueue.then(async () => {
    const currentStore = await readStore();
    const { store, result } = await mutator(currentStore);
    await persistStore(store);
    return result;
  });

  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

function validateLength(value: string, label: string, maxLength: number): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label}を入力してください。`);
  }
  if (trimmed.length > maxLength) {
    throw new Error(`${label}は${maxLength}文字以内で入力してください。`);
  }
  return trimmed;
}

export async function listProposals(): Promise<Proposal[]> {
  const store = await readStore();
  return sortProposals(store.proposals);
}

export async function createProposal(input: CreateProposalInput): Promise<Proposal> {
  const title = validateLength(input.title, 'タイトル', 100);
  const summary = validateLength(input.summary, '概要', 1000);
  const proposer = validateLength(input.proposer, '提案者名', 50);
  const now = new Date().toISOString();

  return withStoreMutation(async (store) => {
    const proposal: Proposal = {
      id: randomUUID(),
      title,
      summary,
      proposer,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      comments: [],
    };

    return {
      store: {
        proposals: [proposal, ...store.proposals],
      },
      result: proposal,
    };
  });
}

export async function addProposalComment(
  proposalId: string,
  input: AddCommentInput,
): Promise<Proposal> {
  const author = validateLength(input.author, 'コメント投稿者名', 50);
  const body = validateLength(input.body, 'コメント本文', 2000);

  return withStoreMutation(async (store) => {
    const target = store.proposals.find((proposal) => proposal.id === proposalId);
    if (!target) {
      throw new Error('対象の提案が見つかりません。');
    }

    const now = new Date().toISOString();
    const comment: ProposalComment = {
      id: randomUUID(),
      author,
      body,
      createdAt: now,
    };

    const proposal: Proposal = {
      ...target,
      comments: [...target.comments, comment],
      updatedAt: now,
    };

    return {
      store: {
        proposals: store.proposals.map((row) => (row.id === proposalId ? proposal : row)),
      },
      result: proposal,
    };
  });
}

export async function updateProposalStatus(
  proposalId: string,
  status: ProposalStatus,
): Promise<Proposal> {
  if (!isProposalStatus(status)) {
    throw new Error('不正な状態です。');
  }

  return withStoreMutation(async (store) => {
    const target = store.proposals.find((proposal) => proposal.id === proposalId);
    if (!target) {
      throw new Error('対象の提案が見つかりません。');
    }

    const proposal: Proposal = {
      ...target,
      status,
      updatedAt: new Date().toISOString(),
    };

    return {
      store: {
        proposals: store.proposals.map((row) => (row.id === proposalId ? proposal : row)),
      },
      result: proposal,
    };
  });
}
