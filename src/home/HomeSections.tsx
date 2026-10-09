// Seções da aba Início. As regras ficam em ./sections; aqui só o desenho.
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useAccountStore } from '../auth/store';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { ChevronRightIcon } from '../components/icons';
import { ProgressBar } from '../components/ProgressBar';
import { TechIcon } from '../components/TechIcon';
import { isSimulation, repoTaxonomy, type Track } from '../content';
import { trackIcon } from '../content/icons';
import { useCatalog } from '../content/useCatalog';
import { useSettingsStore, useT } from '../i18n';
import { now, today } from '../study/clock';
import { useStudyStore } from '../study/store';
import { currentStreak } from '../study/streak';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { InterestChips } from './InterestChips';
import {
  continueTarget,
  firstName,
  greetingPeriod,
  inProgressTracks,
  lastSevenDays,
  reviewSummary,
  startHere,
  suggestions,
  whatsNew,
  type WhatsNewItem,
} from './sections';

function SectionTitle({ children, action }: { children: string; action?: ReactNode }) {
  return (
    <View style={styles.titleRow}>
      <AppText font="bold" size={17} accessibilityRole="header" style={{ flex: 1 }}>
        {children}
      </AppText>
      {action}
    </View>
  );
}

function Surface({ children, label, onPress }: { children: ReactNode; label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.surface,
        { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {children}
    </Pressable>
  );
}

const openTrack = (track: Track) => router.push(`/track/${track.id}`);

export function Greeting() {
  const { colors } = useTheme();
  const t = useT();
  const user = useAccountStore((s) => s.user);
  const studyDays = useStudyStore((s) => s.studyDays);
  const streak = currentStreak(studyDays, today());
  const greeting = t.home.greeting[greetingPeriod(now().getHours())];
  const name = firstName(user?.name);
  return (
    <View style={styles.greeting}>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText size={14} tone="muted">
          {name ? t.home.greetingWithName(greeting, name) : greeting}
        </AppText>
        <AppText font="bold" size={24} style={{ lineHeight: 30 }}>
          {t.home.headline}
        </AppText>
      </View>
      {streak > 0 ? (
        <View
          accessible
          accessibilityLabel={t.home.streakLabel(streak)}
          style={[styles.streak, { backgroundColor: colors.surface, borderColor: colors.line }]}
        >
          <AppText font="semibold" size={13}>
            {t.home.streak(streak)}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

export function ReviewSection() {
  const { colors } = useTheme();
  const t = useT();
  const catalog = useCatalog();
  const schedule = useStudyStore((s) => s.schedule);
  const studyDays = useStudyStore((s) => s.studyDays);
  const day = today();
  const summary = reviewSummary(catalog, schedule, day);

  if (summary.total === 0) {
    const week = lastSevenDays(studyDays, day);
    const studied = week.filter((d) => d.studied).length;
    return (
      <View style={[styles.surface, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <AppText font="semibold" size={16}>
          {t.home.nothingToReview}
        </AppText>
        {summary.tomorrow > 0 ? (
          <AppText size={13} tone="muted">
            {t.home.tomorrow(summary.tomorrow)}
          </AppText>
        ) : null}
        <View accessible accessibilityLabel={t.home.week(studied)} style={styles.week}>
          {week.map(({ day: d, studied: done }) => (
            <View key={d} style={styles.weekDay}>
              <View
                style={[
                  styles.weekBar,
                  done ? { backgroundColor: colors.accent } : { borderWidth: 1.5, borderColor: colors.line },
                ]}
              />
              <AppText size={11} tone="muted">
                {t.home.weekdays[new Date(`${d}T12:00:00Z`).getUTCDay()]}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.review, { backgroundColor: colors.accent }]}>
      <AppText font="mono" size={11} style={[styles.kicker, { color: colors.onAccent }]}>
        {t.home.reviewKicker}
      </AppText>
      <AppText font="bold" size={20} style={{ color: colors.onAccent }}>
        {t.home.reviewCount(summary.total)}
      </AppText>
      <View style={styles.reviewMeta}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {summary.tracks.slice(0, 3).map(({ track }) => (
            <TechIcon key={track.id} icon={trackIcon(track, repoTaxonomy)} size={32} />
          ))}
        </View>
        <AppText size={13} style={{ color: colors.onAccent }}>
          {t.home.reviewMeta(summary.tracks.length, summary.minutes)}
        </AppText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.home.startReview}
        onPress={() => router.push('/review')}
        style={({ pressed }) => [styles.reviewButton, { backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 }]}
      >
        <AppText font="semibold" size={15} tone="accentText">
          {t.home.startReview}
        </AppText>
      </Pressable>
    </View>
  );
}

export function ContinueSection() {
  const t = useT();
  const catalog = useCatalog();
  const progress = useStudyStore((s) => s.progress);
  const lastAnswer = useStudyStore((s) => s.lastAnswer);
  const target = continueTarget(catalog, lastAnswer, progress);
  const others = inProgressTracks(catalog, progress, target?.track.id);
  if (!target && others.length === 0) return null;
  return (
    <View style={styles.section}>
      {target ? (
        <>
          <SectionTitle>{t.home.continueTitle}</SectionTitle>
          <Surface
            label={t.home.continueLabel(
              target.track.title,
              isSimulation(target.track) ? t.simulation.kicker : target.deck.title,
            )}
            onPress={() => router.push(`/study/${target.track.id}/${target.deck.id}`)}
          >
            <View style={styles.row}>
              <TechIcon icon={trackIcon(target.track, repoTaxonomy)} size={48} />
              <View style={{ flex: 1, gap: 4 }}>
                <AppText size={12} tone="muted">
                  {target.track.title}
                </AppText>
                <AppText font="semibold" size={15}>
                  {isSimulation(target.track)
                    ? t.simulation.kicker
                    : t.home.deckPosition(target.position, target.deckCount, target.deck.title)}
                </AppText>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <ProgressBar value={target.stats.total ? target.stats.known / target.stats.total : 0} />
                  </View>
                  <AppText font="mono" size={11} tone="muted">{`${target.stats.known}/${target.stats.total}`}</AppText>
                </View>
              </View>
            </View>
          </Surface>
        </>
      ) : null}
      {others.length > 0 ? (
        <>
          <SectionTitle>{t.home.alsoInProgress}</SectionTitle>
          {others.map(({ track, percent }) => (
            <Surface key={track.id} label={`${track.title}, ${percent}%`} onPress={() => openTrack(track)}>
              <View style={styles.row}>
                <TechIcon icon={trackIcon(track, repoTaxonomy)} size={32} />
                <AppText size={15} style={{ flex: 1 }}>
                  {track.title}
                </AppText>
                <AppText font="mono" size={12} tone="muted">{`${percent}%`}</AppText>
              </View>
            </Surface>
          ))}
        </>
      ) : null}
    </View>
  );
}

export function SuggestionsSection() {
  const { colors } = useTheme();
  const t = useT();
  const catalog = useCatalog();
  const progress = useStudyStore((s) => s.progress);
  const lastAnswer = useStudyStore((s) => s.lastAnswer);
  const interests = useSettingsStore((s) => s.interests);
  const result = suggestions(catalog, progress, lastAnswer?.trackId ?? null, interests);
  if (!result) return null;
  return (
    <View style={styles.section}>
      <SectionTitle>{result.kind === 'next' ? t.home.nextAfter(result.after.title) : t.home.forYou}</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
        {result.tracks.map((track) => (
          <Pressable
            key={track.id}
            accessibilityRole="button"
            accessibilityLabel={track.title}
            onPress={() => openTrack(track)}
            style={({ pressed }) => [
              styles.suggestion,
              { backgroundColor: colors.surface, borderColor: colors.line, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <TechIcon icon={trackIcon(track, repoTaxonomy)} size={40} />
            <AppText font="semibold" size={15}>
              {track.title}
            </AppText>
            <AppText size={13} tone="muted" numberOfLines={3}>
              {track.description}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export function WhatsNewSection() {
  const t = useT();
  const items = whatsNew(useCatalog(), today());
  if (items.length === 0) return null;
  return (
    <View style={styles.section}>
      <SectionTitle
        action={
          <Pressable accessibilityRole="link" onPress={() => router.navigate('/tracks')} style={styles.link}>
            <AppText font="medium" size={14} tone="accentText">
              {t.home.seeAll}
            </AppText>
          </Pressable>
        }
      >
        {t.home.whatsNew}
      </SectionTitle>
      {items.map((item) => (
        <WhatsNewRow key={item.kind === 'area' ? `area:${item.area}` : item.track.id} item={item} />
      ))}
    </View>
  );
}

/** Uma novidade: área nova (abre a área) ou trilha/simulação nova (abre a tela dela). */
function WhatsNewRow({ item }: { item: WhatsNewItem }) {
  const { colors } = useTheme();
  const t = useT();
  const area = item.kind === 'area' ? item.area : undefined;
  const title = area ? t.nav.areas[area] : item.kind === 'track' ? item.track.title : '';
  const count =
    item.kind === 'area'
      ? item.area === 'simulacoes'
        ? t.nav.simulationCount(item.tracks.length)
        : t.nav.trackCount(item.tracks.length)
      : undefined;
  const badge = area ? t.home.newAreaBadge : t.home.newBadge;
  return (
    <Surface
      label={[title, count, badge].filter(Boolean).join(', ')}
      onPress={() => (item.kind === 'area' ? router.push(`/area/${item.area}`) : openTrack(item.track))}
    >
      <View style={styles.row}>
        <TechIcon
          icon={item.kind === 'area' ? { kind: 'area', area: item.area } : trackIcon(item.track, repoTaxonomy)}
          size={32}
        />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText size={15}>{title}</AppText>
          {count ? (
            <AppText size={12} tone="muted">
              {count}
            </AppText>
          ) : null}
        </View>
        <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
          <AppText font="mono" size={11} tone="accentText">
            {badge.toUpperCase()}
          </AppText>
        </View>
      </View>
    </Surface>
  );
}

export function FirstAccess() {
  const { colors } = useTheme();
  const t = useT();
  const catalog = useCatalog();
  const interests = useSettingsStore((s) => s.interests);
  const start = startHere(catalog, interests);
  return (
    <View style={styles.firstAccess}>
      <View style={{ gap: spacing.sm }}>
        <AppText font="semibold" size={16} tone="accentText">
          {t.home.welcomeKicker}
        </AppText>
        <AppText font="bold" size={22} accessibilityRole="header" style={{ lineHeight: 28 }}>
          {t.home.welcomeTitle}
        </AppText>
        <AppText size={15} tone="muted" style={{ lineHeight: 22 }}>
          {t.home.welcomeBody}
        </AppText>
      </View>
      <View style={styles.firstSection}>
        <SectionTitle>{t.home.whatToStudy}</SectionTitle>
        <InterestChips />
        <AppText size={13} tone="muted" style={{ lineHeight: 19 }}>
          {t.home.interestsHint}
        </AppText>
      </View>
      {start ? (
        <View style={styles.firstSection}>
          <SectionTitle>{t.home.startHere}</SectionTitle>
          <View
            style={[styles.surface, styles.startCard, { backgroundColor: colors.surface, borderColor: colors.line }]}
          >
            <View style={styles.row}>
              <TechIcon icon={trackIcon(start.start, repoTaxonomy)} size={40} />
              <AppText font="bold" size={18} style={{ flex: 1 }}>
                {start.start.title}
              </AppText>
            </View>
            <AppText size={14} tone="muted" style={{ lineHeight: 20 }}>
              {start.start.description}
            </AppText>
            <View style={{ flexDirection: 'row', marginTop: spacing.xs }}>
              <Button title={t.home.startTrack} onPress={() => openTrack(start.start)} />
            </View>
          </View>
          {start.then ? (
            <Surface label={t.home.then(start.then.title)} onPress={() => openTrack(start.then!)}>
              <View style={styles.row}>
                <TechIcon icon={trackIcon(start.then, repoTaxonomy)} size={32} />
                <AppText size={15} style={{ flex: 1 }}>
                  {t.home.then(start.then.title)}
                </AppText>
                <ChevronRightIcon color={colors.muted} />
              </View>
            </Surface>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  section: { gap: spacing.sm },
  firstAccess: { gap: 32, paddingTop: spacing.sm },
  firstSection: { gap: spacing.md },
  startCard: { gap: spacing.md },
  surface: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  streak: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999, borderWidth: 1 },
  review: { padding: spacing.lg, borderRadius: radius.xl, gap: spacing.sm },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reviewButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  kicker: { textTransform: 'uppercase', letterSpacing: 0.8 },
  week: { flexDirection: 'row', gap: 6, marginTop: spacing.xs },
  weekDay: { flex: 1, alignItems: 'center', gap: 4 },
  weekBar: { alignSelf: 'stretch', height: 28, borderRadius: 8 },
  suggestion: { width: 210, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm },
  link: { minHeight: 44, justifyContent: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
});
