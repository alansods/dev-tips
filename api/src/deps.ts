// Dependências que os testes substituem: as chaves do Google, o RevenueCat, o Gemini e o relógio.

import type { JWTVerifyGetKey } from 'jose';

import { geminiClient, type GeminiClient } from './assistant/gemini';
import { googleKeys } from './auth/google';
import { revenueCatClient, type RevenueCatClient } from './billing/revenuecat';

export type Deps = {
  googleKeys: JWTVerifyGetKey;
  revenueCat: RevenueCatClient;
  gemini: GeminiClient;
  now: () => number;
};

export const defaultDeps = (): Deps => ({
  googleKeys: googleKeys(),
  revenueCat: revenueCatClient(),
  gemini: geminiClient(),
  now: () => Date.now(),
});
