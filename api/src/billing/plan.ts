// Corpo de GET /me/subscription (e da sincronização): plano, origem, período e uso.

import { findSubscription, questionUsage } from '../db/subscriptions';
import { isAdmin } from './access';
import { quotaPeriod } from './quota';

export type SubscriptionView = {
  plan: 'free' | 'pro';
  source: 'store' | 'admin' | null;
  expiresAt: string | null;
  willRenew: boolean;
  questions: { used: number; limit: number | null };
};

export async function subscriptionView(
  db: D1Database,
  user: { id: string; email: string | null },
  adminList: string,
  now: number,
): Promise<SubscriptionView> {
  const subscription = await findSubscription(db, user.id);
  const period = quotaPeriod(user, subscription, adminList, now);
  if (!period) {
    return { plan: 'free', source: null, expiresAt: null, willRenew: false, questions: { used: 0, limit: 0 } };
  }
  const used = await questionUsage(db, user.id, period.periodStart);
  if (isAdmin(user.email, adminList)) {
    return { plan: 'pro', source: 'admin', expiresAt: null, willRenew: false, questions: { used, limit: null } };
  }
  return {
    plan: 'pro',
    source: 'store',
    expiresAt: new Date(subscription!.expiresAt).toISOString(),
    willRenew: subscription!.willRenew,
    questions: { used, limit: period.limit },
  };
}
