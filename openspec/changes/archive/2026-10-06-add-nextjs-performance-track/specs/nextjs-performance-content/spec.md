## Purpose

Define a trilha "Performance no Next.js": onde ela aparece na navegação (Frontend, framework Next.js), como os decks são organizados e as regras de qualidade do conteúdo.

## ADDED Requirements

### Requirement: Trilha de performance no Next.js no catálogo
O catálogo SHALL ter a trilha `performance-no-nextjs` ("Performance no Next.js"), registrada logo depois de `pagamentos-no-app`, em `content/tracks/performance-no-nextjs/track.json`, com `areas: ["frontend"]`, `language: "javascript"` e `framework: "nextjs"`, sem `variants` nem `section`.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `performance-no-nextjs` logo depois de `pagamentos-no-app`, na área Frontend, com a linguagem `javascript` e o framework `nextjs`

#### Scenario: Framework Next.js
- **WHEN** o usuário abre Frontend › JavaScript › Next.js
- **THEN** a tela lista "Next.js" e depois "Performance no Next.js"

### Requirement: Decks da trilha de performance no Next.js
A trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards. Os decks de conteúdo SHALL ser:

| id | Título |
|---|---|
| `estrategias-de-renderizacao` | Estratégias de renderização |
| `imagens-fontes-e-javascript` | Imagens, fontes e JavaScript |
| `core-web-vitals` | Core Web Vitals |

Os snippets dos cards `code` SHALL usar a linguagem `ts` (inclusive componentes com JSX) ou `bash` para comandos de terminal.

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** ela tem os 4 decks na ordem da tabela e o deck de entrevista por último, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

#### Scenario: Linguagens dos snippets
- **WHEN** os snippets da trilha são lidos
- **THEN** todos usam `ts` ou `bash`

### Requirement: Qualidade do conteúdo de performance no Next.js
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

### Requirement: Tradução da trilha de performance no Next.js
A trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: Core Web Vitals, LCP, INP, CLS, Cache Components, bundle, lazy loading) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Frontend › JavaScript › Next.js
- **THEN** a trilha aparece como "Next.js performance"
