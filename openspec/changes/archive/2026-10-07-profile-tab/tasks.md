## 1. Dias estudados

- [x] 1.1 Spec: requisitos "Dias estudados" e "Resumo do estudo no Perfil" em `specs/progress/spec.md`, e "O que sincroniza" em `specs/sync/spec.md`
- [x] 1.2 Teste falhando em `src/study/__tests__/streak.test.ts` (`recordDay` e `currentStreak`) e em `src/study/__tests__/store.test.ts` / `persist.test.ts` (resposta registra o dia; migração da v2; 60 dias)
- [x] 1.3 Implementar `src/study/streak.ts` e `studyDays` no store (versão 3)

## 2. Tema com três opções

- [x] 2.1 Spec: "Tema claro e escuro" em `specs/app-shell/spec.md`
- [x] 2.2 Teste falhando em `src/theme/__tests__/ThemeProvider.test.tsx` para `mode`/`setMode` (padrão automático, escolher, lembrar, voltar ao automático, falha de leitura)
- [x] 2.3 Trocar `toggle` por `mode`/`setMode` no `ThemeProvider` e remover `ThemeToggle`

## 3. Aba Perfil e tela Progresso

- [x] 3.1 Spec: deltas de `app-shell`, `progress`, `auth`, `localization`, `reminders`, `subscriptions` e `sync`
- [x] 3.2 Ajustar os testes para a aba Perfil e a tela Progresso: `app-shell`, `settings`, `progress-tab`, `subscriptions-ui`, `auth-flow`, `sync-ui`, `reminders`, `english-ui` e os que usam o botão de tema. Incluir os cenários novos: cabeçalho sem botões, ordem das seções, abrir o progresso por trilha, resumo do estudo e tema
- [x] 3.3 Criar `(tabs)/profile.tsx`, `src/app/progress.tsx`, `LanguageSection`, `ThemeSection`, `StudySummary` e `ProfileIcon`; atualizar o layout das abas; remover `settings.tsx` e `(tabs)/progress.tsx`; voltar para `/profile` em `account.tsx` e `paywall.tsx`; textos em pt-BR e inglês

## 4. Verificação

- [x] 4.1 Rodar `openspec validate --strict`, `npm test`, `npm run lint` e `npx tsc --noEmit`
