## Why

Segunda das cinco changes de conteúdo aprovadas. Ela cobre TypeScript, que aparece no frontend e no backend, e os frameworks escritos em TypeScript: Angular e NestJS.

## What Changes

- 4 trilhas novas, com 24 cards cada (96 no total), em PT-BR e com tradução completa para inglês:
  - **Linguagem pura (TypeScript):** TypeScript essencial e TypeScript avançado (Frontend e Backend).
  - **Frameworks:** Angular (Frontend) e NestJS (Backend).
- O formato é o mesmo das trilhas de JavaScript: 3 decks de conteúdo (`concept` e `code`) e "Perguntas de entrevista". Todo card tem nível e termos relacionados, e cada trilha tem pelo menos um card de cada nível.

## Capabilities

### New Capabilities

- `typescript-content`: as 4 trilhas de TypeScript, com identidade, posição na navegação, decks e contagens, conteúdo autoral, ligação com o glossário, mistura de níveis e tradução.

### Modified Capabilities

Nenhuma. O cadastro já tem Angular e NestJS, e o formato e a navegação já cobrem essas trilhas.

## Impact

- `content/tracks/<id>/track.json` e `translations/en.json` para as 4 trilhas.
- Registro em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes em `src/content/__tests__/typescript-tracks.test.ts` e `src/__tests__/typescript-navigation.test.tsx`.
- Sem mudança de código de tela, API ou dados salvos.

## Fora de escopo

- As trilhas de Java, Python e Banco de dados, cada uma na sua change.
- Configuração de projetos e de build (Vite, webpack) além do `tsconfig`.
