## ADDED Requirements

### Requirement: Tradução completa para inglês
O tema SHALL ter o arquivo `content/themes/fundamentos-web/translations/en.json`, registrado no app. Todo texto exibido do tema SHALL ter tradução para inglês: título e descrição do tema, título e descrição de cada deck, e os campos de texto de cada card (`description`, `title`, `whatIs`, `whyItMatters`, `concept`, `explanation`, `term`, `definition`, `frontendAnalogy`, `body`, `question`, `answer` e `note` dos snippets). Ficam fora da cobertura: código, nomes de arquivo, `tags` (não exibidas), `aliases`. Nomes próprios e termos técnicos consagrados (ex.: HTTP, REST, Cookie, JWT) MUST ficar no original. O conteúdo em PT-BR MUST NOT mudar.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara o tema com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Card exibido em inglês
- **WHEN** o app está em inglês e o usuário abre o card concept "Cookie" e uma pergunta de entrevista
- **THEN** o card aparece em inglês

#### Scenario: PT-BR intacto
- **WHEN** o app está em PT-BR
- **THEN** o tema aparece com o título "Fundamentos web" e os textos originais
