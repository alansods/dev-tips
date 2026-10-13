## 1. Ordem e cabeçalhos (glossary: Aba Glossário)

- [x] 1.1 Testes unitários de `sortTerms` e `withLetterHeaders` em `src/glossary/__tests__`; ajustar "Lista completa" e adicionar "Cabeçalhos de letra" em `src/__tests__/glossary-flow.test.tsx`; ver os testes falharem
- [x] 1.2 Implementar `sortTerms` e `withLetterHeaders` em `src/glossary/search.ts`
- [x] 1.3 Tela: dados mistos na `FlatList` (letra e termo), cabeçalho de letra e grupo desenhado como cartão em `GlossaryItem`; ver os testes passarem

## 2. Filtros (glossary: Filtros do glossário)

- [x] 2.1 Testes unitários de `filterTerms` e testes de tela para os cenários de filtro; ver os testes falharem
- [x] 2.2 Implementar `filterTerms` e o tipo dos filtros em `src/glossary/search.ts`
- [x] 2.3 Criar `src/glossary/GlossaryFilters.tsx` (gaveta com Seu estudo, Área, Nível e Trilha, "Limpar" e "Ver N termos")
- [x] 2.4 Tela: botão "Filtros" com contagem, chips dos filtros ativos e combinação com a busca
- [x] 2.5 Textos em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`

## 3. Verificação

- [x] 3.1 `npm test`, `npm run lint`, `npx tsc --noEmit` e `openspec validate --strict` verdes
- [x] 3.2 No aparelho: abrir a aba, filtrar por trilha, nível e estudo, remover pelo chip, limpar
