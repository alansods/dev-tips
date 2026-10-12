/**
 * @jest-environment node
 */
import { core, describeContentTracks, framework } from '../__fixtures__/languageTracks';
import { getTrack } from '../catalog';

const js = core('javascript');

describeContentTracks({
  group: 'JavaScript',
  after: 'fundamentos-web',
  snippetLanguages: ['js', 'bash', 'text'],
  tracks: [
    {
      id: 'javascript-essencial',
      title: 'JavaScript essencial',
      areas: ['frontend', 'backend'],
      placement: js,
      decks: ['tipos-e-variaveis', 'funcoes-e-escopo', 'objetos-e-prototipos'],
    },
    {
      id: 'javascript-assincrono',
      title: 'JavaScript assíncrono',
      areas: ['frontend', 'backend'],
      placement: js,
      decks: ['event-loop', 'promises', 'async-await', 'combinadores-de-promise'],
    },
    {
      id: 'javascript-no-navegador',
      title: 'JavaScript no navegador',
      areas: ['frontend'],
      placement: js,
      decks: ['dom', 'eventos', 'rede-e-armazenamento'],
    },
    { id: 'nodejs', title: 'Node.js', areas: ['backend'], placement: js, decks: ['runtime', 'modulos-e-npm', 'streams-e-processos'] },
    {
      id: 'react',
      title: 'React',
      areas: ['frontend'],
      placement: framework('javascript', 'react'),
      decks: ['componentes-e-jsx', 'hooks', 'renderizacao-e-performance'],
    },
    {
      id: 'vue',
      title: 'Vue',
      areas: ['frontend'],
      placement: framework('javascript', 'vue'),
      decks: ['reatividade', 'componentes', 'router-e-pinia'],
    },
    {
      id: 'nextjs',
      title: 'Next.js',
      areas: ['frontend'],
      placement: framework('javascript', 'nextjs'),
      decks: ['roteamento', 'renderizacao', 'dados-e-api'],
    },
    {
      id: 'express',
      title: 'Express',
      areas: ['backend'],
      placement: framework('javascript', 'express'),
      decks: ['rotas-e-middlewares', 'requisicao-e-resposta', 'erros-e-organizacao'],
    },
  ],
});

describe('Requirement: Decks das trilhas de JavaScript', () => {
  const track = getTrack('javascript-assincrono')!;
  const deck = () => track.decks.find((d) => d.id === 'combinadores-de-promise')!;
  const concepts = () => deck().cards.flatMap((c) => (c.type === 'concept' ? [c] : []));

  it('Um card por combinador', () => {
    expect(deck().title).toBe('Combinadores de Promise');
    expect(concepts().map((c) => c.term)).toEqual(['Promise.all', 'Promise.allSettled', 'Promise.race', 'Promise.any']);
    expect(concepts().find((c) => c.term === 'Promise.any')!.definition).toContain('AggregateError');
  });

  it('Resumo ligado ao deck novo', () => {
    const summary = track.decks.flatMap((d) => d.cards).find((c) => c.id === 'combinadores')!;
    expect(summary.relatedTerms).toEqual(expect.arrayContaining(concepts().map((c) => c.id)));
  });
});
