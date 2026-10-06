// Mantém o plano em dia: ao entrar na conta, liga as compras ao usuário e
// consulta o plano; ao sair, volta ao plano grátis; ao voltar para o app,
// consulta de novo.

import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useAccountStore } from '../auth/store';
import { purchasesLogIn, purchasesLogOut } from './purchases';
import { refreshSubscription, useSubscriptionStore } from './store';

async function onSignedIn(userId: string) {
  await purchasesLogIn(userId);
  await refreshSubscription();
}

async function onSignedOut() {
  useSubscriptionStore.getState().setPlan(null);
  await purchasesLogOut();
}

export function startSubscriptionLifecycle(): () => void {
  let currentId = useAccountStore.getState().user?.id ?? null;
  if (currentId) void onSignedIn(currentId);

  const stopAccount = useAccountStore.subscribe((s) => {
    const id = s.user?.id ?? null;
    if (id === currentId) return;
    currentId = id;
    void (id ? onSignedIn(id) : onSignedOut());
  });
  const appState = AppState.addEventListener('change', (state) => {
    if (state === 'active' && currentId) void refreshSubscription();
  });

  return () => {
    stopAccount();
    appState.remove();
  };
}

export function useSubscriptionLifecycle() {
  useEffect(() => startSubscriptionLifecycle(), []);
}
