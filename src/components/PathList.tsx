// "Ordem sugerida" da tela da área: linha do tempo com as trilhas na ordem dos
// pré-requisitos, cada uma com ícone, estado e revisões de hoje.
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { repoTaxonomy, type Track } from '../content';
import { trackIcon } from '../content/icons';
import { useT } from '../i18n';
import { today } from '../study/clock';
import { trackStats, trackStatus, type TrackStatus } from '../study/rules';
import { dueCardIds } from '../study/srs';
import { useStudyStore } from '../study/store';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';
import { AppText } from './AppText';
import { CheckIcon } from './icons';
import { TechIcon } from './TechIcon';

const DOT = 20;

function Marker({ status }: { status: TrackStatus }) {
  const { colors } = useTheme();
  if (status === 'done') {
    return (
      <View style={[styles.dot, { backgroundColor: colors.accent }]}>
        <CheckIcon color={colors.onAccent} size={12} />
      </View>
    );
  }
  return (
    <View
      style={[
        styles.dot,
        status === 'started'
          ? { backgroundColor: colors.accentSoft, borderWidth: 2, borderColor: colors.accent }
          : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
      ]}
    />
  );
}

export function PathList({ tracks }: { tracks: readonly Track[] }) {
  const { colors } = useTheme();
  const t = useT();
  const progress = useStudyStore((s) => s.progress);
  const schedule = useStudyStore((s) => s.schedule);
  const day = today();
  return (
    <View>
      {tracks.map((track, i) => {
        const status = trackStatus(trackStats(track, progress));
        const due = dueCardIds(track, schedule, day).length;
        const label = t.nav.trackStatus[status];
        const last = i === tracks.length - 1;
        return (
          <Pressable
            key={track.id}
            testID={`path-row-${track.id}`}
            accessibilityRole="button"
            accessibilityLabel={t.nav.pathRowLabel(i + 1, track.title, label)}
            onPress={() => router.push(`/track/${track.id}`)}
            style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.rail}>
              <Marker status={status} />
              {last ? null : (
                <View style={[styles.line, { backgroundColor: status === 'done' ? colors.accent : colors.line }]} />
              )}
            </View>
            <View style={styles.body}>
              <TechIcon icon={trackIcon(track, repoTaxonomy)} size={32} />
              <View style={{ flex: 1, gap: 2 }}>
                <AppText font="semibold" size={15}>
                  {track.title}
                </AppText>
                <AppText size={12} tone="muted">
                  {label}
                </AppText>
                {due > 0 ? (
                  <AppText font="medium" size={12} tone="warn">
                    {t.nav.pathDue(due)}
                  </AppText>
                ) : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, minHeight: 56 },
  rail: { width: DOT, alignItems: 'center', paddingTop: 6 },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, width: 2, marginTop: 2 },
  body: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingBottom: spacing.md },
});
