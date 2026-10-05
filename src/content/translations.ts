// Traduções empacotadas no app, por trilha e idioma. Para adicionar uma, importe
// o content/tracks/<track-id>/translations/<idioma>.json aqui; o teste do
// catálogo falha se um arquivo de tradução ficar sem registro.

import crud4FrameworksEn from '../../content/tracks/crud-4-frameworks/translations/en.json';
import fundamentosWebEn from '../../content/tracks/fundamentos-web/translations/en.json';

export const translationRegistry: Record<string, Record<string, unknown>> = {
  'crud-4-frameworks': { en: crud4FrameworksEn },
  'fundamentos-web': { en: fundamentosWebEn },
};
