import { env } from 'cloudflare:workers';
import { describe, expect, it } from 'vitest';

import { AppError } from '../src/errors';
import { createApp } from '../src/index';

/** App real com duas rotas extras só para os testes de erro. */
function appWithFailingRoutes() {
  const app = createApp();
  app.get('/boom', () => {
    throw new Error('detalhe interno');
  });
  app.get('/conflict', () => {
    throw new AppError(409, 'conflict', 'Já existe');
  });
  return app;
}

describe('Requirement: Formato único de erro', () => {
  it('Rota inexistente', async () => {
    const res = await createApp().request('/nao-existe', {}, env);
    expect(res.status).toBe(404);
    const body = await res.json<{ error: { code: string; message: string } }>();
    expect(body.error.code).toBe('not_found');
    expect(body.error.message).toEqual(expect.any(String));
  });

  it('Erro inesperado', async () => {
    const res = await appWithFailingRoutes().request('/boom', {}, env);
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(JSON.parse(text).error.code).toBe('internal_error');
    expect(text).not.toContain('detalhe interno');
  });

  it('Erro conhecido', async () => {
    const res = await appWithFailingRoutes().request('/conflict', {}, env);
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: { code: 'conflict', message: 'Já existe' } });
  });
});

describe('Requirement: Origens permitidas (CORS)', () => {
  const get = (origin?: string) => createApp().request('/health', { headers: origin ? { Origin: origin } : {} }, env);

  it('Origem permitida', async () => {
    const res = await get('http://localhost:8081');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:8081');
  });

  it('Origem não permitida', async () => {
    const res = await get('https://site-qualquer.com');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('App nativo', async () => {
    const res = await get();
    expect(res.status).toBe(200);
  });

  it('várias origens configuradas', async () => {
    const res = await createApp().request(
      '/health',
      { headers: { Origin: 'https://devtips.app' } },
      { ...env, ALLOWED_ORIGINS: 'http://localhost:8081, https://devtips.app' },
    );
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://devtips.app');
  });
});
