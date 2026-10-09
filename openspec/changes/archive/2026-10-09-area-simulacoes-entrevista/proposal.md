## Why

Entrevistas para fullstack pleno costumam ser conversas técnicas sobre situações-problema: o entrevistador apresenta um caso ("o dashboard demora 8 segundos") e vai aprofundando ("e se o worker cair?"). Os cards atuais treinam conceitos soltos, não esse raciocínio. O usuário trouxe um material com 6 simulações desse tipo e pediu uma área própria, em que cada simulação é uma conversa e não uma trilha.

## What Changes

- Nova área **Situações-problema**, a última da aba Trilhas. Ela lista as simulações (apresentadas como "casos") direto, sem trilhas nem decks visíveis, com uma frase que explica o formato.
- Novo tipo de entrada no catálogo: a **simulação** (`kind: "simulation"`). Ela tem um caso (`scenario`, com o contexto e a stack) e um único deck com as perguntas do entrevistador.
- Novo tipo de card **`interview`**:
  - frente: o caso resumido e a pergunta;
  - verso: a resposta-modelo e, quando houver, "Por que funciona", "Atenção" (pegadinha ou trade-off) e um snippet.
- Tela da simulação: mostra o caso, a stack e o progresso, com um botão "Começar conversa", "Continuar" ou "Praticar de novo". A sessão segue as regras atuais (ordem sorteada, "Já sabia" e "Não sabia", revisão espaçada).
- Conteúdo: 6 simulações, com 25 cards, tiradas do material do usuário, com tradução para inglês.
- Início:
  - a seção "Novas trilhas" passa a se chamar **Novidades**. Ela mostra áreas novas (com o selo "Nova área") e trilhas ou simulações novas (com o selo "Nova");
  - a área ganha uma data de inclusão própria, e só Situações-problema tem uma;
  - simulações continuam fora de "Próximo passo", de "Comece por aqui" e das áreas de interesse, e aparecem em "Continue de onde parou" e na revisão de hoje.

## Fora de escopo

- As partes do material que não são simulações: o roteiro de 5 passos para responder, a tabela "quando o CEO questionar", o checklist de preparação e as recomendações finais.
- Ordem fixa da conversa: a sessão continua sorteada, como nos decks.
- Simulação interativa com IA (o entrevistador conduzindo a conversa ao vivo).
- Simulações de outras senioridades ou stacks além das 6 do material.

## Capabilities

### New Capabilities

- `interview-simulations-content`: as 6 simulações (ids, ordem, casos, quantidade de cards e tradução) e a regra de que a frente de cada card faz sentido sozinha.

### Modified Capabilities

- `content-model`: área `simulacoes` (com data de inclusão), campo `kind`, `scenario`, regras da simulação, card `interview` e campos traduzíveis.
- `catalog-navigation`: a área Situações-problema na ordem das áreas, "N casos" no card da área, a tela da área com a frase de introdução e sem título de seção, e as simulações na busca.
- `study-flow`: a tela da simulação e a frente e o verso do card `interview`.
- `home`: "Novas trilhas" vira "Novidades" (área nova ou trilha/simulação nova); simulações ficam fora de "Próximo passo", "Comece por aqui" e das áreas de interesse; "Continue de onde parou" mostra a simulação sem "deck N de M".

## Impact

- Conteúdo: 6 pastas novas em `content/tracks/sim-*/`, cada uma com `track.json` e `translations/en.json`.
- Código:
  - `src/content/`: `schema.ts`, `integrity.ts`, `translation.ts`, `navigation.ts`, `catalog.ts` e `translations.ts`;
  - `src/components/cards/`: frente e verso do `interview`;
  - telas `src/app/track/[trackId].tsx` e `src/app/area/[areaId]/index.tsx`;
  - `src/home/sections.ts`;
  - `src/assistant/cardText.ts`;
  - `src/i18n/` e o ícone da área em `src/components/icons.tsx`.
- Sem mudança no progresso, na sincronização nem na API: cada simulação usa o mesmo formato de chave (`trackId:cardId`) das trilhas.
