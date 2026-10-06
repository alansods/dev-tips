## Context

A trilha `nextjs` tem 24 cards escritos antes do Next.js 16. A doc atual (16.2) renomeou `middleware.ts` para `proxy.ts` e trouxe o Cache Components (`cacheComponents: true`), com o modelo antigo de cache documentado à parte ("caching without Cache Components"). A trilha "Performance no Next.js" já usa o modelo novo.

## Goals / Non-Goals

**Goals:**
- Corrigir os cards desatualizados sem mudar a estrutura dos decks.

**Non-Goals:**
- Reescrever a trilha ou detalhar Cache Components aqui (fica na trilha de performance).

## Decisions

### 1. Novos ids para os cards renomeados
O progresso salvo (local e na nuvem) é indexado pelo id do card, então trocar o id faz o progresso daquele card se perder. O usuário aceitou isso, porque o app está em fase de testes. Os dois cards cujo id ficou errado mudam: `middleware-next` → `proxy` e `revalidate` → `cache-e-revalidacao`. Os outros ids continuam. Nenhum card nem teste referencia os ids antigos.
*Alternativa descartada:* manter os ids antigos para preservar o progresso, o que deixaria um id `middleware-next` para um card sobre Proxy.

### 2. O que muda em cada card
- `proxy` (concept, antigo `middleware-next`): termo "Proxy (antigo Middleware)"; definição com `proxy.ts` na raiz, `export function proxy`, `matcher`, runtime Node.js, `middleware.ts` descontinuado no Next 16 (mantido só para quem precisa do runtime edge) e o codemod `middleware-to-proxy`.
- `cache-e-revalidacao` (code, antigo `revalidate`): snippet com uma função de dados em cache (`'use cache'`, `cacheLife('hours')`, `cacheTag('posts')`) e uma Server Action que chama `updateTag('posts')`; o texto cita que `cacheComponents` precisa estar ligado e que, sem ele, vale o modelo anterior (`fetch` com `next.revalidate` e `cache: "no-store"`, `revalidatePath`).
- `ssr` (concept) e `ssr-vs-ssg` (question): uma frase final ligando as estratégias ao Next atual.
- `por-que-nextjs` (question): cita o Turbopack, bundler padrão do Next 16.

### 3. Tradução
`translations/en.json` atualizado nos mesmos campos. O termo em inglês é "Proxy (formerly Middleware)".

## Risks / Trade-offs

- [Projetos em produção ainda usam `middleware.ts` e o cache por `fetch`] → Os cards citam os nomes e o modelo antigos, para a pessoa reconhecer os dois em entrevista e em código legado.
