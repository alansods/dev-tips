## MODIFIED Requirements

### Requirement: Trilhas de banco de dados no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem depois das trilhas de Python, cada uma em `content/tracks/<id>/track.json`, todas com `areas: ["banco-de-dados"]`, diretas na área (sem `language`, `framework` nem `variants`) e com a seção indicada na coluna Tipo (`section: "relacionais"` ou `section: "nao-relacionais"`):

| id | Título | Tipo |
|---|---|---|
| `sql-essencial` | SQL essencial | relacional |
| `modelagem-de-dados` | Modelagem de dados | relacional |
| `transacoes-e-performance` | Transações e performance | relacional |
| `postgresql` | PostgreSQL | relacional |
| `mysql` | MySQL | relacional |
| `mongodb` | MongoDB | não relacional |
| `redis` | Redis | não relacional |
| `nosql` | NoSQL: modelos e quando usar | não relacional |

#### Scenario: Trilhas registradas
- **WHEN** o catálogo é carregado
- **THEN** ele contém as 8 trilhas, nessa ordem, logo depois de `django`, todas na área Banco de dados e diretas na área

#### Scenario: Área Banco de dados
- **WHEN** o usuário abre a área Banco de dados
- **THEN** a seção "Relacionais" mostra SQL essencial, Modelagem de dados, Transações e performance, PostgreSQL e MySQL, a seção "Não relacionais" mostra MongoDB, Redis e "NoSQL: modelos e quando usar", e as seções "Trilhas", "Linguagens" e "Comparativos" não aparecem
