// Seção "Conta" de Ajustes: convite para entrar ou a linha da conta conectada.
// Não aparece na web (o login do Google é nativo).

import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { useAccountStore } from '../auth/store';
import { AppText } from '../components/AppText';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { ChevronRightIcon, CloudUpIcon } from '../components/icons';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { SectionTitle } from './SectionTitle';

export function AccountSection() {
  const { colors } = useTheme();
  const t = useT();
  const user = useAccountStore((s) => s.user);

  if (Platform.OS === 'web') return null;

  return (
    <View style={{ gap: spacing.sm }}>
      <SectionTitle>{t.account.section}</SectionTitle>
      {user ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.account.rowLabel(user.name ?? '', user.email ?? '')}
          onPress={() => router.push('/account')}
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Avatar name={user.name} photoUrl={user.photoUrl} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText font="semibold" size={15} numberOfLines={1}>
              {user.name ?? user.email ?? ''}
            </AppText>
            {user.email ? (
              <AppText size={13} tone="muted" numberOfLines={1}>
                {user.email}
              </AppText>
            ) : null}
          </View>
          <ChevronRightIcon color={colors.muted} />
        </Pressable>
      ) : (
        <View style={[styles.invite, { backgroundColor: colors.accentSoft }]}>
          <View style={styles.inviteHead}>
            <View style={[styles.inviteIcon, { backgroundColor: colors.surface }]}>
              <CloudUpIcon color={colors.accentText} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText font="semibold" size={15}>
                {t.account.inviteTitle}
              </AppText>
              <AppText size={13} style={{ lineHeight: 19 }}>
                {t.account.inviteBody}
              </AppText>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Button title={t.account.signIn} onPress={() => router.push('/login')} />
          </View>
        </View>
      )}
    </View>
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
    minHeight: 44,
  },
  invite: { padding: spacing.lg, borderRadius: radius.lg, gap: spacing.md },
  inviteHead: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  inviteIcon: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
