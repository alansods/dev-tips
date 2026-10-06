/**
 * @jest-environment node
 */
import { describeContentTracks, framework } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'performance no Next.js',
  after: 'pagamentos-no-app',
  snippetLanguages: ['ts', 'bash'],
  tracks: [
    {
      id: 'performance-no-nextjs',
      title: 'Performance no Next.js',
      areas: ['frontend'],
      placement: framework('javascript', 'nextjs'),
      decks: ['estrategias-de-renderizacao', 'imagens-fontes-e-javascript', 'core-web-vitals'],
    },
  ],
});
