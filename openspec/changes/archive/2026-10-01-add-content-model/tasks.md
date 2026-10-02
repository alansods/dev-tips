## 1. Base do projeto

- [x] 1.1 Confirmar no Context7 as versões estáveis atuais do Expo SDK, do jest-expo e do Zod (e a API de erros do Zod)
- [x] 1.2 Gerar o projeto com `create-expo-app --template blank-typescript` numa pasta temporária e mover para a raiz, sem sobrescrever `openspec/`, `CLAUDE.md` nem `.gitignore` (mesclar o `.gitignore`)
- [x] 1.3 Instalar `zod`, `jest-expo`, `jest` e `@types/jest`; configurar o preset `jest-expo` e os scripts `test`, `lint` (`expo lint`) e `typecheck` (`tsc --noEmit`) com TypeScript strict
- [x] 1.4 Criar um teste trivial de fumaça e confirmar que `npm test`, `npm run lint` e `npm run typecheck` passam
- [x] 1.5 Criar `content/themes/.gitkeep` e a estrutura `src/content/` com `__fixtures__/` (builder de tema válido mínimo)

## 2. Estrutura, ids e textos (Requirements: Estrutura tema, deck e card; Variantes e colunas; Origem do card)

- [x] 2.1 Escrever os testes que falham para os cenários de tema mínimo, tema sem decks, deck sem cards, texto só com espaços, id fora do padrão, tema sem variantes/colunas, variante duplicada, origem omitida e origem inválida
- [x] 2.2 Implementar em `schema.ts` os schemas de Theme, Deck, variants, compareColumns, campos comuns de card (`id`, `origin`, `tags`, `relatedTerms`) e o tipo `concept`
- [x] 2.3 Implementar o esqueleto de `validateTheme` com formatação de path e o mapa de mensagens em PT-BR; testes do grupo 2 passando

## 3. Tipos de card (Requirements: endpoint; step; snippet; compare; concept; code)

- [x] 3.1 Escrever os testes que falham para os cenários de endpoint (válido, método desconhecido, path sem barra)
- [x] 3.2 Implementar o schema `endpoint`; testes passando
- [x] 3.3 Escrever os testes que falham para snippet (linguagem não suportada, código preservado) e para code (com variante, com variante inexistente, sem variante)
- [x] 3.4 Implementar os schemas de snippet e `code`; testes estruturais passando
- [x] 3.5 Escrever os testes que falham para step (todas as variantes, variante faltante, variante desconhecida, tema sem variantes, número repetido) e compare (completo, coluna faltante, tema sem colunas)
- [x] 3.6 Implementar os schemas `step` e `compare` na `discriminatedUnion`

## 4. Integridade (Requirements: Unicidade; step/compare/code cruzados; Concept e glossário; Termos relacionados)

- [x] 4.1 Escrever os testes que falham para card repetido em decks diferentes, termo duplicado com caixa diferente, termo relacionado inexistente, termo relacionado que não é concept e concept referenciando a si mesmo
- [x] 4.2 Implementar `integrity.ts` (passada defensiva sobre o input cru) cobrindo unicidade, cobertura de variantes e colunas, `variant` de code, `number` por deck e `relatedTerms`; testes dos grupos 3.5 e 4.1 passando
- [x] 4.3 Escrever o teste do glossário derivado e implementar `getGlossary`

## 5. Relatório e catálogo (Requirements: Relatório de erros completo; Unicidade no catálogo)

- [x] 5.1 Escrever os testes que falham para "vários erros no mesmo tema" (erro estrutural + erro de integridade juntos) e "sucesso com padrões aplicados"
- [x] 5.2 Mesclar e deduplicar os erros das duas passadas em `validateTheme`; testes passando
- [x] 5.3 Escrever o teste que falha para temas com o mesmo id no catálogo e implementar `validateCatalog`
- [x] 5.4 Expor a API pública em `src/content/index.ts` (`validateTheme`, `validateCatalog`, `getGlossary`, tipos)

## 6. Gate de conteúdo do repositório (Requirement: Conteúdo do repositório validado)

- [x] 6.1 Escrever `repository-content.test.ts` (ambiente node) com a lógica de varredura extraída numa função testável. Testar com pastas temporárias: tema inválido falha mostrando arquivo e path, pasta ≠ id falha, catálogo vazio passa
- [x] 6.2 Ligar a varredura a `content/themes/` real (vazio hoje), passando

## 7. Verificação final

- [x] 7.1 Conferir que todo cenário da spec tem pelo menos um teste (nome do teste = nome do cenário)
- [x] 7.2 Rodar `openspec validate add-content-model --strict`
- [x] 7.3 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`, todos verdes
