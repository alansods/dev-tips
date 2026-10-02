## 1. Busca (Requirement: Busca no glossário)

- [x] 1.1 Escrever os testes que falham de `normalize` e `searchTerms`: por nome, sem acento, pela definição, por alias, vazio devolve tudo, sem resultados
- [x] 1.2 Implementar `src/glossary/search.ts`; testes passando

## 2. Chips e gaveta (Requirements: Termos relacionados no verso; Gaveta de definição)

- [x] 2.1 Escrever os testes que falham de componente: chips no verso do passo, frente sem chips, card sem termos relacionados, abrir a definição, navegar entre termos na gaveta, fechar pelo botão e pelo fundo
- [x] 2.2 Implementar `TermChips` e `TermSheet` e ligar `onOpenTerm` no `CardFace`; testes passando
- [x] 2.3 Escrever o teste de tela que falha "Fechar sem perder a sessão" e ligar a gaveta na sessão de estudo; teste passando

## 3. Aba Glossário (Requirements: Aba Glossário; Busca; app-shell REMOVED)

- [x] 3.1 Escrever os testes de tela que falham: lista completa, selo de status, abrir termo pela lista, buscar pelo nome, sem acento, pela definição, sem resultados; trocar o teste antigo "Glossário provisório" do app-shell
- [x] 3.2 Implementar a aba Glossário e remover o `PlaceholderScreen`; testes passando

## 4. Verificação final

- [x] 4.1 No navegador: verso do Passo 13 → chip CORS → gaveta → Middleware → fechar; aba Glossário → buscar "injecao" → abrir termo
- [x] 4.2 Conferir que todo cenário dos deltas tem pelo menos um teste com o mesmo nome
- [x] 4.3 Rodar `openspec validate add-glossary-links --strict`
- [x] 4.4 Rodar `npm test`, `npm run lint`, `npx tsc --noEmit` e `npm run format:check`, todos verdes
