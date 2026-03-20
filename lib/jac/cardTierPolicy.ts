import policyJson from '@/references/jac/card-tier-policy.json';
import type { CausalTier } from '@/lib/jac/causalTier';

type CardTierPolicyRow = {
  expectedTier: CausalTier;
  rationale: string;
};

type CardTierPolicyPayload = {
  version: string;
  defaultExpectedTier: CausalTier;
  cards: Record<string, CardTierPolicyRow>;
};

const payload = policyJson as CardTierPolicyPayload;

export const CARD_TIER_POLICY_VERSION = String(payload.version || '');
export const DEFAULT_EXPECTED_TIER: CausalTier = payload.defaultExpectedTier || 'B';
export const CARD_TIER_POLICY: Record<string, CardTierPolicyRow> = payload.cards || {};

export function expectedTierForCard(cardId: string): CausalTier {
  return CARD_TIER_POLICY[cardId]?.expectedTier || DEFAULT_EXPECTED_TIER;
}

export function tierPolicyRationaleForCard(cardId: string): string {
  return CARD_TIER_POLICY[cardId]?.rationale || '';
}

