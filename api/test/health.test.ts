import { env } from 'cloudflare:workers';
import { describe, expect, it } from 'vitest';

import app from '../src/index';

/** Banco falso cuja consulta sempre falha (simula o D1 fora do ar). */
const brokenDb = {
  prepare: () => ({
    first: async () => {
      throw new Error('D1 indisponível');
    },
  }),
} as unknown as D1Database;

describe('Requirement: Verificação de saúde', () => {
  it('API e banco funcionando', async () => {
    const res = await app.request('/health', {}, env);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok', database: 'ok' });
  });

  it('Banco fora do ar', async () => {
    const res = await app.request('/health', {}, { ...env, DB: brokenDb });
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ status: 'degraded', database: 'error' });
  });
});
