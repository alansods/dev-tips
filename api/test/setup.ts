import { applyD1Migrations } from 'cloudflare:test';
import { env } from 'cloudflare:workers';

// Aplica as migrations no D1 local antes dos testes (idempotente).
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
