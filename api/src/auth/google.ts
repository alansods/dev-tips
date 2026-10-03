// Validação do ID token do Google: assinatura pelas chaves públicas do Google,
// emissor, público (um dos nossos client IDs) e validade.

import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';

import { AppError } from '../errors';

const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

let remoteKeys: JWTVerifyGetKey | undefined;
/** Chaves públicas do Google, baixadas sob demanda e guardadas em cache pelo jose. */
export function googleKeys(): JWTVerifyGetKey {
  remoteKeys ??= createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
  return remoteKeys;
}

export type GoogleProfile = { sub: string; email: string | null; name: string | null; picture: string | null };

const str = (v: unknown) => (typeof v === 'string' ? v : null);

export async function verifyGoogleIdToken(
  idToken: string,
  keys: JWTVerifyGetKey,
  clientIds: string[],
): Promise<GoogleProfile> {
  try {
    const { payload } = await jwtVerify(idToken, keys, { issuer: GOOGLE_ISSUERS, audience: clientIds });
    if (!payload.sub) throw new Error('sem sub');
    return { sub: payload.sub, email: str(payload.email), name: str(payload.name), picture: str(payload.picture) };
  } catch {
    throw new AppError(401, 'invalid_token', 'Token do Google inválido.');
  }
}
