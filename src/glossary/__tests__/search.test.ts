import { getGlossary } from '../../content';
import { crudTrack, webTrack } from '../../test-utils';
import {
  countActive,
  filterTerms,
  NO_FILTERS,
  normalize,
  searchTerms,
  sortTerms,
  withLetterHeaders,
  type GlossaryEntry,
  type GlossaryFilters,
} from '../search';

const entries: GlossaryEntry[] = getGlossary(crudTrack).map((concept) => ({ trackId: crudTrack.id, concept }));
const terms = (q: string) => searchTerms(entries, q).map((e) => e.concept.term);

describe('normalize', () => {
  it('remove acentos e caixa', () => {
    expect(normalize('Injeção de Dependência')).toBe('injecao de dependencia');
  });
});

describe('Requirement: Busca no glossário', () => {
  it('Buscar pelo nome', () => {
    expect(terms('cors')).toEqual(['CORS']);
  });

  it('Buscar sem acento', () => {
    expect(terms('injecao')).toContain('Injeção de dependência');
  });

  it('Buscar pela definição', () => {
    expect(terms('caixinhas')).toEqual(['Docker']);
  });

  it('Sem resultados', () => {
    expect(terms('kubernetes')).toEqual([]);
  });

  it('busca vazia devolve tudo na ordem', () => {
    expect(terms('   ')).toEqual(entries.map((e) => e.concept.term));
  });

  it('busca por alias', () => {
    const withAlias: GlossaryEntry[] = [
      { trackId: 't', concept: { ...entries[0].concept, term: 'Endpoint', aliases: ['Rota HTTP'] } },
    ];
    expect(searchTerms(withAlias, 'rota').map((e) => e.concept.term)).toEqual(['Endpoint']);
  });
});

const both: GlossaryEntry[] = [crudTrack, webTrack].flatMap((track) =>
  getGlossary(track).map((concept) => ({ trackId: track.id, concept })),
);
const names = (list: GlossaryEntry[]) => list.map((e) => e.concept.term);

describe('Requirement: Aba Glossário (ordem)', () => {
  it('Lista completa: ordem alfabética sem diferenciar caixa e acentos', () => {
    const sorted = names(sortTerms(both));
    expect(sorted).toHaveLength(45);
    expect(sorted.slice(0, 3)).toEqual(['API', 'Cabeçalho (header)', 'Cache HTTP']);
    expect(sorted.at(-1)).toBe('XSS (Cross-Site Scripting)');
    expect(sorted.indexOf('localStorage')).toBeLessThan(sorted.indexOf('Método HTTP'));
  });

  it('nomes iguais seguem a ordem das trilhas', () => {
    const [a, b] = [entries[0], { ...entries[0], trackId: 'outra' }];
    expect(sortTerms([b, a]).map((e) => e.trackId)).toEqual(['outra', crudTrack.id]);
    expect(sortTerms([a, b]).map((e) => e.trackId)).toEqual([crudTrack.id, 'outra']);
  });

  it('Cabeçalhos de letra: um por letra, sem acento, antes do primeiro termo', () => {
    const rows = withLetterHeaders(sortTerms(both));
    const letters = rows.filter((r) => r.kind === 'letter').map((r) => r.letter);
    expect(new Set(letters).size).toBe(letters.length);
    const at = (term: string) => rows.findIndex((r) => r.kind === 'term' && r.entry.concept.term === term);
    expect(rows[at('API') - 1]).toEqual({ kind: 'letter', letter: 'A' });
    expect(rows[at('Cabeçalho (header)') - 1]).toEqual({ kind: 'letter', letter: 'C' });
    expect(rows[at('Injeção de dependência') - 1]).toEqual({ kind: 'letter', letter: 'I' });
  });

  it('cada termo sabe se é o primeiro e o último da sua letra', () => {
    const rows = withLetterHeaders(sortTerms(both)).filter((r) => r.kind === 'term');
    const row = (term: string) => rows.find((r) => r.entry.concept.term === term)!;
    expect(row('API')).toMatchObject({ first: true, last: true });
    expect(row('Cabeçalho (header)')).toMatchObject({ first: true, last: false });
    expect(row('CSRF (Cross-Site Request Forgery)')).toMatchObject({ first: false, last: true });
  });
});

describe('Requirement: Filtros do glossário', () => {
  const progress: Record<string, 'known' | 'unknown'> = {
    [`${crudTrack.id}:cors`]: 'known',
    [`${crudTrack.id}:dto`]: 'unknown',
  };
  const ctx = {
    areaOf: (trackId: string) => [crudTrack, webTrack].find((t) => t.id === trackId)?.areas[0],
    statusOf: (e: GlossaryEntry) => progress[`${e.trackId}:${e.concept.id}`],
  };
  const run = (filters: Partial<GlossaryFilters>) => names(filterTerms(both, { ...NO_FILTERS, ...filters }, ctx));

  it('sem filtros devolve tudo', () => {
    expect(run({})).toHaveLength(45);
    expect(countActive(NO_FILTERS)).toBe(0);
  });

  it('Filtrar por trilha', () => {
    expect(run({ trackIds: [webTrack.id] })).toHaveLength(21);
    expect(run({ trackIds: [webTrack.id, crudTrack.id] })).toHaveLength(45);
  });

  it('Filtrar por nível', () => {
    const pleno = run({ level: 'pleno' });
    expect(pleno).toHaveLength(17);
    expect(pleno).toContain('CORS');
    expect(pleno).not.toContain('API');
  });

  it('Filtrar pelo estudo', () => {
    expect(run({ study: 'review' })).toEqual(['DTO (Data Transfer Object)']);
    expect(run({ study: 'known' })).toEqual(['CORS']);
  });

  it('Não vistos', () => {
    const unseen = run({ study: 'new' });
    expect(unseen).toHaveLength(43);
    expect(unseen).not.toContain('CORS');
  });

  it('Filtrar por área', () => {
    expect(run({ area: 'fundamentos' })).toHaveLength(21);
  });

  it('conta os filtros ativos (cada trilha conta um)', () => {
    expect(countActive({ study: 'review', area: 'backend', level: 'junior', trackIds: ['a', 'b'] })).toBe(5);
  });
});
