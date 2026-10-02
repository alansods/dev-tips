import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { GlossaryIcon, ProgressIcon, ThemesIcon } from '../../components/icons';
import { useFontsReady } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { fontFamilies, spacing } from '../../theme/tokens';

export default function TabsLayout() {
  const { colors } = useTheme();
  const fontsReady = useFontsReady();
  const family = (role: keyof typeof fontFamilies) => (fontsReady ? fontFamilies[role] : undefined);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTintColor: colors.ink,
        headerTitleAlign: 'left',
        headerTitleStyle: { fontFamily: family('bold'), fontSize: 20, color: colors.ink },
        headerRight: () => (
          <View style={{ marginRight: spacing.lg }}>
            <ThemeToggle />
          </View>
        ),
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.accentText,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: family('semibold'), fontSize: 11.5 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Temas', tabBarIcon: ({ color }) => <ThemesIcon color={color} /> }} />
      <Tabs.Screen
        name="glossary"
        options={{ title: 'Glossário', tabBarIcon: ({ color }) => <GlossaryIcon color={color} /> }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progresso', tabBarIcon: ({ color }) => <ProgressIcon color={color} /> }}
      />
    </Tabs>
  );
}
