// Assinar e restaurar: a loja primeiro, depois a API (que é quem libera o Pro).

import { purchaseMonthly, restorePurchases } from './purchases';
import { isProPlan, refreshSubscription, syncSubscription } from './store';

export type SubscribeOutcome = 'subscribed' | 'cancelled' | 'offline' | 'error';

export async function subscribe(): Promise<SubscribeOutcome> {
  const outcome = await purchaseMonthly();
  if (outcome !== 'purchased') return outcome;
  // A loja já cobrou: mesmo se a sincronização falhar agora, o webhook atualiza a API depois.
  await syncSubscription().catch(() => refreshSubscription());
  return 'subscribed';
}

export type RestoreOutcome = 'restored' | 'none' | 'error';

export async function restore(): Promise<RestoreOutcome> {
  if ((await restorePurchases()) !== 'restored') return 'error';
  try {
    return isProPlan(await syncSubscription()) ? 'restored' : 'none';
  } catch {
    return 'error';
  }
}
