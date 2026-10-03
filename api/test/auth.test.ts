import { env } from 'cloudflare:workers';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createApp } from '../src/index';
import { fakeGoogle } from './helpers/google';

type Session = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; name: string; email: string; photoUrl: string };
};

const MIN = 60_000;
const DAY = 24 * 60 * MIN;

let google: Awaited<ReturnType<typeof fakeGoogle>>;
beforeAll(async () => {
  google = await fakeGoogle();
});
beforeEach(async () => {
  await env.DB.batch([env.DB.prepare('DELETE FROM refresh_tokens'), env.DB.prepare('DELETE FROM users')]);
});

/** App com o Google falso; `now` permite emitir tokens "no passado". */
const app = (now?: () => number) => createApp({ googleKeys: google.keys, ...(now ? { now } : {}) });

const post = (path: string, body: unknown, a = app()) =>
  a.request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, env);

async function login(overrides = {}, a = app()) {
  const res = await post('/auth/google', { idToken: await google.idToken(overrides) }, a);
  expect(res.status).toBe(200);
  return res.json<Session>();
}

const me = (accessToken?: string) =>
  app().request('/me', { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} }, env);

const errorCode = async (res: Response) => (await res.json<{ error: { code: string } }>()).error.code;

describe('Requirement: Login com Google na API', () => {
  it('Primeiro acesso', async () => {
    const session = await login();
    expect(session.accessToken).toEqual(expect.any(String));
    expect(session.refreshToken).toEqual(expect.any(String));
    expect(session.user).toMatchObject({
      name: 'Ana',
      email: 'ana@example.com',
      photoUrl: 'https://example.com/ana.png',
    });
    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first<{ n: number }>();
    expect(count?.n).toBe(1);
  });

  it('Acesso seguinte', async () => {
    const first = await login();
    const second = await login();
    expect(second.user.id).toBe(first.user.id);
    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first<{ n: number }>();
    expect(count?.n).toBe(1);
  });

  it('Token de outro app', async () => {
    const res = await post('/auth/google', {
      idToken: await google.idToken({ aud: 'outro-app.apps.googleusercontent.com' }),
    });
    expect(res.status).toBe(401);
    expect(await errorCode(res)).toBe('invalid_token');
  });

  it('Token expirado', async () => {
    const res = await post('/auth/google', { idToken: await google.idToken({ expiresIn: -60 }) });
    expect(res.status).toBe(401);
    expect(await errorCode(res)).toBe('invalid_token');
  });

  it('emissor que não é o Google', async () => {
    const res = await post('/auth/google', { idToken: await google.idToken({ iss: 'https://falso.example.com' }) });
    expect(res.status).toBe(401);
  });

  it('corpo inválido', async () => {
    const res = await post('/auth/google', { token: 'sem-o-campo-certo' });
    expect(res.status).toBe(400);
    expect(await errorCode(res)).toBe('invalid_body');
  });
});

describe('Requirement: Rotas protegidas', () => {
  it('Sem token', async () => {
    const res = await me();
    expect(res.status).toBe(401);
    expect(await errorCode(res)).toBe('unauthorized');
  });

  it('Token expirado', async () => {
    const past = Date.now() - 16 * MIN;
    const session = await login(
      {},
      app(() => past),
    );
    const res = await me(session.accessToken);
    expect(res.status).toBe(401);
    expect(await errorCode(res)).toBe('unauthorized');
  });

  it('token adulterado', async () => {
    const session = await login();
    const res = await me(`${session.accessToken.slice(0, -2)}xx`);
    expect(res.status).toBe(401);
  });
});

describe('Requirement: Renovação da sessão', () => {
  it('Renovar', async () => {
    const session = await login();
    const res = await post('/auth/refresh', { refreshToken: session.refreshToken });
    expect(res.status).toBe(200);
    const next = await res.json<Session>();
    expect(next.refreshToken).not.toBe(session.refreshToken);
    expect((await me(next.accessToken)).status).toBe(200);
  });

  it('Reuso de token', async () => {
    const a = await login(); // aparelho A
    const b = await login(); // aparelho B, outra sessão do mesmo usuário
    expect((await post('/auth/refresh', { refreshToken: a.refreshToken })).status).toBe(200);
    // alguém reapresenta o token de A já trocado
    expect((await post('/auth/refresh', { refreshToken: a.refreshToken })).status).toBe(401);
    // todas as sessões do usuário foram encerradas
    expect((await post('/auth/refresh', { refreshToken: b.refreshToken })).status).toBe(401);
  });

  it('Token de renovação vencido', async () => {
    const past = Date.now() - 31 * DAY;
    const session = await login(
      {},
      app(() => past),
    );
    expect((await post('/auth/refresh', { refreshToken: session.refreshToken })).status).toBe(401);
  });

  it('token desconhecido', async () => {
    expect((await post('/auth/refresh', { refreshToken: 'nao-existe' })).status).toBe(401);
  });
});

describe('Requirement: Dados e exclusão da conta na API', () => {
  it('Dados do usuário', async () => {
    const session = await login();
    const res = await me(session.accessToken);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      id: session.user.id,
      name: 'Ana',
      email: 'ana@example.com',
      photoUrl: 'https://example.com/ana.png',
    });
  });

  it('Sair', async () => {
    const session = await login();
    expect((await post('/auth/logout', { refreshToken: session.refreshToken })).status).toBe(204);
    expect((await post('/auth/refresh', { refreshToken: session.refreshToken })).status).toBe(401);
  });

  it('Apagar conta', async () => {
    const session = await login();
    const res = await app().request(
      '/me',
      { method: 'DELETE', headers: { Authorization: `Bearer ${session.accessToken}` } },
      env,
    );
    expect(res.status).toBe(204);
    const tokens = await env.DB.prepare('SELECT COUNT(*) AS n FROM refresh_tokens').first<{ n: number }>();
    expect(tokens?.n).toBe(0);
    expect((await me(session.accessToken)).status).toBe(401);
    const again = await login();
    expect(again.user.id).not.toBe(session.user.id);
  });
});
