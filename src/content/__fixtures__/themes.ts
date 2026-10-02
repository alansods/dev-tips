// Builders de conteúdo para os testes. Cada chamada devolve um objeto novo,
// então os testes podem modificar o resultado à vontade.

export type Json = Record<string, any>;

export const VARIANT_IDS = ['express', 'spring', 'nest', 'fastapi'];
export const COLUMN_IDS = ['frontend', 'spring', 'express', 'nest', 'fastapi'];

export function snippet(code = 'echo ok', extra: Json = {}): Json {
  return { file: 'terminal', language: 'bash', code, ...extra };
}

export function conceptCard(id = 'api', term = 'API', extra: Json = {}): Json {
  return { type: 'concept', id, term, definition: `Definição de ${term}.`, ...extra };
}

export function endpointCard(id = 'ep-delete', extra: Json = {}): Json {
  return {
    type: 'endpoint',
    id,
    method: 'DELETE',
    path: '/products/{id}',
    operation: 'D',
    description: 'Apaga um produto.',
    successStatus: 204,
    errorStatuses: [404],
    ...extra,
  };
}

export function stepCard(number = 1, extra: Json = {}, variants = VARIANT_IDS): Json {
  return {
    type: 'step',
    id: `step-${number}`,
    number,
    title: `Passo ${number}`,
    whatIs: 'O que é.',
    whyItMatters: 'Por que importa.',
    snippets: Object.fromEntries(variants.map((v) => [v, snippet(`# ${v}`)])),
    ...extra,
  };
}

export function compareCard(id = 'cmp-dto', extra: Json = {}, columns = COLUMN_IDS): Json {
  return {
    type: 'compare',
    id,
    concept: 'DTO',
    explanation: 'O formato dos dados que entram e saem da API.',
    values: Object.fromEntries(columns.map((c) => [c, `valor ${c}`])),
    ...extra,
  };
}

export function codeCard(id = 'docker-compose', extra: Json = {}): Json {
  return {
    type: 'code',
    id,
    origin: 'supplement',
    title: 'docker-compose.yml',
    body: 'Sobe o PostgreSQL.',
    snippet: snippet('services:\n  db:\n    image: postgres:16', { file: 'docker-compose.yml', language: 'yaml' }),
    ...extra,
  };
}

/** Tema só com um concept, sem variants nem compareColumns. */
export function minimalTheme(): Json {
  return {
    id: 'tema-minimo',
    title: 'Tema mínimo',
    description: 'Um tema de teste.',
    decks: [{ id: 'deck-1', title: 'Deck 1', cards: [conceptCard()] }],
  };
}

/** Tema com variants, colunas e um card de cada tipo. */
export function fullTheme(): Json {
  return {
    id: 'crud-teste',
    title: 'CRUD de teste',
    description: 'Tema completo de teste.',
    variants: [
      { id: 'express', name: 'Express', language: 'TypeScript' },
      { id: 'spring', name: 'Spring Boot', language: 'Java' },
      { id: 'nest', name: 'NestJS', language: 'TypeScript' },
      { id: 'fastapi', name: 'FastAPI', language: 'Python' },
    ],
    compareColumns: COLUMN_IDS.map((id) => ({ id, label: id.toUpperCase() })),
    decks: [
      { id: 'endpoints', title: 'Endpoints', cards: [endpointCard()] },
      { id: 'passos', title: 'Passo a passo', cards: [stepCard(1, { relatedTerms: ['api'] }), codeCard()] },
      { id: 'mapa', title: 'Mapa mental', cards: [compareCard()] },
      { id: 'glossario', title: 'Glossário', cards: [conceptCard(), conceptCard('cors', 'CORS', { relatedTerms: ['api'] })] },
    ],
  };
}

/** Atalho para o card `j` do deck `i`. */
export function cardAt(theme: Json, deck: number, card: number): Json {
  return theme.decks[deck].cards[card];
}
