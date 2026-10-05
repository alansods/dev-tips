## 1. CI

- [x] 1.1 `.github/workflows/ci.yml` com os jobs `app` e `api`, actions fixadas por SHA
- [x] 1.2 Rodar localmente os mesmos comandos da CI
- [x] 1.3 README: seção sobre a CI
- [ ] 1.4 PR para a `dev` com `app` e `api` verdes no GitHub

## 2. Proteção e segurança

- [ ] 2.1 Ruleset da `main` (PR, checks `app` e `api`, sem push forçado nem exclusão, bypass de admin por PR)
- [ ] 2.2 Ruleset da `dev` (checks `app` e `api`, sem push forçado nem exclusão)
- [ ] 2.3 Ligar alertas de vulnerabilidade e correções automáticas do Dependabot
- [ ] 2.4 Conferir as configurações pela API do GitHub

## 3. Fechamento

- [ ] 3.1 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
