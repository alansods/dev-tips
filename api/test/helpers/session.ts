// Login de teste: um usuário real no D1 local, autenticado pelo Google falso.

import { env } from 'cloudflare:workers';

import { createApp } from '../../src/index';
import type { Deps } from '../../src/deps';
import { fakeGoogle } from './google';

export type TestSession = { accessToken: string; refreshToken: string; user: { id: string } };

export async function testApp(overrides: Partial<Deps> = {}) {
  const google = await fakeGoogle();
  const app = (more: Partial<Deps> = {}) => createApp({ googleKeys: google.keys, ...overrides, ...more });

  async function login(sub = 'google-sub-ana'): Promise<TestSession> {
    const res = await app().request(
      '/auth/google',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: await google.idToken({ sub }) }),
      },
      env,
    );
    if (res.status !== 200) throw new Error(`login falhou: ${res.status}`);
    return res.json();
  }

  return { app, login };
}

export async function clearDatabase() {
  await env.DB.batch(
    ['card_progress', 'user_settings', 'subscriptions', 'question_usage', 'refresh_tokens', 'users'].map((t) =>
      env.DB.prepare(`DELETE FROM ${t}`),
    ),
  );
}
