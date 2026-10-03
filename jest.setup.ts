// Mocks globais dos testes. Cada teste pode sobrescrever (ex.: simular falha de fonte).

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Fontes: carregamento imediato e bem-sucedido por padrão.
jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  useFonts: jest.fn(() => [true, null]),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve(true)),
  hideAsync: jest.fn(() => Promise.resolve(true)),
}));

// Idioma do aparelho nos testes: PT-BR, para os textos baterem com as specs.
// Um teste pode simular outro aparelho sobrescrevendo `getLocales`.
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageTag: 'pt-BR', languageCode: 'pt', textDirection: 'ltr' }]),
}));

// Cada teste começa sem idioma escolhido (segue o aparelho).
beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./src/i18n/store').useSettingsStore.setState({ language: null });
});

// Notificações: módulo nativo simulado. Os testes de lembrete inspecionam estes mocks.
jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: { DATE: 'date' },
  AndroidImportance: { DEFAULT: 3 },
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve(null)),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ granted: false, status: 'undetermined', canAskAgain: true })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: false, status: 'denied', canAskAgain: false })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('id')),
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
  useLastNotificationResponse: jest.fn(() => undefined),
}));

// expo-constants: nos testes, a configuração do app vem do app.json real
// (no app, o Expo injeta isso em tempo de execução).
jest.mock('expo-constants', () => {
  const actual = jest.requireActual('expo-constants');
  const expoConfig = jest.requireActual('./app.json').expo;
  const constants = { ...actual.default, expoConfig };
  return { __esModule: true, ...actual, default: constants };
});
