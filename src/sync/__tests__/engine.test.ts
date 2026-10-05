import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAccountStore } from '../../auth/store';
import { saveTokens } from '../../auth/tokens';
import { useSettingsStore } from '../../i18n';
import { useRemindersStore } from '../../reminders/store';
import { progressKey } from '../../study/rules';
import { resetStudyStore, useStudyStore } from '../../study/store';
import { syncNow } from '../engine';
import { SYNC_STORAGE_KEY, resetSyncStore, useSyncStore } from '../store';
import { startSyncTracking } from '../track';
import { fakeServer } from '../__fixtures__/fakeServer';

const TRACK = 'crud-4-frameworks';
const key = (cardId: string) => progressKey(TRACK, cardId);
const study = () => useStudyStore.getState();
const ana = { id: 'u1', name: 'Ana', email: 'ana@example.com', photoUrl: null };

let server: ReturnType<typeof fakeServer>;
let fetchMock: jest.SpyInstance;
let stopTracking: () => void;

async function signIn(user = ana) {
  await saveTokens({ accessToken: 'a1', refreshToken: 'r1' });
  useAccountStore.setState({ user });
}

beforeEach(() => {
  resetStudyStore();
  resetSyncStore();
  server = fakeServer();
  fetchMock = server.install();
  stopTracking = startSyncTracking({ debounceMs: 5_000 });
});
afterEach(() => {
  stopTracking();
  fetchMock.mockRestore();
  jest.useRealTimers();
});

describe('Requirement: O que sincroniza', () => {
  it('Progresso em outro aparelho', async () => {
    await signIn();
    await syncNow(); // primeiro login: conta vazia
    server.putCard({
      trackId: TRACK,
      cardId: 'cors',
      result: 'known',
      box: 2,
      due: '2026-10-05',
      updatedAt: Date.now() + 1_000,
    });
    await syncNow();
    expect(study().progress[key('cors')]).toBe('known');
    expect(study().schedule[key('cors')]).toEqual({ box: 2, due: '2026-10-05' });
  });

  it('idioma e framework preferido vão para a conta', async () => {
    await signIn();
    await syncNow();
    useSettingsStore.getState().setLanguage('en');
    study().setVariant(TRACK, 'nest');
    await syncNow();
    expect(server.settings()).toMatchObject({ language: 'en', preferredVariant: { [TRACK]: 'nest' } });
  });

  it('Lembretes por aparelho', async () => {
    await signIn();
    useRemindersStore.setState({ enabled: true, time: '08:00' });
    await syncNow();
    const sent = fetchMock.mock.calls.map(([, init]) => String(init?.body ?? '')).join(' ');
    expect(sent).not.toMatch(/reminder|08:00/);
    expect(useRemindersStore.getState()).toMatchObject({ enabled: true, time: '08:00' });
  });

  it('Sem conta', async () => {
    study().answer(TRACK, 'cors', 'known');
    await syncNow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('Requirement: Quando sincronizar', () => {
  it('Depois de responder', async () => {
    await signIn();
    await syncNow();
    jest.useFakeTimers();
    const before = server.calls.length;
    study().answer(TRACK, 'api', 'known');
    study().answer(TRACK, 'crud', 'known');
    study().answer(TRACK, 'cors', 'unknown');
    jest.advanceTimersByTime(4_999);
    expect(server.calls.length).toBe(before);
    jest.advanceTimersByTime(1);
    jest.useRealTimers();
    await new Promise((r) => setTimeout(r, 0));
    await syncNow(); // espera a sincronização disparada terminar
    const puts = server.calls.slice(before).filter((c) => c === 'PUT /sync');
    expect(puts.length).toBeGreaterThanOrEqual(1);
    expect(server.card(TRACK, 'cors')?.result).toBe('unknown');
  });

  it('Offline e depois online', async () => {
    await signIn();
    await syncNow();
    server.setOffline(true);
    study().answer(TRACK, 'cors', 'known');
    await syncNow();
    expect(server.card(TRACK, 'cors')).toBeUndefined();
    // "fechar o app": a fila precisa estar salva no aparelho
    await new Promise((r) => setTimeout(r, 0));
    const saved = await AsyncStorage.getItem(SYNC_STORAGE_KEY);
    expect(JSON.parse(saved!).state.pendingCards[key('cors')]).toMatchObject({ result: 'known' });
    resetSyncStore();
    await AsyncStorage.setItem(SYNC_STORAGE_KEY, saved!);
    await useSyncStore.persist.rehydrate();
    server.setOffline(false);
    await syncNow();
    expect(server.card(TRACK, 'cors')?.result).toBe('known');
  });
});

describe('Requirement: Conflitos', () => {
  it('Mesmo card em dois aparelhos', async () => {
    await signIn();
    await syncNow();
    const t = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(t); // aparelho A responde às "10:00"
    study().answer(TRACK, 'cors', 'unknown');
    (Date.now as jest.Mock).mockRestore();
    // aparelho B, às "10:05", já tinha enviado "já sabia"
    server.putCard({
      trackId: TRACK,
      cardId: 'cors',
      result: 'known',
      box: 2,
      due: '2026-10-05',
      updatedAt: t + 5 * 60_000,
    });
    await syncNow();
    expect(study().progress[key('cors')]).toBe('known');
    expect(server.card(TRACK, 'cors')?.result).toBe('known');
  });

  it('Cards diferentes', async () => {
    await signIn();
    await syncNow();
    server.setOffline(true);
    study().answer(TRACK, 'api', 'known'); // aparelho A, offline
    server.putCard({
      trackId: TRACK,
      cardId: 'cors',
      result: 'known',
      box: 2,
      due: '2026-10-05',
      updatedAt: Date.now(),
    }); // aparelho B
    server.setOffline(false);
    await syncNow();
    expect(study().progress[key('api')]).toBe('known');
    expect(study().progress[key('cors')]).toBe('known');
    expect(server.card(TRACK, 'api')?.result).toBe('known');
  });
});

describe('Requirement: Primeiro login', () => {
  it('Aparelho com progresso, conta vazia', async () => {
    for (const id of ['api', 'crud', 'endpoint']) study().answer(TRACK, id, 'known');
    await signIn();
    await syncNow();
    expect(server.cardCount()).toBe(3);
    expect(useSyncStore.getState().firstSyncToast).toBe(true);
  });

  it('Os dois com progresso', async () => {
    study().answer(TRACK, 'api', 'known');
    server.putCard({ trackId: TRACK, cardId: 'cors', result: 'unknown', box: 1, due: '2026-10-02', updatedAt: 50 });
    await signIn();
    await syncNow();
    expect(study().progress[key('cors')]).toBe('unknown');
    expect(study().progress[key('api')]).toBe('known');
    expect(server.card(TRACK, 'api')?.result).toBe('known');
  });

  it('a mensagem aparece só no primeiro login', async () => {
    await signIn();
    await syncNow();
    useSyncStore.getState().dismissToast();
    await syncNow();
    expect(useSyncStore.getState().firstSyncToast).toBe(false);
  });
});

describe('Requirement: Zerar sincronizado', () => {
  it('Zerar em um aparelho', async () => {
    await signIn();
    study().answer(TRACK, 'cors', 'known');
    await syncNow();
    study().resetTrack(TRACK);
    await syncNow();
    expect(server.card(TRACK, 'cors')).toMatchObject({ result: null, box: null, due: null });
  });

  it('zerado em outro aparelho chega aqui', async () => {
    await signIn();
    study().answer(TRACK, 'cors', 'known');
    await syncNow();
    server.putCard({
      trackId: TRACK,
      cardId: 'cors',
      result: null,
      box: null,
      due: null,
      updatedAt: Date.now() + 1_000,
    });
    await syncNow();
    expect(study().progress[key('cors')]).toBeUndefined();
    expect(study().schedule[key('cors')]).toBeUndefined();
  });
});

describe('estado e saída', () => {
  it('estado de erro e de espera', async () => {
    await signIn();
    server.setOffline(true);
    await syncNow();
    expect(useSyncStore.getState().status).toBe('offline');
    server.setOffline(false);
    await syncNow();
    expect(useSyncStore.getState().status).toBe('idle');
    expect(useSyncStore.getState().lastSyncedAt).toEqual(expect.any(Number));
  });

  it('sair limpa a fila e a conta sincronizada', async () => {
    await signIn();
    await syncNow();
    server.setOffline(true);
    study().answer(TRACK, 'cors', 'known');
    useAccountStore.setState({ user: null });
    expect(Object.keys(useSyncStore.getState().pendingCards)).toHaveLength(0);
    expect(useSyncStore.getState().syncedUserId).toBeNull();
  });
});
