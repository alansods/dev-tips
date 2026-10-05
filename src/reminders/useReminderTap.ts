// Ao tocar num lembrete, abre a trilha com mais cards para revisar ou a aba
// Trilhas. O destino é calculado na hora do toque, com o progresso atual.

import { router } from 'expo-router';
import { useEffect } from 'react';

import { getCatalog } from '../content/catalog';
import { currentLanguage } from '../i18n';
import { today } from '../study/clock';
import { useStudyStore } from '../study/store';
import { useLastReminderTap } from './notifications';
import { reminderTarget } from './plan';

/** Toque já tratado: o mesmo toque não navega de novo se o layout remontar. */
let handledTap: string | null = null;

function openTarget() {
  router.navigate(reminderTarget(getCatalog(currentLanguage()), useStudyStore.getState().schedule, today()));
}

export function useReminderTapNavigation() {
  const tap = useLastReminderTap();
  useEffect(() => {
    if (!tap || tap === handledTap) return;
    handledTap = tap;
    // App aberto a frio pelo toque: espera o progresso salvo ser restaurado.
    if (useStudyStore.persist.hasHydrated()) {
      openTarget();
      return;
    }
    const unsubscribe = useStudyStore.persist.onFinishHydration(() => {
      unsubscribe();
      openTarget();
    });
    return unsubscribe;
  }, [tap]);
}
