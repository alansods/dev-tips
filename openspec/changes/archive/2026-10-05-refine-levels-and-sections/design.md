## Context

`placementOf` (`src/content/taxonomy.ts`) classifica cada trilha como direta, de linguagem, de framework ou comparativa. `areaSections` (`src/content/navigation.ts`) devolve `direct`, `languages` e `comparisons`, e a tela da área desenha essas três seções. As áreas são uma lista fixa no código, com nomes em i18n.

## Goals / Non-Goals

**Goals:**
- Nível coerente entre trilhas: o mesmo assunto tem o mesmo nível em qualquer trilha.
- Separar as trilhas de banco em "Relacionais" e "Não relacionais" sem criar um caso especial só para essa área.

**Non-Goals:**
- Reescrever cards ou mudar a quantidade de cards.

## Decisions

### 1. Seções como lista fixa no código, como as áreas
`SECTIONS = ['relacionais', 'nao-relacionais']` em `schema.ts`, com os nomes em i18n. A trilha ganha o campo opcional `section`, aceito só em trilhas diretas (a regra fica em `integrity.ts`, junto das outras regras de posição). `areaSections` passa a devolver `direct` (sem seção) e `grouped`, uma lista `{ section, tracks }` na ordem de `SECTIONS`, só com as seções que têm trilhas.
*Alternativa descartada:* seções no `content/taxonomy.json`. Elas precisariam de tradução, e o cadastro não tem esse mecanismo, pelo mesmo motivo que as áreas ficaram no código.
*Alternativa descartada:* tratar "relacional" como linguagem (SQL). Isso daria uma navegação enganosa, que já foi rejeitada na change de banco de dados.

### 2. Critério de nível

| Nível | O que entra |
|---|---|
| Júnior | O que é, sintaxe e uso básico; fundamentos que se espera de quem começa (OOP básica, hooks básicos, charset, ACID) |
| Pleno | Usar bem no dia a dia: armadilhas comuns (erros async, `await` em laço, N+1), performance comum (índices, paginação, memoização), segurança aplicada (XSS, CSRF, cookies), organização e testes |
| Sênior | Internals (event loop por dentro, libuv, MVCC, índice clusterizado, HashMap), trade-offs de arquitetura (escolha de banco, estado global, organização de sistemas grandes), sistemas distribuídos (CAP, quórum, sharding) e operação em escala (mudanças de esquema sem parada, cache stampede) |

### 3. Ajustes de nível (67 cards)

| Trilha | Card (id) | De → Para |
|---|---|---|
| crud-4-frameworks | `transacoes`, `paginacao-offset-cursor`, `pool-de-conexoes` | S → P |
| fundamentos-web | `csrf`, `xss-vs-csrf`, `cookie-ou-localstorage` | S → P |
| javascript-assincrono | `ordem-de-execucao`, `ordem-then-timeout`, `abort-controller`, `await-em-loop` | S → P |
| javascript-no-navegador | `debounce` | S → P |
| nodejs | `worker-threads`, `graceful-shutdown`, `sigterm` | S → P |
| react | `use-effect`, `regras-dos-hooks` | P → J |
| react | `reconciliacao`, `memoizacao`, `memo-callback` | S → P |
| nextjs | `hidratacao`, `erro-hidratacao` | S → P |
| express | `erros-async`, `async-handler`, `erro-async-express` | S → P |
| express | `organizar-api-express` | P → S |
| typescript-avancado | `generic` | P → J |
| typescript-avancado | `repositorio-generico`, `satisfies-vs-anotacao` | S → P |
| angular | `busca-switchmap`, `signals-vs-rxjs` | S → P |
| nestjs | `ciclo-de-vida`, `ordem-execucao-nest`, `logging-interceptor` | S → P |
| java-essencial | `heranca`, `polimorfismo`, `checked-unchecked` | P → J |
| java-essencial | `sealed-pattern` | S → P |
| spring-boot | `n-mais-1-jpa`, `spring-security` | S → P |
| python-essencial | `mutabilidade` | P → J |
| python-essencial | `asyncio` | S → P |
| fastapi | `async-correto` | S → P |
| django | `select-related`, `n-mais-1-django`, `n-mais-1-django-pergunta` | S → P |
| django | `django-vs-fastapi` | P → S |
| sql-essencial | `window-function`, `total-acumulado`, `left-join-filtro` | S → P |
| modelagem-de-dados | `desnormalizacao`, `contador-desnormalizado` | S → P |
| transacoes-e-performance | `acid` | P → J |
| transacoes-e-performance | `anomalias-concorrencia`, `deadlock`, `indice-anulado`, `offset-vs-cursor` | S → P |
| postgresql | `pg-stat-statements` | S → P |
| mysql | `charset`, `utf8-emoji`, `emoji-utf8mb4` | P → J |
| mongodb | `transacoes-mongo`, `transacao-mongo-pergunta`, `indice-esr` | S → P |
| redis | `list-set` | P → J |
| redis | `streams`, `stream-exemplo`, `pubsub-vs-streams` | S → P |

As trilhas javascript-essencial, vue, typescript-essencial, java-colecoes-e-concorrencia e nosql não mudam.

O CRUD comparativo fica sem cards sênior. É uma trilha de construção passo a passo, e os três que estavam como sênior (transação, paginação e pool de conexões) são conhecimento de pleno. A regra "cada trilha tem os três níveis" vale só para as trilhas das capabilities de conteúdo por linguagem e de banco de dados, e todas continuam cumprindo essa regra depois dos ajustes.

### 4. Aplicação por script
Um script lê esta tabela e altera só o campo `level` dos ids listados, mantendo a formatação dos JSON. Assim o diff fica restrito às linhas de nível.

## Risks / Trade-offs

- [Nível é julgamento editorial] → O critério fica documentado aqui e a lista está no PR. Um card fora do critério é corrigido pontualmente.
