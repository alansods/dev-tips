## Why

O nome "Dev Tips" fala de dicas, mas o app é estudo em cards, e o nome é genérico na busca da loja. O ícone atual (dois cards escuros com linhas de texto) some entre ícones escuros e fica ilegível em tamanhos pequenos. Antes de crescer a base de usuários na Play Store, o app passa a se chamar **Dev Cards** e ganha um ícone que se destaca: um card branco com o símbolo de código `</>` sobre o azul `#2D4BE0`, que já é a cor de destaque do tema claro.

## What Changes

- O nome exibido do app passa de "Dev Tips" para "Dev Cards" em tudo que o usuário vê: nome sob o ícone, tela de login, boas-vindas do Início, título da notificação de lembrete e a linha do plano pago, que vira "Dev Cards Pro" (pt-BR e inglês).
- As páginas de Termos de uso e Política de privacidade passam a citar "Dev Cards".
- Novo desenho do ícone e da splash: card branco com `</>` em azul, com um segundo card azul-claro inclinado atrás. O ícone principal e o fundo do ícone adaptativo do Android passam a ser `#2D4BE0`. A splash mantém o fundo `#0C1015` e passa a mostrar o novo desenho.
- O gerador de ícones passa a desenhar o novo ícone e também gera o ícone de 512×512 da página da loja.
- O README do projeto passa a se chamar Dev Cards e mostra o ícone e capturas de tela do app; o comando `npm run icons`, citado no README mas ausente do `package.json`, passa a existir.
- Ficam versionadas em `store/play/` as imagens da página do app na Play Store (ícone 512, gráfico de recursos e 6 capturas de tela, nos temas claro e escuro), que não fazem parte do app.

## Fora de escopo

- Identificadores técnicos continuam iguais: pacote `dev.devtips.app`, slug `dev-tips`, scheme `devtips`, chaves de armazenamento `dev-tips:*`, API `dev-tips-api`, banco `dev-tips`, endereços das páginas legais e IDs de produto e entitlement da assinatura. Trocar qualquer um deles quebraria a publicação, o login ou apagaria o progresso salvo.
- Cores, layout e componentes das telas do app não mudam.
- Comentários de código e descrições internas das specs que citam "Dev Tips" sem o usuário ver.
- Mudanças nos consoles externos (Play Console, tela de consentimento do OAuth no Google Cloud, RevenueCat) são feitas à mão e entram só como checklist nas tasks.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `app-polish`: Identidade visual muda de desenho, do nome "Dev Tips" para "Dev Cards" e do fundo do ícone adaptativo para `#2D4BE0`; inclui o ícone de 512×512 da loja.
- `auth`: a tela de login mostra o nome "Dev Cards".
- `home`: o primeiro acesso mostra "Bem-vindo ao Dev Cards".
- `reminders`: o título da notificação passa a ser "Dev Cards".
- `subscriptions`: a linha do plano no Perfil passa a se chamar "Dev Cards Pro".

## Impact

- `app.json` (`name`, `android.adaptiveIcon.backgroundColor`), `scripts/generate-icons.js` e os PNGs gerados em `assets/`.
- Textos em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`.
- `docs/legal/termos.html` e `docs/legal/privacidade.html` (publicados no GitHub Pages).
- `README.md`, `LICENSE` (nome da marca) e o script `icons` no `package.json`.
- Testes: `scripts/__tests__/app-config.test.ts`, `scripts/__tests__/icons.test.ts`, `src/__tests__/auth-flow.test.tsx`, `src/__tests__/home.test.tsx`, `src/__tests__/subscriptions-ui.test.tsx`, `src/reminders/__tests__/plan.test.ts`.
- Nova pasta `store/` com as imagens da Play Store.
- Usuários atuais: o app atualizado aparece com o novo nome e ícone; progresso, sessão e assinatura continuam intactos.
