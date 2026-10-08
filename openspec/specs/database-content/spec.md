# database-content Specification

## Purpose
Define as trilhas de banco de dados, relacionais e não relacionais, da área "Banco de dados": quais são, como os decks são organizados e as regras de qualidade do conteúdo.
## Requirements
### Requirement: Trilhas de banco de dados no catálogo
O catálogo SHALL ter as trilhas abaixo, registradas nesta ordem depois das trilhas de Ruby, cada uma em `content/tracks/<id>/track.json`, todas com `areas: ["banco-de-dados"]`, diretas na área (sem `language`, `framework` nem `variants`) e com a seção indicada na coluna Tipo (`section: "relacionais"` ou `section: "nao-relacionais"`):

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
- **THEN** ele contém as 8 trilhas, nessa ordem, logo depois de `rails`, todas na área Banco de dados e diretas na área

#### Scenario: Área Banco de dados
- **WHEN** o usuário abre a área Banco de dados
- **THEN** a seção "Relacionais" mostra SQL essencial, Modelagem de dados, Transações e performance, PostgreSQL e MySQL, a seção "Não relacionais" mostra MongoDB, Redis e "NoSQL: modelos e quando usar", e as seções "Trilhas", "Linguagens" e "Comparativos" não aparecem

### Requirement: Decks das trilhas de banco de dados
Cada trilha SHALL ter exatamente 4 decks, nesta ordem: três decks de conteúdo com 6 cards cada (tipos `concept` ou `code`, com pelo menos 2 `concept` por deck) e o deck `perguntas-de-entrevista` ("Perguntas de entrevista"), com 6 cards `question`. São 24 cards por trilha. Os decks de conteúdo SHALL ser:

| Trilha | Decks de conteúdo (id: título) |
|---|---|
| sql-essencial | `consultas`: Consultas; `joins-e-agregacoes`: JOINs e agregações; `subqueries-e-janelas`: Subqueries, CTEs e window functions |
| modelagem-de-dados | `chaves-e-relacionamentos`: Chaves e relacionamentos; `normalizacao`: Normalização; `restricoes-e-evolucao`: Restrições e evolução do esquema |
| transacoes-e-performance | `transacoes`: Transações; `concorrencia`: Concorrência e locks; `indices-e-consultas`: Índices e consultas |
| postgresql | `tipos-e-recursos`: Tipos e recursos; `indices-postgres`: Índices; `mvcc-e-manutencao`: MVCC e manutenção |
| mysql | `innodb`: InnoDB; `indices-mysql`: Índices; `replicacao-e-operacao`: Replicação e operação |
| mongodb | `documentos`: Documentos e coleções; `modelagem-mongo`: Modelagem; `consultas-e-indices`: Consultas, índices e agregação |
| redis | `estruturas`: Estruturas de dados; `cache`: Cache; `recursos-redis`: Persistência, pub/sub e filas |
| nosql | `modelos`: Modelos de dados; `teorema-cap`: CAP e consistência; `quando-usar`: Quando usar cada um |

Os snippets dos cards `code` SHALL usar a linguagem `sql`, `js` (shell do MongoDB), `json`, `bash` (linha de comando, inclusive redis-cli) ou `text`.

#### Scenario: Contagem por deck
- **WHEN** cada trilha de banco de dados é carregada
- **THEN** ela tem os 4 decks na ordem da tabela, com 6 cards cada e 24 no total, e o último deck só tem cards `question`

#### Scenario: Conceitos em todo deck de conteúdo
- **WHEN** os decks de conteúdo são lidos
- **THEN** cada um tem pelo menos 2 cards `concept`

### Requirement: Qualidade do conteúdo de banco de dados
Todo card das trilhas de banco de dados SHALL:
- ter `origin: "original"`;
- ter pelo menos um termo em `relatedTerms`, apontando para concepts da própria trilha.

Cada trilha SHALL ter pelo menos um card de cada nível (Júnior, Pleno e Sênior).

#### Scenario: Sem complementos
- **WHEN** os cards das trilhas de banco de dados são lidos
- **THEN** nenhum tem `origin: "supplement"`

#### Scenario: Todos os cards ligados
- **WHEN** os cards das trilhas de banco de dados são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Mistura de níveis
- **WHEN** os níveis de cada trilha são contados
- **THEN** cada trilha tem pelo menos um card júnior, um pleno e um sênior

### Requirement: Tradução das trilhas de banco de dados
Cada trilha SHALL ter `translations/en.json`, registrado no app, com tradução para inglês de todo texto exibido, nos mesmos critérios das trilhas existentes. Nomes próprios e termos técnicos consagrados (ex.: JOIN, index, VACUUM, sharding, cache-aside) ficam no original.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara cada trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Área em inglês
- **WHEN** o app está em inglês e o usuário abre a Home
- **THEN** o card da área aparece como "Databases"

