## 1. Testes

- [x] 1.1 Adicionar teste do cenário "Lista longa": com o catálogo completo, a aba monta menos itens que o total e a contagem mostra o total; ver o teste falhar
- [x] 1.2 Ajustar os helpers dos testes da aba Glossário para rolar a lista até o fim antes de conferir os itens

## 2. Implementação

- [x] 2.1 Adicionar `scroll={false}` ao `Screen`, mantendo área segura, fundo e aviso de offline
- [x] 2.2 Criar `src/glossary/GlossaryItem.tsx` memoizado com o mesmo `testID`, rótulo, selo e título da trilha
- [x] 2.3 Trocar o `map` da aba por `FlatList`, com busca e contagem fixas no topo, "Nenhum termo encontrado." fora da lista, `Map` de títulos e `useDeferredValue` na busca

## 3. Verificação

- [x] 3.1 `npm test`, `npm run lint`, `npx tsc --noEmit` e `openspec validate --strict` verdes
- [ ] 3.2 No aparelho: abrir a aba, rolar até o fim, buscar, abrir um termo e conferir o selo após marcar um card
