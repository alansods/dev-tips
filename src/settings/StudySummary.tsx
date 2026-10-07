// Seção "Seu estudo" do Perfil: dias seguidos, cards que sei e trilhas
// iniciadas, e a linha que abre o progresso por trilha.
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { ChevronRightIcon, ProgressIcon } from '../components/icons';
import { useCatalog } from '../content/useCatalog';
import { useT } from '../i18n';
import { today } from '../study/clock';
import { trackStats } from '../study/rules';
import { useStudyStore } from '../study/store';
import { currentStreak } from '../study/streak';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { SectionTitle } from './SectionTitle';

function Stat({ value, label }: { value: number; label: string }) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${value} ${label}`}
      style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.line }]}
    >
      <AppText font="bold" size={22}>
        {String(value)}
      </AppText>
      <AppText size={12} tone="muted">
        {label}
      </AppText>
    </View>
  );
}

export function StudySummary() {
  const { colors } = useTheme();
  const t = useT();
  const catalog = useCatalog();
  const progress = useStudyStore((s) => s.progress);
  const studyDays = useStudyStore((s) => s.studyDays);

  const streak = currentStreak(studyDays, today());
  const stats = catalog.map((track) => trackStats(track, progress));
  const known = stats.reduce((n, s) => n + s.known, 0);
  const started = stats.filter((s) => s.answered > 0).length;

  return (
    <View style={{ gap: spacing.sm }}>
      <SectionTitle>{t.settings.study}</SectionTitle>
      <View style={styles.stats}>
        <Stat value={streak} label={t.settings.streak(streak)} />
        <Stat value={known} label={t.settings.knownCards(known)} />
        <Stat value={started} label={t.settings.startedTracks(started)} />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.settings.progressByTrack}
        onPress={() => router.push('/progress')}
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <ProgressIcon color={colors.muted} size={20} />
        <AppText size={15} style={{ flex: 1 }}>
          {t.settings.progressByTrack}
        </AppText>
        <ChevronRightIcon color={colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, padding: spacing.md, borderWidth: 1, borderRadius: radius.lg, gap: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.lg,
  },
});
