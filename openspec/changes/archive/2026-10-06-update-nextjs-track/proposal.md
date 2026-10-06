## Why

A trilha Next.js foi escrita antes do Next.js 16 e ficou com conteúdo desatualizado: o card de Middleware não reflete a troca para `proxy.ts`, e o card de cache mostra só o modelo antigo (`fetch` com `revalidate`), enquanto o modelo atual é o Cache Components. A trilha nova "Performance no Next.js" já segue o Next 16, e as duas precisam dizer a mesma coisa.

## What Changes

- Card `middleware-next` vira `proxy`: passa a se chamar "Proxy (antigo Middleware)" e explica o `proxy.ts` com `export function proxy`, o runtime Node.js e que `middleware.ts` ficou descontinuado no Next 16.
- Card `revalidate` vira `cache-e-revalidacao` ("Cache e revalidação"): o snippet passa a usar Cache Components (`'use cache'`, `cacheLife`, `cacheTag` e `updateTag`), e o texto explica que o modelo antigo (`fetch` com `revalidate` e `cache: "no-store"`) vale só sem `cacheComponents`.
- Card `ssr` e pergunta `ssr-vs-ssg`: uma frase sobre como SSR, SSG e ISR aparecem no Next atual (rota estática ou dinâmica, conteúdo em cache e pré-renderização parcial).
- Pergunta `por-que-nextjs`: cita o Turbopack como bundler padrão.
- Os dois cards trocam de id porque o nome antigo ficou errado. O progresso salvo desses dois cards se perde, o que o usuário aceitou (o app está em fase de testes).
- Tradução em inglês dos mesmos cards.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `javascript-content`: novo requisito "Trilha Next.js na versão atual", que fixa o Proxy e o modelo de cache atual.

## Impact

- `content/tracks/nextjs/track.json` e `translations/en.json`, só o texto de 5 cards.
- Teste novo: `src/content/__tests__/nextjs-current.test.ts`.
- Sem mudança de código, de telas ou de navegação. O progresso salvo dos cards `middleware-next` e `revalidate` deixa de ser exibido, porque os ids não existem mais.

## Fora de escopo

- Reescrever a trilha ou mudar a estrutura de decks.
- Repetir na trilha Next.js o detalhe de Cache Components e pré-renderização parcial, que fica na trilha "Performance no Next.js".
- Revisar as outras trilhas de frameworks.
