## Why

Quarta das cinco changes de conteúdo aprovadas. Ela cobre Python, muito usado em backend, dados e automação, e seus dois frameworks web principais: FastAPI e Django.

## What Changes

- 3 trilhas novas, com 24 cards cada (72 no total), em PT-BR e com tradução completa para inglês, todas na área Backend:
  - **Linguagem pura (Python):** Python essencial.
  - **Frameworks:** FastAPI e Django.
- O formato é o mesmo das trilhas anteriores: 3 decks de conteúdo (`concept` e `code`) e "Perguntas de entrevista", com nível e termos relacionados em todo card, e os três níveis em cada trilha.

## Capabilities

### New Capabilities

- `python-content`: as 3 trilhas de Python, com identidade, posição na navegação, decks e contagens, conteúdo autoral, ligação com o glossário, mistura de níveis e tradução.

### Modified Capabilities

Nenhuma. O cadastro já tem Python, FastAPI e Django.

## Impact

- `content/tracks/<id>/track.json` e `translations/en.json` para as 3 trilhas.
- Registro em `src/content/catalog.ts` e `src/content/translations.ts`.
- Testes em `src/content/__tests__/python-tracks.test.ts` (com `describeContentTracks`) e `src/__tests__/python-navigation.test.tsx`.
- Sem mudança de código de tela, API ou dados salvos.

## Fora de escopo

- Python para dados e ML (pandas, NumPy) e outros frameworks (Flask).
- A trilha de Banco de dados, na última change.
