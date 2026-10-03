-- Progresso e preferências na conta (change add-cloud-sync).
-- updated_at: momento da mudança no aparelho (decide conflitos: a mais recente vence).
-- server_updated_at: momento em que o servidor guardou (base do GET /sync?since=).

CREATE TABLE card_progress (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  result TEXT,                         -- 'known' | 'unknown' | NULL (zerado)
  box INTEGER,                         -- 1 a 5 | NULL
  due TEXT,                            -- YYYY-MM-DD | NULL
  updated_at INTEGER NOT NULL,
  server_updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, theme_id, card_id)
);

CREATE INDEX card_progress_since ON card_progress (user_id, server_updated_at);

CREATE TABLE user_settings (
  user_id TEXT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  language TEXT,                       -- 'pt-BR' | 'en' | NULL (seguir o aparelho)
  preferred_variant TEXT NOT NULL,     -- JSON { themeId: variantId }
  updated_at INTEGER NOT NULL,
  server_updated_at INTEGER NOT NULL
);
