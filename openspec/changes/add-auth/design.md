## Context

A API (`add-api-server`) é Hono no Cloudflare Workers com D1. O app é Expo SDK 57, com estado em Zustand e persistência via `safeStorage` (`src/storage/safeStorage.ts`). Design da opção C aprovado no protótipo. Esta change depende de `add-api-server` e de `add-settings-and-error-states` (seção Sobre e links legais).

## Goals / Non-Goals

**Goals:**
- Login seguro sem senha, sessão de longa duração com tokens curtos, exclusão de conta conforme as lojas.

**Non-Goals:**
- Vincular contas, login na web, papéis ou permissões.

## Decisions

- **ID token validado na API com `jose`** (`createRemoteJWKSet` + `jwtVerify`), que roda no Workers (usa Web Crypto). Chaves: `https://www.googleapis.com/oauth2/v3/certs` e `https://appleid.apple.com/auth/keys`. Alternativa descartada: a biblioteca oficial do Google para Node, que depende de APIs do Node.
- **Sessão própria em vez de reutilizar o token do Google:** a API emite um **access JWT de 15 min** (HS256 com `JWT_SECRET`, via `hono/jwt`) e um **refresh token opaco** de 30 dias. O refresh é guardado no D1 só como **hash SHA-256**, então um vazamento do banco não entrega sessões. Cada refresh é de uso único, e todos pertencem a uma "família" por login. Reuso de um token já trocado revoga a família inteira (detecção de roubo).
- **Tabelas (`migrations/0001_users.sql`):** `users` (id UUID, provider, provider_sub, name, email, photo_url, created_at; único em provider + provider_sub) e `refresh_tokens` (token_hash, user_id, family_id, expires_at, used_at, revoked_at). `ON DELETE CASCADE` a partir de `users`, para `DELETE /me` levar tudo junto.
- **Camadas da API:** `routes/auth.ts` (HTTP e validação do corpo com Zod via `@hono/zod-validator`) → `auth/service.ts` (regras: criar ou reutilizar usuário, emitir, rotacionar) → `db/users.ts` e `db/tokens.ts` (SQL). Middleware `requireAuth` coloca o usuário em `c.var`.
- **No app:**
  - `src/auth/api.ts`: cliente `fetch` com renovação automática em caso de 401, uma por vez, com fila para requisições simultâneas;
  - `src/auth/session.ts`: Zustand com os tokens no `expo-secure-store` e o usuário no store;
  - `src/auth/providers.ts`: adaptador do Google Sign-In e da Apple, o único que importa as libs nativas e que é mockado no Jest.
- **Primeiro uso:** a flag `onboardingSeen` fica no store de configurações; o layout raiz redireciona para `/login` enquanto ela for falsa.
- **Rotas:** `src/app/login.tsx` (modal no primeiro uso, empilhada a partir de Ajustes) e `src/app/account.tsx`.
- **Development build obrigatório:** o Google Sign-In nativo e a Apple não existem no Expo Go. Os testes manuais usam `eas build --profile development`.

## Risks / Trade-offs

- [Configuração do Google Cloud trabalhosa (3 client IDs, SHA-1 de debug e de produção)] → checklist na tarefa, conferido antes de testar no aparelho.
- [Apple envia o nome só no primeiro login] → gravar quando vier; se perder, usar o e-mail como nome de exibição.
- [Relógio do aparelho errado] → a validade é sempre conferida na API, nunca no app.
- [Usuário sem internet ao apagar a conta] → a exclusão exige conexão; o app avisa e não apaga só localmente.
