import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { TechIcon } from '../../components/TechIcon';
import { AreaCard, TrackCard } from '../../components/TrackCard';
import { repoTaxonomy } from '../../content';
import { languageIcon } from '../../content/icons';
import { areasWithTracks } from '../../content/navigation';
import { filterTracks, hasActiveFilter, type TrackFilter, type TrackStatusFilter } from '../../content/search';
import { useCatalog } from '../../content/useCatalog';
import { useT } from '../../i18n';
import { trackStats, trackStatus } from '../../study/rules';
import { useStudyStore } from '../../study/store';
import { useFontsReady } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { fontFamilies, radius, spacing } from '../../theme/tokens';

const STATUSES: readonly TrackStatusFilter[] = ['all', 'started', 'new', 'done'];

function SectionTitle({ children }: { children: string }) {
  return (
    <AppText font="mono" size={11} tone="muted" accessibilityRole="header" style={styles.kicker}>
      {children}
    </AppText>
  );
}

/** Aba Trilhas: busca, filtros de estado, atalho por linguagem e as áreas. */
export default function TracksScreen() {
  const { colors } = useTheme();
  const t = useT();
  const fontsReady = useFontsReady();
  const catalog = useCatalog();
  const progress = useStudyStore((s) => s.progress);
  const [filter, setFilter] = useState<TrackFilter>({ query: '', language: null, status: 'all' });

  const statusOf = (track: (typeof catalog)[number]) => trackStatus(trackStats(track, progress));
  const startedCount = catalog.filter((track) => statusOf(track) === 'started').length;
  const languages = repoTaxonomy.languages.filter((l) => catalog.some((track) => track.language === l.id));
  const results = filterTracks(catalog, repoTaxonomy, filter, statusOf);

  return (
    <Screen>
      <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <TextInput
          accessibilityLabel={t.nav.searchLabel}
          placeholder={t.nav.searchLabel}
          placeholderTextColor={colors.muted}
          value={filter.query}
          onChangeText={(query) => setFilter((f) => ({ ...f, query }))}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          style={[styles.input, { color: colors.ink, fontFamily: fontsReady ? fontFamilies.regular : undefined }]}
        />
      </View>

      <View style={styles.chips}>
        {STATUSES.map((status) => {
          const selected = filter.status === status;
          const label =
            status === 'started' ? t.nav.filterCount(t.nav.filters.started, startedCount) : t.nav.filters[status];
          return (
            <Pressable
              key={status}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected }}
              onPress={() => setFilter((f) => ({ ...f, status }))}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: selected ? colors.ink : colors.surface,
                  borderColor: selected ? colors.ink : colors.line,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <AppText
                size={14}
                font={selected ? 'semibold' : 'regular'}
                style={{ color: selected ? colors.bg : colors.ink }}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle>{t.nav.byLanguage}</SectionTitle>
      <View style={styles.grid}>
        {languages.map((language) => {
          const selected = filter.language === language.id;
          return (
            <Pressable
              key={language.id}
              accessibilityRole="button"
              accessibilityLabel={language.name}
              accessibilityState={{ selected }}
              onPress={() => setFilter((f) => ({ ...f, language: selected ? null : language.id }))}
              style={({ pressed }) => [
                styles.language,
                {
                  backgroundColor: selected ? colors.accentSoft : colors.surface,
                  borderColor: selected ? colors.accent : colors.line,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <TechIcon icon={languageIcon(language)} size={40} />
              <AppText size={12}>{language.name}</AppText>
            </Pressable>
          );
        })}
      </View>

      {hasActiveFilter(filter) ? (
        results.length === 0 ? (
          <AppText tone="muted" style={styles.empty}>
            {t.nav.noResults}
          </AppText>
        ) : (
          results.map((track) => <TrackCard key={track.id} track={track} />)
        )
      ) : (
        <>
          <SectionTitle>{t.nav.byArea}</SectionTitle>
          <View style={styles.areas}>
            {areasWithTracks(catalog).map(({ area, tracks }) => (
              <View key={area} style={styles.area}>
                <AreaCard
                  area={area}
                  name={t.nav.areas[area]}
                  tracks={tracks}
                  onPress={() => router.push(`/area/${area}`)}
                  compact
                />
              </View>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.md },
  input: { minHeight: 48, fontSize: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { minHeight: 40, paddingHorizontal: spacing.md, borderRadius: 999, borderWidth: 1, justifyContent: 'center' },
  kicker: { textTransform: 'uppercase', letterSpacing: 0.8, marginTop: spacing.xs },
  grid: { flexDirection: 'row', gap: spacing.sm },
  language: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  areas: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  area: { width: '47.5%' },
  empty: { paddingVertical: spacing.xl, textAlign: 'center' },
});
