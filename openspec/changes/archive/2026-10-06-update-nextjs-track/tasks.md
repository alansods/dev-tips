## 1. Testes

- [x] 1.1 Teste falhando em `src/content/__tests__/nextjs-current.test.ts`: Proxy (PT e EN), Cache Components no card `cache-e-revalidacao` e os ids antigos fora da trilha

## 2. Conteúdo

- [x] 2.1 Atualizar os cards `middleware-next` (→ `proxy`), `revalidate` (→ `cache-e-revalidacao`), `ssr`, `ssr-vs-ssg` e `por-que-nextjs` em `content/tracks/nextjs/track.json`
- [x] 2.2 Atualizar os mesmos cards (com os ids novos) em `content/tracks/nextjs/translations/en.json`
- [x] 2.3 Teste novo e testes existentes passando

## 3. Fechamento

- [x] 3.1 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
