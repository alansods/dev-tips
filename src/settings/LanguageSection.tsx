// Seção "Idioma" do Perfil: os idiomas disponíveis, com o atual marcado.
import { View } from 'react-native';

import { LANGUAGE_NAMES, LANGUAGES, useLanguage, useSettingsStore, useT } from '../i18n';
import { spacing } from '../theme/tokens';
import { RadioGroup } from './RadioGroup';
import { SectionTitle } from './SectionTitle';

export function LanguageSection() {
  const t = useT();
  const language = useLanguage();
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  return (
    <View style={{ gap: spacing.sm }}>
      <SectionTitle>{t.settings.language}</SectionTitle>
      <RadioGroup
        options={LANGUAGES.map((lang) => ({ value: lang, label: LANGUAGE_NAMES[lang] }))}
        value={language}
        onChange={setLanguage}
      />
    </View>
  );
}
