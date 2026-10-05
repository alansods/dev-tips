import { validateCatalog } from '../index';
import { conceptCard, fullTrack, minimalTrack } from '../__fixtures__/tracks';
import { errorsOf, trackOf } from '../__fixtures__/expect';

describe('Requirement: Relatório de erros completo', () => {
  it('Vários erros no mesma trilha', () => {
    const input = fullTrack();
    input.decks[0].title = '';
    delete input.decks[1].cards[0].snippets.nest;
    const paths = errorsOf(input).map((e) => e.path);
    expect(paths).toEqual(expect.arrayContaining(['decks[0].title', 'decks[1].cards[0].snippets.nest']));
  });

  it('Sucesso com padrões aplicados', () => {
    const input = minimalTrack();
    input.decks[0].cards.push(conceptCard('cors', 'CORS'));
    const track = trackOf(input);
    for (const card of track.decks[0].cards) {
      expect(card).toMatchObject({ origin: 'original', tags: [], relatedTerms: [] });
    }
  });

  it('mensagens em PT-BR, inclusive as geradas pelo Zod', () => {
    const input = minimalTrack();
    input.title = 42; // tipo errado: mensagem vem do locale do Zod
    input.decks[0].cards[0].type = 'quiz'; // tipo de card desconhecido
    const errors = errorsOf(input);
    const title = errors.find((e) => e.path === 'title');
    expect(title?.message).toMatch(/inválid|esperado/i);
    expect(errors.find((e) => e.path === 'decks[0].cards[0].type')).toBeDefined();
    for (const e of errors) expect(e.message).not.toMatch(/\b(Invalid|expected|received)\b/);
  });

  it('não lança exceção para entradas que não são objetos', () => {
    for (const input of [null, undefined, 'trilha', 42, []]) {
      expect(errorsOf(input).length).toBeGreaterThan(0);
    }
  });
});

describe('Requirement: Unicidade de ids (catálogo)', () => {
  it('Trilhas com o mesmo id no catálogo', () => {
    const a = fullTrack();
    const b = fullTrack();
    a.id = b.id = 'crud-4-frameworks';
    const result = validateCatalog([a, b]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: '[1].id', message: expect.stringContaining('crud-4-frameworks') })]));
  });

  it('catálogo válido devolve as trilhas', () => {
    const result = validateCatalog([minimalTrack(), fullTrack()]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.tracks.map((t) => t.id)).toEqual(['trilha-minimo', 'crud-teste']);
  });

  it('erros de uma trilha saem prefixados com o índice', () => {
    const bad = minimalTrack();
    bad.decks = [];
    const result = validateCatalog([minimalTrack(), bad]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.map((e) => e.path)).toContain('[1].decks');
  });

  it('catálogo vazio é válido', () => {
    expect(validateCatalog([])).toEqual({ ok: true, tracks: [] });
  });
});
