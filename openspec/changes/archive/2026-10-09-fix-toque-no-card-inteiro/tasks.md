## 1. Spec e teste

- [x] 1.1 Delta spec de `study-flow` ("Virar e responder") com a área de toque do card inteiro e os cenários do espaço vazio na frente e no verso
- [x] 1.2 Teste falhando em `src/__tests__/study-flow.test.tsx`: os `Pressable` da frente e do verso ocupam o card (`flexGrow: 1`) e carregam o padding, e o conteúdo do `ScrollView` não tem padding

## 2. Correção

- [x] 2.1 `src/study/StudySession.tsx`: padding de `cardContent` movido para o novo estilo `cardTouch`, aplicado aos dois `Pressable`
- [x] 2.2 Teste do item 1.2 passando, e os testes de virar e responder continuam passando

## 3. Fechamento

- [x] 3.1 Conferência manual no aparelho: tocar no espaço vazio de um card curto (frente e verso) e rolar um verso longo
- [x] 3.2 `openspec validate --strict`, `npm test`, `npm run lint`, `npx prettier --check .` e `npx tsc --noEmit`
