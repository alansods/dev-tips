# content-model Specification

## Purpose

Define o formato do conteúdo de estudo (temas, decks e cards) e as regras que todo conteúdo precisa cumprir para ser aceito pelo app, garantindo que nenhum tema publicado tenha cards quebrados ou referências inválidas.

## Requirements

### Requirement: Estrutura tema, deck e card
O conteúdo SHALL ser organizado em temas; cada tema SHALL ter `id`, `title`, `description` e pelo menos um deck; cada deck SHALL ter `id`, `title` e pelo menos um card. A ordem de exibição de decks e cards SHALL ser a ordem em que aparecem no conteúdo. Todo campo de texto obrigatório MUST ser não vazio após remover espaços nas pontas. Todo `id` (tema, deck, card) MUST estar em kebab-case (`a-z`, `0-9` e `-`).

#### Scenario: Tema mínimo válido
- **WHEN** um tema tem id, título, descrição e um deck com um card `concept` válido
- **THEN** a validação aceita o tema

#### Scenario: Tema sem decks
- **WHEN** um tema tem a lista de decks vazia
- **THEN** a validação rejeita o tema com erro no caminho `decks`

#### Scenario: Deck sem cards
- **WHEN** um deck tem a lista de cards vazia
- **THEN** a validação rejeita o tema com erro no caminho `decks[0].cards`

#### Scenario: Texto obrigatório só com espaços
- **WHEN** o título de um deck é `"   "`
- **THEN** a validação rejeita o tema com erro no caminho `decks[0].title`

#### Scenario: Id fora do padrão
- **WHEN** um card tem id `"Passo 1"`
- **THEN** a validação rejeita o tema com erro no campo `id` desse card

### Requirement: Variantes e colunas definidas por tema
Um tema MAY declarar `variants` (lista de `{id, name, language}`, ex.: frameworks) e `compareColumns` (lista de `{id, label}`). Ambos são opcionais. Os ids dentro de cada lista MUST ser únicos.

#### Scenario: Tema sem variantes nem colunas
- **WHEN** um tema contém apenas cards `concept` e não declara `variants` nem `compareColumns`
- **THEN** a validação aceita o tema

#### Scenario: Variante duplicada
- **WHEN** um tema declara duas variantes com id `express`
- **THEN** a validação rejeita o tema com erro em `variants`

### Requirement: Unicidade de ids
Ids de decks MUST ser únicos dentro do tema. Ids de cards MUST ser únicos dentro do tema inteiro, mesmo em decks diferentes. Ids de temas MUST ser únicos no catálogo.

#### Scenario: Card repetido em decks diferentes
- **WHEN** dois decks do mesmo tema têm, cada um, um card com id `cors`
- **THEN** a validação rejeita o tema indicando o id duplicado `cors`

#### Scenario: Temas com o mesmo id no catálogo
- **WHEN** o catálogo contém dois temas com id `crud-4-frameworks`
- **THEN** a validação do catálogo falha indicando o id duplicado

### Requirement: Origem do card
Todo card SHALL ter `origin` igual a `original` (veio do material de origem) ou `supplement` (complemento escrito à parte). Quando omitido, `origin` SHALL ser `original`.

#### Scenario: Origem omitida
- **WHEN** um card não informa `origin`
- **THEN** o card validado tem `origin` igual a `original`

#### Scenario: Origem inválida
- **WHEN** um card informa `origin: "ai"`
- **THEN** a validação rejeita o tema com erro no campo `origin`

### Requirement: Card endpoint
Um card `endpoint` SHALL ter `method` (GET, POST, PUT, PATCH ou DELETE), `path` começando com `/`, `operation` (C, R, U ou D), `description` e `successStatus` entre 100 e 599. MAY ter `errorStatuses`, uma lista de status entre 100 e 599.

#### Scenario: Endpoint válido
- **WHEN** um card endpoint tem método DELETE, path `/products/{id}`, operação D, status de sucesso 204 e erros [404]
- **THEN** a validação aceita o card

#### Scenario: Método desconhecido
- **WHEN** um card endpoint tem método `FETCH`
- **THEN** a validação rejeita o tema com erro no campo `method`

#### Scenario: Path sem barra inicial
- **WHEN** um card endpoint tem path `products`
- **THEN** a validação rejeita o tema com erro no campo `path`

### Requirement: Card step
Um card `step` SHALL ter `number` (inteiro ≥ 1), `title`, `whatIs`, `whyItMatters` e `snippets`, um mapa de id de variante para snippet. O tema MUST declarar `variants` para conter cards `step`, e `snippets` MUST conter exatamente uma entrada por variante do tema: nenhuma faltando, nenhuma desconhecida. `number` MUST ser único entre os cards `step` do mesmo deck.

#### Scenario: Step cobre todas as variantes
- **WHEN** o tema declara as variantes express, spring, nest e fastapi e um step tem snippet para as quatro
- **THEN** a validação aceita o card

#### Scenario: Step sem uma variante
- **WHEN** um step não tem snippet para `fastapi`, que é variante do tema
- **THEN** a validação rejeita o tema indicando a variante faltante `fastapi` no card

#### Scenario: Step com variante desconhecida
- **WHEN** um step tem snippet para `django`, que não é variante do tema
- **THEN** a validação rejeita o tema indicando a variante desconhecida `django`

#### Scenario: Step em tema sem variantes
- **WHEN** um tema sem `variants` contém um card step
- **THEN** a validação rejeita o tema informando que cards step exigem variantes

#### Scenario: Número de passo repetido no deck
- **WHEN** dois steps do mesmo deck têm `number` 3
- **THEN** a validação rejeita o tema indicando o número repetido

### Requirement: Snippet de código
Todo snippet (em `step` ou `code`) SHALL ter `file` (rótulo de onde o código vive, ex.: `terminal`, `src/db.ts`), `language` e `code` não vazios. MAY ter `note`. `language` MUST pertencer à lista suportada: `bash`, `ts`, `js`, `java`, `python`, `sql`, `xml`, `properties`, `json`, `yaml`, `text`. O conteúdo de `code` SHALL ser preservado exatamente como escrito, incluindo quebras de linha e indentação.

#### Scenario: Linguagem não suportada
- **WHEN** um snippet tem `language: "cobol"`
- **THEN** a validação rejeita o tema com erro no campo `language` do snippet

#### Scenario: Código preservado
- **WHEN** um snippet tem código com indentação de 4 espaços e linhas em branco
- **THEN** o snippet validado tem o mesmo texto, caractere por caractere

### Requirement: Card compare
Um card `compare` SHALL ter `concept`, `explanation` e `values`, um mapa de id de coluna para texto. O tema MUST declarar `compareColumns` para conter cards `compare`, e `values` MUST conter exatamente uma entrada não vazia por coluna do tema.

#### Scenario: Compare completo
- **WHEN** o tema declara as colunas frontend, spring, express, nest e fastapi e um card compare tem valor para as cinco
- **THEN** a validação aceita o card

#### Scenario: Compare sem uma coluna
- **WHEN** um card compare não tem valor para a coluna `nest`
- **THEN** a validação rejeita o tema indicando a coluna faltante `nest`

#### Scenario: Compare em tema sem colunas
- **WHEN** um tema sem `compareColumns` contém um card compare
- **THEN** a validação rejeita o tema informando que cards compare exigem colunas

### Requirement: Card concept e glossário
Um card `concept` SHALL ter `term` e `definition`. MAY ter `frontendAnalogy` (comparação com algo do frontend) e `aliases` (outros nomes do termo). O glossário de um tema SHALL ser o conjunto de todos os cards `concept` do tema. Os termos MUST ser únicos no tema, sem diferenciar maiúsculas e minúsculas.

#### Scenario: Glossário derivado dos concepts
- **WHEN** um tema tem três cards concept espalhados em dois decks
- **THEN** o glossário do tema contém exatamente esses três termos

#### Scenario: Termo duplicado com caixa diferente
- **WHEN** um tema tem um concept com termo `CORS` e outro com termo `cors`
- **THEN** a validação rejeita o tema indicando o termo duplicado

### Requirement: Card code
Um card `code` SHALL ter `title`, `body` (explicação) e um `snippet`. MAY ter `variant`; quando presente, MUST ser o id de uma variante do tema.

#### Scenario: Code ligado a variante existente
- **WHEN** um card code tem `variant: "express"` e o tema declara a variante express
- **THEN** a validação aceita o card

#### Scenario: Code ligado a variante inexistente
- **WHEN** um card code tem `variant: "rails"` e o tema não declara essa variante
- **THEN** a validação rejeita o tema com erro no campo `variant`

#### Scenario: Code sem variante
- **WHEN** um card code não informa `variant`
- **THEN** a validação aceita o card como válido para todas as variantes

### Requirement: Termos relacionados
Todo card MAY ter `relatedTerms`, uma lista de ids de cards `concept` do mesmo tema, sem repetição. Cada id MUST existir no tema e apontar para um card `concept`. Um card `concept` MUST NOT listar a si mesmo. Quando omitido, `relatedTerms` SHALL ser uma lista vazia. O mesmo vale para `tags`.

#### Scenario: Termo relacionado inexistente
- **WHEN** um step lista `relatedTerms: ["pool-de-conexoes"]` e não existe card com esse id
- **THEN** a validação rejeita o tema indicando a referência quebrada `pool-de-conexoes`

#### Scenario: Termo relacionado que não é concept
- **WHEN** um card lista em `relatedTerms` o id de um card step
- **THEN** a validação rejeita o tema informando que a referência precisa ser um concept

#### Scenario: Concept referenciando a si mesmo
- **WHEN** o concept `cors` lista `cors` em `relatedTerms`
- **THEN** a validação rejeita o tema

### Requirement: Relatório de erros completo
A validação SHALL reportar todos os erros encontrados de uma vez, não apenas o primeiro. Cada erro SHALL ter um caminho legível até o campo (ex.: `decks[1].cards[3].snippets.fastapi`) e uma mensagem em PT-BR. Em caso de sucesso, a validação SHALL devolver o tema com os valores padrão aplicados.

#### Scenario: Vários erros no mesmo tema
- **WHEN** um tema tem um deck com título vazio e um step sem a variante `nest`
- **THEN** a validação devolve os dois erros, cada um com seu caminho

#### Scenario: Sucesso com padrões aplicados
- **WHEN** um tema válido omite `origin`, `tags` e `relatedTerms` em seus cards
- **THEN** a validação devolve o tema com `origin: "original"`, `tags: []` e `relatedTerms: []` em cada card

### Requirement: Conteúdo do repositório validado na suíte de testes
Todo arquivo `content/themes/<theme-id>/theme.json` do repositório SHALL ser validado pela suíte de testes. O `id` do tema MUST ser igual ao nome da pasta. Um conteúdo inválido MUST fazer a suíte falhar, exibindo os erros. Um catálogo sem nenhum tema SHALL ser aceito.

#### Scenario: theme.json inválido no repositório
- **WHEN** existe um `theme.json` com um card de tipo desconhecido
- **THEN** `npm test` falha e mostra o arquivo e o caminho do erro

#### Scenario: Pasta e id divergentes
- **WHEN** a pasta é `content/themes/web-basics` e o tema dentro dela tem id `fundamentos-web`
- **THEN** `npm test` falha indicando a divergência

#### Scenario: Catálogo vazio
- **WHEN** `content/themes/` não contém nenhum tema
- **THEN** a validação do conteúdo do repositório passa
