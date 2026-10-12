/**
 * @jest-environment node
 */
import { catalog, getTrack } from '../catalog';
import { isSimulation, type InterviewCard, type Track } from '../index';
import { localizeTrack, missingTranslations, type TrackTranslation } from '../translation';
import { translationRegistry } from '../translations';

const SIMULATIONS: [id: string, title: string, cards: number, addedAt: string][] = [
  ['sim-dashboard-lento', 'Dashboard lento: de 8 s para menos de 2', 5, '2026-10-09'],
  ['sim-pedidos-duplicados', 'Pedido e pagamento em dobro', 4, '2026-10-09'],
  ['sim-projetos-e-permissoes', 'Projetos, membros e permissões', 4, '2026-10-09'],
  ['sim-arquivos-em-segundo-plano', 'Processamento de arquivos em segundo plano', 4, '2026-10-09'],
  ['sim-funcionalidade-com-ia', 'Resumos de PDF com IA', 4, '2026-10-09'],
  ['sim-api-de-notificacoes', 'API de notificações', 4, '2026-10-09'],
  ['sim-cep-com-fallback', 'CEP com três APIs', 5, '2026-10-12'],
];
const SENIOR = [
  'timeout-no-provedor',
  'evoluir-a-arquitetura',
  'banco-e-fila',
  'provar-o-valor',
  'notificacoes-duplicadas',
  'cancelar-e-timeout',
  'mover-para-o-backend',
];

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

  it.each(SIMULATIONS)('Quantidade de cards: %s', (id, title, count, addedAt) => {
    const sim = simulation(id);
    expect(sim.title).toBe(title);
    expect(sim.addedAt).toBe(addedAt);
    expect(sim.decks.map((d) => [d.id, d.title])).toEqual([['conversa', 'Conversa']]);
    expect(sim.decks[0].cards).toHaveLength(count);
  });

  it('30 cards no total', () => {
    expect(allCards()).toHaveLength(30);
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
    for (const language of languages) expect(['sql', 'text', 'ts']).toContain(language);
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

describe('Requirement: Simulação de CEP com três APIs', () => {
  const cards = () => simulation('sim-cep-com-fallback').decks[0].cards as InterviewCard[];

  it('Cards na ordem', () => {
    expect(cards().map((c) => [c.id, c.level])).toEqual([
      ['tres-apis-de-cep', 'pleno'],
      ['race-ou-any', 'pleno'],
      ['cep-inexistente', 'pleno'],
      ['cancelar-e-timeout', 'senior'],
      ['mover-para-o-backend', 'senior'],
    ]);
  });

  it('Pergunta com a nova condição', () => {
    const card = cards().find((c) => c.id === 'cep-inexistente')!;
    expect(card.question).toContain('200');
    expect(card.question).toContain('"erro": true');
  });

  it('Snippet de fallback', () => {
    const snippet = cards().find((c) => c.id === 'tres-apis-de-cep')!.snippet;
    expect(snippet?.language).toBe('ts');
    expect(snippet?.code).toContain('Promise.any');
  });

  it('Simulação em inglês', () => {
    expect(localizeTrack(simulation('sim-cep-com-fallback'), english('sim-cep-com-fallback')).title).toBe(
      'CEP lookup with three APIs',
    );
  });
});
