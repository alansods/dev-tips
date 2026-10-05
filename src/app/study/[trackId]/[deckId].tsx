import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { useCatalogTrack } from '../../../content/useCatalog';
import { sessionCardIds } from '../../../study/rules';
import { useStudyStore } from '../../../study/store';
import { StudySession, leaveToTrack } from '../../../study/StudySession';
import { useT } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeProvider';
import { spacing } from '../../../theme/tokens';

export default function StudyScreen() {
  const { trackId, deckId } = useLocalSearchParams<{ trackId: string; deckId: string }>();
  const { colors } = useTheme();
  const t = useT();
  const track = useCatalogTrack(String(trackId));
  const deck = track?.decks.find((d) => d.id === deckId);

  if (!track || !deck) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg, gap: spacing.md }}>
        <AppText>{t.common.deckNotFound}</AppText>
        <View style={{ flexDirection: 'row' }}>
          <Button title={t.common.back} variant="secondary" onPress={() => leaveToTrack(String(trackId))} />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <StudySession
      track={track}
      title={deck.title}
      initialIds={() => sessionCardIds(track.id, deck, useStudyStore.getState().progress)}
    />
  );
}
