// Bloco "Plano" da tela Conta (tela 10 do design): plano grátis, assinante
// ou admin. No Android e no iOS; no iOS, sem "Gerenciar" e "Restaurar",
// porque a assinatura é do Google Play.

import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useT } from '../i18n';
import { SectionTitle } from '../settings/SectionTitle';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { restore } from './actions';
import { usePlanDate } from './format';
import { ProBadge } from './ProBadge';
import { manageSubscriptions } from './purchases';
import { quotaStatus } from './quota';
import { useSubscriptionStore } from './store';

export function PlanCard() {
  const { colors } = useTheme();
  const t = useT();
  const date = usePlanDate();
  const plan = useSubscriptionStore((s) => s.plan);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (Platform.OS === 'web') return null;
  const storeActions = Platform.OS === 'android';

  const onRestore = async () => {
    setBusy(true);
    setMessage(null);
    const outcome = await restore();
    setBusy(false);
    setMessage(outcome === 'restored' ? t.pro.restored : outcome === 'none' ? t.pro.restoreNone : t.pro.restoreError);
  };

  const card = [styles.card, { backgroundColor: colors.surface, borderColor: colors.line }];
  let body;
  if (!plan || plan.plan === 'free') {
    body = (
      <View style={card}>
        <AppText font="semibold" size={16}>
          {t.pro.freePlan}
        </AppText>
        <View style={{ flexDirection: 'row' }}>
          <Button title={t.pro.learnPro} onPress={() => router.push('/paywall')} />
        </View>
      </View>
    );
  } else if (plan.source === 'admin') {
    body = (
      <View style={card}>
        <View style={styles.head}>
          <ProBadge />
          <AppText font="semibold" size={16} style={{ flex: 1 }}>
            {t.pro.admin}
          </AppText>
        </View>
        <AppText size={14} tone="muted">
          {t.pro.unlimited}
        </AppText>
      </View>
    );
  } else {
    const quota = quotaStatus(plan);
    const alert = quota ? quota.level !== 'normal' : false;
    body = (
      <View style={card}>
        <View style={styles.head}>
          <ProBadge />
          <AppText font="semibold" size={16} style={{ flex: 1 }}>
            {t.pro.planName}
          </AppText>
          <AppText size={13} tone="muted">
            {t.pro.active}
          </AppText>
        </View>
        {quota ? (
          <View style={{ gap: 10 }}>
            <View style={styles.left}>
              <AppText font="monoMedium" size={40} tone={alert ? 'warn' : 'ink'} style={{ lineHeight: 44 }}>
                {String(quota.left)}
              </AppText>
              <AppText size={15} style={{ flex: 1, paddingBottom: 6 }}>
                {t.pro.remainingLabel(quota.left)}
              </AppText>
            </View>
            <ProgressBar value={quota.ratio} height={10} tone={alert ? 'warn' : 'accent'} />
            <View style={styles.usage}>
              <AppText font="mono" size={13} tone="muted" style={{ flex: 1 }}>
                {t.pro.usedOf(quota.used, quota.limit)}
              </AppText>
              {plan.expiresAt ? (
                <AppText size={13} tone="muted">
                  {t.pro.resetsOn(date(plan.expiresAt))}
                </AppText>
              ) : null}
            </View>
          </View>
        ) : null}
        <View style={[styles.how, { backgroundColor: colors.surface2 }]}>
          <AppText font="semibold" size={14}>
            {t.pro.howTitle}
          </AppText>
          {t.pro.howRules.map((rule) => (
            <View key={rule} style={styles.howRule}>
              <AppText size={13} tone="muted">
                {'•'}
              </AppText>
              <AppText size={13} tone="muted" style={{ flex: 1, lineHeight: 19 }}>
                {rule}
              </AppText>
            </View>
          ))}
        </View>
        {plan.expiresAt ? (
          <AppText size={14} tone="muted">
            {plan.willRenew ? t.pro.renewsOn(date(plan.expiresAt)) : t.pro.endsOn(date(plan.expiresAt))}
          </AppText>
        ) : null}
        {message ? (
          <View accessibilityRole="alert" style={[styles.alert, { backgroundColor: colors.surface2 }]}>
            <AppText size={14}>{message}</AppText>
          </View>
        ) : null}
        {storeActions ? (
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: 'row' }}>
              <Button title={t.pro.manage} variant="secondary" onPress={() => void manageSubscriptions()} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button
                title={t.pro.restore}
                variant="secondary"
                disabled={busy}
                loading={busy}
                onPress={() => void onRestore()}
              />
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={{ gap: spacing.sm }}>
      <SectionTitle>{t.pro.planSection}</SectionTitle>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  usage: { flexDirection: 'row', alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  how: { gap: 6, paddingVertical: spacing.md, paddingHorizontal: 14, borderRadius: radius.md },
  howRule: { flexDirection: 'row', gap: spacing.sm },
  alert: { padding: spacing.md, borderRadius: radius.md },
});
