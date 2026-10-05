/**
 * @jest-environment node
 */
import { catalog, getTrack } from '../catalog';
import { LEVELS, placementOf, type Track } from '../index';

const TRACKS = [
  ['javascript-essencial', 'JavaScript essencial', ['frontend', 'backend'], undefined],
  ['javascript-assincrono', 'JavaScript assíncrono', ['frontend', 'backend'], undefined],
  ['javascript-no-navegador', 'JavaScript no navegador', ['frontend'], undefined],
  ['nodejs', 'Node.js', ['backend'], undefined],
  ['react', 'React', ['frontend'], 'react'],
  ['vue', 'Vue', ['frontend'], 'vue'],
  ['nextjs', 'Next.js', ['frontend'], 'nextjs'],
  ['express', 'Express', ['backend'], 'express'],
] as const;

const DECKS: Record<string, string[]> = {
  'javascript-essencial': ['tipos-e-variaveis', 'funcoes-e-escopo', 'objetos-e-prototipos'],
  'javascript-assincrono': ['event-loop', 'promises', 'async-await'],
  'javascript-no-navegador': ['dom', 'eventos', 'rede-e-armazenamento'],
  nodejs: ['runtime', 'modulos-e-npm', 'streams-e-processos'],
  react: ['componentes-e-jsx', 'hooks', 'renderizacao-e-performance'],
  vue: ['reatividade', 'componentes', 'router-e-pinia'],
  nextjs: ['roteamento', 'renderizacao', 'dados-e-api'],
  express: ['rotas-e-middlewares', 'requisicao-e-resposta', 'erros-e-organizacao'],
};

const IDS = TRACKS.map(([id]) => id);
const track = (id: string): Track => {
  const t = getTrack(id);
  if (!t) throw new Error(`trilha ${id} não registrada`);
  return t;
};
const cards = (id: string) => track(id).decks.flatMap((d) => d.cards);

describe('Requirement: Trilhas de JavaScript no catálogo', () => {
  it('Trilhas registradas', () => {
    expect(catalog.map((t) => t.id)).toEqual(['crud-4-frameworks', 'fundamentos-web', ...IDS]);
  });

  it.each(TRACKS)('%s: título, áreas e posição', (id, title, areas, framework) => {
    const t = track(id);
    expect(t.title).toBe(title);
    expect(t.areas).toEqual(areas);
    expect(placementOf(t)).toEqual(
      framework ? { kind: 'framework', language: 'javascript', framework } : { kind: 'language', language: 'javascript' },
    );
  });
});

describe('Requirement: Decks das trilhas de JavaScript', () => {
  it.each(IDS)('Contagem por deck: %s', (id) => {
    const t = track(id);
    expect(t.decks.map((d) => d.id)).toEqual([...DECKS[id], 'perguntas-de-entrevista']);
    expect(t.decks.map((d) => d.cards.length)).toEqual([6, 6, 6, 6]);
    expect(t.decks[3].title).toBe('Perguntas de entrevista');
    expect(new Set(t.decks[3].cards.map((c) => c.type))).toEqual(new Set(['question']));
    for (const deck of t.decks.slice(0, 3)) {
      expect(deck.cards.every((c) => c.type === 'concept' || c.type === 'code')).toBe(true);
    }
  });

  it.each(IDS)('Conceitos em todo deck de conteúdo: %s', (id) => {
    for (const deck of track(id).decks.slice(0, 3)) {
      expect(deck.cards.filter((c) => c.type === 'concept').length).toBeGreaterThanOrEqual(2);
    }
  });

  it.each(IDS)('snippets em js, bash ou text: %s', (id) => {
    for (const card of cards(id)) {
      const snippet = card.type === 'code' ? card.snippet : card.type === 'question' ? card.snippet : undefined;
      if (snippet) expect(['js', 'bash', 'text']).toContain(snippet.language);
    }
  });
});

describe('Requirement: Qualidade do conteúdo de JavaScript', () => {
  it.each(IDS)('Sem complementos: %s', (id) => {
    expect(cards(id).filter((c) => c.origin === 'supplement')).toEqual([]);
  });

  it.each(IDS)('Todos os cards ligados: %s', (id) => {
    expect(cards(id).filter((c) => c.relatedTerms.length === 0).map((c) => c.id)).toEqual([]);
  });

  it.each(IDS)('Mistura de níveis: %s', (id) => {
    const levels = new Set(cards(id).map((c) => c.level));
    for (const level of LEVELS) expect(levels).toContain(level);
  });
});
