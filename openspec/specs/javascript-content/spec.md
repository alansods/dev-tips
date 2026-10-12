# javascript-content Specification

## Purpose
Define as trilhas de JavaScript (linguagem pura e frameworks de frontend e backend): onde cada uma aparece na navegação, como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
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

O cadastro de linguagens e frameworks SHALL ter React, Vue, Next.js e Express na linguagem `javascript`. A linguagem `javascript` SHALL reunir também as trilhas de TypeScript e os frameworks Angular e NestJS (capability `typescript-content`) e as trilhas "Estado e dados no React" (capability `react-state-content`) "Testes no frontend" (capability `frontend-testing-content`) "Estilização e design system" (capability `styling-design-system-content`) "Build e bundlers" (capability `build-tooling-content`) "Performance no Next.js" (capability `nextjs-performance-content`) e "Next.js no backend" (capability `nextjs-backend-content`), de modo que a tela da linguagem mostre juntos, sem separar JS de TS, a linguagem pura e todos os frameworks do ecossistema.

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 8 trilhas, nessa ordem, depois de `crud-4-frameworks` e `fundamentos-web`, com as áreas, a linguagem e o framework da tabela

#### Scenario: JavaScript no Frontend
- **WHEN** o usuário abre Frontend › JavaScript
- **THEN** "Linguagem pura" mostra JavaScript essencial, JavaScript assíncrono, JavaScript no navegador, TypeScript essencial, TypeScript avançado e Build e bundlers, e "Frameworks" mostra React, Vue, Next.js e Angular, com "4 trilhas" em React, "2 trilhas" em Next.js e "1 trilha" nos demais

#### Scenario: JavaScript no Backend
- **WHEN** o usuário abre Backend › JavaScript
- **THEN** "Linguagem pura" mostra JavaScript essencial, JavaScript assíncrono, Node.js, TypeScript essencial e TypeScript avançado, e "Frameworks" mostra Next.js, Express e NestJS, com "1 trilha" em cada

#### Scenario: Contagem na tela da área
- **WHEN** o usuário abre a área Frontend
- **THEN** a seção "Linguagens" mostra "JavaScript" com "14 trilhas" e não mostra "TypeScript"

### Requirement: Decks das trilhas de JavaScript
Cada trilha SHALL terminar com o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`, precedido pelos decks de conteúdo da tabela, nesta ordem, com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck). `javascript-assincrono` SHALL ter 4 decks de conteúdo (5 decks e 30 cards); as demais trilhas SHALL ter 3 decks de conteúdo (4 decks e 24 cards). Os decks de conteúdo SHALL ser:

| Trilha | Decks de conteúdo (id: título) |
|---|---|
| javascript-essencial | `tipos-e-variaveis`: Tipos e variáveis; `funcoes-e-escopo`: Funções e escopo; `objetos-e-prototipos`: Objetos e protótipos |
| javascript-assincrono | `event-loop`: Event loop; `promises`: Promises; `async-await`: async/await; `combinadores-de-promise`: Combinadores de Promise |
| javascript-no-navegador | `dom`: DOM; `eventos`: Eventos; `rede-e-armazenamento`: Rede e armazenamento |
| nodejs | `runtime`: Runtime; `modulos-e-npm`: Módulos e npm; `streams-e-processos`: Streams e processos |
| react | `componentes-e-jsx`: Componentes e JSX; `hooks`: Hooks; `renderizacao-e-performance`: Renderização e performance |
| vue | `reatividade`: Reatividade; `componentes`: Componentes; `router-e-pinia`: Router e Pinia |
| nextjs | `roteamento`: Roteamento; `renderizacao`: Renderização; `dados-e-api`: Dados e rotas de API |
| express | `rotas-e-middlewares`: Rotas e middlewares; `requisicao-e-resposta`: Requisição e resposta; `erros-e-organizacao`: Erros e organização |

O deck `combinadores-de-promise` SHALL ter um concept para cada um de `Promise.all`, `Promise.allSettled`, `Promise.race` e `Promise.any`, dizendo quando cada um resolve e quando rejeita (incluindo o `AggregateError` do `any`), um exemplo de timeout com `Promise.race` e um exemplo de fallback entre várias fontes com `Promise.any`.

Os snippets dos cards `code` SHALL usar a linguagem `js`, `bash` para comandos de terminal ou `text` para marcação HTML e componentes `.vue` (o formato de conteúdo não tem `html` nem `vue`).

#### Scenario: Contagem por deck
- **WHEN** cada trilha de JavaScript é carregada
- **THEN** ela tem os decks na ordem da tabela seguidos do deck de entrevista, com 6 cards cada, 30 cards em `javascript-assincrono` e 24 nas demais, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

#### Scenario: Um card por combinador
- **WHEN** o deck `combinadores-de-promise` de `javascript-assincrono` é lido
- **THEN** ele tem 4 concepts com os termos `Promise.all`, `Promise.allSettled`, `Promise.race` e `Promise.any`, e o card de `Promise.any` cita `AggregateError`

#### Scenario: Resumo ligado ao deck novo
- **WHEN** o card `combinadores` do deck `promises` é lido
- **THEN** os `relatedTerms` dele incluem os 4 concepts do deck `combinadores-de-promise`

### Requirement: Qualidade do conteúdo de JavaScript
Todo card das trilhas de JavaScript SHALL:
- ter `origin: "original"`, porque o conteúdo é autoral;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

Cada trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior).

#### Scenario: Sem complementos
- **WHEN** os cards das trilhas de JavaScript são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards das trilhas de JavaScript são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis de cada trilha são contados
- **THEN** cada trilha tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução das trilhas de JavaScript
Cada trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes: código, nomes de arquivo, `tags` e `aliases` ficam fora; nomes próprios e termos técnicos consagrados (ex.: Promise, closure, hook, middleware) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara cada trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Frontend › JavaScript
- **THEN** a trilha "JavaScript essencial" aparece como "JavaScript essentials"

### Requirement: Trilha Next.js na versão atual
O conteúdo da trilha `nextjs` SHALL seguir o Next.js 16:
- o card `proxy` (deck `dados-e-api`) SHALL ter o termo "Proxy (antigo Middleware)" e apresentar `proxy.ts` como o arquivo atual, citando `middleware.ts` só como o nome antigo;
- o card `cache-e-revalidacao` (deck `renderizacao`) SHALL ter um snippet com Cache Components (`'use cache'`, `cacheLife` e `cacheTag`) e SHALL explicar que `revalidate` no `fetch` é o modelo anterior, usado sem `cacheComponents`.

A trilha MUST NOT ter os cards com os ids antigos `middleware-next` e `revalidate`.

#### Scenario: Proxy no lugar de Middleware
- **WHEN** o card `proxy` é lido
- **THEN** o termo é "Proxy (antigo Middleware)" e a definição cita `proxy.ts`

#### Scenario: Cache Components no card de cache
- **WHEN** o card `cache-e-revalidacao` é lido
- **THEN** o snippet contém `'use cache'`, `cacheLife` e `cacheTag`, e o texto cita `cacheComponents`

#### Scenario: Ids antigos removidos
- **WHEN** a trilha `nextjs` é carregada
- **THEN** ela continua com 24 cards e não tem cards com id `middleware-next` nem `revalidate`

#### Scenario: Proxy em inglês
- **WHEN** o app está em inglês e o card `proxy` é exibido
- **THEN** o termo aparece como "Proxy (formerly Middleware)"

