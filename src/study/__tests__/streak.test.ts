import { addDays } from '../clock';
import { currentStreak, KEEP_DAYS, recordDay } from '../streak';

describe('Requirement: Dias estudados', () => {
  it('Responder conta o dia', () => {
    expect(recordDay([], '2026-10-07')).toEqual(['2026-10-07']);
    expect(recordDay(['2026-10-06'], '2026-10-07')).toEqual(['2026-10-06', '2026-10-07']);
  });

  it('o mesmo dia não se repete', () => {
    expect(recordDay(['2026-10-07'], '2026-10-07')).toEqual(['2026-10-07']);
  });

  it('Sequência terminando hoje', () => {
    expect(currentStreak(['2026-10-05', '2026-10-06', '2026-10-07'], '2026-10-07')).toBe(3);
  });

  it('Sequência ainda vale sem estudo hoje', () => {
    expect(currentStreak(['2026-10-05', '2026-10-06'], '2026-10-07')).toBe(2);
  });

  it('Sequência quebrada', () => {
    expect(currentStreak(['2026-10-05'], '2026-10-07')).toBe(0);
    expect(currentStreak([], '2026-10-07')).toBe(0);
  });

  it('um buraco interrompe a sequência', () => {
    expect(currentStreak(['2026-10-03', '2026-10-05', '2026-10-06', '2026-10-07'], '2026-10-07')).toBe(3);
  });

  it('Só os últimos 60 dias', () => {
    const today = '2026-10-07';
    const old = addDays(today, -KEEP_DAYS);
    const days = recordDay([old, addDays(today, -1)], today);
    expect(KEEP_DAYS).toBe(60);
    expect(days).not.toContain(old);
    expect(days).toEqual([addDays(today, -1), today]);
  });
});
