// Tela Plano: só o bloco do plano (grátis, assinante ou admin), aberta pela
// linha "Dev Tips Pro" do Perfil. Dados da conta, Sair e Apagar ficam na tela Conta.

import { Redirect, router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAccountStore } from '../auth/store';
import { AppText } from '../components/AppText';
import { IconButton } from '../components/IconButton';
import { BackIcon } from '../components/icons';
import { useT } from '../i18n';
import { PlanCard } from '../subscriptions/PlanCard';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';

function backToProfile() {
  if (router.canGoBack()) router.back();
  else router.replace('/profile');
}

export default function PlanScreen() {
  const { colors } = useTheme();
  const t = useT();
  const user = useAccountStore((s) => s.user);

  if (!user) return <Redirect href="/profile" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton label={t.common.back} onPress={backToProfile}>
          <BackIcon color={colors.ink} />
        </IconButton>
        <AppText font="bold" size={20} accessibilityRole="header">
          {t.pro.planSection}
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <PlanCard />
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
});
