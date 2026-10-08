// Seção "Tema" do Perfil: Automático (segue o sistema), Claro ou Escuro.
import { View } from 'react-native';

import { useT } from '../i18n';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';
import { RadioGroup } from './RadioGroup';
import { SectionTitle } from './SectionTitle';

const MODES: readonly ThemeMode[] = ['system', 'light', 'dark'];

export function ThemeSection() {
  const t = useT();
  const { mode, setMode } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <SectionTitle>{t.settings.theme}</SectionTitle>
      <RadioGroup
        options={MODES.map((m) => ({ value: m, label: t.settings.themeModes[m] }))}
        value={mode}
        onChange={setMode}
      />
    </View>
  );
}
