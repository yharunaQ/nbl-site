jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(),
    json: jest.fn(),
    rewrite: jest.fn(),
  },
}));

import { config } from '@/proxy';

describe('proxy matcher', () => {
  it('includes docs routes in temporary public mode coverage', () => {
    expect(config.matcher).toContain('/docs');
    expect(config.matcher).toContain('/docs/:path*');
  });
});
