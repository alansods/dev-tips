# content-model Specification

## Purpose

Define o formato do conteúdo de estudo (trilhas, decks e cards) e as regras que todo conteúdo precisa cumprir para ser aceito pelo app, garantindo que nenhuma trilha publicada tenha cards quebrados ou referências inválidas.
## Requirements
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

### Requirement: Variantes e colunas definidas por trilha
Uma trilha MAY declarar `variants` (lista de `{id, name, language}`, ex.: frameworks) e `compareColumns` (lista de `{id, label}`). Ambos são opcionais. Os ids dentro de cada lista MUST ser únicos.

#### Scenario: Trilha sem variantes nem colunas
- **WHEN** uma trilha contém apenas cards `concept` e não declara `variants` nem `compareColumns`
- **THEN** a validação aceita a trilha

#### Scenario: Variante duplicada
- **WHEN** uma trilha declara duas variantes com id `express`
- **THEN** a validação rejeita a trilha com erro em `variants`

### Requirement: Unicidade de ids
Ids de decks MUST ser únicos dentro da trilha. Ids de cards MUST ser únicos dentro da trilha inteira, mesmo em decks diferentes. Ids de trilhas MUST ser únicos no catálogo.

#### Scenario: Card repetido em decks diferentes
- **WHEN** dois decks da mesma trilha têm, cada um, um card com id `cors`
- **THEN** a validação rejeita a trilha indicando o id duplicado `cors`

#### Scenario: Trilhas com o mesmo id no catálogo
- **WHEN** o catálogo contém duas trilhas com id `crud-4-frameworks`
- **THEN** a validação do catálogo falha indicando o id duplicado

### Requirement: Origem do card
Todo card SHALL ter `origin` igual a `original` (veio do material de origem) ou `supplement` (complemento escrito à parte). Quando omitido, `origin` SHALL ser `original`.

#### Scenario: Origem omitida
- **WHEN** um card não informa `origin`
- **THEN** o card validado tem `origin` igual a `original`

#### Scenario: Origem inválida
- **WHEN** um card informa `origin: "ai"`
- **THEN** a validação rejeita a trilha com erro no campo `origin`

### Requirement: Card endpoint
Um card `endpoint` SHALL ter `method` (GET, POST, PUT, PATCH ou DELETE), `path` começando com `/`, `operation` (C, R, U ou D), `description` e `successStatus` entre 100 e 599. MAY ter `errorStatuses`, uma lista de status entre 100 e 599.

#### Scenario: Endpoint válido
- **WHEN** um card endpoint tem método DELETE, path `/products/{id}`, operação D, status de sucesso 204 e erros [404]
- **THEN** a validação aceita o card

#### Scenario: Método desconhecido
- **WHEN** um card endpoint tem método `FETCH`
- **THEN** a validação rejeita a trilha com erro no campo `method`

#### Scenario: Path sem barra inicial
- **WHEN** um card endpoint tem path `products`
- **THEN** a validação rejeita a trilha com erro no campo `path`

### Requirement: Card step
Um card `step` SHALL ter `number` (inteiro ≥ 1), `title`, `whatIs`, `whyItMatters` e `snippets`, um mapa de id de variante para snippet. A trilha MUST declarar `variants` para conter cards `step`, e `snippets` MUST conter exatamente uma entrada por variante da trilha: nenhuma faltando, nenhuma desconhecida. `number` MUST ser único entre os cards `step` do mesmo deck.

#### Scenario: Step cobre todas as variantes
- **WHEN** a trilha declara as variantes express, spring, nest e fastapi e um step tem snippet para as quatro
- **THEN** a validação aceita o card

#### Scenario: Step sem uma variante
- **WHEN** um step não tem snippet para `fastapi`, que é variante da trilha
- **THEN** a validação rejeita a trilha indicando a variante faltante `fastapi` no card

#### Scenario: Step com variante desconhecida
- **WHEN** um step tem snippet para `django`, que não é variante da trilha
- **THEN** a validação rejeita a trilha indicando a variante desconhecida `django`

#### Scenario: Step em trilha sem variantes
- **WHEN** uma trilha sem `variants` contém um card step
- **THEN** a validação rejeita a trilha informando que cards step exigem variantes

#### Scenario: Número de passo repetido no deck
- **WHEN** dois steps do mesmo deck têm `number` 3
- **THEN** a validação rejeita a trilha indicando o número repetido

### Requirement: Snippet de código
Todo snippet (em `step`, `code` ou `question`) SHALL ter `file` (rótulo de onde o código vive, ex.: `terminal`, `src/db.ts`), `language` e `code` não vazios. MAY ter `note`. `language` MUST pertencer à lista suportada: `bash`, `ts`, `js`, `java`, `python`, `sql`, `xml`, `properties`, `json`, `yaml`, `text`. O conteúdo de `code` SHALL ser preservado exatamente como escrito, incluindo quebras de linha e indentação.

#### Scenario: Linguagem não suportada
- **WHEN** um snippet tem `language: "cobol"`
- **THEN** a validação rejeita a trilha com erro no campo `language` do snippet

#### Scenario: Código preservado
- **WHEN** um snippet tem código com indentação de 4 espaços e linhas em branco
- **THEN** o snippet validado tem o mesmo texto, caractere por caractere

### Requirement: Card compare
Um card `compare` SHALL ter `concept`, `explanation` e `values`, um mapa de id de coluna para texto. A trilha MUST declarar `compareColumns` para conter cards `compare`, e `values` MUST conter exatamente uma entrada não vazia por coluna da trilha.

#### Scenario: Compare completo
- **WHEN** a trilha declara as colunas frontend, spring, express, nest e fastapi e um card compare tem valor para as cinco
- **THEN** a validação aceita o card

#### Scenario: Compare sem uma coluna
- **WHEN** um card compare não tem valor para a coluna `nest`
- **THEN** a validação rejeita a trilha indicando a coluna faltante `nest`

#### Scenario: Compare em trilha sem colunas
- **WHEN** uma trilha sem `compareColumns` contém um card compare
- **THEN** a validação rejeita a trilha informando que cards compare exigem colunas

### Requirement: Card concept e glossário
Um card `concept` SHALL ter `term` e `definition`. MAY ter `frontendAnalogy` (comparação com algo do frontend) e `aliases` (outros nomes do termo). O glossário de uma trilha SHALL ser o conjunto de todos os cards `concept` da trilha. Os termos MUST ser únicos na trilha, sem diferenciar maiúsculas e minúsculas.

#### Scenario: Glossário derivado dos concepts
- **WHEN** uma trilha tem três cards concept espalhados em dois decks
- **THEN** o glossário da trilha contém exatamente esses três termos

#### Scenario: Termo duplicado com caixa diferente
- **WHEN** uma trilha tem um concept com termo `CORS` e outro com termo `cors`
- **THEN** a validação rejeita a trilha indicando o termo duplicado

### Requirement: Card code
Um card `code` SHALL ter `title`, `body` (explicação) e um `snippet`. MAY ter `variant`; quando presente, MUST ser o id de uma variante da trilha.

#### Scenario: Code ligado a variante existente
- **WHEN** um card code tem `variant: "express"` e a trilha declara a variante express
- **THEN** a validação aceita o card

#### Scenario: Code ligado a variante inexistente
- **WHEN** um card code tem `variant: "rails"` e a trilha não declara essa variante
- **THEN** a validação rejeita a trilha com erro no campo `variant`

#### Scenario: Code sem variante
- **WHEN** um card code não informa `variant`
- **THEN** a validação aceita o card como válido para todas as variantes

### Requirement: Termos relacionados
Todo card MAY ter `relatedTerms`, uma lista de ids de cards `concept` da mesma trilha, sem repetição. Cada id MUST existir na trilha e apontar para um card `concept`. Um card `concept` MUST NOT listar a si mesmo. Quando omitido, `relatedTerms` SHALL ser uma lista vazia. O mesmo vale para `tags`.

#### Scenario: Termo relacionado inexistente
- **WHEN** um step lista `relatedTerms: ["pool-de-conexoes"]` e não existe card com esse id
- **THEN** a validação rejeita a trilha indicando a referência quebrada `pool-de-conexoes`

#### Scenario: Termo relacionado que não é concept
- **WHEN** um card lista em `relatedTerms` o id de um card step
- **THEN** a validação rejeita a trilha informando que a referência precisa ser um concept

#### Scenario: Concept referenciando a si mesmo
- **WHEN** o concept `cors` lista `cors` em `relatedTerms`
- **THEN** a validação rejeita a trilha

### Requirement: Relatório de erros completo
A validação SHALL reportar todos os erros encontrados de uma vez, não apenas o primeiro. Cada erro SHALL ter um caminho legível até o campo (ex.: `decks[1].cards[3].snippets.fastapi`) e uma mensagem em PT-BR. Em caso de sucesso, a validação SHALL devolver a trilha com os valores padrão aplicados.

#### Scenario: Vários erros na mesma trilha
- **WHEN** uma trilha tem um deck com título vazio e um step sem a variante `nest`
- **THEN** a validação devolve os dois erros, cada um com seu caminho

#### Scenario: Sucesso com padrões aplicados
- **WHEN** uma trilha válida omite `origin`, `tags` e `relatedTerms` em seus cards
- **THEN** a validação devolve a trilha com `origin: "original"`, `tags: []` e `relatedTerms: []` em cada card

### Requirement: Conteúdo do repositório validado na suíte de testes
Todo arquivo `content/tracks/<track-id>/track.json` do repositório SHALL ser validado pela suíte de testes. O `id` da trilha MUST ser igual ao nome da pasta. Um conteúdo inválido MUST fazer a suíte falhar, exibindo os erros. Um catálogo sem nenhuma trilha SHALL ser aceito.

#### Scenario: track.json inválido no repositório
- **WHEN** existe um `track.json` com um card de tipo desconhecido
- **THEN** `npm test` falha e mostra o arquivo e o caminho do erro

#### Scenario: Pasta e id divergentes
- **WHEN** a pasta é `content/tracks/web-basics` e a trilha dentro dela tem id `fundamentos-web`
- **THEN** `npm test` falha indicando a divergência

#### Scenario: Catálogo vazio
- **WHEN** `content/tracks/` não contém nenhuma trilha
- **THEN** a validação do conteúdo do repositório passa

### Requirement: Card question
Um card `question` SHALL ter `question` (a pergunta) e `answer` (a resposta modelo), ambos não vazios. MAY ter `snippet`, que segue as mesmas regras de snippet dos outros tipos. Como todo card, MAY ter `relatedTerms`, que seguem as mesmas regras de integridade.

#### Scenario: Pergunta válida
- **WHEN** um card question tem pergunta, resposta e um snippet `sql` válido
- **THEN** a validação aceita o card

#### Scenario: Pergunta sem resposta
- **WHEN** um card question tem `answer` vazio
- **THEN** a validação rejeita a trilha com erro no campo `answer`

#### Scenario: Pergunta com termo relacionado inexistente
- **WHEN** um card question lista em `relatedTerms` um id que não existe na trilha
- **THEN** a validação rejeita a trilha indicando a referência quebrada

### Requirement: Tradução de uma trilha
Uma trilha MAY ter um arquivo de tradução para inglês em `content/tracks/<track-id>/translations/en.json`. O arquivo SHALL conter só textos exibidos, organizados por id: `title` e `description` da trilha; `title` e `description` de cada deck, por id do deck; e, por id do card, os campos de texto do tipo daquele card (`description`, `title`, `whatIs`, `whyItMatters`, `concept`, `explanation`, `values`, `term`, `definition`, `frontendAnalogy`, `aliases`, `body`, `question`, `answer`, `tags`, e `note` dos snippets, por id de variante quando o card tem vários snippets). Rótulos de colunas de comparação MAY ser traduzidos, por id da coluna. Todos os campos são opcionais. A validação SHALL rejeitar, com o caminho do problema no relatório de erros:
- id de deck, card, variante ou coluna que não existe na trilha;
- campo que não é de texto exibido ou que não pertence ao tipo do card (ex.: `code`, `method`, `path`, `definition` num card step);
- texto vazio.

#### Scenario: Tradução válida
- **WHEN** `translations/en.json` traduz o título da trilha e a `definition` do card concept `cors`
- **THEN** a validação passa

#### Scenario: Card inexistente
- **WHEN** a tradução cita o card `nao-existe`
- **THEN** a validação falha com um erro que aponta `cards.nao-existe`

#### Scenario: Campo que não se traduz
- **WHEN** a tradução de um card step inclui `snippets.express.code`
- **THEN** a validação falha apontando esse campo

#### Scenario: Campo de outro tipo
- **WHEN** a tradução do card step `passo-1` inclui `definition`
- **THEN** a validação falha apontando `cards.passo-1.definition`

#### Scenario: Traduções do repositório validadas na suíte
- **WHEN** `npm test` roda
- **THEN** todo arquivo `translations/en.json` em `content/tracks/` é validado contra a trilha correspondente, e um erro faz a suíte falhar

### Requirement: Áreas da trilha
Toda trilha SHALL declarar `areas`, uma lista não vazia e sem repetição de áreas. As áreas válidas são, nesta ordem de exibição: `fundamentos` (Fundamentos), `frontend` (Frontend), `backend` (Backend), `banco-de-dados` (Banco de dados), `mobile` (Mobile) e `devops` (DevOps e Cloud). Uma trilha MAY estar em mais de uma área.

#### Scenario: Trilha sem áreas
- **WHEN** uma trilha não declara `areas` ou declara a lista vazia
- **THEN** a validação rejeita a trilha com erro no caminho `areas`

#### Scenario: Área desconhecida
- **WHEN** uma trilha declara `areas: ["games"]`
- **THEN** a validação rejeita a trilha com erro no caminho `areas[0]`

#### Scenario: Área repetida
- **WHEN** uma trilha declara `areas: ["backend", "backend"]`
- **THEN** a validação rejeita a trilha indicando a área repetida `backend`

#### Scenario: Trilha em duas áreas
- **WHEN** uma trilha declara `areas: ["frontend", "backend"]`
- **THEN** a validação aceita a trilha

#### Scenario: Área de banco de dados
- **WHEN** uma trilha declara `areas: ["banco-de-dados"]`
- **THEN** a validação aceita a trilha

#### Scenario: Áreas de mobile e DevOps
- **WHEN** uma trilha declara `areas: ["mobile"]` e outra declara `areas: ["devops"]`
- **THEN** a validação aceita as duas trilhas

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

### Requirement: Seção da trilha
Uma trilha direta na área (sem `language`, `framework` nem `variants`) MAY declarar `section`, que agrupa as trilhas diretas da área em seções nomeadas. As seções válidas são, nesta ordem de exibição: `relacionais` (Relacionais), `nao-relacionais` (Não relacionais), `ci-cd` (CI/CD) e `aws` (AWS). Uma trilha de linguagem, de framework ou comparativa MUST NOT declarar `section`.

#### Scenario: Trilha direta com seção
- **WHEN** uma trilha direta na área declara `section: "relacionais"`
- **THEN** a validação aceita a trilha

#### Scenario: Seções de DevOps
- **WHEN** uma trilha direta na área declara `section: "ci-cd"` e outra declara `section: "aws"`
- **THEN** a validação aceita as duas trilhas

#### Scenario: Seção desconhecida
- **WHEN** uma trilha declara `section: "colunares"`
- **THEN** a validação rejeita a trilha com erro no caminho `section`

#### Scenario: Seção em trilha de linguagem
- **WHEN** uma trilha declara `language: "java"` e `section: "relacionais"`
- **THEN** a validação rejeita a trilha com erro no caminho `section`

