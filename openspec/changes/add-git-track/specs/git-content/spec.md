## Purpose

Define a trilha "Git e colaboração": onde ela aparece na navegação (área Fundamentos), como os decks são organizados e as regras de qualidade do conteúdo.

## ADDED Requirements

### Requirement: Trilha de Git no catálogo
O catálogo SHALL ter a trilha `git-e-colaboracao` ("Git e colaboração"), registrada logo depois de `build-e-bundlers`, em `content/tracks/git-e-colaboracao/track.json`, com `areas: ["fundamentos"]`, sem `language`, `framework`, `variants` nem `section`.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `git-e-colaboracao` logo depois de `build-e-bundlers`, na área Fundamentos, como trilha direta

#### Scenario: Área Fundamentos
- **WHEN** o usuário abre a área Fundamentos
- **THEN** a seção "Trilhas" lista "Fundamentos web" e depois "Git e colaboração"

#### Scenario: Só em Fundamentos
- **WHEN** o usuário abre a área DevOps e Cloud
- **THEN** a tela não lista "Git e colaboração"

### Requirement: Decks da trilha de Git
A trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards. Os decks de conteúdo SHALL ser:

| id | Título |
|---|---|
| `modelo-do-git` | Modelo do Git |
| `fluxo-em-equipe` | Fluxo em equipe |
| `resolver-problemas` | Resolver problemas |

Os snippets dos cards `code` SHALL usar a linguagem `bash` para comandos ou `text` para mensagens de commit e trechos de conflito.

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** ela tem os 4 decks na ordem da tabela e o deck de entrevista por último, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

#### Scenario: Linguagens dos snippets
- **WHEN** os snippets da trilha são lidos
- **THEN** todos usam `bash` ou `text`

### Requirement: Qualidade do conteúdo de Git
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

### Requirement: Tradução da trilha de Git
A trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes de comandos e termos técnicos consagrados (ex.: commit, branch, merge, rebase, pull request, staging area, cherry-pick, reflog) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Trilha em inglês
- **WHEN** o app está em inglês e o usuário abre a área Fundamentos
- **THEN** a trilha aparece como "Git and collaboration"
