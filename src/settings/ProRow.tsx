// Linha "Dev Tips Pro" da seção Conta: no plano grátis abre o paywall; para
// quem é Pro, mostra o uso da cota e abre a tela Conta. No Android e no iOS
// (no iOS a compra ainda não existe: o paywall avisa).

import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { ChevronRightIcon } from '../components/icons';
import { useT } from '../i18n';
import { usePlanDate } from '../subscriptions/format';
import { ProBadge } from '../subscriptions/ProBadge';
import { quotaStatus } from '../subscriptions/quota';
import { QuotaMeter } from '../subscriptions/QuotaMeter';
import { useIsPro, useSubscriptionStore } from '../subscriptions/store';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';

export function ProRow() {
  const { colors } = useTheme();
  const t = useT();
  const formatDate = usePlanDate();
  const pro = useIsPro();
  const plan = useSubscriptionStore((s) => s.plan);

  if (Platform.OS === 'web') return null;

  const admin = pro && plan?.source === 'admin';
  const quota = pro ? quotaStatus(plan) : null;
  const expires = plan?.expiresAt ? formatDate(plan.expiresAt) : null;

  const title = admin ? t.pro.admin : t.pro.rowTitle;
  let detail = t.pro.rowFree;
  if (admin) detail = t.pro.unlimited;
  else if (quota && expires) detail = plan?.willRenew ? t.pro.renewsOn(expires) : t.pro.endsOn(expires);
  else if (pro) detail = t.pro.rowActive;

  const alert = quota ? quota.level !== 'normal' : false;
  const label = [title, detail, quota ? t.pro.usageA11y(quota.used, quota.limit) : null].filter(Boolean).join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.push(pro ? '/account' : '/paywall')}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: quota?.level === 'out' ? colors.warnSoft : colors.surface,
          borderColor: alert ? colors.warn : colors.line,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.head}>
        <ProBadge />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText font="semibold" size={15}>
            {title}
          </AppText>
          <AppText size={13} tone="muted">
            {detail}
          </AppText>
        </View>
        <ChevronRightIcon color={colors.muted} />
      </View>
      {quota ? <QuotaMeter quota={quota} renewDate={expires} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.md,
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.lg,
    minHeight: 52,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
