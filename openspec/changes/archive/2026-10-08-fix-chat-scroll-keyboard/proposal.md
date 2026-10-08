## Why

No chat "Perguntar", a primeira pergunta funciona, mas quando a conversa passa da altura da tela a resposta nova não aparece. Reproduzido no simulador: o balão de uma resposta com bloco de código mede uma altura maior que o conteúdo, cresce a cada atualização e empurra a resposta nova para fora da vista. A conversa também não rolava sozinha até o fim, e o teclado continuava aberto depois do envio, cobrindo a conversa.

## What Changes

- Ao enviar uma pergunta (pelo botão ou por uma sugestão), o teclado fecha.
- O balão de uma resposta com bloco de código mantém a altura do conteúdo.
- A conversa rola sozinha até a última mensagem quando aparecem a pergunta, o "digitando…", a resposta ou um erro.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `card-assistant`: o requisito "Enviar pergunta no app" passa a exigir que o teclado feche no envio, que a última mensagem fique visível e que o balão com bloco de código tenha a altura do conteúdo.

## Impact

- `src/assistant/ChatSheet.tsx` (gaveta do chat) e `src/assistant/MessageText.tsx` (bloco de código).
- Testes de UI do chat (`src/__tests__/card-assistant-ui.test.tsx`).
- Sem mudança na API nem no modelo.

## Fora de escopo

- Mudar o layout da gaveta ou trocar a lista por `FlatList`.
- Respostas em streaming.
- Mudanças na API `/assistant/ask` ou no prompt do Gemini.
