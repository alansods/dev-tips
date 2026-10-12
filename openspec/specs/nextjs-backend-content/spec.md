# nextjs-backend-content Specification

## Purpose
Define a trilha "Next.js no backend": onde ela aparece na navegação (Backend, framework Next.js), como os decks são organizados, a versão do Next.js seguida e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilha Next.js no backend no catálogo
O catálogo SHALL ter a trilha `nextjs-no-backend` ("Next.js no backend"), registrada logo depois de `modulos-nativos-no-expo` (a última trilha antes das simulações), em `content/tracks/nextjs-no-backend/track.json`, com `areas: ["backend"]`, `language: "javascript"`, `framework: "nextjs"`, `addedAt: "2026-10-12"` e a trilha `nextjs` como pré-requisito, sem `variants` nem `section`.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `nextjs-no-backend` logo depois de `modulos-nativos-no-expo`, na área Backend, com a linguagem `javascript`, o framework `nextjs` e o pré-requisito `nextjs`

#### Scenario: Framework Next.js no Backend
- **WHEN** o usuário abre Backend › JavaScript › Next.js
- **THEN** a tela lista só a trilha "Next.js no backend"

#### Scenario: Fora do Frontend
- **WHEN** o usuário abre Frontend › JavaScript › Next.js
- **THEN** a tela lista "Next.js" e "Performance no Next.js", e não lista "Next.js no backend"

### Requirement: Decks da trilha Next.js no backend
A trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards. Os decks de conteúdo SHALL ser:

| id | Título |
|---|---|
| `route-handlers` | Route Handlers |
| `server-actions` | Server Actions e mutações |
| `auth-e-dados` | Autenticação e acesso a dados |

Os snippets SHALL usar a linguagem `ts` (inclusive componentes com JSX) ou `bash` para comandos de terminal.

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** ela tem os 4 decks na ordem da tabela e o deck de entrevista por último, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

#### Scenario: Linguagens dos snippets
- **WHEN** os snippets da trilha são lidos
- **THEN** todos usam `ts` ou `bash`

### Requirement: Next.js no backend na versão atual
O conteúdo da trilha SHALL seguir o Next.js 16:
- `params` de Route Handlers SHALL aparecer como Promise, lido com `await`;
- `cookies()` e `headers()` SHALL aparecer com `await`;
- a checagem de sessão antes da rota SHALL usar o arquivo `proxy.ts`, e `middleware.ts` MUST NOT aparecer nos snippets;
- `revalidateTag` SHALL aparecer sempre com o segundo argumento (perfil de `cacheLife`), e `updateTag` SHALL ser apresentado como a forma de expirar o cache dentro de uma Server Action quando o usuário precisa ver a própria escrita.

#### Scenario: params assíncrono
- **WHEN** os snippets de Route Handlers que leem parâmetros de rota são lidos
- **THEN** eles fazem `await` em `params`

#### Scenario: Sem middleware.ts
- **WHEN** os snippets da trilha são lidos
- **THEN** nenhum tem `file` igual a `middleware.ts`, e pelo menos um tem `file` terminado em `proxy.ts`

#### Scenario: revalidateTag com perfil
- **WHEN** um snippet da trilha chama `revalidateTag`
- **THEN** a chamada tem dois argumentos

### Requirement: Qualidade do conteúdo de Next.js no backend
Todo card da trilha SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

A trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior).

#### Scenario: Sem complementos
- **WHEN** os cards da trilha são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards da trilha são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis da trilha são contados
- **THEN** ela tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução da trilha Next.js no backend
A trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: Route Handler, Server Action, Proxy, Data Access Layer, webhook, cookie) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Backend › JavaScript › Next.js
- **THEN** a trilha aparece como "Next.js on the backend"

