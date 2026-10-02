import { act, renderHook } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { AppState, type AppStateStatus } from 'react-native';

import { useSettingsStore } from '../../i18n';
import * as clock from '../../study/clock';
import { resetStudyStore, useStudyStore } from '../../study/store';
import { resetRemindersStore, useRemindersStore } from '../store';
import { useReminderSync } from '../useReminderSync';

const N = Notifications as jest.Mocked<typeof Notifications>;
const scheduled = () => N.scheduleNotificationAsync.mock.calls.map(([req]) => req);
/** Espera a fila de sincronização terminar (várias etapas assíncronas). */
const flush = () =>
  act(async () => {
    for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 0));
  });

let appStateListener: ((s: AppStateStatus) => void) | undefined;
let spies: jest.SpyInstance[] = [];

beforeEach(() => {
  jest.clearAllMocks();
  spies = [
    jest.spyOn(clock, 'today').mockReturnValue('2026-10-02'),
    jest.spyOn(clock, 'now').mockReturnValue(new Date(2026, 9, 2, 10, 0)),
  ];
  resetStudyStore();
  resetRemindersStore();
  N.getPermissionsAsync.mockResolvedValue({ granted: true, status: 'granted', canAskAgain: true } as never);
  spies.push(
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, listener) => {
      appStateListener = listener as (s: AppStateStatus) => void;
      return { remove: jest.fn() } as never;
    }),
  );
});
afterEach(() => {
  // só os spies deste arquivo: restoreAllMocks apagaria os mocks globais do jest.setup
  spies.forEach((spy) => spy.mockRestore());
});

describe('Requirement: Permissão sob demanda', () => {
  it('Nada é pedido ao abrir', async () => {
    renderHook(() => useReminderSync());
    await flush();
    expect(N.requestPermissionsAsync).not.toHaveBeenCalled();
    expect(N.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('permissão revogada com o lembrete ligado: desliga e avisa', async () => {
    useRemindersStore.setState({ enabled: true });
    N.getPermissionsAsync.mockResolvedValue({ granted: false, status: 'denied', canAskAgain: false } as never);
    renderHook(() => useReminderSync());
    await flush();
    expect(useRemindersStore.getState()).toMatchObject({ enabled: false, permissionDenied: true });
    expect(N.requestPermissionsAsync).not.toHaveBeenCalled();
  });
});

describe('Requirement: Reagendamento', () => {
  it('reagenda ao abrir com o lembrete ligado', async () => {
    useRemindersStore.setState({ enabled: true });
    renderHook(() => useReminderSync());
    await flush();
    expect(N.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(scheduled()).toHaveLength(7);
    expect(scheduled()[0].trigger).toMatchObject({ type: 'date', date: new Date(2026, 9, 2, 20, 0) });
  });

  it('Trocar o horário', async () => {
    useRemindersStore.setState({ enabled: true });
    renderHook(() => useReminderSync());
    await flush();
    N.scheduleNotificationAsync.mockClear();
    await act(async () => {
      useRemindersStore.getState().setTime('08:00');
    });
    await flush();
    expect(scheduled()).toHaveLength(7);
    expect(scheduled().every(({ trigger }) => (trigger as { date: Date }).date.getHours() === 8)).toBe(true);
  });

  it('Trocar o idioma', async () => {
    useRemindersStore.setState({ enabled: true });
    renderHook(() => useReminderSync());
    await flush();
    N.scheduleNotificationAsync.mockClear();
    await act(async () => {
      useSettingsStore.getState().setLanguage('en');
    });
    await flush();
    expect(scheduled()[0].content.body).toBe('5 minutes of study? Pick up where you left off.');
  });

  it('Desligar', async () => {
    useRemindersStore.setState({ enabled: true });
    renderHook(() => useReminderSync());
    await flush();
    N.cancelAllScheduledNotificationsAsync.mockClear();
    N.scheduleNotificationAsync.mockClear();
    await act(async () => {
      useRemindersStore.getState().setEnabled(false);
    });
    await flush();
    expect(N.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(N.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('Texto atualizado após revisar (ao ir para segundo plano)', async () => {
    useRemindersStore.setState({ enabled: true });
    useStudyStore.setState({
      schedule: {
        'crud-4-frameworks:api': { box: 1, due: '2026-10-03' },
        'crud-4-frameworks:cors': { box: 1, due: '2026-10-03' },
      },
    });
    renderHook(() => useReminderSync());
    await flush();
    const tomorrow = () => scheduled().find(({ trigger }) => (trigger as { date: Date }).date.getDate() === 3);
    expect(tomorrow()?.content.body).toBe('Revisão do dia: 2 cards esperando por você');

    N.scheduleNotificationAsync.mockClear();
    useStudyStore.getState().answer('crud-4-frameworks', 'api', 'known');
    useStudyStore.getState().answer('crud-4-frameworks', 'cors', 'known');
    await act(async () => {
      appStateListener?.('background');
    });
    await flush();
    expect(tomorrow()?.content.body).toBe('5 minutos de estudo? Continue de onde parou.');
  });

  it('Estudou antes do horário: sem notificação hoje', async () => {
    useRemindersStore.setState({ enabled: true });
    renderHook(() => useReminderSync());
    await flush();
    N.scheduleNotificationAsync.mockClear();
    useStudyStore.getState().answer('crud-4-frameworks', 'api', 'known');
    await act(async () => {
      appStateListener?.('background');
    });
    await flush();
    const days = scheduled().map(({ trigger }) => (trigger as { date: Date }).date.getDate());
    expect(days).not.toContain(2);
    expect(days[0]).toBe(3);
  });
});
