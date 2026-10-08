// Preferências do app salvas no aparelho: o idioma escolhido no Perfil
// (`null` = seguir o aparelho), se a tela de boas-vindas/login já foi vista e
// as áreas de interesse (usadas nas sugestões do Início).
// Valores salvos inválidos ou ilegíveis voltam ao padrão, sem erro.

import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AREAS, type Area } from '../content/schema';
import { safeJSONStorage } from '../storage/safeStorage';
import { LANGUAGES, type Language } from './language';

export const SETTINGS_STORAGE_KEY = 'dev-tips:settings';

type SettingsData = { language: Language | null; onboardingSeen: boolean; interests: Area[] };
type SettingsState = SettingsData & {
  setLanguage: (language: Language) => void;
  setOnboardingSeen: () => void;
  /** Marca ou desmarca uma área de interesse. */
  toggleInterest: (area: Area) => void;
};

// Cada campo com o próprio padrão: um campo inválido não apaga os outros.
const savedSchema = z.object({
  language: z.enum(LANGUAGES).nullable().catch(null),
  onboardingSeen: z.boolean().catch(false),
  interests: z.array(z.enum(AREAS)).catch([]),
});

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: null,
      onboardingSeen: false,
      interests: [],
      setLanguage: (language) => set({ language }),
      setOnboardingSeen: () => set({ onboardingSeen: true }),
      toggleInterest: (area) =>
        set((s) => ({
          interests: s.interests.includes(area) ? s.interests.filter((a) => a !== area) : [...s.interests, area],
        })),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 1,
      storage: safeJSONStorage<SettingsData>(),
      partialize: (s): SettingsData => ({
        language: s.language,
        onboardingSeen: s.onboardingSeen,
        interests: s.interests,
      }),
      // Sem nada salvo, o Zustand chama merge com `undefined`: mantém o estado atual.
      merge: (saved, current) => (saved ? { ...current, ...savedSchema.parse(saved) } : current),
    },
  ),
);
