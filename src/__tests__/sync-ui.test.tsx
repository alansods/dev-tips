import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import ProgressScreen from '../app/(tabs)/progress';
import AccountScreen from '../app/account';
import SettingsScreen from '../app/settings';
import ThemeScreen from '../app/theme/[themeId]';
import { useAccountStore } from '../auth/store';
import { saveTokens } from '../auth/tokens';
import { resetStudyStore, useStudyStore } from '../study/store';
import { fakeServer } from '../sync/__fixtures__/fakeServer';
import { resetSyncStore, useSyncStore } from '../sync/store';

const network = jest.requireMock('expo-network') as { __setNetworkState: (online: boolean) => void };

const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/progress': ProgressScreen,
  settings: SettingsScreen,
  account: AccountScreen,
  'theme/[themeId]': ThemeScreen,
};
const ana = { id: 'u1', name: 'Ana Souza', email: 'ana@example.com', photoUrl: null };

let server: ReturnType<typeof fakeServer>;
let fetchMock: jest.SpyInstance;

const flush = () =>
  act(async () => {
    for (let i = 0; i < 30; i++) await Promise.resolve();
  });
async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await flush();
}
async function signIn() {
  await saveTokens({ accessToken: 'a1', refreshToken: 'r1' });
  useAccountStore.setState({ user: ana });
}
const OFFLINE = 'Offline. Seu progresso será enviado depois.';

beforeEach(() => {
  resetStudyStore();
  resetSyncStore();
  server = fakeServer();
  fetchMock = server.install();
});
afterEach(() => fetchMock.mockRestore());

describe('Requirement: Aviso de offline', () => {
  it('Ficar offline com conta', async () => {
    await signIn();
    await open('/');
    expect(screen.queryByText(OFFLINE)).toBeNull();
    await act(async () => network.__setNetworkState(false));
    expect(screen.getByText(OFFLINE)).toBeOnTheScreen();
    // os cards continuam abrindo normalmente
    fireEvent.press(screen.getByRole('button', { name: /^O mesmo CRUD/ }));
    await flush();
    expect(screen).toHavePathname('/theme/crud-4-frameworks');
  });

  it('Reconectar', async () => {
    await signIn();
    network.__setNetworkState(false);
    await open('/');
    expect(screen.getByText(OFFLINE)).toBeOnTheScreen();
    await act(async () => network.__setNetworkState(true));
    expect(screen.queryByText(OFFLINE)).toBeNull();
  });

  it('Offline sem conta', async () => {
    network.__setNetworkState(false);
    await open('/');
    expect(screen.queryByText(OFFLINE)).toBeNull();
  });
});

describe('Requirement: Estado da sincronização', () => {
  it('Sincronizado (tela Conta e Ajustes)', async () => {
    await signIn();
    await open('/settings');
    expect(useSyncStore.getState().lastSyncedAt).toEqual(expect.any(Number));
    expect(screen.getByText('Sincronizado agora há pouco')).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('button', { name: /Ana Souza/ }));
    await flush();
    expect(screen.getByText('Sincronizado agora há pouco')).toBeOnTheScreen();
  });

  it('Sem conexão com mudanças pendentes', async () => {
    await signIn();
    await open('/settings');
    await act(async () => network.__setNetworkState(false));
    await act(async () => useStudyStore.getState().answer('crud-4-frameworks', 'cors', 'known'));
    expect(screen.getByText('Aguardando conexão')).toBeOnTheScreen();
  });
});

describe('Requirement: Primeiro login', () => {
  it('mensagem depois da primeira sincronização', async () => {
    useStudyStore.getState().answer('crud-4-frameworks', 'cors', 'known');
    await signIn();
    await open('/');
    expect(screen.getByText('Seu progresso foi salvo na conta.')).toBeOnTheScreen();
    expect(server.card('crud-4-frameworks', 'cors')?.result).toBe('known');
  });
});
