## Context

Os textos de interface estão espalhados como literais em PT-BR nos componentes (com alguns centralizados em `src/study/copy.ts`). O conteúdo vem de `content/themes/<id>/theme.json`, importado estaticamente em `src/content/catalog.ts` e validado pelo Zod em `src/content/schema.ts`; a integridade (ids, termos relacionados) fica em `src/content/integrity.ts`. Estado global via Zustand com `safeStorage`. Expo SDK 57: `expo-localization` expõe `getLocales()` (lista ordenada, com `languageCode`) e o hook `useLocales()`.

## Goals / Non-Goals

**Goals:**
- Troca de idioma em tempo real, tipada e com dicionários completos garantidos por teste.
- Tradução de conteúdo incremental, sem duplicar o `theme.json`.

**Non-Goals:**
- Biblioteca de i18n completa (pluralização genérica, ICU, carregamento dinâmico).

## Decisions

- **Dicionários próprios e tipados, sem `i18next`.** `src/i18n/pt-BR.ts` é a fonte das chaves (`as const`), e `src/i18n/en.ts` é tipado como `Messages`, com as mesmas chaves e strings ou funções. Assim o TypeScript acusa chave faltando, e um teste garante que nenhum texto está vazio. Funções resolvem plural e interpolação (`dueCount: (n) => n === 1 ? '1 card' : \`${n} cards\``). Alternativa descartada: `i18next` + `react-i18next`, mais peso e chaves em string sem checagem para só dois idiomas.
- **Store `dev-tips:settings`** (`{ language: 'pt-BR' | 'en' | null }`, onde `null` significa seguir o aparelho), com Zod e `safeStorage`. O hook `useT()` devolve o dicionário do idioma efetivo, e `useLanguage()` devolve o idioma. O idioma inicial é calculado com `getLocales()[0]?.languageCode === 'en'`, numa função pura testável `resolveLanguage(saved, deviceLocales)`.
- **Tradução de conteúdo como overlay** em `translations/en.json`, não com campos `{ "pt-BR", "en" }` dentro do `theme.json`. Mantém o `theme.json` e os validadores atuais intactos, deixa a tradução parcial natural e permite que o editor traduza sem mexer no original. O schema do overlay é derivado por tipo de card (apenas campos de texto, todos opcionais, `.strict()`), e a checagem de ids existentes é uma função de integridade nova ao lado das atuais.
- **Montagem do tema localizado** com a função pura `localizeTheme(theme, overlay) → Theme`, que faz merge campo a campo (overlay vence; senão, original). O `catalog` passa a expor `getCatalog(language)`, memoizado por idioma, para não remontar a cada render. Componentes usam `useCatalog()`.
- **Ids continuam a chave de tudo** (progresso, agendamento, termos relacionados), então trocar o idioma não afeta dados salvos.
- **Ajustes como rota `src/app/settings.tsx`** na pilha raiz (`presentation` padrão, com header e voltar), aberta pelo botão no `headerRight` do layout das abas ao lado do `ThemeToggle`.
- **Testes:** `renderWithProviders` (`src/test-utils.tsx`) ganha a opção `language`, com padrão `pt-BR`, para os testes atuais continuarem em PT-BR.

## Risks / Trade-offs

- [Migrar todos os literais é trabalhoso e dá para esquecer algum] → um teste de varredura que falha se encontrar literais de UI em JSX/props fora de `src/i18n/`, com uma lista de exceções explícitas (ex.: nomes de frameworks), além de um passe de revisão manual em inglês.
- [Textos em inglês mais longos ou mais curtos quebram o layout] → conferir as telas principais em inglês numa largura de 320 pt.
- [Overlay fica desatualizado quando o `theme.json` muda (card removido ou renomeado)] → a validação de ids na suíte de testes falha e aponta o caminho.
- [Notificações já agendadas no idioma antigo] → o reagendamento de `add-study-reminders` também roda ao trocar o idioma (requisito dessa change).

## Migration Plan

`npx expo install expo-localization`. Sem migração de dados: o store de configurações é novo e o padrão segue o aparelho. Atualizar o `context` de `openspec/config.yaml` ("Idioma: PT-BR e inglês, escolhido em Ajustes").

## Open Questions

- Revisão da tradução da interface por um falante nativo antes da publicação; o texto pode ser ajustado sem mudar a estrutura.
