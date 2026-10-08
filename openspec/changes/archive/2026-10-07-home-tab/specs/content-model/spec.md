## ADDED Requirements

### Requirement: Data de inclusão da trilha
Uma trilha MAY declarar `addedAt`, a data em que entrou no catálogo, no formato `AAAA-MM-DD`. A validação MUST rejeitar um valor fora desse formato ou uma data inexistente.

#### Scenario: Data válida
- **WHEN** uma trilha declara `addedAt: "2026-10-06"`
- **THEN** a validação aceita a trilha

#### Scenario: Data inválida
- **WHEN** uma trilha declara `addedAt: "06/10/2026"`
- **THEN** a validação rejeita a trilha com erro no caminho `addedAt`
