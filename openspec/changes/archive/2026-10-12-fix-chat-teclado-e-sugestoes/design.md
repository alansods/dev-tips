## Context

A gaveta (`ChatSheet`) é um `Modal` transparente com um `KeyboardAvoidingView` na raiz (`flex: 1`, `justifyContent: 'flex-end'`) e o painel com `height: '85%'`. O `behavior` era `'padding'` no iOS e `undefined` no Android, contando com o `adjustResize` do sistema. Com o app em edge-to-edge (RN 0.86 / Expo SDK 57; obrigatório no Android 15+), a janela não encolhe mais com o teclado, então no Android nada subia. O RN 0.86 corrigiu o `KeyboardAvoidingView` para edge-to-edge.

As sugestões eram um bloco único renderizado no estado vazio e de novo depois de uma resposta `inScope: false`.

## Goals / Non-Goals

**Goals:** campo visível com teclado nas duas plataformas; sugestões sempre à mão depois da primeira mensagem, sem duplicar.

**Non-Goals:** trocar a gaveta por uma lib de bottom sheet; mexer no teclado de outras telas.

## Decisions

- **`behavior="padding"` nas duas plataformas.** O padding inferior na raiz empurra o painel para cima do teclado, como já acontecia no iOS. `height` foi descartado porque redimensiona o container e briga com o `height: '85%'` do painel. `react-native-keyboard-controller` foi descartado: dependência nativa nova (exige dev build) para algo que o RN 0.86 já resolve.
- **Bloco inicial sempre renderizado no topo da `ScrollView`**, com as mensagens embaixo, em vez de trocar o bloco pelas mensagens. Escolha do usuário: a conversa começa sempre do mesmo jeito e as sugestões ficam no lugar onde a pessoa já as viu. Descartado: linha de chips acima do campo (testada e recusada: duplicaria as sugestões).
- **Sugestão usada = há uma mensagem do usuário com o mesmo texto.** Derivado de `messages`, sem estado novo: some ao tocar ou ao digitar igual, e volta sozinho quando a conversa recomeça em outro card. Sem nenhuma sobrando, a lista não é renderizada.
- **Remover a lista após `inScope: false`**, já que o bloco no topo cobre o caso.

## Risks / Trade-offs

- [Teclado de tablet em modo flutuante/dividido pode não reportar altura] → o `KeyboardAvoidingView` aplica 0 de padding e o layout fica como antes, sem quebra.
- [Numa conversa longa, as sugestões saem da vista ao rolar até a última resposta] → aceito; basta rolar para cima.
