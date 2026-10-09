## Why

Testando o app no Android como usuário comum, apareceram dois problemas:
- **Cadastro escondido.** A tela de login só diz "Continuar com o Google", o que parece servir apenas para quem já tem conta. Na verdade, o primeiro login com o Google já cria a conta, mas nada na tela diz isso.
- **Botão cinza sem explicação.** No paywall, "Assinar o Pro" fica desabilitado para sempre quando a loja não devolve o preço (sem chave do RevenueCat, sem offering ou com erro), e o usuário não sabe por quê.

## What Changes

- Tela de login: o botão passa a "Entrar ou criar conta com o Google" e ganha, logo abaixo, a legenda "Primeira vez? Sua conta é criada na hora, sem formulário."
- Aba Perfil: o botão do convite "Salve seu progresso na nuvem" passa de "Entrar" para "Entrar ou criar conta".
- Paywall no Android: com a loja sem devolver o preço, o paywall mostra "A assinatura está indisponível no momento. Tente de novo mais tarde.", e o botão continua desabilitado. Enquanto o preço carrega, nada muda: o botão fica desabilitado, sem aviso.
- Textos equivalentes em inglês.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `auth`: textos da tela de login (botão e nova legenda) e do botão de entrar na aba Perfil.
- `subscriptions`: o paywall explica quando a assinatura está indisponível.

## Impact

- App: `src/app/login.tsx`, `src/app/paywall.tsx` e os textos em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`.
- Testes: `src/__tests__/auth-flow.test.tsx` e `src/__tests__/subscriptions-ui.test.tsx`, e outros que procuram os textos antigos.
- API, banco e dependências: nada muda.

## Fora de escopo

- Cadastro com e-mail e senha: o único jeito de criar conta continua sendo o Google.
- Login com Apple e a venda no iOS, que segue com o aviso "em breve".
- Tentar de novo automaticamente quando o preço não carrega: o usuário pode fechar e abrir o paywall.
