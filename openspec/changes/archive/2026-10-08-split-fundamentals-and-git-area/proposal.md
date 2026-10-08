## Why

A trilha "Fundamentos de programação e web" mistura dois assuntos num nome longo, e o Git, que é ferramenta e não fundamento de programação, aparece dentro da área Fundamentos. O usuário pediu a área Fundamentos com duas trilhas, programação e web, e uma área própria para o Git.

## What Changes

- Nova trilha **Fundamentos de programação** (`fundamentos-de-programacao`): os 4 decks de conceitos gerais e as 6 perguntas de programação (30 cards).
- **Fundamentos web** volta ao conteúdo e ao título originais (HTTP, REST, navegador, 27 cards), com o mesmo id.
- Nova área **Git**, depois de Fundamentos; a trilha "Git e colaboração" sai de Fundamentos e vai para ela.
- As trilhas essenciais de JavaScript, Java, Python, C# e Ruby passam a ter Fundamentos de programação como pré-requisito.

## Capabilities

### New Capabilities

- `programming-fundamentals-content`: a trilha Fundamentos de programação e a regra de que as trilhas de linguagem não repetem conceitos gerais.

### Modified Capabilities

- `web-fundamentals-content`: volta ao formato original; a regra de conceitos gerais sai daqui.
- `content-model`: área `git`.
- `catalog-navigation`: área Git na ordem e nos textos; cenários com o nome de volta para "Fundamentos web".
- `git-content`: trilha na área Git.
- `home`: "Comece por aqui" sem interesse mostra Fundamentos de programação.
- `csharp-content`, `ruby-content`: pré-requisito e nome da trilha de fundamentos.
- `glossary`, `progress`, `reminders`, `spaced-repetition`, `track-icons`: cenários com o nome "Fundamentos web" de volta.

## Impact

- `content/tracks/fundamentos-de-programacao/` (nova), `fundamentos-web`, `git-e-colaboracao` e o `prerequisites` das 5 trilhas essenciais.
- `src/content/schema.ts` (`AREAS`), `src/i18n/pt-BR.ts` e `en.ts` (nome da área), `src/components/icons.tsx` (ícone da área), registro em `catalog.ts` e `translations.ts`.
- O progresso dos cards de programação, criados em 2026-10-08 dentro de `fundamentos-web`, não é migrado para a trilha nova.
