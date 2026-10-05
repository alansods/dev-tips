## Why

Terceira das cinco changes de conteúdo aprovadas. Ela cobre Java, a linguagem mais comum em backends corporativos, e o Spring Boot, seu framework principal.

## What Changes

- 3 trilhas novas, com 24 cards cada (72 no total), em PT-BR e com tradução completa para inglês, todas na área Backend:
  - **Linguagem pura (Java):** Java essencial; Java: coleções, streams e concorrência.
  - **Framework:** Spring Boot.
- O formato é o mesmo das trilhas de JavaScript e TypeScript: 3 decks de conteúdo (`concept` e `code`) e "Perguntas de entrevista", com nível e termos relacionados em todo card, e os três níveis em cada trilha.

## Capabilities

### New Capabilities

- `java-content`: as 3 trilhas de Java, com identidade, posição na navegação, decks e contagens, conteúdo autoral, ligação com o glossário, mistura de níveis e tradução.

### Modified Capabilities

Nenhuma. O cadastro já tem Java e Spring Boot.

## Impact

- `content/tracks/<id>/track.json` e `translations/en.json` para as 3 trilhas.
- Registro em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes em `src/content/__tests__/java-tracks.test.ts` (usando o helper `describeContentTracks`) e `src/__tests__/java-navigation.test.tsx`.
- Sem mudança de código de tela, API ou dados salvos.

## Fora de escopo

- Outros frameworks Java (Quarkus, Micronaut) e build (Maven e Gradle além do básico).
- As trilhas de Python e Banco de dados, cada uma na sua change.
