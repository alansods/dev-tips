## Why

Na sessão de estudo, arrastar para o lado um código mais largo que o card (ex.: o terminal do card "Fluxo do dia a dia") falha: arrastos curtos ou lentos não rolam e, ao soltar, o card vira. O verso inteiro é uma área de toque que vira o card. O bloco de código fica dentro dela sem reivindicar o toque, então o card fica com o toque, e no iOS o código não rola enquanto um ancestral dele for o dono do toque.

## What Changes

- Arrastar o código para o lado rola só o código e não vira o card.
- Tocar sobre o código não vira o card. O resto do card continua virando ao toque.

## Fora de escopo

- Mudanças na animação de virar, na rolagem vertical do verso ou em outros gestos.

## Capabilities

### New Capabilities

### Modified Capabilities

- `study-flow`: o requisito "Exibição de código" define que a área do código é reservada à rolagem.

## Impact

- `src/components/cards/parts.tsx`: dentro do `ScrollView` horizontal do `CodeBlock`, uma `View` em volta do texto reivindica o toque e carrega o padding.
- Vale para todos os lugares que usam `CodeBlock` dentro da sessão de estudo e da revisão.
