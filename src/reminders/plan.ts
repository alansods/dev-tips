// Planejamento dos lembretes, sem tocar no módulo nativo: quais notificações
// agendar nos próximos dias e com que texto, e para onde ir ao tocar numa.
// O texto de cada dia sai do agendamento de revisão, que já é conhecido hoje.

import type { Theme } from '../content';
import type { Messages } from '../i18n';
import { addDays } from '../study/clock';
import { dueCardIds, type Schedule } from '../study/srs';

export const REMINDER_TIMES = ['08:00', '12:30', '20:00'] as const;
export type ReminderTime = (typeof REMINDER_TIMES)[number];

/** Quantos dias à frente ficam agendados. */
export const REMINDER_DAYS = 7;

export type ReminderPlan = { date: Date; title: string; body: string };

type PlanInput = {
  catalog: readonly Theme[];
  schedule: Schedule;
  lastStudyDay: string | null;
  time: ReminderTime;
  now: Date;
  messages: Messages;
};

const pad = (n: number) => String(n).padStart(2, '0');
const dayOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Data local do dia `YYYY-MM-DD` no horário `HH:MM`. */
function localDate(day: string, time: ReminderTime): Date {
  const [y, m, d] = day.split('-').map(Number);
  const [h, min] = time.split(':').map(Number);
  return new Date(y, m - 1, d, h, min);
}

const dueCount = (catalog: readonly Theme[], schedule: Schedule, day: string) =>
  catalog.reduce((n, theme) => n + dueCardIds(theme, schedule, day).length, 0);

/**
 * Uma notificação por dia nos próximos `REMINDER_DAYS` dias, a partir do primeiro
 * horário ainda não passado. A de hoje sai da lista se o usuário já estudou hoje.
 */
export function planReminders({ catalog, schedule, lastStudyDay, time, now, messages }: PlanInput): ReminderPlan[] {
  const today = dayOf(now);
  const firstOffset = localDate(today, time) > now ? 0 : 1;
  const plans: ReminderPlan[] = [];
  for (let offset = firstOffset; offset < firstOffset + REMINDER_DAYS; offset++) {
    const day = addDays(today, offset);
    if (day === today && lastStudyDay === today) continue;
    const n = dueCount(catalog, schedule, day);
    plans.push({
      date: localDate(day, time),
      title: messages.reminders.title,
      body: n > 0 ? messages.reminders.review(n) : messages.reminders.practice,
    });
  }
  return plans;
}

/** Rota ao tocar no lembrete: o tema com mais cards para revisar (empate: o primeiro), ou a aba Temas. */
export function reminderTarget(catalog: readonly Theme[], schedule: Schedule, day: string): string {
  let best: { id: string; n: number } | null = null;
  for (const theme of catalog) {
    const n = dueCardIds(theme, schedule, day).length;
    if (n > 0 && (!best || n > best.n)) best = { id: theme.id, n };
  }
  return best ? `/theme/${best.id}` : '/';
}
