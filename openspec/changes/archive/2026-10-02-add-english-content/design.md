## Context

O mecanismo já existe (ver specs `localization` e `content-model`): `translations/en.json` por tema, validado por `validateTranslation` e aplicado por `localizeTheme` campo a campo. Falta o conteúdo e uma garantia de que ele cobre o tema inteiro.

## Goals / Non-Goals

**Goals:**
- Cobertura completa e verificada por teste, para que um card novo em PT-BR sem tradução quebre a suíte.

**Non-Goals:**
- Tradução automática em tempo de execução.

## Decisions

- **`missingTranslations(theme, translation)`** em `src/content/translation.ts`: função pura que lista os caminhos de texto exibido sem tradução (`title`, `decks.<id>.title`, `cards.<id>.definition`, `cards.<id>.snippets.<variante>.note` quando o original tem nota, etc.). Ela considera só os campos que existem no original; um `description` ausente no PT-BR não é exigido em inglês. Ficam de fora `tags`, `aliases` e `values`, cuja tradução é editorial (só prosa).
- **Termo igual nos dois idiomas** (ex.: `term: "CORS"`) entra mesmo assim no arquivo de tradução: a cobertura exige a chave, e isso deixa explícito que o termo foi revisado.
- **Tradução feita a partir do `theme.json`**, não do `content/sources/`, para bater campo a campo com o que o app exibe.

## Risks / Trade-offs

- [Tradução sem revisão de falante nativo] → texto fiel e direto; ajustes futuros só mexem no JSON.
- [O `theme.json` muda e a tradução fica para trás] → o teste de cobertura e a validação de ids falham e apontam o caminho.
