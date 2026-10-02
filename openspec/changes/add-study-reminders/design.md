## Context

O app é offline e sem backend. O agendamento de revisão (`src/study/srs.ts`) é determinístico: cada card tem `due` (YYYY-MM-DD), e `dueCardIds(theme, schedule, day)` já responde quais cards vencem até um dia qualquer. Datas usam `today()`/`addDays()` de `src/study/clock.ts`. Estado persistido com Zustand + AsyncStorage via `safeStorage` (`src/study/store.ts`). Expo SDK 57: `expo-notifications` agenda notificações locais (funcionam no Expo Go; push não), com trigger `DATE`. Android exige canal; web não é suportada.

## Goals / Non-Goals

**Goals:**
- Texto de cada notificação correto para o dia, sem rodar código em segundo plano.
- Lógica de decisão testável sem o módulo nativo.

**Non-Goals:**
- Tarefas em segundo plano (`expo-background-task`) para recalcular textos.

## Decisions

- **7 notificações `DATE` em vez de uma `DAILY` repetida.** Uma notificação repetida tem texto fixo. Como os vencimentos futuros já são conhecidos, agendar 7 dias com texto calculado dá o texto certo sem tarefa em segundo plano. Sete dias cobrem quem fica uma semana sem abrir o app; depois disso não chegam mais lembretes, o que é aceitável. Alternativa descartada: tarefa em segundo plano, que não é confiável no iOS e complica o projeto.
- **Função pura `planReminders`** em `src/reminders/plan.ts`: recebe `{ catalog, schedule, lastStudyDay, time, now, messages }` (`messages` é o dicionário do idioma atual, de `src/i18n/`) e devolve `{ date: Date, title, body }[]`. Ela cobre os cenários de texto, horário passado, singular/plural e o dia já estudado. Usa `dueCardIds` somando os temas.
- **Adaptador fino** `src/reminders/notifications.ts`: `ensurePermission()`, `ensureAndroidChannel()`, `replaceAll(plans)` (cancela todas e agenda) e `cancelAll()`. É o único arquivo que importa `expo-notifications` e é mockado no Jest. Na web, o adaptador não faz nada e a tela Ajustes esconde a seção (`Platform.OS === 'web'`).
- **Destino do toque calculado na hora do toque**, não no agendamento: o listener (`addNotificationResponseReceivedListener` e `getLastNotificationResponse` para o app aberto a frio) chama `reminderTarget(catalog, schedule, today())`, função pura que devolve `/theme/<id>` ou `/`. Assim o destino reflete o estado atual mesmo dias depois.
- **Store separado** `src/reminders/store.ts` (`dev-tips:reminders`, `{ enabled, time: '08:00' | '12:30' | '20:00' }`), com validação Zod e o mesmo `safeStorage`, para não mudar a versão do store de estudo por causa de configurações.
- **`lastStudyDay` no store de estudo**, atualizado em `answer()`. O campo é opcional no `savedSchema` com default `null`, então os dados v2 continuam válidos sem subir a versão.
- **Gatilhos de reagendamento** num hook `useReminderSync()` montado no `_layout.tsx` raiz: na montagem, em `AppState` → `background`/`inactive`, e quando `enabled`, `time` ou o idioma mudam. Não reagenda a cada resposta, para não fazer chamadas nativas repetidas no meio da sessão.

## Risks / Trade-offs

- [O usuário responde cards e o app é encerrado à força antes de ir para segundo plano] → o texto de amanhã fica desatualizado até a próxima abertura. Aceitável: o lembrete continua útil.
- [O usuário fica mais de 7 dias sem abrir o app] → os lembretes acabam. Mitigação possível no futuro: uma 8ª notificação "Sentimos sua falta" ou um gatilho `DAILY` de reserva. Fica fora do MVP.
- [Mudança de fuso ou de horário de verão] → as datas são montadas com `new Date(y, m, d, h, min)` no fuso local no momento do agendamento, e o reagendamento ao abrir corrige o que mudar.
- [Permissão revogada nos ajustes com o lembrete ligado] → na abertura, se a permissão não está concedida, o app desliga o lembrete e mostra a mensagem de ajustes.
- [Limite do iOS de 64 notificações locais] → usamos só 7.

## Migration Plan

Instalar com `npx expo install expo-notifications` e adicionar o plugin no `app.json`. Não há migração de dados: `lastStudyDay` tem default e o store de lembretes é novo. Rollback: remover a seção e chamar `cancelAll()` numa versão seguinte.
