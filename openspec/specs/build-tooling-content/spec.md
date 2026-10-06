# build-tooling-content Specification

## Purpose
Define a trilha "Build e bundlers": onde ela aparece na navegação (JavaScript puro, no Frontend e no Mobile), como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilha de build e bundlers no catálogo
O catálogo SHALL ter a trilha `build-e-bundlers` ("Build e bundlers"), registrada logo depois de `estilizacao-e-design-system`, em `content/tracks/build-e-bundlers/track.json`, com `areas: ["frontend", "mobile"]` e `language: "javascript"`, sem `framework`, `variants` nem `section`.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `build-e-bundlers` logo depois de `estilizacao-e-design-system`, nas áreas Frontend e Mobile, como linguagem pura de `javascript`

#### Scenario: Linguagem pura no Frontend
- **WHEN** o usuário abre Frontend › JavaScript
- **THEN** "Linguagem pura" lista "Build e bundlers" depois de "TypeScript avançado"

#### Scenario: Linguagem pura no Mobile
- **WHEN** o usuário abre Mobile › JavaScript
- **THEN** "Linguagem pura" lista só "Build e bundlers"

#### Scenario: Fora do Backend
- **WHEN** o usuário abre Backend › JavaScript
- **THEN** "Linguagem pura" não lista "Build e bundlers"

### Requirement: Decks da trilha de build e bundlers
A trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards. Os decks de conteúdo SHALL ser:

| id | Título |
|---|---|
| `transpilacao` | Transpilação |
| `bundlers-na-web` | Bundlers na web |
| `metro-e-eas` | Metro e EAS |

Os snippets dos cards `code` SHALL usar a linguagem `ts` (inclusive componentes com JSX), `js` para arquivos de configuração em JavaScript, `json` para `package.json` e `eas.json`, ou `bash` para comandos de terminal.

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** ela tem os 4 decks na ordem da tabela e o deck de entrevista por último, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

#### Scenario: Linguagens dos snippets
- **WHEN** os snippets da trilha são lidos
- **THEN** todos usam `ts`, `js`, `json` ou `bash`

### Requirement: Qualidade do conteúdo de build e bundlers
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

### Requirement: Tradução da trilha de build e bundlers
A trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: bundler, tree shaking, code splitting, source map, polyfill, Metro, Hermes) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Frontend › JavaScript
- **THEN** a trilha aparece como "Build tools and bundlers"

