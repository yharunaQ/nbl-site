import type { NextApiRequest, NextApiResponse } from 'next';
import { getRefinementJob } from '@/lib/jac/refinementJobStore';
import { guardJacApiRequest } from '@/lib/security/jacAccessGuard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const guard = await guardJacApiRequest(req, { route: 'jac-assess-refinement', costly: false });
    if (!guard.ok) {
        return res.status(guard.status).json({ error: guard.error });
    }

    const jobId = String(req.query.jobId || '').trim();
    if (!jobId) {
        return res.status(400).json({ error: 'jobId is required' });
    }

    const job = await getRefinementJob(jobId);
    if (!job) {
        return res.status(404).json({ status: 'failed', error: 'Job not found or expired' });
    }

    if (job.status === 'completed') {
        return res.status(200).json({
            status: 'completed',
            assessment: job.payload?.assessment,
            process: job.payload?.process,
        });
    }

    if (job.status === 'failed') {
        return res.status(200).json({
            status: 'failed',
            error: job.error || 'Refinement failed',
        });
    }

    return res.status(200).json({
        status: 'pending',
    });
}
