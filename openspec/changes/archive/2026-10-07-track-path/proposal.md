## Why

Com 41 trilhas, a tela de uma área lista tudo por categoria (linguagens, seções, comparativos) e não diz por onde começar nem o que vem depois. Quem abre Frontend não sabe se deve estudar React antes de Next.js. O design aprovado em 2026-10-07 mostra uma **ordem sugerida** no topo da área. A mesma informação alimenta a aba Início na próxima change ("Próximo passo" e "Comece por aqui").

## What Changes

- **Pré-requisitos:** cada trilha pode declarar `prerequisites`, a lista de ids das trilhas que convém estudar antes. Por exemplo, `nextjs` declara `["react"]`.
- **Validação:** cada id precisa existir no catálogo, a trilha não pode depender de si mesma e não pode haver ciclo.
- **Conteúdo:** as 41 trilhas recebem os pré-requisitos. A tabela fica no design para revisão.
- **Tela da área:** ganha no topo a seção **"Ordem sugerida"**, uma linha do tempo com todas as trilhas da área. A ordem respeita os pré-requisitos e, no empate, segue o catálogo. Cada linha mostra:
  - o ícone;
  - o título;
  - o estado: concluída, em andamento ou não iniciada;
  - "N para revisar", quando houver.
- **Seções atuais:** continuam embaixo, como hoje.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `content-model`: novo requisito "Pré-requisitos da trilha".
- `catalog-navigation`: o requisito "Tela da área" passa a ter a seção "Ordem sugerida" no topo. Entra o novo requisito "Ordem sugerida na área".

## Impact

- Conteúdo: `prerequisites` nos `track.json` que têm pré-requisito.
- Código:
  - `src/content/schema.ts` e `src/content/validate.ts`: o campo e a checagem entre trilhas;
  - `src/content/navigation.ts`: `areaPath` e `nextTracks`;
  - `src/study/rules.ts`: `trackStatus`;
  - nova seção na tela da área, com o componente `PathList`;
  - textos em pt-BR e inglês.
- Testes: os cenários de navegação que contam as seções da área passam a ter a "Ordem sugerida".

## Fora de escopo

- Bloquear uma trilha até os pré-requisitos serem concluídos. A ordem é só uma sugestão.
- Usar os pré-requisitos no Início, que fica para a change `home-tab`.
- Nível por trilha, descartado.
