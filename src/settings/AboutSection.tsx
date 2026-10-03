// Seção "Sobre" de Ajustes: links legais (abrem no navegador) e a versão do app.
// Os endereços ficam em app.json → extra.legal (ver legal.ts).

import Constants from 'expo-constants';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { ExternalLinkIcon } from '../components/icons';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { legalUrls } from './legal';
import { SectionTitle } from './SectionTitle';

export function AboutSection() {
  const { colors } = useTheme();
  const t = useT();
  const legal = legalUrls();
  const version = Constants.expoConfig?.version ?? '';

  const links = legal
    ? [
        { label: t.settings.privacy, url: legal.privacyUrl },
        { label: t.settings.terms, url: legal.termsUrl },
      ]
    : [];

  return (
    <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
      <SectionTitle>{t.settings.about}</SectionTitle>
      <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        {links.map((link, i) => (
          <Pressable
            key={link.url}
            accessibilityRole="button"
            accessibilityLabel={link.label}
            onPress={() => {
              Linking.openURL(link.url).catch(() => {});
            }}
            style={({ pressed }) => [
              styles.row,
              i > 0 && { borderTopWidth: 1, borderColor: colors.line },
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <AppText size={15} style={{ flex: 1 }}>
              {link.label}
            </AppText>
            <ExternalLinkIcon color={colors.muted} />
          </Pressable>
        ))}
        <View
          accessible
          accessibilityLabel={t.settings.versionLabel(version)}
          style={[styles.row, links.length > 0 && { borderTopWidth: 1, borderColor: colors.line }]}
        >
          <AppText size={15} style={{ flex: 1 }}>
            {t.settings.version}
          </AppText>
          <AppText font="mono" size={13} tone="muted">
            {version}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 52, paddingHorizontal: spacing.lg, gap: spacing.md },
});
