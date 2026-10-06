// Cliente da REST API do RevenueCat: consulta o entitlement "pro" de um usuário.
// Usado pela sincronização logo após comprar ou restaurar, sem esperar o webhook.

export const PRO_ENTITLEMENT = 'pro';

export type ProEntitlement = { expiresAt: number; purchasedAt: number; willRenew: boolean; productId: string };

export type RevenueCatClient = {
  /** Entitlement "pro" ativo, `null` se não houver; lança se o RevenueCat falhar. */
  getProEntitlement(appUserId: string, secretKey: string): Promise<ProEntitlement | null>;
};

type SubscriberResponse = {
  subscriber: {
    entitlements: Record<string, { expires_date: string | null; purchase_date: string; product_identifier: string }>;
    subscriptions: Record<string, { unsubscribe_detected_at: string | null }>;
  };
};

export const revenueCatClient = (fetcher: typeof fetch = fetch): RevenueCatClient => ({
  async getProEntitlement(appUserId, secretKey) {
    const res = await fetcher(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`, {
      headers: { Authorization: `Bearer ${secretKey}`, Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`RevenueCat respondeu ${res.status}`);
    const { subscriber } = await res.json<SubscriberResponse>();
    const pro = subscriber.entitlements[PRO_ENTITLEMENT];
    if (!pro?.expires_date) return null;
    const expiresAt = Date.parse(pro.expires_date);
    return {
      expiresAt,
      purchasedAt: Date.parse(pro.purchase_date),
      willRenew: !subscriber.subscriptions[pro.product_identifier]?.unsubscribe_detected_at,
      productId: pro.product_identifier,
    };
  },
});
