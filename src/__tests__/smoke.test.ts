import { z } from 'zod';

describe('ambiente de testes', () => {
  it('roda TypeScript com zod', () => {
    expect(z.string().safeParse('ok').success).toBe(true);
  });
});
