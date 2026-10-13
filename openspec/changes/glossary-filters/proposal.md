## Why

O glossário tem 628 termos de 47 trilhas, listados na ordem das trilhas. Para achar um termo é preciso saber o nome (busca) ou rolar muito, e não dá para revisar só os termos de uma trilha, de uma área, de um nível ou os que estão marcados para revisar. A lista passa a ficar em ordem alfabética, com cabeçalho de letra, e ganha filtros reunidos numa gaveta.

## What Changes

- A lista do Glossário passa a ficar em ordem alfabética do nome do termo (sem diferenciar maiúsculas, minúsculas e acentos), com um cabeçalho para cada letra inicial. Termos com o mesmo nome em trilhas diferentes ficam lado a lado, na ordem das trilhas.
- Ao lado da busca, um botão "Filtros" abre uma gaveta com quatro grupos:
  - **Seu estudo**: Todos, Revisar, Já sabia e Não vistos (uma opção);
  - **Área**: as áreas que têm termos (uma ou nenhuma);
  - **Nível**: Júnior, Pleno e Sênior (um ou nenhum);
  - **Trilha**: as trilhas que têm termos, em ordem alfabética, com a quantidade de termos de cada uma (várias).
- A gaveta tem "Limpar" e um botão "Ver N termos" que fecha a gaveta. O botão "Filtros" mostra quantos filtros estão ativos.
- Os filtros ativos aparecem abaixo da busca como chips; tocar num chip remove aquele filtro.
- Busca e filtros se combinam; a contagem mostra os termos exibidos.

## Fora de escopo

- Guardar os filtros entre aberturas do app.
- Índice lateral de letras para pular direto a uma letra.
- Juntar termos repetidos entre trilhas num item só.
- Mudanças na gaveta de definição do termo.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `glossary`: a Aba Glossário passa a ordenar os termos em ordem alfabética, com cabeçalhos de letra; novo requisito de filtros por estudo, área, nível e trilha.

## Impact

- `src/app/(tabs)/glossary.tsx`, `src/glossary/search.ts` (ordenação e filtros puros), novo `src/glossary/GlossaryFilters.tsx` (gaveta) e textos em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`.
- Testes da aba Glossário que dependem da ordem por trilha.
