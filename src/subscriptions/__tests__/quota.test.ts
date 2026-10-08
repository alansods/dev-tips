import { quotaStatus } from '../quota';
import type { SubscriptionPlan } from '../store';

const pro = (used: number): SubscriptionPlan => ({
  plan: 'pro',
  source: 'store',
  expiresAt: '2026-11-12T12:00:00.000Z',
  willRenew: true,
  questions: { used, limit: 100 },
});

describe('quotaStatus', () => {
  it('não há cota no plano grátis, sem plano e para admin', () => {
    expect(quotaStatus(null)).toBeNull();
    expect(
      quotaStatus({ plan: 'free', source: null, expiresAt: null, willRenew: false, questions: { used: 0, limit: 0 } }),
    ).toBeNull();
    expect(
      quotaStatus({
        plan: 'pro',
        source: 'admin',
        expiresAt: null,
        willRenew: false,
        questions: { used: 3, limit: null },
      }),
    ).toBeNull();
  });

  it('uso normal abaixo de 80%', () => {
    expect(quotaStatus(pro(37))).toEqual({ used: 37, limit: 100, left: 63, ratio: 0.37, level: 'normal' });
    expect(quotaStatus(pro(79))?.level).toBe('normal');
  });

  it('quase no fim a partir de 80%', () => {
    expect(quotaStatus(pro(80))?.level).toBe('low');
    expect(quotaStatus(pro(86))).toMatchObject({ left: 14, level: 'low' });
    expect(quotaStatus(pro(99))).toMatchObject({ left: 1, level: 'low' });
  });

  it('esgotada com o limite atingido, sem passar de 100%', () => {
    expect(quotaStatus(pro(100))).toEqual({ used: 100, limit: 100, left: 0, ratio: 1, level: 'out' });
    expect(quotaStatus(pro(105))).toMatchObject({ left: 0, ratio: 1, level: 'out' });
  });
});
