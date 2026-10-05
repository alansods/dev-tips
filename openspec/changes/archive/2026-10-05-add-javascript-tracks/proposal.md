## Why

As telas de linguagem e framework existem, mas estão vazias: o catálogo só tem Fundamentos web e o CRUD comparativo. Esta é a primeira de cinco changes de conteúdo aprovadas (JavaScript, TypeScript, Java, Python e Banco de dados) e cobre JavaScript, a linguagem que aparece no frontend e no backend.

## What Changes

- 8 trilhas novas, com 24 cards cada (192 no total), em PT-BR e com tradução completa para inglês:
  - **Linguagem pura (JavaScript):**
    - JavaScript essencial e JavaScript assíncrono (Frontend e Backend);
    - JavaScript no navegador (Frontend);
    - Node.js (Backend).
  - **Frameworks:**
    - React, Vue e Next.js (Frontend);
    - Express (Backend).
- Cada trilha tem 4 decks: três de conteúdo (cards `concept` e `code`) e "Perguntas de entrevista" (cards `question`). Todo card tem nível e termos relacionados, e cada trilha tem pelo menos um card de cada nível.
- O cadastro de linguagens e frameworks passa a ter Vue, Next.js (JavaScript), Angular (TypeScript) e Django (Python), já preparando as próximas changes. React passa de TypeScript para JavaScript.

## Capabilities

### New Capabilities

- `javascript-content`: as 8 trilhas de JavaScript, com identidade, posição na navegação, decks e contagens, conteúdo autoral, ligação com o glossário, mistura de níveis e tradução.

### Modified Capabilities

- `glossary`: os cenários de "Lista completa" e "Buscar pelo nome" passam a dizer o catálogo a que se referem (só CRUD e Fundamentos web), já que as contagens mudam a cada trilha nova. O comportamento não muda.

## Impact

- `content/tracks/<id>/track.json` e `translations/en.json` para as 8 trilhas.
- `content/taxonomy.json`.
- Registro em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes de conteúdo em `src/content/__tests__/javascript-tracks.test.ts`.
- Sem mudança de código de tela, API ou dados salvos.

## Fora de escopo

- As trilhas de TypeScript, Java, Python e Banco de dados, cada uma na sua change.
- Trilhas comparativas novas.
- Conteúdo interativo (exercícios, quizzes) e realce de sintaxe.
