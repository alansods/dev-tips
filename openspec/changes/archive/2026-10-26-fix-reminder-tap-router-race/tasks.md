# Tasks

## 1. Blindar o hook contra o router ainda não religado

- [x] 1.1 Confirmar que `npx jest src/__tests__/reminders.test.tsx` reproduz a falha atual nos cenários "Toque com revisão pendente" e "Toque sem revisão" (falha esperada, documentando o bug antes do fix).
- [x] 1.2 Em `src/reminders/useReminderTap.ts`, envolver a chamada a `router.navigate(...)` dentro de `openTarget()` num `try/catch` que detecta especificamente o erro "router indisponível antes do primeiro render" e reagenda a mesma chamada numa microtarefa (`Promise.resolve().then(...)`), relançando qualquer outro erro.
- [x] 1.3 Rodar `npx jest src/__tests__/reminders.test.tsx` e confirmar que os 12 testes do arquivo passam, incluindo os dois cenários do passo 1.1.
- [x] 1.4 Rodar a suíte completa (`npm test`) e `npx tsc --noEmit` para garantir que não há regressão em outros arquivos.

## Workflow follow-up

- `openspec validate --strict` depois do passo 1.4.
- `/opsx:archive` depois de validar e com os testes verdes.
