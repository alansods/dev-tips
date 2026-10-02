## 1. Regras (Requirements: Agendamento por caixas; Cards para revisar hoje)

- [x] 1.1 Escrever os testes que falham de `clock` (`addDays` atravessando mês e ano) e de `srs`: primeiro acerto, acertos seguidos, teto da caixa 5, erro volta para a caixa 1, vencidos e do dia entram, cards novos não entram
- [x] 1.2 Implementar `src/study/clock.ts` e `src/study/srs.ts`; testes passando

## 2. Store (Requirements: Agendamento salvo no aparelho; progress Zerar)

- [x] 2.1 Escrever os testes que falham: `answer` atualiza o agendamento, agendamento mantido ao reabrir, dados da versão anterior, zerar apaga o agendamento do tema
- [x] 2.2 Implementar `schedule`, `persist` versão 2 com `migrate` e o `merge` atualizado; testes passando

## 3. Sessão reutilizável e rota de revisão (Requirement: Sessão de revisão)

- [x] 3.1 Extrair `Session` para `src/study/StudySession.tsx`, sem mudar comportamento (suítes atuais verdes)
- [x] 3.2 Escrever os testes de tela que falham: revisar os cards do dia, revisão concluída some do dia, erro na revisão continua no dia
- [x] 3.3 Implementar `src/app/review/[themeId].tsx`; testes passando

## 4. Telas (Requirements: Revisão de hoje na tela do tema; Revisão na Home; progress Zerar)

- [x] 4.1 Escrever os testes que falham: com revisão pendente, sem revisão pendente, aviso na Home, zerar apaga o agendamento (tela)
- [x] 4.2 Implementar o bloco na tela do tema e a linha na Home; testes passando

## 5. Verificação final

- [x] 5.1 No navegador: responder cards (um "não sei"), ver "Revisão de hoje" no tema e na Home, revisar e conferir que o bloco atualiza
- [x] 5.2 Conferir que todo cenário dos deltas tem pelo menos um teste com o mesmo nome
- [x] 5.3 Rodar `openspec validate add-spaced-repetition --strict`
- [x] 5.4 Rodar `npm test`, `npm run lint`, `npx tsc --noEmit` e `npm run format:check`, todos verdes
