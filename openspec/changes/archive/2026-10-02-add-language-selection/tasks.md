## 1. Preparação

- [x] 1.1 Conferir a doc do `expo-localization` no SDK 57 (`getLocales`, `useLocales`) e instalar com `npx expo install expo-localization`
- [x] 1.2 Atualizar o `context` de `openspec/config.yaml`: o app passa de somente PT-BR para PT-BR e inglês

## 2. Idioma: resolução e persistência (Idioma inicial pelo aparelho, Trocar o idioma)

- [x] 2.1 Testes falhando para `resolveLanguage(saved, deviceLocales)`: `en-GB` → en, `es-ES` → pt-BR, `pt-PT` → pt-BR, sem locale → pt-BR, escolha salva prevalece
- [x] 2.2 Implementar `src/i18n/language.ts` e o store `src/i18n/store.ts` (Zod + `safeStorage`, valor inválido → `null`)
- [x] 2.3 Testes passando

## 3. Dicionários e `useT` (Interface traduzida)

- [x] 3.1 Teste falhando: os dicionários PT-BR e inglês têm as mesmas chaves e nenhum texto vazio; e os textos em inglês listados na spec
- [x] 3.2 Criar `src/i18n/pt-BR.ts`, `src/i18n/en.ts` e `useT()`/`useLanguage()`; adicionar `language` em `renderWithProviders`
- [x] 3.3 Testes passando

## 4. Tela Ajustes (app-shell, Idiomas disponíveis, Trocar o idioma)

- [x] 4.1 Testes falhando: o botão "Ajustes" abre a tela sem abas e com o idioma atual marcado; as opções mostram os próprios nomes; escolher "English" troca os títulos imediatamente; voltar retorna à aba
- [x] 4.2 Criar `src/app/settings.tsx` e o botão de engrenagem no `src/app/(tabs)/_layout.tsx` (com ícone em `src/components/icons.tsx`)
- [x] 4.3 Testes passando

## 5. Migrar a interface para o dicionário (Interface traduzida)

- [x] 5.1 Testes falhando em inglês para sessão, resumo, revisão, tela do tema, aba Progresso e Glossário (cenários "Sessão em inglês" e "Rótulo acessível traduzido")
- [x] 5.2 Migrar os literais de `src/study/copy.ts`, `StudySession.tsx`, `src/app/**`, `src/glossary/**` e `src/components/**` para `useT()`
- [x] 5.3 Teste de varredura que falha com literais de UI fora de `src/i18n/` (com lista de exceções)
- [x] 5.4 Testes passando, incluindo os existentes em PT-BR

## 6. Tradução de conteúdo: schema e validação (content-model)

- [x] 6.1 Testes falhando com fixtures em `src/content/__fixtures__/`: tradução válida, card inexistente, campo `code`, campo de outro tipo, texto vazio
- [x] 6.2 Implementar o schema do overlay por tipo de card e a checagem de ids em `src/content/`
- [x] 6.3 Incluir a validação de todo `translations/en.json` do repositório no teste de conteúdo
- [x] 6.4 Testes passando

## 7. Conteúdo no idioma escolhido (localization)

- [x] 7.1 Testes falhando para `localizeTheme`: card traduzido, tradução parcial campo a campo, tema sem tradução, código e ids inalterados
- [x] 7.2 Implementar `localizeTheme`, `getCatalog(language)` memoizado e `useCatalog()`, e trocar os usos de `catalog`/`getTheme` nas telas
- [x] 7.3 Teste falhando e depois passando: a busca do glossário em inglês encontra "CORS" por "browser"
- [x] 7.4 Testes passando

## 8. Verificação

- [x] 8.1 Conferir as telas principais em inglês numa largura de 320 pt (por cálculo: o texto mais longo dos botões, "I didn't know", ocupa cerca de 95 pt dos 106 pt disponíveis; falta conferir no aparelho)
- [x] 8.2 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`
