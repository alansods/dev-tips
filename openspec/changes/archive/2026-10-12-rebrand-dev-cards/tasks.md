## 1. Ícone novo (app-polish: Identidade visual)

- [x] 1.1 Atualizar `scripts/__tests__/icons.test.ts` com os cenários "Ícone principal" (canto `#2D4BE0`), "Desenho do card" (centro do card branco) e "Ícone da loja" (`store/play/play-icon-512.png`, 512×512 RGB) e ver os testes falharem
- [x] 1.2 Atualizar `scripts/__tests__/app-config.test.ts`: nome "Dev Cards" e fundo do adaptativo `#2D4BE0`; ver o teste falhar
- [x] 1.3 Em `scripts/generate-icons.js`, adicionar retângulo arredondado rotacionado e traço com ponta redonda (com `erase` no monocromático), trocar as formas pelo desenho novo e ajustar as escalas por arquivo
- [x] 1.4 Gravar também `store/play/play-icon-512.png` e rodar o gerador para atualizar `assets/` e `store/play/`
- [x] 1.5 No `app.json`, mudar `name` para "Dev Cards" e `android.adaptiveIcon.backgroundColor` para `#2D4BE0`
- [x] 1.6 Remover `store/icon/` e atualizar `store/README.md`
- [x] 1.7 Rodar os testes de `scripts/__tests__` e vê-los passar; abrir os PNGs gerados e comparar com o canvas

## 2. Nome nos textos do app (auth, home, reminders, subscriptions)

- [x] 2.1 Atualizar os testes para "Dev Cards": `src/__tests__/auth-flow.test.tsx` (login), `src/__tests__/home.test.tsx` (boas-vindas), `src/reminders/__tests__/plan.test.ts` (título) e `src/__tests__/subscriptions-ui.test.tsx` ("Dev Cards Pro" e nome do requirement); ver os testes falharem
- [x] 2.2 Trocar os valores em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`: `auth.appName`, `pro.rowTitle`, `home.welcomeKicker` e o `title` dos lembretes
- [x] 2.3 Rodar os testes e vê-los passar

## 3. Páginas legais e README

- [x] 3.1 Trocar "Dev Tips" por "Dev Cards" no texto e no `<title>` de `docs/legal/termos.html` e `docs/legal/privacidade.html`, mantendo os endereços
- [x] 3.2 README: nome Dev Cards, ícone e capturas de tela de `store/play/`, recurso Dev Cards Pro na lista de funcionalidades e marca no `LICENSE`
- [x] 3.3 Adicionar o script `icons` (`node scripts/generate-icons.js`) ao `package.json`, que o README já cita

## 4. Checklist manual (fora do código, feito pelo usuário)

- [ ] 4.1 Pesquisar "Dev Cards" na Play Store e no INPI
- [ ] 4.2 Play Console: nome do app, ícone (`store/play/play-icon-512.png`), gráfico de recursos e capturas de tela (`store/play/`)
- [ ] 4.3 Play Console: nome de exibição da assinatura para "Dev Cards Pro", sem mudar o ID do produto
- [ ] 4.4 Google Cloud: nome do app na tela de consentimento do OAuth
- [ ] 4.5 RevenueCat (opcional): nome do projeto

## 5. Verificação

- [x] 5.1 `openspec validate rebrand-dev-cards --strict`
- [x] 5.2 Rodar `npm test`, `npm run lint` e `npx tsc --noEmit`
