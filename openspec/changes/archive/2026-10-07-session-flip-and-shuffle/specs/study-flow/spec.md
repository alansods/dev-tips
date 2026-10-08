## MODIFIED Requirements

### Requirement: Deck com progresso e ação
Cada deck na tela da trilha SHALL mostrar o título, a quantidade de cards, quantos estão marcados como "já sabia" (ex.: "3/20"), uma barra de progresso proporcional e um botão de ação:
- **Estudar**, quando nenhum card do deck tem resposta registrada. Abre uma sessão com todos os cards;
- **Continuar**, quando algum card tem resposta, mas nem todos estão como "já sabia". Abre uma sessão com os cards que ainda não estão como "já sabia";
- **Estudar de novo**, quando todos os cards estão como "já sabia". Abre uma sessão com todos os cards.

A ordem dos cards dentro da sessão segue o requisito "Sessão de estudo".

#### Scenario: Deck nunca estudado
- **WHEN** nenhum card do deck Glossário tem resposta
- **THEN** o deck mostra "0/24" e o botão "Estudar", que abre uma sessão com os 24 cards

#### Scenario: Continuar de onde parou
- **WHEN** no deck O que vamos criar, 2 cards estão como "já sabia" e 1 como "não sabia"
- **THEN** o deck mostra "2/5" e o botão "Continuar", que abre uma sessão com os 3 cards que não estão como "já sabia"

#### Scenario: Deck dominado
- **WHEN** todos os 5 cards do deck O que vamos criar estão como "já sabia"
- **THEN** o deck mostra "5/5" e o botão "Estudar de novo", que abre uma sessão com os 5 cards

### Requirement: Sessão de estudo
A sessão SHALL abrir em tela cheia, sem a barra de abas. O cabeçalho SHALL ter um botão de sair (rótulo acessível "Sair da sessão"), o título do deck, o contador "posição / total" e uma barra de progresso. A sessão SHALL mostrar um card por vez.

Ao abrir, a sessão SHALL sortear a ordem dos seus cards, e essa ordem MUST ficar fixa até a sessão terminar. Isso vale para toda sessão: a do deck, a revisão de hoje e "Revisar os que errei". Abrir uma nova sessão SHALL sortear de novo.

A exceção são os cards de passo numerado (tipo step), que MUST aparecer em ordem crescente de número, mesmo numa sessão sorteada. O sorteio MUST NOT mudar quais cards entram na sessão.

#### Scenario: Primeiro card
- **WHEN** o usuário abre a sessão de um deck com 20 cards
- **THEN** vê um dos 20 cards pela frente e o contador "1 / 20"

#### Scenario: Ordem sorteada
- **WHEN** o sorteio coloca o card `cors` em primeiro e o usuário abre a sessão do deck
- **THEN** o primeiro card exibido é `cors`, mesmo que ele não seja o primeiro do deck

#### Scenario: Nova ordem a cada sessão
- **WHEN** o usuário abre a sessão de um deck, sai e abre de novo, e o sorteio da segunda vez é diferente
- **THEN** a segunda sessão mostra os cards na nova ordem sorteada

#### Scenario: Passos em ordem
- **WHEN** o usuário abre a sessão de um deck com os passos 1, 2 e 3
- **THEN** os passos aparecem na ordem 1, 2 e 3

#### Scenario: Mesmos cards
- **WHEN** a sessão do deck é aberta com "Continuar" e há 3 cards que não estão como "já sabia"
- **THEN** a sessão tem exatamente esses 3 cards, em ordem sorteada

#### Scenario: Sair no meio
- **WHEN** o usuário respondeu 3 cards e toca em "Sair da sessão"
- **THEN** volta para a tela da trilha, e as 3 respostas continuam registradas no progresso

### Requirement: Virar e responder
Cada card SHALL começar pela frente. Tocar no card ou no botão "Mostrar resposta" SHALL mostrar o verso. Com o verso visível, a sessão SHALL mostrar o botão "Ver pergunta", e tocar nele ou no card SHALL voltar para a frente. O usuário SHALL poder alternar entre frente e verso quantas vezes quiser.

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

### Requirement: Resumo da sessão
Ao responder o último card, a sessão SHALL mostrar o resumo:
- quantos cards foram marcados como "já sabia" e como "não sabia" nesta sessão, com esses rótulos;
- a lista dos cards marcados como "não sabia", identificados pelo tipo e pelo título;
- o botão **Revisar os que errei**, só quando houver algum "não sabia". Ele inicia uma nova sessão apenas com esses cards, com a ordem sorteada de novo como no requisito "Sessão de estudo";
- o botão **Voltar à trilha**.

#### Scenario: Resumo com erros
- **WHEN** numa sessão de 5 cards o usuário marcou 3 "já sabia" e 2 "não sabia"
- **THEN** o resumo mostra "3 já sabia" e "2 não sabia", lista os 2 cards, e "Revisar os que errei" abre uma sessão de 2 cards

#### Scenario: Resumo sem erros
- **WHEN** o usuário marcou todos os cards como "já sabia"
- **THEN** o resumo não mostra o botão "Revisar os que errei" nem a lista para revisar
