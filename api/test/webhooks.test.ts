import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';

import { findSubscription } from '../src/db/subscriptions';
import { clearDatabase, testApp } from './helpers/session';

const DAY = 24 * 60 * 60_000;
const NOW = Date.UTC(2026, 9, 5, 12);

let app: Awaited<ReturnType<typeof testApp>>['app'];
let userId: string;

beforeEach(async () => {
  await clearDatabase();
  const t = await testApp();
  app = t.app;
  userId = (await t.login()).user.id;
});

const event = (type: string, extra: Record<string, unknown> = {}) => ({
  api_version: '1.0',
  event: {
    type,
    id: crypto.randomUUID(),
    app_user_id: userId,
    event_timestamp_ms: NOW,
    purchased_at_ms: NOW,
    expiration_at_ms: NOW + 30 * DAY,
    product_id: 'pro_monthly',
    ...extra,
  },
});

const hook = (body: unknown, auth: string | null = 'segredo-do-webhook') =>
  app().request(
    '/webhooks/revenuecat',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(auth === null ? {} : { Authorization: auth }) },
      body: JSON.stringify(body),
    },
    env,
  );

const errorCode = async (res: Response) => (await res.json<{ error: { code: string } }>()).error.code;

describe('Requirement: Webhook do RevenueCat', () => {
  it('Segredo errado', async () => {
    const res = await hook(event('INITIAL_PURCHASE'), 'outro-segredo');
    expect(res.status).toBe(401);
    expect(await errorCode(res)).toBe('unauthorized');
    expect(await findSubscription(env.DB, userId)).toBeNull();
  });

  it('Sem o cabeçalho', async () => {
    const res = await hook(event('INITIAL_PURCHASE'), null);
    expect(res.status).toBe(401);
  });

  it('Corpo malformado', async () => {
    const res = await hook({ api_version: '1.0' });
    expect(res.status).toBe(400);
    expect(await errorCode(res)).toBe('invalid_body');
  });

  it('Primeira compra', async () => {
    const res = await hook(event('INITIAL_PURCHASE'));
    expect(res.status).toBe(200);
    expect(await findSubscription(env.DB, userId)).toMatchObject({
      periodStart: NOW,
      expiresAt: NOW + 30 * DAY,
      willRenew: true,
      productId: 'pro_monthly',
    });
  });

  it('Cancelamento mantém até o fim do período', async () => {
    await hook(event('INITIAL_PURCHASE', { expiration_at_ms: NOW + 12 * DAY }));
    const res = await hook(event('CANCELLATION', { event_timestamp_ms: NOW + DAY, expiration_at_ms: NOW + 12 * DAY }));
    expect(res.status).toBe(200);
    expect(await findSubscription(env.DB, userId)).toMatchObject({ expiresAt: NOW + 12 * DAY, willRenew: false });
  });

  it('Expiração', async () => {
    await hook(event('INITIAL_PURCHASE'));
    await hook(event('EXPIRATION', { event_timestamp_ms: NOW + 31 * DAY, expiration_at_ms: NOW + 30 * DAY }));
    const sub = await findSubscription(env.DB, userId);
    expect(sub?.expiresAt).toBeLessThanOrEqual(NOW + 31 * DAY);
    expect(sub?.willRenew).toBe(false);
  });

  it('Renovação começa um período novo', async () => {
    await hook(event('INITIAL_PURCHASE'));
    await hook(
      event('RENEWAL', {
        event_timestamp_ms: NOW + 30 * DAY,
        purchased_at_ms: NOW + 30 * DAY,
        expiration_at_ms: NOW + 60 * DAY,
      }),
    );
    expect(await findSubscription(env.DB, userId)).toMatchObject({
      periodStart: NOW + 30 * DAY,
      expiresAt: NOW + 60 * DAY,
    });
  });

  it('Evento fora de ordem', async () => {
    await hook(
      event('RENEWAL', {
        event_timestamp_ms: NOW + 30 * DAY,
        purchased_at_ms: NOW + 30 * DAY,
        expiration_at_ms: NOW + 60 * DAY,
      }),
    );
    const res = await hook(event('INITIAL_PURCHASE'));
    expect(res.status).toBe(200);
    expect(await findSubscription(env.DB, userId)).toMatchObject({ expiresAt: NOW + 60 * DAY });
  });

  it('Usuário inexistente', async () => {
    const res = await hook(event('INITIAL_PURCHASE', { app_user_id: 'nao-existe' }));
    expect(res.status).toBe(200);
    const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM subscriptions').first<{ n: number }>();
    expect(n?.n).toBe(0);
  });

  it('Outros tipos são ignorados', async () => {
    const res = await hook(event('TEST'));
    expect(res.status).toBe(200);
    expect(await findSubscription(env.DB, userId)).toBeNull();
  });
});
