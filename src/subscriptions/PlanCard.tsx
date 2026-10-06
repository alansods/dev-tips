// Bloco "Plano" da tela Conta (tela 10 do design): plano grátis, assinante
// ou admin. Só no Android, onde o Pro é vendido.

import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useLanguage, useT } from '../i18n';
import { SectionTitle } from '../settings/SectionTitle';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { restore } from './actions';
import { ProBadge } from './ProBadge';
import { manageSubscriptions } from './purchases';
import { useSubscriptionStore } from './store';

export function PlanCard() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguage();
  const plan = useSubscriptionStore((s) => s.plan);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (Platform.OS !== 'android') return null;

  const onRestore = async () => {
    setBusy(true);
    setMessage(null);
    const outcome = await restore();
    setBusy(false);
    setMessage(outcome === 'restored' ? t.pro.restored : outcome === 'none' ? t.pro.restoreNone : t.pro.restoreError);
  };

  const date = (iso: string) =>
    new Date(iso).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { timeZone: 'UTC' });

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
    const { used, limit } = plan.questions;
    const max = limit ?? 0;
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
        {plan.expiresAt ? (
          <AppText size={14} tone="muted">
            {plan.willRenew ? t.pro.renewsOn(date(plan.expiresAt)) : t.pro.endsOn(date(plan.expiresAt))}
          </AppText>
        ) : null}
        <View style={{ gap: 6 }}>
          <View style={styles.usage}>
            <AppText size={13} style={{ flex: 1 }}>
              {t.pro.questionsMonth}
            </AppText>
            <AppText font="mono" size={13} tone="muted">
              {t.pro.usage(used, max)}
            </AppText>
          </View>
          <ProgressBar value={max > 0 ? used / max : 0} />
        </View>
        {message ? (
          <View accessibilityRole="alert" style={[styles.alert, { backgroundColor: colors.surface2 }]}>
            <AppText size={14}>{message}</AppText>
          </View>
        ) : null}
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
  alert: { padding: spacing.md, borderRadius: radius.md },
});
