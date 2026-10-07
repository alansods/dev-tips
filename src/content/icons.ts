// Qual ícone representa cada trilha, linguagem e framework. A trilha usa o
// próprio `icon`; sem ele, o logo do framework, depois o da linguagem e, por
// último, o ícone da primeira área. As telas só desenham o resultado.

import type { Area, Track } from './schema';
import type { TechIconSlug } from './techIcons.generated';
import type { Framework, Language, Taxonomy } from './taxonomy';

export type ItemIcon =
  | { kind: 'logo'; slug: TechIconSlug }
  | { kind: 'text'; text: string }
  | { kind: 'area'; area: Area };

export const languageIcon = (language: Language): ItemIcon => ({ kind: 'logo', slug: language.icon });

export const frameworkIcon = (framework: Framework): ItemIcon => ({ kind: 'logo', slug: framework.icon });

export function trackIcon(track: Track, taxonomy: Taxonomy): ItemIcon {
  if (track.icon?.logo) return { kind: 'logo', slug: track.icon.logo };
  if (track.icon?.text) return { kind: 'text', text: track.icon.text };
  const framework = taxonomy.frameworks.find((f) => f.id === track.framework);
  if (framework) return frameworkIcon(framework);
  const language = taxonomy.languages.find((l) => l.id === track.language);
  if (language) return languageIcon(language);
  return { kind: 'area', area: track.areas[0] };
}
