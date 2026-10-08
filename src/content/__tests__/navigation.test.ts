import { validateTaxonomy, type Taxonomy, type Track } from '../index';
import { areaPath, areaSections, areasWithTracks, frameworkTracks, languageSections, nextTracks, tracksInArea } from '../navigation';
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

  it('Git depois de Fundamentos, Mobile e DevOps e Cloud no fim', () => {
    const all = [
      make('ci', { areas: ['devops'] }),
      make('git', { areas: ['git'] }),
      make('rn', { areas: ['mobile'] }),
      ...catalog(),
      make('sql', { areas: ['banco-de-dados'] }),
    ];
    expect(areasWithTracks(all).map((a) => a.area)).toEqual([
      'fundamentos',
      'git',
      'frontend',
      'backend',
      'banco-de-dados',
      'mobile',
      'devops',
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

describe('Requirement: Tela da área (seções)', () => {
  it('Trilhas diretas em seções', () => {
    const db = [
      make('nosql', { areas: ['banco-de-dados'], section: 'nao-relacionais' }),
      make('sql', { areas: ['banco-de-dados'], section: 'relacionais' }),
      make('pg', { areas: ['banco-de-dados'], section: 'relacionais' }),
    ];
    const sections = areaSections(db, taxonomy(), 'banco-de-dados');
    expect(sections.direct).toEqual([]);
    expect(sections.grouped.map((g) => [g.section, ids(g.tracks)])).toEqual([
      ['relacionais', ['sql', 'pg']],
      ['nao-relacionais', ['nosql']],
    ]);
  });

  it('Seções CI/CD e AWS', () => {
    const devops = [
      make('aws-base', { areas: ['devops'], section: 'aws' }),
      make('ci', { areas: ['devops'], section: 'ci-cd' }),
      make('aws-deploy', { areas: ['devops'], section: 'aws' }),
    ];
    expect(areaSections(devops, taxonomy(), 'devops').grouped.map((g) => [g.section, ids(g.tracks)])).toEqual([
      ['ci-cd', ['ci']],
      ['aws', ['aws-base', 'aws-deploy']],
    ]);
  });

  it('sem seções, grouped fica vazio', () => {
    expect(areaSections(catalog(), taxonomy(), 'backend').grouped).toEqual([]);
  });
});

describe('Requirement: Ordem sugerida na área', () => {
  it('Pré-requisito antes', () => {
    const tracks = [
      make('nextjs', { areas: ['frontend'], prerequisites: ['react'] }),
      make('react', { areas: ['frontend'] }),
    ];
    expect(ids(areaPath(tracks, 'frontend'))).toEqual(['react', 'nextjs']);
  });

  it('Ordem do catálogo no empate', () => {
    const tracks = [
      make('js-navegador', { areas: ['frontend'] }),
      make('vue', { areas: ['frontend'], prerequisites: ['js-navegador'] }),
      make('react', { areas: ['frontend'], prerequisites: ['js-navegador'] }),
    ];
    expect(ids(areaPath(tracks, 'frontend'))).toEqual(['js-navegador', 'vue', 'react']);
  });

  it('Pré-requisito de outra área', () => {
    const tracks = [
      make('react', { areas: ['frontend'] }),
      make('react-native', { areas: ['mobile'], prerequisites: ['react'] }),
      make('expo-nativo', { areas: ['mobile'], prerequisites: ['react-native'] }),
    ];
    expect(ids(areaPath(tracks, 'mobile'))).toEqual(['react-native', 'expo-nativo']);
  });

  it('cadeia longa fica em ordem e cada trilha aparece uma vez', () => {
    const tracks = [
      make('c', { areas: ['backend'], prerequisites: ['b'] }),
      make('d', { areas: ['backend'], prerequisites: ['a', 'c'] }),
      make('b', { areas: ['backend'], prerequisites: ['a'] }),
      make('a', { areas: ['backend'] }),
    ];
    expect(ids(areaPath(tracks, 'backend'))).toEqual(['a', 'b', 'c', 'd']);
  });

  it('nextTracks devolve as trilhas que dependem da trilha, na ordem do catálogo', () => {
    const tracks = [
      make('react', { areas: ['frontend'] }),
      make('nextjs', { areas: ['frontend'], prerequisites: ['react'] }),
      make('web', { areas: ['fundamentos'] }),
      make('react-native', { areas: ['mobile'], prerequisites: ['react'] }),
    ];
    expect(ids(nextTracks(tracks, 'react'))).toEqual(['nextjs', 'react-native']);
    expect(nextTracks(tracks, 'web')).toEqual([]);
  });
});
