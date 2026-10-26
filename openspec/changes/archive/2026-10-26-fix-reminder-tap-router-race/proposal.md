# Proposal

## Why

Ao tocar numa notificação de lembrete, o app deve navegar para a trilha com mais cards a revisar (ou para o Início). Hoje, essa navegação pode falhar silenciosamente/lançar erro numa janela de corrida: o hook que trata o toque roda num `useEffect` que, numa passagem de reconexão de efeitos do React, pode executar antes do roteador do expo-router estar religado, e `router.navigate` lança `"The imperative router is unavailable before the first render has finished."` em vez de navegar. Isso foi exposto ao atualizar para o Expo SDK 58 (React 19.3), mas é uma fragilidade da implementação, não um comportamento novo desejado — o app nunca deveria perder a navegação por essa corrida.

## What Changes

- `useReminderTapNavigation` (`src/reminders/useReminderTap.ts`) passa a tentar a navegação de novo, em vez de deixar a exceção do roteador ainda não religado propagar e a navegação se perder.
- Nenhuma mudança no destino da navegação (trilha com mais cards, ou Início): só a confiabilidade de chegar lá.

## Capabilities

### Modified Capabilities
- `reminders`: o Requirement "Abrir pela notificação" passa a cobrir explicitamente o caso em que o roteador ainda não está pronto no momento do toque.

## Impact

- Código: `src/reminders/useReminderTap.ts`.
- Testes: `src/__tests__/reminders.test.tsx` (cenários "Toque com revisão pendente" e "Toque sem revisão", que hoje falham de forma intermitente por essa corrida).

## Fora de escopo

- Qualquer mudança no destino da navegação ou nas regras de quais cards contam para "revisão pendente" (já cobertas por outros requisitos da spec `reminders`).
- Mudanças no expo-router ou em como ele religa o roteador imperativo.
