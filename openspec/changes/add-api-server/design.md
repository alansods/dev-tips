## Context

Decisões tomadas com o usuário e registradas em `docs/backend/alternativa-nestjs-render-monorepo.md`: Hono no Cloudflare Workers (grátis, não dorme), banco Cloudflare D1 (SQLite), pasta `api/` na raiz como projeto independente.

## Goals / Non-Goals

**Goals:**
- Esqueleto da API publicado e testado, pronto para receber login e sincronização.

**Non-Goals:**
- Tabelas de dados; a primeira migration (`users`) chega em `add-auth`.

## Decisions

- **Estrutura `api/`:** `src/index.ts` (app Hono: CORS, rotas, `notFound`, `onError`), `src/env.ts` (tipo `Bindings`: `DB`, `ALLOWED_ORIGINS`), `src/errors.ts` (`AppError` e `handleError`), `src/routes/health.ts`, `src/db/health.ts` (`SELECT 1`). Mesmas camadas do tema CRUD (rota → acesso ao banco).
- **Bindings em vez de `process.env`:** o Workers injeta o banco e as variáveis em `c.env` a cada requisição. O middleware de CORS é criado dentro do handler porque `c.env` só existe durante a requisição.
- **`wrangler.jsonc`** (formato atual da documentação) com `compatibility_date`, o binding `DB` do D1 (`migrations_dir: "migrations"`) e `vars.ALLOWED_ORIGINS`. O `database_id` não é segredo; segredos (a partir de `add-auth`) vão com `wrangler secret put`.
- **Testes com Vitest + `@cloudflare/vitest-plugin` (`cloudflareTest`):** rodam no runtime real do Workers (Miniflare) com D1 local, sem Docker. As requisições usam `app.request(path, init, env)`. O cenário "banco fora do ar" usa um `DB` falso que lança erro.
- **SQL direto no D1** (prepared statements com `.bind`), sem ORM, por enquanto.
- **O app ignora `api/`:** `exclude` no `tsconfig.json`, `testPathIgnorePatterns` no Jest e `ignores` no ESLint, para cada projeto checar só o próprio código.

## Risks / Trade-offs

- [Limite de 10 ms de CPU por requisição no plano grátis] → rotas simples; medir quando login e sync entrarem.
- [Deploy depende da conta do usuário na Cloudflare] → tudo é implementado e testado localmente; o deploy acontece quando o login no Wrangler estiver feito.
