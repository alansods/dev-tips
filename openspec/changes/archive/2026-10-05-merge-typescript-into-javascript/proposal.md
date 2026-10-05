## Why

Hoje TypeScript aparece no app como uma linguagem separada de JavaScript, com as próprias telas Frontend › TypeScript e Backend › TypeScript. Mas TypeScript é um superconjunto de JavaScript, e os frameworks do ecossistema (React, Angular, NestJS, Express…) são usados tanto com JS quanto com TS. Separar os dois espalha o mesmo ecossistema em duas telas e obriga o usuário a adivinhar onde está cada framework (Angular em "TypeScript", React em "JavaScript").

## What Changes

- O cadastro de linguagens (`content/taxonomy.json`) deixa de ter a linguagem `typescript`.
- As trilhas `typescript-essencial` e `typescript-avancado` passam para a linguagem `javascript`, sem framework, e aparecem em "Linguagem pura" junto com as trilhas de JavaScript.
- Os frameworks Angular e NestJS passam a pertencer à linguagem `javascript`. Na tela da linguagem, todos os frameworks de JS/TS aparecem juntos na seção "Frameworks".
- A linguagem continua com o nome "JavaScript" e o id `javascript`, então as rotas `/area/<área>/javascript` não mudam.
- **BREAKING (navegação)**: as rotas `/area/frontend/typescript` e `/area/backend/typescript` passam a mostrar "Linguagem não encontrada.". Os ids das trilhas não mudam, então o progresso salvo continua valendo.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `typescript-content`: as trilhas de TypeScript passam para a linguagem `javascript`. Os cenários de navegação e tradução passam a usar Frontend/Backend › JavaScript, e entra a regra de que o cadastro não tem a linguagem TypeScript.
- `javascript-content`: as telas Frontend › JavaScript e Backend › JavaScript passam a listar também as trilhas de TypeScript em "Linguagem pura" e Angular e NestJS em "Frameworks".

## Impact

- Dados: `content/taxonomy.json` e o campo `language` dos `track.json` de `typescript-essencial`, `typescript-avancado`, `angular` e `nestjs`.
- Testes: `src/content/__tests__/typescript-tracks.test.ts`, `src/__tests__/typescript-navigation.test.tsx` e `src/__tests__/javascript-navigation.test.tsx`.
- Sem mudança no código de navegação (`src/content/navigation.ts`) nem nas telas. A regra da capability `catalog-navigation` continua a mesma.
- Sem impacto na API nem no progresso salvo.

## Fora de escopo

- Juntar as specs `typescript-content` e `javascript-content` numa só.
- Mudar o conteúdo, os decks, os ids ou os títulos das trilhas de TypeScript.
- Mudar a linguagem dos snippets: os cards de TS continuam com `ts`.
- Redirecionar as rotas antigas `/area/*/typescript`.
- Renomear a linguagem exibida (continua "JavaScript").
