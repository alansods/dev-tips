## Context

Em `src/study/StudySession.tsx`, o card é uma `View` com borda que contém um `ScrollView`. O conteúdo do `ScrollView` (`cardContent`) tem padding e `flexGrow: 1`. Dentro dele ficam os dois `Pressable`, um para a frente e outro para o verso, e cada um só ocupa a altura do texto. O padding e o espaço que sobra abaixo do texto ficam fora deles, e é por isso que o toque não funciona ali.

## Goals / Non-Goals

**Goals:** o toque vira o card em qualquer ponto, nas duas faces, sem atrapalhar a rolagem nem os elementos tocáveis de dentro do card.

**Non-Goals:** mudar a animação, os gestos ou o leitor de tela.

## Decisions

### `Pressable` ocupa o card inteiro e carrega o padding
- O conteúdo do `ScrollView` fica só com `flexGrow: 1`, sem padding.
- Os dois `Pressable` recebem um estilo `cardTouch`, com `flexGrow: 1` e o padding que antes ficava no conteúdo.

Assim o `Pressable` se estica até o fim do card mesmo com pouco texto, e as bordas internas passam a fazer parte da área de toque. Os elementos tocáveis de dentro (abas, chips, "Ver pergunta") são `Pressable` aninhados e continuam recebendo o próprio toque. O `ScrollView` distingue arrasto de toque, então rolar um verso longo continua funcionando.

**Alternativa descartada:** envolver a `View` do card inteira num `Pressable`, por fora do `ScrollView`. Isso criaria conflito entre o gesto de rolar e o toque, e no verso o leitor de tela trataria o card como um único botão, escondendo as abas e os chips.

## Risks / Trade-offs

- **[O teste não mede layout]** → o ambiente de teste não calcula tamanhos de verdade. O teste confere a estrutura (o `Pressable` com `flexGrow: 1` e o padding, e o conteúdo do `ScrollView` sem padding), e a confirmação visual é a conferência manual no aparelho.
