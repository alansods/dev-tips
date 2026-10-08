## 1. Busca e filtros

- [x] 1.1 Spec: requisito "Busca e filtros na aba Trilhas" em `specs/catalog-navigation/spec.md`
- [x] 1.2 Mover `normalize` para `src/content/text.ts`, mantendo o glossário igual
- [x] 1.3 Teste falhando em `src/content/__tests__/search.test.ts` para busca sem acento, por framework, sem resultado, filtro de estado, filtro de linguagem e busca combinada
- [x] 1.4 Implementar `filterTracks` em `src/content/search.ts`

## 2. Tela

- [x] 2.1 Teste falhando em `src/__tests__/tracks-search.test.tsx` para os cenários da tela
- [x] 2.2 Montar busca, filtros, "Por linguagem", resultado e áreas em duas colunas em `(tabs)/tracks.tsx`; textos em pt-BR e inglês

## 3. Verificação

- [x] 3.1 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
