## Why

O app guarda tudo só no aparelho. Para ter login e progresso na nuvem, é preciso uma API. Esta change cria a base dessa API e valida a infraestrutura inteira (código, banco, testes e publicação) com a menor funcionalidade possível, antes do login e da sincronização.

## What Changes

- Novo projeto de API em `api/` (Hono no Cloudflare Workers, banco Cloudflare D1), independente do app.
- Rota `GET /health` que informa se a API e o banco estão funcionando.
- Respostas de erro num formato JSON único para toda a API (404, 500 e erros conhecidos).
- CORS liberado só para as origens configuradas (o app na web).
- O app passa a ignorar a pasta `api/` no typecheck, nos testes e no lint.
- Decisão de produto revista: o MVP deixa de ser "sem backend" (`openspec/config.yaml`).

## Capabilities

### New Capabilities

- `api-server`: a API do Dev Tips, com verificação de saúde, formato de erros e CORS.

### Modified Capabilities

_Nenhuma._

## Impact

- Novo: `api/` (`package.json`, `wrangler.jsonc`, `src/`, `test/`, `migrations/`).
- App: `tsconfig.json`, Jest e ESLint passam a excluir `api/`.
- Infra: conta na Cloudflare, banco D1 `dev-tips` e o Worker `dev-tips-api` (plano grátis).
- Documentação de apoio: `docs/backend/alternativa-nestjs-render-monorepo.md`.

## Fora de escopo

- Login, usuários e tabelas de dados (changes `add-auth` e `add-cloud-sync`).
- Deploy automático por CI (o deploy é manual por enquanto).
- Monitoramento e alertas além dos logs da Cloudflare.
