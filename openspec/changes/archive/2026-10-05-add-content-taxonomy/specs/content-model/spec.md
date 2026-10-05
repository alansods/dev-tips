## MODIFIED Requirements

### Requirement: Estrutura trilha, deck e card
O conteúdo SHALL ser organizado em trilhas; cada trilha SHALL ter `id`, `title`, `description`, pelo menos uma área (`areas`) e pelo menos um deck; cada deck SHALL ter `id`, `title` e pelo menos um card. A ordem de exibição de decks e cards SHALL ser a ordem em que aparecem no conteúdo. Todo campo de texto obrigatório MUST ser não vazio após remover espaços nas pontas. Todo `id` (trilha, deck, card) MUST estar em kebab-case (`a-z`, `0-9` e `-`).

#### Scenario: Trilha mínima válida
- **WHEN** uma trilha tem id, título, descrição, a área `fundamentos` e um deck com um card `concept` válido
- **THEN** a validação aceita a trilha

#### Scenario: Trilha sem decks
- **WHEN** uma trilha tem a lista de decks vazia
- **THEN** a validação rejeita a trilha com erro no caminho `decks`

#### Scenario: Deck sem cards
- **WHEN** um deck tem a lista de cards vazia
- **THEN** a validação rejeita a trilha com erro no caminho `decks[0].cards`

#### Scenario: Texto obrigatório só com espaços
- **WHEN** o título de um deck é `"   "`
- **THEN** a validação rejeita a trilha com erro no caminho `decks[0].title`

#### Scenario: Id fora do padrão
- **WHEN** um card tem id `"Passo 1"`
- **THEN** a validação rejeita a trilha com erro no campo `id` desse card

## ADDED Requirements

### Requirement: Áreas da trilha
Toda trilha SHALL declarar `areas`, uma lista não vazia e sem repetição de áreas. As áreas válidas são, nesta ordem de exibição: `fundamentos` (Fundamentos), `frontend` (Frontend) e `backend` (Backend). Uma trilha MAY estar em mais de uma área.

#### Scenario: Trilha sem áreas
- **WHEN** uma trilha não declara `areas` ou declara a lista vazia
- **THEN** a validação rejeita a trilha com erro no caminho `areas`

#### Scenario: Área desconhecida
- **WHEN** uma trilha declara `areas: ["mobile"]`
- **THEN** a validação rejeita a trilha com erro no caminho `areas[0]`

#### Scenario: Área repetida
- **WHEN** uma trilha declara `areas: ["backend", "backend"]`
- **THEN** a validação rejeita a trilha indicando a área repetida `backend`

#### Scenario: Trilha em duas áreas
- **WHEN** uma trilha declara `areas: ["frontend", "backend"]`
- **THEN** a validação aceita a trilha

### Requirement: Cadastro de linguagens e frameworks
O conteúdo SHALL ter um cadastro único de linguagens e frameworks em `content/taxonomy.json`: `languages`, uma lista de `{id, name}`, e `frameworks`, uma lista de `{id, name, language}`. A ordem de cada lista SHALL ser a ordem de exibição. Os ids MUST estar em kebab-case e ser únicos dentro de cada lista, os nomes MUST ser não vazios e o `language` de cada framework MUST ser o id de uma linguagem do cadastro. O cadastro do repositório SHALL ser validado pela suíte de testes.

#### Scenario: Cadastro válido
- **WHEN** o cadastro tem a linguagem `java` (Java) e o framework `spring` (Spring Boot) com `language: "java"`
- **THEN** a validação aceita o cadastro

#### Scenario: Framework de linguagem inexistente
- **WHEN** o framework `rails` declara `language: "ruby"` e `ruby` não está em `languages`
- **THEN** a validação rejeita o cadastro com erro em `frameworks[0].language`

#### Scenario: Linguagem repetida
- **WHEN** o cadastro tem duas linguagens com id `java`
- **THEN** a validação rejeita o cadastro indicando o id repetido `java`

#### Scenario: Cadastro do repositório
- **WHEN** a suíte de testes roda
- **THEN** `content/taxonomy.json` é validado, e um erro faz a suíte falhar

### Requirement: Posicionamento da trilha
Uma trilha MAY declarar `language` (id de linguagem do cadastro) e, além dela, `framework` (id de framework do cadastro). A posição da trilha na navegação SHALL ser:
- **comparativa**, quando declara `variants`; nesse caso MUST NOT declarar `language` nem `framework`;
- **de framework**, quando declara `framework`; o framework MUST pertencer à `language` declarada;
- **de linguagem pura**, quando declara só `language`;
- **direta na área**, quando não declara nenhum dos três.

`framework` sem `language` MUST ser rejeitado. As referências ao cadastro SHALL ser conferidas pela suíte de testes para todas as trilhas do repositório.

#### Scenario: Trilha de framework válida
- **WHEN** uma trilha declara `language: "java"` e `framework: "spring"`, e `spring` pertence a `java` no cadastro
- **THEN** a validação aceita a trilha e a posição dela é "de framework"

#### Scenario: Framework de outra linguagem
- **WHEN** uma trilha declara `language: "python"` e `framework: "spring"`
- **THEN** a validação rejeita a trilha com erro no caminho `framework`

#### Scenario: Framework sem linguagem
- **WHEN** uma trilha declara `framework: "spring"` sem `language`
- **THEN** a validação rejeita a trilha com erro no caminho `language`

#### Scenario: Linguagem fora do cadastro
- **WHEN** uma trilha declara `language: "cobol"` e `cobol` não está no cadastro
- **THEN** a validação rejeita a trilha com erro no caminho `language`

#### Scenario: Comparativa com linguagem
- **WHEN** uma trilha declara `variants` e `language: "java"`
- **THEN** a validação rejeita a trilha informando que trilhas comparativas não têm linguagem

#### Scenario: Trilha direta na área
- **WHEN** uma trilha não declara `variants`, `language` nem `framework`
- **THEN** a validação aceita a trilha e a posição dela é "direta na área"

### Requirement: Nível do card
Todo card SHALL ter `level` igual a `junior`, `pleno` ou `senior`, indicando a senioridade em que o assunto costuma ser cobrado. O campo é obrigatório e não tem valor padrão.

#### Scenario: Card sem nível
- **WHEN** um card não informa `level`
- **THEN** a validação rejeita a trilha com erro no campo `level` desse card

#### Scenario: Nível inválido
- **WHEN** um card informa `level: "expert"`
- **THEN** a validação rejeita a trilha com erro no campo `level` desse card

#### Scenario: Conteúdo do repositório com nível
- **WHEN** o gate de conteúdo do repositório valida `content/tracks/`
- **THEN** todos os cards de todas as trilhas têm `level` válido
