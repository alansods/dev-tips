// Opções de área de interesse (marcar e desmarcar), usadas no primeiro acesso
// do Início e na seção "Áreas de interesse" do Perfil.
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { areasWithTracks } from '../content/navigation';
import { useCatalog } from '../content/useCatalog';
import { useSettingsStore, useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';

export function InterestChips() {
  const { colors } = useTheme();
  const t = useT();
  const interests = useSettingsStore((s) => s.interests);
  const toggle = useSettingsStore((s) => s.toggleInterest);
  const areas = areasWithTracks(useCatalog()).map((a) => a.area);
  return (
    <View style={styles.wrap}>
      {areas.map((area) => {
        const checked = interests.includes(area);
        return (
          <Pressable
            key={area}
            accessibilityRole="checkbox"
            accessibilityLabel={t.nav.areas[area]}
            accessibilityState={{ checked }}
            onPress={() => toggle(area)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: checked ? colors.accentSoft : colors.surface,
                borderColor: checked ? colors.accent : colors.line,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <AppText size={14} font={checked ? 'semibold' : 'regular'} tone={checked ? 'accentText' : 'ink'}>
              {t.nav.areas[area]}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { minHeight: 44, paddingHorizontal: spacing.lg, borderRadius: 999, borderWidth: 1, justifyContent: 'center' },
});
