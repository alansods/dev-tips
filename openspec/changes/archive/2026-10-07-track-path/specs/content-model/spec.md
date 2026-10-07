## ADDED Requirements

### Requirement: Pré-requisitos da trilha
Uma trilha MAY declarar `prerequisites`, uma lista de ids de trilhas que convém estudar antes dela. Sem o campo, a lista é vazia. Na validação do catálogo:
- cada id MUST ser o id de uma trilha do catálogo;
- uma trilha MUST NOT listar a si mesma;
- os pré-requisitos MUST NOT formar ciclo.

O catálogo do repositório SHALL ser validado pela suíte de testes.

#### Scenario: Pré-requisito válido
- **WHEN** a trilha Next.js declara `prerequisites: ["react"]` e a trilha `react` está no catálogo
- **THEN** a validação aceita o catálogo

#### Scenario: Pré-requisito inexistente
- **WHEN** uma trilha declara `prerequisites: ["kotlin"]` e não há trilha `kotlin` no catálogo
- **THEN** a validação rejeita o catálogo com erro no caminho `prerequisites[0]` dessa trilha

#### Scenario: Trilha depende de si mesma
- **WHEN** a trilha `react` declara `prerequisites: ["react"]`
- **THEN** a validação rejeita o catálogo com erro no caminho `prerequisites[0]`

#### Scenario: Ciclo
- **WHEN** a trilha `a` declara `prerequisites: ["b"]` e a trilha `b` declara `prerequisites: ["a"]`
- **THEN** a validação rejeita o catálogo indicando o ciclo entre `a` e `b`

#### Scenario: Sem pré-requisitos
- **WHEN** a trilha "Fundamentos web" não declara `prerequisites`
- **THEN** a validação aceita a trilha, com a lista de pré-requisitos vazia
