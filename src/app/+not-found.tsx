// Rota sem correspondência (convenção do expo-router): ex.: uma notificação
// antiga que aponta para uma trilha removida.

import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';

export default function NotFoundScreen() {
  const { colors } = useTheme();
  const t = useT();
  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.body}>
        <AppText font="monoMedium" size={64} tone="accentText" style={{ lineHeight: 72 }}>
          404
        </AppText>
        <AppText font="bold" size={26} accessibilityRole="header" style={styles.center}>
          {t.notFound.title}
        </AppText>
        <AppText size={16} tone="muted" style={[styles.center, { lineHeight: 24 }]}>
          {t.notFound.body}
        </AppText>
      </View>
      <Link href="/" replace asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={t.notFound.home}
          style={({ pressed }) => [styles.button, { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 }]}
        >
          <AppText font="semibold" size={16} style={{ color: colors.onAccent }}>
            {t.notFound.home}
          </AppText>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.xl, paddingTop: 56, paddingBottom: 32 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  center: { textAlign: 'center', maxWidth: 320 },
  button: { minHeight: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
