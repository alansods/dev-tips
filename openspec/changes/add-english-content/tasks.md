## 1. Cobertura

- [ ] 1.1 Testes falhando para `missingTranslations` com fixtures (tradução completa → `[]`; campos faltando → caminhos) e para a cobertura dos dois temas reais ("Cobertura completa")
- [ ] 1.2 Implementar `missingTranslations` em `src/content/translation.ts`

## 2. Traduções

- [ ] 2.1 Criar `content/themes/fundamentos-web/translations/en.json` (tema, 4 decks, 27 cards)
- [ ] 2.2 Criar `content/themes/crud-4-frameworks/translations/en.json` (tema, colunas, 5 decks, 73 cards, notas dos snippets e `values` em prosa)
- [ ] 2.3 Registrar as duas em `src/content/translations.ts`
- [ ] 2.4 Testes de cobertura e de registro passando

## 3. Telas

- [ ] 3.1 Teste de tela em inglês com as traduções reais ("Card exibido em inglês") e em PT-BR ("PT-BR intacto")
- [ ] 3.2 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`
