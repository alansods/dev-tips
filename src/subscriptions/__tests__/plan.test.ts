import { API_URL } from '../../auth/config';
import { useAccountStore } from '../../auth/store';
import { saveTokens } from '../../auth/tokens';
import { startSubscriptionLifecycle } from '../lifecycle';
import { purchasesLogIn, purchasesLogOut } from '../purchases';
import { isProPlan, refreshSubscription, resetSubscriptionStore, useSubscriptionStore } from '../store';

jest.mock('../purchases', () => ({
  purchasesLogIn: jest.fn(async () => {}),
  purchasesLogOut: jest.fn(async () => {}),
}));

const ana = { id: 'u1', name: 'Ana', email: 'ana@example.com', photoUrl: null };
const PRO = {
  plan: 'pro',
  source: 'store',
  expiresAt: '2026-11-05T12:00:00.000Z',
  willRenew: true,
  questions: { used: 30, limit: 100 },
} as const;

const json = (status: number, body: unknown = null) =>
  ({ ok: status < 400, status, json: async () => body }) as unknown as Response;
const flush = async () => {
  for (let i = 0; i < 20; i++) await Promise.resolve();
};

let fetchMock: jest.SpyInstance;
let stop: () => void;

beforeEach(() => {
  resetSubscriptionStore();
  (purchasesLogIn as jest.Mock).mockClear();
  (purchasesLogOut as jest.Mock).mockClear();
  fetchMock = jest.spyOn(global, 'fetch').mockImplementation(async (url) => {
    if (String(url) === `${API_URL}/me/subscription`) return json(200, PRO);
    throw new Error(`rota inesperada: ${String(url)}`);
  });
  stop = startSubscriptionLifecycle();
});
afterEach(() => {
  stop();
  fetchMock.mockRestore();
});

describe('Requirement: Plano no app', () => {
  it('Consulta depois do login', async () => {
    await saveTokens({ accessToken: 'a1', refreshToken: 'r1' });
    useAccountStore.setState({ user: ana });
    await flush();
    expect(purchasesLogIn).toHaveBeenCalledWith('u1');
    expect(useSubscriptionStore.getState().plan).toEqual(PRO);
    expect(isProPlan(useSubscriptionStore.getState().plan)).toBe(true);
  });

  it('Sem conexão', async () => {
    useSubscriptionStore.setState({ plan: PRO });
    await saveTokens({ accessToken: 'a1', refreshToken: 'r1' });
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    await refreshSubscription();
    expect(isProPlan(useSubscriptionStore.getState().plan)).toBe(true);
  });

  it('Sair da conta', async () => {
    await saveTokens({ accessToken: 'a1', refreshToken: 'r1' });
    useAccountStore.setState({ user: ana });
    await flush();
    useAccountStore.setState({ user: null });
    await flush();
    expect(useSubscriptionStore.getState().plan).toBeNull();
    expect(isProPlan(useSubscriptionStore.getState().plan)).toBe(false);
    expect(purchasesLogOut).toHaveBeenCalled();
  });

  it('Sem sessão é plano grátis', () => {
    expect(isProPlan(useSubscriptionStore.getState().plan)).toBe(false);
  });
});
