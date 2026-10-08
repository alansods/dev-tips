import { quotaStatus } from '../quota';
import type { SubscriptionPlan } from '../store';

const pro = (used: number): SubscriptionPlan => ({
  plan: 'pro',
  source: 'store',
  expiresAt: '2026-11-12T12:00:00.000Z',
  willRenew: true,
  questions: { used, limit: 200 },
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
    expect(quotaStatus(pro(74))).toEqual({ used: 74, limit: 200, left: 126, ratio: 0.37, level: 'normal' });
    expect(quotaStatus(pro(159))?.level).toBe('normal');
  });

  it('quase no fim a partir de 80%', () => {
    expect(quotaStatus(pro(160))?.level).toBe('low');
    expect(quotaStatus(pro(172))).toMatchObject({ left: 28, level: 'low' });
    expect(quotaStatus(pro(199))).toMatchObject({ left: 1, level: 'low' });
  });

  it('esgotada com o limite atingido, sem passar de 100%', () => {
    expect(quotaStatus(pro(200))).toEqual({ used: 200, limit: 200, left: 0, ratio: 1, level: 'out' });
    expect(quotaStatus(pro(210))).toMatchObject({ left: 0, ratio: 1, level: 'out' });
  });
});
