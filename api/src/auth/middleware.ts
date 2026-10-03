// requireAuth: exige "Authorization: Bearer <accessToken>" válido e um usuário
// que ainda exista (o token continua assinado por até 15 min após apagar a conta).

import { createMiddleware } from 'hono/factory';

import { findUserById, type User } from '../db/users';
import { AppError } from '../errors';
import { verifyAccessToken } from './tokens';

export type AuthVariables = { user: User };

const unauthorized = () => new AppError(401, 'unauthorized', 'Entre na sua conta para continuar.');

export const requireAuth = createMiddleware<{ Bindings: Env; Variables: AuthVariables }>(async (c, next) => {
  const header = c.req.header('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const userId = token ? await verifyAccessToken(token, c.env.JWT_SECRET) : null;
  const user = userId ? await findUserById(c.env.DB, userId) : null;
  if (!user) throw unauthorized();
  c.set('user', user);
  await next();
});
