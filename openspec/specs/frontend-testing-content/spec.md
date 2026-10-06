# frontend-testing-content Specification

## Purpose
Define a trilha "Testes no frontend": onde ela aparece na navegação (Frontend e Mobile), como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilha de testes no frontend no catálogo
O catálogo SHALL ter a trilha `testes-no-frontend` ("Testes no frontend"), registrada logo depois de `estado-e-dados-no-react`, em `content/tracks/testes-no-frontend/track.json`, com `areas: ["frontend", "mobile"]`, `language: "javascript"` e `framework: "react"`, sem `variants` nem `section`.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `testes-no-frontend` logo depois de `estado-e-dados-no-react`, nas áreas Frontend e Mobile, com a linguagem `javascript` e o framework `react`

#### Scenario: Framework React no Frontend
- **WHEN** o usuário abre Frontend › JavaScript › React
- **THEN** a tela lista "Testes no frontend" depois de "Estado e dados no React"

#### Scenario: Framework React no Mobile
- **WHEN** o usuário abre Mobile › JavaScript › React
- **THEN** a tela lista "Testes no frontend" depois de "Estado e dados no React"

### Requirement: Decks da trilha de testes no frontend
A trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards. Os decks de conteúdo SHALL ser:

| id | Título |
|---|---|
| `jest` | Jest |
| `testing-library` | Testing Library |
| `testes-de-integracao` | Testes de integração |

Os snippets dos cards `code` SHALL usar a linguagem `ts` (inclusive componentes e testes com JSX) ou `bash` para comandos de terminal.

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** ela tem os 4 decks na ordem da tabela e o deck de entrevista por último, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

#### Scenario: Linguagens dos snippets
- **WHEN** os snippets da trilha são lidos
- **THEN** todos usam `ts` ou `bash`

### Requirement: Qualidade do conteúdo de testes no frontend
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

### Requirement: Tradução da trilha de testes no frontend
A trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: Jest, Testing Library, mock, matcher, snapshot, fake timers) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Frontend › JavaScript › React
- **THEN** a trilha aparece como "Frontend testing"

