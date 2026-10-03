// Mensagem rápida depois da primeira sincronização de uma conta neste aparelho.

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { CheckIcon } from '../components/icons';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { useSyncStore } from './store';

export const TOAST_MS = 4_000;

export function FirstSyncToast() {
  const { colors } = useTheme();
  const t = useT();
  const visible = useSyncStore((s) => s.firstSyncToast);
  const dismiss = useSyncStore((s) => s.dismissToast);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(dismiss, TOAST_MS);
    return () => clearTimeout(timer);
  }, [visible, dismiss]);

  if (!visible) return null;
  return (
    <View pointerEvents="none" accessibilityLiveRegion="polite" style={styles.wrap}>
      <View style={[styles.toast, { backgroundColor: colors.ink }]}>
        <CheckIcon color={colors.accent} />
        <AppText size={14} style={{ color: colors.bg, flex: 1 }}>
          {t.sync.firstSync}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: 100 },
  toast: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md },
});
