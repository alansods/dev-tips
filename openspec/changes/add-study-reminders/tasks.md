## 1. Preparação

- [ ] 1.0 Confirmar que `add-language-selection` já foi aplicada (tela Ajustes e `useT` existem)
- [ ] 1.1 Conferir a doc do SDK 57 (`https://docs.expo.dev/versions/v57.0.0/sdk/notifications/`) para triggers `DATE`, canal Android e resposta ao toque
- [ ] 1.2 `npx expo install expo-notifications`, adicionar o plugin no `app.json` e o mock do módulo no setup do Jest

## 2. Último dia de estudo (Configuração salva no aparelho)

- [ ] 2.1 Teste falhando em `src/study/__tests__/store.test.ts`: `answer()` grava `lastStudyDay`, e dados salvos sem esse campo continuam válidos
- [ ] 2.2 Adicionar `lastStudyDay` ao store de estudo (campo opcional no schema, sem mudar a versão)
- [ ] 2.3 Testes passando

## 3. Planejamento puro (Uma notificação por dia, Não insistir)

- [ ] 3.1 Testes falhando em `src/reminders/__tests__/plan.test.ts` para todos os cenários (incluindo o texto em inglês) de "Uma notificação por dia com texto do dia" e "Não insistir no dia estudado"
- [ ] 3.2 Implementar `planReminders` em `src/reminders/plan.ts`, reaproveitando `dueCardIds` e `addDays`
- [ ] 3.3 Testes passando

## 4. Destino do toque (Abrir pela notificação)

- [ ] 4.1 Testes falhando para `reminderTarget` (tema com mais cards para revisar, empate pela ordem do catálogo, `/` sem revisão)
- [ ] 4.2 Implementar `reminderTarget` em `src/reminders/plan.ts`
- [ ] 4.3 Testes passando

## 5. Store de configurações (Configuração salva no aparelho)

- [ ] 5.1 Testes falhando: padrão desligado às 20:00, configuração restaurada e dados inválidos viram o padrão
- [ ] 5.2 Implementar `src/reminders/store.ts` com Zod e `safeStorage`
- [ ] 5.3 Testes passando

## 6. Adaptador e reagendamento (Permissão sob demanda, Reagendamento)

- [ ] 6.1 Implementar `src/reminders/notifications.ts` (`ensurePermission`, `ensureAndroidChannel`, `replaceAll`, `cancelAll`; sem efeito na web)
- [ ] 6.2 Testes falhando para `useReminderSync`: reagenda ao montar, ao ir para segundo plano, ao trocar o horário e ao trocar o idioma; cancela ao desligar; não pede permissão ao abrir
- [ ] 6.3 Implementar `useReminderSync` e montar no `src/app/_layout.tsx`
- [ ] 6.4 Testes passando

## 7. Seção Lembretes na tela Ajustes

- [ ] 7.1 Testes falhando em `src/__tests__/reminders.test.tsx`: estado inicial, horário só com o lembrete ligado, permissão concedida e negada (mensagem e "Abrir ajustes"), seção oculta na web
- [ ] 7.2 Implementar a seção em `src/app/settings.tsx`, com os textos nos dicionários `src/i18n/` (o componente pode ficar em `src/reminders/RemindersSection.tsx`)
- [ ] 7.3 Testes passando

## 8. Toque na notificação

- [ ] 8.1 Teste falhando: a resposta da notificação navega para o destino de `reminderTarget`, com o app aberto e com o app aberto a frio
- [ ] 8.2 Tratar a resposta em `src/app/_layout.tsx`
- [ ] 8.3 Teste passando

## 9. Verificação

- [ ] 9.1 Testar no aparelho com Expo Go: ligar, conceder permissão, agendar para daqui a 1 minuto (só em desenvolvimento) e tocar na notificação
- [ ] 9.2 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`
