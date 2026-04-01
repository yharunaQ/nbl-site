import type { FchmaIntakeDraftPayload } from '@/lib/fchma/intakeDraft';
import { buildFchmaStructurePreview } from '@/lib/fchma/structuralPreview';
import { supporterBehavioralDriverSchema } from '@/lib/fchma/sourceSpecs';

export type FchmaInterventionPreview = {
  title: string;
  interventionType: 'work_design' | 'accommodation' | 'support_linkage' | 'self_management';
  ownerRole: string;
  feasibility: 'low' | 'medium' | 'high';
  rationale: string;
  implementationNotes: string[];
  supporterLens: string[];
};

function buildSupporterLens(ownerRole: string): string[] {
  const dimensionEntries = Object.entries(supporterBehavioralDriverSchema.canonical_dimensions);

  if (ownerRole === 'manager_or_hr') {
    return dimensionEntries
      .filter(([key]) =>
        ['network_and_coordination', 'organizational_and_regional_climate'].includes(key),
      )
      .flatMap(([, values]) => values.slice(0, 2));
  }

  if (ownerRole === 'external_supporter') {
    return dimensionEntries
      .filter(([key]) => ['support_knowledge_and_access', 'network_and_coordination'].includes(key))
      .flatMap(([, values]) => values.slice(0, 2));
  }

  return dimensionEntries
    .filter(([key]) => ['support_orientation', 'motivation_and_meaning'].includes(key))
    .flatMap(([, values]) => values.slice(0, 2));
}

export function buildFchmaInterventionPreview(
  payload: FchmaIntakeDraftPayload,
): FchmaInterventionPreview[] {
  const structure = buildFchmaStructurePreview(payload);
  const previews: FchmaInterventionPreview[] = [];

  if (structure.hypotheses.some((item) => item.label === 'activity_participation_stability')) {
    previews.push({
      title: '仕事内容と勤務条件の再設計',
      interventionType: 'work_design',
      ownerRole: 'manager_or_hr',
      feasibility: 'medium',
      rationale:
        '活動上の困難が就労参加の安定を直接揺らしているため、仕事の切り出しと時間設計の見直しが最初の介入点になる。',
      implementationNotes: ['高負荷タスクを特定する', '時間帯ごとの負荷差を確認する', '試行期間を区切って再評価する'],
      supporterLens: buildSupporterLens('manager_or_hr'),
    });
  }

  if (structure.hypotheses.some((item) => item.label === 'accommodation_gap_amplification')) {
    previews.push({
      title: '必要配慮の言語化と職場内調整',
      interventionType: 'accommodation',
      ownerRole: 'manager_or_hr',
      feasibility: 'high',
      rationale:
        '配慮ギャップが困難を増幅しているため、必要条件を明文化し、上司・人事・支援者の間で調整可能点を固定する。',
      implementationNotes: ['必要配慮を具体的行動に翻訳する', '説明相手と順番を決める', '実施後の確認面談を予定する'],
      supporterLens: buildSupporterLens('manager_or_hr'),
    });
  }

  if (structure.hypotheses.some((item) => item.label === 'future_outlook_fragility')) {
    previews.push({
      title: '相談経路と短期目標の再設定',
      interventionType: 'support_linkage',
      ownerRole: 'external_supporter',
      feasibility: 'medium',
      rationale:
        '不安や悪化見通しが強い場合は、支援経路を先に明確化し、短期的に達成可能な目標へ分解する方が安定しやすい。',
      implementationNotes: ['相談先を1本化する', '悪化時の連絡ルートを決める', '1〜2週間単位の目標で再評価する'],
      supporterLens: buildSupporterLens('external_supporter'),
    });
  }

  if (previews.length === 0) {
    previews.push({
      title: '状態確認と支援仮説の再分解',
      interventionType: 'self_management',
      ownerRole: 'case_worker',
      feasibility: 'medium',
      rationale:
        '明確な増幅因子がまだ薄いため、負荷場面、保護因子、相談経路を分けて再確認するのが安全。',
      implementationNotes: ['困難が生じる場面を時系列で聞き直す', '既存支援の有無を確認する', '再度 structure preview を更新する'],
      supporterLens: buildSupporterLens('case_worker'),
    });
  }

  return previews;
}
