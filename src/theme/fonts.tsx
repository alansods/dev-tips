import { createContext, useContext } from 'react';

/** `true` quando as fontes do design carregaram; senão o app usa a fonte do sistema. */
export const FontsReadyContext = createContext(false);

export function useFontsReady(): boolean {
  return useContext(FontsReadyContext);
}
