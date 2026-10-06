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

### Requirement: Decks das trilhas de JavaScript
Cada trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. Cada trilha tem, portanto, 24 cards. Os decks de conteúdo SHALL ser:

| Trilha | Decks de conteúdo (id: título) |
|---|---|
| javascript-essencial | `tipos-e-variaveis`: Tipos e variáveis; `funcoes-e-escopo`: Funções e escopo; `objetos-e-prototipos`: Objetos e protótipos |
| javascript-assincrono | `event-loop`: Event loop; `promises`: Promises; `async-await`: async/await |
| javascript-no-navegador | `dom`: DOM; `eventos`: Eventos; `rede-e-armazenamento`: Rede e armazenamento |
| nodejs | `runtime`: Runtime; `modulos-e-npm`: Módulos e npm; `streams-e-processos`: Streams e processos |
| react | `componentes-e-jsx`: Componentes e JSX; `hooks`: Hooks; `renderizacao-e-performance`: Renderização e performance |
| vue | `reatividade`: Reatividade; `componentes`: Componentes; `router-e-pinia`: Router e Pinia |
| nextjs | `roteamento`: Roteamento; `renderizacao`: Renderização; `dados-e-api`: Dados e rotas de API |
| express | `rotas-e-middlewares`: Rotas e middlewares; `requisicao-e-resposta`: Requisição e resposta; `erros-e-organizacao`: Erros e organização |

Os snippets dos cards `code` SHALL usar a linguagem `js`, `bash` para comandos de terminal ou `text` para marcação HTML e componentes `.vue` (o formato de conteúdo não tem `html` nem `vue`).

#### Scenario: Contagem por deck
- **WHEN** cada trilha de JavaScript é carregada
- **THEN** ela tem os 4 decks na ordem da tabela, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

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

