## Why

A aba Trilhas mostra só as 6 áreas, e para achar uma trilha específica entre as 41 é preciso abrir a área, a linguagem e às vezes o framework. O design aprovado em 2026-10-07 coloca na aba **busca**, **filtros de estado** e um atalho **por linguagem**.

## What Changes

- **Busca:** campo de busca, sem diferenciar acentos e maiúsculas. Procura no título, na descrição e nos nomes da linguagem e do framework, no idioma exibido.
- **Filtros de estado:** Todas, Em andamento (com a contagem), Não iniciadas e Concluídas.
- **Por linguagem:** uma grade com o logo de cada linguagem do cadastro. Tocar filtra as trilhas daquela linguagem, e tocar de novo tira o filtro.
- **Resultado:** com algum critério ativo, as áreas dão lugar à lista de trilhas que atendem a todos, ou a "Nenhuma trilha encontrada.". Sem critério, as áreas continuam como hoje, agora em duas colunas.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `catalog-navigation`: novo requisito "Busca e filtros na aba Trilhas". O requisito "Home por áreas" continua valendo sem critério ativo.

## Impact

- Código:
  - `src/content/search.ts`, novo, com a busca e os filtros como funções puras;
  - `src/app/(tabs)/tracks.tsx`;
  - `AreaCard`, para caber em duas colunas;
  - a normalização de texto sai de `src/glossary/search.ts` para um módulo comum;
  - textos em pt-BR e inglês.
- Sem mudança de dados nem de API.

## Fora de escopo

- Buscar dentro dos cards (termos e respostas): o Glossário já busca termos.
- Guardar a busca ou o filtro entre aberturas do app.
