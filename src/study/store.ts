// Estado de estudo compartilhado pelo app: progresso de cada card e a aba de
// framework preferida por tema. Vive só em memória nesta versão; a change
// `progress` acrescenta persistência (middleware `persist`) sem mudar a API.

import { create } from 'zustand';

import { progressKey, type AnswerResult, type Progress } from './rules';

type StudyState = {
  progress: Progress;
  preferredVariant: Record<string, string>;
  answer: (themeId: string, cardId: string, result: AnswerResult) => void;
  setVariant: (themeId: string, variantId: string) => void;
};

const initialData = { progress: {}, preferredVariant: {} };

export const useStudyStore = create<StudyState>()((set) => ({
  ...initialData,
  answer: (themeId, cardId, result) =>
    set((s) => ({ progress: { ...s.progress, [progressKey(themeId, cardId)]: result } })),
  setVariant: (themeId, variantId) =>
    set((s) => ({ preferredVariant: { ...s.preferredVariant, [themeId]: variantId } })),
}));

/** Volta o store ao estado inicial (usado nos testes). */
export function resetStudyStore() {
  useStudyStore.setState(initialData);
}
