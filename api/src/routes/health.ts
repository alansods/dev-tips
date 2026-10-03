// GET /health: diz se a API está de pé e se o banco responde.
// 503 (e não 500) quando o banco falha: a API funciona, mas uma dependência não.

import { Hono } from 'hono';

import { pingDatabase } from '../db/health';

export const healthRoutes = new Hono<{ Bindings: Env }>();

healthRoutes.get('/', async (c) => {
  try {
    await pingDatabase(c.env.DB);
    return c.json({ status: 'ok', database: 'ok' });
  } catch {
    return c.json({ status: 'degraded', database: 'error' }, 503);
  }
});
