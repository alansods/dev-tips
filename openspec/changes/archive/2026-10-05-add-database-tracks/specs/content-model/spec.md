## MODIFIED Requirements

### Requirement: Áreas da trilha
Toda trilha SHALL declarar `areas`, uma lista não vazia e sem repetição de áreas. As áreas válidas são, nesta ordem de exibição: `fundamentos` (Fundamentos), `frontend` (Frontend), `backend` (Backend) e `banco-de-dados` (Banco de dados). Uma trilha MAY estar em mais de uma área.

#### Scenario: Trilha sem áreas
- **WHEN** uma trilha não declara `areas` ou declara a lista vazia
- **THEN** a validação rejeita a trilha com erro no caminho `areas`

#### Scenario: Área desconhecida
- **WHEN** uma trilha declara `areas: ["mobile"]`
- **THEN** a validação rejeita a trilha com erro no caminho `areas[0]`

#### Scenario: Área repetida
- **WHEN** uma trilha declara `areas: ["backend", "backend"]`
- **THEN** a validação rejeita a trilha indicando a área repetida `backend`

#### Scenario: Trilha em duas áreas
- **WHEN** uma trilha declara `areas: ["frontend", "backend"]`
- **THEN** a validação aceita a trilha

#### Scenario: Área de banco de dados
- **WHEN** uma trilha declara `areas: ["banco-de-dados"]`
- **THEN** a validação aceita a trilha
