## MODIFIED Requirements

### Requirement: Decks e contagens
O tema SHALL ter exatamente 5 decks, nesta ordem: `o-que-vamos-criar`, `passo-a-passo`, `mapa-mental`, `glossario` e `perguntas-de-entrevista`. As contagens MUST ser:
- `o-que-vamos-criar`: 5 cards `endpoint`;
- `passo-a-passo`: 16 cards `step` numerados de 1 a 16, sem lacunas e em ordem crescente, mais 4 cards `code` de complemento;
- `mapa-mental`: 16 cards `compare`, na ordem da tabela comparativa;
- `glossario`: 24 cards `concept`, na ordem do glossário;
- `perguntas-de-entrevista`: 8 cards `question`, nesta ordem: PUT vs PATCH, idempotência, paginação por offset vs cursor, problema N+1, transações, autenticação com JWT, migrations, SQL injection.

#### Scenario: Contagem por deck
- **WHEN** o tema é carregado
- **THEN** os decks têm 5 endpoints, 16 steps + 4 codes, 16 compares, 24 concepts e 8 questions, respectivamente

#### Scenario: Passos contíguos
- **WHEN** os cards `step` do deck `passo-a-passo` são lidos em ordem
- **THEN** seus números são exatamente 1, 2, …, 16

#### Scenario: Glossário completo
- **WHEN** o glossário do tema é derivado
- **THEN** ele contém os 24 termos do material, de "API" a "venv (Python)"

#### Scenario: Perguntas de entrevista na ordem
- **WHEN** o deck `perguntas-de-entrevista` é lido
- **THEN** os ids são `put-vs-patch`, `idempotencia`, `paginacao-offset-cursor`, `problema-n-mais-1`, `transacoes`, `autenticacao-jwt`, `migrations`, `sql-injection`

### Requirement: Complementos marcados
O tema SHALL ter exatamente 12 cards com `origin: "supplement"`: os 4 cards `code` do deck `passo-a-passo`, cada um posicionado logo após o passo que depende dele, e os 8 cards `question` do deck `perguntas-de-entrevista`.

| Id | Conteúdo | Variante | Depois do passo |
|---|---|---|---|
| `docker-compose` | `docker-compose.yml` do PostgreSQL | (nenhuma) | 3 |
| `express-to-product` | `ProductRow` + `toProduct` | express | 7 |
| `express-query-schemas` | `pageQuerySchema` + `idParamSchema` | express | 8 |
| `express-server` | `server.ts` | express | 14 |

O `body` de cada complemento `code` MUST dizer qual passo usa aquele código sem mostrá-lo. Os complementos MUST ser coerentes com o material: mesmos nomes de banco, usuário, senha, container e porta (`productsdb`, `products`, `products-db`, 5432, API na 8080).

#### Scenario: Somente os complementos são supplement
- **WHEN** todos os cards do tema são lidos
- **THEN** exatamente os 4 cards da tabela e os 8 cards de perguntas têm `origin: "supplement"`, e todos os outros têm `origin: "original"`

#### Scenario: Posição dos complementos
- **WHEN** o deck `passo-a-passo` é lido em ordem
- **THEN** `docker-compose` vem logo após o Passo 3, `express-to-product` após o 7, `express-query-schemas` após o 8 e `express-server` após o 14

#### Scenario: docker-compose coerente com o material
- **WHEN** o snippet de `docker-compose` é lido
- **THEN** ele define o container `products-db`, usuário e senha `products`, banco `productsdb` e porta 5432

### Requirement: Ligação com o glossário
Todo card `step`, `endpoint` e `question` SHALL ter pelo menos um termo em `relatedTerms`, apontando para conceitos que o próprio card menciona.

#### Scenario: Todo passo tem termos relacionados
- **WHEN** os cards `step`, `endpoint` e `question` são lidos
- **THEN** cada um tem `relatedTerms` não vazio

#### Scenario: Passo de CORS ligado ao termo CORS
- **WHEN** o Passo 13 (Liberar o frontend) é lido
- **THEN** seus `relatedTerms` incluem o concept de CORS

#### Scenario: Passo de testes ligado ao termo Mock
- **WHEN** o Passo 16 (Testar automaticamente) é lido
- **THEN** seus `relatedTerms` incluem o concept de Mock
