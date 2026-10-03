## 1. Banco e tokens (API)

- [x] 1.1 Migration `0001_users.sql` (`users`, `refresh_tokens`) aplicada nos testes
- [x] 1.2 Testes falhando para emissão e validação do access JWT e do refresh (hash, uso único, família, vencimento)
- [x] 1.3 Implementar `auth/tokens.ts`, `db/users.ts` e `db/tokens.ts`
- [x] 1.4 Testes passando

## 2. Login e sessão (API)

- [x] 2.1 Testes falhando: os cenários de "Login com Google na API", "Rotas protegidas", "Renovação da sessão" e "Dados e exclusão da conta na API" (chaves do Google simuladas com um JWKS de teste)
- [x] 2.2 Implementar a validação de ID token com `jose`, `auth/service.ts`, `routes/auth.ts`, `routes/me.ts` e o middleware `requireAuth`
- [x] 2.3 Testes passando
- [x] 2.4 Configurar os segredos (`JWT_SECRET`, `GOOGLE_CLIENT_IDS`) e publicar

## 3. Configuração externa (com o usuário)

- [x] 3.1 Google Cloud: tela de consentimento (com o link da política de privacidade) e client IDs web, iOS e Android (SHA-1 de debug e de produção)
- [x] 3.2 `npx expo install @react-native-google-signin/google-signin expo-secure-store`, `iosUrlScheme` via `app.config.ts` e `.env` (`EXPO_PUBLIC_GOOGLE_*`)

## 4. Sessão no app

- [x] 4.1 Testes falhando: "Sessão mantida ao reabrir", "Renovação automática" e "Sessão encerrada no servidor" (API e SecureStore mockados)
- [x] 4.2 Implementar `src/auth/api.ts`, `src/auth/session.ts` e `src/auth/providers.ts`
- [x] 4.3 Testes passando

## 5. Telas

- [x] 5.1 Testes falhando: "Tela de login" (primeiro uso, continuar sem conta) e "Entrar pelo app" (sucesso, carregando, cancelado, sem conexão, erro da API)
- [x] 5.2 Implementar `src/app/login.tsx` com o design da opção C e os textos nos dicionários
- [x] 5.3 Testes falhando: "Conta no app" (convite, sair, apagar, cancelar) e "Ordem das seções" e "Web sem conta" de Ajustes
- [x] 5.4 Implementar a seção Conta em `src/app/settings.tsx` e `src/app/account.tsx`
- [x] 5.5 Testes passando

## 6. Verificação

- [x] 6.1 Development build local: login com Google testado no simulador do iPhone e no iPhone real (build Release). **Pendente:** teste no tablet Android, adiado pelo usuário
- [x] 6.2 Rodar `npm test` e `npm run typecheck` em `api/`, e `npm test`, `npm run lint` e `npx tsc --noEmit` no app
