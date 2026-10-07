import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../../components/AppText';
import { Button } from '../../components/Button';
import { FullScreenHeader } from '../../components/FullScreen';
import { ProgressBar } from '../../components/ProgressBar';
import { TechIcon } from '../../components/TechIcon';
import { repoTaxonomy } from '../../content';
import { trackIcon } from '../../content/icons';
import { useCatalogTrack } from '../../content/useCatalog';
import type { Deck, Track } from '../../content';
import { useT } from '../../i18n';
import { today } from '../../study/clock';
import { deckAction, deckStats, trackStats } from '../../study/rules';
import { dueCardIds } from '../../study/srs';
import { useStudyStore } from '../../study/store';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/tokens';

export default function TrackScreen() {
  const { trackId } = useLocalSearchParams<{ trackId: string }>();
  const { colors } = useTheme();
  const t = useT();
  const track = useCatalogTrack(String(trackId));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <FullScreenHeader kicker={t.track.kicker} />
      {track ? <TrackContent track={track} /> : <AppText style={styles.missing}>{t.common.trackNotFound}</AppText>}
    </SafeAreaView>
  );
}

function TrackContent({ track }: { track: Track }) {
  const { colors } = useTheme();
  const t = useT();
  const progress = useStudyStore((s) => s.progress);
  const stats = trackStats(track, progress);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <TechIcon icon={trackIcon(track, repoTaxonomy)} size={48} />
      <AppText font="bold" size={24} accessibilityRole="header" style={{ lineHeight: 30 }}>
        {track.title}
      </AppText>
      <AppText size={15} tone="muted">
        {track.description}
      </AppText>

      {track.variants?.length ? (
        <View style={styles.chips}>
          {track.variants.map((v) => (
            <View key={v.id} style={[styles.chip, { borderColor: colors.line, backgroundColor: colors.surface }]}>
              <AppText font="semibold" size={13}>
                {v.name}
              </AppText>
              <AppText font="mono" size={11} tone="muted">
                {v.language}
              </AppText>
            </View>
          ))}
        </View>
      ) : null}

      <View
        accessible
        accessibilityLabel={t.track.knownLabel(stats.known, stats.total)}
        style={[styles.stats, { backgroundColor: colors.surface, borderColor: colors.line }]}
      >
        <AppText font="monoMedium" size={22}>{`${stats.known}/${stats.total}`}</AppText>
        <AppText size={12} tone="muted">
          {t.track.knownCaption}
        </AppText>
      </View>

      <ReviewToday track={track} />

      <AppText font="bold" size={17} style={{ marginTop: spacing.xs }}>
        {t.track.decks}
      </AppText>
      {track.decks.map((deck, i) => (
        <DeckItem key={deck.id} track={track} deck={deck} index={i} />
      ))}
    </ScrollView>
  );
}

function ReviewToday({ track }: { track: Track }) {
  const { colors } = useTheme();
  const t = useT();
  const schedule = useStudyStore((s) => s.schedule);
  const due = dueCardIds(track, schedule, today()).length;
  return (
    <View
      style={[
        styles.review,
        { backgroundColor: due ? colors.warnSoft : colors.surface, borderColor: due ? colors.warn : colors.line },
      ]}
    >
      <AppText font="mono" size={11} tone={due ? 'warn' : 'muted'} style={styles.caps}>
        {t.track.reviewKicker}
      </AppText>
      {due ? (
        <>
          <AppText font="semibold" size={16}>
            {t.track.dueToday(due)}
          </AppText>
          <View style={{ flexDirection: 'row' }}>
            <Button title={t.track.reviewNow} onPress={() => router.push(`/review/${track.id}`)} />
          </View>
        </>
      ) : (
        <AppText size={14} tone="muted">
          {t.track.nothingToReview}
        </AppText>
      )}
    </View>
  );
}

function DeckItem({ track, deck, index }: { track: Track; deck: Deck; index: number }) {
  const { colors } = useTheme();
  const t = useT();
  const progress = useStudyStore((s) => s.progress);
  const stats = deckStats(track.id, deck, progress);
  const action = t.deckAction[deckAction(stats)];

  return (
    <View style={[styles.deck, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <View style={styles.deckHead}>
        <View style={[styles.deckNum, { backgroundColor: colors.accentSoft }]}>
          <AppText font="mono" size={12} tone="accentText">
            {String(index + 1).padStart(2, '0')}
          </AppText>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText font="semibold" size={16} accessibilityRole="header">
            {deck.title}
          </AppText>
          {deck.description ? (
            <AppText size={13} tone="muted">
              {deck.description}
            </AppText>
          ) : null}
          <AppText size={12} tone="muted">
            {t.track.deckCards(stats.total)}
          </AppText>
        </View>
      </View>
      <View style={styles.progressRow}>
        <View style={{ flex: 1 }}>
          <ProgressBar value={stats.known / stats.total} unknownValue={stats.unknown / stats.total} />
        </View>
        <AppText font="mono" size={12} tone="muted">{`${stats.known}/${stats.total}`}</AppText>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button
          title={action}
          accessibilityLabel={t.track.deckActionLabel(action, deck.title)}
          onPress={() => router.push(`/study/${track.id}/${deck.id}`)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caps: { textTransform: 'uppercase', letterSpacing: 0.8 },
  missing: { padding: spacing.lg },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  stats: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: 2 },
  review: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm },
  deck: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md },
  deckHead: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  deckNum: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
