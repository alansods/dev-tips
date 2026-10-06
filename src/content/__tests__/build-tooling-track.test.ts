/**
 * @jest-environment node
 */
import { core, describeContentTracks } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'build e bundlers',
  after: 'estilizacao-e-design-system',
  snippetLanguages: ['ts', 'js', 'json', 'bash'],
  tracks: [
    {
      id: 'build-e-bundlers',
      title: 'Build e bundlers',
      areas: ['frontend', 'mobile'],
      placement: core('javascript'),
      decks: ['transpilacao', 'bundlers-na-web', 'metro-e-eas'],
    },
  ],
});
