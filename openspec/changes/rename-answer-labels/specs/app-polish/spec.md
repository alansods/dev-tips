## MODIFIED Requirements

### Requirement: Animação de virar o card
Ao mostrar o verso de um card, a sessão SHALL animar a troca, com a frente girando até sumir e o verso aparecendo, em até 300 ms. Quando o sistema estiver com "reduzir movimento" ativado, a troca SHALL ser imediata, sem animação. A animação MUST NOT atrasar nem bloquear os botões "Não sabia" e "Já sabia", que aparecem assim que o verso é pedido.

#### Scenario: Duração da animação
- **WHEN** o usuário pede o verso com "reduzir movimento" desativado
- **THEN** a animação de virar dura entre 150 e 300 ms

#### Scenario: Reduzir movimento
- **WHEN** o usuário pede o verso com "reduzir movimento" ativado
- **THEN** o verso aparece sem animação (duração 0)

#### Scenario: Botões disponíveis durante a animação
- **WHEN** o usuário toca em "Mostrar resposta"
- **THEN** os botões "Não sabia" e "Já sabia" ficam disponíveis imediatamente
