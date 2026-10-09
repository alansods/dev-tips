## Why

Na sessão de estudo, tocar no card só vira o card quando o toque cai em cima do texto. As bordas internas e o espaço vazio abaixo do conteúdo não respondem, então em cards curtos (um termo do glossário, por exemplo) a maior parte do card não vira.

## What Changes

- A área de toque passa a ser o card inteiro, nas duas faces: tocar em qualquer ponto vira o card, inclusive nas bordas internas e no espaço vazio.
- Abas de framework, chips de termos e "Ver pergunta" continuam respondendo ao próprio toque, e rolar um verso longo continua funcionando.

## Fora de escopo

- Mudanças na animação de virar ou nos gestos (arrastar para responder).
- Telas fora da sessão de estudo e da revisão.

## Capabilities

### New Capabilities

### Modified Capabilities

- `study-flow`: o requisito "Virar e responder" define que a área de toque é o card inteiro.

## Impact

- `src/study/StudySession.tsx`: o padding sai do conteúdo do `ScrollView` e vai para os dois `Pressable` da frente e do verso, que passam a ocupar todo o card.
- Vale para a sessão do deck, a revisão da trilha e a revisão de todas as trilhas, que usam o mesmo componente.
