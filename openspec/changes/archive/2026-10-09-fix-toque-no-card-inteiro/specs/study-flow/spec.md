## MODIFIED Requirements

### Requirement: Virar e responder
Cada card SHALL começar pela frente. Tocar no card ou no botão "Mostrar resposta" SHALL mostrar o verso. Com o verso visível, a sessão SHALL mostrar o botão "Ver pergunta", e tocar nele ou no card SHALL voltar para a frente. O usuário SHALL poder alternar entre frente e verso quantas vezes quiser. A área de toque SHALL ser o card inteiro, nas duas faces, incluindo as bordas internas e o espaço vazio abaixo do conteúdo. Os elementos tocáveis dentro do card (abas de framework, termos relacionados e "Ver pergunta") MUST continuar respondendo ao próprio toque, e um verso maior que o card MUST continuar rolando.

Os botões "Não sabia" e "Já sabia" SHALL aparecer só com o verso visível. Tocar em um deles SHALL registrar a resposta para aquele card e avançar para o próximo, que começa pela frente. Depois do último card, a sessão SHALL mostrar o resumo.

#### Scenario: Virar o card
- **WHEN** o usuário toca em "Mostrar resposta"
- **THEN** o verso aparece e os botões "Não sabia" e "Já sabia" ficam disponíveis

#### Scenario: Voltar para a pergunta
- **WHEN** o verso está visível e o usuário toca em "Ver pergunta"
- **THEN** a frente aparece de novo, com o botão "Mostrar resposta", e os botões "Não sabia" e "Já sabia" deixam de estar disponíveis

#### Scenario: Tocar no verso
- **WHEN** o verso está visível e o usuário toca no card
- **THEN** a frente aparece de novo

#### Scenario: Virar de novo
- **WHEN** o usuário voltou para a frente e toca em "Mostrar resposta"
- **THEN** o verso aparece de novo, e responder registra o card normalmente

#### Scenario: Responder e avançar
- **WHEN** o verso do card 1 de 5 está visível e o usuário toca em "Já sabia"
- **THEN** o card fica registrado como "já sabia" e a sessão mostra a frente do card 2, com o contador "2 / 5"

#### Scenario: Não responder sem ver o verso
- **WHEN** o card está pela frente
- **THEN** os botões "Já sabia" e "Não sabia" não estão disponíveis

#### Scenario: Tocar no espaço vazio da frente
- **WHEN** a frente de um card curto está visível e o usuário toca no espaço vazio abaixo do texto
- **THEN** o verso aparece

#### Scenario: Tocar no espaço vazio do verso
- **WHEN** o verso de um card curto está visível e o usuário toca no espaço vazio abaixo do conteúdo
- **THEN** a frente aparece de novo
