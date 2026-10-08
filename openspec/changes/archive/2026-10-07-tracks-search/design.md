## Context

A aba Trilhas (`(tabs)/tracks.tsx`) mostra os `AreaCard`. O glossário já tem `normalize` (sem acentos, minúsculas) em `src/glossary/search.ts`. O estado das trilhas vem de `trackStatus`, em `src/study/rules.ts` (change `track-path`).

## Goals / Non-Goals

**Goals:**
- Filtragem em função pura, testada sem tela.

**Non-Goals:**
- Ranquear resultados por relevância. O resultado segue a ordem do catálogo.

## Decisions

### 1. `normalize` num módulo comum
A função vai para `src/content/text.ts`. O glossário e a busca de trilhas importam de lá, para os dois não divergirem.

### 2. `filterTracks` em `src/content/search.ts`
```ts
filterTracks(tracks, taxonomy, { query, language, status }, statusOf): Track[]
```
- `statusOf(track)` vem da tela (via `trackStatus` e `trackStats`). Assim o conteúdo não depende do progresso.
- A busca junta o título, a descrição e os nomes da linguagem e do framework, e testa `includes` sobre o texto normalizado.

### 3. Estado da tela
A busca, o filtro e a linguagem ficam em `useState`, só na sessão da tela.
- Os filtros de estado são botões com `accessibilityState.selected`.
- As linguagens são botões com `selected`. Tocar na linguagem já selecionada limpa o filtro.

### 4. Duas colunas de áreas
As áreas ficam numa linha com `flexWrap`. Cada `AreaCard` ganha `style` com `width: '48%'` e mostra o ícone acima do nome, para caber em duas colunas. O conteúdo do card não muda.

## Risks / Trade-offs

- **Busca com uma letra:** traz quase tudo. → É uma lista curta (41 trilhas), sem custo.
