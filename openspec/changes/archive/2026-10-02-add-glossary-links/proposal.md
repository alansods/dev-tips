## Why

O conteúdo já liga cada passo, endpoint e conceito aos termos do glossário (`relatedTerms`), mas o app não mostra essas ligações, e a aba Glossário ainda é provisória. No material original, "toda palavra sublinhada pode ser clicada para ver o que significa". É o que conecta o código aos conceitos que caem em entrevista.

## What Changes

- **Termos relacionados no verso dos cards:** uma seção "Termos relacionados" com um chip por termo. A frente não mostra, para não entregar a resposta.
- **Gaveta de definição:** tocar num chip abre uma gaveta inferior com o termo e a definição, e os chips dos termos relacionados àquele termo, para navegar entre eles. Fecha pelo botão "Fechar" ou tocando fora. A sessão continua exatamente onde estava.
- **Aba Glossário de verdade:**
  - lista todos os termos dos temas, com contagem;
  - selo "sei" ou "revisar" quando o card do termo já foi respondido;
  - busca por termo, definição ou outros nomes, sem diferenciar maiúsculas e acentos;
  - mensagem quando nenhum termo é encontrado;
  - tocar num termo abre a mesma gaveta.
- Remove o requisito de telas provisórias da `app-shell` e o componente `PlaceholderScreen`.

## Capabilities

### New Capabilities
- `glossary`: termos relacionados nos cards, gaveta de definição, aba Glossário e busca.

### Modified Capabilities
- `app-shell`: o requisito "Telas provisórias" sai (REMOVED), porque nenhuma aba é mais provisória.

## Impact

- **Novos componentes:** `TermChips`, `TermSheet` (Modal do React Native) e a função pura de busca em `src/glossary/`.
- **Telas alteradas:** `CardFace` (verso) e `src/app/(tabs)/glossary.tsx`.
- Nenhuma dependência nova.

## Fora de escopo

- Termos clicáveis dentro do texto corrido (sublinhado no meio da frase). Por enquanto, as ligações aparecem como chips.
- Estudar a partir do glossário, por exemplo um botão "estudar este termo".
- Glossário compartilhado entre temas: cada tema mantém seus termos.
