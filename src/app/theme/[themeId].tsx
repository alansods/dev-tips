import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../../components/AppText';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { BackIcon } from '../../components/icons';
import { ProgressBar } from '../../components/ProgressBar';
import { getTheme } from '../../content/catalog';
import type { Deck, Theme } from '../../content';
import { DECK_ACTION_LABEL } from '../../study/copy';
import { deckAction, deckStats, themeStats } from '../../study/rules';
import { useStudyStore } from '../../study/store';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { radius, spacing } from '../../theme/tokens';

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function ThemeScreen() {
  const { themeId } = useLocalSearchParams<{ themeId: string }>();
  const { colors } = useTheme();
  const theme = getTheme(String(themeId));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton label="Voltar" onPress={goBack}>
          <BackIcon color={colors.ink} />
        </IconButton>
        <AppText font="mono" size={11} tone="muted" style={styles.kicker}>
          Tema
        </AppText>
        <ThemeToggle />
      </View>
      {theme ? <ThemeContent theme={theme} /> : <AppText style={styles.missing}>Tema não encontrado.</AppText>}
    </SafeAreaView>
  );
}

function ThemeContent({ theme }: { theme: Theme }) {
  const { colors } = useTheme();
  const progress = useStudyStore((s) => s.progress);
  const stats = themeStats(theme, progress);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppText font="bold" size={24} accessibilityRole="header" style={{ lineHeight: 30 }}>
        {theme.title}
      </AppText>
      <AppText size={15} tone="muted">
        {theme.description}
      </AppText>

      {theme.variants?.length ? (
        <View style={styles.chips}>
          {theme.variants.map((v) => (
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
        accessibilityLabel={`${stats.known} de ${stats.total} cards que você sabe`}
        style={[styles.stats, { backgroundColor: colors.surface, borderColor: colors.line }]}
      >
        <AppText font="monoMedium" size={22}>{`${stats.known}/${stats.total}`}</AppText>
        <AppText size={12} tone="muted">
          cards que você sabe
        </AppText>
      </View>

      <AppText font="bold" size={17} style={{ marginTop: spacing.xs }}>
        Decks
      </AppText>
      {theme.decks.map((deck, i) => (
        <DeckItem key={deck.id} theme={theme} deck={deck} index={i} />
      ))}
    </ScrollView>
  );
}

function DeckItem({ theme, deck, index }: { theme: Theme; deck: Deck; index: number }) {
  const { colors } = useTheme();
  const progress = useStudyStore((s) => s.progress);
  const stats = deckStats(theme.id, deck, progress);
  const action = DECK_ACTION_LABEL[deckAction(stats)];

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
          <AppText size={12} tone="muted">{`${stats.total} cards`}</AppText>
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
          accessibilityLabel={`${action} ${deck.title}`}
          onPress={() => router.push(`/study/${theme.id}/${deck.id}`)}
        />
      </View>
    </View>
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
  kicker: { flex: 1, textTransform: 'uppercase', letterSpacing: 0.8 },
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
  deck: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md },
  deckHead: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  deckNum: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
