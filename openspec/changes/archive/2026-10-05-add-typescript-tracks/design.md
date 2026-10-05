## Context

Segue o mesmo caminho de `add-javascript-tracks`: formato, navegação, cadastro e gerador de conteúdo já existem. O cadastro já tem `angular` e `nest` na linguagem `typescript`.

## Goals / Non-Goals

**Goals:**
- Cobrir o que entrevistas cobram de TypeScript: o sistema de tipos no dia a dia (essencial) e na construção de tipos reutilizáveis (avançado), mais os dois frameworks TypeScript-first.

**Non-Goals:**
- Repetir conceitos de JavaScript: as trilhas de TypeScript partem do que JavaScript essencial já cobre.

## Decisions

### 1. Mesmo formato e mesmo gerador da change de JavaScript
São 24 cards por trilha (3 decks de 6 e 1 de perguntas com 6), e os testes são parametrizados como em `javascript-tracks.test.ts`. O conteúdo é escrito como dados num script de apoio fora do repositório, que gera o `track.json` e o `en.json`.

### 2. Snippets em `ts`, e `json` para configuração
O código é TypeScript. O `tsconfig.json` aparece como `json`, que o formato já suporta. Templates do Angular ficam inline no decorator (`template:`), dentro do snippet `ts`.

### 3. Angular moderno
O conteúdo usa componentes standalone, a sintaxe de controle de fluxo (`@if`, `@for`), `inject()` e signals, que são o padrão atual. NgModules e `*ngIf` aparecem só como contexto, para quem encontra código legado.

### 4. Critério de nível
O mesmo da change de JavaScript:
- **Júnior**: o que é e o uso básico.
- **Pleno**: usar bem e as armadilhas.
- **Sênior**: internals, trade-offs e arquitetura.

## Risks / Trade-offs

- [APIs que mudam rápido (Angular signals, NestJS)] → O foco fica nos conceitos estáveis, com detalhes de versão só quando são o assunto do card.
- [Exatidão técnica não é coberta por teste] → Revisão no PR, com a lista de cards por trilha.
