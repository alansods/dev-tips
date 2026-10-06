import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Button } from '../../components/Button';
import { ExpansionPanel } from '../../components/ExpansionPanel';
import { ProgressBar } from '../../components/ProgressBar';
import { Screen } from '../../components/Screen';
import { useCatalog } from '../../content/useCatalog';
import type { Track } from '../../content';
import { useT } from '../../i18n';
import { deckStats, trackStats } from '../../study/rules';
import { useStudyStore } from '../../study/store';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/tokens';

export default function ProgressScreen() {
  const catalog = useCatalog();
  return (
    <Screen>
      {catalog.map((track) => (
        <TrackProgress key={track.id} track={track} />
      ))}
    </Screen>
  );
}

function TrackProgress({ track }: { track: Track }) {
  const { colors } = useTheme();
  const t = useT();
  const progress = useStudyStore((s) => s.progress);
  const resetTrack = useStudyStore((s) => s.resetTrack);
  const [confirming, setConfirming] = useState(false);

  const stats = trackStats(track, progress);
  const percent = Math.round((stats.known / stats.total) * 100);
  const unseen = stats.total - stats.answered;

  return (
    <ExpansionPanel
      testID={`track-progress-${track.id}`}
      headerTestID={`track-progress-header-${track.id}`}
      accessibilityLabel={`${track.title}, ${t.progress.ring(percent)}`}
      header={
        <View style={{ gap: spacing.sm }}>
          <View style={styles.headRow}>
            <AppText font="semibold" size={16} accessibilityRole="header" style={{ flex: 1 }}>
              {track.title}
            </AppText>
            <AppText font="monoMedium" size={14} accessibilityLabel={t.progress.ring(percent)}>
              {`${percent}%`}
            </AppText>
          </View>
          <ProgressBar
            testID={`track-progress-bar-${track.id}`}
            value={stats.known / stats.total}
            unknownValue={stats.unknown / stats.total}
          />
        </View>
      }
    >
      <View style={styles.counts}>
        <Count value={stats.known} label={t.answer.known.short} bg={colors.accentSoft} tone="accentText" />
        <Count value={stats.unknown} label={t.progress.toReview} bg={colors.warnSoft} tone="warn" />
        <Count value={unseen} label={t.progress.unseen} bg={colors.surface2} tone="ink" />
      </View>

      <AppText font="bold" size={17}>
        {t.progress.byDeck}
      </AppText>
      {track.decks.map((deck) => {
        const ds = deckStats(track.id, deck, progress);
        return (
          <View key={deck.id} style={[styles.deck, { backgroundColor: colors.bg, borderColor: colors.line }]}>
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
                resetTrack(track.id);
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
    </ExpansionPanel>
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
  headRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
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
