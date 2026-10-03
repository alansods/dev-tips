# Backend: decisão atual e alternativa documentada

Este documento registra como o backend do Dev Tips foi escolhido, as opções que ficaram de fora e o passo a passo da principal alternativa (NestJS + Render + monorepo), caso o projeto migre para ela no futuro.

Preços e limites conferidos nas páginas oficiais em 2026-10-02. Confira de novo antes de decidir, porque mudam com frequência.

## Decisão atual

| Item       | Escolha                                 | Por quê                                                                                                          |
| ---------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Hospedagem | **Cloudflare Workers**                  | Grátis (100 mil requisições por dia) e **não dorme**: a resposta sai em milissegundos, sem espera para "acordar" |
| Framework  | **Hono**                                | O padrão para APIs no Workers: leve, TypeScript nativo, validação com Zod                                        |
| Banco      | **Cloudflare D1** (SQLite)              | Grátis (5 GB, 5 milhões de linhas lidas e 100 mil gravadas por dia), ligado direto ao Worker, sem espera         |
| Estrutura  | Pasta **`api/`** na raiz do repositório | Projeto independente ao lado do app; nada do app muda de lugar                                                   |

Custo inicial: **$0**. Para publicar o app nas lojas existem custos à parte: Apple Developer US$ 99/ano e Google Play US$ 25 uma única vez.

## Opções avaliadas

### Supabase (sem API própria)

Postgres com login pronto (Google incluído), sem servidor para escrever. Plano Free: banco de 500 MB, 50 mil usuários ativos por mês, 2 projetos. O projeto **pausa depois de 1 semana sem uso**. Pro a partir de US$ 25/mês. Ficou de fora porque o objetivo é construir a própria API.

### Hono × Express × NestJS no Workers

- **Hono:** feito para o Workers; é a escolha mais comum para APIs novas nessa plataforma.
- **Express:** roda no Workers pela camada de compatibilidade com o Node (flag `nodejs_compat` e `httpServerHandler` de `cloudflare:node`; há tutorial oficial com D1). É mais pesado e é a opção de quem migra código Express existente.
- **NestJS:** não roda bem no Workers (depende de muito do Node e inicia devagar para o limite de 10 ms de CPU por chamada). Precisa de um servidor Node tradicional (ver a alternativa abaixo).

Os conceitos (rotas, middlewares, validação, JWT, SQL, camadas) são os mesmos nos três.

### D1 × Neon

|                       | D1 (SQLite)                                                           | Neon (Postgres)                                                                                    |
| --------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Velocidade            | Ligado ao Worker, nunca dorme                                         | Consultas por HTTP; suspende depois de 5 min ocioso e a primeira consulta leva menos de 1 s a mais |
| SQL                   | Mais simples (datas como texto, booleano 0/1, `ALTER TABLE` limitado) | Postgres completo (`JSONB`, tipos ricos)                                                           |
| Desenvolvimento local | Na hora, com o `wrangler`, sem Docker                                 | Precisa de Postgres local (Docker) ou de uma branch do Neon                                        |
| Portabilidade         | Só existe na Cloudflare                                               | Roda em qualquer lugar                                                                             |
| Mercado               | Raro em vagas de backend                                              | O banco mais pedido em vagas                                                                       |
| Grátis                | 5 GB                                                                  | 1 GB e 100 h de processamento por mês                                                              |

## Alternativa: NestJS + Render + Neon em monorepo

Caminho para quando o projeto precisar de um servidor Node tradicional, por exemplo para usar NestJS. O código de rotas e as regras de negócio mudam de framework, mas o modelo de dados e os endpoints podem ser os mesmos.

### Hospedagem e custos

| Hospedagem  | Grátis?                   | Quando dorme                                                               | Custo para não dormir                 |
| ----------- | ------------------------- | -------------------------------------------------------------------------- | ------------------------------------- |
| **Render**  | 750 h por mês             | Depois de **15 min** sem requisições; leva **cerca de 1 min** para acordar | Plano pago                            |
| **Fly.io**  | Trial                     | Pode desligar quando ocioso e religar em segundos                          | Máquina mínima por cerca de US$ 2/mês |
| **Railway** | US$ 5 de crédito, uma vez | Não dorme                                                                  | Hobby a US$ 5/mês                     |

Banco: **Neon** grátis. **Não usar o Postgres grátis do Render: ele expira 30 dias depois de criado.**

Para lidar com o Render dormindo: só o login espera a API, com a mensagem "Conectando ao servidor… pode levar até 1 minuto"; a sincronização roda em segundo plano; e abrir Ajustes dispara um `GET /health` para ir acordando a API.

### Estrutura alvo

```
Dev_Tips/
├── apps/
│   ├── mobile/          ← app Expo (src/, assets/, app.json, eas.json…)
│   └── api/             ← NestJS (módulos health, auth, users, sync; migrations/)
├── packages/
│   └── shared/          ← schemas Zod e tipos usados pelo app e pela API
├── content/             ← conteúdo editorial
├── openspec/
├── render.yaml          ← Blueprint do Render
└── package.json         ← npm workspaces
```

Se a pasta `api/` (Hono) já existir, ela vira `apps/api/` ou é substituída pelo NestJS.

### Passo a passo da reorganização (change `restructure-monorepo`, sem mudar comportamento)

Como é um refactor, a change usa `skip_specs: true`. A garantia vem da suíte existente, que precisa continuar verde.

1. **Mover o app com `git mv`** para `apps/mobile/`: `src/`, `assets/`, `scripts/`, `app.json`, `eas.json`, `jest.setup.ts`, `tsconfig.json`, `eslint.config.js` e o `package.json`. Com `git mv`, o Git registra renomeação e o histórico de cada arquivo continua (`git log --follow`).
2. **Criar o `package.json` da raiz** com workspaces:
   ```json
   {
     "name": "dev-tips-monorepo",
     "private": true,
     "workspaces": ["apps/*", "packages/*"],
     "scripts": {
       "test": "npm test -w apps/mobile",
       "lint": "npm run lint -w apps/mobile",
       "typecheck": "npm run typecheck -w apps/mobile",
       "format": "prettier --write ."
     },
     "devDependencies": { "prettier": "^3.9.9" }
   }
   ```
   - `workspaces`: cada pasta em `apps/` e `packages/` é um projeto; um `npm install` na raiz instala todos.
   - **Hoisting:** um único `node_modules` e um único `package-lock.json` na raiz.
   - `-w apps/mobile`: roda o comando dentro daquele workspace.
   - O Prettier (`.prettierrc` e `.prettierignore`) fica na raiz, valendo para todos.
3. **`content/` fica na raiz**, acessado por apelido de caminho em vez de `../../../../`:
   - `apps/mobile/tsconfig.json`: `"paths": { "@content/*": ["../../content/*"] }`. O Metro lê os `paths` do tsconfig automaticamente;
   - Jest: `"moduleNameMapper": { "^@content/(.*)$": "<rootDir>/../../content/$1" }`;
   - atualizar os imports em `src/content/catalog.ts` e `src/content/translations.ts`, e trocar os testes que montam `path.resolve(__dirname, '../../../content')` por uma constante única `CONTENT_DIR`.
4. **O que não muda:**
   - **Metro:** configurado automaticamente para monorepos desde o SDK 52, sem `metro.config.js`;
   - **tsconfig, Jest e ESLint do app:** vão junto e continuam relativos a `apps/mobile`;
   - **`.gitignore`:** os padrões valem em qualquer nível;
   - **EAS:** builds disparados de dentro de `apps/mobile`.
5. **`packages/shared`:** criar só quando houver o primeiro código comum (por exemplo, o schema Zod do progresso), importado como `"@dev-tips/shared": "*"`.
6. **Documentação:** atualizar os caminhos em `AGENTS.md` (`src/app/` passa a `apps/mobile/src/app/`) e o `context` do `openspec/config.yaml`.

Riscos e verificação:

- **Duas cópias do React ou do React Native** (o Expo não suporta): `npm why react-native` deve mostrar uma única versão;
- **Imports quebrados:** `npm test`, `npm run lint`, `npm run typecheck`;
- **Configuração do Expo:** `npx expo-doctor` em `apps/mobile`;
- **O app abrindo:** `npx expo start` em `apps/mobile`.

### Deploy no Render (monorepo)

O Render baixa o repositório do GitHub a cada push. O `rootDir` **não** deve ser usado: arquivos fora dele ficam inacessíveis, e a API não enxergaria o `packages/shared`. O build roda a partir da raiz e o `buildFilter` evita deploy quando só o app muda:

```yaml
# render.yaml
services:
  - type: web
    name: dev-tips-api
    runtime: node
    plan: free
    buildCommand: npm ci && npm run build -w packages/shared && npm run build -w apps/api
    startCommand: npm run start:prod -w apps/api
    healthCheckPath: /health
    buildFilter:
      paths:
        - apps/api/**
        - packages/shared/**
        - package-lock.json
    envVars:
      - key: DATABASE_URL # string de conexão do Neon
        sync: false # valor digitado no painel, nunca no repositório
      - key: JWT_SECRET
        sync: false
```

### API NestJS

- **ORM:** TypeORM com migrations (sem `synchronize` em produção).
- **Autenticação:** ID token do Google ou da Apple validado com `jose`; access JWT de 15 min e refresh de 30 dias rotacionado.
- **Endpoints:**
  - `GET /health`;
  - `POST /auth/google` e `POST /auth/apple`;
  - `POST /auth/refresh` e `POST /auth/logout`;
  - `GET /me` e `DELETE /me`;
  - `GET/PUT /sync`.
- **Testes:** Jest + Supertest contra um Postgres de teste em Docker.
