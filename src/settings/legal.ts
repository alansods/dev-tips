// Endereços da política de privacidade e dos termos (app.json → extra.legal).

import Constants from 'expo-constants';

export type LegalUrls = { privacyUrl: string; termsUrl: string };

export function legalUrls(): LegalUrls | null {
  return (Constants.expoConfig?.extra?.legal as LegalUrls | undefined) ?? null;
}
