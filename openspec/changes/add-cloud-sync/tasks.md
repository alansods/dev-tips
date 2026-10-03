## 1. API

- [ ] 1.1 Migration `0002_sync.sql` (`card_progress`, `user_settings`)
- [ ] 1.2 Testes falhando: cenários de "Enviar mudanças à API" e "Buscar mudanças da API"
- [ ] 1.3 Implementar `db/sync.ts` (upsert em lote com `batch`), `sync/service.ts` e `routes/sync.ts` (protegida)
- [ ] 1.4 Testes passando e deploy

## 2. Fila e merge no app

- [ ] 2.1 Testes falhando: fila persistida (respostas sem conexão sobrevivem ao fechar o app), merge last-write-wins por card, tombstone ao zerar
- [ ] 2.2 Implementar `src/sync/queue.ts` e `src/sync/engine.ts`, e os ganchos em `src/study/store.ts` e `src/i18n/store.ts`
- [ ] 2.3 Testes passando

## 3. Quando sincronizar

- [ ] 3.1 Conferir `expo-network` no SDK 57 e instalar com `npx expo install expo-network`
- [ ] 3.2 Testes falhando: "Depois de responder", "Offline e depois online", "Sem conta", "Primeiro login" (os dois cenários) e "Zerar em um aparelho"
- [ ] 3.3 Implementar `src/sync/useSync.ts` e o merge do primeiro login com a mensagem
- [ ] 3.4 Testes passando

## 4. Estado e aviso

- [ ] 4.1 Testes falhando: "Estado da sincronização" e "Aviso de offline"
- [ ] 4.2 Implementar `src/sync/store.ts`, o estado na tela Conta e em Ajustes, e o aviso nas abas
- [ ] 4.3 Testes passando

## 5. Verificação

- [ ] 5.1 Dois aparelhos com a mesma conta: progresso indo e voltando, conflito no mesmo card, uso offline e reconexão
- [ ] 5.2 Rodar `npm test` e `npm run typecheck` em `api/`, e `npm test`, `npm run lint` e `npx tsc --noEmit` no app
