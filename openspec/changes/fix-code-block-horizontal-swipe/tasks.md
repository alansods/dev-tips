## 1. Spec e teste

- [x] 1.1 Delta spec de `study-flow` ("Exibição de código") com os cenários de arrastar e tocar no código sem virar o card
- [x] 1.2 Teste falhando em `src/__tests__/study-flow.test.tsx`: a área do código reivindica o toque, fica dentro do `ScrollView` horizontal e cobre a área preta

## 2. Correção

- [x] 2.1 `src/components/cards/parts.tsx`: `CodeBlock` com uma `View` dentro do `ScrollView` horizontal, em volta do texto, com `onStartShouldSetResponder` e o padding
- [x] 2.2 Teste do item 1.2 passando, e os testes de virar e responder continuam passando

## 3. Fechamento

- [x] 3.1 Conferência manual no aparelho: arrastar o código para os dois lados (curto e lento), tocar no código e fora dele
- [x] 3.2 `openspec validate --strict`, `npm test`, `npm run lint`, `npx prettier --check .` e `npx tsc --noEmit`
