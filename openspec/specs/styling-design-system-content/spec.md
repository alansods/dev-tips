# styling-design-system-content Specification

## Purpose
Define a trilha "Estilização e design system": onde ela aparece na navegação (Frontend e Mobile), como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilha de estilização e design system no catálogo
O catálogo SHALL ter a trilha `estilizacao-e-design-system` ("Estilização e design system"), registrada logo depois de `testes-no-frontend`, em `content/tracks/estilizacao-e-design-system/track.json`, com `areas: ["frontend", "mobile"]`, `language: "javascript"` e `framework: "react"`, sem `variants` nem `section`.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `estilizacao-e-design-system` logo depois de `testes-no-frontend`, nas áreas Frontend e Mobile, com a linguagem `javascript` e o framework `react`

#### Scenario: Framework React no Frontend
- **WHEN** o usuário abre Frontend › JavaScript › React
- **THEN** a tela lista "Estilização e design system" depois de "Testes no frontend"

#### Scenario: Framework React no Mobile
- **WHEN** o usuário abre Mobile › JavaScript › React
- **THEN** a tela lista "Estilização e design system" depois de "Testes no frontend"

### Requirement: Decks da trilha de estilização e design system
A trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards. Os decks de conteúdo SHALL ser:

| id | Título |
|---|---|
| `tailwind-e-nativewind` | Tailwind e NativeWind |
| `design-system` | Design system |
| `acessibilidade` | Acessibilidade |

Os snippets dos cards `code` SHALL usar a linguagem `ts` (inclusive componentes com JSX), `bash` para comandos de terminal ou `text` para CSS (o formato de conteúdo não tem `css`).

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** ela tem os 4 decks na ordem da tabela e o deck de entrevista por último, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

#### Scenario: Linguagens dos snippets
- **WHEN** os snippets da trilha são lidos
- **THEN** todos usam `ts`, `bash` ou `text`

### Requirement: Qualidade do conteúdo de estilização e design system
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

### Requirement: Tradução da trilha de estilização e design system
A trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: Tailwind, NativeWind, Storybook, design tokens, utility-first, story) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Frontend › JavaScript › React
- **THEN** a trilha aparece como "Styling and design systems"

