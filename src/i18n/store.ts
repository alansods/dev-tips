// Idioma escolhido em Ajustes, salvo no aparelho. `null` = seguir o aparelho.
// Valor salvo inválido ou ilegível também vira `null`, sem erro.

import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { safeJSONStorage } from '../storage/safeStorage';
import { LANGUAGES, type Language } from './language';

export const SETTINGS_STORAGE_KEY = 'dev-tips:settings';

type SettingsData = { language: Language | null };
type SettingsState = SettingsData & { setLanguage: (language: Language) => void };

const savedSchema = z.object({ language: z.enum(LANGUAGES).nullable() });

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: null,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 1,
      storage: safeJSONStorage<SettingsData>(),
      partialize: (s): SettingsData => ({ language: s.language }),
      merge: (saved, current) => {
        const parsed = savedSchema.safeParse(saved);
        return parsed.success ? { ...current, ...parsed.data } : { ...current, language: null };
      },
    },
  ),
);
