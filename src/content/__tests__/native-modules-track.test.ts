/**
 * @jest-environment node
 */
import { describeContentTracks, framework } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'módulos nativos',
  after: 'performance-no-nextjs',
  snippetLanguages: ['ts', 'js', 'json', 'bash', 'text'],
  tracks: [
    {
      id: 'modulos-nativos-no-expo',
      title: 'Módulos nativos no Expo',
      areas: ['mobile'],
      placement: framework('javascript', 'react-native'),
      decks: ['expo-go-e-development-build', 'integracoes-nativas', 'criar-e-manter-modulos'],
    },
  ],
});
