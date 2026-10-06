## MODIFIED Requirements

### Requirement: Trilhas de JavaScript no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem depois das trilhas já existentes, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Áreas | Linguagem | Framework |
|---|---|---|---|---|
| `javascript-essencial` | JavaScript essencial | frontend, backend | javascript | — |
| `javascript-assincrono` | JavaScript assíncrono | frontend, backend | javascript | — |
| `javascript-no-navegador` | JavaScript no navegador | frontend | javascript | — |
| `nodejs` | Node.js | backend | javascript | — |
| `react` | React | frontend | javascript | react |
| `vue` | Vue | frontend | javascript | vue |
| `nextjs` | Next.js | frontend | javascript | nextjs |
| `express` | Express | backend | javascript | express |

O cadastro de linguagens e frameworks SHALL ter React, Vue, Next.js e Express na linguagem `javascript`. A linguagem `javascript` SHALL reunir também as trilhas de TypeScript e os frameworks Angular e NestJS (capability `typescript-content`) e a trilha "Estado e dados no React" (capability `react-state-content`), de modo que a tela da linguagem mostre juntos, sem separar JS de TS, a linguagem pura e todos os frameworks do ecossistema.

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 8 trilhas, nessa ordem, depois de `crud-4-frameworks` e `fundamentos-web`, com as áreas, a linguagem e o framework da tabela

#### Scenario: JavaScript no Frontend
- **WHEN** o usuário abre Frontend › JavaScript
- **THEN** "Linguagem pura" mostra JavaScript essencial, JavaScript assíncrono, JavaScript no navegador, TypeScript essencial e TypeScript avançado, e "Frameworks" mostra React, Vue, Next.js e Angular, com "2 trilhas" em React e "1 trilha" nos demais

#### Scenario: JavaScript no Backend
- **WHEN** o usuário abre Backend › JavaScript
- **THEN** "Linguagem pura" mostra JavaScript essencial, JavaScript assíncrono, Node.js, TypeScript essencial e TypeScript avançado, e "Frameworks" mostra Express e NestJS

#### Scenario: Contagem na tela da área
- **WHEN** o usuário abre a área Frontend
- **THEN** a seção "Linguagens" mostra "JavaScript" com "10 trilhas" e não mostra "TypeScript"
