import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

type JobStatus = 'pending' | 'completed' | 'failed';

export type RefinementJobPayload = {
    assessment: unknown;
    process: unknown;
};

type JobRecord = {
    id: string;
    status: JobStatus;
    createdAt: number;
    updatedAt: number;
    error?: string;
    payload?: RefinementJobPayload;
};

const JOB_TTL_MS = 15 * 60 * 1000;
const JOB_DIR = path.join(process.cwd(), '.tmp', 'jac-refinement-jobs');

async function ensureDir() {
    await fs.mkdir(JOB_DIR, { recursive: true });
}

function jobPath(id: string): string {
    return path.join(JOB_DIR, `${id}.json`);
}

async function writeJob(record: JobRecord) {
    await ensureDir();
    await fs.writeFile(jobPath(record.id), JSON.stringify(record), 'utf8');
}

async function readJob(id: string): Promise<JobRecord | null> {
    try {
        await ensureDir();
        const raw = await fs.readFile(jobPath(id), 'utf8');
        return JSON.parse(raw) as JobRecord;
    } catch {
        return null;
    }
}

async function pruneJobs() {
    try {
        await ensureDir();
        const now = Date.now();
        const files = await fs.readdir(JOB_DIR);
        await Promise.all(
            files.map(async (file) => {
                if (!file.endsWith('.json')) return;
                const fullPath = path.join(JOB_DIR, file);
                try {
                    const raw = await fs.readFile(fullPath, 'utf8');
                    const job = JSON.parse(raw) as JobRecord;
                    if (now - job.updatedAt > JOB_TTL_MS) {
                        await fs.unlink(fullPath);
                    }
                } catch {
                    // Ignore malformed/locked files.
                }
            }),
        );
    } catch {
        // Best effort cleanup.
    }
}

function runAsync(task: () => Promise<void>) {
    void task().catch(() => {
        // Job failure is recorded by caller.
    });
}

export function createRefinementJob(task: () => Promise<RefinementJobPayload>): string {
    const id = crypto.randomUUID();
    const now = Date.now();

    runAsync(async () => {
        await pruneJobs();
        await writeJob({
            id,
            status: 'pending',
            createdAt: now,
            updatedAt: now,
        });

        try {
            const payload = await task();
            const current = (await readJob(id)) || {
                id,
                status: 'pending',
                createdAt: now,
                updatedAt: now,
            };
            await writeJob({
                ...current,
                status: 'completed',
                payload,
                updatedAt: Date.now(),
            });
        } catch (error) {
            const current = (await readJob(id)) || {
                id,
                status: 'pending',
                createdAt: now,
                updatedAt: now,
            };
            await writeJob({
                ...current,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Refinement failed',
                updatedAt: Date.now(),
            });
        }
    });

    return id;
}

export async function getRefinementJob(jobId: string): Promise<JobRecord | null> {
    await pruneJobs();
    return readJob(jobId);
}
