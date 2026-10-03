// Observa os stores de estudo e de ajustes e põe cada mudança na fila de
// sincronização (só com conta). Os stores não sabem que a sincronização existe.

import { useAccountStore } from '../auth/store';
import { useSettingsStore } from '../i18n/store';
import { useStudyStore } from '../study/store';
import { isApplyingRemote } from './applying';
import { cardChange, changedKeys } from './cards';
import { syncNow } from './engine';
import { useSyncStore } from './store';

export function startSyncTracking({ debounceMs = 5_000 }: { debounceMs?: number } = {}): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const signedIn = () => useAccountStore.getState().user !== null;

  // Horários sempre crescentes: duas mudanças no mesmo milissegundo não podem
  // empatar, senão a API descartaria a segunda ("a mais recente vence").
  const markSettings = () => {
    useSyncStore.setState((s) => ({
      settingsStamp: Math.max(Date.now(), s.settingsStamp + 1),
      pendingSettings: signedIn() || s.pendingSettings,
    }));
  };

  const stopStudy = useStudyStore.subscribe((next, prev) => {
    if (isApplyingRemote()) return;
    const keys = changedKeys(prev, next);
    if (keys.length > 0) {
      const now = Date.now();
      useSyncStore.setState((s) => {
        const stamps = { ...s.stamps };
        const pendingCards = { ...s.pendingCards };
        for (const key of keys) {
          const stamp = Math.max(now, (stamps[key] ?? 0) + 1);
          stamps[key] = stamp; // horário local guardado sempre, com ou sem conta
          if (signedIn()) pendingCards[key] = cardChange(key, next.progress, next.schedule, stamp);
        }
        return { stamps, pendingCards };
      });
      if (signedIn()) {
        clearTimeout(timer);
        timer = setTimeout(() => void syncNow(), debounceMs);
      }
    }
    if (next.preferredVariant !== prev.preferredVariant) markSettings();
  });

  const stopSettings = useSettingsStore.subscribe((next, prev) => {
    if (!isApplyingRemote() && next.language !== prev.language) markSettings();
  });

  const stopAccount = useAccountStore.subscribe((next, prev) => {
    if (prev.user && !next.user) useSyncStore.getState().clearAccount();
  });

  return () => {
    clearTimeout(timer);
    stopStudy();
    stopSettings();
    stopAccount();
  };
}
