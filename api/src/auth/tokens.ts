// Tokens da sessão própria da API:
// - access token: JWT HS256 de 15 min, enviado em cada requisição;
// - refresh token: valor aleatório de 30 dias, guardado no banco só como hash.

import { sign, verify } from 'hono/jwt';

export const ACCESS_TTL_MS = 15 * 60 * 1000;
export const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function signAccessToken(userId: string, secret: string, now: number): Promise<string> {
  const iat = Math.floor(now / 1000);
  return sign({ sub: userId, iat, exp: iat + ACCESS_TTL_MS / 1000 }, secret, 'HS256');
}

/** Id do usuário se o token for válido e não expirado; senão `null`. */
export async function verifyAccessToken(token: string, secret: string): Promise<string | null> {
  try {
    const payload = await verify(token, secret, 'HS256');
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

/** 32 bytes aleatórios em base64url: impossível de adivinhar. */
export function newRefreshToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** SHA-256 em hexadecimal: é o que vai para o banco, nunca o token em si. */
export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
