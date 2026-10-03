## 1. Banco e tokens (API)

- [ ] 1.1 Migration `0001_users.sql` (`users`, `refresh_tokens`) aplicada nos testes
- [ ] 1.2 Testes falhando para emissão e validação do access JWT e do refresh (hash, uso único, família, vencimento)
- [ ] 1.3 Implementar `auth/tokens.ts`, `db/users.ts` e `db/tokens.ts`
- [ ] 1.4 Testes passando

## 2. Login e sessão (API)

- [ ] 2.1 Testes falhando: os cenários de "Login com Google na API", "Login com Apple na API", "Rotas protegidas", "Renovação da sessão" e "Dados e exclusão da conta na API" (chaves do Google e da Apple simuladas com um JWKS de teste)
- [ ] 2.2 Implementar a validação de ID token com `jose`, `auth/service.ts`, `routes/auth.ts`, `routes/me.ts` e o middleware `requireAuth`
- [ ] 2.3 Testes passando
- [ ] 2.4 Configurar os segredos (`JWT_SECRET`, `GOOGLE_CLIENT_IDS`, `APPLE_CLIENT_ID`) e publicar

## 3. Configuração externa (com o usuário)

- [ ] 3.1 Google Cloud: tela de consentimento (com o link da política de privacidade) e client IDs web, iOS e Android (SHA-1 de debug e de produção)
- [ ] 3.2 Apple Developer: habilitar "Sign in with Apple" no identificador do app
- [ ] 3.3 `npx expo install @react-native-google-signin/google-signin expo-apple-authentication expo-secure-store`, plugins no `app.json` e `EXPO_PUBLIC_API_URL` por perfil no `eas.json`

## 4. Sessão no app

- [ ] 4.1 Testes falhando: "Sessão mantida ao reabrir", "Renovação automática" e "Sessão encerrada no servidor" (API e SecureStore mockados)
- [ ] 4.2 Implementar `src/auth/api.ts`, `src/auth/session.ts` e `src/auth/providers.ts`
- [ ] 4.3 Testes passando

## 5. Telas

- [ ] 5.1 Testes falhando: "Tela de login" (primeiro uso, continuar sem conta, Apple só no iOS) e "Entrar pelo app" (sucesso, carregando, cancelado, sem conexão, erro da API)
- [ ] 5.2 Implementar `src/app/login.tsx` com o design da opção C e os textos nos dicionários
- [ ] 5.3 Testes falhando: "Conta no app" (convite, sair, apagar, cancelar) e "Ordem das seções" e "Web sem conta" de Ajustes
- [ ] 5.4 Implementar a seção Conta em `src/app/settings.tsx` e `src/app/account.tsx`
- [ ] 5.5 Testes passando

## 6. Verificação

- [ ] 6.1 Development build no aparelho: login com Google (Android e iOS) e Apple (iOS), sair, apagar conta
- [ ] 6.2 Rodar `npm test` e `npm run typecheck` em `api/`, e `npm test`, `npm run lint` e `npx tsc --noEmit` no app
