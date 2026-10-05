## Why

O catálogo cobre web, backend e banco de dados, mas não tem mobile nem a entrega do software até a produção. Em entrevistas fullstack, React Native, pipelines de CI/CD e AWS aparecem com frequência. Esses temas não cabem nas áreas atuais: React Native não é web, e CI/CD e AWS não são nem linguagem nem framework. Por isso cada grupo ganha uma área própria.

## What Changes

- **Área nova "Mobile"** (EN: *Mobile*), exibida depois de Banco de dados, organizada por linguagem e framework: Mobile › JavaScript › React Native.
- **Área nova "DevOps e Cloud"** (EN: *DevOps & Cloud*), exibida por último. As trilhas ficam diretas na área e divididas em duas seções nomeadas, nesta ordem: **CI/CD** e **AWS**.
- O cadastro ganha o framework **React Native** na linguagem `javascript`.
- 5 trilhas novas, com 24 cards cada (120 no total), em PT-BR e com tradução completa para inglês:
  - **Mobile:** React Native.
  - **CI/CD:** CI/CD essencial e GitHub Actions.
  - **AWS:** AWS essencial e Deploy na AWS.
- O formato é o mesmo das trilhas anteriores: 3 decks de conteúdo e "Perguntas de entrevista", com nível e termos relacionados em todo card, e os três níveis em cada trilha.

## Capabilities

### New Capabilities

- `mobile-content`: a trilha de React Native, com a posição na navegação, os decks e as contagens, o conteúdo autoral, a ligação com o glossário, a mistura de níveis e a tradução.
- `devops-content`: as 4 trilhas de CI/CD e AWS, com a seção de cada uma, os decks e as contagens, o conteúdo autoral, a ligação com o glossário, a mistura de níveis e a tradução.

### Modified Capabilities

- `content-model`: a lista de áreas válidas ganha `mobile` e `devops`, e a lista de seções ganha `ci-cd` e `aws`. O exemplo de área desconhecida deixa de ser `mobile`.
- `catalog-navigation`: a ordem da Home passa a terminar com Mobile e DevOps e Cloud; a tela da área ordena as seções CI/CD e AWS depois das de banco; os textos ganham "Mobile", "DevOps e Cloud/DevOps & Cloud", "CI/CD" e "AWS". O exemplo de área não encontrada deixa de ser `mobile`.

## Impact

- `AREAS` e `SECTIONS` em `src/content/schema.ts`; `nav.areas` e `nav.sections` em `src/i18n/pt-BR.ts` e `src/i18n/en.ts`.
- `content/taxonomy.json`: framework `react-native`.
- `content/tracks/<id>/track.json` e `translations/en.json` para as 5 trilhas, com o registro em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes novos: `src/content/__tests__/mobile-tracks.test.ts`, `src/content/__tests__/devops-tracks.test.ts`, `src/__tests__/mobile-navigation.test.tsx` e `src/__tests__/devops-navigation.test.tsx`. Ajustes nos testes que usavam `mobile` como área inválida.
- Sem mudança no código de navegação nem nas telas, na API ou nos dados salvos.

## Fora de escopo

- Outras trilhas de mobile (Flutter, Swift, Kotlin) e marcar as trilhas de JavaScript/TypeScript com a área Mobile.
- Trilhas de Docker, Kubernetes ou Terraform como trilhas próprias. Containers e IaC aparecem dentro de "Deploy na AWS".
- Outros provedores de nuvem (GCP, Azure) e outras ferramentas de CI (GitLab CI, Jenkins), que aparecem só como comparação em cards.
