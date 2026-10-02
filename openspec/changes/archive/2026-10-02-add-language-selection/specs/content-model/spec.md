## ADDED Requirements

### Requirement: Tradução de um tema
Um tema MAY ter um arquivo de tradução para inglês em `content/themes/<theme-id>/translations/en.json`. O arquivo SHALL conter só textos exibidos, organizados por id: `title` e `description` do tema; `title` e `description` de cada deck, por id do deck; e, por id do card, os campos de texto do tipo daquele card (`description`, `title`, `whatIs`, `whyItMatters`, `concept`, `explanation`, `values`, `term`, `definition`, `frontendAnalogy`, `aliases`, `body`, `question`, `answer`, `tags`, e `note` dos snippets, por id de variante quando o card tem vários snippets). Rótulos de colunas de comparação MAY ser traduzidos, por id da coluna. Todos os campos são opcionais. A validação SHALL rejeitar, com o caminho do problema no relatório de erros:
- id de deck, card, variante ou coluna que não existe no tema;
- campo que não é de texto exibido ou que não pertence ao tipo do card (ex.: `code`, `method`, `path`, `definition` num card step);
- texto vazio.

#### Scenario: Tradução válida
- **WHEN** `translations/en.json` traduz o título do tema e a `definition` do card concept `cors`
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
- **THEN** todo arquivo `translations/en.json` em `content/themes/` é validado contra o tema correspondente, e um erro faz a suíte falhar
