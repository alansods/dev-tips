// Acesso à tabela refresh_tokens (só hashes).

export type RefreshTokenRow = {
  token_hash: string;
  user_id: string;
  family_id: string;
  expires_at: number;
  used_at: number | null;
  revoked_at: number | null;
};

export async function insertRefreshToken(
  db: D1Database,
  t: { hash: string; userId: string; familyId: string; expiresAt: number },
  now: number,
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO refresh_tokens (token_hash, user_id, family_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?)',
    )
    .bind(t.hash, t.userId, t.familyId, t.expiresAt, now)
    .run();
}

export function findRefreshToken(db: D1Database, hash: string): Promise<RefreshTokenRow | null> {
  return db
    .prepare(
      'SELECT token_hash, user_id, family_id, expires_at, used_at, revoked_at FROM refresh_tokens WHERE token_hash = ?',
    )
    .bind(hash)
    .first<RefreshTokenRow>();
}

/**
 * Marca o token como usado só se ainda estiver livre. Devolve `false` se outra
 * requisição chegou antes (duas renovações com o mesmo token = reuso).
 */
export async function markRefreshTokenUsed(db: D1Database, hash: string, now: number): Promise<boolean> {
  const res = await db
    .prepare('UPDATE refresh_tokens SET used_at = ? WHERE token_hash = ? AND used_at IS NULL AND revoked_at IS NULL')
    .bind(now, hash)
    .run();
  return res.meta.changes === 1;
}

export async function revokeRefreshToken(db: D1Database, hash: string, now: number): Promise<void> {
  await db
    .prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL')
    .bind(now, hash)
    .run();
}

export async function revokeAllForUser(db: D1Database, userId: string, now: number): Promise<void> {
  await db
    .prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL')
    .bind(now, userId)
    .run();
}
