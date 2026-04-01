import { TAG_SIGNAL_RULES, STRONG_SIGNAL_RULES } from '@/lib/jac/tagDictionary';
import { TAG_GROUPS, TAG_TAXONOMY_PRINCIPLES } from '@/lib/jac/tagTaxonomy';

describe('tag taxonomy', () => {
  it('promotes working-time conditions into first-class task tags', () => {
    expect(TAG_GROUPS.task).toEqual(
      expect.arrayContaining([
        '勤務時間・勤務日数（フルタイム/短時間）',
        'シフト・夜勤・勤務時刻',
        '残業・連続勤務',
        '身体操作・実作業負荷（立位・運搬・手作業）',
        '安全・危険業務・緊急対応',
      ]),
    );
    expect(TAG_GROUPS.environment).toEqual(
      expect.arrayContaining(['指示・連絡の明確さ（手順書/見本/確認）']),
    );
  });

  it('keeps explicit signal rules for work schedule conditions', () => {
    expect(TAG_SIGNAL_RULES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          group: 'task',
          tag: '勤務時間・勤務日数（フルタイム/短時間）',
          patterns: expect.arrayContaining(['フルタイム', '短時間勤務', '勤務時間']),
        }),
        expect.objectContaining({
          group: 'task',
          tag: 'シフト・夜勤・勤務時刻',
          patterns: expect.arrayContaining(['シフト', '夜勤', '勤務時間帯']),
        }),
        expect.objectContaining({
          group: 'task',
          tag: '残業・連続勤務',
          patterns: expect.arrayContaining(['残業', '連勤', '長時間労働']),
        }),
        expect.objectContaining({
          group: 'task',
          tag: '身体操作・実作業負荷（立位・運搬・手作業）',
          patterns: expect.arrayContaining(['立ち仕事', '運搬', '手作業']),
        }),
        expect.objectContaining({
          group: 'task',
          tag: '安全・危険業務・緊急対応',
          patterns: expect.arrayContaining(['危険作業', '事故', '緊急時']),
        }),
        expect.objectContaining({
          group: 'environment',
          tag: '指示・連絡の明確さ（手順書/見本/確認）',
          patterns: expect.arrayContaining(['曖昧指示', '手順書', 'チェックリスト']),
        }),
      ]),
    );
    expect(STRONG_SIGNAL_RULES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          group: 'task',
          tag: '勤務時間・勤務日数（フルタイム/短時間）',
        }),
        expect.objectContaining({
          group: 'task',
          tag: 'シフト・夜勤・勤務時刻',
        }),
        expect.objectContaining({
          group: 'task',
          tag: '残業・連続勤務',
        }),
        expect.objectContaining({
          group: 'task',
          tag: '身体操作・実作業負荷（立位・運搬・手作業）',
        }),
        expect.objectContaining({
          group: 'task',
          tag: '安全・危険業務・緊急対応',
        }),
        expect.objectContaining({
          group: 'environment',
          tag: '指示・連絡の明確さ（手順書/見本/確認）',
        }),
      ]),
    );
  });

  it('documents coverage and representativeness as explicit design principles', () => {
    expect(TAG_TAXONOMY_PRINCIPLES).toEqual(
      expect.arrayContaining([
        expect.stringContaining('支援設計が変わる条件'),
        expect.stringContaining('26フレーム'),
        expect.stringContaining('web/web-cache'),
        expect.stringContaining('安全条件・身体負荷・指示の明確さ'),
      ]),
    );
  });

  it('keeps Step 2 taxonomy within the intended size discipline', () => {
    const total = Object.values(TAG_GROUPS).reduce((sum, tags) => sum + tags.length, 0);

    expect(total).toBeGreaterThanOrEqual(50);
    expect(total).toBeLessThanOrEqual(60);
    expect(TAG_GROUPS.task.length).toBeLessThanOrEqual(16);
    expect(TAG_GROUPS.environment.length).toBeLessThanOrEqual(15);
  });
});
