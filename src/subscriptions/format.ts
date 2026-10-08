// Datas do plano (renovação, término, fim do ciclo) no formato do idioma do app.

import { useLanguage } from '../i18n';

/** Formata uma data ISO da API como "12/11/2026" (ou "11/12/2026" em inglês). */
export function usePlanDate(): (iso: string) => string {
  const language = useLanguage();
  return (iso) => new Date(iso).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { timeZone: 'UTC' });
}
