/**
 * @jest-environment node
 */
import { describeContentTracks, framework } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'estilização e design system',
  after: 'testes-no-frontend',
  snippetLanguages: ['ts', 'bash', 'text'],
  tracks: [
    {
      id: 'estilizacao-e-design-system',
      title: 'Estilização e design system',
      areas: ['frontend', 'mobile'],
      placement: framework('javascript', 'react'),
      decks: ['tailwind-e-nativewind', 'design-system', 'acessibilidade'],
    },
  ],
});
