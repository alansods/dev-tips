// Usuário conectado (nome, e-mail, foto), salvo no aparelho para a seção
// Conta aparecer certa ao reabrir o app. Os tokens ficam em tokens.ts.

import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { safeJSONStorage } from '../storage/safeStorage';

export const ACCOUNT_STORAGE_KEY = 'dev-tips:account';

export type AccountUser = { id: string; name: string | null; email: string | null; photoUrl: string | null };

type AccountData = { user: AccountUser | null };
type AccountState = AccountData & { setUser: (user: AccountUser | null) => void };

const savedSchema = z.object({
  user: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string().nullable(),
      photoUrl: z.string().nullable(),
    })
    .nullable(),
});

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: ACCOUNT_STORAGE_KEY,
      version: 1,
      storage: safeJSONStorage<AccountData>(),
      partialize: (s): AccountData => ({ user: s.user }),
      merge: (saved, current) => {
        const parsed = savedSchema.safeParse(saved);
        return parsed.success ? { ...current, ...parsed.data } : { ...current, user: null };
      },
    },
  ),
);
