## MODIFIED Requirements

### Requirement: Identidade da trilha
A trilha SHALL estar em `content/tracks/fundamentos-web/track.json`, com id `fundamentos-web`, título "Fundamentos web" e `areas: ["fundamentos"]`, registrada no catálogo do app depois da trilha CRUD. A trilha MUST NOT declarar `variants`, `compareColumns`, `language` nem `framework`.

#### Scenario: Trilha no catálogo
- **WHEN** o catálogo é carregado
- **THEN** ele contém, nesta ordem, as trilhas `crud-4-frameworks` e `fundamentos-web`

#### Scenario: Trilha na área Fundamentos
- **WHEN** o usuário abre a área Fundamentos
- **THEN** o card "Fundamentos web" aparece na seção "Trilhas"

#### Scenario: Sem frameworks
- **WHEN** a tela da trilha Fundamentos web é aberta
- **THEN** ela não mostra a lista de frameworks
