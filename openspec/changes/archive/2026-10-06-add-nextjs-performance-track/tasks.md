## 1. Testes

- [x] 1.1 Testes falhando em `src/content/__tests__/nextjs-performance-track.test.ts` (com `describeContentTracks`) e `src/__tests__/nextjs-performance-navigation.test.tsx`
- [x] 1.2 Ajustar as contagens em `javascript-navigation.test.tsx` (Next.js com 2 trilhas, JavaScript com 14)

## 2. Conteúdo

- [x] 2.1 Consultar a doc atual do Next.js 16 (Cache Components, PPR, next/image, next/font, next/dynamic, análise do bundle, useReportWebVitals)
- [x] 2.2 `content/tracks/performance-no-nextjs/track.json` (PT-BR) com os 24 cards do plano
- [x] 2.3 `content/tracks/performance-no-nextjs/translations/en.json`
- [x] 2.4 Registrar a trilha em `src/content/catalog.ts` e a tradução em `src/content/translations.ts`
- [x] 2.5 Testes de conteúdo, cobertura de tradução e navegação passando

## 3. Fechamento

- [x] 3.1 README: lista de trilhas
- [x] 3.2 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
