import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../../../components/AppText';
import { Button } from '../../../components/Button';
import { useCatalogTheme } from '../../../content/useCatalog';
import { sessionCardIds } from '../../../study/rules';
import { useStudyStore } from '../../../study/store';
import { StudySession, leaveToTheme } from '../../../study/StudySession';
import { useT } from '../../../i18n';
import { useTheme } from '../../../theme/ThemeProvider';
import { spacing } from '../../../theme/tokens';

export default function StudyScreen() {
  const { themeId, deckId } = useLocalSearchParams<{ themeId: string; deckId: string }>();
  const { colors } = useTheme();
  const t = useT();
  const theme = useCatalogTheme(String(themeId));
  const deck = theme?.decks.find((d) => d.id === deckId);

  if (!theme || !deck) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg, gap: spacing.md }}>
        <AppText>{t.common.deckNotFound}</AppText>
        <View style={{ flexDirection: 'row' }}>
          <Button title={t.common.back} variant="secondary" onPress={() => leaveToTheme(String(themeId))} />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <StudySession
      theme={theme}
      title={deck.title}
      initialIds={() => sessionCardIds(theme.id, deck, useStudyStore.getState().progress)}
    />
  );
}
