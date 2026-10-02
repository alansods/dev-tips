import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { ProgressBar } from '../../components/ProgressBar';
import { Screen } from '../../components/Screen';
import { catalog } from '../../content/catalog';
import type { Theme } from '../../content';
import { useT } from '../../i18n';
import { today } from '../../study/clock';
import { themeStats } from '../../study/rules';
import { dueCardIds } from '../../study/srs';
import { useStudyStore } from '../../study/store';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/tokens';

export default function HomeScreen() {
  return (
    <Screen>
      {catalog.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} />
      ))}
    </Screen>
  );
}

function ThemeCard({ theme }: { theme: Theme }) {
  const { colors } = useTheme();
  const t = useT();
  const progress = useStudyStore((s) => s.progress);
  const stats = themeStats(theme, progress);
  const schedule = useStudyStore((s) => s.schedule);
  const due = dueCardIds(theme, schedule, today()).length;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.home.cardLabel(theme.title, stats.known, stats.total)}
      onPress={() => router.push(`/theme/${theme.id}`)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <AppText font="semibold" size={16}>
        {theme.title}
      </AppText>
      <AppText size={13} tone="muted">
        {theme.description}
      </AppText>
      <View style={styles.progressRow}>
        <View style={{ flex: 1 }}>
          <ProgressBar value={stats.known / stats.total} />
        </View>
        <AppText font="mono" size={12} tone="muted">{`${stats.known}/${stats.total}`}</AppText>
      </View>
      {due > 0 && <AppText font="medium" size={13} tone="warn">{t.home.dueBadge(due)}</AppText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs },
});
