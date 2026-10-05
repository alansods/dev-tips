// Estado de estudo compartilhado pelo app: progresso de cada card e a aba de
// framework preferida por trilha. Fica salvo no aparelho (AsyncStorage) e é
// restaurado ao abrir; falhas de leitura/escrita ou dados inválidos nunca
// quebram o app — no pior caso ele começa sem progresso.

import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { safeJSONStorage } from '../storage/safeStorage';

import { today } from './clock';
import { progressKey, type AnswerResult, type Progress } from './rules';
import { nextSchedule, type Schedule } from './srs';

export const STUDY_STORAGE_KEY = 'dev-tips:study';

type StudyData = {
  progress: Progress;
  preferredVariant: Record<string, string>;
  /** Repetição espaçada: caixa e data de revisão por `trackId:cardId`. */
  schedule: Schedule;
  /** Último dia (YYYY-MM-DD) em que algum card foi respondido; usado pelos lembretes. */
  lastStudyDay: string | null;
};

type StudyState = StudyData & {
  answer: (trackId: string, cardId: string, result: AnswerResult) => void;
  setVariant: (trackId: string, variantId: string) => void;
  resetTrack: (trackId: string) => void;
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
  lastStudyDay: z.string().nullable().default(null),
});

/** Remove do registro as chaves da trilha (`trackId:...`). */
function withoutTrack<T>(record: Record<string, T>, trackId: string): Record<string, T> {
  return Object.fromEntries(Object.entries(record).filter(([key]) => !key.startsWith(`${trackId}:`)));
}

const initialData = (): StudyData => ({ progress: {}, preferredVariant: {}, schedule: {}, lastStudyDay: null });

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      ...initialData(),
      answer: (trackId, cardId, result) =>
        set((s) => {
          const key = progressKey(trackId, cardId);
          const day = today();
          return {
            progress: { ...s.progress, [key]: result },
            schedule: { ...s.schedule, [key]: nextSchedule(s.schedule[key], result, day) },
            lastStudyDay: day,
          };
        }),
      setVariant: (trackId, variantId) =>
        set((s) => ({ preferredVariant: { ...s.preferredVariant, [trackId]: variantId } })),
      resetTrack: (trackId) =>
        set((s) => ({
          progress: withoutTrack(s.progress, trackId),
          schedule: withoutTrack(s.schedule, trackId),
        })),
    }),
    {
      name: STUDY_STORAGE_KEY,
      version: 2,
      storage: safeJSONStorage<StudyData>(),
      partialize: (s): StudyData => ({
        progress: s.progress,
        preferredVariant: s.preferredVariant,
        schedule: s.schedule,
        lastStudyDay: s.lastStudyDay,
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
