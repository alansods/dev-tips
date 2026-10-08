/**
 * @jest-environment node
 */
import { describeContentTracks, framework } from '../__fixtures__/languageTracks';
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
      decks: ['componentes-e-estilo', 'navegacao-e-expo', 'performance-e-publicacao'],
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
