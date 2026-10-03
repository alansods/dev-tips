// `true` quando um store persistido do Zustand terminou de carregar do aparelho.
// Evita decidir algo (ex.: mostrar o login do primeiro uso) com o estado inicial.

import { useSyncExternalStore } from 'react';

type PersistApi = { persist: { hasHydrated: () => boolean; onFinishHydration: (fn: () => void) => () => void } };

export function useHydrated(store: PersistApi): boolean {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
  );
}
