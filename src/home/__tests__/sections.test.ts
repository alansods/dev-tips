import { getCatalog, getTrack } from '../../content/catalog';
import { progressKey, type Progress } from '../../study/rules';
import { nextSchedule, type Schedule } from '../../study/srs';
import {
  continueTarget,
  firstName,
  greetingPeriod,
  inProgressTracks,
  lastSevenDays,
  newTracks,
  reviewSummary,
  startHere,
  suggestions,
} from '../sections';

const catalog = getCatalog('pt-BR');
const ids = (tracks: readonly { id: string }[]) => tracks.map((t) => t.id);
const cards = (trackId: string) => getTrack(trackId)!.decks.flatMap((d) => d.cards.map((c) => c.id));
const known = (trackId: string, cardIds: string[]): Progress =>
  Object.fromEntries(cardIds.map((id) => [progressKey(trackId, id), 'known' as const]));
/** Agenda os cards como "não sabia" no dia: vencem no próprio dia. */
const due = (trackId: string, cardIds: string[], day: string): Schedule =>
  Object.fromEntries(cardIds.map((id) => [progressKey(trackId, id), nextSchedule(undefined, 'unknown', day)]));
const TODAY = '2026-10-07';

describe('Requirement: Saudação', () => {
  it('período pelo horário', () => {
    expect(greetingPeriod(5)).toBe('morning');
    expect(greetingPeriod(11)).toBe('morning');
    expect(greetingPeriod(12)).toBe('afternoon');
    expect(greetingPeriod(17)).toBe('afternoon');
    expect(greetingPeriod(18)).toBe('evening');
    expect(greetingPeriod(4)).toBe('evening');
  });

  it('primeiro nome', () => {
    expect(firstName('Ana Souza')).toBe('Ana');
    expect(firstName('  ')).toBeUndefined();
    expect(firstName(null)).toBeUndefined();
  });
});

describe('Requirement: Revisão de hoje no Início', () => {
  it('Com revisão', () => {
    const schedule = {
      ...due('crud-4-frameworks', cards('crud-4-frameworks').slice(0, 3), TODAY),
      ...due('fundamentos-web', cards('fundamentos-web').slice(0, 2), TODAY),
    };
    const summary = reviewSummary(catalog, schedule, TODAY);
    expect(summary.total).toBe(5);
    expect(summary.tracks.map((t) => [t.track.id, t.count])).toEqual([
      ['crud-4-frameworks', 3],
      ['fundamentos-web', 2],
    ]);
    expect(summary.minutes).toBe(3);
  });

  it('Revisão em dia', () => {
    const schedule = due('react', cards('react').slice(0, 4), '2026-10-08');
    const summary = reviewSummary(catalog, schedule, TODAY);
    expect(summary.total).toBe(0);
    expect(summary.tomorrow).toBe(4);
  });
});

describe('Requirement: Continue de onde parou', () => {
  it('Último deck estudado', () => {
    const crud = getTrack('crud-4-frameworks')!;
    const deck = crud.decks[2];
    const target = continueTarget(catalog, { trackId: crud.id, cardId: deck.cards[0].id }, {})!;
    expect(target.track.id).toBe(crud.id);
    expect(target.deck.id).toBe(deck.id);
    expect([target.position, target.deckCount]).toEqual([3, crud.decks.length]);
    expect(target.stats.total).toBe(deck.cards.length);
  });

  it('sem última resposta ou card que não existe mais', () => {
    expect(continueTarget(catalog, null, {})).toBeNull();
    expect(continueTarget(catalog, { trackId: 'react', cardId: 'sumiu' }, {})).toBeNull();
  });

  it('Também em andamento', () => {
    const progress = { ...known('crud-4-frameworks', ['api']), ...known('fundamentos-web', ['http']) };
    const list = inProgressTracks(catalog, progress, 'crud-4-frameworks');
    expect(list.map((i) => i.track.id)).toEqual(['fundamentos-web']);
    expect(list[0].percent).toBeGreaterThan(0);
  });

  it('trilha concluída não está em andamento', () => {
    const progress = known('fundamentos-web', cards('fundamentos-web'));
    expect(inProgressTracks(catalog, progress)).toEqual([]);
  });
});

describe('Requirement: Próximo passo', () => {
  it('Depois de React', () => {
    const result = suggestions(catalog, known('react', ['componente']), 'react', [])!;
    expect(result.kind).toBe('next');
    if (result.kind !== 'next') return;
    expect(result.after.id).toBe('react');
    expect(result.tracks.length).toBeLessThanOrEqual(3);
    expect(ids(result.tracks)).toContain('estado-e-dados-no-react');
  });

  it('Sem próximas trilhas', () => {
    const result = suggestions(catalog, {}, 'performance-no-nextjs', ['backend'])!;
    expect(result.kind).toBe('forYou');
    expect(result.tracks.length).toBeGreaterThan(0);
    for (const track of result.tracks) expect(track.areas).toContain('backend');
  });

  it('próximas já iniciadas ficam de fora', () => {
    const progress = { ...known('react', ['componente']), ...known('nextjs', cards('nextjs').slice(0, 1)) };
    const result = suggestions(catalog, progress, 'react', [])!;
    expect(result.kind).toBe('next');
    expect(ids(result.tracks)).not.toContain('nextjs');
  });

  it('sem interesse, sugere da área Fundamentos', () => {
    const result = suggestions(catalog, {}, null, [])!;
    expect(result.kind).toBe('forYou');
    expect(result.tracks[0].id).toBe('fundamentos-web');
  });
});

describe('Requirement: Novas trilhas', () => {
  it('Trilha incluída há 3 dias', () => {
    const list = newTracks(catalog, TODAY);
    expect(list.length).toBeLessThanOrEqual(3);
    expect(ids(list)).toContain('modulos-nativos-no-expo');
    for (const track of list) expect(track.addedAt).toBe('2026-10-06');
  });

  it('Trilha antiga', () => {
    expect(newTracks(catalog, '2026-11-30')).toEqual([]);
  });
});

describe('Requirement: Primeiro acesso', () => {
  it('Sem interesse escolhido', () => {
    expect(startHere(catalog, [])!.start.id).toBe('fundamentos-web');
    expect(startHere(catalog, [])!.then?.id).toBe('javascript-essencial');
  });

  it('Interesse em Backend', () => {
    const result = startHere(catalog, ['backend'])!;
    expect(result.start.areas).toContain('backend');
    expect(result.start.prerequisites).toEqual([]);
  });
});

describe('semana do Início', () => {
  it('últimos 7 dias terminando hoje', () => {
    const week = lastSevenDays(['2026-10-05', '2026-10-07'], TODAY);
    expect(week.map((d) => d.day)).toEqual([
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
    ]);
    expect(week.filter((d) => d.studied).map((d) => d.day)).toEqual(['2026-10-05', '2026-10-07']);
  });
});
