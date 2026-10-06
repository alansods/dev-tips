## Context

`src/app/(tabs)/progress.tsx` renderiza um `TrackProgress` completo para cada trilha do catálogo dentro de `Screen` (ScrollView). Já existem `ProgressBar` (barra "já sabia"/"não sabia" com `accessibilityRole="progressbar"`), `ProgressRing` e `ChevronRightIcon`. O projeto usa Expo SDK 57 / React Native 0.86 (New Architecture) e não tem Reanimated.

## Goals / Non-Goals

**Goals:**
- Um componente `ExpansionPanel` genérico e acessível, reaproveitável em outras telas.
- Os testes atuais da aba continuam válidos depois de abrir o painel.

**Non-Goals:**
- Animação elaborada (altura interpolada, spring). Basta uma transição suave.

## Decisions

- **`src/components/ExpansionPanel.tsx`**: props `header` (ReactNode), `children`, `testID` e `initiallyExpanded` (padrão `false`). O cabeçalho é um `Pressable` com `accessibilityRole="button"` e `accessibilityState={{ expanded }}`, para o leitor de tela anunciar "expandido/recolhido". Os `children` só são montados quando o painel está aberto, o que deixa a tela leve com muitas trilhas e faz o detalhe sumir da árvore de acessibilidade. Alternativa descartada: esconder com `height: 0`, que mantém os nós montados e confunde leitor de tela e testes.
- **Estado local (`useState`) em cada painel**: atende a "vários abertos" e a "não persistir". Descartado: guardar no `useStudyStore`, porque não há requisito de persistência.
- **Chevron**: reaproveita `ChevronRightIcon` girado (`rotate: '90deg'` quando aberto). Não precisa de ícone novo.
- **Transição**: `LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)` antes de trocar o estado. É nativo do React Native, sem dependência. Descartado: Reanimated, que é uma dependência nativa nova e exige novo dev build para pouco ganho.
- **Cabeçalho da trilha**: título (`accessibilityRole="header"` mantido), porcentagem em texto mono com o rótulo acessível existente `t.progress.ring(percent)` ("N% da trilha dominada") e um `ProgressBar` da trilha com as partes "já sabia" e "não sabia". O `ProgressRing` deixa de ser usado nesta tela, mas o componente continua no projeto.
- **`testID` `track-progress-<id>`** continua no painel inteiro, para que `within(...)` dos testes siga funcionando.

## Risks / Trade-offs

- [Testes de outras trilhas assumem o detalhe visível] → usar um helper `openTrackPanel(id)` nos testes afetados.
- [LayoutAnimation com comportamento diferente no Android] → efeito apenas visual. Se der problema, removo a chamada sem afetar o comportamento.
- [A barra do cabeçalho fica dentro de um botão acessível, então não aparece como `progressbar` separado para o leitor de tela nem para `getByRole`] → o `ProgressBar` ganhou um `testID` opcional, e o teste verifica a barra por ele. O nome falado do botão já inclui a porcentagem.
