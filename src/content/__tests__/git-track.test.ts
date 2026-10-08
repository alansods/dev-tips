/**
 * @jest-environment node
 */
import { describeContentTracks, direct } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'Git',
  after: 'build-e-bundlers',
  snippetLanguages: ['bash', 'text'],
  tracks: [
    {
      id: 'git-e-colaboracao',
      title: 'Git e colaboração',
      areas: ['git'],
      placement: direct,
      decks: ['modelo-do-git', 'fluxo-em-equipe', 'resolver-problemas'],
    },
  ],
});
