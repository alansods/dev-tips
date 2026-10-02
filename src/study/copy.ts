// Textos fixos da sessão de estudo (frente dos cards e rótulos).

export const FRONT_PROMPT = {
  endpoint: 'Qual operação do CRUD é essa e que status a API devolve?',
  step: 'Como cada framework faz isso?',
  compare: 'Como cada stack resolve isso?',
  concept: 'O que significa?',
  question: 'Responda em voz alta antes de virar.',
} as const;

export const OPERATION_NAME = { C: 'Create', R: 'Read', U: 'Update', D: 'Delete' } as const;

export const CARD_TYPE_LABEL = {
  endpoint: 'Endpoint',
  step: 'Passo',
  compare: 'Mapa mental',
  concept: 'Glossário',
  code: 'Código',
  question: 'Entrevista',
} as const;

export const DECK_ACTION_LABEL = {
  start: 'Estudar',
  continue: 'Continuar',
  restart: 'Estudar de novo',
} as const;

/** Rótulos das respostas: botões da sessão e formas minúsculas para contagens e selos. */
export const ANSWER_LABEL = {
  known: { button: 'Já sabia', short: 'já sabia' },
  unknown: { button: 'Não sabia', short: 'não sabia' },
} as const;
