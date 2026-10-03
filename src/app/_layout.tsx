import { IBMPlexSans_400Regular } from '@expo-google-fonts/ibm-plex-sans/400Regular';
import { IBMPlexSans_500Medium } from '@expo-google-fonts/ibm-plex-sans/500Medium';
import { IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans/600SemiBold';
import { IBMPlexSans_700Bold } from '@expo-google-fonts/ibm-plex-sans/700Bold';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono/400Regular';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';
import { useFonts } from 'expo-font';
import { router, Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { ErrorScreen } from '../components/ErrorScreen';
import { useReminderSync } from '../reminders/useReminderSync';
import { FirstSyncToast } from '../sync/FirstSyncToast';
import { useSync } from '../sync/useSync';
import { useReminderTapNavigation } from '../reminders/useReminderTap';
import { FontsReadyContext } from '../theme/fonts';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Qualquer tela que falhar ao ser exibida cai aqui (o expo-router embrulha a
 * rota num Error Boundary). Fica fora do ThemeProvider do layout, por isso
 * traz o seu. O erro vai só para o console, nunca para a tela.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <ThemeProvider>
      <ErrorScreen
        onRetry={() => void retry()}
        onHome={() => {
          router.replace('/');
          void retry();
        }}
      />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  // Mantém a splash até as fontes carregarem ou falharem.
  if (!loaded && !error) return null;

  return (
    <FontsReadyContext.Provider value={loaded && !error}>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </FontsReadyContext.Provider>
  );
}

function RootStack() {
  const { scheme, colors } = useTheme();
  useReminderSync();
  useReminderTapNavigation();
  useSync();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <FirstSyncToast />
    </>
  );
}
