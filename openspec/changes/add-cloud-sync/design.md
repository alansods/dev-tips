## Context

Depende de `add-auth` (sessão, cliente da API com renovação) e de `add-api-server`. Hoje o progresso fica em `src/study/store.ts` (`progress`, `schedule`, `preferredVariant`) e o idioma em `src/i18n/store.ts`, ambos no AsyncStorage via `safeStorage`.

## Goals / Non-Goals

**Goals:**
- Offline-first de verdade: a interface nunca espera a rede.
- Nenhuma resposta perdida, mesmo com o app fechado sem conexão.

**Non-Goals:**
- Tempo real, CRDTs ou interface de resolução de conflitos.

## Decisions

- **Last-write-wins por card** com `updatedAt` gerado pelo aparelho (ms desde a época). É simples e suficiente para progresso de estudo; o risco de relógio errado é aceito. Alternativa descartada: CRDT, complexo demais para o caso.
- **Tombstone em vez de exclusão:** zerar grava o card com `result`, `box` e `due` nulos e um `updatedAt` novo. Assim a exclusão também "vence" pelas mesmas regras e chega aos outros aparelhos.
- **Tabelas (`0002_sync.sql`):** `card_progress` (user_id, theme_id, card_id, result, box, due, updated_at, server_updated_at; PK em user_id + theme_id + card_id) e `user_settings` (user_id PK, language, preferred_variant JSON, updated_at, server_updated_at). O `since` usa o `server_updated_at` (relógio do servidor), não o do aparelho, para nunca perder mudanças por diferença de relógio.
- **Upsert em lote no D1:** `INSERT … ON CONFLICT DO UPDATE … WHERE excluded.updated_at > card_progress.updated_at`, várias instruções num `db.batch()`, que é atômico.
- **App:**
  - `src/sync/queue.ts`: fila persistida, com a última versão de cada card;
  - `src/sync/engine.ts`: envia a fila, busca com `since` e aplica o resultado nos stores sem gerar novas entradas na fila;
  - `src/sync/useSync.ts`: gatilhos (abrir, voltar ao app, reconectar, 5 s depois da última resposta);
  - `src/sync/store.ts`: estado exibido (`syncing`, `lastSyncedAt`, `error`).
  Os stores de estudo e de idioma chamam a fila ao mudar.
- **Conexão com `expo-network`** (`useNetworkState`); a documentação do SDK 57 deve ser conferida na implementação.

## Risks / Trade-offs

- [Relógio do aparelho muito errado faz uma resposta velha "vencer"] → aceitável para progresso de estudo; o `since` usa o relógio do servidor.
- [Fila grande depois de muito tempo offline] → envio em lotes de até 500 cards.
- [Limites do plano grátis do D1 (100 mil gravações por dia)] → com poucos usuários, muito abaixo; a sincronização depois das respostas espera 5 s para juntar várias.
