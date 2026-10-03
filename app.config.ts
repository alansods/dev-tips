// Completa o app.json com valores que vêm do .env (ver .env.example).
// Hoje: o esquema de URL do iOS exigido pelo plugin do Google Sign-In.

import type { ConfigContext, ExpoConfig } from 'expo/config';

const GOOGLE_PLUGIN = '@react-native-google-signin/google-signin';

export default ({ config }: ConfigContext): ExpoConfig => {
  const iosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;
  const plugins = (config.plugins ?? []).map((plugin) =>
    plugin === GOOGLE_PLUGIN && iosUrlScheme ? [GOOGLE_PLUGIN, { iosUrlScheme }] : plugin,
  );
  return { ...config, plugins } as ExpoConfig;
};
