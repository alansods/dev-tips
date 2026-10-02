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
import { useT } from '../../i18n';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/tokens';

export default function ReviewScreen() {
  const { themeId } = useLocalSearchParams<{ themeId: string }>();
  const { colors } = useTheme();
  const t = useT();
  const theme = getTheme(String(themeId));

  if (!theme) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg, gap: spacing.md }}>
        <AppText>{t.common.themeNotFound}</AppText>
        <View style={{ flexDirection: 'row' }}>
          <Button title={t.common.back} variant="secondary" onPress={() => leaveToTheme(String(themeId))} />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <StudySession
      theme={theme}
      title={t.session.reviewTitle}
      initialIds={() => dueCardIds(theme, useStudyStore.getState().schedule, today())}
    />
  );
}
