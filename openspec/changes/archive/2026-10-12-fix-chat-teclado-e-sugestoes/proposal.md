## Why

No tablet Android, o teclado abre por cima do campo do chat do card e a pessoa não vê o que digita. Além disso, as sugestões de pergunta somem depois da primeira mensagem, e quem quer pedir "Me dê um exemplo" de novo precisa digitar.

## What Changes

- O campo "Pergunte sobre este card…" e o botão "Enviar pergunta" sobem junto com o teclado, no iOS e no Android.
- O bloco inicial ("O que ficou confuso?", as três sugestões e a nota) continua no topo da conversa depois da primeira mensagem, com as mensagens embaixo; as sugestões ficam desabilitadas enquanto "digitando…" aparece, e a sugestão já usada some, ficando só as que ainda não foram perguntadas.
- A resposta "Fora deste card" deixa de repetir a lista de sugestões depois da resposta (ela já está no topo).

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `card-assistant`: requisitos "Chat do card" (campo acima do teclado, bloco inicial com sugestões permanece) e "Enviar pergunta no app" (resposta fora do escopo sem lista repetida).

## Impact

- `src/assistant/ChatSheet.tsx` (layout com teclado e bloco inicial permanente).
- `src/__tests__/card-assistant-ui.test.tsx`.
- Sem mudança na API, no plano ou em dependências.

## Fora de escopo

- Trocar as sugestões por outras ou gerá-las a partir da resposta.
- Mudar o comportamento do teclado em outras telas (glossário, trilhas).
