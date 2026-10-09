import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../../components/AppText';
import { Button } from '../../components/Button';
import { isSimulation } from '../../content';
import { useCatalogTrack } from '../../content/useCatalog';
import { today } from '../../study/clock';
import { dueCardIds } from '../../study/srs';
import { useStudyStore } from '../../study/store';
import { StudySession, leaveToTrack } from '../../study/StudySession';
import { useT } from '../../i18n';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/tokens';

export default function ReviewScreen() {
  const { trackId } = useLocalSearchParams<{ trackId: string }>();
  const { colors } = useTheme();
  const t = useT();
  const track = useCatalogTrack(String(trackId));

  if (!track) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg, gap: spacing.md }}>
        <AppText>{t.common.trackNotFound}</AppText>
        <View style={{ flexDirection: 'row' }}>
          <Button title={t.common.back} variant="secondary" onPress={() => leaveToTrack(String(trackId))} />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <StudySession
      tracks={[track]}
      title={t.session.reviewTitle}
      entries={() =>
        dueCardIds(track, useStudyStore.getState().schedule, today()).map((cardId) => ({ trackId: track.id, cardId }))
      }
      onExit={() => leaveToTrack(track.id)}
      backLabel={isSimulation(track) ? t.summary.backToSimulation : undefined}
    />
  );
}
