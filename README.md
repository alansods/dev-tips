# Dev Tips

App mobile de estudo em cards para reforçar conceitos de desenvolvimento fullstack que caem em entrevistas.

Você escolhe um **tema**, abre um **deck** e estuda os **cards** como flashcards: vira o card, responde "Já sabia" ou "Não sabia" e o app agenda a próxima revisão. Funciona offline e sem conta. O login com Google é opcional e serve para sincronizar o progresso entre aparelhos.

## Funcionalidades

- **Temas e decks**: "O mesmo CRUD em quatro frameworks, passo a passo" (Express, Spring Boot, NestJS, FastAPI) e "Fundamentos web" (HTTP, REST, navegador e segurança, perguntas de entrevista).
- **Flashcards** com animação de virar, código com abas por variante e resumo ao fim da sessão.
- **Repetição espaçada** por caixas, com a revisão do dia.
- **Glossário** com busca; os termos citados nos cards abrem a definição numa gaveta.
- **Progresso** por tema e por deck, salvo no aparelho, com a opção de zerar.
- **Lembretes diários** opcionais, com notificações locais.
- **Idiomas**: português do Brasil e inglês (interface e conteúdo).
- **Tema claro e escuro.**
- **Conta opcional** (Google) com sincronização do progresso e das preferências.

## Stack

| Parte    | Tecnologias                                                                                  |
| -------- | -------------------------------------------------------------------------------------------- |
| App      | Expo SDK 57, React Native 0.86, TypeScript (strict), Expo Router, Zustand, AsyncStorage, Zod |
| API      | Hono no Cloudflare Workers, banco Cloudflare D1, `jose` (JWT)                                |
| Testes   | Jest + React Native Testing Library (app), Vitest + `@cloudflare/vitest-plugin` (API)        |
| Processo | [OpenSpec](https://github.com/Fission-AI/OpenSpec) (desenvolvimento guiado por specs)        |

## Estrutura

```
src/
  app/          rotas do Expo Router (cada arquivo é uma tela)
  components/   componentes de interface reutilizáveis
  content/      carregamento, validação e integridade do conteúdo
  study/        sessão de estudo, progresso e repetição espaçada
  glossary/     glossário e ligação com os cards
  auth/         login com Google e sessão
  sync/         fila offline e sincronização com a API
  reminders/    lembretes diários
  i18n/         idiomas da interface
  settings/     tela e preferências de Ajustes
  theme/        cores, fontes e tema claro/escuro
content/
  sources/      material editorial original (Markdown)
  themes/       conteúdo consumido pelo app (theme.json + translations/)
api/            API (Cloudflare Workers + D1)
openspec/       specs (fonte da verdade) e changes
docs/           decisões, pendências de design e páginas legais
plugins/        config plugins do Expo
```

## Como rodar o app

Pré-requisitos: Node.js, Xcode (iOS) ou Android Studio (Android).

```bash
npm install
cp .env.example .env   # preencha os Client IDs do Google
npx expo run:ios       # ou: npx expo run:android
```

O app usa módulos nativos que não vêm no Expo Go (como o Google Sign-In), por isso precisa de um **development build**: `npx expo run:ios|android` localmente ou `npx eas-cli@latest build --profile development`. Depois do primeiro build, `npx expo start` basta para o dia a dia.

As pastas `ios/` e `android/` são geradas (Continuous Native Generation). Não edite à mão: configure pelo `app.json`, `app.config.ts` e `plugins/`.

### Variáveis de ambiente (`.env`)

| Variável                            | Para quê                                                        |
| ----------------------------------- | --------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL`               | Endereço da API (padrão: a API publicada no Cloudflare Workers) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`  | Client ID "Aplicativo da Web", conferido pela API               |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`  | Client ID "iOS"                                                 |
| `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` | Esquema de URL do iOS, usado pelo plugin do Google Sign-In      |

Nenhum desses valores é segredo: todos vão dentro do app. Sem eles, o app funciona normalmente, só sem login.

### Comandos

```bash
npm test             # testes (Jest)
npm run lint         # lint (expo lint)
npm run typecheck    # tsc --noEmit
npm run format       # Prettier
npm run icons        # gera os ícones do app
```

## Como rodar a API

```bash
cd api
npm install
cp .dev.vars.example .dev.vars   # JWT_SECRET e GOOGLE_CLIENT_IDS
npm run dev                      # wrangler dev
```

| Comando              | O que faz                             |
| -------------------- | ------------------------------------- |
| `npm test`           | testes (Vitest no runtime do Workers) |
| `npm run typecheck`  | typecheck do código e dos testes      |
| `npm run db:migrate` | aplica as migrations no D1 remoto     |
| `npm run deploy`     | publica no Cloudflare Workers         |

Em produção, os segredos são definidos com `npx wrangler secret put <NOME>`.

Rotas: `GET /health`, `POST /auth/google`, `POST /auth/refresh`, `POST /auth/logout`, `GET /me`, `DELETE /me`, `GET /sync` e `PUT /sync`.

## Conteúdo

O conteúdo fica separado do código:

- `content/sources/*.md` é o material editorial original.
- `content/themes/<theme-id>/theme.json` é o que o app consome, validado pelo schema Zod da capability `content-model`. As traduções ficam em `translations/en.json`.

Lacunas do material original são preenchidas com cards marcados como complemento (`origin: "supplement"`), para não se confundirem com o original. Chaves em inglês, textos exibidos em PT-BR (e inglês via tradução).

## Desenvolvimento guiado por specs

As specs em [`openspec/specs/`](openspec/specs/) são a fonte da verdade. Nenhum comportamento muda sem antes passar por uma change:

1. `/opsx:propose "<ideia>"` cria `openspec/changes/<change>/` (proposal, design, delta specs e tasks).
2. A spec é revisada.
3. `/opsx:apply` implementa na ordem: teste falhando, implementação, teste passando.
4. `openspec validate --strict`, testes, lint e typecheck verdes.
5. `/opsx:archive` incorpora as delta specs às specs principais.

Bugs seguem o mesmo caminho: primeiro um cenário na spec que reproduz o bug, depois o fix.

Capabilities atuais: `api-server`, `app-polish`, `app-shell`, `auth`, `content-model`, `crud-theme-content`, `glossary`, `localization`, `progress`, `reminders`, `spaced-repetition`, `study-flow`, `sync` e `web-fundamentals-content`.

## Builds

Os builds e o envio às lojas usam o EAS (perfis `development`, `preview` e `production` em [`eas.json`](eas.json)):

```bash
npx eas-cli@latest build --profile preview
npx eas-cli@latest submit --profile production
```

## Páginas legais

A política de privacidade e os termos de uso ficam em [`docs/legal/`](docs/legal/) e são publicados no GitHub Pages:

- https://alansods.github.io/dev-tips/privacidade
- https://alansods.github.io/dev-tips/termos
