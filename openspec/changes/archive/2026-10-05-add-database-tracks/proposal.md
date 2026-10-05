## Why

Última das cinco changes de conteúdo aprovadas. Banco de dados aparece em quase toda entrevista de backend e fullstack, mas não se encaixa como "linguagem → framework": PostgreSQL apareceria listado como "framework" de SQL. Por isso ganha uma área própria.

## What Changes

- **Área nova "Banco de dados"** (EN: *Databases*), exibida depois de Backend.
- 8 trilhas novas, diretas na área, com 24 cards cada (192 no total), em PT-BR e com tradução completa para inglês:
  - **Relacionais:** SQL essencial, Modelagem de dados, Transações e performance, PostgreSQL e MySQL.
  - **Não relacionais:** MongoDB, Redis e "NoSQL: modelos e quando usar" (documento, chave-valor, colunar, grafo, busca, teorema CAP).
- O formato é o mesmo das trilhas anteriores: 3 decks de conteúdo e "Perguntas de entrevista", com nível e termos relacionados em todo card, e os três níveis em cada trilha.

## Capabilities

### New Capabilities

- `database-content`: as 8 trilhas de banco de dados, com identidade, decks e contagens, conteúdo autoral, ligação com o glossário, mistura de níveis e tradução.

### Modified Capabilities

- `content-model`: a lista de áreas válidas ganha `banco-de-dados`.
- `catalog-navigation`: a ordem da Home passa a incluir Banco de dados por último, com os textos "Banco de dados" e "Databases".

## Impact

- `AREAS` em `src/content/schema.ts` e `nav.areas` em `src/i18n/pt-BR.ts` e `en.ts`.
- `content/tracks/<id>/track.json` e `translations/en.json` para as 8 trilhas, com o registro em `catalog.ts` e `translations.ts`.
- Testes em `src/content/__tests__/database-tracks.test.ts`, `src/content/__tests__/taxonomy.test.ts` e `src/__tests__/database-navigation.test.tsx`.
- Sem mudança na API nem nos dados salvos.

## Fora de escopo

- Outros bancos (SQL Server, Oracle, Cassandra, Neo4j e Elasticsearch como trilhas próprias). Os três últimos aparecem na trilha "NoSQL: modelos e quando usar".
- Linguagens e frameworks dentro da área de banco de dados.
