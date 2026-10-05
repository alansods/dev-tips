## Purpose

Define as trilhas de TypeScript (linguagem pura e os frameworks Angular e NestJS): onde cada uma aparece na navegação, como os decks são organizados e as regras de qualidade do conteúdo.

## ADDED Requirements

### Requirement: Trilhas de TypeScript no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem depois das trilhas de JavaScript, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Áreas | Linguagem | Framework |
|---|---|---|---|---|
| `typescript-essencial` | TypeScript essencial | frontend, backend | typescript | — |
| `typescript-avancado` | TypeScript avançado | frontend, backend | typescript | — |
| `angular` | Angular | frontend | typescript | angular |
| `nestjs` | NestJS | backend | typescript | nest |

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 4 trilhas, nessa ordem, logo depois de `express`, com as áreas, a linguagem e o framework da tabela

#### Scenario: TypeScript no Frontend
- **WHEN** o usuário abre Frontend › TypeScript
- **THEN** "Linguagem pura" mostra TypeScript essencial e TypeScript avançado, e "Frameworks" mostra só Angular

#### Scenario: TypeScript no Backend
- **WHEN** o usuário abre Backend › TypeScript
- **THEN** "Linguagem pura" mostra TypeScript essencial e TypeScript avançado, e "Frameworks" mostra só NestJS

### Requirement: Decks das trilhas de TypeScript
Cada trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards por trilha. Os decks de conteúdo SHALL ser:

| Trilha | Decks de conteúdo (id: título) |
|---|---|
| typescript-essencial | `tipos-basicos`: Tipos básicos; `objetos-e-interfaces`: Objetos e interfaces; `unions-e-narrowing`: Unions e narrowing |
| typescript-avancado | `generics`: Generics; `utility-types`: Utility types; `tipos-mapeados-e-condicionais`: Tipos mapeados e condicionais |
| angular | `componentes-e-templates`: Componentes e templates; `di-e-servicos`: Injeção de dependência e serviços; `rxjs-e-signals`: RxJS e signals |
| nestjs | `modulos-e-providers`: Módulos e providers; `controllers-e-pipes`: Controllers e pipes; `guards-e-interceptors`: Guards, interceptors e filtros |

Os snippets dos cards `code` SHALL usar a linguagem `ts`, `json` para arquivos de configuração (como o `tsconfig.json`) ou `bash` para comandos de terminal.

#### Scenario: Contagem por deck
- **WHEN** cada trilha de TypeScript é carregada
- **THEN** ela tem os 4 decks na ordem da tabela, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

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
- **WHEN** o app está em inglês e o usuário abre Frontend › TypeScript
- **THEN** a trilha "TypeScript essencial" aparece como "TypeScript essentials"
