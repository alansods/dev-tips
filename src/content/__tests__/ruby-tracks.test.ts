/**
 * @jest-environment node
 */
import { getTrack } from '../catalog';
import { core, describeContentTracks, framework } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'Ruby',
  after: 'aspnet-core',
  snippetLanguages: ['ruby', 'yaml', 'bash'],
  tracks: [
    {
      id: 'ruby-essencial',
      title: 'Ruby essencial',
      areas: ['backend'],
      placement: core('ruby'),
      decks: ['objetos-e-simbolos', 'blocos-e-enumerable', 'modulos-e-metaprogramacao'],
    },
    {
      id: 'rails',
      title: 'Ruby on Rails',
      areas: ['backend'],
      placement: framework('ruby', 'rails'),
      decks: ['mvc-e-convencoes', 'active-record', 'jobs-testes-e-seguranca'],
    },
  ],
});

it('pré-requisitos das trilhas de Ruby', () => {
  expect(getTrack('ruby-essencial')?.prerequisites).toEqual(['fundamentos-de-programacao']);
  expect(getTrack('rails')?.prerequisites).toEqual(['ruby-essencial']);
});
