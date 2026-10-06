## Why

Vagas de frontend sênior cobram performance: escolher como cada página é renderizada, enviar menos JavaScript, otimizar imagens e fontes e melhorar as Core Web Vitals. A trilha Next.js explica Server e Client Components, SSR, SSG, ISR e hidratação, mas não como deixar uma aplicação Next rápida nem o modelo de cache atual. Esta é a sétima trilha da série que cobre as lacunas de uma vaga de frontend sênior.

## What Changes

- Trilha nova **Performance no Next.js** (`performance-no-nextjs`), com 24 cards em PT-BR e tradução completa para inglês, no mesmo formato das trilhas existentes:
  - **Estratégias de renderização:** rota estática ou dinâmica, renderização no cliente dentro do Next, Cache Components (`'use cache'`, `cacheLife`, `cacheTag`) e pré-renderização parcial.
  - **Imagens, fontes e JavaScript:** `next/image`, `next/font`, `next/dynamic` e o tamanho do JavaScript enviado ao cliente.
  - **Core Web Vitals:** LCP, INP, CLS e dados de laboratório e de campo.
  - **Perguntas de entrevista.**
- A trilha fica no framework Next.js, na área Frontend, depois da trilha "Next.js": Frontend › JavaScript › Next.js passa a listar 2 trilhas.

## Capabilities

### New Capabilities

- `nextjs-performance-content`: a trilha "Performance no Next.js", com a posição na navegação, os decks e as contagens, o conteúdo autoral, a ligação com o glossário, a mistura de níveis e a tradução.

### Modified Capabilities

- `javascript-content`: em Frontend › JavaScript, Next.js passa a ter 2 trilhas, e a linguagem conta 14 trilhas.

## Impact

- `content/tracks/performance-no-nextjs/track.json` e `translations/en.json`, registrados em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes novos: `src/content/__tests__/nextjs-performance-track.test.ts` e `src/__tests__/nextjs-performance-navigation.test.tsx`. Ajuste das contagens em `javascript-navigation.test.tsx`.
- README: lista de trilhas.
- Sem mudança no schema, nas telas, na navegação, na API ou nos dados salvos.

## Fora de escopo

- Repetir o que a trilha Next.js já cobre (Server e Client Components, SSR/SSG/ISR, hidratação, streaming com Suspense).
- Atualizar os cards antigos da trilha Next.js (ex.: Middleware, que no Next 16 se chama `proxy`, e o cache por `fetch`), que fica para um change próprio.
- Renderização fora do Next (SPA com Vite, Astro, Remix) e performance de backend e banco.
- A última trilha da série (Módulos nativos no Expo), num change próprio.
