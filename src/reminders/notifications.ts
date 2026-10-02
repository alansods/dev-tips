// Único ponto do app que fala com expo-notifications. Na web não há
// notificações locais: tudo aqui vira no-op.

import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

import type { ReminderPlan } from './plan';

const SUPPORTED = Platform.OS !== 'web';
const CHANNEL_ID = 'reminders';

if (SUPPORTED) {
  // Com o app aberto, o lembrete aparece como banner normal.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export const remindersSupported = SUPPORTED;

/** Permissão já concedida? Nunca abre o pedido do sistema. */
export async function hasPermission(): Promise<boolean> {
  if (!SUPPORTED) return false;
  try {
    return (await Notifications.getPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

/** Pede a permissão se ainda não foi concedida. */
export async function ensurePermission(): Promise<boolean> {
  if (!SUPPORTED) return false;
  if (await hasPermission()) return true;
  try {
    return (await Notifications.requestPermissionsAsync()).granted;
  } catch {
    return false;
  }
}

export async function cancelAll(): Promise<void> {
  if (!SUPPORTED) return;
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
}

/** Troca todas as notificações agendadas pelas do plano. */
export async function replaceAll(plans: ReminderPlan[], channelName: string): Promise<void> {
  if (!SUPPORTED) return;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: channelName,
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const plan of plans) {
      await Notifications.scheduleNotificationAsync({
        content: { title: plan.title, body: plan.body, data: { kind: 'reminder' } },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: plan.date, channelId: CHANNEL_ID },
      });
    }
  } catch {
    // agendar é melhor esforço: uma falha nunca quebra o app
  }
}

export function openSystemSettings() {
  Linking.openSettings().catch(() => {});
}

/** Id do último toque num lembrete (com o app aberto ou abrindo o app), ou `null`. */
export function useLastReminderTap(): string | null {
  const response = Notifications.useLastNotificationResponse();
  if (!SUPPORTED || !response) return null;
  const { request, date } = response.notification;
  return request.content.data?.kind === 'reminder' ? `${request.identifier}:${date}` : null;
}
