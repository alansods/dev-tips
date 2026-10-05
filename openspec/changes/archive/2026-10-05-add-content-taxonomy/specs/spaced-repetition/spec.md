## MODIFIED Requirements

### Requirement: Revisão na Home
O card de cada área na aba Trilhas SHALL mostrar "N para revisar hoje", somando os cards para revisar hoje das trilhas da área, quando houver, e MUST NOT mostrar esse texto quando não houver. O card de cada trilha nas telas de área, linguagem e framework SHALL mostrar o mesmo aviso com os cards daquela trilha.

#### Scenario: Aviso na Home
- **WHEN** 2 cards da trilha CRUD estão para revisar hoje
- **THEN** o card da área Backend na Home mostra "2 para revisar hoje"

#### Scenario: Aviso no card da trilha
- **WHEN** 2 cards da trilha CRUD estão para revisar hoje e o usuário abre a área Backend
- **THEN** o card da trilha mostra "2 para revisar hoje"

#### Scenario: Sem revisão
- **WHEN** nenhum card está para revisar hoje
- **THEN** a Home não mostra "para revisar hoje"
