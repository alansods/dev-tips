// Builders de conteúdo para os testes. Cada chamada devolve um objeto novo,
// então os testes podem modificar o resultado à vontade.

export type Json = Record<string, any>;

export const VARIANT_IDS = ['express', 'spring', 'nest', 'fastapi'];
export const COLUMN_IDS = ['frontend', 'spring', 'express', 'nest', 'fastapi'];

export function snippet(code = 'echo ok', extra: Json = {}): Json {
  return { file: 'terminal', language: 'bash', code, ...extra };
}

export function conceptCard(id = 'api', term = 'API', extra: Json = {}): Json {
  return { type: 'concept', level: 'junior', id, term, definition: `Definição de ${term}.`, ...extra };
}

export function endpointCard(id = 'ep-delete', extra: Json = {}): Json {
  return {
    type: 'endpoint',
    level: 'junior',
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
    level: 'junior',
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
    level: 'junior',
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
    level: 'junior',
    id,
    origin: 'supplement',
    title: 'docker-compose.yml',
    body: 'Sobe o PostgreSQL.',
    snippet: snippet('services:\n  db:\n    image: postgres:16', { file: 'docker-compose.yml', language: 'yaml' }),
    ...extra,
  };
}

/** Trilha só com um concept, sem variants nem compareColumns. */
export function minimalTrack(): Json {
  return {
    id: 'trilha-minimo',
    title: 'Trilha mínima',
    description: 'Uma trilha de teste.',
    areas: ['fundamentos'],
    decks: [{ id: 'deck-1', title: 'Deck 1', cards: [conceptCard()] }],
  };
}

/** Trilha com variants, colunas e um card de cada tipo. */
export function fullTrack(): Json {
  return {
    id: 'crud-teste',
    title: 'CRUD de teste',
    description: 'Trilha completa de teste.',
    areas: ['backend'],
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

/** Cadastro de linguagens e frameworks para os testes. */
export function testTaxonomy(): Json {
  return {
    languages: [
      { id: 'java', name: 'Java', icon: 'openjdk' },
      { id: 'python', name: 'Python', icon: 'python' },
      { id: 'typescript', name: 'TypeScript', icon: 'typescript' },
    ],
    frameworks: [
      { id: 'spring', name: 'Spring Boot', language: 'java', icon: 'springboot' },
      { id: 'fastapi', name: 'FastAPI', language: 'python', icon: 'fastapi' },
      { id: 'nest', name: 'NestJS', language: 'typescript', icon: 'nestjs' },
    ],
  };
}

/** Atalho para o card `j` do deck `i`. */
export function cardAt(track: Json, deck: number, card: number): Json {
  return track.decks[deck].cards[card];
}

export function interviewCard(id = 'investigar', extra: Json = {}): Json {
  return {
    type: 'interview',
    level: 'pleno',
    id,
    question: 'Como você investigaria?',
    answer: 'Eu começaria medindo cada etapa.',
    ...extra,
  };
}

/** Simulação mínima: um caso e um deck com dois cards interview. */
export function simulationTrack(extra: Json = {}): Json {
  return {
    id: 'sim-teste',
    kind: 'simulation',
    title: 'Simulação de teste',
    description: 'Um caso de teste.',
    areas: ['simulacoes'],
    scenario: { context: 'O dashboard passou a demorar 8 segundos.', stack: ['Next.js', 'Node.js', 'PostgreSQL'] },
    decks: [{ id: 'conversa', title: 'Conversa', cards: [interviewCard(), interviewCard('consultas')] }],
    ...extra,
  };
}
