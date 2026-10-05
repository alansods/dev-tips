## RENAMED Requirements

- FROM: `### Requirement: Identidade, variantes e colunas do tema`
- TO: `### Requirement: Identidade, variantes e colunas da trilha`


## MODIFIED Requirements

### Requirement: Material de origem preservado
O repositório SHALL conter o material de origem da trilha em `content/sources/crud-4-frameworks.md`, com o texto e o código exatamente como foram fornecidos. Esse arquivo é a referência para conferir a fidelidade da trilha.

#### Scenario: Material de origem presente
- **WHEN** a suíte de testes roda
- **THEN** `content/sources/crud-4-frameworks.md` existe e contém os títulos dos 16 passos, a tabela comparativa e o glossário

### Requirement: Identidade, variantes e colunas da trilha
A trilha SHALL estar em `content/tracks/crud-4-frameworks/track.json`, com id `crud-4-frameworks` e título "O mesmo CRUD em quatro frameworks". As variantes MUST ser, nesta ordem: `express` (Express), `spring` (Spring Boot), `nest` (NestJS) e `fastapi` (FastAPI). As colunas de comparação MUST ser, nesta ordem: `frontend`, `spring`, `express`, `nest` e `fastapi`.

#### Scenario: Trilha válida no catálogo
- **WHEN** o gate de conteúdo do repositório valida `content/tracks/`
- **THEN** a trilha `crud-4-frameworks` é aceito sem erros

#### Scenario: Ordem de variantes e colunas
- **WHEN** a trilha é carregada
- **THEN** as variantes são express, spring, nest, fastapi e as colunas são frontend, spring, express, nest, fastapi, nessa ordem

### Requirement: Decks e contagens
A trilha SHALL ter exatamente 5 decks, nesta ordem: `o-que-vamos-criar`, `passo-a-passo`, `mapa-mental`, `glossario` e `perguntas-de-entrevista`. As contagens MUST ser:
- `o-que-vamos-criar`: 5 cards `endpoint`;
- `passo-a-passo`: 16 cards `step` numerados de 1 a 16, sem lacunas e em ordem crescente, mais 4 cards `code` de complemento;
- `mapa-mental`: 16 cards `compare`, na ordem da tabela comparativa;
- `glossario`: 24 cards `concept`, na ordem do glossário;
- `perguntas-de-entrevista`: 8 cards `question`, nesta ordem: PUT vs PATCH, idempotência, paginação por offset vs cursor, problema N+1, transações, autenticação com JWT, migrations, SQL injection.

#### Scenario: Contagem por deck
- **WHEN** a trilha é carregada
- **THEN** os decks têm 5 endpoints, 16 steps + 4 codes, 16 compares, 24 concepts e 8 questions, respectivamente

#### Scenario: Passos contíguos
- **WHEN** os cards `step` do deck `passo-a-passo` são lidos em ordem
- **THEN** seus números são exatamente 1, 2, …, 16

#### Scenario: Glossário completo
- **WHEN** o glossário da trilha é derivado
- **THEN** ele contém os 24 termos do material, de "API" a "venv (Python)"

#### Scenario: Perguntas de entrevista na ordem
- **WHEN** o deck `perguntas-de-entrevista` é lido
- **THEN** os ids são `put-vs-patch`, `idempotencia`, `paginacao-offset-cursor`, `problema-n-mais-1`, `transacoes`, `autenticacao-jwt`, `migrations`, `sql-injection`

### Requirement: Complementos marcados
A trilha SHALL ter exatamente 12 cards com `origin: "supplement"`: os 4 cards `code` do deck `passo-a-passo`, cada um posicionado logo após o passo que depende dele, e os 8 cards `question` do deck `perguntas-de-entrevista`.

| Id | Conteúdo | Variante | Depois do passo |
|---|---|---|---|
| `docker-compose` | `docker-compose.yml` do PostgreSQL | (nenhuma) | 3 |
| `express-to-product` | `ProductRow` + `toProduct` | express | 7 |
| `express-query-schemas` | `pageQuerySchema` + `idParamSchema` | express | 8 |
| `express-server` | `server.ts` | express | 14 |

O `body` de cada complemento `code` MUST dizer qual passo usa aquele código sem mostrá-lo. Os complementos MUST ser coerentes com o material: mesmos nomes de banco, usuário, senha, container e porta (`productsdb`, `products`, `products-db`, 5432, API na 8080).

#### Scenario: Somente os complementos são supplement
- **WHEN** todos os cards da trilha são lidos
- **THEN** exatamente os 4 cards da tabela e os 8 cards de perguntas têm `origin: "supplement"`, e todos os outros têm `origin: "original"`

#### Scenario: Posição dos complementos
- **WHEN** o deck `passo-a-passo` é lido em ordem
- **THEN** `docker-compose` vem logo após o Passo 3, `express-to-product` após o 7, `express-query-schemas` após o 8 e `express-server` após o 14

#### Scenario: docker-compose coerente com o material
- **WHEN** o snippet de `docker-compose` é lido
- **THEN** ele define o container `products-db`, usuário e senha `products`, banco `productsdb` e porta 5432

### Requirement: Tradução completa para inglês
A trilha SHALL ter o arquivo `content/tracks/crud-4-frameworks/translations/en.json`, registrado no app. Todo texto exibido da trilha SHALL ter tradução para inglês: título e descrição da trilha, título e descrição de cada deck, e os campos de texto de cada card (`description`, `title`, `whatIs`, `whyItMatters`, `concept`, `explanation`, `term`, `definition`, `frontendAnalogy`, `body`, `question`, `answer` e `note` dos snippets) e os rótulos das colunas de comparação. Ficam fora da cobertura: código, nomes de arquivo, `tags` (não exibidas), `aliases` e `values` de comparação que são identificadores ou código (ex.: `@RestController`, `main.ts`); `values` em prosa (ex.: "As URLs que o fetch chama") SHALL ser traduzidos. Nomes próprios e termos técnicos consagrados (ex.: Express, Spring Boot, NestJS, FastAPI, CORS, DTO, endpoint) MUST ficar no original. O conteúdo em PT-BR MUST NOT mudar.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara a trilha com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Card exibido em inglês
- **WHEN** o app está em inglês e o usuário abre o card concept "CORS" e o passo `step-01`
- **THEN** o card aparece em inglês

#### Scenario: PT-BR intacto
- **WHEN** o app está em PT-BR
- **THEN** a trilha aparece com o título "O mesmo CRUD em quatro frameworks" e os textos originais
