// API do Dev Tips (Hono no Cloudflare Workers). A Cloudflare chama app.fetch a
// cada requisição, passando os bindings do wrangler.jsonc (DB, ALLOWED_ORIGINS) em c.env.

import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { defaultDeps, type Deps } from './deps';
import { errorBody, handleError } from './errors';
import { authRoutes } from './routes/auth';
import { healthRoutes } from './routes/health';
import { meRoutes } from './routes/me';

/** Origens web liberadas no CORS; outras não recebem Access-Control-Allow-Origin. */
const allowedOrigins = (env: Env) =>
  env.ALLOWED_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean);

/** Monta a API. Os testes passam `deps` para trocar as chaves do Google e o relógio. */
export function createApp(overrides: Partial<Deps> = {}) {
  const deps = { ...defaultDeps(), ...overrides };
  const app = new Hono<{ Bindings: Env }>();

  // Criado por requisição porque c.env só existe durante a requisição.
  app.use('*', (c, next) =>
    cors({ origin: (origin) => (allowedOrigins(c.env).includes(origin) ? origin : null) })(c, next),
  );

  app.route('/health', healthRoutes);
  app.route('/auth', authRoutes(deps));
  app.route('/me', meRoutes);

  app.notFound((c) => c.json(errorBody('not_found', 'Rota não encontrada.'), 404));
  app.onError(handleError);
  return app;
}

export default createApp();
