// Agrupamento do catálogo para a navegação: áreas → (trilhas diretas,
// linguagens, comparativos) → linguagem → (linguagem pura, frameworks) →
// framework. Funções puras sobre o catálogo e o cadastro; as telas só desenham.

import { AREAS, SECTIONS, type Area, type Section, type Track } from './schema';
import { placementOf, type Framework, type Language, type Taxonomy } from './taxonomy';

export type AreaEntry = { area: Area; tracks: Track[] };
export type AreaSections = {
  /** Trilhas diretas sem seção. */
  direct: Track[];
  /** Trilhas diretas com seção, agrupadas na ordem de SECTIONS (só as seções com trilhas). */
  grouped: { section: Section; tracks: Track[] }[];
  languages: { language: Language; count: number }[];
  comparisons: Track[];
};
export type LanguageSections = {
  core: Track[];
  frameworks: { framework: Framework; count: number }[];
};

export const isArea = (value: string): value is Area => (AREAS as readonly string[]).includes(value);

/** Trilhas da área, na ordem do catálogo. */
export const tracksInArea = (catalog: readonly Track[], area: Area): Track[] =>
  catalog.filter((t) => t.areas.includes(area));

/** Áreas na ordem fixa, só as que têm trilhas. */
export function areasWithTracks(catalog: readonly Track[]): AreaEntry[] {
  return AREAS.map((area) => ({ area, tracks: tracksInArea(catalog, area) })).filter((a) => a.tracks.length > 0);
}

/** Trilhas da área que pertencem à linguagem (pura ou de algum framework dela). */
const tracksOfLanguage = (catalog: readonly Track[], area: Area, languageId: string): Track[] =>
  tracksInArea(catalog, area).filter((t) => {
    const p = placementOf(t);
    return (p.kind === 'language' || p.kind === 'framework') && p.language === languageId;
  });

export function areaSections(catalog: readonly Track[], taxonomy: Taxonomy, area: Area): AreaSections {
  const tracks = tracksInArea(catalog, area);
  const direct = tracks.filter((t) => placementOf(t).kind === 'direct');
  return {
    direct: direct.filter((t) => t.section === undefined),
    grouped: SECTIONS.map((section) => ({ section, tracks: direct.filter((t) => t.section === section) })).filter(
      (g) => g.tracks.length > 0,
    ),
    languages: taxonomy.languages
      .map((language) => ({ language, count: tracksOfLanguage(catalog, area, language.id).length }))
      .filter((l) => l.count > 0),
    comparisons: tracks.filter((t) => placementOf(t).kind === 'comparison'),
  };
}

export function languageSections(
  catalog: readonly Track[],
  taxonomy: Taxonomy,
  area: Area,
  languageId: string,
): LanguageSections {
  const tracks = tracksOfLanguage(catalog, area, languageId);
  return {
    core: tracks.filter((t) => placementOf(t).kind === 'language'),
    frameworks: taxonomy.frameworks
      .filter((f) => f.language === languageId)
      .map((framework) => ({ framework, count: frameworkTracks(catalog, area, languageId, framework.id).length }))
      .filter((f) => f.count > 0),
  };
}

/** Trilhas do framework na área. */
export function frameworkTracks(catalog: readonly Track[], area: Area, languageId: string, frameworkId: string): Track[] {
  return tracksOfLanguage(catalog, area, languageId).filter((t) => {
    const p = placementOf(t);
    return p.kind === 'framework' && p.framework === frameworkId;
  });
}

/**
 * Trilhas da área na ordem sugerida: cada trilha vem depois dos seus
 * pré-requisitos que também são da área; no empate, vale a ordem do catálogo.
 */
export function areaPath(catalog: readonly Track[], area: Area): Track[] {
  const pending = tracksInArea(catalog, area);
  const inArea = new Set(pending.map((t) => t.id));
  const placed = new Set<string>();
  const path: Track[] = [];
  while (pending.length > 0) {
    const ready = pending.findIndex((t) => t.prerequisites.every((p) => !inArea.has(p) || placed.has(p)));
    // Sem ciclos (a validação garante); por segurança, um ciclo não trava a tela.
    const [next] = pending.splice(ready === -1 ? 0 : ready, 1);
    placed.add(next.id);
    path.push(next);
  }
  return path;
}

/** Trilhas que têm `trackId` como pré-requisito, na ordem do catálogo. */
export const nextTracks = (catalog: readonly Track[], trackId: string): Track[] =>
  catalog.filter((t) => t.prerequisites.includes(trackId));
