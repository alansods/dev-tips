import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { CheckIcon } from '../components/icons';
import { LEVELS, type Area } from '../content';
import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/tokens';
import { NO_FILTERS, type GlossaryFilters as Filters, type StudyFilter } from './search';

const STUDY: readonly StudyFilter[] = ['all', 'review', 'known', 'new'];

type Props = {
  visible: boolean;
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClose: () => void;
  /** Termos que atendem aos filtros e à busca, para o botão "Ver N termos". */
  resultCount: number;
  areas: readonly { area: Area; name: string }[];
  tracks: readonly { id: string; title: string; count: number }[];
};

function Option({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: selected ? colors.accentSoft : colors.surface,
          borderColor: selected ? colors.accent : colors.line,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <AppText size={14} font={selected ? 'semibold' : 'regular'} tone={selected ? 'accentText' : 'ink'}>
        {label}
      </AppText>
    </Pressable>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <AppText font="mono" size={11} tone="muted" accessibilityRole="header" style={styles.groupTitle}>
        {title}
      </AppText>
      {children}
    </View>
  );
}

/** Gaveta de filtros do glossário: seu estudo, área, nível e trilhas. Cada toque já filtra a lista. */
export function GlossaryFilters({ visible, filters, onChange, onClose, resultCount, areas, tracks }: Props) {
  const { colors } = useTheme();
  const t = useT();
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const toggleTrack = (id: string) =>
    set({
      trackIds: filters.trackIds.includes(id) ? filters.trackIds.filter((x) => x !== id) : [...filters.trackIds, id],
    });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.glossary.closeFilters}
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,8,12,0.55)' }]}
        />
        <SafeAreaView edges={['bottom']} style={[styles.panel, { backgroundColor: colors.surface }]}>
          <View testID="glossary-filters" style={styles.inner}>
            <View style={[styles.handle, { backgroundColor: colors.line }]} />
            <View style={styles.head}>
              <AppText font="bold" size={18} accessibilityRole="header">
                {t.glossary.filters(0)}
              </AppText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.glossary.clearFilters}
                onPress={() => onChange(NO_FILTERS)}
                hitSlop={8}
                style={styles.clear}
              >
                <AppText size={14} tone="accentText">
                  {t.glossary.clearFilters}
                </AppText>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.groups}>
              <Group title={t.glossary.filterGroups.study}>
                <View style={styles.wrap}>
                  {STUDY.map((study) => (
                    <Option
                      key={study}
                      label={t.glossary.study[study]}
                      selected={filters.study === study}
                      onPress={() => set({ study })}
                    />
                  ))}
                </View>
              </Group>

              <Group title={t.glossary.filterGroups.area}>
                <View style={styles.wrap}>
                  {areas.map(({ area, name }) => (
                    <Option
                      key={area}
                      label={name}
                      selected={filters.area === area}
                      onPress={() => set({ area: filters.area === area ? null : area })}
                    />
                  ))}
                </View>
              </Group>

              <Group title={t.glossary.filterGroups.level}>
                <View style={styles.wrap}>
                  {LEVELS.map((level) => (
                    <Option
                      key={level}
                      label={t.card.levels[level]}
                      selected={filters.level === level}
                      onPress={() => set({ level: filters.level === level ? null : level })}
                    />
                  ))}
                </View>
              </Group>

              <Group title={t.glossary.filterGroups.track}>
                <View style={[styles.tracks, { borderColor: colors.line }]}>
                  {tracks.map((track) => {
                    const selected = filters.trackIds.includes(track.id);
                    return (
                      <Pressable
                        key={track.id}
                        accessibilityRole="checkbox"
                        accessibilityLabel={track.title}
                        accessibilityState={{ checked: selected }}
                        onPress={() => toggleTrack(track.id)}
                        style={({ pressed }) => [
                          styles.track,
                          { borderColor: colors.line, opacity: pressed ? 0.7 : 1 },
                        ]}
                      >
                        <View
                          style={[
                            styles.box,
                            selected
                              ? { backgroundColor: colors.accent, borderColor: colors.accent }
                              : { borderColor: colors.muted },
                          ]}
                        >
                          {selected && <CheckIcon color={colors.onAccent} size={14} />}
                        </View>
                        <AppText size={14} style={{ flex: 1 }}>
                          {track.title}
                        </AppText>
                        <AppText font="mono" size={11} tone="muted">
                          {String(track.count)}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </Group>
            </ScrollView>

            <Button title={t.glossary.showResults(resultCount)} onPress={onClose} />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  panel: { borderTopLeftRadius: radius.xl + 2, borderTopRightRadius: radius.xl + 2, maxHeight: '85%' },
  inner: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.md, flexShrink: 1 },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  clear: { minHeight: 44, justifyContent: 'center' },
  groups: { gap: spacing.lg, paddingBottom: spacing.sm },
  groupTitle: { textTransform: 'uppercase', letterSpacing: 0.8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: { minHeight: 40, paddingHorizontal: spacing.md, borderRadius: 999, borderWidth: 1, justifyContent: 'center' },
  tracks: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  box: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
