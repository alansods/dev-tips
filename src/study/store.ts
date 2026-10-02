// Estado de estudo compartilhado pelo app: progresso de cada card e a aba de
// framework preferida por tema. Fica salvo no aparelho (AsyncStorage) e é
// restaurado ao abrir; falhas de leitura/escrita ou dados inválidos nunca
// quebram o app — no pior caso ele começa sem progresso.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import { today } from './clock';
import { progressKey, type AnswerResult, type Progress } from './rules';
import { nextSchedule, type Schedule } from './srs';

export const STUDY_STORAGE_KEY = 'dev-tips:study';

type StudyData = {
  progress: Progress;
  preferredVariant: Record<string, string>;
  /** Repetição espaçada: caixa e data de revisão por `themeId:cardId`. */
  schedule: Schedule;
};

type StudyState = StudyData & {
  answer: (themeId: string, cardId: string, result: AnswerResult) => void;
  setVariant: (themeId: string, variantId: string) => void;
  resetTheme: (themeId: string) => void;
};

const savedSchema = z.object({
  progress: z.record(z.string(), z.enum(['known', 'unknown'])),
  preferredVariant: z.record(z.string(), z.string()),
  schedule: z
    .record(
      z.string(),
      z.object({
        box: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
        due: z.string(),
      }),
    )
    .default({}),
});

/** AsyncStorage que engole falhas: leitura com erro vira "nada salvo"; escrita com erro é ignorada. */
const safeStorage: StateStorage = {
  getItem: async (name) => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // sem disco: o progresso segue em memória nesta sessão
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // ignorado
    }
  },
};

/** createJSONStorage falha com JSON corrompido; aqui ele vira "nada salvo". */
const jsonStorage = createJSONStorage<StudyData>(() => ({
  ...safeStorage,
  getItem: async (name) => {
    const raw = await safeStorage.getItem(name);
    if (raw == null) return null;
    try {
      JSON.parse(raw as string);
      return raw;
    } catch {
      return null;
    }
  },
}));

/** Remove do registro as chaves do tema (`themeId:...`). */
function withoutTheme<T>(record: Record<string, T>, themeId: string): Record<string, T> {
  return Object.fromEntries(Object.entries(record).filter(([key]) => !key.startsWith(`${themeId}:`)));
}

const initialData = (): StudyData => ({ progress: {}, preferredVariant: {}, schedule: {} });

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      ...initialData(),
      answer: (themeId, cardId, result) =>
        set((s) => {
          const key = progressKey(themeId, cardId);
          return {
            progress: { ...s.progress, [key]: result },
            schedule: { ...s.schedule, [key]: nextSchedule(s.schedule[key], result, today()) },
          };
        }),
      setVariant: (themeId, variantId) =>
        set((s) => ({ preferredVariant: { ...s.preferredVariant, [themeId]: variantId } })),
      resetTheme: (themeId) =>
        set((s) => ({
          progress: withoutTheme(s.progress, themeId),
          schedule: withoutTheme(s.schedule, themeId),
        })),
    }),
    {
      name: STUDY_STORAGE_KEY,
      version: 2,
      storage: jsonStorage,
      partialize: (s): StudyData => ({
        progress: s.progress,
        preferredVariant: s.preferredVariant,
        schedule: s.schedule,
      }),
      // v1 não tinha agendamento: mantém o progresso e começa o agendamento vazio.
      migrate: (saved, version) =>
        (version < 2 && saved && typeof saved === 'object' ? { ...saved, schedule: {} } : saved) as StudyData,
      // Só aceita o que foi salvo se tiver o formato esperado.
      merge: (saved, current) => {
        const parsed = savedSchema.safeParse(saved);
        return parsed.success ? { ...current, ...parsed.data } : current;
      },
    },
  ),
);

/** Volta o store ao estado inicial (usado nos testes). */
export function resetStudyStore() {
  useStudyStore.setState(initialData());
}
