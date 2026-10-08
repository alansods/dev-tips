import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it } from 'vitest';

import { isPro } from '../src/billing/access';
import { assertCanAsk, recordAnswered } from '../src/billing/quota';
import { findSubscription, questionUsage } from '../src/db/subscriptions';
import { clearDatabase, testApp } from './helpers/session';

const DAY = 24 * 60 * 60_000;
// Perto do relógio real: o access token é validado contra a hora atual.
const NOW = Date.now();
const ADMINS = 'admin@example.com';

beforeEach(async () => {
  await clearDatabase();
});

const count = async (table: string, userId: string) =>
  (await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE user_id = ?`).bind(userId).first<{ n: number }>())?.n;

describe('Requirement: Acesso Pro', () => {
  const user = { email: 'ana@example.com' };

  it('Assinatura ativa', () => {
    expect(isPro(user, { expiresAt: NOW + 10 * DAY }, '', NOW)).toBe(true);
  });

  it('Assinatura expirada', () => {
    expect(isPro(user, { expiresAt: NOW - DAY }, '', NOW)).toBe(false);
  });

  it('Sem assinatura', () => {
    expect(isPro(user, null, '', NOW)).toBe(false);
  });

  it('Admin sem pagar', () => {
    expect(isPro({ email: 'admin@exemplo.com' }, null, 'outro@x.com, Admin@Exemplo.com', NOW)).toBe(true);
  });

  it('Usuário sem e-mail não vira admin', () => {
    expect(isPro({ email: null }, null, '', NOW)).toBe(false);
  });
});

describe('Requirement: Dados da assinatura ao apagar a conta', () => {
  it('Apagar conta de assinante', async () => {
    const { app, login } = await testApp();
    const { accessToken, user } = await login();
    await env.DB.batch([
      env.DB.prepare(
        'INSERT INTO subscriptions (user_id, period_start, expires_at, will_renew, product_id, last_event_at) VALUES (?, ?, ?, 1, ?, ?)',
      ).bind(user.id, NOW, NOW + 30 * DAY, 'pro_monthly', NOW),
      env.DB.prepare('INSERT INTO question_usage (user_id, period_start, used) VALUES (?, ?, 30)').bind(user.id, NOW),
    ]);

    const res = await app().request(
      '/me',
      { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } },
      env,
    );

    expect(res.status).toBe(204);
    expect(await count('subscriptions', user.id)).toBe(0);
    expect(await count('question_usage', user.id)).toBe(0);
  });
});

// ---- Plano, sincronização e cota ----

const PRO = { expiresAt: NOW + 12 * DAY, purchasedAt: NOW - 18 * DAY, willRenew: true, productId: 'pro_monthly' };

/** RevenueCat falso: devolve o entitlement dado ou falha. */
const fakeRevenueCat = (result: typeof PRO | null | 'error') => ({
  getProEntitlement: async () => {
    if (result === 'error') throw new Error('RevenueCat 500');
    return result;
  },
});

async function signedIn(opts: { email?: string; revenueCat?: ReturnType<typeof fakeRevenueCat> } = {}) {
  const { app, login } = await testApp({ now: () => NOW, ...(opts.revenueCat ? { revenueCat: opts.revenueCat } : {}) });
  const session = await login();
  if (opts.email)
    await env.DB.prepare('UPDATE users SET email = ? WHERE id = ?').bind(opts.email, session.user.id).run();
  const call = (path: string, method = 'GET') =>
    app().request(path, { method, headers: { Authorization: `Bearer ${session.accessToken}` } }, env);
  return { userId: session.user.id, call };
}

const subscribe = (userId: string, periodStart = NOW - 18 * DAY, expiresAt = NOW + 12 * DAY) =>
  env.DB.prepare(
    'INSERT INTO subscriptions (user_id, period_start, expires_at, will_renew, product_id, last_event_at) VALUES (?, ?, ?, 1, ?, ?)',
  )
    .bind(userId, periodStart, expiresAt, 'pro_monthly', periodStart)
    .run();

const setUsed = (userId: string, used: number, periodStart = NOW - 18 * DAY) =>
  env.DB.prepare('INSERT INTO question_usage (user_id, period_start, used) VALUES (?, ?, ?)')
    .bind(userId, periodStart, used)
    .run();

describe('Requirement: Consultar plano e uso', () => {
  it('Plano grátis', async () => {
    const { call } = await signedIn();
    const res = await call('/me/subscription');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      plan: 'free',
      source: null,
      expiresAt: null,
      willRenew: false,
      questions: { used: 0, limit: 0 },
    });
  });

  it('Assinante', async () => {
    const { userId, call } = await signedIn();
    await subscribe(userId);
    await setUsed(userId, 30);
    expect(await (await call('/me/subscription')).json()).toEqual({
      plan: 'pro',
      source: 'store',
      expiresAt: new Date(NOW + 12 * DAY).toISOString(),
      willRenew: true,
      questions: { used: 30, limit: 200 },
    });
  });

  it('Admin', async () => {
    const { call } = await signedIn({ email: 'Admin@Example.com' });
    expect(await (await call('/me/subscription')).json()).toMatchObject({
      plan: 'pro',
      source: 'admin',
      expiresAt: null,
      questions: { limit: null },
    });
  });

  it('Sem sessão', async () => {
    const { app } = await testApp();
    expect((await app().request('/me/subscription', {}, env)).status).toBe(401);
  });
});

describe('Requirement: Sincronizar assinatura', () => {
  it('Depois da compra', async () => {
    const { call } = await signedIn({ revenueCat: fakeRevenueCat(PRO) });
    const res = await call('/me/subscription/sync', 'POST');
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ plan: 'pro', source: 'store', willRenew: true });
  });

  it('Nada ativo no RevenueCat', async () => {
    const { userId, call } = await signedIn({ revenueCat: fakeRevenueCat(null) });
    await subscribe(userId);
    expect(await (await call('/me/subscription/sync', 'POST')).json()).toMatchObject({ plan: 'free' });
  });

  it('RevenueCat fora do ar', async () => {
    const { userId, call } = await signedIn({ revenueCat: fakeRevenueCat('error') });
    await subscribe(userId);
    const res = await call('/me/subscription/sync', 'POST');
    expect(res.status).toBe(502);
    expect(((await res.json()) as { error: { code: string } }).error.code).toBe('billing_unavailable');
    expect((await findSubscription(env.DB, userId))?.expiresAt).toBe(NOW + 12 * DAY);
  });
});

describe('Requirement: Cota de perguntas', () => {
  const user = async (email = 'ana@example.com') => {
    const { userId } = await signedIn({ email });
    return { id: userId, email };
  };

  it('Plano grátis', async () => {
    const u = await user();
    await expect(assertCanAsk(env.DB, u, ADMINS, NOW)).rejects.toMatchObject({ status: 403, code: 'pro_required' });
  });

  it('Cota esgotada', async () => {
    const u = await user();
    await subscribe(u.id);
    await setUsed(u.id, 200);
    await expect(assertCanAsk(env.DB, u, ADMINS, NOW)).rejects.toMatchObject({
      status: 429,
      code: 'quota_exceeded',
    });
  });

  it('Última pergunta da cota é aceita', async () => {
    const u = await user();
    await subscribe(u.id);
    await setUsed(u.id, 199);
    await expect(assertCanAsk(env.DB, u, ADMINS, NOW)).resolves.toBeDefined();
  });

  it('Pergunta respondida conta', async () => {
    const u = await user();
    await subscribe(u.id);
    await setUsed(u.id, 30);
    await recordAnswered(env.DB, u.id, await assertCanAsk(env.DB, u, ADMINS, NOW));
    expect(await questionUsage(env.DB, u.id, NOW - 18 * DAY)).toBe(31);
  });

  it('Falha não consome', async () => {
    const u = await user();
    await subscribe(u.id);
    await setUsed(u.id, 30);
    await assertCanAsk(env.DB, u, ADMINS, NOW); // a IA falhou: recordAnswered não é chamado
    expect(await questionUsage(env.DB, u.id, NOW - 18 * DAY)).toBe(30);
  });

  it('Renovação zera', async () => {
    const u = await user();
    await subscribe(u.id, NOW - 30 * DAY, NOW);
    await setUsed(u.id, 200, NOW - 30 * DAY);
    // RENEWAL: período novo começando agora
    await env.DB.prepare('UPDATE subscriptions SET period_start = ?, expires_at = ? WHERE user_id = ?')
      .bind(NOW, NOW + 30 * DAY, u.id)
      .run();
    const ticket = await assertCanAsk(env.DB, u, ADMINS, NOW + 1);
    expect(ticket.periodStart).toBe(NOW);
    expect(await questionUsage(env.DB, u.id, NOW)).toBe(0);
  });

  it('Admin sem limite', async () => {
    const u = await user('admin@example.com');
    const d = new Date(NOW);
    const month = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
    await setUsed(u.id, 250, month);
    await expect(assertCanAsk(env.DB, u, ADMINS, NOW)).resolves.toEqual({ periodStart: month });
  });
});
