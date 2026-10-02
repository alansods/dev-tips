// Textos da interface em PT-BR. É a fonte das chaves: `Messages` sai daqui e o
// dicionário em inglês precisa ter exatamente a mesma forma.

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export const ptBR = {
  tabs: { themes: 'Temas', glossary: 'Glossário', progress: 'Progresso' },
  common: {
    back: 'Voltar',
    close: 'Fechar',
    cancel: 'Cancelar',
    themeNotFound: 'Tema não encontrado.',
    deckNotFound: 'Deck não encontrado.',
  },
  themeToggle: { toLight: 'Usar tema claro', toDark: 'Usar tema escuro' },
  settings: { title: 'Ajustes', language: 'Idioma' },
  answer: {
    known: { button: 'Já sabia', short: 'já sabia' },
    unknown: { button: 'Não sabia', short: 'não sabia' },
  },
  home: {
    cardLabel: (title: string, known: number, total: number) => `${title}, ${known} de ${total} cards que você sabe`,
    dueBadge: (n: number) => `${n} para revisar hoje`,
  },
  theme: {
    kicker: 'Tema',
    knownLabel: (known: number, total: number) => `${known} de ${total} cards que você sabe`,
    knownCaption: 'cards que você sabe',
    decks: 'Decks',
    deckCards: (n: number) => `${n} ${plural(n, 'card', 'cards')}`,
    deckActionLabel: (action: string, deck: string) => `${action} ${deck}`,
    reviewKicker: 'Revisão de hoje',
    dueToday: (n: number) => `${n} ${plural(n, 'card', 'cards')} para revisar hoje`,
    reviewNow: 'Revisar agora',
    nothingToReview: 'Nada para revisar hoje.',
  },
  deckAction: { start: 'Estudar', continue: 'Continuar', restart: 'Estudar de novo' },
  session: {
    exit: 'Sair da sessão',
    flip: 'Virar card',
    flipHint: 'Mostra a resposta',
    tapToReveal: 'Toque para ver a resposta',
    showAnswer: 'Mostrar resposta',
    reviewTitle: 'Revisão de hoje',
  },
  summary: {
    kicker: 'Sessão concluída',
    allRight: 'Mandou bem, acertou tudo.',
    goodPace: 'Bom ritmo.',
    oneMore: 'Vale mais uma rodada.',
    marked: (known: number, total: number, session: string) =>
      `Você marcou ${known} de ${total} cards como "já sabia" em ${session}.`,
    count: (n: number, label: string) => `${n} ${label}`,
    toReview: 'Para revisar',
    reviewMissed: 'Revisar os que errei',
    backToTheme: 'Voltar ao tema',
  },
  card: {
    types: {
      endpoint: 'Endpoint',
      step: 'Passo',
      compare: 'Mapa mental',
      concept: 'Glossário',
      code: 'Código',
      question: 'Entrevista',
    },
    stepNumber: (n: number) => `Passo ${n}`,
    supplement: 'Complemento',
    relatedTerms: 'Termos relacionados',
    success: 'Sucesso',
    errors: 'Erros',
    frontPrompt: {
      endpoint: 'Qual operação do CRUD é essa e que status a API devolve?',
      step: 'Como cada framework faz isso?',
      compare: 'Como cada stack resolve isso?',
      concept: 'O que significa?',
      question: 'Responda em voz alta antes de virar.',
    },
    operation: { C: 'Create', R: 'Read', U: 'Update', D: 'Delete' },
  },
  glossary: {
    kicker: 'Glossário',
    searchLabel: 'Buscar termo',
    searchPlaceholder: 'Buscar termo ou definição (ex.: CORS, DTO)',
    count: (n: number) => `${n} ${plural(n, 'termo', 'termos')}`,
    empty: 'Nenhum termo encontrado.',
    openHint: 'Abre a definição',
    closeDefinition: 'Fechar definição',
    reviewBadge: 'revisar',
  },
  progress: {
    ring: (percent: number) => `${percent}% do tema dominado`,
    mastered: (known: number, total: number) => `${known} de ${total} cards dominados.`,
    count: (n: number, label: string) => `${n} ${label}`,
    toReview: 'para revisar',
    unseen: 'não vistos',
    byDeck: 'Por deck',
    reset: 'Zerar progresso',
    confirmTitle: 'Zerar o progresso deste tema?',
    confirmBody: 'Todas as respostas deste tema serão apagadas. Isso não pode ser desfeito.',
    confirm: 'Zerar',
  },
};

export type Messages = typeof ptBR;
