## 1. Rótulos centralizados

- [ ] 1.1 Adicionar `ANSWER_LABEL` em `src/study/copy.ts` com os rótulos de botão ("Já sabia", "Não sabia") e as formas minúsculas para contagens e selos ("já sabia", "não sabia")

## 2. Sessão de estudo e revisão (study-flow, spaced-repetition, app-polish)

- [ ] 2.1 Atualizar os testes `src/__tests__/study-flow.test.tsx` e `src/__tests__/review-flow.test.tsx` para os botões "Já sabia"/"Não sabia" e os rótulos de resumo "3 já sabia"/"2 não sabia"; confirmar que falham
- [ ] 2.2 Trocar os botões e o resumo em `src/study/StudySession.tsx`, incluindo a frase "Você marcou N de M cards como 'já sabia'" e os accessibilityLabels, usando `ANSWER_LABEL`
- [ ] 2.3 Rodar os testes de 2.1 e confirmar que passam

## 3. Aba Progresso (progress)

- [ ] 3.1 Atualizar `src/__tests__/progress-tab.test.tsx` para os rótulos "0 já sabia"/"4 já sabia" e a legenda "já sabia"; confirmar que falha
- [ ] 3.2 Trocar a contagem e a legenda em `src/app/(tabs)/progress.tsx`
- [ ] 3.3 Rodar o teste e confirmar que passa

## 4. Glossário (glossary)

- [ ] 4.1 Atualizar `src/__tests__/glossary-flow.test.tsx` para o selo "já sabia" e o botão "Não sabia" na gaveta; confirmar que falha
- [ ] 4.2 Trocar o selo em `src/app/(tabs)/glossary.tsx`
- [ ] 4.3 Rodar o teste e confirmar que passa

## 5. Acabamento

- [ ] 5.1 Atualizar os comentários em `src/study/srs.ts`, `src/study/rules.ts`, `src/study/StudySession.tsx` e `src/components/ProgressBar.tsx`
- [ ] 5.2 Atualizar o Purpose de `openspec/specs/study-flow/spec.md` para "Já sabia"/"Não sabia" (Purpose não entra em delta)
- [ ] 5.3 Conferir em uma tela estreita que os botões "Não sabia"/"Já sabia" não quebram linha
- [ ] 5.4 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`
