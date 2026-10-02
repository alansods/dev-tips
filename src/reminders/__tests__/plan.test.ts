import type { Theme } from '../../content';
import { catalog } from '../../content/catalog';
import { en } from '../../i18n/en';
import { ptBR } from '../../i18n/pt-BR';
import { progressKey } from '../../study/rules';
import type { Schedule } from '../../study/srs';
import { planReminders, reminderTarget } from '../plan';

const [crud, web] = catalog as Theme[];
const ids = (theme: Theme, n: number) => theme.decks.flatMap((d) => d.cards).slice(0, n).map((c) => c.id);

/** Agenda `n` cards do tema para `due`. */
function due(theme: Theme, n: number, day: string, schedule: Schedule = {}): Schedule {
  for (const id of ids(theme, n)) schedule[progressKey(theme.id, id)] = { box: 1, due: day };
  return schedule;
}

const at = (day: string, time: string) => {
  const [y, m, d] = day.split('-').map(Number);
  const [h, min] = time.split(':').map(Number);
  return new Date(y, m - 1, d, h, min);
};

const plan = (opts: Partial<Parameters<typeof planReminders>[0]>) =>
  planReminders({
    catalog,
    schedule: {},
    lastStudyDay: null,
    time: '20:00',
    now: at('2026-10-02', '10:00'),
    messages: ptBR,
    ...opts,
  });
const bodyOn = (plans: ReturnType<typeof planReminders>, day: string) =>
  plans.find((p) => p.date.getTime() === at(day, '20:00').getTime())?.body;

describe('Requirement: Uma notificação por dia com texto do dia', () => {
  it('Dia com revisão', () => {
    const plans = plan({ schedule: due(crud, 3, '2026-10-02') });
    expect(plans[0]).toEqual({
      date: at('2026-10-02', '20:00'),
      title: 'Dev Tips',
      body: 'Revisão do dia: 3 cards esperando por você',
    });
    expect(plans).toHaveLength(7);
  });

  it('soma os temas e conta cards vencidos antes do dia', () => {
    const schedule = due(crud, 2, '2026-09-30', due(web, 1, '2026-10-02'));
    expect(plan({ schedule })[0].body).toBe('Revisão do dia: 3 cards esperando por você');
  });

  it('Revisão futura já prevista', () => {
    const plans = plan({ schedule: due(crud, 1, '2026-10-05') });
    for (const day of ['2026-10-02', '2026-10-03', '2026-10-04']) {
      expect(bodyOn(plans, day)).toBe('5 minutos de estudo? Continue de onde parou.');
    }
    expect(bodyOn(plans, '2026-10-05')).toBe('Revisão do dia: 1 card esperando por você');
  });

  it('Dia sem revisão', () => {
    expect(bodyOn(plan({}), '2026-10-03')).toBe('5 minutos de estudo? Continue de onde parou.');
  });

  it('Horário de hoje já passou', () => {
    const plans = plan({ now: at('2026-10-02', '21:00') });
    expect(plans[0].date).toEqual(at('2026-10-03', '20:00'));
    expect(plans).toHaveLength(7);
    expect(plans[6].date).toEqual(at('2026-10-09', '20:00'));
  });

  it('Um card', () => {
    expect(plan({ schedule: due(crud, 1, '2026-10-02') })[0].body).toBe('Revisão do dia: 1 card esperando por você');
  });

  it('Texto em inglês', () => {
    const plans = plan({ schedule: due(crud, 3, '2026-10-02'), messages: en });
    expect(plans[0].body).toBe("Today's review: 3 cards waiting for you");
    expect(plans[1].body).toBe("Today's review: 3 cards waiting for you");
    expect(plan({ messages: en })[0].body).toBe('5 minutes of study? Pick up where you left off.');
    expect(plan({ schedule: due(crud, 1, '2026-10-02'), messages: en })[0].body).toBe(
      "Today's review: 1 card waiting for you",
    );
  });

  it('usa o horário escolhido', () => {
    expect(plan({ time: '08:00', now: at('2026-10-02', '07:00') })[0].date).toEqual(at('2026-10-02', '08:00'));
    expect(plan({ time: '12:30' })[0].date).toEqual(at('2026-10-02', '12:30'));
  });
});

describe('Requirement: Não insistir no dia estudado', () => {
  it('Estudou antes do horário', () => {
    const plans = plan({ lastStudyDay: '2026-10-02', now: at('2026-10-02', '18:00') });
    expect(plans.some((p) => p.date.getDate() === 2)).toBe(false);
    expect(plans[0].date).toEqual(at('2026-10-03', '20:00'));
  });

  it('estudo de outro dia não suprime hoje', () => {
    expect(plan({ lastStudyDay: '2026-10-01' })[0].date).toEqual(at('2026-10-02', '20:00'));
  });
});

describe('Requirement: Abrir pela notificação', () => {
  it('Toque com revisão pendente', () => {
    const schedule = due(crud, 2, '2026-10-02', due(web, 5, '2026-10-02'));
    expect(reminderTarget(catalog, schedule, '2026-10-02')).toBe(`/theme/${web.id}`);
  });

  it('empate fica com o primeiro do catálogo', () => {
    const schedule = due(crud, 2, '2026-10-02', due(web, 2, '2026-10-02'));
    expect(reminderTarget(catalog, schedule, '2026-10-02')).toBe(`/theme/${crud.id}`);
  });

  it('Toque sem revisão', () => {
    expect(reminderTarget(catalog, due(crud, 2, '2026-10-09'), '2026-10-02')).toBe('/');
  });
});
