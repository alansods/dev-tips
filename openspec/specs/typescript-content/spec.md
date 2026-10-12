# typescript-content Specification

## Purpose
Define as trilhas de TypeScript (linguagem pura e os frameworks Angular e NestJS): onde cada uma aparece na navegação, como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilhas de TypeScript no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem depois das trilhas de JavaScript, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Áreas | Linguagem | Framework |
|---|---|---|---|---|
| `typescript-essencial` | TypeScript essencial | frontend, backend | javascript | — |
| `typescript-avancado` | TypeScript avançado | frontend, backend | javascript | — |
| `angular` | Angular | frontend | javascript | angular |
| `nestjs` | NestJS | backend | javascript | nest |

TypeScript MUST NOT ser uma linguagem separada: o cadastro de linguagens SHALL não ter `typescript`, e o cadastro de frameworks SHALL ter Angular e NestJS na linguagem `javascript`, depois de Express.

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 4 trilhas, nessa ordem, logo depois de `express`, com as áreas, a linguagem e o framework da tabela

#### Scenario: Sem linguagem TypeScript no cadastro
- **WHEN** o cadastro de linguagens e frameworks é carregado
- **THEN** ele não tem a linguagem `typescript`, e Angular e NestJS pertencem à linguagem `javascript`

#### Scenario: TypeScript no Frontend
- **WHEN** o usuário abre Frontend › JavaScript
- **THEN** "Linguagem pura" mostra TypeScript essencial e TypeScript avançado depois das trilhas de JavaScript, e "Frameworks" mostra Angular depois de Next.js

#### Scenario: TypeScript no Backend
- **WHEN** o usuário abre Backend › JavaScript
- **THEN** "Linguagem pura" mostra TypeScript essencial e TypeScript avançado depois de Node.js, e "Frameworks" mostra NestJS depois de Express

#### Scenario: Rota antiga de TypeScript
- **WHEN** o app abre a linguagem `typescript` na área Frontend ou Backend
- **THEN** a tela mostra "Linguagem não encontrada."

### Requirement: Decks das trilhas de TypeScript
Cada trilha SHALL terminar com o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`, precedido pelos decks de conteúdo da tabela, nesta ordem, com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck). `typescript-essencial` SHALL ter 4 decks de conteúdo (5 decks e 30 cards); as demais trilhas SHALL ter 3 decks de conteúdo (4 decks e 24 cards). Os decks de conteúdo SHALL ser:

| Trilha | Decks de conteúdo (id: título) |
|---|---|
| typescript-essencial | `tipos-basicos`: Tipos básicos; `objetos-e-interfaces`: Objetos e interfaces; `unions-e-narrowing`: Unions e narrowing; `enums`: Enums e alternativas |
| typescript-avancado | `generics`: Generics; `utility-types`: Utility types; `tipos-mapeados-e-condicionais`: Tipos mapeados e condicionais |
| angular | `componentes-e-templates`: Componentes e templates; `di-e-servicos`: Injeção de dependência e serviços; `rxjs-e-signals`: RxJS e signals |
| nestjs | `modulos-e-providers`: Módulos e providers; `controllers-e-pipes`: Controllers e pipes; `guards-e-interceptors`: Guards, interceptors e filtros |

O deck `enums` SHALL cobrir enum numérico (com reverse mapping), enum de string, `const enum`, o objeto `as const` como alternativa sem código extra, o JavaScript gerado por enum e por `as const`, e a checagem exaustiva sobre um conjunto fechado de valores.

Os snippets dos cards `code` SHALL usar a linguagem `ts`, `json` para arquivos de configuração (como o `tsconfig.json`) ou `bash` para comandos de terminal.

#### Scenario: Contagem por deck
- **WHEN** cada trilha de TypeScript é carregada
- **THEN** ela tem os decks na ordem da tabela seguidos do deck de entrevista, com 6 cards cada, 30 cards em `typescript-essencial` e 24 nas demais, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

#### Scenario: Deck de enums
- **WHEN** o deck `enums` de `typescript-essencial` é lido
- **THEN** ele é o quarto deck, vem antes de "Perguntas de entrevista" e tem um card cujo snippet contém `as const`

#### Scenario: Enum ligado ao deck novo
- **WHEN** o card `enum` do deck `unions-e-narrowing` é lido
- **THEN** os `relatedTerms` dele incluem pelo menos um concept do deck `enums`

### Requirement: Qualidade do conteúdo de TypeScript
Todo card das trilhas de TypeScript SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

Cada trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior).

#### Scenario: Sem complementos
- **WHEN** os cards das trilhas de TypeScript são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards das trilhas de TypeScript são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis de cada trilha são contados
- **THEN** cada trilha tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução das trilhas de TypeScript
Cada trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: generics, narrowing, decorator, pipe, guard) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara cada trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Frontend › JavaScript
- **THEN** a trilha "TypeScript essencial" aparece como "TypeScript essentials"

