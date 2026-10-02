import { addDays, today } from '../clock';
import { progressKey } from '../rules';
import { dueCardIds, nextSchedule, type Schedule } from '../srs';
import { crudTheme } from '../../test-utils';

const DAY = '2026-10-02';
const key = (id: string) => progressKey(crudTheme.id, id);

describe('clock', () => {
  it('addDays atravessa mês e ano', () => {
    expect(addDays('2026-10-02', 3)).toBe('2026-10-05');
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
  });

  it('today devolve o dia local no formato YYYY-MM-DD', () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('Requirement: Agendamento por caixas', () => {
  it('Primeiro acerto', () => {
    expect(nextSchedule(undefined, 'known', DAY)).toEqual({ box: 2, due: '2026-10-05' });
  });

  it('Acertos seguidos', () => {
    expect(nextSchedule({ box: 3, due: '2026-09-25' }, 'known', DAY)).toEqual({ box: 4, due: '2026-10-16' });
  });

  it('Teto da caixa 5', () => {
    expect(nextSchedule({ box: 5, due: '2026-09-01' }, 'known', DAY)).toEqual({ box: 5, due: '2026-11-01' });
  });

  it('Erro volta para a caixa 1', () => {
    expect(nextSchedule({ box: 4, due: '2026-10-01' }, 'unknown', DAY)).toEqual({ box: 1, due: DAY });
  });

  it('primeiro erro também vai para a caixa 1', () => {
    expect(nextSchedule(undefined, 'unknown', DAY)).toEqual({ box: 1, due: DAY });
  });

  it('caixa 1 com acerto sobe para a 2', () => {
    expect(nextSchedule({ box: 1, due: DAY }, 'known', DAY)).toEqual({ box: 2, due: '2026-10-05' });
  });
});

describe('Requirement: Cards para revisar hoje', () => {
  it('Vencidos e do dia entram', () => {
    // ids em ordem de conteúdo: endpoint-create (deck 1), step-01 (deck 2), api (deck 4)
    const schedule: Schedule = {
      [key('api')]: { box: 2, due: '2026-10-08' },
      [key('endpoint-create')]: { box: 1, due: '2026-10-10' },
      [key('step-01')]: { box: 3, due: '2026-10-11' },
    };
    expect(dueCardIds(crudTheme, schedule, '2026-10-10')).toEqual(['endpoint-create', 'api']);
  });

  it('Cards novos não entram', () => {
    expect(dueCardIds(crudTheme, {}, DAY)).toEqual([]);
  });

  it('agendamento de outro tema não entra', () => {
    const schedule: Schedule = { [progressKey('outro', 'api')]: { box: 1, due: DAY } };
    expect(dueCardIds(crudTheme, schedule, DAY)).toEqual([]);
  });
});
