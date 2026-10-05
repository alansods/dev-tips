## MODIFIED Requirements

### Requirement: Identidade, variantes e colunas da trilha
A trilha SHALL estar em `content/tracks/crud-4-frameworks/track.json`, com id `crud-4-frameworks`, título "O mesmo CRUD em quatro frameworks" e `areas: ["backend"]`. Por declarar variantes, a trilha é comparativa e MUST NOT declarar `language` nem `framework`. As variantes MUST ser, nesta ordem: `express` (Express), `spring` (Spring Boot), `nest` (NestJS) e `fastapi` (FastAPI). As colunas de comparação MUST ser, nesta ordem: `frontend`, `spring`, `express`, `nest` e `fastapi`.

#### Scenario: Trilha válida no catálogo
- **WHEN** o gate de conteúdo do repositório valida `content/tracks/`
- **THEN** a trilha `crud-4-frameworks` é aceita sem erros

#### Scenario: Ordem de variantes e colunas
- **WHEN** a trilha é carregada
- **THEN** as variantes são express, spring, nest, fastapi e as colunas são frontend, spring, express, nest, fastapi, nessa ordem

#### Scenario: Comparativa em Backend
- **WHEN** o usuário abre a área Backend
- **THEN** a trilha aparece na seção "Comparativos"
