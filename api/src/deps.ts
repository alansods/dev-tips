// Dependências que os testes substituem: as chaves do Google, o RevenueCat e o relógio.

import type { JWTVerifyGetKey } from 'jose';

import { googleKeys } from './auth/google';
import { revenueCatClient, type RevenueCatClient } from './billing/revenuecat';

export type Deps = { googleKeys: JWTVerifyGetKey; revenueCat: RevenueCatClient; now: () => number };

export const defaultDeps = (): Deps => ({
  googleKeys: googleKeys(),
  revenueCat: revenueCatClient(),
  now: () => Date.now(),
});
