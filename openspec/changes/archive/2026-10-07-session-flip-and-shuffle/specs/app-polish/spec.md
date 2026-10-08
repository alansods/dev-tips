## MODIFIED Requirements

### Requirement: Animação de virar o card
Ao mostrar o verso de um card, ou ao voltar dele para a frente, a sessão SHALL animar a troca: o lado atual gira até sumir e o outro aparece, em até 300 ms. Quando o sistema estiver com "reduzir movimento" ativado, a troca SHALL ser imediata, sem animação.

A animação MUST NOT atrasar nem bloquear os botões da sessão:
- ao pedir o verso, "Não sabia" e "Já sabia" aparecem assim que o verso é pedido;
- ao voltar para a frente, "Mostrar resposta" aparece assim que a frente é pedida.

#### Scenario: Duração da animação
- **WHEN** o usuário pede o verso com "reduzir movimento" desativado
- **THEN** a animação de virar dura entre 150 e 300 ms

#### Scenario: Reduzir movimento
- **WHEN** o usuário pede o verso com "reduzir movimento" ativado
- **THEN** o verso aparece sem animação (duração 0)

#### Scenario: Botões disponíveis durante a animação
- **WHEN** o usuário toca em "Mostrar resposta"
- **THEN** os botões "Não sabia" e "Já sabia" ficam disponíveis imediatamente

#### Scenario: Voltar para a frente com animação
- **WHEN** o verso está visível, "reduzir movimento" está desativado e o usuário toca em "Ver pergunta"
- **THEN** a frente aparece com a mesma animação de virar, e o botão "Mostrar resposta" fica disponível imediatamente
