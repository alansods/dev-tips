## 1. Material de origem (Requirement: Material de origem preservado)

- [x] 1.1 Escrever o teste que falha: `content/sources/crud-4-frameworks.md` existe e contém os 16 títulos de passo, a tabela comparativa e o glossário
- [x] 1.2 Salvar o markdown fornecido, sem alterações, em `content/sources/crud-4-frameworks.md`; teste passando

## 2. Testes do tema (todos os requirements de crud-theme-content)

- [x] 2.1 Escrever em `src/content/__tests__/crud-theme.test.ts` (ambiente node) os testes de identidade, ordem de variantes e colunas, decks e contagens, passos contíguos e glossário completo
- [x] 2.2 Escrever os testes da tabela de endpoints (criação e remoção, e a tabela inteira)
- [x] 2.3 Escrever os testes de fidelidade: código exato e texto normalizado (sem `**` e crases, espaços colapsados, case-insensitive), pulando `supplement`, mais o caso do Spring no Passo 1 como `text`
- [x] 2.4 Escrever os testes de complementos (conjunto exato, posições, coerência do docker-compose) e de `relatedTerms` (não vazio em steps e endpoints; Passo 13 → cors; Passo 16 → mock)
- [x] 2.5 Rodar e confirmar que todos falham porque o `theme.json` ainda não existe

## 3. Transcrição do conteúdo original

- [x] 3.1 Escrever o script descartável (no scratchpad, fora do repo) que extrai do markdown: endpoints, passos (títulos, textos, file/language/code/note por framework), tabela comparativa e glossário, gerando um rascunho do `theme.json`
- [x] 3.2 Completar no rascunho: ids conforme o design, `language` (Spring no Passo 1 = `text`), caminhos com `{id}` e status dos endpoints
- [x] 3.3 Adicionar `relatedTerms` a todos os steps e endpoints, a partir dos termos que cada um menciona
- [x] 3.4 Salvar em `content/themes/crud-4-frameworks/theme.json`; testes de identidade, contagem, endpoints, fidelidade e `relatedTerms` passando, e gate do repositório verde

## 4. Complementos (Requirement: Complementos marcados)

- [x] 4.1 Escrever os 4 cards `code` com `origin: "supplement"`: `docker-compose`, `express-to-product`, `express-query-schemas` e `express-server`, coerentes com os passos 3, 7, 8 e 14
- [x] 4.2 Inseri-los nas posições da spec; testes de complementos passando

## 5. Revisão e verificação final

- [x] 5.1 Revisar o diff do `theme.json` contra o markdown (amostra de cada tipo de card) e conferir manualmente os complementos
- [x] 5.2 Conferir que todo cenário da spec tem pelo menos um teste com o mesmo nome
- [x] 5.3 Rodar `openspec validate add-crud-theme-content --strict`
- [x] 5.4 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`, todos verdes
