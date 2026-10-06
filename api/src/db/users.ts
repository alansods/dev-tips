// Acesso à tabela users.

export type User = { id: string; name: string | null; email: string | null; photoUrl: string | null };

type Row = { id: string; name: string | null; email: string | null; photo_url: string | null };
const toUser = (r: Row): User => ({ id: r.id, name: r.name, email: r.email, photoUrl: r.photo_url });

export async function findUserByProvider(db: D1Database, provider: string, sub: string): Promise<User | null> {
  const row = await db
    .prepare('SELECT id, name, email, photo_url FROM users WHERE provider = ? AND provider_sub = ?')
    .bind(provider, sub)
    .first<Row>();
  return row ? toUser(row) : null;
}

export async function findUserById(db: D1Database, id: string): Promise<User | null> {
  const row = await db.prepare('SELECT id, name, email, photo_url FROM users WHERE id = ?').bind(id).first<Row>();
  return row ? toUser(row) : null;
}

export async function insertUser(
  db: D1Database,
  user: { provider: string; sub: string; name: string | null; email: string | null; photoUrl: string | null },
  now: number,
): Promise<User> {
  const id = crypto.randomUUID();
  await db
    .prepare(
      'INSERT INTO users (id, provider, provider_sub, name, email, photo_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(id, user.provider, user.sub, user.name, user.email, user.photoUrl, now)
    .run();
  return { id, name: user.name, email: user.email, photoUrl: user.photoUrl };
}

/** Atualiza nome, e-mail e foto a cada login (podem mudar na conta Google). */
export async function updateProfile(db: D1Database, id: string, profile: Omit<User, 'id'>): Promise<void> {
  await db
    .prepare('UPDATE users SET name = ?, email = ?, photo_url = ? WHERE id = ?')
    .bind(profile.name, profile.email, profile.photoUrl, id)
    .run();
}

/** Apaga o usuário, as sessões, os dados sincronizados, a assinatura e o uso de perguntas dele. */
export async function deleteUser(db: D1Database, id: string): Promise<void> {
  await db.batch([
    db.prepare('DELETE FROM card_progress WHERE user_id = ?').bind(id),
    db.prepare('DELETE FROM user_settings WHERE user_id = ?').bind(id),
    db.prepare('DELETE FROM subscriptions WHERE user_id = ?').bind(id),
    db.prepare('DELETE FROM question_usage WHERE user_id = ?').bind(id),
    db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').bind(id),
    db.prepare('DELETE FROM users WHERE id = ?').bind(id),
  ]);
}
