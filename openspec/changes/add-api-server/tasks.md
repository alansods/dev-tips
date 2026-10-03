## 1. Projeto

- [ ] 1.1 Criar `api/` com `package.json` (hono, wrangler, vitest, @cloudflare/vitest-plugin, typescript), `tsconfig.json` com os tipos do Workers e `wrangler.jsonc` (binding `DB`, `ALLOWED_ORIGINS`)
- [ ] 1.2 Fazer o app ignorar `api/` (`tsconfig.json`, Jest, ESLint) e confirmar que a suíte do app continua verde
- [ ] 1.3 Configurar `vitest.config.ts` com `cloudflareTest`

## 2. Verificação de saúde

- [ ] 2.1 Testes falhando: "API e banco funcionando" e "Banco fora do ar"
- [ ] 2.2 Implementar `src/db/health.ts` e `src/routes/health.ts`
- [ ] 2.3 Testes passando

## 3. Erros e CORS

- [ ] 3.1 Testes falhando: "Rota inexistente", "Erro inesperado", "Erro conhecido", "Origem permitida", "Origem não permitida" e "App nativo"
- [ ] 3.2 Implementar `src/errors.ts`, `notFound`, `onError` e o CORS em `src/index.ts`
- [ ] 3.3 Testes passando

## 4. Publicação e decisão

- [ ] 4.1 Atualizar a decisão de backend no `openspec/config.yaml`
- [ ] 4.2 Com o login do usuário no Wrangler: `wrangler d1 create dev-tips`, preencher o `database_id`, `npm run deploy` e conferir `GET /health` em produção
- [ ] 4.3 Rodar `npm test` e `npm run typecheck` em `api/`, e `npm test`, `npm run lint` e `npx tsc --noEmit` no app
