## Context

O formato das trilhas, a navegação por área › linguagem › framework e o helper de testes (`describeContentTracks`, em `src/content/__fixtures__/languageTracks.ts`) já existem. A navegação filtra as trilhas por área em todos os níveis (`frameworkTracks` em `src/content/navigation.ts`). Assim, uma trilha com framework `react` e área `mobile` faz o framework React aparecer em Mobile › JavaScript sem mudar código. A ordem dos frameworks vem de `content/taxonomy.json`, onde `react` vem antes de `react-native`.

## Goals / Non-Goals

**Goals:**
- Cobrir, no nível de entrevista, as escolhas de estado em apps React: o que fica local, em Context, numa store (Zustand ou Redux Toolkit) ou no cache de dados do servidor.
- Cobrir busca de dados com cache (React Query/SWR), a camada HTTP (Axios vs `fetch`, interceptors) e como extrair lógica em hooks personalizados.

**Non-Goals:**
- Tutorial completo de cada biblioteca. Os snippets são trechos curtos que mostram a ideia.
- Repetir o que a trilha React já tem (useState, useEffect, regras dos hooks, o conceito básico de Context).

## Decisions

### 1. Framework React, nas áreas Frontend e Mobile
`framework: "react"` com `areas: ["frontend", "mobile"]`, escolhido pelo usuário. Em Mobile › JavaScript aparecem "React" e "React Native"; quem estuda React Native encontra a trilha sem sair da área.
*Alternativas descartadas:* só Frontend (esconderia do público mobile um conteúdo que vale igual no React Native); framework `react-native` (no Frontend apareceria um framework "React Native", o que confunde).

### 2. Registro no fim do catálogo
A trilha entra depois de `deploy-na-aws`. A ordem do catálogo só define a ordem dentro de cada tela, e na tela do React ela fica depois da trilha React, que é a ordem de estudo natural.

### 3. Snippets em `ts`
O formato não tem `tsx`. Os snippets usam `ts`, inclusive com JSX, como a trilha React Native, e `bash` para instalar pacotes. Os exemplos são tipados porque as bibliotecas de estado são usadas quase sempre com TypeScript.

### 4. Plano de cards (24)
Níveis: J = júnior, P = pleno, S = sênior.

| Deck | Cards |
|---|---|
| Estado global | concept: Estado local e estado global (J) · Context e re-renderização (P) · Zustand (P) · Redux Toolkit (P) — code: Store com Zustand e seletores (P) · Slice com Redux Toolkit (P) |
| Dados do servidor | concept: Estado do servidor (P) · React Query e SWR (P) · staleTime e invalidação (S) · Axios e interceptors (P) — code: useQuery e useMutation com invalidação (P) · Interceptor de token com Axios (S) |
| Hooks personalizados | concept: Hook personalizado (J) · useReducer (P) · Composição de hooks (P) · API de um hook (S) — code: useDebounce (P) · Reducer com ações tipadas (P) |
| Perguntas de entrevista | Quando usar Context, Zustand ou Redux? (P) · Por que não guardar dados da API numa store global? (P) · Como evitar re-renderizações com Context? (S) · O que acontece quando uma query fica stale? (P) · fetch ou Axios? (J) · Como você testaria e organizaria um hook personalizado? (S) |

### 5. Versões e exatidão
Antes de escrever, consultar a doc atual (Context7) de TanStack Query, SWR, Zustand, Redux Toolkit e Axios. Os cards usam os nomes atuais das APIs (ex.: `gcTime` em vez de `cacheTime`, `isPending` no React Query) e evitam números de versão.

### 6. Critério de nível
O mesmo das changes anteriores. **Júnior**: o que é e o uso básico. **Pleno**: usar bem no dia a dia e as armadilhas comuns. **Sênior**: trade-offs de arquitetura, internals e operação em escala.

## Risks / Trade-offs

- [Exatidão técnica não é coberta por teste] → Consulta à doc antes de escrever e revisão no PR com a lista de cards.
- [APIs de bibliotecas mudam entre versões] → Os cards focam no conceito; os snippets usam só a API estável e atual.
- [Testes de navegação existentes contam trilhas] → As contagens de React (Frontend) e JavaScript (Frontend e Mobile) mudam junto com a spec, no mesmo change.
