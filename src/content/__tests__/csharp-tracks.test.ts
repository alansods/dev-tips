/**
 * @jest-environment node
 */
import { getTrack } from '../catalog';
import { core, describeContentTracks, framework } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'C#',
  after: 'django',
  snippetLanguages: ['csharp', 'json', 'bash'],
  tracks: [
    {
      id: 'csharp-essencial',
      title: 'C# essencial',
      areas: ['backend'],
      placement: core('csharp'),
      decks: ['tipos-e-runtime', 'linq-e-colecoes', 'async-e-recursos'],
    },
    {
      id: 'aspnet-core',
      title: 'ASP.NET Core',
      areas: ['backend'],
      placement: framework('csharp', 'aspnet'),
      decks: ['pipeline-e-di', 'ef-core', 'web-e-seguranca'],
    },
  ],
});

it('pré-requisitos das trilhas de C#', () => {
  expect(getTrack('csharp-essencial')?.prerequisites).toEqual(['fundamentos-web']);
  expect(getTrack('aspnet-core')?.prerequisites).toEqual(['csharp-essencial']);
});
