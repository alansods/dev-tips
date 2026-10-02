import { useLanguage } from '../i18n';
import { getCatalog } from './catalog';
import type { Theme } from './schema';

/** Catálogo no idioma em uso. */
export function useCatalog(): readonly Theme[] {
  return getCatalog(useLanguage());
}

/** Um tema no idioma em uso. */
export function useCatalogTheme(id: string): Theme | undefined {
  return useCatalog().find((theme) => theme.id === id);
}
