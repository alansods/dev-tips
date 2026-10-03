// Tokens da sessão no armazenamento seguro do aparelho (Keychain no iOS,
// Keystore no Android). Falhas de leitura/escrita viram "sem sessão".

import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'dev-tips.accessToken';
const REFRESH_KEY = 'dev-tips.refreshToken';

export type Tokens = { accessToken: string; refreshToken: string };

export async function readTokens(): Promise<Tokens | null> {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
    ]);
    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  } catch {
    return null;
  }
}

export async function saveTokens(tokens: Tokens): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([SecureStore.deleteItemAsync(ACCESS_KEY), SecureStore.deleteItemAsync(REFRESH_KEY)]).catch(
    () => {},
  );
}

/** Esvazia o SecureStore simulado do Jest (sem efeito no app). */
export function __resetSecureStoreForTests() {
  (SecureStore as unknown as { __clear?: () => void }).__clear?.();
}
