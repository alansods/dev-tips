// AsyncStorage tolerante a falhas, compartilhado pelos stores persistidos.
// Leitura com erro ou JSON corrompido vira "nada salvo"; escrita com erro é
// ignorada. Assim um disco com problema nunca quebra o app.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

export const safeStorage: StateStorage = {
  getItem: async (name) => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // sem disco: o estado segue em memória nesta sessão
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // ignorado
    }
  },
};

/** createJSONStorage falha com JSON corrompido; aqui ele vira "nada salvo". */
export function safeJSONStorage<T>() {
  return createJSONStorage<T>(() => ({
    ...safeStorage,
    getItem: async (name) => {
      const raw = await safeStorage.getItem(name);
      if (raw == null) return null;
      try {
        JSON.parse(raw as string);
        return raw;
      } catch {
        return null;
      }
    },
  }));
}
