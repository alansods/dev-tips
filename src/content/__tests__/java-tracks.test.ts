/**
 * @jest-environment node
 */
import { core, describeContentTracks, framework } from '../__fixtures__/languageTracks';

describeContentTracks({
  group: 'Java',
  after: 'nestjs',
  snippetLanguages: ['java', 'properties', 'yaml', 'xml', 'bash'],
  tracks: [
    {
      id: 'java-essencial',
      title: 'Java essencial',
      areas: ['backend'],
      placement: core('java'),
      decks: ['jvm-e-tipos', 'orientacao-a-objetos', 'excecoes-e-igualdade'],
    },
    {
      id: 'java-colecoes-e-concorrencia',
      title: 'Java: coleções, streams e concorrência',
      areas: ['backend'],
      placement: core('java'),
      decks: ['colecoes', 'streams-e-lambdas', 'concorrencia'],
    },
    {
      id: 'spring-boot',
      title: 'Spring Boot',
      areas: ['backend'],
      placement: framework('java', 'spring'),
      decks: ['ioc-e-configuracao', 'dados-e-transacoes', 'web-e-seguranca'],
    },
  ],
});
