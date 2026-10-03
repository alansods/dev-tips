// Tela cheia de erro inesperado: sem detalhes técnicos, com "Tentar de novo"
// e "Voltar ao início". Usada pelo ErrorBoundary do layout raiz.

import { StyleSheet, View } from 'react-native';

import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { AppText } from './AppText';
import { Button } from './Button';
import { ErrorIcon } from './icons';

type Props = { onRetry: () => void; onHome: () => void };

export function ErrorScreen({ onRetry, onHome }: Props) {
  const { colors } = useTheme();
  const t = useT();
  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.body}>
        <View style={[styles.badge, { backgroundColor: colors.warnSoft }]}>
          <ErrorIcon color={colors.warn} />
        </View>
        <AppText font="bold" size={26} accessibilityRole="header" style={styles.center}>
          {t.errors.title}
        </AppText>
        <AppText size={16} tone="muted" style={[styles.center, { lineHeight: 24 }]}>
          {t.errors.body}
        </AppText>
      </View>
      <View style={styles.actions}>
        <View style={styles.row}>
          <Button title={t.errors.retry} onPress={onRetry} />
        </View>
        <View style={styles.row}>
          <Button title={t.errors.home} variant="secondary" onPress={onHome} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.xl, paddingTop: 56, paddingBottom: 32 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  badge: { width: 88, height: 88, borderRadius: radius.xl + 6, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center', maxWidth: 320 },
  actions: { gap: spacing.md },
  row: { flexDirection: 'row' },
});
