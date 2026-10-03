// Cliente da API. Chamadas com conta enviam o access token; se a API responder
// 401, renova a sessão uma única vez (mesmo com várias chamadas ao mesmo tempo)
// e repete a chamada. Se a renovação for recusada, encerra a sessão no aparelho.

import { API_URL } from './config';
import { useAccountStore, type AccountUser } from './store';
import { clearTokens, readTokens, saveTokens } from './tokens';

/** Sem conexão (ou a API não respondeu). */
export class NetworkError extends Error {}

/** A API respondeu com erro (`code` vem de { error: { code } }). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
  ) {
    super(`${status} ${code}`);
  }
}

export type SessionResponse = { accessToken: string; refreshToken: string; user: AccountUser };

async function send(path: string, init: RequestInit = {}, accessToken?: string): Promise<Response> {
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };
  if (init.body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  try {
    return await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new NetworkError('sem conexão');
  }
}

async function parse<T>(res: Response): Promise<T> {
  if (res.ok) return (res.status === 204 ? null : await res.json()) as T;
  const body = (await res.json().catch(() => null)) as { error?: { code?: string } } | null;
  throw new ApiError(res.status, body?.error?.code ?? 'unknown');
}

/** POST sem conta (login, renovação, logout). */
export async function publicPost<T>(path: string, body: unknown): Promise<T> {
  return parse<T>(await send(path, { method: 'POST', body: JSON.stringify(body) }));
}

/** Encerra a sessão só no aparelho (o progresso local não é tocado). */
export async function endLocalSession(): Promise<void> {
  await clearTokens();
  useAccountStore.getState().setUser(null);
}

/** Guarda uma sessão nova: tokens no SecureStore, usuário no store. */
export async function startSession(session: SessionResponse): Promise<void> {
  await saveTokens({ accessToken: session.accessToken, refreshToken: session.refreshToken });
  useAccountStore.getState().setUser(session.user);
}

let refreshing: Promise<string | null> | null = null;

/** Troca o refresh token por um par novo. `null` = sessão recusada (e encerrada). */
async function refreshAccessToken(): Promise<string | null> {
  const tokens = await readTokens();
  if (!tokens) return null;
  try {
    const session = await publicPost<SessionResponse>('/auth/refresh', { refreshToken: tokens.refreshToken });
    await startSession(session);
    return session.accessToken;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      await endLocalSession();
      return null;
    }
    throw e;
  }
}

/** Chamada que exige conta, com renovação automática do access token. */
export async function authFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const tokens = await readTokens();
  if (!tokens) throw new ApiError(401, 'unauthorized');
  let res = await send(path, init, tokens.accessToken);
  if (res.status === 401) {
    refreshing ??= refreshAccessToken().finally(() => {
      refreshing = null;
    });
    const accessToken = await refreshing;
    if (!accessToken) throw new ApiError(401, 'unauthorized');
    res = await send(path, init, accessToken);
  }
  return parse<T>(res);
}
