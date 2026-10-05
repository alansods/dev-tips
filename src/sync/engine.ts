// Uma sincronização: envia a fila (em lotes), busca o que mudou na conta desde
// a última vez e aplica — a mudança mais recente vence, card a card. No primeiro
// login de um aparelho, junta todo o progresso local ao da conta.

import { authFetch, NetworkError } from '../auth/api';
import { useAccountStore } from '../auth/store';
import { useSettingsStore } from '../i18n/store';
import type { Box } from '../study/srs';
import { useStudyStore } from '../study/store';
import { applyingRemote } from './applying';
import { cardChange } from './cards';
import { useSyncStore, type CardChange } from './store';

export const BATCH_SIZE = 500;

type RemoteSettings = { language: 'pt-BR' | 'en' | null; preferredVariant: Record<string, string>; updatedAt: number };
type Pull = { cards: CardChange[]; settings?: RemoteSettings; serverTime: number };

/** Põe todo o estado local na fila (primeiro login). Cards sem horário conhecido valem como antigos. */
function queueEverything() {
  const { progress, schedule } = useStudyStore.getState();
  useSyncStore.setState((s) => {
    const pendingCards = { ...s.pendingCards };
    for (const key of new Set([...Object.keys(progress), ...Object.keys(schedule)])) {
      pendingCards[key] ??= cardChange(key, progress, schedule, s.stamps[key] ?? 1);
    }
    return { pendingCards, pendingSettings: true };
  });
}

async function push() {
  const { pendingCards, pendingSettings, settingsStamp } = useSyncStore.getState();
  const cards = Object.entries(pendingCards);
  const settings = pendingSettings
    ? {
        language: useSettingsStore.getState().language,
        preferredVariant: useStudyStore.getState().preferredVariant,
        updatedAt: settingsStamp,
      }
    : undefined;
  if (cards.length === 0 && !settings) return;

  for (let i = 0; i < Math.max(cards.length, 1); i += BATCH_SIZE) {
    const batch = cards.slice(i, i + BATCH_SIZE);
    await authFetch('/sync', {
      method: 'PUT',
      body: JSON.stringify({ cards: batch.map(([, c]) => c), ...(i === 0 && settings ? { settings } : {}) }),
    });
    // Tira da fila só o que não mudou de novo enquanto a requisição viajava.
    useSyncStore.setState((s) => {
      const left = { ...s.pendingCards };
      for (const [key, sent] of batch) if (left[key]?.updatedAt === sent.updatedAt) delete left[key];
      return {
        pendingCards: left,
        pendingSettings: i === 0 && settings && s.settingsStamp === settings.updatedAt ? false : s.pendingSettings,
      };
    });
  }
}

function apply(pull: Pull) {
  const sync = useSyncStore.getState();
  const study = useStudyStore.getState();
  const progress = { ...study.progress };
  const schedule = { ...study.schedule };
  const stamps = { ...sync.stamps };
  let changed = false;

  for (const c of pull.cards) {
    const key = `${c.trackId}:${c.cardId}`;
    if (c.updatedAt <= (stamps[key] ?? 0)) continue; // a versão local é mais nova (ou igual)
    if (c.result) progress[key] = c.result;
    else delete progress[key];
    if (c.box && c.due) schedule[key] = { box: c.box as Box, due: c.due };
    else delete schedule[key];
    stamps[key] = c.updatedAt;
    changed = true;
  }

  const settings = pull.settings && pull.settings.updatedAt > sync.settingsStamp ? pull.settings : undefined;

  applyingRemote(() => {
    if (changed) useStudyStore.setState({ progress, schedule });
    if (settings) {
      useStudyStore.setState({ preferredVariant: settings.preferredVariant });
      if (settings.language) useSettingsStore.getState().setLanguage(settings.language);
      else useSettingsStore.setState({ language: null });
    }
  });
  useSyncStore.setState({ stamps, ...(settings ? { settingsStamp: settings.updatedAt } : {}) });
}

async function run(): Promise<void> {
  const user = useAccountStore.getState().user;
  if (!user) return;
  const firstLogin = useSyncStore.getState().syncedUserId !== user.id;
  if (firstLogin) {
    useSyncStore.setState({ lastServerTime: null });
    queueEverything();
  }
  useSyncStore.setState({ status: 'syncing' });
  try {
    await push();
    const since = useSyncStore.getState().lastServerTime;
    const pull = await authFetch<Pull>(since === null ? '/sync' : `/sync?since=${since}`);
    if (useAccountStore.getState().user?.id !== user.id) return; // saiu no meio
    apply(pull);
    useSyncStore.setState({
      lastServerTime: pull.serverTime,
      lastSyncedAt: Date.now(),
      status: 'idle',
      syncedUserId: user.id,
      ...(firstLogin ? { firstSyncToast: true } : {}),
    });
  } catch (e) {
    useSyncStore.setState({ status: e instanceof NetworkError ? 'offline' : 'error' });
  }
}

let running: Promise<void> | null = null;

/** Sincroniza agora (uma por vez: chamadas simultâneas esperam a mesma). */
export function syncNow(): Promise<void> {
  running ??= run().finally(() => {
    running = null;
  });
  return running;
}
