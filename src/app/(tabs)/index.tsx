import { StyleSheet, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Screen } from '../../components/Screen';
import { catalog } from '../../content/catalog';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing } from '../../theme/tokens';

// Home mínima: só os títulos. O card completo (progresso, "Em breve") vem com a change theme-catalog.
export default function HomeScreen() {
  const { colors } = useTheme();
  return (
    <Screen>
      {catalog.map((theme) => (
        <View key={theme.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <AppText font="semibold" size={16}>
            {theme.title}
          </AppText>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1 },
});
