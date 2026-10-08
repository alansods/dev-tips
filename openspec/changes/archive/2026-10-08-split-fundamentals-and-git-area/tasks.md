## 1. Testes

- [x] 1.1 Testes de tela e de glossário com o nome "Fundamentos web" de volta (versão anterior ao PR #75)
- [x] 1.2 `src/content/__tests__/programming-fundamentals-track.test.ts`: identidade, decks, qualidade, regra de não repetição e pré-requisitos
- [x] 1.3 `web-track.test.ts` com a nova posição no catálogo; `git-navigation.test.tsx` com a área Git; testes de área (schema, navegação, home, ícones) com a área nova

## 2. Implementação

- [x] 2.1 `AREAS` com `git`, nomes PT/EN e ícone da área
- [x] 2.2 Trilha `fundamentos-de-programacao` (track.json e en.json) e `fundamentos-web` de volta ao original
- [x] 2.3 `git-e-colaboracao` na área `git`; `prerequisites` das 5 trilhas essenciais
- [x] 2.4 Registro em `catalog.ts` e `translations.ts`
- [x] 2.5 Testes do item 1 passando

## 3. Fechamento

- [x] 3.1 README
- [x] 3.2 `openspec validate --strict`, `npm test`, `npm run lint`, `npx prettier --check .` e `npx tsc --noEmit`
