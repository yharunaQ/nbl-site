import {
  getFchmaCaseRepository,
  listAvailableFchmaCaseRepositoryKinds,
} from '@/lib/fchma/caseRepository';

describe('fchma case repository', () => {
  it('exposes the file-backed repository as the current adapter', () => {
    expect(listAvailableFchmaCaseRepositoryKinds()).toEqual(['file_runtime_store']);
    expect(getFchmaCaseRepository().kind).toBe('file_runtime_store');
  });
});
