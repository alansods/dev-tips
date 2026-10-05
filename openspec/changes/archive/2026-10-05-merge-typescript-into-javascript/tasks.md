## 1. Testes

- [x] 1.1 Testes falhando em `src/content/__tests__/typescript-tracks.test.ts`: trilhas de TS com linguagem `javascript` (Angular e NestJS como frameworks de `javascript`) e cadastro sem a linguagem `typescript`
- [x] 1.2 Testes de tela falhando em `src/__tests__/typescript-navigation.test.tsx`: TypeScript dentro de JavaScript no Frontend e no Backend, rota antiga `/area/*/typescript` com "Linguagem não encontrada." e a trilha em inglês em Frontend › JavaScript
- [x] 1.3 Testes de tela falhando em `src/__tests__/javascript-navigation.test.tsx`: Frontend e Backend › JavaScript com as trilhas de TS e Angular/NestJS, e a área Frontend com "JavaScript" e "9 trilhas", sem "TypeScript"

## 2. Dados

- [x] 2.1 `content/taxonomy.json`: remover a linguagem `typescript` e passar `angular` e `nest` para `javascript`
- [x] 2.2 Campo `language` do topo para `javascript` em `typescript-essencial`, `typescript-avancado`, `angular` e `nestjs` (os snippets continuam `ts`)
- [x] 2.3 Testes do item 1 passando

## 3. Fechamento

- [x] 3.1 README: descrever TypeScript, Angular e NestJS dentro de JavaScript
- [x] 3.2 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
