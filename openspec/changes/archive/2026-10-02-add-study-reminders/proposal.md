## Why

A repetição espaçada só funciona se o usuário volta no dia em que os cards vencem, mas hoje o app só mostra "N para revisar hoje" para quem já o abriu. Sem um lembrete, as revisões se acumulam e o hábito de estudo some. Um lembrete diário, opcional e que não insiste, traz o usuário de volta na hora certa.

## What Changes

- Nova seção **Lembretes** na tela Ajustes (criada pela change `add-language-selection`), com o interruptor "Lembrete diário" (desligado por padrão) e a escolha do horário entre Manhã (08:00), Almoço (12:30) e Noite (20:00). O padrão é Noite.
- A permissão de notificação só é pedida quando o usuário liga o lembrete. Se for negada, o lembrete continua desligado e o app oferece abrir os ajustes do aparelho.
- Uma notificação por dia, no horário escolhido, com o texto do dia:
  - com cards para revisar naquele dia: **"Revisão do dia: N cards esperando por você"**;
  - sem cards para revisar: **"5 minutos de estudo? Continue de onde parou."**
- Sem notificação no dia em que o usuário já respondeu algum card.
- Tocar na notificação abre o tema com mais cards para revisar ou, se não houver revisão, a aba Temas.
- As notificações são locais, agendadas no próprio aparelho, sem servidor. Na web a seção não aparece.
- Os textos das notificações seguem o idioma do app (PT-BR ou inglês).
- Nova dependência: `expo-notifications`, com o plugin no `app.json`.

## Capabilities

### New Capabilities

- `reminders`: lembrete diário opcional por notificação local, com texto de revisão ou de prática, permissão sob demanda, horário configurável e navegação ao tocar.

### Modified Capabilities

_Nenhuma._ A tela Ajustes ganha uma seção nova, descrita na capability `reminders`.

## Impact

- Código novo em `src/reminders/` (planejamento puro, adaptador de notificações, store de configurações).
- `src/app/settings.tsx`: seção Lembretes.
- **Depende de `add-language-selection`**, que cria a tela Ajustes e os dicionários de texto. Esta change deve ser aplicada depois dela.
- `src/app/_layout.tsx`: reagendar ao abrir e ao ir para segundo plano; tratar o toque na notificação.
- `src/study/store.ts`: guardar o último dia em que o usuário respondeu um card, compatível com os dados já salvos.
- `app.json`: plugin `expo-notifications`. Notificações locais funcionam no Expo Go; build de produção via EAS como hoje.

## Fora de escopo

- Notificações push, servidor ou sincronização entre aparelhos.
- Horário livre (só os três horários fixos), vários lembretes por dia e escolha dos dias da semana.
- Badge no ícone do app, sequência de dias (streak) e textos com nome do tema ou do deck.
- Lembretes na web.
