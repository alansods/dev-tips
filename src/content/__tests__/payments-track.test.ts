/**
 * @jest-environment node
 */
import { describeContentTracks, framework } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'pagamentos',
  after: 'git-e-colaboracao',
  snippetLanguages: ['ts', 'bash'],
  tracks: [
    {
      id: 'pagamentos-no-app',
      title: 'Pagamentos no app',
      areas: ['mobile'],
      placement: framework('javascript', 'react-native'),
      decks: ['compras-dentro-do-app', 'iap-no-expo', 'pagamentos-e-backend'],
    },
  ],
});
