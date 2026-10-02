import type { QuestionCard } from '../index';
import { cardAt, fullTheme, snippet } from '../__fixtures__/themes';
import { expectErrorAt, themeOf } from '../__fixtures__/expect';

const questionCard = (extra: Record<string, unknown> = {}) => ({
  type: 'question',
  id: 'put-vs-patch',
  origin: 'supplement',
  question: 'Qual a diferença entre PUT e PATCH?',
  answer: 'PUT substitui o recurso inteiro; PATCH altera só os campos enviados.',
  ...extra,
});

/** fullTheme com um deck de perguntas no fim (deck 4). */
function withQuestion(extra: Record<string, unknown> = {}) {
  const theme = fullTheme();
  theme.decks.push({ id: 'perguntas', title: 'Perguntas', cards: [questionCard(extra)] });
  return theme;
}

describe('Requirement: Card question', () => {
  it('Pergunta válida', () => {
    const theme = themeOf(withQuestion({ snippet: snippet('SELECT 1;', { language: 'sql', file: 'query.sql' }) }));
    const card = cardAt(theme, 4, 0) as QuestionCard;
    expect(card.question).toBe('Qual a diferença entre PUT e PATCH?');
    expect(card.snippet?.language).toBe('sql');
  });

  it('Pergunta sem resposta', () => {
    expectErrorAt(withQuestion({ answer: '  ' }), 'decks[4].cards[0].answer');
  });

  it('Pergunta com termo relacionado inexistente', () => {
    expectErrorAt(withQuestion({ relatedTerms: ['fantasma'] }), 'decks[4].cards[0].relatedTerms[0]', 'fantasma');
  });

  it('snippet de question segue as regras de snippet', () => {
    expectErrorAt(withQuestion({ snippet: snippet('x', { language: 'cobol' }) }), 'decks[4].cards[0].snippet.language');
  });

  it('snippet é opcional', () => {
    const card = cardAt(themeOf(withQuestion()), 4, 0) as QuestionCard;
    expect(card.snippet).toBeUndefined();
  });
});
