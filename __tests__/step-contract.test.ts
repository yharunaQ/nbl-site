import {
  buildSelectedTagContractSummary,
  buildStepContractPromptGuidance,
  STEP2_ROLE_TITLE,
  STEP3_ROLE_TITLE,
} from '@/lib/jac/stepContract';

describe('step contract', () => {
  it('documents step 2 and step 3 roles explicitly', () => {
    expect(STEP2_ROLE_TITLE).toContain('入口');
    expect(STEP3_ROLE_TITLE).toContain('条件確認');
  });

  it('provides prompt guidance that keeps tags as coarse entry points', () => {
    const guidance = buildStepContractPromptGuidance();
    expect(guidance).toContain('粗い入口');
    expect(guidance).toContain('タグそのものをなぞる');
    expect(guidance).toContain('Step 3');
  });

  it('summarizes selected tags as step contract context', () => {
    const summary = buildSelectedTagContractSummary({
      situation: ['在職中（現職での困りごと）'],
      task: ['勤務時間・勤務日数（フルタイム/短時間）'],
      symptom: [],
      environment: [],
      preference: [],
    });

    expect(summary.selected_tag_count).toBe(2);
    expect(summary.selected_tag_groups).toEqual([
      { group: 'situation', tags: ['在職中（現職での困りごと）'] },
      { group: 'task', tags: ['勤務時間・勤務日数（フルタイム/短時間）'] },
    ]);
    expect(summary.step2_role).toContain('粗く網羅的');
    expect(summary.step3_role).toContain('条件差');
  });
});
