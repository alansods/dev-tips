## 1. Ordem aleatória

- [x] 1.1 Spec: delta de "Sessão de estudo", "Deck com progresso e ação" e "Resumo da sessão" em `specs/study-flow/spec.md`
- [x] 1.2 Teste falhando em `src/study/__tests__/rules.test.ts` para `sessionOrder`. Cenários: com `random` fixo, a ordem segue o sorteio; com `random` ≈ 1, a ordem fica intacta; os passos ficam em ordem crescente numa lista misturada; o conjunto de ids não muda
- [x] 1.3 Implementar `sessionOrder(ids, cardsById, random = Math.random)` em `src/study/rules.ts`: Fisher-Yates, depois os `step` reposicionados por `number`
- [x] 1.4 Criar `src/study/chance.ts` (`random()`) e, no `beforeEach` global de `jest.setup.ts`, fixar o sorteio em `0.999999` (ordem do deck) para as suítes que contam com a ordem; os testes de sorteio trocam o valor
- [x] 1.5 Teste falhando em `src/__tests__/study-flow.test.tsx` para "Ordem sorteada", "Nova ordem a cada sessão", "Passos em ordem" e "Mesmos cards"
- [x] 1.6 Aplicar `sessionOrder` na `StudySession`, ao abrir e no reinício por "Revisar os que errei", e confirmar que os testes passam

## 2. Virar de volta

- [x] 2.1 Spec: delta de "Virar e responder" em `specs/study-flow/spec.md` e de "Animação de virar o card" em `specs/app-polish/spec.md`
- [x] 2.2 Teste falhando em `src/study/__tests__/rules.test.ts`: a ação `flip` alterna `revealed`, e `answer` continua exigindo o verso visível
- [x] 2.3 Trocar `reveal` por `flip` no `sessionReducer` e nos usos
- [x] 2.4 Teste falhando em `src/__tests__/study-flow.test.tsx` para "Voltar para a pergunta", "Tocar no verso" e "Virar de novo"
- [x] 2.5 Teste falhando em `src/__tests__/study-flow.test.tsx` para "Voltar para a frente com animação": "Mostrar resposta" fica disponível na hora, com a animação em curso (a duração e o "reduzir movimento" continuam cobertos por `flipDuration` em `motion.test.tsx`)
- [x] 2.6 Na `StudySession`: botão "Ver pergunta" no verso, `Pressable` com `accessible={false}` em volta do verso, animação nos dois sentidos sem animar a troca de card
- [x] 2.7 Textos novos em `src/i18n/pt-BR.ts` e `src/i18n/en.ts` ("Ver pergunta"/"See question", com dica de acessibilidade), e confirmar que os testes passam

## 3. Verificação

- [x] 3.1 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
