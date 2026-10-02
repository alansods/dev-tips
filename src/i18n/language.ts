// Qual idioma o app usa: a escolha salva, ou o idioma preferido do aparelho
// (inglês se for inglês; PT-BR em qualquer outro caso).

export const LANGUAGES = ['pt-BR', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

/** Nome de cada idioma no próprio idioma (não muda com o idioma atual). */
export const LANGUAGE_NAMES: Record<Language, string> = { 'pt-BR': 'Português (Brasil)', en: 'English' };

type DeviceLocale = { languageCode?: string | null };

export function resolveLanguage(saved: Language | null, deviceLocales: readonly DeviceLocale[]): Language {
  if (saved) return saved;
  return deviceLocales[0]?.languageCode === 'en' ? 'en' : 'pt-BR';
}
