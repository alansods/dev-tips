import { placementOf, validateTaxonomy, type Taxonomy } from '../index';
import { conceptCard, fullTrack, minimalTrack, testTaxonomy, type Json } from '../__fixtures__/tracks';
import { errorsOf, expectErrorAt, trackOf } from '../__fixtures__/expect';

function taxonomy(): Taxonomy {
  const result = validateTaxonomy(testTaxonomy());
  if (!result.ok) throw new Error('fixture de cadastro inválida');
  return result.taxonomy;
}

describe('Requirement: Áreas da trilha', () => {
  it('Trilha sem áreas', () => {
    const input = minimalTrack();
    delete input.areas;
    expectErrorAt(input, 'areas');
    input.areas = [];
    expectErrorAt(input, 'areas');
  });

  it('Área desconhecida', () => {
    const input = minimalTrack();
    input.areas = ['mobile'];
    expectErrorAt(input, 'areas[0]');
  });

  it('Área repetida', () => {
    const input = minimalTrack();
    input.areas = ['backend', 'backend'];
    expectErrorAt(input, 'areas', 'backend');
  });

  it('Área de banco de dados', () => {
    const input = minimalTrack();
    input.areas = ['banco-de-dados'];
    expect(trackOf(input).areas).toEqual(['banco-de-dados']);
  });

  it('Trilha em duas áreas', () => {
    const input = minimalTrack();
    input.areas = ['frontend', 'backend'];
    expect(trackOf(input).areas).toEqual(['frontend', 'backend']);
  });
});

describe('Requirement: Nível do card', () => {
  it('Card sem nível', () => {
    const input = minimalTrack();
    delete input.decks[0].cards[0].level;
    expectErrorAt(input, 'decks[0].cards[0].level');
  });

  it('Nível inválido', () => {
    const input = minimalTrack();
    input.decks[0].cards[0].level = 'expert';
    expectErrorAt(input, 'decks[0].cards[0].level');
  });

  it('aceita os três níveis', () => {
    const input = minimalTrack();
    input.decks[0].cards = [
      conceptCard('a', 'A', { level: 'junior' }),
      conceptCard('b', 'B', { level: 'pleno' }),
      conceptCard('c', 'C', { level: 'senior' }),
    ];
    expect(trackOf(input).decks[0].cards.map((c) => c.level)).toEqual(['junior', 'pleno', 'senior']);
  });
});

describe('Requirement: Cadastro de linguagens e frameworks', () => {
  it('Cadastro válido', () => {
    const result = validateTaxonomy({
      languages: [{ id: 'java', name: 'Java' }],
      frameworks: [{ id: 'spring', name: 'Spring Boot', language: 'java' }],
    });
    expect(result.ok).toBe(true);
  });

  it('Framework de linguagem inexistente', () => {
    const result = validateTaxonomy({
      languages: [{ id: 'java', name: 'Java' }],
      frameworks: [{ id: 'rails', name: 'Rails', language: 'ruby' }],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.map((e) => e.path)).toContain('frameworks[0].language');
  });

  it('Linguagem repetida', () => {
    const result = validateTaxonomy({
      languages: [
        { id: 'java', name: 'Java' },
        { id: 'java', name: 'Java 2' },
      ],
      frameworks: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.some((e) => e.message.includes('java'))).toBe(true);
  });

  it('id fora do padrão e nome vazio', () => {
    const result = validateTaxonomy({ languages: [{ id: 'Java', name: ' ' }], frameworks: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.map((e) => e.path)).toEqual(expect.arrayContaining(['languages[0].id', 'languages[0].name']));
  });
});

describe('Requirement: Posicionamento da trilha', () => {
  const placed = (extra: Json) => ({ ...minimalTrack(), areas: ['backend'], ...extra });

  it('Trilha de framework válida', () => {
    const track = trackOf(placed({ language: 'java', framework: 'spring' }), taxonomy());
    expect(placementOf(track)).toEqual({ kind: 'framework', language: 'java', framework: 'spring' });
  });

  it('Framework de outra linguagem', () => {
    expectErrorAt(placed({ language: 'python', framework: 'spring' }), 'framework', undefined, taxonomy());
  });

  it('Framework sem linguagem', () => {
    expectErrorAt(placed({ framework: 'spring' }), 'language', undefined, taxonomy());
  });

  it('Linguagem fora do cadastro', () => {
    expectErrorAt(placed({ language: 'cobol' }), 'language', undefined, taxonomy());
  });

  it('Framework fora do cadastro', () => {
    expectErrorAt(placed({ language: 'java', framework: 'quarkus' }), 'framework', undefined, taxonomy());
  });

  it('Comparativa com linguagem', () => {
    const input = { ...fullTrack(), language: 'java' };
    const errors = errorsOf(input, taxonomy());
    expect(errors.some((e) => e.message.includes('comparativas'))).toBe(true);
  });

  it('Trilha direta na área', () => {
    expect(placementOf(trackOf(minimalTrack(), taxonomy()))).toEqual({ kind: 'direct' });
  });

  it('linguagem pura e comparativa', () => {
    expect(placementOf(trackOf(placed({ language: 'python' }), taxonomy()))).toEqual({ kind: 'language', language: 'python' });
    expect(placementOf(trackOf(fullTrack(), taxonomy()))).toEqual({ kind: 'comparison' });
  });
});
