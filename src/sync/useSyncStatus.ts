// Estado da sincronização para exibir, atualizado a cada 30 s ("há N minutos").

import { useEffect, useState } from 'react';

import { useT } from '../i18n';
import { useIsOnline } from './network';
import { syncStatusView, type SyncStatusView } from './status';
import { useSyncStore } from './store';

export function useSyncStatus(): SyncStatusView {
  const t = useT();
  const online = useIsOnline();
  const status = useSyncStore((s) => s.status);
  const lastSyncedAt = useSyncStore((s) => s.lastSyncedAt);
  const pendingCount = useSyncStore((s) => Object.keys(s.pendingCards).length + (s.pendingSettings ? 1 : 0));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  return syncStatusView(t, { status, lastSyncedAt, pendingCount, online }, Math.max(now, lastSyncedAt ?? 0));
}
