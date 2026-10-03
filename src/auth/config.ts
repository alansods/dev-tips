// Configuração pública do login (não são segredos): definida por perfil no
// EAS ou num .env local com o prefixo EXPO_PUBLIC_.

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://dev-tips-api.dev-tips-api.workers.dev';

/** Client ID "Web" do Google: o público (aud) que a API confere no ID token. */
export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

/** Client ID "iOS" do Google. */
export const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
