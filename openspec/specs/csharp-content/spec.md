# csharp-content Specification

## Purpose
Define as trilhas de C# (linguagem pura e o framework ASP.NET Core): onde cada uma aparece na navegação, como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilhas de C# no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem logo depois das trilhas de Python, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Áreas | Linguagem | Framework | Pré-requisito |
|---|---|---|---|---|---|
| `csharp-essencial` | C# essencial | backend | csharp | — | fundamentos-web |
| `aspnet-core` | ASP.NET Core | backend | csharp | aspnet | csharp-essencial |

O cadastro SHALL ter a linguagem `csharp` (C#) depois de Python, e o framework `aspnet` (ASP.NET Core) nessa linguagem, depois de Django.

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 2 trilhas, nessa ordem, logo depois de `django`, com as áreas, a linguagem, o framework e o pré-requisito da tabela

#### Scenario: C# no Backend
- **WHEN** o usuário abre Backend › C#
- **THEN** "Linguagem pura" mostra C# essencial, e "Frameworks" mostra ASP.NET Core com "1 trilha"

### Requirement: Decks das trilhas de C#
Cada trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards por trilha. Os decks de conteúdo SHALL ser:

| Trilha | Decks de conteúdo (id: título) |
|---|---|
| csharp-essencial | `tipos-e-runtime`: Tipos e runtime; `linq-e-colecoes`: LINQ e coleções; `async-e-recursos`: async e recursos |
| aspnet-core | `pipeline-e-di`: Pipeline e injeção de dependência; `ef-core`: Entity Framework Core; `web-e-seguranca`: Web e segurança |

Os snippets dos cards `code` SHALL usar a linguagem `csharp`, ou `json` para arquivos de configuração e `bash` para comandos de terminal.

#### Scenario: Contagem por deck
- **WHEN** cada trilha de C# é carregada
- **THEN** ela tem os 4 decks na ordem da tabela, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

### Requirement: Qualidade do conteúdo de C#
Todo card das trilhas de C# SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

Cada trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior) e MUST tratar só o que é particular de C# e do framework, sem repetir os conceitos gerais da trilha Fundamentos de programação e web.

#### Scenario: Sem complementos
- **WHEN** os cards das trilhas de C# são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards das trilhas de C# são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis de cada trilha são contados
- **THEN** cada trilha tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução das trilhas de C#
Cada trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: LINQ, record, middleware, DbContext, Minimal API) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara cada trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Backend › C#
- **THEN** a trilha "C# essencial" aparece como "C# essentials"

