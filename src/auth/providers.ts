// Único ponto do app que fala com a biblioteca nativa do Google Sign-In.
// A biblioteca é carregada só na hora do login: no Expo Go (sem o módulo
// nativo) o app abre normalmente e só o login falha.

import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from './config';

export type GoogleResult = { type: 'success'; idToken: string } | { type: 'cancelled' };

type GoogleModule = typeof import('@react-native-google-signin/google-signin');

let loaded: GoogleModule | null = null;
async function google(): Promise<GoogleModule> {
  if (!loaded) {
    loaded = await import('@react-native-google-signin/google-signin');
    loaded.GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID, // faz o Google emitir o idToken para a nossa API
      iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    });
  }
  return loaded;
}

/** Abre o login do Google. Cancelar devolve `{ type: 'cancelled' }`; outros erros são lançados. */
export async function signInWithGoogle(): Promise<GoogleResult> {
  const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } = await google();
  try {
    await GoogleSignin.hasPlayServices();
    const res = await GoogleSignin.signIn();
    if (isSuccessResponse(res) && res.data.idToken) return { type: 'success', idToken: res.data.idToken };
    return { type: 'cancelled' };
  } catch (e) {
    if (isErrorWithCode(e) && e.code === statusCodes.SIGN_IN_CANCELLED) return { type: 'cancelled' };
    throw e;
  }
}

/** Desconecta a conta Google do app (no próximo login, o Google pergunta a conta de novo). */
export async function signOutFromGoogle(): Promise<void> {
  try {
    await (await google()).GoogleSignin.signOut();
  } catch {
    // sem efeito se o módulo não existir ou já estiver desconectado
  }
}
