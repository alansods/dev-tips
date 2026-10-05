import { fullTrack } from '../__fixtures__/tracks';
import { trackSchema, type Track } from '../schema';
import { validateTranslation } from '../translation';

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
