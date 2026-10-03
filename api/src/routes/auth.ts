// POST /auth/google, /auth/refresh e /auth/logout.

import { Hono } from 'hono';
import { z } from 'zod';

import { loginWithGoogle, logout, refreshSession } from '../auth/service';
import type { Deps } from '../deps';
import { jsonBody } from '../validation';

const idTokenBody = z.object({ idToken: z.string().min(1) });
const refreshBody = z.object({ refreshToken: z.string().min(1) });

export function authRoutes(deps: Deps) {
  const routes = new Hono<{ Bindings: Env }>();

  routes.post('/google', jsonBody(idTokenBody), async (c) =>
    c.json(await loginWithGoogle(c.env, deps, c.req.valid('json').idToken)),
  );

  routes.post('/refresh', jsonBody(refreshBody), async (c) =>
    c.json(await refreshSession(c.env, deps, c.req.valid('json').refreshToken)),
  );

  routes.post('/logout', jsonBody(refreshBody), async (c) => {
    await logout(c.env, deps, c.req.valid('json').refreshToken);
    return c.body(null, 204);
  });

  return routes;
}
