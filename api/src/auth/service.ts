// Regras do login e da sessão. Não sabe nada de HTTP: recebe dados e devolve
// dados; erros saem como AppError.

import {
  findRefreshToken,
  insertRefreshToken,
  markRefreshTokenUsed,
  revokeAllForUser,
  revokeRefreshToken,
} from '../db/tokens';
import { findUserById, findUserByProvider, insertUser, updateProfile, type User } from '../db/users';
import type { Deps } from '../deps';
import { AppError } from '../errors';
import { verifyGoogleIdToken } from './google';
import { hashToken, newRefreshToken, REFRESH_TTL_MS, signAccessToken } from './tokens';

export type Session = { accessToken: string; refreshToken: string; user: User };

const clientIds = (env: Env) =>
  env.GOOGLE_CLIENT_IDS.split(',')
    .map((id) => id.trim())
    .filter(Boolean);

const invalidSession = () => new AppError(401, 'invalid_session', 'Sessão inválida. Entre de novo.');

/** Emite um par de tokens para o usuário, dentro de uma família de sessão. */
async function issueSession(env: Env, deps: Deps, user: User, familyId: string): Promise<Session> {
  const now = deps.now();
  const refreshToken = newRefreshToken();
  await insertRefreshToken(
    env.DB,
    { hash: await hashToken(refreshToken), userId: user.id, familyId, expiresAt: now + REFRESH_TTL_MS },
    now,
  );
  return { accessToken: await signAccessToken(user.id, env.JWT_SECRET, now), refreshToken, user };
}

/** Valida o ID token do Google, cria o usuário no primeiro acesso e abre uma sessão nova. */
export async function loginWithGoogle(env: Env, deps: Deps, idToken: string): Promise<Session> {
  const profile = await verifyGoogleIdToken(idToken, deps.googleKeys, clientIds(env));
  const data = { name: profile.name, email: profile.email, photoUrl: profile.picture };
  const existing = await findUserByProvider(env.DB, 'google', profile.sub);
  let user: User;
  if (existing) {
    await updateProfile(env.DB, existing.id, data);
    user = { id: existing.id, ...data };
  } else {
    user = await insertUser(env.DB, { provider: 'google', sub: profile.sub, ...data }, deps.now());
  }
  return issueSession(env, deps, user, crypto.randomUUID());
}

/**
 * Troca um refresh token válido por um par novo (uso único). Se um token já
 * trocado reaparece, alguém o copiou: todas as sessões do usuário são encerradas.
 */
export async function refreshSession(env: Env, deps: Deps, refreshToken: string): Promise<Session> {
  const now = deps.now();
  const hash = await hashToken(refreshToken);
  const row = await findRefreshToken(env.DB, hash);
  if (!row || row.revoked_at !== null) throw invalidSession();
  if (row.used_at !== null || !(await markRefreshTokenUsed(env.DB, hash, now))) {
    await revokeAllForUser(env.DB, row.user_id, now);
    throw invalidSession();
  }
  if (row.expires_at <= now) throw invalidSession();
  const user = await findUserById(env.DB, row.user_id);
  if (!user) throw invalidSession();
  return issueSession(env, deps, user, row.family_id);
}

export async function logout(env: Env, deps: Deps, refreshToken: string): Promise<void> {
  await revokeRefreshToken(env.DB, await hashToken(refreshToken), deps.now());
}
