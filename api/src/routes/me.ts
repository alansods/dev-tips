// GET /me (dados da conta), DELETE /me (apaga a conta e todas as sessões) e o
// plano Pro: GET /me/subscription e POST /me/subscription/sync.

import { Hono } from 'hono';

import { requireAuth, type AuthVariables } from '../auth/middleware';
import { subscriptionView } from '../billing/plan';
import { findSubscription, saveSubscription } from '../db/subscriptions';
import { deleteUser } from '../db/users';
import type { Deps } from '../deps';
import { AppError } from '../errors';

export function meRoutes(deps: Deps) {
  const routes = new Hono<{ Bindings: Env; Variables: AuthVariables }>();
  routes.use('*', requireAuth);

  routes.get('/', (c) => c.json(c.var.user));

  routes.delete('/', async (c) => {
    await deleteUser(c.env.DB, c.var.user.id);
    return c.body(null, 204);
  });

  routes.get('/subscription', async (c) =>
    c.json(await subscriptionView(c.env.DB, c.var.user, c.env.ADMIN_EMAILS, deps.now())),
  );

  routes.post('/subscription/sync', async (c) => {
    const { user } = c.var;
    const now = deps.now();
    let pro;
    try {
      pro = await deps.revenueCat.getProEntitlement(user.id, c.env.REVENUECAT_SECRET_KEY);
    } catch (err) {
      console.error(err);
      throw new AppError(502, 'billing_unavailable', 'Não foi possível consultar a assinatura agora.');
    }
    const current = await findSubscription(c.env.DB, user.id);
    // A consulta reflete o estado atual: grava sempre, e eventos mais antigos que agora passam a ser ignorados.
    const lastEventAt = Math.max(now, current?.lastEventAt ?? 0);
    if (pro) {
      await saveSubscription(c.env.DB, user.id, {
        periodStart: pro.purchasedAt,
        expiresAt: pro.expiresAt,
        willRenew: pro.willRenew,
        productId: pro.productId,
        lastEventAt,
      });
    } else if (current && current.expiresAt > now) {
      await saveSubscription(c.env.DB, user.id, { ...current, expiresAt: now, willRenew: false, lastEventAt });
    }
    return c.json(await subscriptionView(c.env.DB, user, c.env.ADMIN_EMAILS, now));
  });

  return routes;
}
