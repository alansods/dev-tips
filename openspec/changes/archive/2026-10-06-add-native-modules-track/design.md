## Context

Formato e testes iguais às trilhas anteriores da série. A trilha usa o framework `react-native` na área Mobile, como "Pagamentos no app", e aparece em Mobile › JavaScript › React Native sem mudar código. A trilha React Native já explica o que é um development build e a runtime version num card de update OTA; esta trilha mostra a prática.

## Goals / Non-Goals

**Goals:**
- Cobrir, no nível de entrevista, quando uma biblioteca exige build nativo, como o Expo gera e configura o projeto nativo (prebuild, CNG, config plugins), o que cada integração nativa comum exige (Google, compras, push, permissões) e como manter e criar módulos.

**Non-Goals:**
- Ensinar Swift e Kotlin. O snippet de módulo nativo mostra só a forma da API.
- Repetir as regras de compras da trilha "Pagamentos no app".

## Decisions

### 1. Framework React Native, só no Mobile
Escolhido pelo usuário.
*Alternativa descartada:* também na área DevOps, onde a trilha apareceria em DevOps › JavaScript › React Native, o que confunde.

### 2. Expo SDK 57
O projeto usa o Expo SDK 57; os cards seguem a doc dessa versão:
- Login com Google: `@react-native-google-signin/google-signin` (ou `react-native-nitro-google-signin`), com config plugin, sem suporte no Expo Go; SHA-1 das chaves de upload e de assinatura do Google Play no Google Cloud ou Firebase; `webClientId` para o `idToken` usado no backend.
- Push: `expo-notifications`, token com o `projectId` do EAS, chave APNs no iOS (exige conta paga e o entitlement `aps-environment`) e chave de conta de serviço do FCM V1 no Android, enviadas ao EAS.
- Config plugins com `expo/config-plugins` (`withEntitlementsPlist`, `withInfoPlist`, `withAndroidManifest`). O exemplo usa o plugin real do projeto, `plugins/withoutPushEntitlement.js`.
- Módulos com Expo Modules API (`Name`, `Function`, `AsyncFunction`, `Events`), criados com `npx create-expo-module --local`, e `requireNativeModule` no JavaScript.
- Nova Arquitetura obrigatória nas versões atuais do React Native.

### 3. Swift e Kotlin como `text`
O formato não tem `swift` nem `kotlin`; o snippet do módulo usa `text`, como a trilha Vue faz com `.vue`.

### 4. Plano de cards (24)
Níveis: J = júnior, P = pleno, S = sênior.

| Deck | Cards |
|---|---|
| Expo Go e development build | concept: Bibliotecas nativas e o Expo Go (J) · Fluxo com development build (P) · Prebuild e CNG (P) · Config plugin (P) — code: Plugins com opções no app.json (P) · Config plugin próprio (S) |
| Integrações nativas | concept: Login com Google (P) · Compras no app (P) · Notificações push (P) · Permissões (J) — code: Login com Google no app (P) · Registrar o token de push (P) |
| Criar e manter módulos | concept: Autolinking (P) · Nova Arquitetura e compatibilidade (P) · Expo Modules API (S) · Fingerprint e runtime version (S) — code: Módulo nativo com Expo Modules API (S) · Usar o módulo no JavaScript (P) |
| Perguntas de entrevista | Por que a biblioteca não funciona no Expo Go? (J) · O login com Google funciona no build de teste, mas falha na versão da loja. Por quê? (P) · O que é um config plugin e quando escrever um? (P) · Mudei uma permissão no app.json. Posso mandar por update OTA? (P) · Como você escolhe uma biblioteca nativa? (S) · Quando vale escrever um módulo nativo próprio? (S) |

### 5. Critério de nível
O mesmo das changes anteriores.

## Risks / Trade-offs

- [Requisitos de Google, Apple e Firebase mudam de tela e de nome] → Os cards explicam o que cada serviço precisa (identificador do app, chaves, impressão digital do certificado) sem o passo a passo dos consoles.
- [Exatidão técnica não é coberta por teste] → Consulta à doc do SDK 57 antes de escrever e revisão no PR.
