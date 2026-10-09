import { fullTrack, interviewCard, simulationTrack } from '../__fixtures__/tracks';
import { trackSchema, type Track } from '../schema';
import { localizeTrack, missingTranslations, validateTranslation } from '../translation';

const track = (): Track => trackSchema.parse(fullTrack());
const paths = (input: unknown) => validateTranslation(track(), input).map((e) => e.path);

describe('Requirement: Tradução de uma trilha', () => {
  it('Tradução válida', () => {
    expect(validateTranslation(track(), { title: 'Test CRUD', cards: { cors: { definition: 'Browser rule.' } } })).toEqual([]);
  });

  it('aceita todos os campos de texto de cada tipo', () => {
    const input = {
      title: 'T',
      description: 'D',
      compareColumns: { frontend: 'FRONT' },
      decks: { endpoints: { title: 'Endpoints', description: 'Routes' } },
      cards: {
        'ep-delete': { description: 'Deletes a product.', tags: ['crud'] },
        'step-1': { title: 'Step', whatIs: 'What', whyItMatters: 'Why', snippets: { express: { note: 'Note' } } },
        'docker-compose': { title: 'compose', body: 'Starts it.', snippet: { note: 'n' } },
        'cmp-dto': { concept: 'DTO', explanation: 'Shape', values: { frontend: 'v' } },
        api: { term: 'API', definition: 'Interface.', frontendAnalogy: 'Like', aliases: ['Web API'] },
      },
    };
    expect(validateTranslation(track(), input)).toEqual([]);
  });

  it('Card inexistente', () => {
    expect(paths({ cards: { 'nao-existe': { title: 'x' } } })).toEqual(['cards.nao-existe']);
  });

  it('Campo que não se traduz', () => {
    expect(paths({ cards: { 'step-1': { snippets: { express: { code: 'x' } } } } })).toEqual([
      'cards.step-1.snippets.express.code',
    ]);
  });

  it('Campo de outro tipo', () => {
    expect(paths({ cards: { 'step-1': { definition: 'x' } } })).toEqual(['cards.step-1.definition']);
  });

  it('texto vazio', () => {
    expect(paths({ title: '  ' })).toEqual(['title']);
  });

  it('deck, variante e coluna inexistentes', () => {
    expect(
      paths({
        decks: { nada: { title: 'x' } },
        compareColumns: { nada: 'x' },
        cards: { 'step-1': { snippets: { nada: { note: 'x' } } }, 'cmp-dto': { values: { nada: 'x' } } },
      }).sort(),
    ).toEqual(['cards.cmp-dto.values.nada', 'cards.step-1.snippets.nada', 'compareColumns.nada', 'decks.nada'].sort());
  });

  it('campo desconhecido na raiz e campos que nunca se traduzem', () => {
    expect(paths({ id: 'x' })).toEqual(['id']);
    expect(paths({ cards: { 'ep-delete': { method: 'GET', path: '/x' } } }).sort()).toEqual([
      'cards.ep-delete.method',
      'cards.ep-delete.path',
    ]);
  });
});

describe('Requirement: Tradução de uma trilha (simulação)', () => {
  const sim = (): Track => {
    const raw = simulationTrack();
    raw.decks[0].cards[0] = interviewCard('investigar', { why: 'Porque.', watchOut: 'Cuidado.' });
    return trackSchema.parse(raw);
  };
  const simPaths = (input: unknown) => validateTranslation(sim(), input).map((e) => e.path);

  it('Tradução de uma simulação', () => {
    const input = {
      scenario: { context: 'The dashboard takes 8 seconds.', stack: ['Next.js', 'Node.js', 'PostgreSQL'] },
      cards: { investigar: { question: 'How?', answer: 'I would measure.', why: 'Because.', watchOut: 'Careful.' } },
    };
    expect(validateTranslation(sim(), input)).toEqual([]);
    const localized = localizeTrack(sim(), input);
    expect(localized.scenario?.context).toBe('The dashboard takes 8 seconds.');
    expect(localized.decks[0].cards[0]).toEqual(expect.objectContaining({ why: 'Because.', watchOut: 'Careful.' }));
  });

  it('Stack traduzida com tamanho diferente', () => {
    expect(simPaths({ scenario: { stack: ['Next.js', 'Node.js'] } })).toEqual(['scenario.stack']);
  });

  it('Campo do interview em outro tipo', () => {
    expect(paths({ cards: { 'step-1': { watchOut: 'x' } } })).toEqual(['cards.step-1.watchOut']);
  });

  it('caso numa trilha que não é simulação', () => {
    expect(paths({ scenario: { context: 'x' } })).toEqual(['scenario']);
  });

  it('cobertura do caso e dos campos do interview', () => {
    expect(missingTranslations(sim(), { title: 'T', description: 'D', decks: { conversa: { title: 'C' } }, cards: {} })).toEqual(
      expect.arrayContaining(['scenario.context', 'scenario.stack', 'cards.investigar.question', 'cards.investigar.why', 'cards.investigar.watchOut']),
    );
  });
});
