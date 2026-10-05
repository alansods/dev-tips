/**
 * @jest-environment node
 */
import { core, describeContentTracks, framework } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'Python',
  after: 'spring-boot',
  snippetLanguages: ['python', 'bash'],
  tracks: [
    {
      id: 'python-essencial',
      title: 'Python essencial',
      areas: ['backend'],
      placement: core('python'),
      decks: ['tipos-e-colecoes', 'funcoes-e-decorators', 'generators-e-ambiente'],
    },
    {
      id: 'fastapi',
      title: 'FastAPI',
      areas: ['backend'],
      placement: framework('python', 'fastapi'),
      decks: ['rotas-e-pydantic', 'dependencias-e-async', 'erros-seguranca-e-testes'],
    },
    {
      id: 'django',
      title: 'Django',
      areas: ['backend'],
      placement: framework('python', 'django'),
      decks: ['orm-e-migrations', 'views-e-urls', 'drf-e-admin'],
    },
  ],
});
