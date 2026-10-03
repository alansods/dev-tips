// Único ponto do app que fala com o expo-network. "Online" = há internet
// (ou, sem essa informação, há conexão).

import * as Network from 'expo-network';

const isOnline = (s: { isConnected?: boolean | null; isInternetReachable?: boolean | null }) =>
  s.isInternetReachable ?? s.isConnected ?? true;

export function useIsOnline(): boolean {
  return isOnline(Network.useNetworkState());
}

/** Chama `fn` sempre que a conexão volta. */
export function onReconnect(fn: () => void): () => void {
  let online = true;
  const sub = Network.addNetworkStateListener((state) => {
    const now = isOnline(state);
    if (now && !online) fn();
    online = now;
  });
  return () => sub.remove();
}
