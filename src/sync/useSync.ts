// Liga a sincronização no app: rastreia as mudanças e sincroniza ao abrir,
// ao entrar na conta, ao voltar para o app e ao reconectar (e 5 s depois de
// responder cards, pelo rastreamento).

import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useAccountStore } from '../auth/store';
import { useHydrated } from '../storage/useHydrated';
import { useStudyStore } from '../study/store';
import { syncNow } from './engine';
import { onReconnect } from './network';
import { useSyncStore } from './store';
import { startSyncTracking } from './track';

export function useSync() {
  const userId = useAccountStore((s) => s.user?.id ?? null);
  const syncLoaded = useHydrated(useSyncStore);
  const studyLoaded = useHydrated(useStudyStore);
  const accountLoaded = useHydrated(useAccountStore);
  const ready = syncLoaded && studyLoaded && accountLoaded;

  useEffect(() => startSyncTracking(), []);

  useEffect(() => {
    if (ready && userId) void syncNow();
  }, [ready, userId]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void syncNow();
    });
    const stopNetwork = onReconnect(() => void syncNow());
    return () => {
      sub.remove();
      stopNetwork();
    };
  }, []);
}
