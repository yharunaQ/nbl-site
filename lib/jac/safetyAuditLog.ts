import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { NextApiRequest } from 'next';

type AuditOutcome = 'success' | 'fallback' | 'error';

export type JacSafetyGateAuditSnapshot = {
  mode: 'normal' | 'caution' | 'strict';
  recommendationPolicy: 'standard' | 'conditional_only' | 'questions_first';
  summary: string;
  reasonCodes: string[];
  matchedClaimCount: number;
  highRiskClaimCount: number;
  mediumRiskClaimCount: number;
  aggregatedEvidenceClaimCount: number;
  specificCaseClaimCount: number;
  partialClaimCount: number;
  missingContextCount: number;
};

type RecordSafetyAuditInput = {
  req: NextApiRequest;
  outcome: AuditOutcome;
  route: 'jac-assess';
  responseMode: 'fast' | 'full' | 'unknown';
  safetyGate: JacSafetyGateAuditSnapshot;
  selectedSourceCount: number;
  evidenceCount: number;
  warningCount: number;
  fallbackReason?: string | null;
  consultationLength: number;
  additionalConsultationLength: number;
  selectedTagCount: number;
  followUpAnswerCount: number;
};

type JacSafetyAuditEvent = {
  id: string;
  at: string;
  route: 'jac-assess';
  outcome: AuditOutcome;
  responseMode: 'fast' | 'full' | 'unknown';
  safetyGate: JacSafetyGateAuditSnapshot;
  request: {
    ipHash: string;
    userAgentHash: string;
    hasAccessToken: boolean;
  };
  input: {
    consultationLength: number;
    additionalConsultationLength: number;
    selectedTagCount: number;
    followUpAnswerCount: number;
  };
  runtime: {
    selectedSourceCount: number;
    evidenceCount: number;
    warningCount: number;
    fallbackReason: string | null;
  };
  signals: {
    requiresImmediateReview: boolean;
    immediateReviewReasons: string[];
  };
};

const AUDIT_DIR = path.join(process.cwd(), '.tmp', 'jac-safety-audit');
const AUDIT_RETENTION_DAYS_DEFAULT = 14;

function toDayKey(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function safeHash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 16);
}

function extractIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0];
  }
  return req.socket?.remoteAddress || 'unknown';
}

function hasAccessToken(req: NextApiRequest): boolean {
  const headerToken = req.headers['x-jac-access-token'];
  if (typeof headerToken === 'string' && headerToken.trim()) return true;
  if (Array.isArray(headerToken) && headerToken[0]) return true;
  const queryToken = req.query.accessToken;
  if (typeof queryToken === 'string' && queryToken.trim()) return true;
  if (Array.isArray(queryToken) && queryToken[0]) return true;
  return false;
}

async function ensureAuditDir(): Promise<void> {
  await fs.mkdir(AUDIT_DIR, { recursive: true });
}

async function pruneAuditFiles(retentionDays: number): Promise<void> {
  const keepMs = Math.max(1, retentionDays) * 24 * 60 * 60 * 1000;
  const threshold = Date.now() - keepMs;
  const files = await fs.readdir(AUDIT_DIR).catch(() => []);
  await Promise.all(
    files.map(async (file) => {
      if (!file.endsWith('.jsonl')) return;
      const fullPath = path.join(AUDIT_DIR, file);
      try {
        const stat = await fs.stat(fullPath);
        if (stat.mtimeMs < threshold) {
          await fs.unlink(fullPath);
        }
      } catch {
        // best effort
      }
    }),
  );
}

function buildAuditEvent(input: RecordSafetyAuditInput): JacSafetyAuditEvent {
  const now = new Date();
  const ip = extractIp(input.req);
  const userAgent = String(input.req.headers['user-agent'] || '');
  return {
    id: crypto.randomUUID(),
    at: now.toISOString(),
    route: input.route,
    outcome: input.outcome,
    responseMode: input.responseMode,
    safetyGate: input.safetyGate,
    request: {
      ipHash: safeHash(ip),
      userAgentHash: safeHash(userAgent),
      hasAccessToken: hasAccessToken(input.req),
    },
    input: {
      consultationLength: input.consultationLength,
      additionalConsultationLength: input.additionalConsultationLength,
      selectedTagCount: input.selectedTagCount,
      followUpAnswerCount: input.followUpAnswerCount,
    },
    runtime: {
      selectedSourceCount: input.selectedSourceCount,
      evidenceCount: input.evidenceCount,
      warningCount: input.warningCount,
      fallbackReason: input.fallbackReason || null,
    },
    signals: buildAuditSignals(input),
  };
}

function buildAuditSignals(input: RecordSafetyAuditInput): JacSafetyAuditEvent['signals'] {
  const reasons = new Set<string>();

  if (input.outcome === 'error') {
    reasons.add('outcome_error');
  }
  if (input.outcome === 'fallback') {
    reasons.add('outcome_fallback');
  }
  if (input.safetyGate.mode === 'strict') {
    reasons.add('strict_mode');
  }

  const strongReasonCodes = new Set([
    'high_risk_without_specific_case',
    'high_risk_dominant',
    'aggregated_evidence_dominant',
  ]);
  for (const code of input.safetyGate.reasonCodes || []) {
    if (strongReasonCodes.has(code)) {
      reasons.add(`reason_code:${code}`);
    }
  }

  if (input.safetyGate.missingContextCount >= 3) {
    reasons.add('missing_context_high');
  }
  if (input.warningCount >= 3) {
    reasons.add('warning_count_high');
  }
  if (input.selectedSourceCount > 0 && input.evidenceCount === 0) {
    reasons.add('evidence_zero_with_sources');
  }

  const immediateReviewReasons = Array.from(reasons);
  return {
    requiresImmediateReview: immediateReviewReasons.length > 0,
    immediateReviewReasons,
  };
}

export async function recordJacSafetyAudit(input: RecordSafetyAuditInput): Promise<void> {
  try {
    await ensureAuditDir();
    const retentionDays = Number(
      process.env.JAC_AUDIT_LOG_RETENTION_DAYS || AUDIT_RETENTION_DAYS_DEFAULT,
    );
    await pruneAuditFiles(
      Number.isFinite(retentionDays) ? retentionDays : AUDIT_RETENTION_DAYS_DEFAULT,
    );
    const now = new Date();
    const dayKey = toDayKey(now);
    const filePath = path.join(AUDIT_DIR, `${dayKey}.jsonl`);
    const event = buildAuditEvent(input);
    await fs.appendFile(filePath, `${JSON.stringify(event)}\n`, 'utf8');
  } catch {
    // best effort logging only
  }
}
