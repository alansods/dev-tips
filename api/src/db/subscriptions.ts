// Acesso às tabelas subscriptions e question_usage.

export type Subscription = {
  periodStart: number;
  expiresAt: number;
  willRenew: boolean;
  productId: string | null;
  lastEventAt: number;
};

type Row = {
  period_start: number;
  expires_at: number;
  will_renew: number;
  product_id: string | null;
  last_event_at: number;
};

const toSubscription = (r: Row): Subscription => ({
  periodStart: r.period_start,
  expiresAt: r.expires_at,
  willRenew: r.will_renew === 1,
  productId: r.product_id,
  lastEventAt: r.last_event_at,
});

export async function findSubscription(db: D1Database, userId: string): Promise<Subscription | null> {
  const row = await db
    .prepare(
      'SELECT period_start, expires_at, will_renew, product_id, last_event_at FROM subscriptions WHERE user_id = ?',
    )
    .bind(userId)
    .first<Row>();
  return row ? toSubscription(row) : null;
}

/** Grava (insere ou substitui) a assinatura do usuário. */
export async function saveSubscription(db: D1Database, userId: string, s: Subscription): Promise<void> {
  await db
    .prepare(
      `INSERT INTO subscriptions (user_id, period_start, expires_at, will_renew, product_id, last_event_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT (user_id) DO UPDATE SET period_start = excluded.period_start, expires_at = excluded.expires_at,
         will_renew = excluded.will_renew, product_id = excluded.product_id, last_event_at = excluded.last_event_at`,
    )
    .bind(userId, s.periodStart, s.expiresAt, s.willRenew ? 1 : 0, s.productId, s.lastEventAt)
    .run();
}

/** Perguntas respondidas no período (0 quando ainda não há linha). */
export async function questionUsage(db: D1Database, userId: string, periodStart: number): Promise<number> {
  const row = await db
    .prepare('SELECT used FROM question_usage WHERE user_id = ? AND period_start = ?')
    .bind(userId, periodStart)
    .first<{ used: number }>();
  return row?.used ?? 0;
}

export async function incrementQuestionUsage(db: D1Database, userId: string, periodStart: number): Promise<void> {
  await db
    .prepare(
      `INSERT INTO question_usage (user_id, period_start, used) VALUES (?, ?, 1)
       ON CONFLICT (user_id, period_start) DO UPDATE SET used = used + 1`,
    )
    .bind(userId, periodStart)
    .run();
}
