## 1. Pré-requisitos no conteúdo

- [x] 1.1 Spec: requisito "Pré-requisitos da trilha" em `specs/content-model/spec.md`
- [x] 1.2 Teste falhando para "Pré-requisito válido", "Pré-requisito inexistente", "Trilha depende de si mesma", "Ciclo" e "Sem pré-requisitos"
- [x] 1.3 Adicionar `prerequisites` ao `trackSchema` e a checagem entre trilhas ao `validateCatalog`
- [x] 1.4 Preencher `prerequisites` nas trilhas, conforme a tabela do design, e confirmar que o catálogo do repositório valida

## 2. Ordem sugerida

- [x] 2.1 Spec: "Tela da área" e "Ordem sugerida na área" em `specs/catalog-navigation/spec.md`
- [x] 2.2 Teste falhando em `src/content/__tests__/navigation.test.ts` para `areaPath` ("Pré-requisito antes", "Ordem do catálogo no empate", "Pré-requisito de outra área") e `nextTracks`, e em `src/study/__tests__/rules.test.ts` para `trackStatus`
- [x] 2.3 Implementar `areaPath`, `nextTracks` e `trackStatus`
- [x] 2.4 Teste falhando nas telas para "Estados", "Revisão pendente", "Abrir pela ordem sugerida" e os cenários de "Tela da área"
- [x] 2.5 Criar `PathList`, usá-lo na tela da área e adicionar os textos em pt-BR e inglês; ajustar os testes de navegação que contam seções

## 3. Verificação

- [x] 3.1 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
