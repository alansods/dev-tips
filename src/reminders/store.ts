// Configuração dos lembretes (ligado/desligado e horário), salva no aparelho.
// Dados inválidos ou ilegíveis voltam ao padrão: desligado, às 20:00.

import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { safeJSONStorage } from '../storage/safeStorage';
import { REMINDER_TIMES, type ReminderTime } from './plan';

export const REMINDERS_STORAGE_KEY = 'dev-tips:reminders';

type RemindersData = { enabled: boolean; time: ReminderTime };
type RemindersState = RemindersData & {
  /** A última tentativa de ligar teve a permissão negada (só nesta sessão). */
  permissionDenied: boolean;
  setEnabled: (enabled: boolean) => void;
  setTime: (time: ReminderTime) => void;
  setPermissionDenied: (denied: boolean) => void;
};

const savedSchema = z.object({ enabled: z.boolean(), time: z.enum(REMINDER_TIMES) });
const initialData = (): RemindersData => ({ enabled: false, time: '20:00' });

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set) => ({
      ...initialData(),
      permissionDenied: false,
      setEnabled: (enabled) => set(enabled ? { enabled, permissionDenied: false } : { enabled }),
      setTime: (time) => set({ time }),
      setPermissionDenied: (permissionDenied) => set({ permissionDenied }),
    }),
    {
      name: REMINDERS_STORAGE_KEY,
      version: 1,
      storage: safeJSONStorage<RemindersData>(),
      partialize: (s): RemindersData => ({ enabled: s.enabled, time: s.time }),
      merge: (saved, current) => {
        const parsed = savedSchema.safeParse(saved);
        return parsed.success ? { ...current, ...parsed.data } : { ...current, ...initialData() };
      },
    },
  ),
);

/** Volta ao padrão (usado nos testes). */
export function resetRemindersStore() {
  useRemindersStore.setState({ ...initialData(), permissionDenied: false });
}
