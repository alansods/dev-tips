import { StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';

/** Selo "PRO" (fundo de acento, texto mono). */
export function ProBadge() {
  const { colors } = useTheme();
  const t = useT();
  return (
    <View style={[styles.badge, { backgroundColor: colors.accent }]}>
      <AppText font="monoMedium" size={11} style={{ color: colors.onAccent, letterSpacing: 0.6 }}>
        {t.pro.badge}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
});
