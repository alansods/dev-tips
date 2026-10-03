## Why

Sem conta, trocar de celular ou reinstalar o app apaga todo o progresso. O login, opcional, é o primeiro passo para guardar os dados na nuvem (a sincronização vem em `add-cloud-sync`). Ele usa só Google e Apple: sem senha para guardar nem e-mail para enviar.

## What Changes

- **API:**
  - `POST /auth/google` e `POST /auth/apple`: validam o ID token do provedor, criam o usuário no primeiro acesso e devolvem uma sessão (token de acesso curto e token de renovação);
  - `POST /auth/refresh` (renovação com rotação), `POST /auth/logout`, `GET /me` e `DELETE /me` (apaga a conta);
  - primeira migration do D1: `users` e `refresh_tokens`.
- **App** (design aprovado no [protótipo](https://claude.ai/artifact/YGzcXF56nDv8npsZkfPf1j), opção C):
  - tela de login com a ilustração de cards, o título "Aprenda, reforce e relembre", os botões "Continuar com o Google", "Continuar com a Apple" (só no iOS) e "Continuar sem conta", e os links legais;
  - a tela aparece uma vez no primeiro uso e depois só pelo botão "Entrar" em Ajustes;
  - estados de carregando, cancelado, sem internet e erro do servidor;
  - seção Conta em Ajustes (desconectado: convite para entrar; conectado: foto, nome e e-mail) e a tela Conta com "Sair" e "Apagar conta", ambos com confirmação;
  - sessão guardada com segurança no aparelho, renovada automaticamente.

## Capabilities

### New Capabilities

- `auth`: login com Google e Apple, sessão, conta, sair e apagar conta, na API e no app.

### Modified Capabilities

- `app-shell`: a tela Ajustes ganha a seção Conta no topo.

## Impact

- API: `api/src/routes/auth.ts`, `api/src/routes/me.ts`, `api/src/auth/` (validação de ID token com `jose`, JWT, refresh), `api/migrations/0001_users.sql`, segredos `JWT_SECRET`, `GOOGLE_CLIENT_IDS` e `APPLE_CLIENT_ID`.
- App: novas dependências `@react-native-google-signin/google-signin`, `expo-apple-authentication` e `expo-secure-store` (exigem **development build**; não rodam no Expo Go), `src/auth/` (cliente da API, sessão, hooks), `src/app/login.tsx`, `src/app/account.tsx`, `src/app/settings.tsx`.
- Configuração externa: projeto no Google Cloud com 3 client IDs (web, iOS e Android, incluindo o SHA-1 de debug e o de produção), "Sign in with Apple" no Apple Developer, e `EXPO_PUBLIC_API_URL` por perfil no EAS.

## Fora de escopo

- Login com e-mail e senha (cadastro, verificação, esqueci a senha).
- Sincronização do progresso (`add-cloud-sync`).
- Editar nome ou foto, e vincular Google e Apple na mesma conta.
- Login na versão web do app (os botões nativos não existem na web; ali a seção Conta não aparece).
