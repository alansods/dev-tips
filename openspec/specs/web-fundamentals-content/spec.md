# web-fundamentals-content Specification

## Purpose

Define o conteúdo da trilha "Fundamentos web" (HTTP, REST, navegador e segurança, e perguntas de entrevista) e como ele se liga ao glossário.
## Requirements
### Requirement: Identidade da trilha
A trilha SHALL estar em `content/tracks/fundamentos-web/track.json`, com id `fundamentos-web` e título "Fundamentos web", registrado no catálogo do app depois da trilha CRUD. A trilha MUST NOT declarar `variants` nem `compareColumns`.

#### Scenario: Trilha no catálogo
- **WHEN** o catálogo é carregado
- **THEN** ele contém, nesta ordem, as trilhas `crud-4-frameworks` e `fundamentos-web`

#### Scenario: Trilha na Home
- **WHEN** a aba Trilhas é exibida
- **THEN** os cards "O mesmo CRUD em quatro frameworks" e "Fundamentos web" aparecem, nessa ordem

#### Scenario: Sem frameworks
- **WHEN** a tela da trilha Fundamentos web é aberta
- **THEN** ela não mostra a lista de frameworks

### Requirement: Decks e contagens
A trilha SHALL ter exatamente 4 decks, nesta ordem: `http` (7 cards `concept`), `rest` (6 cards `concept`), `navegador-e-seguranca` (8 cards `concept`) e `perguntas-de-entrevista` (6 cards `question`). Os termos MUST NOT repetir termos da trilha CRUD (comparação sem diferenciar maiúsculas).

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** os decks têm 7, 6 e 8 concepts e 6 questions, respectivamente, num total de 27 cards

#### Scenario: Sem termos repetidos entre trilhas
- **WHEN** os glossários das duas trilhas são comparados
- **THEN** nenhum termo aparece nos dois

### Requirement: Conteúdo autoral
Como a trilha não deriva de um material externo, todos os seus cards SHALL ter `origin: "original"` e MUST NOT exibir o selo "Complemento".

#### Scenario: Sem complementos
- **WHEN** todos os cards da trilha são lidos
- **THEN** nenhum tem `origin: "supplement"`

### Requirement: Ligação com o glossário
Todo card da trilha SHALL ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

#### Scenario: Todos os cards ligados
- **WHEN** os cards da trilha são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Pergunta ligada aos termos que cita
- **WHEN** a pergunta "Qual a diferença entre XSS e CSRF?" é lida
- **THEN** seus `relatedTerms` incluem os concepts de XSS e de CSRF

### Requirement: Tradução completa para inglês
A trilha SHALL ter o arquivo `content/tracks/fundamentos-web/translations/en.json`, registrado no app. Todo texto exibido da trilha SHALL ter tradução para inglês: título e descrição da trilha, título e descrição de cada deck, e os campos de texto de cada card (`description`, `title`, `whatIs`, `whyItMatters`, `concept`, `explanation`, `term`, `definition`, `frontendAnalogy`, `body`, `question`, `answer` e `note` dos snippets). Ficam fora da cobertura: código, nomes de arquivo, `tags` (não exibidas), `aliases`. Nomes próprios e termos técnicos consagrados (ex.: HTTP, REST, Cookie, JWT) MUST ficar no original. O conteúdo em PT-BR MUST NOT mudar.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Card exibido em inglês
- **WHEN** o app está em inglês e o usuário abre o card concept "Cookie" e uma pergunta de entrevista
- **THEN** o card aparece em inglês

#### Scenario: PT-BR intacto
- **WHEN** o app está em PT-BR
- **THEN** a trilha aparece com o título "Fundamentos web" e os textos originais

