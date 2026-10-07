## Why

O selo no topo de cada card mostra o tipo do card. Todo card de conceito aparece como "Glossário", o que diz pouco. Na revisão de todas as trilhas os cards vêm de trilhas diferentes, e o usuário quer saber de onde cada um veio. Ele pediu o nome da trilha e do deck no lugar do tipo, em todas as sessões.

## What Changes

- **Selo de origem:** a frente e o verso do card mostram um selo com o ícone da trilha e "Trilha · Deck", no lugar do selo de tipo.
- **Cards de passo:** continuam mostrando "Passo N" ao lado, porque é a única indicação da sequência.
- **Nível:** o chip de nível continua igual, agora ao lado do selo de origem.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `study-flow`: novo requisito "Origem do card na sessão"; o requisito "Nível no card" passa a citar o selo de origem.

## Impact

- `src/components/cards/CardFace.tsx` e `parts.tsx`: novo `OriginChip`.
- `src/components/TechIcon.tsx`: tamanho 20, para caber no selo.
- Textos em pt-BR e inglês.
- Testes: `cards.test.tsx` e `study-flow.test.tsx`.

## Fora de escopo

- O resumo da sessão, que continua identificando os cards errados pelo tipo e pelo título.
