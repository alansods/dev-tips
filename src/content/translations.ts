// Traduções empacotadas no app, por tema e idioma. Para adicionar uma, importe
// o content/themes/<theme-id>/translations/<idioma>.json aqui; o teste do
// catálogo falha se um arquivo de tradução ficar sem registro.

import crud4FrameworksEn from '../../content/themes/crud-4-frameworks/translations/en.json';
import fundamentosWebEn from '../../content/themes/fundamentos-web/translations/en.json';

export const translationRegistry: Record<string, Record<string, unknown>> = {
  'crud-4-frameworks': { en: crud4FrameworksEn },
  'fundamentos-web': { en: fundamentosWebEn },
};
