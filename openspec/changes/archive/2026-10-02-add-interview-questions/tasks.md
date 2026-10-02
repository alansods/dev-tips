## 1. Schema (content-model)

- [x] 1.1 Escrever os testes que falham: pergunta válida, pergunta sem resposta, pergunta com termo relacionado inexistente, snippet em question validado
- [x] 1.2 Implementar `questionCardSchema` e incluí-lo na união; exportar o tipo `QuestionCard`; testes passando (o typecheck vai apontar o `CardFace` e o `cardTitle`)

## 2. Apresentação (study-flow)

- [x] 2.1 Escrever o teste que falha "Pergunta de entrevista" (frente e verso)
- [x] 2.2 Implementar o componente `Question` no `CardFace`, `CARD_TYPE_LABEL.question`, o convite em `copy.ts` e `cardTitle` para question; testes passando

## 3. Conteúdo (crud-theme-content, progress)

- [x] 3.1 Atualizar os testes do tema: contagem com 5 decks, perguntas na ordem, 12 supplements, relatedTerms em question; atualizar o cenário "Com progresso" (5%, 67 não vistos) e o "Abrir o tema" (5 decks)
- [x] 3.2 Escrever os 8 cards `question` no `theme.json`, no deck `perguntas-de-entrevista`; testes passando, com o gate de conteúdo verde

## 4. Verificação final

- [x] 4.1 No navegador: abrir o deck Perguntas de entrevista e conferir frente e verso de 2 perguntas
- [x] 4.2 Conferir que todo cenário dos deltas tem pelo menos um teste com o mesmo nome
- [x] 4.3 Rodar `openspec validate add-interview-questions --strict`
- [x] 4.4 Rodar `npm test`, `npm run lint`, `npx tsc --noEmit` e `npm run format:check`, todos verdes
