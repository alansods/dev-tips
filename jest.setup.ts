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
