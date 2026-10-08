## Context

A gaveta do chat (`ChatSheet`) usa uma `ScrollView` dentro de um `KeyboardAvoidingView`. Nada rola a lista quando o conteúdo cresce, e o envio não fecha o teclado. Com o teclado aberto, a área visível fica pequena e a resposta nova cai fora da tela (ver proposal.md, Why).

A investigação descartou API, Gemini e o hook `useCardChat`: a 2ª pergunta chega e é respondida normalmente.

Causa raiz, reproduzida no simulador iOS com respostas falsas: o bloco de código (`MessageText`) usa uma `ScrollView` horizontal, e a `ScrollView` do RN tem `flexGrow: 1` por padrão. Dentro de um balão que se ajusta ao conteúdo, numa lista que rola, essa área calcula a altura errado: o balão ganha espaço vazio, cresce a cada atualização e empurra o resto para baixo. Com as mesmas respostas sem bloco de código, tudo aparece normal.

## Goals / Non-Goals

**Goals:** balão com código do tamanho do conteúdo; a última mensagem sempre visível; o teclado fecha ao enviar.

**Non-Goals:** mudar a estrutura da lista ou o hook da conversa.

## Decisions

- **`flexGrow: 0` na `ScrollView` horizontal do bloco de código**: ela fica só do tamanho do código e não tenta ocupar espaço. É a menor mudança que corrige a causa, verificada no simulador.
  - *Alternativa descartada:* tirar a rolagem horizontal e quebrar as linhas do código. Pioraria a leitura de código com indentação.
  - *Alternativa descartada:* largura fixa no balão. Trataria o sintoma, não a medição da `ScrollView`.

- **Rolar no `onContentSizeChange`** da `ScrollView` (com um `ref` e `scrollToEnd({ animated: true })`). Ele dispara depois de o layout medir o conteúdo novo, seja a pergunta, o "digitando…", a resposta ou o erro.
  - *Alternativa descartada:* `useEffect` em `messages`. Roda antes da medição do balão novo e rolaria para o fim antigo.
  - *Alternativa descartada:* `FlatList` invertida. Exigiria reestruturar o estado vazio, as sugestões e os alertas, para conversas que são curtas.
- **`Keyboard.dismiss()` dentro de `send`** do `ChatSheet`: cobre o botão e as sugestões num só lugar.
- **Chave estável das mensagens** (`${role}-${index}`) no lugar do índice puro. É só higiene: as mensagens só são acrescentadas no fim.

## Risks / Trade-offs

- [O usuário rola para cima para reler e chega conteúdo novo, que o puxa para o fim] → Só acontece quando o conteúdo muda, ou seja, ao enviar ou receber, e é o comportamento esperado de um chat.
- [O teste automatizado não mede layout (o Jest não desenha a tela)] → O teste fixa o estilo `flexGrow: 0` como guarda de regressão, e a verificação final é manual no aparelho.
