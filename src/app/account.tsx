// Tela Conta: dados da conta Google, plano Pro, Sair e Apagar conta, com confirmação na
// própria tela. Nenhuma das ações apaga o progresso guardado no aparelho.

import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { deleteAccount, signOut } from '../auth/actions';
import { useAccountStore } from '../auth/store';
import { SyncStatusLine } from '../sync/SyncStatusLine';
import { SectionTitle } from '../settings/SectionTitle';
import { AppText } from '../components/AppText';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import { BackIcon, GoogleLogo } from '../components/icons';
import { useT } from '../i18n';
import { PlanCard } from '../subscriptions/PlanCard';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';

function backToSettings() {
  if (router.canGoBack()) router.back();
  else router.replace('/settings');
}

type Confirm = 'signOut' | 'delete' | null;

export default function AccountScreen() {
  const { colors } = useTheme();
  const t = useT();
  const user = useAccountStore((s) => s.user);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!user) return <Redirect href="/settings" />;

  const onSignOut = async () => {
    setBusy(true);
    await signOut();
    backToSettings();
  };

  const onDelete = async () => {
    setBusy(true);
    setMessage(null);
    const outcome = await deleteAccount();
    setBusy(false);
    if (outcome === 'deleted') backToSettings();
    else setMessage(outcome === 'offline' ? t.account.deleteOffline : t.account.deleteError);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton label={t.common.back} onPress={backToSettings}>
          <BackIcon color={colors.ink} />
        </IconButton>
        <AppText font="bold" size={20} accessibilityRole="header">
          {t.account.title}
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.profile, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Avatar name={user.name} photoUrl={user.photoUrl} size={72} />
          {user.name ? (
            <AppText font="bold" size={18}>
              {user.name}
            </AppText>
          ) : null}
          {user.email ? (
            <AppText size={14} tone="muted">
              {user.email}
            </AppText>
          ) : null}
          <View style={[styles.chip, { backgroundColor: colors.surface2 }]}>
            <GoogleLogo size={12} />
            <AppText font="mono" size={11} tone="muted">
              {t.account.connectedGoogle}
            </AppText>
          </View>
        </View>

        <PlanCard />

        <View style={{ gap: spacing.sm }}>
          <SectionTitle>{t.sync.section}</SectionTitle>
          <View style={[styles.syncCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <SyncStatusLine size={15} />
            <AppText size={13} tone="muted">
              {t.sync.detail}
            </AppText>
          </View>
        </View>

        {confirm === 'signOut' ? (
          <View style={[styles.confirm, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
            <AppText font="semibold" size={16} accessibilityRole="header">
              {t.account.signOutTitle}
            </AppText>
            <AppText size={14} tone="muted" style={{ lineHeight: 20 }}>
              {t.account.signOutBody}
            </AppText>
            <View style={styles.row}>
              <Button title={t.common.cancel} variant="secondary" onPress={() => setConfirm(null)} />
              <Button title={t.account.signOut} onPress={() => void onSignOut()} />
            </View>
          </View>
        ) : (
          <View style={styles.row}>
            <Button title={t.account.signOut} variant="secondary" onPress={() => setConfirm('signOut')} />
          </View>
        )}

        <View style={[styles.danger, { borderColor: colors.line }]}>
          {confirm === 'delete' ? (
            <View style={[styles.confirm, { backgroundColor: colors.surface, borderColor: colors.warn }]}>
              <AppText font="semibold" size={16} accessibilityRole="header">
                {t.account.deleteTitle}
              </AppText>
              <AppText size={14} style={{ lineHeight: 20 }}>
                {t.account.deleteBody}
              </AppText>
              <AppText size={14} tone="muted" style={{ lineHeight: 20 }}>
                {t.account.deleteKeep}
              </AppText>
              <AppText size={14} tone="muted" style={{ lineHeight: 20 }}>
                {t.account.deleteSubscription}
              </AppText>
              {message ? (
                <View accessibilityRole="alert" style={[styles.alert, { backgroundColor: colors.warnSoft }]}>
                  <AppText size={14}>{message}</AppText>
                </View>
              ) : null}
              <View style={{ gap: spacing.sm }}>
                <View style={styles.row}>
                  <Button title={t.common.cancel} onPress={() => setConfirm(null)} />
                </View>
                <View style={styles.row}>
                  <Button
                    title={t.account.deleteConfirm}
                    variant="warn"
                    onPress={() => void (busy ? null : onDelete())}
                  />
                </View>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.row}>
                <Button title={t.account.delete} variant="warn" onPress={() => setConfirm('delete')} />
              </View>
              <AppText size={12} tone="muted" style={{ textAlign: 'center' }}>
                {t.account.deleteHint}
              </AppText>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  content: { padding: spacing.lg, gap: spacing.lg },
  profile: { alignItems: 'center', gap: spacing.sm, padding: spacing.xl, borderRadius: radius.xl, borderWidth: 1 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  row: { flexDirection: 'row', gap: spacing.md },
  confirm: { gap: spacing.sm, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1.5 },
  danger: { gap: spacing.sm, paddingTop: spacing.lg, borderTopWidth: 1, marginTop: spacing.lg },
  alert: { padding: spacing.md, borderRadius: radius.md },
  syncCard: { gap: 4, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1 },
});
