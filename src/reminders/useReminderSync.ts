// Mantém as notificações agendadas em dia: refaz o agendamento ao abrir o app,
// ao ir para segundo plano e quando o lembrete, o horário ou o idioma mudam.
// Nunca pede permissão: só confere se ela continua concedida.

import { useEffect } from 'react';
import { AppState } from 'react-native';

import { getCatalog } from '../content/catalog';
import { currentLanguage, MESSAGES, useLanguage } from '../i18n';
import { now } from '../study/clock';
import { useStudyStore } from '../study/store';
import { cancelAll, hasPermission, replaceAll } from './notifications';
import { planReminders } from './plan';
import { useRemindersStore } from './store';

async function sync(): Promise<void> {
  const reminders = useRemindersStore.getState();
  if (!reminders.enabled) return cancelAll();
  if (!(await hasPermission())) {
    // permissão revogada nos ajustes do sistema: desliga e mostra o aviso
    reminders.setEnabled(false);
    reminders.setPermissionDenied(true);
    return cancelAll();
  }
  const language = currentLanguage();
  const messages = MESSAGES[language];
  const { schedule, lastStudyDay } = useStudyStore.getState();
  const plans = planReminders({
    catalog: getCatalog(language),
    schedule,
    lastStudyDay,
    time: reminders.time,
    now: now(),
    messages,
  });
  await replaceAll(plans, messages.reminders.channel);
}

// Uma sincronização por vez, na ordem pedida, para cancelar/agendar não se misturarem.
let queue: Promise<void> = Promise.resolve();
export function syncReminders(): Promise<void> {
  queue = queue.then(sync, sync);
  return queue;
}

export function useReminderSync() {
  const enabled = useRemindersStore((s) => s.enabled);
  const time = useRemindersStore((s) => s.time);
  const language = useLanguage();

  useEffect(() => {
    void syncReminders();
  }, [enabled, time, language]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background' || state === 'inactive') void syncReminders();
    });
    return () => sub.remove();
  }, []);
}
