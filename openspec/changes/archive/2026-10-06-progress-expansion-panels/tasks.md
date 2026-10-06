## 1. Painel expansível na aba Progresso

- [x] 1.1 Spec: delta do requisito "Aba Progresso" em `specs/progress/spec.md` (painéis fechados, abrir/fechar, vários abertos, porcentagem no cabeçalho)
- [x] 1.2 Teste falhando em `src/__tests__/progress-tab.test.tsx` para "Painéis começam fechados", "Abrir e fechar um painel", "Vários painéis abertos" e "Porcentagem no painel fechado"; ajustar os cenários existentes ("Sem progresso", "Com progresso", "Progresso por deck" e os de Zerar) para abrir o painel antes
- [x] 1.3 Criar `src/components/ExpansionPanel.tsx` (cabeçalho `Pressable` acessível com `expanded`, chevron girando, `children` montados só quando aberto, `LayoutAnimation`)
- [x] 1.4 Usar o painel em `src/app/(tabs)/progress.tsx`: cabeçalho com título, porcentagem e barra; corpo com contadores, decks, legenda e Zerar; remover o anel
- [x] 1.5 Ajustar os outros testes que usam `track-progress-*` para abrir o painel, e confirmar que todos passam

## 2. Verificação

- [x] 2.1 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
