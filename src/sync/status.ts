// Texto do estado da sincronização mostrado na tela Conta e em Ajustes.

import type { Messages } from '../i18n';
import type { SyncStatus } from './store';

export type SyncStatusInput = {
  status: SyncStatus;
  lastSyncedAt: number | null;
  pendingCount: number;
  online: boolean;
};

export type SyncStatusView = { text: string; tone: 'ok' | 'busy' | 'waiting' | 'error' };

export function syncStatusView(t: Messages, s: SyncStatusInput, now: number): SyncStatusView {
  if (s.status === 'syncing') return { text: t.sync.syncing, tone: 'busy' };
  const disconnected = !s.online || s.status === 'offline';
  if (disconnected && s.pendingCount > 0) return { text: t.sync.waiting, tone: 'waiting' };
  if (s.status === 'error') return { text: t.sync.error, tone: 'error' };
  if (s.lastSyncedAt === null) return { text: disconnected ? t.sync.waiting : t.sync.syncing, tone: 'waiting' };
  const minutes = Math.floor((now - s.lastSyncedAt) / 60_000);
  return { text: minutes < 1 ? t.sync.synced : t.sync.syncedMinutes(minutes), tone: 'ok' };
}
