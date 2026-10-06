import { act, fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { Platform } from 'react-native';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import HomeScreen from '../app/(tabs)/index';
import AccountScreen from '../app/account';
import LoginScreen from '../app/login';
import PaywallScreen from '../app/paywall';
import SettingsScreen from '../app/settings';
import { API_URL } from '../auth/config';
import { signInWithGoogle } from '../auth/providers';
import { useAccountStore } from '../auth/store';
import { saveTokens } from '../auth/tokens';
import { monthlyPrice, purchaseMonthly, restorePurchases } from '../subscriptions/purchases';
import { useSubscriptionStore } from '../subscriptions/store';

jest.mock('../sync/useSync', () => ({ useSync: () => {} }));
jest.mock('../auth/providers', () => ({
  signInWithGoogle: jest.fn(),
  signOutFromGoogle: jest.fn(async () => {}),
}));
jest.mock('../subscriptions/purchases', () => ({
  billingAvailable: jest.fn(() => true),
  purchasesLogIn: jest.fn(async () => {}),
  purchasesLogOut: jest.fn(async () => {}),
  monthlyPrice: jest.fn(),
  purchaseMonthly: jest.fn(),
  restorePurchases: jest.fn(),
  manageSubscriptions: jest.fn(async () => {}),
}));

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  settings: SettingsScreen,
  login: LoginScreen,
  account: AccountScreen,
  paywall: PaywallScreen,
};

const ana = { id: 'u1', name: 'Ana Souza', email: 'ana@example.com', photoUrl: null };
const FREE = { plan: 'free', source: null, expiresAt: null, willRenew: false, questions: { used: 0, limit: 0 } };
const PRO = {
  plan: 'pro',
  source: 'store',
  expiresAt: '2026-11-12T12:00:00.000Z',
  willRenew: true,
  questions: { used: 30, limit: 100 },
};
const ADMIN = { plan: 'pro', source: 'admin', expiresAt: null, willRenew: false, questions: { used: 3, limit: null } };

const json = (status: number, body: unknown = null) =>
  ({ ok: status < 400, status, json: async () => body }) as unknown as Response;

let fetchMock: jest.SpyInstance;
/** Responde às chamadas da API por "MÉTODO /caminho". GET /me/subscription devolve `plan`. */
function api(plan: unknown, handlers: Record<string, () => Response> = {}) {
  fetchMock.mockImplementation(async (url: string, init: RequestInit = {}) => {
    const key = `${init.method ?? 'GET'} ${String(url).replace(API_URL, '')}`;
    if (key === 'GET /me/subscription') return json(200, plan);
    const handler = handlers[key];
    if (!handler) throw new Error(`rota inesperada: ${key}`);
    return handler();
  });
}

const flush = () =>
  act(async () => {
    for (let i = 0; i < 20; i++) await Promise.resolve();
  });
async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await flush();
}
const button = (name: string | RegExp) => screen.getByRole('button', { name });
const press = async (name: string | RegExp) => {
  fireEvent.press(button(name));
  await flush();
};
async function signedIn(plan: unknown) {
  await saveTokens({ accessToken: 'a1', refreshToken: 'r1' });
  useAccountStore.setState({ user: ana });
  useSubscriptionStore.setState({ plan: plan as never });
}

const os = Platform.OS;
const setOS = (value: string) => Object.defineProperty(Platform, 'OS', { value, configurable: true });

beforeEach(() => {
  setOS('android');
  jest.mocked(monthlyPrice).mockResolvedValue('R$ 14,90');
  jest.mocked(purchaseMonthly).mockReset();
  jest.mocked(restorePurchases).mockReset();
  jest.mocked(signInWithGoogle).mockReset();
  fetchMock = jest.spyOn(global, 'fetch');
  api(FREE);
});
afterEach(() => {
  setOS(os);
  fetchMock.mockRestore();
});

describe('Requirement: Linha Dev Tips Pro em Ajustes', () => {
  it('Usuário grátis', async () => {
    await open('/settings');
    await press(/Dev Tips Pro/);
    expect(screen).toHavePathname('/paywall');
  });

  it('Usuário Pro', async () => {
    await signedIn(PRO);
    api(PRO);
    await open('/settings');
    expect(button(/Dev Tips Pro/)).toHaveTextContent(/Ativo/);
    await press(/Dev Tips Pro/);
    expect(screen).toHavePathname('/account');
  });

  it('iOS', async () => {
    setOS('ios');
    await open('/settings');
    expect(screen.queryByText('Dev Tips Pro')).toBeNull();
  });
});

describe('Requirement: Paywall', () => {
  it('Conteúdo', async () => {
    await open('/paywall');
    expect(screen.getByText('PRO')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Travou num card? Pergunte.' })).toBeOnTheScreen();
    expect(screen.getByText('Novos exemplos de código sobre o mesmo conceito')).toBeOnTheScreen();
    expect(screen.getByText('Pro mensal')).toBeOnTheScreen();
    expect(screen.getByText('100 perguntas por mês')).toBeOnTheScreen();
    expect(screen.getByText('R$ 14,90/mês')).toBeOnTheScreen();
    expect(
      screen.getByText('Renova automaticamente. Cancele quando quiser nas configurações do Google Play.'),
    ).toBeOnTheScreen();
    expect(button('Assinar o Pro')).toBeEnabled();
    expect(button('Restaurar compras')).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Termos' })).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Privacidade' })).toBeOnTheScreen();
  });

  it('Preço carregando', async () => {
    jest.mocked(monthlyPrice).mockReturnValue(new Promise(() => {}));
    await open('/paywall');
    expect(button('Assinar o Pro')).toBeDisabled();
  });

  it('Fechar', async () => {
    await open('/settings');
    await press(/Dev Tips Pro/);
    await press('Fechar');
    expect(screen).toHavePathname('/settings');
  });
});

describe('Requirement: Assinar pelo app', () => {
  it('Sem sessão', async () => {
    jest.mocked(signInWithGoogle).mockResolvedValue({ type: 'success', idToken: 'id' });
    api(FREE, { 'POST /auth/google': () => json(200, { accessToken: 'a1', refreshToken: 'r1', user: ana }) });
    await open('/settings');
    await press(/Dev Tips Pro/);
    await press('Assinar o Pro');
    expect(screen).toHavePathname('/login');
    await press('Continuar com o Google');
    expect(screen).toHavePathname('/paywall');
    expect(useAccountStore.getState().user).toEqual(ana);
    expect(purchaseMonthly).not.toHaveBeenCalled();
  });

  it('Compra concluída', async () => {
    await signedIn(FREE);
    jest.mocked(purchaseMonthly).mockResolvedValue('purchased');
    api(FREE, { 'POST /me/subscription/sync': () => json(200, PRO) });
    await open('/settings');
    await press(/Dev Tips Pro/);
    await press('Assinar o Pro');
    expect(screen.getByText('Pronto! Você agora é Pro.')).toBeOnTheScreen();
    expect(useSubscriptionStore.getState().plan).toEqual(PRO);
    await waitFor(() => expect(screen).toHavePathname('/settings'), { timeout: 3000 });
  });

  it('Compra cancelada', async () => {
    await signedIn(FREE);
    jest.mocked(purchaseMonthly).mockResolvedValue('cancelled');
    await open('/paywall');
    await press('Assinar o Pro');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(button('Assinar o Pro')).toBeEnabled();
  });

  it('Erro na loja', async () => {
    await signedIn(FREE);
    jest.mocked(purchaseMonthly).mockResolvedValue('error');
    await open('/paywall');
    await press('Assinar o Pro');
    expect(screen.getByText('Não foi possível concluir a assinatura. Tente de novo.')).toBeOnTheScreen();
  });

  it('Sem conexão', async () => {
    await signedIn(FREE);
    jest.mocked(purchaseMonthly).mockResolvedValue('offline');
    await open('/paywall');
    await press('Assinar o Pro');
    expect(screen.getByText('Sem conexão. Tente de novo quando estiver online.')).toBeOnTheScreen();
  });

  it('Assinando', async () => {
    await signedIn(FREE);
    jest.mocked(purchaseMonthly).mockReturnValue(new Promise(() => {}));
    await open('/paywall');
    await press('Assinar o Pro');
    expect(button('Assinando…')).toBeDisabled();
  });
});

describe('Requirement: Restaurar compras', () => {
  it('Assinatura encontrada', async () => {
    await signedIn(FREE);
    jest.mocked(restorePurchases).mockResolvedValue('restored');
    api(FREE, { 'POST /me/subscription/sync': () => json(200, PRO) });
    await open('/settings');
    await press(/Dev Tips Pro/);
    await press('Restaurar compras');
    expect(screen.getByText('Assinatura restaurada.')).toBeOnTheScreen();
    await waitFor(() => expect(screen).toHavePathname('/settings'), { timeout: 3000 });
  });

  it('Nada para restaurar', async () => {
    await signedIn(FREE);
    jest.mocked(restorePurchases).mockResolvedValue('restored');
    api(FREE, { 'POST /me/subscription/sync': () => json(200, FREE) });
    await open('/paywall');
    await press('Restaurar compras');
    expect(screen.getByText('Nenhuma assinatura ativa encontrada.')).toBeOnTheScreen();
  });

  it('Erro ao restaurar', async () => {
    await signedIn(FREE);
    jest.mocked(restorePurchases).mockResolvedValue('error');
    await open('/paywall');
    await press('Restaurar compras');
    expect(screen.getByText('Não foi possível restaurar agora. Tente de novo.')).toBeOnTheScreen();
  });

  it('Sem sessão abre o login', async () => {
    await open('/settings');
    await press(/Dev Tips Pro/);
    await press('Restaurar compras');
    expect(screen).toHavePathname('/login');
  });
});

describe('Requirement: Conta no app (bloco Plano)', () => {
  it('Plano grátis na Conta', async () => {
    await signedIn(FREE);
    await open('/account');
    expect(screen.getByText('Plano grátis')).toBeOnTheScreen();
    await press('Conhecer o Pro');
    expect(screen).toHavePathname('/paywall');
  });

  it('Assinante na Conta', async () => {
    await signedIn(PRO);
    api(PRO);
    await open('/account');
    expect(screen.getByText('Pro mensal')).toBeOnTheScreen();
    expect(screen.getByText('Ativo')).toBeOnTheScreen();
    expect(screen.getByText('Renova em 12/11/2026')).toBeOnTheScreen();
    expect(screen.getByText('30 / 100')).toBeOnTheScreen();
    expect(button('Gerenciar assinatura')).toBeOnTheScreen();
    expect(button('Restaurar compras')).toBeOnTheScreen();
  });

  it('Renovação desligada', async () => {
    const cancelled = { ...PRO, willRenew: false };
    await signedIn(cancelled);
    api(cancelled);
    await open('/account');
    expect(screen.getByText('Termina em 12/11/2026')).toBeOnTheScreen();
  });

  it('Admin na Conta', async () => {
    await signedIn(ADMIN);
    api(ADMIN);
    await open('/account');
    expect(screen.getByText('Pro (admin)')).toBeOnTheScreen();
    expect(screen.getByText('Perguntas sem limite')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Gerenciar assinatura' })).toBeNull();
  });

  it('Conta no iOS', async () => {
    setOS('ios');
    await signedIn(PRO);
    api(PRO);
    await open('/account');
    expect(screen.queryByText('Pro mensal')).toBeNull();
    expect(screen.queryByText('Plano grátis')).toBeNull();
  });

  it('Confirmação de apagar avisa sobre a assinatura', async () => {
    await signedIn(PRO);
    api(PRO);
    await open('/account');
    await press('Apagar conta');
    expect(
      screen.getByText('Se você assina o Pro, cancele também no Google Play: apagar a conta não cancela a cobrança.'),
    ).toBeOnTheScreen();
  });
});
