import { useLanguage } from '../i18n';
import { getCatalog } from './catalog';
import type { Track } from './schema';

/** Catálogo no idioma em uso. */
export function useCatalog(): readonly Track[] {
  return getCatalog(useLanguage());
}

/** Uma trilha no idioma em uso. */
export function useCatalogTrack(id: string): Track | undefined {
  return useCatalog().find((track) => track.id === id);
}
