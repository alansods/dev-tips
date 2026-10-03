// Aviso discreto nas abas quando há conta e não há conexão. Não bloqueia nada.

import { StyleSheet, View } from 'react-native';

import { useAccountStore } from '../auth/store';
import { AppText } from '../components/AppText';
import { OfflineIcon } from '../components/icons';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { useIsOnline } from './network';

export function OfflineBanner() {
  const { colors } = useTheme();
  const t = useT();
  const online = useIsOnline();
  const signedIn = useAccountStore((s) => s.user !== null);
  if (online || !signedIn) return null;
  return (
    <View
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      style={[styles.banner, { backgroundColor: colors.surface2 }]}
    >
      <OfflineIcon color={colors.muted} />
      <AppText size={13} style={{ flex: 1 }}>
        {`${t.sync.offlineTitle} ${t.sync.offlineBody}`}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm + 2,
  },
});
