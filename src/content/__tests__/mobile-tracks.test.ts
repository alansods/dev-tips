/**
 * @jest-environment node
 */
import { describeContentTracks, framework } from '../__fixtures__/languageTracks';
import { getTrack } from '../catalog';
import { repoTaxonomy } from '../repoTaxonomy';

describeContentTracks({
  group: 'React Native',
  after: 'nosql',
  snippetLanguages: ['ts', 'bash', 'json'],
  tracks: [
    {
      id: 'react-native',
      title: 'React Native',
      areas: ['mobile'],
      placement: framework('javascript', 'react-native'),
      decks: ['componentes-e-estilo', 'navegacao-e-expo', 'performance-e-publicacao', 'rotas-privadas'],
    },
  ],
});

describe('Requirement: Trilha de React Native no catálogo (cadastro)', () => {
  it('framework React Native em JavaScript, depois de NestJS', () => {
    const ids = repoTaxonomy.frameworks.map((f) => f.id);
    expect(repoTaxonomy.frameworks.find((f) => f.id === 'react-native')).toMatchObject({
      id: 'react-native',
      name: 'React Native',
      language: 'javascript',
    });
    expect(ids.indexOf('react-native')).toBe(ids.indexOf('nest') + 1);
  });
});

describe('Requirement: Decks da trilha de React Native', () => {
  const snippets = () =>
    (getTrack('react-native')!.decks.find((d) => d.id === 'rotas-privadas')?.cards ?? []).flatMap((c) =>
      c.type === 'code' ? [c.snippet] : [],
    );

  it('Rotas protegidas com Expo Router', () => {
    const layouts = snippets().filter((s) => s.file.endsWith('_layout.tsx'));
    expect(layouts.some((s) => s.code.includes('Stack.Protected') && s.code.includes('guard'))).toBe(true);
    expect(snippets().some((s) => s.code.includes('expo-secure-store'))).toBe(true);
  });
});
