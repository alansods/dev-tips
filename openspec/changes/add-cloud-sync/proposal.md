## Why

Com o login (`add-auth`), falta o motivo principal da conta: o progresso continuar ao trocar de celular, reinstalar o app ou estudar em dois aparelhos. O app continua funcionando offline; a nuvem guarda uma cópia e junta as mudanças de cada aparelho.

## What Changes

- **API:** `PUT /sync` recebe as mudanças do aparelho e `GET /sync?since=` devolve as mudanças da conta desde a última sincronização. Conflitos se resolvem por "a mudança mais recente vence", card a card.
- **O que sincroniza:** a resposta e o agendamento de revisão de cada card, o idioma e o framework preferido de cada tema. Os lembretes e o último dia de estudo continuam por aparelho.
- **App:**
  - fila de mudanças salva no aparelho e enviada quando houver conexão;
  - sincroniza ao abrir o app, ao voltar para ele, pouco depois de responder cards e ao reconectar;
  - no primeiro login, o progresso do aparelho é juntado ao da conta, com a mensagem "Seu progresso foi salvo na conta.";
  - estado da sincronização na tela Conta e na linha da conta em Ajustes;
  - aviso discreto "Offline. Seu progresso será enviado depois." quando houver conta e não houver conexão;
  - "Zerar progresso" de um tema também zera na conta.

## Capabilities

### New Capabilities

- `sync`: sincronização do progresso e das preferências entre o aparelho e a conta.

### Modified Capabilities

_Nenhuma._ Os requisitos de `progress`, `spaced-repetition` e `localization` continuam valendo no aparelho; a cópia na conta é descrita em `sync`.

## Impact

- API: `api/migrations/0002_sync.sql` (`card_progress`, `user_settings`), `api/src/routes/sync.ts`, `api/src/sync/` (merge) e `api/src/db/sync.ts`.
- App: `src/sync/` (fila, merge, agendamento das sincronizações, estado), ganchos em `src/study/store.ts` e `src/i18n/store.ts`, aviso de offline nas abas, estado na tela Conta. Nova dependência para saber se há conexão (`expo-network`).

## Fora de escopo

- Sincronização em tempo real entre aparelhos abertos ao mesmo tempo (a cópia chega na próxima sincronização).
- Sincronizar lembretes e o último dia de estudo.
- Histórico de respostas ou estatísticas no servidor.
- Resolver conflitos com interface ("qual versão manter?"): vence sempre a mais recente.
