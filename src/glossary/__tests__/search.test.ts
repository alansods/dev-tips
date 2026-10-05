import { getGlossary } from '../../content';
import { crudTrack } from '../../test-utils';
import { normalize, searchTerms, type GlossaryEntry } from '../search';

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
