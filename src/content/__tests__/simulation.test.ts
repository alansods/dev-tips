import { validateCatalog, type InterviewCard } from '../index';
import { cardAt, conceptCard, interviewCard, minimalTrack, simulationTrack, snippet } from '../__fixtures__/tracks';
import { expectErrorAt, trackOf } from '../__fixtures__/expect';
import { AREA_ADDED_AT, isSimulation } from '../schema';

describe('Requirement: Simulação de entrevista', () => {
  it('Simulação válida', () => {
    const sim = trackOf(simulationTrack());
    expect(sim.kind).toBe('simulation');
    expect(isSimulation(sim)).toBe(true);
    expect(sim.scenario).toEqual({ context: 'O dashboard passou a demorar 8 segundos.', stack: ['Next.js', 'Node.js', 'PostgreSQL'] });
  });

  it('Kind omitido', () => {
    const track = trackOf(minimalTrack());
    expect(track.kind).toBe('track');
    expect(isSimulation(track)).toBe(false);
  });

  it('Kind desconhecido', () => {
    expectErrorAt(simulationTrack({ kind: 'quiz' }), 'kind');
  });

  it('Simulação sem caso', () => {
    expectErrorAt(simulationTrack({ scenario: undefined }), 'scenario');
  });

  it('Stack vazia', () => {
    expectErrorAt(simulationTrack({ scenario: { context: 'Caso.', stack: [] } }), 'scenario.stack');
  });

  it('Simulação com dois decks', () => {
    const sim = simulationTrack();
    sim.decks.push({ id: 'outro', title: 'Outro', cards: [interviewCard('outra')] });
    expectErrorAt(sim, 'decks');
  });

  it('Simulação em outra área', () => {
    expectErrorAt(simulationTrack({ areas: ['simulacoes', 'backend'] }), 'areas');
  });

  it('Simulação com card de outro tipo', () => {
    const sim = simulationTrack();
    sim.decks[0].cards.push(conceptCard());
    expectErrorAt(sim, 'decks[0].cards[2]');
  });

  it('Simulação com linguagem', () => {
    expectErrorAt(simulationTrack({ language: 'javascript' }), 'language');
  });

  it('simulação sem pré-requisitos, seção nem variants', () => {
    expectErrorAt(simulationTrack({ prerequisites: ['outra'] }), 'prerequisites');
    expectErrorAt(simulationTrack({ section: 'aws' }), 'section');
    expectErrorAt(simulationTrack({ variants: [{ id: 'express', name: 'Express', language: 'TypeScript' }] }), 'variants');
  });

  it('Trilha na área Simulações', () => {
    expectErrorAt({ ...minimalTrack(), areas: ['simulacoes'] }, 'areas');
  });

  it('Trilha com caso', () => {
    expectErrorAt({ ...minimalTrack(), scenario: { context: 'Caso.', stack: ['Node.js'] } }, 'scenario');
  });

  it('Simulação como pré-requisito', () => {
    const result = validateCatalog([simulationTrack({ id: 'sim-dashboard-lento' }), { ...minimalTrack(), id: 'react', prerequisites: ['sim-dashboard-lento'] }]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toContainEqual(expect.objectContaining({ path: '[1].prerequisites[0]' }));
  });
});

describe('Requirement: Card interview', () => {
  const withCard = (extra: Record<string, unknown>) => {
    const sim = simulationTrack();
    sim.decks[0].cards[0] = interviewCard('investigar', extra);
    return sim;
  };

  it('Interview completo', () => {
    const sim = trackOf(
      withCard({ why: 'Busca a causa raiz.', watchOut: 'Índice tem custo.', snippet: snippet('EXPLAIN ANALYZE SELECT 1;', { language: 'sql' }) }),
    );
    const card = cardAt(sim, 0, 0) as InterviewCard;
    expect(card.why).toBe('Busca a causa raiz.');
    expect(card.watchOut).toBe('Índice tem custo.');
    expect(card.snippet?.language).toBe('sql');
  });

  it('Interview mínimo', () => {
    const card = cardAt(trackOf(simulationTrack()), 0, 0) as InterviewCard;
    expect(card.why).toBeUndefined();
    expect(card.origin).toBe('original');
  });

  it('Interview sem resposta', () => {
    expectErrorAt(withCard({ answer: '' }), 'decks[0].cards[0].answer');
  });

  it('Atenção vazia', () => {
    expectErrorAt(withCard({ watchOut: '  ' }), 'decks[0].cards[0].watchOut');
  });

  it('Interview numa trilha', () => {
    const track = minimalTrack();
    track.decks[0].cards.push(interviewCard());
    expectErrorAt(track, 'decks[0].cards[1]');
  });
});

describe('Requirement: Áreas da trilha (Simulações)', () => {
  it('Área Simulações', () => {
    expect(trackOf(simulationTrack()).areas).toEqual(['simulacoes']);
  });

  it('Data de inclusão das áreas', () => {
    expect(AREA_ADDED_AT).toEqual({ simulacoes: '2026-10-09' });
  });
});
