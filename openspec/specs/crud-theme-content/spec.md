# crud-theme-content Specification

## Purpose

Define o conteúdo do tema "O mesmo CRUD em quatro frameworks, passo a passo": o que ele contém, como os complementos se distinguem do material original e como a fidelidade a esse material é garantida.
## Requirements
### Requirement: Material de origem preservado
O repositório SHALL conter o material de origem do tema em `content/sources/crud-4-frameworks.md`, com o texto e o código exatamente como foram fornecidos. Esse arquivo é a referência para conferir a fidelidade do tema.

#### Scenario: Material de origem presente
- **WHEN** a suíte de testes roda
- **THEN** `content/sources/crud-4-frameworks.md` existe e contém os títulos dos 16 passos, a tabela comparativa e o glossário

### Requirement: Identidade, variantes e colunas do tema
O tema SHALL estar em `content/themes/crud-4-frameworks/theme.json`, com id `crud-4-frameworks` e título "O mesmo CRUD em quatro frameworks". As variantes MUST ser, nesta ordem: `express` (Express), `spring` (Spring Boot), `nest` (NestJS) e `fastapi` (FastAPI). As colunas de comparação MUST ser, nesta ordem: `frontend`, `spring`, `express`, `nest` e `fastapi`.

#### Scenario: Tema válido no catálogo
- **WHEN** o gate de conteúdo do repositório valida `content/themes/`
- **THEN** o tema `crud-4-frameworks` é aceito sem erros

#### Scenario: Ordem de variantes e colunas
- **WHEN** o tema é carregado
- **THEN** as variantes são express, spring, nest, fastapi e as colunas são frontend, spring, express, nest, fastapi, nessa ordem

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

### Requirement: Endpoints do CRUD
Os 5 cards `endpoint` MUST representar, nesta ordem:

| Método | Caminho | Operação | Sucesso | Erros |
|---|---|---|---|---|
| POST | /products | C | 201 | 400 |
| GET | /products | R | 200 | 400 |
| GET | /products/{id} | R | 200 | 404 |
| PUT | /products/{id} | U | 200 | 400, 404 |
| DELETE | /products/{id} | D | 204 | 404 |

#### Scenario: Endpoint de criação
- **WHEN** o primeiro card do deck `o-que-vamos-criar` é lido
- **THEN** ele é `POST /products`, operação C, sucesso 201 e erro 400

#### Scenario: Endpoint de remoção
- **WHEN** o último card do deck `o-que-vamos-criar` é lido
- **THEN** ele é `DELETE /products/{id}`, operação D, sucesso 204 e erro 404

### Requirement: Fidelidade ao material original
Todo card com `origin: "original"` SHALL ter seu conteúdo tirado literalmente do material de origem.
- O `code` de cada snippet MUST aparecer no material caractere por caractere.
- Os textos (títulos, "o que é", "por que importa", notas, definições, conceitos, explicações e valores da tabela) MUST aparecer no material depois de remover a formatação markdown (`**`, crases), normalizar espaços e ignorar diferença entre maiúsculas e minúsculas.
- Ajustes permitidos, que não alteram o conteúdo: o rótulo `language` do snippet; o caminho do endpoint com `{id}` no lugar de `1`; a separação dos rótulos em negrito do material ("O que é", "Por que importa", "Endpoint", "Caminho", "Por que paginar", "Detalhe importante") em `whatIs` e `whyItMatters`, sem o rótulo.

#### Scenario: Código original idêntico ao material
- **WHEN** todos os snippets de cards `original` são comparados com o material de origem
- **THEN** cada `code` é encontrado literalmente no material

#### Scenario: Texto original presente no material
- **WHEN** os textos dos cards `original` são comparados com o material normalizado
- **THEN** cada texto é encontrado no material

#### Scenario: Snippet de instrução marcado como texto
- **WHEN** o snippet `spring` do Passo 1 (instruções do start.spring.io) é lido
- **THEN** sua `language` é `text`, e o código continua idêntico ao material

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

### Requirement: Tradução completa para inglês
O tema SHALL ter o arquivo `content/themes/crud-4-frameworks/translations/en.json`, registrado no app. Todo texto exibido do tema SHALL ter tradução para inglês: título e descrição do tema, título e descrição de cada deck, e os campos de texto de cada card (`description`, `title`, `whatIs`, `whyItMatters`, `concept`, `explanation`, `term`, `definition`, `frontendAnalogy`, `body`, `question`, `answer` e `note` dos snippets) e os rótulos das colunas de comparação. Ficam fora da cobertura: código, nomes de arquivo, `tags` (não exibidas), `aliases` e `values` de comparação que são identificadores ou código (ex.: `@RestController`, `main.ts`); `values` em prosa (ex.: "As URLs que o fetch chama") SHALL ser traduzidos. Nomes próprios e termos técnicos consagrados (ex.: Express, Spring Boot, NestJS, FastAPI, CORS, DTO, endpoint) MUST ficar no original. O conteúdo em PT-BR MUST NOT mudar.

#### Scenario: Cobertura completa
- **WHEN** a suíte de testes compara o tema com a tradução em inglês
- **THEN** nenhum texto exibido obrigatório está sem tradução

#### Scenario: Card exibido em inglês
- **WHEN** o app está em inglês e o usuário abre o card concept "CORS" e o passo `step-01`
- **THEN** o card aparece em inglês

#### Scenario: PT-BR intacto
- **WHEN** o app está em PT-BR
- **THEN** o tema aparece com o título "O mesmo CRUD em quatro frameworks" e os textos originais

