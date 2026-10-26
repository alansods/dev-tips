# Design

## Context

`useReminderTapNavigation` (`src/reminders/useReminderTap.ts`) chama `router.navigate(...)` dentro de um `useEffect` disparado quando `useLastReminderTap()` retorna um novo toque. O `router` do expo-router é um singleton de módulo religado por um layout effect quando o `NavigationContainer` monta; antes disso, chamar qualquer método dele lança `"The imperative router is unavailable before the first render has finished."`. Normalmente layout effects correm antes de passive effects no mesmo commit, então essa corrida não aparece. Mas numa passagem de reconexão de efeitos passivos do React (vista nos testes depois do upgrade para Expo SDK 58 / React 19.3), o passive effect do hook pode correr numa janela em que o router ainda não foi religado.

Ver proposal.md - Why.

## Goals / Non-Goals

- Goal: a navegação do toque nunca se perde por essa corrida, sem mudar o destino calculado.
- Goal: a correção fica isolada no hook, sem tocar no expo-router ou no fluxo de cálculo do destino (`reminderTarget`).
- Non-goal: eliminar a causa raiz da corrida no React/expo-router (fora do nosso controle).
- Non-goal: cobrir qualquer outro lugar do app que chame `router.*` imperativamente fora de um handler de evento (não há outro caso hoje).

## Decisions

**Decisão: capturar o erro de "router indisponível" e tentar de novo no próximo tick, em vez de guardas de estado adicionais.**

`openTarget()` passa a chamar `router.navigate(...)` dentro de um `try/catch`; se o erro for especificamente esse ("router indisponível antes do primeiro render"), agenda uma nova tentativa numa microtarefa (`Promise.resolve().then(...)`) em vez de propagar a exceção. Qualquer outro erro continua propagando normalmente.

Microtarefa, não `setTimeout`: os testes que exercitam o toque na notificação usam timers falsos e só avançam microtarefas (`await Promise.resolve()` em loop) para esperar o agendamento, sem chamar `jest.advanceTimersByTime`; um retry por `setTimeout` nunca rodaria nesse fluxo de teste. Uma microtarefa também é suficiente: a janela de corrida é a ordem de efeitos dentro do mesmo commit, resolvida bem antes do próximo macrotask.

Alternativas consideradas:
- *Checar algum "router pronto" antes de navegar*: o expo-router não expõe essa checagem publicamente (o `router` é a única superfície pública, e ele mesmo é quem lança o erro).
- *Mover a navegação para um layout effect*: layout effects não garantem ordem relativa a OUTROS layout effects de módulos diferentes (o do expo-router), então não eliminaria a corrida de forma confiável, só mudaria a janela.
- *Debounce/delay fixo antes de navegar*: adicionaria uma espera artificial em todo toque, mesmo nos 99% dos casos sem corrida.

## Risks / Trade-offs

- [Risco] Reagendar numa microtarefa fora do React pode, em teoria, rodar depois do componente desmontar → Mitigação: `openTarget` já é idempotente por desenho (`reminderTarget` só lê stores globais, não estado do componente), e o pior caso é uma chamada a mais a `router.navigate` que o próprio guard de `handledTap` já absorve se o toque for o mesmo.
- [Risco] Se o router ESTIVER genuinamente indisponível por outro motivo (bug real, não corrida), o retry mascara o erro → Mitigação: o catch só absorve essa mensagem de erro específica; qualquer outra lança normalmente.

## Migration Plan

Nenhuma migração de dados. Mudança só em `src/reminders/useReminderTap.ts`; sem alteração de API pública do hook.
