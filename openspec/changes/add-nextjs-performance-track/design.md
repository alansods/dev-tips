## Context

Formato e testes iguais às trilhas anteriores da série. A trilha usa o framework `nextjs` na área Frontend e aparece em Frontend › JavaScript › Next.js, depois da trilha "Next.js", sem mudar código. O usuário escolheu focar em Next em vez de uma trilha geral de renderização (que compararia SPA com Vite e outros frameworks).

## Goals / Non-Goals

**Goals:**
- Cobrir, no nível de entrevista, como deixar uma aplicação Next.js rápida: decisão estática ou dinâmica por rota, o modelo de cache atual (Cache Components) e a pré-renderização parcial, imagens, fontes, JavaScript enviado ao cliente e as Core Web Vitals.

**Non-Goals:**
- Repetir a trilha Next.js. Os cards citam Server Components, ISR e streaming só como base, ligando à trilha existente pelo texto.
- Atualizar a trilha Next.js antiga.

## Decisions

### 1. Framework Next.js, só no Frontend
Escolhido pelo usuário. A trilha vira "Performance no Next.js".
*Alternativa descartada:* trilha geral de renderização em JavaScript puro, que cobriria SPA com Vite e outros frameworks, mas ficaria longe do Next.

### 2. Next.js 16
A doc atual é a do Next.js 16.2. Os cards usam:
- Cache Components: `cacheComponents: true` no `next.config.ts`, a diretiva `'use cache'`, `cacheLife` e `cacheTag`, com `updateTag` (Server Actions) e `revalidateTag`.
- Pré-renderização parcial: casca estática com as partes dinâmicas dentro de `<Suspense>`.
- `next/image` com `preload` (o `priority` foi descontinuado no Next 16), `sizes` e dimensões; `next/font`; `next/dynamic`.
- Análise do bundle com `next experimental-analyze` (Turbopack) e métricas com `useReportWebVitals`.

### 3. Plano de cards (24)
Níveis: J = júnior, P = pleno, S = sênior.

| Deck | Cards |
|---|---|
| Estratégias de renderização | concept: Rota estática ou dinâmica (P) · Renderização no cliente (P) · Cache Components (S) · Pré-renderização parcial (S) — code: Página com casca estática e parte dinâmica (S) · Dados em cache com tag (S) |
| Imagens, fontes e JavaScript | concept: next/image (J) · next/font (J) · next/dynamic (P) · JavaScript no cliente (P) — code: Imagem principal com preload e sizes (P) · Componente pesado sob demanda (P) |
| Core Web Vitals | concept: Core Web Vitals (J) · LCP (P) · INP (P) · CLS (P) — code: Enviar as métricas com useReportWebVitals (P) · Atualização urgente e não urgente com useTransition (S) |
| Perguntas de entrevista | O que causa CLS e como evitar? (J) · Por que a minha página ficou dinâmica? (P) · Como melhorar o LCP de uma página de produto? (P) · Quando renderizar no cliente dentro do Next? (P) · Uma página do Next está lenta: por onde começar? (S) · O que é a pré-renderização parcial e quando usar? (S) |

O deck de Core Web Vitals tem 4 conceitos (a visão geral e uma métrica por card) para separar o que cada métrica mede e como melhorá-la; dados de laboratório e de campo entram no card geral.

### 4. Critério de nível
O mesmo das changes anteriores.

## Risks / Trade-offs

- [O modelo de cache do Next mudou várias vezes (fetch cache, unstable_cache, Cache Components)] → Os cards usam o modelo atual e dizem que ele depende de `cacheComponents`, citando que versões antigas usam `revalidate` no `fetch`.
- [A trilha Next.js antiga continua com conceitos desatualizados] → Registrado como fora de escopo, para um change próprio.
- [Exatidão técnica não é coberta por teste] → Consulta à doc antes de escrever e revisão no PR.
