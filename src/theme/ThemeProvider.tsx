import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { palettes, type ColorScheme, type ColorTokens } from './tokens';

export const COLOR_SCHEME_KEY = 'dev-tips:color-scheme';

type ThemeValue = {
  scheme: ColorScheme;
  colors: ColorTokens;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

const isScheme = (v: unknown): v is ColorScheme => v === 'light' || v === 'dark';

/**
 * Segue o modo do sistema até o usuário escolher um manualmente; a escolha
 * fica salva no aparelho e prevalece nas próximas aberturas. Falhas de
 * leitura/escrita da preferência são ignoradas (o app segue o sistema).
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

  const toggle = useCallback(() => {
    const next: ColorScheme = scheme === 'dark' ? 'light' : 'dark';
    setOverride(next);
    Promise.resolve()
      .then(() => AsyncStorage.setItem(COLOR_SCHEME_KEY, next))
      .catch(() => {});
  }, [scheme]);

  const value = useMemo(() => ({ scheme, colors: palettes[scheme], toggle }), [scheme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme precisa estar dentro de <ThemeProvider>');
  return value;
}
