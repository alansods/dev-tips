## Why

Em apps Expo, login com Google, compras e notificações push dependem de código nativo: não rodam no Expo Go, exigem configuração em cada loja e serviço e um build novo a cada mudança nativa. Entrevistas de React Native cobram esse fluxo, e a trilha React Native só explica o conceito de development build. Esta é a oitava e última trilha da série que cobre as lacunas de uma vaga de frontend sênior.

## What Changes

- Trilha nova **Módulos nativos no Expo** (`modulos-nativos-no-expo`), com 24 cards em PT-BR e tradução completa para inglês, no mesmo formato das trilhas existentes:
  - **Expo Go e development build:** bibliotecas nativas e o Expo Go, fluxo com development build, prebuild e CNG, config plugins.
  - **Integrações nativas:** login com Google, compras no app, notificações push e permissões.
  - **Criar e manter módulos:** autolinking, Nova Arquitetura e compatibilidade, Expo Modules API, fingerprint e runtime version.
  - **Perguntas de entrevista.**
- A trilha fica no framework React Native, na área Mobile, depois de "Pagamentos no app": Mobile › JavaScript › React Native passa a listar 3 trilhas.

## Capabilities

### New Capabilities

- `native-modules-content`: a trilha "Módulos nativos no Expo", com a posição na navegação, os decks e as contagens, o conteúdo autoral, a ligação com o glossário, a mistura de níveis e a tradução.

### Modified Capabilities

- `mobile-content`: a área Mobile passa a contar 7 trilhas em JavaScript, e Mobile › JavaScript mostra React Native com 3 trilhas.

## Impact

- `content/tracks/modulos-nativos-no-expo/track.json` e `translations/en.json`, registrados em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes novos: `src/content/__tests__/native-modules-track.test.ts` e `src/__tests__/native-modules-navigation.test.tsx`. Ajuste das contagens em `mobile-navigation.test.tsx`.
- README: lista de trilhas.
- Sem mudança no schema, nas telas, na navegação, na API ou nos dados salvos.

## Fora de escopo

- Desenvolvimento nativo puro (Swift, Kotlin, Xcode, Android Studio) além do necessário para entender um módulo.
- Regras de negócio de compras, já cobertas por "Pagamentos no app".
- Configuração do próprio Dev Tips: a trilha é conteúdo de estudo; o plugin do projeto aparece só como exemplo.
