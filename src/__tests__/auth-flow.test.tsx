import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { Platform } from 'react-native';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProfileScreen from '../app/(tabs)/profile';
import ProgressScreen from '../app/progress';
import AccountScreen from '../app/account';
import LoginScreen from '../app/login';
import { API_URL } from '../auth/config';
import { signInWithGoogle } from '../auth/providers';
import { useAccountStore } from '../auth/store';
import { readTokens, saveTokens } from '../auth/tokens';
import { useSettingsStore } from '../i18n';
import { progressKey } from '../study/rules';
import { resetStudyStore, useStudyStore } from '../study/store';

// A sincronização tem testes próprios; aqui ela fica desligada.
jest.mock('../sync/useSync', () => ({ useSync: () => {} }));

jest.mock('../auth/providers', () => ({
  signInWithGoogle: jest.fn(),
  signOutFromGoogle: jest.fn(async () => {}),
}));
const google = signInWithGoogle as jest.Mock;

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/profile': ProfileScreen,
  progress: ProgressScreen,
  login: LoginScreen,
  account: AccountScreen,
};

const ana = { id: 'u1', name: 'Ana Souza', email: 'ana@example.com', photoUrl: null };
const session = { accessToken: 'a1', refreshToken: 'r1', user: ana };
const json = (status: number, body: unknown = null) =>
  ({ ok: status < 400, status, json: async () => body }) as unknown as Response;

let fetchMock: jest.SpyInstance;
/** Responde às chamadas da API por "MÉTODO /caminho". */
function api(handlers: Record<string, () => Response | Promise<Response>>) {
  fetchMock.mockImplementation(async (url: string, init: RequestInit = {}) => {
    const key = `${init.method ?? 'GET'} ${String(url).replace(API_URL, '')}`;
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
const signedIn = async () => {
  await saveTokens({ accessToken: 'a1', refreshToken: 'r1' });
  useAccountStore.setState({ user: ana });
};

beforeEach(() => {
  resetStudyStore();
  google.mockReset();
  fetchMock = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('rede não configurada no teste'));
});
afterEach(() => fetchMock.mockRestore());

describe('Requirement: Tela de login', () => {
  it('Primeiro uso', async () => {
    useSettingsStore.setState({ onboardingSeen: false });
    await open('/');
    expect(screen).toHavePathname('/login');
    expect(screen.getByText('Dev Tips')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Aprenda, reforce e relembre' })).toBeOnTheScreen();
    expect(
      screen.getByText('Conceitos de fullstack em cards curtos, com revisões na hora certa para você não esquecer.'),
    ).toBeOnTheScreen();
    expect(button('Continuar com o Google')).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Termos de uso' })).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Política de privacidade' })).toBeOnTheScreen();
  });

  it('Continuar sem conta', async () => {
    useSettingsStore.setState({ onboardingSeen: false });
    await open('/');
    await press('Continuar sem conta');
    expect(screen).toHavePathname('/');
    expect(useSettingsStore.getState().onboardingSeen).toBe(true);
    expect(useAccountStore.getState().user).toBeNull();
  });

  it('depois de visto, o app abre direto na aba Trilhas', async () => {
    await open('/');
    expect(screen).toHavePathname('/');
  });
});

describe('Requirement: Entrar pelo app', () => {
  it('Login com sucesso', async () => {
    google.mockResolvedValue({ type: 'success', idToken: 'id-token-do-google' });
    api({ 'POST /auth/google': () => json(200, session) });
    await open('/profile');
    await press('Entrar');
    expect(screen).toHavePathname('/login');
    await press('Continuar com o Google');
    expect(screen).toHavePathname('/profile');
    expect(screen.getByText('Ana Souza')).toBeOnTheScreen();
    expect(screen.getByText('ana@example.com')).toBeOnTheScreen();
    expect(await readTokens()).toEqual({ accessToken: 'a1', refreshToken: 'r1' });
    const body = JSON.parse(String(fetchMock.mock.calls[0][1].body));
    expect(body).toEqual({ idToken: 'id-token-do-google' });
  });

  it('Carregando', async () => {
    google.mockResolvedValue({ type: 'success', idToken: 'id' });
    let respond: (r: Response) => void = () => {};
    api({ 'POST /auth/google': () => new Promise<Response>((r) => (respond = r)) });
    await open('/login');
    await press('Continuar com o Google');
    expect(button('Entrando…')).toBeOnTheScreen();
    expect(button('Continuar sem conta')).toBeDisabled();
    respond(json(200, session));
    await flush();
  });

  it('Cancelado', async () => {
    google.mockResolvedValue({ type: 'cancelled' });
    await open('/login');
    await press('Continuar com o Google');
    expect(screen).toHavePathname('/login');
    expect(button('Continuar com o Google')).toBeOnTheScreen();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('Sem conexão', async () => {
    google.mockResolvedValue({ type: 'success', idToken: 'id' });
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    await open('/login');
    await press('Continuar com o Google');
    expect(screen.getByText('Sem conexão. Tente de novo quando estiver online.')).toBeOnTheScreen();
  });

  it('Erro da API', async () => {
    google.mockResolvedValue({ type: 'success', idToken: 'id' });
    api({ 'POST /auth/google': () => json(500, { error: { code: 'internal_error' } }) });
    await open('/login');
    await press('Continuar com o Google');
    expect(screen.getByText('Não foi possível entrar agora. Tente de novo.')).toBeOnTheScreen();
  });
});

describe('Requirement: Conta no app', () => {
  it('Convite para entrar', async () => {
    await open('/profile');
    expect(screen.getByText('Salve seu progresso na nuvem')).toBeOnTheScreen();
    expect(button('Entrar')).toBeOnTheScreen();
  });

  it('tela Conta', async () => {
    await signedIn();
    await open('/profile');
    await press(/Ana Souza/);
    expect(screen).toHavePathname('/account');
    expect(screen.getByText('Conectado com Google')).toBeOnTheScreen();
    expect(button('Sair')).toBeOnTheScreen();
    expect(button('Apagar conta')).toBeOnTheScreen();
  });

  it('Sair', async () => {
    await signedIn();
    useStudyStore.getState().answer('crud-4-frameworks', 'cors', 'known');
    api({ 'POST /auth/logout': () => json(204) });
    await open('/profile');
    await press(/Ana Souza/);
    await press('Sair');
    expect(screen.getByRole('header', { name: 'Sair da conta?' })).toBeOnTheScreen();
    await press('Sair');
    expect(screen).toHavePathname('/profile');
    expect(screen.getByText('Salve seu progresso na nuvem')).toBeOnTheScreen();
    expect(await readTokens()).toBeNull();
    expect(useStudyStore.getState().progress[progressKey('crud-4-frameworks', 'cors')]).toBe('known');
  });

  it('Sair sem conexão encerra a sessão no aparelho', async () => {
    await signedIn();
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    await open('/account');
    await press('Sair');
    await press('Sair');
    expect(useAccountStore.getState().user).toBeNull();
  });

  it('Apagar conta', async () => {
    await signedIn();
    useStudyStore.getState().answer('crud-4-frameworks', 'cors', 'known');
    api({ 'DELETE /me': () => json(204) });
    await open('/profile');
    await press(/Ana Souza/);
    await press('Apagar conta');
    expect(screen.getByRole('header', { name: 'Apagar sua conta?' })).toBeOnTheScreen();
    await press('Apagar minha conta');
    expect(screen).toHavePathname('/profile');
    expect(screen.getByText('Salve seu progresso na nuvem')).toBeOnTheScreen();
    expect(useStudyStore.getState().progress[progressKey('crud-4-frameworks', 'cors')]).toBe('known');
  });

  it('Cancelar a exclusão', async () => {
    await signedIn();
    await open('/account');
    await press('Apagar conta');
    await press('Cancelar');
    expect(screen.queryByRole('header', { name: 'Apagar sua conta?' })).toBeNull();
    expect(useAccountStore.getState().user).toEqual(ana);
    const deletes = fetchMock.mock.calls.filter(([, init]) => (init as RequestInit | undefined)?.method === 'DELETE');
    expect(deletes).toHaveLength(0);
  });

  it('apagar sem conexão mantém a conta', async () => {
    await signedIn();
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    await open('/account');
    await press('Apagar conta');
    await press('Apagar minha conta');
    expect(screen.getByText('Sem conexão. Tente de novo quando estiver online.')).toBeOnTheScreen();
    expect(useAccountStore.getState().user).toEqual(ana);
  });
});

describe('Requirement: Aba Perfil (com Conta)', () => {
  it('Ordem das seções', async () => {
    await open('/profile');
    const headers = screen.getAllByRole('header').map((el) => String(el.props.children));
    expect(headers).toEqual(['Conta', 'Seu estudo', 'Idioma', 'Lembretes', 'Tema', 'Sobre']);
  });

  it('Web sem conta', async () => {
    const os = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'web', configurable: true });
    try {
      await open('/profile');
      expect(screen.queryByText('Conta')).toBeNull();
    } finally {
      Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
    }
  });
});
