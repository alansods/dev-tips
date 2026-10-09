// Paywall do Dev Tips Pro (tela 8 do design). Assinar e restaurar exigem
// conta: sem sessão, abre o login, que volta para cá ao terminar. No iOS a
// venda ainda não existe: preço fixo e um aviso no lugar da compra.

import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAccountStore } from '../auth/store';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import { ChartIcon, CheckIcon, CloseIcon, RefreshIcon } from '../components/icons';
import { useT } from '../i18n';
import { legalUrls } from '../settings/legal';
import { restore, subscribe } from '../subscriptions/actions';
import { ProBadge } from '../subscriptions/ProBadge';
import { monthlyPrice } from '../subscriptions/purchases';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';

/** Ícones das regras da cota, na ordem de `t.pro.quotaRules`. */
const RULE_ICONS = [RefreshIcon, CheckIcon, ChartIcon];

/** Tempo para ler a mensagem de sucesso antes de fechar. */
const CLOSE_DELAY_MS = 800;

function close() {
  if (router.canGoBack()) router.back();
  else router.replace('/profile');
}

type Message = { text: string; tone: 'ok' | 'error' };

export default function PaywallScreen() {
  const { colors } = useTheme();
  const t = useT();
  const signedIn = useAccountStore((s) => s.user !== null);
  const ios = Platform.OS === 'ios';
  // undefined = carregando; null = a loja não devolveu preço (venda indisponível).
  const [storePrice, setPrice] = useState<string | null | undefined>(undefined);
  const price = ios ? t.pro.iosPrice : storePrice;
  const [busy, setBusy] = useState<'subscribe' | 'restore' | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const closing = useRef<ReturnType<typeof setTimeout> | null>(null);
  const legal = legalUrls();
  const notice: Message | null =
    message ?? (!ios && storePrice === null ? { text: t.pro.unavailable, tone: 'error' } : null);

  useEffect(() => {
    let alive = true;
    if (!ios) {
      void monthlyPrice().then((p) => {
        if (alive) setPrice(p);
      });
    }
    return () => {
      alive = false;
      if (closing.current) clearTimeout(closing.current);
    };
  }, [ios]);

  const succeed = (text: string) => {
    setMessage({ text, tone: 'ok' });
    closing.current = setTimeout(close, CLOSE_DELAY_MS);
  };

  const onSubscribe = async () => {
    if (ios) return setMessage({ text: t.pro.iosUnavailable, tone: 'error' });
    if (!signedIn) return router.push('/login');
    setMessage(null);
    setBusy('subscribe');
    const outcome = await subscribe();
    setBusy(null);
    if (outcome === 'subscribed') succeed(t.pro.success);
    else if (outcome === 'offline') setMessage({ text: t.pro.offline, tone: 'error' });
    else if (outcome === 'error') setMessage({ text: t.pro.error, tone: 'error' });
  };

  const onRestore = async () => {
    if (ios) return setMessage({ text: t.pro.iosUnavailable, tone: 'error' });
    if (!signedIn) return router.push('/login');
    setMessage(null);
    setBusy('restore');
    const outcome = await restore();
    setBusy(null);
    if (outcome === 'restored') succeed(t.pro.restored);
    else setMessage({ text: outcome === 'none' ? t.pro.restoreNone : t.pro.restoreError, tone: 'error' });
  };

  const openUrl = (url?: string) => {
    if (url) Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <IconButton label={t.common.close} onPress={close}>
          <CloseIcon color={colors.muted} />
        </IconButton>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ gap: spacing.md }}>
          <ProBadge />
          <AppText font="bold" size={28} accessibilityRole="header" style={{ lineHeight: 34 }}>
            {t.pro.paywallTitle}
          </AppText>
          <AppText size={15} tone="muted" style={{ lineHeight: 22 }}>
            {t.pro.paywallBody}
          </AppText>
        </View>

        <View style={[styles.plan, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
          <View style={styles.planHead}>
            <AppText font="semibold" size={16} style={{ flex: 1 }}>
              {t.pro.planName}
            </AppText>
            {price ? (
              <AppText font="bold" size={18}>
                {t.pro.perMonth(price)}
              </AppText>
            ) : null}
          </View>
          <View style={[styles.quota, { backgroundColor: colors.accentSoft }]}>
            <AppText font="monoMedium" size={30} tone="accentText" style={{ lineHeight: 34 }}>
              {t.pro.quotaAmount}
            </AppText>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText font="semibold" size={15}>
                {t.pro.quotaUnit}
              </AppText>
              <AppText size={13} tone="muted">
                {t.pro.quotaScope}
              </AppText>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            {t.pro.quotaRules.map((rule, i) => {
              const Icon = RULE_ICONS[i] ?? CheckIcon;
              return (
                <View key={rule} style={styles.rule}>
                  <Icon color={colors.accentText} size={18} />
                  <AppText size={14} style={{ flex: 1, lineHeight: 20 }}>
                    {rule}
                  </AppText>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ gap: 14 }}>
          {t.pro.benefits.map((benefit) => (
            <View key={benefit} style={styles.benefit}>
              <View style={[styles.check, { backgroundColor: colors.accentSoft }]}>
                <CheckIcon color={colors.accentText} size={16} />
              </View>
              <AppText size={15} style={{ flex: 1, lineHeight: 21 }}>
                {benefit}
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {notice ? (
          <View
            accessibilityRole="alert"
            style={[
              styles.alert,
              notice.tone === 'ok'
                ? { backgroundColor: colors.accentSoft, borderColor: colors.accent }
                : { backgroundColor: colors.warnSoft, borderColor: colors.warn },
            ]}
          >
            <AppText size={14}>{notice.text}</AppText>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row' }}>
          <Button
            title={busy === 'subscribe' ? t.pro.subscribing : t.pro.subscribe}
            loading={busy === 'subscribe'}
            disabled={!price || busy !== null}
            onPress={() => void onSubscribe()}
          />
        </View>
        <AppText size={12} tone="muted" style={styles.center}>
          {t.pro.renewNotice}
        </AppText>
        <View style={styles.links}>
          <AppText
            size={13}
            tone="accentText"
            accessibilityRole="button"
            accessibilityState={{ disabled: busy !== null }}
            onPress={busy ? undefined : () => void onRestore()}
            style={styles.link}
          >
            {t.pro.restore}
          </AppText>
          <AppText
            size={13}
            tone="accentText"
            accessibilityRole="link"
            onPress={() => openUrl(legal?.termsUrl)}
            style={styles.link}
          >
            {t.pro.terms}
          </AppText>
          <AppText
            size={13}
            tone="accentText"
            accessibilityRole="link"
            onPress={() => openUrl(legal?.privacyUrl)}
            style={styles.link}
          >
            {t.pro.privacy}
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: spacing.sm },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, gap: spacing.xl, paddingBottom: spacing.lg },
  benefit: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  check: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  plan: { gap: 14, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 2 },
  planHead: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.md },
  quota: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    borderRadius: radius.md,
  },
  rule: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  footer: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.md },
  alert: { padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  center: { textAlign: 'center', lineHeight: 17 },
  links: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
  link: { paddingVertical: spacing.md, paddingHorizontal: spacing.sm },
});
