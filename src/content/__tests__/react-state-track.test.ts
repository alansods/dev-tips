/**
 * @jest-environment node
 */
import { describeContentTracks, framework } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'estado e dados',
  after: 'deploy-na-aws',
  snippetLanguages: ['ts', 'bash'],
  tracks: [
    {
      id: 'estado-e-dados-no-react',
      title: 'Estado e dados no React',
      areas: ['frontend', 'mobile'],
      placement: framework('javascript', 'react'),
      decks: ['estado-global', 'dados-do-servidor', 'hooks-personalizados'],
    },
  ],
});
