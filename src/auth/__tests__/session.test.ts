import AsyncStorage from '@react-native-async-storage/async-storage';

import { ApiError, authFetch, startSession } from '../api';
import { API_URL } from '../config';
import { ACCOUNT_STORAGE_KEY, useAccountStore } from '../store';
import { readTokens } from '../tokens';

const user = { id: 'u1', name: 'Ana', email: 'ana@example.com', photoUrl: null };
const json = (status: number, body: unknown) =>
  ({ ok: status < 400, status, json: async () => body }) as unknown as Response;
const flush = () => new Promise((r) => setTimeout(r, 0));

let fetchMock: jest.SpyInstance;
beforeEach(() => {
  fetchMock = jest.spyOn(global, 'fetch');
});
afterEach(() => fetchMock.mockRestore());

/** Responde por rota; cada handler recebe o header Authorization. */
function routes(handlers: Record<string, (auth: string | undefined) => Response>) {
  fetchMock.mockImplementation(async (url: string, init: RequestInit = {}) => {
    const key = `${init.method ?? 'GET'} ${String(url).replace(API_URL, '')}`;
    const auth = (init.headers as Record<string, string> | undefined)?.Authorization;
    const handler = handlers[key];
    if (!handler) throw new Error(`rota inesperada: ${key}`);
    return handler(auth);
  });
}

describe('Requirement: Sessão no aparelho', () => {
  it('Sessão mantida ao reabrir', async () => {
    await startSession({ accessToken: 'a1', refreshToken: 'r1', user });
    await flush();
    const saved = await AsyncStorage.getItem(ACCOUNT_STORAGE_KEY);
    useAccountStore.setState({ user: null }); // "fechar o app" (o setState também grava)
    await AsyncStorage.setItem(ACCOUNT_STORAGE_KEY, saved!);
    await useAccountStore.persist.rehydrate();
    expect(useAccountStore.getState().user).toEqual(user);
    expect(await readTokens()).toEqual({ accessToken: 'a1', refreshToken: 'r1' });
  });

  it('Renovação automática', async () => {
    await startSession({ accessToken: 'velho', refreshToken: 'r1', user });
    routes({
      'GET /me': (auth) => (auth === 'Bearer novo' ? json(200, user) : json(401, { error: { code: 'unauthorized' } })),
      'POST /auth/refresh': () => json(200, { accessToken: 'novo', refreshToken: 'r2', user }),
    });
    await expect(authFetch('/me')).resolves.toEqual(user);
    expect(await readTokens()).toEqual({ accessToken: 'novo', refreshToken: 'r2' });
  });

  it('várias chamadas ao mesmo tempo renovam uma vez só', async () => {
    await startSession({ accessToken: 'velho', refreshToken: 'r1', user });
    routes({
      'GET /me': (auth) => (auth === 'Bearer novo' ? json(200, user) : json(401, { error: { code: 'unauthorized' } })),
      'POST /auth/refresh': () => json(200, { accessToken: 'novo', refreshToken: 'r2', user }),
    });
    await Promise.all([authFetch('/me'), authFetch('/me'), authFetch('/me')]);
    const refreshCalls = fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'));
    expect(refreshCalls).toHaveLength(1);
  });

  it('Sessão encerrada no servidor', async () => {
    await startSession({ accessToken: 'velho', refreshToken: 'r1', user });
    routes({
      'GET /me': () => json(401, { error: { code: 'unauthorized' } }),
      'POST /auth/refresh': () => json(401, { error: { code: 'invalid_session' } }),
    });
    await expect(authFetch('/me')).rejects.toEqual(new ApiError(401, 'unauthorized'));
    expect(useAccountStore.getState().user).toBeNull();
    expect(await readTokens()).toBeNull();
  });

  it('sem sessão, nem chama a API', async () => {
    await expect(authFetch('/me')).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
