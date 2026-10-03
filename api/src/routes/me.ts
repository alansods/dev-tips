// GET /me (dados da conta) e DELETE /me (apaga a conta e todas as sessões).

import { Hono } from 'hono';

import { requireAuth, type AuthVariables } from '../auth/middleware';
import { deleteUser } from '../db/users';

export const meRoutes = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

meRoutes.use('*', requireAuth);

meRoutes.get('/', (c) => c.json(c.var.user));

meRoutes.delete('/', async (c) => {
  await deleteUser(c.env.DB, c.var.user.id);
  return c.body(null, 204);
});
