## MODIFIED Requirements

### Requirement: Trilha de estado e dados no catálogo
O catálogo SHALL ter a trilha `estado-e-dados-no-react` ("Estado e dados no React"), registrada logo depois de `deploy-na-aws`, em `content/tracks/estado-e-dados-no-react/track.json`, com `areas: ["frontend", "mobile"]`, `language: "javascript"` e `framework: "react"`, sem `variants` nem `section`.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `estado-e-dados-no-react` logo depois de `deploy-na-aws`, nas áreas Frontend e Mobile, com a linguagem `javascript` e o framework `react`

#### Scenario: Framework React no Frontend
- **WHEN** o usuário abre Frontend › JavaScript › React
- **THEN** a tela lista "Estado e dados no React" logo depois de "React"

#### Scenario: Framework React no Mobile
- **WHEN** o usuário abre Mobile › JavaScript › React
- **THEN** a tela lista "Estado e dados no React" primeiro e não lista a trilha "React"
