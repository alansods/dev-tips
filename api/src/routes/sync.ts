// PUT /sync (envia mudanças do aparelho) e GET /sync?since= (busca as da conta).

import { Hono } from 'hono';
import { z } from 'zod';

import { requireAuth, type AuthVariables } from '../auth/middleware';
import { changesSince, upsertChanges } from '../db/sync';
import type { Deps } from '../deps';
import { AppError } from '../errors';
import { jsonBody } from '../validation';

export const MAX_CARDS_PER_REQUEST = 500;

const id = z.string().min(1).max(100);
const cardChange = z.object({
  themeId: id,
  cardId: id,
  result: z.enum(['known', 'unknown']).nullable(),
  box: z.number().int().min(1).max(5).nullable(),
  due: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  updatedAt: z.number().int().nonnegative(),
});
const settingsChange = z.object({
  language: z.enum(['pt-BR', 'en']).nullable(),
  preferredVariant: z.record(id, id),
  updatedAt: z.number().int().nonnegative(),
});
const pushBody = z.object({ cards: z.array(cardChange).optional(), settings: settingsChange.optional() });

export function syncRoutes(deps: Deps) {
  const routes = new Hono<{ Bindings: Env; Variables: AuthVariables }>();
  routes.use('*', requireAuth);

  routes.put('/', jsonBody(pushBody), async (c) => {
    const { cards = [], settings } = c.req.valid('json');
    if (cards.length > MAX_CARDS_PER_REQUEST) {
      throw new AppError(400, 'too_many_items', `Envie no máximo ${MAX_CARDS_PER_REQUEST} cards por vez.`);
    }
    const serverTime = deps.now();
    await upsertChanges(c.env.DB, c.var.user.id, cards, settings, serverTime);
    return c.json({ serverTime });
  });

  routes.get('/', async (c) => {
    const raw = c.req.query('since');
    const since = raw === undefined ? null : Number(raw);
    if (since !== null && !Number.isFinite(since))
      throw new AppError(400, 'invalid_query', 'Parâmetro since inválido.');
    const serverTime = deps.now();
    return c.json({ ...(await changesSince(c.env.DB, c.var.user.id, since)), serverTime });
  });

  return routes;
}
