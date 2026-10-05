import { validateTaxonomy, type Taxonomy, type Track } from '../index';
import { areaSections, areasWithTracks, frameworkTracks, languageSections, tracksInArea } from '../navigation';
import { fullTrack, minimalTrack, testTaxonomy, type Json } from '../__fixtures__/tracks';
import { trackOf } from '../__fixtures__/expect';
import { progressKey, tracksStats } from '../../study/rules';

const taxonomy = (): Taxonomy => {
  const result = validateTaxonomy(testTaxonomy());
  if (!result.ok) throw new Error('fixture de cadastro inválida');
  return result.taxonomy;
};

const make = (id: string, extra: Json): Track => trackOf({ ...minimalTrack(), id, title: id, ...extra }, taxonomy());

/** Catálogo com uma trilha de cada posição, em ordem de catálogo. */
const catalog = (): Track[] => [
  trackOf({ ...fullTrack(), id: 'crud', areas: ['backend'] }, taxonomy()),
  make('web', { areas: ['fundamentos'] }),
  make('java-puro', { areas: ['backend'], language: 'java' }),
  make('spring-di', { areas: ['backend'], language: 'java', framework: 'spring' }),
  make('spring-security', { areas: ['backend'], language: 'java', framework: 'spring' }),
  make('fastapi-basico', { areas: ['backend'], language: 'python', framework: 'fastapi' }),
  make('ts-tipos', { areas: ['frontend', 'backend'], language: 'typescript' }),
];
const ids = (tracks: Track[]) => tracks.map((t) => t.id);

describe('Requirement: Home por áreas', () => {
  it('Áreas com o conteúdo atual', () => {
    const current = catalog().filter((t) => ['crud', 'web'].includes(t.id));
    expect(areasWithTracks(current).map((a) => a.area)).toEqual(['fundamentos', 'backend']);
  });

  it('áreas na ordem fixa, cada uma com as suas trilhas', () => {
    const areas = areasWithTracks(catalog());
    expect(areas.map((a) => [a.area, ids(a.tracks)])).toEqual([
      ['fundamentos', ['web']],
      ['frontend', ['ts-tipos']],
      ['backend', ['crud', 'java-puro', 'spring-di', 'spring-security', 'fastapi-basico', 'ts-tipos']],
    ]);
  });

  it('Trilha em duas áreas', () => {
    expect(ids(tracksInArea(catalog(), 'frontend'))).toContain('ts-tipos');
    expect(ids(tracksInArea(catalog(), 'backend'))).toContain('ts-tipos');
  });

  it('Progresso somado da área', () => {
    const tracks = tracksInArea(catalog(), 'fundamentos');
    expect(tracksStats(tracks, {})).toEqual({ total: 1, known: 0, unknown: 0, answered: 0 });
    const progress = { [progressKey('web', 'api')]: 'known' as const, [progressKey('outra', 'api')]: 'known' as const };
    expect(tracksStats(tracks, progress).known).toBe(1);
  });
});

describe('Requirement: Tela da área', () => {
  it('Backend com o conteúdo atual', () => {
    const current = catalog().filter((t) => ['crud', 'web'].includes(t.id));
    const sections = areaSections(current, taxonomy(), 'backend');
    expect(ids(sections.direct)).toEqual([]);
    expect(sections.languages).toEqual([]);
    expect(ids(sections.comparisons)).toEqual(['crud']);
  });

  it('Fundamentos com o conteúdo atual', () => {
    const sections = areaSections(catalog(), taxonomy(), 'fundamentos');
    expect(ids(sections.direct)).toEqual(['web']);
    expect(sections.languages).toEqual([]);
    expect(sections.comparisons).toEqual([]);
  });

  it('Área com linguagens', () => {
    const sections = areaSections(catalog(), taxonomy(), 'backend');
    expect(sections.languages.map((l) => [l.language.name, l.count])).toEqual([
      ['Java', 3],
      ['Python', 1],
      ['TypeScript', 1],
    ]);
  });

  it('linguagens só da área pedida', () => {
    const sections = areaSections(catalog(), taxonomy(), 'frontend');
    expect(sections.languages.map((l) => [l.language.id, l.count])).toEqual([['typescript', 1]]);
  });
});

describe('Requirement: Tela da linguagem', () => {
  it('Linguagem com as duas seções', () => {
    const sections = languageSections(catalog(), taxonomy(), 'backend', 'java');
    expect(ids(sections.core)).toEqual(['java-puro']);
    expect(sections.frameworks.map((f) => [f.framework.name, f.count])).toEqual([['Spring Boot', 2]]);
  });

  it('Linguagem só com frameworks', () => {
    const sections = languageSections(catalog(), taxonomy(), 'backend', 'python');
    expect(sections.core).toEqual([]);
    expect(sections.frameworks.map((f) => f.framework.id)).toEqual(['fastapi']);
  });

  it('linguagem sem trilhas na área', () => {
    const sections = languageSections(catalog(), taxonomy(), 'frontend', 'java');
    expect(sections.core).toEqual([]);
    expect(sections.frameworks).toEqual([]);
  });
});

describe('Requirement: Tela do framework', () => {
  it('Trilhas do framework', () => {
    expect(ids(frameworkTracks(catalog(), 'backend', 'java', 'spring'))).toEqual(['spring-di', 'spring-security']);
    expect(frameworkTracks(catalog(), 'frontend', 'java', 'spring')).toEqual([]);
  });
});
