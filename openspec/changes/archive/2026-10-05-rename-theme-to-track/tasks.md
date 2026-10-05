## 1. Conteúdo e modelo

- [x] 1.1 Testes falhando: ajustar os testes de `src/content/__tests__` (catálogo, scan das pastas, gate do repositório, tradução) para `content/tracks/<id>/track.json`, `trackSchema`/`Track` e `getTrack`
- [x] 1.2 `git mv content/themes content/tracks` e `theme.json` → `track.json` em cada trilha; renomear `src/content/node/scanThemes.ts` → `scanTracks.ts` e `__fixtures__/themes.ts` → `tracks.ts`
- [x] 1.3 Renomear em `src/content/*` (schema, catalog, translation, translations, glossary, integrity, validate, useCatalog, index) e nos testes `crud-theme.test.ts`/`web-theme.test.ts`/`scan-themes.test.ts` → `crud-track`/`web-track`/`scan-tracks`
- [x] 1.4 Testes de conteúdo passando

## 2. Estudo, rotas e textos

- [x] 2.1 Testes falhando: textos novos ("Trilhas", "Trilha não encontrada", "Voltar à trilha", "Tracks", "Back to track"…) e rotas `/track/[trackId]`, `/study/[trackId]/[deckId]` e `/review/[trackId]` em `src/__tests__/study-flow.test.tsx`, nos testes de i18n e nos testes de estudo
- [x] 2.2 Renomear em `src/study/*` (`trackStats`, `resetTrack`, `withoutTrack`, parâmetros `trackId`), mantendo `STUDY_STORAGE_KEY`, a versão do store e o formato da chave
- [x] 2.3 `git mv` das rotas `src/app/theme/[themeId].tsx`, `study/[themeId]` e `review/[themeId]` para `track`/`[trackId]`; ajustar `router.push`/`Link` e `useLocalSearchParams` (conferir a doc do Expo Router do SDK 57)
- [x] 2.4 i18n `pt-BR.ts` e `en.ts`: chaves `tabs.tracks`, `track.*`, `trackNotFound`, `backToTrack`, textos com concordância ("a trilha", "% da trilha dominada", "Zerar o progresso desta trilha?"), com `themeToggle` intacto; renomear `HomeScreen`/`ThemeCard` → `TrackCard` e os usos em glossário, progresso, ajustes e lembretes
- [x] 2.5 Testes de estudo, rotas e textos passando

## 3. Sincronização (app e API)

- [x] 3.1 Testes falhando: `trackId` nos testes do app (`src/sync/__tests__`) e da API (`api/test/sync.test.ts`)
- [x] 3.2 App: `src/sync/cards.ts` (`splitKey` devolve `trackId`), `engine.ts` e o cliente da API
- [x] 3.3 API: migration `api/migrations/0003_rename_theme_to_track.sql` (`ALTER TABLE card_progress RENAME COLUMN theme_id TO track_id`); `src/db/sync.ts` e `src/routes/sync.ts` com `trackId`/`track_id`
- [x] 3.4 Testes passando em `api/` (`npm test`, `npm run typecheck`) e no app

## 4. Fechamento

- [x] 4.1 README: "theme" → "track" (Pick a **track**…)
- [x] 4.2 Conferir com `grep -rni "theme" src content api/src api/test` que só restam o tema visual (`src/theme/`, `useTheme`, `ThemeProvider`, `themeToggle`, `ThemeToggle`)
- [x] 4.3 Depois do archive: ajustar a seção Purpose das specs principais que citam "tema" como conteúdo (o delta não alcança Purpose)
- [ ] 4.4 Aplicar a 0003 no D1 local e, com confirmação do usuário, no remoto (`npm run db:migrate`) e fazer deploy da API — local aplicada; remoto e deploy pendentes, a rodar pelo usuário (bloqueado pela permissão de produção do agente)
- [x] 4.5 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
