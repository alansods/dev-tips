import { getCatalog } from '../catalog';
import { repoTaxonomy } from '../repoTaxonomy';
import { filterTracks, groupByFirstArea, type TrackFilter } from '../search';

const catalog = getCatalog('pt-BR');
const ids = (tracks: readonly { id: string }[]) => tracks.map((t) => t.id);
const none: TrackFilter = { query: '', language: null, status: 'all' };
const statuses: Record<string, 'done' | 'started' | 'new'> = { react: 'started', 'fundamentos-web': 'done' };
const statusOf = (track: { id: string }) => statuses[track.id] ?? 'new';
const run = (filter: Partial<TrackFilter>) => ids(filterTracks(catalog, repoTaxonomy, { ...none, ...filter }, statusOf));

describe('Requirement: Busca e filtros na aba Trilhas', () => {
  it('sem critério devolve o catálogo inteiro', () => {
    expect(run({})).toEqual(ids(catalog));
  });

  it('Buscar sem acento', () => {
    expect(run({ query: 'estilizacao' })).toEqual(['estilizacao-e-design-system']);
    expect(run({ query: '  ESTILIZAÇÃO ' })).toEqual(['estilizacao-e-design-system']);
  });

  it('Buscar pelo framework', () => {
    expect(run({ query: 'spring' })).toContain('spring-boot');
  });

  it('Sem resultado', () => {
    expect(run({ query: 'cobol' })).toEqual([]);
  });

  it('Filtro em andamento', () => {
    expect(run({ status: 'started' })).toEqual(['react']);
  });

  it('Filtro concluídas', () => {
    expect(run({ status: 'done' })).toEqual(['fundamentos-web']);
  });

  it('Filtro não iniciadas exclui as começadas', () => {
    const list = run({ status: 'new' });
    expect(list).not.toContain('react');
    expect(list).not.toContain('fundamentos-web');
    expect(list.length).toBe(catalog.length - 2);
  });

  it('Filtro por linguagem', () => {
    expect(run({ language: 'python' })).toEqual(['python-essencial', 'fastapi', 'django']);
  });

  it('Busca e filtro juntos', () => {
    expect(run({ language: 'python', query: 'api' })).toEqual(['fastapi']);
  });
});

describe('Requirement: Busca e filtros na aba Trilhas (agrupamento)', () => {
  it('Resultado agrupado por área', () => {
    const groups = groupByFirstArea(filterTracks(catalog, repoTaxonomy, { ...none, language: 'javascript' }, statusOf));
    expect(groups.map((g) => g.area)).toEqual(['frontend', 'backend', 'mobile']);
    const all = groups.flatMap((g) => ids(g.tracks));
    expect(new Set(all).size).toBe(all.length);
    expect(ids(groups[0].tracks)).toContain('javascript-essencial');
    expect(ids(groups[1].tracks)).not.toContain('javascript-essencial');
  });

  it('lista vazia não tem grupos', () => {
    expect(groupByFirstArea([])).toEqual([]);
  });
});
