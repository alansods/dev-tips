import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { ProgressRing } from '../../components/ProgressRing';
import { Screen } from '../../components/Screen';
import { catalog } from '../../content/catalog';
import type { Theme } from '../../content';
import { useT } from '../../i18n';
import { deckStats, themeStats } from '../../study/rules';
import { useStudyStore } from '../../study/store';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/tokens';

export default function ProgressScreen() {
  return (
    <Screen>
      {catalog.map((theme) => (
        <ThemeProgress key={theme.id} theme={theme} />
      ))}
    </Screen>
  );
}

function ThemeProgress({ theme }: { theme: Theme }) {
  const { colors } = useTheme();
  const t = useT();
  const progress = useStudyStore((s) => s.progress);
  const resetTheme = useStudyStore((s) => s.resetTheme);
  const [confirming, setConfirming] = useState(false);

  const stats = themeStats(theme, progress);
  const percent = Math.round((stats.known / stats.total) * 100);
  const unseen = stats.total - stats.answered;

  return (
    <View testID={`theme-progress-${theme.id}`} style={{ gap: spacing.lg }}>
      <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <ProgressRing percent={percent} label={t.progress.ring(percent)} />
        <View style={{ flex: 1, gap: 4 }}>
          <AppText font="semibold" size={16} accessibilityRole="header">
            {theme.title}
          </AppText>
          <AppText size={13} tone="muted">{t.progress.mastered(stats.known, stats.total)}</AppText>
        </View>
      </View>

      <View style={styles.counts}>
        <Count value={stats.known} label={t.answer.known.short} bg={colors.accentSoft} tone="accentText" />
        <Count value={stats.unknown} label={t.progress.toReview} bg={colors.warnSoft} tone="warn" />
        <Count value={unseen} label={t.progress.unseen} bg={colors.surface2} tone="ink" />
      </View>

      <AppText font="bold" size={17}>
        {t.progress.byDeck}
      </AppText>
      {theme.decks.map((deck) => {
        const ds = deckStats(theme.id, deck, progress);
        return (
          <View key={deck.id} style={[styles.deck, { backgroundColor: colors.surface, borderColor: colors.line }]}>
            <View style={styles.deckHead}>
              <AppText font="semibold" size={15} style={{ flex: 1 }}>
                {deck.title}
              </AppText>
              <AppText font="mono" size={12} tone="muted">{`${ds.known}/${ds.total}`}</AppText>
            </View>
            <ProgressBar value={ds.known / ds.total} unknownValue={ds.unknown / ds.total} height={8} />
          </View>
        );
      })}

      <View style={styles.legend}>
        <Legend color={colors.accent} label={t.answer.known.short} />
        <Legend color={colors.warn} label={t.progress.toReview} />
      </View>

      {confirming ? (
        <View style={[styles.confirm, { backgroundColor: colors.surface, borderColor: colors.warn }]}>
          <AppText font="semibold">{t.progress.confirmTitle}</AppText>
          <AppText size={13} tone="muted">
            {t.progress.confirmBody}
          </AppText>
          <View style={styles.row}>
            <Button title={t.common.cancel} variant="secondary" onPress={() => setConfirming(false)} />
            <Button
              title={t.progress.confirm}
              variant="warn"
              onPress={() => {
                resetTheme(theme.id);
                setConfirming(false);
              }}
            />
          </View>
        </View>
      ) : (
        <View style={styles.row}>
          <Button title={t.progress.reset} variant="secondary" onPress={() => setConfirming(true)} />
        </View>
      )}
    </View>
  );
}

function Count({
  value,
  label,
  bg,
  tone,
}: {
  value: number;
  label: string;
  bg: string;
  tone: 'accentText' | 'warn' | 'ink';
}) {
  return (
    <View accessible accessibilityLabel={`${value} ${label}`} style={[styles.count, { backgroundColor: bg }]}>
      <AppText font="monoMedium" size={22} tone={tone}>
        {String(value)}
      </AppText>
      <AppText size={12}>{label}</AppText>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <AppText size={12} tone="muted">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  counts: { flexDirection: 'row', gap: spacing.sm },
  count: { flex: 1, padding: spacing.md, borderRadius: radius.md, gap: 2 },
  deck: { padding: spacing.md, borderRadius: radius.md, borderWidth: 1, gap: spacing.sm },
  deckHead: { flexDirection: 'row', gap: spacing.sm },
  legend: { flexDirection: 'row', gap: spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 10, height: 10, borderRadius: 2 },
  confirm: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1.5, gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.md },
});
