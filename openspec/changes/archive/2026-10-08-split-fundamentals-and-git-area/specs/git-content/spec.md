## ADDED Requirements

### Requirement: Trilha de Git na área Git
O catálogo SHALL ter a trilha `git-e-colaboracao` ("Git e colaboração"), registrada logo depois de `build-e-bundlers`, em `content/tracks/git-e-colaboracao/track.json`, com `areas: ["git"]`, sem `language`, `framework`, `variants` nem `section`. Git tem uma área própria, separada de Fundamentos.

#### Scenario: Trilha registrada
- **WHEN** o catálogo é carregado
- **THEN** ele contém a trilha `git-e-colaboracao` logo depois de `build-e-bundlers`, na área Git, como trilha direta

#### Scenario: Área Git
- **WHEN** o usuário abre a área Git
- **THEN** a seção "Trilhas" lista "Git e colaboração"

#### Scenario: Fora de Fundamentos
- **WHEN** o usuário abre a área Fundamentos ou a área DevOps e Cloud
- **THEN** a tela não lista "Git e colaboração"

## REMOVED Requirements

### Requirement: Trilha de Git no catálogo
**Reason**: A trilha saiu da área Fundamentos para a área própria Git.
**Migration**: Substituído pelo requisito "Trilha de Git na área Git".
