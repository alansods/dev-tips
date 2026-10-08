// Situação da cota de perguntas do assinante, usada pelo Perfil e pela Conta
// para que os dois mostrem sempre o mesmo número e a mesma cor.

import type { SubscriptionPlan } from './store';

/** A partir desta fração de uso, a cota aparece na cor de alerta. */
export const LOW_QUOTA_RATIO = 0.8;

export type QuotaLevel = 'normal' | 'low' | 'out';
export type QuotaStatus = { used: number; limit: number; left: number; ratio: number; level: QuotaLevel };

/** `null` quando não há cota a mostrar: sem plano, plano grátis ou admin (sem limite). */
export function quotaStatus(plan: SubscriptionPlan | null): QuotaStatus | null {
  if (!plan || plan.plan !== 'pro' || plan.source === 'admin') return null;
  const { used, limit } = plan.questions;
  if (limit === null || limit <= 0) return null;
  const left = Math.max(0, limit - used);
  const ratio = Math.min(1, used / limit);
  const level: QuotaLevel = left === 0 ? 'out' : ratio >= LOW_QUOTA_RATIO ? 'low' : 'normal';
  return { used, limit, left, ratio, level };
}
