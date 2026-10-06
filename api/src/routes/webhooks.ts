// POST /webhooks/revenuecat: o RevenueCat avisa compras, renovações, cancelamentos
// e expirações. Autenticado pelo cabeçalho Authorization configurado no painel dele.

import { Hono } from 'hono';

import { applyEvent, webhookBody } from '../billing/events';
import { findSubscription, saveSubscription } from '../db/subscriptions';
import { findUserById } from '../db/users';
import { AppError } from '../errors';
import { jsonBody } from '../validation';

/** Compara em tempo constante, para o tempo de resposta não revelar o segredo. */
function sameSecret(received: string, expected: string): boolean {
  const a = new TextEncoder().encode(received);
  const b = new TextEncoder().encode(expected);
  return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
}

export const webhookRoutes = new Hono<{ Bindings: Env }>();

webhookRoutes.use('/revenuecat', async (c, next) => {
  const expected = c.env.REVENUECAT_WEBHOOK_AUTH;
  if (!expected || !sameSecret(c.req.header('Authorization') ?? '', expected)) {
    throw new AppError(401, 'unauthorized', 'Webhook não autorizado.');
  }
  await next();
});

webhookRoutes.post('/revenuecat', jsonBody(webhookBody), async (c) => {
  const { event } = c.req.valid('json');
  // Respondemos 200 mesmo quando ignoramos o evento: um erro faria o RevenueCat reenviar sem parar.
  const user = await findUserById(c.env.DB, event.app_user_id);
  if (user) {
    const next = applyEvent(await findSubscription(c.env.DB, user.id), event);
    if (next) await saveSubscription(c.env.DB, user.id, next);
  }
  return c.json({ ok: true });
});
