-- Usuários e sessões (change add-auth).

CREATE TABLE users (
  id TEXT PRIMARY KEY,                 -- UUID gerado pela API
  provider TEXT NOT NULL,              -- 'google' (espaço para outros provedores no futuro)
  provider_sub TEXT NOT NULL,          -- "sub" do ID token: id permanente no provedor
  name TEXT,
  email TEXT,
  photo_url TEXT,
  created_at INTEGER NOT NULL,         -- ms desde a época
  UNIQUE (provider, provider_sub)
);

CREATE TABLE refresh_tokens (
  token_hash TEXT PRIMARY KEY,         -- SHA-256 do token; o token em si nunca é guardado
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  family_id TEXT NOT NULL,             -- todas as renovações de um mesmo login
  expires_at INTEGER NOT NULL,
  used_at INTEGER,                     -- preenchido quando o token é trocado por um novo
  revoked_at INTEGER,                  -- preenchido no logout ou ao detectar reuso
  created_at INTEGER NOT NULL
);

CREATE INDEX refresh_tokens_user ON refresh_tokens (user_id);
