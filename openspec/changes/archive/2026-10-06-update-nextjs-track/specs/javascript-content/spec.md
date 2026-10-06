## ADDED Requirements

### Requirement: Trilha Next.js na versão atual
O conteúdo da trilha `nextjs` SHALL seguir o Next.js 16:
- o card `proxy` (deck `dados-e-api`) SHALL ter o termo "Proxy (antigo Middleware)" e apresentar `proxy.ts` como o arquivo atual, citando `middleware.ts` só como o nome antigo;
- o card `cache-e-revalidacao` (deck `renderizacao`) SHALL ter um snippet com Cache Components (`'use cache'`, `cacheLife` e `cacheTag`) e SHALL explicar que `revalidate` no `fetch` é o modelo anterior, usado sem `cacheComponents`.

A trilha MUST NOT ter os cards com os ids antigos `middleware-next` e `revalidate`.

#### Scenario: Proxy no lugar de Middleware
- **WHEN** o card `proxy` é lido
- **THEN** o termo é "Proxy (antigo Middleware)" e a definição cita `proxy.ts`

#### Scenario: Cache Components no card de cache
- **WHEN** o card `cache-e-revalidacao` é lido
- **THEN** o snippet contém `'use cache'`, `cacheLife` e `cacheTag`, e o texto cita `cacheComponents`

#### Scenario: Ids antigos removidos
- **WHEN** a trilha `nextjs` é carregada
- **THEN** ela continua com 24 cards e não tem cards com id `middleware-next` nem `revalidate`

#### Scenario: Proxy em inglês
- **WHEN** o app está em inglês e o card `proxy` é exibido
- **THEN** o termo aparece como "Proxy (formerly Middleware)"
