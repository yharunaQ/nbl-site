import { getSupportCatalogBundle } from '@/lib/jac/supportCatalog';

describe('support catalog bundle', () => {
  it('returns regional support suggestions for intellectual-disability job search context', async () => {
    const bundle = await getSupportCatalogBundle(
      '知的障害があり、就職活動で企業への説明や自分に合う仕事の整理が難しいです。',
      {
        situation: ['就職活動中（求人探し・応募・面接）'],
        task: ['会議・対話'],
        symptom: ['知的特性（理解速度・手順保持）'],
        environment: [],
        preference: [],
      },
      { maxIssues: 2, maxSuggestions: 4, maxQuestions: 4 },
    );

    expect(bundle.promptIssues.length).toBeGreaterThan(0);
    expect(bundle.suggestions.length).toBeGreaterThan(0);
    expect(bundle.followupHints.length).toBeGreaterThan(0);
    expect(bundle.suggestions.some((item) => item.title.includes('企業'))).toBe(true);
    expect(bundle.suggestions.some((item) => item.reason.includes('個別調整'))).toBe(true);
  });

  it('returns retention-oriented support hints for in-work health management context', async () => {
    const bundle = await getSupportCatalogBundle(
      '在職中で、疲労と通院の両立が難しく、このまま働き続けられるか不安です。',
      {
        situation: ['在職中（現職での困りごと）'],
        task: ['時間制約・納期'],
        symptom: ['疲労・倦怠（慢性疲労含む）', '睡眠リズム・通院/治療スケジュール'],
        environment: ['休憩の取りやすさ・休養導線'],
        preference: ['生活リズムを守りたい'],
      },
      { maxIssues: 2, maxSuggestions: 4, maxQuestions: 4 },
    );

    expect(bundle.promptIssues.some((issue) => issue.title.includes('就職後'))).toBe(true);
    expect(
      bundle.followupHints.some(
        (question) => question.includes('就職後') || question.includes('継続'),
      ),
    ).toBe(true);
  });
});
