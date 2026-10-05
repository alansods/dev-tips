## MODIFIED Requirements

### Requirement: Áreas da trilha
Toda trilha SHALL declarar `areas`, uma lista não vazia e sem repetição de áreas. As áreas válidas são, nesta ordem de exibição: `fundamentos` (Fundamentos), `frontend` (Frontend), `backend` (Backend), `banco-de-dados` (Banco de dados), `mobile` (Mobile) e `devops` (DevOps e Cloud). Uma trilha MAY estar em mais de uma área.

#### Scenario: Trilha sem áreas
- **WHEN** uma trilha não declara `areas` ou declara a lista vazia
- **THEN** a validação rejeita a trilha com erro no caminho `areas`

#### Scenario: Área desconhecida
- **WHEN** uma trilha declara `areas: ["games"]`
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

#### Scenario: Áreas de mobile e DevOps
- **WHEN** uma trilha declara `areas: ["mobile"]` e outra declara `areas: ["devops"]`
- **THEN** a validação aceita as duas trilhas

### Requirement: Seção da trilha
Uma trilha direta na área (sem `language`, `framework` nem `variants`) MAY declarar `section`, que agrupa as trilhas diretas da área em seções nomeadas. As seções válidas são, nesta ordem de exibição: `relacionais` (Relacionais), `nao-relacionais` (Não relacionais), `ci-cd` (CI/CD) e `aws` (AWS). Uma trilha de linguagem, de framework ou comparativa MUST NOT declarar `section`.

#### Scenario: Trilha direta com seção
- **WHEN** uma trilha direta na área declara `section: "relacionais"`
- **THEN** a validação aceita a trilha

#### Scenario: Seções de DevOps
- **WHEN** uma trilha direta na área declara `section: "ci-cd"` e outra declara `section: "aws"`
- **THEN** a validação aceita as duas trilhas

#### Scenario: Seção desconhecida
- **WHEN** uma trilha declara `section: "colunares"`
- **THEN** a validação rejeita a trilha com erro no caminho `section`

#### Scenario: Seção em trilha de linguagem
- **WHEN** uma trilha declara `language: "java"` e `section: "relacionais"`
- **THEN** a validação rejeita a trilha com erro no caminho `section`
