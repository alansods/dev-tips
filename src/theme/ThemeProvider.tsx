import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { palettes, type ColorScheme, type ColorTokens } from './tokens';

export const COLOR_SCHEME_KEY = 'dev-tips:color-scheme';

/** Escolha do usuário: seguir o sistema ou forçar claro/escuro. */
export type ThemeMode = 'system' | ColorScheme;

type ThemeValue = {
  scheme: ColorScheme;
  colors: ColorTokens;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

const isScheme = (v: unknown): v is ColorScheme => v === 'light' || v === 'dark';

/**
 * Segue o modo do sistema ("Automático") até o usuário escolher claro ou
 * escuro; a escolha fica salva no aparelho e prevalece nas próximas aberturas.
 * Voltar para "Automático" apaga a escolha. Falhas de leitura/escrita da
 * preferência são ignoradas (o app segue o sistema).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [override, setOverride] = useState<ColorScheme | null>(null);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => AsyncStorage.getItem(COLOR_SCHEME_KEY))
      .then((saved) => {
        if (active && isScheme(saved)) setOverride(saved);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const scheme: ColorScheme = override ?? (system === 'dark' ? 'dark' : 'light');

  const setMode = useCallback((mode: ThemeMode) => {
    setOverride(mode === 'system' ? null : mode);
    Promise.resolve()
      .then(() =>
        mode === 'system' ? AsyncStorage.removeItem(COLOR_SCHEME_KEY) : AsyncStorage.setItem(COLOR_SCHEME_KEY, mode),
      )
      .catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ scheme, colors: palettes[scheme], mode: override ?? ('system' as const), setMode }),
    [scheme, override, setMode],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme precisa estar dentro de <ThemeProvider>');
  return value;
}
