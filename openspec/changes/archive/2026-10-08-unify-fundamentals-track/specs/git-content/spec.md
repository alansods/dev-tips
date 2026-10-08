## MODIFIED Requirements

### Requirement: Trilha de Git no catálogo
O catálogo SHALL ter a trilha `git-e-colaboracao` ("Git e colaboração"), registrada logo depois de `build-e-bundlers`, em `content/tracks/git-e-colaboracao/track.json`, com `areas: ["fundamentos"]`, sem `language`, `framework`, `variants` nem `section`.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `git-e-colaboracao` logo depois de `build-e-bundlers`, na área Fundamentos, como trilha direta

#### Scenario: Área Fundamentos
- **WHEN** o usuário abre a área Fundamentos
- **THEN** a seção "Trilhas" lista "Fundamentos de programação e web" e depois "Git e colaboração"

#### Scenario: Só em Fundamentos
- **WHEN** o usuário abre a área DevOps e Cloud
- **THEN** a tela não lista "Git e colaboração"
