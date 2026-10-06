// Linha "Dev Tips Pro" da seção Conta: no plano grátis abre o paywall; para
// quem é Pro, abre a tela Conta. Só no Android, onde o Pro é vendido.

import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { ChevronRightIcon } from '../components/icons';
import { useT } from '../i18n';
import { ProBadge } from '../subscriptions/ProBadge';
import { useIsPro } from '../subscriptions/store';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';

export function ProRow() {
  const { colors } = useTheme();
  const t = useT();
  const pro = useIsPro();

  if (Platform.OS !== 'android') return null;

  const detail = pro ? t.pro.rowActive : t.pro.rowFree;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t.pro.rowTitle}, ${detail}`}
      onPress={() => router.push(pro ? '/account' : '/paywall')}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <ProBadge />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText font="semibold" size={15}>
          {t.pro.rowTitle}
        </AppText>
        <AppText size={13} tone="muted">
          {detail}
        </AppText>
      </View>
      <ChevronRightIcon color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.lg,
    minHeight: 52,
  },
});
