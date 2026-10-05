## Context

O formato, a navegação, o gerador de conteúdo e o helper de testes (`describeContentTracks`) já existem. As áreas são uma lista fixa no código (`AREAS` em `src/content/schema.ts`), com os nomes em i18n.

## Goals / Non-Goals

**Goals:**
- Cobrir bancos relacionais (SQL, modelagem, transações, PostgreSQL e MySQL) e não relacionais (MongoDB, Redis e um panorama de NoSQL) no nível de entrevista.

**Non-Goals:**
- Ensinar a operar bancos em produção a fundo (tuning de servidor, backup). Aparece só o que costuma ser cobrado.

## Decisions

### 1. Área nova na lista fixa
`banco-de-dados` entra em `AREAS`, depois de `backend`, com os nomes "Banco de dados" e "Databases". As telas de área e a Home já são genéricas, então nenhuma tela muda.
*Alternativa descartada:* tratar SQL como linguagem e PostgreSQL/MySQL como frameworks. A navegação ficaria enganosa, porque bancos não são frameworks, e MongoDB e Redis não teriam "linguagem".

### 2. Todas as trilhas diretas na área
Na área Banco de dados, a tela mostra só a seção "Trilhas", com as 8 trilhas na ordem: primeiro as relacionais (do fundamento ao banco específico), depois as não relacionais, com o panorama de NoSQL por último.

### 3. Snippets
`sql` para consultas, `js` para o shell do MongoDB (mongosh), `bash` para redis-cli e linha de comando, e `json` para documentos.

### 4. Critério de nível
O mesmo das changes anteriores:
- **Júnior**: o que é e o uso básico.
- **Pleno**: usar bem e as armadilhas.
- **Sênior**: internals, trade-offs e arquitetura.

## Risks / Trade-offs

- [8 trilhas numa seção só fica uma lista longa] → É aceitável hoje. Se a área crescer, uma change futura pode separar "Relacionais" e "Não relacionais".
- [Exatidão técnica não é coberta por teste] → Revisão no PR, com a lista de cards por trilha.
