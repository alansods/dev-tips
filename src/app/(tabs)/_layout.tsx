import { router, Tabs } from 'expo-router';
import { View } from 'react-native';

import { IconButton } from '../../components/IconButton';
import { GlossaryIcon, ProgressIcon, SettingsIcon, ThemesIcon } from '../../components/icons';
import { useT } from '../../i18n';
import { useFontsReady } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { fontFamilies, spacing } from '../../theme/tokens';

export default function TabsLayout() {
  const { colors } = useTheme();
  const t = useT();
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
          <View style={{ marginRight: spacing.lg, flexDirection: 'row', gap: spacing.sm }}>
            <ThemeToggle />
            <IconButton label={t.settings.title} onPress={() => router.push('/settings')}>
              <SettingsIcon color={colors.ink} />
            </IconButton>
          </View>
        ),
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.accentText,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: family('semibold'), fontSize: 11.5 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabs.themes, tabBarIcon: ({ color }) => <ThemesIcon color={color} /> }} />
      <Tabs.Screen
        name="glossary"
        options={{ title: t.tabs.glossary, tabBarIcon: ({ color }) => <GlossaryIcon color={color} /> }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: t.tabs.progress, tabBarIcon: ({ color }) => <ProgressIcon color={color} /> }}
      />
    </Tabs>
  );
}
