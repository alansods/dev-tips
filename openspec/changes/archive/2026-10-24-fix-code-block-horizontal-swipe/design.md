## Context

Em `src/study/StudySession.tsx`, o verso do card é um `Pressable` que ocupa o card inteiro e vira o card no `onPress`. Dentro dele, o `CodeBlock` (`src/components/cards/parts.tsx`) mostra o código num `ScrollView horizontal`.

No responder system do React Native, o `ScrollView` não pede o toque quando ele começa (só se já estiver animando). Quem pede é o `Pressable` do card, que vira o dono do toque (JS responder).

No iOS (Fabric), o `ScrollView` nativo se recusa a rolar enquanto **algum ancestral** dele for o dono do toque: `_shouldDisableScrollInteraction` sobe pela árvore procurando `isJSResponder`, e `touchesShouldCancelInContentView` devolve `NO` (`RCTScrollViewComponentView.mm`). O `Pressable` do card é ancestral do código, então o arrasto não rola, e o toque segue para o `Pressable`.

## Goals / Non-Goals

**Goals:** o toque que começa no código fica com o código; a rolagem horizontal funciona em qualquer arrasto; o resto do card continua virando.

**Non-Goals:** mudar a rolagem vertical do verso ou adicionar novas dependências de gesto.

## Decisions

### `View` dentro do `ScrollView` horizontal reivindica o toque
`onStartShouldSetResponder={() => true}` numa `View` **dentro** do `ScrollView`, em volta do texto. Na negociação do toque, o componente mais profundo que pede o toque ganha, então essa `View` ganha do `Pressable` do card, que nem chega a receber o toque. Como ela é filha do `ScrollView`, e não ancestral, o iOS continua deixando a rolagem acontecer. A `View` carrega o padding e ocupa todo o conteúdo (`flexGrow: 1`), para que qualquer toque na área preta fique com ela.

**Tentativa descartada:** a mesma `View` **em volta** do `ScrollView`. O card parou de virar, mas a `View` virou um ancestral dono do toque e o código deixou de rolar de vez (conferido no aparelho).

**Alternativas descartadas:**
- `react-native-gesture-handler` com gestos simultâneos: resolve, mas adiciona dependência nativa e exige novo build só para isso.
- Voltar a área de toque para só o texto: desfaz o fix "toque no card inteiro".
- `alwaysBounceVertical={false}` no `ScrollView` do verso: ataca só a disputa de arrastos diagonais; fica para depois, se ainda for preciso.

## Risks / Trade-offs

- **[Tocar no código não vira o card]** → é intencional; o resto do card, "Ver pergunta" e o botão continuam virando.
- **[O teste não simula o pan nativo]** → o teste confere a negociação do toque (a área do código reivindica o toque e um toque nela não vira o card). A rolagem em si é conferida no aparelho.
