## Context

O motivo está em proposal.md (Why). Hoje "theme" no código quer dizer duas coisas:

- **conteúdo**: `content/themes/`, `themeSchema`/`Theme` em `src/content/schema.ts`, `getTheme`, rotas `src/app/theme/[themeId].tsx`, `study/[themeId]/[deckId].tsx` e `review/[themeId].tsx`, `themeStats`, `resetTheme`, as chaves de i18n `theme.*`, o campo `themeId` do sync e a coluna `theme_id` do D1;
- **visual**: `src/theme/` (`ThemeProvider`, `useTheme`, `tokens`) e a chave de i18n `themeToggle`.

A migration `0002_sync.sql` já foi aplicada no D1 remoto (`npm run db:migrate`), e o wrangler registra as migrations aplicadas na tabela `d1_migrations`.

## Goals / Non-Goals

**Goals:**
- Fazer "theme" significar só o tema visual em todo o repositório. O conteúdo passa a ser "track".
- Manter o comportamento idêntico: os testes atuais continuam passando com o vocabulário novo e nenhum cenário é removido.

**Non-Goals:**
- Mudar ids de trilha, o formato da chave salva no aparelho (`<trackId>:<cardId>`) ou a versão do store persistido.

## Decisions

### 1. Nome no código: `track` (e não `trail`/`path`/`topic`)
"Track" é o termo usado por plataformas de ensino em inglês (learning track) e é a tradução que o app vai exibir. Alternativas descartadas: `topic`, que é o texto em inglês de hoje mas soa como "assunto solto"; `trail`, que é tradução literal e pouco usada em inglês; e `path`, que conflita com caminhos de arquivo e de URL (`path` já é campo do card endpoint).

### 2. Renomeação mecânica guiada pelo typecheck
A ordem é: tipos e schema (`Track`, `trackSchema`) primeiro, depois `npx tsc --noEmit` para apontar todos os usos, e só então rotas, store, sync e i18n. Assim o compilador garante que nenhum uso ficou para trás. Para mover arquivos de rota e de conteúdo, `git mv`, que preserva o histórico. Alternativa descartada: um find/replace global de "theme", que pegaria também o tema visual (`useTheme`, `themeToggle`, `src/theme/`).

### 3. Chave de i18n do tema visual não muda
`themeToggle` continua com esse nome. Depois da change, ela é o único uso de "theme" em i18n, o que deixa claro que se trata do visual.

### 4. Banco: migration nova `0003_rename_theme_to_track.sql` com `ALTER TABLE card_progress RENAME COLUMN theme_id TO track_id`, em vez de editar a 0002 e resetar
Editar uma migration já aplicada não tem efeito no remoto, porque a `d1_migrations` já a marca como aplicada. Isso deixaria o esquema remoto diferente do local e do de teste. O `RENAME COLUMN` do SQLite (suportado pelo D1) atualiza junto a chave primária e o índice, preserva os dados e dispensa o reset. O usuário autorizou resetar o banco, mas não é necessário. O comentário de `preferred_variant` (JSON `{ themeId: variantId }`) é só documentação e passa a dizer `trackId` na 0003, como comentário.

### 5. Contrato `/sync`: troca direta de `themeId` por `trackId`, sem aceitar os dois
Nenhum app publicado usa a API. Aceitar os dois nomes acrescentaria código de compatibilidade sem nenhum cliente que precise dele.

## Risks / Trade-offs

- [App novo falando com uma API ainda não implantada] → A sincronização falha com `400 invalid_body` até a API nova subir. Mitigação: implantar a API (migration e deploy) antes de usar o app novo logado. Sem login, o app funciona normalmente, porque é offline-first.
- [Rotas antigas `/theme/...` salvas em algum link] → Não há deep links publicados, e o `+not-found` já cobre rotas desconhecidas.
- [Concordância de gênero nos textos ("o tema" → "a trilha")] → Os textos de i18n são revisados um a um, e os testes de tela conferem os textos exatos que as specs pedem.

## Migration Plan

1. Mesclar o PR com app e API juntos.
2. `cd api && npm run db:migrate`: aplica a `0003` no D1 remoto. Antes disso, rodar local com `wrangler d1 migrations apply dev-tips --local`.
3. `npm run deploy` na API.
4. Rollback: reverter o PR e aplicar uma migration inversa (`RENAME COLUMN track_id TO theme_id`). Não há perda de dados nas duas direções.
