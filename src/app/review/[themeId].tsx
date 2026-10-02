import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '../../components/AppText';
import { Button } from '../../components/Button';
import { getTheme } from '../../content/catalog';
import { today } from '../../study/clock';
import { dueCardIds } from '../../study/srs';
import { useStudyStore } from '../../study/store';
import { StudySession, leaveToTheme } from '../../study/StudySession';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/tokens';

export const REVIEW_TITLE = 'Revisão de hoje';

export default function ReviewScreen() {
  const { themeId } = useLocalSearchParams<{ themeId: string }>();
  const { colors } = useTheme();
  const theme = getTheme(String(themeId));

  if (!theme) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg, gap: spacing.md }}>
        <AppText>Tema não encontrado.</AppText>
        <View style={{ flexDirection: 'row' }}>
          <Button title="Voltar" variant="secondary" onPress={() => leaveToTheme(String(themeId))} />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <StudySession
      theme={theme}
      title={REVIEW_TITLE}
      initialIds={() => dueCardIds(theme, useStudyStore.getState().schedule, today())}
    />
  );
}
