import * as Notifications from 'expo-notifications';
import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { Linking, Platform } from 'react-native';

import RootLayout from '../app/_layout';
import TabsLayout from '../app/(tabs)/_layout';
import GlossaryScreen from '../app/(tabs)/glossary';
import HomeScreen from '../app/(tabs)/index';
import TracksScreen from '../app/(tabs)/tracks';
import ProfileScreen from '../app/(tabs)/profile';
import ProgressScreen from '../app/progress';
import TrackScreen from '../app/track/[trackId]';
import { resetRemindersStore, useRemindersStore } from '../reminders/store';
import { getTrack } from '../content/catalog';
import { resetStudyStore, useStudyStore } from '../study/store';

const N = Notifications as jest.Mocked<typeof Notifications>;
const APP = {
  _layout: RootLayout,
  '(tabs)/_layout': TabsLayout,
  '(tabs)/index': HomeScreen,
  '(tabs)/tracks': TracksScreen,
  '(tabs)/glossary': GlossaryScreen,
  '(tabs)/profile': ProfileScreen,
  progress: ProgressScreen,
  'track/[trackId]': TrackScreen,
};

/** Espera as etapas assíncronas do agendamento (só microtarefas: o roteador usa timers falsos). */
const flush = () =>
  act(async () => {
    for (let i = 0; i < 50; i++) await Promise.resolve();
  });
async function open(url: string) {
  renderRouter(APP, { initialUrl: url });
  await flush();
}
const toggle = () => screen.getByRole('switch', { name: 'Lembrete diário' });
const radio = (name: string) => screen.queryByRole('radio', { name });
const grant = (granted: boolean) =>
  ({ granted, status: granted ? 'granted' : 'denied', canAskAgain: !granted }) as never;

beforeEach(() => {
  jest.clearAllMocks();
  resetRemindersStore();
  resetStudyStore();
  N.getPermissionsAsync.mockResolvedValue(grant(false));
  N.requestPermissionsAsync.mockResolvedValue(grant(false));
});

describe('Requirement: Seção Lembretes', () => {
  it('Estado inicial', async () => {
    await open('/profile');
    expect(screen.getByText('Lembretes')).toBeOnTheScreen();
    expect(toggle()).toHaveProp('value', false);
    expect(N.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('Horário só com o lembrete ligado', async () => {
    await open('/profile');
    expect(radio('Noite 20:00')).toBeNull();
    expect(radio('Manhã 08:00')).toBeNull();
  });

  it('Web', async () => {
    const os = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'web', configurable: true });
    try {
      await open('/profile');
      expect(screen.queryByText('Lembretes')).toBeNull();
      expect(screen.queryByRole('switch', { name: 'Lembrete diário' })).toBeNull();
    } finally {
      Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
    }
  });
});

describe('Requirement: Permissão sob demanda', () => {
  it('Nada é pedido ao abrir', async () => {
    await open('/tracks');
    expect(N.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it('Permissão concedida', async () => {
    N.requestPermissionsAsync.mockResolvedValue(grant(true));
    N.getPermissionsAsync.mockResolvedValueOnce(grant(false)).mockResolvedValue(grant(true));
    await open('/profile');
    fireEvent(toggle(), 'valueChange', true);
    await flush();
    expect(N.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(toggle()).toHaveProp('value', true);
    expect(radio('Noite 20:00')).toBeChecked();
    expect(N.scheduleNotificationAsync).toHaveBeenCalledTimes(7);
    const hours = N.scheduleNotificationAsync.mock.calls.map(([req]) =>
      (req.trigger as { date: Date }).date.getHours(),
    );
    expect(new Set(hours)).toEqual(new Set([20]));
  });

  it('Permissão negada', async () => {
    const openSettings = jest.spyOn(Linking, 'openSettings').mockResolvedValue();
    await open('/profile');
    fireEvent(toggle(), 'valueChange', true);
    await flush();
    expect(toggle()).toHaveProp('value', false);
    expect(screen.getByText('Ative as notificações nas configurações do aparelho.')).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('button', { name: 'Abrir ajustes' }));
    expect(openSettings).toHaveBeenCalled();
    expect(N.scheduleNotificationAsync).not.toHaveBeenCalled();
    openSettings.mockRestore();
  });
});

describe('Requirement: Configuração salva no aparelho', () => {
  it('Configuração mantida ao reabrir (seção reflete o salvo)', async () => {
    N.getPermissionsAsync.mockResolvedValue(grant(true));
    useRemindersStore.setState({ enabled: true, time: '08:00' });
    await open('/profile');
    expect(toggle()).toHaveProp('value', true);
    expect(radio('Manhã 08:00')).toBeChecked();
    expect(radio('Noite 20:00')).not.toBeChecked();
  });
});

describe('Requirement: Reagendamento', () => {
  it('Trocar o horário pela tela', async () => {
    N.getPermissionsAsync.mockResolvedValue(grant(true));
    useRemindersStore.setState({ enabled: true });
    await open('/profile');
    N.scheduleNotificationAsync.mockClear();
    fireEvent.press(radio('Almoço 12:30')!);
    await flush();
    expect(useRemindersStore.getState().time).toBe('12:30');
    const times = N.scheduleNotificationAsync.mock.calls.map(([req]) => {
      const d = (req.trigger as { date: Date }).date;
      return `${d.getHours()}:${d.getMinutes()}`;
    });
    expect(new Set(times)).toEqual(new Set(['12:30']));
  });

  it('Desligar pela tela', async () => {
    N.getPermissionsAsync.mockResolvedValue(grant(true));
    useRemindersStore.setState({ enabled: true });
    await open('/profile');
    N.cancelAllScheduledNotificationsAsync.mockClear();
    fireEvent(toggle(), 'valueChange', false);
    await flush();
    expect(useRemindersStore.getState().enabled).toBe(false);
    expect(N.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
  });
});

describe('Requirement: Abrir pela notificação', () => {
  const tap = (id: string, kind = 'reminder') =>
    ({ notification: { date: 1, request: { identifier: id, content: { data: { kind } } } } }) as never;
  const seedDue = (trackId: string, n: number) => {
    const cards = getTrack(trackId)!
      .decks.flatMap((d) => d.cards)
      .slice(0, n);
    cards.forEach((c) => useStudyStore.getState().answer(trackId, c.id, 'unknown'));
  };

  it('Toque com revisão pendente', async () => {
    seedDue('crud-4-frameworks', 2);
    seedDue('fundamentos-web', 5);
    N.useLastNotificationResponse.mockReturnValue(tap('n1'));
    await open('/tracks');
    expect(screen).toHavePathname('/track/fundamentos-web');
  });

  it('Toque sem revisão', async () => {
    N.useLastNotificationResponse.mockReturnValue(tap('n2'));
    await open('/profile');
    expect(screen).toHavePathname('/');
  });

  it('notificação que não é lembrete não navega', async () => {
    N.useLastNotificationResponse.mockReturnValue(tap('n3', 'outro'));
    await open('/profile');
    expect(screen).toHavePathname('/profile');
  });

  afterEach(() => N.useLastNotificationResponse.mockReturnValue(undefined as never));
});
