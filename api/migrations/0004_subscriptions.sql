-- Assinatura Pro e uso de perguntas (change add-subscriptions).
-- Ativa = expires_at no futuro. O ciclo da cota é identificado por period_start
-- (compra ou última renovação): uma renovação começa uma linha nova em question_usage.

CREATE TABLE subscriptions (
  user_id TEXT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  period_start INTEGER NOT NULL,       -- ms: início do período atual
  expires_at INTEGER NOT NULL,         -- ms: fim do período atual
  will_renew INTEGER NOT NULL,         -- 1 = renovação automática ligada
  product_id TEXT,
  last_event_at INTEGER NOT NULL       -- ms: event_timestamp_ms do último evento aplicado
);

CREATE TABLE question_usage (
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  period_start INTEGER NOT NULL,
  used INTEGER NOT NULL,
  PRIMARY KEY (user_id, period_start)
);
