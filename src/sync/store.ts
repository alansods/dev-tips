// Estado da sincronização, salvo no aparelho: a fila de mudanças ainda não
// enviadas, o horário local de cada mudança (decide conflitos) e o ponto em que
// a última busca parou (`lastServerTime`, relógio do servidor).

import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { safeJSONStorage } from '../storage/safeStorage';

export const SYNC_STORAGE_KEY = 'dev-tips:sync';

export type CardChange = {
  themeId: string;
  cardId: string;
  result: 'known' | 'unknown' | null;
  box: number | null;
  due: string | null;
  updatedAt: number;
};

export type SyncStatus = 'idle' | 'syncing' | 'offline' | 'error';

type SyncData = {
  /** Conta cuja cópia local já foi juntada à nuvem (primeiro login feito). */
  syncedUserId: string | null;
  lastServerTime: number | null;
  lastSyncedAt: number | null;
  /** Horário local da última mudança de cada card (`themeId:cardId`). */
  stamps: Record<string, number>;
  settingsStamp: number;
  pendingCards: Record<string, CardChange>;
  pendingSettings: boolean;
};

type SyncState = SyncData & {
  status: SyncStatus;
  /** Mostrar "Seu progresso foi salvo na conta." (só nesta sessão). */
  firstSyncToast: boolean;
  dismissToast: () => void;
  /** Ao sair ou apagar a conta: esquece a fila e a conta sincronizada. */
  clearAccount: () => void;
};

const change = z.object({
  themeId: z.string(),
  cardId: z.string(),
  result: z.enum(['known', 'unknown']).nullable(),
  box: z.number().nullable(),
  due: z.string().nullable(),
  updatedAt: z.number(),
});
const savedSchema = z.object({
  syncedUserId: z.string().nullable(),
  lastServerTime: z.number().nullable(),
  lastSyncedAt: z.number().nullable(),
  stamps: z.record(z.string(), z.number()),
  settingsStamp: z.number(),
  pendingCards: z.record(z.string(), change),
  pendingSettings: z.boolean(),
});

const initialData = (): SyncData => ({
  syncedUserId: null,
  lastServerTime: null,
  lastSyncedAt: null,
  stamps: {},
  settingsStamp: 0,
  pendingCards: {},
  pendingSettings: false,
});

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      ...initialData(),
      status: 'idle',
      firstSyncToast: false,
      dismissToast: () => set({ firstSyncToast: false }),
      clearAccount: () =>
        set({
          syncedUserId: null,
          lastServerTime: null,
          lastSyncedAt: null,
          pendingCards: {},
          pendingSettings: false,
          status: 'idle',
        }),
    }),
    {
      name: SYNC_STORAGE_KEY,
      version: 1,
      storage: safeJSONStorage<SyncData>(),
      partialize: (s): SyncData => ({
        syncedUserId: s.syncedUserId,
        lastServerTime: s.lastServerTime,
        lastSyncedAt: s.lastSyncedAt,
        stamps: s.stamps,
        settingsStamp: s.settingsStamp,
        pendingCards: s.pendingCards,
        pendingSettings: s.pendingSettings,
      }),
      merge: (saved, current) => {
        if (!saved) return current;
        const parsed = savedSchema.safeParse(saved);
        return parsed.success ? { ...current, ...parsed.data } : current;
      },
    },
  ),
);

/** Volta ao estado inicial (usado nos testes). */
export function resetSyncStore() {
  useSyncStore.setState({ ...initialData(), status: 'idle', firstSyncToast: false });
}
