// Cota de perguntas dos recursos pagos. Quem chama a IA faz:
//   const ticket = await assertCanAsk(...)   // antes: recusa grátis e cota esgotada
//   ...chama a IA...
//   await recordAnswered(db, user.id, ticket) // depois, só se a resposta deu certo

import { findSubscription, incrementQuestionUsage, questionUsage, type Subscription } from '../db/subscriptions';
import { AppError } from '../errors';
import { isAdmin } from './access';

export const QUESTION_LIMIT = 100;

type Asker = { id: string; email: string | null };
export type QuotaTicket = { periodStart: number };

/** Início do mês em UTC: o "ciclo" dos admins, que não têm período de assinatura. */
export const monthStart = (now: number) => {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
};

/** Período e limite de quem pode perguntar; `null` no plano grátis. `limit` null = sem limite. */
export function quotaPeriod(
  user: Asker,
  subscription: Subscription | null,
  adminList: string,
  now: number,
): { periodStart: number; limit: number | null } | null {
  if (isAdmin(user.email, adminList)) return { periodStart: monthStart(now), limit: null };
  if (subscription && subscription.expiresAt > now)
    return { periodStart: subscription.periodStart, limit: QUESTION_LIMIT };
  return null;
}

/** Lança 403 pro_required ou 429 quota_exceeded; senão devolve o período a registrar. */
export async function assertCanAsk(db: D1Database, user: Asker, adminList: string, now: number): Promise<QuotaTicket> {
  const period = quotaPeriod(user, await findSubscription(db, user.id), adminList, now);
  if (!period) throw new AppError(403, 'pro_required', 'Este recurso é do plano Pro.');
  if (period.limit !== null && (await questionUsage(db, user.id, period.periodStart)) >= period.limit) {
    throw new AppError(429, 'quota_exceeded', 'Você usou todas as perguntas deste período.');
  }
  return { periodStart: period.periodStart };
}

export const recordAnswered = (db: D1Database, userId: string, ticket: QuotaTicket) =>
  incrementQuestionUsage(db, userId, ticket.periodStart);
