/**
 * @jest-environment node
 */
import { describeContentTracks, framework } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'testes no frontend',
  after: 'estado-e-dados-no-react',
  snippetLanguages: ['ts', 'bash'],
  tracks: [
    {
      id: 'testes-no-frontend',
      title: 'Testes no frontend',
      areas: ['frontend', 'mobile'],
      placement: framework('javascript', 'react'),
      decks: ['jest', 'testing-library', 'testes-de-integracao'],
    },
  ],
});
