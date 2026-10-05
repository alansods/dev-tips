## Why

A trilha React Native cita "update OTA" em quatro cards, mas nenhum explica o que é: a sigla aparece expandida uma vez, de passagem, sem tradução nem exemplo. Quem estuda pelo app e busca "OTA" no Glossário não encontra um card próprio.

## What Changes

- No deck "Navegação e Expo", o concept `runtime-version` (sênior) dá lugar ao concept `update-ota` (pleno), "Update OTA (over-the-air)". O card explica a sigla, as duas camadas do app (binário nativo × bundle JavaScript), o exemplo do `eas update` e a trava da runtime version, e tem os aliases "OTA" e "over-the-air".
- Os cards que apontavam para `runtime-version` em `relatedTerms` (o card EAS e a pergunta sobre os limites do OTA) passam a apontar para `update-ota`.
- Tradução para inglês do card novo.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

(nenhuma; a spec `mobile-content` não lista os cards um a um, e a trilha continua cumprindo todos os requisitos: 6 cards por deck, pelo menos 2 concepts, os três níveis e todos os cards ligados)

## Impact

- `content/tracks/react-native/track.json` e `translations/en.json`.
- O progresso salvo no card `runtime-version` deixa de contar, porque o progresso é salvo por id de card.

## Fora de escopo

- Mudar outros cards da trilha.
- Um card a mais no deck (o padrão é 6).
