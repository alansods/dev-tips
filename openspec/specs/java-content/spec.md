# java-content Specification

## Purpose
Define as trilhas de Java (linguagem pura e o framework Spring Boot): onde cada uma aparece na navegação, como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilhas de Java no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem depois das trilhas de TypeScript, cada uma em `content/tracks/<id>/track.json`:

| id | Título | Áreas | Linguagem | Framework |
|---|---|---|---|---|
| `java-essencial` | Java essencial | backend | java | — |
| `java-colecoes-e-concorrencia` | Java: coleções, streams e concorrência | backend | java | — |
| `spring-boot` | Spring Boot | backend | java | spring |

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 3 trilhas, nessa ordem, logo depois de `nestjs`, com as áreas, a linguagem e o framework da tabela

#### Scenario: Java no Backend
- **WHEN** o usuário abre Backend › Java
- **THEN** "Linguagem pura" mostra Java essencial e "Java: coleções, streams e concorrência", e "Frameworks" mostra Spring Boot

### Requirement: Decks das trilhas de Java
Cada trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards por trilha. Os decks de conteúdo SHALL ser:

| Trilha | Decks de conteúdo (id: título) |
|---|---|
| java-essencial | `jvm-e-tipos`: JVM e tipos; `orientacao-a-objetos`: Orientação a objetos; `excecoes-e-igualdade`: Exceções e igualdade |
| java-colecoes-e-concorrencia | `colecoes`: Coleções; `streams-e-lambdas`: Streams e lambdas; `concorrencia`: Concorrência |
| spring-boot | `ioc-e-configuracao`: IoC e configuração; `dados-e-transacoes`: Dados e transações; `web-e-seguranca`: Web e segurança |

Os snippets dos cards `code` SHALL usar a linguagem `java`, ou `properties`, `yaml` e `xml` para arquivos de configuração e `bash` para comandos de terminal.

#### Scenario: Contagem por deck
- **WHEN** cada trilha de Java é carregada
- **THEN** ela tem os 4 decks na ordem da tabela, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

### Requirement: Qualidade do conteúdo de Java
Todo card das trilhas de Java SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

Cada trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior).

#### Scenario: Sem complementos
- **WHEN** os cards das trilhas de Java são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards das trilhas de Java são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis de cada trilha são contados
- **THEN** cada trilha tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução das trilhas de Java
Cada trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: bean, stream, record, garbage collector) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara cada trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre Backend › Java
- **THEN** a trilha "Java essencial" aparece como "Java essentials"

