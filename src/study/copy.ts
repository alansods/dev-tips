// Textos fixos da sessão de estudo (frente dos cards e rótulos).

export const FRONT_PROMPT = {
  endpoint: 'Qual operação do CRUD é essa e que status a API devolve?',
  step: 'Como cada framework faz isso?',
  compare: 'Como cada stack resolve isso?',
  concept: 'O que significa?',
} as const;

export const OPERATION_NAME = { C: 'Create', R: 'Read', U: 'Update', D: 'Delete' } as const;

export const CARD_TYPE_LABEL = {
  endpoint: 'Endpoint',
  step: 'Passo',
  compare: 'Mapa mental',
  concept: 'Glossário',
  code: 'Código',
} as const;

export const DECK_ACTION_LABEL = {
  start: 'Estudar',
  continue: 'Continuar',
  restart: 'Estudar de novo',
} as const;
