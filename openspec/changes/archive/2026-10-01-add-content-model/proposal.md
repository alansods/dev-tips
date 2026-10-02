## Why

O app inteiro (catálogo, sessão de estudo, glossário, progresso) depende de um formato de conteúdo estável. Sem um contrato validado, cada tema novo vira risco de card quebrado, termo de glossário inexistente ou snippet faltando. O primeiro tema (CRUD em 4 frameworks) e os próximos (Fundamentos web, Banco de dados, Frontend/React, System design) precisam caber no mesmo modelo.

## What Changes

- Define o modelo de conteúdo **genérico**: `Theme` → `Deck` → `Card`.
- Cada tema declara opcionalmente suas **variantes** (ex.: frameworks) e suas **colunas de comparação**. Temas sem comparação não precisam de nenhuma das duas.
- Cinco tipos de card (união discriminada por `type`):
  - `endpoint`: método + caminho + operação CRUD + status.
  - `step`: passo de tutorial com um snippet por variante.
  - `compare`: conceito com valor por coluna.
  - `concept`: termo + definição. É também a fonte do glossário.
  - `code`: um snippet avulso, opcionalmente ligado a uma variante. Serve para complementos como `docker-compose.yml` e `toProduct`.
- Todo card tem `origin`: `original` (veio do material) ou `supplement` (complemento escrito depois).
- `relatedTerms` liga qualquer card a cards `concept` do mesmo tema. É a base dos "termos clicáveis".
- Validador que retorna **todos** os erros com caminho legível, usado como gate em `npm test` para todo `content/themes/*/theme.json`.
- Cria o projeto base (Expo + TypeScript + Jest + ESLint) necessário para rodar o validador, seus testes, lint e typecheck.

## Capabilities

### New Capabilities
- `content-model`: estrutura, tipos de card, regras de integridade e validação do conteúdo de estudo.

### Modified Capabilities
<!-- nenhuma: não há specs existentes -->

## Impact

- Novos arquivos: `src/content/` (schema, validador, tipos, testes), `content/themes/` (vazio por enquanto).
- Novas dependências: `zod`. Base Expo (`expo`, `react-native`, `typescript`, `jest-expo`, `eslint-config-expo`).
- Todas as capabilities futuras (`theme-catalog`, `study-session`, `glossary-links`, `progress`) consomem os tipos daqui.

## Fora de escopo

- O conteúdo do tema CRUD (`theme.json`): fica para a change seguinte.
- Qualquer tela, navegação, tema claro/escuro e Prettier (change de scaffold).
- Cards de `quiz` (gerados em change própria) e dados de repetição espaçada.
- Internacionalização: o conteúdo é só PT-BR.
- Carregamento remoto de conteúdo.
