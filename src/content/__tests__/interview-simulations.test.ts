/**
 * @jest-environment node
 */
import { catalog, getTrack } from '../catalog';
import { isSimulation, type InterviewCard, type Track } from '../index';
import { localizeTrack, missingTranslations, type TrackTranslation } from '../translation';
import { translationRegistry } from '../translations';

const SIMULATIONS: [id: string, title: string, cards: number][] = [
  ['sim-dashboard-lento', 'Dashboard lento: de 8 s para menos de 2', 5],
  ['sim-pedidos-duplicados', 'Pedido e pagamento em dobro', 4],
  ['sim-projetos-e-permissoes', 'Projetos, membros e permissões', 4],
  ['sim-arquivos-em-segundo-plano', 'Processamento de arquivos em segundo plano', 4],
  ['sim-funcionalidade-com-ia', 'Resumos de PDF com IA', 4],
  ['sim-api-de-notificacoes', 'API de notificações', 4],
];
const SENIOR = ['timeout-no-provedor', 'evoluir-a-arquitetura', 'banco-e-fila', 'provar-o-valor', 'notificacoes-duplicadas'];

const simulation = (id: string): Track => {
  const t = getTrack(id);
  if (!t) throw new Error(`simulação ${id} não registrada`);
  return t;
};
const ids = SIMULATIONS.map(([id]) => id);
const english = (id: string) => translationRegistry[id]?.en as TrackTranslation | undefined;
const allCards = () => ids.flatMap((id) => simulation(id).decks[0].cards as InterviewCard[]);

describe('Requirement: Simulações do catálogo', () => {
  it('Simulações na ordem', () => {
    expect(catalog.slice(-ids.length).map((t) => t.id)).toEqual(ids);
    expect(catalog.filter(isSimulation).map((t) => t.id)).toEqual(ids);
  });

  it.each(SIMULATIONS)('Quantidade de cards: %s', (id, title, count) => {
    const sim = simulation(id);
    expect(sim.title).toBe(title);
    expect(sim.addedAt).toBe('2026-10-09');
    expect(sim.decks.map((d) => [d.id, d.title])).toEqual([['conversa', 'Conversa']]);
    expect(sim.decks[0].cards).toHaveLength(count);
  });

  it('25 cards no total', () => {
    expect(allCards()).toHaveLength(25);
  });
});

describe('Requirement: Card faz sentido sozinho', () => {
  it.each(ids)('Contexto curto: %s', (id) => {
    const sim = simulation(id);
    expect(sim.scenario!.context.length).toBeLessThanOrEqual(280);
    expect(localizeTrack(sim, english(id)).scenario!.context.length).toBeLessThanOrEqual(280);
  });

  it('Pergunta de aprofundamento', () => {
    const card = simulation('sim-pedidos-duplicados').decks[0].cards.find((c) => c.id === 'timeout-no-provedor') as InterviewCard;
    expect(card.question).toMatch(/provedor/i);
    expect(card.question).toMatch(/timeout/i);
  });
});

describe('Requirement: Qualidade das simulações', () => {
  it('Origem e níveis', () => {
    for (const card of allCards()) {
      expect(card.origin).toBe('original');
      expect(['pleno', 'senior']).toContain(card.level);
    }
    expect(allCards().filter((c) => c.level === 'senior').map((c) => c.id).sort()).toEqual([...SENIOR].sort());
  });

  it('Verso com explicação', () => {
    for (const card of allCards()) expect(card.why ?? card.watchOut).toBeTruthy();
  });

  it('Linguagens dos snippets', () => {
    const languages = allCards().flatMap((c) => (c.snippet ? [c.snippet.language] : []));
    expect(languages.length).toBeGreaterThan(0);
    for (const language of languages) expect(['sql', 'text']).toContain(language);
  });
});

describe('Requirement: Tradução das simulações', () => {
  it.each(ids)('Cobertura completa: %s', (id) => {
    const tr = english(id);
    expect(tr).toBeDefined();
    expect(missingTranslations(simulation(id), tr!)).toEqual([]);
  });

  it('Simulação em inglês', () => {
    expect(localizeTrack(simulation('sim-dashboard-lento'), english('sim-dashboard-lento')).title).toBe(
      'Slow dashboard: from 8 s to under 2',
    );
  });
});
