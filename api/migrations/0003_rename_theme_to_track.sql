-- "Tema" passou a se chamar "trilha" (change rename-theme-to-track).
-- RENAME COLUMN atualiza junto a chave primária e o índice, sem perder dados.
-- user_settings.preferred_variant guarda JSON { trackId: variantId }.

ALTER TABLE card_progress RENAME COLUMN theme_id TO track_id;
