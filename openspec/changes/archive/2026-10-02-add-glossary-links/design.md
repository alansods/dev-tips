## Context

O conteúdo já tem `relatedTerms` validados (apontam sempre para cards `concept` do mesmo tema) e `getGlossary(theme)`. O verso dos cards é renderizado por `CardFace`. A aba Glossário usa o `PlaceholderScreen`. O progresso está no store persistido. Requisitos em `specs/glossary/spec.md`.

## Goals / Non-Goals

**Goals:** uma gaveta reutilizável (sessão e aba Glossário) e busca como função pura testável.

**Non-Goals:** links no meio do texto e animações elaboradas na gaveta.

## Decisions

### 1. Gaveta com `Modal` do React Native
`TermSheet` usa `<Modal transparent animationType="slide">`, que funciona no iOS, no Android e na web.
- Estrutura: um `Pressable` de fundo (rótulo "Fechar definição") e o painel inferior com o nome do termo (`accessibilityRole="header"`), a definição, os chips relacionados e o botão "Fechar".
- O termo exibido fica num estado (`termId | null`) mantido por quem abre a gaveta. Os chips internos só trocam esse estado, então navegar entre termos não empilha gavetas.
- *Alternativa:* `@gorhom/bottom-sheet`. Descartada porque exige Reanimated e Gesture Handler, o que é dependência demais para uma gaveta simples.

### 2. Onde os chips aparecem
- `CardFace` recebe a prop opcional `onOpenTerm(termId)`. Quando ela existe e o lado é `back`, renderiza `TermChips` no fim do verso, para todos os tipos.
- Os nomes dos termos vêm de um mapa `termId → ConceptCard` construído com `getGlossary(theme)`. Ids sem concept correspondente são ignorados, mas não deveriam acontecer, porque o gate do conteúdo impede.
- A sessão guarda `openTerm` em estado local e renderiza o `TermSheet`. A sessão do reducer não muda, então o card continua no verso.

### 3. Busca pura em `src/glossary/search.ts`
- `normalize(s)`: NFD, remove diacríticos e passa para minúsculas.
- `searchTerms(entries, query)`: filtra por `term`, `definition` e `aliases`. Com consulta vazia, devolve tudo na ordem original.
- A aba Glossário monta as entradas a partir de `catalog` (tema + concept) e filtra com essa função.

### 4. Aba Glossário
- `TextInput` com `accessibilityLabel="Buscar termo"`, contagem "N termo(s)", lista de itens (`Pressable` com o nome do termo como rótulo acessível), selo de status vindo do store (`progressKey(themeId, conceptId)`) e o `TermSheet` compartilhado.
- O `PlaceholderScreen` é removido, porque não tem mais uso.

## Risks / Trade-offs

- [`Modal` em testes do RNTL] → Ele renderiza normalmente no ambiente `jest-expo`. Os testes verificam a abertura pelo texto da definição e o fechamento pela ausência dele.
- [Lista longa em temas futuros] → Com dezenas de termos, uma `ScrollView` simples basta. Se passar de algumas centenas, trocar por `FlatList`.
