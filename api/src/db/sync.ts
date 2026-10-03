// Acesso às tabelas de sincronização. Cada gravação só vale se for mais nova
// (updated_at maior) que a guardada: "a mudança mais recente vence".

export type CardChange = {
  themeId: string;
  cardId: string;
  result: 'known' | 'unknown' | null;
  box: number | null;
  due: string | null;
  updatedAt: number;
};

export type SettingsChange = {
  language: 'pt-BR' | 'en' | null;
  preferredVariant: Record<string, string>;
  updatedAt: number;
};

/** Grava cards e preferências num único lote atômico (db.batch). */
export async function upsertChanges(
  db: D1Database,
  userId: string,
  cards: CardChange[],
  settings: SettingsChange | undefined,
  serverNow: number,
): Promise<void> {
  const statements = cards.map((c) =>
    db
      .prepare(
        `INSERT INTO card_progress (user_id, theme_id, card_id, result, box, due, updated_at, server_updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (user_id, theme_id, card_id) DO UPDATE SET
           result = excluded.result, box = excluded.box, due = excluded.due,
           updated_at = excluded.updated_at, server_updated_at = excluded.server_updated_at
         WHERE excluded.updated_at > card_progress.updated_at`,
      )
      .bind(userId, c.themeId, c.cardId, c.result, c.box, c.due, c.updatedAt, serverNow),
  );
  if (settings) {
    statements.push(
      db
        .prepare(
          `INSERT INTO user_settings (user_id, language, preferred_variant, updated_at, server_updated_at)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT (user_id) DO UPDATE SET
             language = excluded.language, preferred_variant = excluded.preferred_variant,
             updated_at = excluded.updated_at, server_updated_at = excluded.server_updated_at
           WHERE excluded.updated_at > user_settings.updated_at`,
        )
        .bind(userId, settings.language, JSON.stringify(settings.preferredVariant), settings.updatedAt, serverNow),
    );
  }
  if (statements.length > 0) await db.batch(statements);
}

type CardRow = {
  theme_id: string;
  card_id: string;
  result: CardChange['result'];
  box: number | null;
  due: string | null;
  updated_at: number;
};
type SettingsRow = { language: SettingsChange['language']; preferred_variant: string; updated_at: number };

/** Cards e preferências guardados depois de `since` (relógio do servidor); sem `since`, tudo. */
export async function changesSince(
  db: D1Database,
  userId: string,
  since: number | null,
): Promise<{ cards: CardChange[]; settings?: SettingsChange }> {
  const after = since ?? -1;
  const [cards, settings] = await db.batch([
    db
      .prepare(
        `SELECT theme_id, card_id, result, box, due, updated_at FROM card_progress
         WHERE user_id = ? AND server_updated_at > ? ORDER BY theme_id, card_id`,
      )
      .bind(userId, after),
    db
      .prepare(
        'SELECT language, preferred_variant, updated_at FROM user_settings WHERE user_id = ? AND server_updated_at > ?',
      )
      .bind(userId, after),
  ]);
  const settingsRow = (settings.results as SettingsRow[])[0];
  return {
    cards: (cards.results as CardRow[]).map((r) => ({
      themeId: r.theme_id,
      cardId: r.card_id,
      result: r.result,
      box: r.box,
      due: r.due,
      updatedAt: r.updated_at,
    })),
    ...(settingsRow
      ? {
          settings: {
            language: settingsRow.language,
            preferredVariant: JSON.parse(settingsRow.preferred_variant) as Record<string, string>,
            updatedAt: settingsRow.updated_at,
          },
        }
      : {}),
  };
}
