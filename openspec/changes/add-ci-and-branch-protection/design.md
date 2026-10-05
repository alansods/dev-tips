## Context

Projeto com um único desenvolvedor, repositório público no GitHub, app Expo (SDK 57) na raiz e API Hono/Cloudflare Workers em `api/`, cada um com o próprio `package-lock.json`. O fluxo de branches é `feat|fix|chore/*` → `dev` → `main`. O app ainda não está nas lojas, e a API é publicada à mão com `wrangler deploy`.

## Goals / Non-Goals

**Goals:**
- Impedir que um erro que escapou dos testes locais entre na `dev` ou na `main`.
- Proteger o histórico das duas branches.
- Saber de falhas de segurança nas dependências sem ruído semanal.

**Non-Goals:**
- Deploy contínuo (API ou app).
- Substituir os testes locais.

## Decisions

### 1. Um workflow com dois jobs paralelos (`app` e `api`)
Cada job roda numa máquina zerada e mostra no PR qual parte quebrou. `app` roda lint, typecheck, Prettier, testes e `openspec validate --strict --all`; `api` roda typecheck e testes na pasta `api/`.
*Alternativa descartada:* um job só, mais lento e com erro menos claro.

### 2. Gatilhos e concorrência
`pull_request` para `main` e `dev`, e `push` em `main` e `dev`. A concorrência é por branch, e só em PR a execução antiga é cancelada quando chega um commit novo.

### 3. Node 24 (LTS) e cache do npm
A CI usa a versão LTS atual, independente da versão de quem desenvolve. O cache do npm usa o `package-lock.json` de cada parte.

### 4. Menor privilégio e actions fixadas por SHA
`permissions: contents: read` no workflow. `actions/checkout` e `actions/setup-node` são fixadas pelo SHA do commit, com a tag em comentário, porque uma tag pode ser movida.

### 5. Rulesets
- `main`: exige PR, exige os checks `app` e `api`, bloqueia push forçado e exclusão. Admins podem fazer bypass só na tela do PR.
- `dev`: exige os checks `app` e `api` em qualquer commit que entre, bloqueia push forçado e exclusão. Não exige PR, para permitir avançar a `dev` até o commit da `main` depois de uma release.
- Sem aprovação obrigatória (um dev solo não aprova o próprio PR) e sem exigir branch atualizada.
*Alternativa descartada:* proteção de branch clássica; os rulesets são o formato atual e permitem bypass por PR.

### 6. Dependabot só para segurança
Alertas de vulnerabilidade e correções automáticas ligados nas configurações do repositório, sem `dependabot.yml`. Os PRs de segurança vão para a `main` (o GitHub não permite mudar o destino deles). Para dependências do app, a compatibilidade com o Expo é conferida com `npx expo install --check`.
*Alternativa descartada:* PR semanal com todas as atualizações; ruído sem ganho de segurança.

## Achados da primeira execução

- `api/tsconfig.json` tinha `"extends": "expo/tsconfig.base"`, entrado por engano no commit `9c3a1a8`. Localmente o TypeScript achava o `expo` no `node_modules` do app; na CI, o job `api` só instala as dependências da `api/`. A linha foi removida, e a API volta a não depender do app.
- O teste "Ícones reproduzíveis" também comparava os PNGs gerados com os de `assets/` byte a byte. Os pixels são idênticos, mas o zlib do Node 23 (1.2.12) e o do Node 24 (1.3.2.1) comprimem com bytes diferentes. A comparação com `assets/` passa a usar o cabeçalho e os pixels descomprimidos; a exigência da spec (duas execuções idênticas byte a byte) não muda.

## Risks / Trade-offs

- [A CI do GitHub pode ficar fora do ar e travar um merge] → Bypass explícito do admin na tela do PR.
- [Jest e lint aumentam o tempo de cada PR] → Cache do npm e jobs em paralelo.
- [PR de segurança numa dependência do Expo pode quebrar a compatibilidade com o SDK] → CI e `npx expo install --check` antes do merge.
