## MODIFIED Requirements

### Requirement: Enviar pergunta no app
Enviar uma pergunta, tocando em "Enviar pergunta" ou numa sugestão, SHALL:
- fechar o teclado;
- mostrar a mensagem do usuário;
- mostrar "digitando…" até a resposta chegar;
- mostrar a resposta do assistente.

A conversa SHALL rolar até a última mensagem sempre que aparecer uma pergunta, o "digitando…", uma resposta ou um aviso de erro, para que o conteúdo mais novo fique visível, inclusive a partir da segunda pergunta.

Trechos entre três crases (```) SHALL aparecer como bloco de código em fonte mono, que rola na horizontal quando a linha não cabe. O balão de uma resposta com bloco de código SHALL ter a altura do seu conteúdo, sem espaço vazio, mesmo quando a conversa passa da altura da gaveta. O app SHALL enviar à API o texto do card no idioma atual, as últimas 6 mensagens da conversa e o idioma do app. Depois de uma resposta, o uso de perguntas do plano mostrado no app SHALL ser atualizado com o `questions` da resposta. Uma resposta com `inScope` igual a `false` SHALL aparecer com o rótulo "Fora deste card", seguida das três sugestões.

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
- **THEN** a resposta aparece com o rótulo "Fora deste card" e as três sugestões
