// Apaga do aparelho os dados do usuário depois que a conta foi apagada na API.
// Tema e idioma ficam: são ajustes do aparelho, não dados pessoais.
// O plano volta para grátis pelo próprio fim da sessão (subscriptions/lifecycle).

import { useSettingsStore } from '../i18n';
import { cancelAll } from '../reminders/notifications';
import { resetRemindersStore } from '../reminders/store';
import { resetStudyStore } from '../study/store';
import { resetSyncStore } from '../sync/store';

export async function wipeLocalData(): Promise<void> {
  resetStudyStore();
  resetSyncStore();
  resetRemindersStore();
  // Sem `onboardingSeen`, o app volta ao primeiro uso e mostra o login.
  useSettingsStore.setState({ interests: [], onboardingSeen: false });
  await cancelAll();
}
