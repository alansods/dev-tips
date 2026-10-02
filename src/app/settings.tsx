import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { IconButton } from '../components/IconButton';
import { BackIcon } from '../components/icons';
import { LANGUAGE_NAMES, LANGUAGES, useLanguage, useSettingsStore, useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const t = useT();
  const language = useLanguage();
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton label={t.common.back} onPress={goBack}>
          <BackIcon color={colors.ink} />
        </IconButton>
        <AppText font="bold" size={20} accessibilityRole="header">
          {t.settings.title}
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText font="mono" size={11} tone="muted" style={styles.kicker}>
          {t.settings.language}
        </AppText>
        <View accessibilityRole="radiogroup" style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          {LANGUAGES.map((lang, i) => {
            const selected = lang === language;
            return (
              <Pressable
                key={lang}
                accessibilityRole="radio"
                accessibilityLabel={LANGUAGE_NAMES[lang]}
                accessibilityState={{ checked: selected }}
                onPress={() => setLanguage(lang)}
                style={({ pressed }) => [
                  styles.option,
                  i > 0 && { borderTopWidth: 1, borderColor: colors.line },
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <AppText size={15} style={{ flex: 1 }}>
                  {LANGUAGE_NAMES[lang]}
                </AppText>
                <View style={[styles.dot, { borderColor: selected ? colors.accent : colors.line }]}>
                  {selected ? <View style={[styles.dotInner, { backgroundColor: colors.accent }]} /> : null}
                </View>
              </Pressable>
            );
          })}
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
  content: { padding: spacing.lg, gap: spacing.sm },
  kicker: { textTransform: 'uppercase', letterSpacing: 0.8 },
  group: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  option: { flexDirection: 'row', alignItems: 'center', minHeight: 52, paddingHorizontal: spacing.lg, gap: spacing.md },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dotInner: { width: 10, height: 10, borderRadius: 5 },
});
