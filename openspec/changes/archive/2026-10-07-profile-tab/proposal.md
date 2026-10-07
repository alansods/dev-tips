## Why

Hoje a conta, o plano, o idioma, os lembretes e o tema ficam escondidos atrás de dois ícones no cabeçalho (tema e engrenagem), e o progresso ocupa uma aba inteira. O design aprovado em 2026-10-07 junta tudo o que é "sobre você" numa aba **Perfil**. Isso libera a barra de abas para a futura aba Início e dá ao progresso um resumo visível (dias seguidos, cards que sei, trilhas iniciadas).

## What Changes

- **Abas:** passam a ser Trilhas · Glossário · **Perfil**. O cabeçalho das abas fica só com o título, sem os botões de tema e de engrenagem.
- **Aba Perfil, no lugar da tela Ajustes.** Ela mostra, nesta ordem:
  1. Conta (com a linha Dev Tips Pro);
  2. **Seu estudo**: três números e a linha "Progresso por trilha";
  3. Idioma;
  4. Lembretes;
  5. **Tema**;
  6. Sobre.
- **Tema:** a seção do Perfil tem três opções: **Automático** (segue o sistema, é o padrão), **Claro** e **Escuro**. Hoje, depois do primeiro toque no botão de tema, não dá mais para voltar a seguir o sistema.
- **Progresso:** deixa de ser aba e vira uma tela cheia, com voltar, aberta pelo Perfil. Os painéis não mudam.
- **Dias estudados:** o app guarda no aparelho os últimos 60 dias em que houve estudo, para calcular os **dias seguidos**. Esses dias não sincronizam, como o último dia de estudo e os lembretes.
- **Navegação:** as telas Conta e Paywall voltam para o Perfil.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `app-shell`:
  - "Navegação por abas": Perfil no lugar de Progresso, e cabeçalho sem botões;
  - "Tema claro e escuro": as 3 opções no Perfil;
  - "Tela Ajustes" vira "Aba Perfil";
  - "Seção Sobre".
- `progress`:
  - "Aba Progresso" vira "Tela Progresso";
  - "Zerar progresso de uma trilha";
  - novos requisitos "Dias estudados" e "Resumo do estudo no Perfil".
- `auth`: "Tela de login", "Entrar pelo app" e "Conta no app", que citam Ajustes.
- `localization`: "Trocar o idioma" e "Interface traduzida" (textos em inglês das abas e do tema).
- `reminders`: "Seção Lembretes".
- `subscriptions`: "Linha Dev Tips Pro em Ajustes" vira "Linha Dev Tips Pro no Perfil", e muda "Plano no app".
- `sync`: "O que sincroniza" (os dias estudados ficam só no aparelho) e "Estado da sincronização".

## Impact

- Rotas:
  - nova `src/app/(tabs)/profile.tsx`;
  - `src/app/(tabs)/progress.tsx` sai e entra `src/app/progress.tsx`, em tela cheia;
  - `src/app/settings.tsx` sai;
  - `account.tsx` e `paywall.tsx` passam a voltar para `/profile`.
- Componentes:
  - `src/app/(tabs)/_layout.tsx`: abas e cabeçalho;
  - `src/theme/ThemeProvider.tsx`: `mode` e `setMode` no lugar de `toggle`;
  - `src/theme/ThemeToggle.tsx` sai;
  - seções novas `ThemeSection`, `LanguageSection` e `StudySummary`, em `src/settings/`;
  - `ProfileIcon`, em `icons.tsx`.
- Estudo:
  - `src/study/store.ts`: `studyDays`, na versão 3, com migração a partir de `lastStudyDay`;
  - `src/study/streak.ts`, novo.
- Textos em pt-BR e inglês.
- Testes: as suítes que abriam `/settings` ou a aba Progresso, e as que usavam o botão de tema.
- Sem mudança na API nem nos dados sincronizados.

## Fora de escopo

- A aba Início e a escolha de "Áreas de interesse", que vêm na change `home-tab`.
- Mudar o conteúdo das seções Conta, Lembretes e Sobre.
