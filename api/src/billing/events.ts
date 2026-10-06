// Como cada evento do RevenueCat muda a assinatura. Função pura: a rota do
// webhook cuida de HTTP e banco; aqui fica só a regra.

import { z } from 'zod';

import type { Subscription } from '../db/subscriptions';

/** Só os campos que usamos; o RevenueCat manda vários outros, que são ignorados. */
export const webhookBody = z.object({
  event: z.object({
    type: z.string(),
    app_user_id: z.string(),
    event_timestamp_ms: z.number(),
    purchased_at_ms: z.number().nullish(),
    expiration_at_ms: z.number().nullish(),
    product_id: z.string().nullish(),
  }),
});

export type RevenueCatEvent = z.infer<typeof webhookBody>['event'];

/** Eventos que deixam a assinatura ativa com renovação automática ligada. */
const ACTIVE = ['INITIAL_PURCHASE', 'RENEWAL', 'UNCANCELLATION', 'PRODUCT_CHANGE'];
/** Eventos que começam um período novo (e, com ele, uma cota nova). */
const NEW_PERIOD = ['INITIAL_PURCHASE', 'RENEWAL'];

/**
 * Devolve a assinatura depois do evento, ou `null` quando o evento deve ser
 * ignorado (tipo que não usamos, sem expiração ou mais antigo que o último aplicado).
 */
export function applyEvent(current: Subscription | null, e: RevenueCatEvent): Subscription | null {
  const known = ACTIVE.includes(e.type) || e.type === 'CANCELLATION' || e.type === 'EXPIRATION';
  if (!known || e.expiration_at_ms == null) return null;
  if (current && e.event_timestamp_ms <= current.lastEventAt) return null;

  const purchasedAt = e.purchased_at_ms ?? e.event_timestamp_ms;
  const periodStart = NEW_PERIOD.includes(e.type) || !current ? purchasedAt : current.periodStart;

  return {
    periodStart,
    expiresAt: e.expiration_at_ms,
    willRenew: ACTIVE.includes(e.type),
    productId: e.product_id ?? current?.productId ?? null,
    lastEventAt: e.event_timestamp_ms,
  };
}
