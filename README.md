# Dev Tips

A mobile study app with cards that reinforce fullstack development concepts that come up in job interviews.

Pick an **area** (Fundamentals, Frontend, Backend, Databases), open a **track** and a **deck** and study the **cards** as flashcards: flip the card, answer "I knew it" or "I didn't know", and the app schedules the next review. It works offline and without an account. Google sign-in is optional and is used to sync your progress across devices.

## Features

- **Areas, languages and frameworks**: tracks are grouped by area, then by language and framework. Tracks that build the same thing in several stacks live under **Comparisons**. Today: "The same CRUD in four frameworks" (Express, Spring Boot, NestJS, FastAPI) in Backend › Comparisons, "Web fundamentals" (HTTP, REST, browser and security, interview questions) and "Git and collaboration" in Fundamentals, and JavaScript (TypeScript included): JavaScript essentials, Asynchronous JavaScript, JavaScript in the browser, Node.js, TypeScript essentials, Advanced TypeScript and Build tools and bundlers as core language, plus React (with State and data in React, Frontend testing and Styling and design systems), Vue, Next.js, Express, Angular and NestJS as frameworks; and Java: Java essentials and Java: collections, streams and concurrency as core language, plus Spring Boot; and Python: Python essentials as core language, plus FastAPI and Django. The Databases area covers SQL essentials, Data modeling, Transactions and performance, PostgreSQL and MySQL (relational), and MongoDB, Redis and NoSQL: models and when to use them (non-relational). The Mobile area has Build tools and bundlers as core JavaScript, React Native under JavaScript › React Native and State and data in React, Frontend testing and Styling and design systems under JavaScript › React, and the DevOps & Cloud area covers CI/CD essentials and GitHub Actions (CI/CD), and AWS essentials and Deploying on AWS (AWS).
- **Seniority per card**: every card shows whether the topic is usually asked of Junior, Mid-level or Senior developers.
- **Flashcards** with a flip animation, code with tabs per variant, and a summary at the end of each session.
- **Spaced repetition** with boxes, plus a daily review.
- **Glossary** with search; terms mentioned in cards open their definition in a bottom sheet.
- **Progress** per track and per deck, stored on the device, with an option to reset.
- **Daily reminders** (optional), using local notifications.
- **Languages**: Brazilian Portuguese and English (UI and content).
- **Light and dark mode.**
- **Optional account** (Google) that syncs progress and preferences.

## Stack

| Part    | Technologies                                                                                 |
| ------- | -------------------------------------------------------------------------------------------- |
| App     | Expo SDK 57, React Native 0.86, TypeScript (strict), Expo Router, Zustand, AsyncStorage, Zod |
| API     | Hono on Cloudflare Workers, Cloudflare D1 database, `jose` (JWT)                             |
| Tests   | Jest + React Native Testing Library (app), Vitest + `@cloudflare/vitest-plugin` (API)        |
| Process | [OpenSpec](https://github.com/Fission-AI/OpenSpec) (spec-driven development)                 |

## Project structure

```
src/
  app/          Expo Router routes (each file is a screen)
  components/   reusable UI components
  content/      content loading, validation and integrity checks
  study/        study session, progress and spaced repetition
  glossary/     glossary and its links to cards
  auth/         Google sign-in and session
  sync/         offline queue and sync with the API
  reminders/    daily reminders
  i18n/         UI languages
  settings/     Settings screen and preferences
  theme/        colors, fonts and light/dark mode
content/
  sources/      original editorial material (Markdown)
  tracks/       content used by the app (track.json + translations/)
  taxonomy.json languages and frameworks used to place tracks
api/            API (Cloudflare Workers + D1)
openspec/       specs (source of truth) and changes
docs/           decisions, design backlog and legal pages
plugins/        Expo config plugins
```

## Running the app

Requirements: Node.js, plus Xcode (iOS) or Android Studio (Android).

```bash
npm install
cp .env.example .env   # fill in the Google client IDs
npx expo run:ios       # or: npx expo run:android
```

The app uses native modules that aren't included in Expo Go (such as Google Sign-In), so it needs a **development build**: `npx expo run:ios|android` locally, or `npx eas-cli@latest build --profile development`. After the first build, `npx expo start` is enough for day-to-day work.

The `ios/` and `android/` folders are generated (Continuous Native Generation). Don't edit them by hand: configure native behavior through `app.json`, `app.config.ts` and `plugins/`.

### Environment variables (`.env`)

| Variable                            | Purpose                                                   |
| ----------------------------------- | --------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL`               | API URL (default: the API deployed on Cloudflare Workers) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`  | "Web application" client ID, checked by the API           |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`  | "iOS" client ID                                           |
| `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` | iOS URL scheme, used by the Google Sign-In plugin         |

None of these values are secrets: they all ship inside the app. Without them the app works normally, just without sign-in.

### Commands

```bash
npm test             # tests (Jest)
npm run lint         # lint (expo lint)
npm run typecheck    # tsc --noEmit
npm run format       # Prettier
npm run icons        # generate the app icons
```

## Running the API

```bash
cd api
npm install
cp .dev.vars.example .dev.vars   # JWT_SECRET and GOOGLE_CLIENT_IDS
npm run dev                      # wrangler dev
```

| Command              | What it does                          |
| -------------------- | ------------------------------------- |
| `npm test`           | tests (Vitest on the Workers runtime) |
| `npm run typecheck`  | type-checks the code and the tests    |
| `npm run db:migrate` | applies migrations to the remote D1   |
| `npm run deploy`     | deploys to Cloudflare Workers         |

In production, secrets are set with `npx wrangler secret put <NAME>`.

Routes: `GET /health`, `POST /auth/google`, `POST /auth/refresh`, `POST /auth/logout`, `GET /me`, `DELETE /me`, `GET /sync` and `PUT /sync`.

## Content

Content is kept separate from the code:

- `content/sources/*.md` is the original editorial material.
- `content/tracks/<track-id>/track.json` is what the app loads, validated by the Zod schema from the `content-model` capability. Translations live in `translations/en.json`.
- Each track declares its `areas` and, optionally, a `language` and a `framework` from `content/taxonomy.json`; tracks with `variants` are comparisons. Every card has a `level` (`junior`, `pleno` or `senior`).

Gaps in the original material are filled with cards marked as supplements (`origin: "supplement"`), so they're never mistaken for the original. Keys are in English; displayed text is in Brazilian Portuguese (and English through translations).

## Spec-driven development

The specs in [`openspec/specs/`](openspec/specs/) are the source of truth. No behavior changes without going through a change first:

1. `/opsx:propose "<idea>"` creates `openspec/changes/<change>/` (proposal, design, delta specs and tasks).
2. The spec is reviewed.
3. `/opsx:apply` implements it in this order: failing test, implementation, passing test.
4. `openspec validate --strict`, tests, lint and typecheck all pass.
5. `/opsx:archive` merges the delta specs into the main specs.

Bugs follow the same path: first a spec scenario that reproduces the bug, then the fix.

Current capabilities: `api-server`, `app-polish`, `app-shell`, `auth`, `catalog-navigation`, `content-model`, `crud-theme-content`, `database-content`, `devops-content`, `glossary`, `java-content`, `javascript-content`, `localization`, `mobile-content`, `progress`, `python-content`, `reminders`, `spaced-repetition`, `study-flow`, `sync`, `typescript-content` and `web-fundamentals-content`.

> Specs, changes and project docs are written in Brazilian Portuguese.

## CI and branch protection

Every pull request and every push to `main` or `dev` runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml) on a clean machine, in two parallel jobs:

- `app`: `npm ci`, lint, typecheck, `prettier --check`, Jest and `openspec validate --strict --all`.
- `api`: `npm ci`, typecheck and Vitest in `api/`.

Run the same commands locally before pushing; CI is the second check. Repository rulesets require `app` and `api` to pass before anything lands on `main` or `dev`, `main` only changes through pull requests, and force pushes and branch deletion are blocked on both. Dependabot only opens pull requests for known security vulnerabilities.

Branch flow: `feat/*`, `fix/*` and `chore/*` start from `dev` and are merged into `dev`; `dev` is merged into `main` for a release.

## Builds

Builds and store submissions use EAS (`development`, `preview` and `production` profiles in [`eas.json`](eas.json)):

```bash
npx eas-cli@latest build --profile preview
npx eas-cli@latest submit --profile production
```

## Legal pages

The privacy policy and terms of use live in [`docs/legal/`](docs/legal/) and are published on GitHub Pages:

- https://alansods.github.io/dev-tips/privacidade
- https://alansods.github.io/dev-tips/termos

## License

Copyright (c) 2026 Alan Santos. All rights reserved. The code is published for reading only: no license is granted to copy, modify, distribute or reuse any part of it, including the card content and the "Dev Tips" brand. See [`LICENSE`](LICENSE).
