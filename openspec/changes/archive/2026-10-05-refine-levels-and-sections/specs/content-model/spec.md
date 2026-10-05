## ADDED Requirements

### Requirement: Seção da trilha
Uma trilha direta na área (sem `language`, `framework` nem `variants`) MAY declarar `section`, que agrupa as trilhas diretas da área em seções nomeadas. As seções válidas são, nesta ordem de exibição: `relacionais` (Relacionais) e `nao-relacionais` (Não relacionais). Uma trilha de linguagem, de framework ou comparativa MUST NOT declarar `section`.

#### Scenario: Trilha direta com seção
- **WHEN** uma trilha direta na área declara `section: "relacionais"`
- **THEN** a validação aceita a trilha

#### Scenario: Seção desconhecida
- **WHEN** uma trilha declara `section: "colunares"`
- **THEN** a validação rejeita a trilha com erro no caminho `section`

#### Scenario: Seção em trilha de linguagem
- **WHEN** uma trilha declara `language: "java"` e `section: "relacionais"`
- **THEN** a validação rejeita a trilha com erro no caminho `section`
