import {
  fchmaCausalFrameworkAtlas,
  listFchmaCausalFrameworks,
} from '@/lib/fchma/causalFrameworkAtlas';

describe('fchma causal framework atlas', () => {
  it('defines an exhaustive atlas larger than the 26-frame product view', () => {
    expect(fchmaCausalFrameworkAtlas.framework_count).toBe(48);
    expect(listFchmaCausalFrameworks().length).toBe(48);
  });

  it('preserves cut principles so product views can be sliced later', () => {
    expect(fchmaCausalFrameworkAtlas.cut_principles).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Cut by layer'),
        expect.stringContaining('Cut by domain'),
        expect.stringContaining('Cut by motif'),
      ]),
    );
  });
});
