// Dependências que os testes substituem: as chaves do Google e o relógio.

import type { JWTVerifyGetKey } from 'jose';

import { googleKeys } from './auth/google';

export type Deps = { googleKeys: JWTVerifyGetKey; now: () => number };

export const defaultDeps = (): Deps => ({ googleKeys: googleKeys(), now: () => Date.now() });
