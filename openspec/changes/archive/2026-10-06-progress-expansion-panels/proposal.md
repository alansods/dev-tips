## Why

A aba Progresso mostra o detalhe completo de todas as trilhas empilhado (anel, contadores, barras por deck, legenda e "Zerar progresso" de cada uma). Com o catálogo crescendo, a tela ficou longa demais e difícil de percorrer. Ver o resumo de todas as trilhas de uma vez e abrir só a que interessa resolve isso.

## What Changes

- Cada trilha na aba Progresso vira um painel expansível que começa fechado.
- O painel fechado mostra o título da trilha, a porcentagem "já sabia" e uma barra com o progresso da trilha.
- Tocar no cabeçalho abre o painel. Tocar de novo fecha.
- O painel aberto mostra os contadores "já sabia", "para revisar" e "não vistos", as barras por deck, a legenda e o botão "Zerar progresso".
- Vários painéis podem ficar abertos ao mesmo tempo. O estado aberto/fechado não é salvo e volta a fechado quando a tela é aberta de novo.
- O anel grande de porcentagem sai da tela, porque a porcentagem passa para o cabeçalho do painel.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `progress`: o requisito "Aba Progresso" passa a organizar cada trilha em um painel expansível, com um resumo quando fechado e o detalhe quando aberto.

## Impact

- `src/app/(tabs)/progress.tsx`: a tela passa a usar painéis.
- `src/components/`: novo componente de painel expansível, que pode ser reaproveitado.
- `src/__tests__/progress-tab.test.tsx` e outros testes que verificam a seção `track-progress-*` precisam abrir o painel antes de verificar o detalhe.
- Sem dependências novas e sem mudança nos dados salvos.

## Fora de escopo

- Salvar quais painéis estavam abertos entre aberturas da tela.
- Agrupar as trilhas por área ou mudar a ordem delas.
- Mudanças nas regras de cálculo de progresso ou no fluxo de "Zerar progresso".
