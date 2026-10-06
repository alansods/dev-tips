import { describe, expect, it } from 'vitest';

import { revenueCatClient } from '../src/billing/revenuecat';

const fakeFetch = (status: number, body: unknown) =>
  (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

const subscriber = (unsubscribed: string | null) => ({
  subscriber: {
    entitlements: {
      pro: {
        expires_date: '2026-11-05T12:00:00Z',
        purchase_date: '2026-10-05T12:00:00Z',
        product_identifier: 'pro_monthly',
      },
    },
    subscriptions: { pro_monthly: { unsubscribe_detected_at: unsubscribed } },
  },
});

describe('Cliente do RevenueCat', () => {
  it('lê o entitlement pro ativo', async () => {
    const client = revenueCatClient(fakeFetch(200, subscriber(null)));
    expect(await client.getProEntitlement('u1', 'sk')).toEqual({
      expiresAt: Date.parse('2026-11-05T12:00:00Z'),
      purchasedAt: Date.parse('2026-10-05T12:00:00Z'),
      willRenew: true,
      productId: 'pro_monthly',
    });
  });

  it('renovação desligada quando o cancelamento foi detectado', async () => {
    const client = revenueCatClient(fakeFetch(200, subscriber('2026-10-10T00:00:00Z')));
    expect((await client.getProEntitlement('u1', 'sk'))?.willRenew).toBe(false);
  });

  it('sem entitlement pro', async () => {
    const client = revenueCatClient(fakeFetch(200, { subscriber: { entitlements: {}, subscriptions: {} } }));
    expect(await client.getProEntitlement('u1', 'sk')).toBeNull();
  });

  it('erro do RevenueCat lança', async () => {
    await expect(revenueCatClient(fakeFetch(500, {})).getProEntitlement('u1', 'sk')).rejects.toThrow();
  });
});
