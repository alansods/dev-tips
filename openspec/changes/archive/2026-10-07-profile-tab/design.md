## Context

- **Ajustes:** a tela `src/app/settings.tsx` monta as seções que já existem: `AccountSection` (com `ProRow` e `SyncStatusLine`), idioma (inline na própria tela), `RemindersSection` e `AboutSection`.
- **Cabeçalho das abas:** em `src/app/(tabs)/_layout.tsx`, o cabeçalho tem `ThemeToggle` e a engrenagem.
- **Tema:** o `ThemeProvider` guarda `override: 'light' | 'dark' | null` em `dev-tips:color-scheme` e expõe `toggle()`.
- **Estudo:** o store de estudo (`zustand` + `persist`, na versão 2) guarda `lastStudyDay`.

## Goals / Non-Goals

**Goals:**
- Reaproveitar as seções existentes sem reescrevê-las.
- Manter as rotas `/account` e `/paywall` e os testes delas, mudando só para onde a navegação volta.

**Non-Goals:**
- Manter a rota `/settings` como apelido. Nenhum deep link usa essa rota.

## Decisions

### 1. `(tabs)/profile.tsx` monta as seções; o idioma vira componente
O bloco de idioma sai de `settings.tsx` e vira `src/settings/LanguageSection.tsx`, e o Perfil compõe todas as seções. Entram também `ThemeSection.tsx` (os 3 rádios, no mesmo visual do idioma) e `StudySummary.tsx` (os 3 números mais a linha "Progresso por trilha"). Os rádios usam `accessibilityRole="radio"` dentro de um `radiogroup`, como o idioma já faz.

### 2. Tema com `mode`
O `ThemeProvider` passa a expor `mode: 'system' | 'light' | 'dark'` e `setMode(mode)`. A persistência usa a mesma chave de antes:
- `system` remove a chave;
- `light` e `dark` gravam o valor.

Assim quem já tinha escolhido um tema continua com a escolha, sem migração. O `toggle` e o `ThemeToggle` são removidos.

### 3. Progresso como rota de tela cheia
`src/app/progress.tsx` reaproveita os painéis, com o `FullScreen` de sempre (kicker e voltar).

O voltar de `FullScreen` faz `router.back()` ou `router.replace('/')`. Para o progresso, o fallback vira `/profile`: o `FullScreen` passa a aceitar `fallbackHref`.

### 4. `studyDays` no store de estudo
O store guarda `studyDays: string[]` (dias `YYYY-MM-DD` em ordem crescente). `answer` acrescenta o dia de hoje e corta para os últimos 60 dias.

A persistência sobe para a versão 3. A migração da v2 cria `studyDays` a partir de `lastStudyDay`, quando houver. O `savedSchema` aceita `studyDays` com padrão `[]`. A sincronização não muda, porque só envia cards e preferências.

`src/study/streak.ts` tem funções puras:
- `recordDay(days, day)`;
- `currentStreak(days, today)`.

Elas usam `addDays` de `src/study/clock.ts`.

### 5. Ícone da aba
`ProfileIcon` em `icons.tsx` (cabeça e ombros, no traço dos outros ícones). O título e o rótulo da aba vêm de `t.tabs.profile`.

## Risks / Trade-offs

- **Testes que dependem de Ajustes:** muitas suítes abrem `/settings` ou usam o botão de tema. → Elas passam a abrir `/profile` e a escolher o tema na seção. A mudança é mecânica, e os cenários continuam os mesmos.
- **Perfil longo:** o Perfil fica longo no celular. → As seções são as mesmas de Ajustes, mais o resumo, e a tela rola.
