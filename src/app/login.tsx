// Tela de login (opção C do protótipo). Aparece uma vez no primeiro uso e
// depois só pelo "Entrar" de Ajustes. O app funciona normalmente sem conta.

import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signIn } from '../auth/actions';
import { GoogleButton } from '../auth/GoogleButton';
import { LoginIllustration } from '../auth/LoginIllustration';
import { AppText } from '../components/AppText';
import { AppMark } from '../components/icons';
import { useSettingsStore, useT } from '../i18n';
import { legalUrls } from '../settings/legal';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';

/** Sai do login: volta para quem abriu (Ajustes) ou, no primeiro uso, vai para a aba Trilhas. */
function leave() {
  useSettingsStore.getState().setOnboardingSeen();
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function LoginScreen() {
  const { colors } = useTheme();
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const legal = legalUrls();

  const onGoogle = async () => {
    setMessage(null);
    setLoading(true);
    const outcome = await signIn();
    setLoading(false);
    if (outcome === 'success') leave();
    else if (outcome === 'offline') setMessage(t.auth.offline);
    else if (outcome === 'error') setMessage(t.auth.error);
  };

  const openUrl = (url?: string) => {
    if (url) Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <AppMark />
          </View>
          <AppText font="bold" size={20}>
            {t.auth.appName}
          </AppText>
        </View>

        <View style={styles.hero}>
          <LoginIllustration />
          <View style={{ gap: 10 }}>
            <AppText font="bold" size={30} accessibilityRole="header" style={{ lineHeight: 36 }}>
              {t.auth.title}
            </AppText>
            <AppText size={16} tone="muted" style={{ lineHeight: 24 }}>
              {t.auth.body}
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          {message ? (
            <View
              accessibilityRole="alert"
              style={[styles.alert, { backgroundColor: colors.warnSoft, borderColor: colors.warn }]}
            >
              <AppText size={14}>{message}</AppText>
            </View>
          ) : null}
          <GoogleButton
            label={loading ? t.auth.signingIn : t.auth.google}
            loading={loading}
            disabled={loading}
            onPress={() => void onGoogle()}
          />
          <AppText size={13} tone="muted" style={styles.hint}>
            {t.auth.signupHint}
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.auth.skip}
            accessibilityState={{ disabled: loading }}
            disabled={loading}
            onPress={leave}
            style={({ pressed }) => [
              styles.skip,
              { backgroundColor: colors.surface, borderColor: colors.line, opacity: loading ? 0.5 : pressed ? 0.8 : 1 },
            ]}
          >
            <AppText font="semibold" size={16}>
              {t.auth.skip}
            </AppText>
          </Pressable>
          <AppText size={12} tone="muted" style={styles.consent}>
            {t.auth.consentStart}{' '}
            <AppText size={12} tone="accentText" accessibilityRole="link" onPress={() => openUrl(legal?.termsUrl)}>
              {t.settings.terms}
            </AppText>{' '}
            {t.auth.consentAnd}{' '}
            <AppText size={12} tone="accentText" accessibilityRole="link" onPress={() => openUrl(legal?.privacyUrl)}>
              {t.settings.privacy}
            </AppText>
            .
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: spacing.xl, paddingTop: spacing.lg, gap: spacing.xl },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  hero: { flex: 1, justifyContent: 'center', gap: 32 },
  actions: { gap: spacing.md },
  alert: { padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  skip: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { textAlign: 'center', lineHeight: 18 },
  consent: { textAlign: 'center', lineHeight: 18, marginTop: spacing.sm },
});
