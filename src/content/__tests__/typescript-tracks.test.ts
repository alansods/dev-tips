/**
 * @jest-environment node
 */
import { core, describeContentTracks, framework } from '../__fixtures__/languageTracks';
import { getTrack } from '../catalog';
import { repoTaxonomy } from '../repoTaxonomy';

// TypeScript fica dentro de JavaScript: linguagem pura e frameworks juntos.
const ts = core('javascript');

describeContentTracks({
  group: 'TypeScript',
  after: 'express',
  snippetLanguages: ['ts', 'json', 'bash'],
  tracks: [
    {
      id: 'typescript-essencial',
      title: 'TypeScript essencial',
      areas: ['frontend', 'backend'],
      placement: ts,
      decks: ['tipos-basicos', 'objetos-e-interfaces', 'unions-e-narrowing', 'enums'],
    },
    {
      id: 'typescript-avancado',
      title: 'TypeScript avançado',
      areas: ['frontend', 'backend'],
      placement: ts,
      decks: ['generics', 'utility-types', 'tipos-mapeados-e-condicionais'],
    },
    {
      id: 'angular',
      title: 'Angular',
      areas: ['frontend'],
      placement: framework('javascript', 'angular'),
      decks: ['componentes-e-templates', 'di-e-servicos', 'rxjs-e-signals'],
    },
    {
      id: 'nestjs',
      title: 'NestJS',
      areas: ['backend'],
      placement: framework('javascript', 'nest'),
      decks: ['modulos-e-providers', 'controllers-e-pipes', 'guards-e-interceptors'],
    },
  ],
});

describe('Requirement: Trilhas de TypeScript no catálogo', () => {
  it('Sem linguagem TypeScript no cadastro', () => {
    expect(repoTaxonomy.languages.map((l) => l.id)).not.toContain('typescript');
    const language = (id: string) => repoTaxonomy.frameworks.find((f) => f.id === id)?.language;
    expect([language('angular'), language('nest')]).toEqual(['javascript', 'javascript']);
    const ids = repoTaxonomy.frameworks.map((f) => f.id);
    expect(ids.slice(ids.indexOf('express'), ids.indexOf('express') + 3)).toEqual(['express', 'angular', 'nest']);
  });
});

describe('Requirement: Decks das trilhas de TypeScript', () => {
  const track = getTrack('typescript-essencial')!;
  const cards = track.decks.flatMap((d) => d.cards);

  it('Deck de enums', () => {
    const deck = track.decks[3];
    expect(deck.id).toBe('enums');
    expect(deck.title).toBe('Enums e alternativas');
    expect(track.decks[4].id).toBe('perguntas-de-entrevista');
    const snippets = deck.cards.flatMap((c) => (c.type === 'code' ? [c.snippet.code] : []));
    expect(snippets.some((code) => code.includes('as const'))).toBe(true);
  });

  it('Enum ligado ao deck novo', () => {
    const enumsConcepts = track.decks[3].cards.filter((c) => c.type === 'concept').map((c) => c.id);
    const card = cards.find((c) => c.id === 'enum')!;
    expect(card.relatedTerms.some((id) => enumsConcepts.includes(id))).toBe(true);
  });
});
