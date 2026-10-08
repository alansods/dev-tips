## 1. Dados

- [x] 1.1 Spec: "Data de inclusão da trilha", "Continue de onde parou" (última resposta) e "Áreas de interesse"
- [x] 1.2 Testes falhando para `addedAt` (válida e inválida), para `lastAnswer` no store de estudo (versão 4) e para `interests` no store de preferências
- [x] 1.3 Implementar `addedAt` no schema e preencher as trilhas pelo `git log`, `lastAnswer` e `interests`

## 2. Regras do Início

- [x] 2.1 Spec: requisitos da capability `home`
- [x] 2.2 Testes falhando em `src/home/__tests__/sections.test.ts` para saudação, revisão, continuar, em andamento, sugestões, novas trilhas, comece por aqui e semana
- [x] 2.3 Implementar `src/home/sections.ts`

## 3. Sessão de todas as trilhas

- [x] 3.1 Spec: "Revisão de todas as trilhas"
- [x] 3.2 Teste falhando em `src/__tests__/review-flow.test.tsx` para "Cards de várias trilhas", "Resposta na trilha certa" e "Nada para revisar"
- [x] 3.3 Refatorar `StudySession` para `entries`, adaptar as rotas de deck e de revisão e criar `review/index.tsx`

## 4. Telas

- [x] 4.1 Spec: "Navegação por abas", "Aba Perfil", "Tela de login" e "Abrir pela notificação"
- [x] 4.2 Mover a lista de áreas para `(tabs)/tracks.tsx` e ajustar os testes que abriam `/` para `/tracks`
- [x] 4.3 Testes falhando em `src/__tests__/home.test.tsx` para os cenários das telas de `home`, para as 4 abas e para "Áreas de interesse" no Perfil
- [x] 4.4 Criar a tela do Início e as suas seções, `InterestsSection` no Perfil, `HomeIcon` e os textos em pt-BR e inglês

## 5. Verificação

- [x] 5.1 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
