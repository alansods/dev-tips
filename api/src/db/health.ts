// Acesso ao banco para a verificação de saúde: só confere se o D1 responde.

export async function pingDatabase(db: D1Database): Promise<void> {
  await db.prepare('SELECT 1').first();
}
