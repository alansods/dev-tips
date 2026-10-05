## Why

"Tema" (o conjunto de decks de um assunto) se confunde com o tema visual claro/escuro, tanto na tela ("Temas" ao lado de "Usar tema claro") quanto no código (`content/themes/` e `Theme` ao lado de `src/theme/` e `useTheme`). Antes de organizar o catálogo em áreas e linguagens (change seguinte, `add-content-taxonomy`), o conceito precisa de um nome sem ambiguidade: **Trilha** (em inglês, *Track*).

## What Changes

- Textos exibidos: "Tema(s)" → "Trilha(s)" em PT-BR e "Topic(s)" → "Track(s)" em inglês (aba, títulos, mensagens de erro, "Voltar à trilha", "% da trilha dominada", confirmação de zerar etc.). Os textos do tema visual ("Usar tema claro/escuro") não mudam.
- Conteúdo: `content/themes/<id>/theme.json` → `content/tracks/<id>/track.json` (com `translations/`). Os ids das trilhas não mudam.
- **BREAKING (API)**: no corpo e na resposta de `/sync`, o campo `themeId` passa a ser `trackId`. A coluna `theme_id` do banco passa a ser `track_id`. O banco de teste é resetado, sem migração de dados. Como o app ainda não foi publicado, não há clientes antigos a manter.
- O progresso local continua válido: as chaves salvas usam o id da trilha (`crud-4-frameworks:cors`), que não muda.
- Specs: todo requisito que fala de "tema" como conteúdo passa a falar de "trilha". Os cenários continuam os mesmos.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `content-model`: vocabulário trilha e caminho `content/tracks/<track-id>/track.json`.
- `crud-theme-content`: a trilha CRUD fica em `content/tracks/crud-4-frameworks/track.json`.
- `web-fundamentals-content`: a trilha Fundamentos web fica em `content/tracks/fundamentos-web/track.json`.
- `app-shell`: aba "Trilhas" e catálogo de trilhas.
- `study-flow`: tela da trilha e textos da sessão e do resumo.
- `progress`: progresso e "Zerar" por trilha.
- `spaced-repetition`: revisão de hoje na tela da trilha.
- `glossary`: termos agrupados por trilha.
- `localization`: textos em inglês "Tracks" e "Back to track".
- `sync`: campo `trackId` no protocolo de sincronização.
- `auth`: textos que citam trilhas.
- `reminders`: textos que citam trilhas.

## Impact

- `src/content/*` (schema, catálogo, tradução, glossário, integridade, scan das pastas, fixtures e testes).
- Rotas `src/app/theme/[themeId]`, `study/[themeId]/[deckId]` e `review/[themeId]`, que passam a usar `track` e `[trackId]`.
- `src/study/*` (store, rules, srs), `src/sync/*`, `src/i18n/pt-BR.ts` e `en.ts`.
- `api/migrations/0002_sync.sql`, `api/src/db/sync.ts`, `api/src/routes/sync.ts` e os testes da API. Exige resetar os bancos D1 local e de teste.
- Sem novas dependências.

## Fora de escopo

- Áreas, linguagens, frameworks, Comparativos e nível por card: ficam para a change `add-content-taxonomy`.
- Renomear a pasta da capability `crud-theme-content`: o OpenSpec não renomeia capabilities por delta, então o nome continua igual. É um identificador interno e não aparece para o usuário.
- O tema visual (`src/theme/`, `useTheme`, `themeToggle`): continua com esse nome, que passa a ser o único significado de "theme".
- Mudar ids de trilhas ou o formato da chave de progresso salva no aparelho.
