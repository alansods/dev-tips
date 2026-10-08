# ruby-content Specification

## Purpose
Define as trilhas de Ruby (linguagem pura e o framework Ruby on Rails): onde cada uma aparece na navegação, como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilhas de Ruby no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem logo depois das trilhas de C#, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Áreas | Linguagem | Framework | Pré-requisito |
|---|---|---|---|---|---|
| `ruby-essencial` | Ruby essencial | backend | ruby | — | fundamentos-de-programacao |
| `rails` | Ruby on Rails | backend | ruby | rails | ruby-essencial |

O cadastro SHALL ter a linguagem `ruby` (Ruby) depois de C#, e o framework `rails` (Ruby on Rails) nessa linguagem, depois de ASP.NET Core.

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 2 trilhas, nessa ordem, logo depois de `aspnet-core`, com as áreas, a linguagem, o framework e o pré-requisito da tabela

#### Scenario: Ruby no Backend
- **WHEN** o usuário abre Backend › Ruby
- **THEN** "Linguagem pura" mostra Ruby essencial, e "Frameworks" mostra Ruby on Rails com "1 trilha"

### Requirement: Decks das trilhas de Ruby
Cada trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards por trilha. Os decks de conteúdo SHALL ser:

| Trilha | Decks de conteúdo (id: título) |
|---|---|
| ruby-essencial | `objetos-e-simbolos`: Objetos e símbolos; `blocos-e-enumerable`: Blocos e Enumerable; `modulos-e-metaprogramacao`: Módulos e metaprogramação |
| rails | `mvc-e-convencoes`: MVC e convenções; `active-record`: Active Record; `jobs-testes-e-seguranca`: Jobs, testes e segurança |

Os snippets dos cards `code` SHALL usar a linguagem `ruby`, ou `yaml` para arquivos de configuração e `bash` para comandos de terminal.

#### Scenario: Contagem por deck
- **WHEN** cada trilha de Ruby é carregada
- **THEN** ela tem os 4 decks na ordem da tabela, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

### Requirement: Qualidade do conteúdo de Ruby
Todo card das trilhas de Ruby SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

Cada trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior) e MUST tratar só o que é particular de Ruby e do framework, sem repetir os conceitos gerais da trilha Fundamentos de programação.

#### Scenario: Sem complementos
- **WHEN** os cards das trilhas de Ruby são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards das trilhas de Ruby são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis de cada trilha são contados
- **THEN** cada trilha tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução das trilhas de Ruby
Cada trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: block, proc, lambda, mixin, Active Record, migration, gem) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara cada trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Backend › Ruby
- **THEN** a trilha "Ruby essencial" aparece como "Ruby essentials"

