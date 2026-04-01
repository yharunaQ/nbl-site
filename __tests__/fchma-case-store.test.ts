import { rm } from 'node:fs/promises';
import path from 'node:path';
import {
  appendFchmaCaseFeedback,
  createFchmaCase,
  getFchmaCase,
  listFchmaCases,
  saveFchmaCaseReview,
} from '@/lib/fchma/caseStore';

const runtimeDir = path.join(process.cwd(), '.tmp', 'fchma-cases');

describe('fchma case store', () => {
  beforeEach(async () => {
    await rm(runtimeDir, { recursive: true, force: true });
  });

  it('creates, lists, and retrieves saved cases', async () => {
    const saved = await createFchmaCase({
      title: '保存テスト',
      primaryGoal: '離職を避けたい',
      respondentProfile: '40代、都市圏',
      healthCondition: '全身性エリテマトーデス',
      workStatus: '正社員、企画職',
      difficulty: '午後の疲労が強い',
      supportAndAccommodation: '勤務時間調整は未整備',
      disclosure: '上司には説明済み',
      futureOutlook: '働き続けたい',
      narratives: '午後に疲労が強くなる',
      inputType: 'intake_form',
    });

    expect(saved.caseCode).toBe('FCHMA-00001');

    const listed = await listFchmaCases();
    expect(listed).toHaveLength(1);
    expect(listed[0].id).toBe(saved.id);

    const loaded = await getFchmaCase(saved.id);
    expect(loaded?.title).toBe('保存テスト');
    expect(loaded?.interventionPreview.length).toBeGreaterThan(0);
    expect(loaded?.review.reviewerDecision).toBe('pending');
    expect(loaded?.feedbackRecords).toHaveLength(0);
  });

  it('persists human review and feedback separately from previews', async () => {
    const saved = await createFchmaCase({
      title: 'レビューとフィードバック',
      primaryGoal: '配慮の採択と結果を記録したい',
      respondentProfile: '30代、営業職',
      healthCondition: '潰瘍性大腸炎',
      workStatus: '出社中心',
      difficulty: '通勤後の疲労が強い',
      supportAndAccommodation: '時差出勤は必要だが未整備',
      disclosure: '上司には一部説明済み',
      futureOutlook: '働き続けたいが不安がある',
      narratives: '朝の通勤で負荷が高い',
      inputType: 'intake_form',
    });

    const reviewed = await saveFchmaCaseReview(saved.id, {
      reviewerDecision: 'accepted',
      selectedHypotheses: saved.structurePreview.hypotheses
        .slice(0, 1)
        .map((item) => item.label),
      selectedInterventions: saved.interventionPreview.slice(0, 1).map((item) => item.title),
      reviewNotes: '時差出勤を先行導入し、1週間後に再評価する。',
    });

    expect(reviewed?.status).toBe('planned');
    expect(reviewed?.review.selectedInterventions).toHaveLength(1);

    const fedBack = await appendFchmaCaseFeedback(saved.id, {
      selectedInterventionTitle: saved.interventionPreview[0].title,
      implemented: true,
      implementationNotes: '時差出勤を試行導入した。',
      observedEffect: '午前の疲労がやや軽減した。',
      unresolvedIssues: '午後の集中低下は残る。',
      updatedStructureNotes: '通勤負荷だけでなく午後の業務密度も再確認が必要。',
      reviewerSummary: '短期的には一定の改善が見られた。',
    });

    expect(fedBack?.status).toBe('in_followup');
    expect(fedBack?.feedbackRecords).toHaveLength(1);
    expect(fedBack?.feedbackRecords[0].selectedInterventionTitle).toBe(
      saved.interventionPreview[0].title,
    );

    const loaded = await getFchmaCase(saved.id);
    expect(loaded?.review.reviewNotes).toContain('時差出勤');
    expect(loaded?.feedbackRecords[0].observedEffect).toContain('軽減');
  });
});
