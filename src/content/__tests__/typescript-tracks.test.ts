/**
 * @jest-environment node
 */
import { core, describeContentTracks, framework } from '../__fixtures__/languageTracks';

const ts = core('typescript');

describeContentTracks({
  group: 'TypeScript',
  after: 'express',
  snippetLanguages: ['ts', 'json', 'bash'],
  tracks: [
    {
      id: 'typescript-essencial',
      title: 'TypeScript essencial',
      areas: ['frontend', 'backend'],
      placement: ts,
      decks: ['tipos-basicos', 'objetos-e-interfaces', 'unions-e-narrowing'],
    },
    {
      id: 'typescript-avancado',
      title: 'TypeScript avançado',
      areas: ['frontend', 'backend'],
      placement: ts,
      decks: ['generics', 'utility-types', 'tipos-mapeados-e-condicionais'],
    },
    {
      id: 'angular',
      title: 'Angular',
      areas: ['frontend'],
      placement: framework('typescript', 'angular'),
      decks: ['componentes-e-templates', 'di-e-servicos', 'rxjs-e-signals'],
    },
    {
      id: 'nestjs',
      title: 'NestJS',
      areas: ['backend'],
      placement: framework('typescript', 'nest'),
      decks: ['modulos-e-providers', 'controllers-e-pipes', 'guards-e-interceptors'],
    },
  ],
});
