## MODIFIED Requirements

### Requirement: Deck com progresso e ação
Cada deck na tela do tema SHALL mostrar o título, a quantidade de cards, quantos estão marcados como "já sabia" (ex.: "3/20"), uma barra de progresso proporcional e um botão de ação:
- **Estudar**, quando nenhum card do deck tem resposta registrada. Abre uma sessão com todos os cards, na ordem do deck;
- **Continuar**, quando algum card tem resposta, mas nem todos estão como "já sabia". Abre uma sessão com os cards que ainda não estão como "já sabia", na ordem do deck;
- **Estudar de novo**, quando todos os cards estão como "já sabia". Abre uma sessão com todos os cards.

#### Scenario: Deck nunca estudado
- **WHEN** nenhum card do deck Glossário tem resposta
- **THEN** o deck mostra "0/24" e o botão "Estudar", que abre uma sessão com os 24 cards

#### Scenario: Continuar de onde parou
- **WHEN** no deck O que vamos criar, 2 cards estão como "já sabia" e 1 como "não sabia"
- **THEN** o deck mostra "2/5" e o botão "Continuar", que abre uma sessão com os 3 cards que não estão como "já sabia"

#### Scenario: Deck dominado
- **WHEN** todos os 5 cards do deck O que vamos criar estão como "já sabia"
- **THEN** o deck mostra "5/5" e o botão "Estudar de novo", que abre uma sessão com os 5 cards

### Requirement: Virar e responder
Cada card SHALL começar pela frente. Tocar no card ou no botão "Mostrar resposta" SHALL mostrar o verso. Só com o verso visível SHALL aparecer os botões "Não sabia" e "Já sabia". Tocar em um deles SHALL registrar a resposta para aquele card e avançar para o próximo, que começa pela frente. Depois do último card, a sessão SHALL mostrar o resumo.

#### Scenario: Virar o card
- **WHEN** o usuário toca em "Mostrar resposta"
- **THEN** o verso aparece e os botões "Não sabia" e "Já sabia" ficam disponíveis

#### Scenario: Responder e avançar
- **WHEN** o verso do card 1 de 5 está visível e o usuário toca em "Já sabia"
- **THEN** o card fica registrado como "já sabia" e a sessão mostra a frente do card 2, com o contador "2 / 5"

#### Scenario: Não responder sem ver o verso
- **WHEN** o card está pela frente
- **THEN** os botões "Já sabia" e "Não sabia" não estão disponíveis

### Requirement: Resumo da sessão
Ao responder o último card, a sessão SHALL mostrar o resumo:
- quantos cards foram marcados como "já sabia" e como "não sabia" nesta sessão, com esses rótulos;
- a lista dos cards marcados como "não sabia", identificados pelo tipo e pelo título;
- o botão **Revisar os que errei**, só quando houver algum "não sabia", que inicia uma nova sessão apenas com esses cards, na mesma ordem;
- o botão **Voltar ao tema**.

#### Scenario: Resumo com erros
- **WHEN** numa sessão de 5 cards o usuário marcou 3 "já sabia" e 2 "não sabia"
- **THEN** o resumo mostra "3 já sabia" e "2 não sabia", lista os 2 cards, e "Revisar os que errei" abre uma sessão de 2 cards

#### Scenario: Resumo sem erros
- **WHEN** o usuário marcou todos os cards como "já sabia"
- **THEN** o resumo não mostra o botão "Revisar os que errei" nem a lista para revisar

### Requirement: Progresso de cada card
O progresso de cada card SHALL ser a última resposta registrada ("já sabia" ou "não sabia"), ou nenhuma. Ele SHALL valer para todo o app: a tela do tema e a aba Temas refletem cada resposta assim que é registrada. Responder um card de novo SHALL substituir a resposta anterior. A persistência entre aberturas do app é definida pela capability `progress`.

#### Scenario: Progresso refletido na tela do tema
- **WHEN** o usuário marca 2 cards do Glossário como "já sabia" e volta para a tela do tema
- **THEN** o deck Glossário mostra "2/24", e o total de "já sabia" do tema aumentou em 2

#### Scenario: Resposta substituída
- **WHEN** um card marcado como "não sabia" é marcado como "já sabia" numa nova sessão
- **THEN** ele passa a contar como "já sabia"
