## 1. Testes do tema (web-fundamentals-content)

- [x] 1.1 Escrever `src/content/__tests__/web-theme.test.ts` com os testes que falham: tema no catálogo, sem frameworks, contagem por deck, sem termos repetidos entre temas, sem complementos, todos os cards ligados, pergunta ligada aos termos que cita
- [x] 1.2 Escrever os testes de tela que falham: tema na Home e sem frameworks na tela do tema

## 2. Conteúdo

- [x] 2.1 Escrever `content/themes/fundamentos-web/theme.json` (21 concepts e 6 questions) e registrá-lo em `src/content/catalog.ts`; testes do grupo 1 passando, com o gate de conteúdo verde

## 3. Glossário com vários temas (glossary)

- [x] 3.1 Atualizar os testes do Glossário (lista completa com 45, tema de cada termo, buscar pelo nome com 2 termos) e escopar os testes da aba Progresso por tema
- [x] 3.2 Mostrar o título do tema em cada item do Glossário quando houver mais de um tema e adicionar `testID` por tema na aba Progresso; testes passando

## 4. Verificação final

- [x] 4.1 No navegador: Home com 2 temas, abrir Fundamentos web, estudar 2 cards de perguntas, ver o Glossário com o tema em cada item
- [x] 4.2 Conferir que todo cenário dos deltas tem pelo menos um teste com o mesmo nome
- [x] 4.3 Rodar `openspec validate add-web-fundamentals-theme --strict`
- [x] 4.4 Rodar `npm test`, `npm run lint`, `npx tsc --noEmit` e `npm run format:check`, todos verdes
