## 1. Persistência (Requirement: Progresso salvo no aparelho)

- [x] 1.1 Escrever os testes que falham do store persistido: progresso mantido ao reabrir, framework preferido mantido, dados salvos inválidos, falha de leitura e falha de escrita sem exceção
- [x] 1.2 Implementar o `persist` (storage seguro, `partialize`, `merge` validado com Zod, versão 1) em `src/study/store.ts`; testes passando

## 2. Zerar (Requirement: Zerar progresso de um tema)

- [x] 2.1 Escrever o teste que falha de `resetTheme`: zera só o tema e mantém o framework preferido e os outros temas
- [x] 2.2 Implementar `resetTheme`; teste passando

## 3. Aba Progresso (Requirements: Aba Progresso; Zerar; app-shell Telas provisórias)

- [x] 3.1 Escrever os testes de tela que falham: sem progresso, com progresso, progresso por deck, zerar com confirmação, cancelar; ajustar o teste antigo "Progresso provisório" do app-shell, que deixa de valer
- [x] 3.2 Implementar o anel de porcentagem, `ThemeProgress` e a tela `src/app/(tabs)/progress.tsx`; testes passando

## 4. Verificação final

- [x] 4.1 No navegador: estudar alguns cards, recarregar a página e conferir que o progresso continua; abrir a aba Progresso, zerar e cancelar
- [x] 4.2 Conferir que todo cenário dos deltas tem pelo menos um teste com o mesmo nome
- [x] 4.3 Rodar `openspec validate add-progress --strict`
- [x] 4.4 Rodar `npm test`, `npm run lint`, `npx tsc --noEmit` e `npm run format:check`, todos verdes
