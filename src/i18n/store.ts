// Preferências do app salvas no aparelho: o idioma escolhido em Ajustes
// (`null` = seguir o aparelho) e se a tela de boas-vindas/login já foi vista.
// Valores salvos inválidos ou ilegíveis voltam ao padrão, sem erro.

import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { safeJSONStorage } from '../storage/safeStorage';
import { LANGUAGES, type Language } from './language';

export const SETTINGS_STORAGE_KEY = 'dev-tips:settings';

type SettingsData = { language: Language | null; onboardingSeen: boolean };
type SettingsState = SettingsData & {
  setLanguage: (language: Language) => void;
  setOnboardingSeen: () => void;
};

// Cada campo com o próprio padrão: um campo inválido não apaga os outros.
const savedSchema = z.object({
  language: z.enum(LANGUAGES).nullable().catch(null),
  onboardingSeen: z.boolean().catch(false),
});

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: null,
      onboardingSeen: false,
      setLanguage: (language) => set({ language }),
      setOnboardingSeen: () => set({ onboardingSeen: true }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 1,
      storage: safeJSONStorage<SettingsData>(),
      partialize: (s): SettingsData => ({ language: s.language, onboardingSeen: s.onboardingSeen }),
      // Sem nada salvo, o Zustand chama merge com `undefined`: mantém o estado atual.
      merge: (saved, current) => (saved ? { ...current, ...savedSchema.parse(saved) } : current),
    },
  ),
);
