// "Google falso" para os testes: um par de chaves RSA local assina ID tokens
// no formato do Google, e a API recebe a chave pública no lugar das reais.

import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose';

export const WEB_CLIENT_ID = 'client-web.apps.googleusercontent.com';

type Claims = {
  sub: string;
  email: string;
  name: string;
  picture: string;
  aud: string;
  iss: string;
  /** Segundos até expirar (negativo = já expirado). */
  expiresIn: number;
};

export async function fakeGoogle() {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwk = { ...(await exportJWK(publicKey)), kid: 'chave-de-teste', alg: 'RS256' };
  const keys = createLocalJWKSet({ keys: [jwk] });

  async function idToken(overrides: Partial<Claims> = {}) {
    const c: Claims = {
      sub: 'google-sub-ana',
      email: 'ana@example.com',
      name: 'Ana',
      picture: 'https://example.com/ana.png',
      aud: WEB_CLIENT_ID,
      iss: 'https://accounts.google.com',
      expiresIn: 3600,
      ...overrides,
    };
    const now = Math.floor(Date.now() / 1000);
    return new SignJWT({ email: c.email, name: c.name, picture: c.picture })
      .setProtectedHeader({ alg: 'RS256', kid: 'chave-de-teste' })
      .setSubject(c.sub)
      .setIssuer(c.iss)
      .setAudience(c.aud)
      .setIssuedAt(now)
      .setExpirationTime(now + c.expiresIn)
      .sign(privateKey);
  }

  return { keys, idToken };
}
