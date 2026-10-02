## Purpose

Define o conteúdo do tema "Fundamentos web" (HTTP, REST, navegador e segurança, e perguntas de entrevista) e como ele se liga ao glossário.

## ADDED Requirements

### Requirement: Identidade do tema
O tema SHALL estar em `content/themes/fundamentos-web/theme.json`, com id `fundamentos-web` e título "Fundamentos web", registrado no catálogo do app depois do tema CRUD. O tema MUST NOT declarar `variants` nem `compareColumns`.

#### Scenario: Tema no catálogo
- **WHEN** o catálogo é carregado
- **THEN** ele contém, nesta ordem, os temas `crud-4-frameworks` e `fundamentos-web`

#### Scenario: Tema na Home
- **WHEN** a aba Temas é exibida
- **THEN** os cards "O mesmo CRUD em quatro frameworks" e "Fundamentos web" aparecem, nessa ordem

#### Scenario: Sem frameworks
- **WHEN** a tela do tema Fundamentos web é aberta
- **THEN** ela não mostra a lista de frameworks

### Requirement: Decks e contagens
O tema SHALL ter exatamente 4 decks, nesta ordem: `http` (7 cards `concept`), `rest` (6 cards `concept`), `navegador-e-seguranca` (8 cards `concept`) e `perguntas-de-entrevista` (6 cards `question`). Os termos MUST NOT repetir termos do tema CRUD (comparação sem diferenciar maiúsculas).

#### Scenario: Contagem por deck
- **WHEN** o tema é carregado
- **THEN** os decks têm 7, 6 e 8 concepts e 6 questions, respectivamente, num total de 27 cards

#### Scenario: Sem termos repetidos entre temas
- **WHEN** os glossários dos dois temas são comparados
- **THEN** nenhum termo aparece nos dois

### Requirement: Conteúdo autoral
Como o tema não deriva de um material externo, todos os seus cards SHALL ter `origin: "original"` e MUST NOT exibir o selo "Complemento".

#### Scenario: Sem complementos
- **WHEN** todos os cards do tema são lidos
- **THEN** nenhum tem `origin: "supplement"`

### Requirement: Ligação com o glossário
Todo card do tema SHALL ter pelo menos um termo em `relatedTerms`, apontando para concepts do próprio tema.

#### Scenario: Todos os cards ligados
- **WHEN** os cards do tema são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Pergunta ligada aos termos que cita
- **WHEN** a pergunta "Qual a diferença entre XSS e CSRF?" é lida
- **THEN** seus `relatedTerms` incluem os concepts de XSS e de CSRF
