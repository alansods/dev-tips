// Mock do catálogo só com as trilhas originais (CRUD e Fundamentos web), para
// os cenários de spec escritos sobre esse catálogo. Uso, no arquivo de teste:
//
//   jest.mock('../content/catalog', () => jest.requireActual('../test-catalog').originalCatalogMock());

import type { Track } from './content';

export const ORIGINAL_TRACKS = ['crud-4-frameworks', 'fundamentos-web'];

/** Módulo de catálogo restrito às trilhas `ids` (e às `extra`, se houver). */
export function originalCatalogMock(extra: Track[] = [], ids: string[] = ORIGINAL_TRACKS) {
  const actual = jest.requireActual('./content/catalog');
  const keep = (t: Track) => ids.includes(t.id);
  const catalog: Track[] = [...actual.catalog.filter(keep), ...extra];
  return {
    ...actual,
    catalog,
    getCatalog: (language: string) => [...actual.getCatalog(language).filter(keep), ...extra],
    getTrack: (id: string) => catalog.find((t) => t.id === id),
  };
}
