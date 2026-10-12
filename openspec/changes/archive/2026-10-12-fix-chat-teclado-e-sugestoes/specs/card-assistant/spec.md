## MODIFIED Requirements

### Requirement: Chat do card
O chat SHALL abrir numa gaveta inferior e mostrar:
- o título "Dúvidas sobre este card" e um botão "Fechar";
- um chip com o tipo e o título do card;
- no topo da conversa, com ou sem mensagens:
  - "O que ficou confuso?" e "Respondo só sobre este card. Escolha uma sugestão ou escreva sua pergunta.";
  - as sugestões "Explique de outro jeito", "Me dê um exemplo" e "Por que isso importa?", desabilitadas enquanto "digitando…" aparece; uma sugestão que já é pergunta da conversa (tocada ou escrita igual) SHALL sumir, e as outras continuam;
  - a nota "A conversa recomeça quando você muda de card.";
- as mensagens, abaixo desse bloco;
- o campo "Pergunte sobre este card…" (até 500 caracteres) e o botão "Enviar pergunta", desabilitado com o campo vazio;
- o aviso "Respostas geradas por IA podem conter erros.".

Com o teclado aberto, no iOS e no Android, o campo e o botão "Enviar pergunta" SHALL ficar visíveis acima do teclado.

A gaveta SHALL fechar pelo botão "Fechar" ou tocando fora dela. Fechar e reabrir no mesmo card SHALL manter a conversa. Ao passar para outro card, a conversa SHALL recomeçar vazia.

#### Scenario: Chat vazio
- **WHEN** um assinante abre o chat do card "Closure com estado privado"
- **THEN** vê "Dúvidas sobre este card", o chip com "Closure com estado privado", "O que ficou confuso?", as três sugestões e o botão "Enviar pergunta" desabilitado

#### Scenario: Campo acima do teclado
- **WHEN** o assinante, no iOS ou no Android, toca no campo "Pergunte sobre este card…" e o teclado abre
- **THEN** o campo e o botão "Enviar pergunta" continuam visíveis acima do teclado

#### Scenario: Sugestões depois da resposta
- **WHEN** o assinante já recebeu uma resposta
- **THEN** "O que ficou confuso?" e as três sugestões continuam no topo da conversa, antes das mensagens, e tocar em "Me dê um exemplo" envia essa pergunta

#### Scenario: Sugestão usada some
- **WHEN** o assinante toca em "Me dê um exemplo" e a resposta chega
- **THEN** "Me dê um exemplo" não aparece mais entre as sugestões, e "Explique de outro jeito" e "Por que isso importa?" continuam

#### Scenario: Todas as sugestões usadas
- **WHEN** o assinante já enviou as três sugestões
- **THEN** nenhuma sugestão aparece, e "O que ficou confuso?" continua no topo

#### Scenario: Sugestões durante o envio
- **WHEN** a conversa tem mensagens e "digitando…" está aparecendo
- **THEN** as três sugestões aparecem desabilitadas

#### Scenario: Conversa recomeça em outro card
- **WHEN** o assinante conversou no card 1, respondeu o card e abriu o chat no card 2
- **THEN** o chat do card 2 está vazio

#### Scenario: Reabrir no mesmo card
- **WHEN** o assinante conversou, fechou o chat e o abriu de novo no mesmo card
- **THEN** as mensagens anteriores continuam lá

### Requirement: Enviar pergunta no app
Enviar uma pergunta, tocando em "Enviar pergunta" ou numa sugestão, SHALL:
- fechar o teclado;
- mostrar a mensagem do usuário;
- mostrar "digitando…" até a resposta chegar;
- mostrar a resposta do assistente.

A conversa SHALL rolar até a última mensagem sempre que aparecer uma pergunta, o "digitando…", uma resposta ou um aviso de erro, para que o conteúdo mais novo fique visível, inclusive a partir da segunda pergunta.

Trechos entre três crases (```) SHALL aparecer como bloco de código em fonte mono, que rola na horizontal quando a linha não cabe. O balão de uma resposta com bloco de código SHALL ter a altura do seu conteúdo, sem espaço vazio, mesmo quando a conversa passa da altura da gaveta. O app SHALL enviar à API o texto do card no idioma atual, as últimas 6 mensagens da conversa e o idioma do app. Depois de uma resposta, o uso de perguntas do plano mostrado no app SHALL ser atualizado com o `questions` da resposta. Uma resposta com `inScope` igual a `false` SHALL aparecer com o rótulo "Fora deste card"; as sugestões continuam no topo da conversa, sem se repetir depois da resposta.

#### Scenario: Pergunta e resposta
- **WHEN** o assinante escreve "Por que o count não volta a 0?" e toca em "Enviar pergunta"
- **THEN** a pergunta aparece, "digitando…" aparece enquanto a API não responde, e depois aparece a resposta

#### Scenario: Segunda pergunta
- **WHEN** o assinante já recebeu uma resposta e envia outra pergunta
- **THEN** as duas perguntas e as duas respostas aparecem em ordem, e a conversa rola até a resposta nova

#### Scenario: Teclado fecha ao enviar
- **WHEN** o assinante toca em "Enviar pergunta" ou numa sugestão
- **THEN** o teclado fecha

#### Scenario: Sugestão
- **WHEN** o assinante toca em "Me dê um exemplo"
- **THEN** a pergunta "Me dê um exemplo" é enviada

#### Scenario: Bloco de código
- **WHEN** a resposta contém um trecho entre três crases
- **THEN** o trecho aparece num bloco de código

#### Scenario: Conversa longa com código
- **WHEN** a conversa passa da altura da gaveta e uma resposta anterior tem bloco de código
- **THEN** o balão dessa resposta mantém a altura do conteúdo, e a resposta nova aparece logo abaixo, visível

#### Scenario: Fora deste card
- **WHEN** a API responde com `inScope` igual a `false`
- **THEN** a resposta aparece com o rótulo "Fora deste card", e cada sugestão ainda não usada aparece uma vez só, no topo da conversa
