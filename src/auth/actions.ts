// Ações da conta usadas pelas telas: entrar, sair e apagar a conta.
// Nenhuma delas apaga o progresso guardado no aparelho.

import {
  ApiError,
  authFetch,
  endLocalSession,
  NetworkError,
  publicPost,
  startSession,
  type SessionResponse,
} from './api';
import { signInWithGoogle, signOutFromGoogle } from './providers';
import { readTokens } from './tokens';

export type SignInOutcome = 'success' | 'cancelled' | 'offline' | 'error';

export async function signIn(): Promise<SignInOutcome> {
  let google;
  try {
    google = await signInWithGoogle();
  } catch {
    return 'error';
  }
  if (google.type === 'cancelled') return 'cancelled';
  try {
    await startSession(await publicPost<SessionResponse>('/auth/google', { idToken: google.idToken }));
    return 'success';
  } catch (e) {
    return e instanceof NetworkError ? 'offline' : 'error';
  }
}

/** Sai mesmo sem conexão: a sessão no servidor é encerrada quando der. */
export async function signOut(): Promise<void> {
  const tokens = await readTokens();
  if (tokens) await publicPost('/auth/logout', { refreshToken: tokens.refreshToken }).catch(() => {});
  await signOutFromGoogle();
  await endLocalSession();
}

export type DeleteOutcome = 'deleted' | 'offline' | 'error';

/** Apagar exige conexão: sem ela, nada é apagado. */
export async function deleteAccount(): Promise<DeleteOutcome> {
  try {
    await authFetch('/me', { method: 'DELETE' });
  } catch (e) {
    if (e instanceof NetworkError) return 'offline';
    if (!(e instanceof ApiError && e.status === 401)) return 'error';
    // 401: a sessão já tinha acabado no servidor; segue encerrando no aparelho
  }
  await signOutFromGoogle();
  await endLocalSession();
  return 'deleted';
}
